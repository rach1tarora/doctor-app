# Use Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package*.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy .env file
COPY .env ./

# Copy application code
COPY . .

# Expose port
EXPOSE 3001

# Run command
CMD ["node", "index.js"]