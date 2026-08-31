# MeagoClient — hướng dẫn bắt buộc cho AI

Đọc `C:\Meago\AGENTS.md` trước, sau đó đọc file này trước khi phân tích hoặc thay đổi frontend. Quy tắc tại đây áp dụng cho toàn bộ `MeagoClient` và cụ thể hơn quy tắc workspace.

## Điểm vào và nguồn sự thật

1. `docs/README.md` — định tuyến tài liệu canonical.
2. `docs/reference/technology-stack.md` — thư viện, trách nhiệm và trạng thái áp dụng.
3. `docs/architecture/frontend.md` — layer, dependency direction và request flow.
4. `docs/standards/frontend-capabilities.md` — chuẩn capability dùng chung.
5. Standard chuyên biệt cho DnD/infinite data khi thay các capability này.
6. `docs/standards/coding-rules.md` — invariant coding, lỗi bị cấm và checklist review frontend.

Code, test và `package.json`/lockfile là nguồn sự thật. `Planned`, `Deferred` hoặc `Research` trong docs không có nghĩa package đã được cài hay capability đã được triển khai.

## Bản đồ source

| Thay đổi | Vị trí chính |
|---|---|
| Route/layout/locale page | `src/app/[locale]` |
| UI primitive shadcn | `src/components/ui` |
| Composition dùng chung | `src/components/shared` |
| UI/domain logic | `src/features/<domain>` |
| Query/infinite/auth hook | `src/hooks` |
| HTTP/refresh coordinator | `src/libs/axios` |
| Domain API | `src/services` |
| Client-only state | `src/stores` |
| DnD foundation | `src/lib/dnd` |
| Product tour | `src/lib/onboarding` |
| Locale/message | `src/i18n`, `messages/*.json` |
| Providers | `src/providers` |
| Docker runtime | `Dockerfile`, `next.config.mjs` |

Dependency direction: `page/component -> hook -> service -> HTTP client -> @meago/core/API`. Component không gọi Axios trực tiếp; service không import UI.

## Quy tắc frontend

Mọi code mới hoặc boundary đang sửa phải tuân thủ `docs/standards/coding-rules.md`; rule capability chuyên sâu vẫn áp dụng cho DnD, infinite data và form/table/i18n.

- Server state thuộc TanStack Query; không copy sang Zustand. Zustand chỉ giữ client state nhỏ và ổn định.
- Không persist access/refresh token vào localStorage. Refresh cookie là HttpOnly và transport xử lý refresh coordination.
- API contract dùng từ `@meago/core`; không mirror interface dùng chung trong client.
- Form dùng React Hook Form; Zod chỉ đặt ở boundary cần client validation. Không duplicate server business rules không cần thiết.
- UI primitive nằm ở `components/ui`; feature composition không được biến thành primitive giả dùng chung.
- DnD dùng foundation/preset hiện có, phải giữ keyboard accessibility, collision strategy và rollback.
- Infinite query dùng cursor contract; Intersection Observer chỉ trigger tải, Virtual chỉ tối ưu rendering sau khi đo.
- Mọi text người dùng nhìn thấy phải đi qua `next-intl`, đồng bộ catalog locale.
- Chỉ cài media/upload library khi có use case thật và cập nhật trạng thái docs từ Deferred sang Adopted.
- Không tạo wrapper chỉ để đổi tên API thư viện; abstraction phải cố định policy hoặc loại duplication.
- Không chạy `npm audit fix` tự động và không nâng dependency ngoài phạm vi khi chưa đánh giá behavior.

## Docs phải cập nhật cùng code

| Khi thay đổi | Tài liệu canonical |
|---|---|
| Layer/folder/request flow | `docs/architecture/frontend.md`, sơ đồ frontend nếu topology đổi |
| Thư viện/trạng thái adoption | `docs/reference/technology-stack.md` |
| Form/table/i18n/command/tour/virtual | `docs/standards/frontend-capabilities.md` |
| DnD | `docs/standards/drag-and-drop.md` |
| Cursor/infinite loading | `docs/standards/infinite-data.md` |
| Docker standalone | MeagoServer `docs/operations/docker.md` và docs FE nếu runtime đổi |
| Shared contract/auth flow | MeagoServer auth/core docs và MeagoLibrary nếu public API đổi |
| Coding convention hoặc invariant xuyên layer | `docs/standards/coding-rules.md` |

Không tạo docs trạng thái theo phase; cập nhật trực tiếp tài liệu canonical.

## Gate trước khi kết thúc

```bash
npm run lint
npm run ts-check
npm run build
git diff --check
```

Nếu thay Dockerfile, chỉ báo image đã kiểm chứng khi daemon thực sự chạy và `docker build` thành công. Luôn giữ nguyên thay đổi không liên quan và không tự commit.
