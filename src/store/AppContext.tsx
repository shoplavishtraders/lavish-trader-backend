import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Order, Customer, Supplier, Expense, StoreConnection, StockAdjustment } from '../types';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface AppSettings {
  name: string;
  email: string;
  phone: string;
  darkMode: boolean;
  autoSync: boolean;
  emailNotifications: boolean;
  businessName: string;
  currency: string;
  taxRate: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  suppliers: Supplier[];
  expenses: Expense[];
  users: AppUser[];
  connections: StoreConnection[];
  stockAdjustments: StockAdjustment[];
  settings: AppSettings;
  toasts: Toast[];

  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addOrder: (o: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;

  addCustomer: (c: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, c: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  addSupplier: (s: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, s: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  addExpense: (e: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  addUser: (u: Omit<AppUser, 'id'>) => void;
  updateUser: (id: string, u: Partial<AppUser>) => void;
  deleteUser: (id: string) => void;

  addConnection: (c: Omit<StoreConnection, 'id'>) => void;
  deleteConnection: (id: string) => void;
  updateConnectionStatus: (id: string, status: StoreConnection['status']) => void;

  addStockAdjustment: (adj: Omit<StockAdjustment, 'id' | 'productName' | 'variationColor' | 'beforeQty' | 'afterQty' | 'date'>) => void;

  updateSettings: (s: Partial<AppSettings>) => void;

  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const defaultProducts: Product[] = [
  { id: '1', name: 'Premium Cotton Hoodie', brand: 'StyleBrand', model: 'HD-001', design: 'Classic', sku: 'HD-001-BL', category: 'Apparel', stock: 124, price: 4500, cost: 2100, variations: [], status: 'Active', platforms: ['WooCommerce', 'Shopify'] },
  { id: '2', name: 'Wireless Noise Cancelling Headphones', brand: 'AudioTech', model: 'WH-1000XM4', design: 'Over-ear', sku: 'WH-1000XM4', category: 'Electronics', stock: 45, price: 65000, cost: 42000, variations: [], status: 'Active', platforms: ['Shopify', 'Daraz'] },
  { id: '3', name: 'Ergonomic Office Chair', brand: 'FurnitureMax', model: 'OC-ERG-01', design: 'Modern', sku: 'OC-ERG-01', category: 'Furniture', stock: 12, price: 28000, cost: 15500, variations: [], status: 'Active', platforms: ['WooCommerce', 'Daraz'] },
  { id: '4', name: 'Mechanical Gaming Keyboard', brand: 'GamingGear', model: 'KB-RGB-MECH', design: 'RGB', sku: 'KB-RGB-MECH', category: 'Electronics', stock: 89, price: 12500, cost: 6200, variations: [], status: 'Active', platforms: ['WooCommerce', 'Shopify', 'Daraz'] },
  { id: '5', name: 'Stainless Steel Water Bottle', brand: 'HydroLife', model: 'WB-SS-750', design: 'Sport', sku: 'WB-SS-750', category: 'Accessories', stock: 245, price: 2200, cost: 850, variations: [], status: 'Active', platforms: ['Shopify'] },
  { id: '6', name: 'Leather Wallet', brand: 'LeatherCraft', model: 'LW-BLK-01', design: 'Compact', sku: 'LW-BLK-01', category: 'Accessories', stock: 56, price: 3500, cost: 1200, variations: [], status: 'Active', platforms: ['WooCommerce', 'Daraz'] },
  { id: '7', name: 'Denim Jacket', brand: 'DenimHub', model: 'DJ-IND-01', design: 'Vintage', sku: 'DJ-IND-01', category: 'Apparel', stock: 34, price: 8500, cost: 4200, variations: [], status: 'Active', platforms: ['Shopify'] },
  { id: '8', name: 'Smart Watch', brand: 'TechWear', model: 'SW-PRO-01', design: 'Sports', sku: 'SW-PRO-01', category: 'Electronics', stock: 21, price: 42000, cost: 28000, variations: [], status: 'Active', platforms: ['WooCommerce', 'Shopify', 'Daraz'] },
];

const defaultOrders: Order[] = [
  { id: '#ORD-7829', customer: 'Ahmed Raza', date: '2026-04-05 14:20', total: 12500, status: 'Processing', platform: 'WooCommerce' },
  { id: '#ORD-7830', customer: 'Sara Khan', date: '2026-04-05 13:45', total: 8400, status: 'Pending', platform: 'Shopify' },
  { id: '#ORD-7831', customer: 'Zainab Bibi', date: '2026-04-05 12:10', total: 3200, status: 'Shipped', platform: 'Daraz' },
  { id: '#ORD-7832', customer: 'Ali Hassan', date: '2026-04-05 11:30', total: 1500, status: 'Delivered', platform: 'POS' },
  { id: '#ORD-7833', customer: 'Fatima Zahra', date: '2026-04-05 10:15', total: 22000, status: 'Cancelled', platform: 'WooCommerce' },
  { id: '#ORD-7834', customer: 'Bilal Ahmed', date: '2026-04-05 09:40', total: 5600, status: 'Processing', platform: 'Shopify' },
  { id: '#ORD-7835', customer: 'Nadia Shah', date: '2026-04-04 16:20', total: 9800, status: 'Delivered', platform: 'Daraz' },
  { id: '#ORD-7836', customer: 'Usman Tariq', date: '2026-04-04 14:10', total: 4200, status: 'Shipped', platform: 'POS' },
];

const defaultCustomers: Customer[] = [
  { id: '1', name: 'Ahmed Raza', email: 'ahmed@gmail.com', phone: '0300-1234567', totalOrders: 12, totalSpent: 45000, lastOrderDate: '2026-04-05', status: 'Active' },
  { id: '2', name: 'Sara Khan', email: 'sara@yahoo.com', phone: '0321-7654321', totalOrders: 8, totalSpent: 28400, lastOrderDate: '2026-04-03', status: 'Active' },
  { id: '3', name: 'Zainab Bibi', email: 'zainab@outlook.com', phone: '0311-9876543', totalOrders: 3, totalSpent: 12200, lastOrderDate: '2026-04-01', status: 'Inactive' },
  { id: '4', name: 'Ali Hassan', email: 'ali@gmail.com', phone: '0345-1122334', totalOrders: 15, totalSpent: 82000, lastOrderDate: '2026-04-05', status: 'Active' },
  { id: '5', name: 'Fatima Zahra', email: 'fatima@gmail.com', phone: '0333-5566778', totalOrders: 5, totalSpent: 15600, lastOrderDate: '2026-03-28', status: 'Active' },
  { id: '6', name: 'Bilal Ahmed', email: 'bilal@hotmail.com', phone: '0312-9988776', totalOrders: 7, totalSpent: 31500, lastOrderDate: '2026-04-04', status: 'Active' },
];

const defaultSuppliers: Supplier[] = [
  { id: '1', name: 'Al-Fatah Textiles', contact: '0300-1234567', reliability: 4.8, balance: 125000 },
  { id: '2', name: 'Zia Electronics', contact: '0321-7654321', reliability: 4.2, balance: 45000 },
  { id: '3', name: 'Metro Wholesale', contact: '0311-9876543', reliability: 4.5, balance: 0 },
  { id: '4', name: 'Global Logistics', contact: '0345-1122334', reliability: 3.9, balance: 8200 },
  { id: '5', name: 'Prime Packaging', contact: '0333-5566778', reliability: 4.9, balance: 15600 },
];

const defaultExpenses: Expense[] = [
  { id: '1', category: 'Rent', amount: 85000, date: '2026-04-01', description: 'Monthly warehouse rent' },
  { id: '2', category: 'Utilities', amount: 12400, date: '2026-04-02', description: 'Electricity and water bill' },
  { id: '3', category: 'Marketing', amount: 45000, date: '2026-04-03', description: 'Facebook and Google Ads' },
  { id: '4', category: 'Salaries', amount: 240000, date: '2026-04-05', description: 'Staff payroll for March' },
  { id: '5', category: 'Logistics', amount: 8200, date: '2026-04-05', description: 'Courier charges for Daraz orders' },
];

const defaultUsers: AppUser[] = [
  { id: '1', name: 'Usama Akram', email: 'usama@omnicore.com', role: 'Administrator', status: 'Active', lastLogin: '2 mins ago' },
  { id: '2', name: 'Ahmed Raza', email: 'ahmed@omnicore.com', role: 'Manager', status: 'Active', lastLogin: '1 hour ago' },
  { id: '3', name: 'Sara Khan', email: 'sara@omnicore.com', role: 'Sales Associate', status: 'Active', lastLogin: '3 hours ago' },
  { id: '4', name: 'Zainab Bibi', email: 'zainab@omnicore.com', role: 'Inventory Specialist', status: 'Inactive', lastLogin: '2 days ago' },
  { id: '5', name: 'Ali Hassan', email: 'ali@omnicore.com', role: 'Sales Associate', status: 'Active', lastLogin: '5 mins ago' },
];

const defaultConnections: StoreConnection[] = [
  { id: '1', platform: 'WooCommerce', storeName: 'OmniCore Main Shop', storeUrl: 'https://shop.omnicore.com', status: 'Connected', lastSync: '2 mins ago', credentials: { consumerKey: 'ck_7829...3210', consumerSecret: 'cs_9912...8877' } },
  { id: '2', platform: 'Shopify', storeName: 'OmniCore Official', storeUrl: 'https://omnicore-official.myshopify.com', status: 'Error', lastSync: '15 mins ago', credentials: { adminAccessToken: 'shpat_928...4455', apiKey: '8822...1100' } },
  { id: '3', platform: 'Daraz', storeName: 'OmniCore Daraz Mall', storeUrl: 'https://daraz.pk/shop/omnicore', status: 'Connected', lastSync: '5 mins ago', credentials: { storeId: 'PK-123456', appKey: '100293', appSecret: 'as_928...1122', accessToken: 'dz_1122...9988', region: 'pk' } },
];

const defaultSettings: AppSettings = {
  name: 'Usama Akram',
  email: 'usama@omnicore.com',
  phone: '+92 300 1234567',
  darkMode: true,
  autoSync: true,
  emailNotifications: false,
  businessName: 'OmniCore Retail',
  currency: 'PKR',
  taxRate: 17,
};

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

function saveState(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadState('omni_products', defaultProducts));
  const [orders, setOrders] = useState<Order[]>(() => loadState('omni_orders', defaultOrders));
  const [customers, setCustomers] = useState<Customer[]>(() => loadState('omni_customers', defaultCustomers));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadState('omni_suppliers', defaultSuppliers));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadState('omni_expenses', defaultExpenses));
  const [users, setUsers] = useState<AppUser[]>(() => loadState('omni_users', defaultUsers));
  const [connections, setConnections] = useState<StoreConnection[]>(() => loadState('omni_connections', defaultConnections));
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>(() => loadState('omni_stock_adjustments', []));
  const [settings, setSettings] = useState<AppSettings>(() => loadState('omni_settings', defaultSettings));
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => { saveState('omni_products', products); }, [products]);
  useEffect(() => { saveState('omni_orders', orders); }, [orders]);
  useEffect(() => { saveState('omni_customers', customers); }, [customers]);
  useEffect(() => { saveState('omni_suppliers', suppliers); }, [suppliers]);
  useEffect(() => { saveState('omni_expenses', expenses); }, [expenses]);
  useEffect(() => { saveState('omni_users', users); }, [users]);
  useEffect(() => { saveState('omni_connections', connections); }, [connections]);
  useEffect(() => { saveState('omni_stock_adjustments', stockAdjustments); }, [stockAdjustments]);
  useEffect(() => { saveState('omni_settings', settings); }, [settings]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = genId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Products
  const addProduct = useCallback((p: Omit<Product, 'id'>) => {
    setProducts(prev => [{ ...p, id: genId() }, ...prev]);
    showToast('Product added successfully');
  }, [showToast]);

  const updateProduct = useCallback((id: string, p: Partial<Product>) => {
    setProducts(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
    showToast('Product updated');
  }, [showToast]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(x => x.id !== id));
    showToast('Product deleted', 'info');
  }, [showToast]);

  // Orders
  const addOrder = useCallback((o: Omit<Order, 'id'>) => {
    const newOrder = { ...o, id: `#ORD-${Math.floor(8000 + Math.random() * 1000)}` };
    setOrders(prev => [newOrder, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders(prev => prev.map(x => x.id === id ? { ...x, status } : x));
    showToast(`Order status updated to ${status}`);
  }, [showToast]);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(x => x.id !== id));
    showToast('Order removed', 'info');
  }, [showToast]);

  // Customers
  const addCustomer = useCallback((c: Omit<Customer, 'id'>) => {
    setCustomers(prev => [{ ...c, id: genId() }, ...prev]);
    showToast('Customer added successfully');
  }, [showToast]);

  const updateCustomer = useCallback((id: string, c: Partial<Customer>) => {
    setCustomers(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
    showToast('Customer updated');
  }, [showToast]);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(x => x.id !== id));
    showToast('Customer deleted', 'info');
  }, [showToast]);

  // Suppliers
  const addSupplier = useCallback((s: Omit<Supplier, 'id'>) => {
    setSuppliers(prev => [{ ...s, id: genId() }, ...prev]);
    showToast('Supplier added successfully');
  }, [showToast]);

  const updateSupplier = useCallback((id: string, s: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(x => x.id === id ? { ...x, ...s } : x));
    showToast('Supplier updated');
  }, [showToast]);

  const deleteSupplier = useCallback((id: string) => {
    setSuppliers(prev => prev.filter(x => x.id !== id));
    showToast('Supplier deleted', 'info');
  }, [showToast]);

  // Expenses
  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setExpenses(prev => [{ ...e, id: genId() }, ...prev]);
    showToast('Expense recorded');
  }, [showToast]);

  const updateExpense = useCallback((id: string, e: Partial<Expense>) => {
    setExpenses(prev => prev.map(x => x.id === id ? { ...x, ...e } : x));
    showToast('Expense updated');
  }, [showToast]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(x => x.id !== id));
    showToast('Expense deleted', 'info');
  }, [showToast]);

  // Users
  const addUser = useCallback((u: Omit<AppUser, 'id'>) => {
    setUsers(prev => [{ ...u, id: genId() }, ...prev]);
    showToast('User added successfully');
  }, [showToast]);

  const updateUser = useCallback((id: string, u: Partial<AppUser>) => {
    setUsers(prev => prev.map(x => x.id === id ? { ...x, ...u } : x));
    showToast('User updated');
  }, [showToast]);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(x => x.id !== id));
    showToast('User deleted', 'info');
  }, [showToast]);

  // Connections
  const addConnection = useCallback((c: Omit<StoreConnection, 'id'>) => {
    setConnections(prev => [{ ...c, id: genId() }, ...prev]);
    showToast('Store connected successfully');
  }, [showToast]);

  const deleteConnection = useCallback((id: string) => {
    setConnections(prev => prev.filter(x => x.id !== id));
    showToast('Store disconnected', 'info');
  }, [showToast]);

  const updateConnectionStatus = useCallback((id: string, status: StoreConnection['status']) => {
    setConnections(prev => prev.map(x => x.id === id ? { ...x, status, lastSync: 'just now' } : x));
    showToast(`Sync status: ${status}`);
  }, [showToast]);

  // Stock Adjustments
  const addStockAdjustment = useCallback((adj: Omit<StockAdjustment, 'id' | 'productName' | 'variationColor' | 'beforeQty' | 'afterQty' | 'date'>) => {
    const product = products.find(p => p.id === adj.productId);
    if (!product) return;

    const variation = adj.variationId ? product.variations.find(v => v.id === adj.variationId) : null;
    const beforeQty = variation ? variation.stock : product.stock;

    let afterQty = beforeQty;
    if (adj.type === 'Add') {
      afterQty = beforeQty + adj.quantity;
    } else if (adj.type === 'Remove') {
      afterQty = Math.max(0, beforeQty - adj.quantity);
    } else if (adj.type === 'Set') {
      afterQty = adj.quantity;
    }

    // Update product/variation stock
    setProducts(prev => prev.map(p => {
      if (p.id === adj.productId) {
        if (variation) {
          return {
            ...p,
            variations: p.variations.map(v =>
              v.id === variation.id ? { ...v, stock: afterQty } : v
            ),
            stock: p.stock - beforeQty + afterQty,
          };
        } else {
          return { ...p, stock: afterQty };
        }
      }
      return p;
    }));

    // Record the adjustment
    const adjustment: StockAdjustment = {
      id: genId(),
      productId: adj.productId,
      productName: product.name,
      variationId: adj.variationId,
      variationColor: variation?.colorName,
      type: adj.type,
      quantity: adj.quantity,
      reason: adj.reason,
      reference: adj.reference,
      notes: adj.notes,
      beforeQty,
      afterQty,
      date: new Date().toISOString(),
    };

    setStockAdjustments(prev => [adjustment, ...prev]);
    showToast('Stock adjustment recorded');
  }, [products, showToast]);

  // Settings
  const updateSettings = useCallback((s: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
    showToast('Settings saved');
  }, [showToast]);

  return (
    <AppContext.Provider value={{
      products, orders, customers, suppliers, expenses, users, connections, stockAdjustments, settings, toasts,
      addProduct, updateProduct, deleteProduct,
      addOrder, updateOrderStatus, deleteOrder,
      addCustomer, updateCustomer, deleteCustomer,
      addSupplier, updateSupplier, deleteSupplier,
      addExpense, updateExpense, deleteExpense,
      addUser, updateUser, deleteUser,
      addConnection, deleteConnection, updateConnectionStatus,
      addStockAdjustment,
      updateSettings,
      showToast, dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
