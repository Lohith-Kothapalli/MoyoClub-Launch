// OTP Configuration with Real Email Service
import nodemailer from 'nodemailer';

export const OTP_CONFIG = {
  // Email service configuration
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
        console.log('\n📧 [MOCK EMAIL]');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        const otpMatch = options.text.match(/\d{6}/);
        console.log('OTP Code:', otpMatch ? otpMatch[0] : 'N/A');
        console.log('---\n');
        return { messageId: 'mock-message-id', accepted: [options.to] };
      }
    };
  }

  // Real email transporter
  if (!OTP_CONFIG.EMAIL_USER || !OTP_CONFIG.EMAIL_PASSWORD) {
    throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env file');
  }

  return nodemailer.createTransport({
    host: OTP_CONFIG.EMAIL_HOST,
    port: OTP_CONFIG.EMAIL_PORT,
    secure: OTP_CONFIG.EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: OTP_CONFIG.EMAIL_USER,
      pass: OTP_CONFIG.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false // For self-signed certificates (optional)
    }
  });
}

// Send OTP via Email
export async function sendOTP(email, otp) {
  try {
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

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ OTP email sent to ${email} (Message ID: ${info.messageId})`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    return { success: false, error: error.message };
  }
}
