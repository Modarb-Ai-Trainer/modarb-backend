# Use the official Node.js v18 image as the base image
FROM node:18

RUN if id -u 1000 &> /dev/null; then \
        uid=$(shuf -i 1001-65535 -n 1) \
        && useradd -m -u $uid user; \
    else \
        useradd -m -u 1000 user; \
    fi

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY --chown=user package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY --chown=user . .

# remove .env file if it exists
RUN rm -f -- .env

# Build the TypeScript code
#RUN npm run build

USER user

# Set the PORT environment variable
ENV PORT=7860
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG DB_URI
ARG MODELS_SERVER_URL

# Expose the port on which your application will run
EXPOSE $PORT

# Command to run the application
CMD ["npm", "run", "start:dev"]
