import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API helper methods
export const apiMethods = {
  // Auth
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  googleLogin: (data: any) => api.post('/auth/google', data),
  
  // User
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.patch('/users/profile', data),
  
  // Location
  saveLocation: (data: any) => api.post('/locations', data),
  getLocation: () => api.get('/locations'),
  
  // Incidents
  getIncidents: () => api.get('/incidents'),
  reportIncident: (data: any) => api.post('/incidents', data),
  getIncident: (id: string) => api.get(`/incidents/${id}`),
  
  // Admin
  getAdminStats: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getAppConfig: () => api.get('/admin/config'),
  updateAppConfig: (data: any) => api.patch('/admin/config', data),
  
  // AI
  askAI: (message: string) => api.post('/ai/ask', { message }),
};

export default api;
