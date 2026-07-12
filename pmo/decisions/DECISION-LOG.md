# AIEP Decision Log

Bản ghi theo thứ tự thời gian của các quyết định trọng yếu. Các quyết định kiến trúc còn có một
ADR dưới `docs/adr/`.

| # | Ngày | Quyết định | Lý do | Tham chiếu |
|---|------|----------|-----------|-----|
| D-01 | 2026-07-12 | Runtime = Node.js ESM, zero runtime dependencies | Cài đặt offline, bề mặt chuỗi cung ứng nhỏ, một runtime cho CLI+dashboard+đóng gói | ADR-0001 |
| D-02 | 2026-07-12 | Áp dụng các review level L1–L4 với pipeline reviewer cho từng cấp | Nỗ lực review tỉ lệ với rủi ro; định tuyến machine-readable | ADR-0002 |
| D-03 | 2026-07-12 | Giới hạn Codex ở L4 (guard phòng thủ theo chiều sâu) | Bảo tồn token audit bên ngoài khan hiếm; tránh làm nghẽn bàn giao | ADR-0003 |
| D-04 | 2026-07-12 | Work Order = Markdown + frontmatter có kiểm soát; artifact + decision.json ở dạng JSON | Lập kế hoạch human-readable, bằng chứng machine-readable | ADR-0001 |
| D-05 | 2026-07-12 | Backend reviewer có thể cắm (pluggable) với suy giảm nhẹ nhàng (quyết định tích hợp) | Báo cáo trung thực khi backend vắng mặt; không bao giờ giả một lượt pass | Review Level Policy |
| D-06 | 2026-07-12 | Dashboard chỉ đọc dữ liệu sinh trực tiếp | Không trình bày số liệu demo như dữ liệu production | Architecture Freeze v1.0 |
| D-07 | 2026-07-12 | Pull `deepseek-coder:1.3b` cục bộ để bật review cục bộ kép thật | Ollama chỉ có `qwen3:8b`; một model DeepSeek nhỏ cho phép review mã cục bộ L2/L3 thật sự mà không tốn chi phí cloud | Doctor / R-02 |
| D-08 | 2026-07-12 | Không Work Order v1.0 nào được gán L4 | Không cái nào đạt ngưỡng rủi ro cao; không thổi phồng cấp để tăng độ sâu review | Review Level Policy |
| D-09 | 2026-07-12 | Thêm `aiep init` (WO-0108) sau v1.0 theo yêu cầu Product Owner | Cho phép AIEP quản trị bất kỳ dự án nào, không chỉ repo của chính nó; giải quyết giới hạn v1.0 đã ghi nhận. Review L2 (DeepSeek hoàn tất, Qwen suy giảm/được dispositioned); một CRITICAL false-positive của DeepSeek đã được đối chiếu với mã nguồn + test và bị bác bỏ | WO-0108 |
| D-10 | 2026-07-12 | RFC-0002 (AI coding agent) + PoC `aiep plan` (WO-0109) | Ghi tài liệu việc tích hợp idea→code→audit→deploy (ứng viên v2.0) và phát hành phần đầu trong phạm vi (idea→draft Work Order) mà không vượt Scope Lock (không sinh mã/deploy). Review L2; CRITICAL false-positive của DeepSeek (xử lý lỗi) bị bác bỏ sau khi đối chiếu mã nguồn; Qwen suy giảm/được dispositioned | RFC-0002, WO-0109 |
| D-11 | 2026-07-12 | Tài liệu & giao diện AIEP viết bằng tiếng Việt (theo yêu cầu PO) | PO cần đọc/duyệt; SOP-005 viết lại tiếng Việt (WO-0110), dashboard Việt hóa (WO-0111). Giữ English cho command/tên file/config key/thuật ngữ. Tài liệu tiếng Anh cũ dịch dần theo ưu tiên. Đồng thời dọn WO-0500 (rác do test-race, đã sửa withTempDir) | WO-0110, WO-0111 |
