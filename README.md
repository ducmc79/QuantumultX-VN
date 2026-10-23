# QuantumultX-VN

Bản dịch tiếng Việt của script **resource-parser.js** cho Quantumult X.

## Tác giả gốc

Script gốc của **Shawn** — repo gốc: https://github.com/KOP-XIAO/QuantumultX

Bản này chỉ dịch phần giải thích, nhãn giao diện và thông báo sang tiếng Việt.
Logic, tên tham số, URL và credit gốc được giữ nguyên.

Lưu ý: các từ khóa dùng để khớp tên node (ví dụ tên khu vực tiếng Trung),
bảng gán cờ emoji theo tên node và một số token nội bộ được giữ nguyên cố ý,
vì dịch chúng sẽ làm hỏng chức năng nhận diện/lọc node.

## Cách dùng

Trong file cấu hình Quantumult X, mục `[general]`, thêm:

```
resource_parser_url = https://raw.githubusercontent.com/ducmc79/QuantumultX-VN/main/resource-parser.js
```

Sau đó cập nhật tài nguyên trong app. Nếu app báo chưa có parser tùy chỉnh,
hãy làm mới tài nguyên và khởi động lại app rồi thử lại.

## File

- `resource-parser.js` — bản dịch tiếng Việt, dùng trực tiếp làm `resource_parser_url`.
