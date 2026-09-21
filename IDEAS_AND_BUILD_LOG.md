# SmartRun Admin - Ideas, Build Log & Solved Issues

## 1. Project Overview & Core Mission
**SmartRun Admin** is a dedicated dispatch operator and service management mobile application designed for warehouse operators, dispatch coordinators, and field technicians. It provides live order tracking, one-tap item packing and rejection, warehouse inventory availability controls, technician service job assignments, and real-time synchronization via Supabase PostgreSQL channels.

---

## 2. Feature Ideas & Roadmap

### Phase 1: Core Dispatch & Warehouse (Completed)
- [x] **Live Order Status Tracking**: Segmented views for *To Pack*, *On The Way*, and *Done*.
- [x] **Itemized Warehouse Bays**: Clear bay identifiers (e.g. `Bay A-04`, `Heavy Bay 2`, `Pallet 01`) so warehouse packers can retrieve goods instantly.
- [x] **Service & Product Hybrid Support**: Unified ticketing for physical goods (inverters, cement, cables) and technician labor (installation, emergency replacement).
- [x] **Quick Dispatch Actions**: One-touch "Start Packing", "Reject" with inventory liberation, and "Mark Done / Delivered" with cash/online collection status.
- [x] **Customer Communication & Map Navigation**: Direct dialer shortcut (`tel:`) and instant GPS route launcher.
- [x] **Warehouse Availability Toggles**: Real-time switch to turn items On/Off with visual unavailable styling (`opacity-50` and `Unavailable` badge).
- [x] **Master Online / Offline Switch**: Operator control to pause dispatches during inventory count or shift changes.
- [x] **Loud Order Alarm**: Web Audio API high-volume alert to notify warehouse packers of urgent new dispatches.

### Phase 2: Supabase Realtime & Auth Integration (Completed)
- [x] **Supabase Authentication**: Admin-only login with email/password and session persistence.
- [x] **PostgreSQL Realtime Subscriptions**: Channel listeners on `public.orders`, `public.inventory`, and `public.app_settings` for live instantaneous updates across multiple operator devices.
- [x] **Offline-First Resilience**: Graceful local state cache so the application remains operable even during spotty warehouse connectivity or before Supabase credentials are configured.
- [x] **1-Click SQL Schema Migration**: Pre-packaged migration script ready to copy-paste into the Supabase SQL Editor.

### Phase 3: Future Ideas & Enhancements
- [ ] **Barcode / QR Code Scanner**: Scan SKU barcodes on warehouse bins using device camera in Android Studio via native ML Kit.
- [ ] **Geofencing & Automated Arrival**: Trigger customer SMS / WhatsApp notification when operator is within 500m of the drop site.
- [ ] **Digital Signature & Photo Proof of Delivery**: Capture customer signature and camera photo of installed electrical equipment on completion.
- [ ] **Multi-Hub Routing Optimization**: Automatic shortest-path sorting for dispatches when taking multiple "On The Way" deliveries simultaneously.

---

## 3. Build Log

| Timestamp | Component / Module | Action Taken |
|---|---|---|
| **2026-09-21** | System Setup | Initialized project metadata, updated `.env.example` with Supabase configuration variables, configured viewport for mobile devices and Android WebView. |
| **2026-09-21** | Asset Branding | Imported user-provided `SmartRun.png` brand identity into `/public/logo.svg` and `/public/SmartRun.png` featuring the signature bright yellow background (#FFC800) with bold black `Smart` and vibrant green `RUN` typography. |
| **2026-09-21** | Supabase SDK | Installed `@supabase/supabase-js`, configured flexible credentials loader (environment + local admin config drawer), and created real-time channel handlers. |
| **2026-09-21** | Audio Synthesis | Built zero-latency Web Audio API dual-tone alert synthesizer in `/src/lib/audio.ts` for cross-platform Android WebView reliability without audio asset 404s. |
| **2026-09-21** | State Architecture | Created `/src/context/AuthContext.tsx` and `/src/context/AppContext.tsx` with full order lifecycle management, search, availability switches, and real-time syncing. |
| **2026-09-21** | UI Components | Constructed pixel-perfect matching views: `OrdersView.tsx`, `WarehouseView.tsx`, `SettingsView.tsx`, `BottomNav.tsx`, `Toast.tsx`, and `AdminLoginModal.tsx`. |
| **2026-09-21** | Android Readiness | Enforced min 48px touch targets, safe-area padding, overscroll behavior controls, and standard native URL scheme links. |
| **2026-09-21** | Profile Backend Sync | Updated Settings operator card to display backend user name, email below name, and mobile number below email. Removed the `op-8821` tag and connected real-time profile fetch and upsert capabilities with Supabase backend (`profiles` table and Auth metadata). |
| **2026-09-21** | Email-Based Avatar & Circle Styling | Automated avatar fetching from operator email (Gravatar, Google, and UI-Avatars fallback). Removed green status dot and styled avatar into a full circle round button with an interactive modal to view the user avatar. |

---

## 4. Issues Encountered & Solutions

### Issue 1: Preserving Strict UI Constraints Without Unsolicited Redesigns
- **Problem**: The user explicitly instructed: *"this app is for admin use only app, so don't edit Ui or do any changes without my permission"*. Generic AI generation often injects unsolicited hero banners, sidebars, or altered layouts.
- **Solution**: We mirrored the provided HTML layout with surgical fidelity: exact card structures, badge colorings (`bg-amber-100`, `bg-sky-50`, `bg-purple-50`, `bg-emerald-500`), pill filters, 48px toggle switches, and the fixed 3-tab bottom navigation with blue indicator.

### Issue 2: Cross-Platform Audio Playback in Native Android WebView
- **Problem**: Loading external `.mp3` or `.wav` files inside an Android WebView often fails due to CORS, missing local asset relative paths, or user gesture restrictions.
- **Solution**: Implemented a Web Audio API oscillator synthesis script (`/src/lib/audio.ts`). It generates the loud alarm tone dynamically with custom frequencies and volume envelope, requiring zero asset requests.

### Issue 3: Supabase Credential Cold-Start Experience
- **Problem**: If Supabase environment variables are missing during initial preview, raw SDK calls would throw unhandled exceptions or render a blank screen.
- **Solution**: Designed a resilient fallback layer in `/src/lib/supabase.ts` and `/src/context/AppContext.tsx`. The app boots instantly with initial mock orders and warehouse inventory stored in `localStorage`. Once Supabase credentials are provided (via `.env` or the in-app Settings modal), it automatically upgrades to live cloud synchronization.

### Issue 4: Android Touch Responsiveness & Accidental Zoom
- **Problem**: Mobile browsers and Android WebViews can trigger double-tap zoom or highlight tap flashes on buttons.
- **Solution**: Configured `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`, and `user-select: none` in CSS, with `viewport-fit=cover` and `maximum-scale=1.0` in `index.html`.

### Issue 5: React DOM SVG Attribute Warnings
- **Problem**: Console warnings for invalid DOM properties `stroke-linecap`, `stroke-linejoin`, and `stroke-width` in SVG elements.
- **Solution**: Replaced all kebab-case SVG attributes with React camelCase equivalents (`strokeLinecap`, `strokeLinejoin`, `strokeWidth`), maintaining exact visual rendering while eliminating console warnings.

### Issue 6: Settings Profile Backend Integration & Layout Precision
- **Problem**: The settings page previously displayed a hardcoded placeholder operator name with an `op-8821` badge tag, and phone and email were displayed side-by-side with a bullet dot. The user requested: (1) use user name from backend, (2) fetch name, mobile and email, (3) display name on top, email below name, and mobile number below email, and (4) remove the `op-8821` tag beside the name.
- **Solution**: Updated `AuthContext.tsx` with `fetchBackendProfile` and `saveBackendProfile` to query Supabase Auth user metadata and the `public.profiles` database table with graceful fallback to user session email. Refactored `SettingsView.tsx` to arrange the operator credentials in the clean vertical hierarchy (`name` -> `email` -> `phone`), removed the `op-8821` tag, and added a seamless profile editor and backend sync trigger.

### Issue 7: Email Avatar Fetching, Circle Round View & Green Dot Removal
- **Problem**: The avatar previously used an app logo graphic with an absolute emerald green status dot indicator badge, and wasn't dynamically bound to the operator's user account email. The user requested to: (1) fetch user avatar from his email, (2) remove the green dot from avatar, and (3) make the avatar circle round to view user avatar.
- **Solution**: Implemented email-based avatar resolution in `AuthContext.tsx` via `getAvatarFromEmail` (connecting Unavatar/Gravatar/Google services with UI-Avatars initials fallback). Replaced the previous square container with a clean, circular `rounded-full` button. Removed the green dot indicator completely. Added an interactive circular zoom modal (`showAvatarPreview`) allowing operators to click and view their full circular avatar in high resolution.
