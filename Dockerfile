# ============================================================================
# PRODUCTION DOCKERFILE FOR SKYBRIDGE CLOUDMART
# Course: SOFT807 Cloud Applications Development - Assessment 1
# Platform: Multi-Cloud Container Deployment (Docker / AWS ECS / Render / Railway)
# ============================================================================

# Step 1: Base image using stable lightweight Node.js LTS
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy package descriptors first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source code
COPY server.js ./
COPY public ./public

# Expose default HTTP traffic port
EXPOSE 3000

# Health check to ensure container status is actively monitored
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/status || exit 1

# Execute server process
CMD ["node", "server.js"]
