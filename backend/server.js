const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const visualiseRoutes = require('./routes/visualise');

const app = express();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(cors());
app.use(express.json());

// Middleware to attach prisma and redis to req
app.use((req, res, next) => {
  req.prisma = prisma;
  req.redis = redis;
  next();
});

// Routes
app.use('/api/visualise', visualiseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;