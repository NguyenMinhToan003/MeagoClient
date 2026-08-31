# Feature components

Component, schema form và hook chỉ thuộc một domain được nhóm tại `src/features/<domain>`.

```text
features/story/
├─ components/
├─ hooks/
└─ schemas/
```

API client của domain vẫn đặt tại `src/services`; shared server contracts lấy từ `@meago/core`.
