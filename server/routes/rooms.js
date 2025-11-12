const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireLandlord } = require('../middleware/auth');
const axios = require('axios');

// ============ LẤY DANH SÁCH PHÒNG ============
router.get('/', async (req, res) => {
  try {
    const {
      keyword,
      minPrice,
      maxPrice,
      address,
      minArea,
      maxArea,
      utilities,
      available,
      landlord_id
    } = req.query;

    let query = `
      SELECT r.*, 
             u.id AS landlord_id, 
             u.username AS landlord_username, 
             u.full_name AS landlord_name, 
             u.phone AS landlord_phone
      FROM rooms r 
      JOIN users u ON r.landlord_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (keyword) {
      query += ' AND (r.title LIKE ? OR r.description LIKE ? OR r.address LIKE ?)';
      const kw = `%${keyword}%`;
      params.push(kw, kw, kw);
    }

    if (minPrice) { query += ' AND r.price >= ?'; params.push(parseFloat(minPrice)); }
    if (maxPrice) { query += ' AND r.price <= ?'; params.push(parseFloat(maxPrice)); }
    if (address)  { query += ' AND r.address LIKE ?'; params.push(`%${address}%`); }
    if (minArea)  { query += ' AND r.area >= ?'; params.push(parseFloat(minArea)); }
    if (maxArea)  { query += ' AND r.area <= ?'; params.push(parseFloat(maxArea)); }

    if (available !== undefined && available !== '') {
      query += ' AND r.available = ?';
      params.push(available === 'true' || available === true);
    } else {
      query += ' AND r.available = TRUE';
    }

    if (landlord_id) {
      query += ' AND r.landlord_id = ?';
      params.push(parseInt(landlord_id));
    }

    query += ' ORDER BY r.created_at DESC';
    const [rooms] = await db.execute(query, params);

    // Parse JSON các cột utilities, images
    const safeRooms = rooms.map(room => {
      try {
        return {
          ...room,
          utilities: JSON.parse(room.utilities || '[]'),
          images: JSON.parse(room.images || '[]')
        };
      } catch {
        return { ...room, utilities: [], images: [] };
      }
    });

    res.json({ count: safeRooms.length, rooms: safeRooms });
  } catch (err) {
    console.error('Get rooms error:', err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách phòng', message: err.message });
  }
});

// ============ LẤY CHI TIẾT 1 PHÒNG ============
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT r.*, u.id AS landlord_id, u.username AS landlord_username, 
              u.full_name AS landlord_name, u.phone AS landlord_phone, u.email AS landlord_email
       FROM rooms r
       JOIN users u ON r.landlord_id = u.id
       WHERE r.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy phòng trọ' });

    const room = rows[0];
    try {
      room.utilities = JSON.parse(room.utilities || '[]');
      room.images = JSON.parse(room.images || '[]');
    } catch {
      room.utilities = [];
      room.images = [];
    }

    res.json(room);
  } catch (err) {
    console.error('Get room error:', err);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin phòng', message: err.message });
  }
});

// ============ TẠO PHÒNG TRỌ MỚI ============
router.post('/', authenticateToken, requireLandlord, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      address,
      area,
      utilities,
      images,
      rules,
      payment_qr // <== Mã QR thanh toán từ chủ trọ
    } = req.body;

    if (!title || !price || !address)
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc' });

    // Lấy tọa độ (geocoding)
    let latitude = null, longitude = null;
    try {
      const geo = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: address, format: 'json', limit: 1 },
        headers: { 'User-Agent': 'NhaTroApp/1.0' }
      });
      if (geo.data?.length) {
        latitude = parseFloat(geo.data[0].lat);
        longitude = parseFloat(geo.data[0].lon);
      }
    } catch (geoErr) {
      console.warn('Geocoding error:', geoErr.message);
    }

    // Ghi vào DB
    const [result] = await db.execute(
      `INSERT INTO rooms 
        (landlord_id, title, description, price, address, latitude, longitude, area, utilities, images, rules, payment_qr)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        description || null,
        parseFloat(price),
        address,
        latitude,
        longitude,
        area ? parseFloat(area) : null,
        JSON.stringify(utilities || []),
        JSON.stringify(images || []),
        rules || null,
        payment_qr || null
      ]
    );

    const [newRoom] = await db.execute('SELECT * FROM rooms WHERE id = ?', [result.insertId]);
    const room = newRoom[0];
    try {
      room.utilities = JSON.parse(room.utilities || '[]');
      room.images = JSON.parse(room.images || '[]');
    } catch {
      room.utilities = [];
      room.images = [];
    }

    res.status(201).json({ message: 'Tạo phòng trọ thành công', room });
  } catch (err) {
    console.error('Create room error:', err);
    res.status(500).json({ error: 'Lỗi khi tạo phòng trọ', message: err.message });
  }
});

// ============ CẬP NHẬT PHÒNG ============
router.put('/:id', authenticateToken, requireLandlord, async (req, res) => {
  try {
    const { title, description, price, address, area, utilities, images, rules, available, payment_qr } = req.body;

    const [rooms] = await db.execute('SELECT * FROM rooms WHERE id = ? AND landlord_id = ?', [req.params.id, req.user.id]);
    if (!rooms.length) return res.status(403).json({ error: 'Bạn không có quyền cập nhật phòng này' });

    await db.execute(
      `UPDATE rooms SET
         title = COALESCE(?, title),
         description = COALESCE(?, description),
         price = COALESCE(?, price),
         address = COALESCE(?, address),
         area = COALESCE(?, area),
         utilities = COALESCE(?, utilities),
         images = COALESCE(?, images),
         rules = COALESCE(?, rules),
         available = COALESCE(?, available),
         payment_qr = COALESCE(?, payment_qr)
       WHERE id = ?`,
      [
        title || null,
        description || null,
        price ? parseFloat(price) : null,
        address || null,
        area ? parseFloat(area) : null,
        utilities ? JSON.stringify(utilities) : null,
        images ? JSON.stringify(images) : null,
        rules || null,
        available !== undefined ? available : null,
        payment_qr || null,
        req.params.id
      ]
    );

    const [updated] = await db.execute('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    const room = updated[0];
    try {
      room.utilities = JSON.parse(room.utilities || '[]');
      room.images = JSON.parse(room.images || '[]');
    } catch {
      room.utilities = [];
      room.images = [];
    }

    res.json({ message: 'Cập nhật phòng trọ thành công', room });
  } catch (err) {
    console.error('Update room error:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật phòng', message: err.message });
  }
});

// ============ XOÁ PHÒNG ============
router.delete('/:id', authenticateToken, requireLandlord, async (req, res) => {
  try {
    const [rooms] = await db.execute('SELECT * FROM rooms WHERE id = ? AND landlord_id = ?', [req.params.id, req.user.id]);
    if (!rooms.length) return res.status(403).json({ error: 'Bạn không có quyền xóa phòng này' });

    await db.execute('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa phòng trọ thành công' });
  } catch (err) {
    console.error('Delete room error:', err);
    res.status(500).json({ error: 'Lỗi khi xóa phòng', message: err.message });
  }
});

// ============ TÌM PHÒNG GẦN VỊ TRÍ ============
router.get('/nearby/search', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;
    if (!latitude || !longitude) return res.status(400).json({ error: 'Vui lòng cung cấp tọa độ' });

    const lat = parseFloat(latitude), lon = parseFloat(longitude), radiusKm = parseFloat(radius);
    const query = `
      SELECT r.*, u.id AS landlord_id, u.username AS landlord_username, u.full_name AS landlord_name, u.phone AS landlord_phone,
             (6371 * acos(
               cos(radians(?)) * cos(radians(r.latitude)) *
               cos(radians(r.longitude) - radians(?)) +
               sin(radians(?)) * sin(radians(r.latitude))
             )) AS distance
      FROM rooms r
      JOIN users u ON r.landlord_id = u.id
      WHERE r.latitude IS NOT NULL AND r.longitude IS NOT NULL
      HAVING distance <= ?
      ORDER BY distance
      LIMIT 50
    `;
    const [rooms] = await db.execute(query, [lat, lon, lat, radiusKm]);

    const parsed = rooms.map(r => ({
      ...r,
      utilities: JSON.parse(r.utilities || '[]'),
      images: JSON.parse(r.images || '[]'),
      distance: r.distance ? parseFloat(r.distance).toFixed(2) : null
    }));

    res.json({ count: parsed.length, rooms: parsed });
  } catch (err) {
    console.error('Nearby search error:', err);
    res.status(500).json({ error: 'Lỗi khi tìm kiếm phòng gần đây', message: err.message });
  }
});

module.exports = router;
