# ADR-0001 — Ngăn xếp Công nghệ

- **Trạng thái:** Accepted
- **Ngày:** 2026-07-12
- **Người quyết định:** Execution Lead (phê chuẩn theo Architecture Freeze v1.0)

## Bối cảnh

AIEP phải cung cấp một CLI, một engine review, phần validation, một dashboard và một
đường đóng gói (packaging). Nó cần cài đặt và chạy được offline, đa nền tảng (môi trường
chính là Windows), khởi động nhanh, và trình diện một bề mặt chuỗi cung ứng
(supply-chain) tối thiểu cho một công cụ gần với lĩnh vực governance/bảo mật.

## Quyết định

Sử dụng **Node.js (>= 18) với ESM và zero runtime dependencies** — chỉ dùng các built-in
của Node (`node:fs`, `node:path`, `node:child_process`, `node:http`, `fetch` toàn cục,
`node:test`).

- Phân tích cú pháp CLI, HTTP (dashboard server + Ollama client), truy cập git và file I/O
  đều được bao phủ bởi các built-in.
- Dữ liệu là **Markdown + một tập con YAML frontmatter được kiểm soát**; config và các
  artifact máy đọc là **JSON**. Một trình phân tích frontmatter tự xây dựng nội bộ giúp
  tránh một dependency YAML.
- Kiểm thử dùng bộ chạy `node:test` tích hợp sẵn.

## Hệ quả

**Tích cực**

- Cài đặt offline; `npm install` không yêu cầu mạng (không có dependency).
- Bề mặt tấn công nhỏ và không bị trôi dạt dependency (dependency drift).
- Một runtime duy nhất cho CLI, dashboard và packaging.
- Khởi động nhanh, đóng gói dễ dàng qua `npm pack`.

**Tiêu cực / đánh đổi**

- Trình phân tích frontmatter tự xây dựng chỉ hỗ trợ một tập con được kiểm soát (được giảm
  thiểu rủi ro bằng unit test và đầu vào do template kiểm soát).
- Không có thư viện CLI/UX bên thứ ba; việc định dạng được viết thủ công (chấp nhận được
  với phạm vi này).

## Các phương án đã cân nhắc

- **Python + Click + Rich:** trải nghiệm CLI xuất sắc, nhưng cần một runtime thứ hai cho
  dashboard và một câu chuyện dependency nặng nề hơn.
- **Node + dependency nặng (commander, chalk, yaml, express):** viết nhanh hơn, nhưng
  bề mặt chuỗi cung ứng lớn hơn và gây trở ngại cho việc cài đặt offline — bị bác bỏ đối
  với một công cụ governance.
