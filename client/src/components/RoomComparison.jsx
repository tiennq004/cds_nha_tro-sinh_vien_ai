import { useState } from 'react'
import './RoomComparison.css'

function RoomComparison({ rooms = [], onClose }) {
  const [selectedRooms, setSelectedRooms] = useState(rooms && rooms.length > 0 ? rooms.slice(0, Math.min(5, rooms.length)) : [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const handleRemoveRoom = (roomId) => {
    setSelectedRooms(selectedRooms.filter(r => r.id !== roomId))
  }

  const handleAddRoom = (room) => {
    if (selectedRooms.length < 5 && !selectedRooms.find(r => r.id === room.id)) {
      setSelectedRooms([...selectedRooms, room])
    }
  }

  if (selectedRooms.length === 0) {
    return (
      <div className="comparison-overlay" onClick={onClose}>
        <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
          <button className="comparison-close" onClick={onClose}>×</button>
          <p>Chưa có phòng nào để so sánh. Hãy chọn phòng từ danh sách.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="comparison-overlay" onClick={onClose}>
      <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
        <button className="comparison-close" onClick={onClose}>×</button>
        <h2>So sánh phòng trọ</h2>
        
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Tiêu chí</th>
                {selectedRooms.map(room => (
                  <th key={room.id}>
                    <button 
                      className="remove-room-btn"
                      onClick={() => handleRemoveRoom(room.id)}
                      title="Xóa khỏi so sánh"
                    >
                      ×
                    </button>
                    <div className="room-title">{room.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Giá thuê</strong></td>
                {selectedRooms.map(room => (
                  <td key={room.id}>{room.price ? formatPrice(room.price) : 'N/A'}đ/tháng</td>
                ))}
              </tr>
              <tr>
                <td><strong>Địa chỉ</strong></td>
                {selectedRooms.map(room => (
                  <td key={room.id}>{room.address || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Diện tích</strong></td>
                {selectedRooms.map(room => (
                  <td key={room.id}>{room.area ? `${room.area} m²` : 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Tiện ích</strong></td>
                {selectedRooms.map(room => (
                  <td key={room.id}>
                    <div className="utilities-compare">
                      {room.utilities && Array.isArray(room.utilities) && room.utilities.length > 0 ? (
                        room.utilities.map((util, idx) => (
                          <span key={idx} className="utility-badge">{util}</span>
                        ))
                      ) : (
                        <span>Không có</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Trạng thái</strong></td>
                {selectedRooms.map(room => (
                  <td key={room.id}>
                    {room.available !== undefined && room.available !== false ? (
                      <span className="status-available">Còn trống</span>
                    ) : (
                      <span className="status-unavailable">Đã cho thuê</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Người cho thuê</strong></td>
                {selectedRooms.map(room => (
                  <td key={room.id}>{room.landlord_name || room.landlord_username || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Mô tả</strong></td>
                {selectedRooms.map(room => (
                  <td key={room.id} className="description-cell">
                    {room.description || 'Không có mô tả'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="comparison-summary">
          <h3>Tóm tắt</h3>
          <div className="summary-grid">
            {selectedRooms.length > 0 && selectedRooms.some(r => r.price) && (
              <div className="summary-item">
                <strong>Giá thấp nhất:</strong> {
                  formatPrice(Math.min(...selectedRooms.filter(r => r.price).map(r => r.price)))
                }đ/tháng
              </div>
            )}
            {selectedRooms.length > 0 && selectedRooms.some(r => r.price) && (
              <div className="summary-item">
                <strong>Giá cao nhất:</strong> {
                  formatPrice(Math.max(...selectedRooms.filter(r => r.price).map(r => r.price)))
                }đ/tháng
              </div>
            )}
            {selectedRooms.length > 0 && selectedRooms.some(r => r.area) && (
              <div className="summary-item">
                <strong>Diện tích trung bình:</strong> {
                  (selectedRooms.filter(r => r.area).reduce((sum, r) => sum + (parseFloat(r.area) || 0), 0) / 
                   selectedRooms.filter(r => r.area).length).toFixed(1)
                } m²
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomComparison


