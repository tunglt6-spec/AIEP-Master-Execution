# RFC-0002 — AIEP × AI Coding Agent ("Idea → Code → Audit → Deploy")

- **Trạng thái:** Proposed (ứng viên v2.0 — bản thân nó KHÔNG mở phạm vi v2.0)
- **Ngày:** 2026-07-12
- **Tác giả:** Execution Lead
- **Liên quan:** ADR-0002 (Review Levels), ADR-0003 (Codex guard), WO-0109

## Tóm tắt

Tích hợp một **AI coding agent** bên ngoài (đôi "bàn tay" viết code) với AIEP (lớp
governance + audit + release) để một vòng lặp duy nhất có thể đi từ một ý tưởng đến một
bản triển khai (deployment) đã được review, đã qua gate, được con người phê duyệt. Ngày
nay bản thân AIEP không sinh code; RFC này định nghĩa cách một agent cắm vào mà không làm
suy yếu tính độc lập và các bảo đảm human-gating của AIEP.

## Động lực

AIEP v1.x audit và quản trị các thay đổi nhưng dựa vào con người (hoặc một công cụ riêng)
để viết code. Các đội ngày càng dùng nhiều AI coding agent. Ghép cặp chúng lại tạo ra một
vòng lặp "idea → code → audit → deploy" chặt chẽ **trong khi vẫn giữ reviewer độc lập với
tác giả** — thuộc tính an toàn cốt lõi khiến code do AI viết trở nên đáng tin cậy.

## Nguyên tắc cốt lõi (không thể thương lượng)

> AI VIẾT code không bao giờ được là người phán xét duy nhất về chính code đó.

AI viết; các AI **khác nhau** audit (DeepSeek/Qwen/Gemini/Codex); **con người gate deploy**.
Điều này bảo toàn ADR-0002/0003 và các bảo đảm audit của nền tảng.

## Thiết kế chi tiết

### Vai trò

| Thành phần | Vai trò | Nhà cung cấp |
|-----------|------|----------|
| Coding Agent | Sinh code từ một Work Order | Claude Code / Cursor / Aider (qua adapter) |
| AIEP Review | Audit đa mô hình độc lập (L1–L4) | DeepSeek, Qwen, Gemini, Codex |
| AIEP Gates | Quality gates, secret scan, scope lock | `aiep validate` |
| Orchestrator | vòng lặp code → review → fix | các verb `aiep` mới |
| Con người | Phê duyệt WO; gate deploy | hai gate bắt buộc |

### Luồng

```
idea → aiep plan → [HUMAN GATE #1: approve WO] → aiep implement (agent, isolated worktree)
     → aiep review (independent reviewers) → findings? → agent fixes → re-review  [bounded loop]
     → aiep validate → [HUMAN GATE #2: approve deploy] → aiep ship
```

### Bề mặt mới (v2.0)

| Verb | Mục đích |
|------|---------|
| `aiep plan "<idea>"` | Agent soạn thảo một Work Order (gợi ý ReviewLevel). *Được giao dưới dạng PoC trong WO-0109 — xem bên dưới.* |
| `aiep implement <WO>` | Agent viết code trong một **git worktree/branch biệt lập**. |
| `aiep loop <WO>` | Điều phối implement → review → fix → validate (số vòng lặp giới hạn, ngân sách token). |
| `aiep ship <WO>` | Sau khi qua gate + con người phê duyệt: merge / publish / release. |

### Hợp đồng adapter cho agent

AIEP không được hard-code một agent duy nhất. Config (`.aiep/config.json`):

```json
"codingAgent": {
  "type": "cli",
  "command": "claude",
  "model": "claude-opus-4-8",
  "workdir": "worktree",
  "maxIterations": 3,
  "tokenBudget": 500000
}
```

Giao diện mà mọi adapter phải hiện thực:
- **Đầu vào:** đặc tả Work Order + ngữ cảnh repo + (khi fix) các finding từ `decision.json`.
- **Đầu ra:** một commit/diff + một self-report (JSON).

### Guardrails

1. **Isolation** — agent làm việc trong một worktree/branch chuyên dụng; không bao giờ ghi
   vào `main`.
2. **Tính độc lập của reviewer** — các reviewer khác với coding agent; code do AI viết
   không bao giờ chỉ có L1 self-review (tối thiểu L2).
3. **Human deploy gate** — publish/merge/prod luôn yêu cầu con người phê duyệt; không bao
   giờ tự chủ (autonomous).
4. **Codex L4 guard** không đổi — chỉ những thay đổi thực sự rủi ro cao mới chạm tới Codex.
5. **Giới hạn & ngân sách** — số vòng lặp giới hạn và ngân sách token có giới hạn.
6. **Provenance** — mọi bước được ghi lại dưới dạng artifact (git + `.aiep/artifacts/`).

## PoC đã giao trong RFC này (trong phạm vi, v1.x)

`aiep plan "<idea>"` (xem `src/cli/plan.js`) soạn thảo **chỉ một Work Order**:
- Dùng một mô hình local (Ollama, tái sử dụng reviewer backend) để đề xuất tiêu đề, mục
  tiêu, deliverable và một ReviewLevel được gợi ý + lý do.
- Quay lui về một template (offline) khi mô hình không khả dụng.
- Ghi `pmo/work-orders/<WO-ID>/work-order.md` với `status: backlog` để con người review.
  **Nó không sinh mã nguồn, không build, và không deploy.**

Điều này chứng minh phần đầu "idea → Work Order có cấu trúc" của vòng lặp mà không vượt qua
Scope Lock v1.0.

## Nhược điểm

- Các mô hình local nhỏ tạo ra các bản nháp dương tính giả/chất lượng thấp → review của con
  người vẫn bắt buộc (các bản nháp là `backlog`, không được tự động phê duyệt).
- Tăng độ trễ/chi phí cho mỗi vòng lặp.
- Vòng lặp agent đầy đủ (`implement`/`loop`/`ship`) là phạm vi v2.0 thực sự.

## Các phương án đã cân nhắc

- **Để coding agent tự review** — bị bác bỏ; vi phạm nguyên tắc cốt lõi.
- **Khóa vào một nhà cung cấp duy nhất (single vendor lock-in)** — bị bác bỏ; hợp đồng
  adapter giữ cho các agent có thể cắm thay được (pluggable).
- **Deploy tự chủ (autonomous deploy)** — bị bác bỏ; xung đột với mô hình an toàn
  human-gate.

## Áp dụng / triển khai

1. (Hiện tại, v1.x) PoC `aiep plan` — WO-0109.
2. (v2.0) `aiep implement` + hợp đồng adapter đằng sau một feature flag.
3. (v2.0) Orchestrator `aiep loop` với các giới hạn.
4. (v2.0) `aiep ship` với human gate bắt buộc.

## Câu hỏi mở

- Vòng đời worktree và chính sách dọn dẹp.
- Cách serialize các finding trở lại cho các agent tùy ý một cách tốt nhất.
- Hạch toán ngân sách xuyên suốt agent + các reviewer.
- Liệu `implement` có nên nhắm tới một PR thay vì một branch local theo mặc định hay không.
