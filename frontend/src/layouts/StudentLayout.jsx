import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StudentLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: '📊' },
    { label: 'Resume Upload', path: '/student/resume-upload', icon: '📤' },
    { label: 'Resume Analysis', path: '/student/resume-analysis', icon: '🔍' },
    { label: 'ATS Score', path: '/student/ats-score', icon: '🎯' },
    { label: 'Job Matching', path: '/student/job-matching', icon: '⚡' },
    { label: 'Skill Gap Analysis', path: '/student/skill-gaps', icon: '🧩' },
    { label: 'Recommended Courses', path: '/student/courses', icon: '🎓' },
    { label: 'Saved Jobs', path: '/student/saved-jobs', icon: '🔖' },
    { label: 'Applied Jobs', path: '/student/applications', icon: '💼' },
    { label: 'Notifications', path: '/student/notifications', icon: '🔔' },
    { label: 'Profile', path: '/student/profile', icon: '👤' },
    { label: 'Settings', path: '/student/settings', icon: '⚙️' }
  ];

  // Helper to format title from path
  const currentNav = navItems.find((item) => location.pathname.startsWith(item.path));
  const pageTitle = currentNav ? currentNav.label : 'Student Portal';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          transition: 'transform 0.3s ease',
          transform: mobileMenuOpen ? 'translateX(0)' : undefined
        }}
        className="student-sidebar"
      >
        <div>
          {/* Logo Brand */}
          <div
            style={{
              padding: '1.5rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: '#fff'
                }}
              >
                S
              </div>
              <div>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  Skill<span style={{ color: 'var(--cyan-accent)' }}>Sync</span>
                </span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
                  STUDENT PORTAL
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items List */}
          <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - User Profile & Logout */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#fff',
                  flexShrink: 0
                }}
              >
                {user?.fullName?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.fullName || 'Student'}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: '#f87171',
                padding: '0.45rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                transition: 'all 0.2s ease'
              }}
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="student-main-content">
        {/* Top Header */}
        <header
          style={{
            height: '65px',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            padding: '0 1.75rem',
            sticky: 'top',
            top: 0,
            zIndex: 80
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.4rem',
                cursor: 'pointer'
              }}
            >
              ☰
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              {pageTitle}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <NavLink
              to="/student/notifications"
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                color: 'var(--text-main)',
                textDecoration: 'none'
              }}
              title="Notifications"
            >
              🔔
            </NavLink>

            <span className="badge badge-success">
              <span className="pulse-dot" /> Student Active
            </span>
          </div>
        </header>

        {/* Page Body Container */}
        <main style={{ padding: '1.75rem', flex: 1 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .student-sidebar {
            transform: translateX(-100%);
          }
          .student-main-content {
            margin-left: 0 !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
