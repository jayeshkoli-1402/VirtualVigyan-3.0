import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';

interface TopHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenAuthModal: () => void;
  onNavigateToAuth?: (initialRole?: 'student' | 'teacher') => void;
  onOpenAdminPanel?: () => void;
  onOpenJoinLab?: () => void;
  onToggleMobileSidebar?: () => void;
  isMobile?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
  onOpenAuthModal,
  onNavigateToAuth,
  onOpenAdminPanel,
  onOpenJoinLab,
  onToggleMobileSidebar,
  isMobile = false,
}) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K shortcut listener to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Display name & initials
  const displayName = user ? user.name : t('nav.guest', 'Guest');
  const displayRole = user
    ? (user.role === 'teacher' ? t('nav.teacher', 'Teacher') : user.role === 'admin' ? t('nav.admin', 'Admin') : t('nav.student', 'Student'))
    : t('nav.login', 'Sign In');
  const initials = user
    ? user.name
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('') || 'U'
    : '🔑';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 64,
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Left Side: Mobile Menu Button + Search Input ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, maxWidth: 540 }}>
        {isMobile && (
          <button
            onClick={onToggleMobileSidebar}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 8,
              background: 'var(--bg-secondary)',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ☰
          </button>
        )}

        {/* Pill Search Box */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: 440,
          }}
        >
          {/* Search Magnifying Glass Icon */}
          <span
            style={{
              position: 'absolute',
              left: 14,
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          >
            🔍
          </span>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('common.searchPlaceholder', 'Search experiments (e.g. titration, pH, salt analysis...)')}
            style={{
              width: '100%',
              padding: '9px 70px 9px 38px',
              borderRadius: 9999,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              outline: 'none',
              transition: 'all 0.15s ease',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.background = 'var(--bg-card)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />

          {/* Keyboard shortcut badge: Ctrl K */}
          <div
            style={{
              position: 'absolute',
              right: 12,
              padding: '2px 7px',
              borderRadius: 5,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              fontSize: '0.67rem',
              fontWeight: 600,
              fontFamily: 'monospace',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          >
            Ctrl K
          </div>
        </div>
      </div>

      {/* ── Right Side: Language, Theme Toggle & Profile Info ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language Selector */}
        <LanguageSelector variant="pill" />

        {/* Theme Dropdown / Toggle Button */}
        <div style={{ position: 'relative' }}>
          <button
            id="btn-theme-dropdown"
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 9999,
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{theme === 'light' ? '☀️' : '🌙'}</span>
            <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>˅</span>
          </button>

          {/* Theme Dropdown Menu */}
          {themeMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 40,
                right: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                boxShadow: 'var(--shadow-md)',
                padding: 4,
                width: 120,
                zIndex: 100,
              }}
            >
              <button
                onClick={() => {
                  if (theme !== 'light') onToggleTheme();
                  setThemeMenuOpen(false);
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                }}
              >
                <span>☀️</span>
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  if (theme !== 'dark') onToggleTheme();
                  setThemeMenuOpen(false);
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                }}
              >
                <span>🌙</span>
                <span>Dark</span>
              </button>
            </div>
          )}
        </div>

        {/* Join Lab Shortcut Button (Strictly visible only to students) */}
        {user?.role === 'student' && onOpenJoinLab && (
          <button
            id="btn-header-join-lab"
            onClick={onOpenJoinLab}
            title="Join a Classroom or Assessment with Lab Code"
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 13px',
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🔑</span>
            <span>Join Lab</span>
          </button>
        )}

        {/* Admin Command Center Quick Launch Button (Visible to Admins) */}
        {user?.role === 'admin' && onOpenAdminPanel && (
          <button
            id="btn-header-admin-command"
            onClick={onOpenAdminPanel}
            title="Open Admin & Moderator Command Center"
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 13px',
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🛡️</span>
            <span>Admin Center</span>
          </button>
        )}

        {/* User Profile / Auth Trigger Area */}
        <div style={{ position: 'relative' }}>
          {user ? (
            <button
              id="btn-user-profile-menu"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '4px 8px 4px 4px',
                borderRadius: 9999,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Circle Avatar with Initials */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: user.role === 'teacher' ? '#0284c7' : user.role === 'admin' ? '#7c3aed' : '#059669',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>

              {/* User Name & Role */}
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {displayName}
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>{displayRole}</span>
                  <span style={{ fontSize: '0.6rem' }}>˅</span>
                </div>
              </div>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                id="btn-header-sign-in"
                onClick={() => (onNavigateToAuth ? onNavigateToAuth('student') : onOpenAuthModal())}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 14px',
                  borderRadius: 9999,
                  background: 'linear-gradient(135deg, #059669, #0284c7)',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>🎓</span>
                <span>{t('nav.login', 'Sign In')}</span>
              </button>

              <button
                id="btn-header-teacher-portal"
                onClick={() => (onNavigateToAuth ? onNavigateToAuth('teacher') : onOpenAuthModal())}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 9999,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                }}
              >
                <span>👨‍🏫</span>
                <span>{t('nav.teacher', 'Teacher')}</span>
              </button>
            </div>
          )}

          {/* Profile Dropdown Menu (when logged in) */}
          {user && profileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 46,
                right: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                boxShadow: 'var(--shadow-lg)',
                padding: '8px 6px',
                width: 220,
                zIndex: 100,
              }}
            >
              <div style={{ padding: '6px 12px 10px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {user.email}
                </div>
              </div>

              {/* Quick links */}
              <div style={{ padding: '6px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {user.role === 'admin' && onOpenAdminPanel && (
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenAdminPanel();
                    }}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: '0.78rem',
                      color: '#7c3aed',
                      fontWeight: 700,
                      boxSizing: 'border-box',
                    }}
                  >
                    <span>🛡️</span>
                    <span>{t('layout.adminCenter', 'Admin Command Center')}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    if (onNavigateToAuth) onNavigateToAuth('student');
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box',
                  }}
                >
                  <span>🔐</span>
                  <span>{t('layout.switchAccount', 'Auth Page / Switch Account')}</span>
                </button>
              </div>

              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  setProfileMenuOpen(false);
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'block',
                  width: '100%',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  color: '#dc2626',
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              >
                {t('common.signOut', 'Sign Out')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
