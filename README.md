<h2 align="center">
    <a href="https://dainam.edu.vn/vi/khoa-cong-nghe-thong-tin">
    🎓 Faculty of Information Technology (DaiNam University)
    </a>
</h2>

<h2 align="center">  
   ỨNG DỤNG CHUYỂN ĐỔI SỐ TRONG TÌM KIẾM NHÀ TRỌ
</h2>

<div align="center">
    <p align="center">
        <img src="https://github.com/tiennq004/cds_nha_tro-sinh_vien_ai/blob/main/img/fitdnu_logo.png" alt="FIT DNU Logo" width="180"/>
        <img src="https://github.com/tiennq004/cds_nha_tro-sinh_vien_ai/blob/main/img/dnu_logo.png" alt="DaiNam University Logo" width="200"/>
    </p>

[![AIoTLab](https://img.shields.io/badge/AIoTLab-green?style=for-the-badge)](https://www.facebook.com/DNUAIoTLab)
[![Faculty of Information Technology](https://img.shields.io/badge/Faculty%20of%20Information%20Technology-blue?style=for-the-badge)](https://dainam.edu.vn/vi/khoa-cong-nghe-thong-tin)
[![DaiNam University](https://img.shields.io/badge/DaiNam%20University-orange?style=for-the-badge)](https://dainam.edu.vn)
</div>

---

## 📖 1. Giới thiệu hệ thống

**Ứng dụng Chuyển đổi số trong tìm kiếm nhà trọ** là hệ thống web hỗ trợ sinh viên và người cho thuê trọ đăng tin, tìm kiếm, so sánh, và đặt cọc trực tuyến thông qua mã QR.  
Hệ thống được phát triển nhằm **nâng cao hiệu quả quản lý phòng trọ**, giúp tiết kiệm thời gian, minh bạch thông tin và hỗ trợ quá trình chuyển đổi số trong lĩnh vực bất động sản cho thuê.

### 🎯 Mục tiêu chính
- Giúp **người thuê trọ** dễ dàng tìm kiếm, lọc, so sánh và đặt cọc phòng nhanh chóng.  
- Hỗ trợ **người cho thuê** quản lý danh sách phòng, thêm ảnh, cập nhật tình trạng, và nhận thông tin đặt cọc.  
- Tích hợp **AI gợi ý nhà trọ** dựa trên hành vi tìm kiếm.  
- Cung cấp **nền tảng giao tiếp trực tiếp (chat)** giữa người thuê và chủ trọ.  
- Ứng dụng mã **QR thanh toán đặt cọc** thông qua hình ảnh do chủ trọ tải lên.

---

## 🔧 2. Công nghệ và công cụ sử dụng

- **Frontend:** ReactJS, Axios, CSS  
- **Backend:** NodeJS (ExpressJS)  
- **Cơ sở dữ liệu:** MySQL (chạy trên XAMPP)  
- **AI Module:** Tích hợp Gemini API để gợi ý phòng trọ phù hợp  
- **IDE:** Visual Studio Code  
- **Triển khai:** Vercel / AWS  
- **Kiểm thử:** Postman, GitHub  

---

## 🏠 3. Các chức năng chính

### 🧑‍🎓 Người thuê trọ:
- Đăng ký, đăng nhập tài khoản.  
- Tìm kiếm phòng trọ theo khu vực, giá, diện tích, tiện ích.  
- So sánh các phòng trọ.  
- Nhắn tin trực tiếp với chủ trọ.  
- Đặt cọc phòng thông qua mã QR.

### 🏠 Người cho thuê:
- Đăng tin phòng trọ mới, kèm ảnh, tiện ích, mã QR.  
- Quản lý danh sách phòng đã đăng.  
- Xem và phản hồi tin nhắn từ người thuê.  
- Theo dõi các lượt đặt cọc.

---

## 🚀 4. Hình ảnh hệ thống

<p align="center">
  <img src="docs/giao_dien_chinh.png" alt="Ảnh 1" width="800"/>
  <em>Hình 1: Giao diện chính của hệ thống</em>
</p>

<p align="center">
  <img src="docs/giao_dien_form_dang_ky.png" alt="Ảnh 2" width="800"/>
  <em>Hình 2: Form đăng ký người dùng</em>
</p>

<p align="center">
  <img src="docs/giao_dien_form_dang_nhap.png" alt="Ảnh 3" width="800"/>
  <em>Hình 3: Form đăng nhập</em>
</p>

<p align="center">
  <img src="docs/xem_tro_tren_gmap.png" alt="Ảnh 4" width="800"/>
  <em>Hình 4: Tích hợp Google Maps xem vị trí nhà trọ</em>
</p>

<p align="center">
  <img src="docs/them_tt_phong_tro.png" alt="Ảnh 5" width="800"/>
  <em>Hình 5: Giao diện thêm thông tin phòng trọ</em>
</p>

<p align="center">
  <img src="docs/giao_dien_quan_ly_phong_tro.png" alt="Ảnh 6" width="800"/>
  <em>Hình 6: Giao diện quản lý phòng trọ của chủ trọ</em>
</p>

<p align="center">
  <img src="docs/tin_nhan.png" alt="Ảnh 7" width="800"/>
  <em>Hình 7: Tính năng nhắn tin giữa người thuê và chủ trọ</em>
</p>

<p align="center">
  <img src="docs/so_sanh_phong_tro.png" alt="Ảnh 8" width="800"/>
  <em>Hình 8: So sánh các phòng trọ đã chọn</em>
</p>

<p align="center">
  <img src="docs/ai.png" alt="Ảnh 9" width="800"/>
  <em>Hình 9: AI gợi ý phòng trọ phù hợp</em>
</p>

---

## 📂 5. Cài đặt và chạy dự án

### 🪜 Bước 1. Chuẩn bị
- Cài đặt **Node.js**, **npm** và **XAMPP**  
- Khởi động **MySQL** và **Apache**

### 🪜 Bước 2. Cấu hình cơ sở dữ liệu
- Tạo database `nhatro`  
- Import file `nhatro.sql` trong thư mục `server/database/`

### 🪜 Bước 3. Chạy server
```bash
cd server
npm install
npm start
