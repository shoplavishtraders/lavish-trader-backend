import React, { useState, useMemo } from 'react';
import { Code2, Plus, Edit2, Copy, Check, X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { cn } from '../lib/utils';

export function SKUMapping() {
  const { products, updateProduct, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSku, setEditingSku] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleEditSku = (productId: string, currentSku: string) => {
    setEditingId(productId);
    setEditingSku(currentSku);
  };

  const handleSaveSku = (productId: string) => {
    if (!editingSku.trim()) {
      showToast('SKU cannot be empty', 'error');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check for duplicate SKU
    const isDuplicate = products.some(p => p.id !== productId && p.sku === editingSku);
    if (isDuplicate) {
      showToast('This SKU is already in use', 'error');
      return;
    }

    updateProduct(productId, { sku: editingSku });
    setEditingId(null);
    showToast('SKU updated successfully', 'success');
  };

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedId(sku);
    showToast('SKU copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">SKU Mapping</h1>
        <p className="text-brand-400">Manage product SKU codes for inventory tracking</p>
      </div>

      {/* Search */}
      <div className="glass-card p-4 rounded-2xl border border-white/10">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by product name or SKU..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* SKU Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left text-xs font-semibold text-brand-300 py-4 px-6">Product Name</th>
                <th className="text-left text-xs font-semibold text-brand-300 py-4 px-6">Brand</th>
                <th className="text-left text-xs font-semibold text-brand-300 py-4 px-6">Model</th>
                <th className="text-left text-xs font-semibold text-brand-300 py-4 px-6">SKU Code</th>
                <th className="text-left text-xs font-semibold text-brand-300 py-4 px-6">Stock</th>
                <th className="text-left text-xs font-semibold text-brand-300 py-4 px-6">Price</th>
                <th className="text-center text-xs font-semibold text-brand-300 py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-brand-400 py-8">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-brand-500">{product.category}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-brand-300">{product.brand || '—'}</td>
                    <td className="py-4 px-6 text-sm text-brand-300">{product.model || '—'}</td>
                    <td className="py-4 px-6">
                      {editingId === product.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingSku}
                            onChange={(e) => setEditingSku(e.target.value)}
                            className="bg-white/10 border border-blue-500 rounded px-3 py-1 text-sm text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveSku(product.id)}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <code className="bg-white/5 px-3 py-1 rounded text-sm font-mono text-blue-300">
                            {product.sku}
                          </code>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-semibold',
                        product.stock > 10 ? 'bg-emerald-500/20 text-emerald-300' :
                        product.stock > 0 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      )}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-white font-semibold">
                      Rs {product.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditSku(product.id, product.sku)}
                          disabled={editingId !== null}
                          className="p-2 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                          title="Edit SKU"
                        >
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleCopySku(product.sku)}
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          title="Copy SKU"
                        >
                          {copiedId === product.sku ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-brand-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SKU Format Guide */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5" /> SKU Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="font-semibold text-white mb-2">Format</p>
            <p className="text-sm text-brand-300">Use alphanumeric codes (letters and numbers)</p>
            <code className="text-xs bg-white/10 px-2 py-1 rounded text-blue-300 mt-2 block">Example: IPHONE15PRO-BLK-001</code>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="font-semibold text-white mb-2">Length</p>
            <p className="text-sm text-brand-300">Recommend 8-20 characters for optimal barcode scanning</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="font-semibold text-white mb-2">Uniqueness</p>
            <p className="text-sm text-brand-300">Each SKU must be unique across your entire inventory</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <p className="text-brand-400 text-sm font-semibold mb-2">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <p className="text-brand-400 text-sm font-semibold mb-2">Avg SKU Length</p>
          <p className="text-2xl font-bold">
            {(products.reduce((sum, p) => sum + p.sku.length, 0) / Math.max(products.length, 1)).toFixed(1)}
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <p className="text-brand-400 text-sm font-semibold mb-2">With Brand</p>
          <p className="text-2xl font-bold">{products.filter(p => p.brand).length}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <p className="text-brand-400 text-sm font-semibold mb-2">With Model</p>
          <p className="text-2xl font-bold">{products.filter(p => p.model).length}</p>
        </div>
      </div>
    </div>
  );
}
