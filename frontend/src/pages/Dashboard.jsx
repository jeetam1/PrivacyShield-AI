import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Activity, BarChart3, PieChart, Layers, Clock, FileDown } from 'lucide-react';
import { scannerService } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_scans: 0,
    risk_distribution_breakdown: { HIGH: 0, MEDIUM: 0, LOW: 0 },
    system_mean_score: 0
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardMetrics() {
      try {
        const [statsRes, historyRes] = await Promise.all([
          scannerService.getAdminStats(),
          scannerService.getHistory()
        ]);
        
        setStats(statsRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        console.error("Failed to gather system operational telemetry:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-mono tracking-widest">
        INITIALIZING COMPLIANCE TELEMETRY MATRIX...
      </div>
    );
  }

  const highRisk = stats.risk_distribution_breakdown?.HIGH || 0;
  const medRisk = stats.risk_distribution_breakdown?.MEDIUM || 0;
  const lowRisk = stats.risk_distribution_breakdown?.LOW || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-500/10">
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        
        {/* Header Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold tracking-widest uppercase mb-1">
              <Activity className="h-3.5 w-3.5" />
              Operations Monitor Active
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">PrivacyShield Operations Center</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Real-time enterprise PII vector suppression dashboard analytics framework.</p>
          </div>
        </div>

        {/* Status Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Total Protected Volume</label>
              <p className="text-3xl font-black text-slate-900 font-mono">{stats.total_scans}</p>
            </div>
            <div className="p-3 bg-slate-50 text-slate-600 rounded-xl border border-slate-100"><Layers className="h-5 w-5" /></div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">High Risk Interceptions</label>
              <p className="text-3xl font-black text-rose-600 font-mono">{highRisk}</p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100"><ShieldAlert className="h-5 w-5" /></div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Moderate Tasks</label>
              <p className="text-3xl font-black text-amber-500 font-mono">{medRisk}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl border border-amber-100"><Shield className="h-5 w-5" /></div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">System Threat Index Mean</label>
              <p className="text-3xl font-black text-emerald-600 font-mono">{Number(stats.system_mean_score).toFixed(1)}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100"><ShieldCheck className="h-5 w-5" /></div>
          </div>
        </div>

        {/* Charts Section Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Threat Mitigation Breakdown</h3>
            </div>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-600 font-mono"><span>Critical Risk Ingestions</span><span>{highRisk} files</span></div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${stats.total_scans ? (highRisk / stats.total_scans) * 100 : 0}%` }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-600 font-mono"><span>Moderate Risk Ingestions</span><span>{medRisk} files</span></div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${stats.total_scans ? (medRisk / stats.total_scans) * 100 : 0}%` }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-600 font-mono"><span>Minimal Risk Ingestions</span><span>{lowRisk} files</span></div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.total_scans ? (lowRisk / stats.total_scans) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <PieChart className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Threat Density Proportions</h3>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                <div className="text-center">
                  <span className="text-xl font-black text-slate-900 font-mono">{stats.total_scans}</span>
                  <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Nodes</span>
                </div>
                <div className="absolute inset-[-8px] rounded-full border-8 border-transparent border-t-rose-500 border-r-amber-500 pointer-events-none rotate-45" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-50">
              <div><span className="block text-[9px] font-bold text-slate-400 uppercase font-mono">Critical</span><span className="text-xs font-extrabold text-rose-500 font-mono">{highRisk}</span></div>
              <div><span className="block text-[9px] font-bold text-slate-400 uppercase font-mono">Moderate</span><span className="text-xs font-extrabold text-amber-500 font-mono">{medRisk}</span></div>
              <div><span className="block text-[9px] font-bold text-slate-400 uppercase font-mono">Minimal</span><span className="text-xs font-extrabold text-emerald-500 font-mono">{lowRisk}</span></div>
            </div>
          </div>
        </div>

        {/* Upgraded System Audit Trail */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm shadow-slate-100/50 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              System Audit Trail / Historical Ingestions
            </h3>
          </div>

          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse m-0">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                    <th className="py-3.5 px-6 select-none">Log ID</th>
                    <th className="py-3.5 px-6 select-none">Document Descriptor</th>
                    <th className="py-3.5 px-6 select-none">Threat Score</th>
                    <th className="py-3.5 px-6 select-none">Remediation Status</th>
                    <th className="py-3.5 px-6 select-none text-right">Timestamp Trace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium font-sans">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6 font-mono text-[11px] text-slate-400 font-bold">
                        #{String(item.id).padStart(4, '0')}
                      </td>
                      
                      <td className="py-4 px-6 font-mono text-[11px] text-slate-900 font-semibold group-hover:text-blue-600 transition-colors">
                        <div className="flex items-center gap-2">
                          <FileDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          {item.filename || "raw_stream_buffer.txt"}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono font-bold text-[10px] uppercase tracking-wide border ${
                          item.risk_level === 'HIGH' 
                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {item.risk_score} / 100
                        </span>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <span className={`h-1.5 w-1.5 rounded-full ${item.risk_level === 'HIGH' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          Suppressed & Saved
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-right font-mono text-[11px] text-slate-400">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-mono tracking-wide">
              NO SECURITY INCIDENT HISTORICAL LOGS REPORTED
            </div>
          )}
        </div>

      </div>
    </div>
  );
}