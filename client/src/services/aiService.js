import api from './api.js';

export const aiService = {
  generateStory: (data) => api.post('/ai/story', data),
  generateSummary: (data) => api.post('/ai/summary', data),
  estimateImpact: (data) => api.post('/ai/impact', data)
};

export default aiService;
