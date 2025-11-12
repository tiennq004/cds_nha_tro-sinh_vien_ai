const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', async (req, res) => {
  try {
    const { 
      keyword, 
      minPrice, 
      maxPrice, 
      address, 
      minArea, 
      maxArea,
      utilities 
    } = req.query;

    let query = 'SELECT r.*, u.id as landlord_id, u.username as landlord_username, u.full_name as landlord_name, u.phone as landlord_phone FROM rooms r JOIN users u ON r.landlord_id = u.id WHERE r.available = TRUE';
    const params = [];

    // Filter by keyword
    if (keyword) {
      query += ' AND (r.title LIKE ? OR r.description LIKE ? OR r.address LIKE ?)';
      const keywordParam = `%${keyword}%`;
      params.push(keywordParam, keywordParam, keywordParam);
    }

    // Filter by price
    if (minPrice) {
      query += ' AND r.price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND r.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    // Filter by address
    if (address) {
      query += ' AND r.address LIKE ?';
      params.push(`%${address}%`);
    }

    // Filter by area
    if (minArea) {
      query += ' AND r.area >= ?';
      params.push(parseFloat(minArea));
    }

    if (maxArea) {
      query += ' AND r.area <= ?';
      params.push(parseFloat(maxArea));
    }

    query += ' ORDER BY r.created_at DESC';

    const [rooms] = await db.execute(query, params);

    // Filter by utilities if provided
    let filteredRooms = rooms;
    if (utilities) {
      const utilitiesList = utilities.split(',').map(u => u.trim().toLowerCase());
      filteredRooms = rooms.filter(room => {
        try {
          const roomUtilities = JSON.parse(room.utilities || '[]');
          return Array.isArray(roomUtilities) && utilitiesList.every(util => 
            roomUtilities.some(u => String(u).toLowerCase().includes(util))
          );
        } catch (e) {
          return false;
        }
      });
    }

    // Parse JSON fields với error handling
    filteredRooms = filteredRooms.map(room => {
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

    res.json({
      count: filteredRooms.length,
      rooms: filteredRooms
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Lỗi khi tìm kiếm', message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rooms] = await db.execute(
      'SELECT r.*, u.id as landlord_id, u.username as landlord_username, u.full_name as landlord_name, u.phone as landlord_phone, u.email as landlord_email FROM rooms r JOIN users u ON r.landlord_id = u.id WHERE r.id = ?',
      [req.params.id]
    );
    
    if (rooms.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhà trọ' });
    }

    const room = rooms[0];
    try {
      room.utilities = JSON.parse(room.utilities || '[]');
      room.images = JSON.parse(room.images || '[]');
    } catch (e) {
      room.utilities = [];
      room.images = [];
    }

    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin nhà trọ', message: error.message });
  }
});

module.exports = router;