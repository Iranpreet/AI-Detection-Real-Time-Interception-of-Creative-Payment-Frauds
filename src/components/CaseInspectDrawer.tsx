import React from 'react';
import { TransactionRecord } from '../types';
import { X, Lock, CheckCircle2, Database, FileText } from 'lucide-react';

interface CaseInspectDrawerProps {
  transaction: TransactionRecord | null;
  onClose: () => void;
  onFreezePayee: (vpa: string) => void;
  onMarkFalsePositive: (txnId: string) => void;
}

export const CaseInspectDrawer: React.FC<CaseInspectDrawerProps> = ({
  transaction,
  onClose,
  onFreezePayee,
  onMarkFalsePositive
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white/95 dark:bg-[#10141d]/95 border-l border-slate-200 dark:border-amber-500/20 p-6 z-50 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-amber-500/20 mb-4">
          <div>
            <span className="text-[10px] uppercase font-mono text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
              <Database className="w-3 h-3" />
              Forensic Telemetry Inspector
            </span>
            <h3 className="text-base font-heading font-extrabold text-slate-900 dark:text-amber-100 mt-0.5">
              {transaction.txn_id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Forensic Metadata Grid */}
        <div className="space-y-2.5 text-xs mb-5">
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Timestamp:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">{transaction.timestamp}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Amount:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              ₹{transaction.amount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Payee VPA:</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold max-w-[200px] truncate">
              {transaction.payee_vpa}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Claimed Merchant:</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {transaction.merchant_name || "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Payer VPA:</span>
            <span className="font-mono text-slate-800 dark:text-slate-300">{transaction.payer}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Risk Score:</span>
            <span className={`font-mono font-bold ${
              transaction.risk_score >= 70 ? 'text-red-500' : transaction.risk_score >= 35 ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {transaction.risk_score} / 100
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Detected Vector:</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{transaction.detected_vector}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Status:</span>
            <span className="font-mono font-bold px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {transaction.status}
            </span>
          </div>
        </div>

        {/* Raw Telemetry JSON Box */}
        <div>
          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            Raw Telemetry & ML Attribution
          </h4>
          <pre className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#090b10] border border-slate-200 dark:border-amber-500/15 text-[11px] font-mono text-slate-800 dark:text-amber-100/90 overflow-x-auto max-h-64 leading-relaxed">
            {JSON.stringify(transaction.telemetry, null, 2)}
          </pre>
        </div>
      </div>

      {/* Analyst Action Buttons */}
      <div className="pt-4 border-t border-slate-200 dark:border-amber-500/20 space-y-2 mt-4">
        <button
          type="button"
          onClick={() => onFreezePayee(transaction.payee_vpa)}
          className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Freeze Payee VPA across NPCI Network</span>
        </button>
        <button
          type="button"
          onClick={() => onMarkFalsePositive(transaction.txn_id)}
          className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-[#1a212e] dark:hover:bg-[#222b3b] text-slate-800 dark:text-amber-200 border border-slate-200 dark:border-amber-500/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Mark as False Positive (Retraining Pipeline)</span>
        </button>
      </div>
    </div>
  );
};
