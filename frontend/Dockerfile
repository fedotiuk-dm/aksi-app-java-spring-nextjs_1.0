# Production Dockerfile for Next.js with multi-stage build
# Stage 1: Dependencies
FROM node:lts-alpine3.21 AS deps

# Встановлюємо базові залежності
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Копіюємо package files
COPY package*.json ./

# Встановлюємо залежності
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Builder
FROM node:lts-alpine3.21 AS builder

WORKDIR /app

# Копіюємо node_modules з dependencies stage
COPY --from=deps /app/node_modules ./node_modules

# Копіюємо весь проект
COPY . .

# Встановлюємо всі залежності (включаючи dev)
RUN npm ci

# Встановлюємо environment variables для build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Будуємо додаток
RUN npm run build

# Stage 3: Runtime
FROM node:lts-alpine3.21 AS runner

# Встановлюємо метадані
LABEL version="1.0"
LABEL description="AKSI Frontend Production"
LABEL maintainer="AKSI Development Team"

# Встановлюємо базові залежності
RUN apk add --no-cache \
    bash \
    curl \
    dumb-init

WORKDIR /app

# Створюємо non-root користувача
RUN addgroup -g 1000 nextjs && \
    adduser -D -s /bin/bash -u 1000 -G nextjs nextjs

# Встановлюємо environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Копіюємо необхідні файли для standalone
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

# Переключаємося на non-root користувача
USER nextjs

# Відкриваємо порт
EXPOSE 3000

# Додаємо healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Точка входу
ENTRYPOINT ["dumb-init", "--"]

# Команда для запуску standalone server
CMD ["node", "server.js"]
