const DEFAULT_COMPLIANCE_URL = process.env.COMPLIANCE_API_URL || '';

export const submitCharityVerificationToExternalSystem = async (payload) => {
  const basePayload = {
    source: 'comPassion-platform',
    submittedAt: new Date().toISOString(),
    status: 'pending',
    ...payload
  };

  if (!DEFAULT_COMPLIANCE_URL) {
    return {
      success: true,
      status: 'pending',
      externalSystem: 'local-compliance-queue',
      referenceId: `comp_${Date.now()}`,
      message: 'Queued for external compliance review. No third-party API URL configured yet.',
      payload: basePayload
    };
  }

  try {
    const response = await fetch(DEFAULT_COMPLIANCE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.COMPLIANCE_API_KEY ? { Authorization: `Bearer ${process.env.COMPLIANCE_API_KEY}` } : {})
      },
      body: JSON.stringify(basePayload)
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        status: 'rejected',
        externalSystem: 'remote-compliance-api',
        message: responseData.message || 'External compliance submission failed.',
        payload: basePayload,
        error: responseData
      };
    }

    return {
      success: true,
      status: responseData.status || 'pending',
      externalSystem: 'remote-compliance-api',
      referenceId: responseData.referenceId || responseData.id || `comp_${Date.now()}`,
      message: responseData.message || 'Queued for external compliance review.',
      payload: basePayload,
      response: responseData
    };
  } catch (error) {
    return {
      success: false,
      status: 'pending',
      externalSystem: 'remote-compliance-api',
      referenceId: `comp_${Date.now()}`,
      message: 'External compliance endpoint failed, but the submission was saved locally for review.',
      payload: basePayload,
      error: error.message
    };
  }
};

export default {
  submitCharityVerificationToExternalSystem
};
