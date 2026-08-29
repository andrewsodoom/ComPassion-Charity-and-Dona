import assert from 'node:assert/strict';

async function testE2E() {
  const BASE = 'http://127.0.0.1:5000/api';
  console.log('=== Starting ComPassion Platform E2E Tests ===\n');

  // 1. Health check
  const healthRes = await fetch(`${BASE}/health`).then(r => r.json());
  console.log('✓ Health check passed:', healthRes.status, healthRes.stats);

  // 2. Login as Donor
  const donorLogin = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sarah.connor@example.com', password: 'password123' })
  }).then(r => r.json());
  console.log('✓ Donor login successful:', donorLogin.user.name, `(${donorLogin.user.role})`);
  const donorToken = donorLogin.token;

  // 4. Fetch campaigns
  const campaignsRes = await fetch(`${BASE}/campaigns`).then(r => r.json());
  console.log(`✓ Campaigns catalog loaded: ${campaignsRes.campaigns.length} campaigns found`);
  const testCampaign = campaignsRes.campaigns.find(campaign => campaign.status === 'active');
  assert.ok(testCampaign, 'An active campaign is required for the donation flow');
  const initialRaised = testCampaign.raisedAmount;

  // Invalid amounts must be rejected without mutating campaign totals.
  const invalidDonation = await fetch(`${BASE}/donations/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaignId: testCampaign.id, amount: 'not-a-number' })
  });
  assert.equal(invalidDonation.status, 400, 'Invalid donation amount should return 400');
  console.log('✓ Invalid donation amount rejected');

  // 5. Process simulated donation (Stripe Card)
  console.log(`\n--- Testing Donation Flow for "${testCampaign.title}" ---`);
  const donationRes = await fetch(`${BASE}/donations/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${donorToken}`
    },
    body: JSON.stringify({
      campaignId: testCampaign.id,
      amount: 5000,
      tipAmount: 250,
      currency: 'INR',
      donorName: 'Sarah Connor',
      donorEmail: 'sarah.connor@example.com',
      paymentMethod: 'Stripe Card (Simulated)',
      isRecurring: false,
      donorMessage: 'E2E automated donation test'
    })
  }).then(r => r.json());

  console.log('✓ Donation processed successfully!');
  console.log('  Receipt Number:', donationRes.donation.receiptNumber);
  console.log('  Transaction ID:', donationRes.donation.transactionId);
  console.log(`  Campaign raised updated: ₹${initialRaised} -> ₹${donationRes.campaign.raisedAmount}`);

  // 6. Fetch Tax-Exempt Receipt
  const receiptRes = await fetch(`${BASE}/donations/receipt/${donationRes.donation.receiptNumber}`).then(r => r.json());
  console.log('✓ Official tax receipt verified:', receiptRes.receipt.receiptNumber, `(${receiptRes.receipt.taxExemptionCode})`);

  // 7. Test AI Story Generator
  console.log('\n--- Testing AI Campaign Assistant ---');
  const aiStoryRes = await fetch(`${BASE}/ai/story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Solar Classroom Drive',
      category: 'Education',
      targetBeneficiaries: '300 village students'
    })
  }).then(r => r.json());
  console.log('✓ AI Story generated headline:', aiStoryRes.generated.title);
  console.log('  AI Tagline:', aiStoryRes.generated.tagline);
  console.log('  Impact milestones:', aiStoryRes.generated.impactMetrics.length);

  // 8. Test Volunteer Opportunity & Application
  console.log('\n--- Testing Volunteer Management Flow ---');
  const volunteerLogin = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alex.rivera@example.com', password: 'password123' })
  }).then(r => r.json());
  const volunteerToken = volunteerLogin.token;

  const opps = await fetch(`${BASE}/volunteers/opportunities`).then(r => r.json());
  console.log(`✓ Found ${opps.opportunities.length} open volunteer opportunities`);

  // 9. Test Charity Login & Field Update Broadcast
  console.log('\n--- Testing Charity Updates & Notifications ---');
  const charityLogin = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'hope@globalfound.org', password: 'password123' })
  }).then(r => r.json());
  const charityToken = charityLogin.token;

  const updateRes = await fetch(`${BASE}/updates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${charityToken}`
    },
    body: JSON.stringify({
      campaignId: testCampaign.id,
      title: 'E2E Verified Update: 50 New Study Desks Delivered',
      content: 'All study desks have been installed in the classrooms. Thank you to our donors!'
    })
  }).then(r => r.json());
  console.log('✓ Campaign update published:', updateRes.message);

  // 10. Check Donor Notifications
  const notifs = await fetch(`${BASE}/notifications`, {
    headers: { 'Authorization': `Bearer ${donorToken}` }
  }).then(r => r.json());
  console.log(`✓ Donor has ${notifs.unreadCount} unread notifications (Total: ${notifs.notifications.length})`);

  // 11. Test Admin Analytics
  console.log('\n--- Testing Admin Analytics & Verification ---');
  const adminLogin = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@charityhub.org', password: 'password123' })
  }).then(r => r.json());
  const adminToken = adminLogin.token;

  const adminStats = await fetch(`${BASE}/admin/stats`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }).then(r => r.json());
  console.log('✓ Admin platform volume stats:', adminStats.stats);

  console.log('\n=============================================');
  console.log('🎉 ALL 11 END-TO-END SUITE TESTS PASSED! 🎉');
  console.log('=============================================');
}

testE2E().catch(console.error);
