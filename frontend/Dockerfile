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

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]