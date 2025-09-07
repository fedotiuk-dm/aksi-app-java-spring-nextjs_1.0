#!/bin/bash

# VPS Deployment Script for application demonstration
# Usage: ./deploy-vps.sh

set -e

echo "🚀 Deploying application to VPS..."

# Check Docker availability
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker."
    exit 1
fi

# Check docker-compose availability
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose."
    exit 1
fi

# Create directories if they don't exist
echo "📁 Creating necessary directories..."
mkdir -p pgadmin/config
mkdir -p traefik/dynamic
mkdir -p uploads

# Copy configuration files
echo "📋 Copying configuration..."
if [ ! -f "pgadmin/config/servers.json" ]; then
    cp pgadmin/config/servers.json.example pgadmin/config/servers.json 2>/dev/null || echo "⚠️  Create pgadmin/config/servers.json"
fi

if [ ! -f "pgadmin/pgpass" ]; then
    cp pgadmin/pgpass.example pgadmin/pgpass 2>/dev/null || echo "⚠️  Create pgadmin/pgpass"
fi

# Stop previous containers
echo "🛑 Stopping previous containers..."
docker-compose -f docker-compose.vps.yml down || true

# Clean old images (optional)
echo "🧹 Cleaning old Docker resources..."
docker system prune -f

# Start services
echo "🐳 Starting services..."
docker-compose -f docker-compose.vps.yml up -d

# Wait for services readiness
echo "⏳ Waiting for services to start..."
sleep 30

# Check status
echo "📊 Checking services status..."
docker-compose -f docker-compose.vps.yml ps

# Check health endpoints
echo "🔍 Checking services health..."
echo "PostgreSQL health:"
docker exec postgres-dev pg_isready -U aksi_user -d aksi_cleaners_db_v5 || echo "⚠️  PostgreSQL is still starting..."

echo "Backend health:"
curl -f http://localhost:8080/management/health || echo "⚠️  Backend is still starting..."

echo "Frontend health:"
curl -f http://localhost:3000 || echo "⚠️  Frontend is still starting..."

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🌐 Available services:"
echo "   Frontend:     http://YOUR_VPS_IP:3000"
echo "   Backend API:  http://YOUR_VPS_IP:8080"
echo "   PgAdmin:      http://YOUR_VPS_IP:5050 (admin@aksi.com / admin)"
echo "   GlitchTip:    http://YOUR_VPS_IP:8000 (admin / admin123)"
echo "   Portainer:    http://YOUR_VPS_IP:9000"
echo ""
echo "📝 For logs viewing:"
echo "   docker-compose -f docker-compose.vps.yml logs -f [service_name]"
echo ""
echo "🔄 For application update:"
echo "   docker-compose -f docker-compose.vps.yml pull && docker-compose -f docker-compose.vps.yml up -d"
echo ""
echo "🛑 To stop:"
echo "   docker-compose -f docker-compose.vps.yml down"
