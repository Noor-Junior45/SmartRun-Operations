import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment or localStorage for flexible configuration
export const getSupabaseConfig = (): { url: string; anonKey: string } => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('smartrun_supabase_url') || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('smartrun_supabase_key') || '' : '';

  return {
    url: storedUrl.trim() || envUrl.trim(),
    anonKey: storedKey.trim() || envKey.trim(),
  };
};

export const setSupabaseConfig = (url: string, anonKey: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('smartrun_supabase_url', url.trim());
    localStorage.setItem('smartrun_supabase_key', anonKey.trim());
    // Refresh client
    initSupabaseClient();
  }
};

let supabaseInstance: SupabaseClient | null = null;

export const initSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (url && anonKey && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Supabase initialization failed:', err);
      supabaseInstance = null;
      return null;
    }
  }
  supabaseInstance = null;
  return null;
};

export const getSupabase = (): SupabaseClient | null => {
  if (!supabaseInstance) {
    return initSupabaseClient();
  }
  return supabaseInstance;
};

/**
 * SQL Schema for easy 1-click database setup in Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- SmartRun Supabase Database Schema
-- Run this in your Supabase project's SQL Editor

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Orders Table
create table if not exists public.orders (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  relative_time text,
  delivery_type text not null default 'Express Delivery',
  tags jsonb not null default '["Products"]'::jsonb,
  items jsonb not null default '[]'::jsonb,
  payment_status text not null default 'Pay on Completion',
  amount numeric not null default 0,
  amount_label text not null default '₹0',
  customer_name text,
  customer_phone text,
  destination_address text,
  distance_km numeric,
  dispatched_time text,
  status text not null default 'to-pack' check (status in ('to-pack', 'on-the-way', 'completed', 'rejected'))
);

-- Enable Realtime for orders
alter publication supabase_realtime add table public.orders;

-- 3. Warehouse Inventory & Services Table
create table if not exists public.inventory (
  id text primary key,
  name text not null,
  price numeric not null,
  unit text not null,
  bay_location text not null,
  category text not null default 'electrical' check (category in ('electrical', 'construction', 'technician')),
  is_available boolean not null default true,
  stock_count integer default 10,
  is_service boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Realtime for inventory
alter publication supabase_realtime add table public.inventory;

-- 4. App Master Settings Table
create table if not exists public.app_settings (
  id text primary key default 'primary_config',
  is_master_online boolean not null default true,
  loud_alarm_enabled boolean not null default true,
  service_radius_km numeric not null default 8.5,
  active_warehouse_hub text not null default 'South Hub - Warehouse 4',
  notification_enabled boolean not null default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Realtime for app_settings
alter publication supabase_realtime add table public.app_settings;

-- 5. User Profiles Table (Admin, Dispatcher & Operator)
create table if not exists public.profiles (
  id text primary key,
  name text not null,
  email text,
  phone text,
  role text default 'Operations Lead & Dispatcher',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Realtime for profiles
alter publication supabase_realtime add table public.profiles;

-- 6. Row Level Security Policies (Admin Access)
alter table public.orders enable row level security;
alter table public.inventory enable row level security;
alter table public.app_settings enable row level security;
alter table public.profiles enable row level security;

-- Allow read & write for authenticated admin users
create policy "Allow all operations for authenticated users" on public.orders
  for all to authenticated using (true) with check (true);

create policy "Allow all operations for authenticated users on inventory" on public.inventory
  for all to authenticated using (true) with check (true);

create policy "Allow all operations for authenticated users on settings" on public.app_settings
  for all to authenticated using (true) with check (true);

create policy "Allow all operations for authenticated users on profiles" on public.profiles
  for all to authenticated using (true) with check (true);

-- Allow public read for testing if desired
create policy "Allow public read orders" on public.orders for select to anon using (true);
create policy "Allow public read inventory" on public.inventory for select to anon using (true);
create policy "Allow public read settings" on public.app_settings for select to anon using (true);
create policy "Allow public read profiles" on public.profiles for select to anon using (true);
create policy "Allow public update inventory" on public.inventory for update to anon using (true);
create policy "Allow public update orders" on public.orders for update to anon using (true);
create policy "Allow public update profiles" on public.profiles for all to anon using (true);
`;
