# Tài liệu MeagoClient

Tài liệu được chia theo mục đích, không theo thứ tự thời gian:

| Nhóm | Nội dung |
|---|---|
| [architecture](architecture/) | Cấu trúc source, dependency direction và request flow |
| [standards](standards/) | Quy ước bắt buộc khi phát triển frontend |
| [reference](reference/) | Công nghệ đang sử dụng và vai trò của từng thư viện |
| [diagrams](diagrams/) | Nguồn sơ đồ `.drawio` có thể chỉnh sửa bằng diagrams.net |

Điểm bắt đầu đề xuất:

1. [Technology stack](reference/technology-stack.md)
2. [Kiến trúc frontend](architecture/frontend.md)
3. [Chuẩn capability frontend](standards/frontend-capabilities.md)
4. [Drag and drop foundation](standards/drag-and-drop.md)
5. [Infinite data foundation](standards/infinite-data.md)

Tài liệu phải mô tả code đang tồn tại. Thiết kế chưa triển khai phải ghi rõ `Deferred` hoặc `Research`.

AI làm việc trong workspace phải đọc `C:\Meago\AGENTS.md` trước tài liệu repo này.

Container production dùng `Dockerfile` tại root với Next.js `output: standalone`. Topology và lệnh deploy full stack là nguồn sự thật tại `MeagoServer/docs/operations/docker.md`.
