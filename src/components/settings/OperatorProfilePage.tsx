import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Check, Camera, RefreshCw } from 'lucide-react';
import { useAuth, getAvatarFromEmail } from '../../context/AuthContext';

interface OperatorProfilePageProps {
  onBack: () => void;
}

export const OperatorProfilePage: React.FC<OperatorProfilePageProps> = ({ onBack }) => {
  const { operator, updateOperator, saveBackendProfile } = useAuth();
  const [name, setName] = useState(operator.name);
  const [phone, setPhone] = useState(operator.phone);
  const [email, setEmail] = useState(operator.email);
  const [role, setRole] = useState(operator.role);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    // Update locally
    updateOperator({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      role: role.trim(),
      avatarUrl: getAvatarFromEmail(email.trim(), name.trim()),
    });

    // Save to backend if connected
    await saveBackendProfile({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      avatarUrl: getAvatarFromEmail(email.trim(), name.trim()),
    });

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    setName('Md Noor');
    setPhone('+91 98765 43210');
    setEmail('mdnoor4860@gmail.com');
    setRole('Operations Lead & Dispatcher');
  };

  return (
    <div id="operator-profile-page" className="w-full flex flex-col animate-fade-in pb-12">
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
          <h1 className="text-xl font-black text-slate-900 leading-tight">Operator Profile</h1>
          <p className="text-xs text-slate-500 font-medium">Manage dispatch identity, contact & credentials</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Operator profile updated successfully!
        </div>
      )}

      {/* Profile Card Summary */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6 flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-sm bg-slate-100 flex items-center justify-center">
            <img
              src={operator.avatarUrl || getAvatarFromEmail(email, name)}
              alt={name}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
            <Camera className="w-3 h-3" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 truncate">{name}</h2>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold shrink-0">
              Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{role}</p>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>ID: {operator.operatorCode || 'OP-8821'}</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">Active Shift</span>
          </div>
        </div>
      </div>

      {/* Operator Statistics Strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dispatches</p>
          <p className="text-lg font-black text-slate-900 mt-0.5">1,248</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accuracy</p>
          <p className="text-lg font-black text-emerald-600 mt-0.5">99.4%</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rating</p>
          <p className="text-lg font-black text-amber-600 mt-0.5">4.9 ★</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-semibold text-slate-900 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-semibold text-slate-900 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Direct Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-semibold text-slate-900 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            Assigned Operations Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-semibold text-slate-900 transition bg-white"
          >
            <option value="Operations Lead & Dispatcher">Operations Lead &amp; Dispatcher</option>
            <option value="Store Fulfillment Manager">Store Fulfillment Manager</option>
            <option value="Warehouse Inventory Supervisor">Warehouse Inventory Supervisor</option>
            <option value="Senior Dispatch Controller">Senior Dispatch Controller</option>
          </select>
        </div>

        <div className="pt-3 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
          <button
            type="button"
            onClick={handleResetToDefault}
            title="Reset to defaults"
            className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
