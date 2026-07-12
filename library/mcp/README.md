# MCP Library

Phần này ghi lại cách các server **Model Context Protocol (MCP)** có thể cung cấp context cho
reviewer và các quy trình knowledge của AIEP, và cung cấp các descriptor server tham chiếu.

> **Tài liệu tham chiếu.** Các descriptor trong thư mục này (`filesystem-server.json`,
> `git-server.json`) là *reference descriptor* — các hình mẫu minh họa để bạn sao chép và điều chỉnh.
> Chúng không phải là một tích hợp runtime được ship của AIEP v1.0. Core AIEP v1.0 vẫn là
> Node.js ESM với zero runtime dependency; việc dùng MCP nằm ở rìa tooling, không nằm trong
> core đã đóng băng.

## MCP là gì, ngắn gọn

MCP là một protocol cho phép một AI client kết nối tới các **server** bên ngoài phơi bày
context (resources) và hành động (tools) qua một transport được định nghĩa (thường là `stdio` hoặc
HTTP/SSE). Một client hỏi server nó có thể làm gì (capabilities) rồi đọc resources
hoặc gọi tools qua một giao diện đồng nhất.

## MCP khớp vào AIEP ra sao

Các MCP server cho reviewer và các tác vụ knowledge quyền truy cập *có giới hạn, có cấu trúc* tới context
thay vì các lần đọc file tùy tiện:

- **Reviewers** — Một filesystem hoặc git MCP server có thể trao cho reviewer đúng change
  delta và context file xung quanh cho một Work Order, củng cố skill
  `git-delta-review`. Reviewer thấy delta qua một capability có kiểm soát
  thay vì toàn bộ ổ đĩa.
- **Knowledge** — Một MCP server có thể phơi bày AI Engineering Library (prompts, skills,
  bài viết knowledge) như các resource chỉ-đọc, để một trợ lý có thể kéo đúng asset
  theo tên khi soạn một WO hoặc tổng hợp một review.
- **Boundaries** — Quyền truy cập MCP nên least-privilege và chỉ-đọc bất cứ nơi nào có thể.
  Một server có thể ghi hoặc xóa phải được giới hạn hẹp và tuân theo cùng các
  quy tắc `secret-hygiene` (không bao giờ phơi bày credential qua một resource).

## Hình mẫu descriptor

Mỗi reference descriptor dùng các trường này:

| Trường | Ý nghĩa |
|-------|---------|
| `name` | Định danh ổn định cho server. |
| `description` | Context/hành động nó cung cấp. |
| `transport` | Cách client kết nối (`stdio`, `http`, `sse`). |
| `capabilities` | Các `resources` và `tools` được khai báo mà server phơi bày. |
| `notes` | Các lưu ý và phạm vi chỉ-tham-chiếu. |

## Files

- [filesystem-server.json](filesystem-server.json) — truy cập giới hạn-đọc tới các file Work Order
  và các asset library.
- [git-server.json](git-server.json) — truy cập giới hạn-đọc tới lịch sử repository và
  change delta cho một Work Order.
