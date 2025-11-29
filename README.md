# MoyoClub - E-commerce Platform

A production-ready e-commerce platform with email OTP authentication, product ordering, and payment processing.

## Features

- ✅ **Email OTP Authentication** - Real email-based OTP verification
- ✅ **Product Catalog** - Single product display with quantity selection
- ✅ **QR Code Payment** - UPI payment integration with transaction ID verification
- ✅ **Order Management** - Complete order tracking and confirmation
- ✅ **Database Storage** - PostgreSQL database for users, orders, and products

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Nodemailer (for Email OTP)

## Quick Start

### Backend Setup

```bash
cd backend
npm install
# Create .env file (see backend/.env.example)
npm run dev
```

### Frontend Setup

```bash
npm install
npm run dev
```

## Project Structure

```
├── backend/          # Node.js API server
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── models/   # Database models
│   │   └── config/   # Configuration
│   └── database/     # SQL schema
│
├── src/
│   ├── components/   # React components
│   └── config/       # API configuration
│
└── public/
    └── images/       # Static images
```

## User Flow

1. **Signup/Login**: User enters email → Receives OTP → Verifies OTP → (For signup) Completes profile
2. **Browse Product**: User views product details and selects quantity
3. **Payment**: User proceeds to payment → Scans QR code → Enters transaction ID → Confirms payment
4. **Order Confirmation**: Order is saved to database → User sees confirmation page

## License

Private - MoyoClub
