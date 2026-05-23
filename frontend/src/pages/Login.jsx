import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { ArrowRight, Shield } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credential pair profile reported.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 font-sans antialiased selection:bg-blue-500/10 relative">
      
      {/* Ambient background blur elements matching your second image */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Welcome Brand Anchor */}
      <div className="text-center mb-6 relative z-10">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome Back</h2>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">Sign in to continue your secure platform journey</p>
      </div>

      {/* Focused Authentication Card Element */}
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl shadow-slate-200/80 rounded-2xl p-8 relative z-10">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2.5 bg-blue-50 border border-blue-100 rounded-xl mb-3 text-blue-600">
            <Shield className="h-5 w-5 fill-blue-500/10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Sign in to My Application</h3>
          <p className="text-xs text-slate-400 mt-1">Welcome back! Please enter your user identity details.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Username Identity</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 text-sm focus:outline-none transition-all font-medium placeholder:text-slate-400"
              placeholder="Enter your username identity"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Secure Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 text-sm focus:outline-none transition-all font-medium placeholder:text-slate-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md focus:outline-none disabled:opacity-50 mt-2"
          >
            {loading ? 'Authorizing Connection...' : 'Continue'}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="border-t border-slate-100 mt-6 pt-4 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}