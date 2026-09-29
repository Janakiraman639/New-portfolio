const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.VERCEL
    ? true  // Same domain on Vercel, allow all
    : (process.env.CLIENT_URL || 'http://localhost:5173'),
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files directly from database (with local disk fallback for dev)
app.get('/uploads/:filename', async (req, res) => {
  try {
    const prisma = require('./utils/prisma');
    const file = await prisma.uploadedFile.findUnique({
      where: { filename: req.params.filename },
    });
    if (file) {
      const buffer = Buffer.from(file.data, 'base64');
      res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(buffer);
    }
  } catch (err) {
    console.error('Error fetching file from database:', err);
  }

  // Fallback to local uploads directory if present
  const localFile = path.join(__dirname, '../uploads', req.params.filename);
  if (fs.existsSync(localFile)) {
    return res.sendFile(localFile);
  }

  return res.status(404).json({ success: false, message: 'File not found' });
});

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const prisma = require('./utils/prisma');
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      hasDbUrl: !!process.env.DATABASE_URL,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start listening if running locally or if PORT is assigned (Vercel Services / standalone)
if (!process.env.VERCEL || process.env.PORT) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
