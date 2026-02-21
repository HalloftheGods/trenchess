# Base stage for common dependencies
FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json ./
# Assuming server doesn't have its own pnpm-lock.yaml or we use the root one if it's a workspace
# But based on file list, server has its own pnpm-lock.yaml? Wait, I saw pnpm-lock.yaml in root.
# Let's check listing again.
# Root has pnpm-lock.yaml. Server has package.json.
# Actually server/package-lock.json exists? Let me re-read list_dir output.
# server/package-lock.json exists. So it uses npm? 
# Root uses pnpm. Server uses npm. That's a bit inconsistent but I'll respect it.

# Development stage
FROM base AS dev
COPY . .
RUN npm install
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
COPY . .
RUN npm install && npm run build

# Production stage
FROM node:23-slim AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
RUN npm install --omit=dev
EXPOSE 3001
CMD ["npm", "start"]
