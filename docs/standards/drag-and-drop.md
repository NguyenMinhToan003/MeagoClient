# Drag and drop foundation

Meago dùng API mới `@dnd-kit/react` + `@dnd-kit/helpers`, không dùng tutorial legacy `@dnd-kit/core`/`sortable`. Core nằm tại `src/lib/dnd` và không chứa business rule.

## Cấu trúc

```text
src/lib/dnd/
├── core/       # provider, type, sensor và modifier policy
├── sortable/   # controlled SortableList, SortableItem, SortableHandle
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
- Pointer dùng distance; touch dùng delay+tolerance; KeyboardSensor luôn được giữ.
- `onDragEnd` mới commit API; không gọi API trong `dragMove`.
- Reorder lỗi phải rollback và thông báo; API nên nhận item ID cùng vị trí/neighbor ID, không nhận toàn bộ object UI.
- Commit được serialize theo thứ tự thao tác. Failure cũ không được rollback state của operation mới hơn; `isPending` dùng để hiển thị trạng thái hoặc chặn thao tác theo policy domain.
- Vertical/horizontal preset khóa axis; grid không khóa axis.
- Multi-container/Kanban là preset riêng theo domain, không thêm boolean vào `SortableList`.
- Không reorder xuyên qua các page chưa load; danh sách rất lớn phải benchmark riêng với virtualization.

Demo mouse/touch/keyboard đang chạy trên foundation page qua `FoundationSortableDemo`.
