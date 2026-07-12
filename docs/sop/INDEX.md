# Các Quy trình Vận hành Chuẩn (SOP) của AIEP

Các quy trình vận hành cho AIEP v1.0. Mỗi SOP là nguồn có thẩm quyền cho lĩnh vực của nó và trích dẫn
chính xác các lệnh CLI, artifact và tài liệu governance liên quan.

| SOP | Tiêu đề | Bao phủ |
| --- | --- | --- |
| [SOP-001](./SOP-001-work-order-lifecycle.md) | Work Order Lifecycle | Backlog → done, mô hình trạng thái, gán ReviewLevel. |
| [SOP-002](./SOP-002-review-execution.md) | Review Execution | Chạy `aiep review`, pipeline reviewer theo mức, disposition khi backend degraded, giải quyết CRITICAL/HIGH. |
| [SOP-003](./SOP-003-codex-l4-audit.md) | Codex L4 Audit | Khi nào/cách nào Codex được huy động (chỉ L4), Codex Guard, bảo tồn token. |
| [SOP-004](./SOP-004-release-preparation.md) | Release Preparation | Quality gates, `aiep validate`, `aiep package`, checklist phát hành. |
| [SOP-005](./SOP-005-ai-coding-with-aiep.md) | AI Coding with AIEP | AI agent triển khai → AIEP audit độc lập → deploy có cổng người kiểm soát (vòng lặp thủ công RFC-0002). |

## Các quy ước dùng chung trong các SOP

- **ReviewLevels:** L1 claude · L2 +deepseek,qwen · L3 +gemini · L4 +codex.
- **Codex Guard:** Codex chỉ chạy ở L4; không bao giờ thổi phồng một Work Order lên L4.
- **Severities:** CRITICAL, HIGH, MEDIUM, LOW, INFO — CRITICAL/HIGH là chặn.
- **Artifacts:** `.aiep/artifacts/<WO-ID>/` (các file theo từng reviewer, `review-summary.md`, `decision.json`).
- **Templates:** xem [../../templates/INDEX.md](../../templates/INDEX.md).
