# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Clear any existing .next directory
RUN rm -rf .next

# Build the application
RUN npm run build

# Development stage
FROM node:18-alpine

WORKDIR /app

# Copy dependencies and build files from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./

# Expose port
EXPOSE 3000

# Start the development server with the build files
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]
