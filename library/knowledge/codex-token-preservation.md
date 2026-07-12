# Bảo tồn Token của Codex

Codex là **External Independent Auditor** của AIEP — một reviewer khan hiếm, giá trị cao được
cố ý giữ ngoài pipeline mặc định. Bài viết này giải thích vì sao chúng ta bảo tồn
năng lực Codex và cách policy thực thi điều đó.

## Vì sao bảo tồn nó

- Codex là một auditor *bên ngoài*, không phải một model cục bộ. Tính độc lập của nó là thứ làm cho một
  audit L4 có ý nghĩa: nó chưa tham gia vào các giai đoạn review trước đó.
- Chạy Codex trên công việc thường lệ làm xói mòn tín hiệu đó. Nếu mọi thứ đều được "audited," một audit
  thôi không còn nghĩa là "đây là rủi ro cao và đã được soi xét độc lập."
- Các lần gọi bên ngoài tốn ngân sách và thời gian. Dành chúng cho công việc L4 thực sự giữ cho
  auditor sẵn sàng khi nó thực sự quan trọng.

## Quy tắc bảo tồn nó

**CODEX GUARD**: Codex chỉ chạy **ở L4**, không bao giờ ở L1/L2/L3, và Work Order không được
thổi phồng lên L4 để có thêm review. L4 giới hạn ở các thay đổi thực sự rủi ro cao
(auth, authz, bảo mật trọng yếu, thanh toán, migration dữ liệu trọng yếu, core runtime
có tác động toàn hệ thống, một bản phát hành production lớn, hoặc một xung đột reviewer không thể giải quyết).

Vì Codex là reviewer *cuối cùng* trong pipeline L4
(claude → deepseek → qwen → gemini → codex), các reviewer trước đó đóng vai trò bộ lọc: hầu hết
các defect được bắt và sửa trước audit, nên bản thân audit giữ được tập trung và
ngắn gọn.

## Các thực hành giữ các lần gọi Codex gọn nhẹ

1. **Đúng mức trước tiên.** Soạn Work Order ở mức đúng thấp nhất bằng skill
   review-routing; chỉ công việc rủi ro cao thực sự mới tới L4.
2. **Giải quyết các finding chặn trước audit.** Dọn các finding CRITICAL/HIGH từ
   DeepSeek, Qwen, và Gemini trước, để Codex review một thay đổi sạch, đã hội tụ thay vì
   một work-in-progress.
3. **Giới hạn vào delta.** Áp dụng skill git-delta-review để context của audit là
   thay đổi, không phải toàn bộ repository.
4. **Redact secret.** Không bao giờ gửi credential tới một reviewer bên ngoài (xem
   secret-hygiene); điều này bảo vệ cả bảo mật lẫn đầu vào audit sạch.
5. **Không gộp một cách nhân tạo.** Không gói các thay đổi không liên quan vào một WO L4 để
   "tiết kiệm" một audit; điều đó phá hỏng review giới hạn theo delta.

## Anti-pattern

Leo lên L4 "cho chắc" trên một thay đổi không rủi ro cao. Điều này tiêu tốn auditor,
làm chậm WO, và — theo thời gian — huấn luyện team coi L4 là thường lệ. Khi phân vân
giữa L3 và L4, mặc định chọn L3 trừ khi một tiêu chí rủi ro cao được liệt kê rõ ràng áp dụng.
