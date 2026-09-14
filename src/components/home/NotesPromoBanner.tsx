import React from 'react';

interface NotesPromoBannerProps {
  onGoToNotes: () => void;
}

export const NotesPromoBanner: React.FC<NotesPromoBannerProps> = ({ onGoToNotes }) => {
  return (
    <div
      style={{
        marginTop: 36,
        padding: '16px 24px',
        borderRadius: 14,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Blue Book Icon Container */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(37, 99, 235, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            color: '#2563eb',
            flexShrink: 0,
          }}
        >
          📖
        </div>

        <div>
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
            }}
          >
            Looking for theory, formulas or practical writeups?
          </div>
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginTop: 2,
            }}
          >
            Check out our Notes section for study material, viva questions and more.
          </div>
        </div>
      </div>

      <button
        id="btn-go-to-notes"
        onClick={onGoToNotes}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          borderRadius: 8,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          color: '#2563eb',
          fontSize: '0.8125rem',
          fontWeight: 600,
          boxShadow: 'var(--shadow-xs)',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#2563eb';
          e.currentTarget.style.transform = 'translateX(2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <span>Go to Notes</span>
        <span>→</span>
      </button>
    </div>
  );
};
