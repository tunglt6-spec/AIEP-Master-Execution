# SOP-005 — Lập trình với AI kết hợp AIEP (triển khai → audit độc lập)

## Mục đích

Quy định cách phối hợp một **AI coding agent** (ví dụ Claude Code) với AIEP để
code do AI sinh ra được **audit độc lập** và **có con người phê duyệt** trước khi
chấp nhận hoặc deploy. Đây là phiên bản thủ công, nằm trong scope, của vòng lặp
mô tả trong RFC-0002.

## Phạm vi

Áp dụng cho mọi dự án đã khởi tạo bằng `aiep init`. Bao trùm luồng: ý tưởng →
Claude Code triển khai → AIEP audit (`aiep review`, `aiep validate`) → con người
duyệt findings → deploy. **Không** bao gồm deploy tự động (xem RFC-0002 cho vòng
lặp agent v2.0, hiện đang ở trạng thái Proposed).

## Vai trò

| Vai trò | Ai đảm nhiệm | Trách nhiệm |
|---------|--------------|-------------|
| Tác giả (Author) | AI coding agent (Claude Code) | Viết code; chạy các lệnh audit của AIEP |
| Reviewer độc lập | DeepSeek, Qwen, (Gemini ở L3, Codex ở L4) | Audit diff — **là model KHÁC với tác giả** |
| Người phê duyệt (Approver) | Anh (con người) | Duyệt findings, chấp nhận/từ chối disposition, gác cổng deploy |

## Điều kiện tiên quyết

- Dự án đã khởi tạo: `aiep init` (có `.aiep/config.json`, `pmo/work-orders/`).
- Có AIEP CLI (`npm install -g @tunglt6/aiep`) hoặc chạy qua `node bin/aiep.js`.
- Để audit local thật: Ollama đang chạy với model đã cấu hình (kiểm tra bằng
  `aiep doctor`).
- Có một Work Order cho thay đổi (tạo nhanh bằng `aiep plan "<ý tưởng>"` nếu chưa có).

## Nguyên tắc cốt lõi

> Bên VIẾT code không được là bên DUY NHẤT phán xử code đó.

AIEP audit dùng **model độc lập** (tối thiểu L2). Con người phê duyệt các
disposition và gác cổng deploy. Tuyệt đối không để coding agent tự ý dismiss
finding CRITICAL/HIGH do chính nó tạo ra, và không tự động deploy.

## Quy trình

1. **Xác định công việc.** Tạo hoặc trỏ tới một Work Order và xác nhận
   `reviewLevel` của nó (`aiep plan "<ý tưởng>"` sẽ đề xuất một mức; anh tinh chỉnh lại).
2. **Triển khai.** AI coding agent viết thay đổi.
3. **Commit delta.** `git add …` rồi `git commit` (để bước audit có một diff sạch,
   tập trung).
4. **Audit.** Chạy `aiep review <WO-ID> --last` — định tuyến tới các reviewer theo
   ReviewLevel của Work Order và ghi artifact vào `.aiep/artifacts/<WO-ID>/`.
5. **Gác cổng.** Chạy `aiep validate` (quality gates).
6. **Con người duyệt.** Xem `aiep artifacts <WO-ID>` / `review-summary.md`.
   - Finding thật → sửa code, chạy lại bước 4.
   - False positive → ghi disposition có tài liệu
     (`.aiep/artifacts/<WO-ID>/dispositions.json`) — **anh** là người duyệt.
7. **Deploy (có con người gác cổng).** Chỉ sau khi gates pass và anh đồng ý:
   merge / `npm publish` / `gh release create`.

## Mẫu prompt (dán cho AI coding agent)

```
Nhiệm vụ: <ý tưởng của tôi>.

Sau khi triển khai xong, hãy audit bằng AIEP và báo cáo — KHÔNG được bỏ qua:
1. Đảm bảo có Work Order cho việc này (dùng `aiep plan "<tóm tắt>"` nếu chưa có); cho tôi biết WO-ID và ReviewLevel.
2. git add + commit thay đổi.
3. Chạy: aiep review <WO-ID> --last
4. Chạy: aiep validate
5. Hiển thị findings (aiep artifacts <WO-ID>) và DỪNG LẠI chờ tôi duyệt.
   - KHÔNG tự dismiss bất kỳ finding CRITICAL/HIGH nào của chính code bạn viết.
   - KHÔNG deploy / merge / publish khi chưa có tôi đồng ý.
```

## Danh sách kiểm tra (Checklist)

- [ ] Có Work Order với ReviewLevel đúng (tối thiểu L2 cho code thật).
- [ ] Đã commit thay đổi trước khi audit (diff tập trung).
- [ ] Đã chạy `aiep review <WO-ID> --last`; artifact hiện diện.
- [ ] `aiep validate` pass (hoặc đã hiểu rõ lỗi).
- [ ] Finding CRITICAL/HIGH đã sửa, hoặc dispositioned **có con người duyệt**.
- [ ] Chỉ deploy sau khi con người phê duyệt rõ ràng.

## Lưu ý & cạm bẫy

- Model local nhỏ hay sinh false positive — xác minh với source trước khi dismiss
  (xem SOP-002).
- Qwen chạy trên CPU có thể timeout với diff lớn → degraded/documented disposition;
  hãy giữ diff tập trung hoặc tinh chỉnh `AIEP_OLLAMA_NUM_PREDICT` /
  `AIEP_OLLAMA_TIMEOUT_MS`.
- Audit trên một delta chưa commit, rỗng, hoặc toàn bộ repo sẽ làm giảm chất lượng
  review — luôn commit đúng thay đổi cụ thể và dùng `--last`.

## Tham chiếu

- [SOP-001 — Vòng đời Work Order](./SOP-001-work-order-lifecycle.md)
- [SOP-002 — Thực thi Review](./SOP-002-review-execution.md)
- [Review Level Policy](../governance/REVIEW-LEVEL-POLICY.md)
- [RFC-0002 — AI Coding Agent](../rfc/RFC-0002-ai-coding-agent.md)
- [User Guide](../USER-GUIDE.md)
