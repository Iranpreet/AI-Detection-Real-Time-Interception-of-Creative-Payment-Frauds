import React from 'react';
import { ShapFeature } from '../types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ShapAttributionProps {
  features: ShapFeature[];
}

export const ShapAttribution: React.FC<ShapAttributionProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return (
      <div className="text-xs text-slate-500 italic p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
        No significant risk variance detected. Normal baseline behavior.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {features.map((f, idx) => {
        const isPos = f.direction === 'positive';
        const barWidth = Math.min(100, Math.abs(f.impact) * 2.4);
        const impactSign = isPos ? `+${f.impact}` : `${f.impact}`;
        const colorClass = isPos ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400';
        const bgBarClass = isPos ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600';
        const bgPill = isPos ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20';

        return (
          <div 
            key={idx}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:translate-x-0.5"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {isPos ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
                )}
                {f.feature}
              </span>
              <span className={`font-mono font-bold text-[11px] px-1.5 py-0.5 rounded border ${bgPill} ${colorClass}`}>
                {impactSign} pts
              </span>
            </div>
            
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-1.5 pl-5">
              {f.description}
            </p>

            <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden pl-5">
              <div 
                className={`${bgBarClass} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
