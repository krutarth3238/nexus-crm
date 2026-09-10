const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./config/env');

const {
  errorHandler,
  AppError,
} = require('./middleware/errorHandler');

const { rateLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/tickets.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

app.use(
  cors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Organization-ID',
    ],
  })
);

app.use(express.json());

app.use(
  morgan(
    config.nodeEnv === 'production'
      ? 'combined'
      : 'dev'
  )
);

app.use(rateLimiter);

app.get('/health', (req, res) =>
  res.status(200).json({
    status: 'ok',
  })
);

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/tickets', ticketRoutes);

app.use('/api/v1/analytics', analyticsRoutes);

app.use((req, res, next) =>
  next(
    new AppError(
      404,
      'NOT_FOUND',
      `Route ${req.method} ${req.originalUrl} not found`
    )
  )
);

app.use(errorHandler);

module.exports = app;
