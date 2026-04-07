const express = require('express');
const Order = require('../models/Order');
const { authMiddleware, requirePermission } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Get all orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, platform } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (platform) query.platform = platform;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update order status
router.patch('/:id/status', authMiddleware, requirePermission('canEditOrders'), async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    logger.info(`Order ${order._id} status updated to ${status}`);

    res.json({
      success: true,
      data: order,
      message: 'Order status updated'
    });
  } catch (error) {
    logger.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get order statistics
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: 'count' }],
          totalRevenue: [{ $group: { _id: null, total: { $sum: '$total' } } }],
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          byPlatform: [{ $group: { _id: '$platform', count: { $sum: 1 }, revenue: { $sum: '$total' } } }]
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
