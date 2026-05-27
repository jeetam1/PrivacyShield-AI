import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';

const History = () => {
  const [scans, setScans] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScanLogs() {
      try {
        const res = await API.get('scanner/history/');
        setScans(res.data);
      } catch (err) {
        console.error("Failed to sync historical trace matrices:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchScanLogs();
  }, []);

  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.filename.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || scan.risk_level.toUpperCase() === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-8 text-slate-400 text-center">Reading Threat Registers...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">System Scan Ledger</h1>
          <p className="text-slate-400 text-sm mt-0.5">Immutable structural tracking log of historical text processing sequences</p>
        </div>

        {/* Filter Toolbar Controls */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-200 placeholder:text-slate-500 w-48 md:w-64 transition-all"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-300 transition-all"
          >
            <option value="ALL">All Vector Levels</option>
            <option value="HIGH">Critical Threat</option>
            <option value="MEDIUM">Moderate Risk</option>
            <option value="LOW">Low Profile</option>
          </select>
        </div>
      </div>

      {/* Main Ledger Core Grid View */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/20 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/10 text-xs font-bold tracking-widest text-slate-400 uppercase">
                <th className="p-4">Resource Target Name</th>
                <th className="p-4">Analyzed Stamp</th>
                <th className="p-4">Normalized Score</th>
                <th className="p-4">Classification Label</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-medium">
              {filteredScans.length > 0 ? filteredScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 text-slate-200 font-semibold">{scan.filename}</td>
                  <td className="p-4 text-slate-400">{new Date(scan.created_at).toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-slate-300">{scan.risk_score}/100</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${scan.risk_level.toUpperCase().includes('HIGH') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : scan.risk_level.toUpperCase().includes('MED') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {scan.risk_level}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-all">
                      Inspect Matrix
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 font-medium">No files matched the current filtering criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;