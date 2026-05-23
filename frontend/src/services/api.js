import axios from 'axios';

const API = axios.create({
baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to attach the JWT access token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const scannerService = {
  upload: (formData) => API.post('scanner/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getHistory: () => API.get('scanner/history/'),
  getAdminStats: () => API.get('scanner/admin/analytics/'),
};

export default API;