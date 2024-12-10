import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ auth, children }) {
  return auth ? children : <Navigate to="/Login" />;
}

export default ProtectedRoute;
