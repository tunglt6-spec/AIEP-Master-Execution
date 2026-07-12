# Hiến chương AIEP

> Hiến chương nêu ra các nguyên tắc bền vững của AI Engineering Platform.
> Nó đứng trên mọi tài liệu khác. Khi một tài liệu ở cấp thấp hơn xung đột với
> Hiến chương, Hiến chương được ưu tiên.

## 1. Mục đích

AIEP tồn tại để làm cho kỹ thuật phần mềm có sự hỗ trợ của AI trở nên **được quản trị,
có thể audit và có thể lặp lại**. Mọi thay đổi trọng yếu đều được lên kế hoạch dưới dạng
một Work Order, được review ở mức độ tương xứng với rủi ro của nó, và để lại một dấu vết
bằng chứng bền vững.

## 2. Các nguyên tắc

1. **Git là nguồn chân lý duy nhất.** Trạng thái được suy ra từ repository,
   chứ không phải từ trí nhớ hay các ghi chú tùy tiện.
2. **Mọi thay đổi đều có một Work Order, và mọi Work Order đều có đúng một
   ReviewLevel (L1–L4).** Không thay đổi trọng yếu nào bỏ qua điều này.
3. **Review tương xứng với rủi ro.** Công việc rủi ro thấp không bị review quá mức;
   công việc rủi ro cao không bị review dưới mức. Các review level không bị thổi phồng
   để trông có vẻ kỹ lưỡng.
4. **Codex là một tài nguyên khan hiếm.** Auditor bên ngoài chỉ được huy động ở L4,
   chỉ cho những thay đổi thực sự rủi ro cao. Việc bảo toàn token là một mối quan tâm
   hàng đầu.
5. **Bằng chứng thay vì khẳng định.** Các review tạo ra artifact. Một tuyên bố "đã review"
   mà không có artifact thì không được chấp nhận.
6. **Suy giảm nhẹ nhàng (graceful degradation), báo cáo trung thực.** Khi một reviewer backend
   không khả dụng, nền tảng ghi lại một disposition được ghi chép và tiếp tục; nó
   không bao giờ giả một lần review pass.
7. **Không có secret trong repository.** Credential, token và key không bao giờ được
   commit. Điều này được thực thi tự động.
8. **Kỷ luật phạm vi.** v1.0 cung cấp đúng năm deliverable sản phẩm. Các tính năng ngoài
   phạm vi bị từ chối, chứ không được âm thầm xây dựng.
9. **Tái sử dụng mặc định (Rule of Three).** Công việc có ý nghĩa tạo ra một code asset,
   một knowledge asset và một standard asset ở nơi việc tái sử dụng là thực chất.
10. **Ít gây bất ngờ nhất.** Các công cụ làm đúng những gì chúng nói. Không lệnh giả nào
    báo cáo thành công cho một khả năng không tồn tại.

## 3. Năm deliverable sản phẩm (v1.0)

1. Core Repository — bootstrap, runtime, source, scripts, tools, validation, CLI.
2. Documentation System — constitution, governance, design, ADR/RFC/SOP, release.
3. AI Engineering Library — prompts, skills, MCP, knowledge, reusable assets.
4. PMO — backlog, sprints, milestones, releases, issues, risks, decisions.
5. Dashboard — architecture, sprint, runtime, knowledge và review status.

## 4. Các vai trò (Mô hình vận hành AI)

| Vai trò | Actor | Nhiệm vụ |
|------|-------|---------|
| Chief Architect / ARB | ChatGPT | Review architecture cuối cùng |
| Execution Lead | Claude Code | Kỹ thuật & self review |
| Local Code Reviewer | DeepSeek (Ollama) | Tính đúng đắn, bug, edge case |
| Local Technical Reviewer | Qwen (Ollama) | Khả năng bảo trì, cấu trúc |
| Design Reviewer | Gemini | Design & sự nhất quán về phạm vi |
| External Auditor | Codex | Audit trọng yếu chỉ ở L4 |

## 5. Sửa đổi

Hiến chương và Architecture Freeze / Scope Lock cho v1.0 chỉ có thể được thay đổi
bởi Product Owner và ARB. Execution Lead không được sửa đổi chúng một cách đơn phương;
một yêu cầu làm như vậy sẽ được leo thang như một blocker cứng.
