import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, User, Mail, Shield, CheckCircle, FileText, Target, BookOpen } from 'lucide-react';

export default function StudentDashboardPlaceholder() {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(17, 24, 39, 0.8) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '0.85rem', borderRadius: '14px', color: '#fff' }}>
            <GraduationCap size={32} />
          </div>
          <div>
            <div className="badge badge-success" style={{ marginBottom: '0.25rem' }}>
              <CheckCircle size={12} /> Student Role Authenticated
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Student Portal Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome, {user?.fullName || 'Student'}!</p>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: 'var(--primary-accent)' }} /> Profile Information
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
            <FileText size={18} style={{ color: 'var(--cyan-accent)' }} /> Upcoming Student Features
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span> Phase 3: Profile Management & Skills
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span> Phase 4: Resume Parsing & ATS Analyzer
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span> Phase 5: Job Matching & Skill Gap Analysis
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
