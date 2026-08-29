import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import updateRoutes from './routes/updateRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import complianceRoutes from './routes/complianceRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB, getDB } from './config/db.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the server folder
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔍 Checking .env file...');
console.log('📁 Current directory:', process.cwd());
console.log('📁 __dirname:', __dirname);
console.log('🔑 MONGODB_URI exists?', process.env.MONGODB_URI ? '✅ YES' : '❌ NO');
console.log('🔑 JWT_SECRET exists?', process.env.JWT_SECRET ? '✅ YES' : '❌ NO');

const app = express();

await connectDB();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', async (req, res) => {
  const db = getDB();

  const dbCompatibility = (await import('./config/db.js')).default;
    
    const campaignsCount = await dbCompatibility.count('campaigns');
    const usersCount = await dbCompatibility.count('users');
    const donationsCount = await dbCompatibility.count('donations');
    
  res.json({
    status: 'ok',
    message: 'Charity & Donation Management Platform API is running',
    timestamp: new Date().toISOString(),
    stats: {
      campaignsCount,
      usersCount,
      donationsCount
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/compliance', complianceRoutes);

// Fallback 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Charity Platform API Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});