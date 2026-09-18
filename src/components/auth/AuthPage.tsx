import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import type { UserRole } from '../../auth/types';

interface AuthPageProps {
  onBackToLab: () => void;
  onRoleRedirect: (role: UserRole) => void;
  initialRole?: 'student' | 'teacher';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onBackToLab,
  onRoleRedirect,
  initialRole = 'student',
  theme,
  onToggleTheme,
}) => {
  const { user, login, register, logout } = useAuth();

  // Active role portal: 'student' | 'teacher'
  const [activeRole, setActiveRole] = useState<'student' | 'teacher'>(
    initialRole === 'teacher' ? 'teacher' : 'student'
  );

  // Authentication mode: 'signin' | 'register'
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Student login form
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [rememberStudent, setRememberStudent] = useState(true);

  // Teacher login form
  const [teacherIdentifier, setTeacherIdentifier] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);
  const [rememberTeacher, setRememberTeacher] = useState(true);

  // Registration form
  const [regRole, setRegRole] = useState<'student' | 'teacher'>(
    initialRole === 'teacher' ? 'teacher' : 'student'
  );
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regGrade, setRegGrade] = useState('Class 11 (CBSE/State)');
  const [regSchool, setRegSchool] = useState('');
  const [regInstitution, setRegInstitution] = useState('');
  const [regDepartment, setRegDepartment] = useState('Department of Chemistry');
  const [regTeacherId, setRegTeacherId] = useState('');

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset errors when changing role
  const handleRoleChange = (role: 'student' | 'teacher') => {
    setActiveRole(role);
    setAuthMode('signin');
    setRegRole(role);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Submit Student Login
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(studentIdentifier, studentPassword);
      setIsSubmitting(false);

      if (res.success && res.role) {
        if (res.role === 'admin') {
          setSuccessMessage('Administrator verified! Full Lab & Command Center Access Granted. Redirecting...');
        } else {
          setSuccessMessage(`Welcome back! Logged in as ${res.role === 'student' ? 'Student' : res.role}. Redirecting...`);
        }
        setTimeout(() => {
          onRoleRedirect(res.role!);
        }, 600);
      } else {
        setErrorMessage(res.message || 'Invalid student credentials.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Sign-in failed. Please try again.');
    }
  };

  // Submit Teacher Login
  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(teacherIdentifier, teacherPassword);
      setIsSubmitting(false);

      if (res.success && res.role) {
        if (res.role === 'admin') {
          setSuccessMessage('Administrator verified! Full Lab & Command Center Access Granted. Redirecting...');
        } else {
          setSuccessMessage('Faculty access verified. Redirecting to Teacher Dashboard...');
        }
        setTimeout(() => {
          onRoleRedirect(res.role!);
        }, 600);
      } else {
        setErrorMessage(res.message || 'Invalid faculty credentials. Check your email or Teacher ID.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Sign-in failed. Please check your credentials.');
    }
  };

  // Submit Registration
  const handleRegister = async (e: React.FormEvent) => {
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
        setSuccessMessage('Account created successfully! Redirecting to your workspace...');
        setTimeout(() => {
          onRoleRedirect(res.role!);
        }, 700);
      } else {
        setErrorMessage(res.message || 'Registration encountered an issue.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          theme === 'dark'
            ? 'radial-gradient(ellipse at top, #111b2b 0%, #0a0d14 100%)'
            : 'radial-gradient(ellipse at top, #f0f7ff 0%, #f9fafb 100%)',
        color: 'var(--text-primary)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Background Decorative Chemical Floating Elements */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '4%',
          fontSize: '4.5rem',
          opacity: theme === 'dark' ? 0.04 : 0.06,
          fontWeight: 900,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        H₂SO₄ + Zn
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '4%',
          fontSize: '5rem',
          opacity: theme === 'dark' ? 0.04 : 0.06,
          fontWeight: 900,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        HCl + NaOH
      </div>

      {/* ── Top Navigation Bar ── */}
      <header
        style={{
          height: 64,
          padding: '0 28px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {/* Left: Back to Lab button & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            id="btn-auth-back-to-lab"
            onClick={onBackToLab}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 14px',
              borderRadius: 10,
              fontSize: '0.82rem',
              fontWeight: 600,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <span>←</span>
            <span>Return to Chemistry Lab</span>
          </button>

          <div style={{ height: 20, width: 1, background: 'var(--border)' }} />

          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={onBackToLab}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #059669, #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
              }}
            >
              ⚗️
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: 'var(--text-primary)',
                }}
              >
                VirtualVigyan
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                Tactile Chemistry Lab Platform
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active user indicator & Theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 12px',
                borderRadius: 20,
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                fontSize: '0.78rem',
              }}
            >
              <span>{user.avatar || '👤'}</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</span>
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: user.role === 'teacher' ? '#0284c7' : user.role === 'admin' ? '#7c3aed' : '#059669',
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {user.role}
              </span>
              <button
                onClick={logout}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  color: '#ef4444',
                  fontWeight: 700,
                  marginLeft: 4,
                }}
              >
                (Sign Out)
              </button>
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              transition: 'all 0.15s ease',
            }}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '36px 20px 48px',
          maxWidth: 620,
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          zIndex: 1,
        }}
      >
        {/* Page Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: 24, width: '100%' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 9999,
              background:
                activeRole === 'student'
                  ? 'rgba(5, 150, 105, 0.12)'
                  : 'rgba(2, 132, 199, 0.12)',
              color:
                activeRole === 'student'
                  ? '#059669'
                  : '#0284c7',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            <span>{activeRole === 'student' ? '🎓 Student Portal' : '👨‍🏫 Teacher Portal'}</span>
            <span>•</span>
            <span>NCERT / CBSE Curriculum</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              margin: '0 0 6px',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}
          >
            {activeRole === 'student'
              ? authMode === 'signin'
                ? 'Student Login'
                : 'Create Student Account'
              : authMode === 'signin'
                ? 'Teacher Login'
                : 'Create Faculty Account'}
          </h1>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            {activeRole === 'student'
              ? authMode === 'signin'
                ? 'Sign in to perform chemistry experiments, calculate results, and track lab scores.'
                : 'Register as a student to explore 3D chemistry lab simulations and track your progress.'
              : authMode === 'signin'
                ? 'Sign in to manage student cohorts, review progress, and assign lab experiments.'
                : 'Register faculty credentials to manage student classes, track lab scores, and customize experiments.'}
          </p>
        </div>

        {/* ── Role Selector Pill Tabs (Student & Teacher Only - No separate register tab) ── */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-card)',
            padding: 5,
            borderRadius: 16,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 20,
            width: '100%',
            gap: 6,
          }}
        >
          {/* Student Portal Tab */}
          <button
            id="tab-btn-student-login"
            type="button"
            onClick={() => handleRoleChange('student')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              flex: 1,
              padding: '11px 16px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: '0.88rem',
              fontWeight: activeRole === 'student' ? 700 : 500,
              background:
                activeRole === 'student'
                  ? 'linear-gradient(135deg, #059669, #0d9488)'
                  : 'transparent',
              color: activeRole === 'student' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow:
                activeRole === 'student'
                  ? '0 4px 12px rgba(5, 150, 105, 0.3)'
                  : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1.05rem' }}>🎓</span>
            <span>Student Portal</span>
          </button>

          {/* Teacher Portal Tab */}
          <button
            id="tab-btn-teacher-login"
            type="button"
            onClick={() => handleRoleChange('teacher')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              flex: 1,
              padding: '10px 16px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: '0.88rem',
              fontWeight: activeRole === 'teacher' ? 700 : 500,
              background:
                activeRole === 'teacher'
                  ? 'linear-gradient(135deg, #2563eb, #0284c7)'
                  : 'transparent',
              color: activeRole === 'teacher' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow:
                activeRole === 'teacher'
                  ? '0 4px 12px rgba(37, 99, 235, 0.3)'
                  : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1.05rem' }}>👨‍🏫</span>
            <span>Teacher Portal</span>
          </button>
        </div>

        {/* ── Status Messages (Toasts) ── */}
        {errorMessage && (
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: 12,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <span style={{ fontSize: 18 }}>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* ── Main Centered Authentication Card ── */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: 22,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            padding: '32px 30px',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          {/* ══════════════════════════════════════════════
              PORTAL 1: STUDENT (SIGN IN & REGISTER)
             ══════════════════════════════════════════════ */}
          {activeRole === 'student' && authMode === 'signin' && (
            <form onSubmit={handleStudentLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(5, 150, 105, 0.12)',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  🎓
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Student Sign In</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Access your virtual lab experiments and calculation history
                  </p>
                </div>
              </div>

              {/* Email / Roll No. field */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: 6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Student Email or Roll Number
                </label>
                <input
                  id="input-student-identifier"
                  type="text"
                  required
                  value={studentIdentifier}
                  onChange={(e) => setStudentIdentifier(e.target.value)}
                  placeholder="e.g. student@virtualvigyan.in or aarav"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Password field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Student Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                      color: '#059669',
                      fontWeight: 600,
                    }}
                  >
                    {showStudentPassword ? '🙈 Hide' : '👁️ Show'}
                  </button>
                </div>
                <input
                  id="input-student-password"
                  type={showStudentPassword ? 'text' : 'password'}
                  required
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  placeholder="Enter your student password"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Remember me */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberStudent}
                    onChange={(e) => setRememberStudent(e.target.checked)}
                    style={{ accentColor: '#059669' }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>Remember my credentials</span>
                </label>
              </div>

              {/* Submit button */}
              <button
                id="btn-submit-student-login"
                type="submit"
                disabled={isSubmitting}
                style={{
                  all: 'unset',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 20px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #059669, #0d9488)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                  transition: 'all 0.15s ease',
                  marginTop: 4,
                }}
              >
                <span>{isSubmitting ? 'Verifying Student Credentials...' : 'Sign In as Student'}</span>
                <span>→</span>
              </button>

              {/* Register below sign in */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: 14,
                  paddingTop: 16,
                  borderTop: '1px solid var(--border)',
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Don't have an account? </span>
                <button
                  id="btn-switch-to-student-register"
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setRegRole('student');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    color: '#059669',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    marginLeft: 4,
                  }}
                >
                  Create account
                </button>
              </div>
            </form>
          )}

          {activeRole === 'student' && authMode === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(5, 150, 105, 0.12)',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  🎓
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Student Registration</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Create your student profile to access interactive chemistry laboratories
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                  Full Name
                </label>
                <input
                  id="input-reg-student-name"
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rohan Verma"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Email Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                  Email Address
                </label>
                <input
                  id="input-reg-student-email"
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@school.edu.in"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{ all: 'unset', cursor: 'pointer', fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}
                  >
                    {showRegPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  id="input-reg-student-password"
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create password (min 6 chars)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Grade & School */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                    Class / Grade
                  </label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Class 9">Class 9 (CBSE)</option>
                    <option value="Class 10">Class 10 (CBSE)</option>
                    <option value="Class 11 (CBSE/State)">Class 11 (Science)</option>
                    <option value="Class 12 (CBSE/State)">Class 12 (Science)</option>
                    <option value="F.Y. Engineering / B.Tech">F.Y. Engineering / B.Tech</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                    School / Institute
                  </label>
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="e.g. Kendriya Vidyalaya"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Submit Register */}
              <button
                id="btn-submit-student-registration"
                type="submit"
                disabled={isSubmitting}
                style={{
                  all: 'unset',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #059669, #0d9488)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                  transition: 'all 0.15s ease',
                  marginTop: 6,
                }}
              >
                <span>{isSubmitting ? 'Registering Student...' : 'Register as Student'}</span>
                <span>→</span>
              </button>

              {/* Back to sign in */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: 14,
                  paddingTop: 16,
                  borderTop: '1px solid var(--border)',
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Already have a student account? </span>
                <button
                  id="btn-switch-to-student-login"
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    color: '#059669',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    marginLeft: 4,
                  }}
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════════
              PORTAL 2: TEACHER (SIGN IN & REGISTER)
             ══════════════════════════════════════════════ */}
          {activeRole === 'teacher' && authMode === 'signin' && (
            <form onSubmit={handleTeacherLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(37, 99, 235, 0.12)',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  👨‍🏫
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Faculty Sign In</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Access Teacher Console, cohort analytics, and student evaluation
                  </p>
                </div>
              </div>

              {/* Email / Teacher ID */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: 6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Faculty Email or Teacher ID
                </label>
                <input
                  id="input-teacher-identifier"
                  type="text"
                  required
                  value={teacherIdentifier}
                  onChange={(e) => setTeacherIdentifier(e.target.value)}
                  placeholder="e.g. teacher@virtualvigyan.in or T-CHEM-884"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Password field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Faculty Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTeacherPassword(!showTeacherPassword)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                      color: '#2563eb',
                      fontWeight: 600,
                    }}
                  >
                    {showTeacherPassword ? '🙈 Hide' : '👁️ Show'}
                  </button>
                </div>
                <input
                  id="input-teacher-password"
                  type={showTeacherPassword ? 'text' : 'password'}
                  required
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="Enter your faculty password"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Remember session */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberTeacher}
                    onChange={(e) => setRememberTeacher(e.target.checked)}
                    style={{ accentColor: '#2563eb' }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>Remember faculty session</span>
                </label>
              </div>

              {/* Submit button */}
              <button
                id="btn-submit-teacher-login"
                type="submit"
                disabled={isSubmitting}
                style={{
                  all: 'unset',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 20px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  transition: 'all 0.15s ease',
                  marginTop: 4,
                }}
              >
                <span>{isSubmitting ? 'Authenticating Faculty...' : 'Sign In as Faculty'}</span>
                <span>→</span>
              </button>

              {/* Register below sign in */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: 14,
                  paddingTop: 16,
                  borderTop: '1px solid var(--border)',
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Don't have a faculty account? </span>
                <button
                  id="btn-switch-to-teacher-register"
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setRegRole('teacher');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    color: '#2563eb',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    marginLeft: 4,
                  }}
                >
                  Create account
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════════
              TEACHER REGISTRATION FORM
             ══════════════════════════════════════════════ */}
          {activeRole === 'teacher' && authMode === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(37, 99, 235, 0.12)',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  👨‍🏫
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Faculty Registration</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Register as a chemistry teacher or professor to oversee virtual labs and classes
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                  Full Name
                </label>
                <input
                  id="input-reg-teacher-name"
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Dr. Ananya Sen"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Email Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                  Faculty Email Address
                </label>
                <input
                  id="input-reg-teacher-email"
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="faculty@institution.edu.in"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{ all: 'unset', cursor: 'pointer', fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}
                  >
                    {showRegPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  id="input-reg-teacher-password"
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create password (min 6 chars)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Institution & Teacher ID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={regInstitution}
                    onChange={(e) => setRegInstitution(e.target.value)}
                    placeholder="e.g. DBATU / KV Public School"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                    Teacher ID
                  </label>
                  <input
                    type="text"
                    value={regTeacherId}
                    onChange={(e) => setRegTeacherId(e.target.value)}
                    placeholder="e.g. T-CHEM-902"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                  Department
                </label>
                <input
                  type="text"
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  placeholder="e.g. Department of Chemistry & Applied Sciences"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Submit Register */}
              <button
                id="btn-submit-teacher-registration"
                type="submit"
                disabled={isSubmitting}
                style={{
                  all: 'unset',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.15s ease',
                  marginTop: 6,
                }}
              >
                <span>{isSubmitting ? 'Registering Faculty...' : 'Register as Teacher'}</span>
                <span>→</span>
              </button>

              {/* Back to sign in */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: 14,
                  paddingTop: 16,
                  borderTop: '1px solid var(--border)',
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Already have a faculty account? </span>
                <button
                  id="btn-switch-to-teacher-login"
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    color: '#2563eb',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    marginLeft: 4,
                  }}
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
