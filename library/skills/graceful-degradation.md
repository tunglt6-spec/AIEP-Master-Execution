# Skill: Graceful Degradation của Reviewer Backend

**Type:** Quy trình kỹ thuật lặp lại được (SOP)
**Goal:** Khi một reviewer backend không khả dụng (Ollama không chạy, model chưa pull,
network reviewer không tới được), không bao giờ thất bại âm thầm và không bao giờ bỏ qua review vô hình.
Ghi một **disposition** tường minh, được ghi lại để quyết định vẫn có thể truy vết.

## Vì sao

DeepSeek và Qwen chạy cục bộ qua Ollama; Gemini và Codex ở bên ngoài. Bất kỳ cái nào trong số này
có thể tạm thời không khả dụng. Một review âm thầm bỏ rơi một reviewer tạo ra một
"passed" sai và phá vỡ đảm bảo governance. Sự suy giảm phải hữu hình.

## Dispositions (chọn đúng một cho mỗi reviewer không khả dụng)

| Disposition | Ý nghĩa | Khi nào phù hợp |
|-------------|---------|------------------|
| `SKIPPED_UNAVAILABLE` | Không tới được backend; review không được thực hiện. | Backend tắt và WO đủ rủi ro thấp để tiến hành với một lỗ hổng được ghi lại. |
| `DEFERRED` | Review bị hoãn; WO không thể pass cho tới khi reviewer chạy. | Bất kỳ bước design/audit L3/L4 nào, hoặc thay đổi có rủi ro chặn. |
| `SUBSTITUTED` | Một reviewer dự phòng được ghi lại đã chạy thay vào đó. | Chỉ nếu một lăng kính tương đương khả dụng; phải được nêu tên. |

Ghi disposition đã chọn, lý do, và một timestamp trong artifact của reviewer
và trong `decision.json`. Không bao giờ bịa ra finding cho một reviewer không chạy.

## Quy trình

1. **Probe trước khi gọi.** Kiểm tra backend tới được (ví dụ Ollama phản hồi,
   model hiện diện). Dùng `aiep doctor` để làm nổi tình trạng môi trường.
2. **Khi không khả dụng, phân loại rủi ro.** Đọc `reviewLevel` của WO và các ghi chú rủi ro.
3. **Gán một disposition** từ bảng. Với L4 hoặc bất kỳ thay đổi có rủi ro chặn nào, ưu tiên
   `DEFERRED` hơn `SKIPPED_UNAVAILABLE` — công việc rủi ro cao không được pass với một lỗ hổng.
4. **Ghi disposition** vào file artifact kỳ vọng (ví dụ một `qwen-review.md`
   nêu `disposition: SKIPPED_UNAVAILABLE` kèm lý do) để tập artifact
   cho mức đó vẫn đầy đủ và trung thực.
5. **Phản ánh nó trong summary.** `review-summary.md` liệt kê mọi reviewer bị degraded và
   disposition của nó; một reviewer `DEFERRED` nghĩa là verdict không thể là PASSED.

## Definition of done

Mọi reviewer mà mức của WO yêu cầu đều có hoặc một review thực sự hoặc một disposition
được ghi lại. Không reviewer nào thiếu mà không có giải thích, và không reviewer thiếu nào
được tính là một pass.
