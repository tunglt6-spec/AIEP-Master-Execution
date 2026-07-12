# Skill: Review Routing theo Review Level

**Type:** Quy trình kỹ thuật lặp lại được (SOP)
**Owner surface:** `aiep review [WO-ID]` (CLI), được điều khiển bởi `src/reviewers/*`.
**Goal:** Cho một `reviewLevel` của Work Order, chạy đúng các reviewer đúng theo
đúng thứ tự — không hơn, không kém — và không bao giờ gọi Codex ngoài L4.

## Inputs

- Một Work Order đã được validate với một `reviewLevel` duy nhất trong `{L1, L2, L3, L4}`.
- Các reviewer backend khả dụng theo môi trường (xem `graceful-degradation`).

## Quy trình

1. Đọc `reviewLevel` từ frontmatter của WO.
2. Route tới pipeline cố định cho mức đó:

   | Mức | Pipeline (theo thứ tự) | Có tạo summary? |
   |-------|---------------------|-------------------|
   | L1 | claude | không |
   | L2 | claude → deepseek → qwen | có |
   | L3 | claude → deepseek → qwen → gemini | có |
   | L4 | claude → deepseek → qwen → gemini → codex | có |

3. Chạy reviewer tuần tự. Ghi mỗi artifact vào `.aiep/artifacts/<WO-ID>/`:
   `claude-self-review.md`, `deepseek-review.md`, `qwen-review.md`,
   `gemini-review.md` (L3+), `codex-audit.md` (L4).
4. Với L2+, tổng hợp `review-summary.md` (xem prompt review-summary-synthesis).
5. Ghi kết quả vào `decision.json`.

## CODEX GUARD (bắt buộc)

- Codex là **External Independent Auditor** và chỉ được gọi **ở L4**.
- Không bao giờ chạy Codex ở L1, L2, hoặc L3.
- Không thổi phồng một WO lên L4 chỉ để được review nhiều hơn. L4 dành riêng cho các thay đổi
  thực sự rủi ro cao: auth, authz, bảo mật trọng yếu, thanh toán, migration dữ liệu trọng yếu,
  core runtime có tác động toàn hệ thống, một bản phát hành production lớn, hoặc một xung đột
  reviewer không thể giải quyết.

## Xử lý thất bại / trường hợp biên

- Nếu `reviewLevel` thiếu hoặc không nằm trong tập, làm validation thất bại — không đoán một mức.
- Nếu một reviewer backend bắt buộc không khả dụng, áp dụng skill `graceful-degradation`
  và ghi một disposition được ghi lại thay vì âm thầm bỏ qua.

## Definition of done

Các artifact hiện diện trong `.aiep/artifacts/<WO-ID>/` khớp chính xác với pipeline của mức,
và `decision.json` phản ánh trạng thái chặn đã tổng hợp.
