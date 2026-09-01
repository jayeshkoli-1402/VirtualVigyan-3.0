import React from 'react';

export interface HazardWarningData {
  title: string;
  chemical: string;
  hazardClass: string;
  icon: string;
  description: string;
  precaution: string;
}

interface ChemicalHazardWarningToastProps {
  warning: HazardWarningData | null;
  onDismiss: () => void;
}

const ChemicalHazardWarningToast: React.FC<ChemicalHazardWarningToastProps> = ({ warning, onDismiss }) => {
  if (!warning) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        maxWidth: 420,
        width: '90%',
        zIndex: 9998,
        animation: 'slideInUp 0.3s ease',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: '1.5px solid #ef4444',
          padding: '14px 16px',
          boxShadow: '0 10px 30px rgba(220, 38, 38, 0.25)',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: '#fee2e2',
            border: '1px solid #f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {warning.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b' }}>
              {warning.title}
            </span>
            <button
              onClick={onDismiss}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: '#94a3b8',
                padding: '0 4px',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ fontSize: '0.66rem', color: '#b91c1c', fontWeight: 700, margin: '2px 0 4px 0' }}>
            {warning.chemical} • GHS: {warning.hazardClass}
          </div>

          <div style={{ fontSize: '0.68rem', color: '#334155', lineHeight: 1.35 }}>
            {warning.description}
          </div>

          <div
            style={{
              marginTop: 6,
              padding: '4px 8px',
              background: '#fef2f2',
              borderRadius: 6,
              fontSize: '0.62rem',
              color: '#7f1d1d',
              fontWeight: 600,
            }}
          >
            🛡️ <strong>Precaution:</strong> {warning.precaution}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemicalHazardWarningToast;
