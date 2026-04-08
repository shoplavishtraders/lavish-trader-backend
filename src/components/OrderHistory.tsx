import React, { useState, useMemo } from 'react';
import { Search, Download, ExternalLink, Clock, CheckCircle2, XCircle, Truck, Globe, ShoppingCart, Layers, Monitor } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Order } from '../types';
import { useApp } from '../store/AppContext';

const STATUSES: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function OrderDetailModal({ order, onClose, onStatusChange }: { order: Order; onClose: () => void; onStatusChange: (status: Order['status']) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-mono text-blue-400">{order.id}</h2>
            <p className="text-xs text-brand-400 mt-0.5">{order.date}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-brand-400 text-lg">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">Customer</p>
              <p className="text-sm font-bold mt-1">{order.customer}</p>
            </div>
            <div>
              <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">Platform</p>
              <p className="text-sm font-bold mt-1">{order.platform}</p>
            </div>
            <div>
              <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">Total</p>
              <p className="text-lg font-bold text-blue-400 mt-1">{formatCurrency(order.total)}</p>
            </div>
            <div>
              <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">Current Status</p>
              <p className={cn('text-sm font-bold mt-1',
                order.status === 'Processing' ? 'text-blue-400' : order.status === 'Pending' ? 'text-amber-400' :
                order.status === 'Shipped' ? 'text-purple-400' : order.status === 'Delivered' ? 'text-emerald-400' : 'text-red-400')}>
                {order.status}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold mb-2">Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map(s => (
                <button key={s} onClick={() => { onStatusChange(s); onClose(); }}
                  className={cn('px-3 py-2 rounded-xl text-xs font-bold border transition-all',
                    order.status === s
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                      : 'bg-white/5 border-white/10 text-brand-400 hover:bg-white/10')}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderHistory() {
  const { orders, updateOrderStatus } = useApp();
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(o =>
      (filterPlatform === 'All' || o.platform === filterPlatform) &&
      (filterStatus === 'All' || o.status === filterStatus) &&
      (o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.platform.toLowerCase().includes(q))
    );
  }, [orders, search, filterPlatform, filterStatus]);

  const exportCSV = () => {
    const rows = [['Order ID', 'Customer', 'Date', 'Platform', 'Total', 'Status']];
    filtered.forEach(o => rows.push([o.id, o.customer, o.date, o.platform, o.total.toString(), o.status]));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'orders.csv';
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-brand-400 mt-1">Track and manage all orders across your sales channels.</p>
        </div>
        <button onClick={exportCSV} className="glass px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
          <Download className="w-4 h-4" />Export CSV
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500 group-focus-within:text-blue-400 transition-colors" />
          <input type="text" placeholder="Search by Order ID, customer, or platform..."
            className="w-full bg-brand-900/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
          className="bg-brand-900/40 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50">
          <option value="All">All Platforms</option>
          <option>WooCommerce</option><option>Shopify</option><option>Daraz</option><option>POS</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-brand-900/40 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50">
          <option value="All">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Platform</th>
                <th className="px-8 py-5">Total</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-8 py-16 text-center text-brand-500">No orders found.</td></tr>
              ) : filtered.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5 font-mono text-sm text-blue-400">{order.id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-[10px] font-bold border border-white/10">
                        {order.customer.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-brand-400">{order.date}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {order.platform === 'WooCommerce' ? <Globe className="w-4 h-4 text-purple-400" /> :
                       order.platform === 'Shopify' ? <ShoppingCart className="w-4 h-4 text-emerald-400" /> :
                       order.platform === 'Daraz' ? <Layers className="w-4 h-4 text-orange-400" /> :
                       <Monitor className="w-4 h-4 text-blue-400" />}
                      <span className="text-xs font-bold">{order.platform}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold">{formatCurrency(order.total)}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {order.status === 'Processing' ? <Clock className="w-3 h-3 text-blue-400" /> :
                       order.status === 'Pending' ? <Clock className="w-3 h-3 text-amber-400" /> :
                       order.status === 'Shipped' ? <Truck className="w-3 h-3 text-purple-400" /> :
                       order.status === 'Delivered' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> :
                       <XCircle className="w-3 h-3 text-red-400" />}
                      <span className={cn('text-xs font-bold',
                        order.status === 'Processing' ? 'text-blue-400' : order.status === 'Pending' ? 'text-amber-400' :
                        order.status === 'Shipped' ? 'text-purple-400' : order.status === 'Delivered' ? 'text-emerald-400' : 'text-red-400')}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => setSelectedOrder(order)} className="p-2 rounded-lg hover:bg-white/10 text-brand-400 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-white/5">
          <p className="text-xs text-brand-500">Showing {filtered.length} of {orders.length} orders</p>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={status => updateOrderStatus(selectedOrder.id, status)}
        />
      )}
    </div>
  );
}
