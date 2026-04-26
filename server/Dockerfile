# Production Dockerfile for Server
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
# If there's a build step for the server (e.g. TS), run it here
# RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY . .

EXPOSE 5001

# For production, we use a start script that doesn't use nodemon/dev tools
CMD ["node", "src/index.js"]
