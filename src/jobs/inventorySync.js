const cron = require('node-cron');
const darazService = require('../services/darazService');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const logger = require('../utils/logger');

class InventorySyncJob {
  constructor() {
    this.isRunning = false;
    this.job = null;
  }

  async syncInventory() {
    if (this.isRunning) {
      logger.warn('Inventory sync already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      logger.info('Starting inventory sync to Daraz...');

      // Get all products
      const products = await Product.find({ status: 'active' });

      let syncedCount = 0;
      let errorCount = 0;

      for (const product of products) {
        try {
          if (product.darazProductId && product.darazProductId.length > 0) {
            // Update stock on Daraz
            const totalStock = product.variations && product.variations.length > 0
              ? product.variations.reduce((sum, v) => sum + (v.stock || 0), 0)
              : product.stock;

            // Update each variation on Daraz
            if (product.variations && product.variations.length > 0) {
              for (const variation of product.variations) {
                if (variation.darazSkuId) {
                  await darazService.updateProductQuantity(variation.darazSkuId, variation.stock || 0);
                  syncedCount++;
                }
              }
            } else {
              // Update main product
              await darazService.updateProductQuantity(product.darazProductId, totalStock);
              syncedCount++;
            }

            // Update product sync data
            product.syncData.lastSyncedAt = new Date();
            product.syncData.lastSyncStatus = 'success';
            await product.save();
          }
        } catch (error) {
          logger.error(`Error syncing product ${product.sku}:`, error.message);
          product.syncData.lastSyncStatus = 'failed';
          product.syncData.syncErrors.push(error.message);
          await product.save();
          errorCount++;
        }
      }

      const duration = Math.round((Date.now() - startTime) / 1000);
      logger.info(`Inventory sync completed - Synced: ${syncedCount}, Errors: ${errorCount}, Duration: ${duration}s`);
    } catch (error) {
      logger.error('Critical error during inventory sync:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  start() {
    if (this.job) {
      logger.warn('Inventory sync job already running');
      return;
    }

    // Run sync every 1 hour (or based on env variable)
    const interval = process.env.INVENTORY_SYNC_INTERVAL || 60; // minutes
    const cronExpression = `0 */${Math.ceil(interval / 60)} * * *`;

    this.job = cron.schedule(cronExpression, () => {
      this.syncInventory();
    });

    logger.info(`Inventory sync job started - runs every ${interval} minutes`);

    // Run immediately on startup
    setTimeout(() => {
      this.syncInventory();
    }, 10000);
  }

  stop() {
    if (this.job) {
      this.job.stop();
      this.job = null;
      logger.info('Inventory sync job stopped');
    }
  }
}

module.exports = new InventorySyncJob();
