"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, ILoginPayload, IRegisterPayload } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { REACT_QUERY_KEY } from "@/constants/react-query-key";
import { broadcastAuthCleared } from "@/libs/axios/axios-client";

export function useLogin() {
  const { setAccessToken } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ILoginPayload) => authService.login(payload),
    onSuccess: async ({ accessToken }) => {
      setAccessToken(accessToken);
      await queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEY.AUTH.ME],
      });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: IRegisterPayload) => authService.register(payload),
  });
}

export function useLogout() {
  const { clear } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clear();
      broadcastAuthCleared();
      queryClient.clear(); // xóa toàn bộ cache — không lộ data user cũ
    },
  });
}

/** Current user and permissions live only in the React Query cache. */
export function useMe() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: [REACT_QUERY_KEY.AUTH.ME],
    queryFn: authService.me,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}
