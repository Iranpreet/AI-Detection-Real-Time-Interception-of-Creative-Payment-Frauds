import React from 'react';
import { Layers, ShieldAlert, Cpu, Lock, CheckCircle2, Server, Smartphone, BellRing } from 'lucide-react';

export const ArchitectureSpecs: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Blueprint Header */}
      <div className="p-6 sm:p-8 rounded-3xl cyera-panel relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500 dark:text-amber-200/60">
          <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
            NPCI Unified UPI Protocol
          </span>
          <span aria-hidden="true">·</span>
          <span>Zero-Trust Architecture</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Latency SLA &lt;120ms</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-amber-50 tracking-tight mt-1">
          ShieldUPI Architecture & NPCI Integration Blueprint
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mt-1.5">
          Designed for frictionless integration into existing Indian payment applications (Google Pay, PhonePe, Paytm, BHIM) and bank core systems. The engine operates strictly within the mandatory &lt;120ms NPCI SLA latency window.
        </p>
      </div>

      {/* Architecture Layers (3 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-3xl cyera-panel relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm mb-4 font-mono border border-amber-500/20">
            01
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-amber-100 mb-2 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-500" />
            Edge Telemetry Collector
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Lightweight Android/iOS SDK hooks inspecting accessibility permissions, active MediaProjection screen casting, clipboard paste buffers, and telephony call state without capturing sensitive PII.
          </p>
        </div>

        <div className="p-6 rounded-3xl cyera-panel relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-4 font-mono border border-emerald-500/20">
            02
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-amber-100 mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            Hybrid AI Risk Scoring
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Dual pipeline: Supervised Random Forest trained on 25k Indian transactions for known vectors + Unsupervised Isolation Forest for zero-day outliers. NLP intent scoring parses coercive SMS cues in real time.
          </p>
        </div>

        <div className="p-6 rounded-3xl cyera-panel relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm mb-4 font-mono border border-red-500/20">
            03
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-amber-100 mb-2 flex items-center gap-2">
            <BellRing className="w-4 h-4 text-red-500" />
            Just-In-Time Interception
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Pre-PIN entry intervention modal with bold plain-language Hindi/English nudges, cooling-off countdown timer, and automated NCRP 1930 cybercrime reporting hooks.
          </p>
        </div>

      </div>

      {/* Creative Fraud Threat Matrix Table */}
      <div className="p-6 sm:p-7 rounded-3xl cyera-panel">
        <h3 className="text-sm font-heading font-bold text-slate-900 dark:text-amber-50 mb-1">
          India-Specific Creative Fraud Matrix & Mitigation
        </h3>
        <p className="text-xs text-slate-500 dark:text-amber-200/60 mb-4">
          Coverage of the core payment fraud scenarios defined in Project CC6-AI02:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-amber-200/60 border-b border-slate-200 dark:border-amber-500/20 bg-slate-50 dark:bg-transparent">
                <th className="py-2.5 px-3">Vector</th>
                <th className="py-2.5 px-3">Modus Operandi</th>
                <th className="py-2.5 px-3">Edge Indicator</th>
                <th className="py-2.5 px-3">ShieldUPI Countermeasure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-3 font-bold text-red-600 dark:text-red-400">Fake Collect Refund</td>
                <td className="py-3 px-3">Victim sent a UPI Collect Request disguised as cashback/reward.</td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">txn_type=='collect' + 'refund/cashback' in note</td>
                <td className="py-3 px-3">Bold Stop Screen: "You are about to PAY, not receive money!"</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">QR Code Tampering</td>
                <td className="py-3 px-3">Counter sticker replaced with fraudster's dynamic collect or mule VPA.</td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">Merchant MCC mismatch, personal VPA on commercial sticker</td>
                <td className="py-3 px-3">Mismatch alert: "QR routes to unverified wallet, not Sharma Store."</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-orange-600 dark:text-orange-400">Screenshare (RAT)</td>
                <td className="py-3 px-3">Caller instructs victim to install AnyDesk/TeamViewer to fix bank KYC.</td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">MediaProjection / Accessibility active + call in progress</td>
                <td className="py-3 px-3">Immediate PIN lock: "Remote screen-sharing tool active. Disconnect."</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">Mule Velocity Chain</td>
                <td className="py-3 px-3">Rapid multi-hop routing to newly created accounts in Jamtara/Mewat.</td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">Account age &lt;48h, velocity &gt;8 txns/hr, high amount deviation</td>
                <td className="py-3 px-3">Quarantine & 10s cooling-off countdown with nodal bank freeze.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-yellow-600 dark:text-yellow-400">Phishing Utility Bill</td>
                <td className="py-3 px-3">Threatening SMS warning of electricity or SIM disconnection.</td>
                <td className="py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">Urgency keywords ('disconnect tonight') to personal VPA</td>
                <td className="py-3 px-3">Discom Verification: Official BBPS biller handle check.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
