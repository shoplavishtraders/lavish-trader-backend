import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  Users,
  Settings,
  LogOut,
  Layers,
  Truck,
  CreditCard,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Globe,
  HelpCircle,
  Box,
  TrendingUp,
  Code2
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Product Catalog', path: '/products' },
  { icon: ShoppingCart, label: 'POS Terminal', path: '/pos' },
  { icon: History, label: 'Order History', path: '/orders' },
  { icon: Box, label: 'Inventory', path: '/inventory' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Layers, label: 'Marketplace Sync', path: '/sync' },
  { icon: Globe, label: 'Store Integrations', path: '/integrations' },
  { icon: Code2, label: 'SKU Mapping', path: '/sku-mapping' },
  { icon: Truck, label: 'Suppliers', path: '/suppliers' },
  { icon: CreditCard, label: 'Expenses', path: '/expenses' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: TrendingUp, label: 'Reports', path: '/reports' },
  { icon: Users, label: 'User Access', path: '/users' },
  { icon: ShieldCheck, label: 'Permissions', path: '/permissions' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen glass border-r border-white/5 flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Layers className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-tight">OmniCore</h1>
          <p className="text-[10px] text-brand-400 uppercase tracking-widest font-semibold">Architect's Ledger</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                : "text-brand-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
              "group-[.active]:text-blue-400"
            )} />
            <span className="font-medium text-sm">{item.label}</span>
            <ChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center border border-white/10">
            <Users className="w-5 h-5 text-brand-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Usama Akram</p>
            <p className="text-xs text-brand-500 truncate">Administrator</p>
          </div>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
