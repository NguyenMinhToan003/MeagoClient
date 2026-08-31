# Quy tắc coding frontend

Trạng thái: **Accepted**. Đây là chuẩn bắt buộc cho code mới và phần code được sửa trong MeagoClient. Rule chuyên biệt trong `drag-and-drop.md`, `infinite-data.md` và `frontend-capabilities.md` được ưu tiên cho capability tương ứng.

## 1. Kiến trúc và dependency

Luồng phụ thuộc chuẩn:

```text
page / component -> hook -> service -> HTTP client -> @meago/core / API
```

- Route/layout chịu composition và routing; không chứa HTTP implementation hoặc business workflow dài.
- Component trình bày nhận typed props và phát event; không gọi Axios trực tiếp.
- Hook điều phối React lifecycle/query/mutation; service không import React, store hay UI.
- UI primitive shadcn nằm trong `components/ui`; composition tái sử dụng nằm trong `components/shared`; UI nghiệp vụ nằm trong `features/<domain>`.
- Shared contract lấy từ exact version của `@meago/core`; không mirror interface của API trong FE.
- Không tạo barrel export sâu gây circular dependency; chỉ public export tại boundary có chủ đích.
- Không tạo wrapper chỉ để đổi tên thư viện; abstraction phải cố định policy, giảm duplication hoặc tạo test seam.

Lỗi bị cấm:

- Component gọi Axios/fetch hoặc biết refresh token.
- Service import toast, component, router hoặc Zustand.
- Đưa mọi thứ vào `components/shared`, `hooks` hoặc `utils` không có ownership rõ.
- Copy API response sang nhiều store làm nhiều nguồn sự thật.
- Import nội bộ xuyên feature để né public boundary.

## 2. TypeScript và component contract

- Strict typing; tránh `any`, non-null assertion và double cast. Dữ liệu ngoài boundary phải parse/validate hoặc narrow.
- Props nhỏ, rõ ownership; không truyền object “config” khổng lồ hoặc nhiều boolean làm component có quá nhiều mode.
- Boolean đặt tên `is/has/can/should`; callback đặt tên theo event hoặc action.
- Domain ID dùng làm React key; không dùng array index cho list có reorder/insert/delete.
- Derived state được tính từ props/query/store; không đồng bộ bằng `useEffect` nếu không thật sự là external synchronization.
- Context phải có provider contract rõ và fail fast khi dùng sai; provider value object cần ổn định khi ảnh hưởng rerender.
- Không export domain constant/hook từ file UI primitive nếu làm mờ ownership.

Lỗi bị cấm:

- `useEffect` để sửa state sau render cho giá trị có thể tính trực tiếp.
- Hook gọi có điều kiện.
- Mutate props, query data hoặc state array/object tại chỗ.
- Component vừa fetch, normalize, authorize, mutate và render toàn bộ workflow.
- Dùng `useMemo`/`useCallback` đại trà khi chưa có identity/performance requirement thực tế.

## 3. Server state, client state và mutation

- TanStack Query là nguồn sự thật cho server state; query key phải ổn định, có namespace và chứa mọi input ảnh hưởng response.
- Zustand chỉ giữ client-only state nhỏ, ổn định; không lưu bản sao current user/list/detail từ Query.
- Local component state dùng cho interaction cục bộ; URL dùng cho state cần share/bookmark như filter/page/tab phù hợp.
- Mutation phải invalidate hoặc cập nhật đúng query cache; optimistic update phải snapshot, rollback an toàn và reconcile kết quả server.
- Optimistic concurrency update phải gửi `version`; conflict không được âm thầm ghi đè.
- Không retry mutation không idempotent một cách tự động nếu chưa có idempotency key/policy.
- Loading, empty, error và success là bốn trạng thái riêng; không dùng mảng rỗng để che loading/error.

Lỗi bị cấm:

- Query key thiếu filter/tenant/locale làm cache nhiễm chéo.
- Gọi cùng API bằng `useEffect` thủ công và TanStack Query song song.
- Invalidate toàn bộ cache khi có thể khoanh vùng chính xác.
- Rollback response cũ đè optimistic operation mới hơn.
- Dùng `staleTime: Infinity` cho dữ liệu có thể thay đổi mà không có invalidation contract.

## 4. Authentication và HTTP

- Access token chỉ giữ trong memory; refresh token dùng HttpOnly cookie, không dùng localStorage/sessionStorage.
- Mọi request qua HTTP client chung; component/service không tự cài interceptor.
- Cùng tab chỉ có một refresh Promise; nhiều tab phối hợp qua Web Locks/BroadcastChannel theo kiến trúc auth hiện tại.
- Logout/auth-expired phải xóa token và Query cache liên quan; redirect phải giữ locale.
- 401 do login/permission nghiệp vụ và 401 do access token hết hạn phải đi qua policy thống nhất, tránh refresh loop.
- Không log token, cookie, password, OTP hoặc raw sensitive payload.
- Client permission chỉ ẩn/disable UI; server vẫn là nơi quyết định authorization.

## 5. Form, validation và lỗi

- Form dùng React Hook Form; Zod dùng ở boundary cần client validation.
- Schema FE phục vụ UX và shape; không duplicate business rule server như nguồn sự thật độc lập.
- Server field error map bằng `setError`; lỗi tổng quát hiển thị ở vị trí có thể nhận biết và thử lại.
- Không trim/biến đổi password; normalize field chỉ khi contract quy định.
- Submit phải chống double-submit theo mutation state; button disabled không thay thế idempotency server.
- Không swallow Promise/error trong event handler; expected error và unexpected error phải có UX/logging khác nhau.

## 6. UI, accessibility, i18n và hiệu năng

- Dùng semantic HTML trước ARIA; interactive element phải dùng được bằng keyboard và có focus visible.
- Icon-only control phải có accessible name; dialog/menu phải quản lý focus bằng primitive chuẩn.
- Text người dùng nhìn thấy đi qua `next-intl`; navigation giữ locale dùng `src/i18n/navigation`.
- Ngày, số, tiền tệ dùng formatter locale; không format thủ công rải rác.
- Ảnh cần kích thước/alt phù hợp; chỉ lazy-load nội dung ngoài viewport khi không ảnh hưởng LCP.
- Virtualization chỉ bật sau profiling; infinite loading và virtualization là hai trách nhiệm khác nhau.
- Tránh render list lớn, effect listener lặp, object/context value bất ổn và dependency nặng không có use case.
- Responsive behavior phải được thiết kế, không chỉ “co lại”; trạng thái loading/error/empty cũng phải responsive.

## 7. DnD, table và list

- DnD tuân thủ [drag-and-drop.md](drag-and-drop.md): domain ID ổn định, keyboard sensor, handle phù hợp, commit có rollback.
- Data table dùng TanStack Table làm headless state; feature sở hữu columns, filter, sorting và fetching.
- Server pagination/sort/filter phải đồng bộ query key và API contract.
- Infinite query dùng cursor opaque theo [infinite-data.md](infinite-data.md); không reorder xuyên page chưa load.
- Không dùng array index làm row ID hoặc DnD ID.

## 8. Test và review

- Test hành vi người dùng và accessible role/name; không khóa test vào class Tailwind hoặc DOM nesting không quan trọng.
- Hook/service logic quan trọng có test success, error, cancellation/race và retry policy.
- Auth refresh, optimistic update và DnD phải test concurrency/rollback, không chỉ happy path.
- Mock HTTP tại network boundary; không mock toàn bộ component tree để test implementation detail.
- Bug fix phải có regression test nếu có thể tự động tái hiện.

Checklist trước bàn giao:

- [ ] Layer và ownership đúng; component không gọi HTTP trực tiếp.
- [ ] Không có server-state duplication hoặc token persistence không an toàn.
- [ ] Query key, mutation invalidation và optimistic rollback đúng.
- [ ] Loading/empty/error/success và accessibility đã được xử lý.
- [ ] Text/navigation/formatter tuân thủ i18n.
- [ ] Contract dùng từ `@meago/core`, không mirror interface.
- [ ] Test và docs capability/technology được cập nhật.
- [ ] Các gate repo đạt.

