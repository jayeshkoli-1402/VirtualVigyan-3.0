import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/types';

interface LanguageSelectorProps {
  variant?: 'pill' | 'dropdown' | 'buttons';
  className?: string;
  style?: React.CSSProperties;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'pill',
  className = '',
  style = {},
}) => {
  const { language, setLanguage } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Compact Pill variant: 🌐 EN | हि | म
  if (variant === 'pill') {
    return (
      <div
        className={`vv-lang-selector ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 2,
          padding: '2px 4px',
          borderRadius: 9999,
          border: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-xs)',
          ...style,
        }}
        role="group"
        aria-label="Language Selector"
      >
        <span
          style={{
            fontSize: '0.82rem',
            padding: '0 4px 0 6px',
            color: 'var(--text-muted)',
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          🌐
        </span>

        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              title={`${lang.label} (${lang.nativeLabel})`}
              aria-label={`Switch to ${lang.label}`}
              aria-pressed={isActive}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '3px 8px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-blue, #2563eb)' : 'transparent',
                transition: 'all 0.15s ease',
                lineHeight: 1.2,
                userSelect: 'none',
              }}
            >
              {lang.code === 'en' ? 'EN' : lang.code === 'hi' ? 'हि' : 'म'}
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Full Buttons variant (e.g. inside Settings Modal)
  if (variant === 'buttons') {
    return (
      <div
        className={`vv-lang-buttons ${className}`}
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          ...style,
        }}
        role="group"
        aria-label="Language Selection"
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              aria-pressed={isActive}
              style={{
                all: 'unset',
                cursor: 'pointer',
                flex: 1,
                minWidth: 100,
                padding: '8px 12px',
                borderRadius: 8,
                border: isActive
                  ? '1.5px solid var(--accent-blue, #2563eb)'
                  : '1px solid var(--border)',
                background: isActive
                  ? 'rgba(37, 99, 235, 0.08)'
                  : 'var(--bg-secondary)',
                color: isActive ? 'var(--accent-blue, #2563eb)' : 'var(--text-primary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.84rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <span>{lang.nativeLabel}</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                ({lang.label})
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // 3. Dropdown variant
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div
      ref={containerRef}
      className={`vv-lang-dropdown ${className}`}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-haspopup="listbox"
        aria-label="Select Language"
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          fontSize: '0.78rem',
          fontWeight: 600,
          transition: 'all 0.15s ease',
        }}
      >
        <span>🌐</span>
        <span>{currentLang.nativeLabel}</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>▼</span>
      </button>

      {dropdownOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            boxShadow: 'var(--shadow-md)',
            padding: 4,
            minWidth: 140,
            zIndex: 1000,
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setLanguage(lang.code);
                  setDropdownOpen(false);
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '7px 12px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-blue, #2563eb)' : 'var(--text-primary)',
                  background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  boxSizing: 'border-box',
                }}
              >
                <span>{lang.nativeLabel}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {lang.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
