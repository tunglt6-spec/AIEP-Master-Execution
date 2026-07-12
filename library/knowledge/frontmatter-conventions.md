# Quy ước Frontmatter

AIEP lưu dữ liệu của nó dưới dạng **Markdown với một tập con YAML frontmatter nhỏ, có kiểm soát**.
Frontmatter không tự do: chỉ một tập key đã biết được dùng, để `aiep validate`,
PMO, và dashboard có thể đọc tài liệu một cách đáng tin cậy. Bài viết này định nghĩa các
quy ước.

## Frontmatter là gì

Một khối YAML được phân định bởi `---` ở ngay đầu một file Markdown:

```yaml
---
id: WO-0142
title: Add delta-scoped review context
status: draft
reviewLevel: L2
owner: hoantk
deliverable: Core Repository
---
```

Phần thân của tài liệu theo sau `---` đóng.

## Tập key có kiểm soát

Giữ ở một vốn từ nhỏ, dễ đoán. Các key thường gặp:

| Key | Áp dụng cho | Giá trị / ghi chú |
|-----|-----------|----------------|
| `id` | tất cả | Định danh ổn định (ví dụ `WO-0142`, `ADR-0007`). |
| `title` | tất cả | Tiêu đề ngắn, súc tích. |
| `status` | WO, ADR | ví dụ `draft`, `in-review`, `blocked`, `done` (WO); `proposed`, `accepted`, `superseded` (ADR). |
| `reviewLevel` | WO | Đúng một trong `L1`, `L2`, `L3`, `L4`. |
| `owner` | WO | Kỹ sư chịu trách nhiệm. |
| `deliverable` | WO | Một trong năm: Core Repository, Documentation System, AI Engineering Library, PMO, Dashboard. |
| `date` | ADR, bài viết | Ngày ISO. |
| `relatedWO` | ADR | Work Order đã dẫn dắt quyết định. |

## Quy tắc

1. **Frontmatter trước tiên.** Khối phải là nội dung đầu tiên trong file, mở và
   đóng bằng `---`.
2. **Chỉ các key có kiểm soát.** Không giới thiệu các key tùy tiện; các key không xác định phá hỏng validation
   và tổng hợp dashboard. Nếu một key mới thực sự cần, ghi lại quyết định trong một
   ADR trước.
3. **`reviewLevel` đơn giá trị.** Đúng một mức cho mỗi Work Order — không bao giờ là một danh sách hay một
   khoảng.
4. **`id` ổn định.** Không bao giờ tái sử dụng hay đánh số lại một `id`; các tài liệu và artifact khác
   tham chiếu tới nó.
5. **JSON vẫn là JSON.** Cấu hình (`.aiep/config.json`) và các đầu ra máy
   (`decision.json`, `dashboard/data/dashboard.json`) là JSON, không phải frontmatter. Không
   trộn lẫn hai loại.
6. **Không secret.** Frontmatter là nội dung được commit — không bao giờ đặt credential vào đó (xem
   secret-hygiene).

## Vì sao kỷ luật này quan trọng

Tập con có kiểm soát là hợp đồng giữa Markdown do con người soạn và các phần tự động
của AIEP (validation, theo dõi PMO, dashboard). Một key lạc lối hoặc một khối sai định dạng có thể
âm thầm làm rớt một Work Order khỏi một view. Tính nhất quán ở đây là thứ cho phép việc parse Node
zero-dependency giữ được đơn giản và đáng tin cậy trên Windows, macOS, và Linux.
