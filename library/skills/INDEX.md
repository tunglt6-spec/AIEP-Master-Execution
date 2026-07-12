# Skills Index

Các quy trình kỹ thuật lặp lại được (SOP) cho AIEP v1.0. Mỗi skill là một routine được
ghi lại mà một kỹ sư hoặc agent tuân theo giống hệt nhau mỗi lần, để hành vi giữ
nhất quán và có thể truy vết.

| Skill | Mục đích | Gắn với |
|-------|---------|-----------|
| [review-routing.md](review-routing.md) | Route một Work Order tới đúng các reviewer mà `ReviewLevel` của nó yêu cầu; thực thi guard Codex-chỉ-ở-L4. | `aiep review`, Review Level Policy |
| [git-delta-review.md](git-delta-review.md) | Giới hạn mọi review vào change delta, không phải toàn bộ cây. | Tất cả prompt reviewer |
| [graceful-degradation.md](graceful-degradation.md) | Xử lý các reviewer backend không khả dụng bằng một disposition tường minh, được ghi lại. | `aiep doctor`, `decision.json` |
| [secret-hygiene.md](secret-hygiene.md) | Giữ secret ngoài repo và artifact; quét delta; rotate khi bị lộ. | Lăng kính basic-security của DeepSeek |

## Các skill liên hệ với nhau ra sao

- **review-routing** quyết định *ai* review; **git-delta-review** quyết định *cái gì* họ
  review; **graceful-degradation** quyết định điều gì xảy ra khi một reviewer *vắng mặt*.
- **secret-hygiene** là một điều kiện tiên quyết thường trực áp dụng cho mọi WO bất kể
  review level, và một secret đã xác nhận luôn là một finding chặn (CRITICAL).
