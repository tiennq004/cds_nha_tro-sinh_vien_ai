import React from 'react'
import './DepositModal.css'

function DepositModal({ room, onClose }) {
  if (!room) return null

  return (
    <div className="deposit-modal-overlay" onClick={onClose}>
      <div className="deposit-modal" onClick={(e) => e.stopPropagation()}>
        <h2>💵 Đặt cọc phòng: {room.title}</h2>

        {room.payment_qr ? (
          <>
            <img
              src={room.payment_qr.startsWith('/uploads') 
                ? `${room.payment_qr}` 
                : `/uploads/images/${room.payment_qr}`}
              alt="QR Thanh toán"
              className="qr-image"
            />
            <p>Chủ trọ: {room.landlord_name || room.landlord_username}</p>
            <p>Giá: {room.price?.toLocaleString('vi-VN')}đ / tháng</p>
            <p style={{ fontStyle: 'italic', color: '#666' }}>
              Quét mã QR để đặt cọc và xác nhận thuê phòng
            </p>
          </>
        ) : (
          <p>Chủ trọ chưa thêm mã QR thanh toán</p>
        )}

        <button className="close-btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  )
}

export default DepositModal
