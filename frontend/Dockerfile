# Stage 1: Build Angular SPA
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package.json ./

# Install dependencies strictly matching package.json
RUN npm install

# Copy source code and configuration
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine AS runtime

# Remove default Nginx static assets to avoid default page fallback
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from Stage 1 (Angular 19 browser bundle)
COPY --from=build /app/dist/portfolio-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
