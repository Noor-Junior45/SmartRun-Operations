import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth, getAvatarFromEmail } from '../context/AuthContext';
import { OperatorProfilePage } from './settings/OperatorProfilePage';
import { AlarmSettingsPage } from './settings/AlarmSettingsPage';
import { DeliveryRadiusPage } from './settings/DeliveryRadiusPage';
import { WarehouseDispatchPage } from './settings/WarehouseDispatchPage';
import { NotificationsPage } from './settings/NotificationsPage';
import { PrivacySafetyPage } from './settings/PrivacySafetyPage';
import { DeleteAccountPage } from './settings/DeleteAccountPage';

type SettingsSubPage = 'profile' | 'alarm' | 'radius' | 'dispatch' | 'notifications' | 'privacy' | 'delete-account' | null;

export const SettingsView: React.FC = () => {
  const {
    settings,
    toggleMasterOnline,
    toggleLoudAlarm,
    showToast,
  } = useApp();

  const { operator, signOut, refreshProfile } = useAuth();

  const [currentSubPage, setCurrentSubPage] = useState<SettingsSubPage>(null);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    setAvatarLoadError(false);
  }, [operator.name, operator.phone, operator.email, operator.avatarUrl]);

  const avatarUrl = operator.avatarUrl || getAvatarFromEmail(operator.email, operator.name);

  // If viewing a dedicated sub-page, render that page with full functionality
  if (currentSubPage === 'profile') {
    return (
      <main id="view-settings-subpage" className="flex-1 px-4 pt-4 pb-8">
        <OperatorProfilePage onBack={() => setCurrentSubPage(null)} />
      </main>
    );
  }

  if (currentSubPage === 'alarm') {
    return (
      <main id="view-settings-subpage" className="flex-1 px-4 pt-4 pb-8">
        <AlarmSettingsPage onBack={() => setCurrentSubPage(null)} />
      </main>
    );
  }

  if (currentSubPage === 'radius') {
    return (
      <main id="view-settings-subpage" className="flex-1 px-4 pt-4 pb-8">
        <DeliveryRadiusPage onBack={() => setCurrentSubPage(null)} />
      </main>
    );
  }

  if (currentSubPage === 'dispatch') {
    return (
      <main id="view-settings-subpage" className="flex-1 px-4 pt-4 pb-8">
        <WarehouseDispatchPage onBack={() => setCurrentSubPage(null)} />
      </main>
    );
  }

  if (currentSubPage === 'notifications') {
    return (
      <main id="view-settings-subpage" className="flex-1 px-4 pt-4 pb-8">
        <NotificationsPage onBack={() => setCurrentSubPage(null)} />
      </main>
    );
  }

  if (currentSubPage === 'privacy') {
    return (
      <main id="view-settings-subpage" className="flex-1 px-4 pt-4 pb-8">
        <PrivacySafetyPage onBack={() => setCurrentSubPage(null)} />
      </main>
    );
  }

  if (currentSubPage === 'delete-account') {
    return (
      <main id="view-settings-subpage" className="flex-1 px-4 pt-4 pb-8">
        <DeleteAccountPage onBack={() => setCurrentSubPage(null)} />
      </main>
    );
  }

  return (
    <main id="view-settings" className="tab-content active flex-1 px-4 pt-4 pb-8">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">App Settings</h1>
        </div>
      </div>

      {/* Operator Profile / Login Profile Section */}
      <div
        onClick={() => setCurrentSubPage('profile')}
        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4 cursor-pointer hover:border-slate-300 transition group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Circular User Avatar (fetched from email, circle round, click to view) */}
            <button
              type="button"
              id="operator-avatar-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowAvatarPreview(true);
              }}
              aria-label="View user avatar"
              className="relative shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition active:scale-95"
              title="Click to view avatar"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm border-2 border-slate-200 bg-slate-100 flex items-center justify-center hover:border-blue-400 transition">
                {!avatarLoadError ? (
                  <img
                    id="operator-avatar-image"
                    src={avatarUrl}
                    alt={operator.name}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarLoadError(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center select-none">
                    {operator.avatarInitials || 'MN'}
                  </div>
                )}
              </div>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 leading-snug truncate">
                  {operator.name}
                </h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 shrink-0">
                  Edit Profile
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                {operator.email}
              </p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {operator.phone}
              </p>
            </div>
          </div>

          <svg className="w-5 h-5 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>

      {/* Settings Clean List Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <ul className="divide-y divide-slate-100">
          {/* Row 1: Prominent Master Toggle Switch */}
          <li className="p-4 flex items-center justify-between min-h-[64px] bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  settings.isMasterOnline ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'
                }`}
                id="status-pulse-dot"
              ></span>
              <span
                id="master-toggle-label"
                className={`text-base font-black ${
                  settings.isMasterOnline ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                {settings.isMasterOnline ? 'StartRun Online' : 'StartRun Offline'}
              </span>
            </div>

            <label className="relative inline-flex items-center justify-center min-w-[64px] min-h-[48px] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isMasterOnline}
                id="master-online-switch"
                onChange={toggleMasterOnline}
                className="sr-only peer"
              />
              <div className="w-16 h-9 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
          </li>

          {/* Row 2: Loud Order Alarm */}
          <li>
            <div className="w-full p-4 flex items-center justify-between min-h-[60px] hover:bg-slate-50 transition">
              <button
                type="button"
                onClick={() => setCurrentSubPage('alarm')}
                className="flex items-center gap-3 flex-1 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Loud Order Alarm</span>
                  <span className="text-xs text-slate-500">Ringtones, volume &amp; vibration</span>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center justify-center min-w-[56px] min-h-[48px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.loudAlarmEnabled}
                    onChange={toggleLoudAlarm}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[12px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
                <button
                  type="button"
                  onClick={() => setCurrentSubPage('alarm')}
                  className="p-2 text-slate-400 hover:text-slate-600"
                  aria-label="Open Alarm Settings Page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </li>

          {/* Row 3: Service & Delivery Radius */}
          <li>
            <button
              onClick={() => setCurrentSubPage('radius')}
              className="w-full p-4 flex items-center justify-between text-left min-h-[56px] active:bg-slate-50 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Delivery Radius</span>
                  <span className="text-xs text-slate-500">{settings.serviceRadiusKm} km coverage • {settings.activeWarehouseHub}</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </li>

          {/* Row 4: Warehouse Dispatch Settings */}
          <li>
            <button
              onClick={() => setCurrentSubPage('dispatch')}
              className="w-full p-4 flex items-center justify-between text-left min-h-[56px] active:bg-slate-50 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    ></path>
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Warehouse Dispatch Settings</span>
                  <span className="text-xs text-slate-500">Buffer time, auto-dispatch &amp; thermal slips</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </li>

          {/* Row 5: Notification Preferences */}
          <li>
            <button
              onClick={() => setCurrentSubPage('notifications')}
              className="w-full p-4 flex items-center justify-between text-left min-h-[56px] active:bg-slate-50 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Notification Preferences</span>
                  <span className="text-xs text-slate-500">Push alerts, SMS &amp; low-stock pings</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </li>

          {/* Row 6: Privacy Policy & Safety Terms */}
          <li>
            <button
              onClick={() => setCurrentSubPage('privacy')}
              className="w-full p-4 flex items-center justify-between text-left min-h-[56px] active:bg-slate-50 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Privacy Policy &amp; Safety Terms</span>
                  <span className="text-xs text-slate-500">Rider safety, customer data &amp; chemical handling</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </li>

          {/* Row 7: Delete Account */}
          <li>
            <button
              onClick={() => setCurrentSubPage('delete-account')}
              className="w-full p-4 flex items-center justify-between min-h-[56px] active:bg-rose-50 hover:bg-rose-50/50 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-extrabold text-rose-600 block">Delete Account</span>
                  <span className="text-xs text-rose-400">Permanently remove operator access credentials</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </li>
        </ul>
      </div>

      {/* Sign Out Button */}
      <div className="mt-6 mb-4 px-1">
        <button
          onClick={() => {
            showToast(`Signing out ${operator.name}...`);
            signOut();
          }}
          className="w-full py-3.5 px-6 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition min-h-[48px] cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs font-semibold text-slate-400 tracking-wide">
          StartRun Store Operation v1.0.0
        </p>
      </div>

      {/* Circle Round User Avatar Viewer Modal */}
      {showAvatarPreview && (
        <div
          id="avatar-viewer-backdrop"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAvatarPreview(false)}
        >
          <div
            id="avatar-viewer-card"
            className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl flex flex-col items-center text-center relative border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAvatarPreview(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition active:scale-90"
              aria-label="Close avatar view"
            >
              ✕
            </button>

            {/* Circular User Avatar Zoomed */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/20 shadow-xl bg-slate-100 my-2 flex items-center justify-center ring-4 ring-white">
              {!avatarLoadError ? (
                <img
                  src={avatarUrl}
                  alt={operator.name}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center select-none">
                  {operator.avatarInitials || 'MN'}
                </div>
              )}
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mt-2">{operator.name}</h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">{operator.email}</p>
            <p className="text-xs font-mono text-slate-400 mt-0.5">{operator.phone}</p>

            <button
              onClick={() => setShowAvatarPreview(false)}
              className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

