# Chuẩn capability frontend

Trạng thái: **Accepted**. Dependency chỉ được giữ khi có vai trò rõ ràng. Không bọc thư viện chỉ để đổi tên API; abstraction chung phải loại bỏ duplication hoặc cố định policy của Meago.

## Form

- Dùng React Hook Form cho state tương tác và Zod qua `zodResolver` cho client validation.
- Schema/component đặt trong `src/features/<domain>`; server error được map bằng `setError`.
- Không đưa form state vào Zustand và không xem schema FE là API contract.
- Mẫu đang chạy: `FoundationEmailForm` + shadcn Form.

## Data table và virtualization

- `DataTable<T>` là renderer semantic dùng TanStack Table v9 + shadcn table; feature sở hữu column và data fetching.
- Dữ liệu lớn dùng server sorting/filtering/pagination và đồng bộ React Query key.
- Row ID lấy từ domain ID, không lấy array index.
- `VirtualList<T>` chỉ giảm DOM của dữ liệu đã load, không thay pagination.
- Chỉ bật virtualization sau khi production profiling chứng minh DOM là bottleneck.

## Command Palette

- `GlobalCommandPalette` mount một lần tại locale layout và chỉ render command.
- Command toàn cục đăng ký trong `useGlobalCommands`, có ID ổn định và message i18n.
- `Ctrl+K`/`⌘K` mở palette; action đóng palette trước khi thực thi.

## i18n

- Locale hỗ trợ: `vi`, `en`; locale luôn nằm trong URL.
- Chuỗi UI đặt trong `messages/<locale>.json` theo namespace feature.
- Navigation cần giữ locale phải dùng `src/i18n/navigation`.
- Ngày, giờ và số dùng formatter của `next-intl`; không dịch enum, permission hoặc analytics key.

## DnD, infinite list và product tour

- DnD foundation đã triển khai bằng API mới `@dnd-kit/react`; quy chuẩn chi tiết tại [drag-and-drop.md](drag-and-drop.md).
- Cursor infinite-query foundation được công bố tại [infinite-data.md](infinite-data.md).
- `useLoadMoreSentinel` chịu trách nhiệm phát hiện viewport; fetch state vẫn thuộc TanStack Query.
- Tour được tạo qua `createProductTour`, selector dùng `data-tour`, không phụ thuộc Tailwind class/DOM nesting.
- Uppy/Tus chỉ được chọn sau khi Upload API và protocol resumable được chốt.

## Quality gate

```bash
npm run lint
npm run ts-check
npm run build
npm audit --audit-level=high
```

DnD, form nghiệp vụ và tương tác keyboard phải có automated test trước production.
