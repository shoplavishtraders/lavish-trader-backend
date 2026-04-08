import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, TrendingDown } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function Reports() {
  const { orders, expenses, products } = useApp();

  const reportData = useMemo(() => {
    try {
      // Calculate revenue
      const totalRevenue = orders
        .filter(o => o.status === 'Delivered' || o.status === 'Completed')
        .reduce((sum, o) => sum + o.total, 0);

      // Calculate COGS (Cost of Goods Sold)
      const cogs = orders
        .filter(o => o.status === 'Delivered' || o.status === 'Completed')
        .reduce((sum, o) => {
          const itemsCost = o.items?.reduce((itemSum, item) => {
            const product = products.find(p => p.id === item.productId);
            return itemSum + (product ? product.cost * item.quantity : 0);
          }, 0) || 0;
          return sum + itemsCost;
        }, 0);

      // Calculate total expenses
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

      // Net Profit
      const netProfit = totalRevenue - cogs - totalExpenses;
      const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : '0';

      return {
        totalRevenue,
        cogs,
        totalExpenses,
        netProfit,
        profitMargin,
      };
    } catch (error) {
      console.error('Report calculation error:', error);
      return {
        totalRevenue: 0,
        cogs: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: '0',
      };
    }
  }, [orders, expenses, products]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-brand-400">Financial statements and business insights</p>
      </div>

      {/* P&L Statement */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold mb-6">Profit & Loss Statement</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-brand-400 text-sm mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-emerald-400">Rs {reportData.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-brand-400 text-sm mb-1">COGS</p>
            <p className="text-2xl font-bold text-orange-400">Rs {reportData.cogs.toLocaleString()}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-brand-400 text-sm mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-red-400">Rs {reportData.totalExpenses.toLocaleString()}</p>
          </div>

          <div className="p-4 bg-blue-600/10 rounded-lg border border-blue-500/20">
            <p className="text-blue-300 text-sm mb-1">Net Profit</p>
            <p className={`text-2xl font-bold ${reportData.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              Rs {reportData.netProfit.toLocaleString()}
            </p>
            <p className="text-xs text-brand-400 mt-1">{reportData.profitMargin}% margin</p>
          </div>
        </div>

        {/* P&L Breakdown Table */}
        <div className="bg-white/5 rounded-lg p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-3 text-brand-300">Total Revenue</td>
                <td className="py-3 text-right font-semibold text-emerald-400">+Rs {reportData.totalRevenue.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 text-brand-300">Cost of Goods Sold</td>
                <td className="py-3 text-right font-semibold text-orange-400">-Rs {reportData.cogs.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 text-brand-300 font-semibold">Gross Profit</td>
                <td className="py-3 text-right font-bold text-blue-400">Rs {(reportData.totalRevenue - reportData.cogs).toLocaleString()}</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 text-brand-300">Operating Expenses</td>
                <td className="py-3 text-right font-semibold text-red-400">-Rs {reportData.totalExpenses.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-3 text-white font-bold text-lg">Net Profit</td>
                <td className={`py-3 text-right font-bold text-lg ${reportData.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  Rs {reportData.netProfit.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-400 text-sm font-semibold">Revenue</p>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">Rs {reportData.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-brand-500 mt-2">From completed orders</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-400 text-sm font-semibold">Total Costs</p>
            <TrendingDown className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-orange-400">Rs {(reportData.cogs + reportData.totalExpenses).toLocaleString()}</p>
          <p className="text-xs text-brand-500 mt-2">COGS + Expenses</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-400 text-sm font-semibold">Net Profit</p>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <p className={`text-2xl font-bold ${reportData.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            Rs {reportData.netProfit.toLocaleString()}
          </p>
          <p className="text-xs text-brand-500 mt-2">{reportData.profitMargin}% margin</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-bold mb-4">Report Summary</h3>
        <div className="space-y-3 text-brand-300 text-sm">
          <p>• <strong>Total Revenue:</strong> Sum of all completed order amounts</p>
          <p>• <strong>Cost of Goods Sold:</strong> Product cost × quantity sold</p>
          <p>• <strong>Operating Expenses:</strong> All recorded expenses (rent, utilities, marketing, etc.)</p>
          <p>• <strong>Net Profit:</strong> Revenue - COGS - Expenses</p>
          <p>• <strong>Profit Margin:</strong> (Net Profit ÷ Revenue) × 100%</p>
        </div>
      </div>
    </div>
  );
}
