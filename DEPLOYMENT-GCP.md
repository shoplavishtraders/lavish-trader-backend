# GCP Deployment Guide for Lavish Trader Backend

Complete step-by-step guide to deploy on Google Cloud Platform.

## Overview

**Free Tier Resources:**
- Compute Engine f1-micro (FREE for 12 months)
- Cloud SQL MySQL 10GB (FREE for 12 months)
- Cloud Storage 5GB (FREE)
- Cloud Scheduler (Unlimited FREE)
- Cloud Functions (2M invocations FREE)

**After Free Tier:**
- Compute Engine: Rs 1,500-2,000/month
- Cloud SQL: Rs 3,000-4,000/month
- Total Monthly: Rs 8,000-12,000

---

## Step-by-Step Deployment

### Phase 1: Setup GCP Account

1. **Create GCP Account**
   - Go to https://console.cloud.google.com
   - Sign up with your email
   - Enable billing (need credit card for verification, won't charge for free tier)
   - Create new project: "lavish-trader"

2. **Enable Required APIs**
   ```bash
   gcloud services enable compute.googleapis.com
   gcloud services enable sql-component.googleapis.com
   gcloud services enable storage-api.googleapis.com
   gcloud services enable cloudscheduler.googleapis.com
   gcloud services enable cloudfunctions.googleapis.com
   ```

3. **Set Default Project**
   ```bash
   gcloud config set project your-project-id
   gcloud config set compute/zone asia-south1-a
   gcloud config set compute/region asia-south1
   ```

---

### Phase 2: Create Cloud SQL Database

1. **Create MySQL Instance**
   ```bash
   gcloud sql instances create lavish-trader-db \
     --database-version=MYSQL_8_0 \
     --tier=db-f1-micro \
     --region=asia-south1 \
     --no-assign-ip
   ```

2. **Set Root Password**
   ```bash
   gcloud sql users set-password root \
     --instance=lavish-trader-db \
     --password=your-secure-password
   ```

3. **Create Database**
   ```bash
   gcloud sql databases create lavish_trader \
     --instance=lavish-trader-db
   ```

4. **Create App User**
   ```bash
   gcloud sql users create app_user \
     --instance=lavish-trader-db \
     --password=app-secure-password
   ```

5. **Get Connection String**
   ```bash
   gcloud sql instances describe lavish-trader-db \
     --format='value(connectionName)'
   ```
   Save this - you'll need it later

---

### Phase 3: Create Compute Engine VM

1. **Create f1-micro Instance (FREE)**
   ```bash
   gcloud compute instances create lavish-trader-api \
     --zone=asia-south1-a \
     --machine-type=f1-micro \
     --image-family=ubuntu-2004-lts \
     --image-project=ubuntu-os-cloud \
     --scopes=cloud-platform
   ```

2. **Get Instance IP**
   ```bash
   gcloud compute instances describe lavish-trader-api \
     --zone=asia-south1-a \
     --format='value(networkInterfaces[0].accessConfigs[0].natIP)'
   ```

3. **Create Firewall Rule**
   ```bash
   gcloud compute firewall-rules create allow-api \
     --allow=tcp:3001 \
     --source-ranges=0.0.0.0/0
   ```

---

### Phase 4: Deploy Application

1. **SSH into Instance**
   ```bash
   gcloud compute ssh lavish-trader-api --zone=asia-south1-a
   ```

2. **Update System**
   ```bash
   sudo apt-get update
   sudo apt-get upgrade -y
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   node --version
   ```

4. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/lavish-trader-backend.git
   cd lavish-trader-backend
   ```

5. **Install Dependencies**
   ```bash
   npm install
   ```

6. **Create .env File**
   ```bash
   cat > .env << 'EOF'
   NODE_ENV=production
   PORT=3001
   
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lavish-trader
   
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   
   DARAZ_APP_KEY=your-daraz-app-key
   DARAZ_APP_SECRET=your-daraz-app-secret
   DARAZ_ACCESS_TOKEN=your-daraz-access-token
   DARAZ_API_URL=https://api.daraz.pk
   
   ADMIN_EMAIL=admin@lavishtrader.com
   ADMIN_PASSWORD=change-this
   
   DARAZ_SYNC_INTERVAL=120
   INVENTORY_SYNC_INTERVAL=60
   
   LOG_LEVEL=info
   CORS_ORIGIN=https://lavishtrader.com
   EOF
   ```

7. **Test Locally**
   ```bash
   npm run dev
   # Check if server starts without errors
   # Press Ctrl+C to stop
   ```

---

### Phase 5: Run with PM2 (Process Manager)

1. **Install PM2 Globally**
   ```bash
   sudo npm install -g pm2
   ```

2. **Start Application**
   ```bash
   pm2 start src/server.js --name "lavish-trader" --env production
   ```

3. **Setup Auto-restart**
   ```bash
   pm2 startup
   # Run the command it outputs
   pm2 save
   ```

4. **Check Status**
   ```bash
   pm2 status
   pm2 logs lavish-trader  # View logs
   ```

---

### Phase 6: Setup Cloud SQL Proxy (For Local MongoDB)

If using MongoDB Atlas instead of Cloud SQL:

1. **Get MongoDB Connection String**
   - Go to MongoDB Atlas
   - Cluster → Connect → Connection String
   - Copy your connection string

2. **Update .env**
   ```bash
   # Update MONGODB_URI with your Atlas connection
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lavish-trader
   ```

3. **Restart Application**
   ```bash
   pm2 restart lavish-trader
   ```

---

### Phase 7: Setup Cloud Scheduler (Auto-sync)

1. **Create Scheduler Job for Daraz Sync**
   ```bash
   gcloud scheduler jobs create http daraz-sync \
     --location=asia-south1 \
     --schedule="0 */2 * * *" \
     --uri="https://your-api-ip:3001/api/daraz/sync" \
     --http-method=POST \
     --message-body='{}'
   ```

2. **Create Inventory Sync Job**
   ```bash
   gcloud scheduler jobs create http inventory-sync \
     --location=asia-south1 \
     --schedule="0 * * * *" \
     --uri="https://your-api-ip:3001/api/inventory/sync" \
     --http-method=POST \
     --message-body='{}'
   ```

---

### Phase 8: Setup Domain & SSL

1. **Get Instance IP**
   ```bash
   INSTANCE_IP=$(gcloud compute instances describe lavish-trader-api \
     --zone=asia-south1-a --format='value(networkInterfaces[0].accessConfigs[0].natIP)')
   echo $INSTANCE_IP
   ```

2. **Point Domain to IP**
   - Go to your domain registrar
   - Update DNS A record to point to your GCP instance IP
   - Wait for DNS propagation (5-30 minutes)

3. **Setup HTTPS with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx -y
   sudo certbot certonly --standalone -d api.lavishtrader.com
   ```

4. **Configure Nginx Reverse Proxy** (Optional but recommended)
   ```bash
   sudo apt-get install nginx -y
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
     listen 80;
     server_name api.lavishtrader.com;
     return 301 https://$server_name$request_uri;
   }
   
   server {
     listen 443 ssl http2;
     server_name api.lavishtrader.com;
     
     ssl_certificate /etc/letsencrypt/live/api.lavishtrader.com/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/api.lavishtrader.com/privkey.pem;
     
     location / {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```
   
   ```bash
   sudo systemctl restart nginx
   ```

---

## Monitoring & Maintenance

### View Logs
```bash
# SSH into instance
gcloud compute ssh lavish-trader-api --zone=asia-south1-a

# View PM2 logs
pm2 logs lavish-trader

# View system logs
tail -100 /var/log/syslog
```

### Health Check
```bash
curl https://your-api.com/health
# Should return:
# {
#   "status": "healthy",
#   "mongodb": "connected",
#   "uptime": 3600
# }
```

### Restart Application
```bash
pm2 restart lavish-trader
```

### Update Code
```bash
cd lavish-trader-backend
git pull
npm install
pm2 restart lavish-trader
```

---

## Cost Estimation

| Service | Free Tier | After 12 months |
|---------|-----------|-----------------|
| Compute Engine f1-micro | Rs 0 | Rs 1,500-2,000/month |
| Cloud SQL | Rs 0 | Rs 3,000-4,000/month |
| Cloud Storage | Rs 0 | Rs 500-1,000/month |
| Cloud Scheduler | Rs 0 | Rs 0 (free) |
| Total/Month | Rs 0 | Rs 5,000-7,000 |
| Total/Year | Rs 0 | Rs 60,000-84,000 |

---

## Troubleshooting

### Port Already in Use
```bash
lsof -i :3001
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Check connection string in .env
# Make sure IP is whitelisted in MongoDB Atlas
# Test connection: mongo "your-connection-string"
```

### PM2 Not Starting
```bash
pm2 kill
pm2 start src/server.js --name "lavish-trader"
pm2 logs
```

### Disk Space Full
```bash
df -h  # Check usage
pm2 logs --lines 0  # Clear PM2 logs
```

---

## Next Steps

1. Setup monitoring (Stackdriver)
2. Configure backups (Cloud SQL automated backups)
3. Setup alerts for errors
4. Scale horizontally if needed (load balancer)

For questions, email: support@lavishtrader.com
