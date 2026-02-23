# Base stage for common dependencies
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY server/package.json ./server/
RUN pnpm install --frozen-lockfile --ignore-scripts=false

# Development stage
FROM base AS dev
COPY . .
EXPOSE 3001
CMD ["pnpm", "--filter", "battle-chess-server", "run", "dev"]

# Build stage
FROM base AS build
COPY . .
RUN pnpm --filter battle-chess-server run build

# Production stage
FROM node:22-slim AS prod
WORKDIR /app
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/server/package.json ./
RUN npm install --omit=dev
EXPOSE 3001
CMD ["npm", "start"]
