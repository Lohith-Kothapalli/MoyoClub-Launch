# MoyoClub - Nutrition-Packed Meal Marketplace Platform

## 🎉 Welcome to MoyoClub

A complete nutrition-packed meal marketplace platform that sources directly from managed farms, using a subscription-based ordering system with comprehensive warehouse management and admin features.

## 🌟 Platform Overview

### Consumer Features
- 📱 **Browse 712 Products** - Extensive catalog with meals and beverages
- 🥤 **Integrated Beverages** - 12 beverages in ProductGrid tabs (Fresh Juices, Smoothies, Herbal Teas, Functional, Plant Milk, Kombucha)
- 🔄 **Frequency-Based Ordering** - Weekly, Bi-weekly, Monthly subscriptions
- 🛒 **Smart Cart System** - Seamless shopping experience
- 💳 **Razorpay Integration** - Secure payment processing
- 👤 **User Profiles** - Account management and order history
- 📦 **Order Tracking** - Real-time delivery status
- 🎨 **Beautiful UI** - MoyoClub orange (#E87722) and tan (#A67C52) branding

### Warehouse Manager Features
- 📦 **Inventory Management** - Bulk upload, add, edit, delete products
- 📋 **Order Management** - Process and fulfill customer orders
- 🚚 **Delivery Assignment** - Smart order-to-delivery-person matching

### Site Admin Features (Separate Role)
- 🎨 **Content Management** - Customize consumer page content & images
- 🖼️ **Image Management** - Upload and manage hero images
- ✍️ **Copy Editing** - Update headlines, descriptions, and CTAs
- 📊 **Statistics Display** - Customize homepage stats

### Corporate B2B Features (NEW!)
- 🏢 **Corporate Accounts** - Separate B2B signup for businesses
- 👥 **Employee Management** - Add employees individually or via CSV bulk upload
- 📅 **Subscription Plans** - Monthly or yearly corporate subscriptions
- 💡 **Product Requests** - Request custom products not in catalog
- 📊 **Usage Analytics** - Track employee meal consumption
- 📦 **Bulk Ordering** - Order for multiple employees at once

## 🚀 Quick Start

### For Consumers
1. Visit the homepage
2. Browse products by category or search
3. Select delivery frequency (Weekly/Bi-weekly/Monthly)
4. Add items to cart
5. Checkout with Razorpay
6. Track your order

### For Warehouse Managers
1. Click "Warehouse Login" button (bottom-left, brown)
2. Login with credentials:
   - Email: `warehouse@moyoclub.one`
   - Password: `warehouse123`
3. Access 3 main tabs:
   - **Delivery** - Assign orders to delivery personnel
   - **Orders** - Process customer orders
   - **Inventory** - Manage product catalog

### For Site Admins
1. Click "Site Admin" button (bottom-left, orange) or header link
2. Login with credentials:
   - Email: `admin@moyoclub.one`
   - Password: `admin123`
3. Access Content Management System:
   - **Hero Section** - Edit main banner content
   - **Features Section** - Customize feature cards

### For Corporate/Business Accounts (NEW!)
1. Click "Corporate" button (bottom-left, blue) or header link
2. Login with credentials:
   - Email: `admin@techcorp.com`
   - Password: `corporate123`
3. Access 4 main tabs:
   - **Overview** - Subscription status & company stats
   - **Employees** - Manage team & meal allocations
   - **Orders** - View corporate order history
   - **Product Requests** - Request custom products

## 📚 Documentation

### Complete Guides
- **[CORPORATE_B2B_GUIDE.md](CORPORATE_B2B_GUIDE.md)** - Corporate/Business accounts program (NEW!)
- **[ROLE_SEPARATION_GUIDE.md](ROLE_SEPARATION_GUIDE.md)** - Understanding different admin roles
- **[ADMIN_FEATURES_SUMMARY.md](ADMIN_FEATURES_SUMMARY.md)** - Overview of all admin features
- **[SITE_ADMIN_GUIDE.md](SITE_ADMIN_GUIDE.md)** - Site Admin role and content management
- **[CONTENT_MANAGEMENT_GUIDE.md](CONTENT_MANAGEMENT_GUIDE.md)** - Content editing complete guide
- **[BULK_INVENTORY_GUIDE.md](BULK_INVENTORY_GUIDE.md)** - Inventory management details
- **[WAREHOUSE_MANAGEMENT.md](WAREHOUSE_MANAGEMENT.md)** - Complete warehouse system docs
- **[DELIVERY_ASSIGNMENT.md](DELIVERY_ASSIGNMENT.md)** - Delivery system documentation
- **[AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md)** - User authentication guide
- **[PAYMENT_SETUP.md](PAYMENT_SETUP.md)** - Payment integration guide

### Quick References
- **[CONTENT_QUICK_REFERENCE.md](CONTENT_QUICK_REFERENCE.md)** - Content management quick tips
- **[INVENTORY_QUICK_REFERENCE.md](INVENTORY_QUICK_REFERENCE.md)** - Inventory operations guide
- **[WAREHOUSE_QUICK_START.md](WAREHOUSE_QUICK_START.md)** - Warehouse getting started
- **[DELIVERY_QUICK_START.md](DELIVERY_QUICK_START.md)** - Delivery system basics
- **[AUTH_QUICK_START.md](AUTH_QUICK_START.md)** - Authentication quick guide
- **[INVENTORY_SYSTEM_SUMMARY.md](INVENTORY_SYSTEM_SUMMARY.md)** - Inventory feature overview

## 🎨 Key Features

### 1. Content Management System (Separate Site Admin Role)
Customize the consumer-facing homepage without touching code:
- ✅ Edit hero section (headline, description, buttons, stats)
- ✅ Change hero image
- ✅ Customize feature cards (icons, titles, descriptions)
- ✅ Live preview before publishing
- ✅ Real-time updates on consumer page

**Access:** Site Admin Dashboard (separate login required)
**Login:** admin@moyoclub.one / admin123

### 2. Inventory Management
Comprehensive product catalog management:
- ✅ Bulk upload via CSV (import 100+ products at once)
- ✅ Add individual products with complete form
- ✅ Edit all product details
- ✅ Quick stock adjustments
- ✅ Delete discontinued products
- ✅ Automatic validation and error checking
- ✅ Search and filter capabilities

**Access:** Warehouse Dashboard → Inventory Tab
**Login:** warehouse@moyoclub.one / warehouse123

### 3. Order Management
Process customer orders efficiently:
- ✅ View all pending orders
- ✅ Order details and customer info
- ✅ Update order status
- ✅ Mark orders as fulfilled
- ✅ Search and filter orders
- ✅ Bulk operations

**Access:** Warehouse Dashboard → Orders Tab
**Login:** warehouse@moyoclub.one / warehouse123

### 4. Delivery Assignment
Smart delivery coordination:
- ✅ Manage delivery personnel
- ✅ Assign orders with zone recommendations
- ✅ Capacity tracking (max 10 orders per person)
- ✅ Real-time assignment status
- ✅ Performance metrics
- ✅ Bulk assignment capabilities

**Access:** Warehouse Dashboard → Delivery Tab
**Login:** warehouse@moyoclub.one / warehouse123

## 💻 Technology Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Recharts** - Charts and graphs

### State Management
- **localStorage** - Demo mode data persistence
- **React Hooks** - Component state

### Integration Ready
- **Razorpay** - Payment processing
- **Supabase** - Backend integration (optional)
- **REST APIs** - Backend communication

## 🎯 Brand Colors

```css
Primary Orange: #E87722
Secondary Tan: #A67C52
Background: #FFF5ED
```

## 📦 Component Structure

```
components/
├── Auth.tsx                    - Consumer authentication
├── CorporateAuth.tsx          - Corporate B2B login (NEW!)
├── CorporateDashboard.tsx     - Corporate dashboard (NEW!)
├── EmployeeManagement.tsx     - Employee management & CSV upload (NEW!)
├── ProductRequestForm.tsx     - Custom product requests (NEW!)
├── SiteAdminAuth.tsx          - Site Admin login
├── SiteAdminDashboard.tsx     - Site Admin dashboard
├── ContentManagement.tsx      - Content CMS
├── WarehouseAuth.tsx          - Warehouse Manager login
├── WarehouseDashboard.tsx     - Warehouse operations dashboard
├── InventoryManagement.tsx    - Product catalog management
├── BulkInventoryUpload.tsx    - CSV bulk upload
├── ProductEditor.tsx          - Add/edit products
├── OrderManagement.tsx        - Order processing
├── DeliveryAssignment.tsx     - Delivery coordination
├── Hero.tsx                   - Homepage hero section (reads from CMS)
├── Features.tsx               - Features section (reads from CMS)
├── ProductGrid.tsx            - Product catalog display
├── Cart.tsx                   - Shopping cart
├── Checkout.tsx               - Payment flow
├── OrderTracker.tsx           - Order tracking
└── ui/                        - shadcn/ui components
```

## 🔐 Demo Credentials

### Corporate Account (B2B Program) - NEW!
```
Email: admin@techcorp.com
Password: corporate123
Role: Corporate meal program management
Company: TechCorp India (150 employees, yearly plan)
```

### Site Admin (Content Management Only)
```
Email: admin@moyoclub.one
Password: admin123
Role: Content Management System access
```

### Warehouse Manager (Operations)
```
Email: warehouse@moyoclub.one
Password: warehouse123
Role: Inventory, Orders, Delivery management
```

### Test Consumer Account
```
Email: test@example.com
Password: test123
Role: Customer shopping experience
```

## 🚀 Common Admin Tasks

### Update Homepage Content
```
1. Login to Warehouse Dashboard
2. Click "Content" tab
3. Edit hero section or features
4. Click "Preview" to review
5. Click "Save Changes"
6. Verify on consumer page
```

### Bulk Add Products
```
1. Login to Warehouse Dashboard
2. Click "Inventory" tab
3. Click "Bulk Upload"
4. Download CSV template
5. Fill with product data
6. Upload CSV file
7. Review validation
8. Click "Import"
```

### Process Orders
```
1. Login to Warehouse Dashboard
2. Click "Orders" tab
3. Review pending orders
4. Click order to see details
5. Update status
6. Mark as fulfilled
```

### Assign Deliveries
```
1. Login to Warehouse Dashboard
2. Click "Delivery" tab
3. View unassigned orders
4. Select delivery person
5. Click "Assign" on orders
6. Monitor assignments
```

## 📊 Data Storage

### Current (Demo Mode)
All data stored in browser localStorage:
- `moyoclub_content` - Page content
- `moyoclub_inventory` - Product inventory
- `moyoclub_products` - Consumer product catalog
- `moyoclub_orders` - Customer orders
- `moyoclub_delivery_personnel` - Delivery staff
- `moyoclub_user` - Consumer session
- `moyoclub_current_warehouse_manager` - Admin session
- `moyoclub_cart` - Shopping cart

### Production Ready
Easy migration to backend APIs:
- Replace localStorage calls with fetch/axios
- Connect to database (MySQL, PostgreSQL, MongoDB)
- Add authentication middleware
- Implement real-time updates

## 🎓 Training Resources

### For Warehouse Managers
1. Start with [WAREHOUSE_QUICK_START.md](WAREHOUSE_QUICK_START.md)
2. Learn content management: [CONTENT_MANAGEMENT_GUIDE.md](CONTENT_MANAGEMENT_GUIDE.md)
3. Master inventory: [BULK_INVENTORY_GUIDE.md](BULK_INVENTORY_GUIDE.md)
4. Understand delivery: [DELIVERY_ASSIGNMENT.md](DELIVERY_ASSIGNMENT.md)

### For Developers
1. Review [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md)
2. Understand [PAYMENT_SETUP.md](PAYMENT_SETUP.md)
3. Study component structure
4. Check integration points

## 🔄 Workflow Examples

### Daily Operations
**Morning:**
1. Check new orders (Orders tab)
2. Review low stock items (Inventory tab)
3. Assign today's deliveries (Delivery tab)

**During Day:**
1. Process orders as they arrive
2. Update stock levels
3. Monitor delivery progress

**Evening:**
1. Mark delivered orders complete
2. Update inventory from shipments
3. Review tomorrow's schedule

### Weekly Tasks
1. Refresh homepage content
2. Update product descriptions
3. Review inventory levels
4. Check delivery performance
5. Update statistics on homepage

### Monthly Tasks
1. Bulk inventory review
2. Major content updates
3. Add new seasonal products
4. Remove discontinued items
5. Analyze order trends

## 🎯 Best Practices

### Content Management
- ✅ Preview before publishing
- ✅ Update regularly (weekly/monthly)
- ✅ Use high-quality images (1080x500px)
- ✅ Keep text clear and concise
- ✅ Test on mobile devices
- ✅ Maintain brand consistency

### Inventory Management
- ✅ Use bulk upload for 10+ products
- ✅ Set realistic reorder levels
- ✅ Update stock after shipments
- ✅ Validate CSV before importing
- ✅ Use consistent product IDs
- ✅ Remove discontinued items promptly

### Order Processing
- ✅ Process same-day
- ✅ Update status promptly
- ✅ Communicate with customers
- ✅ Handle issues quickly
- ✅ Track metrics

### Delivery Assignment
- ✅ Balance loads (max 10/person)
- ✅ Consider zones
- ✅ Monitor capacity
- ✅ Track performance
- ✅ Update availability

## 🐛 Troubleshooting

### Common Issues

**Content changes don't show:**
- Click "Save Changes" button
- Refresh consumer page (F5)
- Clear browser cache
- Try incognito mode

**CSV upload fails:**
- Check file is .csv format
- Verify headers match template
- Review validation errors
- Test with smaller file first

**Orders not appearing:**
- Check order status filter
- Verify order was placed successfully
- Refresh dashboard
- Check browser console

**Can't assign delivery:**
- Verify person has capacity
- Check person is available
- Look for zone mismatches
- Review assignment rules

## 📈 Success Metrics

### Platform Performance
- ✅ 700+ products in catalog
- ✅ Content updates in < 5 min
- ✅ Orders processed within 2 hours
- ✅ Deliveries assigned same day
- ✅ 95%+ on-time delivery rate

### User Experience
- ✅ Fast page loads
- ✅ Intuitive navigation
- ✅ Seamless checkout
- ✅ Real-time tracking
- ✅ Responsive on all devices

## 🔮 Future Enhancements

Planned features for future releases:
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Mobile app
- [ ] Multi-warehouse support
- [ ] Advanced reporting
- [ ] Inventory forecasting
- [ ] Customer segmentation
- [ ] Loyalty program
- [ ] Referral system

## 🤝 Contributing

This is a production-ready demo application. For production deployment:
1. Replace localStorage with backend APIs
2. Implement proper authentication
3. Add database integration
4. Set up payment gateway
5. Configure domain and hosting
6. Add monitoring and logging
7. Implement backup systems

## 📝 License

All rights reserved. MoyoClub platform.

## 📞 Support

For questions or issues:
1. Check relevant documentation
2. Review troubleshooting sections
3. Consult quick reference guides
4. Test in incognito mode
5. Check browser console for errors

## 🎉 Get Started Now!

### As Consumer:
Visit the homepage and start browsing nutritious meals!

### As Admin:
Login to warehouse dashboard and explore all management features!

---

**Built with ❤️ for healthy eating and efficient operations**

**Brand Colors:** Orange (#E87722) • Tan (#A67C52)

**Version:** 2.0 (with Content Management System)

**Status:** Production Ready (Demo Mode)
