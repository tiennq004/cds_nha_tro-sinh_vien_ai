# 🚀 Hướng Dẫn Nhanh

## Bước 1: Cài đặt
```bash
npm install
cd client && npm install && cd ..
```

## Bước 2: Tạo file .env
Tạo file `.env` ở thư mục gốc:
```
PORT=5000
GEMINI_API_KEY=your_api_key_here
```

**Lấy API Key:** Truy cập https://makersuite.google.com/app/apikey

## Bước 3: Chạy ứng dụng
```bash
npm run dev
```

Truy cập: http://localhost:3000

---

## Cách sử dụng

### 1. Tìm kiếm nhà trọ
- Nhập từ khóa, giá, địa chỉ... vào form tìm kiếm
- Nhấn "Tìm kiếm"

### 2. Chat với AI
- Nhấn nút "💬 Chat với AI" ở góc phải
- Nhập câu hỏi của bạn (ví dụ: "Tìm phòng giá rẻ dưới 2 triệu")
- AI sẽ tư vấn cho bạn

### 3. AI Gợi ý
- Mở phần "✨ AI Gợi Ý Nhà Trọ"
- Nhập yêu cầu (ví dụ: "Phòng có điều hòa, wifi, giá dưới 2 triệu")
- Nhấn "Nhận gợi ý từ AI"
- Xem các phòng được gợi ý

---

## Troubleshooting

**Lỗi: "GEMINI_API_KEY is not defined"**
- Kiểm tra file `.env` đã tồn tại và có API key hợp lệ

**Lỗi: "Cannot find module"**
- Chạy lại `npm install` ở cả thư mục gốc và `client/`

**Backend không chạy**
- Kiểm tra port 5000 đã bị chiếm chưa
- Thay đổi PORT trong file `.env`










