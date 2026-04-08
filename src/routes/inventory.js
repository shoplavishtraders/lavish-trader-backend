const express = require('express');
const Inventory = require('../models/Inventory');
const { authMiddleware, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
