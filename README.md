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
        <img src="https://github.com/tiennq004/cds_nha_tro-sinh_vien_ai/blob/main/img/aiotlab_logo.png" alt="AIoTLab Logo" width="170"/>
        <img src="https://github.com/tiennq004/cds_nha_tro-sinh_vien_ai/blob/main/img/fitdnu_logo.png" alt="FIT DNU Logo" width="180"/>
        <img src="https://github.com/tiennq004/cds_nha_tro-sinh_vien_ai/blob/main/img/dnu_logo.png" alt="DaiNam University Logo" width="200"/>
    </p>

[![AIoTLab](https://img.shields.io/badge/AIoTLab-green?style=for-the-badge)](https://www.facebook.com/DNUAIoTLab)
[![Faculty of Information Technology](https://img.shields.io/badge/Faculty%20of%20Information%20Technology-blue?style=for-the-badge)](https://dainam.edu.vn/vi/khoa-cong-nghe-thong-tin)
[![DaiNam University](https://img.shields.io/badge/DaiNam%20University-orange?style=for-the-badge)](https://dainam.edu.vn)
</div>

---



## 1. Mục tiêu của hệ thống

- Tối ưu hóa trải nghiệm tìm kiếm phòng trọ bằng AI và bản đồ tương tác.

- Kết nối người thuê và người cho thuê trong cùng nền tảng, đảm bảo minh bạch, tiện lợi.

- Tự động gợi ý phòng trọ phù hợp với nhu cầu và vị trí người dùng nhờ hệ thống AI thông minh.

- Tích hợp chatbot tư vấn, so sánh phòng trọ, và tìm người ở ghép để mở rộng trải nghiệm.

⚙️ Thành phần hệ thống

🔹 1. Người thuê (Client)

- Tìm kiếm phòng trọ theo vị trí, giá, tiện nghi, bản đồ tương tác.

- Xem chi tiết, so sánh, đánh giá và lưu phòng yêu thích.

- Giao tiếp trực tiếp với chủ trọ qua tính năng nhắn tin.

- Sử dụng AI chatbot để được gợi ý phòng trọ phù hợp.

- Có thể đăng yêu cầu tìm người ở ghép hoặc xem các bài đăng tương tự.

🔹 2. Người cho thuê (Host)

- Đăng bài cho thuê phòng, quản lý thông tin, cập nhật, xóa bài đăng.

- Quản lý danh sách phòng, xem tin nhắn từ người thuê.

- Cập nhật trạng thái phòng (đã thuê/chưa thuê).

- Quản lý hồ sơ cá nhân và bảo mật tài khoản.

💡 Điểm nổi bật

- 💬 AI Chatbot hỗ trợ người thuê tìm nhà nhanh chóng.

- 🗺️ Tích hợp bản đồ OpenStreetMap & Nominatim API cho phép xem vị trí phòng thực tế.

- 🔒 Bảo mật tài khoản với JWT Authentication.

- 📊 Hệ thống gợi ý thông minh dựa trên dữ liệu hành vi và từ khóa tìm kiếm.

- 💻 Giao diện thân thiện, hiện đại xây dựng bằng React + Bootstrap.

- ⚙️ Hệ thống Backend mạnh mẽ với Node.js + Express + MySQL.

## ⚙️ 2. Công nghệ và công cụ sử dụng

    Frontend (React + Vite)
       ↓
    Backend (Node.js + Express)
       ↓
    Database (MySQL / MariaDB)

🖥️ Frontend

- React 18, Vite, Bootstrap, Axios

- Tích hợp Leaflet + OpenStreetMap để hiển thị vị trí phòng

- Giao diện hiện đại, hỗ trợ AI Chatbot và tìm kiếm nâng cao

💻 Backend

- Node.js + Express.js, MySQL

- JWT Authentication đảm bảo bảo mật

- Tích hợp Google Gemini API và Nominatim API (Geocoding)

- Quản lý người dùng, phòng trọ, tin nhắn, gợi ý AI

🛠️ Công cụ phát triển

- IDE: Visual Studio Code

- Node.js: v14+

- CSDL: MySQL 5.7+ hoặc MariaDB

- API Key: Google Gemini

- Hệ điều hành: Windows / Linux / macOS


---

## 🧩 3. Chức năng chính

### 👤 Người thuê trọ
- Đăng ký, đăng nhập tài khoản.  
- Tìm kiếm, lọc, và **so sánh phòng trọ**.  
- **Đặt cọc phòng qua mã QR** được chủ trọ cung cấp.  
- Nhắn tin trực tiếp với chủ trọ.

### 🏠 Người cho thuê
- Thêm mới, sửa, xóa thông tin phòng trọ.  
- Upload hình ảnh và **mã QR thanh toán**.  
- Quản lý danh sách phòng, kiểm soát tình trạng còn trống.  
- Trả lời tin nhắn và xác nhận đặt cọc.

---

## 🧪 4. Kết quả thử nghiệm

| Tiêu chí | Kết quả đạt được |
|-----------|------------------|
| Tốc độ tải trang | Dưới 2 giây |
| Độ ổn định | Hoạt động ổn định |
| Lọc và so sánh | Chính xác, mượt |
| Chat người dùng | Tin nhắn gửi tức thời |
| Đặt cọc bằng QR | Quét nhanh, dễ thao tác |

<p align="center">
  <img src="docs/giao_dien_chinh.png" alt="Ảnh giao diện chính" width="700"/>
</p>

---

## 👥 5. Nhóm thực hiện

| Họ và tên | Lớp | Vai trò |
|------------|------|----------|
| **Nguyễn Quang Tiến** | CNTT 16-03 | Thiết kế & lập trình Frontend |
| **Hoàng Công Sơn** | CNTT 16-03 | Thiết kế & lập trình Backend |

**Giảng viên hướng dẫn:** ThS. Nguyễn Văn Nhơn  
© 2025 – Khoa Công Nghệ Thông Tin, Trường Đại học Đại Nam.
