import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { joinPrivateLab } from '../../services/privateLabService';
import type { PrivateLab } from '../../types/privateLab';

interface JoinLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinedSuccess?: (lab: PrivateLab) => void;
}

export const JoinLabModal: React.FC<JoinLabModalProps> = ({
  isOpen,
  onClose,
  onJoinedSuccess,
}) => {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successLab, setSuccessLab] = useState<PrivateLab | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMsg('Please enter a valid laboratory code.');
      return;
    }

    if (!user) {
      setErrorMsg('Please sign in with your student account first.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = joinPrivateLab(code.trim(), {
      studentId: user.id,
      studentName: user.name || 'Student',
      studentEmail: user.email,
      avatar: user.avatar || '🎓',
    });

    if (res.success && res.lab) {
      setSuccessLab(res.lab);
      setTimeout(() => {
        setIsSubmitting(false);
        if (onJoinedSuccess) {
          onJoinedSuccess(res.lab!);
        }
        onClose();
      }, 900);
    } else {
      setIsSubmitting(false);
      setErrorMsg(res.message);
    }
  };

  const handlePreFill = (sampleCode: string) => {
    setCode(sampleCode);
    setErrorMsg(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 11000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(8px)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1.5px solid var(--border)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(37, 99, 235, 0.06))',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(2, 132, 199, 0.15)',
                border: '1px solid rgba(2, 132, 199, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              🏫
            </div>
            <div>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Join Classroom Lab
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Enter your instructor's unique evaluation code
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 32,
              height: 32,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '1.1rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleJoin} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label
              htmlFor="input-join-lab-code"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}
            >
              Enter Lab Code:
            </label>
            <input
              id="input-join-lab-code"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setErrorMsg(null);
              }}
              placeholder="e.g. CHEM-101"
              maxLength={15}
              disabled={isSubmitting || !!successLab}
              autoFocus
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'var(--bg-secondary)',
                border: errorMsg ? '1.5px solid #ef4444' : '1.5px solid var(--border)',
                color: 'var(--text-primary)',
                fontSize: '1.25rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono, monospace)',
                letterSpacing: '0.08em',
                textAlign: 'center',
                textTransform: 'uppercase',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* Quick Demo Code Suggestion */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <span>Demo assessment code:</span>
            <button
              type="button"
              onClick={() => handlePreFill('CHEM-101')}
              style={{
                all: 'unset',
                cursor: 'pointer',
                color: '#0284c7',
                fontWeight: 700,
                textDecoration: 'underline',
              }}
            >
              Use CHEM-101
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Success Notice */}
          {successLab && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(5, 150, 105, 0.12)',
                border: '1px solid rgba(5, 150, 105, 0.35)',
                color: '#059669',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>🎉</span>
              <span>Enrolled in {successLab.title}! Redirecting...</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                all: 'unset',
                cursor: 'pointer',
                flex: 1,
                padding: '11px',
                borderRadius: 12,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.86rem',
                textAlign: 'center',
              }}
            >
              Cancel
            </button>

            <button
              id="btn-submit-join-lab"
              type="submit"
              disabled={isSubmitting || !code.trim()}
              style={{
                all: 'unset',
                cursor: isSubmitting || !code.trim() ? 'not-allowed' : 'pointer',
                flex: 1.4,
                padding: '11px',
                borderRadius: 12,
                background: isSubmitting || !code.trim() ? 'rgba(2, 132, 199, 0.4)' : 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.86rem',
                textAlign: 'center',
                boxShadow: isSubmitting || !code.trim() ? 'none' : '0 4px 14px rgba(2, 132, 199, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              {isSubmitting ? 'Verifying...' : 'Join Classroom Lab →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
