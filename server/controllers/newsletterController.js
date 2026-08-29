import { getDB } from '../config/db.js';

export const subscribe = async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
  }

  try {
    const subscribers = getDB().collection('newsletterSubscribers');
    await subscribers.createIndex({ email: 1 }, { unique: true });

    await subscribers.updateOne(
      { email },
      { $setOnInsert: { email, subscribedAt: new Date().toISOString() } },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'You are subscribed to impact updates.'
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ success: true, message: 'This email is already subscribed.' });
    }

    console.error('Newsletter subscription failed:', err);
    res.status(500).json({ success: false, message: 'Unable to subscribe right now' });
  }
};
