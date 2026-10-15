import React, { useState, useEffect } from 'react';
import { ScoreResult, TxnPayload } from '../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  PhoneCall, 
  ArrowLeft, 
  Lock, 
  Copy, 
  Check, 
  KeyRound, 
  Info,
  Clock
} from 'lucide-react';
import { SoundFX } from '../services/soundEffects';

interface InterceptionModalProps {
  isOpen: boolean;
  scoreResult: ScoreResult | null;
  payload: TxnPayload;
  onClose: () => void;
  onCancelAndReport: () => void;
  onProceedAtRisk: () => void;
}

export const InterceptionModal: React.FC<InterceptionModalProps> = ({
  isOpen,
  scoreResult,
  payload,
  onClose,
  onCancelAndReport,
  onProceedAtRisk
}) => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [coolingSeconds, setCoolingSeconds] = useState(10);
  const [acknowledged, setAcknowledged] = useState(false);
  const [subView, setSubView] = useState<'main' | 'verify_bank' | 'enter_pin'>('main');
  const [pinValue, setPinValue] = useState<string>('');
  const [copiedHelpline, setCopiedHelpline] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCoolingSeconds(10);
      setAcknowledged(false);
      setSubView('main');
      setPinValue('');
      setValidationError(null);
      setLang('en');

      const interval = setInterval(() => {
        setCoolingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen || !scoreResult) return null;

  const currentNudge = lang === 'hi' ? scoreResult.nudges.hi : scoreResult.nudges.en;

  const handleVerifyBankClick = () => {
    SoundFX.playTacticalSelect();
    setSubView('verify_bank');
  };

  const handleProceedClick = () => {
    if (coolingSeconds > 0) {
      SoundFX.playInterceptionAlert();
      setValidationError(`Mandatory Cooling-Off Period: Please wait ${coolingSeconds} more seconds to prevent hasty transfers.`);
      return;
    }
    if (!acknowledged) {
      SoundFX.playInterceptionAlert();
      setValidationError("Please check the acknowledgment box confirming you know UPI PIN debits funds.");
      return;
    }
    SoundFX.playTacticalSelect();
    setValidationError(null);
    setSubView('enter_pin');
  };

  const handleCopyHelpline = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedHelpline(true);
    SoundFX.playHoverBlip();
    setTimeout(() => setCopiedHelpline(false), 2500);
  };

  const handleAuthorizeWithPin = () => {
    if (pinValue.length < 4) {
      SoundFX.playInterceptionAlert();
      setValidationError("Please enter your 4 or 6 digit UPI PIN to authorize.");
      return;
    }
    SoundFX.playTacticalSelect();
    onProceedAtRisk();
  };

  const handleKeypadPress = (digit: string) => {
    if (pinValue.length < 6) {
      SoundFX.playHoverBlip();
      setPinValue(prev => prev + digit);
    }
  };

  const handleKeypadBackspace = () => {
    SoundFX.playHoverBlip();
    setPinValue(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-red-500/80 bg-white dark:bg-[#10141d] p-6 sm:p-7 shadow-2xl shadow-red-500/30 glow-crimson transform transition-all duration-300">
        
        {/* ================= SUB-VIEW 1: VERIFY WITH 1930 / BANK ================= */}
        {subView === 'verify_bank' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <button
                type="button"
                onClick={() => setSubView('main')}
                className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-white cursor-pointer font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Warning</span>
              </button>
              <span className="text-[11px] font-mono font-bold text-amber-400">
                OFFICIAL VERIFICATION PROTOCOL
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-sm font-bold text-amber-100">National Cybercrime Helpline</div>
                      <div className="text-[11px] text-amber-200/70">Citizen Financial Cyber Fraud Reporting</div>
                    </div>
                  </div>
                  <span className="text-lg font-mono font-extrabold text-amber-400">1930</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Dial <strong>1930</strong> immediately if you believe you are speaking with an impersonator or were sent a malicious collect link. Nodal officers can freeze the fraudulent recipient account within minutes.
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyHelpline("1930")}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-amber-500/30 transition-colors"
                >
                  {copiedHelpline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHelpline ? "Copied 1930 to Clipboard!" : "Copy Helpline Number 1930"}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>3 Ironclad UPI Safety Rules:</span>
                </div>
                <ul className="space-y-1.5 text-slate-400 pl-5 list-disc leading-relaxed">
                  <li><strong>UPI PIN is only for sending money.</strong> You never need to enter your PIN or scan a QR code to receive a refund or lottery reward.</li>
                  <li><strong>Never install remote desktop apps</strong> (AnyDesk, TeamViewer, RustDesk) if instructed by an unverified caller.</li>
                  <li><strong>Official Bank Nodal Helpline:</strong> Call 1800-1200 or 1800-1111 to verify if any alert is genuine.</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubView('main')}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
            >
              Return to Interception Screen
            </button>
          </div>
        )}

        {/* ================= SUB-VIEW 2: ENTER UPI PIN (PROCEED AT OWN RISK) ================= */}
        {subView === 'enter_pin' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-red-500/30">
              <button
                type="button"
                onClick={() => setSubView('main')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-[11px] font-mono font-bold text-red-400 uppercase">
                FINAL PAYMENT AUTHORIZATION
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-center space-y-2">
              <KeyRound className="w-8 h-8 text-red-400 mx-auto animate-pulse" />
              <h4 className="text-sm font-bold text-red-200">
                Enter UPI PIN to Force Transfer ₹{payload.amount.toLocaleString('en-IN')}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Funds will be transferred immediately to <strong className="text-amber-300 font-mono">{payload.payee_vpa}</strong>. This action cannot be reversed once authorized.
              </p>
            </div>

            {/* Masked PIN Display */}
            <div className="flex justify-center gap-3 my-4">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const filled = idx < pinValue.length;
                return (
                  <div
                    key={idx}
                    className={`w-9 h-11 rounded-xl border flex items-center justify-center font-mono text-lg font-bold transition-all ${
                      filled
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                        : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}
                  >
                    {filled ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {/* Virtual Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono font-bold text-sm border border-slate-700 cursor-pointer active:scale-95 transition-all"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPinValue('')}
                className="py-2.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold border border-slate-800 cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono font-bold text-sm border border-slate-700 cursor-pointer active:scale-95 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="py-2.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold border border-slate-800 cursor-pointer"
              >
                ⌫
              </button>
            </div>

            {validationError && (
              <p className="text-center text-xs text-red-400 font-semibold animate-shake">
                {validationError}
              </p>
            )}

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setSubView('main')}
                className="flex-1 py-3 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorizeWithPin}
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-600/30 cursor-pointer transition-all"
              >
                Authorize & Send
              </button>
            </div>
          </div>
        )}

        {/* ================= SUB-VIEW 0: MAIN INTERCEPTION SCREEN ================= */}
        {subView === 'main' && (
          <div>
            {/* Top Alert Header with Language Switcher */}
            <div className="flex items-center justify-between pb-4 border-b border-red-200 dark:border-red-500/30">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-500/30 shadow-inner">
                  <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-500 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                    ShieldUPI Safety Interception
                  </span>
                  <h3 className="text-base font-heading font-extrabold text-slate-900 dark:text-white">
                    Payment Fraud Threat Detected
                  </h3>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0c0f16] border border-slate-200 dark:border-amber-500/20 text-xs">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    lang === 'en'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-amber-200/60 hover:text-slate-900 dark:hover:text-amber-200'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang('hi')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    lang === 'hi'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-amber-200/60 hover:text-slate-900 dark:hover:text-amber-200'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            {/* Plain Language Nudge (The bold unmissable warning) */}
            <div className="my-5 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-sm sm:text-base font-bold text-red-900 dark:text-red-200 leading-snug">
                {currentNudge}
              </p>
            </div>

            {/* Transaction Preview Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c0f16] border border-slate-200 dark:border-amber-500/20 text-xs space-y-2 mb-4 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-amber-200/60">Payment Amount:</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white text-base">
                  ₹{payload.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-amber-200/60">Target Recipient:</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold truncate max-w-[220px]">
                  {payload.payee_vpa}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Direction:</span>
                <span className="font-bold text-red-600 dark:text-red-400 font-mono text-[11px]">
                  {payload.txn_type === 'collect'
                    ? 'COLLECT REQUEST (DEBITS YOUR ACCOUNT)'
                    : payload.txn_type === 'qr_scan'
                    ? 'MERCHANT QR SCAN (PAYOUT DEBIT)'
                    : 'STANDARD UPI DEBIT (OUTGOING)'}
                </span>
              </div>
            </div>

            {/* Cooling-Off Period & Acknowledgment */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={`font-semibold flex items-center gap-1.5 ${
                  coolingSeconds > 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {coolingSeconds > 0 ? (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      <span>Cooling-off: <strong>{coolingSeconds}s remaining</strong></span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cooling-off complete. Ready for decision.</span>
                    </>
                  )}
                </span>
                <span className="text-slate-500 text-[11px]">NPCI Mandate</span>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#0c0f16] border border-slate-200 dark:border-amber-500/20 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-amber-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => {
                    setAcknowledged(e.target.checked);
                    setValidationError(null);
                  }}
                  className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  I explicitly acknowledge that <strong>UPI PIN is only used for sending money, never for receiving money, gifts, or claiming rewards.</strong>
                </span>
              </label>
            </div>

            {/* Inline validation alert if user clicks proceed prematurely */}
            {validationError && (
              <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onCancelAndReport}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Payment & Report Scam (Recommended)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleVerifyBankClick}
                  className="py-2.5 px-3 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-[#1a212e] dark:hover:bg-[#222b3b] text-slate-800 dark:text-amber-200 border border-slate-300 dark:border-amber-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verify with 1930 / Bank</span>
                </button>
                <button
                  type="button"
                  onClick={handleProceedClick}
                  className={`py-2.5 px-3 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                    coolingSeconds > 0 || !acknowledged
                      ? 'bg-red-950/30 text-red-400/80 border-red-500/30 hover:bg-red-950/60'
                      : 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-lg shadow-red-600/25'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>Proceed at Own Risk</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
