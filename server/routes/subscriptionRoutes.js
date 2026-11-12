import express from 'express';
import NotificationSubscription from '../models/NotificationSubscription.js';

const router = express.Router();

// Get active subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await NotificationSubscription.find({ active: true }).sort({ createdAt: -1 });
    res.json({ success: true, subscriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create / update subscription
router.post('/', async (req, res) => {
  try {
    const { subscriberName, subscriberEmail, subscriberPhone, categories, geographicFilter, channels } = req.body;

    const sub = new NotificationSubscription({
      subscriberName: subscriberName || 'Village Resident',
      subscriberEmail,
      subscriberPhone,
      categories: categories || ['All'],
      geographicFilter: geographicFilter || {
        state: 'Tamil Nadu',
        district: 'Villupuram',
        mandal: 'Vanur',
        village: 'Nesal'
      },
      channels: channels || { inApp: true, webPush: true }
    });

    await sub.save();
    res.status(201).json({ success: true, message: 'Notification subscription registered successfully', subscription: sub });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Toggle or remove subscription
router.delete('/:id', async (req, res) => {
  try {
    await NotificationSubscription.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Subscription removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
