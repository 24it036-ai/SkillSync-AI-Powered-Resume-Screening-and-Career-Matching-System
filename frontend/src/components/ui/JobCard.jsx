import React from 'react';

export default function JobCard({
  job,
  onSave,
  onUnsave,
  onApply,
  isSaved = false,
  isApplied = false
}) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        gap: '1rem'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}
            >
              {job.companyLogo || '🏢'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                {job.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {job.company} • {job.location}
              </p>
            </div>
          </div>

          <button
            onClick={() => (isSaved ? onUnsave && onUnsave(job._id) : onSave && onSave(job._id))}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: isSaved ? '#f43f5e' : 'var(--text-muted)',
              transition: 'transform 0.15s ease'
            }}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.85rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.85rem' }}>
          {job.requiredSkills && job.requiredSkills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)'
              }}
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills && job.requiredSkills.length > 4 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)',
          marginTop: '0.5rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
            {job.salary || 'Competitive'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
            {job.jobType || 'Full-time'}
          </span>
        </div>

        {isApplied ? (
          <span className="badge badge-success">Applied</span>
        ) : (
          <button
            onClick={() => onApply && onApply(job)}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}
