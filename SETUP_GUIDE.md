# MoyoClub Setup Guide

## Quick Start

### 1. Database Setup

```bash
# Install PostgreSQL if not already installed
# Create database
createdb moyoclub

# Run schema
psql moyoclub < backend/database/schema.sql
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy and edit .env file
cp .env.example .env
# Edit .env with your database credentials

# Start backend
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
# From root directory
npm install

# Optional: Create .env file for custom API URL
# VITE_API_URL=http://localhost:5000/api

# Start frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

## Configuration

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moyoclub
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Twilio (for SMS OTP) - Optional for development
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Development mode (set to true to use mock OTP without Twilio)
USE_MOCK_OTP=true

PORT=5000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Static Images

Place your images in `public/images/`:
- `logo.png` - Company logo
- `product.jpg` - Product image (or update image_url in database)

## Testing the Flow

1. **Signup**: Enter phone number → Receive OTP (check console if USE_MOCK_OTP=true) → Enter OTP → Complete profile
2. **Order**: Select quantity → Proceed to payment → Scan QR code → Enter transaction ID → Confirm
3. **Confirmation**: View order details

## Database & Backend

- **Database**: PostgreSQL (production-ready, robust)
- **Backend**: Node.js + Express (simple, scalable)
- **OTP Service**: Twilio (can use mock mode for development)

## Production Checklist

- [ ] Set `USE_MOCK_OTP=false` and configure Twilio
- [ ] Use strong `JWT_SECRET`
- [ ] Configure CORS properly
- [ ] Set up SSL/HTTPS
- [ ] Configure error logging
- [ ] Set up database backups
- [ ] Use environment-specific configs

