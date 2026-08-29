import api from './api.js';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getVerifications: () => api.get('/admin/verifications'),
  reviewVerification: (userId, data) => api.put(`/admin/verifications/${userId}`, data),
  getUsers: (params = {}) => api.get('/admin/users', params),
  getAnalytics: () => api.get('/admin/analytics')
};

export default adminService;
