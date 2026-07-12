# AIEP Risk Register

Thang độ nghiêm trọng × khả năng xảy ra: Low / Medium / High.

| ID | Risk | Khả năng | Tác động | Biện pháp giảm thiểu | Trạng thái |
|----|------|-----------|--------|------------|--------|
| R-01 | Backend reviewer (Gemini/Codex CLI) không khả dụng trong một môi trường | High | Medium | Suy giảm nhẹ nhàng với quyết định tích hợp có tài liệu; doctor báo cáo tính khả dụng; không phải block cứng cho L1–L3 | Mitigated |
| R-02 | Model DeepSeek/Qwen chưa được cài trong Ollama | Medium | Medium | Probe tính khả dụng + fallback model với việc thay thế được ghi lại; `ollama pull` được ghi tài liệu trong output của doctor | Mitigated |
| R-03 | Frontmatter parser quá dễ dãi/quá nghiêm với input biên | Medium | Medium | Tập con có kiểm soát + unit test; template ràng buộc input | Mitigated |
| R-04 | Codex bị gọi nhầm dưới L4 (lãng phí token) | Low | High | Guard phòng thủ theo chiều sâu (matrix + reviewer + router + validation) với test | Mitigated |
| R-05 | Secret bị commit nhầm | Low | High | Trình quét secret trong self-review và `aiep validate`; `.gitignore` cho env/key | Mitigated |
| R-06 | Scope creep hướng tới các tính năng v2.0 | Medium | Medium | Scope Lock v1.0 với tripwire theo thư mục được thực thi bởi validation | Mitigated |
| R-07 | Output model cục bộ không parse được bằng máy | Medium | Low | Giao thức có cấu trúc `FINDING:` với output thô được lưu giữ; parser best-effort có fallback | Accepted |
| R-08 | Khác biệt path/shell giữa các nền tảng | Medium | Medium | Node built-in, path join, probe `where`/`which`; đã test trên Windows | Mitigated |
