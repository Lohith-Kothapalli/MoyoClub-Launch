# Email Setup Guide

## Overview
This application uses Nodemailer to send emails for:
- **OTP Verification** - 6-digit codes sent during signup/login
- **Order Confirmations** - Detailed order receipts sent after purchase

## Quick Start

### Option 1: Development Mode (No Email Service Required)
For development and testing, you can use mock mode which logs emails to the console instead of sending them.

Add to `backend/.env`:
```env
USE_MOCK_EMAIL=true
USE_MOCK_OTP=true
```

Emails will be logged to the console but not actually sent.

---

## Production Setup

### Option 1: Gmail (Recommended for Small Scale)

#### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled

#### Step 2: Generate App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Enter "MoyoClub Backend" as the name
4. Click **Generate**
5. Copy the 16-character password (you'll use this as `EMAIL_PASSWORD`)

#### Step 3: Configure Environment Variables
Add to `backend/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@moyoclub.com
USE_MOCK_EMAIL=false
USE_MOCK_OTP=false
```

**Important Notes:**
- Use your **full Gmail address** for `EMAIL_USER`
- Use the **16-character app password** (not your regular Gmail password)
- **Gmail Free Limits:**
  - **500 emails per day** (resets at midnight Pacific Time)
  - **~100 emails per minute** (rate limit)
  - If exceeded, sending is blocked for ~24 hours
  - Suitable for small apps with <500 signups/orders per day

---

### Option 2: Outlook/Hotmail

#### Step 1: Enable App Password
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Enable **Two-step verification**
3. Go to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the password

#### Step 2: Configure Environment Variables
Add to `backend/.env`:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@moyoclub.com
USE_MOCK_EMAIL=false
USE_MOCK_OTP=false
```

---

### Option 3: SendGrid (Recommended for Production)

SendGrid offers 100 free emails/day and is more reliable for production.

#### Step 1: Create SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify your account
3. Go to **Settings** → **API Keys**
4. Click **Create API Key**
5. Name it "MoyoClub Backend" and give it **Full Access**
6. Copy the API key (you'll only see it once!)

#### Step 2: Configure Environment Variables
Add to `backend/.env`:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@moyoclub.com
USE_MOCK_EMAIL=false
USE_MOCK_OTP=false
```

**Note:** For SendGrid, `EMAIL_USER` must be exactly `apikey` (literal string).

---

### Option 4: Mailgun

#### Step 1: Create Mailgun Account
1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Verify your domain or use sandbox domain for testing
3. Go to **Sending** → **Domain Settings**
4. Copy your SMTP credentials

#### Step 2: Configure Environment Variables
Add to `backend/.env`:
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-mailgun-password
EMAIL_FROM=noreply@moyoclub.com
USE_MOCK_EMAIL=false
USE_MOCK_OTP=false
```

---

### Option 5: AWS SES (Amazon Simple Email Service)

Best for high-volume production applications.

#### Step 1: Set Up AWS SES
1. Sign in to [AWS Console](https://aws.amazon.com/)
2. Go to **SES** (Simple Email Service)
3. Verify your email address or domain
4. Go to **SMTP Settings** → **Create SMTP Credentials**
5. Download the credentials file

#### Step 2: Configure Environment Variables
Add to `backend/.env`:
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@moyoclub.com
USE_MOCK_EMAIL=false
USE_MOCK_OTP=false
```

**Note:** Replace `us-east-1` with your AWS region.

---

## Complete .env Example

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moyoclub
DB_USER=postgres
DB_PASSWORD=your-db-password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@moyoclub.com

# Email Mode (set to true for development, false for production)
USE_MOCK_EMAIL=false
USE_MOCK_OTP=false

# Server Port
PORT=5000
```

---

## Testing Email Configuration

### 1. Test OTP Email
1. Start your backend server: `cd backend && npm run dev`
2. Try signing up with a test email
3. Check your email inbox (or console if using mock mode)
4. Verify the OTP code is received

### 2. Test Order Confirmation Email
1. Complete a test order
2. Check your email for the order confirmation
3. Verify all order details are correct

### 3. Check Backend Logs
Look for these messages in your backend console:
- ✅ `Order confirmation email sent to user@example.com`
- ✅ `OTP email sent successfully`
- ❌ `Error sending email:` (if there's an issue)

---

## Troubleshooting

### Issue: "Email credentials not configured"
**Solution:** Make sure `EMAIL_USER` and `EMAIL_PASSWORD` are set in `backend/.env`

### Issue: "Invalid login" or "Authentication failed"
**Possible Causes:**
- Wrong password (using regular password instead of app password)
- 2FA not enabled (required for Gmail app passwords)
- Incorrect `EMAIL_USER` format

**Solution:**
- For Gmail: Generate a new app password
- Double-check credentials in `.env` file
- Ensure no extra spaces or quotes around values

### Issue: "Connection timeout"
**Possible Causes:**
- Firewall blocking SMTP port
- Wrong `EMAIL_HOST` or `EMAIL_PORT`
- Network restrictions

**Solution:**
- Verify SMTP settings for your provider
- Check firewall settings
- Try port 465 with `secure: true` (requires different config)

### Issue: Emails going to spam
**Solutions:**
- Use a verified domain (not Gmail/Outlook)
- Set up SPF, DKIM, and DMARC records
- Use a professional email service (SendGrid, Mailgun, AWS SES)
- Avoid spam trigger words in subject/content

### Issue: Gmail "Less secure app" error
**Solution:** Gmail no longer supports "less secure apps". You **must** use an App Password (see Gmail setup above).

### Issue: Rate limiting (too many emails)
**Solutions:**
- Gmail: 500 emails/day limit
- Use a professional service (SendGrid: 100/day free, then paid)
- Implement email queuing for high volume
- Add delays between sends

---

## Email Templates

### OTP Email
The OTP email includes:
- 6-digit verification code
- Expiry time (10 minutes)
- Branded styling with MoyoClub colors

### Order Confirmation Email
The order confirmation includes:
- Order ID and date
- Product details (name, quantity, price)
- Delivery address
- Transaction ID
- Order status
- Professional HTML formatting

Both templates are automatically styled with MoyoClub branding (#E87722 orange).

---

## Security Best Practices

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use App Passwords** - Never use your main email password
3. **Rotate credentials** - Change passwords periodically
4. **Use environment-specific configs** - Different settings for dev/staging/prod
5. **Monitor email logs** - Check for failed sends and investigate
6. **Rate limiting** - Implement to prevent abuse
7. **Email validation** - Validate email addresses before sending

---

## Production Checklist

- [ ] Email service configured (not using mock mode)
- [ ] App password or API key generated
- [ ] Environment variables set correctly
- [ ] Test emails sent successfully
- [ ] Email templates reviewed and customized
- [ ] SPF/DKIM records configured (for custom domain)
- [ ] Email monitoring set up
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] Backup email service configured (optional)

---

## Email Provider Comparison

| Provider | Free Tier | Daily Limit | Best For | Setup Difficulty |
|----------|-----------|-------------|----------|-----------------|
| Gmail | Free | 500/day | Small apps, testing | Easy |
| SendGrid | Free | 100/day | Production apps | Easy |
| Mailgun | Free (3 months) | ~167/day* | Production apps | Medium |
| AWS SES | Pay-as-you-go | Unlimited** | High volume | Medium |
| Outlook | Free | 300/day | Small apps | Easy |

\* Mailgun: 5,000/month free for first 3 months, then paid  
\** AWS SES: ~$0.10 per 1,000 emails after free tier

---

## Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [SendGrid Setup Guide](https://docs.sendgrid.com/for-developers/sending-email/getting-started-smtp)
- [Email Deliverability Best Practices](https://www.mailgun.com/blog/email-deliverability-best-practices/)

---

## Support

If you encounter issues:
1. Check backend console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with mock mode first to isolate configuration issues
4. Check your email provider's status page for outages
5. Review the troubleshooting section above

