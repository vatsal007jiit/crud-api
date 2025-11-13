# CB_Admin_v2.0/Dockerfile  (multi-stage)
# build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install build deps
COPY package*.json ./
RUN npm ci --production=false

# Copy prisma and source

COPY . .

# Generate Prisma client and build

RUN npm run build

# production stage
FROM node:22-alpine AS runner
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --production=true

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]
