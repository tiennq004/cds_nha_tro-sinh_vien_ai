const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'room-' + uniqueSuffix + ext);
  }
});

// Lọc chỉ cho phép file ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  },
  fileFilter: fileFilter
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File quá lớn. Kích thước tối đa là 5MB' });
    }
    return res.status(400).json({ error: 'Lỗi upload file', message: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message || 'Lỗi khi upload file' });
  }
  next();
};

// Upload một hình ảnh
router.post('/image', authenticateToken, (req, res, next) => {
  console.log('📤 Upload request received:', {
    contentType: req.headers['content-type'],
    hasFile: !!req.file,
    method: req.method,
    path: req.path
  });
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      return handleMulterError(err, req, res, next);
    }
    next();
  });
}, (req, res) => {
  try {
    console.log('📁 Request file:', req.file ? {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : 'No file');
    
    if (!req.file) {
      console.error('❌ No file in request');
      return res.status(400).json({ error: 'Không có file được upload. Vui lòng chọn file ảnh.' });
    }

    // Trả về đường dẫn file (đầy đủ URL)
    const filePath = `/uploads/images/${req.file.filename}`;
    console.log('✅ File uploaded successfully:', req.file.filename, 'Size:', req.file.size, 'bytes');
    res.json({
      message: 'Upload thành công',
      imageUrl: filePath,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Lỗi khi upload file', message: error.message });
  }
});

// Upload nhiều hình ảnh
router.post('/images', authenticateToken, (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
}, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    // Trả về danh sách đường dẫn file
    const imageUrls = req.files.map(file => `/uploads/images/${file.filename}`);
    console.log('✅ Files uploaded:', req.files.length, 'files');
    res.json({
      message: 'Upload thành công',
      images: imageUrls,
      count: imageUrls.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Lỗi khi upload file', message: error.message });
  }
});

// Xóa hình ảnh
router.delete('/image/:filename', authenticateToken, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', 'images', filename);

    // Kiểm tra file có tồn tại không
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Xóa file thành công' });
    } else {
      res.status(404).json({ error: 'File không tồn tại' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Lỗi khi xóa file', message: error.message });
  }
});

module.exports = router;

