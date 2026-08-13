import React from 'react';

export default function Loader({ message = 'Loading details...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '220px',
        width: '100%'
      }}
    >
      <div className="pulse-dot" style={{ width: '16px', height: '16px', color: '#6366f1', marginBottom: '1rem' }} />
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}
