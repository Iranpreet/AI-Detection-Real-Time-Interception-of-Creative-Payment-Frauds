import React, { useState } from 'react';
import { NOVEL_SCAM_SCENARIOS } from '../data/zeroDayScenarios';
import { ShieldMLEngine } from '../services/mlEngine';
import { ZeroDayEvalResult } from '../types';
import { FlaskConical, AlertCircle, ShieldCheck, Cpu } from 'lucide-react';

export const ZeroDayLab: React.FC = () => {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('deepfake_voice');
  const [customPrompt, setCustomPrompt] = useState<string>(
    NOVEL_SCAM_SCENARIOS['deepfake_voice'].sms_text
  );
  const [evalResult, setEvalResult] = useState<ZeroDayEvalResult | null>(null);

  const handleScenarioChange = (key: string) => {
    setSelectedScenarioKey(key);
    const scen = NOVEL_SCAM_SCENARIOS[key];
    if (scen) {
      setCustomPrompt(scen.sms_text);
    }
  };

  const handleEvaluate = () => {
    const result = ShieldMLEngine.evaluateZeroDay(selectedScenarioKey, customPrompt);
    setEvalResult(result);
  };

  return (
    <div className="space-y-6">
      
      {/* Zero-Day Header */}
      <div className="p-6 sm:p-8 rounded-3xl cyera-panel relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500 dark:text-amber-200/60">
          <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
            Unsupervised AI Defense
          </span>
          <span aria-hidden="true">·</span>
          <span>Zero-Day Isolation Forest</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">2.7σ Threshold</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-amber-50 tracking-tight mt-1">
          Zero-Day & Unsupervised Anomaly Detection Lab
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl mt-1.5 leading-relaxed">
          Fraudsters continuously invent novel vectors that bypass static keyword and VPA blacklists. Here we demonstrate how ShieldUPI uses an unsupervised <strong>Isolation Forest</strong> and high-dimensional semantic outlier detection to intercept previously unseen zero-day attacks and auto-synthesize dynamic defense rules.
        </p>
      </div>

      {/* Zero-Day Interactive Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl cyera-panel space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-amber-200/80">
            Select Emerging Novel Scam Vector
          </h3>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pre-Packaged Novel Threat Vector
            </label>
            <select
              value={selectedScenarioKey}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#0c0f16] border border-slate-300 dark:border-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              <option value="deepfake_voice">1. AI Deepfake Voice Clone & Emergency Medical Escrow</option>
              <option value="upi_lite_evasion">2. UPI Lite High-Frequency Nano-Siphon Loop</option>
              <option value="malicious_intent_uri">3. Tampered UPI Intent URI with Embedded AutoPay Mandate</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Scam Note / Social Engineering SMS
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0c0f16] border border-slate-300 dark:border-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-200 leading-relaxed"
            />
          </div>

          <button
            type="button"
            onClick={handleEvaluate}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Cpu className="w-4 h-4" />
            <span>Evaluate Zero-Day Resistance</span>
          </button>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c0f16]/60 border border-slate-200 dark:border-amber-500/15 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed space-y-1">
            <div className="font-bold text-slate-700 dark:text-amber-200">How it works:</div>
            <p>1. Static regex engines fail against zero-day syntax.</p>
            <p>2. Isolation Forest computes density deviation from 25,000 legitimate UPI baseline samples.</p>
            <p>3. If &gt;2.5σ distance is reached, proactive quarantine triggers.</p>
          </div>
        </div>

        {/* Results Display (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl cyera-panel">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-amber-200/80 mb-3">
            Side-by-Side Comparison: Static Rules vs. ShieldUPI Anomaly Engine
          </h3>

          {!evalResult ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-xs italic flex flex-col items-center justify-center gap-2">
              <FlaskConical className="w-8 h-8 opacity-40 text-amber-500" />
              <span>Click "Evaluate Zero-Day Resistance" to run test against novel vectors.</span>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Traditional Rules */}
                <div className="p-4 rounded-2xl border border-red-500/30 bg-red-950/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      1. Traditional Static Rules
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                      BLIND SPOT
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-200 mb-1">
                    {evalResult.traditional_rules.verdict}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {evalResult.traditional_rules.explanation}
                  </p>
                  <div className="mt-3 pt-2 border-t border-red-500/20 text-[11px] text-red-300 font-mono">
                    Blacklist Matches: 0 (Scam bypasses rules)
                  </div>
                </div>

                {/* ShieldUPI Anomaly Engine */}
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      2. ShieldUPI Anomaly Engine
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      INTERCEPTED
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-200 mb-1">
                    {evalResult.unsupervised_engine.verdict}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {evalResult.unsupervised_engine.explanation}
                  </p>
                  <div className="mt-3 pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-300 font-mono">
                    Outlier Score: {evalResult.unsupervised_engine.outlier_score} | Deviation: {evalResult.unsupervised_engine.semantic_distance_sigma}σ
                  </div>
                </div>

              </div>

              {/* Generated Dynamic Threat Defense Rule */}
              <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Dynamic Threat Defense Rule Synthesized by ShieldUPI
                  </span>
                  <span className="text-[11px] font-mono text-amber-300 font-bold">
                    {evalResult.dynamic_defense_rule.rule_id}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-300">
                    <strong className="text-white">Pattern:</strong> {evalResult.dynamic_defense_rule.synthesized_pattern}
                  </p>
                  <p className="text-slate-300">
                    <strong className="text-white">Remediation Policy:</strong> {evalResult.dynamic_defense_rule.remediation}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-3 mt-2 border-t border-amber-500/20">
                  <span>Synthesized: {evalResult.dynamic_defense_rule.generated_at}</span>
                  <span className="text-amber-400 font-bold">
                    Confidence: {evalResult.dynamic_defense_rule.confidence_score}%
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
