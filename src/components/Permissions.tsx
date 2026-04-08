import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

const permissionGroups = [
  {
    name: 'Dashboard & Analytics',
    permissions: [
      { name: 'View Financial Overview', key: 'view_financials', status: true },
      { name: 'Export Operational Reports', key: 'export_reports', status: true },
      { name: 'View Real-time Sync Status', key: 'view_sync', status: true },
    ]
  },
  {
    name: 'Inventory & Catalog',
    permissions: [
      { name: 'Add New Products', key: 'add_products', status: true },
      { name: 'Edit Product Details', key: 'edit_products', status: true },
      { name: 'Delete Products', key: 'delete_products', status: false },
      { name: 'Manage Marketplace Mappings', key: 'manage_mapping', status: true },
    ]
  },
  {
    name: 'Sales & POS',
    permissions: [
      { name: 'Access POS Terminal', key: 'access_pos', status: true },
      { name: 'Process Refunds', key: 'process_refunds', status: false },
      { name: 'Apply Custom Discounts', key: 'apply_discounts', status: true },
    ]
  },
  {
    name: 'Supply Chain & Expenses',
    permissions: [
      { name: 'Manage Suppliers', key: 'manage_suppliers', status: true },
      { name: 'Record New Expenses', key: 'add_expenses', status: true },
      { name: 'View Expense Analytics', key: 'view_expense_analytics', status: false },
    ]
  }
];

export function Permissions() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Edit Permissions</h1>
            <p className="text-brand-400 mt-1">Configuring access level for <span className="text-purple-400 font-bold">Manager</span> role.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass px-6 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-colors">
            Discard Changes
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20">
            Save Permissions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {permissionGroups.map((group, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <h3 className="font-bold text-lg">{group.name}</h3>
                <button className="text-xs font-bold text-blue-400 hover:underline">Select All</button>
              </div>
              <div className="divide-y divide-white/5">
                {group.permissions.map((perm) => (
                  <div key={perm.key} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300",
                        perm.status ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                      )}>
                        {perm.status ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{perm.name}</p>
                        <p className="text-xs text-brand-500 mt-0.5">Key ID: {perm.key}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={perm.status} className="sr-only peer" readOnly />
                      <div className="w-11 h-6 bg-brand-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              Role Overview
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-brand-500 uppercase tracking-widest font-bold mb-1">Role Name</p>
                <p className="font-bold">Manager</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-brand-500 uppercase tracking-widest font-bold mb-1">Assigned Users</p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-brand-700 border border-brand-900" />
                    <div className="w-6 h-6 rounded-full bg-brand-600 border border-brand-900" />
                  </div>
                  <span className="text-sm font-bold">2 Team Members</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-brand-500 uppercase tracking-widest font-bold mb-1">Security Level</p>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-amber-400">Level 4 (High)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-blue-600/5 border-blue-500/20">
            <h3 className="font-bold text-sm mb-4">Security Notice</h3>
            <p className="text-xs text-brand-400 leading-relaxed">
              Updating these permissions will immediately affect all users assigned to the <span className="text-blue-400 font-bold">Manager</span> role. Changes are logged for audit purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
