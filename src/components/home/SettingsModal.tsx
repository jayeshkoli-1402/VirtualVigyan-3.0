import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
}) => {
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [haptics, setHaptics] = useState(true);

  if (!isOpen) return null;

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
        backdropFilter: 'blur(8px)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'var(--bg-card)',
          borderRadius: 16,
          border: '1px solid var(--border)',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-overlay)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Lab Environment Settings
          </h3>
          <button
            onClick={onClose}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Theme setting */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Visual Interface Theme
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Toggle between high-clarity Light mode and Dark room mode.
              </div>
            </div>
            <button
              onClick={onToggleTheme}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 8,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Sound effects */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Apparatus Sound Effects
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Pouring liquid sounds, gas pop, and cork clicks.
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
            />
          </div>

          {/* Micro-animations */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Fluid Dynamics Animations
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Smooth meniscus rise, liquid vortex, and droplet trails.
              </div>
            </div>
            <input
              type="checkbox"
              checked={animations}
              onChange={(e) => setAnimations(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
            />
          </div>

          {/* Haptic touch */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Snap & Drop Assistance
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Haptic magnetic alignment onto retort stands & balances.
              </div>
            </div>
            <input
              type="checkbox"
              checked={haptics}
              onChange={(e) => setHaptics(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
            />
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            all: 'unset',
            cursor: 'pointer',
            marginTop: 24,
            width: '100%',
            textAlign: 'center',
            padding: '10px 0',
            borderRadius: 8,
            background: '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.84rem',
            boxSizing: 'border-box',
          }}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
