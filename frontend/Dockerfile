# Stage 1: Build the Next.js application
FROM node:22.14.0-alpine3.20@sha256:40be979442621049f40b1d51a26b55e281246b5de4e5f51a18da7beb6e17e3f9 AS build
WORKDIR /app

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_TYPE_CHECK=true

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all other files
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Run the application
FROM node:22.14.0-alpine3.20@sha256:40be979442621049f40b1d51a26b55e281246b5de4e5f51a18da7beb6e17e3f9 AS production
WORKDIR /app

# Add non-root user
RUN addgroup --system nextjs && \
    adduser --system nextjs --ingroup nextjs

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://backend:8080/api
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built files and dependencies from build stage
COPY --from=build --chown=nextjs:nextjs /app/package.json /app/package-lock.json ./
COPY --from=build --chown=nextjs:nextjs /app/public ./public
COPY --from=build --chown=nextjs:nextjs /app/.next ./.next
COPY --from=build --chown=nextjs:nextjs /app/node_modules ./node_modules

# Expose the application port
EXPOSE 3000

# Use non-root user
USER nextjs:nextjs

# Command to run the application
CMD ["npm", "start"] 