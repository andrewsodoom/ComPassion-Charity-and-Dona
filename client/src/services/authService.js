import api from './api.js';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  requestPasswordReset: (emailData) => api.post('/auth/forgot-password', emailData),
  resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  submitVerification: (docsData) => api.post('/auth/verify-documents', docsData)
};

export default authService;
