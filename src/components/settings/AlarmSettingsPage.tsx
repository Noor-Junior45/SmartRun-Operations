import React, { useState } from 'react';
import { ArrowLeft, BellRing, Volume2, VolumeX, Play, Check, RotateCcw, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playOrderAlarmSound, AlarmTone } from '../../lib/audio';

interface AlarmSettingsPageProps {
  onBack: () => void;
}

export const AlarmSettingsPage: React.FC<AlarmSettingsPageProps> = ({ onBack }) => {
  const { settings, updateSettings, toggleLoudAlarm } = useApp();

  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('smartrun_alarm_volume');
    return saved ? Number(saved) : 0.75;
  });

  const [selectedTone, setSelectedTone] = useState<AlarmTone>(() => {
    const saved = localStorage.getItem('smartrun_alarm_tone');
    return (saved as AlarmTone) || 'two-tone';
  });

  const [repeatUntilDismissed, setRepeatUntilDismissed] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_alarm_repeat');
    return saved ? saved === 'true' : true;
  });

  const [vibrateOnAlert, setVibrateOnAlert] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartrun_alarm_vibrate');
    return saved ? saved === 'true' : true;
  });

  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleTestSound = (toneToPlay = selectedTone, volToPlay = volume) => {
    setIsPlayingTest(true);
    playOrderAlarmSound(volToPlay, toneToPlay);

    // Vibration API test if supported
    if (vibrateOnAlert && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // Safe fallback
      }
    }

    setTimeout(() => {
      setIsPlayingTest(false);
    }, 1200);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('smartrun_alarm_volume', String(volume));
    localStorage.setItem('smartrun_alarm_tone', selectedTone);
    localStorage.setItem('smartrun_alarm_repeat', String(repeatUntilDismissed));
    localStorage.setItem('smartrun_alarm_vibrate', String(vibrateOnAlert));

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handleResetDefaults = () => {
    setVolume(0.75);
    setSelectedTone('two-tone');
    setRepeatUntilDismissed(true);
    setVibrateOnAlert(true);
    if (!settings.loudAlarmEnabled) {
      toggleLoudAlarm();
    }
  };

  return (
    <div id="alarm-settings-page" className="w-full flex flex-col animate-fade-in pb-12">
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
          <h1 className="text-xl font-black text-slate-900 leading-tight">Loud Order Alarm</h1>
          <p className="text-xs text-slate-500 font-medium">Configure high-priority audible alerts for new orders</p>
        </div>
      </div>

      {showSavedToast && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Alarm preferences saved!
        </div>
      )}

      {/* Main Master Alarm Switch */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition ${
            settings.loudAlarmEnabled ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
          }`}>
            {settings.loudAlarmEnabled ? <BellRing className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-snug">
              {settings.loudAlarmEnabled ? 'Alarm is Active' : 'Alarm is Muted'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {settings.loudAlarmEnabled
                ? 'Plays siren instantly when store receives a new order'
                : 'Silenced (visual badges only)'}
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center justify-center min-w-[56px] min-h-[48px] cursor-pointer">
          <input
            type="checkbox"
            checked={settings.loudAlarmEnabled}
            onChange={() => {
              toggleLoudAlarm();
              if (!settings.loudAlarmEnabled) {
                handleTestSound();
              }
            }}
            className="sr-only peer"
          />
          <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[12px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>

      {/* Alarm Sound Style Selection */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
        <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center justify-between">
          <span>Alert Ringtone &amp; Sound Profile</span>
          <span className="text-xs font-semibold text-slate-400">Web Audio API</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            { id: 'two-tone', label: 'Standard High Two-Tone', desc: 'Default high-contrast urgent dispatch chime' },
            { id: 'siren', label: 'Industrial Siren Loop', desc: 'Penetrating siren for noisy warehouse bays' },
            { id: 'chime', label: 'Harmonic 4-Bell Chime', desc: 'Melodic sequence for front desk operations' },
            { id: 'pulse', label: 'Radar Triple Pulse', desc: 'Fast rhythmic alert pulses' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                const tone = item.id as AlarmTone;
                setSelectedTone(tone);
                handleTestSound(tone);
              }}
              className={`p-3.5 rounded-xl border text-left transition flex items-start justify-between cursor-pointer ${
                selectedTone === item.id
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <p className="text-xs font-extrabold text-slate-900">{item.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedTone === item.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
              }`}>
                {selectedTone === item.id && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </span>
            </button>
          ))}
        </div>

        {/* Play Sound Preview Button */}
        <button
          type="button"
          onClick={() => handleTestSound()}
          disabled={isPlayingTest}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <Play className={`w-4 h-4 ${isPlayingTest ? 'animate-bounce text-amber-400' : ''}`} />
          {isPlayingTest ? 'Playing Alert Sound...' : 'Test Selected Alarm Sound'}
        </button>
      </div>

      {/* Volume Slider */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-extrabold text-slate-900">Alarm Volume Level</span>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {Math.round(volume * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={volume}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setVolume(val);
          }}
          onMouseUp={() => handleTestSound(selectedTone, volume)}
          onTouchEnd={() => handleTestSound(selectedTone, volume)}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
          <span>Quiet (10%)</span>
          <span>Medium (50%)</span>
          <span>Maximum Loud (100%)</span>
        </div>
      </div>

      {/* Additional Alarm Options */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <ul className="divide-y divide-slate-100">
          <li className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Repeat Until Dismissed</p>
                <p className="text-[11px] text-slate-500">Chimes every 20 seconds until packing starts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={repeatUntilDismissed}
                onChange={() => setRepeatUntilDismissed((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>

          <li className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Device Vibration Haptic</p>
                <p className="text-[11px] text-slate-500">Pulse device vibrator with audible alert</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={vibrateOnAlert}
                onChange={() => setVibrateOnAlert((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSavePreferences}
          className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
        >
          Save Alarm Preferences
        </button>
        <button
          type="button"
          onClick={handleResetDefaults}
          title="Reset to defaults"
          className="p-3.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
