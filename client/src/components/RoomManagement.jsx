import { useState, useEffect } from 'react'
import axios from 'axios'
import { getAuthHeaders } from '../utils/auth'
import './RoomManagement.css'

function RoomManagement({ onClose }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    area: '',
    utilities: [],
    rules: '',
    available: true,
    images: []
  })
  const [utilityInput, setUtilityInput] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    fetchMyRooms()
  }, [])

  const fetchMyRooms = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/profile/my-rooms', {
        headers: getAuthHeaders()
      })
      setRooms(response.data.rooms || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setError('Không thể tải danh sách phòng')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleAddUtility = () => {
    if (utilityInput.trim() && !formData.utilities.includes(utilityInput.trim())) {
      setFormData({
        ...formData,
        utilities: [...formData.utilities, utilityInput.trim()]
      })
      setUtilityInput('')
    }
  }

  const handleRemoveUtility = (util) => {
    setFormData({
      ...formData,
      utilities: formData.utilities.filter(u => u !== util)
    })
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploadingImages(true)
    setError('')

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('image', file)
        
        // Lấy token riêng để không set Content-Type (browser sẽ tự set với boundary)
        const token = localStorage.getItem('token')
        const headers = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        // KHÔNG set Content-Type - browser sẽ tự động set multipart/form-data với boundary
        
        const response = await axios.post('/api/upload/image', formData, {
          headers: headers
        })
        return response.data.imageUrl
      })

      const uploadedImages = await Promise.all(uploadPromises)
      const newImages = [...formData.images, ...uploadedImages]
      
      setFormData({
        ...formData,
        images: newImages
      })
      
    } catch (error) {
      console.error('Error uploading images:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      })
      
      let errorMessage = 'Lỗi khi upload hình ảnh'
      if (error.response?.status === 401) {
        errorMessage = 'Bạn cần đăng nhập để upload hình ảnh'
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.error || 'File không hợp lệ'
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server khi upload. Vui lòng thử lại sau.'
      } else if (!error.response) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.'
      } else {
        errorMessage = error.response?.data?.error || error.message || 'Lỗi khi upload hình ảnh'
      }
      
      setError(errorMessage)
      alert(errorMessage)
    } finally {
      setUploadingImages(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      images: newImages
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (editingRoom) {
        // Update room
        await axios.put(`/api/rooms/${editingRoom.id}`, formData, {
          headers: getAuthHeaders()
        })
        setSuccess('Cập nhật phòng trọ thành công!')
      } else {
        // Create room
        await axios.post('/api/rooms', formData, {
          headers: getAuthHeaders()
        })
        setSuccess('Tạo phòng trọ thành công!')
      }
      
      fetchMyRooms()
      resetForm()
    } catch (error) {
      setError(error.response?.data?.error || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (room) => {
    setEditingRoom(room)
    const images = Array.isArray(room.images) ? room.images : []
    setFormData({
      title: room.title || '',
      description: room.description || '',
      price: room.price || '',
      address: room.address || '',
      area: room.area || '',
      utilities: Array.isArray(room.utilities) ? room.utilities : [],
      rules: room.rules || '',
      available: room.available !== undefined ? room.available : true,
      images: images
    })
    setShowForm(true)
  }

  const handleDelete = async (roomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng trọ này?')) {
      return
    }

    try {
      await axios.delete(`/api/rooms/${roomId}`, {
        headers: getAuthHeaders()
      })
      setSuccess('Xóa phòng trọ thành công!')
      fetchMyRooms()
    } catch (error) {
      setError(error.response?.data?.error || 'Có lỗi xảy ra khi xóa')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      address: '',
      area: '',
      utilities: [],
      rules: '',
      available: true,
      images: []
    })
    setEditingRoom(null)
    setShowForm(false)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  return (
    <div className="room-management-page">
      <div className="room-management-container">
        <div className="management-header">
          <h2>Quản lý phòng trọ</h2>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
            >
              + Thêm phòng mới
            </button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {showForm && (
          <div className="room-form-section">
            <h3>{editingRoom ? 'Chỉnh sửa phòng trọ' : 'Thêm phòng trọ mới'}</h3>
            <form onSubmit={handleSubmit} className="room-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tiêu đề *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tiêu đề phòng trọ"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Nhập mô tả phòng trọ"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Giá thuê (VNĐ/tháng) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="1500000"
                  />
                </div>

                <div className="form-group">
                  <label>Diện tích (m²)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    min="0"
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Địa chỉ *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Nhập địa chỉ phòng trọ"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tiện ích</label>
                  <div className="utilities-input">
                    <input
                      type="text"
                      value={utilityInput}
                      onChange={(e) => setUtilityInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddUtility()
                        }
                      }}
                      placeholder="Nhập tiện ích và nhấn Enter"
                    />
                    <button
                      type="button"
                      className="btn-add-utility"
                      onClick={handleAddUtility}
                    >
                      Thêm
                    </button>
                  </div>
                  <div className="utilities-list">
                    {formData.utilities.map((util, index) => (
                      <span key={index} className="utility-tag">
                        {util}
                        <button
                          type="button"
                          onClick={() => handleRemoveUtility(util)}
                          className="remove-utility"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hình ảnh</label>
                  <div className="image-upload-section">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="image-upload" className="upload-button">
                      {uploadingImages ? 'Đang tải...' : '+ Chọn hình ảnh'}
                    </label>
                    <p className="upload-hint">Có thể chọn nhiều hình ảnh (tối đa 5MB mỗi ảnh)</p>
                    
                    {formData.images.length > 0 && (
                      <div className="images-preview">
                        {formData.images.map((imageUrl, index) => (
                          <div key={index} className="image-preview-item">
                            <img 
                              src={imageUrl} 
                              alt={`Preview ${index + 1}`}
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5L6XQgaGkuaW5oIGFuaDwvdGV4dD48L3N2Zz4='
                              }}
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => handleRemoveImage(index)}
                              title="Xóa hình ảnh"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quy định</label>
                  <textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Nhập quy định của phòng trọ"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleChange}
                    />
                    Phòng đang còn trống
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : (editingRoom ? 'Cập nhật' : 'Tạo mới')}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rooms-list-section">
          <h3>Danh sách phòng trọ của tôi ({rooms.length})</h3>
          
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              <p>Bạn chưa có phòng trọ nào. Hãy thêm phòng trọ mới!</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.id} className="room-card">
                  <div className="room-card-header">
                    <h4>{room.title}</h4>
                    <div className="room-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(room)}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(room.id)}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="room-card-content">
                    <p className="room-description">{room.description}</p>
                    <div className="room-info">
                      <span>💰 {formatPrice(room.price)}đ/tháng</span>
                      <span>📐 {room.area || 'N/A'}m²</span>
                      <span>📍 {room.address}</span>
                    </div>
                    <div className="room-status">
                      {room.available ? (
                        <span className="status-available">✓ Còn trống</span>
                      ) : (
                        <span className="status-unavailable">✗ Đã cho thuê</span>
                      )}
                    </div>
                    {room.utilities && room.utilities.length > 0 && (
                      <div className="room-utilities">
                        <strong>Tiện ích:</strong>
                        <div className="utilities-tags">
                          {room.utilities.map((util, index) => (
                            <span key={index} className="utility-tag-small">{util}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RoomManagement

