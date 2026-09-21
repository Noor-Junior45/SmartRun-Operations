import React, { useState } from 'react';
import { ArrowLeft, Bell, MessageSquare, Mail, AlertTriangle, Check, ShieldCheck, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationsPageProps {
  onBack: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const { settings, updateSettings } = useApp();

  const [orderAlerts, setOrderAlerts] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_notif_orders');
    return saved ? saved === 'true' : true;
  });

  const [dispatchUpdates, setDispatchUpdates] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_notif_dispatch');
    return saved ? saved === 'true' : true;
  });

  const [stockDepletedAlerts, setStockDepletedAlerts] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_notif_stock');
    return saved ? saved === 'true' : true;
  });

  const [serviceReminders, setServiceReminders] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_notif_service');
    return saved ? saved === 'true' : true;
  });

  const [smsAlerts, setSmsAlerts] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_notif_sms');
    return saved ? saved === 'true' : false;
  });

  const [emailDigest, setEmailDigest] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_notif_email');
    return saved ? saved === 'true' : true;
  });

  const [pushStatus, setPushStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [showSavedToast, setShowSavedToast] = useState(false);

  const requestBrowserPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushStatus(perm);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSave = () => {
    localStorage.setItem('smartrun_notif_orders', String(orderAlerts));
    localStorage.setItem('smartrun_notif_dispatch', String(dispatchUpdates));
    localStorage.setItem('smartrun_notif_stock', String(stockDepletedAlerts));
    localStorage.setItem('smartrun_notif_service', String(serviceReminders));
    localStorage.setItem('smartrun_notif_sms', String(smsAlerts));
    localStorage.setItem('smartrun_notif_email', String(emailDigest));

    updateSettings({ notificationEnabled: orderAlerts });

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div id="notifications-page" className="w-full flex flex-col animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition shrink-0"
          aria-label="Back to Settings"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 leading-tight">Notification Preferences</h1>
          <p className="text-xs text-slate-500 font-medium">Manage dispatch pings, stock alerts &amp; push updates</p>
        </div>
      </div>

      {showSavedToast && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Notification preferences saved successfully!
        </div>
      )}

      {/* Browser Push Permission Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">Browser System Push Notifications</p>
              <p className="text-[11px] text-slate-500">Receive alerts even when screen is locked or in other tabs</p>
            </div>
          </div>

          {pushStatus === 'granted' ? (
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold shrink-0">
              Enabled
            </span>
          ) : (
            <button
              type="button"
              onClick={requestBrowserPushPermission}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shrink-0 cursor-pointer"
            >
              Allow Push
            </button>
          )}
        </div>
      </div>

      {/* Operational Triggers */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Operational Alert Triggers
          </h3>
        </div>

        <ul className="divide-y divide-slate-100">
          <li className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">New Incoming Customer Orders</p>
              <p className="text-[11px] text-slate-500">Urgent chime &amp; notification banner when order is booked</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={() => setOrderAlerts((p) => !p)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>

          <li className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Dispatch &amp; Rider Pickup Updates</p>
              <p className="text-[11px] text-slate-500">Notification when runner marks &quot;Dispatched&quot; or &quot;Delivered&quot;</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dispatchUpdates}
                onChange={() => setDispatchUpdates((p) => !p)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>

          <li className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Low Stock &amp; Warehouse Zero Depleted</p>
              <p className="text-[11px] text-slate-500">Alerts when inventory quantity in bays drops under threshold</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={stockDepletedAlerts}
                onChange={() => setStockDepletedAlerts((p) => !p)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>

          <li className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Service Appointment Countdown</p>
              <p className="text-[11px] text-slate-500">Technician dispatch alert 30 minutes before schedule</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={serviceReminders}
                onChange={() => setServiceReminders((p) => !p)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>
        </ul>
      </div>

      {/* External Channels */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            External Delivery Channels
          </h3>
        </div>

        <ul className="divide-y divide-slate-100">
          <li className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Urgent SMS Alerts</p>
                <p className="text-[11px] text-slate-500">Send high priority dispatch alerts to +91 98765 43210</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={() => setSmsAlerts((p) => !p)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>

          <li className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Daily End-of-Shift Report</p>
                <p className="text-[11px] text-slate-500">Automated PDF email summary sent at 10:00 PM</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={() => setEmailDigest((p) => !p)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>
        </ul>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
      >
        Save Notification Preferences
      </button>
    </div>
  );
};
