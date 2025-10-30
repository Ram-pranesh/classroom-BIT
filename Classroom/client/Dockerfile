# Build stage
FROM node:18-alpine AS build
WORKDIR /app

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
# Optional: copy a custom nginx.conf if you need rewrites
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
