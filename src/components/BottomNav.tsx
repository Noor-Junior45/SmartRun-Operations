import React from 'react';
import { MainTab } from '../types';
import { useApp } from '../context/AppContext';

interface BottomNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { counts } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-2 flex items-center justify-around pointer-events-auto">
        {/* Nav Item 1: Orders */}
        <button
          onClick={() => {
            onTabChange('orders');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          id="nav-btn-orders"
          className={`nav-btn flex-1 flex flex-col items-center justify-center min-h-[52px] min-w-[48px] rounded-xl relative transition-all ${
            activeTab === 'orders' ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <svg className="w-6 h-6 stroke-[2.3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              ></path>
            </svg>
            {counts.toPack > 0 && (
              <span
                className="absolute -top-1.5 -right-2 w-4 h-4 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center"
                id="nav-badge-orders"
              >
                {counts.toPack}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Orders</span>
          <span
            className={`nav-indicator absolute -bottom-1 w-6 h-1 bg-blue-600 rounded-full ${
              activeTab === 'orders' ? 'block' : 'hidden'
            }`}
          ></span>
        </button>

        {/* Nav Item 2: Warehouse */}
        <button
          onClick={() => {
            onTabChange('warehouse');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          id="nav-btn-warehouse"
          className={`nav-btn flex-1 flex flex-col items-center justify-center min-h-[52px] min-w-[48px] rounded-xl relative transition-all ${
            activeTab === 'warehouse' ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <svg className="w-6 h-6 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Warehouse</span>
          <span
            className={`nav-indicator absolute -bottom-1 w-6 h-1 bg-blue-600 rounded-full ${
              activeTab === 'warehouse' ? 'block' : 'hidden'
            }`}
          ></span>
        </button>

        {/* Nav Item 3: Settings */}
        <button
          onClick={() => {
            onTabChange('settings');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          id="nav-btn-settings"
          className={`nav-btn flex-1 flex flex-col items-center justify-center min-h-[52px] min-w-[48px] rounded-xl relative transition-all ${
            activeTab === 'settings' ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <svg className="w-6 h-6 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Settings</span>
          <span
            className={`nav-indicator absolute -bottom-1 w-6 h-1 bg-blue-600 rounded-full ${
              activeTab === 'settings' ? 'block' : 'hidden'
            }`}
          ></span>
        </button>
      </div>
    </nav>
  );
};
