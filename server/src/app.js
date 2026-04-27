const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// All routes
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/reviews',    require('./routes/reviews'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/upload',     require('./routes/upload'));
app.use('/api/payment',    require('./routes/payment'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'LIBERO Italia', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;
