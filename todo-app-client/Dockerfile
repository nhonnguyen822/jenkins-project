# Build stage - sử dụng node:lts-alpine thay vì node:18-alpine
FROM node:lts-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies với offline mode
RUN npm ci --only=production --prefer-offline

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - sử dụng nginx:stable-alpine
FROM nginx:stable-alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]