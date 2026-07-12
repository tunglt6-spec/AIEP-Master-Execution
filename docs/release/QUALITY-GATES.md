# AIEP Quality Gates

Các quality gate được thực thi bởi `aiep validate` (xem `src/cli/validate.js`).
Một release candidate phải vượt qua mọi gate mức FAIL; các gate mức WARN cần một
disposition có tài liệu.

| # | Gate | Mức | Kiểm tra điều gì |
|---|------|-------|----------------|
| 1 | Tài liệu bắt buộc đầy đủ | FAIL | PROJECT/README/CHANGELOG + Constitution, Governance, Review Level Policy, Scope Lock, Architecture Freeze, Product Backlog, Decision Log, Risk Register |
| 2 | Work Order đầy đủ & hợp lệ | FAIL | Mọi WO parse được và mang một `reviewLevel` hợp lệ cùng các trường bắt buộc |
| 3 | Codex guard | FAIL | Không có artifact `codex-audit.md` ở bất kỳ Work Order không phải L4 nào |
| 4 | Tính đầy đủ của artifact | FAIL | Các WO đã review chứa những artifact bắt buộc theo cấp của chúng |
| 5 | Không còn CRITICAL chưa xử lý | FAIL | Tổng số finding CRITICAL trên toàn bộ `decision.json` bằng không |
| 6 | Không còn HIGH chưa xử lý | WARN | Các finding HIGH cần một disposition có tài liệu |
| 7 | Không commit secret | FAIL | Quét secret trên các tệp được theo dõi (tracked) là sạch |
| 8 | Scope Lock được tôn trọng | FAIL | Không có bề mặt v2.0 ngoài phạm vi nào hiện diện |

## Cách chạy

```bash
aiep validate          # human-readable
aiep validate --json   # machine-readable; exit code 1 on any FAIL
```

## Diễn giải kết quả

- **Tất cả gate FAIL đều pass** → repository đạt mức sẵn sàng phát hành xét theo các gate.
- **Có WARN** → chỉ được phép phát hành khi có disposition được ghi lại trong
  Decision Log hoặc Work Order liên quan.
