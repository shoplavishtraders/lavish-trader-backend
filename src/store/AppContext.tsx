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

const defaultProducts: Product[] = [];

const defaultOrders: Order[] = [];

const defaultCustomers: Customer[] = [];

const defaultSuppliers: Supplier[] = [];

const defaultExpenses: Expense[] = [];

const defaultUsers: AppUser[] = [];

const defaultConnections: StoreConnection[] = [];

const defaultSettings: AppSettings = {
  name: '',
  email: '',
  phone: '',
  darkMode: false,
  autoSync: true,
  emailNotifications: false,
  businessName: '',
  currency: 'USD',
  taxRate: 0,
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
