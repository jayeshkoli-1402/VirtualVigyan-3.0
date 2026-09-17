import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import type { UserRole } from '../../auth/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleRedirect?: (role: UserRole) => void;
  initialTab?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onRoleRedirect,
  initialTab = 'login',
}) => {
  const { login, register, firestoreLocked } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGrade, setRegGrade] = useState('Class 11');
  const [regSchool, setRegSchool] = useState('');
  const [regInstitution, setRegInstitution] = useState('');
  const [regDepartment, setRegDepartment] = useState('Applied Chemistry');

  // UI state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(loginIdentifier, loginPassword);
      setIsSubmitting(false);
      if (res.success && res.role) {
        setSuccessMessage(res.message || 'Logged in successfully!');
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
          if (onRoleRedirect) onRoleRedirect(res.role!);
        }, 500);
      } else {
        setErrorMessage(res.message || 'Login failed.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await register({
        role: regRole,
        name: regName,
        email: regEmail,
        password: regPassword,
        grade: regRole === 'student' ? regGrade : undefined,
        school: regRole === 'student' ? regSchool : undefined,
        institution: regRole === 'teacher' ? regInstitution : undefined,
        department: regRole === 'teacher' ? regDepartment : undefined,
      });
      setIsSubmitting(false);

      if (res.success && res.role) {
        setSuccessMessage(res.message || 'Account created!');
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
          if (onRoleRedirect) onRoleRedirect(res.role!);
        }, 600);
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage('An unexpected error occurred during registration.');
    }
  };

  // Quick-fill demo account helper
  const fillDemo = (id: string, pass: string) => {
    setLoginIdentifier(id);
    setLoginPassword(pass);
    setErrorMessage(null);
  };

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
        backdropFilter: 'blur(12px)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="clay-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 490,
          background: 'var(--bg-card)',
          borderRadius: 28,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        {/* Modal Top Header Bar */}
        <div
          style={{
            padding: '24px 28px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              className="clay-badge"
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                background: 'linear-gradient(145deg, #10b981, #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                color: '#fff',
                boxShadow: '4px 6px 14px rgba(5, 150, 105, 0.35), inset 2px 2px 3px rgba(255, 255, 255, 0.6)',
              }}
            >
              🔬
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                VirtualVigyan Portal
              </h2>
              <p
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  margin: '2px 0 0',
                  fontWeight: 600,
                }}
              >
                Tactile Interactive Chemistry Lab
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="clay-btn"
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: 'var(--bg-secondary)',
              color: 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: 800,
              boxShadow: 'var(--clay-btn-shadow)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Claymorphic Tab Switcher (Pill Container) */}
        <div style={{ padding: '16px 24px 0' }}>
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-secondary)',
              borderRadius: 20,
              padding: 5,
              boxShadow: 'var(--clay-input-shadow)',
              gap: 6,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className="clay-btn"
              style={{
                flex: 1,
                padding: '9px 16px',
                borderRadius: 16,
                fontSize: '0.85rem',
                fontWeight: 700,
                background:
                  activeTab === 'login'
                    ? 'linear-gradient(145deg, #ffffff, var(--bg-card))'
                    : 'transparent',
                color: activeTab === 'login' ? '#059669' : 'var(--text-muted)',
                boxShadow:
                  activeTab === 'login'
                    ? '4px 6px 14px rgba(0, 0, 0, 0.08), inset 2px 2px 3px rgba(255, 255, 255, 0.9)'
                    : 'none',
              }}
            >
              🔑 Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className="clay-btn"
              style={{
                flex: 1,
                padding: '9px 16px',
                borderRadius: 16,
                fontSize: '0.85rem',
                fontWeight: 700,
                background:
                  activeTab === 'register'
                    ? 'linear-gradient(145deg, #ffffff, var(--bg-card))'
                    : 'transparent',
                color: activeTab === 'register' ? '#0284c7' : 'var(--text-muted)',
                boxShadow:
                  activeTab === 'register'
                    ? '4px 6px 14px rgba(0, 0, 0, 0.08), inset 2px 2px 3px rgba(255, 255, 255, 0.9)'
                    : 'none',
              }}
            >
              ✨ Create Account
            </button>
          </div>
        </div>

        {/* Firestore Mode Info Badge */}
        {firestoreLocked && (
          <div
            className="clay-badge"
            style={{
              margin: '12px 24px 0',
              padding: '8px 14px',
              borderRadius: 12,
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              color: '#d97706',
              fontSize: '0.74rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>🔒</span>
            <span>Firestore in Locked Mode. Local profile cache active.</span>
          </div>
        )}

        {/* Feedback alert toasts */}
        {errorMessage && (
          <div
            className="clay-badge"
            style={{
              margin: '14px 24px 0',
              padding: '10px 16px',
              borderRadius: 14,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.3)',
            }}
          >
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="clay-badge"
            style={{
              margin: '14px 24px 0',
              padding: '10px 16px',
              borderRadius: 14,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.3)',
            }}
          >
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Form Body */}
        <div style={{ padding: '20px 24px 28px', maxHeight: '72vh', overflowY: 'auto' }}>
          {/* ═══════════ TAB 1: SIGN IN ═══════════ */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: 6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Email Address or Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin, student@virtualvigyan.in"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="clay-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: 6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="clay-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                disabled={isSubmitting}
                className="clay-btn clay-btn-emerald"
                style={{
                  marginTop: 6,
                  padding: '14px 20px',
                  borderRadius: 18,
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  letterSpacing: '0.01em',
                  opacity: isSubmitting ? 0.75 : 1,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                }}
              >
                <span>{isSubmitting ? 'Authenticating with Firebase...' : 'Sign In to VirtualVigyan'}</span>
                <span>→</span>
              </button>

              {/* Claymorphic Quick-Fill Demo Cards */}
              <div
                style={{
                  marginTop: 8,
                  paddingTop: 16,
                  borderTop: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    marginBottom: 10,
                  }}
                >
                  ⚡ One-Tap Demo Accounts
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => fillDemo('student@virtualvigyan.in', 'student123')}
                    className="clay-btn"
                    style={{
                      padding: '10px 8px',
                      borderRadius: 16,
                      background: 'rgba(5, 150, 105, 0.1)',
                      border: '1.5px solid rgba(5, 150, 105, 0.35)',
                      boxShadow: '4px 6px 12px rgba(5, 150, 105, 0.15), inset 2px 2px 3px rgba(255, 255, 255, 0.7)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>🎓</span>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>Student</span>
                    <span style={{ fontSize: '0.62rem', color: '#059669', fontWeight: 700 }}>Class 11</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemo('teacher@virtualvigyan.in', 'teacher123')}
                    className="clay-btn"
                    style={{
                      padding: '10px 8px',
                      borderRadius: 16,
                      background: 'rgba(2, 132, 199, 0.1)',
                      border: '1.5px solid rgba(2, 132, 199, 0.35)',
                      boxShadow: '4px 6px 12px rgba(2, 132, 199, 0.15), inset 2px 2px 3px rgba(255, 255, 255, 0.7)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>👨‍🏫</span>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>Teacher</span>
                    <span style={{ fontSize: '0.62rem', color: '#0284c7', fontWeight: 700 }}>Faculty</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemo('admin@virtualvigyan.in', 'admin123')}
                    className="clay-btn"
                    style={{
                      padding: '10px 8px',
                      borderRadius: 16,
                      background: 'rgba(124, 58, 237, 0.1)',
                      border: '1.5px solid rgba(124, 58, 237, 0.35)',
                      boxShadow: '4px 6px 12px rgba(124, 58, 237, 0.15), inset 2px 2px 3px rgba(255, 255, 255, 0.7)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>🛡️</span>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>Admin</span>
                    <span style={{ fontSize: '0.62rem', color: '#7c3aed', fontWeight: 700 }}>Moderator</span>
                  </button>
                </div>
                <p
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    marginTop: 10,
                    lineHeight: 1.45,
                    fontWeight: 500,
                  }}
                >
                  💡 Logging in as Admin automatically detects your role and launches the <strong>Admin & Moderator Command Center</strong>.
                </p>
              </div>
            </form>
          )}

          {/* ═══════════ TAB 2: REGISTRATION (STUDENT & TEACHER ONLY) ═══════════ */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Role Selection: Chunky Clay Cards */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    marginBottom: 10,
                    color: 'var(--text-primary)',
                  }}
                >
                  Choose Your Role:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div
                    onClick={() => setRegRole('student')}
                    className="clay-btn"
                    style={{
                      padding: '14px 16px',
                      borderRadius: 20,
                      background:
                        regRole === 'student'
                          ? 'linear-gradient(145deg, rgba(5, 150, 105, 0.15), rgba(16, 185, 129, 0.22))'
                          : 'var(--bg-secondary)',
                      border: `2px solid ${regRole === 'student' ? '#059669' : 'transparent'}`,
                      boxShadow:
                        regRole === 'student'
                          ? '6px 8px 18px rgba(5, 150, 105, 0.25), inset 2px 2px 4px rgba(255, 255, 255, 0.7)'
                          : 'var(--clay-input-shadow)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>🎓</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Student
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                        Simulate & Learn
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setRegRole('teacher')}
                    className="clay-btn"
                    style={{
                      padding: '14px 16px',
                      borderRadius: 20,
                      background:
                        regRole === 'teacher'
                          ? 'linear-gradient(145deg, rgba(2, 132, 199, 0.15), rgba(56, 189, 248, 0.22))'
                          : 'var(--bg-secondary)',
                      border: `2px solid ${regRole === 'teacher' ? '#0284c7' : 'transparent'}`,
                      boxShadow:
                        regRole === 'teacher'
                          ? '6px 8px 18px rgba(2, 132, 199, 0.25), inset 2px 2px 4px rgba(255, 255, 255, 0.7)'
                          : 'var(--clay-input-shadow)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>👨‍🏫</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Teacher
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600 }}>
                        Assign & Monitor
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: 6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={regRole === 'student' ? 'e.g. Ananya Sharma' : 'e.g. Dr. K. Raman'}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="clay-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: 6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="clay-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              {/* Role-Specific: Student Class & School */}
              {regRole === 'student' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        marginBottom: 6,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Class / Standard
                    </label>
                    <select
                      value={regGrade}
                      onChange={(e) => setRegGrade(e.target.value)}
                      className="clay-input"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Class 9">Class 9 (NCERT)</option>
                      <option value="Class 10">Class 10 (NCERT)</option>
                      <option value="Class 11">Class 11 (NCERT)</option>
                      <option value="Class 12">Class 12 (NCERT)</option>
                      <option value="F.Y. B.Tech">F.Y. B.Tech (DBATU)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        marginBottom: 6,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      School / College
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Model High School"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      className="clay-input"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Role-Specific: Teacher Department & Institution */}
              {regRole === 'teacher' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        marginBottom: 6,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Applied Chemistry"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="clay-input"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        marginBottom: 6,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Institution Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DBATU Lonere"
                      value={regInstitution}
                      onChange={(e) => setRegInstitution(e.target.value)}
                      className="clay-input"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: 6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Create Password (min. 6 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="clay-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              <button
                type="submit"
                id="btn-submit-register"
                disabled={isSubmitting}
                className={`clay-btn ${regRole === 'student' ? 'clay-btn-emerald' : 'clay-btn-blue'}`}
                style={{
                  marginTop: 6,
                  padding: '14px 20px',
                  borderRadius: 18,
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  opacity: isSubmitting ? 0.75 : 1,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                }}
              >
                <span>
                  {isSubmitting
                    ? 'Creating Account...'
                    : regRole === 'student'
                      ? '🎓 Register as Student'
                      : '👨‍🏫 Register as Teacher'}
                </span>
                <span>→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
