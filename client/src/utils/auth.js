export const getAuthToken = () => {
  return localStorage.getItem('token')
}

export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null
    }
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Error parsing user from localStorage:', error)
    // Clear invalid data
    localStorage.removeItem('user')
    return null
  }
}

export const setAuth = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const isAuthenticated = () => {
  return !!getAuthToken()
}

export const isLandlord = () => {
  const user = getUser()
  return user && user.role === 'landlord'
}

export const isRenter = () => {
  const user = getUser()
  return user && user.role === 'renter'
}

export const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  }
}

