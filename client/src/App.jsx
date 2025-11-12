import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import SearchSection from './components/SearchSection'
import RoomList from './components/RoomList'
import Chatbot from './components/Chatbot'
import AISuggestions from './components/AISuggestions'
import Auth from './components/Auth'
import RoomMap from './components/RoomMap'
import RoomComparison from './components/RoomComparison'
import ProfilePage from './components/ProfilePage'
import RoomManagement from './components/RoomManagement'
import MessagesPage from './components/MessagesPage'
import DebugInfo from './components/DebugInfo'
import axios from 'axios'
import { getUser, isAuthenticated, getAuthHeaders, clearAuth } from './utils/auth'

function App() {
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showChatbot, setShowChatbot] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(getUser())
  const [searchParams, setSearchParams] = useState({})
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonRooms, setComparisonRooms] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const [showRoomManagement, setShowRoomManagement] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [initialMessageUserId, setInitialMessageUserId] = useState(null)

  useEffect(() => {
    console.log('App component mounted')
    fetchRooms()
    // Check if user is still logged in
    const currentUser = getUser()
    if (currentUser) {
      setUser(currentUser)
      console.log('User logged in:', currentUser)
    }
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      console.log('Fetching rooms from API...')
      const response = await axios.get('/api/rooms')
      console.log('API Response:', response.data)
      const roomsData = response.data.rooms || response.data || []
      console.log('Rooms data:', roomsData)
      setRooms(roomsData)
      setFilteredRooms(roomsData)
      setLoading(false)
      
      if (roomsData.length === 0) {
        console.warn('No rooms found in database')
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      // Hiển thị thông báo lỗi cho người dùng
      if (error.response?.status === 500) {
        console.error('Server error:', error.response.data)
      } else if (error.response?.status === 404) {
        console.warn('API endpoint not found')
      } else if (!error.response) {
        console.error('Network error - Server may not be running')
        alert('Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.')
      }
      
      setRooms([])
      setFilteredRooms([])
      setLoading(false)
    }
  }

  const handleSearch = async (params) => {
    setSearchParams(params)
    try {
      const queryString = new URLSearchParams(params).toString()
      const response = await axios.get(`/api/search?${queryString}`)
      setFilteredRooms(response.data.rooms || [])
    } catch (error) {
      console.error('Error searching rooms:', error)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setShowAuth(false)
    // Update user in localStorage
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleUpdateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    setFilteredRooms(rooms)
  }

  const handleRoomSelect = (room) => {
    setSelectedRoom(room)
  }

  const handleAddToComparison = (room) => {
    if (!comparisonRooms.find(r => r.id === room.id)) {
      if (comparisonRooms.length < 5) {
        setComparisonRooms([...comparisonRooms, room])
      } else {
        alert('Bạn chỉ có thể so sánh tối đa 5 phòng')
      }
    }
  }

  // Debug info
  console.log('App render:', {
    rooms: rooms.length,
    filteredRooms: filteredRooms.length,
    loading,
    user: user ? user.username : 'Not logged in'
  })

  return (
    <div className="app">
      <Header 
        onToggleChatbot={() => setShowChatbot(!showChatbot)} 
        user={user}
        onLogin={() => setShowAuth(true)}
        onLogout={handleLogout}
        onShowProfile={() => setShowProfile(true)}
        onShowRoomManagement={() => setShowRoomManagement(true)}
        onShowMessages={() => setShowMessages(true)}
      />
      
      <div className="main-content">
        <div className="container">
          <div className="hero-section">
            <h1>Tìm Nhà Trọ Sinh Viên</h1>
            <p>Ứng dụng tìm kiếm nhà trọ thông minh với AI gợi ý</p>
          </div>
          
          {/* Debug info - chỉ hiển thị trong development */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              <strong>Debug Info:</strong> Rooms: {rooms.length}, Filtered: {filteredRooms.length}, Loading: {loading ? 'Yes' : 'No'}
            </div>
          )}

          <AISuggestions onSelectRoom={(room) => {
            setFilteredRooms([room])
            setSelectedRoom(room)
          }} />

          <SearchSection onSearch={handleSearch} />

          <div className="map-toggle-section">
            <button 
              className="map-toggle-btn"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? '📋 Ẩn bản đồ' : '🗺️ Hiển thị bản đồ'}
            </button>
          </div>

          {showMap && filteredRooms.length > 0 && (
            <RoomMap 
              rooms={filteredRooms} 
              selectedRoom={selectedRoom}
              onRoomSelect={handleRoomSelect}
            />
          )}

          <div className="comparison-actions">
            {comparisonRooms.length > 0 && (
              <button 
                className="comparison-btn"
                onClick={() => setShowComparison(true)}
              >
                🔍 So sánh ({comparisonRooms.length})
              </button>
            )}
          </div>

          <RoomList 
            rooms={filteredRooms} 
            loading={loading}
            onRoomSelect={handleRoomSelect}
            onAddToComparison={handleAddToComparison}
            comparisonRooms={comparisonRooms}
            currentUserId={user?.id}
            onMessageLandlord={(landlordId, room) => {
              if (!isAuthenticated()) {
                alert('Bạn cần đăng nhập để nhắn tin với chủ trọ')
                setShowAuth(true)
                return
              }
              if (user?.id === landlordId) {
                alert('Bạn không thể nhắn tin với chính mình.')
                return
              }
              setInitialMessageUserId(landlordId)
              setShowMessages(true)
            }}
          />
        </div>
      </div>

      {showChatbot && (
        <Chatbot onClose={() => setShowChatbot(false)} />
      )}

      {!showChatbot && (
        <button 
          className="chatbot-toggle"
          onClick={() => setShowChatbot(true)}
          title="Mở chatbot"
        >
          💬
        </button>
      )}

      {showAuth && (
        <Auth 
          onLogin={handleLogin}
          onClose={() => setShowAuth(false)}
        />
      )}

      {showComparison && (
        <RoomComparison 
          rooms={comparisonRooms}
          onClose={() => setShowComparison(false)}
        />
      )}

      {showProfile && isAuthenticated() && (
        <ProfilePage
          user={user}
          onClose={() => setShowProfile(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {showRoomManagement && isAuthenticated() && user?.role === 'landlord' && (
        <RoomManagement
          onClose={() => setShowRoomManagement(false)}
        />
      )}

      {showMessages && isAuthenticated() && (
        <MessagesPage
          onClose={() => {
            setShowMessages(false)
            setInitialMessageUserId(null)
          }}
          initialUserId={initialMessageUserId}
        />
      )}
      
      <DebugInfo />
    </div>
  )
}

export default App
