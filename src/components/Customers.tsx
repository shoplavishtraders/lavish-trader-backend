import React, { useState, useMemo } from 'react';
import { Search, Plus, Users, Mail, Phone, ShoppingBag, DollarSign, Clock, CheckCircle2, XCircle, Edit, Trash2, Filter, X } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Customer } from '../types';
import { useApp } from '../store/AppContext';

const PAGE_SIZE = 8;

function CustomerModal({ customer, onClose, onSave }: { customer?: Customer; onClose: () => void; onSave: (data: Omit<Customer, 'id'>) => void }) {
  const [form, setForm] = useState({
    name: customer?.name ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    totalOrders: customer?.totalOrders ?? 0,
    totalSpent: customer?.totalSpent ?? 0,
    lastOrderDate: customer?.lastOrderDate ?? new Date().toISOString().slice(0, 10),
    status: customer?.status ?? 'Active' as Customer['status'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onSave({ ...form, totalOrders: Number(form.totalOrders), totalSpent: Number(form.totalSpent) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-lg animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Full Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="e.g. Ahmed Raza" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="email@example.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Phone</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="0300-0000000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Customer['status'] }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50">
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Last Order Date</label>
              <input type="date" value={form.lastOrderDate} onChange={e => setForm(p => ({ ...p, lastOrderDate: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/20">
              {customer ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(c =>
      (filterStatus === 'All' || c.status === filterStatus) &&
      (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q))
    );
  }, [customers, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalSpent = customers.reduce((a, c) => a + c.totalSpent, 0);
  const avgOrders = customers.length > 0 ? (customers.reduce((a, c) => a + c.totalOrders, 0) / customers.length).toFixed(1) : '0';
  const avgValue = customers.length > 0 ? totalSpent / customers.length : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Directory</h1>
          <p className="text-brand-400 mt-1">Manage your customer base and their purchase history.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
          <Plus className="w-5 h-5" />Add New Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Customers', value: customers.length.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Average Orders', value: avgOrders, icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Avg. Customer Value', value: formatCurrency(avgValue), icon: DollarSign, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn('p-2 rounded-lg', s.bg, s.color)}><s.icon className="w-5 h-5" /></div>
            </div>
            <p className="text-brand-400 text-sm font-medium">{s.label}</p>
            <h3 className="text-2xl font-bold mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500 group-focus-within:text-blue-400 transition-colors" />
          <input type="text" placeholder="Search by name, email, or phone..."
            className="w-full bg-brand-900/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="glass px-4 py-3 rounded-2xl text-sm font-bold bg-brand-900/40 border border-white/5 focus:outline-none">
          <option value="All">All Status</option>
          <option>Active</option><option>Inactive</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header">
                <th className="px-8 py-5">Customer Details</th>
                <th className="px-8 py-5">Purchase History</th>
                <th className="px-8 py-5">Total Spent</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-brand-500">No customers found.</td></tr>
              ) : paginated.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center border border-white/10 text-brand-400 group-hover:text-blue-400 transition-colors font-bold text-sm">
                        {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{customer.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] text-brand-500"><Mail className="w-3 h-3" />{customer.email}</span>
                          <span className="flex items-center gap-1 text-[10px] text-brand-500"><Phone className="w-3 h-3" />{customer.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold">{customer.totalOrders} Orders</p>
                    <div className="flex items-center gap-2 text-[10px] text-brand-500 mt-1">
                      <Clock className="w-3 h-3" />Last: {customer.lastOrderDate}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold">{formatCurrency(customer.totalSpent)}</p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1">LTV: {formatCurrency(customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0)}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {customer.status === 'Active' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                      <span className={cn('status-badge', customer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')}>
                        {customer.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditCustomer(customer)} className="p-2 rounded-lg hover:bg-blue-500/10 text-brand-400 hover:text-blue-400 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(customer.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-brand-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-brand-500">Showing {paginated.length} of {filtered.length} customers</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="glass px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40">Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(n => (
              <button key={n} onClick={() => setPage(n)} className={cn('glass px-3 py-1.5 rounded-lg text-xs font-bold', n === page && 'bg-blue-600/20 text-blue-400')}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="glass px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {showAdd && <CustomerModal onClose={() => setShowAdd(false)} onSave={addCustomer} />}
      {editCustomer && <CustomerModal customer={editCustomer} onClose={() => setEditCustomer(null)} onSave={d => updateCustomer(editCustomer.id, d)} />}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass-card w-full max-w-md p-6 animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-red-400">Delete Customer?</h3>
            <p className="text-sm text-brand-400">This will permanently remove <span className="text-white font-bold">"{customers.find(c => c.id === deleteId)?.name}"</span>.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5">Cancel</button>
              <button onClick={() => { deleteCustomer(deleteId); setDeleteId(null); }} className="bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-xl text-sm font-bold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
