# Use Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate Client
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of the code
COPY . .

# Expose the API port
EXPOSE 5001

# Start the server
CMD ["npm", "run", "dev"]
