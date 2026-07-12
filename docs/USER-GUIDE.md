# AIEP — Tài liệu Hướng dẫn Sử dụng (v1.0)

Tài liệu này hướng dẫn cài đặt và sử dụng **AIEP (AI Engineering Platform)** một
cách chi tiết. Các command, tên file, config key và thuật ngữ kỹ thuật giữ nguyên
tiếng Anh.

> Tóm tắt nhanh: AIEP là một CLI Node.js **zero-dependency** giúp quản trị công
> việc kỹ thuật bằng **Work Order**, chạy **AI code review đa cấp (L1–L4)**, lưu
> **evidence (artifacts)**, và hiển thị trạng thái qua **dashboard**.

---

## Mục lục

1. [Yêu cầu hệ thống](#1-yêu-cầu-hệ-thống)
2. [Cài đặt](#2-cài-đặt)
3. [Khái niệm cốt lõi](#3-khái-niệm-cốt-lõi)
4. [Cấu trúc thư mục](#4-cấu-trúc-thư-mục)
5. [Tổng quan CLI](#5-tổng-quan-cli)
6. [Chi tiết từng lệnh](#6-chi-tiết-từng-lệnh)
7. [Review Level Policy & Codex Guard](#7-review-level-policy--codex-guard)
8. [Findings & Disposition workflow](#8-findings--disposition-workflow)
9. [Quy trình end-to-end](#9-quy-trình-end-to-end)
10. [Tạo Work Order mới](#10-tạo-work-order-mới)
11. [Cấu hình `.aiep/config.json`](#11-cấu-hình-aiepconfigjson)
12. [Environment variables](#12-environment-variables)
13. [Thiết lập Ollama (local AI review)](#13-thiết-lập-ollama-local-ai-review)
14. [Troubleshooting](#14-troubleshooting)
15. [FAQ](#15-faq)

---

## 1. Yêu cầu hệ thống

| Thành phần | Bắt buộc? | Ghi chú |
|-----------|-----------|---------|
| **Node.js >= 18** | ✅ Bắt buộc | Runtime chính. Đã test trên Node 24. |
| **git** | ✅ Bắt buộc | Dùng cho git-delta review và làm source of truth. |
| **Ollama** + model | ⭕ Tùy chọn | Cần cho DeepSeek/Qwen local review (L2+). |
| `deepseek-coder` (hoặc model khác) | ⭕ Tùy chọn | Local Code Reviewer. |
| `qwen3` (hoặc model khác) | ⭕ Tùy chọn | Local Technical Reviewer. |
| **Gemini CLI** (`gemini`) | ⭕ Tùy chọn | Design reviewer (L3+). Vắng → graceful degradation. |
| **Codex CLI** (`codex`) | ⭕ Tùy chọn | External auditor (chỉ L4). Vắng → graceful degradation. |

> AIEP **không có runtime dependency** — không cần `npm install` gói ngoài, chạy
> được offline. Các reviewer backend là tùy chọn: thiếu cái nào thì bước review
> đó được ghi **documented disposition** thay vì làm hỏng cả quy trình.

---

## 2. Cài đặt

### Cách 1 — Chạy trực tiếp từ source (không cài global)

```bash
cd "D:/WORKING - 2026/AI ENGINEER PLATFORM"
node bin/aiep.js --version      # kiểm tra chạy được
node bin/aiep.js doctor         # chẩn đoán môi trường
```

### Cách 2 — Cài global để dùng lệnh `aiep`

```bash
# Trong thư mục repo
npm install -g .

# Sau đó dùng ở bất kỳ đâu:
aiep --version
aiep doctor
```

Gỡ cài: `npm uninstall -g aiep`.

### Cách 3 — Cài từ tarball đã đóng gói

```bash
aiep package                       # tạo dist/aiep-1.0.0.tgz
npm install -g ./dist/aiep-1.0.0.tgz
```

### Cách 4 — Script bootstrap/install

```bash
# Windows (PowerShell)
./scripts/bootstrap.ps1            # kiểm tra môi trường + validate
./scripts/install.ps1              # cài global

# macOS / Linux
./scripts/bootstrap.sh
./scripts/install.sh
```

> Ở phần còn lại của tài liệu, ví dụ dùng `aiep <command>`. Nếu chưa cài global,
> thay bằng `node bin/aiep.js <command>`.

---

## 3. Khái niệm cốt lõi

- **Work Order (WO):** đơn vị công việc, đặt tại `pmo/work-orders/<WO-ID>/work-order.md`.
  Mỗi WO có **đúng một `reviewLevel`** (L1–L4).
- **ReviewLevel:** quyết định pipeline reviewer sẽ chạy.
- **Reviewer:** Claude (self review), DeepSeek, Qwen, Gemini, Codex.
- **Finding:** vấn đề reviewer phát hiện, phân loại `CRITICAL/HIGH/MEDIUM/LOW/INFO`.
  `CRITICAL` và `HIGH` là **blocking**.
- **Disposition:** quyết định có tài liệu để **resolve/dismiss** một finding.
- **Artifact:** bằng chứng review, lưu tại `.aiep/artifacts/<WO-ID>/`.
- **Quality gates:** tập kiểm tra do `aiep validate` thực thi.
- **Codex Guard:** cơ chế chỉ cho Codex chạy ở L4 (bảo toàn token).

---

## 4. Cấu trúc thư mục

```
.aiep/
  config.json              # cấu hình platform (reviewers, review levels, guard, secrets)
  artifacts/<WO-ID>/        # evidence review: *-review.md, review-summary.md, decision.json, dispositions.json
bin/aiep.js                # CLI entry point
src/core/                  # config, paths, frontmatter, workorders, gitdelta, reviewMatrix, secrets, dispositions
src/reviewers/             # claude, ollama, cli-reviewer, gemini, codex, findings, index (router)
src/cli/                   # status, validate, review, artifacts, doctor, dashboard, package
src/dashboard/build.js     # sinh dữ liệu dashboard thật
dashboard/                 # index.html, styles.css, app.js  (+ data/ được sinh ra, gitignored)
docs/                      # constitution, governance, design, adr, rfc, sop, release, USER-GUIDE.md
pmo/                       # backlog, sprints, milestones, work-orders, issues, risks, decisions
library/                   # prompts, skills, mcp, knowledge
templates/                 # work-order, adr, rfc, sop, review templates
scripts/                   # bootstrap.*, install.*, scaffold-workorders.mjs
test/                      # node:test suites
```

---

## 5. Tổng quan CLI

```bash
aiep <command> [options]
```

| Command | Chức năng |
|---------|-----------|
| `status` | Trạng thái platform, work order, review, release readiness |
| `validate` | Chạy quality gates |
| `review [WO-ID...]` | Chạy review pipeline theo ReviewLevel |
| `artifacts <WO-ID>` | Xem evidence review của một WO |
| `doctor` | Chẩn đoán môi trường & reviewer backends |
| `dashboard` | Build dữ liệu thật + serve dashboard |
| `package` | Kiểm tra gates & đóng gói release tarball |

**Global flags:** `--help` / `-h`, `--version` / `-v`. Hầu hết lệnh hỗ trợ
`--json` để xuất JSON (dùng cho tự động hóa/CI).

---

## 6. Chi tiết từng lệnh

### `aiep doctor`

Kiểm tra Node version, git, config, Ollama (+ model đã cài), Gemini/Codex CLI, và
xác nhận Codex guard đang được thực thi.

```bash
aiep doctor
aiep doctor --json
```

Ví dụ output:

```
AIEP Doctor
  [ok ] Node.js >= 18 — found v24.16.0
  [ok ] Ollama reachable — 2 model(s): deepseek-coder:1.3b, qwen3:8b
  [ok ] DeepSeek model (deepseek-coder:1.3b) — installed
  [!! ] Gemini CLI — design reviewer (L3+)
  [ok ] Codex guard (L4 only) — enforced
```

Dấu `!!` = degraded (không chặn L1–L3; sẽ ghi documented disposition).

### `aiep status`

```bash
aiep status
aiep status --json
```

Hiển thị: platform + Scope Lock/Architecture Freeze, git branch/commit, tổng WO và
phân bố theo ReviewLevel/status, số WO đã review + verdict, và release readiness.

### `aiep validate`

Chạy toàn bộ quality gates. **Exit code = 1** nếu có gate FAIL (WARN không làm fail).

```bash
aiep validate
aiep validate --json      # cho CI
```

9 gates: required docs · WO hợp lệ + có ReviewLevel · Codex guard · artifact
completeness · no unresolved CRITICAL · no unresolved HIGH (WARN) · no secrets ·
Scope Lock. (Chi tiết: `docs/release/QUALITY-GATES.md`.)

### `aiep review [WO-ID...]`

Chạy review pipeline theo ReviewLevel của WO. Review **tập trung vào git delta**
(diff), không gửi toàn bộ codebase cho reviewer.

```bash
aiep review WO-0105                 # review 1 WO (delta so với HEAD hiện tại)
aiep review WO-0105 --last          # review delta của commit gần nhất (HEAD~1..HEAD)
aiep review WO-0105 --base main     # review delta so với ref bất kỳ
aiep review                         # review tất cả WO chưa 'done'
aiep review WO-0101 WO-0105 --json  # nhiều WO, xuất JSON
```

**Options:**

| Option | Ý nghĩa |
|--------|---------|
| `--last` | Đặt base = `HEAD~1` (review commit mới nhất) |
| `--base <ref>` / `--base=<ref>` | Chọn base ref để so diff |
| `--json` | Xuất kết quả decision dạng JSON |

Nếu delta rỗng, CLI cảnh báo và gợi ý dùng `--last`/`--base`.

Pipeline theo level:

```
L1: claude
L2: claude → deepseek → qwen
L3: claude → deepseek → qwen → gemini
L4: claude → deepseek → qwen → gemini → codex   (chỉ khi thực sự L4)
```

Mỗi reviewer ghi 1 artifact. Kết thúc, router tổng hợp `review-summary.md` (L2+) và
`decision.json`. **Verdict = PASS** khi không còn CRITICAL/HIGH chưa xử lý; ngược
lại **CHANGES_REQUESTED**.

### `aiep artifacts <WO-ID>`

```bash
aiep artifacts WO-0105
aiep artifacts WO-0105 --json
```

Liệt kê các file artifact và tóm tắt decision: ReviewLevel, reviewers, verdict
(**post-disposition**), số finding theo severity, số unresolved blocking, số
dispositions, và trạng thái từng reviewer (`completed`/`degraded`/`error`).

### `aiep dashboard`

```bash
aiep dashboard              # build data thật + serve tại http://127.0.0.1:4173
aiep dashboard --build      # chỉ build data, không serve
aiep dashboard --port 8080  # đổi cổng
aiep dashboard --no-serve   # build, không serve
```

Dashboard đọc `dashboard/data/dashboard.json` (được sinh từ dữ liệu thật). 10 panel:
Platform Overview, Architecture Status, Release Readiness, Review Level
Distribution, Sprint Status, AI Reviewer Status, System Health, Review Findings,
Knowledge Assets, Work Order Status. Nhấn `Ctrl+C` để dừng server.

### `aiep package`

```bash
aiep package               # chạy gates → tạo dist/aiep-1.0.0.tgz
aiep package --dry-run     # xem nội dung package, không tạo tarball
aiep package --force       # đóng gói kể cả khi gates fail (không khuyến nghị)
```

Mặc định **từ chối đóng gói nếu có gate FAIL**. Kết quả: tarball trong `dist/`, kèm
lệnh cài local.

---

## 7. Review Level Policy & Codex Guard

- Gán ReviewLevel **theo rủi ro**, không nâng cấp chỉ để "review kỹ hơn".
- **L4 (và Codex)** chỉ dành cho thay đổi rủi ro cao thật sự: authentication,
  authorization, critical security, payment, critical data migration, core runtime
  ảnh hưởng hệ thống, major production release, hoặc reviewer conflict không giải
  quyết được.
- **Codex Guard:** Codex **không bao giờ** chạy ở L1/L2/L3. Được thực thi 4 lớp
  (config → `reviewMatrix.js` → `codex.js` → `validate`) và kiểm chứng bằng unit
  test — nên guard được bảo đảm mà không tốn token Codex.

Chi tiết: `docs/governance/REVIEW-LEVEL-POLICY.md`, `docs/adr/ADR-0002`, `ADR-0003`.

---

## 8. Findings & Disposition workflow

AI reviewer (đặc biệt model nhỏ) có thể tạo **false positive**. Khi một finding
`CRITICAL`/`HIGH` là sai hoặc đã được sửa, Execution Lead ghi **documented
disposition** để nó không còn tính là "unresolved".

**Bước làm:**

1. Chạy review → thấy verdict `CHANGES_REQUESTED`.
2. Xem finding: `aiep artifacts <WO-ID>` hoặc mở `.aiep/artifacts/<WO-ID>/review-summary.md`.
3. **Xác minh** finding với source code:
   - Nếu **thật** → sửa code, chạy lại `aiep review`.
   - Nếu **false positive** → tạo file disposition.

**File `.aiep/artifacts/<WO-ID>/dispositions.json`:**

```json
{
  "workOrder": "WO-0105",
  "dispositions": [
    {
      "reviewer": "deepseek",
      "severity": "CRITICAL",
      "matches": "npm test",
      "status": "dismissed",
      "rationale": "False positive: npm test chạy tốt, 23 test pass. Đã xác minh.",
      "by": "claude-execution-lead",
      "date": "2026-07-12"
    }
  ]
}
```

| Field | Bắt buộc | Ý nghĩa |
|-------|----------|---------|
| `matches` | ✅ | Chuỗi con phải xuất hiện trong message của finding |
| `status` | ✅ | `dismissed` (false positive) hoặc `fixed` (đã sửa) |
| `rationale` | ✅ | Lý do — cần rõ ràng, có thể audit |
| `reviewer` | ⭕ | Ràng buộc theo reviewer |
| `severity` | ⭕ | Ràng buộc theo severity |
| `by`, `date` | ⭕ | Người và ngày ghi disposition |

Disposition được áp dụng **tại thời điểm đọc** (validate/status/dashboard) và cũng
được ghi vào `decision.json` khi chạy lại review — không cần chạy lại model.

> Lưu ý: `matches` khớp theo chuỗi con trong message. Vì output model có tính phi
> tất định, sau khi re-review nếu message đổi, hãy cập nhật lại `matches`.

---

## 9. Quy trình end-to-end

```
Backlog → Tạo Work Order (gán ReviewLevel) → Implement → aiep review
   → Xem findings → Fix hoặc Disposition → aiep validate → git commit → Next WO
```

Ví dụ một vòng:

```bash
# 1. Cài/tạo WO (xem mục 10), implement thay đổi, commit code
git add <files> && git commit -m "feat: ..."

# 2. Review delta của commit vừa tạo
aiep review WO-0105 --last

# 3. Nếu có finding: xem chi tiết
aiep artifacts WO-0105

# 4. Sửa code HOẶC ghi dispositions.json (mục 8), rồi:
aiep validate            # phải PASS toàn bộ gate FAIL

# 5. Commit evidence
git add .aiep/artifacts/WO-0105 && git commit -m "chore(artifacts): WO-0105 review + disposition"

# 6. Cập nhật dashboard & status
aiep dashboard --build
aiep status
```

---

## 10. Tạo Work Order mới

**Cách A — dùng scaffolder (cho các WO đã định nghĩa sẵn):**

```bash
node scripts/scaffold-workorders.mjs          # tạo WO còn thiếu (idempotent)
node scripts/scaffold-workorders.mjs --force  # ghi đè
```

**Cách B — tạo thủ công từ template:**

1. Copy `templates/work-order.template.md` → `pmo/work-orders/<WO-ID>/work-order.md`.
2. Điền frontmatter (đây là phần máy đọc):

```yaml
---
id: WO-0400
title: "Tên Work Order"
phase: P2-Ops
reviewLevel: L2          # L1 | L2 | L3 | L4
status: planned          # backlog | planned | in-progress | in-review | done | blocked
owner: your-name
---
```

3. Viết body: Objective, Scope, Deliverables, Definition of Done, ReviewLevel +
   rationale, Traceability.
4. Kiểm tra: `aiep validate` (gate sẽ báo nếu frontmatter sai/thiếu ReviewLevel).

---

## 11. Cấu hình `.aiep/config.json`

| Key | Ý nghĩa |
|-----|---------|
| `platform` | name, displayName, version, scopeLock, architectureFreeze |
| `paths` | Vị trí workOrders, artifacts, docs, library, pmo, dashboard... |
| `reviewLevels` | Map L1–L4 → danh sách reviewer (thứ tự chạy) |
| `reviewers.<name>` | role, type (`self`/`ollama`/`cli`), model, endpoint, command, focus |
| `codexGuard` | `enabled`, `allowedLevels` (mặc định `["L4"]`) |
| `findingSeverities` | Danh sách severity hợp lệ |
| `blockingSeverities` | Severity chặn (mặc định `CRITICAL`, `HIGH`) |
| `secretPatterns` | Regex quét secret (hỗ trợ prefix `(?i)` cho case-insensitive) |

Đổi model local: sửa `reviewers.deepseek.model` / `reviewers.qwen.model` cho khớp
tên model trong `ollama list`.

---

## 12. Environment variables

| Biến | Mặc định | Tác dụng |
|------|----------|----------|
| `AIEP_OLLAMA_TIMEOUT_MS` | `300000` | Timeout gọi Ollama generate (ms) |
| `AIEP_OLLAMA_NUM_PREDICT` | `512` | Giới hạn số token model sinh (tăng tốc) |
| `AIEP_CLI_TIMEOUT_MS` | `180000` | Timeout gọi Gemini/Codex CLI (ms) |
| `NO_COLOR` | — | Đặt bất kỳ giá trị để tắt màu ANSI |

Ví dụ (macOS/Linux):

```bash
AIEP_OLLAMA_NUM_PREDICT=256 aiep review WO-0105 --last
```

Windows PowerShell:

```powershell
$env:AIEP_OLLAMA_NUM_PREDICT = 256; aiep review WO-0105 --last
```

---

## 13. Thiết lập Ollama (local AI review)

```bash
# 1. Cài Ollama: https://ollama.com  (rồi chạy service)
ollama serve                       # nếu chưa chạy nền

# 2. Pull model (khớp tên trong config)
ollama pull deepseek-coder:1.3b    # Local Code Reviewer (nhỏ, nhanh)
ollama pull qwen3:8b               # Local Technical Reviewer

# 3. Kiểm tra
ollama list
aiep doctor                        # phải thấy "Ollama reachable" + model installed
```

> qwen3 là "thinking model" — AIEP đã tự đặt `think: false` và giới hạn output để
> chạy ổn định. Trên CPU, review vẫn có thể mất vài phút/WO; giảm
> `AIEP_OLLAMA_NUM_PREDICT` để nhanh hơn.

Nếu model trong config không có, AIEP tự **fallback** sang model đang cài và ghi
lại quyết định thay thế trong artifact.

---

## 14. Troubleshooting

| Triệu chứng | Nguyên nhân & xử lý |
|-------------|---------------------|
| `doctor` báo **Ollama not reachable** | Chạy `ollama serve`; kiểm tra endpoint `http://127.0.0.1:11434`. |
| Reviewer **degraded — model NOT installed** | `ollama pull <model>` đúng tên trong config, hoặc để AIEP fallback. |
| Reviewer **qwen degraded / timed out** | Tăng `AIEP_OLLAMA_TIMEOUT_MS`, hoặc giảm `AIEP_OLLAMA_NUM_PREDICT`. |
| **Gemini/Codex** báo degraded | CLI chưa cài/không trên PATH. Không chặn L1–L3; là documented disposition. |
| `review` báo **No change delta detected** | Working tree sạch. Dùng `--last` hoặc `--base <ref>`. |
| `validate` **FAIL: No unresolved CRITICAL** | Có finding CRITICAL chưa xử lý → xác minh rồi fix hoặc ghi `dispositions.json` (mục 8). |
| **False positive** từ model nhỏ | Bình thường với model 1–2B. Xác minh với source rồi `dismissed`. |
| `package` lỗi **npm ... ENOENT/EINVAL** (Windows) | Đã xử lý (gọi qua `cmd /c`). Đảm bảo `npm` trên PATH. |
| Branch hiển thị **UNKNOWN** | Repo chưa có commit nào. Commit lần đầu là hết. |
| Muốn tắt màu output | Đặt `NO_COLOR=1`. |

---

## 15. FAQ

**Hỏi: AIEP có cần internet không?**
Không cho bản thân CLI (zero-dependency). Chỉ cần mạng khi pull model Ollama lần
đầu hoặc gọi Gemini/Codex CLI (nếu dùng).

**Hỏi: Tôi có bắt buộc phải cài đủ 5 reviewer không?**
Không. Tối thiểu chỉ cần Node + git (chạy được L1 và toàn bộ CLI). Thêm Ollama để
có L2/L3 local review thật. Gemini/Codex là tùy chọn.

**Hỏi: Vì sao Codex hầu như không chạy?**
Theo thiết kế: Codex chỉ dành cho L4 (bảo toàn token). Trong AIEP v1.0, không WO
nào đạt ngưỡng L4.

**Hỏi: Verdict CHANGES_REQUESTED có chặn release không?**
Chỉ khi còn finding CRITICAL/HIGH **chưa** được resolve/disposition. Sau khi
disposition hợp lệ, verdict tính lại thành PASS.

**Hỏi: Chạy trên CI thế nào?**
Dùng `--json` và exit code: `aiep validate --json` trả exit 1 nếu có gate FAIL.

---

## Tham chiếu thêm

- [PROJECT.md](../PROJECT.md) — tổng quan & kiến trúc.
- [Governance](governance/GOVERNANCE.md), [Review Level Policy](governance/REVIEW-LEVEL-POLICY.md).
- [Design Specification](design/DESIGN-SPECIFICATION-v1.0.md), [Data Model](design/DATA-MODEL.md).
- [SOPs](sop/INDEX.md) — quy trình chuẩn (WO lifecycle, review execution, Codex L4, release).
- [Quality Gates](release/QUALITY-GATES.md), [Release Checklist](release/RELEASE-CHECKLIST.md).
