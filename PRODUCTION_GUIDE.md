# UK Commission Admin Panel - Production Deployment Guide

## 🚀 Quick Start for Client Testing

### Prerequisites
- Docker Desktop installed and running
- Git (optional, for updates)
- 4GB+ RAM available
- Ports 80, 8000, 3000 available

### 1. One-Click Deployment (Windows)

```powershell
# Open PowerShell as Administrator and run:
.\deploy-production.ps1
```

### 2. One-Click Deployment (Linux/Mac)

```bash
# Make script executable and run:
chmod +x deploy-production.sh
./deploy-production.sh
```

### 3. Manual Deployment

```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 📱 Access Your Application

After deployment, access the application at:

- **Main Application**: http://localhost
- **API Documentation**: http://localhost:8000/docs
- **API Endpoints**: http://localhost:8000/api/*

## 🔐 Default Login Credentials

```
Email: admin@ukmortgage.co.uk
Password: admin123
```

**⚠️ Change these credentials after first login!**

## ✨ Key Features to Test

### 1. Dashboard Overview
- Real-time metrics and KPIs
- Revenue tracking
- Team performance indicators

### 2. Consultant Management
- View all mortgage advisors
- Filter by department, location, status
- Individual consultant profiles
- Performance analytics

### 3. **🚀 NEW: Revolutionary AI Analytics Panel**
- **AI Command Center** - Neural network insights
- **Live Market Intelligence** - Real-time rates and trends
- **Communication AI** - Sentiment analysis and call predictions
- **Blockchain Security** - Document verification
- **Quantum-Ready Infrastructure** - Future-proof architecture
- **Real-time Notifications** - Live updates and alerts

### 4. Commission Tracking
- Commission calculations
- Payment history
- Performance bonuses

### 5. Client Management
- Client database
- Application tracking
- Document management

## 🛠️ Management Commands

### Start/Stop Services
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Database Management
```bash
# Backup database
docker exec uk-commission-backend cp /app/sql_app.db /app/data/backup_$(date +%Y%m%d_%H%M%S).db

# Access database
docker exec -it uk-commission-backend sqlite3 /app/sql_app.db
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.production)**
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_NAME`: Application name

**Backend (.env.production)**
- `SECRET_KEY`: JWT secret (change in production!)
- `DATABASE_URL`: Database connection
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration

## 📊 Performance Monitoring

### Health Checks
- Backend: http://localhost:8000/health
- Frontend: http://localhost/health
- Full system: http://localhost

### Resource Usage
```bash
# Monitor resource usage
docker stats

# Check disk usage
docker system df
```

## 🚨 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find and kill process using port 80
netstat -ano | findstr :80
taskkill /PID <PID> /F
```

**Database Issues**
```bash
# Reset database
docker-compose down
docker volume rm uk-commission-admin-panel_backend_data
docker-compose up --build -d
```

**Performance Issues**
```bash
# Allocate more resources to Docker
# Docker Desktop -> Settings -> Resources
# Increase CPU/Memory limits
```

### Logs Location
- Container logs: `docker-compose logs`
- Application logs: Inside containers at `/app/logs/`

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest changes (if using Git)
git pull origin main

# Rebuild and restart
docker-compose up --build -d
```

### Backup Data
```bash
# Create backup
docker exec uk-commission-backend tar -czf /app/data/backup_$(date +%Y%m%d_%H%M%S).tar.gz /app/sql_app.db
```

## 🌐 Production Deployment (External Access)

For external client access, configure:

1. **Domain Setup**: Point domain to server IP
2. **SSL Certificate**: Add SSL certificates to `nginx/ssl/`
3. **Firewall**: Open ports 80, 443
4. **Environment**: Update URLs in `.env.production` files

## 📞 Support

For technical support or questions:
- Check logs: `docker-compose logs -f`
- Restart services: `docker-compose restart`
- Full reset: `docker-compose down && docker-compose up --build -d`

## 🎯 Testing Checklist for Client

- [ ] Application loads at http://localhost
- [ ] Login works with provided credentials
- [ ] Dashboard displays data correctly
- [ ] **AI Analytics Panel** is accessible and interactive
- [ ] Consultant management functions work
- [ ] Filters and search operate properly
- [ ] **Real-time notifications** appear
- [ ] **Market intelligence** displays live data
- [ ] Commission calculations are accurate
- [ ] All major features are responsive
- [ ] No console errors in browser
- [ ] Performance is acceptable
