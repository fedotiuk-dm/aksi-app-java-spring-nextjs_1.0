# VPS Deployment Guide

## 🚀 Quick Deployment

### Prerequisites

- Ubuntu 22.04+ VPS with at least 6GB RAM
- Docker and Docker Compose installed
- SSH access to VPS

### 1. Prepare VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again to apply docker group
```

### 2. Clone and Deploy

```bash
# Clone repository
git clone YOUR_REPO_URL aksi-app
cd aksi-app

# Go to docker directory
cd docker

# Make deployment script executable
chmod +x deploy-vps.sh

# Run deployment
./deploy-vps.sh
```

## 🌐 Access Services

After deployment, services will be available on:

| Service     | URL                     | Credentials            |
| ----------- | ----------------------- | ---------------------- |
| Frontend    | http://YOUR_VPS_IP:3000 | -                      |
| Backend API | http://YOUR_VPS_IP:8080 | -                      |
| PgAdmin     | http://YOUR_VPS_IP:5050 | admin@aksi.com / admin |
| GlitchTip   | http://YOUR_VPS_IP:8000 | admin / admin123       |
| Portainer   | http://YOUR_VPS_IP:9000 | -                      |

## 🔄 Updates

### For application updates:

```bash
cd docker
docker-compose -f docker-compose.vps.yml pull
docker-compose -f docker-compose.vps.yml up -d
```

### For configuration changes:

```bash
cd docker
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml up -d
```

## 📊 Monitoring

### Check services status:

```bash
docker-compose -f docker-compose.vps.yml ps
```

### View logs:

```bash
docker-compose -f docker-compose.vps.yml logs -f [service_name]
```

### Resource usage:

```bash
docker stats
```

## 🛑 Troubleshooting

### If services don't start:

```bash
# Check available resources
free -h
df -h

# Clean Docker resources
docker system prune -f
```

### If ports are busy:

```bash
# Check what's using ports
sudo lsof -i :3000
sudo lsof -i :8080
```

### Reset everything:

```bash
cd docker
docker-compose -f docker-compose.vps.yml down -v
docker-compose -f docker-compose.vps.yml up -d
```

## 🔒 Security Notes

- Change default passwords in production
- Use firewall to restrict access to sensitive ports
- Consider using reverse proxy (nginx/traefik) for SSL
- Regularly update Docker images

## 📋 Configuration

### Environment Variables

Edit `docker-compose.vps.yml` to customize:

- Database credentials
- GlitchTip admin credentials
- Memory limits
- Port mappings

### Database Backup

```bash
# Backup database
docker exec postgres-dev pg_dump -U aksi_user aksi_cleaners_db_v5 > backup.sql

# Restore database
docker exec -i postgres-dev psql -U aksi_user aksi_cleaners_db_v5 < backup.sql
```
