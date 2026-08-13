import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Mail, CheckCircle, Settings, Users, Database } from 'lucide-react';

export default function AdminDashboardPlaceholder() {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(17, 24, 39, 0.8) 100%)', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', padding: '0.85rem', borderRadius: '14px', color: '#fff' }}>
            <Shield size={32} />
          </div>
          <div>
            <div className="badge badge-success" style={{ marginBottom: '0.25rem' }}>
              <CheckCircle size={12} /> Administrator Privileges Active
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Control Panel</h1>
            <p style={{ color: 'var(--text-muted)' }}>System Administrator: {user?.fullName || 'Admin'}</p>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: '#ec4899' }} /> Admin Credentials
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Full Name:</span>
              <div style={{ fontWeight: 600, color: '#fff' }}>{user?.fullName}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Email Address:</span>
              <div style={{ fontWeight: 600, color: '#fff' }}>{user?.email}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>System Role:</span>
              <div>
                <span className="badge badge-success" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                  System Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Placeholders */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} style={{ color: 'var(--primary-accent)' }} /> Upcoming Admin Features
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span> Phase 7: User Account Management (Activate/Deactivate)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span> Phase 7: System Performance & Usage Analytics
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span> Phase 7: Master Courses & Job Taxonomy Configuration
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
