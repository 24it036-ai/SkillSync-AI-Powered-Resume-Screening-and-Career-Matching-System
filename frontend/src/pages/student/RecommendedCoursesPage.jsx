import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function RecommendedCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/recommended`);
      if (response.data.success) {
        setCourses(response.data.courses || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load recommended courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return <Loader message="Fetching recommended learning courses..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchCourses} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
          Recommended Courses
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Enhance your technical skills with curated courses aligned with industry requirements.
        </p>
      </div>

      {courses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {courses.map((course) => (
            <div
              key={course._id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                    {course.platform}
                  </span>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    ★ {course.rating}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {course.courseName}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  Instructor: <span style={{ color: '#fff' }}>{course.instructor}</span> • Duration: {course.duration}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skills Covered:</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--cyan-accent)' }}>
                    {course.skillCovered}
                  </span>
                </div>
              </div>

              <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-pending" style={{ fontSize: '0.75rem' }}>
                  {course.difficulty}
                </span>

                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                >
                  Enroll / View Course ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🎓"
          title="No Courses Available"
          description="Courses will appear here as learning pathways are updated."
        />
      )}
    </div>
  );
}
