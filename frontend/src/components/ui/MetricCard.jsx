import React from 'react';

export default function MetricCard({ title, value, subtitle, icon, trend, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.25)',
      text: '#818cf8',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      text: '#34d399',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    cyan: {
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.25)',
      text: '#38bdf8',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)'
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#fbbf24',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    }
  };

  const theme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#ffffff', marginTop: '0.25rem' }}>
            {value}
          </div>
        </div>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem'
          }}
        >
          {icon}
        </div>
      </div>

      {subtitle && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          {trend && (
            <span style={{ color: trend.startsWith('+') ? '#34d399' : '#f87171', fontWeight: 600 }}>
              {trend}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}
