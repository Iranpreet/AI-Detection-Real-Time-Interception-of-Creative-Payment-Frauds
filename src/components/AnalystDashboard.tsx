import React, { useState, useMemo } from 'react';
import { TransactionRecord, MuleCluster, HourlyTrend, FraudCategory } from '../types';
import { DonutChartCanvas, HourlyTrendCanvas } from './Charts';
import { 
  BarChart3, 
  Search, 
  RotateCcw, 
  MapPin, 
  TrendingUp
} from 'lucide-react';

interface AnalystDashboardProps {
  transactions: TransactionRecord[];
  muleClusters: MuleCluster[];
  hourlyTrends: HourlyTrend[];
  fraudBreakdown: FraudCategory[];
  isDark: boolean;
  onInspectCase: (txn: TransactionRecord) => void;
  onRefreshFeed: () => void;
}

export const AnalystDashboard: React.FC<AnalystDashboardProps> = ({
  transactions,
  muleClusters,
  hourlyTrends,
  fraudBreakdown,
  isDark,
  onInspectCase,
  onRefreshFeed
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = !searchQuery ||
        t.txn_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.payee_vpa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.payer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.detected_vector.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRisk = filterRisk === 'ALL' || t.classification === filterRisk;
      return matchSearch && matchRisk;
    });
  }, [transactions, searchQuery, filterRisk]);

  return (
    <div className="space-y-6">
      
      {/* Analyst Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-amber-500/20">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-slate-900 dark:text-amber-50 tracking-tight flex items-center gap-2">
            <span>Bank & Security Analyst Operations Hub</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 font-bold">
              NCRP 1930 Linked
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-amber-200/60 mt-1">
            Live UPI telemetry monitoring, mule ring cluster intelligence, and automated fraud interception logs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-amber-200/60 font-mono">
            Feed Status: <strong className="text-emerald-600 dark:text-emerald-400">Live Streaming</strong>
          </span>
          <button
            type="button"
            onClick={onRefreshFeed}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1a212e] dark:hover:bg-[#222b3b] text-slate-700 dark:text-amber-200 border border-slate-200 dark:border-amber-500/20 transition-colors cursor-pointer"
            title="Refresh Live Telemetry Feed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards (4 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-3xl cyera-panel">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-amber-200/60 mb-1">
            <span>Total Transactions Scanned</span>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">24h</span>
          </div>
          <div className="text-2xl font-heading font-extrabold text-slate-900 dark:text-amber-50">
            142,850
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>↑ 12.4%</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal">vs yesterday's volume</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl cyera-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-amber-200/60 mb-1">
            <span>Fraud Intercepted & Saved</span>
            <span className="text-red-500 font-bold font-mono">1,842 blocked</span>
          </div>
          <div className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            ₹ 4.62 Crore
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Direct citizen loss prevention</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl cyera-panel">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-amber-200/60 mb-1">
            <span>False Positive Rate (FPR)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Benchmark &lt;2.0%</span>
          </div>
          <div className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            1.18%
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Industry best-in-class</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl cyera-panel">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-amber-200/60 mb-1">
            <span>Average Decision Latency</span>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">SLA &lt;120ms</span>
          </div>
          <div className="text-2xl font-heading font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            27.8 ms
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            <span>✓ 76.8% faster than SLA</span>
          </div>
        </div>

      </div>

      {/* Charts Grid (2 columns: Donut Breakdown + Hourly Trend) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Donut Chart: Fraud by Category (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl cyera-panel">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-amber-200/80">
              Fraud Breakdown by Vector Category
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">24-hour distribution</span>
          </div>
          <div className="w-full h-56 flex items-center justify-center">
            <DonutChartCanvas data={fraudBreakdown} isDark={isDark} />
          </div>
        </div>

        {/* Line/Area Chart: Hourly Trends (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl cyera-panel">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-amber-200/80">
              24-Hour Fraud Attempt Velocity & Spikes
            </h3>
            <span className="text-[11px] text-red-500 font-mono font-bold">
              Spikes at 11 PM - 3 AM
            </span>
          </div>
          <div className="w-full h-56 flex items-center justify-center">
            <HourlyTrendCanvas data={hourlyTrends} isDark={isDark} />
          </div>
        </div>

      </div>

      {/* Geographic & Mule Cluster Hotspots Table */}
      <div className="p-6 sm:p-7 rounded-3xl cyera-panel">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-amber-500/20">
          <div>
            <h3 className="text-sm font-heading font-bold text-slate-900 dark:text-amber-50 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              Reported Mule Account Syndicates & Hotspot Geofences
            </h3>
            <p className="text-xs text-slate-500 dark:text-amber-200/60 mt-0.5">
              Correlated with National Cybercrime Reporting Portal (NCRP) & Bank Nodal Records
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            5 Active Syndicates Mapped
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-amber-200/60 border-b border-slate-200 dark:border-amber-500/20 bg-slate-50 dark:bg-transparent">
                <th className="py-2.5 px-3">Syndicate Hotspot</th>
                <th className="py-2.5 px-3">State / Jurisdiction</th>
                <th className="py-2.5 px-3">Threat Tier</th>
                <th className="py-2.5 px-3">Active Mule VPAs</th>
                <th className="py-2.5 px-3">Blocked Volume</th>
                <th className="py-2.5 px-3 text-right">Primary Scam Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40">
              {muleClusters.map((c, idx) => {
                const riskClass = c.risk_level === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : c.risk_level === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20';

                return (
                  <tr key={idx} className="border-b border-slate-200 dark:border-amber-500/10 hover:bg-slate-50 dark:hover:bg-[#1a212e]/50 transition-colors">
                    <td className="py-3 px-3 text-xs font-bold text-slate-800 dark:text-amber-100">{c.cluster_name}</td>
                    <td className="py-3 px-3 text-xs text-slate-600 dark:text-slate-400">{c.state}</td>
                    <td className="py-3 px-3 text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskClass}`}>
                        {c.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs font-mono text-slate-700 dark:text-slate-300">{c.active_mule_nodes} nodes</td>
                    <td className="py-3 px-3 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{c.blocked_volume_inr}</td>
                    <td className="py-3 px-3 text-xs text-slate-600 dark:text-slate-400 text-right">{c.primary_vector}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Flagged Transactions Table */}
      <div className="p-6 sm:p-7 rounded-3xl cyera-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-heading font-bold text-slate-900 dark:text-amber-50">
              Live Flagged & Analyzed Transactions
            </h3>
            <p className="text-xs text-slate-500 dark:text-amber-200/60">
              Click "Inspect" on any case to review full device telemetry, XAI attribution, and take compliance action.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search VPA or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 sm:w-56 pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0c0f16] border border-slate-300 dark:border-amber-500/20 focus:border-amber-500 focus:outline-none text-slate-900 dark:text-slate-200"
              />
            </div>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0c0f16] border border-slate-300 dark:border-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="HIGH_RISK">High Risk (🔴)</option>
              <option value="SUSPICIOUS">Suspicious (🟡)</option>
              <option value="SAFE">Safe (🟢)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-amber-200/60 border-b border-slate-200 dark:border-amber-500/20 bg-slate-50 dark:bg-transparent">
                <th className="py-2.5 px-3.5">Txn ID</th>
                <th className="py-2.5 px-3.5">Time</th>
                <th className="py-2.5 px-3.5">Amount</th>
                <th className="py-2.5 px-3.5">Payee UPI ID</th>
                <th className="py-2.5 px-3.5">Risk Tier</th>
                <th className="py-2.5 px-3.5">Detected Vector</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-xs italic">
                    No transactions matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  let riskBadge = (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Safe ({t.risk_score})
                    </span>
                  );
                  if (t.classification === 'HIGH_RISK') {
                    riskBadge = (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        High ({t.risk_score})
                      </span>
                    );
                  } else if (t.classification === 'SUSPICIOUS') {
                    riskBadge = (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Review ({t.risk_score})
                      </span>
                    );
                  }

                  return (
                    <tr key={t.txn_id} className="border-b border-slate-200 dark:border-amber-500/10 hover:bg-slate-50 dark:hover:bg-[#1a212e]/50 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold">{t.txn_id}</td>
                      <td className="py-3 px-3.5 text-xs text-slate-500 dark:text-slate-400 font-mono">{t.timestamp.substring(11, 19)}</td>
                      <td className="py-3 px-3.5 text-xs font-bold text-slate-900 dark:text-slate-200">₹{t.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3.5 text-xs font-mono text-amber-600 dark:text-amber-400 max-w-[150px] truncate" title={t.payee_vpa}>{t.payee_vpa}</td>
                      <td className="py-3 px-3.5 text-xs">{riskBadge}</td>
                      <td className="py-3 px-3.5 text-xs text-slate-700 dark:text-slate-300 max-w-[180px] truncate" title={t.detected_vector}>{t.detected_vector}</td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onInspectCase(t)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 text-slate-700 dark:text-slate-300 hover:text-slate-950 hover:font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
