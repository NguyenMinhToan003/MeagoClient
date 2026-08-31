import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "@/libs/axios/axios-client";
import { IBaseQuery, IPaginatedResult } from "@meago/core";

/**
 * Factory sinh bộ API CRUD chuẩn cho một resource, khớp BaseService phía server.
 * const storyApis = createCrudApis<IStory>('stories');
 */
export type VersionedUpdate<T extends { version: number }> = Partial<
  Omit<T, "id" | "version" | "createdAt" | "updatedAt">
> &
  Pick<T, "version">;

export function createCrudApis<
  T extends { version: number },
  TCreate = Partial<Omit<T, "id" | "version" | "createdAt" | "updatedAt">>,
  TUpdate = VersionedUpdate<T>,
>(resource: string) {
  return {
    findMulti: (queries?: IBaseQuery) =>
      apiGet<IPaginatedResult<T>>(resource, queries),
    findOneById: (id: string) => apiGet<T>(`${resource}/${id}`),
    create: (body: TCreate) => apiPost<T>(resource, body as object),
    update: ({ id, body }: { id: string; body: TUpdate }) =>
      apiPatch<T>(`${resource}/${id}`, body as object),
    removeMulti: (ids: string[]) => apiDelete<void>(resource, { ids }),
  };
}

export type ICrudApis<
  T extends { version: number },
  TCreate = Partial<Omit<T, "id" | "version" | "createdAt" | "updatedAt">>,
  TUpdate = VersionedUpdate<T>,
> = ReturnType<typeof createCrudApis<T, TCreate, TUpdate>>;
