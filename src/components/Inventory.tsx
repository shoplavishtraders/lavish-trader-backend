import React, { useState, useMemo } from 'react';
import { Box, Plus, Minus, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { cn } from '../lib/utils';

export function Inventory() {
  const { products, addStockAdjustment, stockAdjustments, showToast } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  const [adjustmentType, setAdjustmentType] = useState<'Add' | 'Remove' | 'Set'>('Add');
  const [quantity, setQuantity] = useState<string>('');
  const [reason, setReason] = useState<'Purchase' | 'Return' | 'Damaged' | 'Theft' | 'Correction' | 'Transfer'>('Purchase');
  const [notes, setNotes] = useState<string>('');

  const product = products.find(p => p.id === selectedProduct);
  const variation = product?.variations.find(v => v.id === selectedVariation);

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    return { totalStock, lowStock, outOfStock, totalValue };
  }, [products]);

  const handleAdjustment = () => {
    if (!selectedProduct || !quantity) {
      showToast('Please fill all fields', 'error');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      showToast('Please enter a valid quantity', 'error');
      return;
    }

    addStockAdjustment({
      productId: selectedProduct,
      variationId: selectedVariation || undefined,
      type: adjustmentType,
      quantity: qty,
      reason,
      notes: notes || undefined,
    });

    setSelectedProduct('');
    setSelectedVariation('');
    setQuantity('');
    setAdjustmentType('Add');
    setReason('Purchase');
    setNotes('');
    showToast('Stock adjustment recorded', 'success');
  };

  const recentAdjustments = stockAdjustments.slice(-10).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-brand-400">Track stock levels and manage adjustments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-400 text-sm font-semibold">Total Stock</p>
            <Box className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold">{stats.totalStock}</p>
          <p className="text-xs text-brand-500 mt-1">Units in hand</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-400 text-sm font-semibold">Low Stock</p>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats.lowStock}</p>
          <p className="text-xs text-brand-500 mt-1">Products ≤ 10 units</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-400 text-sm font-semibold">Out of Stock</p>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{stats.outOfStock}</p>
          <p className="text-xs text-brand-500 mt-1">0 units available</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-400 text-sm font-semibold">Inventory Value</p>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold">Rs {stats.totalValue.toLocaleString()}</p>
          <p className="text-xs text-brand-500 mt-1">Total worth</p>
        </div>
      </div>

      {/* Adjustment Form */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Record Stock Adjustment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold text-brand-300 mb-2 block">Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedVariation('');
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {product && product.variations.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-brand-300 mb-2 block">Color Variation</label>
              <select
                value={selectedVariation}
                onChange={(e) => setSelectedVariation(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Overall stock</option>
                {product.variations.map(v => (
                  <option key={v.id} value={v.id}>{v.colorName}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-brand-300 mb-2 block">Adjustment Type</label>
            <select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value as 'Add' | 'Remove' | 'Set')}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Add">Add Stock</option>
              <option value="Remove">Remove Stock</option>
              <option value="Set">Set Stock</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-300 mb-2 block">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-300 mb-2 block">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Purchase">Purchase</option>
              <option value="Return">Return</option>
              <option value="Damaged">Damaged</option>
              <option value="Theft">Theft</option>
              <option value="Correction">Correction</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-300 mb-2 block">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleAdjustment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Record Adjustment
        </button>
      </div>

      {/* Audit Log */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold mb-4">Stock Adjustment History</h2>

        {recentAdjustments.length === 0 ? (
          <p className="text-brand-400 text-center py-8">No adjustments recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-semibold text-brand-300 py-3 px-4">Date</th>
                  <th className="text-left text-xs font-semibold text-brand-300 py-3 px-4">Product</th>
                  <th className="text-left text-xs font-semibold text-brand-300 py-3 px-4">Type</th>
                  <th className="text-left text-xs font-semibold text-brand-300 py-3 px-4">Qty</th>
                  <th className="text-left text-xs font-semibold text-brand-300 py-3 px-4">Before</th>
                  <th className="text-left text-xs font-semibold text-brand-300 py-3 px-4">After</th>
                  <th className="text-left text-xs font-semibold text-brand-300 py-3 px-4">Reason</th>
                </tr>
              </thead>
              <tbody>
                {recentAdjustments.map((adj) => (
                  <tr key={adj.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-sm text-white">{new Date(adj.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm text-white">{adj.productName}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-semibold',
                        adj.type === 'Add' ? 'bg-emerald-500/20 text-emerald-300' :
                        adj.type === 'Remove' ? 'bg-red-500/20 text-red-300' :
                        'bg-blue-500/20 text-blue-300'
                      )}>
                        {adj.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-white">{adj.quantity}</td>
                    <td className="py-3 px-4 text-sm text-brand-400">{adj.beforeQty}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-white">{adj.afterQty}</td>
                    <td className="py-3 px-4 text-sm text-brand-400">{adj.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
