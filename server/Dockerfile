# Production Dockerfile for Server
FROM node:20-alpine AS builder

# Install OpenSSL (required by Prisma)
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
# If there's a build step for the server (e.g. TS), run it here
# RUN npm run build

FROM node:20-alpine

# Install OpenSSL (required by Prisma at runtime)
RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY . .

EXPOSE 5001

# For production, we sync the DB then start the server
CMD npx prisma db push && node src/index.js
