# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./

# Install dependencies
RUN npm ci

# Copy source
COPY src ./src

# Build app
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8080

# Set environment variables for GCP
ENV PORT=8080
ENV HOST=0.0.0.0

# Start server
CMD ["serve", "-s", "dist", "-l", "8080"]
