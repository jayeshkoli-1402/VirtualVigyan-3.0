import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface HeroBannerProps {
  onStartExploring: () => void;
  onViewHowItWorks: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartExploring,
  onViewHowItWorks,
}) => {
  const { t } = useLanguage();
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 18,
        background: 'linear-gradient(135deg, #13392d 0%, #174a39 50%, #0d281f 100%)',
        overflow: 'hidden',
        color: '#ffffff',
        padding: '36px 38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
        boxShadow: '0 12px 30px -6px rgba(19, 57, 45, 0.35)',
      }}
    >
      {/* ── Background Molecular Chemical Formulas (Faint watermark) ── */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.18,
        }}
        viewBox="0 0 1000 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Molecular Benzene Ring & Formula 1 */}
        <g stroke="#ffffff" strokeWidth="1.2">
          <polygon points="620,40 645,55 645,85 620,100 595,85 595,55" fill="none" />
          <line x1="620" y1="46" x2="639" y2="58" />
          <line x1="639" y1="80" x2="620" y2="92" />
          <line x1="601" y1="60" x2="601" y2="80" />
          {/* Bonds */}
          <line x1="620" y1="40" x2="620" y2="20" />
          <line x1="645" y1="85" x2="665" y2="96" />
        </g>
        <text x="612" y="15" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="600">
          CH₃
        </text>
        <text x="668" y="102" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="600">
          OH
        </text>

        {/* Molecular Formula 2 */}
        <g stroke="#ffffff" strokeWidth="1.2">
          <line x1="720" y1="60" x2="745" y2="45" />
          <line x1="745" y1="45" x2="770" y2="60" />
          <line x1="770" y1="60" x2="795" y2="45" />
          <line x1="745" y1="45" x2="745" y2="25" />
        </g>
        <text x="738" y="20" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="600">
          CH₃
        </text>
        <text x="798" y="50" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="600">
          OH
        </text>
      </svg>

      {/* ── Left Content: Title, Description & CTA Buttons ── */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 520 }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.1rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '0 0 10px 0',
            lineHeight: 1.15,
            color: '#ffffff',
          }}
        >
          {t('banner.heroHeading', 'Perform. Observe. Learn.')}
        </h1>
        <p
          style={{
            fontSize: '0.92rem',
            color: 'rgba(255, 255, 255, 0.82)',
            margin: '0 0 24px 0',
            lineHeight: 1.55,
            fontWeight: 400,
          }}
        >
          {t('banner.heroDesc', 'VirtualVigyan lets you perform chemistry experiments on your device. No lab, no limitations.')}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Primary Blue CTA Button */}
          <button
            id="btn-hero-start-exploring"
            onClick={onStartExploring}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#2563eb',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>▶</span>
            <span>{t('banner.startExploring', 'Start Exploring')}</span>
          </button>

          {/* Secondary Glass / Outline Button */}
          <button
            id="btn-hero-how-it-works"
            onClick={onViewHowItWorks}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 500,
              backdropFilter: 'blur(4px)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            {t('banner.viewHowItWorks', 'View How It Works')}
          </button>
        </div>
      </div>

      {/* ── Center & Right: 3D Chemical Glassware Illustration ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 36,
          flexShrink: 0,
        }}
      >
        {/* Chemical Glassware Graphic */}
        <div style={{ width: 220, height: 120, position: 'relative' }}>
          <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flaskCyanGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
              </linearGradient>
            </defs>

            {/* Test Tube Rack Stand */}
            <g transform="translate(10, 20)">
              {/* Stand bars */}
              <rect x="0" y="32" width="105" height="4" rx="2" fill="#475569" opacity="0.8" />
              <rect x="0" y="80" width="105" height="5" rx="2" fill="#334155" />
              <rect x="2" y="32" width="4" height="52" rx="2" fill="#334155" />
              <rect x="99" y="32" width="4" height="52" rx="2" fill="#334155" />

              {/* Tube 1: Cyan Solution */}
              <rect x="15" y="10" width="12" height="70" rx="6" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
              <path d="M 15 42 L 27 42 L 27 74 Q 27 80 21 80 Q 15 80 15 74 Z" fill="#06b6d4" opacity="0.9" />
              <ellipse cx="21" cy="42" rx="6" ry="1.5" fill="#67e8f9" />

              {/* Tube 2: Golden Amber Solution */}
              <rect x="36" y="10" width="12" height="70" rx="6" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
              <path d="M 36 34 L 48 34 L 48 74 Q 48 80 42 80 Q 36 80 36 74 Z" fill="#f59e0b" opacity="0.9" />
              <ellipse cx="42" cy="34" rx="6" ry="1.5" fill="#fde68a" />

              {/* Tube 3: Magenta Solution */}
              <rect x="57" y="10" width="12" height="70" rx="6" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
              <path d="M 57 26 L 69 26 L 69 74 Q 69 80 63 80 Q 57 80 57 74 Z" fill="#ec4899" opacity="0.9" />
              <ellipse cx="63" cy="26" rx="6" ry="1.5" fill="#fbcfe8" />

              {/* Tube 4: Emerald Green Solution */}
              <rect x="78" y="10" width="12" height="70" rx="6" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
              <path d="M 78 48 L 90 48 L 90 74 Q 90 80 84 80 Q 78 80 78 74 Z" fill="#10b981" opacity="0.9" />
              <ellipse cx="84" cy="48" rx="6" ry="1.5" fill="#a7f3d0" />
            </g>

            {/* Glowing Erlenmeyer / Volumetric Flask */}
            <g transform="translate(136, 16)">
              {/* Glowing Liquid Base */}
              <path
                d="M 28 6 L 28 34 L 6 86 Q 4 94 14 94 L 56 94 Q 66 94 64 86 L 42 34 L 42 6 Z"
                fill="url(#glassReflection)"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.2"
              />
              {/* Cyan solution with meniscus */}
              <path
                d="M 12 70 L 58 70 L 62 86 Q 64 92 56 92 L 14 92 Q 6 92 8 86 Z"
                fill="url(#flaskCyanGlow)"
                opacity="0.95"
              />
              <ellipse cx="35" cy="70" rx="23" ry="3.5" fill="#7dd3fc" />
              {/* Highlight gloss */}
              <path d="M 28 10 L 28 34 L 14 70" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Far Right Text & Green Accent Line */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.3 }}>
            {t('banner.same', 'Same')}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.3 }}>
            {t('banner.experiments', 'Experiments.')}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.3, marginBottom: 12 }}>
            {t('banner.moreAccess', 'More Access.')}
          </div>
          {/* Green Horizontal Bar */}
          <div
            style={{
              width: 38,
              height: 4,
              borderRadius: 2,
              background: '#10b981',
            }}
          />
        </div>
      </div>
    </div>
  );
};
