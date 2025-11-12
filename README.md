# 🏠 Nền Tảng Tìm Kiếm Nhà Trọ với AI

Nền tảng hỗ trợ người thuê và người cho thuê tìm kiếm, quản lý và chia sẻ thông tin phòng trọ một cách hiệu quả. Áp dụng chuyển đổi số vào tìm kiếm nhà trọ với tích hợp AI.

## ✨ Tính năng chính

### 🔐 Xác thực người dùng
- ✅ Đăng ký tài khoản và đăng nhập
- ✅ Phân quyền người thuê và người cho thuê
- ✅ Quản lý thông tin cá nhân
- ✅ Đổi mật khẩu

### 🏘️ Quản lý phòng trọ (Người cho thuê)
- ✅ Đăng bài cho thuê phòng
- ✅ Quản lý danh sách bài đăng phòng trọ
- ✅ Cập nhật thông tin phòng (địa chỉ, giá, diện tích, tiện nghi, quy định)
- ✅ Xóa phòng trọ

### 🔍 Tìm kiếm và khám phá (Người thuê)
- ✅ Tìm kiếm phòng theo vị trí, giá cả, tiện nghi
- ✅ Hiển thị vị trí phòng trọ trên bản đồ OpenStreetMap
- ✅ Tìm kiếm phòng trọ gần vị trí hiện tại
- ✅ Tìm kiếm theo địa chỉ cụ thể với bản đồ tương tác
- ✅ So sánh các phòng trọ với nhau
- ✅ Gợi ý các phòng trọ liên quan có giá tương đương

### 🤖 AI và Chatbot
- ✅ Chatbot AI thông minh tư vấn nhà trọ
- ✅ Hệ thống AI gợi ý nhà trọ phù hợp dựa trên yêu cầu

### 💬 Nhắn tin
- ✅ Tính năng nhắn tin giữa người thuê và người cho thuê
- ✅ Quản lý cuộc trò chuyện

### 👥 Tìm người ở ghép
- ✅ Đăng yêu cầu tìm người ở ghép
- ✅ Quản lý yêu cầu tìm người ở ghép

## 🛠 Công nghệ sử dụng

### Backend
- ✅ Node.js & Express.js
- ✅ MySQL Database
- ✅ JWT Authentication
- ✅ Google Generative AI (Gemini)
- ✅ Nominatim API (Geocoding)

### Frontend
- ✅ React 18
- ✅ Vite
- ✅ Leaflet & OpenStreetMap
- ✅ Axios
- ✅ Bootstrap (CSS Framework)
- ✅ HTML, CSS, JavaScript

## 📋 Yêu cầu hệ thống

- Node.js (v14 trở lên)
- MySQL (v5.7 trở lên hoặc MariaDB)
- npm hoặc yarn
- Google Gemini API Key

## 🛠️ Cài đặt

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd BTL
```

### Bước 2: Cài đặt dependencies

```bash
npm run install-all
```

Hoặc cài đặt riêng biệt:

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### Bước 3: Cấu hình MySQL

1. Đảm bảo MySQL đã được cài đặt và đang chạy
2. Tạo database (hoặc để script tự động tạo)

### Bước 4: Cấu hình environment variables

Tạo file `.env` ở thư mục gốc:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nha_tro_db

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Google Gemini API
GOOGLE_API_KEY=your_google_api_key_here
```

**Lấy Google Gemini API Key:**
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập với tài khoản Google
3. Tạo API key mới
4. Copy API key vào file `.env`

### Bước 5: Khởi tạo database

```bash
npm run init-db
```

Script này sẽ tự động:
- Tạo database `nha_tro_db`
- Tạo các bảng cần thiết (users, rooms, messages, roommate_requests, etc.)

### Bước 6: Chạy ứng dụng

#### Chạy cả backend và frontend cùng lúc:
```bash
npm run dev
```

#### Hoặc chạy riêng biệt:

**Backend:**
```bash
npm run server
```

**Frontend (terminal mới):**
```bash
npm run client
```

### Truy cập ứng dụng:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Cấu trúc dự án

```
BTL/
├── server/
│   ├── index.js                 # Server Express chính
│   ├── database/
│   │   ├── db.js                # Kết nối MySQL
│   │   ├── schema.sql           # Schema database
│   │   └── init.js              # Script khởi tạo database
│   ├── middleware/
│   │   └── auth.js              # Middleware xác thực
│   ├── routes/
│   │   ├── auth.js              # Route đăng ký/đăng nhập
│   │   ├── rooms.js             # Route quản lý phòng trọ
│   │   ├── chatbot.js           # Route chatbot AI
│   │   ├── search.js            # Route tìm kiếm
│   │   ├── ai.js                # Route AI gợi ý
│   │   ├── messages.js          # Route nhắn tin
│   │   ├── roommate.js          # Route tìm người ở ghép
│   │   └── profile.js           # Route quản lý profile
│   └── data/
│       └── rooms.json           # Dữ liệu mẫu (không dùng nữa)
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SearchSection.jsx
│   │   │   ├── RoomList.jsx
│   │   │   ├── RoomMap.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── AISuggestions.jsx
│   │   │   └── Auth.jsx
│   │   ├── utils/
│   │   │   └── auth.js          # Utilities xác thực
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Rooms
- `GET /api/rooms` - Lấy tất cả phòng trọ (có thể lọc)
- `GET /api/rooms/:id` - Lấy thông tin chi tiết một phòng
- `POST /api/rooms` - Tạo phòng trọ mới (landlord only)
- `PUT /api/rooms/:id` - Cập nhật phòng trọ (landlord only)
- `DELETE /api/rooms/:id` - Xóa phòng trọ (landlord only)
- `GET /api/rooms/nearby/search` - Tìm phòng gần vị trí

### Search
- `GET /api/search` - Tìm kiếm nhà trọ
  - Query params: `keyword`, `minPrice`, `maxPrice`, `address`, `minArea`, `maxArea`, `utilities`
- `GET /api/search/:id` - Lấy thông tin chi tiết một nhà trọ

### Chatbot
- `POST /api/chatbot/chat` - Gửi tin nhắn đến chatbot
  - Body: `{ message: string, conversationHistory: array }`

### AI Suggestions
- `POST /api/ai/suggest` - Nhận gợi ý từ AI
  - Body: `{ requirements: string, budget: number, location: string, preferences: string }`

### Messages
- `GET /api/messages/conversations` - Lấy danh sách cuộc trò chuyện
- `GET /api/messages/conversation/:userId` - Lấy tin nhắn với user
- `POST /api/messages` - Gửi tin nhắn
- `PUT /api/messages/:messageId/read` - Đánh dấu đã đọc

### Roommate
- `GET /api/roommate` - Lấy danh sách yêu cầu tìm người ở ghép
- `POST /api/roommate` - Tạo yêu cầu tìm người ở ghép (renter only)
- `PUT /api/roommate/:id` - Cập nhật yêu cầu
- `DELETE /api/roommate/:id` - Xóa yêu cầu

### Profile
- `GET /api/profile` - Lấy thông tin profile
- `PUT /api/profile` - Cập nhật profile
- `PUT /api/profile/password` - Đổi mật khẩu
- `GET /api/profile/my-rooms` - Lấy phòng trọ của landlord

## 🎨 Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MySQL2
- JWT (jsonwebtoken)
- bcryptjs
- Google Generative AI (Gemini)
- Axios (for geocoding)
- CORS
- dotenv

### Frontend
- React 18
- Vite
- Leaflet & OpenStreetMap
- Axios
- CSS3 (Gradient, Animations)

## 📝 Database Schema

### Bảng users
- id, username, email, password, full_name, phone, role, avatar, created_at, updated_at

### Bảng rooms
- id, landlord_id, title, description, price, address, latitude, longitude, area, utilities (JSON), images (JSON), rules, available, created_at, updated_at

### Bảng messages
- id, sender_id, receiver_id, room_id, message, read_status, created_at

### Bảng roommate_requests
- id, user_id, title, description, budget_min, budget_max, preferred_location, preferences, status, created_at, updated_at

### Bảng favorites
- id, user_id, room_id, created_at

### Bảng reviews
- id, user_id, room_id, rating, comment, created_at

## 🔒 Bảo mật

- JWT authentication
- Password hashing với bcrypt
- Không commit file `.env` vào git
- API key Gemini nên được bảo mật
- Middleware xác thực cho các route bảo mật
- Phân quyền dựa trên role (renter/landlord)

## 📄 License

MIT

## 👨‍💻 Tác giả

Dự án được phát triển cho môn học Chuyển Đổi Số

---

**Lưu ý:** 
- Đảm bảo bạn đã có MySQL đang chạy và Google Gemini API Key hợp lệ trước khi chạy ứng dụng
- Đảm bảo đã chạy `npm run init-db` để khởi tạo database trước khi start server

Nền tảng hỗ trợ người thuê và người cho thuê tìm kiếm, quản lý và chia sẻ thông tin phòng trọ một cách hiệu quả. Áp dụng chuyển đổi số vào tìm kiếm nhà trọ với tích hợp AI.

## ✨ Tính năng chính

### 🔐 Xác thực người dùng
- ✅ Đăng ký tài khoản và đăng nhập
- ✅ Phân quyền người thuê và người cho thuê
- ✅ Quản lý thông tin cá nhân
- ✅ Đổi mật khẩu

### 🏘️ Quản lý phòng trọ (Người cho thuê)
- ✅ Đăng bài cho thuê phòng
- ✅ Quản lý danh sách bài đăng phòng trọ
- ✅ Cập nhật thông tin phòng (địa chỉ, giá, diện tích, tiện nghi, quy định)
- ✅ Xóa phòng trọ

### 🔍 Tìm kiếm và khám phá (Người thuê)
- ✅ Tìm kiếm phòng theo vị trí, giá cả, tiện nghi
- ✅ Hiển thị vị trí phòng trọ trên bản đồ OpenStreetMap
- ✅ Tìm kiếm phòng trọ gần vị trí hiện tại
- ✅ Tìm kiếm theo địa chỉ cụ thể với bản đồ tương tác
- ✅ So sánh các phòng trọ với nhau
- ✅ Gợi ý các phòng trọ liên quan có giá tương đương

### 🤖 AI và Chatbot
- ✅ Chatbot AI thông minh tư vấn nhà trọ
- ✅ Hệ thống AI gợi ý nhà trọ phù hợp dựa trên yêu cầu

### 💬 Nhắn tin
- ✅ Tính năng nhắn tin giữa người thuê và người cho thuê
- ✅ Quản lý cuộc trò chuyện

### 👥 Tìm người ở ghép
- ✅ Đăng yêu cầu tìm người ở ghép
- ✅ Quản lý yêu cầu tìm người ở ghép

## 🛠 Công nghệ sử dụng

### Backend
- ✅ Node.js & Express.js
- ✅ MySQL Database
- ✅ JWT Authentication
- ✅ Google Generative AI (Gemini)
- ✅ Nominatim API (Geocoding)

### Frontend
- ✅ React 18
- ✅ Vite
- ✅ Leaflet & OpenStreetMap
- ✅ Axios
- ✅ Bootstrap (CSS Framework)
- ✅ HTML, CSS, JavaScript

## 📋 Yêu cầu hệ thống

- Node.js (v14 trở lên)
- MySQL (v5.7 trở lên hoặc MariaDB)
- npm hoặc yarn
- Google Gemini API Key

## 🛠️ Cài đặt

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd BTL
```

### Bước 2: Cài đặt dependencies

```bash
npm run install-all
```

Hoặc cài đặt riêng biệt:

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### Bước 3: Cấu hình MySQL

1. Đảm bảo MySQL đã được cài đặt và đang chạy
2. Tạo database (hoặc để script tự động tạo)

### Bước 4: Cấu hình environment variables

Tạo file `.env` ở thư mục gốc:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nha_tro_db

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Google Gemini API
GOOGLE_API_KEY=your_google_api_key_here
```

**Lấy Google Gemini API Key:**
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập với tài khoản Google
3. Tạo API key mới
4. Copy API key vào file `.env`

### Bước 5: Khởi tạo database

```bash
npm run init-db
```

Script này sẽ tự động:
- Tạo database `nha_tro_db`
- Tạo các bảng cần thiết (users, rooms, messages, roommate_requests, etc.)

### Bước 6: Chạy ứng dụng

#### Chạy cả backend và frontend cùng lúc:
```bash
npm run dev
```

#### Hoặc chạy riêng biệt:

**Backend:**
```bash
npm run server
```

**Frontend (terminal mới):**
```bash
npm run client
```

### Truy cập ứng dụng:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Cấu trúc dự án

```
BTL/
├── server/
│   ├── index.js                 # Server Express chính
│   ├── database/
│   │   ├── db.js                # Kết nối MySQL
│   │   ├── schema.sql           # Schema database
│   │   └── init.js              # Script khởi tạo database
│   ├── middleware/
│   │   └── auth.js              # Middleware xác thực
│   ├── routes/
│   │   ├── auth.js              # Route đăng ký/đăng nhập
│   │   ├── rooms.js             # Route quản lý phòng trọ
│   │   ├── chatbot.js           # Route chatbot AI
│   │   ├── search.js            # Route tìm kiếm
│   │   ├── ai.js                # Route AI gợi ý
│   │   ├── messages.js          # Route nhắn tin
│   │   ├── roommate.js          # Route tìm người ở ghép
│   │   └── profile.js           # Route quản lý profile
│   └── data/
│       └── rooms.json           # Dữ liệu mẫu (không dùng nữa)
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SearchSection.jsx
│   │   │   ├── RoomList.jsx
│   │   │   ├── RoomMap.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── AISuggestions.jsx
│   │   │   └── Auth.jsx
│   │   ├── utils/
│   │   │   └── auth.js          # Utilities xác thực
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Rooms
- `GET /api/rooms` - Lấy tất cả phòng trọ (có thể lọc)
- `GET /api/rooms/:id` - Lấy thông tin chi tiết một phòng
- `POST /api/rooms` - Tạo phòng trọ mới (landlord only)
- `PUT /api/rooms/:id` - Cập nhật phòng trọ (landlord only)
- `DELETE /api/rooms/:id` - Xóa phòng trọ (landlord only)
- `GET /api/rooms/nearby/search` - Tìm phòng gần vị trí

### Search
- `GET /api/search` - Tìm kiếm nhà trọ
  - Query params: `keyword`, `minPrice`, `maxPrice`, `address`, `minArea`, `maxArea`, `utilities`
- `GET /api/search/:id` - Lấy thông tin chi tiết một nhà trọ

### Chatbot
- `POST /api/chatbot/chat` - Gửi tin nhắn đến chatbot
  - Body: `{ message: string, conversationHistory: array }`

### AI Suggestions
- `POST /api/ai/suggest` - Nhận gợi ý từ AI
  - Body: `{ requirements: string, budget: number, location: string, preferences: string }`

### Messages
- `GET /api/messages/conversations` - Lấy danh sách cuộc trò chuyện
- `GET /api/messages/conversation/:userId` - Lấy tin nhắn với user
- `POST /api/messages` - Gửi tin nhắn
- `PUT /api/messages/:messageId/read` - Đánh dấu đã đọc

### Roommate
- `GET /api/roommate` - Lấy danh sách yêu cầu tìm người ở ghép
- `POST /api/roommate` - Tạo yêu cầu tìm người ở ghép (renter only)
- `PUT /api/roommate/:id` - Cập nhật yêu cầu
- `DELETE /api/roommate/:id` - Xóa yêu cầu

### Profile
- `GET /api/profile` - Lấy thông tin profile
- `PUT /api/profile` - Cập nhật profile
- `PUT /api/profile/password` - Đổi mật khẩu
- `GET /api/profile/my-rooms` - Lấy phòng trọ của landlord

## 🎨 Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MySQL2
- JWT (jsonwebtoken)
- bcryptjs
- Google Generative AI (Gemini)
- Axios (for geocoding)
- CORS
- dotenv

### Frontend
- React 18
- Vite
- Leaflet & OpenStreetMap
- Axios
- CSS3 (Gradient, Animations)

## 📝 Database Schema

### Bảng users
- id, username, email, password, full_name, phone, role, avatar, created_at, updated_at

### Bảng rooms
- id, landlord_id, title, description, price, address, latitude, longitude, area, utilities (JSON), images (JSON), rules, available, created_at, updated_at

### Bảng messages
- id, sender_id, receiver_id, room_id, message, read_status, created_at

### Bảng roommate_requests
- id, user_id, title, description, budget_min, budget_max, preferred_location, preferences, status, created_at, updated_at

### Bảng favorites
- id, user_id, room_id, created_at

### Bảng reviews
- id, user_id, room_id, rating, comment, created_at

## 🔒 Bảo mật

- JWT authentication
- Password hashing với bcrypt
- Không commit file `.env` vào git
- API key Gemini nên được bảo mật
- Middleware xác thực cho các route bảo mật
- Phân quyền dựa trên role (renter/landlord)

## 📄 License

MIT

## 👨‍💻 Tác giả

Dự án được phát triển cho môn học Chuyển Đổi Số

---

**Lưu ý:** 
- Đảm bảo bạn đã có MySQL đang chạy và Google Gemini API Key hợp lệ trước khi chạy ứng dụng
- Đảm bảo đã chạy `npm run init-db` để khởi tạo database trước khi start server
