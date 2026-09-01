# Technology stack — MeagoClient

File này giúp đọc nhanh stack và trách nhiệm của từng công nghệ. Version chính xác luôn lấy từ `package.json`; không ghi lặp patch version tại đây để tránh trôi dữ liệu.

## Runtime và UI

| Công nghệ | Vai trò | Trạng thái |
|---|---|---|
| Next.js App Router + React | Routing, SSR/RSC và UI runtime | Adopted |
| TypeScript strict | Type safety và contract checking | Adopted |
| Tailwind CSS + shadcn/ui | Design token và UI primitive thuộc source repo | Adopted |
| Meago technology teal | Brand seed `#14B8A6` đi cùng white surface; dark accent `#2DD4BF`, dark solid primary `#0F766E` để giảm chói và giữ contrast | Adopted |
| `next-intl` | Locale `/vi`, `/en`, message catalog và locale navigation | Adopted toàn ứng dụng |
| `next-themes` | Đồng bộ light/dark/system theme bằng class trên document root | Adopted toàn ứng dụng |
| Lucide React | Icon system | Adopted |
| Docker standalone | Next.js self-host runtime tối giản | Adopted; production được orchestration từ MeagoServer Compose |

## Data, state và transport

| Công nghệ | Vai trò | Quy ước |
|---|---|---|
| TanStack Query | Server state, cache và mutation | Query key ổn định; không copy server state vào Zustand |
| Zustand | Client state nhỏ, dùng chung | Không persist access/refresh token |
| Axios | HTTP client, interceptor và refresh coordinator | UI không gọi Axios trực tiếp |
| `@meago/core` | Contract và primitive dùng chung FE/BE | Pin exact version, không mirror interface |

## Interaction capability

| Công nghệ | Vai trò | Trạng thái |
|---|---|---|
| React Hook Form + Zod | Form state và client-boundary validation | Adopted |
| Ant Design Input/DatePicker/TimePicker + Day.js | Input tiện ích, Date, Time, DateTime, Range, time panel, presets và confirm flow; chỉ dùng qua Meago boundary và theme bằng ConfigProvider | Adopted cho form-control subsystem |
| TanStack Table v9 | Headless table model | Foundation sẵn sàng |
| TanStack Query Infinite | Cursor pagination cho feed/list tải tiếp | Foundation sẵn sàng |
| TanStack Virtual | Virtualize dữ liệu đã tải | Dùng sau khi đo hiệu năng |
| cmdk | Command Palette | Adopted |
| react-intersection-observer | Infinite sentinel/lazy activation | Foundation sẵn sàng |
| Driver.js | Product tour | Foundation sẵn sàng |
| dnd-kit API mới | Accessible reorder với preset/sensor/rollback | Foundation + demo đã triển khai |
| Motion | Animated icon toggle và interaction feedback | Adopted qua `AnimatedIconToggle`; tôn trọng reduced motion |
| Sonner | Toast success/info/error/promise toàn cục | Adopted; một `Toaster` duy nhất tại AppProvider |
| Uppy/Tus | Resumable upload | Deferred; chưa cài |

Chi tiết triển khai: [frontend-capabilities.md](../standards/frontend-capabilities.md).

## Công nghệ dự kiến theo capability

Các package dưới đây **chưa được cài**. Chỉ chuyển sang `Adopted` khi có feature thật, source integration và quality gate tương ứng.

| Capability dự kiến | Thư viện ưu tiên | Điều kiện triển khai |
|---|---|---|
| Upload queue/resumable | Uppy + Tus hoặc S3 multipart | Upload API, signing, size/MIME policy và storage lifecycle đã chốt |
| Crop avatar/cover | `react-easy-crop` | Có yêu cầu crop/zoom/rotate và output image policy |
| Gallery/fullscreen preview | `yet-another-react-lightbox` | Có gallery nhiều ảnh, zoom/navigation/plugin; một ảnh dùng Dialog + Next Image |
| Video player nâng cao | `video.js` | Native video không đáp ứng HLS/subtitle/quality/plugin/analytics |
| Audio waveform/editor | `wavesurfer.js` | Có waveform seek, marker, region, timeline hoặc record; phát đơn giản dùng native audio |

DnD không thay upload dropzone: Uppy sở hữu file-drop/upload state; dnd-kit sở hữu reorder domain item.
