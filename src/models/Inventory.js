const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  productName: String,
  sku: String,
  variationId: String,
  variationColor: String,

  currentStock: {
    type: Number,
    required: true,
    default: 0,
    index: true
  },

  reservedStock: {
    type: Number,
    default: 0
  },

  availableStock: {
    type: Number,
    default: function() {
      return this.currentStock - this.reservedStock;
    }
  },

  movements: [{
    date: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['purchase', 'sale', 'return', 'adjustment', 'transfer', 'damage']
    },
    quantity: Number,
    reference: String,
    notes: String,
    beforeStock: Number,
    afterStock: Number,
    createdBy: String
  }],

  lastMovement: Date,
  lastRestockDate: Date,
  nextRestockDate: Date,

  alerts: {
    lowStock: {
      type: Boolean,
      default: false
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    overstock: {
      type: Boolean,
      default: false
    },
    overstockThreshold: {
      type: Number,
      default: 1000
    }
  },

  location: {
    warehouse: String,
    shelf: String,
    bin: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'inventory'
});

// Indexes
inventorySchema.index({ productId: 1, variationId: 1 });
inventorySchema.index({ sku: 1 });
inventorySchema.index({ currentStock: 1 });
inventorySchema.index({ 'alerts.lowStock': 1 });

// Pre-save to update availableStock
inventorySchema.pre('save', function(next) {
  this.availableStock = this.currentStock - this.reservedStock;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
