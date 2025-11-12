# 🚀 Hướng Dẫn Cài Đặt Nhanh

## Bước 1: Cài đặt Dependencies

```bash
npm run install-all
```

## Bước 2: Cấu hình MySQL

1. Đảm bảo MySQL đã được cài đặt và đang chạy
2. Tạo file `.env` ở thư mục gốc với nội dung:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nha_tro_db
JWT_SECRET=your-secret-key-change-in-production
GOOGLE_API_KEY=your_google_api_key_here
```

## Bước 3: Khởi tạo Database

```bash
npm run init-db
```

Hoặc thủ công:

1. Mở MySQL command line hoặc phpMyAdmin
2. Chạy file `server/database/schema.sql`

## Bước 4: Chạy ứng dụng

```bash
npm run dev
```

## Bước 5: Truy cập

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📝 Lưu ý

- Đảm bảo MySQL đang chạy trước khi khởi tạo database
- Cần có Google Gemini API Key để sử dụng tính năng AI
- Đổi `JWT_SECRET` trong production để bảo mật

## 🔧 Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL đang chạy
- Kiểm tra thông tin trong `.env` file
- Đảm bảo user có quyền tạo database

### Lỗi API Key
- Kiểm tra `GOOGLE_API_KEY` trong `.env`
- Đảm bảo API key hợp lệ từ Google AI Studio

### Lỗi port đã sử dụng
- Đổi `PORT` trong `.env` file
- Hoặc dừng process đang sử dụng port đó



## Bước 1: Cài đặt Dependencies

```bash
npm run install-all
```

## Bước 2: Cấu hình MySQL

1. Đảm bảo MySQL đã được cài đặt và đang chạy
2. Tạo file `.env` ở thư mục gốc với nội dung:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nha_tro_db
JWT_SECRET=your-secret-key-change-in-production
GOOGLE_API_KEY=your_google_api_key_here
```

## Bước 3: Khởi tạo Database

```bash
npm run init-db
```

Hoặc thủ công:

1. Mở MySQL command line hoặc phpMyAdmin
2. Chạy file `server/database/schema.sql`

## Bước 4: Chạy ứng dụng

```bash
npm run dev
```

## Bước 5: Truy cập

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📝 Lưu ý

- Đảm bảo MySQL đang chạy trước khi khởi tạo database
- Cần có Google Gemini API Key để sử dụng tính năng AI
- Đổi `JWT_SECRET` trong production để bảo mật

## 🔧 Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL đang chạy
- Kiểm tra thông tin trong `.env` file
- Đảm bảo user có quyền tạo database

### Lỗi API Key
- Kiểm tra `GOOGLE_API_KEY` trong `.env`
- Đảm bảo API key hợp lệ từ Google AI Studio

### Lỗi port đã sử dụng
- Đổi `PORT` trong `.env` file
- Hoặc dừng process đang sử dụng port đó














