import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../../components/ui/JobCard';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [savedRes, appsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/jobs/saved`),
        axios.get(`${API_BASE_URL}/applications`)
      ]);

      if (savedRes.status === 'fulfilled' && savedRes.value.data.success) {
        setSavedJobs(savedRes.value.data.savedJobs || []);
      }
      if (appsRes.status === 'fulfilled' && appsRes.value.data.success) {
        setApplications(appsRes.value.data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      setError('Failed to load saved jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUnsave = async (jobId) => {
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
      alert(`Applied to ${job.title}!`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying for job');
    }
  };

  if (loading) {
    return <Loader message="Fetching your saved bookmarked jobs..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
          Saved Jobs ({savedJobs.length})
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Jobs you have bookmarked for future reference or application.
        </p>
      </div>

      {savedJobs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {savedJobs.map((job) => {
            const isApplied = applications.some((app) => app.job?._id === job._id || app.job === job._id);
            return (
              <JobCard
                key={job._id}
                job={job}
                onUnsave={handleUnsave}
                onApply={handleApply}
                isSaved={true}
                isApplied={isApplied}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="🔖"
          title="No Saved Jobs"
          description="Click the heart icon on any job card in Job Matching to save it here for later."
        />
      )}
    </div>
  );
}
