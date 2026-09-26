import axios from 'axios';

const getApiBaseUrl = () => {
  const runtimeUrl = typeof window !== 'undefined' ? (localStorage.getItem('VITE_API_URL') || localStorage.getItem('API_URL_OVERRIDE')) : null;
  const envUrl = runtimeUrl || import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return '/api';
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach dynamic baseURL and JWT token to requests
api.interceptors.request.use((config) => {
  const dynamicBaseUrl = getApiBaseUrl();
  if (dynamicBaseUrl && dynamicBaseUrl !== '/api') {
    config.baseURL = dynamicBaseUrl;
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Global response interceptor for token expiry and status code handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    if (error.response && error.response.status === 405) {
      return Promise.reject(new Error(
        'Backend connection error (405 Method Not Allowed). Please set VITE_API_URL in your Vercel Project Environment Variables to your live Render backend URL (e.g., https://your-backend.onrender.com/api).'
      ));
    }

    const errMsg = error.response?.data?.message || 
      (typeof error.response?.data === 'string' ? error.response.data : null) || 
      (error.message === 'Network Error' || error.code === 'ERR_BAD_RESPONSE' ? 'Cannot connect to backend server. Make sure your Render backend is running.' : error.message) || 
      'An unexpected error occurred';
    return Promise.reject(new Error(errMsg));
  }
);

export default api;
