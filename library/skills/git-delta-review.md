# Skill: Git Delta Review

**Type:** Quy trình kỹ thuật lặp lại được (SOP)
**Goal:** Tập trung mọi reviewer vào *change delta* của một Work Order, không phải toàn bộ
repository, để review chính xác, nhanh, và không nhiễu bởi code không liên quan.

## Vì sao

Review toàn bộ cây cho mỗi Work Order chôn vùi các finding thực sự dưới các bình luận về code
không thay đổi, lãng phí năng lực reviewer, và tạo ra các summary khó
hành động. Review của AIEP được giới hạn vào những gì WO thực sự thay đổi.

## Inputs

- Work Order và branch liên quan hoặc các thay đổi đã staged.
- Một merge base / điểm so sánh cho thay đổi.

## Quy trình

1. **Thiết lập delta.** Xác định tập các file và hunk đã thay đổi cho WO
   so với base của nó. Ưu tiên phép so sánh đúng nhỏ nhất (các thay đổi đã staged, hoặc
   branch so với base của nó).
2. **Giới hạn context review.** Cung cấp cho reviewer diff cùng chỉ context xung quanh tối thiểu
   cần để hiểu mỗi hunk (function/module mà hunk nằm trong đó).
   Không dán các file không liên quan.
3. **Chỉ dẫn scope tường minh.** Mỗi prompt reviewer nêu "Review ONLY the change
   delta" (các prompt DeepSeek/Qwen/Gemini đã làm việc này).
4. **Cho phép mở rộng có chủ đích.** Nếu một thay đổi trong delta ngụ ý một defect trong code
   liền kề không thay đổi (ví dụ một caller giờ truyền sai đối số), reviewer có thể tham chiếu
   code đó — nhưng phải buộc finding trở lại delta.
5. **Quy finding về các vị trí trong delta.** Mỗi finding trích dẫn một file và line/region
   bên trong (hoặc bị liên đới trực tiếp bởi) delta.

## Các anti-pattern cần tránh

- Review code có sẵn không liên quan tới WO (scope creep kiểu "nhân tiện đang ở đây").
- Nêu lại các vấn đề tồn tại lâu mà WO không đụng tới (mở một WO riêng thay vào đó).
- Đưa cho reviewer toàn bộ repository làm context.

## Definition of done

Các artifact của reviewer chỉ tham chiếu các vị trí trong delta (hoặc code bị delta liên đới), và
review summary dễ đọc vì nó được giới hạn vào những gì WO đã thay đổi.
