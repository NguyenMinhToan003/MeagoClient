# Shared components

## Application shell

- `app-shell.tsx` compose sidebar và vùng nội dung cho mọi locale route.
- `app-topbar.tsx` chứa search/command trigger, mobile menu và action toàn cục.
- `app-sidebar.tsx` xử lý collapse desktop, mobile dialog và accessibility.
- `app-navigation.config.ts` là nguồn khai báo menu và permission yêu cầu. Việc ẩn menu chỉ phục vụ UX; backend vẫn phải authorization mọi request.
- Trạng thái thu gọn là UI preference được lưu ở `meago.sidebar.collapsed` và đọc bằng `useSyncExternalStore` để an toàn hydration; không lưu token, user profile hoặc permission tại đây.
- Primitive shadcn `components/ui/kbd.tsx` đã sẵn sàng cho nơi có hotkey thật; không dựng keycap bằng class riêng trong feature hoặc composition.
- Logo UI dùng `MeagoLogo` dạng inline SVG để nhận `currentColor` theo theme; asset độc lập nằm tại `public/brand/meago-mark.svg`. Không dùng PNG preview Gen AI có nền caro giả.

Đặt các composition UI dùng lại ở nhiều feature tại đây, ví dụ `PageHeader`, `EmptyState`, `ConfirmDialog`.

- Có thể compose component từ `@/components/ui`.
- Không sửa primitive trong `ui` chỉ để phục vụ một màn hình.
- Không chứa API orchestration hoặc business rule của một domain cụ thể.
