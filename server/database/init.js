const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('📦 Đang tạo database...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const cleanSchema = schema
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim();

    await connection.query(cleanSchema);
    console.log('✅ Database đã được khởi tạo thành công!');
  } catch (error) {
    if (error.code === 'ER_DB_CREATE_EXISTS') {
      console.log('ℹ️ Database đã tồn tại, đang kiểm tra bảng...');
      try {
        const dbConnection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'nha_tro_db'
        });
        const [tables] = await dbConnection.query('SHOW TABLES');
        if (tables.length === 0) {
          console.log('⚠️ Database trống, đang tạo bảng...');
          const schemaPath = path.join(__dirname, 'schema.sql');
          const schema = fs.readFileSync(schemaPath, 'utf8');
          const cleanSchema = schema
            .replace(/CREATE DATABASE.*?;/gi, '')
            .replace(/USE.*?;/gi, '')
            .replace(/--.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .trim();
          await dbConnection.query(cleanSchema);
          console.log('✅ Đã tạo các bảng thành công!');
        } else {
          console.log(`✅ Database đã có ${tables.length} bảng`);
        }
        await dbConnection.end();
      } catch (dbError) {
        console.error('❌ Lỗi khi kiểm tra database:', dbError.message);
      }
    } else {
      console.error('❌ Lỗi khi khởi tạo database:', error.message);
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('✨ Hoàn tất!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Lỗi:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;
