import React from 'react';

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        borderColor: 'rgba(244, 63, 94, 0.3)',
        background: 'rgba(244, 63, 94, 0.05)'
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'rgba(244, 63, 94, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          margin: '0 auto 1rem auto'
        }}
      >
        ⚠️
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f87171', marginBottom: '0.4rem' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
        {message || 'An error occurred while communicating with the server. Please try again.'}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn"
          style={{
            background: 'rgba(244, 63, 94, 0.2)',
            color: '#f87171',
            border: '1px solid rgba(244, 63, 94, 0.4)'
          }}
        >
          🔄 Try Again
        </button>
      )}
    </div>
  );
}
