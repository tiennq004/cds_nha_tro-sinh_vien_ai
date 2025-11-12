import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './Chatbot.css'

function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'Xin chào! Tôi là trợ lý AI chuyên tư vấn về nhà trọ. Bạn cần tôi giúp gì?'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const messageText = inputMessage.trim()
    const userMessage = {
      role: 'user',
      content: messageText
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      // Xây dựng conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : 'user',
        content: msg.content
      }))

      const response = await axios.post('/api/chatbot/chat', {
        message: messageText,
        conversationHistory
      })

      const botMessage = {
        role: 'bot',
        content: response.data.response
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chatbot error:', error)
      let errorContent = 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
      
      // Xử lý các loại lỗi khác nhau
      if (error.response?.status === 503) {
        errorContent = error.response.data.response || 'Tính năng chatbot tạm thời không khả dụng. Vui lòng liên hệ admin.'
      } else if (error.response?.data?.error) {
        errorContent = error.response.data.error
      }
      
      const errorMessage = {
        role: 'bot',
        content: errorContent
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-window">
        <div className="chatbot-header">
          <div className="chatbot-header-content">
            <span className="chatbot-title">🤖 Chatbot AI</span>
            <span className="chatbot-subtitle">Hỏi tôi về nhà trọ</span>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message bot-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-form" onSubmit={handleSend}>
          <input
            type="text"
            className="chatbot-input"
            placeholder="Nhập câu hỏi của bạn..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="chatbot-send-btn"
            disabled={loading || !inputMessage.trim()}
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chatbot



