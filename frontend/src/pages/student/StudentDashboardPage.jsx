import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MetricCard from '../../components/ui/MetricCard';
import ScoreCard from '../../components/ui/ScoreCard';
import JobCard from '../../components/ui/JobCard';
import ActivityItem from '../../components/ui/ActivityItem';
import Loader from '../../components/ui/Loader';
import ErrorState from '../../components/ui/ErrorState';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resumesRes, appsRes, jobsRes, notifsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/resumes`),
        axios.get(`${API_BASE_URL}/applications`),
        axios.get(`${API_BASE_URL}/jobs`),
        axios.get(`${API_BASE_URL}/notifications`)
      ]);

      if (resumesRes.status === 'fulfilled' && resumesRes.value.data.success) {
        setResumes(resumesRes.value.data.resumes || []);
      }
      if (appsRes.status === 'fulfilled' && appsRes.value.data.success) {
        setApplications(appsRes.value.data.applications || []);
      }
      if (jobsRes.status === 'fulfilled' && jobsRes.value.data.success) {
        setJobs(jobsRes.value.data.jobs || []);
      }
      if (notifsRes.status === 'fulfilled' && notifsRes.value.data.success) {
        setNotifications(notifsRes.value.data.notifications || []);
      }
    } catch (err) {
      console.error('Error loading student dashboard:', err);
      setError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveJob = async (jobId) => {
    try {
      await axios.post(`${API_BASE_URL}/jobs/${jobId}/save`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving job');
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await axios.delete(`${API_BASE_URL}/jobs/${jobId}/save`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing job');
    }
  };

  const handleApply = async (job) => {
    try {
      await axios.post(`${API_BASE_URL}/applications`, { jobId: job._id });
      alert(`Applied successfully to ${job.title} at ${job.company}!`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying for job');
    }
  };

  if (loading) {
    return <Loader message="Fetching your personalized dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  const latestResume = resumes.length > 0 ? resumes[0] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          padding: '1.75rem 2rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <span className="badge badge-pending" style={{ marginBottom: '0.5rem' }}>
            Phase 3 Functional Module
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
            Welcome back to SkillSync! 🚀
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '600px' }}>
            Upload your resume, track job applications, discover recommended courses, and prepare your profile for AI-driven skill matching in Phase 4.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/student/resume-upload')} className="btn btn-primary">
            📤 Upload Resume
          </button>
          <button onClick={() => navigate('/student/job-matching')} className="btn" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
            ⚡ Explore Jobs
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <MetricCard
          title="ATS Score"
          value={latestResume ? 'Pending AI' : 'No Resume'}
          subtitle="Phase 4 AI Calculation"
          icon="🎯"
          color="indigo"
        />

        <MetricCard
          title="Resume Status"
          value={latestResume ? 'Uploaded' : 'Missing'}
          subtitle={latestResume ? latestResume.originalName : 'Upload PDF / DOCX'}
          icon="📄"
          color={latestResume ? 'emerald' : 'amber'}
        />

        <MetricCard
          title="Job Match %"
          value="Pending"
          subtitle="Phase 5 Matching Engine"
          icon="⚡"
          color="cyan"
        />

        <MetricCard
          title="Applications"
          value={applications.length}
          subtitle="Submitted applications"
          icon="💼"
          color="emerald"
        />
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="dashboard-grid">
        {/* Left Column - Recommended Jobs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              Featured Opportunities
            </h3>
            <button
              onClick={() => navigate('/student/job-matching')}
              style={{ background: 'none', border: 'none', color: 'var(--cyan-accent)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
            >
              View All Jobs →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {jobs.slice(0, 4).map((job) => {
              const isApplied = applications.some((app) => app.job?._id === job._id || app.job === job._id);
              return (
                <JobCard
                  key={job._id}
                  job={job}
                  onSave={handleSaveJob}
                  onUnsave={handleUnsaveJob}
                  onApply={handleApply}
                  isSaved={job.isSaved}
                  isApplied={isApplied}
                />
              );
            })}
          </div>
        </div>

        {/* Right Column - Status & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <ScoreCard
            title="AI Resume Analysis Status"
            score={0}
            isPending={true}
            statusText="AI parsing will trigger in Phase 4"
          />

          {/* Recent Activity */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
              Recent Activity
            </h3>
            {notifications.length > 0 ? (
              notifications.slice(0, 4).map((n) => (
                <ActivityItem
                  key={n._id}
                  title={n.title}
                  description={n.message}
                  time={new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  type={n.type}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No recent activity logged yet.
              </div>
            )}
          </div>

          {/* Skill Gap Summary */}
          <div className="card" style={{ background: 'rgba(17, 24, 39, 0.5)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
              Skill Gap Summary
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              SkillSync will automatically compare your profile against target industry roles once resume parsing is active.
            </p>
            <div
              style={{
                fontSize: '0.8rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#fbbf24'
              }}
            >
              ℹ️ Reserved for Phase 4 AI Pipeline
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
