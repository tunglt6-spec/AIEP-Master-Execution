# Quản trị AIEP

Quản trị định nghĩa *cách thức* công việc được cấp phép, thực thi, review và phát hành.
Nó vận hành hóa [Constitution](../constitution/CONSTITUTION.md).

## 1. Các tài liệu quản trị

| Tài liệu | Mục đích |
|----------|---------|
| [Constitution](../constitution/CONSTITUTION.md) | Các nguyên tắc bền vững |
| [Review Level Policy](REVIEW-LEVEL-POLICY.md) | Pipeline L1–L4 & Codex guard |
| [Scope Lock v1.0](SCOPE-LOCK-v1.0.md) | Điều gì trong / ngoài phạm vi |
| [Architecture Freeze v1.0](ARCHITECTURE-FREEZE-v1.0.md) | Các quyết định kỹ thuật đã đóng băng |
| ADRs (`docs/adr/`) | Các quyết định architecture được ghi nhận |
| SOPs (`docs/sop/`) | Các quy trình vận hành có thể lặp lại |

## 2. Vòng đời bàn giao

```
Backlog → Work Order (assign ReviewLevel) → Implement → Claude self review
      → Test → Validate → Route review by ReviewLevel → Collect artifacts
      → Fix findings → Re-test/Re-validate → Document → Commit → Update PMO
      → Next Work Order
```

Mỗi Work Order nằm tại `pmo/work-orders/<WO-ID>/work-order.md` và tiến triển
qua các trạng thái `backlog → planned → in-progress → in-review → done`
(`blocked` khi áp dụng được).

## 3. Định nghĩa Hoàn thành (Definition of Done)

Một Work Order được coi là Done khi:

- Các deliverable tồn tại trong repository.
- Claude self review đã hoàn tất.
- Các reviewer cho ReviewLevel của nó đã chạy (hoặc tồn tại một disposition được ghi chép).
- Không còn finding CRITICAL chưa giải quyết; các finding HIGH đã được giải quyết hoặc dispositioned.
- Các quality gates `aiep validate` pass.
- Các thay đổi được commit như một đơn vị bàn giao logic.

## 4. Quality gates (được thực thi bởi `aiep validate`)

1. Các artifact governance & documentation bắt buộc phải hiện diện.
2. Mọi Work Order đều định dạng đúng và mang một ReviewLevel.
3. Codex guard: không có artifact Codex tại bất kỳ Work Order non-L4 nào.
4. Các Work Order đã được review có đủ artifact bắt buộc của chúng.
5. Không còn finding CRITICAL chưa giải quyết (HIGH tạo ra cảnh báo yêu cầu disposition).
6. Không có secret nào được commit.
7. Scope Lock được tôn trọng (không có bề mặt ngoài phạm vi).

## 5. Ra quyết định & leo thang

- Các quyết định về kỹ thuật và triển khai architecture được đưa ra bởi Execution
  Lead và được ghi nhận trong các ADR và Decision Log.
- Các thay đổi đối với Constitution, Scope Lock hoặc Architecture Freeze, và bất kỳ nhu cầu nào về
  secret, chi tiêu, hành động phá hủy ngoài AIEP, hoặc một quyết định kinh doanh mà repo
  không thể làm cơ sở, đều là các **blocker cứng** được leo thang lên Product Owner.

## 6. Bằng chứng & audit

Cây thư mục `.aiep/artifacts/` cùng với lịch sử git tạo thành hồ sơ audit. Dashboard
và `aiep status` tóm tắt nó; `aiep artifacts <WO-ID>` kiểm tra bằng chứng của một
Work Order đơn lẻ.
