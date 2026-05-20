FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY . .

# Expose port (Railway overrides this with process.env.PORT, but it's good practice)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
