const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't return password by default
  },
  phone: String,
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff', 'viewer'],
    default: 'staff'
  },
  permissions: {
    canViewOrders: { type: Boolean, default: true },
    canEditOrders: { type: Boolean, default: false },
    canViewInventory: { type: Boolean, default: true },
    canEditInventory: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    canManageDaraz: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  lastLogin: Date,
  lastLoginIP: String,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
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
  collection: 'users'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Method to lock account
userSchema.methods.lock = function() {
  this.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // Lock for 2 hours
  return this.save();
};

// Method to unlock account
userSchema.methods.unlock = function() {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model('User', userSchema);
