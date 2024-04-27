# Use the official Node.js v18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY . .

# remove .env file if it exists
RUN rm -f -- .env

# Build the TypeScript code
RUN npm run build

# Set the PORT environment variable
ENV PORT=3000

# Expose the port on which your application will run
EXPOSE $PORT

# Command to run the application
CMD ["node", "dist/index.js"]
