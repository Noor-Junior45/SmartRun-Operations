import React from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="pwa-install-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        id="pwa-install-modal-content"
        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl relative border border-slate-200"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400 border border-amber-300 p-1 flex items-center justify-center shrink-0 shadow-sm">
            <img src="/logo.svg" alt="SmartRun Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">Install SmartRun</h3>
            <p className="text-xs text-slate-500">Add to Home Screen for fast mobile &amp; web access</p>
          </div>
        </div>

        <div className="space-y-3.5 my-5 text-left text-sm text-slate-700">
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <Share className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-xs">Step 1: Tap Share</p>
              <p className="text-xs text-slate-500">Tap the Share icon at the bottom of Safari.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-xs">Step 2: Add to Home Screen</p>
              <p className="text-xs text-slate-500">Scroll down and tap &quot;Add to Home Screen&quot;.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
