const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nha_tro_db'
    });

    console.log('📦 Đang seed dữ liệu mẫu...');

    // Hash password mẫu (password: 123456)
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Tạo user mẫu (landlord)
    const [landlordResult] = await connection.execute(
      'INSERT IGNORE INTO users (username, email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      ['landlord1', 'landlord1@example.com', hashedPassword, 'Nguyễn Văn A', '0901234567', 'landlord']
    );

    let landlordId;
    if (landlordResult.insertId) {
      landlordId = landlordResult.insertId;
    } else {
      // User đã tồn tại, lấy ID
      const [users] = await connection.execute('SELECT id FROM users WHERE email = ?', ['landlord1@example.com']);
      landlordId = users[0].id;
    }

    console.log('✅ Đã tạo landlord với ID:', landlordId);

    // Dữ liệu phòng trọ mẫu
    const sampleRooms = [
      {
        landlord_id: landlordId,
        title: 'Nhà trọ sinh viên gần Đại học Công nghệ',
        description: 'Nhà trọ sạch sẽ, an ninh, phù hợp cho sinh viên. Gần trường, gần chợ và các tiện ích khác.',
        price: 1500000,
        address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
        latitude: 10.8231,
        longitude: 106.6297,
        area: 20,
        utilities: JSON.stringify(['Điều hòa', 'Wifi', 'Nước nóng', 'Giường', 'Tủ lạnh', 'Nhà vệ sinh riêng']),
        images: JSON.stringify([]),
        rules: 'Giữ gìn vệ sinh chung, không hút thuốc trong phòng',
        available: true
      },
      {
        landlord_id: landlordId,
        title: 'Phòng trọ giá rẻ gần Bách Khoa',
        description: 'Phòng trọ rộng rãi, thoáng mát, có cửa sổ. Gần trường Đại học Bách Khoa, thuận tiện đi lại.',
        price: 1200000,
        address: '456 Đường DEF, Phường UVW, Quận 2, TP.HCM',
        latitude: 10.7869,
        longitude: 106.7000,
        area: 18,
        utilities: JSON.stringify(['Quạt', 'Wifi', 'Nước nóng', 'Giường', 'Bàn học']),
        images: JSON.stringify([]),
        rules: 'Yên tĩnh sau 22h',
        available: true
      },
      {
        landlord_id: landlordId,
        title: 'Căn hộ mini đầy đủ tiện nghi',
        description: 'Căn hộ mini mới xây, đầy đủ tiện nghi hiện đại. Phù hợp cho 1-2 người, an ninh tốt.',
        price: 2500000,
        address: '789 Đường GHI, Phường RST, Quận 3, TP.HCM',
        latitude: 10.7829,
        longitude: 106.6977,
        area: 30,
        utilities: JSON.stringify(['Điều hòa', 'Wifi', 'Nước nóng', 'Giường', 'Tủ lạnh', 'Bếp', 'Máy giặt', 'Nhà vệ sinh riêng']),
        images: JSON.stringify([]),
        rules: 'Không nuôi động vật',
        available: true
      },
      {
        landlord_id: landlordId,
        title: 'Nhà trọ sinh viên gần Kinh tế',
        description: 'Nhà trọ gần trường Đại học Kinh tế, giá cả phải chăng, chủ nhà thân thiện.',
        price: 1000000,
        address: '321 Đường JKL, Phường MNO, Quận 10, TP.HCM',
        latitude: 10.7731,
        longitude: 106.6667,
        area: 15,
        utilities: JSON.stringify(['Quạt', 'Wifi', 'Nước nóng', 'Giường']),
        images: JSON.stringify([]),
        rules: null,
        available: true
      },
      {
        landlord_id: landlordId,
        title: 'Phòng trọ cao cấp gần trung tâm',
        description: 'Phòng trọ cao cấp, nội thất đẹp, gần trung tâm thành phố. Phù hợp cho sinh viên muốn có không gian sống tốt.',
        price: 3000000,
        address: '654 Đường PQR, Phường STU, Quận 1, TP.HCM',
        latitude: 10.7769,
        longitude: 106.7009,
        area: 35,
        utilities: JSON.stringify(['Điều hòa', 'Wifi', 'Nước nóng', 'Giường', 'Tủ lạnh', 'Bếp', 'Máy giặt', 'TV', 'Nhà vệ sinh riêng', 'Ban công']),
        images: JSON.stringify([]),
        rules: 'Giữ gìn vệ sinh, trả tiền đúng hạn',
        available: true
      }
    ];

    // Xóa dữ liệu cũ (optional)
    await connection.execute('DELETE FROM rooms WHERE landlord_id = ?', [landlordId]);
    console.log('🗑️  Đã xóa dữ liệu phòng cũ');

    // Thêm phòng trọ mẫu
    for (const room of sampleRooms) {
      await connection.execute(
        'INSERT INTO rooms (landlord_id, title, description, price, address, latitude, longitude, area, utilities, images, rules, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [room.landlord_id, room.title, room.description, room.price, room.address, room.latitude, room.longitude, room.area, room.utilities, room.images, room.rules, room.available]
      );
    }

    console.log(`✅ Đã thêm ${sampleRooms.length} phòng trọ mẫu`);

    // Tạo user mẫu (renter)
    await connection.execute(
      'INSERT IGNORE INTO users (username, email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      ['renter1', 'renter1@example.com', hashedPassword, 'Trần Thị B', '0907654321', 'renter']
    );

    console.log('✅ Đã tạo renter mẫu');

    console.log('✨ Hoàn tất seed dữ liệu!');
    console.log('📝 Thông tin đăng nhập:');
    console.log('   Landlord: landlord1@example.com / password: 123456');
    console.log('   Renter: renter1@example.com / password: 123456');

  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Hoàn tất!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Lỗi:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;


require('dotenv').config();

async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nha_tro_db'
    });

    console.log('📦 Đang seed dữ liệu mẫu...');

    // Hash password mẫu (password: 123456)
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Tạo user mẫu (landlord)
    const [landlordResult] = await connection.execute(
      'INSERT IGNORE INTO users (username, email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      ['landlord1', 'landlord1@example.com', hashedPassword, 'Nguyễn Văn A', '0901234567', 'landlord']
    );

    let landlordId;
    if (landlordResult.insertId) {
      landlordId = landlordResult.insertId;
    } else {
      // User đã tồn tại, lấy ID
      const [users] = await connection.execute('SELECT id FROM users WHERE email = ?', ['landlord1@example.com']);
      landlordId = users[0].id;
    }

    console.log('✅ Đã tạo landlord với ID:', landlordId);

    // Dữ liệu phòng trọ mẫu
    const sampleRooms = [
      {
        landlord_id: landlordId,
        title: 'Nhà trọ sinh viên gần Đại học Công nghệ',
        description: 'Nhà trọ sạch sẽ, an ninh, phù hợp cho sinh viên. Gần trường, gần chợ và các tiện ích khác.',
        price: 1500000,
        address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
        latitude: 10.8231,
        longitude: 106.6297,
        area: 20,
        utilities: JSON.stringify(['Điều hòa', 'Wifi', 'Nước nóng', 'Giường', 'Tủ lạnh', 'Nhà vệ sinh riêng']),
        images: JSON.stringify([]),
        rules: 'Giữ gìn vệ sinh chung, không hút thuốc trong phòng',
        available: true
      },
      {
        landlord_id: landlordId,
        title: 'Phòng trọ giá rẻ gần Bách Khoa',
        description: 'Phòng trọ rộng rãi, thoáng mát, có cửa sổ. Gần trường Đại học Bách Khoa, thuận tiện đi lại.',
        price: 1200000,
        address: '456 Đường DEF, Phường UVW, Quận 2, TP.HCM',
        latitude: 10.7869,
        longitude: 106.7000,
        area: 18,
        utilities: JSON.stringify(['Quạt', 'Wifi', 'Nước nóng', 'Giường', 'Bàn học']),
        images: JSON.stringify([]),
        rules: 'Yên tĩnh sau 22h',
        available: true
      },
      {
        landlord_id: landlordId,
        title: 'Căn hộ mini đầy đủ tiện nghi',
        description: 'Căn hộ mini mới xây, đầy đủ tiện nghi hiện đại. Phù hợp cho 1-2 người, an ninh tốt.',
        price: 2500000,
        address: '789 Đường GHI, Phường RST, Quận 3, TP.HCM',
        latitude: 10.7829,
        longitude: 106.6977,
        area: 30,
        utilities: JSON.stringify(['Điều hòa', 'Wifi', 'Nước nóng', 'Giường', 'Tủ lạnh', 'Bếp', 'Máy giặt', 'Nhà vệ sinh riêng']),
        images: JSON.stringify([]),
        rules: 'Không nuôi động vật',
        available: true
      },
      {
        landlord_id: landlordId,
        title: 'Nhà trọ sinh viên gần Kinh tế',
        description: 'Nhà trọ gần trường Đại học Kinh tế, giá cả phải chăng, chủ nhà thân thiện.',
        price: 1000000,
        address: '321 Đường JKL, Phường MNO, Quận 10, TP.HCM',
        latitude: 10.7731,
        longitude: 106.6667,
        area: 15,
        utilities: JSON.stringify(['Quạt', 'Wifi', 'Nước nóng', 'Giường']),
        images: JSON.stringify([]),
        rules: null,
        available: true
      },
      {
        landlord_id: landlordId,
        title: 'Phòng trọ cao cấp gần trung tâm',
        description: 'Phòng trọ cao cấp, nội thất đẹp, gần trung tâm thành phố. Phù hợp cho sinh viên muốn có không gian sống tốt.',
        price: 3000000,
        address: '654 Đường PQR, Phường STU, Quận 1, TP.HCM',
        latitude: 10.7769,
        longitude: 106.7009,
        area: 35,
        utilities: JSON.stringify(['Điều hòa', 'Wifi', 'Nước nóng', 'Giường', 'Tủ lạnh', 'Bếp', 'Máy giặt', 'TV', 'Nhà vệ sinh riêng', 'Ban công']),
        images: JSON.stringify([]),
        rules: 'Giữ gìn vệ sinh, trả tiền đúng hạn',
        available: true
      }
    ];

    // Xóa dữ liệu cũ (optional)
    await connection.execute('DELETE FROM rooms WHERE landlord_id = ?', [landlordId]);
    console.log('🗑️  Đã xóa dữ liệu phòng cũ');

    // Thêm phòng trọ mẫu
    for (const room of sampleRooms) {
      await connection.execute(
        'INSERT INTO rooms (landlord_id, title, description, price, address, latitude, longitude, area, utilities, images, rules, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [room.landlord_id, room.title, room.description, room.price, room.address, room.latitude, room.longitude, room.area, room.utilities, room.images, room.rules, room.available]
      );
    }

    console.log(`✅ Đã thêm ${sampleRooms.length} phòng trọ mẫu`);

    // Tạo user mẫu (renter)
    await connection.execute(
      'INSERT IGNORE INTO users (username, email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      ['renter1', 'renter1@example.com', hashedPassword, 'Trần Thị B', '0907654321', 'renter']
    );

    console.log('✅ Đã tạo renter mẫu');

    console.log('✨ Hoàn tất seed dữ liệu!');
    console.log('📝 Thông tin đăng nhập:');
    console.log('   Landlord: landlord1@example.com / password: 123456');
    console.log('   Renter: renter1@example.com / password: 123456');

  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Hoàn tất!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Lỗi:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;

