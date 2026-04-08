import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, CreditCard, User, Database, Moon, RefreshCw, ChevronRight, Save, Trash2, Key } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../store/AppContext';

type SettingsTab = 'profile' | 'marketplace' | 'notifications' | 'security' | 'billing' | 'data';

const NAV_ITEMS: { id: SettingsTab; icon: React.ElementType; label: string }[] = [
  { id: 'profile', icon: User, label: 'Profile Settings' },
  { id: 'marketplace', icon: Globe, label: 'Marketplace Config' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security', icon: Shield, label: 'Security & Privacy' },
  { id: 'billing', icon: CreditCard, label: 'Billing & Plans' },
  { id: 'data', icon: Database, label: 'Data Management' },
];

export function Settings() {
  const { settings, updateSettings, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Local form state for profile
  const [profile, setProfile] = useState({
    name: settings.name,
    email: settings.email,
    phone: settings.phone,
    businessName: settings.businessName,
    currency: settings.currency,
    taxRate: settings.taxRate,
  });

  const handleSaveProfile = () => {
    updateSettings({ ...profile, taxRate: Number(profile.taxRate) });
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="relative inline-flex items-center cursor-pointer" onClick={() => onChange(!checked)}>
      <div className={cn('w-11 h-6 rounded-full transition-colors', checked ? 'bg-blue-600' : 'bg-brand-800')}>
        <div className={cn('absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform', checked && 'translate-x-5')} />
      </div>
    </label>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-brand-400 mt-1">Configure your ERP preferences and global parameters.</p>
        </div>
        <button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
          <Save className="w-5 h-5" />Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                activeTab === item.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-brand-400 hover:bg-white/5 hover:text-white')}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
              <ChevronRight className={cn('ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity', activeTab === item.id && 'opacity-100')} />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <>
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                    { label: 'Phone Number', key: 'phone', type: 'text', placeholder: '+92 300 0000000' },
                    { label: 'Business Name', key: 'businessName', type: 'text', placeholder: 'Your Business' },
                  ].map(field => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">{field.label}</label>
                      <input type={field.type} value={(profile as any)[field.key]}
                        onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Currency</label>
                    <select value={profile.currency} onChange={e => setProfile(p => ({ ...p, currency: e.target.value }))}
                      className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50">
                      <option value="PKR">PKR - Pakistani Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Tax Rate (%)</label>
                    <input type="number" min={0} max={100} step={0.5} value={profile.taxRate}
                      onChange={e => setProfile(p => ({ ...p, taxRate: +e.target.value }))}
                      className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                    Save Profile
                  </button>
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-blue-400" />System Preferences
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Moon, bg: 'bg-blue-500/10', color: 'text-blue-400', label: 'Dark Mode', desc: 'Enable dark theme for the entire application.', key: 'darkMode' as const },
                    { icon: RefreshCw, bg: 'bg-emerald-500/10', color: 'text-emerald-400', label: 'Auto-Sync', desc: 'Automatically sync inventory every 15 minutes.', key: 'autoSync' as const },
                    { icon: Bell, bg: 'bg-purple-500/10', color: 'text-purple-400', label: 'Email Notifications', desc: 'Receive daily reports and stock alerts via email.', key: 'emailNotifications' as const },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className={cn('p-2 rounded-lg', item.bg, item.color)}><item.icon className="w-5 h-5" /></div>
                        <div>
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-xs text-brand-500">{item.desc}</p>
                        </div>
                      </div>
                      <Toggle checked={settings[item.key]} onChange={v => updateSettings({ [item.key]: v })} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'marketplace' && (
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />Marketplace Configuration
              </h3>
              <p className="text-brand-400 text-sm mb-6">Manage your marketplace-specific settings and preferences.</p>
              <div className="space-y-4">
                {['WooCommerce', 'Shopify', 'Daraz'].map(platform => (
                  <div key={platform} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{platform}</p>
                      <p className="text-xs text-brand-500 mt-0.5">Configure {platform} sync settings</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all">
                      Configure
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'New Order Alerts', desc: 'Get notified when a new order comes in', key: 'emailNotifications' as const },
                  { label: 'Low Stock Warnings', desc: 'Alert when stock falls below threshold', key: 'autoSync' as const },
                  { label: 'Daily Summary', desc: 'Receive daily sales and performance report', key: 'darkMode' as const },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-xs text-brand-500">{item.desc}</p>
                    </div>
                    <Toggle checked={settings[item.key]} onChange={v => updateSettings({ [item.key]: v })} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />Security & Privacy
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Change Password</p>
                      <p className="text-xs text-brand-500">Update your account password</p>
                    </div>
                    <button onClick={() => showToast('Password change feature coming soon', 'info')} className="px-4 py-2 rounded-lg bg-white/10 text-brand-300 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-2">
                      <Key className="w-3 h-3" />Change
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Two-Factor Authentication</p>
                      <p className="text-xs text-brand-500">Add an extra layer of security</p>
                    </div>
                    <button onClick={() => showToast('2FA feature coming soon', 'info')} className="px-4 py-2 rounded-lg bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'billing' || activeTab === 'data') && (
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold mb-4">
                {activeTab === 'billing' ? 'Billing & Plans' : 'Data Management'}
              </h3>
              <p className="text-brand-400 text-sm">This section is under development. Check back soon.</p>
            </div>
          )}

          {/* Danger Zone */}
          <div className="glass-card p-8 border-red-500/20 bg-red-500/5">
            <h3 className="text-lg font-bold text-red-400 mb-6 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />Danger Zone
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Reset All Data</p>
                <p className="text-xs text-brand-400">Clear all stored data and return to defaults.</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('This will permanently delete ALL your data. Are you sure?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-bold text-white transition-all shadow-lg shadow-red-500/20">
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
