import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, ShieldCheck, UploadCloud, Cpu, Database } from 'lucide-react';

export default function Guide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-500/10">
      
      {/* Mini Nav Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer text-slate-900 font-bold">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>PrivacyShield System Manual</span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>
      </header>

      {/* Core Documentation Layout Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        
        {/* Section A: Core Architectural Explanation */}
        <section className="space-y-4">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">System Scope & Core Architecture</h1>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            PrivacyShield.ai acts as an inline **Enterprise Compliance Gateway** positioned upstream from cloud infrastructure boundaries. The platform automatically intercepts raw text or structured character stream arrays (`.txt`, `.csv`) and parses them through an advanced regular expression and tokenization pipeline designed to isolate and redact highly regulated **Personally Identifiable Information (PII)** parameters.
          </p>
        </section>

        {/* Section B: How It Works Steps Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-950">How To Operate the Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-mono font-bold text-xs">
                <UploadCloud className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">1. Ingestion</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Log into your clearance profile dashboard and access the deployment portal. Drop text blocks or load data streams natively.
              </p>
            </div>

            {/* Step 2 Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-mono font-bold text-xs">
                <Cpu className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">2. Suppression</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                The parsing matrix scrubs structural fields—redacting variables like emails and social values while executing threat risk density score evaluations.
              </p>
            </div>

            {/* Step 3 Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-mono font-bold text-xs">
                <Database className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">3. Retention Cloud</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Sanitized logs append immediately across to external Supabase relational clusters, keeping historical parameters retrievable.
              </p>
            </div>

          </div>
        </section>

        {/* Section C: Cryptographic Assurance */}
        <section className="p-6 bg-slate-950 text-slate-200 rounded-2xl border border-slate-900 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">Zero Trust Compliance Guarantee</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl font-medium">
              Raw structural string loads are ephemeral. They exist entirely inside working system transaction memory layers during scrub passes and are never committed to permanent storage arrays.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}