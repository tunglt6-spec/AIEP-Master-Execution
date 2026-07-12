# AIEP Issues

Các issue được theo dõi cho v1.0. Các issue đã giải quyết được giữ lại để audit.

| ID | Tiêu đề | Severity | Trạng thái | Cách giải quyết |
|----|-------|----------|--------|------------|
| I-01 | Ollama không có model DeepSeek, chỉ có qwen3:8b | Medium | Resolved | Đã pull `deepseek-coder:1.3b`; doctor nay báo cáo cả hai model đã cài (D-07) |
| I-02 | CLI Gemini & Codex chưa được cài trong môi trường build | Low | Open (disposition theo thiết kế) | Suy giảm nhẹ nhàng ghi lại các quyết định tích hợp; không block cho L1–L3; dự phòng để bật đầy đủ L3/L4 |
| I-03 | Repo mới chưa có HEAD, nên `aiep status` hiển thị branch UNKNOWN | Low | Resolved | Được giải quyết sau commit đầu tiên; các git helper xử lý trường hợp branch chưa sinh (unborn) |

## Giới hạn đã biết (v1.0)

- Việc trích xuất finding từ model cục bộ là best-effort (các dòng có cấu trúc `FINDING:`);
  output thô luôn được lưu giữ trong artifact.
- Gemini/Codex cần có CLI trên PATH; nếu vắng, các bước của chúng là disposition được ghi thành tài liệu.
