const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// Lấy danh sách cuộc trò chuyện
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy danh sách user IDs đã có tin nhắn với user hiện tại
    const [userIds] = await db.execute(`
      SELECT DISTINCT 
        CASE 
          WHEN sender_id = ? THEN receiver_id
          ELSE sender_id
        END as other_user_id
      FROM messages
      WHERE sender_id = ? OR receiver_id = ?
    `, [userId, userId, userId]);

    // Lấy thông tin chi tiết của từng cuộc trò chuyện
    const conversations = await Promise.all(
      userIds.map(async (row) => {
        const otherUserId = row.other_user_id;

        // Lấy thông tin user
        const [users] = await db.execute(
          'SELECT id, username, full_name, avatar FROM users WHERE id = ?',
          [otherUserId]
        );

        if (users.length === 0) return null;

        const otherUser = users[0];

        // Lấy tin nhắn cuối cùng
        const [lastMessages] = await db.execute(
          `SELECT message, created_at, read_status 
          FROM messages 
          WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
          ORDER BY created_at DESC 
          LIMIT 1`,
          [userId, otherUserId, otherUserId, userId]
        );

        // Đếm số tin nhắn chưa đọc
        const [unreadCount] = await db.execute(
          `SELECT COUNT(*) as count 
          FROM messages 
          WHERE sender_id = ? AND receiver_id = ? AND read_status = FALSE`,
          [otherUserId, userId]
        );

        return {
          other_user_id: otherUserId,
          other_username: otherUser.username,
          other_full_name: otherUser.full_name,
          other_avatar: otherUser.avatar,
          last_message: lastMessages[0]?.message || '',
          last_message_time: lastMessages[0]?.created_at || new Date(),
          unread_count: unreadCount[0]?.count || 0
        };
      })
    );

    // Lọc bỏ null và sắp xếp theo thời gian
    const validConversations = conversations
      .filter(conv => conv !== null)
      .sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));

    res.json({ conversations: validConversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách cuộc trò chuyện', message: error.message });
  }
});

// Lấy tin nhắn giữa hai user
router.get('/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = parseInt(req.params.userId);

    const [messages] = await db.execute(
      `SELECT m.*, 
        u1.username as sender_username, u1.full_name as sender_full_name, u1.avatar as sender_avatar,
        u2.username as receiver_username, u2.full_name as receiver_full_name, u2.avatar as receiver_avatar
      FROM messages m
      JOIN users u1 ON m.sender_id = u1.id
      JOIN users u2 ON m.receiver_id = u2.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC`,
      [currentUserId, otherUserId, otherUserId, currentUserId]
    );

    // Đánh dấu tin nhắn đã đọc (chỉ khi có tin nhắn)
    if (messages && messages.length > 0) {
      await db.execute(
        'UPDATE messages SET read_status = TRUE WHERE receiver_id = ? AND sender_id = ?',
        [currentUserId, otherUserId]
      );
    }

    res.json({ messages: messages || [] });
  } catch (error) {
    console.error('Get messages error:', error);
    // Trả về mảng rỗng nếu chưa có tin nhắn thay vì lỗi
    res.json({ messages: [] });
  }
});

// Gửi tin nhắn
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { receiver_id, room_id, message } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !message) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    const [result] = await db.execute(
      'INSERT INTO messages (sender_id, receiver_id, room_id, message) VALUES (?, ?, ?, ?)',
      [sender_id, receiver_id, room_id || null, message]
    );

    const [newMessage] = await db.execute(
      `SELECT m.*, 
        u1.username as sender_username, u1.full_name as sender_full_name, u1.avatar as sender_avatar,
        u2.username as receiver_username, u2.full_name as receiver_full_name, u2.avatar as receiver_avatar
      FROM messages m
      JOIN users u1 ON m.sender_id = u1.id
      JOIN users u2 ON m.receiver_id = u2.id
      WHERE m.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Gửi tin nhắn thành công',
      data: newMessage[0]
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Lỗi khi gửi tin nhắn', message: error.message });
  }
});

// Đánh dấu tin nhắn đã đọc
router.put('/:messageId/read', authenticateToken, async (req, res) => {
  try {
    await db.execute(
      'UPDATE messages SET read_status = TRUE WHERE id = ? AND receiver_id = ?',
      [req.params.messageId, req.user.id]
    );

    res.json({ message: 'Đã đánh dấu tin nhắn đã đọc' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Lỗi khi đánh dấu tin nhắn', message: error.message });
  }
});

module.exports = router;

