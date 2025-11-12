require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;

const bookingsRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingsRoutes);


// Tạo thư mục uploads/images nếu chưa tồn tại
const uploadsDir = path.join(__dirname, 'uploads', 'images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());

// Body parser chỉ cho JSON và URL-encoded
// LƯU Ý: bodyParser KHÔNG xử lý multipart/form-data (multer sẽ xử lý)
// Express bodyParser tự động bỏ qua multipart, nhưng để chắc chắn, chỉ parse cho JSON và URL-encoded
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files từ thư mục uploads (phải đặt trước routes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const chatbotRoutes = require('./routes/chatbot');
const searchRoutes = require('./routes/search');
const aiRoutes = require('./routes/ai');
const messagesRoutes = require('./routes/messages');
const roommateRoutes = require('./routes/roommate');
const profileRoutes = require('./routes/profile');
const usersRoutes = require('./routes/users');

// Import upload routes với error handling
let uploadRoutes;
try {
  uploadRoutes = require('./routes/upload');
} catch (error) {
  console.error('❌ Warning: Could not load upload routes:', error.message);
  console.error('Upload functionality will be disabled.');
  // Tạo một router rỗng để tránh lỗi
  uploadRoutes = require('express').Router();
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/roommate', roommateRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/upload', uploadRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Nhà Trọ Sinh Viên API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      rooms: '/api/rooms',
      upload: '/api/upload',
      search: '/api/search',
      chatbot: '/api/chatbot',
      ai: '/api/ai'
    },
    status: 'running'
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({ status: 'OK', message: 'Server is running', database: 'connected' });
  } catch (error) {
    res.json({ status: 'OK', message: 'Server is running', database: 'disconnected', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME || 'nha_tro_db'}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
});
