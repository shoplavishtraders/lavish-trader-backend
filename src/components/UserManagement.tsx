import React, { useState, useMemo } from 'react';
import { Search, Plus, ShieldCheck, Mail, Clock, CheckCircle2, XCircle, Edit, Trash2, X, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { AppUser, useApp } from '../store/AppContext';

const ROLES = ['Administrator', 'Manager', 'Sales Associate', 'Inventory Specialist', 'Accountant'];

function UserModal({ user, onClose, onSave }: { user?: AppUser; onClose: () => void; onSave: (data: Omit<AppUser, 'id'>) => void }) {
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    role: user?.role ?? 'Sales Associate',
    status: user?.status ?? 'Active' as AppUser['status'],
    lastLogin: user?.lastLogin ?? 'Never',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{user ? 'Edit User' : 'Add New User'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Full Name *</label>
            <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="e.g. Ahmed Raza" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="user@omnicore.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Role</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as AppUser['status'] }))}
                className="w-full bg-brand-950 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500/50">
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/20">
              {user ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ROLE_STYLES: Record<string, string> = {
  Administrator: 'bg-blue-500/10 text-blue-400',
  Manager: 'bg-purple-500/10 text-purple-400',
  'Sales Associate': 'bg-emerald-500/10 text-emerald-400',
  'Inventory Specialist': 'bg-amber-500/10 text-amber-400',
  Accountant: 'bg-rose-500/10 text-rose-400',
};

export function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [users, search]);

  // Role summary
  const roleSummary = useMemo(() => {
    const map: Record<string, number> = {};
    users.forEach(u => { map[u.role] = (map[u.role] || 0) + 1; });
    return Object.entries(map).slice(0, 4);
  }, [users]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users & Access Control</h1>
          <p className="text-brand-400 mt-1">Manage team members and their operational permissions.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
          <Plus className="w-5 h-5" />Add New User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleSummary.map(([role, count], i) => {
          const colors = Object.values(ROLE_STYLES);
          const [bg, text] = (colors[i] || 'bg-brand-800 text-brand-400').split(' ');
          return (
            <div key={role} className="glass-card p-6 group hover:border-blue-500/30 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-2 rounded-lg', bg, text)}><ShieldCheck className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">{count} Users</span>
              </div>
              <h3 className="text-lg font-bold">{role}</h3>
            </div>
          );
        })}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold">Team Directory</h3>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 group-focus-within:text-blue-400 transition-colors" />
            <input type="text" placeholder="Search users..."
              className="bg-brand-950 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500/50 transition-all w-64"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header">
                <th className="px-8 py-5">User Details</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Last Activity</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-brand-500">No users found.</td></tr>
              ) : filtered.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center border border-white/10 text-brand-400 group-hover:text-blue-400 transition-colors font-bold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{user.name}</h4>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-brand-500">
                          <Mail className="w-3 h-3" />{user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn('status-badge', ROLE_STYLES[user.role] || 'bg-brand-800 text-brand-400')}>{user.role}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                      <span className={cn('text-xs font-bold', user.status === 'Active' ? 'text-emerald-500' : 'text-red-500')}>{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-brand-400">
                    <div className="flex items-center gap-2"><Clock className="w-3 h-3" />{user.lastLogin}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditUser(user)} className="p-2 rounded-lg hover:bg-blue-500/10 text-brand-400 hover:text-blue-400 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(user.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-brand-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-white/5">
          <p className="text-xs text-brand-500">Showing {filtered.length} of {users.length} users</p>
        </div>
      </div>

      {showAdd && <UserModal onClose={() => setShowAdd(false)} onSave={addUser} />}
      {editUser && <UserModal user={editUser} onClose={() => setEditUser(null)} onSave={d => updateUser(editUser.id, d)} />}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass-card w-full max-w-md p-6 animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-red-400">Delete User?</h3>
            <p className="text-sm text-brand-400">Remove <span className="text-white font-bold">"{users.find(u => u.id === deleteId)?.name}"</span>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5">Cancel</button>
              <button onClick={() => { deleteUser(deleteId); setDeleteId(null); }} className="bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-xl text-sm font-bold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
