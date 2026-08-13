// URL compose từ constant, không inline string (convention từ dự án mẫu)
export const API_VERSION = '/api/v1';

export const API_CONTROLLERS = {
  AUTH: 'auth',
  USERS: 'users',
  ROLES: 'roles',
  STORIES: 'stories',
} as const;

export const API_ACTIONS = {
  FIND_MULTI: '',
  LOGIN: 'login',
  REGISTER: 'register',
  REFRESH: 'refresh',
  LOGOUT: 'logout',
  LOGOUT_ALL: 'logout-all',
  ME: 'me',
} as const;
