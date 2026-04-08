const cron = require('node-cron');
const darazService = require('../services/darazService');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const logger = require('../utils/logger');

class DarazSyncJob {
  constructor() {
    this.isRunning = false;
    this.job = null;
  }

  async syncOrders() {
    if (this.isRunning) {
      logger.warn('Daraz sync already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      logger.info('Starting Daraz order sync...');

      // Fetch orders from Daraz
      const darazOrders = await darazService.getOrders({
        limit: 100,
        offset: 0
      });

      if (!darazOrders.data?.orders || darazOrders.data.orders.length === 0) {
        logger.info('No new orders from Daraz');
        return;
      }

      let importedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;

      for (const darazOrder of darazOrders.data.orders) {
        try {
          // Check if order already exists
          const existingOrder = await Order.findOne({
            darazOrderId: darazOrder.order_id
          });

          if (existingOrder) {
            // Update existing order
            existingOrder.darazStatus = darazOrder.order_status;
            existingOrder.darazUpdatedAt = new Date(darazOrder.update_time * 1000);
            existingOrder.syncedAt = Date.now();

            await existingOrder.save();
            updatedCount++;
          } else {
            // Create new order
            const newOrder = new Order({
              darazOrderId: darazOrder.order_id,
              orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              customer: {
                name: darazOrder.customer_first_name + ' ' + darazOrder.customer_last_name,
                phone: darazOrder.customer_phone,
                address: darazOrder.delivery_address,
                city: darazOrder.city,
                postcode: darazOrder.post_code
              },
              items: this.mapDarazItems(darazOrder),
              total: darazOrder.price_subtotal || darazOrder.price,
              status: darazService.mapStatusFromDaraz(darazOrder.order_status),
              darazStatus: darazOrder.order_status,
              paymentMethod: 'cash_on_delivery',
              platform: 'daraz',
              darazCreatedAt: new Date(darazOrder.create_time * 1000),
              darazUpdatedAt: new Date(darazOrder.update_time * 1000),
              syncedAt: Date.now()
            });

            await newOrder.save();
            importedCount++;

            // Decrease inventory when order is placed
            await this.decreaseInventory(newOrder);
          }
        } catch (error) {
          logger.error(`Error syncing Daraz order ${darazOrder.order_id}:`, error.message);
          errorCount++;
        }
      }

      const duration = Math.round((Date.now() - startTime) / 1000);
      logger.info(`Daraz sync completed - Imported: ${importedCount}, Updated: ${updatedCount}, Errors: ${errorCount}, Duration: ${duration}s`);
    } catch (error) {
      logger.error('Critical error during Daraz sync:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  mapDarazItems(darazOrder) {
    // Map Daraz order items to your format
    return [{
      darazSkuId: darazOrder.sku_id || '',
      name: darazOrder.item_name || 'Unknown Product',
      quantity: darazOrder.item_quantity || 1,
      price: darazOrder.item_price || 0,
      subtotal: (darazOrder.item_price || 0) * (darazOrder.item_quantity || 1)
    }];
  }

  async decreaseInventory(order) {
    try {
      for (const item of order.items) {
        const inventory = await Inventory.findOne({
          productId: item.productId
        });

        if (inventory) {
          inventory.currentStock = Math.max(0, inventory.currentStock - item.quantity);
          inventory.reservedStock += item.quantity;
          inventory.movements.push({
            type: 'sale',
            quantity: item.quantity,
            reference: order._id.toString(),
            beforeStock: inventory.currentStock + item.quantity,
            afterStock: inventory.currentStock,
            createdBy: 'daraz_sync'
          });
          await inventory.save();
        }
      }
    } catch (error) {
      logger.error('Error decreasing inventory:', error.message);
    }
  }

  start() {
    if (this.job) {
      logger.warn('Daraz sync job already running');
      return;
    }

    // Run sync every 2 hours (or based on env variable)
    const interval = process.env.DARAZ_SYNC_INTERVAL || 120; // minutes
    const cronExpression = `0 */${Math.ceil(interval / 60)} * * *`;

    this.job = cron.schedule(cronExpression, () => {
      this.syncOrders();
    });

    logger.info(`Daraz sync job started - runs every ${interval} minutes`);

    // Run immediately on startup
    setTimeout(() => {
      this.syncOrders();
    }, 5000);
  }

  stop() {
    if (this.job) {
      this.job.stop();
      this.job = null;
      logger.info('Daraz sync job stopped');
    }
  }
}

module.exports = new DarazSyncJob();
