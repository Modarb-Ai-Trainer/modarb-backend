# Use the official Node.js v18 image as the base image
FROM node:18

# install python3 and pip
RUN apt-get update && apt-get install -y python3 python3-pip

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
#RUN npm run build

# Set the PORT environment variable
ENV PORT=7860
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG DB_URI

# install python dependencies
RUN pip3 install -r requirements.txt

# Expose the port on which your application will run
EXPOSE $PORT

# Command to run the application
CMD "python3 models-server/server.py & npm run start:dev"
