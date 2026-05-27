import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Lock, EyeOff } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-500/10 overflow-x-hidden">
      {/* Top Professional Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
          <Shield className="h-6 w-6 text-blue-600 fill-blue-600/10" />
          PrivacyShield<span className="text-blue-600 font-medium text-sm">.ai</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Primary Hero Container Workspace */}
      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hand Marketing Value Pitch Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide">
            Apply &gt; Memorize
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Apply & Track <br />
            your <span className="text-blue-600 italic font-serif font-normal">Learning</span>
          </h1>
          
          <p className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
            Learn a concept &rarr; apply it in a task &rarr; master it with real-time enterprise PII vector suppression feedback loops.
          </p>

          <div className="pt-4">
            <button
              onClick={() => navigate('/login')}
              className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              Start Building
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Hand Visual Component Collage Grid Frame */}
        <div className="lg:col-span-7 relative flex justify-center lg:justify-end">
          {/* Main Decorative Floating Box Card Mockup */}
          <div className="relative border border-slate-200/80 bg-slate-50/50 p-6 rounded-3xl shadow-2xl max-w-xl grid grid-cols-2 gap-4 backdrop-blur-sm z-10 transform hover:rotate-1 transition-transform duration-500">
            
            {/* Cell 1: Multi-person collaboration item */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-white aspect-[4/3] bg-slate-200 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
              <div className="absolute bottom-3 left-3 z-20 text-white font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-blue-400" /> Token Inspection
              </div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80" alt="Team" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Cell 2: Hardware / Laboratory context profile */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-white aspect-[4/3] bg-slate-200 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
              <div className="absolute bottom-3 left-3 z-20 text-white font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-emerald-400" /> Core Scrubbing
              </div>
              <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80" alt="Lab" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Cell 3: Live workshop instructions tracking layer */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-white aspect-[4/3] bg-slate-200 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
              <div className="absolute bottom-3 left-3 z-20 text-white font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                <EyeOff className="h-3 w-3 text-purple-400" /> Vector Masking
              </div>
              <img src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=400&q=80" alt="Learning" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Cell 4: Operational data terminal monitors */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-white aspect-[4/3] bg-slate-200 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
              <div className="absolute bottom-3 left-3 z-20 text-white font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Operations Gate
              </div>
              <img src="https://images.unsplash.com/photo-1542744094-2ab25be78b90?auto=format&fit=crop&w=400&q=80" alt="Analytics" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>

          </div>

          {/* Underlay Soft Drop Blur Shadow Glow */}
          <div className="absolute top-12 right-12 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

      </main>
    </div>
  );
}