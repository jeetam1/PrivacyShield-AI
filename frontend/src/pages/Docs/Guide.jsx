import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, ArrowLeft, UploadCloud, Cpu, Lock, CheckCircle2, 
  FileText, Check, Shield, HelpCircle, Layers, Sparkles 
} from 'lucide-react';

export default function Guide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                PrivacyShield <span className="text-blue-600 font-extrabold text-xs">AI</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Official User Manual & Documentation
              </span>
            </div>
          </Link>

          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Redactor
          </button>
        </div>
      </header>

      {/* Main Documentation Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Hero Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <Shield className="h-3.5 w-3.5" />
            <span>Zero-Database In-Memory Privacy Architecture</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            What is PrivacyShield & How to Use It
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            PrivacyShield is a fast, enterprise-grade utility that automatically removes Personally Identifiable Information (PII) like <strong>Aadhaar numbers, PAN cards, SSNs, Credit Cards, Emails, Phone numbers, Full Names, and Locations</strong> from your documents and replaces them with clean <code className="bg-slate-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-semibold">XXXX</code> masks.
          </p>
        </section>

        {/* 3 Simple Steps */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              How to Use PrivacyShield in 3 Easy Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Step 1: Upload Document</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drag and drop your confidential <strong>PDF</strong> (<code className="bg-slate-100 px-1 py-0.5 rounded">.pdf</code>) or plain text (<code className="bg-slate-100 px-1 py-0.5 rounded">.txt</code>) file. You can also paste text directly into the Text Sanitizer tab or click <em>"Load Sample Test File"</em>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Step 2: Choose Entities to Mask</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select which items you want hidden using the top checkboxes: <strong>Names, Emails, Phone Numbers, Aadhaar, PAN, SSN, Credit Cards, or Locations</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Step 3: Redact & Download</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click <strong>Redact Document</strong>. Review the live document preview and entity breakdown table, then click <strong>Download Redacted PDF</strong> or copy the sanitized text.
              </p>
            </div>

          </div>
        </section>

        {/* Supported Data Types */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Supported Sensitive Data Identifiers
            </h2>
            <p className="text-xs text-slate-500">
              The engine scans and masks these 8 core data categories:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">Indian Aadhaar</span>
              <span className="text-[11px] text-slate-500 block">12-digit UIDAI number</span>
              <span className="text-[10px] font-mono text-blue-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 block">
                XXXX XXXX 2109
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">Indian PAN Card</span>
              <span className="text-[11px] text-slate-500 block">10-digit tax ID</span>
              <span className="text-[10px] font-mono text-blue-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 block">
                XXXXX1234X
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">US SSN</span>
              <span className="text-[11px] text-slate-500 block">Social Security Number</span>
              <span className="text-[10px] font-mono text-blue-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 block">
                XXX-XX-6789
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">Credit & Debit Cards</span>
              <span className="text-[11px] text-slate-500 block">16-digit payment cards</span>
              <span className="text-[10px] font-mono text-blue-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 block">
                XXXX-XXXX-XXXX-5678
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">Email Addresses</span>
              <span className="text-[11px] text-slate-500 block">Personal & work emails</span>
              <span className="text-[10px] font-mono text-blue-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 block">
                xxxx@xxxx.com
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">Phone Numbers</span>
              <span className="text-[11px] text-slate-500 block">Mobile & landlines</span>
              <span className="text-[10px] font-mono text-blue-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 block">
                +91 XXXXXXXX10
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">Full Names</span>
              <span className="text-[11px] text-slate-500 block">People & employee names</span>
              <span className="text-[10px] font-mono text-blue-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 block">
                XXXX XXXX XXXX
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">Locations</span>
              <span className="text-[11px] text-slate-500 block">Cities, states, addresses</span>
              <span className="text-[10px] font-mono text-blue-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 block">
                [LOCATION] / XXXX
              </span>
            </div>
          </div>
        </section>

        {/* Security & Privacy Guarantee */}
        <section className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-emerald-600 shadow-xs shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1 text-emerald-950">
            <h4 className="text-sm font-bold">100% In-Memory Privacy & Irreversible Redaction</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your uploaded documents are processed entirely in server RAM and are never stored on hard disks or in databases. Redacted text is replaced at the stream level so that masked text cannot be uncovered by copy-pasting or highlighting.
            </p>
          </div>
        </section>

        {/* Back to Home CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Go to Redactor Application →
          </button>
        </div>

      </main>
    </div>
  );
}