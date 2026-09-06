import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second request timeout
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('df360_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global Response Interceptor for Centralized Error Handling & Toast Notifications
api.interceptors.response.use(
  (response) => {
    // If API returns a success message explicitly, show subtle success toast if needed
    return response;
  },
  (error) => {
    if (!error.response) {
      // Network Error / Server Offline
      const offlineMsg = 'Server unreachable. Please check your connection or start backend server.';
      toast.error(offlineMsg, { id: 'network-error', duration: 4000 });
      return Promise.reject(new Error(offlineMsg));
    }

    const { status, data } = error.response;
    const serverMessage = data?.message || 'An unexpected error occurred';

    switch (status) {
      case 400:
        toast.error(`Validation Error: ${serverMessage}`, { id: 'bad-request' });
        break;
      case 401:
        if (localStorage.getItem('df360_token')) {
          toast.error('Session expired. Please log in again.', { id: 'auth-expired' });
          localStorage.removeItem('df360_token');
        }
        break;
      case 403:
        toast.error(`Forbidden: ${serverMessage}`, { id: 'forbidden' });
        break;
      case 404:
        toast.error(`Not Found: ${serverMessage}`, { id: 'not-found' });
        break;
      case 422:
        toast.error(`Unprocessable Entity: ${serverMessage}`, { id: 'validation' });
        break;
      case 500:
      default:
        toast.error(`Server Error (${status}): ${serverMessage}`, { id: 'server-error' });
        break;
    }

    return Promise.reject(new Error(serverMessage));
  }
);

export default api;
