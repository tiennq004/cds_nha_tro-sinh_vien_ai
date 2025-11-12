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
  console.warn("⚠️  Chưa cấu hình GOOGLE_API_KEY trong file .env - Tính năng AI sẽ không hoạt động");
}

router.post('/suggest', async (req, res) => {
  try {
    // Kiểm tra API key
    if (!genAI || !process.env.GOOGLE_API_KEY) {
      return res.status(503).json({ 
        error: 'Tính năng AI chưa được cấu hình. Vui lòng cấu hình GOOGLE_API_KEY trong file .env' 
      });
    }

    const { requirements, budget, location, preferences } = req.body;

    if (!requirements && !budget) {
      return res.status(400).json({ error: 'Vui lòng cung cấp yêu cầu hoặc ngân sách' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Lấy dữ liệu nhà trọ từ database
    const [rooms] = await db.execute('SELECT * FROM rooms WHERE available = TRUE');
    
    // Kiểm tra nếu không có phòng nào
    if (!rooms || rooms.length === 0) {
      return res.json({
        summary: 'Hiện tại chưa có phòng trọ nào trong hệ thống. Vui lòng thử lại sau.',
        suggestions: [],
        count: 0
      });
    }
    
    // Chuẩn bị dữ liệu nhà trọ
    const roomsData = rooms.map((room) => {
      try {
        const utilities = JSON.parse(room.utilities || '[]');
        return {
          id: room.id,
          title: room.title,
          price: room.price,
          address: room.address,
          area: room.area,
          description: room.description || 'Không có mô tả',
          utilities: Array.isArray(utilities) ? utilities.join(', ') : ''
        };
      } catch (e) {
        return {
          id: room.id,
          title: room.title,
          price: room.price,
          address: room.address,
          area: room.area,
          description: room.description || 'Không có mô tả',
          utilities: ''
        };
      }
    });

    const prompt = `Bạn là một hệ thống AI chuyên gợi ý nhà trọ cho sinh viên.

Dữ liệu nhà trọ hiện có:
${JSON.stringify(roomsData, null, 2)}

Yêu cầu của người dùng:
- Yêu cầu: ${requirements || 'Không có'}
- Ngân sách: ${budget || 'Không có'}
- Vị trí mong muốn: ${location || 'Không có'}
- Sở thích: ${preferences || 'Không có'}

Hãy phân tích và gợi ý 3-5 nhà trọ phù hợp nhất với yêu cầu trên.
Trả lời bằng tiếng Việt, định dạng JSON với cấu trúc:
{
  "suggestions": [
    {
      "roomId": số ID,
      "reason": "Lý do tại sao phù hợp",
      "matchScore": điểm từ 1-10
    }
  ],
  "summary": "Tóm tắt ngắn gọn về các gợi ý"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Parse JSON từ response (có thể có markdown code blocks)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const aiResponse = JSON.parse(text);
      
      // Lấy thông tin chi tiết các phòng được gợi ý từ database
      const suggestedRooms = await Promise.all(
        (aiResponse.suggestions || []).map(async (suggestion) => {
          try {
            const [roomRows] = await db.execute(
              'SELECT r.*, u.id as landlord_id, u.username as landlord_username, u.full_name as landlord_name, u.phone as landlord_phone FROM rooms r JOIN users u ON r.landlord_id = u.id WHERE r.id = ?', 
              [suggestion.roomId]
            );
            if (roomRows.length > 0) {
              const room = roomRows[0];
              try {
                return {
                  ...room,
                  utilities: JSON.parse(room.utilities || '[]'),
                  images: JSON.parse(room.images || '[]'),
                  reason: suggestion.reason || 'Phù hợp với yêu cầu',
                  matchScore: suggestion.matchScore || 5
                };
              } catch (parseError) {
                return {
                  ...room,
                  utilities: [],
                  images: [],
                  reason: suggestion.reason || 'Phù hợp với yêu cầu',
                  matchScore: suggestion.matchScore || 5
                };
              }
            }
            return null;
          } catch (error) {
            console.error('Error fetching room:', error);
            return null;
          }
        })
      );
      
      const validRooms = suggestedRooms.filter(room => room !== null);

      res.json({
        summary: aiResponse.summary,
        suggestions: validRooms,
        count: validRooms.length
      });
    } catch (parseError) {
      // Nếu không parse được JSON, trả về text thuần
      res.json({
        summary: text,
        suggestions: [],
        count: 0,
        rawResponse: text
      });
    }

  } catch (error) {
  console.error('🚨 AI suggestion error:', error.response?.data || error.message);
  res.status(500).json({ 
    error: 'Lỗi khi tạo gợi ý', 
    message: error.message,
    details: error.response?.data || null
  });
}

});

module.exports = router;
