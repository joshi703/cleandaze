#!/bin/bash

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
npm install express express-session passport passport-local memorystore cors serverless-http

echo "Build completed successfully!"