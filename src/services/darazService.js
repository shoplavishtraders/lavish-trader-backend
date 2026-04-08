const axios = require('axios');
const logger = require('../utils/logger');

class DarazService {
  constructor() {
    this.baseURL = process.env.DARAZ_API_URL || 'https://api.daraz.pk';
    this.appKey = process.env.DARAZ_APP_KEY;
    this.appSecret = process.env.DARAZ_APP_SECRET;
    this.accessToken = process.env.DARAZ_ACCESS_TOKEN;
  }

  // Get list of orders from Daraz
  async getOrders(options = {}) {
    try {
      const params = {
        app_key: this.appKey,
        access_token: this.accessToken,
        timestamp: Math.floor(Date.now() / 1000),
        ...options
      };

      const response = await axios.get(
        `${this.baseURL}/order/orders/get_order_list`,
        { params }
      );

      logger.info(`Fetched ${response.data?.data?.orders?.length || 0} orders from Daraz`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching Daraz orders:', error.message);
      throw error;
    }
  }

  // Get order details from Daraz
  async getOrderDetail(orderId) {
    try {
      const params = {
        app_key: this.appKey,
        access_token: this.accessToken,
        order_id: orderId,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const response = await axios.get(
        `${this.baseURL}/order/orders/get_order_detail`,
        { params }
      );

      return response.data;
    } catch (error) {
      logger.error(`Error fetching order ${orderId} from Daraz:`, error.message);
      throw error;
    }
  }

  // Update order status on Daraz
  async updateOrderStatus(orderId, status, trackingInfo = {}) {
    try {
      const payload = {
        app_key: this.appKey,
        access_token: this.accessToken,
        order_id: orderId,
        order_status: this.mapStatusToDaraz(status),
        timestamp: Math.floor(Date.now() / 1000),
        ...trackingInfo
      };

      const response = await axios.post(
        `${this.baseURL}/order/orders/set_status`,
        payload
      );

      logger.info(`Updated Daraz order ${orderId} status to ${status}`);
      return response.data;
    } catch (error) {
      logger.error(`Error updating Daraz order ${orderId}:`, error.message);
      throw error;
    }
  }

  // Get products from Daraz
  async getProducts(options = {}) {
    try {
      const params = {
        app_key: this.appKey,
        access_token: this.accessToken,
        timestamp: Math.floor(Date.now() / 1000),
        ...options
      };

      const response = await axios.get(
        `${this.baseURL}/product/products/get`,
        { params }
      );

      return response.data;
    } catch (error) {
      logger.error('Error fetching Daraz products:', error.message);
      throw error;
    }
  }

  // Update product price on Daraz
  async updateProductPrice(skuId, price) {
    try {
      const payload = {
        app_key: this.appKey,
        access_token: this.accessToken,
        sku_id: skuId,
        price: price,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const response = await axios.post(
        `${this.baseURL}/product/price_update`,
        payload
      );

      logger.info(`Updated Daraz product ${skuId} price to ${price}`);
      return response.data;
    } catch (error) {
      logger.error(`Error updating product price on Daraz:`, error.message);
      throw error;
    }
  }

  // Update product quantity on Daraz
  async updateProductQuantity(skuId, quantity) {
    try {
      const payload = {
        app_key: this.appKey,
        access_token: this.accessToken,
        sku_id: skuId,
        quantity: quantity,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const response = await axios.post(
        `${this.baseURL}/product/stock_update`,
        payload
      );

      logger.info(`Updated Daraz product ${skuId} quantity to ${quantity}`);
      return response.data;
    } catch (error) {
      logger.error(`Error updating product quantity on Daraz:`, error.message);
      throw error;
    }
  }

  // Map local status to Daraz status
  mapStatusToDaraz(status) {
    const statusMap = {
      'pending': 'pending_fulfillment',
      'processing': 'pending_fulfillment',
      'packed': 'pending_shipment',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'returned': 'returned'
    };
    return statusMap[status] || status;
  }

  // Map Daraz status to local status
  mapStatusFromDaraz(darazStatus) {
    const statusMap = {
      'pending_fulfillment': 'pending',
      'pending_shipment': 'packed',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'returned': 'returned'
    };
    return statusMap[darazStatus] || darazStatus;
  }

  // Verify Daraz connection
  async verifyConnection() {
    try {
      const response = await axios.get(
        `${this.baseURL}/order/orders/get_order_list`,
        {
          params: {
            app_key: this.appKey,
            access_token: this.accessToken,
            timestamp: Math.floor(Date.now() / 1000),
            limit: 1
          }
        }
      );
      logger.info('Daraz API connection verified');
      return true;
    } catch (error) {
      logger.error('Daraz API connection failed:', error.message);
      return false;
    }
  }
}

module.exports = new DarazService();
