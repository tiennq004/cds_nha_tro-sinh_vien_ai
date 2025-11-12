# Hướng dẫn sửa lỗi upload hình ảnh

## Các bước kiểm tra:

### 1. Kiểm tra Server có chạy không
```bash
npm run server
```

Server phải hiển thị:
```
🚀 Server is running on port 5000
📊 Database: nha_tro_db
🌐 API: http://localhost:5000/api
📁 Uploads: http://localhost:5000/uploads
```

### 2. Kiểm tra thư mục uploads
Đảm bảo thư mục `server/uploads/images` tồn tại. Nếu chưa có, server sẽ tự động tạo.

### 3. Kiểm tra multer đã được cài đặt
```bash
npm list multer
```

Nếu chưa có, cài đặt:
```bash
npm install multer
```

### 4. Kiểm tra quyền truy cập
- Đảm bảo bạn đã đăng nhập với tài khoản landlord
- Token phải hợp lệ
- Kiểm tra trong browser console có lỗi 401 (Unauthorized) không

### 5. Kiểm tra file được chọn
- File phải là ảnh (jpeg, jpg, png, gif, webp)
- Kích thước tối đa: 5MB
- Kiểm tra trong browser console có thông báo lỗi gì không

### 6. Kiểm tra Network tab
1. Mở Developer Tools (F12)
2. Vào tab Network
3. Thử upload hình ảnh
4. Xem request `/api/upload/image`:
   - Status code là gì? (200 = thành công, 400/500 = lỗi)
   - Response có gì?
   - Request headers có Authorization token không?

### 7. Kiểm tra server logs
Xem console của server có hiển thị:
- `📤 Upload request received`
- `✅ File uploaded successfully`
- Hoặc có lỗi gì không?

## Các lỗi thường gặp:

### Lỗi: "Token không được cung cấp" hoặc 401
- **Nguyên nhân**: Chưa đăng nhập hoặc token hết hạn
- **Giải pháp**: Đăng nhập lại

### Lỗi: "File quá lớn"
- **Nguyên nhân**: File lớn hơn 5MB
- **Giải pháp**: Nén ảnh hoặc chọn ảnh nhỏ hơn

### Lỗi: "Chỉ chấp nhận file ảnh"
- **Nguyên nhân**: File không phải là ảnh hoặc định dạng không được hỗ trợ
- **Giải pháp**: Chọn file ảnh hợp lệ (jpeg, jpg, png, gif, webp)

### Lỗi: "Không có file được upload"
- **Nguyên nhân**: FormData không được gửi đúng
- **Giải pháp**: 
  1. Kiểm tra browser console có lỗi gì không
  2. Kiểm tra server logs
  3. Đảm bảo không set Content-Type header khi upload

### Lỗi: Server không chạy (localhost:5000 không truy cập được)
- **Nguyên nhân**: Server chưa khởi động hoặc port bị chiếm
- **Giải pháp**:
  1. Kiểm tra server có đang chạy không
  2. Kiểm tra port 5000 có bị process khác sử dụng không
  3. Thử đổi port trong file .env

## Test thủ công:

### Test server root route:
```bash
curl http://localhost:5000/
```

Phải trả về JSON với thông tin server.

### Test upload endpoint (cần token):
```bash
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

## Nếu vẫn không được:

1. Kiểm tra server logs để xem lỗi cụ thể
2. Kiểm tra browser console để xem lỗi client
3. Kiểm tra Network tab để xem request/response
4. Đảm bảo multer đã được cài đặt đúng cách
5. Đảm bảo thư mục uploads có quyền ghi



