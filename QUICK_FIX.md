# ⚡ Quick Fix - Ứng dụng chỉ hiện trang index

## Vấn đề
Ứng dụng chỉ hiển thị trang index, không có dữ liệu phòng trọ.

## Giải pháp nhanh

### Bước 1: Kiểm tra Server
```bash
# Terminal 1: Chạy server
npm run server
```

Kiểm tra xem server có chạy trên port 5000 không. Nếu có lỗi, kiểm tra:
- MySQL có đang chạy không
- File .env có đúng cấu hình không

### Bước 2: Khởi tạo Database (nếu chưa)
```bash
npm run init-db
```

### Bước 3: Seed dữ liệu mẫu
```bash
npm run seed-db
```

Lệnh này sẽ:
- Tạo 1 landlord mẫu (landlord1@example.com / password: 123456)
- Tạo 1 renter mẫu (renter1@example.com / password: 123456)
- Thêm 5 phòng trọ mẫu

### Bước 4: Chạy Frontend
```bash
# Terminal 2: Chạy frontend
npm run client
```

Hoặc chạy cả 2 cùng lúc:
```bash
npm run dev
```

### Bước 5: Kiểm tra Browser
1. Mở http://localhost:3000
2. Mở Browser Console (F12)
3. Kiểm tra:
   - Có lỗi JavaScript không?
   - API calls có thành công không? (Network tab)
   - Debug info hiển thị gì? (ở chế độ development)

## Nếu vẫn không hoạt động:

### Kiểm tra Console Logs
Mở Browser Console (F12) và kiểm tra:
- `App component mounted` - App đã mount
- `Fetching rooms from API...` - Đang fetch data
- `API Response:` - Xem response từ API
- `Rooms data:` - Xem dữ liệu rooms

### Kiểm tra Network Tab
1. Mở Network tab (F12 → Network)
2. Reload trang
3. Tìm request đến `/api/rooms`
4. Kiểm tra:
   - Status code (200 = OK, 500 = Server error, 404 = Not found)
   - Response data

### Kiểm tra Server Logs
Xem terminal nơi chạy server:
- `✅ Kết nối database thành công` - Database OK
- `❌ Lỗi kết nối database` - Database lỗi
- Các error messages khác

## Debug Info

Ở chế độ development, bạn sẽ thấy:
1. **Debug Info box** ở đầu trang - Hiển thị số lượng rooms, loading state
2. **Debug Info panel** ở góc phải dưới - Hiển thị server status, database status

## Thông tin đăng nhập mẫu:

Sau khi chạy `npm run seed-db`:

**Landlord:**
- Email: landlord1@example.com
- Password: 123456

**Renter:**
- Email: renter1@example.com
- Password: 123456

## Vẫn không được?

1. Kiểm tra file `.env` có đúng không
2. Kiểm tra MySQL có chạy không
3. Kiểm tra port 5000 và 3000 có bị chiếm không
4. Xem file `TROUBLESHOOTING.md` để biết thêm chi tiết


## Vấn đề
Ứng dụng chỉ hiển thị trang index, không có dữ liệu phòng trọ.

## Giải pháp nhanh

### Bước 1: Kiểm tra Server
```bash
# Terminal 1: Chạy server
npm run server
```

Kiểm tra xem server có chạy trên port 5000 không. Nếu có lỗi, kiểm tra:
- MySQL có đang chạy không
- File .env có đúng cấu hình không

### Bước 2: Khởi tạo Database (nếu chưa)
```bash
npm run init-db
```

### Bước 3: Seed dữ liệu mẫu
```bash
npm run seed-db
```

Lệnh này sẽ:
- Tạo 1 landlord mẫu (landlord1@example.com / password: 123456)
- Tạo 1 renter mẫu (renter1@example.com / password: 123456)
- Thêm 5 phòng trọ mẫu

### Bước 4: Chạy Frontend
```bash
# Terminal 2: Chạy frontend
npm run client
```

Hoặc chạy cả 2 cùng lúc:
```bash
npm run dev
```

### Bước 5: Kiểm tra Browser
1. Mở http://localhost:3000
2. Mở Browser Console (F12)
3. Kiểm tra:
   - Có lỗi JavaScript không?
   - API calls có thành công không? (Network tab)
   - Debug info hiển thị gì? (ở chế độ development)

## Nếu vẫn không hoạt động:

### Kiểm tra Console Logs
Mở Browser Console (F12) và kiểm tra:
- `App component mounted` - App đã mount
- `Fetching rooms from API...` - Đang fetch data
- `API Response:` - Xem response từ API
- `Rooms data:` - Xem dữ liệu rooms

### Kiểm tra Network Tab
1. Mở Network tab (F12 → Network)
2. Reload trang
3. Tìm request đến `/api/rooms`
4. Kiểm tra:
   - Status code (200 = OK, 500 = Server error, 404 = Not found)
   - Response data

### Kiểm tra Server Logs
Xem terminal nơi chạy server:
- `✅ Kết nối database thành công` - Database OK
- `❌ Lỗi kết nối database` - Database lỗi
- Các error messages khác

## Debug Info

Ở chế độ development, bạn sẽ thấy:
1. **Debug Info box** ở đầu trang - Hiển thị số lượng rooms, loading state
2. **Debug Info panel** ở góc phải dưới - Hiển thị server status, database status

## Thông tin đăng nhập mẫu:

Sau khi chạy `npm run seed-db`:

**Landlord:**
- Email: landlord1@example.com
- Password: 123456

**Renter:**
- Email: renter1@example.com
- Password: 123456

## Vẫn không được?

1. Kiểm tra file `.env` có đúng không
2. Kiểm tra MySQL có chạy không
3. Kiểm tra port 5000 và 3000 có bị chiếm không
4. Xem file `TROUBLESHOOTING.md` để biết thêm chi tiết

