# Infinite data foundation

`useCursorInfiniteQuery` chuẩn hóa cursor paging. `useInfiniteLoadMore` nối query với Intersection Observer; `VirtualList` chỉ giảm DOM. Ba phần không được gộp thành một hook/component sở hữu mọi state.

```text
useCursorInfiniteQuery  -> pages, cursor, fetch state
useInfiniteLoadMore     -> viewport trigger, chống request trùng
VirtualList             -> render window của items đã load
```

## Contract

```ts
interface CursorPage<T, Cursor = string> {
  items: T[];
  nextCursor: Cursor | null;
  previousCursor?: Cursor | null;
}
```

## Ví dụ

```tsx
const stories = useCursorInfiniteQuery({
  queryKey: ['stories', filters],
  queryFn: ({cursor, signal}) => storyService.list({cursor, filters, signal}),
  maxPages: 10,
});

const sentinelRef = useInfiniteLoadMore(stories);
```

- Dùng cho feed, search, comment, notification hoặc chương tải tiếp.
- Admin table cần page number dùng query thường + server pagination.
- `maxPages` giới hạn memory cho feed dài; backend nên phát cursor hai chiều khi dùng eviction hai đầu.
- Query function phải chuyển `AbortSignal` xuống HTTP client.
- Không gọi `fetchNextPage` nếu không có next page hoặc request tiếp theo đang chạy.
