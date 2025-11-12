import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { getAuthHeaders, getUser } from '../utils/auth'
import './MessagesPage.css'

function MessagesPage({ onClose, initialUserId = null }) {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const currentUser = getUser()

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (initialUserId) {
      if (conversations.length > 0) {
        // Tìm conversation với initialUserId
        const conversation = conversations.find(conv => conv.other_user_id === initialUserId)
        if (conversation) {
          setSelectedConversation(conversation)
        } else {
          // Nếu chưa có conversation, lấy thông tin user từ API
          fetchUserInfo(initialUserId)
        }
      } else if (!loading) {
        // Nếu đã load xong conversations và không có conversation nào, lấy thông tin user
        fetchUserInfo(initialUserId)
      }
    }
  }, [initialUserId, conversations, loading])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.other_user_id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/messages/conversations', {
        headers: getAuthHeaders()
      })
      const conversationsData = response.data.conversations || []
      setConversations(conversationsData)
      
      if (conversationsData.length === 0) {
        console.log('No conversations found')
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      if (error.response?.status === 401) {
        alert('Bạn cần đăng nhập để xem tin nhắn')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUserInfo = async (userId) => {
    try {
      // Lấy thông tin user từ API
      const response = await axios.get(`/api/users/${userId}`, {
        headers: getAuthHeaders()
      })
      const user = response.data.user
      
      // Tạo conversation object với thông tin user
      const conversation = {
        other_user_id: userId,
        other_username: user.username,
        other_full_name: user.full_name || user.username,
        other_avatar: user.avatar,
        last_message: '',
        last_message_time: new Date(),
        unread_count: 0
      }
      setSelectedConversation(conversation)
      setMessages([])
    } catch (error) {
      console.error('Error fetching user info:', error)
      // Nếu không lấy được thông tin, vẫn tạo conversation object với ID
      const conversation = {
        other_user_id: userId,
        other_username: 'Người dùng',
        other_full_name: 'Người dùng',
        other_avatar: null,
        last_message: '',
        last_message_time: new Date(),
        unread_count: 0
      }
      setSelectedConversation(conversation)
      setMessages([])
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`/api/messages/conversation/${userId}`, {
        headers: getAuthHeaders()
      })
      setMessages(response.data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      // Nếu chưa có tin nhắn, trả về mảng rỗng
      if (error.response?.status === 404) {
        setMessages([])
      }
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation || sending) return

    const text = messageText.trim()
    setMessageText('')
    setSending(true)

    try {
      await axios.post('/api/messages', {
        receiver_id: selectedConversation.other_user_id,
        message: text
      }, {
        headers: getAuthHeaders()
      })
      
      // Refresh messages
      fetchMessages(selectedConversation.other_user_id)
      // Refresh conversations to update last message
      fetchConversations()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Vừa xong'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`
    return date.toLocaleDateString('vi-VN')
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-header">
          <h2>Tin nhắn</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="messages-content">
          <div className="conversations-list">
            <h3>Cuộc trò chuyện</h3>
            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : conversations.length === 0 && !selectedConversation ? (
              <div className="empty-state">
                <p>Bạn chưa có cuộc trò chuyện nào</p>
              </div>
            ) : (
              <div className="conversations">
                {conversations.map((conv) => (
                  <div
                    key={conv.other_user_id}
                    className={`conversation-item ${selectedConversation?.other_user_id === conv.other_user_id ? 'active' : ''}`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="conversation-avatar">
                      {conv.other_avatar ? (
                        <img src={conv.other_avatar} alt={conv.other_username} />
                      ) : (
                        <div className="avatar-placeholder">
                          {conv.other_username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <h4>{conv.other_full_name || conv.other_username}</h4>
                        {conv.unread_count > 0 && (
                          <span className="unread-badge">{conv.unread_count}</span>
                        )}
                      </div>
                      <p className="last-message">{conv.last_message}</p>
                      <span className="last-message-time">{formatTime(conv.last_message_time)}</span>
                    </div>
                  </div>
                ))}
                {/* Hiển thị conversation được tạo từ initialUserId nếu chưa có trong list */}
                {selectedConversation && !conversations.find(conv => conv.other_user_id === selectedConversation.other_user_id) && (
                  <div
                    className="conversation-item active"
                    onClick={() => setSelectedConversation(selectedConversation)}
                  >
                    <div className="conversation-avatar">
                      {selectedConversation.other_avatar ? (
                        <img src={selectedConversation.other_avatar} alt={selectedConversation.other_username} />
                      ) : (
                        <div className="avatar-placeholder">
                          {selectedConversation.other_username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <h4>{selectedConversation.other_full_name || selectedConversation.other_username}</h4>
                      </div>
                      <p className="last-message">Chưa có tin nhắn</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="messages-panel">
            {selectedConversation ? (
              <>
                <div className="messages-header-panel">
                  <h3>{selectedConversation.other_full_name || selectedConversation.other_username}</h3>
                </div>

                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div className="empty-messages">
                      <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.sender_id === currentUser?.id
                      return (
                        <div
                          key={message.id}
                          className={`message-item ${isOwn ? 'own-message' : 'other-message'}`}
                        >
                          <div className="message-content">
                            <p>{message.message}</p>
                            <span className="message-time">{formatTime(message.created_at)}</span>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className="message-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="message-input"
                    placeholder="Nhập tin nhắn..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="send-btn"
                    disabled={sending || !messageText.trim()}
                  >
                    Gửi
                  </button>
                </form>
              </>
            ) : (
              <div className="no-conversation">
                <p>Chọn một cuộc trò chuyện để xem tin nhắn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
