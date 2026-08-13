import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../../components/ui/JobCard';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function JobMatchingPage() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsRes, appsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/jobs`),
        axios.get(`${API_BASE_URL}/applications`)
      ]);

      if (jobsRes.status === 'fulfilled' && jobsRes.value.data.success) {
        setJobs(jobsRes.value.data.jobs || []);
      }
      if (appsRes.status === 'fulfilled' && appsRes.value.data.success) {
        setApplications(appsRes.value.data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load available job postings.');
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
      alert(err.response?.data?.message || 'Error removing saved job');
    }
  };

  const handleApply = async (job) => {
    try {
      await axios.post(`${API_BASE_URL}/applications`, { jobId: job._id });
      alert(`Successfully submitted application for ${job.title}!`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying for job');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.requiredSkills && job.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesType = filterType === 'All' || job.jobType === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <Loader message="Fetching job opportunities and match metadata..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Title & Search Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
            Job Matching & Opportunities
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Discover active job roles. AI-driven cosine similarity match scoring will be enabled in Phase 5.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by title, company, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.875rem',
              width: '240px'
            }}
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.875rem'
            }}
          >
            <option value="All">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className="card"
        style={{
          background: 'rgba(6, 182, 212, 0.1)',
          borderColor: 'rgba(6, 182, 212, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div style={{ fontSize: '1.75rem' }}>⚡</div>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
            Phase 3 Matching Architecture Ready
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Jobs listed below represent live opportunities stored in MongoDB. Machine learning similarity vector calculations will automatically populate match percentages in Phase 5.
          </p>
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredJobs.map((job) => {
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
      ) : (
        <EmptyState
          icon="💼"
          title="No Jobs Found"
          description="No job postings match your search filters. Try adjusting your search query."
        />
      )}
    </div>
  );
}
