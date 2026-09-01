# Chuẩn capability frontend

Trạng thái: **Accepted**. Dependency chỉ được giữ khi có vai trò rõ ràng. Không bọc thư viện chỉ để đổi tên API; abstraction chung phải loại bỏ duplication hoặc cố định policy của Meago.

## Form

- Dùng React Hook Form cho state tương tác và Zod qua `zodResolver` cho client validation.
- Schema/component đặt trong `src/features/<domain>`; server error được map bằng `setError`.
- Không đưa form state vào Zustand và không xem schema FE là API contract.
- Mẫu đang chạy: `FoundationEmailForm` + shadcn Form.
- Input subsystem dùng AntD qua boundary `components/ui`: `Input`, `PasswordInput`, `SearchInput`, `InputNumber`, `Textarea` và `Select`. Feature vẫn sở hữu label, help text, validation và chuyển đổi kiểu dữ liệu; không import AntD input/select trực tiếp.
- Visual input dùng cùng token với DatePicker: border vừa phải, height 36px, radius 6px và không active shadow. `InputNumber` giữ giá trị number/string theo generic; không giả lập số bằng text input trong form nghiệp vụ.
- Multi-select có thể truyền `tagColors` map theo domain value để màu ổn định qua reorder/filter; không tính màu theo index. Feature vẫn phải giữ tương phản và dùng màu có ý nghĩa semantic nhất quán.
- Date/time picker dùng Ant Design DatePicker/TimePicker qua shared boundary Meago; feature không import AntD picker trực tiếp. `ConfigProvider` nhận locale URL từ `next-intl` và đồng bộ token light/dark Meago.
- Day.js value từ picker là wall-clock time. Feature phải gắn timezone theo policy nghiệp vụ và dùng helper `localDateTimeToUtcIso` tại application boundary; không gửi chuỗi local lên API như một instant tuyệt đối.
- Foundation dùng chung gồm Date, Time, DateTime, Date Range, DateTime Range và Time Range. Range phải validate `start <= end`; feature không ghép hai input text rời thành range giả.
- DateTime/Time picker dùng panel cột giờ/phút của AntD và `needConfirm`; Date Range/DateTime Range cũng dùng confirm flow để người dùng kiểm tra đủ hai đầu trước khi đóng. Preset được truyền từ feature bằng message i18n.

## Data table và virtualization

- `DataTable<T>` là renderer semantic dùng TanStack Table v9 + shadcn table; feature sở hữu column và data fetching.
- Dữ liệu lớn dùng server sorting/filtering/pagination và đồng bộ React Query key.
- Row ID lấy từ domain ID, không lấy array index.
- `VirtualList<T>` chỉ giảm DOM của dữ liệu đã load, không thay pagination.
- Chỉ bật virtualization sau khi production profiling chứng minh DOM là bottleneck.
- `Pagination` là controlled composition: feature sở hữu `currentPage`, `totalPages` và fetching; component chỉ sở hữu thuật toán page/ellipsis cùng keyboard/ARIA behavior.
- Pagination phía server phải dùng page/cursor contract và đồng bộ query key; không slice toàn bộ production dataset trên client.

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

## Motion và icon toggle

- Toggle icon dùng `AnimatedIconToggle`; icon vào/ra qua `AnimatePresence`, button có hover/tap feedback nhẹ.
- Luôn có `aria-label`, `aria-pressed`, focus ring và vùng hit-target từ shadcn button variant; icon chỉ trang trí phải `aria-hidden`.
- Animation tôn trọng `prefers-reduced-motion` qua `useReducedMotion`; không dùng motion để che state change hoặc trì hoãn thao tác.
- Không bọc mọi button bằng Motion. Chỉ dùng primitive này khi icon thực sự đổi theo trạng thái.

## Skeleton và toast

- Skeleton mô phỏng đúng hình dạng nội dung sắp xuất hiện để giữ layout; không dùng một thanh skeleton chung cho mọi màn hình.
- Infinite query hiển thị skeleton riêng cho initial page và next page; loading không được thay thế dữ liệu đã tải bằng màn hình trắng.
- Sonner có đúng một `Toaster` ở `AppProvider`. Feature gọi `toast.success/info/error` cho feedback ngắn hạn và `toast.promise` cho một Promise có vòng đời rõ.
- Validation error phải ở gần field; lỗi cần người dùng xử lý lâu dài phải nằm trong page. Không dùng toast thay thế các lỗi này.
- Không toast cho mọi thao tác thành công âm thầm; tránh spam và không đưa secret/raw server error vào message.

## Theme và avatar

- Theme dùng `next-themes` tại application provider với `attribute="class"`, mặc định theo system và tắt transition khi đổi theme để tránh flash không cần thiết.
- Component không tự đọc/ghi theme vào localStorage; chỉ gọi `useTheme` qua theme provider.
- Avatar dùng primitive shadcn/Radix. Khi profile đang tải phải dùng Skeleton cùng kích thước để không làm dịch layout; khi ảnh thiếu hoặc lỗi phải có initials fallback.
- Skeleton biểu thị trạng thái loading, không được dùng để giả vờ rằng dữ liệu không tồn tại đang tải vô hạn.

## Button hierarchy

- `default`: button brand thông dụng; dùng nền teal nhạt, viền nhẹ và chữ/icon teal như thiết kế chuẩn Meago.
- `solid`: CTA chính duy nhất trong một cụm khi thật sự cần mức nhấn mạnh cao hơn default.
- `outline-primary`: hành động phụ cần nhấn mạnh hơn outline trung tính nhưng thấp hơn primary.
- `secondary`, `outline`, `ghost`: hành động trung tính theo mức độ giảm dần.
- `destructive`: chỉ dành cho hành động phá huỷ hoặc khó hoàn tác; không dùng primary để biểu diễn nguy hiểm.
- Feature chọn semantic variant, không tự viết `bg-*`, `text-*` hoặc mã màu cho button.

## Input visual states

- AntD Input và DatePicker dùng chung surface: border mảnh vừa phải, height/radius đồng nhất và không có box-shadow.
- Focus chỉ đổi border primary; không thêm shadow hoặc glow tạo cảm giác nhiều lớp đè lên input.
- Light/dark surface, border, placeholder và trạng thái invalid lấy từ `AntdProvider` token; feature không tự ghi mã màu.
- Feature chỉ truyền layout class, semantic props (`status`, `allowClear`, `prefix`, `suffix`) và behavior cần thiết; không override selector nội bộ AntD.

## Quality gate

```bash
npm run lint
npm run ts-check
npm run build
npm audit --audit-level=high
```

DnD, form nghiệp vụ và tương tác keyboard phải có automated test trước production.
