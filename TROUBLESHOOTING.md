# 🔧 Hướng Dẫn Xử Lý Sự Cố

## Vấn đề: Ứng dụng chỉ hiển thị trang index

### Nguyên nhân có thể:

1. **Database chưa có dữ liệu**
   - Database đã được tạo nhưng chưa có dữ liệu phòng trọ
   - Giải pháp: Chạy script seed dữ liệu mẫu

2. **Server không chạy**
   - Backend server không khởi động
   - Giải pháp: Kiểm tra server có đang chạy trên port 5000 không

3. **Database không kết nối được**
   - MySQL chưa chạy hoặc cấu hình sai
   - Giải pháp: Kiểm tra MySQL và file .env

4. **API trả về lỗi**
   - API endpoint không hoạt động đúng
   - Giải pháp: Kiểm tra console và network tab

### Các bước kiểm tra:

#### Bước 1: Kiểm tra Server
```bash
# Kiểm tra server có chạy không
curl http://localhost:5000/api/health
```

Nếu không có response, server chưa chạy. Chạy:
```bash
npm run server
```

#### Bước 2: Kiểm tra Database
```bash
# Kiểm tra database có kết nối được không
npm run init-db
```

Nếu có lỗi, kiểm tra:
- MySQL có đang chạy không
- Thông tin trong file .env có đúng không

#### Bước 3: Seed dữ liệu mẫu
```bash
# Thêm dữ liệu mẫu vào database
npm run seed-db
```

#### Bước 4: Kiểm tra Frontend
1. Mở browser console (F12)
2. Kiểm tra có lỗi JavaScript không
3. Kiểm tra Network tab xem API calls có thành công không

#### Bước 5: Kiểm tra Debug Info
- Ở chế độ development, sẽ có debug info hiển thị
- Kiểm tra số lượng rooms, loading state, server status

### Các lỗi thường gặp:

#### 1. "Cannot connect to server"
- **Nguyên nhân**: Server chưa chạy hoặc port bị chiếm
- **Giải pháp**: 
  - Kiểm tra server có chạy không: `npm run server`
  - Kiểm tra port 5000 có bị chiếm không
  - Kiểm tra file .env có đúng PORT không

#### 2. "Database connection failed"
- **Nguyên nhân**: MySQL chưa chạy hoặc cấu hình sai
- **Giải pháp**:
  - Kiểm tra MySQL có chạy không
  - Kiểm tra file .env có đúng thông tin DB không
  - Chạy lại: `npm run init-db`

#### 3. "No rooms found"
- **Nguyên nhân**: Database chưa có dữ liệu
- **Giải pháp**: Chạy `npm run seed-db` để thêm dữ liệu mẫu

#### 4. "API endpoint not found"
- **Nguyên nhân**: Route không đúng hoặc server chưa khởi động
- **Giải pháp**: Kiểm tra server routes và restart server

### Debug Tools:

#### 1. Browser Console
- Mở F12 → Console
- Xem các log và error messages
- Kiểm tra network requests

#### 2. Debug Info Component
- Ở chế độ development, sẽ hiển thị debug info
- Hiển thị server status, database status, số lượng rooms

#### 3. Server Logs
- Kiểm tra terminal nơi chạy server
- Xem các log và error messages từ server

### Checklist:

- [ ] MySQL đang chạy
- [ ] File .env đã được cấu hình đúng
- [ ] Database đã được khởi tạo (`npm run init-db`)
- [ ] Dữ liệu mẫu đã được seed (`npm run seed-db`)
- [ ] Server đang chạy trên port 5000
- [ ] Frontend đang chạy trên port 3000
- [ ] Không có lỗi trong browser console
- [ ] API calls trả về thành công (status 200)

### Liên hệ:

Nếu vẫn gặp vấn đề, vui lòng:
1. Kiểm tra browser console để xem lỗi cụ thể
2. Kiểm tra server logs
3. Kiểm tra network tab để xem API responses
4. Cung cấp thông tin lỗi để được hỗ trợ


## Vấn đề: Ứng dụng chỉ hiển thị trang index

### Nguyên nhân có thể:

1. **Database chưa có dữ liệu**
   - Database đã được tạo nhưng chưa có dữ liệu phòng trọ
   - Giải pháp: Chạy script seed dữ liệu mẫu

2. **Server không chạy**
   - Backend server không khởi động
   - Giải pháp: Kiểm tra server có đang chạy trên port 5000 không

3. **Database không kết nối được**
   - MySQL chưa chạy hoặc cấu hình sai
   - Giải pháp: Kiểm tra MySQL và file .env

4. **API trả về lỗi**
   - API endpoint không hoạt động đúng
   - Giải pháp: Kiểm tra console và network tab

### Các bước kiểm tra:

#### Bước 1: Kiểm tra Server
```bash
# Kiểm tra server có chạy không
curl http://localhost:5000/api/health
```

Nếu không có response, server chưa chạy. Chạy:
```bash
npm run server
```

#### Bước 2: Kiểm tra Database
```bash
# Kiểm tra database có kết nối được không
npm run init-db
```

Nếu có lỗi, kiểm tra:
- MySQL có đang chạy không
- Thông tin trong file .env có đúng không

#### Bước 3: Seed dữ liệu mẫu
```bash
# Thêm dữ liệu mẫu vào database
npm run seed-db
```

#### Bước 4: Kiểm tra Frontend
1. Mở browser console (F12)
2. Kiểm tra có lỗi JavaScript không
3. Kiểm tra Network tab xem API calls có thành công không

#### Bước 5: Kiểm tra Debug Info
- Ở chế độ development, sẽ có debug info hiển thị
- Kiểm tra số lượng rooms, loading state, server status

### Các lỗi thường gặp:

#### 1. "Cannot connect to server"
- **Nguyên nhân**: Server chưa chạy hoặc port bị chiếm
- **Giải pháp**: 
  - Kiểm tra server có chạy không: `npm run server`
  - Kiểm tra port 5000 có bị chiếm không
  - Kiểm tra file .env có đúng PORT không

#### 2. "Database connection failed"
- **Nguyên nhân**: MySQL chưa chạy hoặc cấu hình sai
- **Giải pháp**:
  - Kiểm tra MySQL có chạy không
  - Kiểm tra file .env có đúng thông tin DB không
  - Chạy lại: `npm run init-db`

#### 3. "No rooms found"
- **Nguyên nhân**: Database chưa có dữ liệu
- **Giải pháp**: Chạy `npm run seed-db` để thêm dữ liệu mẫu

#### 4. "API endpoint not found"
- **Nguyên nhân**: Route không đúng hoặc server chưa khởi động
- **Giải pháp**: Kiểm tra server routes và restart server

### Debug Tools:

#### 1. Browser Console
- Mở F12 → Console
- Xem các log và error messages
- Kiểm tra network requests

#### 2. Debug Info Component
- Ở chế độ development, sẽ hiển thị debug info
- Hiển thị server status, database status, số lượng rooms

#### 3. Server Logs
- Kiểm tra terminal nơi chạy server
- Xem các log và error messages từ server

### Checklist:

- [ ] MySQL đang chạy
- [ ] File .env đã được cấu hình đúng
- [ ] Database đã được khởi tạo (`npm run init-db`)
- [ ] Dữ liệu mẫu đã được seed (`npm run seed-db`)
- [ ] Server đang chạy trên port 5000
- [ ] Frontend đang chạy trên port 3000
- [ ] Không có lỗi trong browser console
- [ ] API calls trả về thành công (status 200)

### Liên hệ:

Nếu vẫn gặp vấn đề, vui lòng:
1. Kiểm tra browser console để xem lỗi cụ thể
2. Kiểm tra server logs
3. Kiểm tra network tab để xem API responses
4. Cung cấp thông tin lỗi để được hỗ trợ













