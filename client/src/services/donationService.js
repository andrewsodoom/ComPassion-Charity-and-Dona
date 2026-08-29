import api from './api.js';

export const donationService = {
  processDonation: (donationData) => api.post('/donations/process', donationData),
  getReceiptById: (receiptId) => api.get(`/donations/receipt/${receiptId}`),
  getUserDonations: () => api.get('/donations/my-donations'),
  getOrganizationDonations: () => api.get('/donations/organization/history')
};

export default donationService;
