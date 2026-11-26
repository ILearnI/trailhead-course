# Build stage: everything needed to compile
FROM node:24-bookworm-slim AS build
WORKDIR /app
# The database driver is compiled from C
RUN apt-get update && apt-get install -y python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
# The libraries first: this layer is cached
COPY package.json package-lock.json ./
RUN npm ci
# Then our code
COPY . .
# The build reads the database
RUN mkdir -p data && npx drizzle-kit migrate && node scripts/seed.mjs
# Pages are made from the API: it runs here
RUN node mock-api/server.mjs & sleep 2 && npm run build

# Run stage: only what the server needs
FROM node:24-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production
# Listen on every address of the container
ENV HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/data ./data
COPY --from=build --chown=node:node /app/mock-api ./mock-api
COPY --from=build --chown=node:node /app/src/data ./src/data
COPY healthcheck.mjs ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --start-period=10s CMD ["node", "healthcheck.mjs"]
CMD ["node", "server.js"]
