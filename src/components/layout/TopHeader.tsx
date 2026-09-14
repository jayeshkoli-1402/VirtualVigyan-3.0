import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';

interface TopHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenAuthModal: () => void;
  onToggleMobileSidebar?: () => void;
  isMobile?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
  onOpenAuthModal,
  onToggleMobileSidebar,
  isMobile = false,
}) => {
  const { user, logout, changeUserRole } = useAuth();
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
  const displayName = user?.name || 'Prof. Rajesh Sharma';
  const displayRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Teacher';
  const initials = displayName
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('') || 'RS';

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
            placeholder="Search experiments (e.g. titration, pH, salt analysis...)"
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

      {/* ── Right Side: Theme Toggle & Profile Info ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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

        {/* User Profile Area */}
        <div style={{ position: 'relative' }}>
          <button
            id="btn-user-profile-menu"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '4px 6px 4px 4px',
              borderRadius: 9999,
              transition: 'all 0.15s ease',
            }}
          >
            {/* Circle Avatar with Initials */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#14382c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.84rem',
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
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {displayName}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
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

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 48,
                right: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                boxShadow: 'var(--shadow-lg)',
                padding: '8px 6px',
                width: 200,
                zIndex: 100,
              }}
            >
              <div style={{ padding: '6px 12px 10px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {user?.email || 'rajesh.sharma@dbatu.ac.in'}
                </div>
              </div>

              {/* Role Switcher */}
              <div style={{ padding: '6px 12px', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Active Role
              </div>
              {(['student', 'teacher', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    if (user && changeUserRole) changeUserRole(user.id, r);
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: '0.78rem',
                    color: (user?.role || 'teacher') === r ? '#2563eb' : 'var(--text-secondary)',
                    fontWeight: (user?.role || 'teacher') === r ? 700 : 500,
                    boxSizing: 'border-box',
                  }}
                >
                  <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                  {(user?.role || 'teacher') === r && <span>✓</span>}
                </button>
              ))}

              <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

              {/* Logout / Login Switch */}
              {user ? (
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
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuthModal();
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
                    color: '#2563eb',
                    fontWeight: 600,
                    boxSizing: 'border-box',
                  }}
                >
                  Sign In / Register
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
