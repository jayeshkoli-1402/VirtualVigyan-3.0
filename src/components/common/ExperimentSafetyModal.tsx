/**
 * ═══════════════════════════════════════════════════════════════════
 *  ExperimentSafetyModal — Comprehensive Laboratory Safety Center
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Displays experiment-specific safety precautions:
 *  1. Required PPE
 *  2. Chemical Hazards
 *  3. Handling Precautions
 *  4. Spill Guidance
 *  5. Disposal Guidance
 *
 *  100% read-only presentation layer.
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getExperimentSafetyInfo } from '../../data/experimentSafetyData';

export interface ExperimentSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentId: string;
  experimentTitle?: string;
}

type SafetyTab = 'all' | 'ppe' | 'hazards' | 'precautions' | 'spill' | 'disposal';

const ExperimentSafetyModal: React.FC<ExperimentSafetyModalProps> = ({
  isOpen,
  onClose,
  experimentId,
  experimentTitle,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<SafetyTab>('all');
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const safetyData = getExperimentSafetyInfo(experimentId, language);

  // Keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-center-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: 'min(88vh, 760px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          borderRadius: '18px',
          border: '1.5px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          color: 'var(--text-primary)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(220, 38, 38, 0.04))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
                border: '1.5px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.35rem',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
              }}
            >
              🛡️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2
                  id="safety-center-title"
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    margin: 0,
                    color: '#b45309',
                    letterSpacing: '0.01em',
                  }}
                >
                  {t('safety.centerTitle', 'Safety Center')}
                </h2>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#d97706',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  {t('safety.buttonLabel', 'Safety')}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  margin: '2px 0 0 0',
                  fontWeight: 500,
                }}
              >
                {experimentTitle || t('safety.subtitle', 'Essential precautions & laboratory safety guidance')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 30,
              height: 30,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
              fontWeight: 700,
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'var(--bg-secondary)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          {[
            { id: 'all', label: t('common.filterAll', 'All'), icon: '📋' },
            { id: 'ppe', label: t('safety.ppeTitle', 'PPE'), icon: '🧤' },
            { id: 'hazards', label: t('safety.hazardsTitle', 'Hazards'), icon: '⚠️' },
            { id: 'precautions', label: t('safety.precautionsTitle', 'Precautions'), icon: '🧪' },
            { id: 'spill', label: t('safety.spillTitle', 'Spills'), icon: '🧯' },
            { id: 'disposal', label: t('safety.disposalTitle', 'Disposal'), icon: '♻️' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SafetyTab)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '5px 11px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? '#f59e0b' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div
          style={{
            padding: '18px 22px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            flex: 1,
          }}
        >
          {/* Section 1: Required PPE */}
          {(activeTab === 'all' || activeTab === 'ppe') && (
            <div
              style={{
                borderRadius: '12px',
                border: '1.5px solid rgba(16, 185, 129, 0.25)',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.02))',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: '1.15rem' }}>🧤</span>
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#059669', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('safety.ppeTitle', 'Required PPE')}
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
                {safetyData.ppe.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      fontSize: '0.78rem',
                      lineHeight: 1.4,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-card)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Chemical Hazards */}
          {(activeTab === 'all' || activeTab === 'hazards') && (
            <div
              style={{
                borderRadius: '12px',
                border: '1.5px solid rgba(239, 68, 68, 0.25)',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.02))',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: '1.15rem' }}>⚠️</span>
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#dc2626', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('safety.hazardsTitle', 'Chemical Hazards')}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {safetyData.hazards.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      background: 'var(--bg-card)',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{item.icon || '⚠️'}</span>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626' }}>
                        {item.chemical}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginTop: 2 }}>
                        {item.hazard}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Handling Precautions */}
          {(activeTab === 'all' || activeTab === 'precautions') && (
            <div
              style={{
                borderRadius: '12px',
                border: '1.5px solid rgba(59, 130, 246, 0.25)',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.02))',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: '1.15rem' }}>🧪</span>
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#2563eb', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('safety.precautionsTitle', 'Handling Precautions')}
                </h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {safetyData.precautions.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 4: Spill Guidance */}
          {(activeTab === 'all' || activeTab === 'spill') && (
            <div
              style={{
                borderRadius: '12px',
                border: '1.5px solid rgba(249, 115, 22, 0.25)',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.02))',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: '1.15rem' }}>🧯</span>
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ea580c', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('safety.spillTitle', 'Spill Guidance')}
                </h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {safetyData.spillGuidance.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 5: Disposal Guidance */}
          {(activeTab === 'all' || activeTab === 'disposal') && (
            <div
              style={{
                borderRadius: '12px',
                border: '1.5px solid rgba(139, 92, 246, 0.25)',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(124, 58, 237, 0.02))',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: '1.15rem' }}>♻️</span>
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#7c3aed', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('safety.disposalTitle', 'Disposal Guidance')}
                </h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {safetyData.disposal.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer with Acknowledge Button */}
        <div
          style={{
            padding: '12px 22px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="btn-primary"
            style={{
              padding: '8px 24px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {t('why.gotIt', 'Got it')} ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperimentSafetyModal;
