# Getting Started Guide

Welcome to the Modarb Backend! This guide will help you set up and run the server locally on your machine.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Docker Setup](#docker-setup)
- [Troubleshooting](#troubleshooting)

## Overview

Modarb Backend is a Node.js/Express backend server built with TypeScript and MongoDB. It provides APIs for fitness-related features including exercises, meals, and user management.

**Related Project:** [Models Server](https://github.com/MoWafy001/modarb-models-server)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local installation or cloud instance) - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download here](https://git-scm.com/downloads)

To verify your installations, run:

```bash
node --version    # Should be v18 or higher
npm --version     # Should be 6.x or higher
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MoWafy001/modarb-backend.git
   cd modarb-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   This will install all required packages listed in `package.json`.

## Configuration

1. **Create a `.env` file:**

   Copy the example environment file and customize it:

   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables:**

   Open the `.env` file and set the following required variables:

   ```env
   # Server Configuration
   PORT=7860                          # Port number for the server (default: 7860)

   # Database Configuration
   DB_URI=mongodb://localhost:27017/modarb  # MongoDB connection string

   # JWT Configuration
   JWT_SECRET=your-super-secret-key-change-this  # Secret key for JWT tokens
   JWT_EXPIRES_IN=7d                             # Token expiration time (e.g., 7d, 24h)

   # Models Server Configuration
   MODELS_SERVER_URL=http://localhost:5000       # URL to the ML models server

   # Optional Configuration
   HOST=http://localhost              # Host URL (default: http://localhost)
   SWAGGER_SERVER=                    # Swagger server URL (optional)
   SALT_ROUNDS=5                      # Bcrypt salt rounds (default: 5)
   ```

   **Important Notes:**
   - Replace `your-super-secret-key-change-this` with a strong, random secret key
   - If using MongoDB Atlas, replace `DB_URI` with your Atlas connection string
   - The `MODELS_SERVER_URL` should point to your running models server instance

## Database Setup

### Option 1: Local MongoDB

If you're running MongoDB locally:

1. **Start MongoDB:**

   ```bash
   # On macOS (with Homebrew)
   brew services start mongodb-community

   # On Linux
   sudo systemctl start mongod

   # On Windows
   # MongoDB should start automatically as a service
   ```

2. **Verify MongoDB is running:**

   ```bash
   # Connect to MongoDB shell
   mongosh
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and update `DB_URI` in `.env`
4. Make sure to whitelist your IP address in Atlas

### Seeding the Database

The project includes seeders to populate your database with initial data:

1. **Seed the database with sample data:**

   ```bash
   npm run seed
   ```

2. **Reset and re-seed the database:**

   ```bash
   npm run seed:reset
   ```

   ⚠️ **Warning:** This will delete all existing data and re-populate the database.

## Running the Server

### Development Mode (Recommended)

Run the server with hot-reloading for development:

```bash
npm run start:dev
```

The server will start on the port specified in your `.env` file (default: 7860).

You should see output similar to:

```
Connected to MongoDB database successfully!
Server is up and running on port 7860!
```

### Production Mode

1. **Build the TypeScript code:**

   ```bash
   npm run build
   ```

   This compiles TypeScript to JavaScript in the `dist/` directory.

2. **Start the production server:**

   ```bash
   npm start
   ```

## Available Scripts

The following npm scripts are available:

| Script | Command | Description |
|--------|---------|-------------|
| `start:dev` | `npm run start:dev` | Run the server in development mode with hot-reloading |
| `start` | `npm start` | Build and run the server in production mode |
| `build` | `npm run build` | Compile TypeScript to JavaScript |
| `lint` | `npm run lint` | Check code quality with ESLint |
| `seed` | `npm run seed` | Seed the database with sample data |
| `seed:reset` | `npm run seed:reset` | Reset and re-seed the database |

## API Documentation

Once the server is running, you can access the API documentation:

- **Swagger UI**: Navigate to `http://localhost:7860/api/v1/docs` (or your configured port)
- **Health Check**: Navigate to `http://localhost:7860/api/v1/health` to verify the server is running

The Swagger documentation provides:
- Available endpoints
- Request/response schemas
- Interactive API testing

## Docker Setup

The project includes a Dockerfile for containerized deployment:

1. **Build the Docker image:**

   ```bash
   docker build -t modarb-backend .
   ```

2. **Run the container:**

   ```bash
   docker run -p 7860:7860 \
     -e DB_URI="your-mongodb-uri" \
     -e JWT_SECRET="your-jwt-secret" \
     -e JWT_EXPIRES_IN="7d" \
     -e MODELS_SERVER_URL="http://models-server:5000" \
     modarb-backend
   ```

   Replace the environment variables with your actual values.

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `mongosh` or `mongo`
- Check your `DB_URI` in `.env` is correct
- If using MongoDB Atlas, ensure your IP is whitelisted

#### 2. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::7860`

**Solution:**
- Change the `PORT` in your `.env` file to a different port
- Or kill the process using the port:
  ```bash
  # On Linux/macOS
  lsof -ti:7860 | xargs kill -9

  # On Windows
  netstat -ano | findstr :7860
  taskkill /PID <PID> /F
  ```

#### 3. Missing Dependencies

**Error:** `Cannot find module 'xxx'`

**Solution:**
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

#### 4. TypeScript Build Errors

**Error:** TypeScript compilation errors

**Solution:**
- Ensure you're using Node.js v18 or higher
- Clean the build directory:
  ```bash
  rm -rf dist
  npm run build
  ```

#### 5. Models Server Not Available

**Error:** Connection errors to models server

**Solution:**
- Ensure the models server is running at the URL specified in `MODELS_SERVER_URL`
- Check the [models server repository](https://github.com/MoWafy001/modarb-models-server) for setup instructions

### Getting Help

If you encounter issues not covered here:

1. Check the [Issues](https://github.com/MoWafy001/modarb-backend/issues) page on GitHub
2. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Error messages
   - Your environment (OS, Node version, etc.)

## Next Steps

Now that your server is running:

1. ✅ Explore the API documentation at `/api/v1/docs`
2. ✅ Test the health endpoint at `/api/v1/health`
3. ✅ Set up the [Models Server](https://github.com/MoWafy001/modarb-models-server)
4. ✅ Review the codebase structure in `src/`
5. ✅ Start building your frontend or mobile app!

---

**Happy coding! 🚀**
