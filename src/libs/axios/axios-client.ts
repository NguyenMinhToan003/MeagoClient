import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth.store";
import {
  API_VERSION,
  API_CONTROLLERS,
  API_ACTIONS,
  IBaseResponse,
} from "@meago/core";

/**
 * Axios instance duy nhất của app.
 * - baseURL same-origin /api/v1 (Next rewrite proxy về MeagoServer)
 *   → cookie httpOnly refresh tự đi kèm, không cần CORS.
 * - Request: gắn Bearer access token từ zustand (memory).
 * - Response 401: tự gọi /auth/refresh MỘT lần (single-flight queue —
 *   nhiều request 401 cùng lúc chỉ refresh 1 lần), rồi retry request gốc.
 *   Refresh fail → clear auth, phát event để app điều hướng login.
 */
export const axiosClient = axios.create({
  baseURL: API_VERSION,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** app lắng nghe event này để redirect về /login */
export const AUTH_EXPIRED_EVENT = "meago:auth-expired";

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;
let refreshChannel: BroadcastChannel | null = null;
let latestRefresh: { accessToken: string; completedAt: number } | null = null;

type RefreshChannelMessage =
  | { type: "refresh-succeeded"; accessToken: string; completedAt: number }
  | { type: "auth-cleared" };

function getRefreshChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window))
    return null;
  if (refreshChannel) return refreshChannel;
  refreshChannel = new BroadcastChannel("meago:auth");
  refreshChannel.addEventListener(
    "message",
    (event: MessageEvent<RefreshChannelMessage>) => {
      const message = event.data;
      if (message?.type === "auth-cleared") {
        latestRefresh = null;
        useAuthStore.getState().clear();
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
        return;
      }
      if (
        message?.type !== "refresh-succeeded" ||
        typeof message.accessToken !== "string" ||
        typeof message.completedAt !== "number"
      ) {
        return;
      }
      latestRefresh = message;
      useAuthStore.getState().setAccessToken(message.accessToken);
    },
  );
  return refreshChannel;
}

export function broadcastAuthCleared(): void {
  latestRefresh = null;
  getRefreshChannel()?.postMessage({ type: "auth-cleared" } satisfies RefreshChannelMessage);
}

/** Gọi refresh bằng axios "trần" — không interceptor, tránh đệ quy 401. */
async function performRefresh(): Promise<string> {
  const res = await axios.post<IBaseResponse<{ accessToken: string }>>(
    `${API_VERSION}/${API_CONTROLLERS.AUTH}/${API_ACTIONS.REFRESH}`,
    {},
    { withCredentials: true },
  );
  const accessToken = res.data.data.accessToken;
  useAuthStore.getState().setAccessToken(accessToken);
  const message: RefreshChannelMessage = {
    type: "refresh-succeeded",
    accessToken,
    completedAt: Date.now(),
  };
  latestRefresh = message;
  getRefreshChannel()?.postMessage(message);
  return accessToken;
}

async function coordinateRefresh(): Promise<string> {
  getRefreshChannel();
  if (typeof navigator === "undefined" || !navigator.locks)
    return performRefresh();

  const requestedAt = Date.now();
  return navigator.locks.request(
    AUTH_EXPIRED_EVENT + ":refresh-lock",
    async () => {
      // A tab ahead of us may have completed refresh while this tab was queued.
      if (latestRefresh && latestRefresh.completedAt >= requestedAt) {
        return latestRefresh.accessToken;
      }
      return performRefresh();
    },
  );
}

/** Single-flight in this tab; Web Lock + BroadcastChannel share one rotation across tabs. */
export function renewAccessToken(): Promise<string> {
  refreshPromise ??= coordinateRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };
    const isNonRefreshableAuthUrl = [
      API_ACTIONS.LOGIN,
      API_ACTIONS.REFRESH,
    ].some((action) =>
      original?.url?.includes(`${API_CONTROLLERS.AUTH}/${action}`),
    );

    // chỉ auto-refresh cho 401 của request thường, không retry lặp,
    // và không đụng vào login/refresh (login sai mật khẩu cũng 401)
    if (
      error.response?.status !== 401 ||
      original?._retried ||
      isNonRefreshableAuthUrl
    ) {
      return Promise.reject(error);
    }

    original._retried = true;
    try {
      const newToken = await renewAccessToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(original);
    } catch (refreshError) {
      useAuthStore.getState().clear();
      broadcastAuthCleared();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
      }
      return Promise.reject(refreshError);
    }
  },
);

/** unwrap envelope {statusCode, message, data} → data */
export async function apiGet<T>(url: string, params?: object): Promise<T> {
  const res = await axiosClient.get<IBaseResponse<T>>(url, { params });
  return res.data.data;
}

export async function apiPost<T>(url: string, body?: object): Promise<T> {
  const res = await axiosClient.post<IBaseResponse<T>>(url, body);
  return res.data.data;
}

export async function apiPatch<T>(url: string, body?: object): Promise<T> {
  const res = await axiosClient.patch<IBaseResponse<T>>(url, body);
  return res.data.data;
}

export async function apiDelete<T>(url: string, body?: object): Promise<T> {
  const res = await axiosClient.delete<IBaseResponse<T>>(url, { data: body });
  return res.data.data;
}
