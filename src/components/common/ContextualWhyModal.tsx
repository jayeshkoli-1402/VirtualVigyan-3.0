/**
 * ═══════════════════════════════════════════════════════════════════
 *  ContextualWhyModal — Educational "Why?" Explanation Modal
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Displays scientific rationale for the current experiment step.
 *  100% read-only presentation layer.
 *  Includes optional, user-triggered Web Speech audio synthesis.
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export interface ContextualWhyModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepTitle?: string;
  conceptTitle?: string;
  explanation: string;
}

const ContextualWhyModal: React.FC<ContextualWhyModalProps> = ({
  isOpen,
  onClose,
  stepTitle,
  conceptTitle,
  explanation,
}) => {
  const { t, language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const gotItButtonRef = useRef<HTMLButtonElement | null>(null);

  // Stop speech when modal closes or unmounts
  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe fallback
      }
    }
    setIsSpeaking(false);
  }, []);

  const handleClose = useCallback(() => {
    stopSpeech();
    onClose();
  }, [stopSpeech, onClose]);

  // Keyboard trap for ESC key & initial focus
  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      gotItButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      stopSpeech();
    };
  }, [isOpen, handleClose, stopSpeech]);

  // Optional Voice TTS handler
  const handleToggleVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const textToSpeak = `${conceptTitle || stepTitle || ''}. ${explanation}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Select matching voice locale if available
      const langCodes: Record<string, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        mr: 'mr-IN',
      };
      utterance.lang = langCodes[language] || 'en-US';
      utterance.rate = 0.92;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  const hasSpeechSupport = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="why-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '480px',
          width: '100%',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1.5px solid rgba(59, 130, 246, 0.35)',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          color: 'var(--text-primary)',
          position: 'relative',
        }}
      >
        {/* Header with Why badge and Close button */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(59, 130, 246, 0.28))',
                border: '1.5px solid rgba(37, 99, 235, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                color: '#2563eb',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              ?
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#2563eb',
                    background: 'rgba(37, 99, 235, 0.1)',
                    padding: '2px 7px',
                    borderRadius: 4,
                  }}
                >
                  {t('why.buttonLabel', 'Why?')}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {t('why.modalTitle', 'Scientific Principle')}
                </span>
              </div>
              <h3
                id="why-modal-title"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  margin: '3px 0 0 0',
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                }}
              >
                {conceptTitle || stepTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label={t('common.close', 'Close')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
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

        {/* Step Context Subtitle if distinct */}
        {stepTitle && conceptTitle && stepTitle !== conceptTitle && (
          <div
            style={{
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-secondary)',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
              {t('why.stepContext', 'Current Step')}:
            </span>
            <span style={{ fontWeight: 600 }}>{stepTitle}</span>
          </div>
        )}

        {/* Scientific Explanation Body */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(14, 165, 233, 0.04))',
            border: '1.5px solid rgba(37, 99, 235, 0.18)',
            borderRadius: '12px',
            padding: '14px 16px',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            fontWeight: 450,
          }}
        >
          {explanation}
        </div>

        {/* Action Controls: Optional Voice & Got it button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
          {hasSpeechSupport ? (
            <button
              onClick={handleToggleVoice}
              type="button"
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: '8px',
                background: isSpeaking ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-secondary)',
                border: isSpeaking ? '1px solid #ef4444' : '1px solid var(--border)',
                color: isSpeaking ? '#ef4444' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
              title={isSpeaking ? t('why.stopListening', 'Stop') : t('why.listen', 'Listen')}
            >
              <span>{isSpeaking ? '⏹️' : '🔊'}</span>
              <span>{isSpeaking ? t('why.stopListening', 'Stop') : t('why.listen', 'Listen')}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            ref={gotItButtonRef}
            onClick={handleClose}
            className="btn-primary"
            style={{
              padding: '8px 22px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
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

export default ContextualWhyModal;
