import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function SkillGapsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile`);
        if (response.data.success) {
          setProfile(response.data.profile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <Loader message="Fetching skill gap analysis setup..." />;
  }

  const userSkills = profile?.skills || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
          Skill Gap Analysis
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Compare your current technical competencies against industry role benchmarks.
        </p>
      </div>

      {/* Profile Skills Overview Card */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.85rem' }}>
          Your Registered Skills ({userSkills.length})
        </h3>
        {userSkills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {userSkills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.85rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#818cf8',
                  fontWeight: 600
                }}
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No skills added to your profile yet. Add your skills in Profile settings to enable gap comparison.
            </p>
            <button onClick={() => navigate('/student/profile')} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
              Edit Profile Skills
            </button>
          </div>
        )}
      </div>

      {/* Target Industry Benchmarks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Role Benchmark 1 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              Frontend Developer Benchmark
            </h4>
            <span className="badge badge-pending">Phase 4 AI Analysis</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Expected skills: React, JavaScript, HTML5, CSS3, TypeScript, State Management, Git.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Missing skill comparison will execute automatically when resume parsing is active in Phase 4.
          </div>
        </div>

        {/* Role Benchmark 2 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              Backend Node.js Benchmark
            </h4>
            <span className="badge badge-pending">Phase 4 AI Analysis</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Expected skills: Node.js, Express, MongoDB, REST API, JWT Authentication, Microservices.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Missing skill comparison will execute automatically when resume parsing is active in Phase 4.
          </div>
        </div>
      </div>
    </div>
  );
}
