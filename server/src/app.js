const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
