const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const visualiseRoutes = require('./routes/visualise');

const app = express();
const prisma = new PrismaClient();

const cache = new Map();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked for this origin'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

const requireApiKey = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') return next();

  const expected = process.env.BACKEND_API_KEY;
  const provided = req.header('x-api-key');

  if (!expected) {
    return res.status(503).json({ error: 'Server auth not configured' });
  }

  if (provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
};

app.use((req, _res, next) => {
  req.prisma = prisma;
  req.cache = cache;
  next();
});

app.use('/api/visualise', requireApiKey, visualiseRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
