import React, { useState } from 'react'
import './RoomList.css'
import DepositModal from './DepositModal'


function RoomList({
  rooms,
  loading,
  onRoomSelect,
  onAddToComparison,
  comparisonRooms = [],
  onMessageLandlord,
  currentUserId
}) {
  const [selectedRoomQR, setSelectedRoomQR] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState({}) // lưu ảnh hiện tại của từng phòng

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const handlePrevImage = (roomId, totalImages) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [roomId]:
        (prev[roomId] - 1 + totalImages) % totalImages || totalImages - 1
    }))
  }

  const handleNextImage = (roomId, totalImages) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] + 1) % totalImages || 0
    }))
  }

  if (loading) {
    return (
      <div className="room-list">
        <div className="loading">Đang tải...</div>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="room-list">
        <div className="empty-state">
          <p>Không tìm thấy nhà trọ nào phù hợp</p>
        </div>
      </div>
    )
  }

  return (
    <div className="room-list">
      <h2 className="section-title">Danh sách nhà trọ ({rooms.length})</h2>
      <div className="rooms-grid">
        {rooms.map((room) => {
          const images =
            Array.isArray(room.images) && room.images.length > 0
              ? room.images
              : ['/uploads/default-room.png']
          const currentIndex = activeImageIndex[room.id] || 0

          return (
            <div
              key={room.id}
              className="room-card"
              onClick={() => onRoomSelect && onRoomSelect(room)}
              style={{ cursor: onRoomSelect ? 'pointer' : 'default' }}
            >
              {/* Ảnh trượt */}
              <div className="room-image">
                <img
                  src={images[currentIndex]}
                  alt={`Ảnh ${currentIndex + 1}`}
                  className="room-main-image"
                />
                {images.length > 1 && (
                  <>
                    <button
                      className="image-nav prev"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePrevImage(room.id, images.length)
                      }}
                    >
                      ❮
                    </button>
                    <button
                      className="image-nav next"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNextImage(room.id, images.length)
                      }}
                    >
                      ❯
                    </button>
                  </>
                )}
                {room.available ? (
                  <span className="available-badge">Còn trống</span>
                ) : (
                  <span className="unavailable-badge">Đã cho thuê</span>
                )}
              </div>

              {/* Nội dung */}
              <div className="room-content">
                <h3 className="room-title">{room.title || 'Không có tiêu đề'}</h3>
                <p className="room-description">
                  {room.description || 'Không có mô tả'}
                </p>

                <div className="room-info">
                  <div className="info-item">
                    <span className="info-label">💰 Giá:</span>
                    <span className="info-value">
                      {room.price ? formatPrice(room.price) : 'N/A'}đ/tháng
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📍 Địa chỉ:</span>
                    <span className="info-value">{room.address}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📐 Diện tích:</span>
                    <span className="info-value">
                      {room.area ? `${room.area}m²` : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Tiện ích */}
                <div className="room-utilities">
                  <strong>Tiện ích:</strong>
                  <div className="utilities-list">
                    {room.utilities && room.utilities.length > 0 ? (
                      room.utilities.map((util, i) => (
                        <span key={i} className="utility-tag">
                          {util}
                        </span>
                      ))
                    ) : (
                      <span className="utility-none">Không có thông tin</span>
                    )}
                  </div>
                </div>

                {/* Liên hệ */}
                <div className="room-contact">
                  <span>
                    📞 {room.landlord_name || room.landlord_username}:{' '}
                    {room.landlord_phone || 'Chưa cập nhật'}
                  </span>
                </div>

                {/* Nút hành động */}
                <div className="room-actions">
                  {onAddToComparison && (
                    <button
                      className="compare-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddToComparison(room)
                      }}
                      disabled={
                        comparisonRooms.find((r) => r.id === room.id) !==
                        undefined
                      }
                    >
                      {comparisonRooms.find((r) => r.id === room.id)
                        ? '✓ Đã thêm'
                        : '+ So sánh'}
                    </button>
                  )}

                  {onMessageLandlord &&
                    room.landlord_id &&
                    currentUserId !== room.landlord_id && (
                      <button
                        className="message-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onMessageLandlord(room.landlord_id, room)
                        }}
                      >
                        💬 Nhắn tin
                      </button>
                    )}

                  {room.payment_qr && (
                    <button
                      className="deposit-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRoomQR(room)
                      }}
                    >
                      💵 Đặt cọc
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal QR */}
{selectedRoomQR && (
  <div className="qr-modal" onClick={() => setSelectedRoomQR(null)}>
    <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Quét mã QR để đặt cọc phòng</h3>
      <img 
        src={selectedRoomQR.payment_qr} 
        alt="QR Thanh toán"
        className="qr-img"
      />
      <p>Sau khi thanh toán, hãy chụp lại màn hình làm bằng chứng.</p>
      <button className="close-btn" onClick={() => setSelectedRoomQR(null)}>Đóng</button>
    </div>
  </div>
)}

    </div>
  )
}

export default RoomList
