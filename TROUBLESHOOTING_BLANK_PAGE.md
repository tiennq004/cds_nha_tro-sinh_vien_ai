# Khắc phục lỗi trang trắng

## Các bước kiểm tra:

### 1. Kiểm tra Server có chạy không

Mở terminal và chạy:
```bash
npm run server
```

Server phải chạy trên port 5000. Bạn sẽ thấy:
```
🚀 Server is running on port 5000
📊 Database: nha_tro_db
```

### 2. Kiểm tra Client có chạy không

Mở terminal mới và chạy:
```bash
npm run client
```

Hoặc:
```bash
cd client
npm run dev
```

Client phải chạy trên port 3000.

### 3. Kiểm tra Browser Console

1. Mở trình duyệt (Chrome/Firefox)
2. Nhấn F12 để mở Developer Tools
3. Chuyển đến tab "Console"
4. Xem có lỗi màu đỏ nào không

### 4. Kiểm tra Network

1. Trong Developer Tools, chuyển đến tab "Network"
2. Refresh trang (F5)
3. Kiểm tra xem request đến `/api/rooms` có thành công không
4. Nếu thấy lỗi 404 hoặc 500, có thể server không chạy hoặc có lỗi

### 5. Kiểm tra lỗi thường gặp

#### Lỗi: "Cannot GET /"
- **Nguyên nhân**: Server không chạy hoặc port sai
- **Giải pháp**: Đảm bảo server chạy trên port 5000

#### Lỗi: "Network Error" hoặc "Failed to fetch"
- **Nguyên nhân**: Server không chạy hoặc không kết nối được
- **Giải pháp**: 
  1. Kiểm tra server có chạy không
  2. Kiểm tra firewall có chặn port 5000 không
  3. Thử truy cập trực tiếp: http://localhost:5000/api/health

#### Lỗi: "Module not found" hoặc "Cannot find module"
- **Nguyên nhân**: Thiếu dependencies
- **Giải pháp**: 
```bash
npm install
cd client
npm install
```

#### Lỗi: "Multer is not defined" hoặc lỗi liên quan đến multer
- **Nguyên nhân**: Multer chưa được cài đặt
- **Giải pháp**:
```bash
npm install multer
```

### 6. Khởi động lại hoàn toàn

1. Dừng tất cả process Node.js:
   - Windows: Đóng tất cả terminal windows
   - Hoặc kill process: `taskkill /F /IM node.exe`

2. Xóa node_modules và cài lại:
```bash
rm -rf node_modules
rm -rf client/node_modules
npm install
cd client
npm install
cd ..
```

3. Khởi động lại:
```bash
npm run dev
```

### 7. Kiểm tra file .env

Đảm bảo file `.env` trong thư mục `server` có đầy đủ thông tin:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nha_tro_db
PORT=5000
```

### 8. Kiểm tra Database

Đảm bảo database đã được tạo và có dữ liệu:
```bash
npm run init-db
npm run seed-db
```

## Nếu vẫn không được:

1. Kiểm tra log trong terminal của server
2. Kiểm tra log trong terminal của client
3. Kiểm tra browser console để xem lỗi cụ thể
4. Thử clear cache của browser (Ctrl+Shift+Delete)
5. Thử mở trong chế độ incognito/private

## Liên hệ hỗ trợ:

Nếu vẫn gặp vấn đề, vui lòng cung cấp:
- Screenshot của browser console (F12)
- Log từ terminal server
- Log từ terminal client
- Thông tin về lỗi cụ thể



