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
  if (OTP_CONFIG.USE_MOCK_OTP) {
    // Mock transporter for development
    return {
      sendMail: async (options) => {
        const otpMatch = options.text.match(/\d{6}/);
        console.log(`[MOCK EMAIL] OTP ${otpMatch ? otpMatch[0] : 'N/A'} sent to ${options.to}`);
        return { messageId: 'mock-message-id', accepted: [options.to] };
      }
    };
  }

  // Real email transporter
  if (!OTP_CONFIG.EMAIL_USER || !OTP_CONFIG.EMAIL_PASSWORD) {
    throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in environment variables');
  }

  return nodemailer.createTransport({
    host: OTP_CONFIG.EMAIL_HOST,
    port: OTP_CONFIG.EMAIL_PORT,
    secure: OTP_CONFIG.EMAIL_PORT === 465,
    auth: {
      user: OTP_CONFIG.EMAIL_USER,
      pass: OTP_CONFIG.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
}

// Send OTP via Resend API (for Railway/production)
async function sendOTPViaResend(email, otp) {
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
  try {
    // Check if we should use Resend API (for Railway/production)
    if (OTP_CONFIG.USE_RESEND) {
      const result = await sendOTPViaResend(email, otp);
      console.log(`OTP email sent to ${email} via Resend (ID: ${result.messageId})`);
      return result;
    }

    const transporter = createTransporter();
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

    // Add timeout to prevent hanging
    const sendMailWithTimeout = (transporter, options, timeout = 30000) => {
      return Promise.race([
        transporter.sendMail(options),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Email send timeout after ${timeout}ms`)), timeout)
        )
      ]);
    };

    const info = await sendMailWithTimeout(transporter, mailOptions, 30000);
    console.log(`OTP email sent to ${email} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error.message);
    return { success: false, error: error.message };
  }
}
