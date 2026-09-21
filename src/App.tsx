/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { MainTab } from './types';
import { OrdersView } from './components/OrdersView';
import { WarehouseView } from './components/WarehouseView';
import { SettingsView } from './components/SettingsView';
import { BottomNav } from './components/BottomNav';
import { LoginPage } from './components/LoginPage';

const SmartRunAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('orders');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="bg-white text-slate-900 antialiased min-h-screen w-full flex flex-col selection:bg-blue-100">
        <LoginPage onLoginSuccess={() => setActiveTab('orders')} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-slate-900 antialiased min-h-screen pb-24 selection:bg-blue-100">
      {/* Responsive Shell for Hybrid Web & Mobile App */}
      <div className="w-full max-w-4xl mx-auto min-h-screen bg-gray-50 flex flex-col relative">
        {/* VIEW 1: LIVE ORDERS SCREEN */}
        {activeTab === 'orders' && <OrdersView />}

        {/* VIEW 2: WAREHOUSE & SERVICES MANAGER */}
        {activeTab === 'warehouse' && <WarehouseView />}

        {/* VIEW 3: SETTINGS SCREEN */}
        {activeTab === 'settings' && <SettingsView />}

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <SmartRunAppContent />
      </AppProvider>
    </AuthProvider>
  );
}
