import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, UploadCloud, Cpu, Layers, Database, Lock, EyeOff } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Cpu className="h-5 w-5 text-blue-600" />,
      title: "Hybrid AI Engine",
      description: "Combines high-performance Regex matchers with cutting-edge spaCy Natural Language Processing (NLP) models to identify names, locations, and structural organization tokens."
    },
    {
      icon: <Layers className="h-5 w-5 text-indigo-600" />,
      title: "Contextual Masking",
      description: "Intelligent data suppression engine that selectively replaces target PII data points with explicit placeholders like [NAME_MASKED] while safeguarding structural template layouts."
    },
    {
      icon: <Database className="h-5 w-5 text-emerald-600" />,
      title: "Telemetry Tracking",
      description: "Logs compliance data arrays securely into relational database nodes, generating instant threat indices and systemic risk analytics metrics across operational workloads."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Authenticate Profile",
      description: "Access the platform through our secure JWT authorization gateway to initialize your unprivileged operator command terminal node session."
    },
    {
      num: "02",
      title: "Ingest Document Asset",
      description: "Drop plain text reports or spreadsheet data logs directly into the Data Ingestion Gate. The pipeline reads the binary string streams dynamically."
    },
    {
      num: "03",
      title: "Review & Audit Metrics",
      description: "Examine the high-visibility comparison dashboard side-by-side. Track structural threat trajectories, system risk limits, and global compliance scores instantly."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-500/10 overflow-x-hidden">
      
      {/* Background Decorative Tech Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Professional Header Bar */}
      <header className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between border-b border-slate-100 relative z-10 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 cursor-pointer" onClick={() => navigate('/')}>
          <Shield className="h-6 w-6 text-blue-600 fill-blue-600/10" />
          PrivacyShield<span className="text-blue-600 font-medium text-sm">.ai</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
          >
            Console Dashboard
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-slate-950/10"
          >
            Secure Portal Login
          </button>
        </div>
      </header>

      {/* Section 1: Hero Pitch Workspace */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase font-mono">
            Enterprise Compliance Gateway
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
            Sanitize Data. <br />
            Secure <span className="text-blue-600 italic font-serif font-normal">Privacy.</span>
          </h1>
          <p className="text-base text-slate-500 font-medium max-w-md leading-relaxed">
            Automated corporate document vector serialization. Scrub personal metrics and structural identifier records before cloud processing.
          </p>
          <div className="pt-4 flex items-center gap-4">
            <button
  onClick={() => {
    // Check if an active security token exists in local storage matrices
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/upload'); // Authorized: Let them drop right into the workspace
    } else {
      navigate('/login');  // Unauthorized: Send them to your crisp centered login page first
    }
  }}
  className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
>
  Access Ingestion Portal
  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
</button>
          </div>
        </div>

        {/* Right Collage Graphic Framework */}
        <div className="lg:col-span-7 relative flex justify-center lg:justify-end">
          <div className="relative border border-slate-200/80 bg-slate-50/50 p-6 rounded-3xl shadow-2xl max-w-xl grid grid-cols-2 gap-4 backdrop-blur-sm z-10">
            <div className="rounded-2xl overflow-hidden shadow-md border border-white aspect-[4/3] relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
              <div className="absolute bottom-3 left-3 z-20 text-white font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5"><Lock className="h-3 w-3 text-blue-400" /> Dynamic Protection</div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80" alt="Team" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md border border-white aspect-[4/3] relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
              <div className="absolute bottom-3 left-3 z-20 text-white font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5"><EyeOff className="h-3 w-3 text-emerald-400" /> Vector Suppression</div>
              <img src="https://images.unsplash.com/photo-1542744094-2ab25be78b90?auto=format&fit=crop&w=400&q=80" alt="Analytics" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute top-12 right-12 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* Section 2: What is it? (Brief Explanation) */}
      <section className="bg-slate-50 border-y border-slate-200/60 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">System Architecture</h2>
            <p className="text-3xl font-black tracking-tight text-slate-900">What is PrivacyShield AI?</p>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              PrivacyShield AI is an intelligent data intermediary platform designed to neutralize compliance risks. It parses raw document text blocks, highlights privacy vulnerability vectors, and overwrites plaintext elements automatically before data leaves your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm shadow-slate-100 space-y-4">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl inline-block">
                  {feat.icon}
                </div>
                <h4 className="text-base font-bold text-slate-900">{feat.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: How to Use It? (Step-by-Step Flow) */}
      <section className="py-20 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Operational Playbook</h2>
            <p className="text-3xl font-black tracking-tight text-slate-900">How to Use the System</p>
            <p className="text-sm text-slate-500 font-medium">Follow these core steps to execute secure document threat cleansing operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="space-y-4 relative group">
                <div className="text-5xl font-black text-slate-100 font-mono tracking-tight group-hover:text-blue-50/80 transition-colors">
                  {step.num}
                </div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  {step.step_title || step.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}