# Prompts Index

Các template prompt tái sử dụng được cho AIEP v1.0. Mỗi template có một cấu trúc cố định: title,
purpose, when-to-use, một prompt body được rào (fenced), variables, và expected output.

| Prompt | Dẫn dắt / Tạo ra | Áp dụng ở |
|--------|-------------------|------------|
| [code-review-deepseek.md](code-review-deepseek.md) | DeepSeek Local Code Reviewer — tính đúng đắn, runtime, edge case, bảo mật cơ bản, error handling | L2+ |
| [code-review-qwen.md](code-review-qwen.md) | Qwen Local Technical Reviewer — khả năng bảo trì, dead code, trùng lặp, hiệu năng, kiến trúc, cấu trúc | L2+ |
| [design-review-gemini.md](design-review-gemini.md) | Gemini Design Reviewer — tính nhất quán thiết kế, sự đồng nhất kiến trúc, tuân thủ scope, rủi ro tích hợp | L3+ |
| [work-order-authoring.md](work-order-authoring.md) | Một Work Order đúng định dạng với review level được biện minh | Bất kỳ WO mới nào |
| [review-summary-synthesis.md](review-summary-synthesis.md) | `review-summary.md` và disposition pass/block | L2+ |
| [adr-drafting.md](adr-drafting.md) | Một Architecture Decision Record | Các WO mang tính quyết định |

## Ghi chú sử dụng

- Các prompt reviewer ghi vào `.aiep/artifacts/<WO-ID>/` (`deepseek-review.md`,
  `qwen-review.md`, `gemini-review.md`).
- Mọi prompt yêu cầu reviewer dùng tập severity của AIEP:
  CRITICAL, HIGH, MEDIUM, LOW, INFO — trong đó CRITICAL và HIGH là chặn.
- Các prompt reviewer được thiết kế không chồng lấn: DeepSeek sở hữu tính đúng đắn, Qwen sở hữu
  chất lượng/cấu trúc, Gemini sở hữu thiết kế/scope. Điều này giữ `review-summary-synthesis`
  không có finding trùng lặp.
