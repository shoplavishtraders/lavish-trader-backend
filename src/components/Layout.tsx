import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell, Search, Globe, Moon } from 'lucide-react';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[#0A0C10]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything... (Cmd + K)" 
                className="w-full bg-brand-950/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 glass px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Live Sync</span>
            </div>
            
            <button className="p-2 rounded-xl hover:bg-white/5 text-brand-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0A0C10]" />
            </button>
            <button className="p-2 rounded-xl hover:bg-white/5 text-brand-400 hover:text-white transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl hover:bg-white/5 text-brand-400 hover:text-white transition-colors">
              <Moon className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
