# Shared components

Đặt các composition UI dùng lại ở nhiều feature tại đây, ví dụ `PageHeader`, `EmptyState`, `ConfirmDialog`.

- Có thể compose component từ `@/components/ui`.
- Không sửa primitive trong `ui` chỉ để phục vụ một màn hình.
- Không chứa API orchestration hoặc business rule của một domain cụ thể.
