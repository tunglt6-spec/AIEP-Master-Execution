# Review AI cục bộ với Ollama

AIEP chạy hai trong số các reviewer của nó **cục bộ** thông qua **Ollama**: DeepSeek (Code Reviewer)
và Qwen (Technical Reviewer). Review cục bộ giữ cho các lăng kính tính đúng đắn và chất lượng nhanh,
riêng tư, và có khả năng offline — change delta không bao giờ rời khỏi máy ở các giai đoạn này.

## Reviewer nào là cục bộ

| Reviewer | Vai trò | Chạy qua |
|----------|------|----------|
| DeepSeek | Local Code Reviewer — tính đúng đắn, runtime, edge case, bảo mật cơ bản, error handling | Ollama (cục bộ) |
| Qwen | Local Technical Reviewer — khả năng bảo trì, dead code, trùng lặp, hiệu năng, kiến trúc, cấu trúc | Ollama (cục bộ) |

Gemini và Codex **không** cục bộ — chúng là các reviewer bên ngoài được dùng ở L3 và L4
tương ứng.

## Vì sao cục bộ

- **Riêng tư** — delta cho review tính đúng đắn/chất lượng L2 ở lại trên máy.
- **Chi phí** — không có chi tiêu bên ngoài theo lời gọi cho hai reviewer chạy thường xuyên nhất.
- **Khả dụng** — review có thể chạy offline một khi các model đã được pull.

## Điều kiện tiên quyết

1. Ollama đã cài và service của nó đang chạy.
2. Các model DeepSeek và Qwen đã được pull cục bộ.
3. AIEP được cấu hình để tới endpoint Ollama cục bộ (cấu hình nằm trong
   `.aiep/config.json`; không secret nào thuộc về đó — xem skill secret-hygiene).

## Xác minh môi trường

Dùng health check của nền tảng trước khi dựa vào review cục bộ:

```text
aiep doctor
```

`aiep doctor` làm nổi tình trạng môi trường để bạn có thể xác nhận các backend cục bộ
tới được trước khi chạy `aiep review`.

## Khi một backend cục bộ không khả dụng

Nếu Ollama không chạy hoặc một model chưa được pull, **không** âm thầm bỏ qua reviewer.
Áp dụng skill **graceful-degradation**: gán một disposition được ghi lại
(`SKIPPED_UNAVAILABLE`, `DEFERRED`, hoặc `SUBSTITUTED`), ghi nó trong artifact của reviewer
và `decision.json`, và nhớ rằng một reviewer `DEFERRED` nghĩa là WO không thể pass.

## Cách review cục bộ khớp vào pipeline

Ở L2+ thứ tự là claude → **deepseek** → **qwen** (→ gemini ở L3 → codex ở L4).
DeepSeek và Qwen do đó đóng vai trò tuyến soi xét đầu tiên bên-ngoài-Claude và, ở
các mức cao hơn, như các bộ lọc dọn sạch thay đổi trước các giai đoạn Gemini và
Codex tốn kém hơn. Mỗi cái ghi artifact riêng: `deepseek-review.md` và `qwen-review.md`.

## Giữ các lăng kính không chồng lấn

DeepSeek sở hữu *tính đúng đắn*; Qwen sở hữu *chất lượng/cấu trúc*. Giữ các prompt được giới hạn
(xem `prompts/code-review-deepseek.md` và `prompts/code-review-qwen.md`) tránh các finding
trùng lặp và làm cho review summary sạch hơn.
