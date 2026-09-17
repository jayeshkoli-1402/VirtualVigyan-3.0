import React from 'react';

export interface VirtualVigyanLogoProps {
  /** Size variant or custom height in pixels (default: 'md') */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Whether to render the 'VirtualVigyan' typography alongside logo */
  showText?: boolean;
  /** Subtitle to render under logo title when showText is true */
  subtitle?: string;
  /** Custom CSS class names */
  className?: string;
  /** Custom inline styles for wrapper container */
  style?: React.CSSProperties;
  /** Optional click handler */
  onClick?: () => void;
  /** Accessible alt label */
  alt?: string;
}

const SIZE_MAP: Record<string, number> = {
  sm: 26,
  md: 36,
  lg: 48,
  xl: 64,
};

export const VirtualVigyanLogo: React.FC<VirtualVigyanLogoProps> = ({
  size = 'md',
  showText = false,
  subtitle,
  className = '',
  style = {},
  onClick,
  alt = 'VirtualVigyan Logo',
}) => {
  const logoHeight = typeof size === 'number' ? size : SIZE_MAP[size] || 36;
  const logoWidth = logoHeight; // Logo asset maintains 1:1 aspect ratio

  // Official logo asset with cache busting parameter to ensure latest asset load
  const logoSrc = '/virtualvigyan-logo.png?v=20260917';

  return (
    <div
      className={`virtualvigyan-logo-wrapper ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: showText ? (logoHeight < 32 ? 8 : 12) : 0,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        style={{
          width: logoWidth,
          height: logoHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: 'transparent',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <img
          src={logoSrc}
          alt={alt}
          width={logoWidth}
          height={logoHeight}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            flexShrink: 0,
          }}
          onError={(e) => {
            // Safe fallback if server path differs
            const target = e.currentTarget;
            if (!target.src.endsWith('.svg')) {
              target.src = '/virtualvigyan-logo.svg';
            }
          }}
        />
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              fontSize: logoHeight < 32 ? '0.95rem' : logoHeight < 48 ? '1.15rem' : '1.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            VirtualVigyan
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: logoHeight < 32 ? '0.62rem' : '0.72rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default VirtualVigyanLogo;
