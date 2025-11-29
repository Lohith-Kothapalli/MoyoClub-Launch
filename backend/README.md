# MoyoClub Backend API

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create `.env` file in `backend` folder:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=moyoclub
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your-secret-key
   USE_MOCK_OTP=true
   PORT=5000
   ```

3. **Setup database:**
   - Create database: `moyoclub`
   - Run schema: `psql moyoclub < database/schema.sql`

4. **Start server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/request-otp` - Request OTP for email
- `POST /api/auth/verify-otp` - Verify OTP and login/signup

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order (requires auth)
- `GET /api/orders/my-orders` - Get user's orders (requires auth)
- `GET /api/orders/:orderId` - Get order details (requires auth)

## Email OTP

- Development: Set `USE_MOCK_OTP=true` (OTP logged to console)
- Production: Set `USE_MOCK_OTP=false` and configure email settings
