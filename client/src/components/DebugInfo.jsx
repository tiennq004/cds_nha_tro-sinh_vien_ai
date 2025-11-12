import { useEffect, useState } from 'react'
import axios from 'axios'

function DebugInfo() {
  const [serverStatus, setServerStatus] = useState('checking')
  const [dbStatus, setDbStatus] = useState('unknown')

  useEffect(() => {
    // Check server health
    axios.get('/api/health')
      .then(response => {
        setServerStatus('online')
        setDbStatus(response.data.database || 'unknown')
      })
      .catch(error => {
        setServerStatus('offline')
        console.error('Server health check failed:', error)
      })
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '0.75rem',
      borderRadius: '8px',
      fontSize: '0.85rem',
      zIndex: 9999,
      minWidth: '200px'
    }}>
      <div><strong>Server:</strong> {serverStatus === 'online' ? '✅ Online' : '❌ Offline'}</div>
      <div><strong>Database:</strong> {dbStatus === 'connected' ? '✅ Connected' : '❌ Disconnected'}</div>
      <div><strong>Env:</strong> {process.env.NODE_ENV}</div>
    </div>
  )
}

export default DebugInfo






