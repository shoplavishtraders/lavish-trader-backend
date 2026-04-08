import React, { useState } from 'react';
import { 
  Globe, 
  ShoppingCart, 
  Layers, 
  Plus, 
  Settings, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Key,
  Link2,
  Trash2,
  ChevronRight,
  X,
  Lock,
  Eye,
  EyeOff,
  Info,
  Database,
  Clock,
  Activity,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { StoreConnection } from '../types';

const mockConnections: StoreConnection[] = [];

export function Integrations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'WooCommerce' | 'Shopify' | 'Daraz' | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<Record<string, 'credentials' | 'settings' | 'history'>>({});
  const [formData, setFormData] = useState({
    storeName: '',
    storeUrl: '',
    region: 'pk',
    sellerId: '',
    appKey: '',
    appSecret: '',
    consumerKey: '',
    consumerSecret: '',
    apiKey: '',
    adminToken: '',
  });

  const toggleSecret = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setTab = (id: string, tab: 'credentials' | 'settings' | 'history') => {
    setActiveTab(prev => ({ ...prev, [id]: tab }));
  };

  const handleDarazOAuth = () => {
    if (!formData.appKey || !formData.appSecret) {
      alert('Please enter App Key and App Secret');
      return;
    }

    const darazAuthUrl = `https://auth.daraz.com/oauth/authorize`;
    const params = new URLSearchParams({
      client_id: formData.appKey,
      response_type: 'code',
      scope: 'read,write',
      redirect_uri: `${window.location.origin}/api/daraz/callback`,
      state: Math.random().toString(36).substring(7),
    });

    window.open(`${darazAuthUrl}?${params.toString()}`, 'DarazAuth', 'width=800,height=600');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Store Integrations</h1>
          <p className="text-brand-400 mt-1">Connect and manage your multi-channel sales platforms with official API credentials.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Connect New Store
        </button>
      </div>

      {/* Connection Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {mockConnections.map((store) => (
          <div key={store.id} className="glass-card p-6 group hover:border-blue-500/30 transition-all duration-300 flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors shadow-inner",
                  store.platform === 'WooCommerce' ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                  store.platform === 'Shopify' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                  "bg-orange-500/10 border-orange-500/20 text-orange-400"
                )}>
                  {store.platform === 'WooCommerce' ? <Globe className="w-7 h-7" /> : 
                   store.platform === 'Shopify' ? <ShoppingCart className="w-7 h-7" /> : 
                   <Layers className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{store.storeName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-brand-400 font-medium">{store.platform}</span>
                    {store.platform === 'Daraz' && (
                      <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                        {store.credentials.region}
                      </span>
                    )}
                    <span className="w-1 h-1 rounded-full bg-brand-700" />
                    <span className={cn(
                      "status-badge",
                      store.status === 'Connected' ? "bg-emerald-500/10 text-emerald-500" :
                      store.status === 'Error' ? "bg-red-500/10 text-red-500" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {store.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/5 text-brand-500 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-500/10 text-brand-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-6 border-b border-white/5 mb-6">
              {[
                { id: 'credentials', label: 'Credentials', icon: Key },
                { id: 'settings', label: 'Sync Settings', icon: Database },
                { id: 'history', label: 'Sync History', icon: Activity },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTab(store.id, tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-all relative",
                    (activeTab[store.id] || 'credentials') === tab.id 
                      ? "text-blue-400" 
                      : "text-brand-500 hover:text-brand-300"
                  )}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                  {(activeTab[store.id] || 'credentials') === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-[200px]">
              {/* Credentials Tab */}
              {(activeTab[store.id] || 'credentials') === 'credentials' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="p-3 rounded-xl bg-brand-950/50 border border-white/5">
                    <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold mb-1">Store URL</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-brand-300 truncate max-w-[300px]">{store.storeUrl}</span>
                      <ExternalLink className="w-3 h-3 text-brand-500" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-brand-950/50 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">API Access Details</p>
                      <button 
                        onClick={() => toggleSecret(store.id)}
                        className="text-[10px] text-blue-400 hover:underline font-bold"
                      >
                        {showSecrets[store.id] ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {store.platform === 'Daraz' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-500">Seller ID</span>
                          <p className="text-xs font-mono text-brand-300">{store.credentials.storeId}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-500">App Key</span>
                          <p className="text-xs font-mono text-brand-300">{store.credentials.appKey}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <span className="text-[10px] text-brand-500">Access Token</span>
                          <p className="text-xs font-mono text-brand-300 truncate">
                            {showSecrets[store.id] ? store.credentials.accessToken : '••••••••••••••••••••••••••••••••'}
                          </p>
                        </div>
                      </div>
                    )}

                    {store.platform === 'WooCommerce' && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-500">Consumer Key</span>
                          <p className="text-xs font-mono text-brand-300">{store.credentials.consumerKey}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-500">Consumer Secret</span>
                          <p className="text-xs font-mono text-brand-300">
                            {showSecrets[store.id] ? store.credentials.consumerSecret : '••••••••••••••••••••••••••••••••'}
                          </p>
                        </div>
                      </div>
                    )}

                    {store.platform === 'Shopify' && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-500">API Key</span>
                          <p className="text-xs font-mono text-brand-300">{store.credentials.apiKey}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-500">Admin Access Token</span>
                          <p className="text-xs font-mono text-brand-300">
                            {showSecrets[store.id] ? store.credentials.adminAccessToken : '••••••••••••••••••••••••••••••••'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sync Settings Tab */}
              {activeTab[store.id] === 'settings' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Inventory Sync', desc: 'Auto-update stock levels', enabled: true },
                      { label: 'Order Import', desc: 'Fetch new orders every 5m', enabled: true },
                      { label: 'Price Sync', desc: 'Push price changes instantly', enabled: false },
                      { label: 'Product Push', desc: 'Upload new products auto', enabled: false },
                    ].map((setting, i) => (
                      <div key={i} className="p-3 rounded-xl bg-brand-950/50 border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold">{setting.label}</p>
                          <p className="text-[10px] text-brand-500">{setting.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={setting.enabled} className="sr-only peer" readOnly />
                          <div className="w-8 h-4 bg-brand-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sync History Tab */}
              {activeTab[store.id] === 'history' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                  {[
                    { event: 'Inventory Sync', status: 'Success', time: '2 mins ago', details: '452 SKUs updated' },
                    { event: 'Order Import', status: 'Success', time: '15 mins ago', details: '12 new orders' },
                    { event: 'Price Sync', status: 'Failed', time: '1 hour ago', details: 'API Timeout' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-brand-950/50 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          log.status === 'Success' ? "bg-emerald-500" : "bg-red-500"
                        )} />
                        <div>
                          <p className="text-xs font-bold">{log.event}</p>
                          <p className="text-[10px] text-brand-500">{log.details}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-brand-500 font-bold">{log.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-6">
              <div className="flex items-center gap-2 text-[10px] text-brand-500 uppercase tracking-widest font-bold">
                <Clock className={cn("w-3 h-3", store.status === 'Connected' && "animate-spin-slow")} />
                Last Sync: {store.lastSync}
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-white/5 hover:bg-white/10 text-brand-300 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-white/5">
                  View Logs
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                  <RefreshCw className="w-3 h-3" />
                  Sync Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-card border-dashed border-white/10 flex flex-col items-center justify-center gap-4 p-6 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group min-h-[400px]"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
            <Plus className="w-10 h-10 text-brand-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="text-center">
            <h4 className="text-lg font-bold text-brand-300 group-hover:text-white transition-colors">Add Marketplace</h4>
            <p className="text-sm text-brand-500 mt-1">Connect Amazon, eBay, or Etsy</p>
          </div>
        </button>
      </div>

      {/* Connect Store Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative glass-card w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-brand-900/50">
              <div>
                <h2 className="text-xl font-bold">Connect New Store</h2>
                <p className="text-xs text-brand-500 mt-1">Integrate your multi-channel sales platform.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {!selectedPlatform ? (
                <div className="space-y-6">
                  <p className="text-sm text-brand-400">Select a platform to begin the integration process.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { id: 'WooCommerce', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10', desc: 'WordPress REST API' },
                      { id: 'Shopify', icon: ShoppingCart, color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'Custom App Admin API' },
                      { id: 'Daraz', icon: Layers, color: 'text-orange-400', bg: 'bg-orange-500/10', desc: 'Open Platform OAuth' }
                    ].map((p) => (
                      <button 
                        key={p.id}
                        onClick={() => setSelectedPlatform(p.id as any)}
                        className="p-8 rounded-3xl border border-white/5 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-center group"
                      >
                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors", p.bg, p.color)}>
                          <p.icon className="w-8 h-8" />
                        </div>
                        <span className="font-bold text-lg group-hover:text-white transition-colors block">{p.id}</span>
                        <span className="text-[10px] text-brand-500 uppercase tracking-widest font-bold mt-2 block">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setSelectedPlatform(null)} className="text-blue-400 text-xs font-bold hover:underline flex items-center gap-1">
                      <ChevronRight className="w-3 h-3 rotate-180" /> Back to selection
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-sm font-bold flex items-center gap-2">
                      Connecting {selectedPlatform}
                      {selectedPlatform === 'Daraz' && <ShieldCheck className="w-4 h-4 text-orange-400" />}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Store Display Name</label>
                      <input type="text" placeholder="e.g. My Online Store" value={formData.storeName} onChange={(e) => setFormData(p => ({...p, storeName: e.target.value}))} className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Store URL / Domain</label>
                      <input type="text" placeholder="https://..." value={formData.storeUrl} onChange={(e) => setFormData(p => ({...p, storeUrl: e.target.value}))} className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                    </div>

                    {selectedPlatform === 'Daraz' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Region / Country</label>
                          <div className="relative">
                            <select value={formData.region} onChange={(e) => setFormData(p => ({...p, region: e.target.value}))} className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none">
                              <option value="pk">Pakistan (PK)</option>
                              <option value="bd">Bangladesh (BD)</option>
                              <option value="lk">Sri Lanka (LK)</option>
                              <option value="np">Nepal (NP)</option>
                              <option value="mm">Myanmar (MM)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Seller ID (Store ID)</label>
                          <input type="text" placeholder="PK-XXXXXX" value={formData.sellerId} onChange={(e) => setFormData(p => ({...p, sellerId: e.target.value}))} className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">App Key (Daraz Open Platform)</label>
                          <input type="text" placeholder="Enter App Key" value={formData.appKey} onChange={(e) => setFormData(p => ({...p, appKey: e.target.value}))} className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">App Secret</label>
                          <div className="relative">
                            <input type="password" placeholder="Enter App Secret" value={formData.appSecret} onChange={(e) => setFormData(p => ({...p, appSecret: e.target.value}))} className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-600" />
                          </div>
                        </div>
                        <div className="md:col-span-2 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-3">
                          <Info className="w-4 h-4 text-orange-400 mt-0.5" />
                          <div className="space-y-2">
                            <p className="text-[10px] text-brand-400 leading-relaxed">
                              To connect Daraz, you must first create an application on the <a href="https://open.daraz.com" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline font-bold">Daraz Open Platform</a>.
                            </p>
                            <p className="text-[10px] text-brand-500 leading-relaxed">
                              After providing the App Key and Secret, click the button below to be redirected to Daraz for OAuth authorization.
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedPlatform === 'WooCommerce' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Consumer Key</label>
                          <input type="text" placeholder="ck_..." className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Consumer Secret</label>
                          <input type="password" placeholder="cs_..." className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="md:col-span-2 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-start gap-3">
                          <Info className="w-4 h-4 text-purple-400 mt-0.5" />
                          <p className="text-[10px] text-brand-400 leading-relaxed">
                            Generate these keys in your WordPress admin under <span className="text-white font-bold">WooCommerce {'>'} Settings {'>'} Advanced {'>'} REST API</span>. Ensure the keys have <span className="text-white font-bold">"Read/Write"</span> permissions.
                          </p>
                        </div>
                      </>
                    )}

                    {selectedPlatform === 'Shopify' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">API Key</label>
                          <input type="text" placeholder="Enter API Key" className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Admin Access Token (shpat_...)</label>
                          <input type="password" placeholder="shpat_..." className="w-full bg-brand-950 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="md:col-span-2 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                          <Info className="w-4 h-4 text-emerald-400 mt-0.5" />
                          <p className="text-[10px] text-brand-400 leading-relaxed">
                            Create a "Custom App" in your Shopify admin under <span className="text-white font-bold">Settings {'>'} App and sales channels {'>'} Develop apps</span>. Enable <span className="text-white font-bold">Admin API scopes</span> for products and orders.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedPlatform(null)}
                      className="px-6 py-3 rounded-xl text-sm font-bold text-brand-400 hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => selectedPlatform === 'Daraz' ? handleDarazOAuth() : alert('Coming soon: ' + selectedPlatform)}
                      className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                      {selectedPlatform === 'Daraz' ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Authenticate with Daraz
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Verify & Connect Store
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
