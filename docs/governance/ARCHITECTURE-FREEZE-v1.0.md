# Architecture Freeze v1.0

Các quyết định architecture sau đây được đóng băng cho v1.0. Chúng chỉ có thể được thay đổi
bởi Product Owner và ARB. Lý do cho mỗi quyết định được ghi nhận trong các ADR
(`docs/adr/`).

## Các quyết định đã đóng băng

1. **Runtime: Node.js (>= 18), ESM, zero runtime dependencies.**
   Nền tảng chỉ sử dụng Node built-ins. Điều này bảo đảm cài đặt offline, khởi động
   nhanh, một bề mặt supply-chain nhỏ, và một runtime duy nhất cho CLI + dashboard +
   packaging. Xem ADR-0001.

2. **Định dạng dữ liệu: Markdown + một tập con YAML frontmatter được kiểm soát; JSON cho
   config và machine artifact.**
   Work Orders là Markdown với frontmatter được phân tích bởi một parser nội bộ nhỏ.
   `.aiep/config.json` và `decision.json` là JSON. Xem ADR-0001.

3. **Kiến trúc module phân lớp.**
   `bin/aiep.js` → `src/cli/*` (commands) → `src/core/*` (config, paths,
   frontmatter, workorders, gitdelta, reviewMatrix, secrets) và
   `src/reviewers/*` (claude, ollama, cli-reviewer, gemini, codex, findings,
   router). Dashboard được build bởi `src/dashboard/build.js` và được phục vụ
   tĩnh.

4. **Định tuyến review theo ReviewLevel với Codex L4 guard.**
   Map `reviewLevels` trong config là nguồn chân lý về định tuyến; Codex
   guard giới hạn Codex ở L4. Xem ADR-0002 và ADR-0003.

5. **Các reviewer backend có thể cắm được (pluggable) và suy giảm nhẹ nhàng.**
   Các reviewer cục bộ dùng Ollama HTTP API; Gemini và Codex được hỗ trợ qua CLI. Bất kỳ
   backend không khả dụng nào cũng tạo ra một integration decision được ghi chép, không bao giờ là một lần pass
   giả.

6. **Artifact là đơn vị của bằng chứng review.**
   Mỗi Work Order đã được review ghi các artifact theo từng reviewer, một `review-summary.md`
   (L2+) và một `decision.json` dưới `.aiep/artifacts/<WO-ID>/`.

7. **Dashboard chỉ đọc dữ liệu trực tiếp.**
   `dashboard/data/dashboard.json` được sinh ra từ trạng thái repository thực; không có
   con số demo nào được trình bày như dữ liệu production.

## Không đóng băng (chi tiết triển khai, có thể tiến hóa trong v1.0)

- Định dạng và màu sắc chính xác của output CLI.
- Các keyword trọng tâm reviewer bổ sung.
- Kiểu dáng trực quan của dashboard (trong định hướng "nhẹ, hiện đại, chuyên nghiệp").
- Các library asset và template bổ sung.
