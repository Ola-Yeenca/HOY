# Development stage
FROM node:18-alpine

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy only necessary files
COPY tsconfig*.json ./
COPY next.config.js ./
COPY public ./public
COPY src ./src

# Development-specific settings
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true

# Expose port
EXPOSE 3000

# Start development server with optimized settings
CMD ["npm", "run", "dev", "--", "--turbo"]
