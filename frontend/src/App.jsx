import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import UploadFile from './pages/UploadFile';
import History from './pages/History';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Routes>
          {/* Public Landing Redirects (Wire to Login/Register pages as needed) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Main Application Operational Portal Context */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex w-full">
                <Sidebar />
                <main className="flex-1 min-w-0 overflow-y-auto">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="upload" element={<UploadFile />} />
                    <Route path="history" element={<History />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="admin" element={<AdminPanel />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;