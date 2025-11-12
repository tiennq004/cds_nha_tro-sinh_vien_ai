import { useState } from 'react'
import './SearchSection.css'

function SearchSection({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    minPrice: '',
    maxPrice: '',
    address: '',
    minArea: '',
    maxArea: '',
    utilities: ''
  })
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Lọc các trường rỗng
    const params = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== '')
    )
    if (onSearch) {
      onSearch(params)
    }
  }

  const handleReset = () => {
    setSearchParams({
      keyword: '',
      minPrice: '',
      maxPrice: '',
      address: '',
      minArea: '',
      maxArea: '',
      utilities: ''
    })
    setUserLocation(null)
    setLocationError('')
    if (onSearch) {
      onSearch({})
    }
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Trình duyệt của bạn không hỗ trợ định vị')
      return
    }

    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })
        // Có thể thêm logic tìm kiếm phòng gần đây ở đây
        setLocationError('')
      },
      (error) => {
        setLocationError('Không thể lấy vị trí: ' + error.message)
      }
    )
  }

  return (
    <div className="search-section">
      <div className="search-card">
        <h2>🔍 Tìm kiếm nhà trọ</h2>
        <form onSubmit={handleSubmit}>
          <div className="search-grid">
            <div className="search-field">
              <label htmlFor="keyword">Từ khóa</label>
              <input
                type="text"
                id="keyword"
                name="keyword"
                value={searchParams.keyword}
                onChange={handleChange}
                placeholder="Nhập từ khóa tìm kiếm..."
              />
            </div>

            <div className="search-field">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={searchParams.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ..."
              />
            </div>

            <div className="search-field">
              <label htmlFor="minPrice">Giá tối thiểu (VNĐ/tháng)</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={searchParams.minPrice}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="search-field">
              <label htmlFor="maxPrice">Giá tối đa (VNĐ/tháng)</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={searchParams.maxPrice}
                onChange={handleChange}
                placeholder="Không giới hạn"
                min="0"
              />
            </div>

            <div className="search-field">
              <label htmlFor="minArea">Diện tích tối thiểu (m²)</label>
              <input
                type="number"
                id="minArea"
                name="minArea"
                value={searchParams.minArea}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="search-field">
              <label htmlFor="maxArea">Diện tích tối đa (m²)</label>
              <input
                type="number"
                id="maxArea"
                name="maxArea"
                value={searchParams.maxArea}
                onChange={handleChange}
                placeholder="Không giới hạn"
                min="0"
              />
            </div>

            <div className="search-field">
              <label htmlFor="utilities">Tiện ích (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                id="utilities"
                name="utilities"
                value={searchParams.utilities}
                onChange={handleChange}
                placeholder="VD: Điều hòa, Wifi, Tủ lạnh"
              />
            </div>
          </div>

          <div className="location-search">
            <button
              type="button"
              className="location-btn"
              onClick={handleGetLocation}
            >
              📍 Lấy vị trí hiện tại
            </button>
            {userLocation && (
              <span className="location-status">
                ✅ Đã lấy vị trí: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              </span>
            )}
            {locationError && (
              <span className="location-status" style={{ color: '#c62828' }}>
                ❌ {locationError}
              </span>
            )}
          </div>

          <div className="search-actions">
            <button type="button" className="btn-secondary" onClick={handleReset}>
              🔄 Đặt lại
            </button>
            <button type="submit" className="btn-primary">
              🔍 Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SearchSection
