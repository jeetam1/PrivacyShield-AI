import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { label: 'Operations Center', path: '/dashboard', icon: '📊' },
    { label: 'Data Ingestion Gate', path: '/upload', icon: '🛡️' },
    { label: 'Scan Audit Log', path: '/history', icon: '📜' },
    { label: 'Operator Profile', path: '/profile', icon: '👤' },
    { label: 'Admin Command', path: '/admin', icon: '⚙️' },
  ];

  const executeSystemSessionPurge = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <span className="text-2xl">🛡️</span>
          <span className="font-black text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase">
            PrivacyShield
          </span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/5' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}
              `}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={executeSystemSessionPurge}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
      >
        <span>🚪</span> Terminate Session
      </button>
    </aside>
  );
};

export default Sidebar;