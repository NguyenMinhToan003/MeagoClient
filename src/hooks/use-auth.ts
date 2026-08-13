'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, ILoginPayload } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { REACT_QUERY_KEY } from '@/constants/react-query-key';

export function useLogin() {
  const { setAccessToken } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ILoginPayload) => authService.login(payload),
    onSuccess: async ({ accessToken }) => {
      setAccessToken(accessToken);
      await queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEY.AUTH.ME] });
    },
  });
}

export function useLogout() {
  const { clear } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clear();
      queryClient.clear(); // xóa toàn bộ cache — không lộ data user cũ
    },
  });
}

/** Load user hiện tại (kèm permissions) vào store. */
export function useMe() {
  const { accessToken, setUser } = useAuthStore();
  return useQuery({
    queryKey: [REACT_QUERY_KEY.AUTH.ME],
    queryFn: async () => {
      const user = await authService.me();
      setUser(user);
      return user;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}
