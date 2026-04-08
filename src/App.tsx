/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProductCatalog } from './components/ProductCatalog';
import { POSTerminal } from './components/POSTerminal';
import { OrderHistory } from './components/OrderHistory';
import { Inventory } from './components/Inventory';
import { Reports } from './components/Reports';
import { SKUMapping } from './components/SKUMapping';
import { InventoryMapping } from './components/InventoryMapping';
import { Suppliers } from './components/Suppliers';
import { Expenses } from './components/Expenses';
import { UserManagement } from './components/UserManagement';
import { Permissions } from './components/Permissions';
import { Customers } from './components/Customers';
import { Integrations } from './components/Integrations';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { ToastContainer } from './components/Toast';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductCatalog />} />
            <Route path="pos" element={<POSTerminal />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customers" element={<Customers />} />
            <Route path="sync" element={<InventoryMapping />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="sku-mapping" element={<SKUMapping />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}
