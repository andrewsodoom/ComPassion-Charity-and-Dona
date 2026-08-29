import api from './api.js';

export const campaignService = {
  getCampaigns: (params = {}) => api.get('/campaigns', params),
  getCampaignById: (id) => api.get(`/campaigns/${id}`),
  createCampaign: (campaignData) => api.post('/campaigns', campaignData),
  updateCampaign: (id, campaignData) => api.put(`/campaigns/${id}`, campaignData),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),
  getOrganizationCampaigns: () => api.get('/campaigns/organization/my-campaigns'),
  
  // Updates
  getUpdates: (campaignId) => api.get(`/updates/campaign/${campaignId}`),
  postUpdate: (updateData) => api.post('/updates', updateData)
};

export default campaignService;
