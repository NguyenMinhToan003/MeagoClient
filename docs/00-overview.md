# Meago Client — Nền móng (Foundation)

Meago: nền tảng đăng tải, chia sẻ **audio / truyện**. Repo này là Next.js 14 frontend.

## Stack

Next.js 16 App Router · TypeScript 7 · React 19 · React Query 5.101 · Zustand 5 · axios 1.19 · TailwindCSS 4

## Cấu trúc

```
src/
  app/                 # App Router (layout gắn AppProvider)
  components/
    guards/            #   AuthGuard (route cần login), PermissionGuard (ẩn/hiện theo quyền)
  constants/           # apis.constant (URL compose từ constant), react-query-key (registry chống trùng key)
  hooks/               # create-entity-hooks (factory RQ), use-auth, use-permission
  interfaces/common/   # mirror envelope response của MeagoServer
  libs/axios/          # axios instance + auto-refresh interceptor
  providers/           # AppProvider: QueryClient + AuthBootstrap + AuthExpiredListener
  services/            # auth.service, create-crud-apis (factory API CRUD)
  stores/              # auth.store (zustand)
```

## Quy ước cốt lõi

1. **URL compose từ constant** (constants/apis.constant.ts), không inline string.
2. **Query key via registry** (constants/react-query-key.ts) chống trùng key.
3. **Mỗi resource**: `createCrudApis<IStory>('stories')` → `createEntityHooks(KEY, apis)` → component gọi `useList/useDetail/useCreate/useUpdate/useRemoveMulti`. Component KHÔNG gọi axios trực tiếp.
4. **RQ defaults**: staleTime 30s, retry 1, refetchOnWindowFocus false; list dùng `keepPreviousData` chống flicker pagination.
5. **Phân quyền UI**: `usePermission().can('story:create')` hoặc `<PermissionGuard required={['story:create']}>` — permission string đồng bộ `@RequirePermissions` phía server, lấy từ `/auth/me`.

## Token Architecture (Security)

**So với FE tiêu chuẩn**: token 15 ngày trong cookie `httpOnly: false` (XSS đọc được), không refresh — 401 là logout. Meago thay bằng:

1. **Access token chỉ ở memory** (zustand, không persist/localStorage) — XSS khó lấy.
2. **Refresh token trong httpOnly cookie** do server set (path `/api/v1/auth`) — JS không đọc được. Gọi API qua **Next rewrite same-origin `/api/*`** nên cookie tự đi kèm, không cần CORS.
3. **Auto-refresh single-flight**: request 401 → interceptor gọi `/auth/refresh` đúng 1 lần (nhiều request 401 đồng thời chờ chung 1 promise) → retry request gốc. Không refresh cho URL `auth/*` (login sai mật khẩu cũng 401) và không retry lặp.
4. **Bootstrap trên F5/tab mới**: `AuthBootstrap` gọi refresh bằng cookie → khôi phục access token, `isReady` bật để guard chạy.
5. **Refresh fail (hết hạn/revoke)**: clear store + event `meago:auth-expired` → điều hướng `/login`.

## Ví dụ thêm 1 domain mới

```ts
// services/story.service.ts
export const storyApis = createCrudApis<IStory>('stories');
// hooks/use-story.ts
export const storyHooks = createEntityHooks(REACT_QUERY_KEY.STORIES, storyApis);
// component
const { data } = storyHooks.useList({ page: 1, search });
```

## Chạy

```bash
cp .env.development.example .env.development   # sửa MeagoServer URL
npm install
npm run dev    # http://localhost:3000, proxy /api/* → MeagoServer :9000
```
