# ---- Server Dockerfile ----
FROM node:18-alpine
WORKDIR /app

# Install runtime dependencies
# When building with context set to the `server` folder, the package files are
# at the root of the build context — so copy them directly.
COPY package*.json ./
RUN npm ci --silent

# Copy app source (all files from the server build context)
COPY . .

# Create non-root user (optional but better for security)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the port your server uses (update if different)
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
