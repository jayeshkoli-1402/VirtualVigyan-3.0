import React, { useState } from 'react';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';

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
  const { t } = useLanguage();
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
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          borderRadius: 16,
          border: '1px solid var(--border)',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-overlay)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VirtualVigyanLogo size={28} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {t('settings.title', 'Lab Environment Settings')}
            </h3>
          </div>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Language selection setting */}
          <div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {t('settings.languageTitle', 'Interface Language')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('settings.languageDesc', 'Select your preferred language. All lab instructions and controls will update immediately.')}
              </div>
            </div>
            <LanguageSelector variant="buttons" />
          </div>

          {/* Theme setting */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {t('settings.themeTitle', 'Visual Interface Theme')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('settings.themeDesc', 'Toggle between high-clarity Light mode and Dark room mode.')}
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
              {theme === 'light' ? `☀️ ${t('common.lightMode', 'Light')}` : `🌙 ${t('common.darkMode', 'Dark')}`}
            </button>
          </div>

          {/* Sound effects */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {t('settings.soundEffects', 'Apparatus Sound Effects')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('settings.soundEffectsDesc', 'Pouring liquid sounds, gas pop, and cork clicks.')}
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
                {t('settings.animations', 'Fluid Dynamics Animations')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('settings.animationsDesc', 'Realistic liquid meniscus, droplet physics, and bubbling visuals.')}
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
                {t('settings.haptics', 'Interactive Tactile Haptics')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('settings.hapticsDesc', 'Tactile confirmation when snapping glassware into place.')}
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
          {t('common.save', 'Save Preferences')}
        </button>
      </div>
    </div>
  );
};
