# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Accept build arguments for Vite
ARG VITE_SERVER_APP_URL
ARG VITE_GOOGLE_CLIENT_ID

# Expose them as ENV so Vite can embed at build time
ENV VITE_SERVER_APP_URL=$VITE_SERVER_APP_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Copy package files first, install dependencies (leverages cache)
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Production stage - serve with nginx
FROM nginx:stable-alpine
# Remove default nginx content and copy built assets
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing and caching
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
