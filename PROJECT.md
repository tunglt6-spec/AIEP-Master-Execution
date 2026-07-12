# AIEP — AI Engineering Platform (v1.0)

AIEP là một nền tảng kỹ thuật được dẫn dắt bởi quản trị, chạy **review code
đa cấp có sự hỗ trợ của AI**, theo dõi công việc qua một **PMO**, tuyển chọn một
**thư viện kỹ thuật AI** có thể tái sử dụng, và hiển thị mọi thứ trên một
**dashboard** — tất cả từ một CLI Node.js zero-dependency duy nhất.

## Vì sao

AI có thể viết và review code nhanh chóng, nhưng khi không được quản trị nó tạo ra
những thay đổi khó audit và những reviewer khó tin cậy. AIEP làm cho quy trình trở nên
**được quản trị, có thể audit và có thể lặp lại**: mọi thay đổi trọng yếu đều là một Work Order,
được review ở mức độ tương xứng với rủi ro của nó (L1–L4), để lại bằng chứng bền vững.

## Năm deliverable sản phẩm

1. **Core Repository** — CLI, engine review, validation, scripts, tools.
2. **Documentation System** — constitution, governance, design, ADR/RFC/SOP, release.
3. **AI Engineering Library** — prompts, skills, MCP descriptors, knowledge.
4. **PMO** — backlog, sprints, milestones, work orders, issues, risks, decisions.
5. **Dashboard** — mười panel dữ liệu trực tiếp cho architecture, sprints, reviews và tình trạng sức khỏe.

## Kiến trúc (đã đóng băng — Architecture Freeze v1.0)

- **Runtime:** Node.js (>= 18), ESM, **zero runtime dependencies** (chỉ dùng built-ins).
- **Các lớp:** `bin/aiep.js` → `src/cli/*` → `src/core/*` (+ `src/reviewers/*`).
- **Dữ liệu:** Markdown + YAML frontmatter được kiểm soát; config & artifact dạng JSON.
- **Dashboard:** HTML/CSS/JS tĩnh đọc file `dashboard/data/dashboard.json` được sinh ra.

Xem [docs/design/DESIGN-SPECIFICATION-v1.0.md](docs/design/DESIGN-SPECIFICATION-v1.0.md).

## Mô hình vận hành AI & các Review Level

| Level | Reviewer pipeline |
|-------|-------------------|
| L1 | Claude (self review) |
| L2 | Claude → DeepSeek → Qwen |
| L3 | Claude → DeepSeek → Qwen → Gemini |
| L4 | Claude → DeepSeek → Qwen → Gemini → **Codex** |

- DeepSeek & Qwen chạy **cục bộ qua Ollama**; Gemini & Codex được hỗ trợ qua CLI.
- **Codex chỉ được gọi ở L4** (guard bảo toàn token, được thực thi trong code và
  validation). Xem [Review Level Policy](docs/governance/REVIEW-LEVEL-POLICY.md).
- Các backend bị thiếu sẽ suy giảm nhẹ nhàng (graceful degradation) với một quyết định tích hợp được ghi chép —
  không bao giờ là một lần pass giả.

## Cài đặt

```bash
# From the repository (zero dependencies — no network needed)
npm install -g .
# or run directly
node bin/aiep.js <command>
```

Các trình trợ giúp cài đặt đa nền tảng: `scripts/install.ps1` (Windows) và
`scripts/install.sh` (macOS/Linux).

## Cách dùng

```bash
aiep status                 # platform, work-order, review & release status
aiep validate               # run the quality gates
aiep doctor                 # diagnose environment & reviewer backends
aiep review WO-0105         # review one Work Order per its ReviewLevel
aiep review                 # review all non-done Work Orders
aiep artifacts WO-0105      # inspect a Work Order's review evidence
aiep dashboard              # build live data + serve the dashboard
aiep package                # verify gates & prepare the release tarball
```

## Bố cục repository

```
.aiep/            config.json + artifacts/<WO-ID>/ (review evidence)
bin/              aiep.js (CLI entry)
src/core/         config, paths, frontmatter, workorders, gitdelta, reviewMatrix, secrets
src/reviewers/    claude, ollama, cli-reviewer, gemini, codex, findings, router
src/cli/          status, validate, review, artifacts, doctor, dashboard, package
src/dashboard/    build.js (live data generator)
dashboard/        index.html, styles.css, app.js
docs/             constitution, governance, design, adr, rfc, sop, release
pmo/              backlog, sprints, milestones, work-orders, issues, risks, decisions
library/          prompts, skills, mcp, knowledge
templates/        work-order, adr, rfc, sop, review templates
scripts/          bootstrap & install (ps1/sh), scaffold-workorders.mjs
test/             node:test suites
```

## Quản trị

Bắt đầu với [Constitution](docs/constitution/CONSTITUTION.md), sau đó
[Governance](docs/governance/GOVERNANCE.md), the
[Review Level Policy](docs/governance/REVIEW-LEVEL-POLICY.md), the
[Scope Lock v1.0](docs/governance/SCOPE-LOCK-v1.0.md) và
[Architecture Freeze v1.0](docs/governance/ARCHITECTURE-FREEZE-v1.0.md).

## Trạng thái

AIEP v1.0.0 — **release candidate** đang chờ review cuối cùng của Product Owner & ARB.
