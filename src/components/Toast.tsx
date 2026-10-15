import React from 'react';
import { ToastItem } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let borderClass = 'border-indigo-500/40 bg-slate-900/95 text-slate-100 shadow-indigo-500/20';
        let Icon = Info;
        let iconColor = 'text-indigo-400';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/40 bg-slate-900/95 text-slate-100 shadow-emerald-500/20';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/40 bg-slate-900/95 text-slate-100 shadow-amber-500/20';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'danger') {
          borderClass = 'border-red-500/40 bg-slate-900/95 text-slate-100 shadow-red-500/25';
          Icon = AlertCircle;
          iconColor = 'text-red-400';
        }

        return (
          <div
            key={toast.id}
            className={`p-4 rounded-2xl border ${borderClass} shadow-xl backdrop-blur-md flex items-start gap-3 pointer-events-auto transition-all duration-300 animate-in slide-in-from-bottom-2`}
          >
            <div className="mt-0.5 flex-shrink-0">
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-heading font-bold">{toast.title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
