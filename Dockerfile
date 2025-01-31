# Use a smaller and more secure Node.js image
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) first for better caching
COPY package*.json ./

# Install dependencies with production flag (faster & smaller image)
RUN npm install --only=production

# Copy all other project files
COPY . .

# Expose application port
EXPOSE 3000

# Set a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Default command to start the application
CMD ["npm", "start"]
