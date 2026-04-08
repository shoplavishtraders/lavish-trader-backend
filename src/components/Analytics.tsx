import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  ArrowUpRight,
  Calendar,
  Filter,
  Download,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';
import { cn, formatCurrency } from '../lib/utils';

const revenueData = [
  { month: 'Jan', revenue: 450000, profit: 120000 },
  { month: 'Feb', revenue: 520000, profit: 145000 },
  { month: 'Mar', revenue: 480000, profit: 130000 },
  { month: 'Apr', revenue: 610000, profit: 180000 },
  { month: 'May', revenue: 590000, profit: 170000 },
  { month: 'Jun', revenue: 720000, profit: 210000 },
];

const categoryData = [
  { name: 'Apparel', value: 45, color: '#3b82f6' },
  { name: 'Electronics', value: 30, color: '#10b981' },
  { name: 'Furniture', value: 15, color: '#f59e0b' },
  { name: 'Accessories', value: 10, color: '#8b5cf6' },
];

export function Analytics() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-brand-400 mt-1">Deep dive into your business performance and growth metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
            <Calendar className="w-4 h-4" />
            Last 6 Months
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Gross Revenue', value: 3370000, change: '+18.2%', trend: 'up', icon: DollarSign, color: 'text-blue-400' },
          { label: 'Avg. Order Value', value: 8450, change: '+5.4%', trend: 'up', icon: ShoppingBag, color: 'text-emerald-400' },
          { label: 'Customer Retention', value: '72%', change: '+2.1%', trend: 'up', icon: Users, color: 'text-purple-400' },
          { label: 'Conversion Rate', value: '3.8%', change: '-0.4%', trend: 'down', icon: Activity, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.trend === 'up' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              )}>
                {stat.change}
              </div>
            </div>
            <p className="text-brand-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">
              {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Growth */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Revenue Growth</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-brand-400">
                <div className="w-3 h-3 rounded-full bg-blue-500" /> Revenue
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-400">
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Profit
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs.${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-8">Sales by Category</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-brand-300 font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold">Top Performing Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header">
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Units Sold</th>
                <th className="px-8 py-5">Revenue</th>
                <th className="px-8 py-5">Growth</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Premium Cotton Hoodie', sold: 452, revenue: 2034000, growth: '+12.5%', status: 'Trending' },
                { name: 'Wireless Headphones', sold: 324, revenue: 21060000, growth: '+8.2%', status: 'Stable' },
                { name: 'Gaming Keyboard', sold: 215, revenue: 2687500, growth: '+15.4%', status: 'Trending' },
                { name: 'Office Chair', sold: 89, revenue: 2492000, growth: '-2.1%', status: 'Slow' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6 font-bold text-sm">{item.name}</td>
                  <td className="px-8 py-6 text-sm text-brand-300">{item.sold}</td>
                  <td className="px-8 py-6 text-sm font-bold">{formatCurrency(item.revenue)}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-xs font-bold",
                      item.growth.startsWith('+') ? "text-emerald-400" : "text-red-400"
                    )}>{item.growth}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={cn(
                      "status-badge",
                      item.status === 'Trending' ? "bg-blue-500/10 text-blue-400" :
                      item.status === 'Stable' ? "bg-emerald-500/10 text-emerald-400" :
                      "bg-amber-500/10 text-amber-400"
                    )}>
                      {item.status}
                    </span>
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
