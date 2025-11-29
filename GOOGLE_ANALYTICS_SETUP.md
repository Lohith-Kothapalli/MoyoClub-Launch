# Google Analytics Setup Guide

## Overview
Google Analytics (GA) has been integrated into your MoyoClub application to track user behavior, conversions, and key events.

## Setup Instructions

### 1. Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use an existing one
3. Navigate to **Admin** → **Data Streams**
4. Click on your web stream (or create a new one)
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Add Measurement ID to Environment Variables

Create a `.env` file in the root directory (if it doesn't exist) and add:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Tracked Events

The following events are automatically tracked:

### Authentication Events
- **Sign Up** - When a user creates a new account
- **Login** - When a user logs in
- **Logout** - When a user logs out
- **OTP Requested** - When an OTP is sent to user's email
- **OTP Verified** - When OTP is successfully verified (with success/failure status)
- **Resend OTP** - When user requests a new OTP

### E-commerce Events
- **View Item** - When a product is viewed
- **Begin Checkout** - When user proceeds to payment
- **Purchase** - When an order is successfully placed (includes transaction ID, value, items)

### User Engagement
- **Page Views** - Automatically tracked on page load

## Event Structure

### Purchase Event Example
```javascript
{
  event: 'purchase',
  transaction_id: 'TXN123456',
  currency: 'INR',
  value: 500.00,
  items: [{
    item_id: '1',
    item_name: 'Premium Nutrition Box',
    quantity: 1,
    price: 500.00
  }]
}
```

## Testing

1. Open your browser's Developer Tools
2. Go to the **Network** tab
3. Filter by `google-analytics.com` or `gtag`
4. Perform actions (signup, login, purchase, etc.)
5. Verify that events are being sent

Alternatively, use the Google Analytics DebugView:
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable it and perform actions
3. Check Google Analytics → DebugView to see real-time events

## Disabling Analytics (Development)

To disable analytics during development, simply remove or comment out the `VITE_GA_MEASUREMENT_ID` from your `.env` file. The app will continue to work normally without tracking.

## Custom Events

You can add custom event tracking anywhere in your code:

```typescript
import { analytics } from '../utils/analytics';

// Track a custom event
analytics.trackEvent('custom_event_name', {
  category: 'Custom',
  label: 'Custom Action',
  value: 100
});
```

## Files Modified

- `src/utils/analytics.ts` - Analytics utility functions
- `src/main.tsx` - GA initialization
- `src/components/Auth.tsx` - Authentication event tracking
- `src/components/Consumer.tsx` - Page view and logout tracking
- `src/components/SingleProductPurchase.tsx` - E-commerce event tracking

## Privacy Note

Make sure to:
1. Add a privacy policy that mentions Google Analytics usage
2. Consider adding a cookie consent banner (if required by your jurisdiction)
3. Configure GA to respect user privacy settings

## Troubleshooting

### Events not showing in GA
- Verify `VITE_GA_MEASUREMENT_ID` is set correctly
- Check browser console for errors
- Ensure GA script is loading (check Network tab)
- Wait 24-48 hours for data to appear in GA (real-time view shows immediately)

### TypeScript errors
- Make sure `src/vite-env.d.ts` exists and is included in `tsconfig.json`
- Restart your TypeScript server in your IDE

