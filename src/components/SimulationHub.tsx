import React, { useState } from 'react';
import { TxnPayload, ScoreResult } from '../types';
import { SCAM_PRESETS } from '../data/presets';
import { RiskGaugeCanvas } from './Charts';
import { ShapAttribution } from './ShapAttribution';
import { ThreatRadarVisualizer } from './ThreatRadarVisualizer';
import { SoundFX } from '../services/soundEffects';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  QrCode, 
  Smartphone, 
  RotateCcw, 
  Sparkles,
  Check,
  Zap,
  Crosshair
} from 'lucide-react';

interface SimulationHubProps {
  payload: TxnPayload;
  scoreResult: ScoreResult;
  isDark: boolean;
  activePresetId: string;
  onUpdatePayload: (updater: (prev: TxnPayload) => TxnPayload) => void;
  onSelectPreset: (id: string) => void;
  onRecalculate: () => void;
  onAttemptPayment: () => void;
  onOpenQrScanner: () => void;
}

export const SimulationHub: React.FC<SimulationHubProps> = ({
  payload,
  scoreResult,
  isDark,
  activePresetId,
  onUpdatePayload,
  onSelectPreset,
  onRecalculate,
  onAttemptPayment,
  onOpenQrScanner
}) => {
  const [inspectorTab, setInspectorTab] = useState<'payload' | 'sensors' | 'velocity'>('payload');
  const [previewLang, setPreviewLang] = useState<'en' | 'hi'>('en');

  const activePreset = SCAM_PRESETS[activePresetId] || SCAM_PRESETS['collect_refund'];
  const presetsList = Object.values(SCAM_PRESETS);

  const handleFieldChange = <K extends keyof TxnPayload>(field: K, value: TxnPayload[K]) => {
    onUpdatePayload(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePresetClick = (id: string) => {
    SoundFX.playTacticalSelect();
    onSelectPreset(id);
  };

  const handleTabChange = (tab: 'payload' | 'sensors' | 'velocity') => {
    SoundFX.playHoverBlip();
    setInspectorTab(tab);
  };

  const handlePaymentClick = () => {
    if (scoreResult.risk_score >= 35) {
      SoundFX.playInterceptionAlert();
    } else {
      SoundFX.playSafeSuccess();
    }
    onAttemptPayment();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* ================= STAGE 1: MISSION HERO & THREAT RADAR ================= */}
      <section className="cyera-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle Warm Amber Halo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left Hero Content */}
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-amber-200/60">
              <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                PROJECT CC6-AI02
              </span>
              <span aria-hidden="true">·</span>
              <span>NPCI Real-Time Layer</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">&lt;120ms Latency SLA</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-amber-50 tracking-tight">
              Secure the Unknown in Real-Time Payments
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Detect and intercept novel Indian UPI payment fraud vectors before authorization. ShieldUPI evaluates behavioral velocity, device anomalies, and deceptive messaging in real-time.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-[#121620]/90 border border-amber-200/60 dark:border-amber-500/20 text-xs text-slate-700 dark:text-amber-100/90 shadow-sm">
                <span className="font-bold text-slate-900 dark:text-amber-300">{activePreset.title.split('. ')[1] || activePreset.title}:</span>{' '}
                <span>{activePreset.educational_note}</span>
              </div>
            </div>
          </div>

          {/* Right Hero Radar Visualizer */}
          <div className="lg:w-1/2 flex items-center justify-center">
            <ThreatRadarVisualizer 
              activePresetId={activePresetId}
              onSelectPreset={handlePresetClick}
              isDark={isDark}
              currentRiskScore={scoreResult.risk_score}
            />
          </div>

        </div>

        {/* Clean Horizontal Scenario Selector Rail */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-amber-500/15">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-500 dark:text-amber-200/70 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Select Threat Scenario to Inspect
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">7 Scenarios Loaded</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {presetsList.map((preset, idx) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetClick(preset.id)}
                  onMouseEnter={() => SoundFX.playHoverBlip()}
                  className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                    isActive
                      ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-200 shadow-sm shadow-amber-500/20'
                      : 'border-slate-200 dark:border-amber-500/10 bg-white/60 dark:bg-[#121620]/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-100 hover:border-amber-300 dark:hover:border-amber-500/30'
                  }`}
                >
                  <div className="font-mono text-[10px] text-amber-400/80 mb-0.5">0{idx + 1}</div>
                  <div className="text-xs font-semibold line-clamp-1">{preset.badge}</div>
                  <div className="text-[10px] font-mono mt-1 text-slate-500 dark:text-slate-400">₹{preset.values.amount.toLocaleString('en-IN')}</div>
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {/* ================= STAGE 2: DECLUTTERED WORKSPACE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Telemetry Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="cyera-panel rounded-3xl p-6 sm:p-7">
            
            {/* Inspector Header & Segmented Tabs */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200 dark:border-amber-500/15">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-amber-50 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-500" />
                  Threat Telemetry Inspector
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-amber-200/60 mt-0.5">Device context & payment transaction parameters</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  SoundFX.playTacticalSelect();
                  onOpenQrScanner();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 hover:bg-amber-500/20 transition-all cursor-pointer font-mono"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Segmented Controls for Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0e121a] border border-slate-200 dark:border-amber-500/15 mb-6 text-xs font-medium">
              <button
                type="button"
                onClick={() => handleTabChange('payload')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  inspectorTab === 'payload'
                    ? 'bg-white dark:bg-[#1a212e] text-slate-900 dark:text-amber-200 font-bold shadow-xs border border-transparent dark:border-amber-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-100'
                }`}
              >
                1. Payload
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('sensors')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  inspectorTab === 'sensors'
                    ? 'bg-white dark:bg-[#1a212e] text-slate-900 dark:text-amber-200 font-bold shadow-xs border border-transparent dark:border-amber-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-100'
                }`}
              >
                2. Device Sensors
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('velocity')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  inspectorTab === 'velocity'
                    ? 'bg-white dark:bg-[#1a212e] text-slate-900 dark:text-amber-200 font-bold shadow-xs border border-transparent dark:border-amber-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-100'
                }`}
              >
                3. Velocity & Timing
              </button>
            </div>

            {/* TAB 1: Payload Fields */}
            {inspectorTab === 'payload' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Amount (₹ INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-amber-500 font-mono font-bold">₹</span>
                      <input
                        type="number"
                        value={payload.amount}
                        min="1"
                        step="1"
                        onChange={(e) => handleFieldChange('amount', parseFloat(e.target.value) || 0)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold bg-slate-50 dark:bg-[#0e1219] border border-slate-300 dark:border-amber-500/20 focus:border-amber-500 focus:outline-none text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Payment Type
                    </label>
                    <select
                      value={payload.txn_type}
                      onChange={(e) => handleFieldChange('txn_type', e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#0e1219] border border-slate-300 dark:border-amber-500/20 focus:border-amber-500 focus:outline-none text-slate-900 dark:text-slate-100 cursor-pointer"
                    >
                      <option value="collect">UPI Collect Request</option>
                      <option value="debit">Standard UPI Debit (Push)</option>
                      <option value="qr_scan">Merchant QR Code Scan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Payee UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    value={payload.payee_vpa}
                    onChange={(e) => handleFieldChange('payee_vpa', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-mono font-semibold bg-slate-50 dark:bg-[#0e1219] border border-slate-300 dark:border-amber-500/20 focus:border-amber-500 focus:outline-none text-amber-700 dark:text-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Merchant Name / Label
                  </label>
                  <input
                    type="text"
                    value={payload.merchant_name}
                    onChange={(e) => handleFieldChange('merchant_name', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0e1219] border border-slate-300 dark:border-amber-500/20 focus:border-amber-500 focus:outline-none text-slate-900 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Transaction Note / Accompanying SMS
                  </label>
                  <textarea
                    rows={2}
                    value={payload.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0e1219] border border-slate-300 dark:border-amber-500/20 focus:border-amber-500 focus:outline-none text-slate-900 dark:text-slate-200 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Device Sensor Toggles */}
            {inspectorTab === 'sensors' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <p className="text-xs text-slate-500 dark:text-amber-200/60 mb-2">
                  Edge client sensors detecting external coercion, malware, and tampering:
                </p>

                <div className="space-y-2">
                  {[
                    { id: 'pasted_vpa', label: 'VPA Pasted from External Clipboard', desc: 'Copied from external chat app (WhatsApp/Telegram)' },
                    { id: 'active_screenshare', label: 'Screen Broadcasting (RAT Active)', desc: 'AnyDesk, TeamViewer, or QuickSupport streaming screen' },
                    { id: 'active_phone_call', label: 'Active Voice Call in Progress', desc: 'Indicates victim is being coached over the phone' },
                    { id: 'device_rooted', label: 'Device Integrity Compromised', desc: 'Rooted / debugger attached / sandbox bypassed' },
                    { id: 'is_new_payee', label: 'First-Time Payee (No Past History)', desc: 'Payer has zero past transaction relationships' },
                    { id: 'is_mule_cluster', label: 'Mule Syndicate Geofence Match', desc: 'Linked to Jamtara, Mewat, or Deoghar syndicates' },
                    { id: 'qr_payload_tampered', label: 'QR Payload Mismatch', desc: 'Physical merchant sticker swapped with private mule VPA' }
                  ].map(sensor => {
                    const checked = Boolean((payload as any)[sensor.id]);
                    return (
                      <div
                        key={sensor.id}
                        onClick={() => {
                          SoundFX.playHoverBlip();
                          handleFieldChange(sensor.id as any, !checked);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          checked
                            ? 'border-amber-500/50 bg-amber-500/10 dark:bg-amber-950/20'
                            : 'border-slate-200 dark:border-amber-500/10 bg-slate-50/50 dark:bg-[#0e1219]/60 hover:border-slate-300 dark:hover:border-amber-500/25'
                        }`}
                      >
                        <div className="pr-3">
                          <div className={`text-xs font-semibold ${checked ? 'text-amber-700 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300'}`}>
                            {sensor.label}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {sensor.desc}
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          checked 
                            ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold' 
                            : 'border-slate-300 dark:border-amber-500/20 bg-transparent'
                        }`}>
                          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Velocity & Timing */}
            {inspectorTab === 'velocity' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">1-Hour Velocity Frequency:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {payload.velocity_1h} transactions / hour
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={payload.velocity_1h}
                    onChange={(e) => handleFieldChange('velocity_1h', parseInt(e.target.value) || 0)}
                    className="w-full h-1.5 bg-slate-200 dark:bg-[#1a212e] rounded-lg cursor-pointer accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Normal user frequency is 0–1 txns/hr. High bursts indicate automated draining.</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Amount vs 30-Day Historical Average:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {payload.ratio_amount_to_avg.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="25"
                    step="0.5"
                    value={payload.ratio_amount_to_avg}
                    onChange={(e) => handleFieldChange('ratio_amount_to_avg', parseFloat(e.target.value) || 1)}
                    className="w-full h-1.5 bg-slate-200 dark:bg-[#1a212e] rounded-lg cursor-pointer accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Measures deviation from payer's baseline daily transaction amount.</p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-amber-500/15 bg-slate-50 dark:bg-[#0e1219]/60">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={payload.late_night_hour}
                      onChange={(e) => handleFieldChange('late_night_hour', e.target.checked)}
                      className="rounded border-slate-300 dark:border-amber-500/30 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Off-Hours Transaction (11 PM - 4 AM)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Social engineering attempts historically spike 4.8x during night hours
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="pt-5 mt-5 border-t border-slate-200 dark:border-amber-500/15">
              <button
                type="button"
                onClick={() => {
                  SoundFX.playTacticalSelect();
                  onRecalculate();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#1a212e] dark:hover:bg-[#222b3b] text-slate-800 dark:text-amber-200 border border-slate-200 dark:border-amber-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span>Re-score Current Telemetry Baseline</span>
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Autonomous Interception Cockpit (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="cyera-panel rounded-3xl p-6 sm:p-7">
            
            {/* Threat Readout & Circular Gauge */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-5 mb-5 border-b border-slate-200 dark:border-amber-500/15 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`font-bold font-mono ${
                    scoreResult.risk_score >= 70 ? 'text-red-500' : scoreResult.risk_score >= 35 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {scoreResult.risk_score} / 100
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {scoreResult.classification === 'HIGH_RISK' ? 'Critical High Risk' : scoreResult.classification === 'SUSPICIOUS' ? 'Suspicious Payment' : 'Safe Transaction'}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-amber-50">
                  {scoreResult.detected_vector}
                </h3>

                <p className="text-xs text-slate-500 dark:text-amber-200/60 font-mono">
                  Inference: <strong className="text-slate-700 dark:text-amber-300">{scoreResult.latency_ms} ms</strong> (&lt;120ms NPCI SLA ✓)
                </p>
              </div>

              <div className="w-44 h-28 flex-shrink-0 flex items-center justify-center">
                <RiskGaugeCanvas score={scoreResult.risk_score} isDark={isDark} />
              </div>
            </div>

            {/* Plain-Language Warning Nudge Banner */}
            <div className={`p-4 rounded-2xl border mb-5 ${
              scoreResult.risk_score >= 70
                ? 'border-red-500/30 bg-red-500/5 dark:bg-red-950/20'
                : scoreResult.risk_score >= 35
                ? 'border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/30'
                : 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {scoreResult.risk_score >= 70 ? (
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                  ) : scoreResult.risk_score >= 35 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  )}
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Just-In-Time Plain-Language Nudge
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-200 dark:bg-[#0e1219] p-0.5 rounded-lg text-[10px]">
                  <button
                    type="button"
                    onClick={() => setPreviewLang('en')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${previewLang === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLang('hi')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${previewLang === 'hi' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-800 dark:text-amber-100/90 leading-relaxed font-semibold">
                {previewLang === 'hi' ? scoreResult.nudges.hi : scoreResult.nudges.en}
              </p>
            </div>

            {/* XAI Feature Attribution */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Explainable AI (SHAP Waterfall Attribution)
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Impact drivers</span>
              </div>

              <ShapAttribution features={scoreResult.shap_features} />
            </div>

            {/* Prominent Action Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-amber-500/15">
              <button
                type="button"
                onClick={handlePaymentClick}
                onMouseEnter={() => SoundFX.playHoverBlip()}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] ${
                  scoreResult.risk_score >= 70
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-600/30'
                    : scoreResult.risk_score >= 35
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-extrabold shadow-amber-500/35'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-emerald-600/30'
                }`}
              >
                {scoreResult.risk_score >= 70 ? (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Initiate Authorization (Triggers Interception Modal)</span>
                  </>
                ) : scoreResult.risk_score >= 35 ? (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Initiate Authorization (Triggers Nudge Modal)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Initiate Payment (Safe Authorized Flow)</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-2.5">
                Simulates real-world mobile UPI application behavior (Google Pay, PhonePe, Paytm, BHIM) protected by ShieldUPI SDK.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
