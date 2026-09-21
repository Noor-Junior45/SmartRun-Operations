import React from 'react';
import { useApp } from '../context/AppContext';

export const OrdersView: React.FC = () => {
  const {
    orders,
    orderFilter,
    setOrderFilter,
    counts,
    startPacking,
    rejectOrder,
    markDelivered,
    showToast,
    createNewTestOrder,
  } = useApp();

  const toPackOrders = orders.filter((o) => o.status === 'to-pack');
  const onTheWayOrders = orders.filter((o) => o.status === 'on-the-way');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const openNavigationMap = (address?: string) => {
    const destination = encodeURIComponent(address || 'Plot 42, Sunrise Enclave, Sector 82 Gate #2, Industrial Area');
    showToast('Launching GPS route...');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  return (
    <main id="view-orders" className="tab-content active flex-1 px-4 pt-3 pb-6">
      {/* Top Sticky Filter Row (Pill-shaped Tabs) */}
      <header className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md pt-1 pb-3">
        <div className="flex items-center justify-between gap-1.5 p-1 bg-gray-200/80 rounded-2xl">
          <button
            onClick={() => setOrderFilter('to-pack')}
            id="filter-btn-to-pack"
            className={`filter-tab-btn flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 min-h-[44px] ${
              orderFilter === 'to-pack'
                ? 'shadow-sm bg-white text-blue-600 border border-black/5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>To Pack</span>
            <span
              className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-full ${
                orderFilter === 'to-pack'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
              id="count-to-pack"
            >
              {counts.toPack}
            </span>
          </button>

          <button
            onClick={() => setOrderFilter('on-the-way')}
            id="filter-btn-on-the-way"
            className={`filter-tab-btn flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 min-h-[44px] ${
              orderFilter === 'on-the-way'
                ? 'shadow-sm bg-white text-blue-600 border border-black/5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>On The Way</span>
            <span
              className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-full ${
                orderFilter === 'on-the-way'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
              id="count-on-the-way"
            >
              {counts.onTheWay}
            </span>
          </button>

          <button
            onClick={() => setOrderFilter('completed')}
            id="filter-btn-completed"
            className={`filter-tab-btn flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 min-h-[44px] ${
              orderFilter === 'completed'
                ? 'shadow-sm bg-white text-blue-600 border border-black/5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Done</span>
            <span
              className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-full ${
                orderFilter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
              id="count-completed"
            >
              {counts.completed}
            </span>
          </button>
        </div>
      </header>

      {/* Orders List Container */}
      <div className="space-y-4 pb-4">
        {/* ================= SUB-LIST: TO PACK ================= */}
        {orderFilter === 'to-pack' && (
          <div id="sublist-to-pack" className="space-y-3.5">
            {toPackOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
                <p className="text-sm font-bold text-slate-600">All orders packed!</p>
                <p className="text-xs text-slate-400 mt-1">Waiting for incoming dispatches...</p>
                <button
                  onClick={createNewTestOrder}
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-200 active:scale-95 transition"
                >
                  + Simulate Incoming Order
                </button>
              </div>
            ) : (
              toPackOrders.map((order) => (
                <article
                  key={order.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 flex flex-col gap-3 relative transition-all"
                  id={`order-card-${order.id.replace('SR-', '')}`}
                >
                  {/* Top Row: Order ID & Time Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-slate-900 tracking-tight">
                        #{order.id}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          order.relativeTime.includes('⚡')
                            ? 'bg-amber-100 text-amber-900 border border-amber-200/70 animate-pulse'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {order.relativeTime}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {order.deliveryType}
                    </span>
                  </div>

                  {/* Tag Row */}
                  <div className="flex flex-wrap gap-1.5">
                    {order.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                          tag === 'Products'
                            ? 'bg-sky-50 text-sky-700 border-sky-200/60'
                            : 'bg-purple-50 text-purple-700 border-purple-200/60'
                        }`}
                      >
                        {tag === 'Products' ? '📦 Products' : '🛠️ Service Booking'}
                      </span>
                    ))}
                  </div>

                  {/* Itemized List */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`flex items-start justify-between text-sm ${
                          idx > 0 ? 'border-t border-slate-200/60 pt-1.5' : ''
                        }`}
                      >
                        <span className="text-slate-800 font-medium leading-snug">
                          <strong
                            className={`font-extrabold mr-1 text-base ${
                              item.isService ? 'text-purple-600' : 'text-blue-600'
                            }`}
                          >
                            {item.quantity}x
                          </strong>{' '}
                          {item.name}
                        </span>
                        <span
                          className={`text-xs font-bold whitespace-nowrap ml-2 ${
                            item.isService
                              ? 'text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded'
                              : 'text-slate-500'
                          }`}
                        >
                          {item.locationBay}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Badge */}
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-xl border ${
                      order.paymentStatus === 'Pay on Completion'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {order.paymentStatus === 'Pay on Completion' ? (
                        <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      )}
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {order.paymentStatus}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-black ${
                        order.paymentStatus === 'Pay on Completion' ? 'text-amber-950' : 'text-emerald-950'
                      }`}
                    >
                      {order.amountLabel}
                    </span>
                  </div>

                  {/* Action Buttons: Split */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (window.confirm(`Reject order #${order.id}? Inventory will be freed.`)) {
                          rejectOrder(order.id);
                        }
                      }}
                      className="col-span-2 min-h-[48px] px-3 py-3 rounded-xl border-2 border-rose-500 text-rose-600 font-bold text-sm flex items-center justify-center gap-1.5 active:bg-rose-50 active:scale-[0.98] transition"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => startPacking(order.id)}
                      className="col-span-3 min-h-[48px] px-3 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:bg-emerald-600 active:scale-[0.98] transition"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Start Packing</span>
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* ================= SUB-LIST: ON THE WAY ================= */}
        {orderFilter === 'on-the-way' && (
          <div id="sublist-on-the-way" className="space-y-3.5">
            {onTheWayOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
                <p className="text-sm font-bold text-slate-600">No orders currently on the way.</p>
                <p className="text-xs text-slate-400 mt-1">Start packing from "To Pack" tab.</p>
              </div>
            ) : (
              onTheWayOrders.map((order) => (
                <article
                  key={order.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 flex flex-col gap-3 relative transition-all"
                  id={`order-card-${order.id.replace('SR-', '')}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-slate-900 tracking-tight">
                        #{order.id}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                        {order.relativeTime}
                      </span>
                    </div>
                    {order.distanceKm && (
                      <span className="text-xs font-bold text-emerald-600">
                        {order.distanceKm} km away
                      </span>
                    )}
                  </div>

                  {/* Customer & Destination Detail */}
                  {order.customerName && (
                    <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-slate-700">
                      <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                        <span>{order.customerName}</span>
                        {order.customerPhone && (
                          <span className="text-[11px] text-blue-700 font-mono">
                            {order.customerPhone}
                          </span>
                        )}
                      </div>
                      {order.destinationAddress && (
                        <div className="mt-1 text-slate-600 leading-snug">
                          {order.destinationAddress}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {order.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                          tag === 'Products'
                            ? 'bg-sky-50 text-sky-700 border-sky-200/60'
                            : 'bg-purple-50 text-purple-700 border-purple-200/60'
                        }`}
                      >
                        {tag === 'Products' ? '📦 Products' : '🛠️ Service Booking'}
                      </span>
                    ))}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`flex items-start justify-between text-sm ${
                          idx > 0 ? 'border-t border-slate-200/60 pt-1.5' : ''
                        }`}
                      >
                        <span className="text-slate-800 font-medium">
                          <strong
                            className={`font-extrabold mr-1 text-base ${
                              item.isService ? 'text-purple-600' : 'text-blue-600'
                            }`}
                          >
                            {item.quantity}x
                          </strong>{' '}
                          {item.name}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            item.isService ? 'text-purple-700 font-bold' : 'text-slate-500'
                          }`}
                        >
                          {item.locationBay}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Badge */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {order.paymentStatus}
                      </span>
                    </div>
                    <span className="text-sm font-black text-amber-950">
                      {order.amountLabel}
                    </span>
                  </div>

                  {/* Action Buttons: Split (Call/Map icons on left, Solid bright green on right) */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${order.customerPhone ? order.customerPhone.replace(/\s+/g, '') : '9840211203'}`}
                      className="min-w-[48px] min-h-[48px] w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center active:bg-slate-200 transition"
                      aria-label="Call Customer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </a>

                    <button
                      onClick={() => openNavigationMap(order.destinationAddress)}
                      className="min-w-[48px] min-h-[48px] w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center active:bg-blue-100 transition"
                      aria-label="Open Map Navigation"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                      </svg>
                    </button>

                    <button
                      onClick={() => markDelivered(order.id)}
                      className="flex-1 min-h-[48px] px-3 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 active:bg-emerald-600 active:scale-[0.98] transition"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="truncate">Mark Done / Delivered</span>
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* ================= SUB-LIST: COMPLETED ================= */}
        {orderFilter === 'completed' && (
          <div id="sublist-completed" className="space-y-3.5">
            {completedOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
                <p className="text-sm font-bold text-slate-600">No completed orders yet today.</p>
              </div>
            ) : (
              completedOrders.map((order) => (
                <article
                  key={order.id}
                  className="bg-white/90 rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-700">
                        #{order.id}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        ✓ {order.tags.includes('Service Booking') ? 'Service Finished' : 'Delivered & Completed'}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {order.relativeTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1 border-t border-slate-100">
                    <span>
                      {order.paymentStatus === 'Pay on Completion' ? `Collected Cash: ${order.amountLabel}` : 'Paid Online'}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {order.amountLabel}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
};
