import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="badge badge-pending" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          <span className="pulse-dot"></span> Verifying Authentication...
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, storing attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to role's dashboard if user doesn't have required role
    const roleDashboardMap = {
      student: '/student/dashboard',
      recruiter: '/recruiter/dashboard',
      admin: '/admin/dashboard'
    };
    const targetDashboard = roleDashboardMap[user.role] || '/';
    return <Navigate to={targetDashboard} replace />;
  }

  return children;
}
