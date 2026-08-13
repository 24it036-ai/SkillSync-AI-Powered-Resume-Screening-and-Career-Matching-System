const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'healthy',
    service: 'SkillSync Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'skillsync'
    },
    ml_service_url: process.env.ML_SERVICE_URL || 'http://localhost:8000'
  });
});

module.exports = router;
