// Email Configuration with Azure/Microsoft Graph API
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const EMAIL_CONFIG = {
  // Azure/Microsoft Graph API configuration
  USE_AZURE_GRAPH: process.env.USE_AZURE_GRAPH !== 'false', // Default to true, set to 'false' to disable
  AZURE_TENANT_ID: process.env.AZURE_TENANT_ID || '',
  AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID || '',
  AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET || '',
  AZURE_SENDER_EMAIL: process.env.AZURE_SENDER_EMAIL || 'MoyoClub.One@lynsal.com',
  
  // For development/testing without email service
  USE_MOCK_EMAIL: process.env.USE_MOCK_EMAIL === 'true' || false,
};

// Token cache for Azure Graph API
let azureTokenCache = {
  token: null,
  expiresAt: null,
};

// Get access token from Azure AD using client credentials flow
async function getAzureAccessToken() {
  // Check if we have a valid cached token
  if (azureTokenCache.token && azureTokenCache.expiresAt && Date.now() < azureTokenCache.expiresAt) {
    return azureTokenCache.token;
  }

  if (!EMAIL_CONFIG.AZURE_TENANT_ID || !EMAIL_CONFIG.AZURE_CLIENT_ID || !EMAIL_CONFIG.AZURE_CLIENT_SECRET) {
    throw new Error('Azure credentials not configured. Set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET');
  }

  // Validate client secret format (warn if it looks like an ID instead of a value)
  const secretIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (secretIdPattern.test(EMAIL_CONFIG.AZURE_CLIENT_SECRET.trim())) {
    // Warning: Secret ID detected instead of Secret Value
  }

  const tokenUrl = `https://login.microsoftonline.com/${EMAIL_CONFIG.AZURE_TENANT_ID}/oauth2/v2.0/token`;
  
  const params = new URLSearchParams({
    client_id: EMAIL_CONFIG.AZURE_CLIENT_ID,
    client_secret: EMAIL_CONFIG.AZURE_CLIENT_SECRET.trim(), // Trim whitespace
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

// Send email via Azure/Microsoft Graph API
async function sendEmailViaAzureGraph(to, subject, htmlContent, textContent = '') {
  if (!EMAIL_CONFIG.AZURE_SENDER_EMAIL) {
    throw new Error('AZURE_SENDER_EMAIL is required');
  }

  // Get access token
  const accessToken = await getAzureAccessToken();

  // Prepare email message for Graph API
  const message = {
    message: {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: htmlContent,
      },
      toRecipients: [
        {
          emailAddress: {
            address: to,
          },
        },
      ],
    },
  };

  // Send email via Microsoft Graph API
  const graphUrl = `https://graph.microsoft.com/v1.0/users/${EMAIL_CONFIG.AZURE_SENDER_EMAIL}/sendMail`;
  
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

// Send order confirmation email
export async function sendOrderConfirmation(order, user, product) {
  try {
    // Mock mode for development/testing
    if (EMAIL_CONFIG.USE_MOCK_EMAIL) {
      return { success: true, messageId: `mock-${Date.now()}` };
    }

    // Use Azure/Microsoft Graph API
    if (!EMAIL_CONFIG.USE_AZURE_GRAPH) {
      throw new Error('Azure Graph API is disabled. Set USE_AZURE_GRAPH=true or USE_MOCK_EMAIL=true for testing');
    }
    
    const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const deliveryAddress = typeof order.delivery_address === 'string' 
      ? JSON.parse(order.delivery_address) 
      : order.delivery_address;

    const addressString = deliveryAddress 
      ? `${deliveryAddress.address || ''}, ${deliveryAddress.city || ''}, ${deliveryAddress.state || ''} - ${deliveryAddress.pincode || ''}`.replace(/^,\s*|,\s*$/g, '')
      : 'Not provided';

    const htmlContent = `
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
          <h2 style="color: #E87722; margin-top: 0;">Order Confirmation</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Thank you for your order! We've received your order and it's being processed.</p>
          
          <div style="background-color: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #ddd;">
            <h3 style="color: #E87722; margin-top: 0;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Order ID:</td>
                <td style="padding: 8px 0;">${order.order_id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Order Date:</td>
                <td style="padding: 8px 0;">${orderDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0; text-transform: capitalize; color: #E87722;">${order.status}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #ddd;">
            <h3 style="color: #E87722; margin-top: 0;">Product Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Product:</td>
                <td style="padding: 8px 0;">${product?.name || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Quantity:</td>
                <td style="padding: 8px 0;">${order.quantity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Total Amount:</td>
                <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #E87722;">₹${parseFloat(order.total_amount).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #ddd;">
            <h3 style="color: #E87722; margin-top: 0;">Delivery Address</h3>
            <p style="margin: 0;">${addressString}</p>
          </div>

          <div style="background-color: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #ddd;">
            <h3 style="color: #E87722; margin-top: 0;">Transaction Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Transaction ID:</td>
                <td style="padding: 8px 0; font-family: monospace;">${order.transaction_id}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #e8f5e9; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4caf50;">
            <p style="margin: 0; color: #2e7d32;">
              <strong>What's next?</strong><br>
              We'll send you another email once your order has been shipped. You can track your order status anytime.
            </p>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            If you have any questions about your order, please contact our support team.
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            © ${new Date().getFullYear()} MoyoClub. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Order Confirmation - ${order.order_id}

Hello ${user.name},

Thank you for your order! We've received your order and it's being processed.

Order Details:
- Order ID: ${order.order_id}
- Order Date: ${orderDate}
- Status: ${order.status}

Product Details:
- Product: ${product?.name || 'N/A'}
- Quantity: ${order.quantity}
- Total Amount: ₹${parseFloat(order.total_amount).toFixed(2)}

Delivery Address:
${addressString}

Transaction ID: ${order.transaction_id}

We'll send you another email once your order has been shipped.

© ${new Date().getFullYear()} MoyoClub. All rights reserved.
    `;

    const result = await sendEmailViaAzureGraph(
      user.email,
      `Order Confirmation - ${order.order_id}`,
      htmlContent,
      textContent
    );
    
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { EMAIL_CONFIG };
