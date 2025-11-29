# Email Setup Guide

## Production Email Configuration

Update `backend/.env` file with your email service credentials:

```env
# Set to false for production
USE_MOCK_OTP=false

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@moyoclub.com
```

## Option 1: Gmail Setup (Recommended for Testing)

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "MoyoClub" as the name
4. Click "Generate"
5. Copy the 16-character app password

### Step 3: Update .env
```env
USE_MOCK_OTP=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char app password (no spaces)
EMAIL_FROM=your-email@gmail.com
```

## Option 2: SendGrid Setup

### Step 1: Create SendGrid Account
1. Sign up at https://sendgrid.com
2. Verify your account

### Step 2: Create API Key
1. Go to Settings → API Keys
2. Create API Key with "Mail Send" permissions
3. Copy the API key

### Step 3: Update .env
```env
USE_MOCK_OTP=false
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@moyoclub.com
```

## Option 3: Mailgun Setup

### Step 1: Create Mailgun Account
1. Sign up at https://www.mailgun.com
2. Verify your domain

### Step 2: Get SMTP Credentials
1. Go to Sending → Domain Settings
2. Copy SMTP credentials

### Step 3: Update .env
```env
USE_MOCK_OTP=false
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-mailgun-password
EMAIL_FROM=noreply@your-domain.com
```

## Option 4: AWS SES Setup

### Step 1: Setup AWS SES
1. Create AWS account
2. Go to SES (Simple Email Service)
3. Verify your email/domain
4. Create SMTP credentials

### Step 2: Update .env
```env
USE_MOCK_OTP=false
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com  # Your region
EMAIL_PORT=587
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
EMAIL_FROM=noreply@your-domain.com
```

## Testing

After configuring, restart backend:
```bash
npm run dev
```

Try requesting OTP - you should receive real email!

## Troubleshooting

### Gmail: "Less secure app access"
- Use App Password instead of regular password
- Make sure 2FA is enabled

### Connection timeout
- Check firewall settings
- Verify EMAIL_HOST and EMAIL_PORT are correct
- Try port 465 with secure: true

### Authentication failed
- Double-check EMAIL_USER and EMAIL_PASSWORD
- For Gmail, use App Password, not regular password
- Make sure no extra spaces in .env file

