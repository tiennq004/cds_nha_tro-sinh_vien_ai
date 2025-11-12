import axios from 'axios';
import { getAuthToken } from './auth';

// Tạo axios instance với config mặc định
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor để thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và lỗi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Clear token và redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Có thể redirect đến trang login ở đây nếu cần
    }
    
    // Xử lý lỗi 403 (Forbidden)
    if (error.response?.status === 403) {
      console.error('Bạn không có quyền thực hiện hành động này');
    }
    
    // Xử lý lỗi 503 (Service Unavailable)
    if (error.response?.status === 503) {
      console.error('Dịch vụ tạm thời không khả dụng:', error.response.data.error);
    }
    
    return Promise.reject(error);
  }
);

export default api;

import { getAuthToken } from './auth';

// Tạo axios instance với config mặc định
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor để thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và lỗi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Clear token và redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Có thể redirect đến trang login ở đây nếu cần
    }
    
    // Xử lý lỗi 403 (Forbidden)
    if (error.response?.status === 403) {
      console.error('Bạn không có quyền thực hiện hành động này');
    }
    
    // Xử lý lỗi 503 (Service Unavailable)
    if (error.response?.status === 503) {
      console.error('Dịch vụ tạm thời không khả dụng:', error.response.data.error);
    }
    
    return Promise.reject(error);
  }
);

export default api;













