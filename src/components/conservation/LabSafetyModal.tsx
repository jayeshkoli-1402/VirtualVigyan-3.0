import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface LabSafetyModalProps {
  isOpen: boolean;
  onAcknowledge: () => void;
}

const LabSafetyModal: React.FC<LabSafetyModalProps> = ({ isOpen, onAcknowledge }) => {
  const { t } = useLanguage();
  const [gogglesEquipped, setGogglesEquipped] = useState(true);
  const [maskEquipped, setMaskEquipped] = useState(true);
  const [glovesEquipped, setGlovesEquipped] = useState(true);
  const [labCoatEquipped, setLabCoatEquipped] = useState(true);

  if (!isOpen) return null;

  const allEquipped = gogglesEquipped && maskEquipped && glovesEquipped && labCoatEquipped;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          border: '1px solid #fed7aa',
          animation: 'fadeIn 0.25s ease',
        }}
      >
        {/* Header with Hazard Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: '#fef3c7',
              border: '1.5px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            ⚠️
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#9a3412', margin: 0 }}>
              {t('safety.modalTitle')}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              {t('safety.modalSubtitle')}
            </p>
          </div>
        </div>

        {/* Hazard Summary Banner */}
        <div
          style={{
            background: '#fff1f2',
            border: '1.5px solid #fecdd3',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <span style={{ fontSize: '20px' }}>☠️</span>
          <div style={{ fontSize: '0.72rem', color: '#9f1239', lineHeight: 1.4 }}>
            {t('safety.hazardWarning')}
          </div>
        </div>

        {/* PPE Checklist */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            {t('safety.requiredPPE')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {/* Safety Goggles */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: '8px',
                border: gogglesEquipped ? '1.5px solid #10b981' : '1px solid var(--border)',
                background: gogglesEquipped ? '#ecfdf5' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <input
                type="checkbox"
                checked={gogglesEquipped}
                onChange={(e) => setGogglesEquipped(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#059669' }}
              />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>🥽 {t('safety.goggles')}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{t('safety.gogglesDesc')}</div>
              </div>
            </label>

            {/* Protective Mask */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: '8px',
                border: maskEquipped ? '1.5px solid #10b981' : '1px solid var(--border)',
                background: maskEquipped ? '#ecfdf5' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <input
                type="checkbox"
                checked={maskEquipped}
                onChange={(e) => setMaskEquipped(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#059669' }}
              />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>😷 {t('safety.mask')}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{t('safety.maskDesc')}</div>
              </div>
            </label>

            {/* Nitrile Gloves */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: '8px',
                border: glovesEquipped ? '1.5px solid #10b981' : '1px solid var(--border)',
                background: glovesEquipped ? '#ecfdf5' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <input
                type="checkbox"
                checked={glovesEquipped}
                onChange={(e) => setGlovesEquipped(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#059669' }}
              />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>🧤 {t('safety.gloves')}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{t('safety.glovesDesc')}</div>
              </div>
            </label>

            {/* Lab Coat */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: '8px',
                border: labCoatEquipped ? '1.5px solid #10b981' : '1px solid var(--border)',
                background: labCoatEquipped ? '#ecfdf5' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <input
                type="checkbox"
                checked={labCoatEquipped}
                onChange={(e) => setLabCoatEquipped(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#059669' }}
              />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>🥼 {t('safety.labCoat')}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{t('safety.labCoatDesc')}</div>
              </div>
            </label>
          </div>
        </div>

        {/* Action button */}
        <button
          className="btn-primary"
          onClick={onAcknowledge}
          disabled={!allEquipped}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '0.85rem',
            opacity: allEquipped ? 1 : 0.5,
            cursor: allEquipped ? 'pointer' : 'not-allowed',
            boxShadow: allEquipped ? '0 4px 14px rgba(5, 150, 105, 0.35)' : 'none',
          }}
        >
          {allEquipped ? t('safety.enterBench') : t('safety.equipAll')}
        </button>
      </div>
    </div>
  );
};

export default LabSafetyModal;
