import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scannerService } from '../services/api';

const UploadFile = () => {
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
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred during document processing.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 text-slate-100 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
          Secure Ingestion Gate
        </h1>
        <p className="text-slate-400 mb-8">
          Upload document assets to automatically scrub out structural PII parameters before serialization routines.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Parameter Panel */}
          <div className="p-6 h-fit rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur-xl shadow-2xl">
            <form onSubmit={executeDataShieldScan} className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-teal-500/50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".txt,.csv" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                <p className="text-sm text-slate-300 font-medium">
                  {file ? file.name : "Select Document Block"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Accepts raw text or CSV strings</p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/20 text-red-300 rounded-lg text-xs border border-red-500/30">
                  {errorMessage}
                </div>
              )}

              <button 
                type="submit" 
                disabled={!file || uploading} 
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 tracking-wide transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                {uploading ? "Sanitizing Core Components..." : "Deploy Threat Purge Pipeline"}
              </button>
            </form>
          </div>

          {/* Verification Inspection Pipeline View */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {scanResult ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-2xl space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">{scanResult.filename}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Threat Level Assessment Completed Successfully</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase ${scanResult.risk_level === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : scanResult.risk_level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}>
                        {scanResult.risk_level} Risk ({scanResult.risk_score}/100)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Original Data Matrix</label>
                      <div className="p-4 rounded-xl bg-slate-950/60 font-mono text-xs h-64 overflow-y-auto whitespace-pre-wrap text-slate-400 border border-white/5">
                        {scanResult.original_text}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Scrubbed Data Layout</label>
                      <div className="p-4 rounded-xl bg-slate-950/80 font-mono text-xs h-64 overflow-y-auto whitespace-pre-wrap text-emerald-400 border border-emerald-500/10">
                        {scanResult.masked_text}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center p-12 border border-white/5 bg-white/[0.02] rounded-2xl text-slate-500 text-sm font-medium">
                  Awaiting analytical transaction execution...
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;