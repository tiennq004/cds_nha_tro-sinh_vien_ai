const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../database/db');
require('dotenv').config();

// Kiểm tra API key trước khi khởi tạo
let genAI = null;
if (process.env.GOOGLE_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
} else {
  console.warn("⚠️  Chưa cấu hình GOOGLE_API_KEY trong file .env - Tính năng Chatbot sẽ không hoạt động");
}

router.post('/chat', async (req, res) => {
  try {
    // Kiểm tra API key
    if (!genAI || !process.env.GOOGLE_API_KEY) {
      return res.status(503).json({ 
        error: 'Tính năng Chatbot chưa được cấu hình. Vui lòng cấu hình GOOGLE_API_KEY trong file .env',
        response: 'Xin lỗi, tính năng chatbot tạm thời không khả dụng. Vui lòng liên hệ admin để được hỗ trợ.'
      });
    }

    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // ✅ Dùng model mới nhất đang hoạt động ổn định
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 🏠 Lấy dữ liệu nhà trọ từ database
    let roomsInfo = 'Hiện chưa có nhà trọ nào trong hệ thống.';
    try {
      const [rooms] = await db.execute('SELECT * FROM rooms WHERE available = TRUE LIMIT 20');
      if (rooms && rooms.length > 0) {
        roomsInfo = rooms.map(room => {
          try {
            const utilities = JSON.parse(room.utilities || '[]');
            return `- ${room.title}: ${room.description || 'Không có mô tả'}, Giá: ${room.price}đ/tháng, Địa chỉ: ${room.address}, Diện tích: ${room.area || 'N/A'}m², Tiện ích: ${Array.isArray(utilities) ? utilities.join(', ') : ''}`;
          } catch (e) {
            return `- ${room.title}: ${room.description || 'Không có mô tả'}, Giá: ${room.price}đ/tháng, Địa chỉ: ${room.address}`;
          }
        }).join('\n');
      }
    } catch (dbError) {
      console.error('Database error in chatbot:', dbError);
      roomsInfo = 'Không thể tải dữ liệu nhà trọ từ database.';
    }

    // 🧠 Prompt hướng dẫn chatbot
    const systemPrompt = `Bạn là một chatbot thông minh chuyên tư vấn về nhà trọ cho sinh viên. 
Bạn có thông tin về các nhà trọ sau:
${roomsInfo}

Hãy trả lời câu hỏi của người dùng một cách thân thiện, hữu ích và chính xác. 
Nếu người dùng hỏi về nhà trọ, hãy đề xuất các phòng phù hợp dựa trên yêu cầu của họ.
Trả lời bằng tiếng Việt.`;

    // 💬 Ghép lịch sử hội thoại
    let chatHistoryText = '';
    if (conversationHistory.length > 0) {
      chatHistoryText = conversationHistory
        .map(msg => `${msg.role === 'user' ? 'Người dùng' : 'Bot'}: ${msg.content}`)
.join('\n') + '\n';
    }

    const fullPrompt = `${systemPrompt}\n\n${chatHistoryText}Người dùng: ${message}\nBot:`;

    // 🚀 Gọi API Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Lỗi khi xử lý tin nhắn', 
      message: error.message 
    });
  }
});

module.exports = router;