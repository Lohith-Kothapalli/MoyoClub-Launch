import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const EMAIL_CONFIG = {
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587'),
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@moyoclub.com',
  USE_MOCK_EMAIL: process.env.USE_MOCK_EMAIL === 'true',
};

// Create email transporter
function createTransporter() {
  // Mock mode for development
  if (EMAIL_CONFIG.USE_MOCK_EMAIL) {
    return {
      sendMail: async (mailOptions) => {
        console.log('\n📧 MOCK EMAIL (not actually sent):');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('---');
        return { messageId: 'mock-' + Date.now() };
      }
    };
  }

  // Real email transporter
  if (!EMAIL_CONFIG.EMAIL_USER || !EMAIL_CONFIG.EMAIL_PASSWORD) {
    throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env file');
  }

  return nodemailer.createTransport({
    host: EMAIL_CONFIG.EMAIL_HOST,
    port: EMAIL_CONFIG.EMAIL_PORT,
    secure: EMAIL_CONFIG.EMAIL_PORT === 465,
    auth: {
      user: EMAIL_CONFIG.EMAIL_USER,
      pass: EMAIL_CONFIG.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

// Send order confirmation email
export async function sendOrderConfirmation(order, user, product) {
  try {
    const transporter = createTransporter();
    
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

    const mailOptions = {
      from: `"MoyoClub" <${EMAIL_CONFIG.EMAIL_FROM}>`,
      to: user.email,
      subject: `Order Confirmation - ${order.order_id}`,
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
      `,
      text: `
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
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Order confirmation email sent to ${user.email} (Message ID: ${info.messageId})`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error.message);
    return { success: false, error: error.message };
  }
}

export { EMAIL_CONFIG };

