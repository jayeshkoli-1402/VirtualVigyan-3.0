import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountDeleted?: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onAccountDeleted,
}) => {
  const { user, deleteCurrentAccount } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';

  const handleDelete = async () => {
    if (!confirmed) return;
    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const res = await deleteCurrentAccount();
      if (res.success) {
        onClose();
        if (onAccountDeleted) {
          onAccountDeleted();
        }
      } else {
        setErrorMsg(res.message || 'Failed to delete account. Please try again.');
        setIsDeleting(false);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred while deleting account.');
      setIsDeleting(false);
    }
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
          maxWidth: 520,
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Top Warning Banner */}
        <div
          style={{
            padding: '20px 24px 16px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.05))',
            borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              ⚠️
            </div>
            <div>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Delete Account
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Permanently remove your laboratory credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
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

        {/* Modal Body */}
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Helpful context for accidental registrations */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(2, 132, 199, 0.08)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              lineHeight: 1.5,
            }}
          >
            💡 <strong>Accidentally registered as {isTeacher ? 'Teacher' : isStudent ? 'Student' : 'the wrong role'}?</strong>
            <div style={{ marginTop: 4, color: 'var(--text-secondary)' }}>
              Deleting this account frees your email address (<strong>{user.email}</strong>) immediately, so you can register again as a {isTeacher ? 'Student' : 'Teacher'}.
            </div>
          </div>

          {/* Current Account Details Card */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 14,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: user.role === 'teacher' ? '#0284c7' : '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {user.avatar && user.avatar.startsWith('http') ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                />
              ) : (
                <span>{user.avatar || (isTeacher ? '👨‍🏫' : '🎓')}</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {user.name}
                </span>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: user.role === 'teacher' ? '#0284c7' : '#059669',
                    color: '#ffffff',
                  }}
                >
                  {user.role}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {user.email}
              </div>
            </div>
          </div>

          {/* Warning Points */}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🗑️</span>
              <span>All experiment progress, scores, and saved drafts will be permanently cleared.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🔓</span>
              <span>Your email will be released so you can sign up again with any role anytime.</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
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

          {/* Confirmation Checkbox */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              cursor: 'pointer',
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <input
              type="checkbox"
              id="chk-confirm-delete-account"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={isDeleting}
              style={{
                marginTop: 2,
                width: 17,
                height: 17,
                cursor: 'pointer',
                accentColor: '#dc2626',
              }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              I understand that deleting my account is irreversible and I want to proceed.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-card)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            disabled={isDeleting}
            style={{
              all: 'unset',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              padding: '9px 18px',
              borderRadius: 10,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.84rem',
            }}
          >
            Keep Account
          </button>

          <button
            id="btn-confirm-delete-account"
            onClick={handleDelete}
            disabled={!confirmed || isDeleting}
            style={{
              all: 'unset',
              cursor: !confirmed || isDeleting ? 'not-allowed' : 'pointer',
              padding: '9px 20px',
              borderRadius: 10,
              background: !confirmed || isDeleting ? 'rgba(239, 68, 68, 0.3)' : '#dc2626',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: !confirmed || isDeleting ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
