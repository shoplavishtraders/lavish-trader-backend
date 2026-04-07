const express = require('express');
const darazService = require('../services/darazService');
const { authMiddleware, requirePermission } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Check Daraz connection
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const isConnected = await darazService.verifyConnection();
    res.json({
      success: true,
      connected: isConnected
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Manual sync trigger
router.post('/sync', authMiddleware, requirePermission('canManageDaraz'), async (req, res) => {
  try {
    logger.info('Manual Daraz sync triggered');
    res.json({ success: true, message: 'Sync started' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
