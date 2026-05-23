import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check if an operator token sits in local browser storage matrices
  const token = localStorage.getItem('access_token');

  if (!token) {
    // If unauthenticated, intercept the pipeline and force-route to login
    return <Navigate to="/login" replace />;
  }

  // If token is present, let the secure page child views render smoothly
  return children;
}