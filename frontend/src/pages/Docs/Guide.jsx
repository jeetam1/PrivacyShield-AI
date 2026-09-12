import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, UploadCloud, Cpu, Lock, CheckCircle2 } from 'lucide-react';

export default function Guide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600/30">
      
      {/* Mini Nav Header */}
      <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer text-white font-bold font-mono">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <span>PrivacyShield System Manual</span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider font-mono"
          >
            <ArrowLeft className="h-4 w-4" /> Back to PDF Masker
          </button>
        </div>
      </header>

      {/* Core Documentation Layout Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        
        {/* Section A: Core Architectural Explanation */}
        <section className="space-y-4">
          <div className="inline-block bg-blue-500/10 text-blue-400 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-blue-500/20 font-mono">
            Zero-Database In-Memory Architecture
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">How PDF Redaction Works</h1>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            PrivacyShield.ai uses deep NLP Named Entity Recognition (spaCy) and strict regular expression filters to detect Personally Identifiable Information (PII) including <strong>Aadhaar numbers, PAN cards, Emails, Phone numbers, Names, and Locations</strong>.
          </p>
        </section>

        {/* Section B: How It Works Steps Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-white">3-Step Redaction Workflow</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 Card */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-xs">
                <UploadCloud className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">1. Direct Ingestion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag and drop your confidential PDF. The file is processed completely in-memory without database storage.
              </p>
            </div>

            {/* Step 2 Card */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-xs">
                <Cpu className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">2. Coordinate Redaction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                PyMuPDF tracks exact bounding-box coordinates for all detected entities across every page and burns irreversible redactions into the PDF stream.
              </p>
            </div>

            {/* Step 3 Card */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-mono font-bold text-xs">
                <Lock className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">3. Instant Download</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Preview the sanitized document live in your browser and download the sanitized copy in one click.
              </p>
            </div>

          </div>
        </section>

        {/* Section C: Cryptographic Assurance */}
        <section className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">True PDF Stream Redaction</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Redacted text is deleted at the binary stream level. Text cannot be recovered by copy-pasting or highlighting under the redaction blocks.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}