FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
# Migrations run on start (R6 M4.1) — the compiled dist/migrate.js loads them at ../migrations.
COPY --from=builder /app/migrations ./migrations
EXPOSE 3002
CMD ["node", "dist/index.js"]
