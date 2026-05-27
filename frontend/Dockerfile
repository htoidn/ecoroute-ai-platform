FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
# Install all dependencies (including devDependencies) in the builder stage so
# the project can be built. We use --legacy-peer-deps to avoid failed peer
# resolution during the Docker build (keeps behavior consistent with local dev).
RUN npm install --legacy-peer-deps --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Use a custom nginx config that falls back to index.html for SPA routes
# so direct navigation to /login, /search, etc. works when served by nginx.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]