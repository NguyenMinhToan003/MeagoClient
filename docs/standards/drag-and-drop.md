# Drag and drop foundation

Meago dùng API mới `@dnd-kit/react` + `@dnd-kit/helpers`, không dùng tutorial legacy `@dnd-kit/core`/`sortable`. Core nằm tại `src/lib/dnd` và không chứa business rule.

## Cấu trúc

```text
src/lib/dnd/
├── core/       # provider, type, sensor và modifier policy
├── sortable/   # controlled SortableList, SortableItem, SortableHandle
├── multi-list/ # controlled SortableBoard và cross-column drop target
├── presets/    # vertical, horizontal và grid defaults
├── hooks/      # optimistic commit + rollback
└── index.ts    # public API nội bộ
```

## Ví dụ chuẩn

```tsx
const optimistic = useOptimisticReorder({
  items: chapters,
  commit: ({itemId, toIndex}) => chapterService.reorder({itemId, toIndex}),
  onError: showError,
});

<SortableList
  items={optimistic.items}
  getItemId={(item) => item.id}
  onReorder={optimistic.reorder}
  accessibility={{
    itemLabel: (item) => item.title,
    dragHandleLabel: (item) => `Di chuyển ${item.title}`,
    movedMessage: ({item, toIndex}) => `${item.title} ở vị trí ${toIndex + 1}`,
  }}
>
  {(item, state) => (
    <ChapterRow>
      <SortableHandle ref={state.handleRef} aria-label={state.handleLabel} />
      <ChapterContent chapter={item} />
    </ChapterRow>
  )}
</SortableList>
```

## Invariant

- ID là domain ID ổn định; index chỉ là vị trí hiện hành.
- Item chứa link/input/button phải có handle riêng.
- Không override `preventActivation` để chặn toàn bộ interactive element: mặc định của dnd-kit đã cho phép registered handle và chặn interactive element ngoài handle. Nếu handle là `button`, rule chặn button tổng quát sẽ vô hiệu hóa drag bằng cả pointer và keyboard.
- Pointer dùng distance; touch dùng delay+tolerance; KeyboardSensor luôn được giữ.
- Với `PointerActivationConstraints.Distance`, `tolerance` là ngưỡng hủy activation chứ không phải sai số kích hoạt. Không đặt tolerance nhỏ hơn `value`, vì pointer sẽ bị hủy trước khi đạt khoảng cách bắt đầu drag.
- `onDragEnd` mới commit API; không gọi API trong `dragMove`.
- Reorder lỗi phải rollback và thông báo; API nên nhận item ID cùng vị trí/neighbor ID, không nhận toàn bộ object UI.
- Commit được serialize theo thứ tự thao tác. Failure cũ không được rollback state của operation mới hơn; `isPending` dùng để hiển thị trạng thái hoặc chặn thao tác theo policy domain.
- Vertical/horizontal preset khóa axis; grid không khóa axis.
- Multi-container/Kanban dùng `SortableBoard`, không thêm boolean vào `SortableList`. Item khai báo `group`, `type` và `accept`; column là drop target priority thấp để vẫn nhận được item khi cột rỗng. Cross-column state cập nhật ở `onDragOver` và phải snapshot/rollback khi drag bị hủy.
- `SortableBoard` tách item đang cầm sang `DragOverlay`; source item trong layout trở thành bản preview mờ y nguyên tại vị trí dự kiến. Preview giữ nguyên content, kích thước và spacing nhưng giảm opacity/bỏ shadow để phân biệt với overlay, kể cả khi chuyển cột.
- Không reorder xuyên qua các page chưa load; danh sách rất lớn phải benchmark riêng với virtualization.

Foundation page chỉ giữ một demo `FoundationSortableBoardDemo`: bốn cột, reorder trong cột và cross-column bằng mouse/touch/keyboard.
