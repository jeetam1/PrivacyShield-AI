import React from 'react';
import { motion } from 'framer-motion';

const Profile = () => {
  // Pull security details directly from authentication store contexts in production models.
  const operatorMockData = {
    username: "Navneet",
    email: "navneet@privacyshield.io",
    role: "SecOps Principal Admin",
    assignedNodes: "Global Node Array Cluster 1"
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.97 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-950/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-white/10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-3xl shadow-xl shadow-cyan-500/10 shrink-0">
            💻
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">{operatorMockData.username}</h1>
            <p className="text-cyan-400 font-bold text-sm tracking-wider uppercase mt-0.5">{operatorMockData.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[
            { label: "Account Email Vector Address", value: operatorMockData.email },
            { label: "System Operational Domain Context", value: operatorMockData.assignedNodes },
            { label: "Authentication Token Configuration", value: "HS256 Standard Signature Token Enforced" },
            { label: "API Rate-Limit Quota Array", value: "Unlimited Enterprise Node Allocation Burst Capacity" }
          ].map((item, index) => (
            <div key={index} className="p-4 rounded-xl bg-slate-950/40 border border-white/5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-1">{item.label}</label>
              <span className="text-sm font-semibold text-slate-300">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;