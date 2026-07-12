# AIEP Release Checklist (v1.0)

Dùng checklist này để đề bạt (promote) một release candidate. Tích chọn từng mục.

## Build & test

- [ ] `npm test` — tất cả suite đều pass.
- [ ] `node bin/aiep.js doctor` — môi trường đã được rà soát (ghi nhận các backend suy giảm).
- [ ] `node bin/aiep.js validate` — tất cả gate FAIL đều pass; WARN đã được dispositioned.

## Bằng chứng review

- [ ] Mọi Work Order không tầm thường đều có một ReviewLevel.
- [ ] Các Work Order đã review có những artifact bắt buộc dưới `.aiep/artifacts/`.
- [ ] Không còn finding CRITICAL chưa xử lý.
- [ ] Các finding HIGH đã được giải quyết hoặc dispositioned trong Decision Log / Work Order.
- [ ] Đã xác minh Codex guard (không có Codex dưới L4; unit test xanh).

## Tài liệu

- [ ] PROJECT.md, README.md, CHANGELOG.md cập nhật.
- [ ] Bộ governance đầy đủ và nhất quán (Constitution, Governance, Review
      Level Policy, Scope Lock, Architecture Freeze).
- [ ] Đặc tả thiết kế và mô hình dữ liệu cập nhật.
- [ ] Release notes đã viết.

## PMO

- [ ] Backlog, sprint, milestone và risk phản ánh đúng trạng thái thực tế.
- [ ] Decision Log được cập nhật với các quyết định phát hành.

## Đóng gói (Packaging)

- [ ] `node bin/aiep.js package --dry-run` đã được rà soát.
- [ ] `node bin/aiep.js package` tạo ra một tarball trong `dist/`.
- [ ] Đã xác minh cài đặt cục bộ: `npm install -g ./dist/tunglt6-aiep-1.0.0.tgz`.

## Ký duyệt (Sign-off)

- [ ] Đã tập hợp Final Release Review Package (`FINAL-RELEASE-REVIEW-PACKAGE.md`).
- [ ] Đã trình lên Product Owner & ARB để rà soát cuối.
