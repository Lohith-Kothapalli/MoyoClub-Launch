# Hybrid Deployment Guide: WinSCP (Frontend) + Railway (Backend)

Deploy frontend to your existing domain via WinSCP and backend to Railway. This is a great approach!

---

## ✅ Why This Works

- ✅ **Frontend on your domain** - Full control, uses your existing hosting
- ✅ **Backend on Railway** - Reliable, always-on, free tier
- ✅ **No conflicts** - They work together perfectly
- ✅ **Cost effective** - Use existing hosting + free Railway backend

---

## 📋 Prerequisites

1. **Existing domain** with web hosting (via WinSCP)
2. **Railway account** - [railway.app](https://railway.app)
3. **GitHub account** (for Railway deployment)
4. **Subdomain** for frontend (e.g., `app.yourdomain.com` or `www.yourdomain.com`)

---

## 🚀 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### 1.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Railway will detect it's a Node.js project

### 1.3 Configure Backend Service

1. Railway will create a service automatically
2. Click on the service
3. Go to **"Settings"** tab
4. Set **Root Directory:** `backend`
5. Set **Start Command:** `node src/server.js`

### 1.4 Add PostgreSQL Database

1. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will create a PostgreSQL database
3. Copy the connection details (you'll need these)

### 1.5 Configure Environment Variables

Go to **"Variables"** tab and add:

```env
NODE_ENV=production
PORT=10000
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=your-very-long-secret-key-minimum-32-characters
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@moyoclub.com
FRONTEND_URL=https://app.yourdomain.com
USE_MOCK_EMAIL=false
```

**Important:** 
- Railway automatically provides database variables using `${{Postgres.VARIABLE}}` syntax
- Replace `app.yourdomain.com` with your actual frontend subdomain

### 1.6 Deploy

1. Railway will automatically deploy when you push to GitHub
2. Or click **"Deploy"** button
3. Wait for deployment to complete
4. Copy the **Railway URL** (e.g., `https://moyoclub-backend.up.railway.app`)

### 1.7 Setup Database Schema

1. Go to your PostgreSQL database in Railway
2. Click **"Connect"** tab
3. Copy the **Connection URL**
4. Use a PostgreSQL client (DBeaver, pgAdmin) or Railway's built-in terminal
5. Connect and run your schema:

```bash
# Using Railway CLI (optional)
railway connect postgres

# Or use external client with connection URL
psql <connection-url>
```

Then run:
```sql
-- Copy and paste contents of backend/database/schema.sql
```

---

## 🌐 Step 2: Configure CORS on Backend

Your backend needs to allow requests from your frontend domain.

### Update Backend CORS Configuration

Edit `backend/src/server.js`:

```javascript
import cors from 'cors';

// Configure CORS to allow your frontend domain
const corsOptions = {
  origin: [
    'https://app.yourdomain.com',      // Your production domain
    'https://www.yourdomain.com',      // If you use www
    'http://localhost:3000',            // For local development
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

**Replace `app.yourdomain.com` with your actual subdomain!**

---

## 📦 Step 3: Build Frontend for Production

### 3.1 Update API Configuration

Edit `src/config/api.ts` or create `src/.env.production`:

```env
VITE_API_URL=https://your-railway-backend.up.railway.app/api
VITE_GA_MEASUREMENT_ID=your-ga-id-if-any
```

Or update `src/config/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-railway-backend.up.railway.app/api'
    : 'http://localhost:5000/api');
```

### 3.2 Build Frontend

```bash
# In your project root directory
npm install
npm run build
```

This creates a `dist/` folder with production-ready files.

---

## 📤 Step 4: Upload Frontend via WinSCP

### 4.1 Connect to Your Server

1. Open WinSCP
2. Connect to your web hosting server
3. Navigate to your domain's public folder (usually `public_html/` or `www/`)

### 4.2 Create Subdomain Folder (if needed)

**Option A: Subdomain (Recommended)**
- Create folder: `app/` or `subdomain-name/`
- Upload files to this folder
- Configure subdomain in your hosting control panel to point to this folder

**Option B: Root Domain**
- Upload directly to `public_html/` or `www/`
- Your domain will serve the frontend

### 4.3 Upload Files

1. **Select all files from `dist/` folder** on your local machine:
   - `index.html`
   - `assets/` folder
   - Any other files in `dist/`

2. **Upload to server:**
   - Drag and drop to your domain folder
   - Or right-click → Upload

3. **Verify upload:**
   - Check that `index.html` is in the root of your domain folder
   - Check that `assets/` folder exists

### 4.4 Configure .htaccess (if Apache)

Create `.htaccess` file in your domain root:

```apache
# Enable rewrite engine
RewriteEngine On

# Handle React Router (SPA)
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### 4.5 Test Frontend

1. Visit your domain: `https://app.yourdomain.com`
2. Check browser console for errors
3. Verify API calls are going to Railway backend

---

## 🔧 Step 5: Configure DNS (if using subdomain)

### 5.1 Add Subdomain Record

In your domain's DNS settings (wherever you manage DNS):

1. Add **A Record** or **CNAME Record:**
   - **Type:** CNAME (recommended) or A
   - **Name:** `app` (or your subdomain name)
   - **Value:** Your server IP or domain
   - **TTL:** 3600

### 5.2 Configure in Hosting Control Panel

1. Go to your hosting control panel (cPanel, Plesk, etc.)
2. Find **"Subdomains"** section
3. Create subdomain: `app.yourdomain.com`
4. Point it to folder: `public_html/app/` (or your folder)

---

## ✅ Step 6: Verify Everything Works

### Test Checklist:

- [ ] Frontend loads: `https://app.yourdomain.com`
- [ ] Backend health check: `https://your-backend.up.railway.app/health`
- [ ] API calls work (check browser Network tab)
- [ ] No CORS errors in browser console
- [ ] Authentication works (login/signup)
- [ ] Database connection works

### Common Issues:

**Issue: CORS Error**
- **Fix:** Update CORS in `backend/src/server.js` to include your domain
- **Fix:** Make sure `FRONTEND_URL` in Railway matches your domain

**Issue: API calls fail**
- **Fix:** Check `VITE_API_URL` in frontend build
- **Fix:** Verify Railway backend URL is correct
- **Fix:** Check Railway backend is running (not sleeping)

**Issue: 404 on page refresh**
- **Fix:** Add `.htaccess` file (see Step 4.4)
- **Fix:** Configure server to serve `index.html` for all routes

---

## 🔄 Step 7: Update Process

### When You Make Changes:

**Backend Changes:**
1. Push to GitHub
2. Railway auto-deploys (or manually deploy in Railway dashboard)

**Frontend Changes:**
1. Update code locally
2. Update `VITE_API_URL` if Railway URL changed
3. Build: `npm run build`
4. Upload `dist/` folder via WinSCP

---

## 📝 Environment Variables Summary

### Railway Backend Variables:
```env
NODE_ENV=production
PORT=10000
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=<your-secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<app-password>
EMAIL_FROM=noreply@moyoclub.com
FRONTEND_URL=https://app.yourdomain.com
USE_MOCK_EMAIL=false
```

### Frontend Build Variables:
```env
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_GA_MEASUREMENT_ID=<your-ga-id>
```

---

## 🎯 Architecture Diagram

```
┌─────────────────────────────────────┐
│   Your Domain (WinSCP)             │
│   app.yourdomain.com               │
│   ┌─────────────────────────────┐   │
│   │  Frontend (React/Vite)     │   │
│   │  - Static files             │   │
│   │  - Served by Apache/Nginx   │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              │ API Calls
              ▼
┌─────────────────────────────────────┐
│   Railway Backend                   │
│   backend.up.railway.app            │
│   ┌─────────────────────────────┐   │
│   │  Node.js/Express API        │   │
│   │  - Handles requests         │   │
│   │  - Connects to PostgreSQL   │   │
│   └─────────────────────────────┘   │
│              │                       │
│              ▼                       │
│   ┌─────────────────────────────┐   │
│   │  PostgreSQL Database        │   │
│   │  - User data                │   │
│   │  - Orders                   │   │
│   │  - Products                 │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 💡 Pro Tips

1. **Use Railway's custom domain** (optional):
   - Add custom domain in Railway settings
   - Point `api.yourdomain.com` to Railway
   - Looks more professional

2. **Enable HTTPS everywhere:**
   - Your domain: Use Let's Encrypt (free SSL)
   - Railway: Automatic HTTPS included

3. **Monitor Railway usage:**
   - Check Railway dashboard regularly
   - Free tier has $5/month credit
   - Monitor database usage

4. **Backup strategy:**
   - Export database regularly from Railway
   - Keep local backups of frontend builds

5. **Development workflow:**
   - Use Railway's preview deployments for testing
   - Test frontend locally pointing to Railway backend
   - Only deploy to production when ready

---

## ❓ FAQ

**Q: Will there be CORS issues?**
A: No, as long as you configure CORS correctly in backend to allow your domain.

**Q: Can I use www instead of app subdomain?**
A: Yes! Just point www to your frontend folder and update CORS accordingly.

**Q: What if Railway backend goes down?**
A: Railway free tier is reliable, but consider upgrading if you need SLA. You can also add error handling in frontend.

**Q: Can I use Railway for frontend too?**
A: Yes, but since you already have domain hosting, using WinSCP is fine and gives you more control.

**Q: How do I update frontend?**
A: Build locally (`npm run build`), then upload `dist/` folder via WinSCP.

**Q: What about database migrations?**
A: Connect to Railway PostgreSQL and run SQL commands directly, or use Railway CLI.

---

## 🚀 Quick Start Checklist

- [ ] Deploy backend to Railway
- [ ] Add PostgreSQL database on Railway
- [ ] Configure environment variables
- [ ] Update CORS in backend code
- [ ] Run database schema
- [ ] Build frontend locally
- [ ] Update API URL in frontend
- [ ] Upload frontend via WinSCP
- [ ] Configure subdomain (if needed)
- [ ] Test everything works
- [ ] Setup SSL/HTTPS

---

## 🎉 You're Done!

Your hybrid setup:
- ✅ Frontend on your domain (via WinSCP)
- ✅ Backend on Railway (reliable, free tier)
- ✅ Database on Railway PostgreSQL
- ✅ Everything connected and working

This is a great setup that gives you:
- Control over frontend hosting
- Reliable backend infrastructure
- Cost-effective (uses existing hosting + free Railway)

**No problems - this setup works perfectly!** 🚀

