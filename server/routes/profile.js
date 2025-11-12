const express = require('express');
const router = express.Router();
const db = require('../database/db');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');

// Lấy thông tin profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, username, email, full_name, phone, role, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin profile', message: error.message });
  }
});

// Cập nhật thông tin profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { full_name, phone, avatar } = req.body;

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (full_name !== undefined) {
      updates.push('full_name = ?');
      params.push(full_name || null);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone || null);
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      params.push(avatar || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    params.push(req.user.id);
    await db.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const [updatedUser] = await db.execute(
      'SELECT id, username, email, full_name, phone, role, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      message: 'Cập nhật thông tin thành công',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật thông tin', message: error.message });
  }
});

// Đổi mật khẩu
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    // Lấy password hiện tại
    const [users] = await db.execute('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    // Kiểm tra mật khẩu hiện tại
    const isValidPassword = await bcrypt.compare(current_password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Cập nhật mật khẩu
    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Lỗi khi đổi mật khẩu', message: error.message });
  }
});

// Lấy phòng trọ của landlord
router.get('/my-rooms', authenticateToken, async (req, res) => {
  try {
    const [rooms] = await db.execute(
      'SELECT * FROM rooms WHERE landlord_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const roomsWithParsed = rooms.map(room => {
      try {
        return {
          ...room,
          utilities: JSON.parse(room.utilities || '[]'),
          images: JSON.parse(room.images || '[]')
        };
      } catch (e) {
        return {
          ...room,
          utilities: [],
          images: []
        };
      }
    });

    res.json({ rooms: roomsWithParsed });
  } catch (error) {
    console.error('Get my rooms error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách phòng', message: error.message });
  }
});

module.exports = router;

