import axios from 'axios';

// Centralized Axios Instance with Base URL support
const getBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';
  // Remove trailing slash for normalization
  envUrl = envUrl.trim().replace(/\/+$/, '');
  if (!envUrl.endsWith('/api')) {
    envUrl = `${envUrl}/api`;
  }
  return `${envUrl}/`;
};

const API = axios.create({
  baseURL: getBaseUrl(),
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