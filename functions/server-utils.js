// CommonJS replacement for server/vite.ts ESM dependencies
const path = require('path');
const express = require('express');
const fs = require('fs');

// Helper function to log messages consistently
function log(message, type = "info", source = "netlify-function") {
  const timestamp = new Date().toISOString();
  
  if (type === 'error') {
    console.error(`[${timestamp}] [${source}] ERROR: ${message}`);
  } else if (type === 'warn') {
    console.warn(`[${timestamp}] [${source}] WARNING: ${message}`);
  } else {
    console.log(`[${timestamp}] [${source}] ${message}`);
  }
}

// Simple implementation to serve static files
function serveStatic(app) {
  // Serve static files from the dist/public directory
  app.use(express.static('dist/public'));
  
  log("Static file serving configured");
}

module.exports = {
  log,
  serveStatic
};