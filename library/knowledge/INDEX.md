# Knowledge Index

Các bài viết knowledge-base cho AIEP v1.0 — cái "vì sao" và "như thế nào" đằng sau policy
và thực hành của nền tảng. Đây là các Knowledge Asset của Rule of Three.

| Bài viết | Trả lời |
|---------|---------|
| [review-level-policy-explained.md](review-level-policy-explained.md) | L1–L4 nghĩa là gì, reviewer nào chạy ở mỗi mức, và cách chọn một mức. |
| [codex-token-preservation.md](codex-token-preservation.md) | Vì sao Codex chỉ ở L4 và cách giữ các lần gọi external-auditor gọn nhẹ. |
| [local-ai-review-with-ollama.md](local-ai-review-with-ollama.md) | Cách DeepSeek và Qwen chạy cục bộ qua Ollama, và làm gì khi một backend tắt. |
| [frontmatter-conventions.md](frontmatter-conventions.md) | Tập con YAML frontmatter có kiểm soát và các quy tắc giữ cho validation đáng tin cậy. |
| [lessons-learned-v1.0.md](lessons-learned-v1.0.md) | Điều gì đã hiệu quả, điều gì đã gây đau, và điều gì mang tiếp từ v1.0. |

## Các asset liên quan

- Policy được vận hành hóa bởi SOP `skills/review-routing.md`.
- Hành vi reviewer được điều khiển bởi các template trong `prompts/`.
- Tình trạng môi trường được kiểm tra bằng `aiep doctor` trước khi dựa vào review cục bộ.
