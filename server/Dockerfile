# Production Dockerfile for Server
FROM node:20-slim AS builder

# Install OpenSSL and other deps required by Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

FROM node:20-slim

# Install OpenSSL (required by Prisma at runtime)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY . .

EXPOSE 5001

# Sync DB schema then start the server
CMD npx prisma db push && node src/index.js
