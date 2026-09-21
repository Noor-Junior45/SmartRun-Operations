import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Compass, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DeliveryRadiusPageProps {
  onBack: () => void;
}

export const DeliveryRadiusPage: React.FC<DeliveryRadiusPageProps> = ({ onBack }) => {
  const { settings, updateSettings } = useApp();

  const [radiusKm, setRadiusKm] = useState<number>(settings.serviceRadiusKm || 8.5);
  const [hubName, setHubName] = useState<string>(settings.activeWarehouseHub || 'South Hub - Warehouse 4');
  const [justSaved, setJustSaved] = useState(false);

  // Keep state in sync if settings update externally
  useEffect(() => {
    if (settings.serviceRadiusKm && settings.serviceRadiusKm !== radiusKm) {
      setRadiusKm(settings.serviceRadiusKm);
    }
  }, [settings.serviceRadiusKm]);

  useEffect(() => {
    if (settings.activeWarehouseHub && settings.activeWarehouseHub !== hubName) {
      setHubName(settings.activeWarehouseHub);
    }
  }, [settings.activeWarehouseHub]);

  // Coverage calculations
  const coverageAreaSqKm = Math.round(Math.PI * Math.pow(radiusKm, 2));
  const estimatedMaxTransitMin = Math.round(radiusKm * 3.2);

  const handleRadiusChange = (newVal: number) => {
    setRadiusKm(newVal);
    updateSettings({ serviceRadiusKm: newVal });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  const handleHubChange = (newHub: string) => {
    setHubName(newHub);
    updateSettings({ activeWarehouseHub: newHub });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  return (
    <div id="delivery-radius-page" className="w-full flex flex-col animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition shrink-0 cursor-pointer"
          aria-label="Back to Settings"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900 leading-tight">Delivery Radius</h1>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-opacity duration-300 ${
                justSaved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 opacity-100'
                  : 'bg-slate-100 text-slate-500 opacity-80'
              }`}
            >
              <Check className="w-3 h-3 text-emerald-600" />
              Auto-saved
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure store dispatch geofence and delivery territory
          </p>
        </div>
      </div>

      {/* Active Geofence Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Active Geofence</p>
              <p className="text-xs text-slate-500">Radial coverage from active warehouse hub</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-blue-600 tracking-tight">{radiusKm.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-500 ml-1">km</span>
          </div>
        </div>

        {/* Interactive Range Slider - Automatically saves on change */}
        <input
          type="range"
          min="1.0"
          max="25.0"
          step="0.5"
          value={radiusKm}
          onChange={(e) => handleRadiusChange(parseFloat(e.target.value))}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-3"
          aria-label="Delivery radius slider"
        />

        <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-5">
          <span>1.0 km (Hyperlocal)</span>
          <span>12.5 km (City Metro)</span>
          <span>25.0 km (Regional Outer)</span>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Coverage Area</p>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">~{coverageAreaSqKm} sq. km</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-slate-400">Max Delivery Transit</p>
            <p className="text-base font-extrabold text-emerald-600 mt-0.5">~{estimatedMaxTransitMin} mins</p>
          </div>
        </div>
      </div>

      {/* Active Warehouse Hub Section (Without demo locations) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Active Warehouse Hub</h2>
            <p className="text-xs text-slate-500">Center point location for dispatch geofencing</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hub Name / Operational Bay
            </label>
            <div className="relative">
              <input
                type="text"
                value={hubName}
                onChange={(e) => handleHubChange(e.target.value)}
                placeholder="Enter active warehouse hub name"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none bg-slate-50/50"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Dispatch geofence active
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              Radius: {radiusKm.toFixed(1)} km from this hub
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
