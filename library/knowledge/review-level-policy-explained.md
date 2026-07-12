# Giải thích Review Level Policy

Mỗi AIEP Work Order mang đúng một **Review Level** (L1–L4). Mức quyết định
reviewer nào chạy và theo thứ tự nào. Bài viết này giải thích policy và cách chọn
đúng mức.

## Các mức

| Mức | Pipeline reviewer | Ý định |
|-------|-------------------|--------|
| **L1** | claude | Thay đổi tầm thường, cô lập, rủi ro thấp. Chỉ Claude self-review. |
| **L2** | claude → deepseek → qwen | Thay đổi code thông thường cần review tính đúng đắn + chất lượng. |
| **L3** | claude → deepseek → qwen → gemini | Thay đổi có tác động design/kiến trúc/tích hợp. |
| **L4** | claude → deepseek → qwen → gemini → codex | Thay đổi thực sự rủi ro cao. |

Mỗi reviewer sở hữu một lăng kính riêng biệt:

- **Claude** — Engineering Team & Execution Lead; thực hiện self review.
- **DeepSeek** (cục bộ, qua Ollama) — Code Reviewer: logic bug, runtime error, edge
  case, bảo mật cơ bản, error handling, tính đúng đắn.
- **Qwen** (cục bộ, qua Ollama) — Technical Reviewer: khả năng bảo trì, dead code,
  trùng lặp, hiệu năng, tính nhất quán kiến trúc, cấu trúc.
- **Gemini** — Design Reviewer: tính nhất quán thiết kế, sự đồng nhất kiến trúc, tuân thủ DS/scope,
  rủi ro tích hợp.
- **Codex** — External Independent Auditor. **Không** phải một reviewer mặc định.

## CODEX GUARD

Codex chỉ được gọi **ở L4** — không bao giờ ở L1, L2, hoặc L3. **Không** thổi phồng một Work
Order lên L4 chỉ để có thêm soi xét. L4 dành riêng cho các thay đổi thực sự
rủi ro cao:

- authentication hoặc authorization
- bảo mật trọng yếu
- thanh toán
- migration dữ liệu trọng yếu
- core runtime có tác động toàn hệ thống
- một bản phát hành production lớn
- một xung đột reviewer không thể giải quyết

Nếu không có điều nào trong số này áp dụng, mức đúng là L3 hoặc thấp hơn. Đánh mức quá cao lãng phí
independent auditor và làm loãng tín hiệu của một L4 thực sự.

## Chọn một mức (heuristic nhanh)

1. Nó có chạm tới một khu vực rủi ro cao trong danh sách ở trên không, hoặc có một reviewer deadlock không?
   → **L4**.
2. Nếu không, nó có thay đổi thiết kế, cắt ngang ranh giới module, hay ảnh hưởng tới một
   deliverable khác không? → **L3**.
3. Nếu không, nó có phải là một thay đổi code thông thường không? → **L2**.
4. Nếu không, nó có tầm thường và cô lập không? → **L1**.

## Severity và tính chặn

Mọi reviewer báo cáo finding dùng tập severity **CRITICAL, HIGH, MEDIUM, LOW,
INFO**. CRITICAL và HIGH là **chặn**: một Work Order với bất kỳ finding CRITICAL/HIGH mở nào
không thể pass, bất kể mức.

## Các artifact được tạo ra

Tại `.aiep/artifacts/<WO-ID>/`: `claude-self-review.md`, `deepseek-review.md`,
`qwen-review.md`, `gemini-review.md` (L3+), `codex-audit.md` (L4),
`review-summary.md` (L2+), và `decision.json`.
