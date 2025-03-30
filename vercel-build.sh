#!/bin/bash

# Set NODE_ENV to production for the build
export NODE_ENV=production

# Increase node memory limit for build process
export NODE_OPTIONS="--max-old-space-size=4096"

# Build the frontend
echo "Building frontend..."
npm run build

# Create functions directory if it doesn't exist
mkdir -p functions

# Copy necessary server files to functions directory
echo "Preparing serverless functions..."
cp -r server functions/server
cp -r shared functions/shared

# Install production dependencies for serverless functions
echo "Installing dependencies for serverless functions..."
cd functions
npm init -y
npm install express express-session passport passport-local memorystore cors serverless-http @neondatabase/serverless drizzle-orm drizzle-zod zod

# Make api.js root handler aware (for Vercel compatibility)
echo "Adjusting API for Vercel deployment..."
sed -i 's/module.exports.handler = serverless(app);/module.exports = serverless(app);/g' api.js

echo "Build completed successfully!"