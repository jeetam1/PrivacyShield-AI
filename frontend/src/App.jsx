import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PdfMasker from './pages/PdfMasker';
import Guide from './pages/Docs/Guide';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main PDF Masker Application */}
        <Route path="/" element={<PdfMasker />} />
        <Route path="/guide" element={<Guide />} />
        
        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;