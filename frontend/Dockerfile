# Development stage only (since we're focusing on dev mode first)
FROM node:18-alpine

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the source code
COPY . .

# Verify and create necessary directories
RUN mkdir -p /app/src/app && \
    echo "Verifying project structure:" && \
    ls -la /app/src/app

# Development-specific settings
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true

# Expose port
EXPOSE 3000

# Start in development mode with additional debugging
CMD ["sh", "-c", "echo 'Project structure:' && ls -R /app/src && npm run dev -- -H 0.0.0.0"]
