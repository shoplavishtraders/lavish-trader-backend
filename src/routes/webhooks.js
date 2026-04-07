const express = require('express');
const Order = require('../models/Order');
const logger = require('../utils/logger');

const router = express.Router();

// Daraz webhook for order status updates
router.post('/daraz/order-update', async (req, res) => {
  try {
    const { order_id, order_status } = req.body;

    logger.info(`Webhook received for order ${order_id} with status ${order_status}`);

    const order = await Order.findOne({ darazOrderId: order_id });
    if (order) {
      order.darazStatus = order_status;
      await order.save();
      logger.info(`Updated order ${order_id} status`);
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
