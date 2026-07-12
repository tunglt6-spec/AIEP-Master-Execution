# AI Engineering Library

AI Engineering Library là một trong năm deliverable sản phẩm của **AIEP v1.0**
(AI Engineering Platform). Đây là kho tri thức tái sử dụng được, được tuyển chọn của nền tảng:
nơi mọi phần công việc kỹ thuật quan trọng để lại một asset mà
Work Order tiếp theo có thể nhặt lên dùng thay vì phát minh lại.

AIEP là một nền tảng dựa trên governance, chạy code review đa mức có AI hỗ trợ,
theo dõi công việc qua một PMO, và hiển thị trạng thái trên một dashboard. Library là thứ
giữ cho cỗ máy đó không lặp lại chính nó.

## Bốn phần

| Phần | Đường dẫn | Nắm giữ gì |
|---------|------|---------------|
| **Prompts** | `prompts/` | Các template prompt tái sử dụng được, dẫn dắt các reviewer (DeepSeek, Qwen, Gemini) và các tác vụ soạn thảo thường gặp (Work Order, review summary, ADR). |
| **Skills** | `skills/` | Các quy trình kỹ thuật lặp lại được — SOP mà một kỹ sư hoặc agent tuân theo giống hệt nhau mỗi lần (review routing, delta review, graceful degradation, secret hygiene). |
| **MCP** | `mcp/` | Tài liệu tham chiếu Model Context Protocol: cách các MCP server tích hợp với reviewer và knowledge của AIEP, cùng các descriptor server ví dụ. |
| **Knowledge** | `knowledge/` | Các bài viết knowledge-base giải thích policy và thực hành (review level, bảo tồn token Codex, review cục bộ với Ollama, frontmatter, lessons learned). |

Mỗi phần mang một `INDEX.md` liệt kê các asset của nó để chúng có thể được khám phá.

## Rule of Three

Các deliverable quan trọng nên sinh ra ba loại asset tái sử dụng được:

1. **Code Asset** — thứ gì đó thực thi hoặc cấu hình được (một hành vi CLI, một
   descriptor, một scanning pattern).
2. **Knowledge Asset** — một lời giải thích *vì sao* và *như thế nào* (một bài viết KB).
3. **Standard Asset** — một pattern, checklist, SOP, prompt, template lặp lại được, hoặc
   một lesson learned.

Library là nơi các Knowledge asset và Standard asset trú ngụ, và là nơi các Code asset được
tham chiếu và mô tả. Không có phần độn — một asset chỉ được thêm khi nó thực sự
tái sử dụng được bởi một Work Order tương lai. Nếu một phần công việc không tạo ra một asset tái sử dụng được,
không có gì bị ép vào library.

## Cách các asset được tái sử dụng

- Một Work Order mới ở review level **L2+** kéo prompt reviewer phù hợp từ
  `prompts/` thay vì viết tay hướng dẫn.
- Skill **review-routing** cho nền tảng biết reviewer nào cần chạy cho một
  `ReviewLevel` nhất định, giữ routing nhất quán với Review Level Policy.
- Các bài viết knowledge được liên kết từ Work Order và ADR để quyết định trích dẫn một nguồn
  ổn định thay vì trí nhớ truyền miệng.
- Các MCP descriptor được sao chép và điều chỉnh khi một reviewer hoặc nguồn knowledge cần một
  context server mới.

## Tính nhất quán với nền tảng

Mọi thứ ở đây được viết theo các dữ kiện v1.0 đã đóng băng: Node.js ESM với zero runtime
dependency, Markdown + một tập con YAML frontmatter có kiểm soát, `.aiep/config.json` cho
cấu hình, và danh sách reviewer gồm Claude, DeepSeek, Qwen, Gemini, và Codex. Library
không bao giờ giới thiệu lệnh, file, hay tính năng ngoài phạm vi v1.0.
