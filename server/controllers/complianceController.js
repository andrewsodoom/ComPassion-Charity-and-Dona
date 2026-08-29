import { submitCharityVerificationToExternalSystem } from '../services/complianceService.js';

export const submitComplianceReview = async (req, res) => {
  try {
    const payload = req.body || {};
    const result = await submitCharityVerificationToExternalSystem(payload);

    if (result.success === false && result.status === 'rejected') {
      return res.status(400).json({ success: false, ...result });
    }

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Compliance submission failed',
      error: error.message
    });
  }
};

export default {
  submitComplianceReview
};
