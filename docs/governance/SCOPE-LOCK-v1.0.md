# Scope Lock v1.0

Tài liệu này đóng băng phạm vi của AIEP v1.0. Nó chỉ có thể thay đổi bởi
Product Owner và ARB. `aiep validate` thực thi danh sách ngoài phạm vi bằng cách fail
nếu bất kỳ bề mặt bị cấm nào xuất hiện trong repository.

## Trong phạm vi — năm Product Deliverable

1. **Core Repository** — nền tảng repository, bootstrap, nền tảng runtime,
   source code, scripts, tools, validation, CLI.
2. **Documentation System** — constitution, governance, PROJECT.md, design
   specification, ADR, RFC, SOP, gói triển khai, work order, gói review,
   tài liệu release, checklist.
3. **AI Engineering Library** — thư viện prompt, thư viện skill, thư viện MCP,
   thư viện knowledge, các reusable engineering asset.
4. **PMO** — product backlog, sprint, milestone, release, issue, risk, decision
   log.
5. **Dashboard** — architecture status, sprint status, AI runtime status,
   knowledge asset, review status (và các panel bắt buộc khác).

## Rõ ràng NGOÀI PHẠM VI cho v1.0

Những mục sau **không được** xây dựng trong v1.0. Sự hiện diện của chúng làm fail validation:

- Multi-Repository Platform
- AI Council
- Labs Repository
- Multi-Organization support
- Enterprise License Manager
- Platinum Governance
- Full Compliance Platform
- Bất kỳ tính năng nào của AIEP v2.0

Các tripwire cấp thư mục được thực thi bởi validation: `labs/`, `multi-org/`,
`multi-organization/`, `ai-council/`, `enterprise-license-manager/`.

## Ranh giới thẩm quyền

Execution Lead chỉ hoạt động trong phạm vi repository AIEP. Nó không được sửa đổi
các repository khác (ví dụ PickleFund), xóa dữ liệu bên ngoài AIEP, commit secret,
phát sinh chi phí cloud, mua dịch vụ, phát hành production công khai, hoặc thay đổi
Scope Lock này hay Architecture Freeze. Bất kỳ nhu cầu nào như vậy đều được leo thang như một blocker
cứng.
