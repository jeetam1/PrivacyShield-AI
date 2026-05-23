import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Layers, LogIn, BookOpen, CheckCircle2, Zap, Lock } from 'lucide-react';
import gatewayNodes from '../assets/gateway-nodes.png'; 

export default function Home() {
  const navigate = useNavigate();
  
  // Coordinate tracking state matrices
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [hoverType, setHoverType] = useState("default"); // Handles different cursor styles ("default", "button", "logo")

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleAccessPortal = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/upload');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="h-screen w-screen bg-white text-slate-800 font-sans antialiased overflow-hidden flex flex-col justify-between selection:bg-blue-500/10 relative group">
      
      {/* ==============================
           DYNAMIC REACTION CURSOR RING
         ============================== */}
      <div 
        className="hidden md:block fixed pointer-events-none z-[9999] rounded-full transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          // Dynamically change sizing, borders, and colors based on the current hover state
          width: hoverType === "button" ? '54px' : hoverType === "logo" ? '40px' : '20px',
          height: hoverType === "button" ? '54px' : hoverType === "logo" ? '40px' : '20px',
          backgroundColor: hoverType === "button" ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          border: hoverType === "button" ? '2px dashed #2563eb' : hoverType === "logo" ? '2px solid #10b981' : '2px solid #3b82f6',
          boxShadow: hoverType === "button" ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'none'
        }}
      />
      
      {/* Laser sharp cursor center focal point */}
      <div 
        className={`hidden md:block fixed pointer-events-none z-[9999] w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
          hoverType === "logo" ? "bg-emerald-500 scale-125" : "bg-blue-600"
        }`}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* ==============================
           FIXED HEADER (NAVBAR)
         ============================== */}
      <header className="bg-white border-b border-slate-100 flex-shrink-0 relative z-10">
        <nav className="max-w-7xl mx-auto px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo Brand Interaction Tracker */}
          <div 
            onClick={() => navigate('/')} 
            onMouseEnter={() => setHoverType("logo")}
            onMouseLeave={() => setHoverType("default")}
            className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-sm shadow-blue-600/20">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight">
              PrivacyShield <span className="text-xs font-semibold text-blue-600">.ai</span>
            </span>
          </div>

          {/* Main Navigation (Tracking Hovers) */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/guide')} 
              onMouseEnter={() => setHoverType("button")}
              onMouseLeave={() => setHoverType("default")}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 tracking-wide uppercase hover:text-blue-600 transition-colors py-2 px-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Platform Manual
            </button>

            <button 
              onClick={() => navigate('/dashboard')} 
              onMouseEnter={() => setHoverType("button")}
              onMouseLeave={() => setHoverType("default")}
              className="text-[11px] font-bold text-slate-600 tracking-wide uppercase hover:text-blue-600 transition-colors py-2 px-1"
            >
              Console Dashboard
            </button>
            
            <button 
              onClick={() => navigate('/login')}
              onMouseEnter={() => setHoverType("button")}
              onMouseLeave={() => setHoverType("default")}
              className="group inline-flex items-center gap-2 bg-slate-950 text-white font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-full border border-slate-950 hover:bg-white hover:text-slate-950 hover:border-slate-300 shadow-md transition-all duration-300"
            >
              <LogIn className="w-3 h-3" />
              Secure Portal Login
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 border border-white group-hover:bg-emerald-400 transition-all"></span>
            </button>
          </div>
        </nav>
      </header>

      {/* ==============================
           DYNAMIC HERO CONTAINER
         ============================== */}
      <main className="flex-grow flex items-center max-w-7xl mx-auto px-8 w-full h-full max-h-[calc(100vh-65px)] relative z-10">
        <div className="grid grid-cols-12 items-center gap-12 w-full lg:mb-4">
          
          {/* Text Left Column */}
          <div className="col-span-12 md:col-span-5 space-y-6 lg:space-y-7">
            <div className="inline-block bg-blue-50 text-blue-700 font-bold text-[9px] uppercase tracking-wider px-3.5 py-1 rounded-full border border-blue-100/60 shadow-sm">
              <Zap className="w-2.5 h-2.5 text-blue-500 inline mr-1" />
              Enterprise Compliance Gateway
            </div>
            
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-950 leading-[1.12] tracking-tighter">
              Sanitize Data. <br />
              <span className="text-slate-700">Secure</span>{' '}
              <span className="text-blue-600 font-serif italic font-medium tracking-tight pr-1">Privacy.</span>
            </h1>
            
            <p className="text-xs lg:text-sm text-slate-600 leading-relaxed max-w-sm font-medium">
              Automated corporate document vector serialization. Scrub personal metrics and structural identifier records before cloud processing cascades.
            </p>
            
            <div className="pt-1">
              <button 
                onClick={handleAccessPortal}
                onMouseEnter={() => setHoverType("button")}
                onMouseLeave={() => setHoverType("default")}
                className="group inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase tracking-wider px-6 py-4 rounded-xl shadow-lg shadow-blue-600/10 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
              >
                Access Ingestion Portal
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 max-w-sm">
              <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Zero-Retention Parsing</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Supabase Encryption</span>
              </div>
            </div>
          </div>
          
          {/* Image Right Column */}
          <div className="col-span-12 md:col-span-7 relative max-h-[50vh] md:max-h-[75vh] flex items-center justify-center">
            <div className="absolute inset-4 bg-gradient-to-tr from-blue-500/5 to-emerald-500/5 blur-3xl rounded-full" />
            
            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 max-h-full flex items-center justify-center bg-white relative z-10">
              <img 
                src={gatewayNodes} 
                alt="Advanced Data Node Network" 
                className="w-full max-h-full object-contain transform scale-95" 
              />
            </div>
            
            <div className="absolute bottom-6 left-10 inline-flex items-center gap-2 bg-slate-900/95 text-white font-bold text-[9px] uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-lg z-20 border border-slate-800">
              <Layers className="w-3 h-3 text-emerald-400" />
              System Status: Active
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>

        </div>
      </main>

      <footer className="h-4 flex-shrink-0 w-full" />
    </div>
  );
}