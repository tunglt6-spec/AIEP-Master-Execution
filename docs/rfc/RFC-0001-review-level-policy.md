---
rfc: 0001
title: "Review Level Policy (L1–L4) và Codex-L4-only Token-Preservation Guard"
status: Accepted
audience: Engineering, Architecture Review Board
supersedes: none
---

# RFC-0001 — Review Level Policy (L1–L4) và Codex-L4-only Guard

## Tóm tắt

AIEP gán cho mỗi Work Order đúng một **ReviewLevel** (`L1`–`L4`), giá trị này phân giải một
cách tất định (deterministic) rằng những reviewer nào phải chạy trên change delta của Work
Order đó. Level càng cao thì càng thêm reviewer; reviewer đắt đỏ nhất, auditor **Codex**
bên ngoài, được dành riêng cho **chỉ L4** và được thực thi bởi một **Codex guard** đa lớp.
RFC này ghi lại chính sách, lý do biện minh, cơ chế thực thi, hành vi graceful degradation
của nó, và các phương án đã cân nhắc.

## Động lực

Review có hỗ trợ AI thì giá trị nhưng không miễn phí: các mô hình local tốn thời gian đồng
hồ (wall-clock), và auditor bên ngoài tốn token và tiền. Phải tránh hai chế độ thất bại:

1. **Under-review** — các thay đổi rủi ro cao (auth, thanh toán, di trú dữ liệu, core
   runtime) được giao hàng mà chỉ có self-review.
2. **Over-review / thổi phồng cấp độ (grade inflation)** — các thay đổi thường lệ bị định
   tuyến qua mọi reviewer, và đặc biệt là các Work Order bị nâng lên L4 "cho chắc", đốt
   ngân sách auditor và làm xói mòn tín hiệu mà L4 lẽ ra phải mang.

Một level duy nhất, mang tính khai báo cho mỗi Work Order, khiến bề mặt review trở nên dễ
đoán, có thể audit và rẻ để suy luận, trong khi một guard cứng giữ cho tầng đắt đỏ luôn
trung thực.

## Thiết kế chi tiết

### Mô hình vận hành AI (các reviewer)

| Reviewer | Vai trò | Backend | Trọng tâm |
| --- | --- | --- | --- |
| ChatGPT / ARB | Chief Architect & Final Architecture Review | — | Thẩm quyền Architecture Review Board |
| Claude Code | Đội Kỹ thuật & Execution Lead (self review) | kiểm tra in-process | tuân thủ WO, Definition of Done, tự nhất quán |
| DeepSeek | Local Code Reviewer | Ollama (`deepseek-coder:1.3b`) | lỗi logic, lỗi runtime, edge case, bảo mật cơ bản, xử lý lỗi, tính đúng đắn |
| Qwen | Local Technical Reviewer | Ollama (`qwen3:8b`) | khả năng bảo trì, dead code, trùng lặp, hiệu năng, nhất quán kiến trúc, cấu trúc |
| Gemini | Design Reviewer | `gemini` CLI | nhất quán thiết kế, căn chỉnh kiến trúc, tuân thủ DS/scope, rủi ro tích hợp |
| Codex | External Independent Auditor (**không phải reviewer mặc định**) | `codex` CLI | tính đúng đắn quan trọng, bảo mật, rủi ro kiến trúc/phát hành, lỗi tác động cao |

### Review Matrix

Mỗi level chạy một pipeline có thứ tự, mang tính tích lũy:

| Level | Pipeline | Sử dụng điển hình |
| --- | --- | --- |
| **L1** | `claude` | Thay đổi tầm thường / rủi ro thấp, tài liệu, chú thích. |
| **L2** | `claude → deepseek → qwen` | Thay đổi code tiêu chuẩn; review kép ở local. |
| **L3** | `claude → deepseek → qwen → gemini` | Thay đổi quan trọng về kiến trúc hoặc nhạy cảm về thiết kế. |
| **L4** | `claude → deepseek → qwen → gemini → codex` | Chỉ những thay đổi thực sự rủi ro cao. |

Ma trận này là dữ liệu, được khai báo trong `.aiep/config.json` dưới `reviewLevels`, và
được phân giải bởi `reviewMatrix.resolvePipeline(config, level)`.

### Codex guard

Codex chỉ có thể được gọi **duy nhất ở L4**. Điều này được thực thi tại bốn điểm độc lập
(defence-in-depth):

1. **Config** — `codexGuard.allowedLevels: ["L4"]` và `reviewers.codex.restrictedToLevel: "L4"`.
2. **Router** — `runReview` lọc Codex khỏi pipeline hiệu lực trừ khi
   `codexAllowed(config, level)`; nó ghi `codexGuard.guardBlockedCodex` vào `decision.json`.
3. **Reviewer** — `runCodexReviewer` gọi `assertReviewerAllowed(config, 'codex', level)`,
   hàm này **ném lỗi (throws)** với bất kỳ level nào dưới L4, nên Codex không thể chạy ngay
   cả khi được gọi trực tiếp.
4. **Quality gate** — `aiep validate` **thất bại** nếu tồn tại một artifact `codex-audit.md`
   dưới bất kỳ Work Order không phải L4 nào, và `aiep doctor` khẳng định guard phân giải
   thành L4-only.

**Tiêu chí xét vào L4.** Dành riêng L4 cho: xác thực/phân quyền (authentication/authorization),
bảo mật quan trọng, thanh toán, di trú dữ liệu quan trọng, core runtime có tác động toàn
hệ thống, phát hành production lớn, hoặc một xung đột reviewer không thể giải quyết. Các
Work Order **không được** nâng lên L4 chỉ để có thêm review.

### Degradation

Các level khai báo *ý định*; môi trường có thể không đầy đủ. Khi một mô hình local hoặc một
CLI reviewer không khả dụng, reviewer đó trả về trạng thái **`degraded`** kèm một integration
decision được ghi lại thay vì chặn pipeline (xem `ollama.js`, `cli-reviewer.js`). Bản
`review-summary.md` và `decision.json` đã hợp nhất phản ánh trạng thái degraded, và
`aiep doctor` báo cáo cái gì đang thiếu. Do đó các review luôn hoàn tất và vẫn có thể
audit; các lỗ hổng cấp phát (provisioning gaps) được phơi bày ra, chứ không bị âm thầm
phớt lờ.

**Ngữ nghĩa blocking.** Các finding có severity `CRITICAL` hoặc `HIGH` là blocking. Verdict
là `PASS` chỉ khi `unresolvedBlockingCount === 0`, ngược lại là `CHANGES_REQUESTED`. Trong
các release gate, một CRITICAL chưa giải quyết làm thất bại bản build; một HIGH chưa giải
quyết đưa ra cảnh báo và yêu cầu một disposition được ghi lại.

## Nhược điểm

- **Cần phán đoán của tác giả.** Việc chọn level là một quyết định của con người, có thể bị
  lợi dụng (thổi phồng) hoặc đánh giá thấp; guard giảm thiểu trường hợp đắt đỏ nhất (L4)
  nhưng không xử lý ranh giới L2/L3.
- **Độ trễ tích lũy.** L4 chạy năm reviewer tuần tự; thời gian đồng hồ tăng theo level.
- **Review bị degraded có thể trông giống như pass.** Một reviewer `degraded` không tạo ra
  finding nào, nên người vận hành phải đọc reviewer statuses, không chỉ đọc verdict.
- **Độ hạt thô.** Bốn level không thể nắm bắt mọi sắc thái rủi ro; một số thay đổi nằm chông
  chênh giữa L2 và L3.

## Các phương án đã cân nhắc

1. **Luôn chạy tất cả reviewer.** Bị bác bỏ: lãng phí ngân sách token cho những thay đổi
   tầm thường và phá hủy ý nghĩa của một audit L4.
2. **Codex theo yêu cầu ở bất kỳ level nào (một flag).** Bị bác bỏ: tái tạo lại vấn đề thổi
   phồng mà guard tồn tại để ngăn chặn; một flag cho mỗi lần gọi khó audit hơn một level
   cho mỗi WO.
3. **Điểm rủi ro liên tục thay vì các level rời rạc.** Bị bác bỏ với v1.0: khó khai báo,
   review và validate một cách tất định; các level rời rạc ánh xạ gọn gàng tới một tập
   artifact cố định và một guard đơn giản.
4. **Thực thi reviewer song song.** Hoãn lại: sẽ giảm độ trễ nhưng làm phức tạp việc ghi
   artifact theo thứ tự và báo cáo tiến độ; xem xét lại sau v1.0.

## Áp dụng / triển khai

- Chính sách đang hoạt động trong v1.0 và được mã hóa trong `.aiep/config.json`; không cần
  di trú.
- Mọi Work Order đã mang sẵn một `reviewLevel`; `validate` làm thất bại bất kỳ WO nào không
  có.
- Tác giả chạy `aiep review <WO-ID>`; CI/release chạy `aiep validate` (và `aiep package`),
  vốn thực thi guard và các finding gate.
- `aiep doctor` là bước kiểm tra tiền khởi động (pre-flight) cho các reviewer backend và
  tính hợp lệ của guard.

## Câu hỏi mở

- Ranh giới L2↔L3 có nên có tiêu chí xét vào rõ ràng, dạng checklist (như L4 đang có) không?
- Các finding HIGH chưa giải quyết có nên leo thang review kế tiếp của một Work Order lên
  một level cao hơn không?
- Độ phủ reviewer `degraded` dưới một ngưỡng nào đó có nên hạ verdict từ `PASS` xuống một
  `PASS (degraded)` rõ ràng thay vì chỉ phơi bày trong reviewer statuses không?
- Có nên áp dụng thực thi reviewer song song để cắt giảm độ trễ L4 không (xem Các phương án
  #4)?
