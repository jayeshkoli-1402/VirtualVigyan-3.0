import React from 'react';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';
import { useLanguage } from '../../i18n/LanguageContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 500,
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          borderRadius: 18,
          border: '1px solid var(--border)',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-overlay)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VirtualVigyanLogo size={40} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {t('brand.name', 'VirtualVigyan')}
              </h3>
              <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 600 }}>
                {t('brand.tagline', 'Interactive Chemistry Laboratory')}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          {t('about.description', 'VirtualVigyan is an advanced, tactile digital chemistry laboratory designed to eliminate educational resource barriers. Students can perform authentic, quantitative chemistry experiments with interactive fluid dynamics, accurate stoichiometric calculations, and real-time error guidance on any device.')}
        </p>

        <div
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {t('about.alignment', 'Curriculum Alignment')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
            {t('about.curriculumDetails', '• Dr. Babasaheb Ambedkar Technological University (DBATU) — F.Y. B.Tech\n• National Council of Educational Research and Training (NCERT) — Classes 9 to 12')}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {t('about.tagline', 'v2.0 • For Every Student, Everywhere')}
          </div>
          <button
            onClick={onClose}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '6px 16px',
              borderRadius: 6,
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            {t('common.close', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
