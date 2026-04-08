import React from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Globe, 
  ShoppingCart, 
  Layers,
  Search,
  Filter,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';

const syncStats = [
  { platform: 'WooCommerce', status: 'Healthy', lastSync: '2 mins ago', items: 124, errors: 0, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { platform: 'Shopify', status: 'Warning', lastSync: '15 mins ago', items: 118, errors: 3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { platform: 'Daraz', status: 'Healthy', lastSync: '5 mins ago', items: 89, errors: 0, color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

const mappingData = [
  { id: '1', name: 'Premium Cotton Hoodie', sku: 'HD-001-BL', woo: true, shopify: true, daraz: false, status: 'Synced' },
  { id: '2', name: 'Wireless Headphones', sku: 'WH-1000XM4', woo: false, shopify: true, daraz: true, status: 'Conflict' },
  { id: '3', name: 'Office Chair', sku: 'OC-ERG-01', woo: true, shopify: false, daraz: true, status: 'Synced' },
  { id: '4', name: 'Gaming Keyboard', sku: 'KB-RGB-MECH', woo: true, shopify: true, daraz: true, status: 'Synced' },
  { id: '5', name: 'Water Bottle', sku: 'WB-SS-750', woo: false, shopify: true, daraz: false, status: 'Pending' },
];

export function InventoryMapping() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace Sync</h1>
          <p className="text-brand-400 mt-1">Manage SKU mapping and inventory synchronization across platforms.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Force Global Sync
        </button>
      </div>

      {/* Platform Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {syncStats.map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg", stat.bg, stat.color)}>
                {stat.platform === 'WooCommerce' ? <Globe className="w-5 h-5" /> : 
                 stat.platform === 'Shopify' ? <ShoppingCart className="w-5 h-5" /> : 
                 <Layers className="w-5 h-5" />}
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                stat.status === 'Healthy' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
              )}>
                {stat.status === 'Healthy' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {stat.status}
              </div>
            </div>
            <h3 className="text-lg font-bold">{stat.platform}</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-400">Mapped Items</span>
                <span className="font-bold">{stat.items}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-400">Sync Errors</span>
                <span className={cn("font-bold", stat.errors > 0 ? "text-red-400" : "text-emerald-400")}>{stat.errors}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-400">Last Sync</span>
                <span className="font-bold text-brand-300">{stat.lastSync}</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors flex items-center justify-center gap-2">
              View Logs
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Mapping Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold">SKU Mapping Directory</h3>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search SKU..." 
                className="bg-brand-950 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <button className="glass p-2 rounded-xl hover:bg-white/5 text-brand-400 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header">
                <th className="px-8 py-5">Product & SKU</th>
                <th className="px-8 py-5 text-center">WooCommerce</th>
                <th className="px-8 py-5 text-center">Shopify</th>
                <th className="px-8 py-5 text-center">Daraz</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mappingData.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-brand-500 font-mono mt-1 uppercase tracking-wider">{item.sku}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                      {item.woo ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-20">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                      {item.shopify ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-20">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                      {item.daraz ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-20">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "status-badge",
                      item.status === 'Synced' ? "bg-emerald-500/10 text-emerald-400" :
                      item.status === 'Conflict' ? "bg-red-500/10 text-red-400" :
                      "bg-amber-500/10 text-amber-400"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-blue-400 text-xs font-bold hover:underline flex items-center gap-1 ml-auto">
                      Fix Mapping
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
