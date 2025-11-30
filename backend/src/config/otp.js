// OTP Configuration with Email Service
// Supports both SMTP (for local) and Resend API (for production/Railway)
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file to ensure environment variables are available
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const OTP_CONFIG = {
  // Email service configuration
  // Option 1: Use Resend API (recommended for Railway/production)
  USE_RESEND: process.env.USE_RESEND === 'true' || false,
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  
  // Option 2: Use SMTP (for local development)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587'),
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@moyoclub.com',

  // OTP settings
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,

  // For development/testing without email service
  USE_MOCK_OTP: process.env.USE_MOCK_OTP === 'true' || false,
};

// Generate OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create email transporter
function createTransporter() {
  console.log('\n🔧 [OTP CONFIG] Creating email transporter...');
  console.log('   USE_MOCK_OTP:', OTP_CONFIG.USE_MOCK_OTP);
  console.log('   EMAIL_HOST:', OTP_CONFIG.EMAIL_HOST);
  console.log('   EMAIL_PORT:', OTP_CONFIG.EMAIL_PORT);
  console.log('   EMAIL_USER:', OTP_CONFIG.EMAIL_USER ? `${OTP_CONFIG.EMAIL_USER.substring(0, 3)}***` : 'NOT SET');
  console.log('   EMAIL_PASSWORD:', OTP_CONFIG.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');
  console.log('   EMAIL_FROM:', OTP_CONFIG.EMAIL_FROM);
  
  if (OTP_CONFIG.USE_MOCK_OTP) {
    console.log('📧 [MOCK MODE] Using MOCK OTP - emails will NOT be sent, only logged');
    // Mock transporter for development
    return {
      sendMail: async (options) => {
        console.log('\n📧 [MOCK EMAIL]');
        console.log('   To:', options.to);
        console.log('   Subject:', options.subject);
        const otpMatch = options.text.match(/\d{6}/);
        console.log('   OTP Code:', otpMatch ? otpMatch[0] : 'N/A');
        console.log('   ---\n');
        return { messageId: 'mock-message-id', accepted: [options.to] };
      }
    };
  }

  // Real email transporter
  if (!OTP_CONFIG.EMAIL_USER || !OTP_CONFIG.EMAIL_PASSWORD) {
    console.error('\n❌ [ERROR] Email credentials missing:');
    console.error('   EMAIL_USER:', OTP_CONFIG.EMAIL_USER ? '✓ Set' : '✗ Missing');
    console.error('   EMAIL_PASSWORD:', OTP_CONFIG.EMAIL_PASSWORD ? '✓ Set' : '✗ Missing');
    console.error('   Please set EMAIL_USER and EMAIL_PASSWORD in Railway environment variables\n');
    throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in environment variables');
  }
  
  console.log(`\n📧 [EMAIL CONFIG] Configured:`);
  console.log(`   User: ${OTP_CONFIG.EMAIL_USER}`);
  console.log(`   Host: ${OTP_CONFIG.EMAIL_HOST}:${OTP_CONFIG.EMAIL_PORT}`);
  console.log(`   Secure: ${OTP_CONFIG.EMAIL_PORT === 465}`);
  console.log(`   From: ${OTP_CONFIG.EMAIL_FROM}\n`);

  console.log('🔧 [TRANSPORTER] Creating nodemailer transporter...');
  try {
    const transporter = nodemailer.createTransport({
      host: OTP_CONFIG.EMAIL_HOST,
      port: OTP_CONFIG.EMAIL_PORT,
      secure: OTP_CONFIG.EMAIL_PORT === 465, // true for 465, false for other ports
      auth: {
        user: OTP_CONFIG.EMAIL_USER,
        pass: OTP_CONFIG.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // For self-signed certificates (optional)
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    console.log('✅ [TRANSPORTER] Nodemailer transporter created successfully');
    console.log('   (Connection will be verified when sending email)\n');
    return transporter;
  } catch (error) {
    console.error('❌ [TRANSPORTER] Failed to create transporter:');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    throw error;
  }
}

// Send OTP via Resend API (for Railway/production)
async function sendOTPViaResend(email, otp) {
  console.log('📧 [RESEND] Using Resend API to send email...');
  
  if (!OTP_CONFIG.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required when USE_RESEND=true');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OTP_CONFIG.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `MoyoClub <${OTP_CONFIG.EMAIL_FROM}>`,
      to: email,
      subject: 'Your MoyoClub Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #E87722; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">MoyoClub</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #E87722; margin-top: 0;">Email Verification</h2>
            <p>Hello,</p>
            <p>Your verification code for MoyoClub is:</p>
            <div style="background-color: #fff; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #E87722; letter-spacing: 5px; margin: 20px 0; border: 2px dashed #E87722; border-radius: 8px;">
              ${otp}
            </div>
            <p>This code is valid for <strong>${OTP_CONFIG.OTP_EXPIRY_MINUTES} minutes</strong>.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              If you didn't request this code, please ignore this email.
            </p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              © ${new Date().getFullYear()} MoyoClub. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Resend API error: ${errorData.message || errorData.error || response.statusText}`);
  }

  const data = await response.json();
  return { success: true, messageId: data.id };
}

// Send OTP via Email
export async function sendOTP(email, otp) {
  const startTime = Date.now();
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📧 [OTP EMAIL] Starting OTP email send process');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   Recipient: ${email}`);
  console.log(`   OTP Code: ${otp}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  console.log('───────────────────────────────────────────────────────────\n');
  
  try {
    // Check if we should use Resend API (for Railway/production)
    if (OTP_CONFIG.USE_RESEND) {
      console.log('🔧 [STEP 1/4] Using Resend API (bypassing SMTP)...');
      const result = await sendOTPViaResend(email, otp);
      console.log('✅ [STEP 1/4] Email sent via Resend API\n');
      
      const totalDuration = Date.now() - startTime;
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`✅ [SUCCESS] OTP email sent to ${email} via Resend`);
      console.log(`   Total time: ${totalDuration}ms`);
      console.log(`   Message ID: ${result.messageId}`);
      console.log('═══════════════════════════════════════════════════════════\n');
      return result;
    }

    console.log('🔧 [STEP 1/4] Creating email transporter...');
    const transporter = createTransporter();
    console.log('✅ [STEP 1/4] Transporter created successfully\n');

    console.log('🔧 [STEP 2/4] Preparing email content...');
    const mailOptions = {
      from: `"MoyoClub" <${OTP_CONFIG.EMAIL_FROM}>`,
      to: email,
      subject: 'Your MoyoClub Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #E87722; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">MoyoClub</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #E87722; margin-top: 0;">Email Verification</h2>
            <p>Hello,</p>
            <p>Your verification code for MoyoClub is:</p>
            <div style="background-color: #fff; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #E87722; letter-spacing: 5px; margin: 20px 0; border: 2px dashed #E87722; border-radius: 8px;">
              ${otp}
            </div>
            <p>This code is valid for <strong>${OTP_CONFIG.OTP_EXPIRY_MINUTES} minutes</strong>.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              If you didn't request this code, please ignore this email.
            </p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              © ${new Date().getFullYear()} MoyoClub. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Your MoyoClub verification code is: ${otp}. Valid for ${OTP_CONFIG.OTP_EXPIRY_MINUTES} minutes.`,
    };
    console.log('   From:', mailOptions.from);
    console.log('   To:', mailOptions.to);
    console.log('   Subject:', mailOptions.subject);
    console.log('✅ [STEP 2/4] Email content prepared\n');

    console.log('🔧 [STEP 3/4] Connecting to SMTP server and sending email...');
    console.log(`   SMTP Server: ${OTP_CONFIG.EMAIL_HOST}:${OTP_CONFIG.EMAIL_PORT}`);
    console.log(`   Attempting connection at ${new Date().toISOString()}...`);
    const sendStartTime = Date.now();
    
    let info;
    try {
      // Add timeout to prevent hanging
      const sendMailWithTimeout = (transporter, options, timeout = 30000) => {
        console.log(`   ⏱️  Setting timeout of ${timeout}ms...`);
        return Promise.race([
          transporter.sendMail(options).then(result => {
            console.log('   📤 sendMail promise resolved');
            return result;
          }).catch(err => {
            console.error('   ❌ sendMail promise rejected:', err.message);
            throw err;
          }),
          new Promise((_, reject) => {
            console.log(`   ⏰ Timeout timer started (${timeout}ms)`);
            setTimeout(() => {
              console.error(`   ⏰ Timeout reached after ${timeout}ms`);
              reject(new Error(`Email send timeout after ${timeout}ms`));
            }, timeout);
          })
        ]);
      };
      
      console.log('   🚀 Calling sendMail...');
      info = await sendMailWithTimeout(transporter, mailOptions, 30000);
      const sendDuration = Date.now() - sendStartTime;
      console.log(`✅ [STEP 3/4] Email sent successfully (took ${sendDuration}ms)`);
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   Accepted: ${info.accepted?.join(', ') || 'N/A'}`);
      console.log(`   Rejected: ${info.rejected?.join(', ') || 'None'}\n`);
    } catch (sendError) {
      console.error('   ❌ Error during sendMail call:', sendError.message);
      console.error('   Error details:', {
        code: sendError.code,
        command: sendError.command,
        response: sendError.response,
        responseCode: sendError.responseCode
      });
      throw sendError;
    }

    const totalDuration = Date.now() - startTime;
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ [SUCCESS] OTP email sent to ${email}`);
    console.log(`   Total time: ${totalDuration}ms`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    return { success: true, messageId: info.messageId };
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error('\n═══════════════════════════════════════════════════════════');
    console.error('❌ [ERROR] Failed to send OTP email');
    console.error('═══════════════════════════════════════════════════════════');
    console.error(`   Recipient: ${email}`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Error Code: ${error.code || 'N/A'}`);
    console.error(`   Error Command: ${error.command || 'N/A'}`);
    console.error(`   Total time: ${totalDuration}ms`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack}`);
    }
    console.error('═══════════════════════════════════════════════════════════\n');
    return { success: false, error: error.message };
  }
}
