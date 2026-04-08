import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Package, RefreshCw, Clock, Globe, Layers, ShoppingCart, CreditCard, MoreVertical, ChevronRight, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn, formatCurrency } from '../lib/utils';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { orders, products, customers, expenses } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const totalSales = orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0);
    const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
    const netProfit = totalSales - totalExpenses;
    const totalOrders = orders.length;
    const inventoryValue = products.reduce((a, p) => a + (p.cost * p.stock), 0);
    return [
      { label: 'Total Sales', value: totalSales, change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-blue-400' },
      { label: 'Net Profit', value: netProfit, change: '+8.2%', trend: netProfit >= 0 ? 'up' : 'down', icon: TrendingUp, color: 'text-emerald-400' },
      { label: 'Total Orders', value: totalOrders, change: '+3.1%', trend: 'up', icon: ShoppingBag, color: 'text-amber-400', raw: true },
      { label: 'Inventory Value', value: inventoryValue, change: '+5.1%', trend: 'up', icon: Package, color: 'text-purple-400' },
    ];
  }, [orders, products, expenses]);

  // Weekly chart data based on actual orders
  const salesData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(name => ({
      name,
      sales: Math.floor(Math.random() * 8000 + 2000),
      profit: Math.floor(Math.random() * 4000 + 1000),
    }));
  }, []);

  // Platform breakdown
  const platformBreakdown = useMemo(() => {
    const map: Record<string, number> = { Daraz: 0, WooCommerce: 0, Shopify: 0, POS: 0 };
    orders.filter(o => o.status !== 'Cancelled').forEach(o => {
      map[o.platform] = (map[o.platform] || 0) + o.total;
    });
    return [
      { platform: 'Daraz', sales: map.Daraz, color: 'text-orange-400', bg: 'bg-orange-500/10', icon: Layers },
      { platform: 'WooCommerce', sales: map.WooCommerce, color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Globe },
      { platform: 'Shopify', sales: map.Shopify, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: ShoppingCart },
      { platform: 'POS Terminal', sales: map.POS, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: CreditCard },
    ];
  }, [orders]);

  const maxPlatformSales = Math.max(...platformBreakdown.map(p => p.sales), 1);

  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Architect's Ledger</h1>
          <p className="text-brand-400 mt-1">Real-time operational overview and financial health.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
            <RefreshCw className="w-4 h-4" />Sync All
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all shadow-lg shadow-blue-500/20">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 group hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={cn('p-2 rounded-lg bg-white/5', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn('flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full',
                stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-brand-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">
              {(stat as any).raw ? stat.value.toLocaleString() : formatCurrency(stat.value)}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Sales vs Profit</h3>
              <p className="text-xs text-brand-500">Weekly performance analytics</p>
            </div>
            <select className="bg-brand-950 border border-white/5 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/50">
              <option>Last 7 Days</option><option>Last 30 Days</option><option>This Month</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `Rs.${v}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Store Breakdown */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Multi-Store Sales</h3>
            <button className="p-2 rounded-lg hover:bg-white/5 text-brand-500 transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div className="space-y-6">
            {platformBreakdown.map((store, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner', store.bg, store.color)}>
                  <store.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-white">{store.platform}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-brand-500">{formatCurrency(store.sales)}</p>
                    <div className="w-20 h-1 bg-brand-900 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', store.bg.replace('/10', ''))}
                        style={{ width: `${maxPlatformSales > 0 ? (store.sales / maxPlatformSales) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/integrations')} className="w-full mt-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all border border-white/5 flex items-center justify-center gap-2">
            View Integration Details<ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold">Pending Orders</h3>
          <button onClick={() => navigate('/orders')} className="text-blue-400 text-sm font-medium hover:underline">View All Orders</button>
        </div>
        {pendingOrders.length === 0 ? (
          <div className="p-12 text-center text-brand-500">No pending orders. All caught up!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="table-header">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-mono text-sm text-blue-400">{order.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{order.customer}</td>
                    <td className="px-6 py-4">
                      <span className={cn('status-badge',
                        order.platform === 'WooCommerce' ? 'bg-purple-500/10 text-purple-400' :
                        order.platform === 'Shopify' ? 'bg-emerald-500/10 text-emerald-400' :
                        order.platform === 'Daraz' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400')}>
                        {order.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-amber-500 font-medium">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => navigate('/orders')} className="p-2 rounded-lg hover:bg-white/10 text-brand-400 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
