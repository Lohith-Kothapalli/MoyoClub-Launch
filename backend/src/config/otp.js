// OTP Configuration with Azure/Microsoft Graph API Email Service
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file to ensure environment variables are available
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const OTP_CONFIG = {
  // Azure/Microsoft Graph API configuration
  USE_AZURE_GRAPH: process.env.USE_AZURE_GRAPH !== 'false', // Default to true, set to 'false' to disable
  AZURE_TENANT_ID: process.env.AZURE_TENANT_ID || '',
  AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID || '',
  AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET || '',
  AZURE_SENDER_EMAIL: process.env.AZURE_SENDER_EMAIL || 'MoyoClub.One@lynsal.com',
  
  // OTP settings
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,

  // For development/testing without email service
  USE_MOCK_OTP: process.env.USE_MOCK_OTP === 'true' || false,
};

// Token cache for Azure Graph API
let azureTokenCache = {
  token: null,
  expiresAt: null,
};

// Generate OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get OTP email HTML template
function getOTPEmailHTML(otp) {
  return `
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
  `;
}

// Get access token from Azure AD using client credentials flow
async function getAzureAccessToken() {
  // Check if we have a valid cached token
  if (azureTokenCache.token && azureTokenCache.expiresAt && Date.now() < azureTokenCache.expiresAt) {
    return azureTokenCache.token;
  }

  if (!OTP_CONFIG.AZURE_TENANT_ID || !OTP_CONFIG.AZURE_CLIENT_ID || !OTP_CONFIG.AZURE_CLIENT_SECRET) {
    throw new Error('Azure credentials not configured. Set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET');
  }

  // Validate client secret format (warn if it looks like an ID instead of a value)
  const secretIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (secretIdPattern.test(OTP_CONFIG.AZURE_CLIENT_SECRET.trim())) {
    // Warning: Secret ID detected instead of Secret Value
  }

  const tokenUrl = `https://login.microsoftonline.com/${OTP_CONFIG.AZURE_TENANT_ID}/oauth2/v2.0/token`;
  
  const params = new URLSearchParams({
    client_id: OTP_CONFIG.AZURE_CLIENT_ID,
    client_secret: OTP_CONFIG.AZURE_CLIENT_SECRET.trim(), // Trim whitespace
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      const errorMessage = errorData.error_description || errorData.error || response.statusText;
      
      // Provide helpful error message for common issues
      if (errorMessage.includes('AADSTS7000215') || errorMessage.includes('Invalid client secret')) {
        throw new Error(`Invalid Azure Client Secret. Original error: ${errorMessage}`);
      }
      
      throw new Error(`Azure token request failed: ${errorMessage}`);
    }

    const data = await response.json();
    
    // Cache the token (expires in ~1 hour, but we'll refresh 5 minutes early)
    azureTokenCache.token = data.access_token;
    azureTokenCache.expiresAt = Date.now() + (data.expires_in - 300) * 1000; // Subtract 5 minutes for safety
    
    return data.access_token;
  } catch (error) {
    throw error;
  }
}

// Send OTP via Azure/Microsoft Graph API
async function sendOTPViaAzureGraph(email, otp) {
  if (!OTP_CONFIG.AZURE_SENDER_EMAIL) {
    throw new Error('AZURE_SENDER_EMAIL is required');
  }

  // Get access token
  const accessToken = await getAzureAccessToken();

  // Prepare email message for Graph API
  const message = {
    message: {
      subject: 'Your MoyoClub Verification Code',
      body: {
        contentType: 'HTML',
        content: getOTPEmailHTML(otp),
      },
      toRecipients: [
        {
          emailAddress: {
            address: email,
          },
        },
      ],
    },
  };

  // Send email via Microsoft Graph API
  const graphUrl = `https://graph.microsoft.com/v1.0/users/${OTP_CONFIG.AZURE_SENDER_EMAIL}/sendMail`;
  
  try {
    const response = await fetch(graphUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorData = await response.text();
      let errorMessage = 'Unknown error';
      try {
        const parsedError = JSON.parse(errorData);
        errorMessage = parsedError.error?.message || parsedError.error?.code || errorData;
      } catch {
        errorMessage = errorData || response.statusText;
      }
      throw new Error(`Microsoft Graph API error: ${errorMessage}`);
    }

    // Graph API returns 202 Accepted on success (no body)
    return { success: true, messageId: `graph-${Date.now()}` };
  } catch (error) {
    throw error;
  }
}

// Send OTP via Email
export async function sendOTP(email, otp) {
  try {
    // Mock mode for development/testing
    if (OTP_CONFIG.USE_MOCK_OTP) {
      return { success: true, messageId: `mock-${Date.now()}` };
    }

    // Use Azure/Microsoft Graph API
    if (!OTP_CONFIG.USE_AZURE_GRAPH) {
      throw new Error('Azure Graph API is disabled. Set USE_AZURE_GRAPH=true or USE_MOCK_OTP=true for testing');
    }

    const result = await sendOTPViaAzureGraph(email, otp);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}
