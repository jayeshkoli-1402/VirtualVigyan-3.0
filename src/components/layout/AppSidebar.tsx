import React from 'react';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';

export type NavItem =
  | 'home'
  | 'experiments'
  | 'classes'
  | 'theory-notes'
  | 'progress'
  | 'teacher'
  | 'settings'
  | 'about';

interface AppSidebarProps {
  activeTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  onReturnToLanding?: () => void;
  isMobile?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onSelectTab,
  onReturnToLanding,
  isMobile = false,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navLinks: Array<{ id: NavItem; label: string; icon: string }> = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'experiments', label: 'Browse Experiments', icon: '🧪' },
    { id: 'classes', label: 'My Classes', icon: '📚' },
    { id: 'theory-notes', label: 'Theory & Notes', icon: '📖' },
    { id: 'progress', label: 'Progress & Analytics', icon: '📊' },
    { id: 'teacher', label: 'Teacher Portal', icon: '👨‍🏫' },
  ];

  const secondaryNav = [
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ] as const;

  const handleNavClick = (tab: NavItem) => {
    onSelectTab(tab);
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
          onClick={() => {
            if (onReturnToLanding) onReturnToLanding();
            else handleNavClick('home');
          }}
          title="Return to VirtualVigyan Landing Page"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (onReturnToLanding) onReturnToLanding();
              else handleNavClick('home');
            }
          }}
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
          <VirtualVigyanLogo size={32} showText subtitle="Interactive Chemistry Lab" />
        </div>

        {/* Primary Nav Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navLinks.map((item) => {
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

          {/* Explicit Return to Landing Page Button */}
          {onReturnToLanding && (
            <button
              type="button"
              onClick={() => {
                onReturnToLanding();
                if (isMobile && onCloseMobile) onCloseMobile();
              }}
              title="Return to VirtualVigyan Landing Page"
              style={{
                width: '100%',
                border: '1px solid rgba(37, 99, 235, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '9px 14px',
                borderRadius: 10,
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#2563eb',
                background: 'rgba(37, 99, 235, 0.06)',
                marginTop: 6,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.15)';
              }}
            >
              <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>🌐</span>
              <span>Landing Page</span>
            </button>
          )}
        </nav>
      </div>

      {/* ── Bottom Section: Accessible Education Card & Brand Footer ── */}
      <div style={{ marginTop: 24, paddingTop: 12 }}>
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
