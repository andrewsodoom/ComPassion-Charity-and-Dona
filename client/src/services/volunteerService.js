import api from './api.js';

export const volunteerService = {
  getOpportunities: (params = {}) => api.get('/volunteers/opportunities', params),
  createOpportunity: (data) => api.post('/volunteers/opportunities', data),
  applyForOpportunity: (applicationData) => api.post('/volunteers/apply', applicationData),
  getOrganizationApplications: () => api.get('/volunteers/applications/organization'),
  getUserApplications: () => api.get('/volunteers/applications/my'),
  updateApplicationStatus: (id, status) => api.put(`/volunteers/applications/${id}/status`, { status })
};

export default volunteerService;
