import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { scannerService } from '../services/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ total: 0, high: 0, med: 0, low: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadDashboardMetrics() {
    try {
      const response = await scannerService.getHistory();
      // Add a fallback option if response or response.data is missing
      const records = response && response.data ? response.data : [];
      
      const counts = records.reduce((acc, curr) => {
        if (!curr) return acc;
        const level = (curr.risk_level || '').toLowerCase();
        if (level.includes('high')) acc.high++;
        else if (level.includes('medium') || level.includes('med')) acc.med++;
        else acc.low++;
        return acc;
      }, { high: 0, med: 0, low: 0 });

      setMetrics({
        total: records.length,
        high: counts.high,
        med: counts.med,
        low: counts.low
      });

      const timelineDataset = records.slice(0, 7).reverse().map(item => ({
        name: item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Unknown',
        riskScore: item.risk_score || 0
      }));
      setChartData(timelineDataset);
    } catch (err) {
      console.error("Dashboard metric synchronization failed:", err);
      // Set empty state fallbacks so the UI doesn't crash on failure
      setMetrics({ total: 0, high: 0, med: 0, low: 0 });
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }
  loadDashboardMetrics();
}, []);

  const metricDonutData = [
    { name: 'Critical Risk', value: metrics.high, color: '#EF4444' },
    { name: 'Moderate Risk', value: metrics.med, color: '#F59E0B' },
    { name: 'Minimal Risk', value: metrics.low, color: '#10B981' }
  ];

  if (loading) return <div className="text-white font-medium p-12 text-center">Synchronizing Platform Matrix...</div>;

  return (
    <div className="p-8 text-slate-100 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">PrivacyShield Operations Center</h1>
        <p className="text-slate-400 mt-1">Real-time enterprise PII vector suppression dashboard</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Protected Volume', val: metrics.total, color: 'from-blue-500/20 to-indigo-500/10', text: 'text-blue-400' },
          { label: 'High Risk Interceptions', val: metrics.high, color: 'from-red-500/20 to-orange-500/10', text: 'text-red-400' },
          { label: 'Medium Level Tasks', val: metrics.med, color: 'from-amber-500/20 to-yellow-500/10', text: 'text-amber-400' },
          { label: 'Clear Verified Nodes', val: metrics.low, color: 'from-emerald-500/20 to-teal-500/10', text: 'text-emerald-400' },
        ].map((card, idx) => (
          <motion.div key={idx} whileHover={{ scale: 1.02 }} className={`p-6 rounded-2xl border border-white/10 bg-gradient-to-br ${card.color} backdrop-blur-xl shadow-2xl`}>
            <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">{card.label}</p>
            <p className={`text-4xl font-black mt-2 ${card.text}`}>{card.val}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
          <h3 className="text-xl font-bold mb-4 text-slate-200">Incident Risk Trajectory</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="riskScore" stroke="#3B82F6" fillOpacity={0.2} fill="url(#colorRisk)" strokeWidth={3} />
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-2 text-slate-200">Profile Density Composition</h3>
          <div className="h-48 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={metricDonutData.filter(d => d.value > 0)} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {metricDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {metricDonutData.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-200">{item.value} files</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;