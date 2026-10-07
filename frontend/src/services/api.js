// API service client
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000;

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT,
});

// Add token to headers if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getMe: () => apiClient.get('/auth/me'),
};

// Classes endpoints
export const classesService = {
  getAll: () => apiClient.get('/classes'),
  getById: (classId) => apiClient.get(`/classes/${classId}`),
};

// Students endpoints
export const studentsService = {
  updateStatus: (studentId, classId, status, notes) =>
    apiClient.put(`/students/${studentId}/status`, { classId, status, notes }),
  getById: (studentId) => apiClient.get(`/students/${studentId}`),
};

export default apiClient;
