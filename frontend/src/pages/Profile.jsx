import React, { useEffect, useState } from 'react';
import { User, ShieldAlert, Calendar, Mail, HardDrive, ShieldCheck, Fingerprint } from 'lucide-react';
import { scannerService } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await scannerService.getProfile();
        setProfile(response.data);
      } catch (err) {
        console.error("Failed to compile operator profile metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-mono tracking-widest">
        LOADING COMPLIANCE CREDENTIALS...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-500/10">
      <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
        
        {/* Subtle Section Header Indicator */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold tracking-widest uppercase font-mono">
            <Fingerprint className="h-4 w-4" />
            Security Node Identity Reference
          </div>
        </div>

        {/* Profile Master Card Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm shadow-slate-100 flex flex-col sm:flex-row gap-6 items-center">
          <div className={`p-4 rounded-xl border ${profile.is_staff ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
            <User className="h-10 w-10" />
          </div>
          
          <div className="text-center sm:text-left space-y-1">
            <span className={`inline-block px-2.5 py-0.5 rounded-md text-[9px] font-bold tracking-widest uppercase font-mono border ${profile.is_staff ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
              {profile.is_staff ? 'System Administrator' : 'Clearance Agent'}
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{profile.username}</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> {profile.email}
            </p>
          </div>
        </div>

        {/* Technical Operational Telemetry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Box 1: Volume */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm shadow-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
              <HardDrive className="h-3.5 w-3.5 text-blue-500" /> Total Handled Volume
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono pt-1">{profile.stats.total_volume}</p>
            <p className="text-[10px] text-slate-400 font-medium pt-1">Processed document buffers overall</p>
          </div>

          {/* Box 2: Interceptions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm shadow-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-500" /> Critical Suppressions
            </div>
            <p className="text-3xl font-black text-rose-600 font-mono pt-1">{profile.stats.critical_volume}</p>
            <p className="text-[10px] text-slate-400 font-medium pt-1">High-risk PII threats scrubbed</p>
          </div>

          {/* Box 3: Join Date */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm shadow-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
              <Calendar className="h-3.5 w-3.5 text-emerald-500" /> Terminal Provisioned
            </div>
            <p className="text-sm font-extrabold text-slate-700 pt-3 font-mono">{profile.date_joined}</p>
            <p className="text-[10px] text-slate-400 font-medium pt-1">Node initialization timestamp</p>
          </div>

        </div>

        {/* Conditional System Administrator Notice Box */}
        {profile.is_staff && (
          <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wide font-mono">Administrative Operations Active</h5>
              <p className="text-xs text-amber-700 font-medium leading-relaxed">
                Your profile holds full system clearance. You are authorized to track global metrics, view cross-operator history nodes, and audit engine configurations.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}