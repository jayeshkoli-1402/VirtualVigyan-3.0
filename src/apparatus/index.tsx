/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Apparatus Component Registry
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Central registry mapping apparatus component names (strings used
 *  in experiment configs) to React SVG components.
 *
 *  Each apparatus component accepts standardized ApparatusProps.
 *  Configs reference components by name — the registry resolves them
 *  at runtime.
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';

// ── Standard Apparatus Props ─────────────────────────────────────

export type ApparatusProps = {
  /** Unique ID for this apparatus instance */
  id: string;

  /** Liquid fill level 0-1 (0 = empty, 1 = full) */
  liquidLevel?: number;

  /** CSS color of the liquid */
  liquidColor?: string;

  /** Text label rendered on/near the apparatus */
  label?: string;

  /** Current apparatus state */
  state?: 'empty' | 'filling' | 'full' | 'pouring' | 'heating';

  /** Whether this apparatus is highlighted (e.g., as a drop target) */
  highlighted?: boolean;

  /** Scale factor for rendering */
  scale?: number;

  /** Width of the SVG viewport */
  width?: number;

  /** Height of the SVG viewport */
  height?: number;

  /** Experiment state flags */
  flags?: Record<string, boolean>;

  /** Experiment state variables */
  variables?: Record<string, number>;

  /** Additional dynamic props from experiment state */
  extraProps?: Record<string, unknown>;

  /** Arbitrary dynamic props */
  [key: string]: unknown;
};


// ── Generic Conical Flask ────────────────────────────────────────

const ConicalFlask: React.FC<ApparatusProps> = ({
  id = 'conical-flask',
  liquidLevel = 0,
  liquidColor = 'rgba(224, 242, 254, 0.45)',
  label,
  highlighted = false,
  width = 120,
  height = 140,
  flags = {},
  extraProps = {},
}) => {
  const isSwirling = Boolean(flags?.swirling || extraProps?.swirling || flags?.shaking || extraProps?.shaking);
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  // Total fillable height from bottom base (y=121) up to near neck (y=56) is ~65px
  const fillHeight = 65 * effectiveLevel;
  const fillY = 121 - fillHeight;

  // Linear interpolation for conical slope:
  // At y=121 (bottom base), half-width is 43 (width 86).
  // At y=48 (neck base), half-width is 15 (width 30).
  const slopeFraction = (121 - fillY) / 73;
  const halfW = 43 - slopeFraction * 28;
  const gradId = `flaskLiquid-${id || 'def'}`;

  return (
    <svg width={width} height={height} viewBox="0 0 120 140" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={`flaskInnerClip-${id || 'def'}`}>
          <path d="M 46 14 L 46 48 L 17 114 Q 15 122 25 122 L 95 122 Q 105 122 103 114 L 74 48 L 74 14 Z" />
        </clipPath>

        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.75" />
          <stop offset="40%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.88" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.98" />
        </linearGradient>

        <linearGradient id={`glassGleam-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
        </linearGradient>
      </defs>

      {/* Outer shadow / glow when highlighted */}
      {highlighted && (
        <path
          d="M 45 12 L 45 48 L 15 114 Q 13 124 25 124 L 95 124 Q 107 124 105 114 L 75 48 L 75 12 Z"
          stroke="#3b82f6"
          strokeWidth="6"
          opacity="0.5"
          filter="blur(3px)"
        />
      )}

      {/* Flask Glass Back Wall */}
      <path
        d="M 46 14 L 46 48 L 17 114 Q 15 122 25 122 L 95 122 Q 105 122 103 114 L 74 48 L 74 14 Z"
        fill="rgba(241, 245, 249, 0.2)"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* ── Liquid Fill with Accurate Conical Geometry & Meniscus ── */}
      <g id="flask-liquid-layer">
        {/* Main liquid body conforming to inner glass outline */}
        <rect
          x="10"
          y={fillY}
          width="100"
          height="130"
          fill={`url(#${gradId})`}
          clipPath={`url(#flaskInnerClip-${id || 'def'})`}
          style={{
            transition: 'y 2.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease',
            opacity: effectiveLevel > 0 ? 1 : 0,
          }}
        />

        {/* Meniscus surface ellipse */}
        <ellipse
          cx="60"
          cy={fillY}
          rx={Math.max(1, halfW - 0.5)}
          ry={Math.min(3, 1 + halfW * 0.05)}
          fill="rgba(255, 255, 255, 0.3)"
          stroke={liquidColor}
          strokeWidth="0.8"
          clipPath={`url(#flaskInnerClip-${id || 'def'})`}
          style={{
            transition: 'cy 2.2s cubic-bezier(0.25, 1, 0.5, 1), rx 2.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, stroke 2.2s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: effectiveLevel > 0 ? 0.9 : 0,
          }}
        />

        {/* Liquid surface light reflection gleam */}
        <ellipse
          cx="60"
          cy={fillY - 0.3}
          rx={Math.max(1, halfW * 0.65)}
          ry={Math.min(1.5, 0.6 + halfW * 0.02)}
          fill="rgba(255, 255, 255, 0.5)"
          clipPath={`url(#flaskInnerClip-${id || 'def'})`}
          style={{
            transition: 'cy 2.2s cubic-bezier(0.25, 1, 0.5, 1), rx 2.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease',
            opacity: effectiveLevel > 0 ? 0.7 : 0,
          }}
        />

        {/* ── Dynamic Swirling Vortex Effect (when swirling/shaking) ── */}
        {isSwirling && effectiveLevel > 0 && (
          <g clipPath={`url(#flaskInnerClip-${id || 'def'})`}>
            {/* Center vortex ring */}
            <ellipse cx="60" cy={fillY + 6} rx={halfW * 0.45} ry={3.5} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2">
              <animateTransform attributeName="transform" type="rotate" from={`0 60 ${fillY + 6}`} to={`360 60 ${fillY + 6}`} dur="0.6s" repeatCount="indefinite" />
            </ellipse>
            {/* Swirling streamlines */}
            <path
              d={`M ${60 - halfW * 0.5} ${fillY + 14} Q 60 ${fillY + 18} ${60 + halfW * 0.5} ${fillY + 14}`}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.2"
              fill="none"
            >
              <animateTransform attributeName="transform" type="rotate" from={`0 60 ${fillY + 14}`} to={`360 60 ${fillY + 14}`} dur="0.5s" repeatCount="indefinite" />
            </path>
            <path
              d={`M ${60 - halfW * 0.35} ${fillY + 28} Q 60 ${fillY + 32} ${60 + halfW * 0.35} ${fillY + 28}`}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              fill="none"
            >
              <animateTransform attributeName="transform" type="rotate" from={`0 60 ${fillY + 28}`} to={`-360 60 ${fillY + 28}`} dur="0.6s" repeatCount="indefinite" />
            </path>
          </g>
        )}
      </g>

      {/* ── Glass Front Wall & Specular Highlights ── */}
      {/* Front outline */}
      <path
        d="M 46 14 L 46 48 L 17 114 Q 15 122 25 122 L 95 122 Q 105 122 103 114 L 74 48 L 74 14"
        stroke={highlighted ? '#2563eb' : '#64748b'}
        strokeWidth="2.2"
        fill="none"
      />

      {/* Reinforced Glass Lip / Rim */}
      <ellipse cx="60" cy="14" rx="15" ry="3.5" fill="rgba(241, 245, 249, 0.4)" stroke="#64748b" strokeWidth="2.2" />
      <ellipse cx="60" cy="14" rx="12" ry="2.5" fill="rgba(255, 255, 255, 0.2)" stroke="#94a3b8" strokeWidth="1" />

      {/* Specular highlight streak down left slope */}
      <path
        d="M 48 50 L 21 112"
        stroke="url(#glassGleam-def)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Secondary highlight along right wall */}
      <path
        d="M 72 50 L 99 112"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Glass base bottom bevel */}
      <line x1="26" y1="123.5" x2="94" y2="123.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Volume Graduations etched on glass */}
      {[
        { level: 0.25, label: '50mL', y: 104, x: 23, len: 9 },
        { level: 0.5, label: '100mL', y: 88, x: 30, len: 11 },
        { level: 0.75, label: '150mL', y: 72, x: 37, len: 11 },
        { level: 1.0, label: '200mL', y: 56, x: 44, len: 9 },
      ].map((g, i) => (
        <g key={i}>
          <line x1={g.x} y1={g.y} x2={g.x + g.len} y2={g.y} stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
          <line x1={g.x} y1={g.y} x2={g.x + g.len} y2={g.y} stroke="#64748b" strokeWidth="0.8" />
          <text x={g.x + g.len + 3} y={g.y + 2.5} fontSize="6" fill="#64748b" fontFamily="var(--font-mono, monospace)">
            {g.label}
          </text>
        </g>
      ))}

      {/* Label */}
      {label && (
        <text
          x="60"
          y="136"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="var(--text-secondary, #475569)"
          fontFamily="var(--font-sans)"
        >
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Generic Beaker ───────────────────────────────────────────────

const Beaker: React.FC<ApparatusProps> = ({
  id = 'beaker',
  liquidLevel = 0,
  liquidColor = 'rgba(224, 242, 254, 0.45)',
  label,
  highlighted = false,
  width = 100,
  height = 120,
  flags = {},
  extraProps = {},
}) => {
  const isStirring = Boolean(flags?.stirring || extraProps?.stirring);
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  // Total fillable height in beaker is ~80px (from y=108 up to y=28)
  const fillHeight = 80 * effectiveLevel;
  const fillY = 108 - fillHeight;
  const gradId = `beakerLiquid-${id || 'def'}`;

  return (
    <svg width={width} height={height} viewBox="0 0 100 120" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={`beakerInnerClip-${id || 'def'}`}>
          <path d="M 18 16 L 18 102 Q 18 110 26 110 L 74 110 Q 82 110 82 102 L 82 16 Z" />
        </clipPath>

        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.75" />
          <stop offset="40%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.88" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.98" />
        </linearGradient>

        <linearGradient id={`beakerGleam-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
        </linearGradient>
      </defs>

      {/* Outer shadow / glow when highlighted */}
      {highlighted && (
        <path
          d="M 16 16 L 16 102 Q 16 112 26 112 L 74 112 Q 84 112 84 102 L 84 16"
          stroke="#3b82f6"
          strokeWidth="6"
          opacity="0.5"
          filter="blur(3px)"
        />
      )}

      {/* Beaker Glass Back Wall */}
      <path
        d="M 18 16 L 18 102 Q 18 110 26 110 L 74 110 Q 82 110 82 102 L 82 16"
        fill="rgba(241, 245, 249, 0.2)"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* ── Liquid Fill with Meniscus ── */}
      <g id="beaker-liquid-layer">
        {/* Main liquid body following beaker bottom curves */}
        <rect
          x="18"
          y={fillY}
          width="64"
          height="110"
          fill={`url(#${gradId})`}
          clipPath={`url(#beakerInnerClip-${id || 'def'})`}
          style={{
            transition: 'y 2.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease',
            opacity: effectiveLevel > 0 ? 1 : 0,
          }}
        />

        {/* Meniscus surface ellipse */}
        <ellipse
          cx="50"
          cy={fillY}
          rx="31"
          ry="3"
          fill="rgba(255, 255, 255, 0.3)"
          stroke={liquidColor}
          strokeWidth="0.8"
          clipPath={`url(#beakerInnerClip-${id || 'def'})`}
          style={{
            transition: 'cy 2.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, stroke 2.2s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: effectiveLevel > 0 ? 0.9 : 0,
          }}
        />

        {/* Liquid surface highlight gleam */}
        <ellipse
          cx="50"
          cy={fillY - 0.3}
          rx="20"
          ry="1.2"
          fill="rgba(255, 255, 255, 0.45)"
          clipPath={`url(#beakerInnerClip-${id || 'def'})`}
          style={{
            transition: 'cy 2.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease',
            opacity: effectiveLevel > 0 ? 0.7 : 0,
          }}
        />

        {/* ── Dynamic Magnetic Stirring Vortex & Spin Bar ── */}
        {isStirring && (
          <g transform="translate(50, 105)">
            {/* Rapidly spinning PTFE magnetic stir bar */}
            <rect x="-7" y="-2.5" width="14" height="5" rx="2.5" fill="#ffffff" stroke="#475569" strokeWidth="0.8">
              <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="0.3s" repeatCount="indefinite" />
            </rect>

            {/* Central vortex streamlines */}
            {effectiveLevel > 0 && (
              <g clipPath={`url(#beakerInnerClip-${id || 'def'})`}>
                <ellipse cx="0" cy={fillY - 105 + 5} rx="12" ry="3" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2">
                  <animateTransform attributeName="transform" type="rotate" from={`0 0 ${fillY - 105 + 5}`} to={`360 0 ${fillY - 105 + 5}`} dur="0.4s" repeatCount="indefinite" />
                </ellipse>
                <circle cx="0" cy={fillY - 105 + 18} r="6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="3 3">
                  <animateTransform attributeName="transform" type="rotate" from={`0 0 ${fillY - 105 + 18}`} to={`-360 0 ${fillY - 105 + 18}`} dur="0.45s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </g>
        )}
      </g>

      {/* ── Glass Front Wall & Highlights ── */}
      {/* Front glass outline */}
      <path
        d="M 18 16 L 18 102 Q 18 110 26 110 L 74 110 Q 82 110 82 102 L 82 16"
        stroke={highlighted ? '#2563eb' : '#64748b'}
        strokeWidth="2.2"
        fill="none"
      />

      {/* Spout on left */}
      <path
        d="M 18 16 C 12 16 9 18 7 22 C 11 24 15 22 18 20"
        stroke={highlighted ? '#2563eb' : '#64748b'}
        strokeWidth="2"
        fill="rgba(241, 245, 249, 0.3)"
      />

      {/* Glass left specular highlight streak */}
      <line x1="22" y1="24" x2="22" y2="100" stroke="url(#beakerGleam-def)" strokeWidth="2.2" strokeLinecap="round" />
      {/* Glass right specular edge */}
      <line x1="78" y1="24" x2="78" y2="100" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />

      {/* Beaker Rim */}
      <line x1="18" y1="16" x2="82" y2="16" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />

      {/* Volume Graduations */}
      {[25, 50, 75, 100].map((ml, i) => {
        const y = 108 - (i + 1) * 19;
        return (
          <g key={ml}>
            <line x1="74" y1={y} x2={82} y2={y} stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <line x1="74" y1={y} x2={82} y2={y} stroke="#64748b" strokeWidth="0.8" />
            <text x="71" y={y + 2.5} textAnchor="end" fontSize="6.5" fill="#64748b" fontFamily="var(--font-mono, monospace)">
              {ml}
            </text>
          </g>
        );
      })}

      {/* Label */}
      {label && (
        <text
          x="50"
          y="118"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="var(--text-secondary, #475569)"
          fontFamily="var(--font-sans)"
        >
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Generic Test Tube ────────────────────────────────────────────

const TestTube: React.FC<ApparatusProps> = ({
  id = 'test-tube',
  liquidLevel = 0,
  liquidColor = 'rgba(56, 189, 248, 0.55)',
  label,
  highlighted = false,
  width = 76,
  height = 230,
  flags,
  hasZinc,
  isReacting,
  popEffect,
}) => {
  // Check flags or explicit props for state
  const showZinc = Boolean(hasZinc || flags?.zincAdded);
  const isEvolvingGas = Boolean(isReacting || flags?.reactionStarted || flags?.gasEvolving);
  const showPop = Boolean(popEffect || flags?.popSoundHeard);

  // Liquid geometry
  // Tube body: x from 22 to 54 (width 32). Tube height: 18 to 195 (lip at 18, bottom curved at 195).
  // Total tube height is ~175.
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  const maxFill = 150;
  const fillHeight = maxFill * effectiveLevel;
  const liquidTopY = 195 - fillHeight;
  const gradId = `ttLiquidGrad-${id || 'def'}`;

  return (
    <svg width={width} height={height} viewBox="0 0 76 230" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        {/* Glass reflection gradient */}
        <linearGradient id={`ttGlassStreak-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>

        {/* Liquid depth gradient */}
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.8" />
          <stop offset="35%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.88" />
          <stop offset="85%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.95" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="1" />
        </linearGradient>

        {/* Zinc metallic gradient */}
        <linearGradient id="zincGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Outer shadow / glow when highlighted */}
      {highlighted && (
        <path
          d="M 20 18 L 20 190 Q 20 216 38 216 Q 56 216 56 190 L 56 18"
          stroke="#3b82f6"
          strokeWidth="6"
          opacity="0.5"
          filter="blur(3px)"
        />
      )}

      {/* Tube Glass Back Wall */}
      <path
        d="M 22 18 L 22 192 Q 22 214 38 214 Q 54 214 54 192 L 54 18"
        fill="rgba(241, 245, 249, 0.25)"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* ── Liquid Fill with Meniscus ── */}
      {effectiveLevel > 0 && (
        <g>
          {/* Main liquid body */}
          <path
            d={`M 23 ${liquidTopY}
                L 23 192
                Q 23 213 38 213
                Q 53 213 53 192
                L 53 ${liquidTopY}
                Z`}
            fill={`url(#${gradId})`}
            style={{ transition: 'd 2.0s cubic-bezier(0.25, 1, 0.5, 1), fill 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          {/* Curved Meniscus surface */}
          <ellipse
            cx="38"
            cy={liquidTopY}
            rx="15"
            ry="3.5"
            fill="rgba(255, 255, 255, 0.4)"
            stroke={liquidColor}
            strokeWidth="0.8"
            opacity="0.85"
            style={{ transition: 'all 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }}
          />
          {/* Liquid highlight line */}
          <line
            x1="26"
            y1={liquidTopY + 2}
            x2="50"
            y2={liquidTopY + 2}
            stroke="rgba(255, 255, 255, 0.6)"
            style={{ transition: 'all 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }}
            strokeWidth="1"
          />
        </g>
      )}

      {/* ── Zinc Granules at the bottom ── */}
      {showZinc && (
        <g id="zinc-granules">
          {/* Granule 1 */}
          <polygon points="30,205 35,199 40,202 38,209 32,210" fill="url(#zincGrad)" stroke="#334155" strokeWidth="0.8" />
          {/* Granule 2 */}
          <polygon points="26,201 31,196 36,198 33,205 27,204" fill="url(#zincGrad)" stroke="#334155" strokeWidth="0.8" />
          {/* Granule 3 */}
          <polygon points="37,202 43,197 48,203 45,208 39,207" fill="url(#zincGrad)" stroke="#334155" strokeWidth="0.8" />
          {/* Granule 4 */}
          <polygon points="32,197 38,193 42,196 37,201 31,200" fill="#64748b" stroke="#334155" strokeWidth="0.7" />
          {/* Metallic highlight gleams */}
          <circle cx="34" cy="199" r="1" fill="#f8fafc" />
          <circle cx="41" cy="203" r="1" fill="#f8fafc" />
          <circle cx="30" cy="204" r="0.8" fill="#f8fafc" />
        </g>
      )}

      {/* ── Effervescence / Hydrogen Bubbles (when reacting) ── */}
      {isEvolvingGas && (
        <g id="effervescence-bubbles">
          {/* Bubble Stream 1 */}
          <circle cx="31" cy="195" r="2.2" fill="rgba(255,255,255,0.85)" stroke="#0284c7" strokeWidth="0.5">
            <animate attributeName="cy" values="200;130;70" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;1;0" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="cx" values="31;33;30" dur="1.2s" repeatCount="indefinite" />
          </circle>

          {/* Bubble Stream 2 */}
          <circle cx="38" cy="190" r="3.2" fill="rgba(255,255,255,0.9)" stroke="#0284c7" strokeWidth="0.5">
            <animate attributeName="cy" values="195;120;65" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;1;0" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="cx" values="38;36;39" dur="0.9s" repeatCount="indefinite" />
          </circle>

          {/* Bubble Stream 3 */}
          <circle cx="44" cy="198" r="2.6" fill="rgba(255,255,255,0.85)" stroke="#0284c7" strokeWidth="0.5">
            <animate attributeName="cy" values="202;140;68" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;1;0" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="cx" values="44;46;43" dur="1.4s" repeatCount="indefinite" />
          </circle>

          {/* Bubble Stream 4 (fast microbubbles) */}
          <circle cx="35" cy="180" r="1.6" fill="#ffffff">
            <animate attributeName="cy" values="190;110;60" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0" dur="0.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="41" cy="185" r="1.8" fill="#ffffff">
            <animate attributeName="cy" values="195;115;62" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0" dur="0.8s" repeatCount="indefinite" />
          </circle>

          {/* Surface fizzing bubbles at meniscus */}
          <circle cx="30" cy={liquidTopY - 1} r="2" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" strokeWidth="0.5">
            <animate attributeName="r" values="1;2.5;0" dur="0.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="38" cy={liquidTopY - 2} r="2.5" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" strokeWidth="0.5">
            <animate attributeName="r" values="1.5;3;0" dur="0.35s" repeatCount="indefinite" />
          </circle>
          <circle cx="45" cy={liquidTopY - 1} r="2" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" strokeWidth="0.5">
            <animate attributeName="r" values="1;2.2;0" dur="0.45s" repeatCount="indefinite" />
          </circle>

          {/* Rising H2 gas vapor wisps at mouth */}
          <path d="M 33 16 Q 30 6 36 0" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" strokeDasharray="3,3" fill="none">
            <animate attributeName="stroke-dashoffset" values="6;0" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.8;0" dur="1s" repeatCount="indefinite" />
          </path>
          <path d="M 42 16 Q 46 8 40 -2" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" strokeDasharray="3,3" fill="none">
            <animate attributeName="stroke-dashoffset" values="6;0" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.9;0" dur="1.2s" repeatCount="indefinite" />
          </path>
        </g>
      )}

      {/* ── Glass Front Wall & Highlights ── */}
      {/* Front glass outline */}
      <path
        d="M 22 18 L 22 192 Q 22 214 38 214 Q 54 214 54 192 L 54 18"
        stroke={highlighted ? '#2563eb' : '#64748b'}
        strokeWidth="2.2"
        fill="none"
      />

      {/* Glass left specular highlight streak */}
      <line x1="25" y1="24" x2="25" y2="188" stroke={`url(#ttGlassStreak-${id || 'def'})`} strokeWidth="2" strokeLinecap="round" />
      {/* Glass right specular edge */}
      <line x1="51" y1="24" x2="51" y2="188" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />

      {/* Flared Glass Lip / Rim at Top */}
      <ellipse cx="38" cy="18" rx="18" ry="4.5" fill="rgba(241, 245, 249, 0.4)" stroke="#64748b" strokeWidth="2.2" />
      <ellipse cx="38" cy="18" rx="14" ry="3.2" fill="rgba(255, 255, 255, 0.2)" stroke="#94a3b8" strokeWidth="1" />

      {/* Volume Graduations etched on glass */}
      {[
        { y: 65, label: '4mL' },
        { y: 100, label: '3mL' },
        { y: 135, label: '2mL' },
        { y: 170, label: '1mL' },
      ].map((g, i) => (
        <g key={i}>
          <line x1="22" y1={g.y} x2="30" y2={g.y} stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
          <line x1="22" y1={g.y} x2="30" y2={g.y} stroke="#475569" strokeWidth="0.8" />
          <text x="32" y={g.y + 2.5} fontSize="6" fill="#64748b" fontFamily="var(--font-mono)">
            {g.label}
          </text>
        </g>
      ))}

      {/* ── POP Reaction Flame / Flash Effect ── */}
      {showPop && (
        <g id="pop-burst" transform="translate(38, 14)">
          {/* Yellow flame burst */}
          <polygon
            points="0,-25 8,-12 22,-16 14,-4 25,6 10,8 6,22 -4,12 -18,18 -12,4 -24,-4 -10,-10"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1.5"
          >
            <animate attributeName="transform" type="scale" values="0.8;1.3;1" dur="0.4s" />
          </polygon>
          {/* Inner orange flame */}
          <polygon
            points="0,-16 5,-8 14,-10 9,-2 16,4 6,5 4,14 -2,8 -12,12 -8,2 -15,-2 -6,-6"
            fill="#ef4444"
          />
          {/* Comic POP speech bubble */}
          <g transform="translate(18, -24)">
            <rect x="0" y="0" width="46" height="22" rx="6" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
            <text x="23" y="15" textAnchor="middle" fontSize="11" fontWeight="800" fill="#dc2626" fontFamily="var(--font-sans)">
              💥 POP!
            </text>
          </g>
        </g>
      )}

      {/* Label under tube */}
      {label && (
        <text
          x="38"
          y="226"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="var(--text-secondary)"
          fontFamily="var(--font-sans)"
        >
          {label}
        </text>
      )}
    </svg>
  );
};



// ── Standard 50 mL Calibrated Burette (Matching Class 11 Titration Lab) ──

const BuretteSVG: React.FC<ApparatusProps> = ({
  id = 'burette',
  liquidLevel: _liquidLevel = 0,
  liquidColor = 'rgba(37, 99, 235, 0.35)',
  label,
  highlighted = false,
  width = 90,
  height = 280,
  flags = {},
  variables = {},
  extraProps = {},
}) => {
  const [localOpen, setLocalOpen] = React.useState(0);
  const isPointerDownRef = React.useRef(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const hasMovedRef = React.useRef(false);
  const startOpenRef = React.useRef(0);

  const parentOpen = (extraProps?.stopcockOpen as number | undefined) ?? (variables.stopcockOpen ?? undefined);
  const stopcockOpen = parentOpen !== undefined ? parentOpen : localOpen;
  const isTitrating = Boolean(
    stopcockOpen > 0 ||
    flags?.isTitrating ||
    extraProps?.isTitrating ||
    flags?.titrating ||
    extraProps?.titrating
  );

  const handleSetOpen = React.useCallback((openVal: number) => {
    const clamped = Math.max(0, Math.min(1, Math.round(openVal * 100) / 100));
    setLocalOpen(clamped);
    if (typeof extraProps?.onSetStopcock === 'function') {
      (extraProps.onSetStopcock as (v: number) => void)(clamped);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('burette_stopcock_change', { detail: { open: clamped, id } }));
    }
  }, [extraProps, id]);

  const stepUpFlow = React.useCallback(() => {
    let nextOpen = 0.20;
    if (stopcockOpen === 0) nextOpen = 0.20;
    else if (stopcockOpen < 0.35) nextOpen = 0.50;
    else if (stopcockOpen < 0.70) nextOpen = 0.80;
    else nextOpen = 1.00;
    handleSetOpen(nextOpen);
  }, [stopcockOpen, handleSetOpen]);

  const stepDownFlow = React.useCallback(() => {
    let nextOpen = 0;
    if (stopcockOpen > 0.85) nextOpen = 0.50;
    else if (stopcockOpen > 0.35) nextOpen = 0.20;
    else nextOpen = 0;
    handleSetOpen(nextOpen);
  }, [stopcockOpen, handleSetOpen]);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    isPointerDownRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    startOpenRef.current = stopcockOpen;
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  }, [stopcockOpen]);

  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    if (!hasMovedRef.current && Math.hypot(deltaX, deltaY) > 5) {
      hasMovedRef.current = true;
    }
    if (hasMovedRef.current) {
      const dragDelta = (deltaY - deltaX) / 60;
      const newOpen = Math.max(0, Math.min(1, startOpenRef.current + dragDelta));
      handleSetOpen(newOpen);
    }
  }, [handleSetOpen]);

  const handlePointerUp = React.useCallback((e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    try {
      if ((e.currentTarget as Element).hasPointerCapture?.(e.pointerId)) {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      }
    } catch {
      // fallback
    }
    if (!hasMovedRef.current) {
      const rect = (e.currentTarget as Element).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX >= rect.width / 2) {
        stepUpFlow();
      } else {
        stepDownFlow();
      }
    }
  }, [stepUpFlow, stepDownFlow]);

  const currentVolume =
    (variables.volumeAdded ?? 0) +
    (variables.buretteReading ?? 0) +
    (variables.kohVolume ?? 0) +
    (variables.naohVolume ?? 0) +
    (variables.volumeA ?? 0) +
    (variables.volumeB ?? 0) +
    (variables.stdEdtaVolume ?? 0) +
    (variables.sampleEdtaVolume ?? 0) +
    (variables.thiosulphateVolume ?? 0);
  const maxVolume = 50;
  const hasVolumeVar =
    variables.volumeAdded !== undefined ||
    variables.buretteReading !== undefined ||
    variables.kohVolume !== undefined ||
    variables.naohVolume !== undefined ||
    variables.volumeA !== undefined ||
    variables.volumeB !== undefined ||
    variables.stdEdtaVolume !== undefined ||
    variables.sampleEdtaVolume !== undefined ||
    variables.thiosulphateVolume !== undefined;

  const isBuretteFilled = Boolean(
    flags?.buretteFilled === true ||
    extraProps?.buretteFilled === true ||
    extraProps?.isFilled === true ||
    flags?.['burette-filled'] === true
  );

  const effectiveLevel = isBuretteFilled
    ? Math.max(0, Math.min(1, (maxVolume - currentVolume) / maxVolume))
    : 0;

  // Visual parameters matching Class 11 Burette (scaled for 90x280 viewBox)
  const buretteX = 40;
  const buretteWidth = 18;
  const buretteTop = 20;
  const buretteHeight = 180;
  const buretteBottom = buretteTop + buretteHeight; // y = 200
  const liquidTop = buretteBottom - buretteHeight * effectiveLevel;
  const tapAngle = stopcockOpen * 90;

  const getFlowText = () => {
    if (stopcockOpen === 0) return 'Tap Closed (0°)';
    if (stopcockOpen <= 0.25) return `💧 Slow Drop (${Math.round(stopcockOpen * 100)}%)`;
    if (stopcockOpen <= 0.60) return `💧 Fast Drop (${Math.round(stopcockOpen * 100)}%)`;
    if (stopcockOpen <= 0.85) return `🌊 Rapid Flow (${Math.round(stopcockOpen * 100)}%)`;
    return `🌊 Full Stream (${Math.round(stopcockOpen * 100)}%)`;
  };

  // Graduation marks: 1 mL, 5 mL, and 10 mL bold
  const graduations = [];
  for (let ml = 0; ml <= 50; ml += 5) {
    const y = buretteTop + (ml / 50) * buretteHeight;
    const isLarge = ml % 10 === 0;
    graduations.push(
      <g key={ml}>
        <line
          x1={buretteX - buretteWidth / 2 - (isLarge ? 6 : 3.5)}
          y1={y}
          x2={buretteX - buretteWidth / 2}
          y2={y}
          stroke="#475569"
          strokeWidth={isLarge ? 0.9 : 0.6}
        />
        {isLarge && (
          <text
            x={buretteX - buretteWidth / 2 - 8}
            y={y + 2.5}
            textAnchor="end"
            fill="#334155"
            fontSize="6"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={700}
          >
            {ml}
          </text>
        )}
      </g>
    );
  }

  for (let ml = 0; ml <= 50; ml += 1) {
    if (ml % 5 !== 0) {
      const y = buretteTop + (ml / 50) * buretteHeight;
      graduations.push(
        <line
          key={`s-${ml}`}
          x1={buretteX - buretteWidth / 2 - 2}
          y1={y}
          x2={buretteX - buretteWidth / 2}
          y2={y}
          stroke="#94a3b8"
          strokeWidth={0.4}
        />
      );
    }
  }

  return (
    <svg width={width} height={height} viewBox="0 0 90 280" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`buretteLiquidGrad-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.85" />
          <stop offset="35%" stopColor={liquidColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id={`buretteGlassGrad-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>
      </defs>

      {/* Upper Glass Rim */}
      <ellipse
        cx={buretteX}
        cy={buretteTop}
        rx={buretteWidth / 2}
        ry={2}
        fill="#ffffff"
        stroke={highlighted ? '#2563eb' : '#94a3b8'}
        strokeWidth={1}
      />

      {/* Main Glass Barrel Cylinder */}
      <rect
        x={buretteX - buretteWidth / 2}
        y={buretteTop}
        width={buretteWidth}
        height={buretteHeight}
        fill="rgba(241, 245, 249, 0.25)"
        stroke={highlighted ? '#2563eb' : '#94a3b8'}
        strokeWidth={1.2}
      />

      {/* Glass Tapered Lower Neck */}
      <polygon
        points={`${buretteX - buretteWidth / 2},${buretteBottom} ${buretteX + buretteWidth / 2},${buretteBottom} ${buretteX + 4},${buretteBottom + 12} ${buretteX - 4},${buretteBottom + 12}`}
        fill="rgba(241, 245, 249, 0.3)"
        stroke="#94a3b8"
        strokeWidth={1}
      />

      {/* ── Liquid Column in Burette ── */}
      {effectiveLevel > 0 && (
        <g id="burette-liquid">
          {/* Main Liquid Body in Cylinder */}
          <rect
            x={buretteX - buretteWidth / 2 + 0.8}
            y={liquidTop}
            width={buretteWidth - 1.6}
            height={buretteBottom - liquidTop}
            fill={`url(#buretteLiquidGrad-${id || 'def'})`}
            style={{ transition: 'y 0.15s linear, height 0.15s linear' }}
          />

          {/* Liquid filling Lower Tapered Neck & Stopcock & Tip */}
          <polygon
            points={`${buretteX - buretteWidth / 2 + 0.8},${buretteBottom} ${buretteX + buretteWidth / 2 - 0.8},${buretteBottom} ${buretteX + 3.5},${buretteBottom + 12} ${buretteX - 3.5},${buretteBottom + 12}`}
            fill={liquidColor}
          />
          <rect
            x={buretteX - 4}
            y={buretteBottom + 12}
            width={8}
            height={8}
            fill={liquidColor}
          />
          <polygon
            points={`${buretteX - 2.5},${buretteBottom + 20} ${buretteX + 2.5},${buretteBottom + 20} ${buretteX + 0.8},${buretteBottom + 36} ${buretteX - 0.8},${buretteBottom + 36}`}
            fill={liquidColor}
          />

          {/* Fluid Dynamics: Realistic Concave Liquid Meniscus Curve */}
          <path
            d={`M ${buretteX - buretteWidth / 2 + 0.8} ${liquidTop} Q ${buretteX} ${liquidTop + 2.5} ${buretteX + buretteWidth / 2 - 0.8} ${liquidTop}`}
            fill="none"
            stroke="rgba(29, 78, 216, 0.7)"
            strokeWidth={1}
            style={{ transition: 'd 0.15s linear' }}
          />
        </g>
      )}

      {/* Stopcock Valve Barrel Housing (y: buretteBottom + 12 .. buretteBottom + 20) */}
      <rect
        x={buretteX - 5.5}
        y={buretteBottom + 12}
        width={11}
        height={8}
        rx={1.5}
        fill="#cbd5e1"
        stroke="#64748b"
        strokeWidth={1}
      />

      {/* ── INTERACTIVE ROTATABLE STOPCOCK / CORK VALVE WITH DIRECTIONAL WINGS ── */}
      <g
        id="stopcock-interactive-valve"
        style={{ cursor: 'pointer', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Invisible enlarged hit circle for dragging */}
        <circle cx={buretteX} cy={buretteBottom + 16} r={22} fill="rgba(0,0,0,0.001)" />

        {/* Rotatable Cork Key / Handle */}
        <g
          transform={`rotate(${tapAngle}, ${buretteX}, ${buretteBottom + 16})`}
          style={{ transition: isPointerDownRef.current ? 'none' : 'transform 0.18s ease-out' }}
        >
          {/* Central plug */}
          <circle cx={buretteX} cy={buretteBottom + 16} r={3} fill="#1e293b" stroke="#475569" strokeWidth={0.8} />
          {/* Left Wing Lever (Close / Slow) */}
          <rect
            x={buretteX - 10}
            y={buretteBottom + 14.5}
            width={10}
            height={3}
            rx={1.5}
            fill={stopcockOpen > 0 ? '#2563eb' : '#475569'}
            stroke={stopcockOpen > 0 ? '#1d4ed8' : '#334155'}
            strokeWidth={0.7}
          />
          {/* Right Wing Lever (Open / Faster) */}
          <rect
            x={buretteX}
            y={buretteBottom + 14.5}
            width={10}
            height={3}
            rx={1.5}
            fill={stopcockOpen > 0 ? '#2563eb' : '#475569'}
            stroke={stopcockOpen > 0 ? '#1d4ed8' : '#334155'}
            strokeWidth={0.7}
          />
          {/* Grip knobs */}
          <circle cx={buretteX - 9} cy={buretteBottom + 16} r={2.4} fill={stopcockOpen > 0 ? '#1d4ed8' : '#334155'} />
          <circle cx={buretteX + 9} cy={buretteBottom + 16} r={2.4} fill={stopcockOpen > 0 ? '#1d4ed8' : '#334155'} />
        </g>

        {/* Dedicated Left Wing Click Target (Rotate Counter-Clockwise -> Close / Slow down) */}
        <rect
          x={buretteX - 22}
          y={buretteBottom + 4}
          width={22}
          height={24}
          fill="rgba(0,0,0,0.001)"
          style={{ cursor: stopcockOpen > 0 ? 'pointer' : 'default', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepDownFlow();
          }}
        />

        {/* Dedicated Right Wing Click Target (Rotate Clockwise -> Open / Speed up) */}
        <rect
          x={buretteX}
          y={buretteBottom + 4}
          width={22}
          height={24}
          fill="rgba(0,0,0,0.001)"
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepUpFlow();
          }}
        />
      </g>

      {/* Interactive Guide / Direction Label when closed (Clickable) */}
      {stopcockOpen === 0 && (
        <g
          transform={`translate(${buretteX + 14}, ${buretteBottom + 14})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            handleSetOpen(0.20);
          }}
        >
          <text x="0" y="0" fill="#2563eb" fontSize="5.5" fontWeight={700} fontFamily="var(--font-sans)">
            ↻ Click Right to Open
          </text>
          <text x="0" y="6" fill="#64748b" fontSize="4.5" fontFamily="var(--font-sans)">
            Slow Drop (20%)
          </text>
        </g>
      )}

      {/* Active Flow Rate Badge when open (Clickable) */}
      {stopcockOpen > 0 && (
        <g
          transform={`translate(${buretteX + 14}, ${buretteBottom + 8})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            let nextOpen = 0;
            if (stopcockOpen < 0.35) nextOpen = 0.50;
            else if (stopcockOpen < 0.70) nextOpen = 0.80;
            else if (stopcockOpen < 0.95) nextOpen = 1.00;
            else nextOpen = 0;
            handleSetOpen(nextOpen);
          }}
        >
          <rect x="-2" y="-7" width="62" height="13" rx="3" fill="#ffffff" stroke="#2563eb" strokeWidth="0.8" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
          <text x="29" y="2" textAnchor="middle" fill="#1d4ed8" fontSize="5" fontWeight={800} fontFamily="var(--font-mono)">
            {getFlowText()}
          </text>
        </g>
      )}

      {/* Tapered Glass Delivery Tip / Nozzle (y: buretteBottom + 20 .. buretteBottom + 36) */}
      <polygon
        points={`${buretteX - 3},${buretteBottom + 20} ${buretteX + 3},${buretteBottom + 20} ${buretteX + 1},${buretteBottom + 36} ${buretteX - 1},${buretteBottom + 36}`}
        fill="rgba(241, 245, 249, 0.35)"
        stroke="#94a3b8"
        strokeWidth={0.8}
      />

      {/* Glass Sheen Highlights along barrel */}
      <line
        x1={buretteX - buretteWidth / 2 + 2}
        y1={buretteTop}
        x2={buretteX - buretteWidth / 2 + 2}
        y2={buretteBottom + 10}
        stroke="#ffffff"
        strokeWidth={1.5}
        opacity={0.75}
      />

      {/* Volumetric Scale Graduations */}
      {graduations}

      {/* ── Dynamic Droplet Flow / Jet Stream from Tip ── */}
      {isTitrating && (
        <g id="burette-flow-stream">
          {stopcockOpen > 0.80 ? (
            <g>
              <line
                x1={buretteX}
                y1={buretteBottom + 36}
                x2={buretteX}
                y2={buretteBottom + 65}
                stroke={liquidColor}
                strokeWidth={2.4}
                strokeLinecap="round"
              />
              <path
                d={`M ${buretteX - 0.8} ${buretteBottom + 38} Q ${buretteX + 0.8} ${buretteBottom + 50} ${buretteX} ${buretteBottom + 64}`}
                stroke="#ffffff"
                strokeWidth={0.6}
                opacity={0.7}
                fill="none"
              />
            </g>
          ) : stopcockOpen > 0.55 ? (
            <g>
              <line
                x1={buretteX}
                y1={buretteBottom + 36}
                x2={buretteX}
                y2={buretteBottom + 58}
                stroke={liquidColor}
                strokeWidth={1.8}
                strokeLinecap="round"
                opacity={0.85}
              />
              <circle cx={buretteX} cy={buretteBottom + 60} r={1.6} fill={liquidColor}>
                <animate attributeName="cy" values={`${buretteBottom + 40};${buretteBottom + 65}`} dur="0.25s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4" dur="0.25s" repeatCount="indefinite" />
              </circle>
            </g>
          ) : stopcockOpen > 0.25 ? (
            <g>
              <circle cx={buretteX} cy={buretteBottom + 40} r={1.6} fill={liquidColor}>
                <animate attributeName="cy" values={`${buretteBottom + 36};${buretteBottom + 65}`} dur="0.32s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4" dur="0.32s" repeatCount="indefinite" />
              </circle>
              <circle cx={buretteX} cy={buretteBottom + 40} r={1.4} fill={liquidColor}>
                <animate attributeName="cy" values={`${buretteBottom + 36};${buretteBottom + 65}`} dur="0.32s" begin="0.16s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4" dur="0.32s" begin="0.16s" repeatCount="indefinite" />
              </circle>
            </g>
          ) : (
            /* Level 1: Gentle Deliberate Single Droplet Falling Calmly (0.9s duration) */
            <g>
              <ellipse cx={buretteX} cy={buretteBottom + 37} rx={1.2} ry={1.5} fill={liquidColor} opacity={0.9}>
                <animate attributeName="ry" values="0.8;1.8;0.8" dur="0.9s" repeatCount="indefinite" />
              </ellipse>
              <circle cx={buretteX} cy={buretteBottom + 40} r={1.4} fill={liquidColor}>
                <animate attributeName="cy" values={`${buretteBottom + 38};${buretteBottom + 65}`} dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;1;0.2" dur="0.9s" repeatCount="indefinite" />
              </circle>
            </g>
          )}
        </g>
      )}

      {/* ── Live Floating Volume Readout Badge (Matching Class 11 Lab) ── */}
      {hasVolumeVar && (
        <g transform={`translate(${buretteX + buretteWidth / 2 + 6}, ${Math.min(Math.max(liquidTop, buretteTop + 8), buretteBottom - 8)})`}>
          <rect
            x={0}
            y={-8}
            width={48}
            height={16}
            rx={3.5}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={0.9}
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
          />
          <text
            x={24}
            y={3}
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="8"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={700}
          >
            {currentVolume.toFixed(1)} mL
          </text>
        </g>
      )}

      {/* Label */}
      {label && (
        <text
          x={buretteX}
          y={buretteBottom + 52}
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="700"
          fill="#475569"
          fontFamily="var(--font-sans)"
        >
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Generic Pipette ──────────────────────────────────────────────

const PipetteSVG: React.FC<ApparatusProps> = ({
  id = 'pipette',
  liquidLevel = 0,
  liquidColor = 'rgba(224, 242, 254, 0.5)',
  label,
  highlighted = false,
  width = 40,
  height = 160,
}) => {
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  const fillH = effectiveLevel * 105;
  const fillY = 145 - fillH;
  const gradId = `pipetteLiquid-${id || 'def'}`;

  return (
    <svg width={width} height={height} viewBox="0 0 40 160" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.8" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Bulb - realistic rubber bulb look */}
      <path d="M 12 35 C 8 35 5 25 5 15 C 5 5 12 0 20 0 C 28 0 35 5 35 15 C 35 25 32 35 28 35"
        fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
      <path d="M 15 8 C 12 10 10 15 10 20" stroke="#ffffff" strokeWidth="1" opacity="0.4" fill="none" />

      {/* Shaft */}
      <rect x="18" y="35" width="4" height="110"
        stroke={highlighted ? '#3b82f6' : '#94a3b8'} strokeWidth="1.2" fill="rgba(255,255,255,0.15)" />

      {/* Liquid in shaft with meniscus */}
      {effectiveLevel > 0 && (
        <g>
          <rect x="18.5" y={fillY} width="3" height={fillH}
            fill={`url(#${gradId})`} style={{ transition: 'height 2.0s cubic-bezier(0.25, 1, 0.5, 1), y 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }} />
          <ellipse cx="20" cy={fillY} rx="1.5" ry="0.6" fill="rgba(255,255,255,0.5)" style={{ transition: 'all 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }} />
        </g>
      )}

      {/* Graduation mark */}
      <line x1="22" y1="70" x2="26" y2="70" stroke="#ef4444" strokeWidth="1" />

      {/* Tip */}
      <path d="M 18 145 L 20 155 L 22 145" stroke="#94a3b8" strokeWidth="1.2" fill="#cbd5e1" />

      {label && (
        <text x="20" y="158" textAnchor="middle" fontSize="8" fontWeight="700" fill="#64748b"
          fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Bunsen Burner ────────────────────────────────────────────────

const BunsenBurner: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 60,
  height = 100,
  extraProps,
}) => {
  const isLit = (extraProps?.['isLit'] as boolean) ?? false;

  return (
    <svg width={width} height={height} viewBox="0 0 60 100" fill="none">
      {/* Base */}
      <rect x="10" y="85" width="40" height="10" rx="3"
        fill="#475569" stroke={highlighted ? '#2563eb' : '#334155'} strokeWidth="1.5" />
      {/* Barrel */}
      <rect x="24" y="35" width="12" height="50" rx="2"
        fill="#64748b" stroke="#475569" strokeWidth="1" />
      {/* Air hole */}
      <ellipse cx="30" cy="75" rx="4" ry="2" fill="#334155" />
      {/* Collar */}
      <rect x="22" y="55" width="16" height="6" rx="1.5" fill="#94a3b8" stroke="#64748b" strokeWidth="0.5" />
      {/* Gas inlet */}
      <path d="M 10 80 L 24 80" stroke="#94a3b8" strokeWidth="2" />
      {/* Flame */}
      {isLit && (
        <g>
          <ellipse cx="30" cy="25" rx="6" ry="14"
            fill="hsla(210, 90%, 60%, 0.6)" />
          <ellipse cx="30" cy="22" rx="3.5" ry="10"
            fill="hsla(210, 95%, 70%, 0.8)" />
          <ellipse cx="30" cy="20" rx="2" ry="6"
            fill="hsla(40, 95%, 75%, 0.9)" />
        </g>
      )}
    </svg>
  );
};


// ── Dropper Bottle ───────────────────────────────────────────────

const DropperBottle: React.FC<ApparatusProps> = ({
  id = 'dropper',
  liquidColor = 'rgba(224, 242, 254, 0.5)',
  label,
  highlighted = false,
  width = 40,
  height = 80,
}) => {
  const gradId = `dropperLiquid-${id || 'def'}`;

  return (
    <svg width={width} height={height} viewBox="0 0 40 80" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.8" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.98" />
        </linearGradient>
      </defs>

      {/* Bottle body */}
      <rect x="8" y="30" width="24" height="35" rx="4"
        stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1.5"
        fill="rgba(241,245,249,0.2)" />

      {/* Liquid with meniscus */}
      <g>
        <rect x="9.5" y="40" width="21" height="23" rx="3" fill={`url(#${gradId})`} style={{ transition: 'fill 2.2s ease' }} />
        <ellipse cx="20" cy="40" rx="10.5" ry="2" fill="rgba(255,255,255,0.3)" stroke={liquidColor} strokeWidth="0.5" style={{ transition: 'all 2.0s ease' }} />
      </g>

      {/* Glass highlights */}
      <line x1="11" y1="34" x2="11" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />

      {/* Neck */}
      <rect x="15" y="22" width="10" height="10" rx="1"
        stroke="#94a3b8" strokeWidth="1" fill="none" />
      {/* Dropper cap */}
      <path d="M 16 22 L 18 12 Q 20 8 22 12 L 24 22"
        fill="#475569" stroke="#334155" strokeWidth="1" />
      {/* Tip */}
      <path d="M 19 65 L 20 72 L 21 65" stroke="#94a3b8" strokeWidth="1" fill="none" />

      {label && (
        <text x="20" y="78" textAnchor="middle" fontSize="7" fontWeight="600" fill="#64748b"
          fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Reagent Bottle ───────────────────────────────────────────────

const ReagentBottle: React.FC<ApparatusProps> = ({
  id = 'reagent-bottle',
  liquidLevel = 0.7,
  liquidColor = 'rgba(224, 242, 254, 0.5)',
  label,
  highlighted = false,
  width = 50,
  height = 90,
}) => {
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  const fillHeight = 40 * effectiveLevel;
  const fillY = 73 - fillHeight;
  const gradId = `reagentLiquid-${id || 'def'}`;

  return (
    <svg width={width} height={height} viewBox="0 0 50 90" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.75" />
          <stop offset="50%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.88" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.98" />
        </linearGradient>
      </defs>

      {/* Body Back Wall */}
      <rect x="8" y="30" width="34" height="45" rx="5"
        stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1.5"
        fill="rgba(241,245,249,0.2)" />

      {/* Liquid with Meniscus */}
      {effectiveLevel > 0 && (
        <g id="reagent-liquid">
          <rect x="9.5" y={fillY} width="31" height={fillHeight}
            rx="4" fill={`url(#${gradId})`}
            style={{ transition: 'height 0.3s ease' }} />
          <ellipse cx="25" cy={fillY} rx="15" ry="2.2" fill="rgba(255,255,255,0.3)" stroke={liquidColor} strokeWidth="0.6" />
        </g>
      )}

      {/* Front Glass Highlights */}
      <line x1="11" y1="34" x2="11" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="39" y1="34" x2="39" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeLinecap="round" />

      {/* Neck */}
      <rect x="18" y="20" width="14" height="12" rx="2"
        stroke="#94a3b8" strokeWidth="1.5" fill="rgba(241,245,249,0.2)" />

      {/* Stopper / Cap */}
      <rect x="16" y="14" width="18" height="8" rx="2.5" fill="#475569" stroke="#334155" strokeWidth="1" />
      <rect x="19" y="16" width="12" height="4" rx="1.5" fill="#64748b" />

      {/* Label Plaque */}
      {label && (
        <g transform="translate(9, 44)">
          <rect x="0" y="0" width="32" height="18" rx="2" fill="rgba(255,255,255,0.95)" stroke="#cbd5e1" strokeWidth="0.8" />
          {label.includes(' ') ? (
            (() => {
              const words = label.split(' ');
              const mid = Math.ceil(words.length / 2);
              const line1 = words.slice(0, mid).join(' ');
              const line2 = words.slice(mid).join(' ');
              return (
                <text x="16" y="7" textAnchor="middle" fontSize="4.8" fontWeight="700" fill="#0f172a" fontFamily="var(--font-sans)">
                  <tspan x="16" dy="0">{line1}</tspan>
                  <tspan x="16" dy="6.5">{line2}</tspan>
                </text>
              );
            })()
          ) : (
            <text x="16" y="11.5" textAnchor="middle" fontSize={label.length > 8 ? '5.2' : '6.5'} fontWeight="700" fill="#0f172a" fontFamily="var(--font-sans)">
              {label}
            </text>
          )}
        </g>
      )}
    </svg>
  );
};

// ── Retort Stand (Stand Base + Rod + Clamp) ──────────────────────

const RetortStand: React.FC<ApparatusProps> = ({
  width = 140,
  height = 300,
  extraProps = {},
}) => {
  const hideLowerClamp = !!(extraProps as Record<string, unknown>).hideLowerClamp;

  return (
    <svg width={width} height={height} viewBox="0 0 140 300" fill="none" style={{ overflow: 'visible', transition: 'opacity 0.3s ease' }}>
      <defs>
        <linearGradient id="metalStandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="35%" stopColor="#94a3b8" />
          <stop offset="65%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="metalBaseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      {/* Heavy Cast Iron Retort Base */}
      <rect x="25" y="278" width="90" height="12" rx="4" fill="url(#metalBaseGrad)" stroke="#1e293b" strokeWidth="1.2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.35))" />
      <rect x="27" y="279" width="86" height="2" rx="1" fill="rgba(255,255,255,0.25)" />
      {/* Vertical Stainless Steel Rod */}
      <rect x="42" y="10" width="7" height="270" rx="3.5" fill="url(#metalStandGrad)" stroke="#334155" strokeWidth="0.8" />
      {/* Upper Boss Head Clamp */}
      <rect x="38" y="55" width="15" height="14" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
      <circle cx="49" cy="62" r="3" fill="#64748b" stroke="#334155" strokeWidth="0.6" />
      <path d="M 53 58 L 72 58 L 78 54 L 78 68 L 72 64 L 53 64 Z" fill="url(#metalStandGrad)" stroke="#334155" strokeWidth="0.8" />
      {/* Lower Boss Head Clamp */}
      {!hideLowerClamp && (
        <>
          <rect x="38" y="180" width="15" height="14" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <circle cx="49" cy="187" r="3" fill="#64748b" stroke="#334155" strokeWidth="0.6" />
          <path d="M 53 183 L 72 183 L 78 179 L 78 193 L 72 189 L 53 189 Z" fill="url(#metalStandGrad)" stroke="#334155" strokeWidth="0.8" />
        </>
      )}
    </svg>
  );
};

// ── Burette Stand (Retort Stand + Burette Assembly) ───────────────

const BuretteStand: React.FC<ApparatusProps> = ({
  id = 'burette-stand',
  liquidLevel: _liquidLevel = 0,
  liquidColor = 'rgba(37, 99, 235, 0.45)',
  label = '50 mL Burette',
  highlighted = false,
  width = 140,
  height = 300,
  flags = {},
  variables = {},
  extraProps = {},
}) => {
  const [localOpen, setLocalOpen] = React.useState(0);
  const isPointerDownRef = React.useRef(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const hasMovedRef = React.useRef(false);
  const startOpenRef = React.useRef(0);

  const parentOpen = (extraProps?.stopcockOpen as number | undefined) ?? (variables.stopcockOpen ?? undefined);
  const stopcockOpen = parentOpen !== undefined ? parentOpen : localOpen;
  const isTitrating = Boolean(
    stopcockOpen > 0 ||
    flags?.isTitrating ||
    extraProps?.isTitrating ||
    flags?.titrating ||
    extraProps?.titrating
  );

  const handleSetOpen = React.useCallback((openVal: number) => {
    const clamped = Math.max(0, Math.min(1, Math.round(openVal * 100) / 100));
    setLocalOpen(clamped);
    if (typeof extraProps?.onSetStopcock === 'function') {
      (extraProps.onSetStopcock as (v: number) => void)(clamped);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('burette_stopcock_change', { detail: { open: clamped, id } }));
    }
  }, [extraProps, id]);

  const stepUpFlow = React.useCallback(() => {
    let nextOpen = 0.20;
    if (stopcockOpen === 0) nextOpen = 0.20;
    else if (stopcockOpen < 0.35) nextOpen = 0.50;
    else if (stopcockOpen < 0.70) nextOpen = 0.80;
    else nextOpen = 1.00;
    handleSetOpen(nextOpen);
  }, [stopcockOpen, handleSetOpen]);

  const stepDownFlow = React.useCallback(() => {
    let nextOpen = 0;
    if (stopcockOpen > 0.85) nextOpen = 0.50;
    else if (stopcockOpen > 0.35) nextOpen = 0.20;
    else nextOpen = 0;
    handleSetOpen(nextOpen);
  }, [stopcockOpen, handleSetOpen]);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    isPointerDownRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    startOpenRef.current = stopcockOpen;
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  }, [stopcockOpen]);

  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    if (!hasMovedRef.current && Math.hypot(deltaX, deltaY) > 5) {
      hasMovedRef.current = true;
    }
    if (hasMovedRef.current) {
      const dragDelta = (deltaY - deltaX) / 60;
      const newOpen = Math.max(0, Math.min(1, startOpenRef.current + dragDelta));
      handleSetOpen(newOpen);
    }
  }, [handleSetOpen]);

  const handlePointerUp = React.useCallback((e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    try {
      if ((e.currentTarget as Element).hasPointerCapture?.(e.pointerId)) {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      }
    } catch {
      // fallback
    }
    if (!hasMovedRef.current) {
      const rect = (e.currentTarget as Element).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX >= rect.width / 2) {
        stepUpFlow();
      } else {
        stepDownFlow();
      }
    }
  }, [stepUpFlow, stepDownFlow]);

  const currentVolume =
    (variables.volumeAdded ?? 0) +
    (variables.buretteReading ?? 0) +
    (variables.kohVolume ?? 0) +
    (variables.naohVolume ?? 0) +
    (variables.volumeA ?? 0) +
    (variables.volumeB ?? 0) +
    (variables.stdEdtaVolume ?? 0) +
    (variables.sampleEdtaVolume ?? 0) +
    (variables.thiosulphateVolume ?? 0);
  const maxVolume = 50;
  const hasVolumeVar =
    variables.volumeAdded !== undefined ||
    variables.buretteReading !== undefined ||
    variables.kohVolume !== undefined ||
    variables.naohVolume !== undefined ||
    variables.volumeA !== undefined ||
    variables.volumeB !== undefined ||
    variables.stdEdtaVolume !== undefined ||
    variables.sampleEdtaVolume !== undefined ||
    variables.thiosulphateVolume !== undefined;

  const isBuretteFilled = Boolean(
    flags?.buretteFilled === true ||
    extraProps?.buretteFilled === true ||
    extraProps?.isFilled === true ||
    flags?.['burette-filled'] === true
  );

  const effectiveLevel = isBuretteFilled
    ? Math.max(0, Math.min(1, (maxVolume - currentVolume) / maxVolume))
    : 0;

  // Burette tube coordinates (in 140x300 viewBox, matching Class 11 Burette.tsx proportions)
  const buretteX = 72;
  const buretteWidth = 16;
  const tubeTop = 22;
  const tubeHeight = 180;
  const tubeBottom = tubeTop + tubeHeight; // y = 202
  const liquidTopY = tubeBottom - tubeHeight * effectiveLevel;
  const gradId = `bstandLiquid-${id || 'def'}`;
  const tapAngle = stopcockOpen * 90;

  const getFlowText = () => {
    if (stopcockOpen === 0) return 'Tap Closed (0°)';
    if (stopcockOpen <= 0.25) return `💧 Slow Drop (${Math.round(stopcockOpen * 100)}%)`;
    if (stopcockOpen <= 0.60) return `💧 Fast Drop (${Math.round(stopcockOpen * 100)}%)`;
    if (stopcockOpen <= 0.85) return `🌊 Rapid Flow (${Math.round(stopcockOpen * 100)}%)`;
    return `🌊 Full Stream (${Math.round(stopcockOpen * 100)}%)`;
  };

  // 0 to 50 mL graduations every 5 mL and 1 mL
  const graduations = [];
  for (let ml = 0; ml <= 50; ml += 5) {
    const y = tubeTop + (ml / 50) * tubeHeight;
    const isLarge = ml % 10 === 0;
    graduations.push(
      <g key={ml}>
        <line
          x1={buretteX - buretteWidth / 2 - (isLarge ? 6 : 3.5)}
          y1={y}
          x2={buretteX - buretteWidth / 2}
          y2={y}
          stroke="#475569"
          strokeWidth={isLarge ? 0.9 : 0.6}
        />
        {isLarge && (
          <text
            x={buretteX - buretteWidth / 2 - 8}
            y={y + 2.5}
            textAnchor="end"
            fill="#334155"
            fontSize="6"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={700}
          >
            {ml}
          </text>
        )}
      </g>
    );
  }

  for (let ml = 0; ml <= 50; ml += 1) {
    if (ml % 5 !== 0) {
      const y = tubeTop + (ml / 50) * tubeHeight;
      graduations.push(
        <line
          key={`s-${ml}`}
          x1={buretteX - buretteWidth / 2 - 2}
          y1={y}
          x2={buretteX - buretteWidth / 2}
          y2={y}
          stroke="#94a3b8"
          strokeWidth={0.4}
        />
      );
    }
  }

  return (
    <svg width={width} height={height} viewBox="0 0 140 300" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.85" />
          <stop offset="35%" stopColor={liquidColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="bstandMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="35%" stopColor="#94a3b8" />
          <stop offset="65%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        <linearGradient id="bstandBaseMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* ── 1. Retort Stand Base & Rod (Subtle Translucent Background) ── */}
      <g id="bstand-hardware" opacity="0.38" style={{ transition: 'opacity 0.3s ease' }}>
        <rect x="25" y="278" width="90" height="12" rx="4" fill="url(#bstandBaseMetal)" stroke="#1e293b" strokeWidth="1.2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.35))" />
        <rect x="27" y="279" width="86" height="2" rx="1" fill="rgba(255,255,255,0.25)" />
        <rect x="42" y="10" width="7" height="270" rx="3.5" fill="url(#bstandMetal)" stroke="#334155" strokeWidth="0.8" />

        {/* ── Dual Burette Clamp Boss Heads ── */}
        <rect x="38" y="55" width="15" height="14" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
        <circle cx="49" cy="62" r="3" fill="#64748b" stroke="#334155" strokeWidth="0.6" />
        <path d="M 53 58 L 72 58 L 78 54 L 78 68 L 72 64 L 53 64 Z" fill="url(#bstandMetal)" stroke="#334155" strokeWidth="0.8" />

        <rect x="38" y="150" width="15" height="14" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
        <circle cx="49" cy="157" r="3" fill="#64748b" stroke="#334155" strokeWidth="0.6" />
        <path d="M 53 153 L 72 153 L 78 149 L 78 163 L 72 159 L 53 159 Z" fill="url(#bstandMetal)" stroke="#334155" strokeWidth="0.8" />
      </g>

      {/* ── 3. Calibrated 50 mL Glass Burette (Centered at x=72) ── */}
      {/* Top Funnel / Flared Rim */}
      <ellipse cx={buretteX} cy={tubeTop} rx={buretteWidth / 2} ry={2.2} fill="#ffffff" stroke="#94a3b8" strokeWidth={1} />

      {/* Burette Glass Body Back Wall */}
      <rect
        x={buretteX - buretteWidth / 2}
        y={tubeTop}
        width={buretteWidth}
        height={tubeHeight}
        fill="rgba(241, 245, 249, 0.25)"
        stroke={highlighted ? '#2563eb' : '#94a3b8'}
        strokeWidth={1.2}
      />

      {/* Glass Tapered Lower Neck */}
      <polygon
        points={`${buretteX - buretteWidth / 2},${tubeBottom} ${buretteX + buretteWidth / 2},${tubeBottom} ${buretteX + 4},${tubeBottom + 14} ${buretteX - 4},${tubeBottom + 14}`}
        fill="rgba(241, 245, 249, 0.3)"
        stroke="#94a3b8"
        strokeWidth={1}
      />

      {/* ── Dynamic Liquid Column & Concave Meniscus ── */}
      {effectiveLevel > 0 && (
        <g id="burette-stand-liquid">
          {/* Main barrel column */}
          <rect
            x={buretteX - buretteWidth / 2 + 0.8}
            y={liquidTopY}
            width={buretteWidth - 1.6}
            height={tubeBottom - liquidTopY}
            fill={`url(#${gradId})`}
            style={{ transition: 'height 0.2s linear, y 0.2s linear' }}
          />

          {/* Liquid filling neck, stopcock & nozzle */}
          <polygon
            points={`${buretteX - buretteWidth / 2 + 0.8},${tubeBottom} ${buretteX + buretteWidth / 2 - 0.8},${tubeBottom} ${buretteX + 3.5},${tubeBottom + 14} ${buretteX - 3.5},${tubeBottom + 14}`}
            fill={liquidColor}
          />
          <rect x={buretteX - 4} y={tubeBottom + 14} width={8} height={10} fill={liquidColor} />
          <polygon
            points={`${buretteX - 2.5},${tubeBottom + 24} ${buretteX + 2.5},${tubeBottom + 24} ${buretteX + 1},${tubeBottom + 40} ${buretteX - 1},${tubeBottom + 40}`}
            fill={liquidColor}
          />

          {/* Realistic Concave Meniscus Curve */}
          <path
            d={`M ${buretteX - buretteWidth / 2 + 0.8} ${liquidTopY} Q ${buretteX} ${liquidTopY + 2.5} ${buretteX + buretteWidth / 2 - 0.8} ${liquidTopY}`}
            fill="none"
            stroke="rgba(29, 78, 216, 0.7)"
            strokeWidth={1}
            style={{ transition: 'd 0.2s linear' }}
          />
        </g>
      )}

      {/* Glass Front Wall Specular Highlights */}
      <line x1={buretteX - buretteWidth / 2 + 2} y1={tubeTop + 2} x2={buretteX - buretteWidth / 2 + 2} y2={tubeBottom + 12} stroke="#ffffff" strokeWidth={1.4} opacity={0.8} strokeLinecap="round" />
      <line x1={buretteX + buretteWidth / 2 - 2} y1={tubeTop + 2} x2={buretteX + buretteWidth / 2 - 2} y2={tubeBottom + 12} stroke="rgba(255,255,255,0.3)" strokeWidth={0.6} strokeLinecap="round" />

      {/* Volumetric Scale Graduations */}
      {graduations}

      {/* ── 4. Ground Glass Stopcock Housing Barrel (y = tubeBottom + 14 .. tubeBottom + 24) ── */}
      <rect
        x={buretteX - 6}
        y={tubeBottom + 14}
        width={12}
        height={10}
        rx={1.8}
        fill="#cbd5e1"
        stroke="#64748b"
        strokeWidth={1}
      />

      {/* ── INTERACTIVE ROTATABLE STOPCOCK / CORK VALVE WITH DIRECTIONAL WINGS ── */}
      <g
        id="burette-stand-interactive-cork"
        style={{ cursor: 'pointer', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Invisible enlarged hit circle for dragging */}
        <circle cx={buretteX} cy={tubeBottom + 19} r={24} fill="rgba(0,0,0,0.001)" />

        {/* Rotatable Cork Key Handle */}
        <g
          transform={`rotate(${tapAngle}, ${buretteX}, ${tubeBottom + 19})`}
          style={{ transition: isPointerDownRef.current ? 'none' : 'transform 0.18s ease-out' }}
        >
          {/* Central plug */}
          <circle cx={buretteX} cy={tubeBottom + 19} r={3.2} fill="#1e293b" stroke="#475569" strokeWidth={0.8} />
          {/* Left Wing Lever (Close / Slow) */}
          <rect
            x={buretteX - 11}
            y={tubeBottom + 17.5}
            width={11}
            height={3}
            rx={1.5}
            fill={stopcockOpen > 0 ? '#2563eb' : '#475569'}
            stroke={stopcockOpen > 0 ? '#1d4ed8' : '#334155'}
            strokeWidth={0.7}
          />
          {/* Right Wing Lever (Open / Faster) */}
          <rect
            x={buretteX}
            y={tubeBottom + 17.5}
            width={11}
            height={3}
            rx={1.5}
            fill={stopcockOpen > 0 ? '#2563eb' : '#475569'}
            stroke={stopcockOpen > 0 ? '#1d4ed8' : '#334155'}
            strokeWidth={0.7}
          />
          {/* Grip knobs */}
          <circle cx={buretteX - 10} cy={tubeBottom + 19} r={2.6} fill={stopcockOpen > 0 ? '#1d4ed8' : '#334155'} />
          <circle cx={buretteX + 10} cy={tubeBottom + 19} r={2.6} fill={stopcockOpen > 0 ? '#1d4ed8' : '#334155'} />
        </g>

        {/* Dedicated Left Wing Click Target (Rotate Counter-Clockwise -> Close / Slow down) */}
        <rect
          x={buretteX - 25}
          y={tubeBottom + 5}
          width={25}
          height={28}
          fill="rgba(0,0,0,0.001)"
          style={{ cursor: stopcockOpen > 0 ? 'pointer' : 'default', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepDownFlow();
          }}
        />

        {/* Dedicated Right Wing Click Target (Rotate Clockwise -> Open / Speed up) */}
        <rect
          x={buretteX}
          y={tubeBottom + 5}
          width={25}
          height={28}
          fill="rgba(0,0,0,0.001)"
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepUpFlow();
          }}
        />
      </g>

      {/* Interactive Guide / Direction Label when closed (Clickable) */}
      {stopcockOpen === 0 && (
        <g
          transform={`translate(${buretteX + 16}, ${tubeBottom + 14})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            handleSetOpen(0.20);
          }}
        >
          <text x="0" y="0" fill="#2563eb" fontSize="5.5" fontWeight={700} fontFamily="var(--font-sans)">
            ↻ Click Right to Open
          </text>
          <text x="0" y="6" fill="#64748b" fontSize="4.5" fontFamily="var(--font-sans)">
            Slow Drop (20%)
          </text>
        </g>
      )}

      {/* Active Flow Rate Badge when open (Clickable to cycle/step) */}
      {stopcockOpen > 0 && (
        <g
          transform={`translate(${buretteX + 16}, ${tubeBottom + 10})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            let nextOpen = 0;
            if (stopcockOpen < 0.35) nextOpen = 0.50;
            else if (stopcockOpen < 0.70) nextOpen = 0.80;
            else if (stopcockOpen < 0.95) nextOpen = 1.00;
            else nextOpen = 0;
            handleSetOpen(nextOpen);
          }}
        >
          <rect x="-2" y="-7" width="62" height="14" rx="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="0.8" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
          <text x="29" y="2.5" textAnchor="middle" fill="#1d4ed8" fontSize="5" fontWeight={800} fontFamily="var(--font-mono)">
            {getFlowText()}
          </text>
        </g>
      )}

      {/* ── 5. Fine Tapered Jet Delivery Nozzle / Tip (y = tubeBottom + 24 .. tubeBottom + 40) ── */}
      <polygon
        points={`${buretteX - 3.5},${tubeBottom + 24} ${buretteX + 3.5},${tubeBottom + 24} ${buretteX + 1},${tubeBottom + 40} ${buretteX - 1},${tubeBottom + 40}`}
        fill="rgba(241, 245, 249, 0.4)"
        stroke="#64748b"
        strokeWidth={0.8}
      />

      {/* ── 6. Active Titration Stream & Droplet Flow from Tip ── */}
      {isTitrating && (
        <g transform={`translate(${buretteX}, ${tubeBottom + 40})`}>
          {stopcockOpen > 0.80 ? (
            <g>
              <line x1="0" y1="0" x2="0" y2="35" stroke={liquidColor} strokeWidth="2.4" strokeLinecap="round" opacity="0.95" />
              <path d="M -0.8 2 Q 0.8 15 0 32" stroke="#ffffff" strokeWidth="0.6" opacity="0.7" fill="none" />
            </g>
          ) : stopcockOpen > 0.55 ? (
            <g>
              <line x1="0" y1="0" x2="0" y2="28" stroke={liquidColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
              <circle cx="0" cy="30" r="1.6" fill={liquidColor}>
                <animate attributeName="cy" values="0;36" dur="0.25s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4" dur="0.25s" repeatCount="indefinite" />
              </circle>
            </g>
          ) : stopcockOpen > 0.25 ? (
            <g>
              <circle cx="0" cy="8" rx="1.5" ry="1.5" fill={liquidColor}>
                <animate attributeName="cy" values="0;36" dur="0.32s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.9;0.4" dur="0.32s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="20" r="1.3" fill={liquidColor}>
                <animate attributeName="cy" values="0;36" dur="0.32s" begin="0.16s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.9;0.4" dur="0.32s" begin="0.16s" repeatCount="indefinite" />
              </circle>
            </g>
          ) : (
            /* Level 1: Gentle Deliberate Single Droplet Falling Slowly (0.9s duration) */
            <g>
              <ellipse cx="0" cy="2" rx="1.2" ry="1.5" fill={liquidColor} opacity="0.9">
                <animate attributeName="ry" values="0.8;1.8;0.8" dur="0.9s" repeatCount="indefinite" />
              </ellipse>
              <circle cx="0" cy="6" r="1.4" fill={liquidColor}>
                <animate attributeName="cy" values="2;36" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;1;0.2" dur="0.9s" repeatCount="indefinite" />
              </circle>
            </g>
          )}
        </g>
      )}

      {/* ── Live Floating Volume Readout Badge (Matching Class 11 Lab) ── */}
      {hasVolumeVar && (
        <g transform={`translate(${buretteX + buretteWidth / 2 + 8}, ${Math.min(Math.max(liquidTopY, tubeTop + 8), tubeBottom - 8)})`}>
          <rect
            x={0}
            y={-8}
            width={48}
            height={16}
            rx={3.5}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={0.9}
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
          />
          <text
            x={24}
            y={3}
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="7.5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={700}
          >
            {currentVolume.toFixed(1)} mL
          </text>
        </g>
      )}

      {/* Burette Label Plaque */}
      {label && (
        <g transform={`translate(${buretteX}, 6)`}>
          <rect x="-35" y="0" width="70" height="13" rx="2.5" fill="rgba(255,255,255,0.92)" stroke="#cbd5e1" strokeWidth="0.8" />
          <text x="0" y="9" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#1e293b" fontFamily="var(--font-sans)">
            {label}
          </text>
        </g>
      )}
    </svg>
  );
};


// ── Digital Balance ──────────────────────────────────────────────

const DigitalBalanceSVG: React.FC<ApparatusProps> = ({
  label,
  highlighted = false,
  width = 120,
  height = 70,
  extraProps,
}) => {
  const reading = (extraProps?.['reading'] as number) ?? 0;
  const displayValue = reading > 0 ? reading.toFixed(2) : '0.00';

  return (
    <svg width={width} height={height} viewBox="0 0 120 70" fill="none">
      <defs>
        <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* Base with depth */}
      <rect x="5" y="40" width="110" height="22" rx="4"
        fill="url(#balanceGrad)" stroke={highlighted ? '#3b82f6' : '#94a3b8'} strokeWidth="1.5" />
      <rect x="5" y="40" width="110" height="4" rx="2" fill="rgba(255,255,255,0.5)" />

      {/* Weighing pan - stainless steel look */}
      <rect x="20" y="32" width="80" height="10" rx="2"
        fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <line x1="22" y1="33" x2="98" y2="33" stroke="#ffffff" strokeWidth="0.5" />

      {/* Control Panel area */}
      <rect x="15" y="10" width="90" height="28" rx="4" fill="#334155" />

      {/* Display - LED look */}
      <rect x="25" y="14" width="70" height="20" rx="3" fill="#0f172a" />
      <text x="60" y="29" textAnchor="middle" fontSize="13" fill="#4ade80"
        fontFamily="var(--font-mono, monospace)" fontWeight="700">
        {displayValue} <tspan fontSize="8">g</tspan>
      </text>

      {/* Buttons */}
      <circle cx="25" cy="54" r="3" fill="#94a3b8" />
      <text x="25" y="63" textAnchor="middle" fontSize="5" fill="#475569" fontWeight="700">TARE</text>

      <circle cx="95" cy="54" r="3" fill="#94a3b8" />
      <text x="95" y="63" textAnchor="middle" fontSize="5" fill="#475569" fontWeight="700">UNIT</text>

      {label && (
        <text x="60" y="68" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#475569">
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Rubber Cork ──────────────────────────────────────────────────

const RubberCork: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 40,
  height = 30,
}) => (
  <svg width={width} height={height} viewBox="0 0 40 30" fill="none">
    <path d="M 8 25 L 12 5 L 28 5 L 32 25 Z" rx="2"
      fill={highlighted ? '#a78bfa' : '#92400e'}
      stroke={highlighted ? '#7c3aed' : '#78350f'}
      strokeWidth="1.5" />
    <line x1="14" y1="10" x2="26" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="13" y1="15" x2="27" y2="15" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
  </svg>
);


// ── Thermometer ──────────────────────────────────────────────────

const Thermometer: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 20,
  height = 120,
  extraProps,
}) => {
  const temperature = (extraProps?.['temperature'] as number) ?? 25;
  const minTemp = 0;
  const maxTemp = 100;
  const fillFraction = Math.max(0, Math.min(1, (temperature - minTemp) / (maxTemp - minTemp)));
  const mercuryHeight = fillFraction * 75;

  return (
    <svg width={width} height={height} viewBox="0 0 20 120" fill="none">
      {/* Tube */}
      <rect x="8" y="10" width="4" height="80" rx="2"
        stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1" fill="rgba(255,255,255,0.1)" />
      {/* Bulb */}
      <circle cx="10" cy="95" r="6"
        stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1" fill="none" />
      {/* Mercury */}
      <rect x="8.5" y={90 - mercuryHeight} width="3" height={mercuryHeight + 5}
        fill="#dc2626" rx="1.5"
        style={{ transition: 'height 0.5s ease, y 0.5s ease' }} />
      <circle cx="10" cy="95" r="4.5" fill="#dc2626" />
      {/* Scale marks */}
      {[0, 25, 50, 75, 100].map(t => {
        const y = 90 - ((t - minTemp) / (maxTemp - minTemp)) * 75;
        return (
          <g key={t}>
            <line x1="12" y1={y} x2="15" y2={y} stroke="#cbd5e1" strokeWidth="0.5" />
            <text x="17" y={y + 2.5} fontSize="5" fill="#94a3b8">{t}°</text>
          </g>
        );
      })}
    </svg>
  );
};


// ── Wire Gauze ───────────────────────────────────────────────────

const WireGauze: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 80,
  height = 20,
}) => (
  <svg width={width} height={height} viewBox="0 0 80 20" fill="none">
    <rect x="2" y="2" width="76" height="16" rx="1"
      fill="#d4d4d8" stroke={highlighted ? '#2563eb' : '#a1a1aa'} strokeWidth="1" />
    {/* Grid pattern */}
    {[10, 20, 30, 40, 50, 60, 70].map(x => (
      <line key={`v${x}`} x1={x} y1="3" x2={x} y2="17" stroke="#a1a1aa" strokeWidth="0.3" />
    ))}
    {[5, 10, 15].map(y => (
      <line key={`h${y}`} x1="3" y1={y} x2="77" y2={y} stroke="#a1a1aa" strokeWidth="0.3" />
    ))}
  </svg>
);


// ── Tripod Stand ─────────────────────────────────────────────────

const Tripod: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 80,
  height = 80,
}) => (
  <svg width={width} height={height} viewBox="0 0 80 80" fill="none">
    {/* Ring */}
    <ellipse cx="40" cy="15" rx="25" ry="5"
      stroke={highlighted ? '#2563eb' : '#64748b'} strokeWidth="2" fill="none" />
    {/* Legs */}
    <line x1="15" y1="18" x2="5" y2="75" stroke="#64748b" strokeWidth="2.5" />
    <line x1="40" y1="20" x2="40" y2="75" stroke="#64748b" strokeWidth="2.5" />
    <line x1="65" y1="18" x2="75" y2="75" stroke="#64748b" strokeWidth="2.5" />
  </svg>
);


// ── Evaporating Dish ─────────────────────────────────────────────

const EvaporatingDish: React.FC<ApparatusProps> = ({
  liquidLevel = 0,
  liquidColor = 'rgba(224, 242, 254, 0.35)',
  label,
  highlighted = false,
  width = 80,
  height = 40,
}) => (
  <svg width={width} height={height} viewBox="0 0 80 40" fill="none">
    {/* Dish */}
    <path d="M 5 15 Q 5 35 40 35 Q 75 35 75 15"
      stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1.5" fill="rgba(255,255,255,0.1)" />
    {/* Rim */}
    <line x1="3" y1="15" x2="77" y2="15" stroke="#94a3b8" strokeWidth="1.5" />
    {/* Liquid */}
    {liquidLevel > 0 && (
      <path d={`M 10 18 Q 10 ${18 + liquidLevel * 15} 40 ${18 + liquidLevel * 15} Q 70 ${18 + liquidLevel * 15} 70 18 Z`}
        fill={liquidColor}
        style={{ transition: 'fill 0.5s ease' }} />
    )}
    {label && (
      <text x="40" y="12" textAnchor="middle" fontSize="7" fill="#64748b">{label}</text>
    )}
  </svg>
);


// ── Watch Glass ──────────────────────────────────────────────────

const WatchGlass: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 60,
  height = 20,
}) => (
  <svg width={width} height={height} viewBox="0 0 60 20" fill="none">
    <path d="M 5 5 Q 30 18 55 5"
      stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1.5"
      fill="rgba(224, 242, 254, 0.15)" />
  </svg>
);


// ── Glass Rod ────────────────────────────────────────────────────

const GlassRod: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 10,
  height = 120,
}) => (
  <svg width={width} height={height} viewBox="0 0 10 120" fill="none">
    <rect x="3" y="5" width="4" height="110" rx="2"
      stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1"
      fill="rgba(224, 242, 254, 0.15)" />
    <circle cx="5" cy="115" r="2.5" fill="#cbd5e1" />
  </svg>
);


// ── Matchstick / Burning Splinter ────────────────────────────────

const Matchstick: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 24,
  height = 110,
  label,
}) => (
  <svg width={width} height={height} viewBox="0 0 24 110" fill="none" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="matchFlameGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* Highlight glow */}
    {highlighted && (
      <rect x="7" y="24" width="10" height="82" rx="3" stroke="#3b82f6" strokeWidth="4" opacity="0.5" filter="blur(2px)" />
    )}

    {/* Wooden matchstick splint */}
    <rect x="10" y="28" width="4" height="76" rx="1" fill="#d97706" stroke="#92400e" strokeWidth="0.8" />
    <line x1="11.5" y1="30" x2="11.5" y2="102" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

    {/* Charred sulfur match head */}
    <ellipse cx="12" cy="27" rx="3.5" ry="5.5" fill="#1e293b" stroke="#0f172a" strokeWidth="0.8" />

    {/* Active Flame */}
    <g id="match-flame">
      {/* Outer yellow/amber flame */}
      <path
        d="M 12 4 Q 19 14 16 23 Q 12 28 8 23 Q 5 14 12 4 Z"
        fill="url(#matchFlameGrad)"
        stroke="#f59e0b"
        strokeWidth="0.8"
      >
        <animate attributeName="d" values="M 12 4 Q 19 14 16 23 Q 12 28 8 23 Q 5 14 12 4 Z; M 12 2 Q 18 13 15 23 Q 12 28 9 23 Q 6 13 12 2 Z; M 12 4 Q 19 14 16 23 Q 12 28 8 23 Q 5 14 12 4 Z" dur="0.5s" repeatCount="indefinite" />
      </path>
      {/* Inner bright orange/red flame core */}
      <path
        d="M 12 11 Q 15 17 14 23 Q 12 26 10 23 Q 9 17 12 11 Z"
        fill="#ef4444"
        opacity="0.9"
      >
        <animate attributeName="opacity" values="0.85;1;0.85" dur="0.3s" repeatCount="indefinite" />
      </path>
      {/* Blue flame base */}
      <ellipse cx="12" cy="24" rx="2.5" ry="1.5" fill="#38bdf8" opacity="0.8" />
    </g>

    {/* Label */}
    {label && (
      <text x="12" y="108" textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="var(--font-sans)">
        {label}
      </text>
    )}
  </svg>
);



// ── Test Tube Stand ──────────────────────────────────────────────

const TestTubeStand: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 240,
  height = 150,
}) => (
  <svg width={width} height={height} viewBox="0 0 240 150" fill="none" style={{ overflow: 'visible' }}>
    <defs>
      {/* Wood dark gradient */}
      <linearGradient id="woodDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="50%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>

      {/* Wood top surface gradient */}
      <linearGradient id="woodTop" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a16207" />
        <stop offset="40%" stopColor="#b45309" />
        <stop offset="70%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>

      {/* Wood post gradient */}
      <linearGradient id="woodPost" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="30%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>

      {/* Hole inner depth */}
      <radialGradient id="holeDepth" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1e1b18" />
        <stop offset="75%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#78350f" />
      </radialGradient>
    </defs>

    {/* Drop shadow on table */}
    <ellipse cx="120" cy="142" rx="105" ry="8" fill="rgba(0,0,0,0.2)" filter="blur(3px)" />

    {/* Rear drying pegs (typical NCERT wooden rack feature) */}
    {[55, 95, 145, 185].map((x) => (
      <g key={`peg-${x}`}>
        <rect x={x - 2.5} y="15" width="5" height="50" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
        <circle cx={x} cy="15" r="3.5" fill="#a16207" stroke="#451a03" strokeWidth="0.8" />
      </g>
    ))}

    {/* Bottom Base Shelf */}
    {/* Base main body */}
    <rect
      x="18"
      y="125"
      width="204"
      height="18"
      rx="4"
      fill="url(#woodDark)"
      stroke={highlighted ? '#2563eb' : '#451a03'}
      strokeWidth={highlighted ? 2 : 1}
    />
    {/* Base top highlight bevel */}
    <rect x="18" y="125" width="204" height="3" rx="1" fill="rgba(255,255,255,0.2)" />
    {/* Rubber feet */}
    <rect x="28" y="143" width="16" height="4" rx="1" fill="#1e293b" />
    <rect x="196" y="143" width="16" height="4" rx="1" fill="#1e293b" />

    {/* Recessed bottom cups for test tube rounded ends */}
    {[60, 100, 140, 180].map((x) => (
      <ellipse key={`cup-${x}`} cx={x} cy="128" rx="15" ry="3.5" fill="url(#holeDepth)" stroke="#451a03" strokeWidth="0.8" />
    ))}

    {/* Left Upright Support Post */}
    <rect x="24" y="45" width="12" height="82" rx="2" fill="url(#woodPost)" stroke="#451a03" strokeWidth="1" />
    <line x1="26" y1="46" x2="26" y2="126" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* Brass screws */}
    <circle cx="30" cy="53" r="2" fill="#d97706" stroke="#78350f" strokeWidth="0.5" />
    <circle cx="30" cy="118" r="2" fill="#d97706" stroke="#78350f" strokeWidth="0.5" />

    {/* Right Upright Support Post */}
    <rect x="204" y="45" width="12" height="82" rx="2" fill="url(#woodPost)" stroke="#451a03" strokeWidth="1" />
    <line x1="206" y1="46" x2="206" y2="126" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* Brass screws */}
    <circle cx="210" cy="53" r="2" fill="#d97706" stroke="#78350f" strokeWidth="0.5" />
    <circle cx="210" cy="118" r="2" fill="#d97706" stroke="#78350f" strokeWidth="0.5" />

    {/* Middle Upper Shelf with Test Tube Holes */}
    {/* Shelf body */}
    <rect
      x="20"
      y="50"
      width="200"
      height="14"
      rx="3"
      fill="url(#woodTop)"
      stroke={highlighted ? '#2563eb' : '#451a03'}
      strokeWidth={highlighted ? 2 : 1}
    />
    {/* Shelf top highlight */}
    <rect x="20" y="50" width="200" height="2.5" rx="1" fill="rgba(255,255,255,0.25)" />

    {/* 4 Test Tube Holes on Upper Shelf */}
    {[60, 100, 140, 180].map((x) => (
      <g key={`hole-${x}`}>
        {/* Hole opening with inner shadow */}
        <ellipse cx={x} cy="57" rx="16" ry="5" fill="url(#holeDepth)" stroke="#451a03" strokeWidth="1" />
        {/* Inner rim highlight */}
        <path
          d={`M ${x - 14} 58 A 14 4 0 0 0 ${x + 14} 58`}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.8"
          fill="none"
        />
      </g>
    ))}
  </svg>
);



// ── Ostwald Viscometer ────────────────────────────────────────────

const OstwaldViscometer: React.FC<ApparatusProps> = ({
  liquidLevel = 0,
  liquidColor = 'rgba(56, 189, 248, 0.65)',
  label = "Ostwald's Viscometer",
  highlighted = false,
  width = 140,
  height = 280,
  variables = {},
  flags = {},
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#334155';
  const rawProgress = (variables._flowProgress ?? variables.flowProgress ?? 0) as number;
  const currentProgress = Math.max(0, Math.min(1, rawProgress));
  const hasSucked = !!flags.suckedAboveMark;

  // Upper timing mark C is at y = 55, Lower timing mark D is at y = 114
  // Bulb B (upper bulb on right capillary limb) spans y = 55 to y = 114
  const upperMarkY = 55;
  const lowerMarkY = 114;
  const meniscusY = upperMarkY + currentProgress * (lowerMarkY - upperMarkY);

  // Coupled liquid level in lower Bulb A:
  // When sucked, liquid in Bulb A is drawn down to its starting level (y = 188).
  // As liquid drains from Bulb B (currentProgress 0 -> 1), Bulb A liquid rises up to y = 152.
  // When liquid is introduced before suction, it rests at y = 162.
  const bulbAInitialY = 162;
  const bulbASuckedStartY = 188;
  const bulbAFinalY = 152;
  const bulbAY = hasSucked
    ? bulbASuckedStartY - currentProgress * (bulbASuckedStartY - bulbAFinalY)
    : bulbAInitialY;

  // Symmetrical Bulb A width at bulbAY (centered at X=40, y=168)
  const bulbARadiusX = Math.max(11, 17.5 - Math.abs(bulbAY - 168) * 0.22);

  return (
    <svg width={width} height={height} viewBox="0 0 140 280" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        {/* Glass reflection gradient */}
        <linearGradient id="ostwaldGlassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="20%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
        </linearGradient>

        {/* Clip path for liquid draining down upper Bulb B */}
        <clipPath id="upperBulbClip">
          <path d="M 94 54 C 80 66 80 102 94 114 L 102 114 C 116 102 116 66 102 54 Z" />
        </clipPath>

        {/* Clip path for lower limb, Bulb A, U-bend, and capillary connection */}
        <clipPath id="lowerLimbClip">
          <path
            d={`
              M 32 140
              C 18 152 18 184 32 196
              L 32 215
              C 32 254 104 254 104 215
              L 104 114
              L 92 114
              L 92 215
              C 92 238 48 238 48 215
              L 48 196
              C 62 184 62 152 48 140
              Z
            `}
          />
        </clipPath>
      </defs>

      {/* ── Glass Body: Outer and Inner Walls forming the authentic Ostwald U-tube ── */}
      {/* Outer Contour */}
      <path
        d={`
          M 32 20
          L 32 140
          C 18 152 18 184 32 196
          L 32 215
          C 32 254 104 254 104 215
          L 104 114
          C 118 102 118 66 104 54
          L 104 20
        `}
        stroke={strokeColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="rgba(241, 245, 249, 0.22)"
      />

      {/* Inner Wall Contour */}
      <path
        d={`
          M 48 20
          L 48 140
          C 62 152 62 184 48 196
          L 48 215
          C 48 238 92 238 92 215
          L 94 114
          C 80 102 80 66 94 54
          L 94 20
        `}
        stroke={strokeColor}
        strokeWidth="2.2"
        fill="url(#ostwaldGlassGrad)"
      />

      {/* ── Liquid Layer ── */}
      {liquidLevel > 0 && (
        <g opacity="0.92">
          {/* Continuous liquid volume: Bulb A + U-bend + right capillary connection */}
          <g clipPath="url(#lowerLimbClip)">
            {/* Liquid filling from bulbAY down through U-tube */}
            <rect
              x="16"
              y={bulbAY}
              width="90"
              height={260 - bulbAY}
              fill={liquidColor}
            />
            {/* Meniscus on top of rising liquid in Bulb A */}
            <ellipse
              cx="40"
              cy={bulbAY}
              rx={bulbARadiusX}
              ry="2.4"
              fill="rgba(255,255,255,0.45)"
              stroke={liquidColor}
              strokeWidth="0.8"
            />
          </g>

          {/* Liquid in Upper Bulb B (on right capillary limb) during flow from Mark C to D */}
          {hasSucked && currentProgress < 1 && (
            <g clipPath="url(#upperBulbClip)">
              {/* Draining liquid column based on exact student progress */}
              <rect
                x="76"
                y={meniscusY}
                width="44"
                height={Math.max(0, lowerMarkY - meniscusY + 4)}
                fill={liquidColor}
              />
              {/* Curved liquid meniscus surface */}
              <ellipse
                cx="98"
                cy={meniscusY}
                rx="14"
                ry="2.6"
                fill="rgba(255,255,255,0.45)"
                stroke={liquidColor}
                strokeWidth="0.8"
              />
            </g>
          )}

          {/* Narrow Capillary liquid column (connecting below lower Mark D down into U-tube) */}
          {hasSucked && (
            <rect
              x="96"
              y="114"
              width="6"
              height="101"
              fill={liquidColor}
              opacity="0.85"
            />
          )}
        </g>
      )}

      {/* Capillary bore centerline in narrow right limb */}
      <line x1="98" y1="114" x2="98" y2="185" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />

      {/* ── Upper Timing Mark (Mark C) ── */}
      <line x1="88" y1={upperMarkY} x2="110" y2={upperMarkY} stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      <text x="115" y={upperMarkY + 4} fontSize="13" fontWeight="900" fill="#dc2626">C</text>

      {/* ── Lower Timing Mark (Mark D) ── */}
      <line x1="88" y1={lowerMarkY} x2="110" y2={lowerMarkY} stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      <text x="115" y={lowerMarkY + 4} fontSize="13" fontWeight="900" fill="#dc2626">D</text>

      {/* Limb & Bulb Labels for accurate pedagogy */}
      <text x="40" y="172" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#1e293b">Bulb A</text>
      <text x="98" y="86" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#1e293b">Bulb B</text>

      {/* Descriptive limb indicators */}
      <text x="40" y="14" textAnchor="middle" fontSize="8" fontWeight="700" fill="#64748b">Broad Limb</text>
      <text x="98" y="14" textAnchor="middle" fontSize="8" fontWeight="700" fill="#64748b">Capillary Limb</text>
      <text x="98" y="150" textAnchor="middle" fontSize="7.5" fontStyle="italic" fill="#64748b">Capillary</text>

      {/* Glass reflections & highlights */}
      <path d="M 35 25 L 35 135" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 97 25 L 97 50" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 23 165 C 21 175 25 185 30 190" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none" />

      {/* Stand Clamp Attachment Graphic (gripping upper broad limb naturally) */}
      <rect x="25" y="70" width="30" height="11" rx="2.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" opacity="0.85" />
      <circle cx="40" cy="75.5" r="2.5" fill="#94a3b8" />

      {/* Apparatus Label */}
      {label && (
        <text x="68" y="272" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#0f172a">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Digital Stopwatch ─────────────────────────────────────────────

const Stopwatch: React.FC<ApparatusProps> = ({
  label = 'Digital Stopwatch',
  highlighted = false,
  width = 110,
  height = 120,
  variables = {},
  flags = {},
  extraProps = {},
}) => {
  const isRunning = !!flags.timerRunning;
  const timeSeconds = (variables._timerSeconds ?? variables.timerSeconds ?? 0) as number;
  const mins = Math.floor(timeSeconds / 60);
  const secs = (timeSeconds % 60).toFixed(1);
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.padStart(4, '0')}`;
  const onToggle = extraProps.onToggleStopwatch as (() => void) | undefined;

  return (
    <svg width={width} height={height} viewBox="0 0 110 120" fill="none">
      {/* Top buttons */}
      <rect x="49" y="6" width="12" height="10" rx="2" fill="#475569" stroke="#334155" strokeWidth="1.5" />
      <rect x="22" y="14" width="10" height="8" rx="2" fill="#64748b" transform="rotate(-30 27 18)" />
      <rect
        x="78"
        y="10"
        width="10"
        height="8"
        rx="2"
        fill={isRunning ? '#ef4444' : '#10b981'}
        transform="rotate(30 83 14)"
        style={{ cursor: onToggle ? 'pointer' : 'default' }}
        onClick={onToggle}
      />

      {/* Body casing */}
      <circle
        cx="55"
        cy="65"
        r="46"
        fill="#1e293b"
        stroke={highlighted ? '#2563eb' : '#334155'}
        strokeWidth="3"
        style={{ cursor: onToggle ? 'pointer' : 'default' }}
        onClick={onToggle}
      />
      <circle cx="55" cy="65" r="42" fill="#0f172a" />

      {/* Inner dial rim */}
      <circle cx="55" cy="65" r="38" fill="#182234" stroke="#334155" strokeWidth="1" />

      {/* LCD Display */}
      <rect x="25" y="46" width="60" height="26" rx="4" fill="#022c22" stroke="#065f46" strokeWidth="1" />
      <text
        x="55"
        y="64"
        textAnchor="middle"
        fontFamily="var(--font-mono, monospace)"
        fontSize="14"
        fontWeight="800"
        fill="#34d399"
        letterSpacing="0.05em"
      >
        {timeStr}
      </text>
      <text x="55" y="42" textAnchor="middle" fontSize="6.5" fill="#94a3b8" letterSpacing="0.08em">
        CHRONOMETER
      </text>

      {/* Status indicator LED */}
      <circle cx="55" cy="80" r="3.5" fill={isRunning ? '#10b981' : '#64748b'} />
      <text x="55" y="92" textAnchor="middle" fontSize="7" fontWeight="600" fill={isRunning ? '#34d399' : '#94a3b8'}>
        {isRunning ? 'RUNNING' : 'STOPPED'}
      </text>

      {/* Label */}
      {label && (
        <text x="55" y="117" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#475569">
          {label}
        </text>
      )}
    </svg>
  );
};



// ── Benchtop Digital pH Meter ────────────────────────────────────

const PHMeter: React.FC<ApparatusProps> = ({
  label = 'Digital pH Meter',
  highlighted = false,
  width = 160,
  height = 140,
  variables = {},
  flags = {},
}) => {
  const currentPH = variables.pH !== undefined ? variables.pH.toFixed(2) : '7.00';
  const temp = variables.temperature ?? 25.0;
  const isCalibrated = flags.calibrated ?? true;

  return (
    <svg width={width} height={height} viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="phBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <filter id="lcdGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Instrument housing with depth */}
      <rect
        x="15"
        y="32"
        width="130"
        height="90"
        rx="8"
        fill="url(#phBodyGrad)"
        stroke={highlighted ? '#3b82f6' : '#475569'}
        strokeWidth="2.5"
      />
      {/* Front panel bevel */}
      <rect x="22" y="38" width="116" height="52" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />

      {/* LCD Screen with glow */}
      <rect x="30" y="44" width="70" height="38" rx="3" fill="#042f2e" stroke="#14b8a6" strokeWidth="1" />
      <text
        x="65"
        y="70"
        textAnchor="middle"
        fontFamily="var(--font-mono, monospace)"
        fontSize="18"
        fontWeight="800"
        fill="#2dd4bf"
        filter="url(#lcdGlow)"
      >
        {currentPH}
      </text>
      <text x="35" y="52" fontSize="7" fill="#5eead4" fontWeight="800">pH</text>
      <text x="88" y="77" fontSize="7" fill="#99f6e4" fontWeight="600">{temp.toFixed(1)}°C</text>

      {/* Secondary indicators */}
      <g transform="translate(112, 48)">
        <circle cx="0" cy="4" r="3.5" fill={isCalibrated ? '#10b981' : '#f59e0b'} />
        <text x="7" y="6.5" fontSize="7" fill="#94a3b8" fontWeight="600">CAL</text>
        <circle cx="0" cy="18" r="3.5" fill="#38bdf8" />
        <text x="7" y="20.5" fontSize="7" fill="#94a3b8" fontWeight="600">ATC</text>
      </g>

      {/* Control knobs - stylized */}
      {[
        { x: 45, label: 'CAL 4' },
        { x: 80, label: 'CAL 9' },
        { x: 115, label: 'TEMP' },
      ].map((knob) => (
        <g key={knob.label} transform={`translate(${knob.x}, 105)`}>
          <circle r="9" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
          <rect x="-1" y="-7" width="2" height="5" fill="#cbd5e1" rx="0.5" />
          <text y="14" textAnchor="middle" fontSize="6.5" fill="#94a3b8" fontWeight="700">{knob.label}</text>
        </g>
      ))}

      {/* Glass Electrode Probe attachment - much more detailed */}
      <path d="M 145 65 C 165 65 165 95 152 110" stroke="#1e293b" strokeWidth="3" fill="none" />
      <g transform="translate(148, 105)">
        <rect width="10" height="32" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
        {/* Glass electrode internal structure */}
        <rect x="3" y="5" width="4" height="22" fill="#f1f5f9" opacity="0.3" />
        {/* Blue reference bulb */}
        <circle cx="5" cy="32" r="4.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.2" />
        <circle cx="3.5" cy="30.5" r="1.5" fill="#ffffff" opacity="0.6" />
      </g>

      {/* Label */}
      {label && (
        <text x="80" y="136" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155" letterSpacing="0.02em">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Conductivity Bridge & Cell ───────────────────────────────────

const ConductivityBridge: React.FC<ApparatusProps> = ({
  label = 'Conductivity Bridge',
  highlighted = false,
  width = 160,
  height = 140,
  variables = {},
}) => {
  const conductance = variables.conductance !== undefined ? variables.conductance.toFixed(2) : '3.80';
  const unit = variables.condUnit || 'mS/cm';

  return (
    <svg width={width} height={height} viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="condBodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Main console body with perspective */}
      <rect
        x="15"
        y="32"
        width="130"
        height="90"
        rx="8"
        fill="url(#condBodyGrad)"
        stroke={highlighted ? '#3b82f6' : '#38bdf8'}
        strokeWidth="2.5"
      />
      {/* Front bezel */}
      <rect x="22" y="38" width="116" height="48" rx="4" fill="#111827" stroke="#1e293b" strokeWidth="1.2" />

      {/* LED Readout - blue digital look */}
      <rect x="30" y="45" width="80" height="34" rx="3" fill="#081431" stroke="#2563eb" strokeWidth="1" />
      <text
        x="70"
        y="70"
        textAnchor="middle"
        fontFamily="var(--font-mono, monospace)"
        fontSize="18"
        fontWeight="900"
        fill="#60a5fa"
        style={{ textShadow: '0 0 5px rgba(96, 165, 250, 0.5)' }}
      >
        {conductance}
      </text>
      <text x="106" y="76" textAnchor="end" fontSize="6.5" fill="#93c5fd" fontWeight="800">{unit}</text>
      <text x="35" y="52" fontSize="7" fill="#bfdbfe" fontWeight="800">CONDUCTANCE</text>

      {/* Range switch & knob - detailed */}
      <g transform="translate(122, 62)">
        <circle r="11" fill="#334155" stroke="#475569" strokeWidth="2" />
        <line y1="-11" y2="-7" stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1="11" x2="7" transform="rotate(45)" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="11" x2="7" transform="rotate(90)" stroke="#cbd5e1" strokeWidth="1" />
        <path d="M 0 0 L 8 -5" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
        <text y="18" textAnchor="middle" fontSize="6.5" fill="#94a3b8" fontWeight="700">RANGE</text>
      </g>

      {/* Bottom tuning dials */}
      <g transform="translate(45, 105)">
        <circle r="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <rect x="-1" y="-6" width="2" height="4" fill="#60a5fa" />
        <text y="14" textAnchor="middle" fontSize="6.5" fill="#94a3b8" fontWeight="700">NULL</text>
      </g>

      <g transform="translate(90, 105)">
        <circle r="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <rect x="-1" y="-6" width="2" height="4" fill="#60a5fa" />
        <text y="14" textAnchor="middle" fontSize="6.5" fill="#94a3b8" fontWeight="700">CONST</text>
      </g>

      {/* Conductivity Cell - more accurate structure */}
      <path d="M 140 75 C 160 75 160 100 152 115" stroke="#334155" strokeWidth="3" fill="none" />
      <g transform="translate(148, 115)">
        {/* Glass envelope */}
        <rect width="10" height="28" rx="2" fill="rgba(255,255,255,0.15)" stroke="#475569" strokeWidth="1" />
        {/* Platinum electrodes */}
        <line x1="3" y1="20" x2="7" y2="20" stroke="#1e293b" strokeWidth="3" />
        <line x1="3" y1="25" x2="7" y2="25" stroke="#1e293b" strokeWidth="3" />
        <line x1="5" y1="2" x2="5" y2="20" stroke="#475569" strokeWidth="0.8" />
      </g>

      {/* Label */}
      {label && (
        <text x="80" y="136" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155" letterSpacing="0.02em">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Magnetic Stirrer Plate ───────────────────────────────────────

const MagneticStirrer: React.FC<ApparatusProps> = ({
  label = 'Magnetic Stirrer',
  highlighted = false,
  width = 130,
  height = 95,
  flags = {},
}) => {
  const isStirring = flags.stirring ?? false;

  return (
    <svg width={width} height={height} viewBox="0 0 130 95" fill="none">
      <defs>
        <linearGradient id="stirBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Ceramic top plate with highlight */}
      <rect
        x="15"
        y="18"
        width="100"
        height="20"
        rx="3"
        fill="#ffffff"
        stroke={highlighted ? '#3b82f6' : '#cbd5e1'}
        strokeWidth="2"
      />
      <rect x="17" y="20" width="96" height="3" rx="1" fill="#f8fafc" />

      {/* Magnetic stir bar with spin animation visual hint */}
      <g transform="translate(65, 28)">
        <rect x="-8" y="-3" width="16" height="6" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        {isStirring && (
          <g>
            <circle r="12" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="0.5s" repeatCount="indefinite" />
            </circle>
            <circle r="6" fill="#38bdf8" opacity="0.2">
              <animate attributeName="r" values="5;8;5" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </g>

      {/* Heavy base body */}
      <rect x="18" y="38" width="94" height="45" rx="4" fill="url(#stirBodyGrad)" stroke="#0f172a" strokeWidth="2" />

      {/* Speed control knob - textured */}
      <g transform="translate(45, 60)">
        <circle r="10" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
        <path d="M 0 0 L 0 -8" stroke={isStirring ? '#38bdf8' : '#cbd5e1'} strokeWidth="2.5" strokeLinecap="round" transform={isStirring ? "rotate(135)" : "rotate(0)"} />
        <text y="18" textAnchor="middle" fontSize="7" fontWeight="700" fill="#cbd5e1">SPEED</text>
      </g>

      {/* Heat switch & pilot indicator */}
      <g transform="translate(85, 60)">
        <circle r="4" fill={isStirring ? '#10b981' : '#ef4444'} style={{ filter: isStirring ? 'drop-shadow(0 0 3px #10b981)' : 'none' }} />
        <text y="18" textAnchor="middle" fontSize="7" fontWeight="700" fill="#cbd5e1">POWER</text>
      </g>

      {/* Label */}
      {label && (
        <text x="65" y="92" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569" letterSpacing="0.02em">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Graduated Measuring Cylinder ─────────────────────────────────

const MeasuringCylinder: React.FC<ApparatusProps> = ({
  id = 'measuring-cylinder',
  liquidLevel = 0,
  liquidColor = 'rgba(56, 189, 248, 0.65)',
  label = '100 mL Cylinder',
  highlighted = false,
  width = 70,
  height = 220,
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#64748b';
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  const fillHeight = 148 * effectiveLevel;
  const fillY = 192 - fillHeight;
  const gradId = `cylLiquid-${id || 'def'}`;

  return (
    <svg width={width} height={height} viewBox="0 0 70 220" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.75" />
          <stop offset="50%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.88" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.98" />
        </linearGradient>

        <linearGradient id={`cylGlass-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>
      </defs>

      {/* Hexagonal / Circular Base */}
      <path d="M 12 196 L 58 196 L 64 210 L 6 210 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
      <line x1="8" y1="197" x2="62" y2="197" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

      {/* Cylinder Glass Back */}
      <rect x="22" y="35" width="26" height="158" rx="2" stroke="#cbd5e1" strokeWidth="1.5" fill="rgba(241,245,249,0.2)" />

      {/* ── Liquid Fill with Meniscus ── */}
      {effectiveLevel > 0 && (
        <g id="cylinder-liquid">
          <rect x="23" y={fillY} width="24" height={fillHeight} rx="1" fill={`url(#${gradId})`} style={{ transition: 'height 2.0s cubic-bezier(0.25, 1, 0.5, 1), y 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }} />
          {/* Meniscus */}
          <ellipse cx="35" cy={fillY} rx="11.8" ry="2.6" fill="rgba(255,255,255,0.3)" stroke={liquidColor} strokeWidth="0.8" style={{ transition: 'all 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }} />
          <ellipse cx="35" cy={fillY - 0.2} rx="7.5" ry="1.2" fill="rgba(255,255,255,0.45)" style={{ transition: 'all 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }} />
        </g>
      )}

      {/* Cylinder Glass Front & Spout */}
      <rect x="22" y="35" width="26" height="158" rx="2" stroke={strokeColor} strokeWidth="2.2" fill="none" />
      {/* Spout on left */}
      <path d="M 22 35 C 16 35 13 32 10 30 C 14 36 18 39 22 41" stroke={strokeColor} strokeWidth="2" fill="rgba(241,245,249,0.3)" />

      {/* Glass reflections */}
      <line x1="25" y1="40" x2="25" y2="190" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="45" y1="40" x2="45" y2="190" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeLinecap="round" />

      {/* Graduation Lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
        const y = 190 - i * 14.5;
        return (
          <g key={i}>
            <line x1="22" y1={y} x2={i % 2 === 0 ? '33' : '28'} y2={y} stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <line x1="22" y1={y} x2={i % 2 === 0 ? '33' : '28'} y2={y} stroke="#64748b" strokeWidth="0.8" />
            {i % 2 === 0 && (
              <text x="35" y={y + 2.5} fontSize="6" fill="#64748b" fontFamily="var(--font-mono, monospace)">
                {i * 10}
              </text>
            )}
          </g>
        );
      })}

      {/* Label */}
      {label && (
        <text x="35" y="218" textAnchor="middle" fontSize="8" fontWeight="600" fill="#334155" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Volumetric Flask (250 mL) ────────────────────────────────────

const VolumetricFlask: React.FC<ApparatusProps> = ({
  id = 'volumetric-flask',
  liquidLevel = 0,
  liquidColor = 'rgba(56, 189, 248, 0.65)',
  label = '250 mL Volumetric Flask',
  highlighted = false,
  width = 110,
  height = 180,
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#64748b';
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  // Total fillable height in volumetric flask is ~130px (from y=158 up to y=28)
  const fillHeight = 130 * effectiveLevel;
  const fillY = 158 - fillHeight;
  const gradId = `volFlaskLiquid-${id || 'def'}`;
  const clipId = `volFlaskClip-${id || 'def'}`;

  // Approximate half-width at fillY for meniscus
  const halfW = fillY < 84 ? 4.5 : 4.5 + Math.sin(((158 - fillY) / 74) * Math.PI) * 28;

  return (
    <svg width={width} height={height} viewBox="0 0 110 180" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={clipId}>
          <path d="M 51 25 L 51 84 C 27 104 20 135 27 155 Q 32 159 55 159 Q 78 159 83 155 C 90 135 83 104 59 84 L 59 25 Z" />
        </clipPath>

        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.75" />
          <stop offset="50%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.88" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.98" />
        </linearGradient>
      </defs>

      {/* Stopper */}
      <polygon points="50,12 60,12 58,28 52,28" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
      <ellipse cx="55" cy="12" rx="7" ry="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Flask Glass Back Wall */}
      <path
        d="M 50 25 L 50 85 C 25 105 18 135 25 155 Q 30 160 55 160 Q 80 160 85 155 C 92 135 85 105 60 85 L 60 25 Z"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        fill="rgba(241, 245, 249, 0.2)"
      />

      {/* ── Liquid Fill via Inner Clip Path & Meniscus ── */}
      {effectiveLevel > 0 && (
        <g id="vol-flask-liquid">
          <rect
            x="15"
            y={fillY}
            width="80"
            height={fillHeight + 10}
            fill={`url(#${gradId})`}
            clipPath={`url(#${clipId})`}
            style={{ transition: 'height 2.0s cubic-bezier(0.25, 1, 0.5, 1), y 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }}
          />
          {/* Meniscus surface */}
          <ellipse
            cx="55"
            cy={fillY}
            rx={Math.max(2, halfW)}
            ry={fillY < 84 ? 1 : 2.6}
            fill="rgba(255, 255, 255, 0.3)"
            stroke={liquidColor}
            strokeWidth="0.8"
            style={{ transition: 'all 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }}
          />
        </g>
      )}

      {/* Flask Body Outline */}
      <path
        d="M 50 25 L 50 85 C 25 105 18 135 25 155 Q 30 160 55 160 Q 80 160 85 155 C 92 135 85 105 60 85 L 60 25 Z"
        stroke={strokeColor}
        strokeWidth="2.2"
        fill="none"
      />

      {/* Graduation ring mark etched on neck */}
      <line x1="48" y1="65" x2="62" y2="65" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 1" />
      <text x="66" y="67" fontSize="6.5" fill="#ef4444" fontWeight="700">250 mL</text>

      {/* Glass highlights */}
      <path d="M 52 30 L 52 80" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" />
      <path d="M 28 140 A 25 25 0 0 0 45 155" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />

      {/* Label */}
      {label && (
        <text x="55" y="174" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#334155" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── BOD Incubation Bottle ────────────────────────────────────────

const BODBottle: React.FC<ApparatusProps> = ({
  id = 'bod-bottle',
  liquidLevel = 0,
  liquidColor = 'rgba(56, 189, 248, 0.65)',
  label = 'BOD Bottle (300 mL)',
  highlighted = false,
  width = 100,
  height = 170,
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#64748b';
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  const fillHeight = 104 * effectiveLevel;
  const fillY = 146 - fillHeight;
  const gradId = `bodLiquid-${id || 'def'}`;
  const clipId = `bodClip-${id || 'def'}`;

  return (
    <svg width={width} height={height} viewBox="0 0 100 170" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={clipId}>
          <rect x="28" y="38" width="44" height="110" rx="6" />
        </clipPath>

        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.75" />
          <stop offset="50%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.88" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.98" />
        </linearGradient>
      </defs>

      {/* Ground glass penny-head stopper */}
      <rect x="44" y="8" width="12" height="16" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
      <ellipse cx="50" cy="8" rx="10" ry="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Flared funnel-shaped mouth */}
      <path d="M 40 24 L 60 24 L 56 38 L 44 38 Z" fill="rgba(241,245,249,0.3)" stroke={strokeColor} strokeWidth="1.8" />

      {/* Bottle Body Back Wall */}
      <rect
        x="26"
        y="38"
        width="48"
        height="110"
        rx="8"
        fill="rgba(241,245,249,0.2)"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* ── Liquid Fill with Meniscus ── */}
      {effectiveLevel > 0 && (
        <g id="bod-liquid">
          <rect
            x="26"
            y={fillY}
            width="48"
            height={fillHeight + 5}
            fill={`url(#${gradId})`}
            clipPath={`url(#${clipId})`}
            style={{ transition: 'height 2.0s cubic-bezier(0.25, 1, 0.5, 1), y 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }}
          />
          <ellipse cx="50" cy={fillY} rx="21.5" ry="3" fill="rgba(255,255,255,0.3)" stroke={liquidColor} strokeWidth="0.8" style={{ transition: 'all 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }} />
        </g>
      )}

      {/* Bottle Body Outline */}
      <rect
        x="26"
        y="38"
        width="48"
        height="110"
        rx="8"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.2"
      />

      {/* Glass highlights */}
      <line x1="30" y1="44" x2="30" y2="140" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="44" x2="70" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeLinecap="round" />

      {/* Label */}
      {label && (
        <text x="50" y="162" textAnchor="middle" fontSize="8" fontWeight="600" fill="#334155" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Constant Temperature Water Bath ──────────────────────────────

const WaterBath: React.FC<ApparatusProps> = ({
  label = 'Constant Temperature Water Bath',
  highlighted = false,
  width = 130,
  height = 90,
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#64748b';

  return (
    <svg width={width} height={height} viewBox="0 0 130 90" fill="none" style={{ overflow: 'visible' }}>
      {/* Outer Basin */}
      <rect x="10" y="25" width="110" height="55" rx="6" fill="#e2e8f0" stroke={strokeColor} strokeWidth="2" />
      {/* Inner Chamber with Water */}
      <rect x="15" y="30" width="100" height="46" rx="4" fill="rgba(56, 189, 248, 0.25)" stroke="#94a3b8" strokeWidth="1" />
      {/* Water line shimmer */}
      <line x1="16" y1="36" x2="114" y2="36" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="6 3" />
      {/* Thermometer / Heater Well */}
      <rect x="22" y="10" width="6" height="60" rx="2" fill="#ef4444" opacity="0.85" />
      <text x="32" y="20" fontSize="7" fontWeight="700" fill="#ef4444">30°C</text>

      {/* Label */}
      {label && (
        <text x="65" y="75" textAnchor="middle" fontSize="8" fontWeight="600" fill="#334155" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Specific Gravity Bottle (Pycnometer) ──────────────────────────

const SpecificGravityBottle: React.FC<ApparatusProps> = ({
  id = 'sp-gr-bottle',
  liquidLevel = 0,
  liquidColor = 'rgba(56, 189, 248, 0.65)',
  label = '25 mL Sp. Gr. Bottle',
  highlighted = false,
  width = 80,
  height = 120,
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#64748b';
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  const fillHeight = 65 * effectiveLevel;
  const fillY = 98 - fillHeight;
  const gradId = `spGrLiquid-${id || 'def'}`;
  const clipId = `spGrClip-${id || 'def'}`;

  return (
    <svg width={width} height={height} viewBox="0 0 80 120" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={clipId}>
          <path d="M 36 30 L 36 45 C 22 55 18 75 22 95 Q 24 99 40 99 Q 56 99 58 95 C 62 75 58 55 44 45 L 44 30 Z" />
        </clipPath>

        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.75" />
          <stop offset="50%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.88" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.98" />
        </linearGradient>
      </defs>

      {/* Capillary Stopper */}
      <rect x="37" y="10" width="6" height="24" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Central fine capillary bore */}
      <line x1="40" y1="10" x2="40" y2="34" stroke="#ef4444" strokeWidth="0.8" />
      <ellipse cx="40" cy="10" rx="4" ry="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

      {/* Bottle Flask Body Back Wall */}
      <path
        d="M 36 30 L 36 45 C 22 55 18 75 22 95 Q 24 100 40 100 Q 56 100 58 95 C 62 75 58 55 44 45 L 44 30 Z"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        fill="rgba(241,245,249,0.2)"
      />

      {/* ── Liquid with Clip Path ── */}
      {effectiveLevel > 0 && (
        <g id="pycnometer-liquid">
          <rect
            x="16"
            y={fillY}
            width="48"
            height={fillHeight + 10}
            fill={`url(#${gradId})`}
            clipPath={`url(#${clipId})`}
            style={{ transition: 'height 2.0s cubic-bezier(0.25, 1, 0.5, 1), y 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }}
          />
          <ellipse
            cx="40"
            cy={fillY}
            rx={fillY < 45 ? 3.8 : 17}
            ry={fillY < 45 ? 1 : 2.5}
            fill="rgba(255,255,255,0.3)"
            stroke={liquidColor}
            strokeWidth="0.6"
            style={{ transition: 'all 2.0s cubic-bezier(0.25, 1, 0.5, 1)' }}
          />
        </g>
      )}

      {/* Bottle Outline */}
      <path
        d="M 36 30 L 36 45 C 22 55 18 75 22 95 Q 24 100 40 100 Q 56 100 58 95 C 62 75 58 55 44 45 L 44 30 Z"
        stroke={strokeColor}
        strokeWidth="2"
        fill="none"
      />

      {/* Glass highlights */}
      <path d="M 23 75 Q 21 88 30 96" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill="none" />

      {/* Label */}
      {label && (
        <text x="40" y="114" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#334155" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};



// ══════════════════════════════════════════════════════════════════
//  APPARATUS REGISTRY
// ══════════════════════════════════════════════════════════════════

/**
 * Registry mapping component name strings (used in experiment configs)
 * to actual React components.
 *
 * To add a new apparatus:
 * 1. Create the SVG component above (accepts ApparatusProps)
 * 2. Add it to this registry
 * 3. Reference it by name in experiment configs
 */
export const APPARATUS_REGISTRY: Record<string, React.FC<ApparatusProps>> = {
  // Containers
  ConicalFlask,
  Beaker,
  TestTube,
  EvaporatingDish,
  WatchGlass,
  VolumetricFlask,
  BODBottle,
  SpecificGravityBottle,
  MeasuringCylinder,

  // Transfer & Fluid Dynamics
  Burette: BuretteSVG,
  Pipette: PipetteSVG,
  Dropper: DropperBottle,
  ReagentBottle,
  GlassRod,
  Matchstick,
  OstwaldViscometer,

  // Heating & Temperature
  BunsenBurner,
  WireGauze,
  Tripod,
  WaterBath,

  // Measuring & Electrochemistry
  DigitalBalance: DigitalBalanceSVG,
  Thermometer,
  Stopwatch,
  PHMeter,
  ConductivityBridge,

  // Mechanical / Support
  MagneticStirrer,
  RetortStand,
  BuretteStand,
  TestTubeStand,

  // Sealing
  RubberCork,
};

/**
 * Look up an apparatus component by name.
 * Returns undefined if not found.
 */
export function getApparatusComponent(
  componentName: string,
): React.FC<ApparatusProps> | undefined {
  return APPARATUS_REGISTRY[componentName];
}

/**
 * Get all registered apparatus names.
 */
export function getRegisteredApparatus(): string[] {
  return Object.keys(APPARATUS_REGISTRY);
}
