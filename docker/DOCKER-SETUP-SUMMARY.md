# 🐳 Docker Dev Environment - Setup Complete

## ✅ What was done

### 1. **Backend Configuration Updated**

- ✅ Added `spring-boot-devtools` to `pom.xml` for hot reload
- ✅ Updated `application.yml` with environment variables and dev profile
- ✅ Created new `Dockerfile.dev` with improved hot reload support
- ✅ Added `.dockerignore` for Docker context optimization

### 2. **Docker Compose Updated**

- ✅ Synchronized DB parameters (`aksi_cleaners_db_v5`, password: `1911`)
- ✅ Added debug port 5005 for backend
- ✅ Configured volume mounting for hot reload
- ✅ Added DevTools environment variables

### 3. **Helper Scripts Created**

- ✅ `start-dev-updated.sh` - automatic dev environment startup
- ✅ `reset-dev.sh` - cleanup and reset environment
- ✅ `README-DEV-UPDATED.md` - complete documentation

### 4. **Liquibase Migrations Configured**

- ✅ Created `001-create-client-tables.yaml` - DB structure for Client domain
- ✅ Created `002-insert-client-seed-data.yaml` - test data
- ✅ Configured automatic migration execution on startup

## 🚀 How to start

### Quick start

```bash
cd docker
chmod +x start-dev-updated.sh reset-dev.sh
./start-dev-updated.sh
```

### Or manually

```bash
cd docker
docker-compose -f docker-compose.dev.yml up --build
```

## 🔥 Hot Reload works for:

### Backend (Spring Boot)

- ☕ Automatic restart on Java file changes
- 🔧 LiveReload for resources
- 🐛 Debug on port 5005
- ⚡ DevTools enabled

### Frontend (Next.js)

- ⚛️ Fast Refresh for React components
- 🔄 Hot Module Replacement (HMR)
- 💨 Quick changes without reloading

## 🗄️ Database

### Connection parameters

```yaml
Host: localhost (or postgres for containers)
Port: 5432
Database: aksi_cleaners_db_v5
Username: aksi_user
Password: 1911
```

### GlitchTip Error Monitoring

```
URL: http://localhost:8001
Username: admin
Password: admin123
Email: admin@glitchtip.local
```

**What it monitors:**

- ✅ Backend (Spring Boot) errors and performance
- ✅ Frontend (Next.js) errors and performance
- ✅ Automatic grouping of similar errors
- ✅ Real-time alerts and notifications

### PgAdmin

```
URL: http://localhost:5050
Email: admin@aksi.com
Password: admin
```

## 🌐 Available services

| Service       | URL                                       | Purpose                 |
| ------------- | ----------------------------------------- | ----------------------- |
| Frontend      | http://localhost:3000                     | Next.js UI              |
| Backend API   | http://localhost:8080/api                 | Spring Boot REST API    |
| Swagger UI    | http://localhost:8080/api/swagger-ui.html | API documentation       |
| **GlitchTip** | **http://localhost:8001**                 | **Error Monitoring**    |
| PgAdmin       | http://localhost:5050                     | Database web interface  |
| Debug         | localhost:5005                            | Java Remote Debug       |
| Traefik       | http://localhost:9090                     | Load Balancer Dashboard |

## 🔧 Useful commands

### Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Backend only
docker-compose -f docker-compose.dev.yml logs -f backend

# Frontend only
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Management

```bash
# Restart backend
docker-compose -f docker-compose.dev.yml restart backend

# Restart GlitchTip
docker-compose -f docker-compose.dev.yml restart glitchtip

# Quick GlitchTip management
docker-compose -f docker-compose.dev.yml stop glitchtip   # Stop
docker-compose -f docker-compose.dev.yml start glitchtip  # Start
docker-compose -f docker-compose.dev.yml logs -f glitchtip # Follow logs

# Stop everything
docker-compose -f docker-compose.dev.yml down

# Full cleanup
./reset-dev.sh

# 🔧 Useful scripts for target directory:
./clean-target.sh     # Quick target cleanup for OpenAPI regeneration
./rebuild-backend.sh  # Full backend container rebuild
```

### Liquibase

```bash
# Run migrations
cd ../backend
mvn liquibase:update -Dliquibase.contexts=dev

# Migration status
mvn liquibase:status
```

## 🐛 Debug settings

### IntelliJ IDEA

1. Run → Edit Configurations
2. Add New → Remote JVM Debug
3. Host: `localhost`, Port: `5005`
4. Module classpath: backend
5. Start debugging

### VS Code

```json
{
  "type": "java",
  "name": "Debug Backend",
  "request": "attach",
  "hostName": "localhost",
  "port": 5005
}
```

## 📁 Volume structure

```
backend_m2_cache        → Maven dependencies cache
postgres_data_dev       → PostgreSQL data
pgadmin_data_dev        → PgAdmin configuration
frontend_node_modules   → Node.js modules
frontend_next_cache     → Next.js build cache
```

## 🧪 Testing

### Backend tests

```bash
# In container
docker exec backend-dev ./mvnw test

# Locally
cd backend && ./mvnw test
```

### Client Domain tests

```bash
# Tests for Client domain (after migrations are created)
cd backend && ./mvnw test -Dtest="*Client*"
```

### GlitchTip Error Monitoring tests

```bash
# Test API endpoints for GlitchTip verification
curl http://localhost:8080/api/test/error      # Generate backend error
curl http://localhost:8080/api/test/success    # Test successful request
curl http://localhost:8080/api/test/performance # Test performance

# Frontend error testing
open http://localhost:3000/test-glitchtip      # Test page with error buttons

# Check errors in GlitchTip dashboard
open http://localhost:8001

# Test envelope endpoint directly
curl -X POST http://localhost:8001/api/1/envelope/ \
  -H "Content-Type: application/json" \
  -d '{"test": "manual_test"}'
```

## 🔍 Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs backend

# Check database connection
docker exec backend-dev nc -zv postgres 5432
```

### Hot reload doesn't work

```bash
# Check DevTools
docker exec backend-dev grep -r "devtools" /app/target/classes/

# Check volume mounting
docker inspect backend-dev | grep -A 20 "Mounts"
```

### GlitchTip doesn't work

```bash
# Check GlitchTip status
docker-compose -f docker-compose.dev.yml ps glitchtip

# View GlitchTip logs
docker-compose -f docker-compose.dev.yml logs glitchtip

# Check if database is created and accessible
docker exec postgres-glitchtip-dev psql -U glitchtip -d glitchtip -c "SELECT version();"

# Test GlitchTip web interface
curl -s http://localhost:8001/ | grep -o "GlitchTip"

# Test envelope endpoint
curl -s -w "%{http_code}" -X POST http://localhost:8001/api/1/envelope/ \
  -H "Content-Type: application/json" -d '{"test": "health_check"}'

# Check GlitchTip container health
docker inspect glitchtip-dev | grep -A 5 "Health"

# Restart GlitchTip
docker-compose -f docker-compose.dev.yml restart glitchtip

# Full rebuild if needed
docker-compose -f docker-compose.dev.yml up --build -d glitchtip
```

### Database unavailable

```bash
# PostgreSQL status
docker exec postgres-dev pg_isready -U aksi_user

# Connect to database
docker exec -it postgres-dev psql -U aksi_user -d aksi_cleaners_db_v5
```

## 📊 Monitoring

### Spring Boot Actuator

- Health check: http://localhost:8080/api/actuator/health
- Metrics: http://localhost:8080/api/actuator/metrics
- All endpoints: http://localhost:8080/api/actuator

### GlitchTip Error Monitoring

- Dashboard: http://localhost:8001
- Projects: `backend`, `frontend`
- Error tracking: Real-time errors with stack traces
- Performance: Transaction tracing and metrics

### Docker Stats

```bash
docker stats
docker-compose -f docker-compose.dev.yml top
```

---

## 🎯 Next steps

1. **Start** dev environment: `./start-dev-updated.sh`
2. **Check** that all services are running
3. **Test** hot reload by changing a Java class
4. **Connect** to debug on port 5005
5. **Check** Client API via Swagger UI

**Ready for development! 🚀**
