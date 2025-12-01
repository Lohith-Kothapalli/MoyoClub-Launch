import express from 'express';
import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
import { generateOTP, sendOTP, OTP_CONFIG } from '../config/otp.js';
import { authenticateToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Request OTP for signup/login
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    const otp = generateOTP();
    await OTP.create(email, otp, OTP_CONFIG.OTP_EXPIRY_MINUTES);

    const result = await sendOTP(email, otp);

    if (!result.success) {
      console.error('Failed to send OTP:', result.error);
      return res.status(500).json({ error: 'Failed to send OTP', details: result.error });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      mockOtp: OTP_CONFIG.USE_MOCK_OTP ? otp : undefined
    });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Verify OTP and signup/login
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, name, phone, address, city, state, pincode } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'OTP must be 6 digits' });
    }

    // Verify OTP
    const verification = await OTP.verify(email, otp);
    if (!verification.valid) {
      return res.status(400).json({ error: verification.message || 'Invalid or expired OTP' });
    }

    // Check if user exists
    let user = await User.findByEmail(email);

    if (!user) {
      // Signup flow - create new user
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required for signup' });
      }

      // Check if phone number already exists (if provided)
      const phoneValue = phone && phone.trim() !== '' ? phone.trim() : null;
      if (phoneValue) {
        const existingUserWithPhone = await User.findByPhone(phoneValue);
        if (existingUserWithPhone) {
          return res.status(400).json({ error: 'A user with this phone number already exists. Please use a different phone number or leave it empty.' });
        }
      }

      try {
        user = await User.create({
          name: name.trim(),
          email,
          phone: phoneValue,
          address: address || '',
          city: city || '',
          state: state || '',
          pincode: pincode || ''
        });
      } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === '23505') { // Unique constraint violation
          if (error.constraint === 'users_phone_key') {
            return res.status(400).json({ error: 'A user with this phone number already exists. Please use a different phone number or leave it empty.' });
          }
          if (error.constraint === 'users_email_key') {
            return res.status(400).json({ error: 'A user with this email already exists. Please login instead.' });
          }
        }
        return res.status(500).json({ error: 'Failed to create account', details: error.message });
      }
    } else {
      // Login flow - update user details if provided
      if (name || address || city || state || pincode || phone) {
        user = await User.update(user.id, {
          name: name ? name.trim() : user.name,
          phone: phone || user.phone,
          address: address || user.address,
          city: city || user.city,
          state: state || user.state,
          pincode: pincode || user.pincode
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove sensitive data
    const { password, ...userData } = user;

    res.json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Verify token and get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data
    const { password, ...userData } = user;

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;
