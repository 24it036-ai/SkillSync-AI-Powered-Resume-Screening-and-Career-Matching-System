import React from 'react';

export default function ActivityItem({ title, description, time, type = 'info' }) {
  const typeIcons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    application: '📄',
    system: '🔔'
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        padding: '0.85rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '1rem'
        }}
      >
        {typeIcons[type] || '🔔'}
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
          {title}
        </h4>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          {description}
        </p>
      </div>

      {time && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {time}
        </span>
      )}
    </div>
  );
}
