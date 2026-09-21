import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InventoryCategory } from '../types';

export const WarehouseView: React.FC = () => {
  const { inventory, inventoryCategory, setInventoryCategory, toggleItemAvailability } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = inventory.filter((item) => {
    const matchesCategory =
      inventoryCategory === 'all' || item.category === inventoryCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bayLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { id: InventoryCategory; label: string; count: number }[] = [
    { id: 'all', label: `All (${inventory.length})`, count: inventory.length },
    { id: 'electrical', label: '⚡ Electrical', count: inventory.filter((i) => i.category === 'electrical').length },
    { id: 'construction', label: '🏗️ Construction', count: inventory.filter((i) => i.category === 'construction').length },
    { id: 'technician', label: '🛠️ Technician', count: inventory.filter((i) => i.category === 'technician').length },
  ];

  return (
    <main id="view-warehouse" className="tab-content active flex-1 px-4 pt-2 pb-6">
      {/* Search Bar for Rapid Warehouse Lookups */}
      <div className="mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search items, bays, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Live Category quick filter */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto hide-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setInventoryCategory(cat.id)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold min-h-[36px] whitespace-nowrap shrink-0 transition ${
              inventoryCategory === cat.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Inventory & Services Vertical List */}
      <div className="space-y-3 pb-6">
        {filteredInventory.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-600">No inventory items found</p>
            <p className="text-xs text-slate-400 mt-1">Try another category or clear search filter.</p>
          </div>
        ) : (
          filteredInventory.map((item) => (
            <div
              key={item.id}
              className={`inventory-card bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-3 min-h-[76px] transition-all ${
                !item.isAvailable ? 'opacity-50' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="item-title text-sm font-bold text-slate-900 truncate">
                    {item.name}
                  </h2>
                  {!item.isAvailable && (
                    <span className="unavailable-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                      Unavailable
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-black text-slate-700">
                    ₹{item.price.toLocaleString('en-IN')} {item.unit}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    • {item.bayLocation}
                  </span>
                </div>
              </div>

              {/* Oversized Toggle Switch (min 48x48 touch target wrapper) */}
              <label className="relative inline-flex items-center justify-center min-w-[56px] min-h-[48px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.isAvailable}
                  onChange={() => toggleItemAvailability(item.id)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[12px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
              </label>
            </div>
          ))
        )}
      </div>
    </main>
  );
};
