#!/bin/bash

# Set NODE_ENV to production for the build
export NODE_ENV=production

# Increase node memory limit for build process
export NODE_OPTIONS="--max-old-space-size=4096"

# Build the frontend with increased chunk size limit (temporary env var for build only)
echo "Building frontend..."
VITE_MAX_CHUNK_SIZE=1000 npm run build

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

# Create a .npmrc file to skip optional dependencies that might be causing issues
echo "progress=false" > .npmrc
echo "ignore-optional=true" >> .npmrc
echo "fund=false" >> .npmrc
echo "audit=false" >> .npmrc

# Create a simple package.json for functions to enforce ESM
cat > package.json << EOF
{
  "name": "cleandaze-functions",
  "version": "1.0.0",
  "type": "commonjs",
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "passport": "^0.6.0",
    "passport-local": "^1.0.0",
    "memorystore": "^1.6.7",
    "cors": "^2.8.5",
    "serverless-http": "^3.2.0",
    "@neondatabase/serverless": "^0.6.0",
    "drizzle-orm": "^0.28.5",
    "drizzle-zod": "^0.5.1",
    "zod": "^3.21.4"
  }
}
EOF

echo "Build completed successfully!"