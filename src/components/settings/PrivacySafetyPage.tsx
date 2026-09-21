import React, { useState } from 'react';
import { ArrowLeft, Shield, FileText, Lock, AlertTriangle, PhoneCall, Download, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PrivacySafetyPageProps {
  onBack: () => void;
}

export const PrivacySafetyPage: React.FC<PrivacySafetyPageProps> = ({ onBack }) => {
  const { operator } = useAuth();
  const [acknowledged, setAcknowledged] = useState(() => {
    return localStorage.getItem('smartrun_safety_ack') === 'true';
  });
  const [showAckSuccess, setShowAckSuccess] = useState(false);

  const handleAcknowledge = () => {
    localStorage.setItem('smartrun_safety_ack', 'true');
    setAcknowledged(true);
    setShowAckSuccess(true);
    setTimeout(() => setShowAckSuccess(false), 3000);
  };

  const handleExportProtocol = () => {
    const text = `SMARTRUN STORE OPERATION & SAFETY PROTOCOL
Version: 1.4.2
Operator: ${operator.name} (${operator.operatorCode})
Hub: South Hub - Warehouse 4
Effective: 2026

1. DISPATCH INTEGRITY & INVENTORY HANDLING
- Every package leaving Bay 1-8 must match exact invoice line items.
- Tamper-evident barcode seals must be affixed to all electrical components and chemical containers.

2. RIDER & VEHICLE ROAD SAFETY
- Two-wheelers carry a maximum cargo limit of 25 kg.
- Heavier industrial goods (batteries, cement bags) must be dispatched via designated light cargo vehicles.
- Full protective equipment (helmets, fluorescent dispatch jackets, steel-toe warehouse boots) is strictly mandatory.

3. CUSTOMER DATA PRIVACY & CALL MASKING
- Customer mobile numbers are protected with virtual relay proxies.
- Customer addresses are strictly cached only for active delivery duration and expunged post-delivery confirmation.

4. HAZARDOUS & CHEMICAL PROTOCOL
- Waterproofing agents, acid batteries, and adhesives must remain sealed in Chemical Bay 1 with immediate absorbent spill kits.

Emergency Escalation: 1800-SMART-RUN (Toll-Free, 24/7)
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartRun_Safety_Protocol_${operator.operatorCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="privacy-safety-page" className="w-full flex flex-col animate-fade-in pb-12">
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
          <h1 className="text-xl font-black text-slate-900 leading-tight">Privacy Policy &amp; Safety Terms</h1>
          <p className="text-xs text-slate-500 font-medium">Standard operating guidelines &amp; compliance policy</p>
        </div>
      </div>

      {showAckSuccess && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Safety protocol compliance verified for {operator.name}!
        </div>
      )}

      {/* Compliance Stamp Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center gap-1.5 border border-blue-400/30">
            <Shield className="w-3.5 h-3.5" />
            ISO 9001 / OHSAS Compliant
          </span>
          <span className="text-[11px] text-slate-400 font-mono">v1.4.2 Protocol</span>
        </div>
        <h2 className="text-base font-extrabold text-white">SmartRun Dispatch &amp; Operations Standard</h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Binding operational protocol governing warehouse safety, customer data confidentiality, and rider road transit safety.
        </p>
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
          <span>Active Operator: <strong className="text-white">{operator.name}</strong></span>
          <span>{acknowledged ? '✓ Compliance Verified' : 'Pending Verification'}</span>
        </div>
      </div>

      {/* Accordion / Policy Sections */}
      <div className="space-y-4 mb-6">
        {/* Section 1: Customer Data Privacy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">1. Customer Privacy &amp; Number Masking</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All customer phone numbers and residential locations are encrypted in transit. Dispatched runners communicate exclusively via masked virtual bridge numbers. Physical delivery manifests with customer details must be recycled in secure shredders upon delivery completion.
          </p>
        </div>

        {/* Section 2: Rider Safety & Load Limits */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">2. Rider Road Safety &amp; Weight Limits</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Two-wheel dispatch partners must never be loaded exceeding 25 kg. Orders including industrial inverters (32 kg+) or bulk cement bags must be routed exclusively to light commercial dispatch vehicles. Operators are empowered to halt dispatches during extreme weather alerts.
          </p>
        </div>

        {/* Section 3: Chemical & Material Handling */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">3. Hazardous Chemical Protocol</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Waterproofing chemicals, batteries, and solvent adhesives must remain isolated in Chemical Bay 1. Personnel handling these crates must wear protective gloves and safety goggles. Emergency eye-wash stations are maintained on the southern warehouse wall.
          </p>
        </div>

        {/* Section 4: Dispatch Audit Logs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">4. Immutable Audit Logs &amp; Integrity</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every inventory movement, order status change, and dispatch handover is permanently logged with the active operator ID and timestamp. Operators must never share their login credentials or allow unverified personnel into packing zones.
          </p>
        </div>
      </div>

      {/* Emergency Hotline */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900">24/7 Operations Safety Escalation</p>
            <p className="text-[11px] text-slate-500">Toll-free emergency line for road accidents or warehouse hazards</p>
          </div>
        </div>
        <a
          href="tel:18007627878"
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition shrink-0"
        >
          Call Help
        </a>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleAcknowledge}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          {acknowledged ? 'Re-confirm Safety Protocol Compliance' : 'I Acknowledge & Comply with Safety Terms'}
        </button>

        <button
          type="button"
          onClick={handleExportProtocol}
          className="w-full py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Official Safety Protocol (Text Document)
        </button>
      </div>
    </div>
  );
};
