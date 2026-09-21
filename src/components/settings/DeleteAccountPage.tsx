import React, { useState } from 'react';
import { ArrowLeft, Trash2, AlertTriangle, ShieldAlert, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface DeleteAccountPageProps {
  onBack: () => void;
}

export const DeleteAccountPage: React.FC<DeleteAccountPageProps> = ({ onBack }) => {
  const { operator, signOut } = useAuth();
  const { showToast } = useApp();

  const [confirmWord, setConfirmWord] = useState('');
  const [reason, setReason] = useState('shift-transfer');
  const [isDeleting, setIsDeleting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isConfirmed = confirmWord.trim().toUpperCase() === 'DELETE' && agreedToTerms;

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);

    try {
      showToast('Deleting operator account and clearing credentials...');
      // Clear all stored local operator data
      localStorage.removeItem('smartrun_admin_session');
      localStorage.removeItem('smartrun_custom_profile');
      localStorage.removeItem('smartrun_orders');
      localStorage.removeItem('smartrun_inventory');
      localStorage.removeItem('smartrun_settings');
      localStorage.removeItem('smartrun_alarm_volume');
      localStorage.removeItem('smartrun_alarm_tone');

      // Allow toast to show briefly before sign out
      setTimeout(async () => {
        await signOut();
      }, 1200);
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
      showToast('Error deleting account. Please contact system admin.');
    }
  };

  return (
    <div id="delete-account-page" className="w-full flex flex-col animate-fade-in pb-12">
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
          <h1 className="text-xl font-black text-rose-600 leading-tight">Delete Operator Account</h1>
          <p className="text-xs text-slate-500 font-medium">Permanent account removal and dispatch credential deauthorization</p>
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-6 text-rose-900">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-rose-900">Irreversible Action Warning</h2>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed">
              Deleting this account will permanently deactivate your operator profile for{' '}
              <strong>{operator.name}</strong> ({operator.email}). You will immediately lose access to warehouse dispatch, live order management, and store inventory controls.
            </p>
          </div>
        </div>
      </div>

      {/* Details checklist */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
          What happens when you delete:
        </h3>
        <ul className="space-y-2.5 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              ✕
            </span>
            <span>Your dispatch operator access ID ({operator.operatorCode}) will be invalidated.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              ✕
            </span>
            <span>All locally cached customer order history and dispatch metrics will be purged.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              ✕
            </span>
            <span>Ongoing warehouse packing assignments will be reallocated to the supervisor queue.</span>
          </li>
        </ul>
      </div>

      {/* Reason selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Reason for Operator Account Removal
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-600 focus:outline-none bg-white"
          >
            <option value="shift-transfer">Transferring to another warehouse hub</option>
            <option value="resignation">Leaving the store fulfillment organization</option>
            <option value="duplicate">Replacing with a new employee profile</option>
            <option value="device-reset">Resetting terminal device</option>
          </select>
        </div>

        {/* Confirmation text input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Type <span className="font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-black">DELETE</span> to confirm
          </label>
          <input
            type="text"
            placeholder="DELETE"
            value={confirmWord}
            onChange={(e) => setConfirmWord(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:border-rose-600 focus:outline-none"
          />
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 mt-0.5 cursor-pointer"
          />
          <span className="text-xs text-slate-600 leading-normal">
            I understand this action is permanent and cannot be undone. My active session will be closed immediately.
          </span>
        </label>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={!isConfirmed || isDeleting}
          className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Deleting Account...' : 'Permanently Delete My Operator Account'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          Cancel &amp; Return to Settings
        </button>
      </div>
    </div>
  );
};
