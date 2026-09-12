import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, UploadCloud, ShieldCheck, Download, RefreshCw,
  CheckCircle2, ArrowRight, Eye, Layers, Settings2, Sliders, AlertTriangle,
  Copy, Check, FileCheck, ExternalLink, Sparkles, X, ChevronRight, Lock,
  HelpCircle, Info, Shield, CheckCheck, FileType, CheckSquare
} from 'lucide-react';
import { scannerService } from '../services/api';

export default function PdfMasker() {
  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' | 'text'

  // Modals
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showGuideBanner, setShowGuideBanner] = useState(true);

  // PDF State
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfResult, setPdfResult] = useState(null);
  const [pdfError, setPdfError] = useState('');
  const [pdfPreviewTab, setPdfPreviewTab] = useState('preview'); // 'preview' | 'table'

  // Customization Options
  const [maskNames, setMaskNames] = useState(true);
  const [maskEmails, setMaskEmails] = useState(true);
  const [maskPhones, setMaskPhones] = useState(true);
  const [maskIds, setMaskIds] = useState(true);
  const [maskLocations, setMaskLocations] = useState(true);
  const [maskOrgs, setMaskOrgs] = useState(false);
  const [redactionStyle, setRedactionStyle] = useState('xxxx'); // 'xxxx' | 'label' | 'blackout' | 'whiteout'

  // Text State
  const [rawText, setRawText] = useState('');
  const [sanitizingText, setSanitizingText] = useState(false);
  const [textResult, setTextResult] = useState(null);
  const [textError, setTextError] = useState('');
  const [copied, setCopied] = useState(false);
  const [textPreviewTab, setTextPreviewTab] = useState('text'); // 'text' | 'table'

  // File Input Refs
  const fileInputRef = useRef(null);
  const textFileInputRef = useRef(null);

  const SAMPLE_TEST_TEXT = `CONFIDENTIAL EMPLOYEE VERIFICATION & AUDIT REPORT

Date: 12th September 2026
Prepared By: Samantha Reed
Organization: Apex Global Technologies Ltd.
Location: Mumbai, Maharashtra, India

EMPLOYEE DETAILS:
Full Name: Rajesh Kumar Sharma
Email: rajesh.sharma@apextechnologies.com
Personal Email: rajesh_sharma99@gmail.com
Phone Number: +91 9876543210
Alternate Phone: 9812345678

IDENTIFICATION DOCUMENTS:
Aadhaar Card: 4321 8765 2109
PAN Card: ABCDE1234F
US Social Security Number (SSN): 123-45-6789

FINANCIAL INFORMATION:
Corporate Credit Card: 4532-7589-1234-5678
Visa Debit Card: 5123 4567 8901 2345

CLIENT REFERENCE:
Point of Contact: Dr. Michael Vance
Company: Vertex Innovations LLC
Office Location: San Francisco, California
Contact Email: m.vance@vertexinnovations.org
Direct Line: +1 415-555-2671

ADDITIONAL NOTES:
Mr. Rajesh Sharma has submitted all KYC documentation for cross-border payroll processing.
Please ensure all sensitive identity records are redacted before forwarding this document.`;

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const isPdf = droppedFile.type === 'application/pdf' || droppedFile.name.toLowerCase().endsWith('.pdf');
      const isTxt = droppedFile.type === 'text/plain' || droppedFile.name.toLowerCase().endsWith('.txt');

      if (isPdf || isTxt) {
        setPdfFile(droppedFile);
        setPdfError('');
        setPdfResult(null);
      } else {
        setPdfError('Please upload a valid document (.pdf or .txt)');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
      const isTxt = selectedFile.type === 'text/plain' || selectedFile.name.toLowerCase().endsWith('.txt');

      if (isPdf || isTxt) {
        setPdfFile(selectedFile);
        setPdfError('');
        setPdfResult(null);
      } else {
        setPdfError('Please upload a valid document (.pdf or .txt)');
      }
    }
  };

  // Dedicated Text File Upload Handler
  const handleTextFileImport = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setRawText(content);
        setTextResult(null);
        setTextError('');
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_TEST_TEXT);
    setTextResult(null);
    setTextError('');
  };

  // PDF Submission Handler
  const handleMaskPdf = async (e) => {
    if (e) e.preventDefault();
    if (!pdfFile) return;

    setUploadingPdf(true);
    setPdfError('');
    setPdfResult(null);

    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('mask_names', maskNames);
    formData.append('mask_emails', maskEmails);
    formData.append('mask_phones', maskPhones);
    formData.append('mask_ids', maskIds);
    formData.append('mask_locations', maskLocations);
    formData.append('mask_orgs', maskOrgs);
    formData.append('redaction_style', redactionStyle);

    try {
      const response = await scannerService.maskPdf(formData);
      setPdfResult(response.data);
    } catch (err) {
      setPdfError(err.response?.data?.error || err.message || 'Failed to process document.');
    } finally {
      setUploadingPdf(false);
    }
  };

  // Text Submission Handler
  const handleMaskText = async (e) => {
    if (e) e.preventDefault();
    if (!rawText.trim()) return;

    setSanitizingText(true);
    setTextError('');
    setTextResult(null);

    try {
      const response = await scannerService.maskText({
        text: rawText,
        mask_names: maskNames,
        mask_emails: maskEmails,
        mask_phones: maskPhones,
        mask_ids: maskIds,
        mask_locations: maskLocations,
        mask_orgs: maskOrgs,
        mask_style: 'xxxx',
      });
      setTextResult(response.data);
    } catch (err) {
      setTextError(err.response?.data?.error || 'Failed to sanitize text.');
    } finally {
      setSanitizingText(false);
    }
  };

  // Download Masked PDF
  const handleDownloadPdf = () => {
    if (!pdfResult?.redacted_pdf_data) return;
    const link = document.createElement('a');
    link.href = pdfResult.redacted_pdf_data;
    link.download = pdfResult.output_filename || 'redacted_document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open in New Tab
  const handleOpenInNewTab = () => {
    if (!pdfResult?.redacted_pdf_data) return;
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${pdfResult.redacted_pdf_data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    }
  };

  // Copy Sanitized Text
  const handleCopyText = () => {
    if (!textResult?.masked_text) return;
    navigator.clipboard.writeText(textResult.masked_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Sanitized Text
  const handleDownloadMaskedText = () => {
    if (!textResult?.masked_text) return;
    const blob = new Blob([textResult.masked_text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'redacted_output.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Total Entities Count Helper
  const getTotalDetections = (counts) => {
    if (!counts) return 0;
    return Object.values(counts).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Brand & Left Nav Links */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                  PrivacyShield
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Document Redaction
                </span>
              </div>
            </div>

            {/* Nav Menu Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setShowHowItWorksModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
                <span>How to Use</span>
              </button>
              <button
                onClick={() => setShowAboutModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Info className="h-3.5 w-3.5 text-slate-500" />
                <span>About</span>
              </button>
              <button
                onClick={() => setShowHowItWorksModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                <span>Privacy & Security</span>
              </button>
            </nav>
          </div>

          {/* Right: Mode Switcher Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveTab('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'pdf'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                Document Redactor
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'text'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Sliders className="h-3.5 w-3.5 text-blue-600" />
                Text Sanitizer
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Simple 3-Step Guide Banner */}
        {showGuideBanner && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div className="flex items-start md:items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    How it works in 3 easy steps:
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">1</span>
                      Upload PDF or text file
                    </span>
                    <span className="text-slate-300">→</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">2</span>
                      Choose sensitive fields to mask
                    </span>
                    <span className="text-slate-300">→</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">3</span>
                      Download clean redacted file
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setShowHowItWorksModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2"
                >
                  View full guide
                </button>
                <button
                  onClick={() => setShowGuideBanner(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                  title="Dismiss guide"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Configuration Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Settings2 className="h-4 w-4 text-slate-500" />
              <span>Entities to Redact:</span>
            </div>

            {/* Checkbox Toggles */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { label: 'Names', val: maskNames, set: setMaskNames },
                { label: 'Emails', val: maskEmails, set: setMaskEmails },
                { label: 'Phone Numbers', val: maskPhones, set: setMaskPhones },
                { label: 'IDs (Aadhaar / PAN / SSN / Cards)', val: maskIds, set: setMaskIds },
                { label: 'Locations', val: maskLocations, set: setMaskLocations },
                { label: 'Organizations', val: maskOrgs, set: setMaskOrgs },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => opt.set(!opt.val)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${opt.val
                      ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${opt.val ? 'bg-blue-600 text-white font-bold' : 'border border-slate-300'
                    }`}>
                    {opt.val && '✓'}
                  </div>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Redaction Style Selector */}
            {activeTab === 'pdf' && (
              <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Style:</span>
                <select
                  value={redactionStyle}
                  onChange={(e) => setRedactionStyle(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="xxxx">Clean Mask (XXXX) [Default]</option>
                  <option value="label">Masked Label [MASKED]</option>
                  <option value="blackout">Solid Blackout Tape</option>
                  <option value="whiteout">Clean Whiteout</option>
                </select>
              </div>
            )}

          </div>
        </div>

        {/* TAB 1: DOCUMENT REDACTOR WORKSPACE */}
        {activeTab === 'pdf' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column: Upload Dropzone & Action Button */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <UploadCloud className="h-4 w-4 text-blue-600" />
                    Upload Document
                  </h3>
                  {pdfFile && (
                    <button
                      onClick={() => {
                        setPdfFile(null);
                        setPdfResult(null);
                        setPdfError('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" /> Remove
                    </button>
                  )}
                </div>

                {/* Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative overflow-hidden ${isDragging
                      ? 'border-blue-500 bg-blue-50/60'
                      : pdfFile
                        ? 'border-blue-300 bg-blue-50/20'
                        : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf,.txt,text/plain"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="space-y-3">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${pdfFile ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                      {pdfFile ? <FileCheck className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                    </div>

                    {pdfFile ? (
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-100 text-blue-800 mb-1">
                          {pdfFile.name.toLowerCase().endsWith('.txt') ? 'Text File (.txt)' : 'PDF Document (.pdf)'}
                        </div>
                        <p className="text-sm font-semibold text-slate-900 truncate max-w-xs mx-auto">
                          {pdfFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {pdfFile.size / 1024 < 1024
                            ? `${(pdfFile.size / 1024).toFixed(1)} KB`
                            : `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB`} • Ready to redact
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Click to browse or drag & drop document
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Supports PDF (.pdf) and plain text (.txt)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error message */}
                {pdfError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-700 text-xs">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{pdfError}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  onClick={handleMaskPdf}
                  disabled={!pdfFile || uploadingPdf}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all focus:outline-hidden bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:pointer-events-none shadow-xs"
                >
                  {uploadingPdf ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Redacting document...</span>
                    </>
                  ) : (
                    <>
                      <span>Redact Document</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    In-Memory Stateless Processing
                  </span>
                  <span>Zero Data Storage</span>
                </div>

              </div>
            </div>

            {/* Right Column: Results / Preview */}
            <div className="lg:col-span-7">
              {pdfResult ? (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">

                  {/* Results Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {pdfResult.output_filename}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {pdfResult.total_pages} Page{pdfResult.total_pages > 1 ? 's' : ''} • {getTotalDetections(pdfResult.detected_counts)} entities redacted
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Redaction Complete
                      </span>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[11px] font-medium text-slate-500 block">Emails</span>
                      <span className="text-lg font-bold text-slate-800">{pdfResult.detected_counts?.emails || 0}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[11px] font-medium text-slate-500 block">Phone Numbers</span>
                      <span className="text-lg font-bold text-slate-800">{pdfResult.detected_counts?.phones || 0}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[11px] font-medium text-slate-500 block">IDs & Cards</span>
                      <span className="text-lg font-bold text-slate-800">
                        {(pdfResult.detected_counts?.aadhaar || 0) + (pdfResult.detected_counts?.pan || 0) + (pdfResult.detected_counts?.ssn || 0) + (pdfResult.detected_counts?.credit_card || 0)}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[11px] font-medium text-slate-500 block">Names & Places</span>
                      <span className="text-lg font-bold text-slate-800">
                        {(pdfResult.detected_counts?.names || 0) + (pdfResult.detected_counts?.locations || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleDownloadPdf}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Download Redacted PDF
                    </button>
                    <button
                      onClick={handleOpenInNewTab}
                      className="flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all"
                    >
                      <ExternalLink className="h-4 w-4 text-slate-500" />
                      Open Fullscreen
                    </button>
                  </div>

                  {/* Sub-Tabs: Live Preview vs Table */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <button
                        onClick={() => setPdfPreviewTab('preview')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${pdfPreviewTab === 'preview'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        Document Preview
                      </button>
                      <button
                        onClick={() => setPdfPreviewTab('table')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${pdfPreviewTab === 'table'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        Redacted Items ({pdfResult.detected_items?.length || 0})
                      </button>
                    </div>

                    {pdfPreviewTab === 'preview' ? (
                      <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 h-[520px]">
                        <object
                          data={pdfResult.redacted_pdf_data}
                          type="application/pdf"
                          className="w-full h-full"
                        >
                          <div className="p-8 text-center space-y-4">
                            <p className="text-sm text-slate-600">PDF preview is ready.</p>
                            <button
                              onClick={handleDownloadPdf}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                            >
                              <Download className="h-4 w-4" /> Download PDF to view
                            </button>
                          </div>
                        </object>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden max-h-[520px] overflow-y-auto">
                        {pdfResult.detected_items && pdfResult.detected_items.length > 0 ? (
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
                              <tr>
                                <th className="py-2.5 px-4">Entity Type</th>
                                <th className="py-2.5 px-4">Original Token</th>
                                <th className="py-2.5 px-4">Page</th>
                                <th className="py-2.5 px-4 text-right">Occurrences</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                              {pdfResult.detected_items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="py-2.5 px-4 font-sans">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium uppercase">
                                      {item.category}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 font-semibold text-slate-900">{item.token}</td>
                                  <td className="py-2.5 px-4 text-slate-500 font-sans">Page {item.page}</td>
                                  <td className="py-2.5 px-4 text-right text-slate-700 font-semibold">{item.occurrences}x</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="py-12 text-center text-xs text-slate-500 font-sans">
                            No PII items found matching current filters.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="h-[480px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-white rounded-xl text-center p-8">
                  <div className="p-3.5 rounded-full bg-slate-100 text-slate-400 mb-3">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    No Document Processed Yet
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                    Upload a PDF or plain text document on the left and click Redact Document to view the redacted preview and download the output.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: TEXT SANITIZER WORKSPACE */}
        {activeTab === 'text' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left: Input Text */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Source Text Input
                </h3>

                {/* Actions: Upload .txt & Load Sample */}
                <div className="flex items-center gap-2">
                  <input
                    ref={textFileInputRef}
                    type="file"
                    accept=".txt,text/plain"
                    onChange={handleTextFileImport}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => textFileInputRef.current?.click()}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <UploadCloud className="h-3.5 w-3.5 text-slate-500" /> Upload .txt
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="text-xs px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Load Sample test.txt
                  </button>
                  {rawText && (
                    <button
                      onClick={() => {
                        setRawText('');
                        setTextResult(null);
                        setTextError('');
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 ml-1"
                    >
                      <X className="h-3.5 w-3.5" /> Clear
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste confidential text or upload a .txt file (e.g. John Doe, Email: john@doe.com, Phone: +91 9876543210, Aadhaar: 1234 5678 9012, PAN: ABCDE1234F)..."
                className="w-full h-80 bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed resize-none"
              />

              {textError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                  {textError}
                </div>
              )}

              <button
                onClick={handleMaskText}
                disabled={!rawText.trim() || sanitizingText}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:pointer-events-none shadow-xs transition-colors"
              >
                {sanitizingText ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Sanitizing text...</span>
                  </>
                ) : (
                  <>
                    <span>Sanitize Text</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Right: Sanitized Text Output */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    Sanitized Output
                  </h3>
                </div>

                {textResult && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                      <button
                        onClick={() => setTextPreviewTab('text')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${textPreviewTab === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        Sanitized Text
                      </button>
                      <button
                        onClick={() => setTextPreviewTab('table')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${textPreviewTab === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        Entities Table ({textResult.detected_items?.length || 0})
                      </button>
                    </div>

                    <button
                      onClick={handleCopyText}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleDownloadMaskedText}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                      title="Download Sanitized Text (.txt)"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" />
                      <span>.txt</span>
                    </button>
                  </div>
                )}
              </div>

              {textResult ? (
                <div className="space-y-4">
                  {textPreviewTab === 'text' ? (
                    <div className="w-full h-80 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-900 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                      {textResult.masked_text}
                    </div>
                  ) : (
                    <div className="w-full h-80 bg-white border border-slate-200 rounded-xl overflow-y-auto text-xs">
                      {textResult.detected_items && textResult.detected_items.length > 0 ? (
                        <table className="w-full text-left">
                          <thead className="sticky top-0 bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200 uppercase">
                            <tr>
                              <th className="py-2 px-3">Entity Type</th>
                              <th className="py-2 px-3">Detected Token</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                            {textResult.detected_items.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="py-2 px-3 font-sans">
                                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-medium uppercase">
                                    {item.category}
                                  </span>
                                </td>
                                <td className="py-2 px-3 font-semibold">{item.token}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="py-12 text-center text-xs text-slate-500">
                          No sensitive entities detected matching selected filters.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>
                      Total Redacted Items: <strong className="text-slate-900">{getTotalDetections(textResult.detected_counts)}</strong>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Sanitized
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl text-center p-6">
                  <div className="p-3 rounded-full bg-slate-100 text-slate-400 mb-2">
                    <Sliders className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Awaiting Text Input
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Paste text or upload a file on the left and click Sanitize Text to see the redacted output.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 3. "HOW TO USE" MODAL DIALOG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showHowItWorksModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">How to Use PrivacyShield</h3>
                    <p className="text-xs text-slate-500">Simple guide to redacting documents in seconds</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHowItWorksModal(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">

                {/* 3 Steps */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Step 1: Upload Document or Enter Text</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        In the <strong>Document Redactor</strong> tab, drop your PDF (<code className="bg-slate-200/70 px-1 py-0.5 rounded text-[11px]">.pdf</code>) or plain text file (<code className="bg-slate-200/70 px-1 py-0.5 rounded text-[11px]">.txt</code>). Or switch to the <strong>Text Sanitizer</strong> tab to type/paste text directly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Step 2: Select Entities to Mask</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Choose which sensitive categories you want masked using the checkboxes: <strong>Names, Emails, Phone Numbers, Aadhaar, PAN, SSN, Credit Cards, or Locations</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Step 3: Redact & Download</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Click <strong>Redact Document</strong> or <strong>Sanitize Text</strong>. Review the live preview or entity table, then click <strong>Download Redacted PDF</strong> or <strong>Copy Output</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Privacy Guarantee Note */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-800">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">100% In-Memory Privacy Guarantee:</strong>
                    Your uploaded files and text are processed in volatile server memory and never stored on disk or in databases. Redactions are irreversible.
                  </div>
                </div>

              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowHowItWorksModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Got It, Start Redacting
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. "ABOUT" MODAL DIALOG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAboutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">About PrivacyShield</h3>
                    <p className="text-xs text-slate-500">Secure Document & PII Privacy Suite</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-600 leading-relaxed">

                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">What is this website?</h4>
                  <p>
                    <strong>PrivacyShield</strong> is a private, lightweight document utility designed to protect sensitive personal records before sharing files across teams, customers, or public platforms. It scans PDF and text documents for Personally Identifiable Information (PII) and replaces sensitive values with clean, non-reversible <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">XXXX</code> masks.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">Supported Data Identifiers:</h4>
                  <div className="grid grid-cols-2 gap-2 font-medium">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Indian Aadhaar (12 digits)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Indian PAN Cards (10 alphanumeric)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>US Social Security Numbers (SSN)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Credit & Debit Cards (16 digits)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Email Addresses</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Phone & Mobile Numbers</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Full Names (People)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Geographic Locations & Cities</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">When should you use PrivacyShield?</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    <li>Before emailing job applications or resumes containing personal IDs</li>
                    <li>Before sharing invoices, audit reports, KYC documents, or contracts</li>
                    <li>For redacting customer records to meet GDPR, HIPAA, and data protection standards</li>
                  </ul>
                </div>

              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. "SUPPORTED DATA TYPES" MODAL DIALOG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showSupportedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Supported Sensitive Data</h3>
                    <p className="text-xs text-slate-500">All 8 PII categories detected & masked automatically</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSupportedModal(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-600 leading-relaxed">
                
                <p className="text-slate-700">
                  PrivacyShield uses a combination of precise regular expressions and Named Entity Recognition (NER) to detect and mask these confidential items:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Indian Aadhaar Cards</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-1.5">12-digit UIDAI identity numbers.</p>
                    <span className="font-mono text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-800">
                      e.g. 4321 8765 2109 → XXXX XXXX 2109
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Indian PAN Cards</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-1.5">10-digit alphanumeric tax IDs.</p>
                    <span className="font-mono text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-800">
                      e.g. ABCDE1234F → XXXXX1234X
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>US Social Security Numbers</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-1.5">9-digit US SSN identifier.</p>
                    <span className="font-mono text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-800">
                      e.g. 123-45-6789 → XXX-XX-6789
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Credit & Debit Cards</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-1.5">16-digit Visa, Mastercard, Amex.</p>
                    <span className="font-mono text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-800">
                      e.g. 4532-7589-1234-5678 → XXXX-XXXX-XXXX-5678
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Email Addresses</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-1.5">Personal & corporate email domains.</p>
                    <span className="font-mono text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-800">
                      e.g. user@gmail.com → xxxx@xxxx.com
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Phone & Mobile Numbers</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-1.5">Indian (+91) & international phone numbers.</p>
                    <span className="font-mono text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-800">
                      e.g. +91 9876543210 → +91 XXXXXXXX10
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Full Names (People)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-1.5">Names of individuals via NLP model.</p>
                    <span className="font-mono text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-800">
                      e.g. Rajesh Kumar Sharma → XXXX XXXX XXXX
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Geographic Locations & Cities</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-1.5">Cities, states, regions, countries.</p>
                    <span className="font-mono text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-800">
                      e.g. Mumbai, California → [LOCATION] / XXXX
                    </span>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowSupportedModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
