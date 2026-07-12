# Skill: Secret Hygiene

**Type:** Quy trình kỹ thuật lặp lại được (SOP)
**Goal:** Không bao giờ commit secret (API key, token, password, private key, connection
string) vào repository hay vào artifact, và bắt được chúng trước khi chúng lọt vào.

## Vì sao

AIEP tuyển chọn một library tái sử dụng được và tạo ra artifact dưới `.aiep/artifacts/`. Một
credential bị rò rỉ trong bất kỳ thứ nào trong số này sẽ lan rộng và tốn kém để rotate. Secret hygiene là một
điều kiện tiên quyết thường trực của mọi review, và phát hiện secret cơ bản là một phần của
lăng kính tính đúng đắn (DeepSeek "basic security").

## Quy tắc

1. **Không secret trong source, config, docs, hay artifact.** `.aiep/config.json` giữ
   cấu hình, không phải credential. Secret thật thuộc về môi trường hoặc một file cục bộ,
   được git-ignore — không bao giờ commit.
2. **Không secret trong input/output của reviewer.** Khi dựng một diff để review, không
   bao gồm các giá trị credential thật; redact trước khi gửi tới bất kỳ reviewer bên ngoài nào
   (Gemini, Codex).
3. **Rotate, đừng chỉ xóa.** Nếu một secret đã bị commit, coi nó như bị lộ:
   rotate credential; xóa file là không đủ vì history vẫn giữ lại nó.

## Các pattern quét

Quét các dòng được thêm/thay đổi trong delta để tìm các pattern tín hiệu cao. Ví dụ (điều chỉnh khi
cần; đây là các heuristic phát hiện, không phải một đảm bảo):

```text
# Generic assignment of a secret-like value
(?i)(api[_-]?key|secret|token|passwd|password|client[_-]?secret)\s*[:=]\s*['"][^'"]{8,}['"]

# Private key blocks
-----BEGIN (RSA|EC|OPENSSH|PGP|DSA)? ?PRIVATE KEY-----

# Cloud/provider key shapes (illustrative)
AKIA[0-9A-Z]{16}                      # AWS access key id
gh[pousr]_[A-Za-z0-9]{20,}            # GitHub token
xox[baprs]-[A-Za-z0-9-]{10,}          # Slack token

# High-entropy long hex/base64 literals assigned to a variable
(?i)(key|token|secret)\s*[:=]\s*['"][A-Za-z0-9+/=_-]{32,}['"]
```

## Quy trình

1. Trước khi stage, quét delta với các pattern ở trên.
2. Nếu một match là một secret thật: xóa nó, chuyển nó sang môi trường / config
   được git-ignore, và rotate credential.
3. Nếu là một false positive (một mẫu, một giá trị công khai): xác nhận và, nơi nào hữu ích,
   chú thích để các lần quét tương lai hiểu ngoại lệ.
4. Một secret đã xác nhận trong một thay đổi là một finding **CRITICAL** (chặn) — WO không thể
   pass cho tới khi nó được khắc phục và credential được rotate.

## Definition of done

Delta không chứa credential còn sống, mọi lần lộ trước đó đã được rotate, và
bước quét là một phần của routine pre-commit / pre-review.
