# Build stage
FROM --platform=linux/arm64 node:20 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM --platform=linux/arm64 node:20

WORKDIR /usr/src/app

COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Add non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/bash -m nestjs && \
    chown -R nestjs:nodejs /usr/src/app
USER nestjs

EXPOSE 3000

CMD ["node", "--enable-source-maps", "--experimental-modules", "--experimental-specifier-resolution=node", "--max-old-space-size=512", "dist/main.js"] 