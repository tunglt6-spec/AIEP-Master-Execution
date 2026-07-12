---
title: "AIEP v1.0 — Đặc tả Thiết kế"
status: Frozen (Architecture Freeze v1.0)
audience: Engineering, Architecture Review Board
---

# AIEP v1.0 — Đặc tả Thiết kế

AIEP (AI Engineering Platform) là một nền tảng kỹ thuật do governance dẫn dắt, chạy review
code đa cấp có hỗ trợ AI, theo dõi việc giao hàng qua một PMO nhẹ, tuyển chọn một thư viện
AI engineering tái sử dụng được, và phơi bày trạng thái nền tảng trên một dashboard tĩnh.

Tài liệu này là tham chiếu thiết kế có thẩm quyền cho v1.0. Nó được giới hạn phạm vi bởi
các tài liệu governance **Scope Lock v1.0** và **Architecture Freeze v1.0**: các ranh giới
module và hợp đồng dữ liệu được mô tả ở đây đã bị đóng băng cho dòng v1.0.

---

## 1. Mục tiêu & Phi mục tiêu

### 1.1 Mục tiêu

- **Review được quản trị, không theo cảm tính.** Mỗi Work Order mang đúng một ReviewLevel
  (L1–L4), giá trị này phân giải một cách tất định (deterministic) rằng những reviewer nào
  phải chạy.
- **Local-first, zero-dependency.** Nền tảng chạy trên Node.js (>=18) ESM chỉ dùng các
  built-in của Node. Không có runtime `dependencies` nào được khai báo trong `package.json`.
  Nó đa nền tảng (Windows / macOS / Linux).
- **Kỷ luật token.** Các review vận hành trên git change delta, không phải toàn bộ cây, và
  auditor bên ngoài đắt đỏ (Codex) được dành riêng cho chỉ L4 qua một guard cứng.
- **Graceful degradation.** Một mô hình local hoặc CLI bị thiếu không bao giờ làm sập một
  review; nó được ghi lại như một integration decision được lập tài liệu và pipeline tiếp
  tục.
- **Artifact có thể audit.** Mỗi review ghi ra Markdown bền vững cho từng reviewer cộng với
  một `decision.json` máy đọc được dưới `.aiep/artifacts/<WO-ID>/`.
- **Không commit secret.** Việc quét secret chạy cả trên review delta lẫn như một quality
  gate phát hành.

### 1.2 Phi mục tiêu (Scope Lock v1.0 — không bao giờ xây dựng trong dòng này)

Nền tảng đa repo, AI Council, Labs repo, đa tổ chức (multi-org), trình quản lý license
doanh nghiệp, platinum governance, nền tảng tuân thủ (compliance) đầy đủ, và bất kỳ tính
năng v2.0 nào. Lệnh `validate` chủ động thất bại nếu các bề mặt ngoài phạm vi (ví dụ
`labs/`, `multi-org/`, `ai-council/`) xuất hiện trong repository.

---

## 2. Năm Deliverable Sản phẩm (toàn bộ phạm vi v1.0)

1. **Core Repository** — CLI `aiep`, các module core và reviewer (`src/`, `bin/`).
2. **Documentation System** — governance, constitution, các ADR, SOP dưới `docs/`.
3. **AI Engineering Library** — prompt, skill, cấu hình MCP, tri thức tái sử dụng được dưới `library/`.
4. **PMO** — Work Order, backlog, quyết định, rủi ro, sprint dưới `pmo/`.
5. **Dashboard** — một view HTML/CSS/JS tĩnh của trạng thái nền tảng thực dưới `dashboard/`.

**Rule of Three** chi phối chất lượng deliverable: một deliverable quan trọng nên tạo ra
một Code Asset, một Knowledge Asset, và một Standard Asset (pattern / checklist / SOP /
prompt / template / lesson-learned) — chỉ những asset thực sự tái sử dụng được, không có
đồ độn (filler).

---

## 3. Kiến trúc Tổng quan

```
                          ┌──────────────────────────┐
   $ aiep <cmd> [opts] ──▶ │  bin/aiep.js (entry)      │
                          │  → src/cli/index.js        │  CLI DISPATCHER
                          │    (COMMANDS map + help)   │
                          └────────────┬───────────────┘
              ┌───────────┬────────────┼────────────┬───────────┬──────────┐
              ▼           ▼            ▼            ▼           ▼          ▼
           status     validate      review      artifacts    doctor   dashboard / package
              │           │            │            │           │          │
              ▼           ▼            ▼            ▼           ▼          ▼
   ┌───────────────────────────────────────────────────────────────────────────┐
   │ CORE MODULES (src/core/)                                                    │
   │  paths ─ config ─ frontmatter ─ workorders ─ gitdelta ─ reviewMatrix ─      │
   │  secrets ─ logger                                                           │
   └───────────────────────────────┬───────────────────────────────────────────┘
                                    │ resolvePipeline(level) + change delta
                                    ▼
   ┌───────────────────────────────────────────────────────────────────────────┐
   │ REVIEW ROUTER (src/reviewers/index.js)                                      │
   │   for each reviewer in pipeline → dispatch → collect findings               │
   │                                                                             │
   │   claude(self) ─▶ deepseek(ollama) ─▶ qwen(ollama) ─▶ gemini(cli) ─▶ codex  │
   │        L1            L2 ───────────────┘     L3 ────────┘      L4 (guarded)  │
   └───────────────────────────────┬───────────────────────────────────────────┘
                                    ▼
   ┌───────────────────────────────────────────────────────────────────────────┐
   │ ARTIFACTS  .aiep/artifacts/<WO-ID>/                                         │
   │   claude-self-review.md, deepseek-review.md, qwen-review.md,                │
   │   gemini-review.md (L3+), codex-audit.md (L4), review-summary.md (L2+),     │
   │   decision.json                                                             │
   └───────────────────────────────────────────────────────────────────────────┘

   DASHBOARD PATH:
     aiep dashboard [--build] ─▶ src/dashboard/build.js
        aggregates: work orders + decision.json + validate + doctor + git
        writes: dashboard/data/dashboard.json
     aiep dashboard (serve)   ─▶ built-in node:http static server @ 127.0.0.1:4173
        serves dashboard/ (static HTML/CSS/JS reads dashboard.json)
```

---

## 4. Trách nhiệm các Module

### 4.1 Core (`src/core/`)

| Module | Trách nhiệm |
| --- | --- |
| `paths.js` | Phân giải repo root bằng cách đi ngược lên tới `.aiep/config.json` gần nhất; dựng bản đồ đường dẫn chuẩn tắc (`artifacts`, `workOrders`, `docs`, `library`, `dashboard`, …). |
| `config.js` | Tải và cache `.aiep/config.json`; phơi bày `reviewersForLevel(config, level)`. |
| `frontmatter.js` | Trình phân tích không dependency cho một tập con YAML frontmatter phẳng **được kiểm soát** (scalar, chuỗi trong dấu nháy, danh sách nội dòng `[a,b]` và danh sách khối). Cố ý không phải là một trình phân tích YAML tổng quát. |
| `workorders.js` | Khám phá, phân tích và validate các Work Order; thực thi các trường bắt buộc và `reviewLevel`/`status` hợp lệ; tổng hợp summary theo level/status/phase. |
| `gitdelta.js` | Tính bề mặt review: `changedFiles()` và một `diffText()` bị giới hạn kích thước (cắt cụt ở 60 KB) so với một base ref, với các phương án quay lui mượt cho cây fresh/không phải git. |
| `reviewMatrix.js` | Ánh xạ ReviewLevel → pipeline reviewer có thứ tự; sở hữu **Codex guard** (`codexAllowed`, `assertReviewerAllowed`); tính tên file artifact kỳ vọng. |
| `secrets.js` | Quét các file văn bản tìm các mẫu credential tín hiệu cao; đưa các file tự tham chiếu vào allowlist; bỏ qua binary. |
| `logger.js` | Logger ANSI tối giản, tự động tắt trên non-TTY hoặc `NO_COLOR`. |

### 4.2 Reviewers (`src/reviewers/`)

| Module | Trách nhiệm |
| --- | --- |
| `index.js` | **Review router**: phân giải pipeline, chạy từng reviewer, bắt lỗi của từng reviewer, ghi artifact, hợp nhất các finding, và phát ra `decision.json` + `review-summary.md`. |
| `claude.js` | Claude self-review (Execution Lead). Chạy các kiểm tra tự động thực trên delta: có ReviewLevel, có Definition of Done, các file đã thay đổi phân giải được trên đĩa, không có secret trong delta, delta không rỗng. |
| `ollama.js` | Các reviewer local (**DeepSeek** = code reviewer, **Qwen** = technical reviewer) qua Ollama HTTP API. Thăm dò khả năng kết nối, thay thế một mô hình đã cài nếu mô hình được cấu hình bị thiếu (được ghi lại như một integration decision), timeout an toàn. |
| `cli-reviewer.js` | Engine reviewer dùng chung dựa trên CLI: thăm dò binary trên PATH, gọi với một prompt tập trung trên delta, phân tích các finding, hoặc suy giảm với một disposition được lập tài liệu. |
| `gemini.js` | Design Reviewer (L3+), một wrapper `cli-reviewer` mỏng (`gemini -p <prompt>`). |
| `codex.js` | External Independent Auditor (chỉ L4). Gọi `assertReviewerAllowed` như phòng thủ theo chiều sâu trước khi gọi `codex exec <prompt>`. |
| `findings.js` | Phân tích các dòng `FINDING: <SEVERITY> - <desc>` từ đầu ra reviewer; đếm theo severity; phát hiện các finding blocking. |

### 4.3 CLI commands (`src/cli/`, 7 lệnh)

- `status` — summary về nền tảng, Work Order, review và phát hành (`--json`).
- `validate` — các quality gate của repository & governance; thoát khác không (non-zero) khi có bất kỳ FAIL nào.
- `review [WO-ID]` — chạy pipeline review cho một WO hoặc tất cả các WO chưa xong (`--base <ref>`, `--json`).
- `artifacts <WO-ID>` — liệt kê các artifact và tóm tắt quyết định (decision) cho một WO.
- `doctor` — chẩn đoán Node/git, config, Ollama + tính khả dụng của mô hình, các CLI reviewer, và tính hợp lệ của Codex-guard.
- `dashboard [--build]` — build `dashboard.json`; phục vụ `dashboard/` qua static server tích hợp sẵn trừ khi có `--build`/`--no-serve`.
- `package [--dry-run]` — chạy các quality gate rồi chuẩn bị một npm tarball; từ chối khi các gate thất bại trừ khi có `--force`.

### 4.4 Dashboard build (`src/dashboard/build.js`)

Tổng hợp trạng thái **thực** — các Work Order summary, `decision.json` của từng WO, kết quả
các `validate` gate, các probe của `doctor`, git branch/commit, sự hiện diện của
deliverable, và số lượng library asset — vào `dashboard/data/dashboard.json`. Không có dữ
liệu demo nào được bịa ra.

---

## 5. Luồng Dữ liệu Pipeline Review

1. **Resolve** — `cmdReview` tải config và các Work Order, rồi `resolvePipeline(config, level)`
   trả về danh sách reviewer có thứ tự cho `reviewLevel` của WO.
2. **Guard** — router lọc Codex ra khỏi pipeline trừ khi `codexAllowed(config, level)`
   là true (L4). `guardBlockedCodex` ghi lại liệu Codex có được yêu cầu nhưng bị chặn hay không.
3. **Delta** — `changedFiles(root, base)` và `diffText(root, base)` dựng ngữ cảnh review.
   Các review tập trung vào bề mặt thay đổi để giới hạn token của reviewer.
4. **Dispatch** — mỗi reviewer chạy theo thứ tự. `claude` → `deepseek`/`qwen` (Ollama) →
   `gemini` (CLI) → `codex` (CLI, L4). Bất kỳ lỗi nào được ném ra đều bị bắt và chuyển thành
   một finding HIGH duy nhất, nên một reviewer thất bại không bao giờ hủy bỏ pipeline.
5. **Persist** — artifact Markdown của mỗi reviewer được ghi ngay lập tức.
6. **Consolidate** — các finding được làm phẳng (gắn thẻ `reviewer`), đếm theo severity,
   và các finding blocking chưa giải quyết (CRITICAL/HIGH) được kiểm đếm.
7. **Decide** — `decision.json` được ghi; `verdict` là `PASS` khi không có finding blocking
   chưa giải quyết nào, ngược lại là `CHANGES_REQUESTED`. `review-summary.md` được ghi cho
   L2+.

---

## 6. Schema Artifact / `decision.json`

`decision.json` là kết quả máy đọc được, được tiêu thụ bởi `status`, `artifacts`,
`validate` và dashboard. Xem `DATA-MODEL.md` để có tham chiếu trường đầy đủ. Cấu trúc:

```json
{
  "workOrder": "WO-0105",
  "title": "Review Matrix & Routing",
  "reviewLevel": "L3",
  "reviewers": ["claude", "deepseek", "qwen", "gemini"],
  "codexGuard": { "requiresCodex": false, "codexAllowed": false, "guardBlockedCodex": false },
  "delta": { "changedFiles": 2, "files": ["src/core/reviewMatrix.js", "src/reviewers/index.js"] },
  "severityCounts": { "CRITICAL": 0, "HIGH": 0, "MEDIUM": 1, "LOW": 0, "INFO": 3 },
  "findings": [ { "severity": "MEDIUM", "message": "...", "reviewer": "qwen" } ],
  "unresolvedBlockingCount": 0,
  "reviewerStatuses": [ { "reviewer": "claude", "status": "completed", "model": null } ],
  "verdict": "PASS"
}
```

Các artifact cho mỗi WO tại `.aiep/artifacts/<WO-ID>/`: `claude-self-review.md`,
`deepseek-review.md`, `qwen-review.md`, `gemini-review.md` (L3+), `codex-audit.md` (L4),
`review-summary.md` (L2+), và `decision.json`.

---

## 7. Codex Guard

Codex là **External Independent Auditor** và **không bao giờ là reviewer mặc định**. Nó chỉ
có thể chạy ở ReviewLevel **L4**. Guard được thực thi tại ba lớp độc lập (phòng thủ theo
chiều sâu):

1. **Configuration** — `.aiep/config.json` khai báo `codexGuard.allowedLevels: ["L4"]`,
   và `reviewers.codex.restrictedToLevel: "L4"`.
2. **Router** — `runReview` lọc Codex khỏi pipeline hiệu lực bất cứ khi nào
   `codexAllowed(config, level)` là false, đặt `guardBlockedCodex` trong quyết định (decision).
3. **Reviewer** — `runCodexReviewer` gọi `assertReviewerAllowed(config, 'codex', level)`,
   hàm này **ném lỗi (throws)** dưới L4, nên Codex không thể được gọi ngay cả khi bị gọi trực tiếp.

Một kiểm tra thứ tư, offline, nằm trong các quality gate: `validate` thất bại nếu một
artifact `codex-audit.md` tồn tại cho bất kỳ Work Order không phải L4 nào, và `doctor` xác
minh guard là chỉ `L4`.

Lý do: các reviewer L4 tốn token và được dành riêng cho những thay đổi thực sự rủi ro cao
(auth/authz, bảo mật quan trọng, thanh toán, di trú dữ liệu quan trọng, core runtime có tác
động toàn hệ thống, phát hành production lớn, hoặc xung đột reviewer không thể giải quyết).
Các Work Order không được thổi phồng lên L4 chỉ để có thêm review. Xem `RFC-0001`.

---

## 8. Xử lý Lỗi & Graceful Degradation

- **Cấp cao nhất.** `bin/aiep.js` bắt bất kỳ lệnh bị từ chối (rejected) nào, in `✗ aiep: <message>`,
  và đặt một mã thoát khác không. Các lệnh không xác định in hướng dẫn và thoát khác không.
- **Cô lập từng reviewer.** Router bọc mỗi `dispatch` trong try/catch; một lỗi được ném ra
  trở thành một finding HIGH và một artifact trạng thái `error` — các reviewer còn lại vẫn
  chạy.
- **Backend không khả dụng (integration decisions).** Khi Ollama không thể kết nối, mô hình
  được cấu hình bị thiếu (không có phương án quay lui), hoặc một CLI reviewer vắng mặt khỏi
  PATH, reviewer trả về trạng thái **`degraded`** với một disposition được lập tài liệu thay
  vì một khối cứng. Các lỗ hổng cấp phát được xem là mối lo về môi trường, không phải khiếm
  khuyết code.
- **Timeout.** Việc sinh của Ollama và các CLI reviewer bị giới hạn (mặc định 180 s; probe
  khả năng kết nối Ollama 4 s), có thể điều chỉnh qua `AIEP_OLLAMA_TIMEOUT_MS` / `AIEP_CLI_TIMEOUT_MS`.
- **Quay lui của git.** `gitdelta` suy giảm gọn gàng cho các cây không phải git và các repo
  fresh không có HEAD, trả về một delta rỗng hoặc toàn cây thay vì báo lỗi.
- **Severity của gate.** Trong `validate`, các FAIL đặt một mã thoát khác không; các finding
  HIGH chưa giải quyết là một WARN (yêu cầu disposition được lập tài liệu) và bản thân chúng
  không làm thất bại bản build.

---

## 9. Các Cân nhắc Bảo mật

- **Quét secret.** `secrets.js` quét các file văn bản theo các mẫu tín hiệu cao
  (API/secret key, `Authorization: Bearer`, AWS `AKIA…`, GitHub `gh*_…`, `sk-…`, Google
  `AIza…`, PEM private key). Nó chạy cả bên trong Claude self-review (trên delta — một cú
  trúng là một finding CRITICAL) và như gate "No secrets committed" của `validate` (một FAIL).
- **Không commit secret.** Các file binary bị bỏ qua; chính file định nghĩa của scanner và
  `.aiep/config.json` được đưa vào allowlist để tránh tự gắn cờ.
- **Gia cố static server.** Dashboard server chỉ gắn vào `127.0.0.1`, chuẩn hóa các đường
  dẫn yêu cầu, và từ chối bất kỳ đường dẫn nào thoát ra khỏi `dashboard/` root được phục vụ (403).
- **I/O bên ngoài có giới hạn.** Các prompt của reviewer chỉ mang diff bị giới hạn kích
  thước; mọi lời gọi tiến trình bên ngoài và HTTP đều được khép trong thời gian (time-boxed).
- **Bề mặt tối thiểu.** Zero runtime dependency loại bỏ rủi ro chuỗi cung ứng của bên thứ
  ba cho dòng v1.0.

---

## 10. Các Ràng buộc Đóng băng (Architecture Freeze v1.0)

- Node.js ESM, chỉ built-in, zero runtime dependency.
- CLI entry `bin/aiep.js` → `src/cli/*`; core trong `src/core/*`; reviewer trong `src/reviewers/*`.
- Dữ liệu là Markdown + YAML frontmatter phẳng được kiểm soát; config là JSON.
- Ma trận ReviewLevel (L1–L4) và Codex-L4-only guard là các hợp đồng cố định.
- Bất kỳ thay đổi nào đối với các ranh giới này là mối lo của v2.0 và ngoài phạm vi đối với v1.0.
