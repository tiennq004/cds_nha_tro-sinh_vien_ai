import { useState, useEffect, useRef } from 'react'
import './Header.css'

function Header({ 
  onToggleChatbot, 
  user, 
  onLogin, 
  onLogout, 
  onShowProfile,
  onShowRoomManagement,
  onShowMessages
}) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">🏠 Nhà Trọ Sinh Viên</h1>
          
          <nav className="nav">
            {!user ? (
              <>
                <button 
                  className="auth-btn" 
                  onClick={onLogin}
                >
                  Đăng nhập
                </button>
                <button 
                  className="chatbot-btn" 
                  onClick={onToggleChatbot}
                >
                  💬 Chatbot
                </button>
              </>
            ) : (
              <>
                <button 
                  className="chatbot-btn" 
                  onClick={onToggleChatbot}
                >
                  💬 Chatbot
                </button>
                
                <div className="user-menu-container" ref={menuRef}>
                  <button 
                    className="user-menu-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    👤 {user.username || user.full_name || 'User'}
                    {showUserMenu ? ' ▲' : ' ▼'}
                  </button>
                  
                  {showUserMenu && (
                    <div className="user-menu">
                      <button 
                        className="user-menu-item"
                        onClick={() => {
                          onShowProfile()
                          setShowUserMenu(false)
                        }}
                      >
                        👤 Hồ sơ
                      </button>
                      
                      {user.role === 'landlord' && (
                        <button 
                          className="user-menu-item"
                          onClick={() => {
                            onShowRoomManagement()
                            setShowUserMenu(false)
                          }}
                        >
                          🏠 Quản lý phòng
                        </button>
                      )}
                      
                      <button 
                        className="user-menu-item"
                        onClick={() => {
                          onShowMessages()
                          setShowUserMenu(false)
                        }}
                      >
                        💬 Tin nhắn
                      </button>
                      
                      <button 
                        className="user-menu-item"
                        onClick={() => {
                          onLogout()
                          setShowUserMenu(false)
                        }}
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
