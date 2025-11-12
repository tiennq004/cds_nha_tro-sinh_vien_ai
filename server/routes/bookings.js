const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// Tạo đặt cọc mới
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { room_id, amount } = req.body;
    if (!room_id || !amount) {
      return res.status(400).json({ error: 'Thiếu thông tin đặt cọc' });
    }

    // Kiểm tra phòng có tồn tại
    const [rooms] = await db.execute('SELECT * FROM rooms WHERE id = ?', [room_id]);
    if (rooms.length === 0) return res.status(404).json({ error: 'Không tìm thấy phòng' });

    await db.execute(
      'INSERT INTO bookings (room_id, tenant_id, amount) VALUES (?, ?, ?)',
      [room_id, req.user.id, amount]
    );

    res.json({ message: 'Tạo yêu cầu đặt cọc thành công' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Lỗi khi đặt cọc phòng' });
  }
});

// Lấy danh sách đặt cọc của người dùng
router.get('/', authenticateToken, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT b.*, r.title, r.address FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE tenant_id = ? ORDER BY b.created_at DESC',
    [req.user.id]
  );
  res.json(rows);
});

module.exports = router;
