import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Package, Eye, Edit, Trash2, ChevronDown, X, Check } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Product } from '../types';
import { useApp } from '../store/AppContext';

const CATEGORIES = ['Apparel', 'Electronics', 'Furniture', 'Accessories', 'Sports', 'Beauty', 'Food', 'Other'];
const PLATFORMS: Product['platforms'][number][] = ['WooCommerce', 'Shopify', 'Daraz'];
const PAGE_SIZE = 8;

function ProductModal({ product, onClose, onSave }: {
  product?: Product;
  onClose: () => void;
  onSave: (data: Omit<Product, 'id'>) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    sku: product?.sku ?? '',
    category: product?.category ?? 'Electronics',
    stock: product?.stock ?? 0,
    price: product?.price ?? 0,
    cost: product?.cost ?? 0,
    platforms: product?.platforms ?? [] as Product['platforms'],
  });

  const togglePlatform = (p: Product['platforms'][number]) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.sku.trim()) return;
    onSave({ ...form, stock: Number(form.stock), price: Number(form.price), cost: Number(form.cost) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Product Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50"
                placeholder="e.g. Premium Cotton Hoodie" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">SKU *</label>
              <input required value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50"
                placeholder="e.g. HD-001-BL" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Stock (Units)</label>
              <input type="number" min={0} value={form.stock} onChange={e => setForm(p => ({ ...p, stock: +e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Selling Price (Rs.)</label>
              <input type="number" min={0} value={form.price} onChange={e => setForm(p => ({ ...p, price: +e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Cost Price (Rs.)</label>
              <input type="number" min={0} value={form.cost} onChange={e => setForm(p => ({ ...p, cost: +e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Marketplaces</label>
            <div className="flex gap-3">
              {PLATFORMS.map(p => (
                <button type="button" key={p} onClick={() => togglePlatform(p)}
                  className={cn('px-4 py-2 rounded-xl text-xs font-bold border transition-all',
                    form.platforms.includes(p)
                      ? p === 'WooCommerce' ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' :
                        p === 'Shopify' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                        'bg-orange-500/20 border-orange-500/40 text-orange-300'
                      : 'bg-white/5 border-white/10 text-brand-400')}>
                  {form.platforms.includes(p) && <Check className="w-3 h-3 inline mr-1" />}{p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/20">
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative glass-card w-full max-w-md p-6 animate-in zoom-in-95 duration-200 space-y-4">
        <h3 className="text-lg font-bold text-red-400">Delete Product?</h3>
        <p className="text-sm text-brand-400">This will permanently remove <span className="text-white font-bold">"{name}"</span> from your catalog. This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5">Cancel</button>
          <button onClick={onConfirm} className="bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-xl text-sm font-bold text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}

export function ProductCatalog() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p =>
      (filterCategory === 'All' || p.category === filterCategory) &&
      (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
  }, [products, search, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Catalog</h1>
          <p className="text-brand-400 mt-1">Manage your inventory across all connected marketplaces.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
          <Plus className="w-5 h-5" />Add New Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500 group-focus-within:text-blue-400 transition-colors" />
          <input type="text" placeholder="Search by name, SKU, or category..."
            className="w-full bg-brand-900/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
          className="glass px-4 py-3 rounded-2xl text-sm font-bold bg-brand-900/40 border border-white/5 focus:outline-none focus:border-blue-500/50">
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">Inventory</th>
                <th className="px-8 py-5">Financials</th>
                <th className="px-8 py-5">Marketplaces</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-brand-500">No products found.</td></tr>
              ) : paginated.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-brand-800 flex items-center justify-center border border-white/10">
                        <Package className="w-6 h-6 text-brand-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{product.name}</h4>
                        <p className="text-xs text-brand-500 font-mono mt-1 uppercase tracking-wider">{product.sku}</p>
                        <span className="text-[10px] bg-brand-800 text-brand-300 px-2 py-0.5 rounded-md mt-2 inline-block font-bold">{product.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', product.stock > 50 ? 'bg-emerald-500' : product.stock > 10 ? 'bg-amber-500' : 'bg-red-500')} />
                      <span className="text-sm font-bold">{product.stock} Units</span>
                    </div>
                    <p className="text-xs text-brand-500 mt-1">{product.stock <= 10 ? 'Low stock!' : 'In stock'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold">{formatCurrency(product.price)}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold mt-1">
                      <span className="text-brand-500">Cost: {formatCurrency(product.cost)}</span>
                      <span className="text-emerald-500">Margin: {product.price > 0 ? Math.round(((product.price - product.cost) / product.price) * 100) : 0}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {product.platforms.map(platform => (
                        <span key={platform} className={cn('status-badge border',
                          platform === 'WooCommerce' ? 'bg-purple-500/5 text-purple-400 border-purple-500/20' :
                          platform === 'Shopify' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' :
                          'bg-orange-500/5 text-orange-400 border-orange-500/20')}>
                          {platform}
                        </span>
                      ))}
                      {product.platforms.length === 0 && <span className="text-xs text-brand-500">No platforms</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditProduct(product)} className="p-2 rounded-lg hover:bg-blue-500/10 text-brand-400 hover:text-blue-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(product.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-brand-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-brand-500">Showing {paginated.length} of {filtered.length} products</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="glass px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40">Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={cn('glass px-3 py-1.5 rounded-lg text-xs font-bold', n === page && 'bg-blue-600/20 text-blue-400 border-blue-500/20')}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="glass px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {showAdd && <ProductModal onClose={() => setShowAdd(false)} onSave={addProduct} />}
      {editProduct && <ProductModal product={editProduct} onClose={() => setEditProduct(null)} onSave={data => updateProduct(editProduct.id, data)} />}
      {deleteId && (
        <DeleteConfirm
          name={products.find(p => p.id === deleteId)?.name ?? ''}
          onConfirm={() => { deleteProduct(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
