const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireRenter } = require('../middleware/auth');

// Lấy tất cả yêu cầu tìm người ở ghép
router.get('/', async (req, res) => {
  try {
    const { status = 'active' } = req.query;

    const [requests] = await db.execute(
      `SELECT r.*, u.username, u.full_name, u.phone, u.avatar 
      FROM roommate_requests r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.status = ? 
      ORDER BY r.created_at DESC`,
      [status]
    );

    res.json({ requests });
  } catch (error) {
    console.error('Get roommate requests error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách yêu cầu', message: error.message });
  }
});

// Tạo yêu cầu tìm người ở ghép (chỉ renter)
router.post('/', authenticateToken, requireRenter, async (req, res) => {
  try {
    const { title, description, budget_min, budget_max, preferred_location, preferences } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Vui lòng điền tiêu đề' });
    }

    const [result] = await db.execute(
      'INSERT INTO roommate_requests (user_id, title, description, budget_min, budget_max, preferred_location, preferences) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        req.user.id,
        title,
        description || null,
        budget_min ? parseFloat(budget_min) : null,
        budget_max ? parseFloat(budget_max) : null,
        preferred_location || null,
        preferences || null
      ]
    );

    const [newRequest] = await db.execute(
      'SELECT r.*, u.username, u.full_name, u.phone, u.avatar FROM roommate_requests r JOIN users u ON r.user_id = u.id WHERE r.id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Tạo yêu cầu thành công',
      request: newRequest[0]
    });
  } catch (error) {
    console.error('Create roommate request error:', error);
    res.status(500).json({ error: 'Lỗi khi tạo yêu cầu', message: error.message });
  }
});

// Cập nhật yêu cầu (chỉ người tạo)
router.put('/:id', authenticateToken, requireRenter, async (req, res) => {
  try {
    const { title, description, budget_min, budget_max, preferred_location, preferences, status } = req.body;

    // Kiểm tra quyền sở hữu
    const [requests] = await db.execute('SELECT * FROM roommate_requests WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

    if (requests.length === 0) {
      return res.status(403).json({ error: 'Bạn không có quyền cập nhật yêu cầu này' });
    }

    await db.execute(
      'UPDATE roommate_requests SET title = COALESCE(?, title), description = COALESCE(?, description), budget_min = COALESCE(?, budget_min), budget_max = COALESCE(?, budget_max), preferred_location = COALESCE(?, preferred_location), preferences = COALESCE(?, preferences), status = COALESCE(?, status) WHERE id = ?',
      [
        title || null,
        description || null,
        budget_min ? parseFloat(budget_min) : null,
        budget_max ? parseFloat(budget_max) : null,
        preferred_location || null,
        preferences || null,
        status || null,
        req.params.id
      ]
    );

    const [updatedRequest] = await db.execute(
      'SELECT r.*, u.username, u.full_name, u.phone, u.avatar FROM roommate_requests r JOIN users u ON r.user_id = u.id WHERE r.id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Cập nhật yêu cầu thành công',
      request: updatedRequest[0]
    });
  } catch (error) {
    console.error('Update roommate request error:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật yêu cầu', message: error.message });
  }
});

// Xóa yêu cầu (chỉ người tạo)
router.delete('/:id', authenticateToken, requireRenter, async (req, res) => {
  try {
    // Kiểm tra quyền sở hữu
    const [requests] = await db.execute('SELECT * FROM roommate_requests WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

    if (requests.length === 0) {
      return res.status(403).json({ error: 'Bạn không có quyền xóa yêu cầu này' });
    }

    await db.execute('DELETE FROM roommate_requests WHERE id = ?', [req.params.id]);

    res.json({ message: 'Xóa yêu cầu thành công' });
  } catch (error) {
    console.error('Delete roommate request error:', error);
    res.status(500).json({ error: 'Lỗi khi xóa yêu cầu', message: error.message });
  }
});

module.exports = router;
