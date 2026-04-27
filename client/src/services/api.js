import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  withCredentials: false,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('libero_user') || '{}');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Auto-logout on token expiration
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('libero_user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
