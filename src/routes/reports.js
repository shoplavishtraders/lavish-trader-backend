const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Sales report
router.get('/sales', authMiddleware, requirePermission('canViewReports'), async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);
    res.json({ success: true, data: salesData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
