/**
 * SmartRun Admin Application Types
 * Type definitions for Orders, Warehouse Inventory, Settings, and Supabase integration
 */

export type OrderStatus = 'to-pack' | 'on-the-way' | 'completed' | 'rejected';

export type PaymentMethod = 'pay_on_completion' | 'paid_online' | 'cash';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  locationBay: string;
  isService?: boolean;
}

export interface Order {
  id: string; // e.g., 'SR-1045'
  createdAt: string;
  relativeTime: string;
  deliveryType: 'Express Delivery' | 'Standard Drop' | 'Heavy Dispatch';
  tags: Array<'Products' | 'Service Booking'>;
  items: OrderItem[];
  paymentStatus: 'Pay on Completion' | 'Paid Online';
  amount: number;
  amountLabel: string;
  customerName?: string;
  customerPhone?: string;
  destinationAddress?: string;
  distanceKm?: number;
  dispatchedTime?: string;
  status: OrderStatus;
}

export type InventoryCategory = 'all' | 'electrical' | 'construction' | 'technician';

export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  bayLocation: string;
  category: 'electrical' | 'construction' | 'technician';
  isAvailable: boolean;
  stockCount?: number;
  isService?: boolean;
}

export interface OperatorProfile {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatarInitials: string;
  operatorCode: string;
  avatarUrl?: string;
}

export interface AppSettings {
  isMasterOnline: boolean;
  loudAlarmEnabled: boolean;
  serviceRadiusKm: number;
  activeWarehouseHub: string;
  notificationEnabled: boolean;
  supabaseConfigured: boolean;
}

export type MainTab = 'orders' | 'warehouse' | 'settings';
