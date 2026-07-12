# ADR-0002 — Review Level Policy (L1–L4)

- **Trạng thái:** Accepted
- **Ngày:** 2026-07-12
- **Người quyết định:** Execution Lead (phê chuẩn theo Architecture Freeze v1.0)

## Bối cảnh

AIEP phải áp dụng nỗ lực review tương xứng với rủi ro. Review quá ít thì để lọt lỗi;
review quá nhiều thì lãng phí năng lực của reviewer (đặc biệt là năng lực audit bên ngoài
vốn khan hiếm). Có sẵn nhiều AI reviewer với những thế mạnh riêng biệt.

## Quyết định

Áp dụng bốn review level, mỗi level ánh xạ tới một pipeline reviewer có thứ tự:

| Level | Pipeline |
|-------|----------|
| L1 | claude |
| L2 | claude → deepseek → qwen |
| L3 | claude → deepseek → qwen → gemini |
| L4 | claude → deepseek → qwen → gemini → codex |

Ánh xạ này nằm trong `.aiep/config.json` (`reviewLevels`) và được phân giải bởi
`src/core/reviewMatrix.js`. Các reviewer chạy theo thứ tự và mỗi reviewer ghi một artifact.
Các finding sử dụng CRITICAL/HIGH/MEDIUM/LOW/INFO; CRITICAL/HIGH là các mức blocking.

## Hệ quả

- Một bảng định tuyến duy nhất, máy đọc được, điều khiển `aiep review`, phần validation và
  dashboard.
- Việc thêm hoặc sắp xếp lại reviewer là một thay đổi config, không phải thay đổi code.
- Các level được gán theo rủi ro, không theo mong muốn về mức độ kỹ lưỡng; việc thổi phồng
  mức (inflation) bị chính sách ngăn cản và không được quy trình tưởng thưởng.

## Các phương án đã cân nhắc

- **Một pipeline bắt buộc duy nhất cho mọi thay đổi:** đơn giản nhưng lãng phí và chậm.
- **Chọn reviewer tự do cho từng WO:** linh hoạt nhưng không thể audit và thiếu nhất quán.
