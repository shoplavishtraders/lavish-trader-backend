# Lavish Trader Backend

A complete Node.js + Express backend for Daraz POS system with real-time inventory sync and order management.

## Features

✅ **Daraz Integration**
- Auto-fetch orders every 2 hours
- Real-time order status updates via webhooks
- Automatic inventory sync to Daraz
- Price management

✅ **Order Management**
- Create, read, update orders
- Multi-status tracking (pending, processing, packed, shipped, delivered, returned)
- Customer information tracking
- Invoice generation

✅ **Inventory Management**
- Real-time stock tracking
- Color variation support
- Low stock alerts
- Stock movement history
- Product variations (colors, sizes, etc.)

✅ **Reporting**
- Sales reports
- Profit & Loss statements
- Inventory valuations
- Revenue by platform

✅ **Security**
- JWT authentication
- Role-based permissions (admin, manager, staff, viewer)
- Request rate limiting
- Password hashing with bcrypt

✅ **Scheduled Jobs**
- Daraz order sync every 2 hours
- Inventory sync every 1 hour
- Automatic health checks

## Project Structure

```
src/
├── server.js              # Main application entry
├── models/                # MongoDB schemas
│   ├── User.js
│   ├── Order.js
│   ├── Product.js
│   └── Inventory.js
├── routes/                # API endpoints
│   ├── auth.js
│   ├── orders.js
│   ├── products.js
│   ├── inventory.js
│   ├── daraz.js
│   ├── reports.js
│   └── webhooks.js
├── services/              # Business logic
│   └── darazService.js
├── jobs/                  # Scheduled tasks
│   ├── darazSync.js
│   └── inventorySync.js
├── middleware/            # Express middleware
│   └── auth.js
└── utils/                 # Helper functions
    └── logger.js
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or cloud)
- Daraz Seller API credentials

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lavish-trader-backend.git
cd lavish-trader-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```
MONGODB_URI=mongodb://localhost:27017/lavish-trader
DARAZ_APP_KEY=your-key
DARAZ_APP_SECRET=your-secret
DARAZ_ACCESS_TOKEN=your-token
JWT_SECRET=your-jwt-secret
```

## Running Locally

### Development:
```bash
npm run dev
```
Server will run on `http://localhost:3001`

### Production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/stats/summary` - Get order statistics

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product

### Inventory
- `GET /api/inventory` - Get inventory levels

### Daraz
- `GET /api/daraz/status` - Check Daraz connection
- `POST /api/daraz/sync` - Trigger manual sync

### Webhooks
- `POST /api/webhooks/daraz/order-update` - Daraz order status updates

## Deployment to GCP

### Step 1: Setup GCP Project

```bash
gcloud auth login
gcloud config set project your-project-id
```

### Step 2: Create Cloud SQL Instance

```bash
gcloud sql instances create lavish-trader-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=asia-south1
```

### Step 3: Deploy to Compute Engine

1. Create instance:
```bash
gcloud compute instances create lavish-trader-api \
  --zone=asia-south1-a \
  --machine-type=f1-micro \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud
```

2. SSH into instance:
```bash
gcloud compute ssh lavish-trader-api --zone=asia-south1-a
```

3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git
```

4. Clone and setup:
```bash
git clone https://github.com/yourusername/lavish-trader-backend.git
cd lavish-trader-backend
npm install
```

5. Create `.env`:
```bash
sudo nano .env
# Add your credentials
```

6. Start with PM2:
```bash
sudo npm install -g pm2
pm2 start src/server.js --name "lavish-trader"
pm2 startup
pm2 save
```

### Step 4: Setup Cloud Scheduler for Auto-sync

```bash
gcloud scheduler jobs create http daraz-sync \
  --location=asia-south1 \
  --schedule="0 */2 * * *" \
  --uri="https://your-api.com/api/daraz/sync" \
  --http-method=POST
```

## Environment Variables

Required variables in `.env`:

```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lavish-trader

JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d

DARAZ_APP_KEY=your-app-key
DARAZ_APP_SECRET=your-app-secret
DARAZ_ACCESS_TOKEN=your-access-token
DARAZ_API_URL=https://api.daraz.pk

ADMIN_EMAIL=admin@lavishtrader.com
ADMIN_PASSWORD=secure-password

DARAZ_SYNC_INTERVAL=120
INVENTORY_SYNC_INTERVAL=60

LOG_LEVEL=info
```

## Testing

```bash
npm test
```

## Logging

Logs are stored in `logs/` directory:
- `app.log` - All logs
- `error.log` - Error logs only

## Support

For issues and questions, contact: support@lavishtrader.com

## License

MIT License
