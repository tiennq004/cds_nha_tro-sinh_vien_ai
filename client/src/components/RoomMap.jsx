import './RoomMap.css'

function RoomMap({ rooms, selectedRoom, onRoomSelect }) {
  // Lọc các phòng có tọa độ
  const roomsWithCoords = rooms.filter(room => room.latitude && room.longitude)

  if (roomsWithCoords.length === 0) {
    return (
      <div className="room-map-container">
        <div className="map-no-coords">
          <p>📍 Không có phòng trọ nào có thông tin vị trí trên bản đồ.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#999' }}>
            Tổng số phòng: {rooms.length}
          </p>
          {rooms.length > 0 && (
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#666' }}>
              💡 Để hiển thị bản đồ, phòng trọ cần có thông tin địa chỉ và tọa độ GPS.
            </p>
          )}
        </div>
      </div>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  // Hiển thị danh sách phòng với thông tin vị trí
  return (
    <div className="room-map-container">
      <div className="map-placeholder">
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>
          🗺️ Vị trí các phòng trọ ({roomsWithCoords.length})
        </h3>
        <div className="rooms-location-list">
          {roomsWithCoords.map(room => (
            <div
              key={room.id}
              className={`location-item ${selectedRoom?.id === room.id ? 'selected' : ''}`}
              onClick={() => onRoomSelect && onRoomSelect(room)}
            >
              <div className="location-header">
                <strong>{room.title || 'Không có tiêu đề'}</strong>
                {room.available ? (
                  <span className="status-badge available">Còn trống</span>
                ) : (
                  <span className="status-badge unavailable">Đã cho thuê</span>
                )}
              </div>
              <div className="location-details">
                <div className="detail-item">
                  <span className="detail-label">📍 Địa chỉ:</span>
                  <span className="detail-value">{room.address || 'Chưa cập nhật'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">💰 Giá:</span>
                  <span className="detail-value">
                    {room.price ? formatPrice(room.price) : 'N/A'}đ/tháng
                  </span>
                </div>
                {room.area && (
                  <div className="detail-item">
                    <span className="detail-label">📐 Diện tích:</span>
                    <span className="detail-value">{room.area}m²</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">🌐 Tọa độ:</span>
                  <span className="detail-value">
                    {parseFloat(room.latitude).toFixed(6)}, {parseFloat(room.longitude).toFixed(6)}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${room.latitude},${room.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  🔗 Xem trên Google Maps
                </a>
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
          💡 Click vào phòng để xem chi tiết hoặc click "Xem trên Google Maps" để xem vị trí trên bản đồ
        </p>
      </div>
    </div>
  )
}

export default RoomMap
