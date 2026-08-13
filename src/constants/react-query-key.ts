/**
 * Registry tập trung mọi entity-name của React Query — tránh trùng key giữa
 * các domain (convention từ dự án mẫu).
 */
export const REACT_QUERY_KEY = {
  AUTH: {
    ME: 'auth-me',
  },
  USERS: 'users',
  ROLES: 'roles',
  STORIES: 'stories',
} as const;
