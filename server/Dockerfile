# Base stage for common dependencies
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json .npmrc* ./
RUN pnpm install --frozen-lockfile --ignore-scripts=false

# Development stage
FROM base AS dev
COPY . .
RUN pnpm install --ignore-scripts=false
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
COPY . .
RUN pnpm install --ignore-scripts=false && pnpm build

# Production stage
FROM node:22-slim AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
RUN npm install --omit=dev
EXPOSE 3001
CMD ["npm", "start"]
