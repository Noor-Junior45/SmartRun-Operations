import React, { useState } from 'react';
import { ArrowLeft, Boxes, Printer, UserCheck, Clock, Check, Truck, ShieldAlert, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WarehouseDispatchPageProps {
  onBack: () => void;
}

export const WarehouseDispatchPage: React.FC<WarehouseDispatchPageProps> = ({ onBack }) => {
  const { settings, updateSettings } = useApp();

  const [bufferTime, setBufferTime] = useState<number>(() => {
    const saved = localStorage.getItem('smartrun_dispatch_buffer');
    return saved ? Number(saved) : 10;
  });

  const [autoAssignRunners, setAutoAssignRunners] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_dispatch_auto_assign');
    return saved ? saved === 'true' : true;
  });

  const [batchPicking, setBatchPicking] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_dispatch_batch_pick');
    return saved ? saved === 'true' : false;
  });

  const [autoPrintSlip, setAutoPrintSlip] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_dispatch_autoprint');
    return saved ? saved === 'true' : true;
  });

  const [requireRiderOtp, setRequireRiderOtp] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_dispatch_otp');
    return saved ? saved === 'true' : true;
  });

  const [heavyGoodsCheck, setHeavyGoodsCheck] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_dispatch_heavy');
    return saved ? saved === 'true' : true;
  });

  const [emergencyHold, setEmergencyHold] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    localStorage.setItem('smartrun_dispatch_buffer', String(bufferTime));
    localStorage.setItem('smartrun_dispatch_auto_assign', String(autoAssignRunners));
    localStorage.setItem('smartrun_dispatch_batch_pick', String(batchPicking));
    localStorage.setItem('smartrun_dispatch_autoprint', String(autoPrintSlip));
    localStorage.setItem('smartrun_dispatch_otp', String(requireRiderOtp));
    localStorage.setItem('smartrun_dispatch_heavy', String(heavyGoodsCheck));

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div id="warehouse-dispatch-page" className="w-full flex flex-col animate-fade-in pb-12">
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
          <h1 className="text-xl font-black text-slate-900 leading-tight">Warehouse Dispatch Settings</h1>
          <p className="text-xs text-slate-500 font-medium">Configure fulfillment workflows, picking &amp; rider handovers</p>
        </div>
      </div>

      {showSavedToast && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Warehouse dispatch workflows updated successfully!
        </div>
      )}

      {/* Warehouse Live Stats Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-900">{settings.activeWarehouseHub}</p>
            <p className="text-[11px] text-slate-500">Bay 1 to 8 • Automated Dispatch Conveyor</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-50">
            <p className="text-[10px] uppercase font-bold text-slate-400">Available Runners</p>
            <p className="text-base font-black text-slate-800 mt-0.5">6 Active</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <p className="text-[10px] uppercase font-bold text-slate-400">Avg. Pack Time</p>
            <p className="text-base font-black text-blue-600 mt-0.5">3m 45s</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <p className="text-[10px] uppercase font-bold text-slate-400">On-Time Rate</p>
            <p className="text-base font-black text-emerald-600 mt-0.5">99.1%</p>
          </div>
        </div>
      </div>

      {/* Target Packing Buffer Time */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center gap-2.5 mb-3">
          <Clock className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-extrabold text-slate-900">Target Packing Buffer Time</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Time allowed for picking &amp; packing items into crates before dispatch rider arrives.
        </p>

        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 15, 20].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setBufferTime(mins)}
              className={`py-2.5 px-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                bufferTime === mins
                  ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {mins} mins
            </button>
          ))}
        </div>
      </div>

      {/* Automation Rules */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Dispatch Automation Rules
          </h3>
        </div>

        <ul className="divide-y divide-slate-100">
          {/* Rule 1 */}
          <li className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Auto-Assign Runners</p>
                <p className="text-[11px] text-slate-500">Automatically broadcast order to closest idle delivery partner</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoAssignRunners}
                onChange={() => setAutoAssignRunners((p) => !p)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>

          {/* Rule 2 */}
          <li className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Thermal Packing Slip Auto-Print</p>
                <p className="text-[11px] text-slate-500">Trigger invoice print automatically when order is accepted</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPrintSlip}
                onChange={() => setAutoPrintSlip((p) => !p)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>

          {/* Rule 3 */}
          <li className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Batch Picking Optimization</p>
                <p className="text-[11px] text-slate-500">Group small electrical/cement orders for single warehouse pass</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={batchPicking}
                onChange={() => setBatchPicking((p) => !p)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>

          {/* Rule 4 */}
          <li className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Mandatory Rider Handover PIN / OTP</p>
                <p className="text-[11px] text-slate-500">Rider must scan QR or enter 4-digit code before taking crate</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={requireRiderOtp}
                onChange={() => setRequireRiderOtp((p) => !p)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>
        </ul>
      </div>

      {/* Emergency Dispatch Pause Hold */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-extrabold text-rose-900">Emergency Dispatch Hold</h4>
            <p className="text-[11px] text-rose-700 mt-0.5">
              Temporarily freeze outgoing dispatch releases for safety audits or weather alerts while keeping store open.
            </p>
            <button
              type="button"
              onClick={() => setEmergencyHold((p) => !p)}
              className={`mt-3 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                emergencyHold
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-100/50'
              }`}
            >
              {emergencyHold ? 'Hold Active (Tap to Resume)' : 'Activate Dispatch Hold'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
      >
        Save Warehouse Dispatch Settings
      </button>
    </div>
  );
};
