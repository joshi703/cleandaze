const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');
const { storage } = require('../server/storage');

// Import routes setup function
const { registerRoutes } = require('../server/routes');

// Create Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(bodyParser.json());

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

// Configure Passport
const { setupAuth } = require('../server/auth');
setupAuth(app);

// Register API routes
registerRoutes(app);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Export the serverless function
module.exports.handler = serverless(app);