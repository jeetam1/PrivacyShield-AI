import axios from 'axios';

// Centralized Axios Instance with Base URL support
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
  timeout: 60000, // 60s timeout for large PDF parsing
});

export const scannerService = {
  // Health check
  getHealth: () => API.get('scanner/health/'),

  // PDF Masking & Redaction
  maskPdf: (formData) => API.post('scanner/mask-pdf/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Raw Text Masking
  maskText: (payload) => API.post('scanner/mask-text/', payload, {
    headers: { 'Content-Type': 'application/json' },
  }),
};

export default API;