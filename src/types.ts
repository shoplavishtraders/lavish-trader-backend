export interface ProductVariation {
  id: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stock: number;
  priceOverride?: number;
  barcode?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  design: string;
  sku: string; // base SKU
  category: string;
  stock: number; // total stock across all variations
  price: number;
  cost: number;
  variations: ProductVariation[];
  description?: string;
  status: 'Active' | 'Inactive';
  platforms: ('WooCommerce' | 'Shopify' | 'Daraz')[];
}

export interface Order {
  id: string;
  customer: string;
  customerPhone?: string;
  date: string;
  items?: Array<{ name: string; sku: string; qty: number; price: number }>;
  total: number;
  status: 'Pending' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  platform: 'WooCommerce' | 'Shopify' | 'Daraz' | 'POS';
  paymentMethod?: string;
  paymentStatus?: 'Paid' | 'Pending' | 'COD';
  trackingNumber?: string;
  notes?: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  variationId?: string;
  variationColor?: string;
  type: 'Add' | 'Remove' | 'Set';
  quantity: number;
  reason: 'Purchase' | 'Return' | 'Damaged' | 'Theft' | 'Correction' | 'Transfer';
  reference?: string;
  notes?: string;
  beforeQty: number;
  afterQty: number;
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email?: string;
  address?: string;
  reliability: number; // 0-5
  balance: number;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod?: string;
  recurring?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'Active' | 'Inactive';
}

export interface StoreConnection {
  id: string;
  platform: 'WooCommerce' | 'Shopify' | 'Daraz';
  storeName: string;
  storeUrl: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  credentials: {
    storeId?: string;
    appKey?: string;
    appSecret?: string;
    accessToken?: string;
    region?: 'pk' | 'bd' | 'lk' | 'np' | 'mm';
    consumerKey?: string;
    consumerSecret?: string;
    adminAccessToken?: string;
    apiKey?: string;
  };
}
