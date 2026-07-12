# Lessons Learned — AIEP v1.0

Một bản ghi sống về điều gì đã hiệu quả, điều gì đã gây đau, và điều gì chúng ta sẽ làm y như vậy lần nữa khi
xây dựng AIEP v1.0. Lessons learned là một **Standard Asset** hạng nhất theo Rule of
Three; ghi lại chúng là cách nền tảng tránh lặp lại chính những sai lầm của mình.

## Điều gì đã hiệu quả

- **Zero runtime dependency.** Xây core chỉ trên các built-in của Node.js giữ cho việc
  cài đặt tầm thường, bề mặt tấn công nhỏ, và hành vi cross-platform dễ đoán. Các
  dependency mới được xem như một finding HIGH bởi technical reviewer, giữ vững ranh giới.
- **Một review level cho mỗi Work Order.** Một `reviewLevel` duy nhất làm cho routing xác định
  và dashboard dễ tổng hợp. Không có mơ hồ về việc reviewer nào cần chạy.
- **Các lăng kính reviewer không chồng lấn.** Giao DeepSeek tính đúng đắn và Qwen chất lượng
  tạo ra các review summary sạch, đã khử trùng lặp. Bước synthesis trở nên dễ hơn đáng kể.
- **Review giới hạn theo delta.** Tập trung reviewer vào change delta cắt nhiễu đáng kể
  và làm cho các finding có thể hành động được.
- **Review cục bộ qua Ollama.** Chạy DeepSeek và Qwen cục bộ giữ cho đường L2 thông dụng
  nhanh, riêng tư, và rẻ.

## Điều gì đã gây đau (và cách khắc phục)

- **Thổi phồng mức lên L4.** Ban đầu có xu hướng đánh dấu công việc L4 "cho chắc,"
  điều này tiêu tốn external auditor và làm chậm bàn giao. Khắc phục: CODEX GUARD tường minh và
  một danh sách tiêu chí rủi ro cao được ghi lại. Khi phân vân giữa L3 và L4, mặc định chọn L3.
- **Bỏ qua reviewer âm thầm.** Một backend bị tắt có thể âm thầm bỏ rơi một reviewer và
  tạo ra một pass sai. Khắc phục: skill graceful-degradation với các disposition tường minh
  được ghi trong artifact và `decision.json`.
- **Frontmatter trôi dạt.** Các key tùy tiện len vào và thi thoảng làm rớt Work Order khỏi
  dashboard. Khắc phục: một tập key có kiểm soát và validation (`aiep validate`).
- **Cám dỗ scope creep.** Các ý tưởng dạng v2.0 (AI Council, multi-repo, Labs) cứ
  xuất hiện trong các review. Khắc phục: Scope Lock, được thực thi như một finding CRITICAL bởi Gemini
  design reviewer.

## Điều gì chúng ta sẽ giữ

- Kỷ luật phạm vi năm-deliverable (Core, Docs, Library, PMO, Dashboard) và Scope Lock
  cứng rắn chống lại các tính năng v2.0.
- Rule of Three như một thói quen soạn thảo: mỗi WO quan trọng để lại một Code, Knowledge,
  và Standard asset — không có phần độn.
- `aiep doctor` như bước kiểm tra pre-flight trước khi dựa vào review cục bộ.

## Các nhắc nhở mang tiếp

1. Soạn ở review level đúng thấp nhất; biện minh cho mọi L4.
2. Không bao giờ để một reviewer bị thiếu được tính là một pass.
3. Giữ secret ngoài nội dung được commit và artifact; rotate khi bị lộ.
4. Biến mỗi quyết định đáng chú ý thành một ADR và mỗi kết quả đáng chú ý thành một lesson ở đây.
