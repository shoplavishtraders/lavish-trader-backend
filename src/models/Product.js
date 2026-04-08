const mongoose = require('mongoose');

const productVariationSchema = new mongoose.Schema({
  id: String,
  colorName: String,
  colorHex: String,
  sku: String,
  darazSkuId: String,
  stock: Number,
  priceOverride: Number,
  barcode: String
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  brand: String,
  model: String,
  design: String,
  sku: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    index: true
  },
  darazProductId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  category: {
    type: String,
    index: true
  },
  subcategory: String,
  description: String,
  shortDescription: String,

  pricing: {
    cost: {
      type: Number,
      required: true
    },
    regularPrice: {
      type: Number,
      required: true
    },
    salePrice: Number,
    darazPrice: Number
  },

  stock: {
    type: Number,
    default: 0,
    index: true
  },
  variations: [productVariationSchema],

  images: [{
    url: String,
    alt: String,
    isMain: Boolean
  }],

  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active',
    index: true
  },

  platforms: [{
    type: String,
    enum: ['daraz', 'woocommerce', 'shopify', 'pos']
  }],

  seoData: {
    slug: String,
    metaTitle: String,
    metaDescription: String,
    tags: [String]
  },

  inventory: {
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    lastRestockDate: Date,
    restockQuantity: Number
  },

  syncData: {
    lastSyncedAt: Date,
    lastSyncStatus: {
      type: String,
      enum: ['success', 'failed', 'pending']
    },
    syncErrors: [String]
  },

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
  collection: 'products'
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for total stock across variations
productSchema.virtual('totalStock').get(function() {
  if (this.variations && this.variations.length > 0) {
    return this.variations.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  return this.stock;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  const total = this.totalStock;
  const threshold = this.inventory?.lowStockThreshold || 10;

  if (total === 0) return 'out_of_stock';
  if (total <= threshold) return 'low_stock';
  return 'in_stock';
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
