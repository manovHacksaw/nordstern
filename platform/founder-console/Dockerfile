# Build context: platform/ (the npm workspace root) — see docker-compose.platform.yml.
# Installs the workspace so @nordstern/shared-ui + shared-auth resolve, builds only this app.
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
# The /api rewrite destination is baked from API_URL at build time (standalone). Point it
# at platform-api on the compose network so the browser stays same-origin (cookies flow).
ARG API_URL=http://platform-api:4000
ENV API_URL=$API_URL
RUN npm run build -w @nordstern/founder-console

# ── Production image (Next.js standalone; traced from the workspace root) ─────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV API_URL=http://platform-api:4000

COPY --from=builder /app/founder-console/.next/standalone ./
COPY --from=builder /app/founder-console/.next/static ./founder-console/.next/static
COPY --from=builder /app/founder-console/public ./founder-console/public

EXPOSE 3000
CMD ["node", "founder-console/server.js"]
