import { useState, useEffect } from 'react'
import axios from 'axios'
import { getAuthHeaders } from '../utils/auth'
import './ProfilePage.css'

function ProfilePage({ user, onClose, onUpdateUser }) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    username: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [changePassword, setChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/api/profile', {
        headers: getAuthHeaders()
      })
      const userData = response.data.user
      setFormData({
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        email: userData.email || '',
        username: userData.username || ''
      })
      if (onUpdateUser) {
        onUpdateUser(userData)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      if (error.response?.status === 401) {
        setError('Bạn cần đăng nhập để xem thông tin cá nhân')
      } else {
        setError(error.response?.data?.error || 'Không thể tải thông tin cá nhân')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.put('/api/profile', formData, {
        headers: getAuthHeaders()
      })
      setSuccess('Cập nhật thông tin thành công!')
      fetchProfile()
    } catch (error) {
      setError(error.response?.data?.error || 'Có lỗi xảy ra khi cập nhật')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp')
      setLoading(false)
      return
    }

    if (passwordData.new_password.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự')
      setLoading(false)
      return
    }

    try {
      await axios.put('/api/profile/password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      }, {
        headers: getAuthHeaders()
      })
      setSuccess('Đổi mật khẩu thành công!')
      setChangePassword(false)
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    } catch (error) {
      setError(error.response?.data?.error || 'Có lỗi xảy ra khi đổi mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Thông tin cá nhân</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="profile-content">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                disabled
                className="disabled-input"
              />
              <small>Username không thể thay đổi</small>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="disabled-input"
              />
              <small>Email không thể thay đổi</small>
            </div>

            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </button>
          </form>

          <div className="password-section">
            <h3>Đổi mật khẩu</h3>
            {!changePassword ? (
              <button
                className="btn-secondary"
                onClick={() => setChangePassword(true)}
              >
                Đổi mật khẩu
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="password-form">
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setChangePassword(false)
                      setPasswordData({
                        current_password: '',
                        new_password: '',
                        confirm_password: ''
                      })
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
