# Base stage for common dependencies
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./

# Development stage
FROM base AS dev
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts=false
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "3000"]

# Build stage
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts=false
COPY . .
RUN pnpm build

# Production stage
FROM nginx:stable-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
