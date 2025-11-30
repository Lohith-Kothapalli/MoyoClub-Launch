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
  const requestStartTime = Date.now();
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║           📨 OTP REQUEST RECEIVED                          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  console.log(`   Request Body:`, JSON.stringify(req.body, null, 2));
  console.log('───────────────────────────────────────────────────────────\n');
  
  try {
    const { email } = req.body;

    console.log('🔍 [STEP 1/4] Validating email address...');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error('❌ [STEP 1/4] Invalid email format:', email);
      return res.status(400).json({ error: 'Valid email address required' });
    }
    console.log('✅ [STEP 1/4] Email validated:', email);

    console.log('\n🔍 [STEP 2/4] Generating OTP...');
    const otp = generateOTP();
    console.log('✅ [STEP 2/4] OTP generated:', otp);

    console.log('\n🔍 [STEP 3/4] Saving OTP to database...');
    try {
      await OTP.create(email, otp, OTP_CONFIG.OTP_EXPIRY_MINUTES);
      console.log('✅ [STEP 3/4] OTP saved to database successfully');
      console.log(`   Expires in: ${OTP_CONFIG.OTP_EXPIRY_MINUTES} minutes`);
    } catch (dbError) {
      console.error('❌ [STEP 3/4] Database error:', dbError.message);
      throw dbError;
    }

    console.log('\n🔍 [STEP 4/4] Sending OTP via email...');
    const result = await sendOTP(email, otp);

    if (!result.success) {
      console.error('\n╔═══════════════════════════════════════════════════════════╗');
      console.error('║        ❌ OTP REQUEST FAILED - EMAIL ERROR                ║');
      console.error('╚═══════════════════════════════════════════════════════════╝');
      console.error(`   Email: ${email}`);
      console.error(`   Error: ${result.error}`);
      console.error(`   Total time: ${Date.now() - requestStartTime}ms`);
      console.error('───────────────────────────────────────────────────────────\n');
      return res.status(500).json({ error: 'Failed to send OTP', details: result.error });
    }

    const totalTime = Date.now() - requestStartTime;
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║        ✅ OTP REQUEST COMPLETED SUCCESSFULLY               ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`   Email: ${email}`);
    console.log(`   OTP: ${otp}`);
    console.log(`   Mock Mode: ${OTP_CONFIG.USE_MOCK_OTP ? 'YES (OTP in logs only)' : 'NO (Email sent)'}`);
    console.log(`   Total time: ${totalTime}ms`);
    console.log('───────────────────────────────────────────────────────────\n');

    res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      mockOtp: OTP_CONFIG.USE_MOCK_OTP ? otp : undefined // Only send in dev mode
    });
  } catch (error) {
    const totalTime = Date.now() - requestStartTime;
    console.error('\n╔═══════════════════════════════════════════════════════════╗');
    console.error('║        ❌ OTP REQUEST FAILED - INTERNAL ERROR             ║');
    console.error('╚═══════════════════════════════════════════════════════════╝');
    console.error(`   Email: ${req.body.email || 'N/A'}`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    console.error(`   Total time: ${totalTime}ms`);
    console.error('───────────────────────────────────────────────────────────\n');
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
