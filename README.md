# AIEP — AI Engineering Platform

[![version](https://img.shields.io/badge/version-1.3.0-3b5bdb)](CHANGELOG.md)
[![runtime](https://img.shields.io/badge/node-%3E%3D18-2f9e44)](package.json)
[![deps](https://img.shields.io/badge/dependencies-0-2f9e44)](package.json)

Một nền tảng kỹ thuật được dẫn dắt bởi quản trị với **review code đa cấp có sự
hỗ trợ của AI** (L1–L4), một **PMO**, một **thư viện kỹ thuật AI** có thể tái sử dụng,
và một **dashboard** trực tiếp — được cung cấp như một CLI Node.js **zero-dependency** duy nhất.

Được phát hành trên npm dưới tên **[`@tunglt6/aiep`](https://www.npmjs.com/package/@tunglt6/aiep)** (lệnh sau khi cài là `aiep`):

```bash
npm install -g @tunglt6/aiep    # install the CLI globally
aiep doctor
```

Hoặc chạy từ một bản clone mà không cần cài đặt:

```bash
node bin/aiep.js doctor      # check your environment
node bin/aiep.js status      # see platform status
node bin/aiep.js review      # run AI review on your Work Orders
node bin/aiep.js dashboard   # open the live dashboard
```

## Điểm nổi bật

- **Review Levels L1–L4** ánh xạ mỗi Work Order tới một reviewer pipeline có thứ tự.
- **Review AI cục bộ** với DeepSeek + Qwen qua Ollama; review design bằng **Gemini**
  và audit bên ngoài bằng **Codex** được hỗ trợ qua CLI.
- **Codex guard:** auditor bên ngoài chỉ chạy **ở L4** — được thực thi trong code và
  bởi các quality gates để bảo toàn số token khan hiếm.
- **Suy giảm nhẹ nhàng (graceful degradation):** một backend không khả dụng sẽ tạo ra một quyết định
  tích hợp được ghi chép, không bao giờ là một lần pass giả.
- **Quality gates** (`aiep validate`): tài liệu hiện diện, Work Orders hợp lệ, Codex
  guard, tính đầy đủ của artifact, không còn CRITICAL chưa giải quyết, không có secret, scope lock.
- **Zero dependencies:** chỉ dùng Node built-ins — cài đặt và chạy offline.

## Tài liệu

- [PROJECT.md](PROJECT.md) — tổng quan, cài đặt, cách dùng, bố cục.
- [User Guide](docs/USER-GUIDE.md) — hướng dẫn sử dụng chi tiết, từng bước cho mọi lệnh.
- [Documentation index](docs/README.md).
- [Review Level Policy](docs/governance/REVIEW-LEVEL-POLICY.md).
- [Design Specification](docs/design/DESIGN-SPECIFICATION-v1.0.md).

## Phát triển

```bash
npm test              # run the node:test suites
npm run validate      # quality gates
npm run dashboard     # build dashboard data
```

## Giấy phép

MIT — xem [LICENSE](LICENSE).
