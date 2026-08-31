import { create } from 'zustand';
import { ICurrentUser } from '@meago/core';

export type { ICurrentUser } from '@meago/core';

interface IAuthState {
  /**
   * Access token CHỈ giữ trong memory (không persist/localStorage — chống XSS).
   * Refresh token nằm trong httpOnly cookie, JS không đọc được;
   * F5 → AuthBootstrap gọi /auth/refresh lấy access token mới.
   */
  accessToken: string | null;
  user: ICurrentUser | null;
  /** đã chạy xong bootstrap refresh lần đầu chưa (guard chờ cờ này) */
  isReady: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: ICurrentUser | null) => void;
  setReady: () => void;
  clear: () => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
  accessToken: null,
  user: null,
  isReady: false,
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  setReady: () => set({ isReady: true }),
  clear: () => set({ accessToken: null, user: null }),
}));
