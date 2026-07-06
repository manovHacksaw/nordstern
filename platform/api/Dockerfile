# Dev image for the platform control-plane API (Drizzle + tsx runtime).
# Schema is applied by the one-shot `platform-migrate` service (drizzle-kit push)
# in docker-compose.platform.yml; this image just runs the server.
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json drizzle.config.ts ./
COPY src ./src
EXPOSE 4000
CMD ["node", "--import", "tsx", "src/server.ts"]
