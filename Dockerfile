# Use Node.js Image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy application files
COPY . .

# Expose the application port
EXPOSE 8080

# Start using npm start
CMD ["npm", "start"]
