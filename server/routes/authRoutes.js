import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Handles administrator and staff authentication
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const cleanInput = String(email).toLowerCase().trim();

    // Support shorthand 'admin' username as well as full email addresses
    let user = null;
    if (cleanInput === 'admin') {
      user = await User.findOne({ role: 'admin' });
    } else {
      user = await User.findOne({ email: cleanInput });
    }

    // Auto-provision default admin if database was cleared
    if (!user && (cleanInput === 'admin@ourvillage.tn.gov.in' || cleanInput === 'admin')) {
      user = await User.create({
        name: 'Villupuram District Administrator',
        email: 'admin@ourvillage.tn.gov.in',
        password: 'Admin@12345',
        role: 'admin',
        village: 'Nesal',
        mandal: 'Vanur',
        district: 'Villupuram',
        preferredLanguage: 'ta'
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator email or username. Default: admin@ourvillage.tn.gov.in'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Default: Admin@12345'
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'our_village_super_secure_jwt_secret_crawler_2026',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        village: user.village,
        district: user.district,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (err) {
    console.error(`[Auth Login Error]: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'our_village_super_secure_jwt_secret_crawler_2026');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
});

/**
 * POST /api/auth/reset-default-admin
 * Utility endpoint to ensure default credentials exist
 */
router.post('/reset-default-admin', async (req, res) => {
  try {
    let admin = await User.findOne({ email: 'admin@ourvillage.tn.gov.in' });
    if (!admin) {
      admin = new User({
        name: 'Villupuram District Administrator',
        email: 'admin@ourvillage.tn.gov.in',
        password: 'Admin@12345',
        role: 'admin',
        village: 'Nesal',
        mandal: 'Vanur',
        district: 'Villupuram',
        preferredLanguage: 'ta'
      });
      await admin.save();
    } else {
      admin.password = 'Admin@12345';
      await admin.save();
    }

    res.json({
      success: true,
      message: 'Admin credentials reset successfully',
      credentials: {
        email: 'admin@ourvillage.tn.gov.in',
        password: 'Admin@12345'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
