const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  darazOrderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  orderId: {
    type: String,
    required: true
  },
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postcode: String
  },
  items: [{
    productId: String,
    darazSkuId: String,
    name: String,
    sku: String,
    quantity: Number,
    price: Number,
    subtotal: Number,
    variationColor: String
  }],
  subtotal: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending',
      'processing',
      'packed',
      'shipped',
      'delivered',
      'cancelled',
      'returned'
    ],
    default: 'pending',
    index: true
  },
  darazStatus: {
    type: String,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'prepaid', 'wallet', 'daraz_credit'],
    default: 'cash_on_delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  shippingProvider: {
    type: String,
    default: null
  },
  trackingNumber: {
    type: String,
    default: null,
    sparse: true
  },
  trackingUrl: {
    type: String,
    default: null
  },
  darazCreatedAt: Date,
  darazUpdatedAt: Date,
  notes: String,
  internalNotes: String,
  platform: {
    type: String,
    enum: ['daraz', 'woocommerce', 'shopify', 'pos'],
    default: 'daraz'
  },
  invoiceGenerated: {
    type: Boolean,
    default: false
  },
  invoiceUrl: String,
  syncedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'orders'
});

// Indexes for queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ 'customer.email': 1 });

// Pre-save middleware to update timestamps
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for formatted total
orderSchema.virtual('formattedTotal').get(function() {
  return this.total.toLocaleString('ur-PK', {
    style: 'currency',
    currency: 'PKR'
  });
});

module.exports = mongoose.model('Order', orderSchema);
