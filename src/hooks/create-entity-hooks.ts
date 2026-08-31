"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { IBaseQuery } from "@meago/core";
import { ICrudApis } from "@/services/create-crud-apis";

/**
 * Factory sinh bộ hooks React Query chuẩn cho một entity
 * (bản rút gọn của CustomReactQuery.hook trong dự án mẫu — giữ query-key
 * convention, placeholderData chống flicker, invalidation; bỏ optimistic
 * update phức tạp, thêm sau khi cần).
 *
 * const storyHooks = createEntityHooks(REACT_QUERY_KEY.STORIES, storyApis);
 * storyHooks.useList({ page: 1 }); storyHooks.useCreate();
 */
export function createEntityHooks<
  T extends { version: number },
  TCreate = Partial<Omit<T, "id" | "version" | "createdAt" | "updatedAt">>,
  TUpdate = Partial<Omit<T, "id" | "version" | "createdAt" | "updatedAt">> &
    Pick<T, "version">,
>(
  entityName: string,
  apis: ICrudApis<T, TCreate, TUpdate>,
  options?: { crossInvalidateKeys?: string[] },
) {
  const queryKeys = {
    all: [entityName] as const,
    list: (queries?: IBaseQuery) => [entityName, "list", queries] as const,
    detail: (id: string) => [entityName, "detail", id] as const,
  };

  function useInvalidate() {
    const queryClient = useQueryClient();
    return async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.all }),
        ...(options?.crossInvalidateKeys ?? []).map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      ]);
    };
  }

  return {
    queryKeys,

    useList: (queries?: IBaseQuery, opts?: { enabled?: boolean }) =>
      useQuery({
        queryKey: queryKeys.list(queries),
        queryFn: () => apis.findMulti(queries),
        placeholderData: keepPreviousData, // pagination không flicker
        enabled: opts?.enabled,
      }),

    useDetail: (id: string | undefined) =>
      useQuery({
        queryKey: queryKeys.detail(id ?? ""),
        queryFn: () => apis.findOneById(id as string),
        enabled: !!id,
      }),

    useCreate: () => {
      const invalidate = useInvalidate();
      return useMutation({ mutationFn: apis.create, onSettled: invalidate });
    },

    useUpdate: () => {
      const invalidate = useInvalidate();
      return useMutation({ mutationFn: apis.update, onSettled: invalidate });
    },

    useRemoveMulti: () => {
      const invalidate = useInvalidate();
      return useMutation({
        mutationFn: apis.removeMulti,
        onSettled: invalidate,
      });
    },
  };
}
