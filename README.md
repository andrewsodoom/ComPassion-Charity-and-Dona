ComPassion Charity and Donation

A production-ready, full-stack Charity & Donation Management Web Application connecting generous donors with verified nonprofit organizations, volunteer opportunities, and transparent humanitarian campaigns worldwide.

---

Key Highlights & Features

1. Multi-Role Authentication
- **👤 Donor**: Discover causes, make one-time or monthly donations, download tax-deductible receipts, track personal lifetime giving.
- **🏢 Charity Organization**: Create and manage campaigns, craft stories with AI assistance, publish field progress reports with photos, recruit and approve volunteers.
- **🙋 Volunteer**: Browse upcoming community drives, apply with availability notes, track verified service hours, earn impact badges.
- **👑 Platform Administrator**: Review legal registration documents, grant official **✓ Verified Charity** badges, audit platform analytics.
- **🔐 Secure Password Reset**: No password recovery. Users request a reset token, receive a secure reset flow, and set a new password without exposing the old one.

2. Campaign Management & Discovery
- **Multifaceted Filters**: Filter by Category (Education 🎓, Healthcare 🏥, Food 🍲, Housing 🏠, Environment 🌱, Animals 🐾, Disaster Relief 🚨), Urgency, Funding Status, and Verified-only Nonprofits.
- **Automated Progress Meter**: Dynamic calculation of funds raised vs goal, donor count, and milestone badges (50% Halfway, 100% Fully Funded).
- **Matching Donor Pledges**: Highlighting 2X matching grants from corporate and philanthropic sponsors.

3. Interactive Payment Gateway Simulator
- **💳 Stripe Credit / Debit Card**: Interactive 3D credit card preview with real-time field formatting and 256-bit encryption simulation.
- **📱 Razorpay UPI & QR Code**: Scannable UPI QR code and virtual payment address verification.
- **🏛️ NetBanking**: Top bank options (HDFC, ICICI, SBI, Axis, Chase).
- **🅿️ PayPal Express**: 1-click sandbox checkout.
- **Dynamic FX Rates**: Multi-currency converter supporting **INR (₹)**, **USD ($)**, **EUR (€)**, and **GBP (£)** with live formatting.
- **Tipping & Dedication**: Optional platform support tip, dedicating gifts ("In Memory Of" / "In Honor Of"), and anonymous giving flags.
- **🌍 Country-Neutral Defaults**: The platform defaults to **Ghana** for organization registration and review setup, while still supporting country-specific compliance flows.

4. Tax-Exempt Donation Receipts & Compliance
- Automated serial-numbered receipts generated instantly upon payment confirmation.
- Includes organization registration details, donor identity, payment method, tax relief breakdown, authorized digital signature, and verification QR code.
- **1-Click Printable & PDF Export**: Clean print stylesheet formatted for tax filing.
- **External Compliance Pipeline**: Charity verification submissions can be queued locally or sent to a real external review API through `COMPLIANCE_API_URL` when configured.

5. Volunteer Recruitment & Management
- Charities post volunteer opportunities with date, time, location, skills needed, and spots quota.
- Volunteers apply with 1 click; charities review, approve, or decline applications.
- Automatic service hours calculation and verified digital certificate badge.

6. Campaign Updates & Community Notifications
- Charities publish real-world progress updates with field photos.
- Broadcast engine automatically dispatches in-app notifications to all donors who supported the campaign.
- Notification center with unread counters and direct links.

7. AI Campaign Story & Impact Generator
- **AI Story Writer**: Generates compelling, emotional fundraising narratives, suggested goal targets, and fund allocation splits based on a simple prompt.
- **AI Takeaways Generator**: Summarizes complex campaign stories into 3 concise bullet points for prospective donors.
- **AI Impact Calculator**: Calculates real-world impact equivalents (e.g. "$50 provides digital tablets for 2 students").

---

Project Structure

```
charity-platform/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── CategoryBadge.jsx
│   │   │   │   ├── VerifiedBadge.jsx
│   │   │   │   └── NotificationDropdown.jsx
│   │   │   ├── campaign/
│   │   │   │   ├── CampaignCard.jsx
│   │   │   │   ├── CampaignProgress.jsx
│   │   │   │   ├── CampaignFilter.jsx
│   │   │   │   ├── QRCodeModal.jsx
│   │   │   │   └── AICampaignHelperModal.jsx
│   │   │   ├── donation/
│   │   │   │   ├── DonationModal.jsx
│   │   │   │   ├── PaymentGatewayModal.jsx
│   │   │   │   ├── DonationSuccessModal.jsx
│   │   │   │   └── DonationReceipt.jsx
│   │   │   └── volunteer/
│   │   │       ├── VolunteerCard.jsx
│   │   │       └── VolunteerApplyModal.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CampaignsPage.jsx
│   │   │   ├── CampaignDetailPage.jsx
│   │   │   ├── VolunteersPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ReceiptPage.jsx
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── DonorDashboard.jsx
│   │   │   ├── CharityDashboard.jsx
│   │   │   ├── VolunteerDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CurrencyContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── campaignService.js
│   │   │   ├── donationService.js
│   │   │   ├── volunteerService.js
│   │   │   ├── adminService.js
│   │   │   ├── aiService.js
│   │   │   └── notificationService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js               # Self-contained, persistent JSON database engine
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── campaignController.js
│   │   ├── donationController.js
│   │   ├── volunteerController.js
│   │   ├── updateController.js
│   │   ├── notificationController.js
│   │   ├── adminController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication & role authorization
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── campaignRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── volunteerRoutes.js
│   │   ├── updateRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── adminRoutes.js
│   │   └── aiRoutes.js
│   ├── data/
│   │   └── seedData.js         # Realistic pre-seeded campaigns & users
│   ├── server.js
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md
```

---

Quick Start Guide

Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

1. Install All Dependencies
From the root project directory:
```bash
npm run install:all
```

Or install separately:
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

2. Configure Environment Variables
Copy the example environment file:
```bash
cd server
copy .env.example .env
```

Then update `.env` with your MongoDB Atlas URI and compliance settings:
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
COMPLIANCE_API_URL=https://your-provider.example.com/api/verification
COMPLIANCE_API_KEY=your_provider_key
```

3. Start API Server & Client Concurrently
From the root directory:
```bash
# Option A: Root script (requires concurrently)
npm run dev

# Option B: Run in two terminals
# Terminal 1: Backend API (Port 5001 by default)
cd server
npm start

# Terminal 2: Frontend App (Port 5173)
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

4. Compliance / Verification Flow
- A charity submits legal documents and registration details from the dashboard.
- The payload is sent to the external compliance provider when `COMPLIANCE_API_URL` is set.
- If no provider is configured, the system safely stores the submission in a local queue and marks it as pending for review.
- An admin can approve, reject, or keep a charity pending from the admin verification hub.

5. Password Reset Flow
- Users request a reset from the login screen.
- A secure token is generated and stored server-side.
- The token is used to set a new password without exposing or recovering the original password.

---

---

API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user / charity / volunteer | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `POST` | `/api/auth/forgot-password` | Request password reset token | No |
| `POST` | `/api/auth/reset-password` | Set a new password with the reset token | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Yes |
| `GET` | `/api/campaigns` | Explore campaigns with query filters | No |
| `GET` | `/api/campaigns/:id` | Get campaign story, updates, and donors | No |
| `POST` | `/api/campaigns` | Create new campaign | Charity / Admin |
| `POST` | `/api/donations/process` | Process simulated gift & generate receipt | Optional |
| `GET` | `/api/donations/receipt/:id` | Fetch official 80G / 501(c)(3) tax receipt | No |
| `GET` | `/api/volunteers/opportunities`| Browse open volunteer events | No |
| `POST` | `/api/volunteers/apply` | Apply for volunteer shift | Volunteer / Donor |
| `POST` | `/api/updates` | Post field progress report and notify donors | Charity / Admin |
| `POST` | `/api/ai/story` | AI storytelling generator | No |
| `GET` | `/api/admin/stats` | Platform KPIs & analytics | Admin |
| `PUT` | `/api/admin/verifications/:id`| Approve / reject charity verification | Admin |

---

License
MIT License. Built for Portfolio & Production Philanthropic Applications.
