import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// 1. Centralized Axios Instance with Base Configurations
const API = axios.create({
  baseURL: isLocalhost 
    ? 'http://127.0.0.1:8000/api' 
    : 'https://your-django-app.onrender.com/api',
});

// 2. Outgoing Security Interceptor: Inject JWT token into headers automatically
API.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // If the current token is expired, clean out storage coordinates
      if (decoded.exp < currentTime) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return config;
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Token structural tracking validation fault:", error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. Centralized Ingestion & History Endpoints (CRUCIAL: Added this back!)
export const scannerService = {
  upload: (formData) => API.post('/scanner/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getHistory: () => API.get('/scanner/history/'),
  getAdminStats: () => API.get('/scanner/admin/analytics/'),
  
  // Add this line
  getProfile: () => API.get('/auth/profile/'), 
};

// Export the default base API layout
export default API;