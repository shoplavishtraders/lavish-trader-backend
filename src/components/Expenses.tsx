import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, CreditCard, TrendingUp, ArrowUpRight, PieChart, DollarSign, Briefcase, Zap, ShoppingBag, Edit, Trash2, X } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Expense } from '../types';
import { useApp } from '../store/AppContext';

const EXPENSE_CATEGORIES = ['Rent', 'Utilities', 'Marketing', 'Salaries', 'Logistics', 'Equipment', 'Maintenance', 'Travel', 'Other'];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Rent: Briefcase, Utilities: Zap, Marketing: TrendingUp, Salaries: DollarSign,
  Logistics: ShoppingBag, Equipment: CreditCard, Other: ArrowUpRight,
};

function ExpenseModal({ expense, onClose, onSave }: { expense?: Expense; onClose: () => void; onSave: (data: Omit<Expense, 'id'>) => void }) {
  const [form, setForm] = useState({
    category: expense?.category ?? 'Rent',
    amount: expense?.amount ?? 0,
    date: expense?.date ?? new Date().toISOString().slice(0, 10),
    description: expense?.description ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    onSave({ ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{expense ? 'Edit Expense' : 'Record New Expense'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50">
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Amount (Rs.)</label>
              <input type="number" min={0} required value={form.amount} onChange={e => setForm(p => ({ ...p, amount: +e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Description *</label>
              <input required value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50"
                placeholder="Brief description of the expense" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/20">
              {expense ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useApp();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return expenses.filter(e =>
      (filterCategory === 'All' || e.category === filterCategory) &&
      (e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
    );
  }, [expenses, search, filterCategory]);

  // Category breakdown
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [expenses]);

  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);

  const COLORS = ['text-blue-400 bg-blue-500/10', 'text-amber-400 bg-amber-500/10', 'text-purple-400 bg-purple-500/10', 'text-emerald-400 bg-emerald-500/10'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Log</h1>
          <p className="text-brand-400 mt-1">Monitor operational expenditure and financial overheads.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
          <Plus className="w-5 h-5" />Record New Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryTotals.map(([cat, amount], i) => {
          const Icon = CATEGORY_ICONS[cat] ?? DollarSign;
          const colors = COLORS[i].split(' ');
          return (
            <div key={cat} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-2 rounded-lg', colors[1], colors[0])}><Icon className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Monthly</span>
              </div>
              <p className="text-brand-400 text-sm font-medium">{cat}</p>
              <h3 className="text-xl font-bold mt-1">{formatCurrency(amount)}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Transactions</h3>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 group-focus-within:text-blue-400 transition-colors" />
                <input type="text" placeholder="Search expenses..."
                  className="bg-brand-950 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500/50 transition-all"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                className="bg-brand-950 border border-white/5 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500/50">
                <option value="All">All</option>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="table-header">
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Description</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-12 text-center text-brand-500">No expenses found.</td></tr>
                ) : filtered.map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5 text-sm font-bold">{expense.category}</td>
                    <td className="px-8 py-5 text-sm text-brand-400">{expense.date}</td>
                    <td className="px-8 py-5 text-sm text-brand-500 max-w-[200px] truncate">{expense.description}</td>
                    <td className="px-8 py-5 text-sm font-bold text-red-400">{formatCurrency(expense.amount)}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditExpense(expense)} className="p-2 rounded-lg hover:bg-blue-500/10 text-brand-400 hover:text-blue-400 transition-colors"><Edit className="w-3 h-3" /></button>
                        <button onClick={() => setDeleteId(expense.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-brand-400 hover:text-red-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Expense Breakdown</h3>
            <PieChart className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-4">
            {categoryTotals.map(([cat, amount], i) => {
              const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
              const dotColors = ['bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-emerald-500'];
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', dotColors[i])} />
                      <span className="text-sm text-brand-300">{cat}</span>
                    </div>
                    <span className="text-sm font-bold">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', dotColors[i])} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">Total Expenses</p>
            <h3 className="text-2xl font-bold text-red-400 mt-1">{formatCurrency(totalExpenses)}</h3>
          </div>
        </div>
      </div>

      {showAdd && <ExpenseModal onClose={() => setShowAdd(false)} onSave={addExpense} />}
      {editExpense && <ExpenseModal expense={editExpense} onClose={() => setEditExpense(null)} onSave={d => updateExpense(editExpense.id, d)} />}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass-card w-full max-w-md p-6 animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-red-400">Delete Expense?</h3>
            <p className="text-sm text-brand-400">Remove <span className="text-white font-bold">"{expenses.find(e => e.id === deleteId)?.description}"</span>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5">Cancel</button>
              <button onClick={() => { deleteExpense(deleteId); setDeleteId(null); }} className="bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-xl text-sm font-bold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
