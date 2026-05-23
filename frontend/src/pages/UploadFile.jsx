import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, ShieldAlert, FileText, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { scannerService } from '../services/api';

export default function UploadFile() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorMessage('');
    }
  };

  const executeDataShieldScan = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setScanResult(null);
    setErrorMessage('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await scannerService.upload(formData);
      setScanResult(response.data);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred during document token analysis.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-500/10">
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        
        {/* Professional Minimalist Header Group */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold tracking-widest uppercase mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            Secure Ingestion Subsystem
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Secure Data Ingestion Gate
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Automated compliance processing engine for sensitive document structural masking.
          </p>
        </div>

        {/* Workspace Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Ingestion File Control Card */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm shadow-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-mono">Ingestion Source</h3>
            
            <form onSubmit={executeDataShieldScan} className="space-y-4">
              <div className="group border border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl p-8 text-center transition-all cursor-pointer relative bg-slate-50/50">
                <input 
                  type="file" 
                  accept=".txt,.csv" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                <UploadCloud className="mx-auto h-8 w-8 text-slate-400 group-hover:text-blue-600 transition-colors mb-3" />
                <p className="text-xs font-bold text-slate-700">
                  {file ? file.name : "Select or Drop Document"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">Plain Text or CSV format</p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-rose-600 font-mono leading-relaxed">{errorMessage}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={!file || uploading} 
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-all focus:outline-none bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-30 disabled:pointer-events-none shadow-sm shadow-slate-950/10"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    Deploy Purge Pipeline
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Block: Output & Inspection Terminal Panels */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {scanResult ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm shadow-slate-100"
                >
                  {/* Results Top Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-mono">{scanResult.filename}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">Token remediation sequence completed</p>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border font-mono ${scanResult.risk_level === 'HIGH' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {scanResult.risk_level} Risk Level ({scanResult.risk_score}/100)
                      </span>
                    </div>
                  </div>

                  {/* Clean Visual Columns View Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Original Source Payload</label>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 font-mono text-[11px] leading-relaxed h-80 overflow-y-auto whitespace-pre-wrap text-slate-600">
                        {scanResult.original_text}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        <label className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block font-mono">Sanitized Output Matrix</label>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-[11px] leading-relaxed h-80 overflow-y-auto whitespace-pre-wrap text-emerald-400 selection:bg-emerald-500/10">
                        {scanResult.masked_text}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center border border-slate-200 bg-white rounded-2xl text-center p-8 shadow-sm shadow-slate-100">
                  <div className="p-4 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide font-mono">Awaiting Data Ingestion Session</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs font-medium">
                    Upload a valid plaintext report asset from the control unit to trigger deep AI masking layers.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}