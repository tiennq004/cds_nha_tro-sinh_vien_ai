import { useState } from 'react'
import axios from 'axios'
import './AISuggestions.css'

function AISuggestions({ onSelectRoom }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [requirements, setRequirements] = useState('')
  const [budget, setBudget] = useState('')
  const [location, setLocation] = useState('')
  const [preferences, setPreferences] = useState('')
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSuggest = async (e) => {
    e.preventDefault()
    if (!requirements && !budget) {
      alert('Vui lòng nhập ít nhất yêu cầu hoặc ngân sách')
      return
    }

    setLoading(true)
    setSuggestions(null)

    try {
      const response = await axios.post('/api/ai/suggest', {
        requirements,
        budget,
        location,
        preferences
      })

      setSuggestions(response.data)
      setIsExpanded(true)
    } catch (error) {
      console.error('AI suggestion error:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Có lỗi xảy ra khi tạo gợi ý. Vui lòng thử lại.'
      alert(errorMessage)
      // Nếu là lỗi 503 (service unavailable), hiển thị thông báo rõ ràng hơn
      if (error.response?.status === 503) {
        setSuggestions({
          summary: 'Tính năng AI chưa được cấu hình. Vui lòng liên hệ admin.',
          suggestions: [],
          count: 0
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  return (
    <div className="ai-suggestions">
      <div className="suggestions-card">
        <div className="suggestions-header" onClick={() => setIsExpanded(!isExpanded)}>
          <h2>✨ AI Gợi Ý Nhà Trọ</h2>
          <span className="toggle-icon">{isExpanded ? '▲' : '▼'}</span>
        </div>

        {isExpanded && (
          <div className="suggestions-content">
            <form onSubmit={handleSuggest}>
              <div className="suggestions-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Yêu cầu của bạn *</label>
                    <textarea
                      placeholder="Ví dụ: Phòng có điều hòa, wifi, gần trường..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Ngân sách (VNĐ/tháng)</label>
                    <input
                      type="number"
                      placeholder="2000000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Vị trí mong muốn</label>
                    <input
                      type="text"
                      placeholder="Quận 1, Quận 2..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Sở thích khác</label>
                    <input
                      type="text"
                      placeholder="Yên tĩnh, có ban công, gần chợ..."
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="suggest-btn" disabled={loading}>
                  {loading ? 'Đang phân tích...' : 'Nhận gợi ý từ AI'}
                </button>
              </div>
            </form>

            {suggestions && (
              <div className="suggestions-result">
                {suggestions.summary && (
                  <div className="summary">
                    <h3>📋 Tóm tắt</h3>
                    <p>{suggestions.summary}</p>
                  </div>
                )}

                {suggestions.suggestions && suggestions.suggestions.length > 0 && (
                  <div className="suggestions-list">
                    <h3>🎯 Các gợi ý phù hợp</h3>
                    {suggestions.suggestions.map((room, index) => (
                      <div key={room.id || index} className="suggestion-item">
                        <div className="suggestion-header">
                          <h4>{room.title}</h4>
                          {room.matchScore && (
                            <span className="match-score">
                              Độ phù hợp: {room.matchScore}/10
                            </span>
                          )}
                        </div>
                        {room.reason && (
                          <p className="suggestion-reason">💡 {room.reason}</p>
                        )}
                        <div className="suggestion-details">
                          <span>💰 {formatPrice(room.price)}đ/tháng</span>
                          <span>📍 {room.address}</span>
                          <span>📐 {room.area}m²</span>
                        </div>
                        <button
                          className="view-btn"
                          onClick={() => onSelectRoom(room)}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AISuggestions



