import { apiGet, apiPost } from '@/libs/axios/axios-client';
import { API_CONTROLLERS, API_ACTIONS } from '@/constants/apis.constant';
import { ICurrentUser } from '@/stores/auth.store';

const BASE = API_CONTROLLERS.AUTH;

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload extends ILoginPayload {
  displayName: string;
}

export const authService = {
  login: (payload: ILoginPayload) =>
    apiPost<{ accessToken: string }>(`${BASE}/${API_ACTIONS.LOGIN}`, payload),

  register: (payload: IRegisterPayload) =>
    apiPost<{ id: string; email: string; displayName: string }>(
      `${BASE}/${API_ACTIONS.REGISTER}`,
      payload,
    ),

  refresh: () => apiPost<{ accessToken: string }>(`${BASE}/${API_ACTIONS.REFRESH}`),

  logout: () => apiPost<{ success: boolean }>(`${BASE}/${API_ACTIONS.LOGOUT}`),

  logoutAll: () => apiPost<{ success: boolean }>(`${BASE}/${API_ACTIONS.LOGOUT_ALL}`),

  me: () => apiGet<ICurrentUser>(`${BASE}/${API_ACTIONS.ME}`),
};
