import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, User, Mail, Shield, CheckCircle, Search, Users, FileSpreadsheet } from 'lucide-react';

export default function RecruiterDashboardPlaceholder() {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(17, 24, 39, 0.8) 100%)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', padding: '0.85rem', borderRadius: '14px', color: '#fff' }}>
            <Briefcase size={32} />
          </div>
          <div>
            <div className="badge badge-success" style={{ marginBottom: '0.25rem' }}>
              <CheckCircle size={12} /> Recruiter Role Authenticated
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Recruiter Portal Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome, {user?.fullName || 'Recruiter'}!</p>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: 'var(--cyan-accent)' }} /> Profile Information
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
              <span style={{ color: 'var(--text-muted)' }}>Role:</span>
              <div>
                <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Placeholders */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} style={{ color: 'var(--primary-accent)' }} /> Upcoming Recruiter Features
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span> Phase 6: Post Job Requirements & Criteria
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span> Phase 6: Batch Resume Screening & Ranking
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span> Phase 6: Candidate Matching Analytics
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
