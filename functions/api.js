// Explicitly requiring all dependencies to avoid resolution issues
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');

// Use our CommonJS-compatible utilities instead of the ESM server/vite.ts
const { log, serveStatic } = require('./server-utils');

// Safely require the storage module with error handling
let storage;
try {
  const storageModule = require('../server/storage');
  storage = storageModule.storage;
} catch (error) {
  log('Error loading storage module: ' + error.message, 'error');
  // Fallback to empty storage if needed
  storage = {};
}

// Import routes setup function with error handling
let registerRoutes;
try {
  const routesModule = require('../server/routes');
  registerRoutes = routesModule.registerRoutes;
} catch (error) {
  log('Error loading routes module: ' + error.message, 'error');
  // Provide a fallback routes function if needed
  registerRoutes = (app) => {
    app.get('/.netlify/functions/api/health', (req, res) => {
      res.json({ status: 'API is running, but routes failed to load' });
    });
  };
}

// Create Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(express.json());

// Configure session
app.use(
  session({
    cookie: { maxAge: 86400000 }, // 24 hours
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'cleandaze-secret'
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with error handling
try {
  const authModule = require('../server/auth');
  if (typeof authModule.setupAuth === 'function') {
    authModule.setupAuth(app);
  } else {
    log('setupAuth is not a function in auth module', 'warn');
  }
} catch (error) {
  log('Error configuring authentication: ' + error.message, 'error');
  // Add basic health endpoints if auth fails (both Netlify and Vercel paths)
  app.get('/.netlify/functions/api/auth-status', (req, res) => {
    res.json({ status: 'Auth setup failed', platform: 'netlify', error: error.message });
  });
  
  app.get('/api/auth-status', (req, res) => {
    res.json({ status: 'Auth setup failed', platform: 'vercel', error: error.message });
  });
}

// Add basic health check endpoints for both Netlify and Vercel
app.get('/.netlify/functions/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'netlify', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'vercel', timestamp: new Date().toISOString() });
});

// Configure static file serving for production assets
serveStatic(app);

// Register API routes with error handling
try {
  registerRoutes(app);
} catch (error) {
  log('Error registering routes: ' + error.message, 'error');
  app.use((req, res, next) => {
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to register API routes', 
        message: 'The application is experiencing technical difficulties'
      });
    }
  });
}

// Error handling middleware
app.use((err, _req, res, _next) => {
  log(err.stack || err.message || String(err), 'error', 'middleware-error');
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Export the serverless function
// Netlify expects module.exports.handler
module.exports.handler = serverless(app);
// Vercel expects module.exports
// The vercel-build.sh script will handle the transformation for Vercel deployment
module.exports = serverless(app);