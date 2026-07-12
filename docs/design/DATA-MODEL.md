---
title: "AIEP v1.0 — Mô hình Dữ liệu"
status: Frozen (Architecture Freeze v1.0)
---

# AIEP v1.0 — Mô hình Dữ liệu

Tài liệu này đặc tả ba hợp đồng dữ liệu cốt lõi của nền tảng:

1. schema frontmatter của **Work Order** (nguồn chân lý mà tác giả đối diện),
2. schema **`decision.json`** (kết quả review), và
3. cấu trúc **`dashboard.json`** (trạng thái tổng hợp của nền tảng).

Mọi tài liệu Markdown sử dụng một tập con YAML frontmatter phẳng, được kiểm soát, được phân
tích bởi `src/core/frontmatter.js` (scalar, chuỗi trong dấu nháy, danh sách nội dòng
`[a, b]`, và danh sách khối `- item`). Các ánh xạ lồng nhau (nested mapping) cố ý không
được hỗ trợ.

---

## 1. Frontmatter của Work Order

Một Work Order nằm tại `pmo/work-orders/<WO-ID>/work-order.md`. Khối frontmatter của nó là
nguồn chân lý máy đọc được; phần thân mang mục tiêu, phạm vi, deliverable và Definition of
Done.

### 1.1 Các trường

| Trường | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | string | có | Định danh Work Order, ví dụ `WO-0105`. Cũng là tên thư mục artifact. |
| `title` | string | có | Tiêu đề con người đọc được (dùng dấu nháy nếu chứa ký tự đặc biệt). |
| `reviewLevel` | enum | có | Một trong `L1`, `L2`, `L3`, `L4`. Xác định pipeline reviewer. |
| `status` | enum | có | Một trong `backlog`, `planned`, `in-progress`, `in-review`, `done`, `blocked`. |
| `phase` | string | có | Nhãn phase giao hàng, ví dụ `P1-Core`. |
| `owner` | string | không | Vai trò sở hữu, ví dụ `claude-execution-lead`. |

Validation (`src/core/workorders.js`): tập bắt buộc là `id, title, reviewLevel,
status, phase`. Một `reviewLevel` hoặc `status` không hợp lệ được báo cáo là một lỗi tải
(load error) và làm thất bại gate `validate` "All Work Orders valid & have ReviewLevel".

### 1.2 Ví dụ

```yaml
---
id: WO-0105
title: "Review Matrix & Routing"
phase: P1-Core
reviewLevel: L3
status: done
owner: claude-execution-lead
---
```

### 1.3 Quy ước phần thân

Phần thân nên chứa một mục **Objective**, **Scope** (tham chiếu Scope Lock v1.0),
**Deliverables**, và một mục **Definition of Done**. Claude self-review kiểm tra sự hiện
diện của một heading Definition of Done (`definition of done` / `dod`) và phát ra một
finding MEDIUM nếu nó vắng mặt.

---

## 2. `decision.json`

Được review router ghi ra `.aiep/artifacts/<WO-ID>/decision.json`. Đây là kết quả review
chuẩn tắc, máy đọc được, được tiêu thụ bởi `status`, `artifacts`, `validate` và dashboard
build.

### 2.1 Các trường

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `workOrder` | string | Id của WO (`wo.meta.id`). |
| `title` | string | Tiêu đề của WO. |
| `reviewLevel` | enum | `L1`–`L4` — level mà review đã chạy dưới đó. |
| `reviewers` | string[] | Pipeline có thứ tự **hiệu lực** thực sự đã chạy (Codex bị loại bỏ trừ khi L4). |
| `codexGuard` | object | `{ requiresCodex, codexAllowed, guardBlockedCodex }` (tất cả boolean). `guardBlockedCodex` là true khi pipeline của level bao gồm Codex nhưng guard đã chặn nó. |
| `delta` | object | `{ changedFiles: number, files: string[] }` — bề mặt thay đổi được review. |
| `severityCounts` | object | Các số nguyên đếm theo khóa `CRITICAL, HIGH, MEDIUM, LOW, INFO`. |
| `findings` | object[] | Các finding đã làm phẳng; mỗi cái `{ severity, message, reviewer }`. |
| `unresolvedBlockingCount` | number | Số finding có severity nằm trong tập blocking (`CRITICAL`, `HIGH`). |
| `reviewerStatuses` | object[] | Từng reviewer `{ reviewer, status, model }`. `status` ∈ `completed` \| `degraded` \| `error`; `model` là mô hình Ollama được dùng hoặc `null`. |
| `verdict` | enum | `PASS` khi `unresolvedBlockingCount === 0`, ngược lại `CHANGES_REQUESTED`. |

### 2.2 Mô hình severity

Các severity: `CRITICAL, HIGH, MEDIUM, LOW, INFO`. Các severity **blocking** là `CRITICAL`
và `HIGH`. Các finding được phân tích từ các dòng đầu ra của reviewer theo đúng dạng
`FINDING: <SEVERITY> - <description>`.

### 2.3 Ví dụ

```json
{
  "workOrder": "WO-0105",
  "title": "Review Matrix & Routing",
  "reviewLevel": "L3",
  "reviewers": ["claude", "deepseek", "qwen", "gemini"],
  "codexGuard": { "requiresCodex": false, "codexAllowed": false, "guardBlockedCodex": false },
  "delta": {
    "changedFiles": 2,
    "files": ["src/core/reviewMatrix.js", "src/reviewers/index.js"]
  },
  "severityCounts": { "CRITICAL": 0, "HIGH": 0, "MEDIUM": 1, "LOW": 0, "INFO": 3 },
  "findings": [
    { "severity": "MEDIUM", "message": "Extract duplicated guard check into a helper.", "reviewer": "qwen" }
  ],
  "unresolvedBlockingCount": 0,
  "reviewerStatuses": [
    { "reviewer": "claude", "status": "completed", "model": null },
    { "reviewer": "deepseek", "status": "degraded", "model": null },
    { "reviewer": "qwen", "status": "degraded", "model": null },
    { "reviewer": "gemini", "status": "degraded", "model": null }
  ],
  "verdict": "PASS"
}
```

---

## 3. `dashboard.json`

Được `src/dashboard/build.js` ghi ra `dashboard/data/dashboard.json`. Mọi giá trị đều được
suy ra từ trạng thái repository thực (live) — các Work Order, `decision.json` của từng WO,
các `validate` gate, các probe của `doctor` và git. Không có dữ liệu demo nào được bịa ra.

### 3.1 Cấu trúc cấp cao nhất

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `generatedAt` | string | Dấu thời gian ISO của bản build. |
| `platform` | object | Phản chiếu `config.platform` (`name`, `displayName`, `version`, `scopeLock`, `architectureFreeze`). |
| `git` | object | `{ isRepo, branch, commit }`. |
| `architecture` | object | `{ freeze, scopeLock, deliverables: [{ name, present }] }` cho năm deliverable. |
| `sprints` | object[] | `{ id, name, status, goal }` từ `pmo/sprints/*.md` (rỗng nếu không có). |
| `workOrders` | object | `{ summary, rows }` — xem bên dưới. |
| `reviewLevelDistribution` | object | Đếm `{ L1, L2, L3, L4 }`. |
| `reviewers` | object[] | Sức khỏe reviewer/backend được lọc từ `doctor` (`{ name, ok, detail }`). |
| `findings` | object | `{ counts: {CRITICAL,HIGH,MEDIUM,LOW,INFO}, items: [{ wo, severity, message, reviewer }] }`. |
| `knowledgeAssets` | object | Số lượng file: `prompts, skills, mcp, knowledge, adrs, sops, templates`. |
| `releaseReadiness` | object | `{ gatesPassed, gatesFailed, gatesWarned, ok, checks }` từ `validate`. |
| `systemHealth` | object[] | Toàn bộ các item của `doctor` (`{ name, ok, detail }`). |

### 3.2 `workOrders`

- `summary` — `{ total, byLevel: {L1..L4}, byStatus: {…}, byPhase: {…} }`.
- `rows` — một mục cho mỗi WO: `{ id, title, phase, reviewLevel, status, verdict, reviewers }`,
  trong đó `verdict` được lấy từ `decision.json` của WO đó hoặc `"not-reviewed"` nếu vắng
  mặt, và `reviewers` quay lui về pipeline được cấu hình cho level khi chưa được review.

### 3.3 Tiêu thụ

Dashboard tĩnh (`dashboard/index.html` + assets) nạp `data/dashboard.json` và render nó ở
phía client. Nó được phục vụ bởi static server `node:http` tích hợp sẵn (`aiep dashboard`)
gắn vào `127.0.0.1:4173`, hoặc bởi bất kỳ static file server nào.
