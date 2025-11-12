const mysql = require('mysql2/promise');
require('dotenv').config();

// Cấu hình kết nối database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nha_tro_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Tạo connection pool
const pool = mysql.createPool(dbConfig);

// Test connection với retry logic
let retryCount = 0;
const maxRetries = 3;

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Kết nối database thành công');
    connection.release();
    retryCount = 0;
  } catch (err) {
    retryCount++;
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.warn('⚠️  Database chưa tồn tại. Vui lòng chạy: npm run init-db');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('❌ Không thể kết nối đến MySQL. Đảm bảo MySQL đang chạy.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('❌ Lỗi xác thực MySQL. Kiểm tra lại DB_USER và DB_PASSWORD trong .env');
    } else {
      console.error('❌ Lỗi kết nối database:', err.message);
    }
    
    if (retryCount < maxRetries) {
      console.log(`🔄 Đang thử kết nối lại... (${retryCount}/${maxRetries})`);
      setTimeout(testConnection, 2000);
    } else {
      console.error('❌ Không thể kết nối database sau nhiều lần thử. Vui lòng kiểm tra cấu hình.');
    }
  }
};

// Test connection khi khởi động
testConnection();

module.exports = pool;