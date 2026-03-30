const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/products', require('./routes/products'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'LIBERO Italia',
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send('LIBERO Italia API Service');
});

module.exports = app;
