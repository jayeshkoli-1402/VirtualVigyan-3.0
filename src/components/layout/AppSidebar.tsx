import React from 'react';
import { useAuth } from '../../auth/AuthContext';

export type NavItem =
  | 'home'
  | 'experiments'
  | 'classes'
  | 'theory-notes'
  | 'progress'
  | 'teacher'
  | 'admin'
  | 'auth'
  | 'settings'
  | 'about';

interface AppSidebarProps {
  activeTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  onNavigateToAuth?: (initialRole?: 'student' | 'teacher') => void;
  isMobile?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onSelectTab,
  onNavigateToAuth,
  isMobile = false,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const basePrimaryNav = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'experiments', label: 'Experiments', icon: '🧪' },
    { id: 'classes', label: 'Classes', icon: '📖' },
    { id: 'theory-notes', label: 'Theory & Notes', icon: '📄' },
    { id: 'progress', label: 'My Progress', icon: '📈' },
    { id: 'teacher', label: 'Teacher Portal', icon: '👥' },
  ] as const;

  const primaryNav = user?.role === 'admin'
    ? [
        ...basePrimaryNav,
        { id: 'admin' as const, label: 'Admin Panel', icon: '🛡️' },
      ]
    : basePrimaryNav;

  const secondaryNav = [
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ] as const;

  const handleNavClick = (id: NavItem) => {
    onSelectTab(id);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      id="app-sidebar"
      style={{
        width: 240,
        minWidth: 240,
        height: '100vh',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: isMobile ? (isOpenMobile ? 0 : -260) : 0,
        zIndex: 100,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 16px',
        boxSizing: 'border-box',
        transition: 'left 0.25s ease',
        overflowY: 'auto',
      }}
    >
      {/* ── Top Section: Logo & Primary Navigation ── */}
      <div>
        {/* Brand Logo Header */}
        <div
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 8px 24px',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border)',
            marginBottom: 16,
          }}
        >
          {/* Beaker / Flask SVG Icon */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(37, 99, 235, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 3H15M10 3V8L4.5 18C3.8 19.3 4.8 21 6.3 21H17.7C19.2 21 20.2 19.3 19.5 18L14 8V3"
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 16C8.5 15 10 16.5 12 15.5C14 14.5 15.5 16 17.5 15.5L18.5 18C18.2 18.5 17.8 19 17 19H7C6.2 19 5.8 18.5 5.5 18L6.5 16Z"
                fill="#38bdf8"
                opacity="0.8"
              />
            </svg>
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.08rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              VirtualVigyan
            </div>
            <div
              style={{
                fontSize: '0.66rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              Interactive Chemistry Lab
            </div>
          </div>
        </div>

        {/* Primary Nav Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {primaryNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 14px',
                  borderRadius: 10,
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#2563eb' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', margin: '14px 8px' }} />

        {/* Secondary Nav Menu (Settings & About) */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {secondaryNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 14px',
                  borderRadius: 10,
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#2563eb' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom Section: Account Card & Accessible Education ── */}
      <div style={{ marginTop: 20, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        {/* User Account / Auth Card */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 14,
            background: user
              ? 'var(--bg-secondary)'
              : 'linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(2, 132, 199, 0.08))',
            border: '1px solid var(--border)',
            marginBottom: 12,
          }}
        >
          {user ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 16 }}>{user.avatar || '👤'}</span>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.name}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: user.role === 'teacher' ? '#0284c7' : user.role === 'admin' ? '#7c3aed' : '#059669',
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {user.role}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => handleNavClick('admin')}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#7c3aed',
                      }}
                    >
                      🛡️ Admin Panel
                    </button>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>•</span>
                  </>
                )}
                <button
                  onClick={() => {
                    if (onNavigateToAuth) onNavigateToAuth(user.role === 'teacher' ? 'teacher' : 'student');
                    if (isMobile && onCloseMobile) onCloseMobile();
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#2563eb',
                  }}
                >
                  Switch / Re-login
                </button>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>•</span>
                <button
                  onClick={logout}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#ef4444',
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
                Student & Teacher Portal
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.25 }}>
                Sign in to save scores and manage lab cohorts.
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  id="btn-sidebar-student-login"
                  onClick={() => {
                    if (onNavigateToAuth) onNavigateToAuth('student');
                    if (isMobile && onCloseMobile) onCloseMobile();
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: 8,
                    background: '#059669',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.25)',
                  }}
                >
                  🎓 Student
                </button>
                <button
                  id="btn-sidebar-teacher-login"
                  onClick={() => {
                    if (onNavigateToAuth) onNavigateToAuth('teacher');
                    if (isMobile && onCloseMobile) onCloseMobile();
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: 8,
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
                  }}
                >
                  👨‍🏫 Teacher
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Leaf / Mission Card */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              color: '#ffffff',
              flexShrink: 0,
            }}
          >
            🌱
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
            }}
          >
            Accessible Education for a Brighter Tomorrow
          </div>
        </div>

        {/* Small Muted Footer */}
        <div style={{ padding: '0 4px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            VirtualVigyan
          </div>
          <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: 1 }}>
            For Every Student, Everywhere
          </div>
        </div>
      </div>
    </aside>
  );
};
