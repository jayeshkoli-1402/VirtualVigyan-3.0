import React from 'react';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';
import { useLanguage } from '../../i18n/LanguageContext';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExploring?: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartExploring,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: t('howItWorks.step1Title', 'Select a Chemistry Experiment'),
      desc: t('howItWorks.step1Desc', 'Choose from Class 9 to FY B.Tech modules including volumetric titration and conservation of mass.'),
      icon: '🧪',
    },
    {
      num: '2',
      title: t('howItWorks.step2Title', 'Interact with Lab Apparatus'),
      desc: t('howItWorks.step2Desc', 'Drag and drop burettes, conical flasks, pipettes, and reagents onto the digital bench.'),
      icon: '⚗️',
    },
    {
      num: '3',
      title: t('howItWorks.step3Title', 'Observe Reactions in Real-Time'),
      desc: t('howItWorks.step3Desc', 'Watch authentic color changes, precipitation, meniscus levels, and digital readings.'),
      icon: '👁️',
    },
    {
      num: '4',
      title: t('howItWorks.step4Title', 'Calculate & Get Evaluated'),
      desc: t('howItWorks.step4Desc', 'Record volume endpoints, enter stoichiometric calculations, and receive immediate step-by-step scoring feedback.'),
      icon: '📊',
    },
  ];

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
          maxWidth: 540,
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1px solid var(--border)',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-overlay)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VirtualVigyanLogo size={32} />
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {t('howItWorks.title', 'How VirtualVigyan Works')}
              </h3>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {t('howItWorks.subtitle', 'A 4-step walkthrough of your digital chemistry lab experience')}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {steps.map((s) => (
            <div
              key={s.num}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '12px 14px',
                borderRadius: 12,
                background: 'var(--bg-secondary)',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {s.num}
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            onClose();
            if (onStartExploring) onStartExploring();
          }}
          style={{
            all: 'unset',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
            padding: '12px 0',
            borderRadius: 10,
            background: '#2563eb',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.875rem',
            boxSizing: 'border-box',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
          }}
        >
          {t('howItWorks.startBtn', 'Start Exploring Experiments →')}
        </button>
      </div>
    </div>
  );
};
