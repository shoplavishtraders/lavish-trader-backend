import React, { useState, useMemo } from 'react';
import { Search, Plus, Truck, Phone, Star, CreditCard, ArrowUpRight, MoreVertical, MapPin, Clock, Edit, Trash2, X } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Supplier } from '../types';
import { useApp } from '../store/AppContext';

function SupplierModal({ supplier, onClose, onSave }: { supplier?: Supplier; onClose: () => void; onSave: (data: Omit<Supplier, 'id'>) => void }) {
  const [form, setForm] = useState({
    name: supplier?.name ?? '',
    contact: supplier?.contact ?? '',
    reliability: supplier?.reliability ?? 4.0,
    balance: supplier?.balance ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, reliability: Number(form.reliability), balance: Number(form.balance) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Supplier Name *</label>
            <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="e.g. Al-Fatah Textiles" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Contact Number</label>
            <input value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
              className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="0300-0000000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Reliability (0-5)</label>
              <input type="number" min={0} max={5} step={0.1} value={form.reliability} onChange={e => setForm(p => ({ ...p, reliability: +e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Outstanding Balance</label>
              <input type="number" min={0} value={form.balance} onChange={e => setForm(p => ({ ...p, balance: +e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/20">
              {supplier ? 'Save Changes' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return suppliers.filter(s => s.name.toLowerCase().includes(q) || s.contact.includes(q));
  }, [suppliers, search]);

  const totalPayable = suppliers.reduce((a, s) => a + s.balance, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Supplier Directory</h1>
          <p className="text-brand-400 mt-1">Manage your supply chain and outstanding balances.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
          <Plus className="w-5 h-5" />Add New Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500 group-focus-within:text-blue-400 transition-colors" />
          <input type="text" placeholder="Search by supplier name or contact..."
            className="w-full bg-brand-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">Total Payable</p>
            <h3 className="text-xl font-bold text-red-400 mt-1">{formatCurrency(totalPayable)}</h3>
          </div>
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400"><CreditCard className="w-5 h-5" /></div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center text-brand-500">No suppliers found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((supplier) => (
            <div key={supplier.id} className="glass-card p-6 group hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-800 flex items-center justify-center border border-white/10 text-brand-400 group-hover:text-blue-400 transition-colors">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{supplier.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-amber-400">{supplier.reliability}</span>
                      <span className="text-[10px] text-brand-500 ml-1">Reliability</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditSupplier(supplier)} className="p-2 rounded-lg hover:bg-blue-500/10 text-brand-500 hover:text-blue-400 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(supplier.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-brand-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-brand-400">
                  <Phone className="w-4 h-4" /><span>{supplier.contact}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-400">
                  <MapPin className="w-4 h-4" /><span>Pakistan</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-400">
                  <Clock className="w-4 h-4" /><span className="text-emerald-400 font-medium">Avg. Delivery: 3 Days</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">Outstanding Balance</p>
                  <p className={cn('text-lg font-bold mt-1', supplier.balance > 0 ? 'text-red-400' : 'text-emerald-400')}>
                    {formatCurrency(supplier.balance)}
                  </p>
                </div>
                <button className="p-3 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <SupplierModal onClose={() => setShowAdd(false)} onSave={addSupplier} />}
      {editSupplier && <SupplierModal supplier={editSupplier} onClose={() => setEditSupplier(null)} onSave={d => updateSupplier(editSupplier.id, d)} />}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass-card w-full max-w-md p-6 animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-red-400">Delete Supplier?</h3>
            <p className="text-sm text-brand-400">Remove <span className="text-white font-bold">"{suppliers.find(s => s.id === deleteId)?.name}"</span>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5">Cancel</button>
              <button onClick={() => { deleteSupplier(deleteId); setDeleteId(null); }} className="bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-xl text-sm font-bold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
