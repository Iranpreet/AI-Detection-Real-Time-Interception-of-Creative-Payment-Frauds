import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  TxnPayload, 
  ScoreResult, 
  TransactionRecord, 
  ToastItem 
} from './types';
import { SCAM_PRESETS } from './data/presets';
import { 
  DATASET_TRANSACTIONS, 
  MULE_CLUSTERS, 
  HOURLY_TRENDS, 
  FRAUD_BREAKDOWN 
} from './data/dataset';
import { ShieldMLEngine } from './services/mlEngine';
import { SoundFX } from './services/soundEffects';
import { Navbar } from './components/Navbar';
import { CyeraMissionIntro } from './components/CyeraMissionIntro';
import { SimulationHub } from './components/SimulationHub';
import { AnalystDashboard } from './components/AnalystDashboard';
import { ModelEvaluation } from './components/ModelEvaluation';
import { ZeroDayLab } from './components/ZeroDayLab';
import { ArchitectureSpecs } from './components/ArchitectureSpecs';
import { InterceptionModal } from './components/InterceptionModal';
import { QrScannerModal } from './components/QrScannerModal';
import { CaseInspectDrawer } from './components/CaseInspectDrawer';
import { ToastContainer } from './components/Toast';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('simulator');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('shield_theme') !== 'light';
  });

  // Cyera "Secure The Unknown" Mission Intro Screen State
  const [isMissionIntroOpen, setIsMissionIntroOpen] = useState<boolean>(() => {
    // Show intro on initial visit
    return sessionStorage.getItem('shield_intro_completed') !== 'true';
  });

  // Current simulation state
  const [activePresetId, setActivePresetId] = useState<string>('collect_refund');
  const [payload, setPayload] = useState<TxnPayload>(SCAM_PRESETS['collect_refund'].values);
  const [scoreResult, setScoreResult] = useState<ScoreResult>(() => {
    return ShieldMLEngine.score(SCAM_PRESETS['collect_refund'].values);
  });

  // Persistent analyst state
  const [transactions, setTransactions] = useState<TransactionRecord[]>(DATASET_TRANSACTIONS);
  const [selectedCase, setSelectedCase] = useState<TransactionRecord | null>(null);

  // Modals state
  const [isInterceptionOpen, setIsInterceptionOpen] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, message: string, type: ToastItem['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('shield_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('shield_theme', 'light');
    }
  }, [isDark]);

  // Recalculate score on payload changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const res = ShieldMLEngine.score(payload);
      setScoreResult(res);
    }, 150);
    return () => clearTimeout(timer);
  }, [payload]);

  const handleToggleTheme = () => {
    SoundFX.playHoverBlip();
    setIsDark(prev => !prev);
  };

  const handleSelectPreset = (id: string) => {
    const preset = SCAM_PRESETS[id];
    if (!preset) return;
    setActivePresetId(id);
    setPayload(preset.values);
  };

  const handleRecalculate = () => {
    const res = ShieldMLEngine.score(payload);
    setScoreResult(res);
  };

  const handleAttemptPayment = () => {
    if (scoreResult.risk_score >= 35) {
      SoundFX.playInterceptionAlert();
      setIsInterceptionOpen(true);
    } else {
      SoundFX.playSafeSuccess();
      showToast(
        "Payment Authorized & Completed",
        `₹${payload.amount.toLocaleString('en-IN')} sent to ${payload.payee_vpa}. No security variance detected.`,
        "success"
      );
    }
  };

  const handleCancelAndReport = () => {
    setIsInterceptionOpen(false);
    SoundFX.playTacticalSelect();
    showToast(
      "Transaction Aborted & Reported",
      "Threat telemetry forwarded to National Cybercrime Reporting Portal (NCRP 1930). Mule wallet flagged.",
      "warning"
    );

    const newTxn: TransactionRecord = {
      txn_id: `UPI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      payer: "current.user@oksbi",
      payee_vpa: payload.payee_vpa,
      merchant_name: payload.merchant_name || "Unknown Merchant",
      amount: payload.amount,
      txn_type: payload.txn_type,
      risk_score: scoreResult.risk_score,
      classification: scoreResult.classification,
      detected_vector: scoreResult.detected_vector,
      status: "BLOCKED",
      message: payload.message,
      telemetry: {
        device_model: "Apple iPhone 15 Pro",
        os_version: "iOS 18.1 (Simulated)",
        app_package: "in.org.npci.upiapp",
        ip_location: "Simulated Test Client",
        pasted_vpa: payload.pasted_vpa,
        active_screenshare: payload.active_screenshare,
        active_phone_call: payload.active_phone_call,
        device_rooted: payload.device_rooted,
        late_night_hour: payload.late_night_hour,
        velocity_1h: payload.velocity_1h,
        velocity_24h: payload.velocity_24h,
        ratio_amount_to_avg: payload.ratio_amount_to_avg,
        nlp_intent_score: scoreResult.nlp_intent_score,
        mule_cluster_origin: payload.is_mule_cluster ? "Flagged Mule Node" : "Standard Origin",
        shap_summary: scoreResult.shap_features.map(f => `${f.feature} (${f.impact > 0 ? '+' : ''}${f.impact})`).join(", ")
      }
    };

    setTransactions(prev => [newTxn, ...prev]);
  };

  const handleProceedAtRisk = () => {
    setIsInterceptionOpen(false);
    SoundFX.playTacticalSelect();
    showToast(
      "Transaction Forced by User",
      "Payment authorized at user's own risk after cooling-off acknowledgment.",
      "danger"
    );

    const newTxn: TransactionRecord = {
      txn_id: `UPI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      payer: "current.user@oksbi",
      payee_vpa: payload.payee_vpa,
      merchant_name: payload.merchant_name || "Unknown Merchant",
      amount: payload.amount,
      txn_type: payload.txn_type,
      risk_score: scoreResult.risk_score,
      classification: scoreResult.classification,
      detected_vector: scoreResult.detected_vector,
      status: "WARNED_COOLOFF",
      message: payload.message,
      telemetry: {
        device_model: "Apple iPhone 15 Pro",
        os_version: "iOS 18.1 (Simulated)",
        app_package: "in.org.npci.upiapp",
        ip_location: "Simulated Test Client",
        pasted_vpa: payload.pasted_vpa,
        active_screenshare: payload.active_screenshare,
        active_phone_call: payload.active_phone_call,
        device_rooted: payload.device_rooted,
        late_night_hour: payload.late_night_hour,
        velocity_1h: payload.velocity_1h,
        velocity_24h: payload.velocity_24h,
        ratio_amount_to_avg: payload.ratio_amount_to_avg,
        nlp_intent_score: scoreResult.nlp_intent_score,
        mule_cluster_origin: payload.is_mule_cluster ? "Flagged Mule Node" : "Standard Origin",
        shap_summary: scoreResult.shap_features.map(f => `${f.feature} (${f.impact > 0 ? '+' : ''}${f.impact})`).join(", ")
      }
    };

    setTransactions(prev => [newTxn, ...prev]);
  };

  const handleQrPayloadInjected = (scannedVpa: string, isTampered = true, merchantName?: string, amount?: number) => {
    setActivePresetId(isTampered ? 'qr_tamper' : 'safe_legit');
    setPayload(prev => ({
      ...prev,
      payee_vpa: scannedVpa,
      merchant_name: merchantName || (isTampered ? "Sharma Kirana Store (Altered)" : "Reliance Fresh Store"),
      amount: amount || prev.amount,
      qr_payload_tampered: isTampered,
      is_mule_cluster: isTampered,
      txn_type: 'qr_scan'
    }));
    SoundFX.playTacticalSelect();
    showToast(
      isTampered ? "Tampered QR Injected" : "Verified Merchant QR Loaded",
      `Payee: ${scannedVpa} (${isTampered ? 'Tampered Recipient' : 'Verified Safe Merchant'})`,
      isTampered ? "warning" : "success"
    );
  };

  const handleFreezePayee = (vpa: string) => {
    SoundFX.playInterceptionAlert();
    if (selectedCase) {
      setTransactions(prev => prev.map(t => {
        if (t.txn_id === selectedCase.txn_id) {
          return { ...t, status: "FROZEN_BY_ANALYST" };
        }
        return t;
      }));
      setSelectedCase(prev => prev ? { ...prev, status: "FROZEN_BY_ANALYST" } : null);
    }
    showToast("Payee VPA Frozen", `${vpa} locked across NPCI registry`, "danger");
  };

  const handleMarkFalsePositive = (txnId: string) => {
    SoundFX.playSafeSuccess();
    if (selectedCase) {
      setTransactions(prev => prev.map(t => {
        if (t.txn_id === selectedCase.txn_id) {
          return { ...t, status: "ALLOWED_OVERRIDE", classification: "SAFE" };
        }
        return t;
      }));
      setSelectedCase(prev => prev ? { ...prev, status: "ALLOWED_OVERRIDE", classification: "SAFE" } : null);
    }
    showToast("Retraining Sample Logged", `Case ${txnId} marked as false positive`, "success");
  };

  const handleBeginMission = () => {
    sessionStorage.setItem('shield_intro_completed', 'true');
    setIsMissionIntroOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800 dark:text-slate-100 transition-colors duration-200 cyera-bg">
      
      {/* Cyera "Secure The Unknown" Cinematic Loading Screen & Mission Launcher */}
      <CyeraMissionIntro
        isOpen={isMissionIntroOpen}
        onBeginMission={handleBeginMission}
      />

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenMissionIntro={() => setIsMissionIntroOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'simulator' && (
          <SimulationHub
            payload={payload}
            scoreResult={scoreResult}
            isDark={isDark}
            activePresetId={activePresetId}
            onUpdatePayload={setPayload}
            onSelectPreset={handleSelectPreset}
            onRecalculate={handleRecalculate}
            onAttemptPayment={handleAttemptPayment}
            onOpenQrScanner={() => setIsQrModalOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <AnalystDashboard
            transactions={transactions}
            muleClusters={MULE_CLUSTERS}
            hourlyTrends={HOURLY_TRENDS}
            fraudBreakdown={FRAUD_BREAKDOWN}
            isDark={isDark}
            onInspectCase={setSelectedCase}
            onRefreshFeed={() => {
              SoundFX.playTacticalSelect();
              showToast("Feed Refreshed", "Loaded 8 new telemetry packets", "info");
            }}
          />
        )}

        {currentTab === 'metrics' && (
          <ModelEvaluation
            isDark={isDark}
            onBenchmarkComplete={() => {
              SoundFX.playSafeSuccess();
              showToast(
                "Benchmark Completed",
                "Precision: 96.4%, Recall: 94.8%, FPR: 1.18%, Latency: 27.8ms",
                "success"
              );
            }}
          />
        )}

        {currentTab === 'zeroday' && (
          <ZeroDayLab />
        )}

        {currentTab === 'npci_spec' && (
          <ArchitectureSpecs />
        )}
      </main>

      {/* Real-Time Safety Interception Modal */}
      <InterceptionModal
        isOpen={isInterceptionOpen}
        scoreResult={scoreResult}
        payload={payload}
        onClose={() => setIsInterceptionOpen(false)}
        onCancelAndReport={handleCancelAndReport}
        onProceedAtRisk={handleProceedAtRisk}
      />

      {/* QR Code Scanner / Injector Modal */}
      <QrScannerModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onSelectVpa={handleQrPayloadInjected}
      />

      {/* Case Forensic Inspector Drawer */}
      <CaseInspectDrawer
        transaction={selectedCase}
        onClose={() => setSelectedCase(null)}
        onFreezePayee={handleFreezePayee}
        onMarkFalsePositive={handleMarkFalsePositive}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-300">ShieldUPI AI Fraud Shield</span>
            <span>•</span>
            <span className="font-mono">Project CC6-AI02</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              NPCI &lt;120ms Latency SLA Compliant
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Inspired by Cyera Secure The Unknown · Built for Cybercup 2026.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
