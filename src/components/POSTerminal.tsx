import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, User, Tag, Package, X, CheckCircle2 } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { useApp } from '../store/AppContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
}

type PaymentMethod = 'Cash' | 'Card' | 'Bank Transfer';

function ReceiptModal({ orderNum, items, subtotal, tax, total, method, onClose }: {
  orderNum: string; items: CartItem[]; subtotal: number; tax: number; total: number; method: PaymentMethod; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-sm animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center border-b border-white/5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold">Order Complete!</h2>
          <p className="text-brand-400 text-sm mt-1">{orderNum}</p>
        </div>
        <div className="p-6 space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-brand-300">{item.name} × {item.quantity}</span>
              <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-brand-400">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-brand-400">Tax (17%)</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-blue-400">{formatCurrency(total)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-brand-400">Payment</span><span className="text-emerald-400">{method}</span></div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-white transition-all">
            New Order
          </button>
        </div>
      </div>
    </div>
  );
}

export function POSTerminal() {
  const { products, addOrder, settings, showToast } = useApp();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [discount, setDiscount] = useState(0);
  const [receipt, setReceipt] = useState<{ orderNum: string; items: CartItem[]; subtotal: number; tax: number; total: number } | null>(null);

  const taxRate = settings.taxRate / 100;

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [products, search]);

  const addToCart = (product: typeof products[0]) => {
    if (product.stock === 0) { showToast('Out of stock', 'error'); return; }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, sku: product.sku }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = Math.min(discount, subtotal);
  const taxable = subtotal - discountAmount;
  const tax = taxable * taxRate;
  const total = taxable + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderNum = `#ORD-${Math.floor(8000 + Math.random() * 2000)}`;
    const customer = customerName.trim() || 'Walk-in Customer';
    addOrder({
      customer,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      total,
      status: 'Delivered',
      platform: 'POS',
    });
    setReceipt({ orderNum, items: [...cart], subtotal, tax, total });
    showToast(`Order ${orderNum} completed!`);
  };

  const handleReceiptClose = () => {
    setReceipt(null);
    setCart([]);
    setCustomerName('');
    setDiscount(0);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">POS Terminal</h1>
            <p className="text-brand-400 mt-1">Quick checkout for in-store customers.</p>
          </div>
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl border border-white/10">
            <User className="w-4 h-4 text-blue-400" />
            <input
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Customer name..."
              className="bg-transparent text-sm font-bold focus:outline-none w-36 placeholder-brand-500"
            />
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Scan barcode or search products..."
            className="w-full bg-brand-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-blue-500/50 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-brand-500">No products found</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="glass-card p-4 text-left group hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-blue-600 rounded-lg p-1 shadow-lg shadow-blue-500/20">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="w-full aspect-square rounded-xl bg-brand-800 flex items-center justify-center mb-3 border border-white/5 group-hover:bg-brand-700 transition-colors">
                    <Package className="w-8 h-8 text-brand-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h4 className="font-bold text-xs leading-snug line-clamp-2">{product.name}</h4>
                  <p className="text-[10px] text-brand-500 mt-1">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-blue-400 font-bold text-sm">{formatCurrency(product.price)}</span>
                    <span className={cn('text-[10px] font-bold uppercase', product.stock > 0 ? 'text-brand-500' : 'text-red-400')}>
                      {product.stock > 0 ? `×${product.stock}` : 'Out'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      <div className="w-[380px] flex flex-col glass-card flex-shrink-0">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold">Current Order</h3>
          </div>
          <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-lg text-xs font-bold">{cart.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <ShoppingCart className="w-12 h-12 mb-3" />
              <p className="font-bold text-sm">Cart is empty</p>
              <p className="text-xs mt-1">Click products to add</p>
            </div>
          ) : cart.map((item) => (
            <div key={item.id} className="flex gap-3 group">
              <div className="w-12 h-12 rounded-lg bg-brand-800 flex items-center justify-center border border-white/5 flex-shrink-0">
                <Package className="w-5 h-5 text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-xs font-bold truncate leading-snug">{item.name}</h4>
                  <button onClick={() => removeFromCart(item.id)} className="p-0.5 rounded hover:bg-red-500/10 text-brand-500 hover:text-red-400 transition-colors flex-shrink-0">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-blue-400 font-bold mt-0.5">{formatCurrency(item.price)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1 bg-brand-950 rounded-lg px-1 border border-white/5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded hover:bg-white/5"><Minus className="w-2.5 h-2.5" /></button>
                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded hover:bg-white/5"><Plus className="w-2.5 h-2.5" /></button>
                  </div>
                  <span className="text-xs font-bold text-brand-400 ml-auto">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 bg-white/5 border-t border-white/5 space-y-3">
          {/* Payment method */}
          <div className="grid grid-cols-3 gap-1.5">
            {(['Cash', 'Card', 'Bank Transfer'] as PaymentMethod[]).map(m => (
              <button key={m} onClick={() => setPaymentMethod(m)}
                className={cn('py-2 rounded-lg text-[10px] font-bold transition-all border',
                  paymentMethod === m ? 'bg-blue-600/20 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/5 text-brand-400 hover:bg-white/10')}>
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-brand-400">Subtotal</span>
              <span className="font-bold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-blue-400">
                <Tag className="w-3 h-3" />
                <span className="font-bold">Discount</span>
              </div>
              <input type="number" min={0} max={subtotal} value={discount || ''}
                onChange={e => setDiscount(Math.max(0, +e.target.value))}
                placeholder="0"
                className="w-20 bg-brand-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-right font-bold text-blue-400 focus:outline-none focus:border-blue-500/50" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-400">Tax ({settings.taxRate}%)</span>
              <span className="font-bold">{formatCurrency(tax)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Total</p>
              <h2 className="text-2xl font-bold text-white mt-0.5">{formatCurrency(total)}</h2>
            </div>
            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold text-white transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Checkout
            </button>
          </div>
        </div>
      </div>

      {receipt && (
        <ReceiptModal
          orderNum={receipt.orderNum}
          items={receipt.items}
          subtotal={receipt.subtotal}
          tax={receipt.tax}
          total={receipt.total}
          method={paymentMethod}
          onClose={handleReceiptClose}
        />
      )}
    </div>
  );
}
