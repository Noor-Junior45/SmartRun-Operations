import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Order, InventoryItem, AppSettings, OrderStatus, InventoryCategory } from '../types';
import { getSupabase } from '../lib/supabase';
import { playOrderAlarmSound } from '../lib/audio';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'SR-1045',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    relativeTime: '⚡ 2m ago',
    deliveryType: 'Express Delivery',
    tags: ['Products', 'Service Booking'],
    paymentStatus: 'Pay on Completion',
    amount: 12500,
    amountLabel: 'Collect ₹12,500',
    status: 'to-pack',
    items: [
      { id: 'item-1', name: 'Luminous Rapid Charge 1650 Inverter', quantity: 1, locationBay: 'Bay A-04' },
      { id: 'item-2', name: 'V-Guard VT 300 250Ah Battery', quantity: 1, locationBay: 'Heavy Bay 2' },
      { id: 'item-3', name: 'Inverter Installation & Earthing', quantity: 1, locationBay: 'On-site', isService: true },
    ],
  },
  {
    id: 'SR-1048',
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    relativeTime: '⏱️ 6m ago',
    deliveryType: 'Standard Drop',
    tags: ['Products'],
    paymentStatus: 'Paid Online',
    amount: 2840,
    amountLabel: '₹2,840',
    status: 'to-pack',
    items: [
      { id: 'item-4', name: 'Ultratech Super Cement 50kg', quantity: 3, locationBay: 'Pallet 01' },
      { id: 'item-5', name: 'Dr. Fixit Waterproofing Chem 5L', quantity: 2, locationBay: 'Shelf C-12' },
    ],
  },
  {
    id: 'SR-1039',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    relativeTime: '🚚 Dispatched 14m ago',
    deliveryType: 'Standard Drop',
    tags: ['Service Booking', 'Products'],
    paymentStatus: 'Pay on Completion',
    amount: 3450,
    amountLabel: 'Collect ₹3,450',
    customerName: 'Rohan Gupta (Site Engr.)',
    customerPhone: '+91 98402 11203',
    destinationAddress: 'Plot 42, Sunrise Enclave, Sector 82 Gate #2, Industrial Area',
    distanceKm: 1.8,
    dispatchedTime: '14m ago',
    status: 'on-the-way',
    items: [
      { id: 'item-6', name: 'Havells 32A Double Pole MCB', quantity: 1, locationBay: 'Box #2' },
      { id: 'item-7', name: 'Emergency Distribution Box Replacement', quantity: 1, locationBay: 'Job Done by Operator', isService: true },
    ],
  },
  {
    id: 'SR-1035',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    relativeTime: '10:45 AM',
    deliveryType: 'Express Delivery',
    tags: ['Products'],
    paymentStatus: 'Paid Online',
    amount: 9200,
    amountLabel: '₹9,200',
    status: 'completed',
    items: [
      { id: 'item-8', name: 'Asian Paints Apex Ultima 20L White', quantity: 2, locationBay: 'Bay B-1' },
      { id: 'item-9', name: 'Roller Kit', quantity: 1, locationBay: 'Rack 4' },
    ],
  },
  {
    id: 'SR-1033',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    relativeTime: '09:15 AM',
    deliveryType: 'Standard Drop',
    tags: ['Service Booking'],
    paymentStatus: 'Pay on Completion',
    amount: 1850,
    amountLabel: '₹1,850',
    status: 'completed',
    items: [
      { id: 'item-10', name: 'Heavy 3-Phase Pump Starter Repair + Capacitor Swap', quantity: 1, locationBay: 'On-site', isService: true },
    ],
  },
  {
    id: 'SR-1029',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    relativeTime: 'Yesterday',
    deliveryType: 'Standard Drop',
    tags: ['Products'],
    paymentStatus: 'Paid Online',
    amount: 4600,
    amountLabel: '₹4,600',
    status: 'completed',
    items: [
      { id: 'item-11', name: 'Finolex 1.5 sq mm Wire Rolls (Red, Black, Green)', quantity: 4, locationBay: 'Rack E-01' },
    ],
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'V-Guard VT 300 250Ah Battery',
    price: 18500,
    unit: '',
    bayLocation: 'Warehouse Bay 2',
    category: 'electrical',
    isAvailable: true,
  },
  {
    id: 'inv-2',
    name: 'Ultratech Super Cement (50kg)',
    price: 420,
    unit: '/ bag',
    bayLocation: 'Pallet 01 (45 bags)',
    category: 'construction',
    isAvailable: true,
  },
  {
    id: 'inv-3',
    name: '🛠️ Solar Inverter PCB Diagnostics',
    price: 799,
    unit: 'visit charge',
    bayLocation: 'Operator Service',
    category: 'technician',
    isAvailable: false, // Initially unavailable in user prototype
    isService: true,
  },
  {
    id: 'inv-4',
    name: 'Finolex 2.5 sq mm Cable (90m)',
    price: 2150,
    unit: '/ coil',
    bayLocation: 'Rack E-03',
    category: 'electrical',
    isAvailable: true,
  },
  {
    id: 'inv-5',
    name: '🛠️ Inverter & Battery Installation',
    price: 650,
    unit: 'per setup',
    bayLocation: 'Fast 45-min Service',
    category: 'technician',
    isAvailable: true,
    isService: true,
  },
  {
    id: 'inv-6',
    name: 'Dr. Fixit Pidifin 2K Waterproofing',
    price: 1450,
    unit: '/ 15kg',
    bayLocation: 'Chemical Bay 1',
    category: 'construction',
    isAvailable: true,
  },
];

const INITIAL_SETTINGS: AppSettings = {
  isMasterOnline: true,
  loudAlarmEnabled: true,
  serviceRadiusKm: 8.5,
  activeWarehouseHub: 'South Hub - Warehouse 4',
  notificationEnabled: true,
  supabaseConfigured: false,
};

interface AppContextType {
  orders: Order[];
  inventory: InventoryItem[];
  settings: AppSettings;
  orderFilter: 'to-pack' | 'on-the-way' | 'completed';
  inventoryCategory: InventoryCategory;
  toastMessage: string | null;
  counts: {
    toPack: number;
    onTheWay: number;
    completed: number;
  };
  setOrderFilter: (filter: 'to-pack' | 'on-the-way' | 'completed') => void;
  setInventoryCategory: (cat: InventoryCategory) => void;
  startPacking: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  markDelivered: (orderId: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  toggleMasterOnline: () => void;
  toggleLoudAlarm: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  showToast: (msg: string) => void;
  createNewTestOrder: () => void;
  isRealtimeConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('smartrun_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('smartrun_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('smartrun_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [orderFilter, setOrderFilter] = useState<'to-pack' | 'on-the-way' | 'completed'>('to-pack');
  const [inventoryCategory, setInventoryCategory] = useState<InventoryCategory>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('smartrun_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('smartrun_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('smartrun_settings', JSON.stringify(settings));
  }, [settings]);

  // Real-time synchronization with Supabase
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setIsRealtimeConnected(false);
      return;
    }

    let isMounted = true;

    // Initial fetch from Supabase if tables exist
    const fetchSupabaseData = async () => {
      try {
        const { data: dbOrders, error: orderErr } = await supabase.from('orders').select('*');
        if (!orderErr && dbOrders && dbOrders.length > 0 && isMounted) {
          const mappedOrders: Order[] = dbOrders.map((o: any) => ({
            id: o.id,
            createdAt: o.created_at || new Date().toISOString(),
            relativeTime: o.relative_time || 'Just now',
            deliveryType: o.delivery_type || 'Express Delivery',
            tags: Array.isArray(o.tags) ? o.tags : ['Products'],
            items: Array.isArray(o.items) ? o.items : [],
            paymentStatus: o.payment_status || 'Pay on Completion',
            amount: Number(o.amount) || 0,
            amountLabel: o.amount_label || `₹${o.amount}`,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            destinationAddress: o.destination_address,
            distanceKm: o.distance_km,
            dispatchedTime: o.dispatched_time,
            status: o.status as OrderStatus,
          }));
          setOrders(mappedOrders);
        }

        const { data: dbInv, error: invErr } = await supabase.from('inventory').select('*');
        if (!invErr && dbInv && dbInv.length > 0 && isMounted) {
          const mappedInv: InventoryItem[] = dbInv.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            unit: item.unit || '',
            bayLocation: item.bay_location,
            category: item.category || 'electrical',
            isAvailable: Boolean(item.is_available),
            stockCount: item.stock_count,
            isService: Boolean(item.is_service),
          }));
          setInventory(mappedInv);
        }
      } catch (err) {
        console.warn('Supabase initial fetch bypassed, using local store:', err);
      }
    };

    fetchSupabaseData();

    // Setup Supabase Realtime Channel
    const channel = supabase
      .channel('smartrun_realtime_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as any;
            setOrders((prev) => [
              {
                id: newOrder.id,
                createdAt: newOrder.created_at,
                relativeTime: '⚡ Just now',
                deliveryType: newOrder.delivery_type || 'Express Delivery',
                tags: newOrder.tags || ['Products'],
                items: newOrder.items || [],
                paymentStatus: newOrder.payment_status || 'Pay on Completion',
                amount: Number(newOrder.amount) || 0,
                amountLabel: newOrder.amount_label || `₹${newOrder.amount}`,
                customerName: newOrder.customer_name,
                customerPhone: newOrder.customer_phone,
                destinationAddress: newOrder.destination_address,
                distanceKm: newOrder.distance_km,
                dispatchedTime: newOrder.dispatched_time,
                status: newOrder.status,
              },
              ...prev.filter((o) => o.id !== newOrder.id),
            ]);
            showToast(`New live order #${newOrder.id} received!`);
            if (settings.loudAlarmEnabled) {
              playOrderAlarmSound();
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as any;
            setOrders((prev) =>
              prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o))
            );
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as any;
            setOrders((prev) => prev.filter((o) => o.id !== deleted.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as any;
            setInventory((prev) =>
              prev.map((item) =>
                item.id === updated.id ? { ...item, isAvailable: updated.is_available } : item
              )
            );
          }
        }
      )
      .subscribe((status) => {
        if (isMounted) {
          setIsRealtimeConnected(status === 'SUBSCRIBED');
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [showToast, settings.loudAlarmEnabled]);

  const startPacking = useCallback(
    async (orderId: string) => {
      showToast(`Moved #${orderId} to Packing / Ready for Dispatch`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'on-the-way', relativeTime: '🚚 Just dispatched' } : o))
      );

      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('orders').update({ status: 'on-the-way' }).eq('id', orderId);
        } catch (err) {
          console.warn('Supabase update failed:', err);
        }
      }
    },
    [showToast]
  );

  const rejectOrder = useCallback(
    async (orderId: string) => {
      showToast(`Rejected #${orderId}. Inventory freed.`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));

      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('orders').delete().eq('id', orderId);
        } catch (err) {
          console.warn('Supabase delete failed:', err);
        }
      }
    },
    [showToast]
  );

  const markDelivered = useCallback(
    async (orderId: string) => {
      showToast(`Order #${orderId} completed! Payment logged.`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o))
      );

      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('orders').update({ status: 'completed' }).eq('id', orderId);
        } catch (err) {
          console.warn('Supabase update failed:', err);
        }
      }
    },
    [showToast]
  );

  const toggleItemAvailability = useCallback(
    async (itemId: string) => {
      let isNowAvailable = true;
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            isNowAvailable = !item.isAvailable;
            return { ...item, isAvailable: isNowAvailable };
          }
          return item;
        })
      );

      showToast(
        isNowAvailable
          ? 'Item marked Available for customer orders'
          : 'Item marked Unavailable (Customers cannot order)'
      );

      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('inventory').update({ is_available: isNowAvailable }).eq('id', itemId);
        } catch (err) {
          console.warn('Supabase inventory update failed:', err);
        }
      }
    },
    [showToast]
  );

  const toggleMasterOnline = useCallback(async () => {
    const nextState = !settings.isMasterOnline;
    setSettings((prev) => ({ ...prev, isMasterOnline: nextState }));

    if (nextState) {
      showToast('StartRun is ONLINE. Receiving dispatches.');
    } else {
      showToast('StartRun is OFFLINE. New orders halted.');
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('app_settings')
          .upsert({ id: 'primary_config', is_master_online: nextState });
      } catch (err) {
        console.warn('Supabase settings update failed:', err);
      }
    }
  }, [settings.isMasterOnline, showToast]);

  const toggleLoudAlarm = useCallback(() => {
    const nextState = !settings.loudAlarmEnabled;
    setSettings((prev) => ({ ...prev, loudAlarmEnabled: nextState }));
    if (nextState) {
      playOrderAlarmSound();
      showToast('Loud Order Alarm enabled (tested sound)');
    } else {
      showToast('Loud Order Alarm muted');
    }
  }, [settings.loudAlarmEnabled, showToast]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // Admin testing helper: simulate incoming urgent order
  const createNewTestOrder = useCallback(() => {
    const randomId = `SR-${Math.floor(1050 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: randomId,
      createdAt: new Date().toISOString(),
      relativeTime: '⚡ Just now',
      deliveryType: 'Express Delivery',
      tags: ['Products', 'Service Booking'],
      paymentStatus: 'Pay on Completion',
      amount: 4500,
      amountLabel: 'Collect ₹4,500',
      status: 'to-pack',
      items: [
        { id: `test-${Date.now()}-1`, name: 'Luminous Solar Inverter 1100VA', quantity: 1, locationBay: 'Bay B-02' },
        { id: `test-${Date.now()}-2`, name: 'Fast Diagnostic Inspection', quantity: 1, locationBay: 'On-site', isService: true },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Incoming Dispatch #${randomId} received!`);
    if (settings.loudAlarmEnabled) {
      playOrderAlarmSound();
    }

    const supabase = getSupabase();
    if (supabase) {
      Promise.resolve(
        supabase.from('orders').insert({
          id: newOrder.id,
          delivery_type: newOrder.deliveryType,
          tags: newOrder.tags,
          items: newOrder.items,
          payment_status: newOrder.paymentStatus,
          amount: newOrder.amount,
          amount_label: newOrder.amountLabel,
          status: newOrder.status,
        })
      ).catch((err) => {
        console.warn('Failed to insert test order into Supabase:', err);
      });
    }
  }, [settings.loudAlarmEnabled, showToast]);

  const counts = {
    toPack: orders.filter((o) => o.status === 'to-pack').length,
    onTheWay: orders.filter((o) => o.status === 'on-the-way').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <AppContext.Provider
      value={{
        orders,
        inventory,
        settings,
        orderFilter,
        inventoryCategory,
        toastMessage,
        counts,
        setOrderFilter,
        setInventoryCategory,
        startPacking,
        rejectOrder,
        markDelivered,
        toggleItemAvailability,
        toggleMasterOnline,
        toggleLoudAlarm,
        updateSettings,
        showToast,
        createNewTestOrder,
        isRealtimeConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
