import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Page Structural Views Mapping
import Home from './pages/Home'; // Dynamic explanation lander
import Login from './pages/Login'; // Professional login card panel
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import UploadFile from './pages/UploadFile';
import Profile from './pages/Profile';

// Premium Top Navigation Component
function GlobalHeader() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Upload Portal', path: '/upload' },
    { name: 'Operator Profile', path: '/profile' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        
        {/* Brand System Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="font-black text-lg tracking-tight text-slate-900 flex items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            PrivacyShield<span className="text-blue-600 font-medium text-xs">.ai</span>
          </Link>
          
          {/* Main Action Routes */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dynamic Session Killer Trigger */}
        <div>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-rose-500 transition-colors"
          >
            Terminate Session
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Screens */}
        <Route path="/" element={<Home />} /> {/* Points seamlessly to your new project explanation layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* <-- Add this explicit route! */}
        {/* Secure Operational Workspace Pages */}
        <Route 
          path="/*" 
          element = {
            <ProtectedRoute>
              <div className="min-h-screen bg-slate-50 flex flex-col">
                {/* Modern Menu Navigation Anchor injected right above views */}
                <GlobalHeader /> 
                
                <div className="flex-1 w-full">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/upload" element={<UploadFile />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;