# SmartRun Admin - Application Structure & Architectural Plan

## 1. Architectural Philosophy
SmartRun Admin is constructed as a high-performance, modular React 19 + TypeScript application. It strictly adheres to mobile-first viewport constraints (optimized for 390px-420px widths with fluid desktop centering) and provides full compatibility for wrapping into a native Android application via Android Studio (Capacitor or native Android WebView).

```
/
├── index.html                  # Mobile-viewport entry point with safe-area support
├── metadata.json               # Applet descriptors and permissions
├── package.json                # Project dependencies (React 19, Supabase JS, Tailwind, Lucide)
├── vite.config.ts              # Vite bundle builder with path aliases
│
├── public/
│   ├── logo.svg                # SmartRun brand vector logo (Yellow bg, Smart in black, RUN in green)
│   └── SmartRun.png            # Raster brand logo asset
│
├── src/
│   ├── main.tsx                # React DOM mount point
│   ├── index.css               # Global Tailwind CSS & mobile viewport resets
│   ├── App.tsx                 # Root layout, Tab orchestrator & Context wrappers
│   │
│   ├── types/
│   │   └── index.ts            # Strongly-typed models for Orders, Inventory, Settings, Profiles
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client setup, real-time listeners & SQL schema
│   │   └── audio.ts            # Web Audio API alert sound generator for loud dispatch alarm
│   │
│   ├── context/
│   │   ├── AuthContext.tsx     # Supabase Auth provider, admin session persistence, and operator profile
│   │   └── AppContext.tsx      # Real-time state manager (Orders, Inventory, Settings, Audio, Toasts)
│   │
│   └── components/
│       ├── OrdersView.tsx      # View 1: Live Orders (To Pack, On The Way, Done, Reject/Pack actions)
│       ├── WarehouseView.tsx   # View 2: Inventory manager, live category search & availability toggles
│       ├── SettingsView.tsx    # View 3: Master Online toggle, Loud Alarm, Radius, Supabase Drawer, Logout
│       ├── BottomNav.tsx       # Fixed 3-tab bottom bar with active blue underline and badge counts
│       ├── Toast.tsx           # Floating mobile notification banner
│       └── AdminLoginModal.tsx # Supabase admin credentials login modal
│
├── IDEAS_AND_BUILD_LOG.md      # Feature ideas, solved issues & chronological build log
└── APP_STRUCTURE_PLAN.md       # Architectural blueprint and Android conversion guide
```

---

## 2. Data Flow & State Lifecycle

```
       [Supabase PostgreSQL Cloud Database]
         │                          ▲
         │ (Realtime Broadcast)     │ (CRUD Mutations)
         ▼                          │
   [AppContext.tsx] ◄───────────────┴─ Actions (startPacking, toggleAvailability, etc.)
         │
         ├──────► [OrdersView.tsx]    (Filter tabs: To Pack | On The Way | Done)
         ├──────► [WarehouseView.tsx] (Search & Availability toggles)
         └──────► [SettingsView.tsx]  (Master Online toggle & Audio switches)
```

1. **Authentication Gate**: `AuthContext` checks for an active Supabase session or cached admin session. If none exists, `AdminLoginModal` prompts for authentication.
2. **Real-time Synchronization**: When connected to Supabase, `AppContext` registers a channel listening to `postgres_changes` on the `orders` and `inventory` tables.
3. **Optimistic Local Updates**: Every action (moving to packing, toggling inventory availability, changing online status) immediately updates local state and `localStorage` so the UI responds in 0ms, followed by background cloud persistence.
4. **Hardware Audio Trigger**: When an urgent order is received, `audio.ts` invokes the Web Audio API oscillator to play the loud alarm tone if enabled in settings.

---

## 3. Database Schema (Supabase PostgreSQL)

| Table Name | Primary Key | Key Columns | Purpose |
|---|---|---|---|
| `orders` | `id` (text) | `status`, `delivery_type`, `tags`, `items`, `payment_status`, `amount`, `customer_name`, `customer_phone`, `destination_address` | Tracks dispatch lifecycle from packing to delivery |
| `inventory` | `id` (text) | `name`, `price`, `unit`, `bay_location`, `category`, `is_available`, `stock_count` | Real-time warehouse items and service booking catalog |
| `app_settings` | `id` (text) | `is_master_online`, `loud_alarm_enabled`, `service_radius_km`, `active_warehouse_hub` | Operator dispatch state and store availability |

---

## 4. Converting to Native Android App via Android Studio

This codebase has been purposefully written for zero-friction conversion into an Android APK or Android App Bundle (.aab).

### Option A: Using Capacitor (Recommended Modern Approach)
1. **Build Web Assets**:
   ```bash
   npm run build
   ```
2. **Add Capacitor to Project**:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "SmartRun Admin" "com.smartrun.admin" --web-dir dist
   npx cap add android
   ```
3. **Copy Assets & Open in Android Studio**:
   ```bash
   npx cap copy
   npx cap open android
   ```
4. **In Android Studio**:
   - Set app icon to `public/SmartRun.png`.
   - Build signed APK: `Build > Generate Signed Bundle / APK`.

### Option B: Native Android Studio WebView Shell (Kotlin)
1. Create a new Android Studio project with an `Empty Activity`.
2. In `app/src/main/res/layout/activity_main.xml`:
   ```xml
   <WebView
       android:id="@+id/webView"
       android:layout_width="match_parent"
       android:layout_height="match_parent" />
   ```
3. In `MainActivity.kt`:
   ```kotlin
   val webView: WebView = findViewById(R.id.webView)
   webView.settings.javaScriptEnabled = true
   webView.settings.domStorageEnabled = true
   webView.settings.mediaPlaybackRequiresUserGesture = false
   webView.webViewClient = WebViewClient()
   webView.loadUrl("https://your-hosted-domain.app")
   ```
4. In `AndroidManifest.xml`, declare permissions:
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <uses-permission android:name="android.permission.CALL_PHONE" />
   ```
