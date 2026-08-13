import React from 'react';

export default function ScoreCard({ title, score, maxScore = 100, label, statusText, isPending = false }) {
  const percentage = isPending ? 0 : Math.min(Math.max(score || 0, 0), maxScore);
  
  return (
    <div className="card" style={{ textAlign: 'center', position: 'relative' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        {title}
      </h3>

      <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 1rem auto' }}>
        <svg width="130" height="130" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="10"
            strokeDasharray="314"
            strokeDashoffset={314 - (314 * percentage) / 100}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isPending ? (
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fbbf24' }}>
              Pending
            </span>
          ) : (
            <>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                {percentage}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {label || 'Score'}
              </span>
            </>
          )}
        </div>
      </div>

      <div style={{ fontSize: '0.85rem', color: isPending ? '#fbbf24' : 'var(--text-muted)', fontWeight: 500 }}>
        {statusText || (isPending ? 'Upload resume to calculate' : 'Based on latest analysis')}
      </div>
    </div>
  );
}
