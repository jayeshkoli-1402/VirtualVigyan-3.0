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
  liquidLevel = 0,
  liquidColor = 'rgba(224, 242, 254, 0.35)',
  label,
  highlighted = false,
  width = 120,
  height = 140,
}) => {
  const fillHeight = 60 * liquidLevel;
  const fillY = 110 - fillHeight;

  return (
    <svg width={width} height={height} viewBox="0 0 120 140" fill="none">
      {/* Flask body */}
      <path
        d="M 45 20 L 45 50 L 15 110 Q 12 118 20 120 L 100 120 Q 108 118 105 110 L 75 50 L 75 20"
        stroke={highlighted ? '#2563eb' : '#94a3b8'}
        strokeWidth="2"
        fill="rgba(255,255,255,0.1)"
      />
      {/* Neck */}
      <rect x="45" y="10" width="30" height="12" rx="2"
        stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="2" fill="none" />
      {/* Liquid */}
      {liquidLevel > 0 && (
        <path
          d={`M ${20 + (50 - fillHeight) * 0.3} ${fillY + 10}
              L ${100 - (50 - fillHeight) * 0.3} ${fillY + 10}
              L 100 120 Q 108 118 105 110
              L 105 110
              L 15 110 Q 12 118 20 120 Z`}
          fill={liquidColor}
          style={{ transition: 'fill 0.5s ease' }}
        />
      )}
      {/* Label */}
      {label && (
        <text x="60" y="135" textAnchor="middle" fontSize="9" fill="#64748b"
          fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
      {/* Graduations */}
      {[0.25, 0.5, 0.75].map(level => (
        <line key={level}
          x1={18 + (1 - level) * 27} y1={110 - level * 60}
          x2={22 + (1 - level) * 27} y2={110 - level * 60}
          stroke="#cbd5e1" strokeWidth="1" />
      ))}
    </svg>
  );
};


// ── Generic Beaker ───────────────────────────────────────────────

const Beaker: React.FC<ApparatusProps> = ({
  liquidLevel = 0,
  liquidColor = 'rgba(224, 242, 254, 0.35)',
  label,
  highlighted = false,
  width = 100,
  height = 120,
}) => {
  const fillHeight = 80 * liquidLevel;

  return (
    <svg width={width} height={height} viewBox="0 0 100 120" fill="none">
      {/* Beaker body */}
      <path d="M 15 15 L 15 100 Q 15 110 25 110 L 75 110 Q 85 110 85 100 L 85 15"
        stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="2" fill="rgba(255,255,255,0.1)" />
      {/* Spout */}
      <path d="M 15 15 L 8 15 L 8 25 L 15 20" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      {/* Liquid */}
      {liquidLevel > 0 && (
        <rect x="17" y={100 - fillHeight} width="66" height={fillHeight}
          rx="2" fill={liquidColor} style={{ transition: 'fill 0.5s ease, height 0.3s ease' }} />
      )}
      {/* Graduations */}
      {[25, 50, 75, 100].map((ml, i) => (
        <g key={ml}>
          <line x1="80" y1={100 - (i + 1) * 18} x2="85" y2={100 - (i + 1) * 18}
            stroke="#cbd5e1" strokeWidth="1" />
          <text x="78" y={100 - (i + 1) * 18 + 3} textAnchor="end" fontSize="7" fill="#94a3b8">
            {ml}
          </text>
        </g>
      ))}
      {label && (
        <text x="50" y="118" textAnchor="middle" fontSize="9" fill="#64748b"
          fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Generic Test Tube ────────────────────────────────────────────

const TestTube: React.FC<ApparatusProps> = ({
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

  return (
    <svg width={width} height={height} viewBox="0 0 76 230" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        {/* Glass reflection gradient */}
        <linearGradient id="glassStreak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>

        {/* Liquid depth gradient */}
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.9" />
          <stop offset="30%" stopColor={liquidColor} stopOpacity="0.75" />
          <stop offset="85%" stopColor={liquidColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
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
            fill="url(#liquidGrad)"
            style={{ transition: 'all 0.4s ease' }}
          />
          {/* Curved Meniscus surface */}
          <ellipse
            cx="38"
            cy={liquidTopY}
            rx="15"
            ry="3.5"
            fill="rgba(255, 255, 255, 0.4)"
            stroke="#0284c7"
            strokeWidth="0.8"
            opacity="0.85"
          />
          {/* Liquid highlight line */}
          <line
            x1="26"
            y1={liquidTopY + 2}
            x2="50"
            y2={liquidTopY + 2}
            stroke="rgba(255, 255, 255, 0.6)"
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
      <line x1="25" y1="24" x2="25" y2="188" stroke="url(#glassStreak)" strokeWidth="2" strokeLinecap="round" />
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



// ── Generic Burette (simplified) ─────────────────────────────────

const BuretteSVG: React.FC<ApparatusProps> = ({
  liquidLevel = 1,
  liquidColor = 'rgba(224, 242, 254, 0.5)',
  label,
  highlighted = false,
  width = 50,
  height = 200,
}) => {
  const tubeTop = 20;
  const tubeBottom = 160;
  const tubeHeight = tubeBottom - tubeTop;
  const fillHeight = tubeHeight * liquidLevel;

  return (
    <svg width={width} height={height} viewBox="0 0 50 200" fill="none">
      {/* Funnel top */}
      <path d="M 15 15 L 20 20 L 30 20 L 35 15" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      {/* Main tube */}
      <rect x="20" y={tubeTop} width="10" height={tubeHeight}
        stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1.5"
        fill="rgba(255,255,255,0.1)" rx="1" />
      {/* Liquid */}
      {liquidLevel > 0 && (
        <rect x="21" y={tubeBottom - fillHeight} width="8" height={fillHeight}
          fill={liquidColor} rx="0.5"
          style={{ transition: 'height 0.3s ease, y 0.3s ease' }} />
      )}
      {/* Stopcock area */}
      <rect x="17" y="162" width="16" height="6" rx="2"
        fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      {/* Tip */}
      <line x1="25" y1="168" x2="25" y2="180" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Graduations */}
      {[0, 10, 20, 30, 40, 50].map(ml => {
        const yPos = tubeTop + (ml / 50) * tubeHeight;
        return (
          <g key={ml}>
            <line x1="30" y1={yPos} x2="34" y2={yPos} stroke="#cbd5e1" strokeWidth="0.8" />
            <text x="36" y={yPos + 3} fontSize="6" fill="#94a3b8">{ml}</text>
          </g>
        );
      })}
      {label && (
        <text x="25" y="195" textAnchor="middle" fontSize="8" fill="#64748b"
          fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Generic Pipette ──────────────────────────────────────────────

const PipetteSVG: React.FC<ApparatusProps> = ({
  liquidLevel = 0,
  liquidColor = 'rgba(224, 242, 254, 0.5)',
  label,
  highlighted = false,
  width = 30,
  height = 140,
}) => (
  <svg width={width} height={height} viewBox="0 0 30 140" fill="none">
    {/* Bulb top */}
    <ellipse cx="15" cy="15" rx="8" ry="10"
      stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1.5" fill="#f1f5f9" />
    {/* Shaft */}
    <rect x="13" y="25" width="4" height="90"
      stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1" fill="rgba(255,255,255,0.1)" />
    {/* Liquid in shaft */}
    {liquidLevel > 0 && (
      <rect x="13.5" y={115 - liquidLevel * 88} width="3" height={liquidLevel * 88}
        fill={liquidColor} style={{ transition: 'height 0.5s ease' }} />
    )}
    {/* Graduation mark */}
    <line x1="17" y1="70" x2="20" y2="70" stroke="#cbd5e1" strokeWidth="0.8" />
    {/* Tip */}
    <path d="M 14 115 L 15 125 L 16 115" stroke="#94a3b8" strokeWidth="1" fill="none" />
    {label && (
      <text x="15" y="135" textAnchor="middle" fontSize="7" fill="#64748b"
        fontFamily="var(--font-sans)">
        {label}
      </text>
    )}
  </svg>
);


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
  liquidColor = 'rgba(224, 242, 254, 0.5)',
  label,
  highlighted = false,
  width = 40,
  height = 80,
}) => (
  <svg width={width} height={height} viewBox="0 0 40 80" fill="none">
    {/* Bottle body */}
    <rect x="8" y="30" width="24" height="35" rx="3"
      stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1.5"
      fill="rgba(255,255,255,0.1)" />
    {/* Liquid */}
    <rect x="10" y="40" width="20" height="23" rx="2" fill={liquidColor} />
    {/* Neck */}
    <rect x="15" y="22" width="10" height="10" rx="1"
      stroke="#94a3b8" strokeWidth="1" fill="none" />
    {/* Dropper cap */}
    <path d="M 16 22 L 18 12 Q 20 8 22 12 L 24 22"
      fill="#475569" stroke="#334155" strokeWidth="1" />
    {/* Tip */}
    <path d="M 19 65 L 20 72 L 21 65" stroke="#94a3b8" strokeWidth="1" fill="none" />
    {label && (
      <text x="20" y="78" textAnchor="middle" fontSize="7" fill="#64748b"
        fontFamily="var(--font-sans)">
        {label}
      </text>
    )}
  </svg>
);


// ── Reagent Bottle ───────────────────────────────────────────────

const ReagentBottle: React.FC<ApparatusProps> = ({
  liquidLevel = 0.7,
  liquidColor = 'rgba(224, 242, 254, 0.5)',
  label,
  highlighted = false,
  width = 50,
  height = 90,
}) => {
  const fillHeight = 40 * liquidLevel;

  return (
    <svg width={width} height={height} viewBox="0 0 50 90" fill="none">
      {/* Body */}
      <rect x="8" y="30" width="34" height="45" rx="4"
        stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1.5"
        fill="rgba(255,255,255,0.1)" />
      {/* Liquid */}
      {liquidLevel > 0 && (
        <rect x="10" y={73 - fillHeight} width="30" height={fillHeight}
          rx="3" fill={liquidColor}
          style={{ transition: 'height 0.3s ease' }} />
      )}
      {/* Neck */}
      <rect x="18" y="20" width="14" height="12" rx="2"
        stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      {/* Cap */}
      <rect x="16" y="14" width="18" height="8" rx="3" fill="#475569" />
      {/* Label on bottle */}
      {label && (
        <text x="25" y="55" textAnchor="middle" fontSize="7" fill="#64748b"
          fontWeight="600" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Retort Stand ─────────────────────────────────────────────────

const RetortStand: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 60,
  height = 200,
}) => (
  <svg width={width} height={height} viewBox="0 0 60 200" fill="none">
    {/* Base plate */}
    <rect x="5" y="185" width="50" height="8" rx="2"
      fill="#64748b" stroke={highlighted ? '#2563eb' : '#475569'} strokeWidth="1.5" />
    {/* Vertical rod */}
    <rect x="28" y="10" width="4" height="178" rx="1"
      fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
    {/* Top cap */}
    <circle cx="30" cy="10" r="4" fill="#64748b" />
  </svg>
);


// ── Digital Balance ──────────────────────────────────────────────

const DigitalBalanceSVG: React.FC<ApparatusProps> = ({
  label,
  highlighted = false,
  width = 120,
  height = 60,
  extraProps,
}) => {
  const reading = (extraProps?.['reading'] as number) ?? 0;
  const displayValue = reading > 0 ? reading.toFixed(2) : '0.00';

  return (
    <svg width={width} height={height} viewBox="0 0 120 60" fill="none">
      {/* Base */}
      <rect x="5" y="35" width="110" height="20" rx="4"
        fill="#e2e8f0" stroke={highlighted ? '#2563eb' : '#94a3b8'} strokeWidth="1.5" />
      {/* Weighing pan */}
      <rect x="20" y="28" width="80" height="8" rx="2"
        fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
      {/* Display */}
      <rect x="30" y="8" width="60" height="18" rx="3" fill="#0f172a" />
      <text x="60" y="21" textAnchor="middle" fontSize="11" fill="#22d3ee"
        fontFamily="var(--font-mono)" fontWeight="600">
        {displayValue} g
      </text>
      {label && (
        <text x="60" y="58" textAnchor="middle" fontSize="7" fill="#64748b"
          fontFamily="var(--font-sans)">
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
  liquidLevel = 0.5,
  liquidColor = 'rgba(56, 189, 248, 0.65)',
  label = "Ostwald's Viscometer",
  highlighted = false,
  width = 130,
  height = 240,
  variables = {},
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#94a3b8';
  const flowProgress = variables.flowProgress ?? 0; // 0 = at upper mark, 1 = drained to lower mark
  const liquidY = 55 + flowProgress * 65; // upper mark at 55, lower mark at 120

  return (
    <svg width={width} height={height} viewBox="0 0 130 240" fill="none">
      <defs>
        <linearGradient id="viscoGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </linearGradient>
      </defs>

      {/* Viscometer U-Tube Outline */}
      {/* Left wide arm with lower bulb (Bulb B) */}
      <path
        d="M 32 20 L 32 135 C 15 145 15 175 32 185 L 32 200 C 32 220 95 220 95 200 L 95 130 C 112 120 112 75 95 65 L 95 20"
        stroke={strokeColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 44 20 L 44 135 C 32 145 32 175 44 185 L 44 195 C 44 208 83 208 83 195 L 83 130 C 97 122 97 73 83 65 L 83 20"
        stroke={strokeColor}
        strokeWidth="2"
        fill="url(#viscoGlass)"
      />

      {/* Liquid in Viscometer */}
      {liquidLevel > 0 && (
        <g opacity="0.9">
          {/* Lower reservoir bulb liquid */}
          <path
            d="M 32 150 C 20 158 20 172 32 180 L 32 198 C 32 214 95 214 95 198 L 95 135 L 83 135 L 83 195 C 83 204 44 204 44 195 L 44 182 C 34 174 34 160 44 152 Z"
            fill={liquidColor}
          />
          {/* Upper capillary arm liquid based on flow progress */}
          {flowProgress < 1 && (
            <path
              d={`M 83 ${liquidY} C 97 ${liquidY + 10} 97 120 83 125 L 95 125 C 112 118 112 ${liquidY + 10} 95 ${liquidY} Z`}
              fill={liquidColor}
            />
          )}
        </g>
      )}

      {/* Upper Fiducial Mark (Mark C) */}
      <line x1="80" y1="55" x2="98" y2="55" stroke="#ef4444" strokeWidth="2.5" />
      <text x="102" y="58" fontSize="8" fontWeight="700" fill="#ef4444">Upper Mark</text>

      {/* Lower Fiducial Mark (Mark D) */}
      <line x1="80" y1="125" x2="98" y2="125" stroke="#ef4444" strokeWidth="2.5" />
      <text x="102" y="128" fontSize="8" fontWeight="700" fill="#ef4444">Lower Mark</text>

      {/* Bulb labels */}
      <text x="89" y="93" textAnchor="middle" fontSize="9" fontWeight="600" fill="#475569">Bulb A</text>
      <text x="38" y="167" textAnchor="middle" fontSize="9" fontWeight="600" fill="#475569">Bulb B</text>

      {/* Capillary indicator */}
      <text x="89" y="170" textAnchor="middle" fontSize="7.5" fill="#64748b" fontStyle="italic">Capillary</text>

      {/* Glass highlights */}
      <path d="M 35 25 L 35 130" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 86 25 L 86 50" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" />

      {/* Label */}
      {label && (
        <text x="65" y="235" textAnchor="middle" fontSize="9" fontWeight="600" fill="#334155">
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
}) => {
  const isRunning = flags.timerRunning ?? false;
  const timeSeconds = variables.timerSeconds ?? 24.8;
  const mins = Math.floor(timeSeconds / 60);
  const secs = (timeSeconds % 60).toFixed(1);
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.padStart(4, '0')}`;

  return (
    <svg width={width} height={height} viewBox="0 0 110 120" fill="none">
      {/* Top buttons */}
      <rect x="49" y="6" width="12" height="10" rx="2" fill="#475569" stroke="#334155" strokeWidth="1.5" />
      <rect x="22" y="14" width="10" height="8" rx="2" fill="#64748b" transform="rotate(-30 27 18)" />
      <rect x="78" y="10" width="10" height="8" rx="2" fill={isRunning ? '#ef4444' : '#10b981'} transform="rotate(30 83 14)" />

      {/* Body casing */}
      <circle cx="55" cy="65" r="46" fill="#1e293b" stroke={highlighted ? '#2563eb' : '#334155'} strokeWidth="3" />
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
      {/* Instrument housing */}
      <rect
        x="15"
        y="30"
        width="130"
        height="90"
        rx="8"
        fill="#1e293b"
        stroke={highlighted ? '#2563eb' : '#475569'}
        strokeWidth="2.5"
      />
      {/* Front panel bevel */}
      <rect x="22" y="38" width="116" height="50" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />

      {/* LCD Screen */}
      <rect x="30" y="44" width="70" height="36" rx="3" fill="#042f2e" stroke="#0d9488" strokeWidth="1" />
      <text
        x="65"
        y="69"
        textAnchor="middle"
        fontFamily="var(--font-mono, monospace)"
        fontSize="17"
        fontWeight="800"
        fill="#2dd4bf"
      >
        {currentPH}
      </text>
      <text x="35" y="52" fontSize="6.5" fill="#5eead4" fontWeight="600">pH</text>
      <text x="88" y="75" fontSize="6.5" fill="#99f6e4">{temp.toFixed(1)}°C</text>

      {/* Secondary indicators */}
      <circle cx="115" cy="52" r="3.5" fill={isCalibrated ? '#10b981' : '#f59e0b'} />
      <text x="122" y="54" fontSize="6.5" fill="#94a3b8">CAL</text>
      <circle cx="115" cy="67" r="3.5" fill="#38bdf8" />
      <text x="122" y="69" fontSize="6.5" fill="#94a3b8">ATC</text>

      {/* Control knobs */}
      <circle cx="45" cy="103" r="8" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
      <circle cx="45" cy="103" r="3" fill="#94a3b8" />
      <text x="45" y="117" textAnchor="middle" fontSize="6" fill="#94a3b8">CAL 4</text>

      <circle cx="80" cy="103" r="8" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
      <circle cx="80" cy="103" r="3" fill="#94a3b8" />
      <text x="80" y="117" textAnchor="middle" fontSize="6" fill="#94a3b8">CAL 9</text>

      <circle cx="115" cy="103" r="8" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
      <circle cx="115" cy="103" r="3" fill="#94a3b8" />
      <text x="115" y="117" textAnchor="middle" fontSize="6" fill="#94a3b8">TEMP</text>

      {/* Glass Electrode Probe attachment */}
      <path d="M 145 60 C 158 60 158 90 152 110" stroke="#0f172a" strokeWidth="2.5" fill="none" />
      <rect x="148" y="105" width="8" height="28" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      <circle cx="152" cy="133" r="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />

      {/* Label */}
      {label && (
        <text x="80" y="135" textAnchor="middle" fontSize="9" fontWeight="600" fill="#334155">
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
      {/* Main console body */}
      <rect
        x="15"
        y="30"
        width="130"
        height="90"
        rx="8"
        fill="#0f172a"
        stroke={highlighted ? '#2563eb' : '#38bdf8'}
        strokeWidth="2.5"
      />
      {/* Front bezel */}
      <rect x="22" y="38" width="116" height="46" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />

      {/* LED Readout */}
      <rect x="30" y="44" width="76" height="34" rx="3" fill="#172554" stroke="#1d4ed8" strokeWidth="1" />
      <text
        x="68"
        y="68"
        textAnchor="middle"
        fontFamily="var(--font-mono, monospace)"
        fontSize="16"
        fontWeight="800"
        fill="#60a5fa"
      >
        {conductance}
      </text>
      <text x="96" y="74" textAnchor="end" fontSize="6" fill="#93c5fd" fontWeight="600">{unit}</text>
      <text x="35" y="52" fontSize="6.5" fill="#bfdbfe">COND</text>

      {/* Range switch & knob */}
      <circle cx="120" cy="60" r="10" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
      <line x1="120" y1="60" x2="126" y2="54" stroke="#60a5fa" strokeWidth="2" />
      <text x="120" y="78" textAnchor="middle" fontSize="6" fill="#94a3b8">RANGE</text>

      {/* Bottom tuning dials */}
      <circle cx="50" cy="102" r="7" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      <text x="50" y="116" textAnchor="middle" fontSize="6" fill="#94a3b8">NULL</text>

      <circle cx="95" cy="102" r="7" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      <text x="95" y="116" textAnchor="middle" fontSize="6" fill="#94a3b8">CELL CONST</text>

      {/* Cable to conductivity cell */}
      <path d="M 140 70 C 154 70 156 100 152 115" stroke="#475569" strokeWidth="2" fill="none" />
      <rect x="149" y="115" width="6" height="20" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
      {/* Platinum plates */}
      <rect x="148" y="130" width="8" height="3" fill="#1e293b" />

      {/* Label */}
      {label && (
        <text x="80" y="135" textAnchor="middle" fontSize="9" fontWeight="600" fill="#334155">
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
  height = 90,
  flags = {},
}) => {
  const isStirring = flags.stirring ?? false;

  return (
    <svg width={width} height={height} viewBox="0 0 130 90" fill="none">
      {/* Ceramic top plate */}
      <rect
        x="15"
        y="20"
        width="100"
        height="18"
        rx="3"
        fill="#f8fafc"
        stroke={highlighted ? '#2563eb' : '#cbd5e1'}
        strokeWidth="2"
      />
      {/* Magnetic stir bar in center of plate */}
      <rect x="57" y="26" width="16" height="6" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
      {isStirring && (
        <g opacity="0.6">
          <circle cx="65" cy="29" r="10" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
        </g>
      )}

      {/* Heavy base body */}
      <rect x="18" y="38" width="94" height="42" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="2" />

      {/* Speed control knob */}
      <circle cx="45" cy="58" r="9" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
      <line x1="45" y1="58" x2="51" y2="53" stroke="#38bdf8" strokeWidth="2" />
      <text x="45" y="74" textAnchor="middle" fontSize="6" fill="#cbd5e1">SPEED</text>

      {/* Heat switch & pilot indicator */}
      <circle cx="85" cy="54" r="3.5" fill={isStirring ? '#10b981' : '#ef4444'} />
      <text x="85" y="65" textAnchor="middle" fontSize="6" fill="#cbd5e1">POWER</text>

      {/* Label */}
      {label && (
        <text x="65" y="87" textAnchor="middle" fontSize="8" fontWeight="600" fill="#64748b">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Graduated Measuring Cylinder ─────────────────────────────────

const MeasuringCylinder: React.FC<ApparatusProps> = ({
  liquidLevel = 0.6,
  liquidColor = 'rgba(56, 189, 248, 0.65)',
  label = '100 mL Cylinder',
  highlighted = false,
  width = 70,
  height = 220,
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#94a3b8';
  const fillHeight = 140 * liquidLevel;
  const fillY = 185 - fillHeight;

  return (
    <svg width={width} height={height} viewBox="0 0 70 220" fill="none">
      {/* Hexagonal / Circular Base */}
      <path d="M 12 195 L 58 195 L 64 210 L 6 210 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />

      {/* Cylinder Glass Tube */}
      <rect x="22" y="35" width="26" height="160" stroke={strokeColor} strokeWidth="2" fill="rgba(255,255,255,0.12)" />
      {/* Spout on left */}
      <path d="M 22 35 L 14 30 L 22 40" stroke={strokeColor} strokeWidth="2" fill="none" />

      {/* Liquid Fill */}
      {liquidLevel > 0 && (
        <g>
          <rect x="23" y={fillY} width="24" height={fillHeight} fill={liquidColor} />
          {/* Meniscus */}
          <ellipse cx="35" cy={fillY} rx="12" ry="3" fill={liquidColor} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        </g>
      )}

      {/* Graduation Lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
        const y = 185 - i * 14;
        return (
          <g key={i}>
            <line x1="22" y1={y} x2={i % 2 === 0 ? '33' : '28'} y2={y} stroke="#64748b" strokeWidth="1" />
            {i % 2 === 0 && (
              <text x="36" y={y + 3} fontSize="6" fill="#64748b" fontFamily="monospace">
                {i * 10}
              </text>
            )}
          </g>
        );
      })}

      {/* Glass reflections */}
      <line x1="25" y1="40" x2="25" y2="185" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

      {/* Label */}
      {label && (
        <text x="35" y="217" textAnchor="middle" fontSize="8" fontWeight="600" fill="#334155">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Volumetric Flask (250 mL) ────────────────────────────────────

const VolumetricFlask: React.FC<ApparatusProps> = ({
  liquidLevel = 0.5,
  liquidColor = 'rgba(56, 189, 248, 0.65)',
  label = '250 mL Volumetric Flask',
  highlighted = false,
  width = 110,
  height = 180,
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#94a3b8';
  const fillHeight = 70 * liquidLevel;
  const fillY = 155 - fillHeight;

  return (
    <svg width={width} height={height} viewBox="0 0 110 180" fill="none">
      {/* Stopper */}
      <polygon points="50,12 60,12 58,28 52,28" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
      <ellipse cx="55" cy="12" rx="7" ry="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Flask Body */}
      <path
        d="M 50 25 L 50 85 C 25 105 18 135 25 155 Q 30 160 55 160 Q 80 160 85 155 C 92 135 85 105 60 85 L 60 25 Z"
        stroke={strokeColor}
        strokeWidth="2.5"
        fill="rgba(255,255,255,0.1)"
      />

      {/* Liquid */}
      {liquidLevel > 0 && (
        <path
          d={`M ${30 + (55 - fillY) * 0.15} ${fillY}
              C ${20} 135 ${25} 155 35 158
              L 75 158
              C 85 155 ${90} 135 ${80 - (55 - fillY) * 0.15} ${fillY} Z`}
          fill={liquidColor}
        />
      )}

      {/* Graduation ring mark */}
      <line x1="48" y1="65" x2="62" y2="65" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 1" />
      <text x="66" y="67" fontSize="6.5" fill="#ef4444" fontWeight="700">250 mL</text>

      {/* Glass highlights */}
      <path d="M 52 30 L 52 80" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <path d="M 28 140 A 25 25 0 0 0 45 155" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />

      {/* Label */}
      {label && (
        <text x="55" y="174" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#334155">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── BOD Incubation Bottle ────────────────────────────────────────

const BODBottle: React.FC<ApparatusProps> = ({
  liquidLevel = 0.8,
  liquidColor = 'rgba(56, 189, 248, 0.65)',
  label = 'BOD Bottle (300 mL)',
  highlighted = false,
  width = 100,
  height = 170,
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#94a3b8';
  const fillHeight = 90 * liquidLevel;
  const fillY = 145 - fillHeight;

  return (
    <svg width={width} height={height} viewBox="0 0 100 170" fill="none">
      {/* Ground glass penny-head stopper */}
      <rect x="44" y="8" width="12" height="16" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
      <ellipse cx="50" cy="8" rx="10" ry="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Flared funnel-shaped mouth */}
      <path d="M 40 24 L 60 24 L 56 38 L 44 38 Z" fill="rgba(255,255,255,0.15)" stroke={strokeColor} strokeWidth="2" />

      {/* Bottle Body */}
      <rect
        x="26"
        y="38"
        width="48"
        height="110"
        rx="8"
        fill="rgba(255,255,255,0.1)"
        stroke={strokeColor}
        strokeWidth="2.5"
      />

      {/* Liquid Fill */}
      {liquidLevel > 0 && (
        <g>
          <rect x="28" y={fillY} width="44" height={fillHeight} rx="4" fill={liquidColor} />
          <ellipse cx="50" cy={fillY} rx="22" ry="4" fill={liquidColor} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        </g>
      )}

      {/* Glass highlights */}
      <line x1="30" y1="45" x2="30" y2="140" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Label */}
      {label && (
        <text x="50" y="162" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#334155">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Constant Temperature Water Bath ──────────────────────────────

const WaterBath: React.FC<ApparatusProps> = ({
  label = 'Thermostatic Water Bath',
  highlighted = false,
  width = 160,
  height = 120,
  variables = {},
}) => {
  const temp = variables.temperature ?? 60.0;

  return (
    <svg width={width} height={height} viewBox="0 0 160 120" fill="none">
      {/* Outer steel tank */}
      <rect
        x="15"
        y="25"
        width="130"
        height="75"
        rx="6"
        fill="#334155"
        stroke={highlighted ? '#2563eb' : '#64748b'}
        strokeWidth="2.5"
      />

      {/* Inner warm water cavity */}
      <rect x="22" y="32" width="86" height="58" rx="4" fill="rgba(56, 189, 248, 0.4)" stroke="#0284c7" strokeWidth="1.5" />

      {/* Concentric reduction ring opening */}
      <ellipse cx="65" cy="34" rx="28" ry="6" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
      <ellipse cx="65" cy="34" rx="18" ry="4" fill="#334155" stroke="#cbd5e1" strokeWidth="1" />

      {/* Subtle steam vapors */}
      <path d="M 55 26 Q 58 18 55 12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
      <path d="M 68 28 Q 72 20 68 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />

      {/* Control panel on right */}
      <rect x="114" y="32" width="24" height="58" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1" />
      <text x="126" y="46" textAnchor="middle" fontSize="6.5" fill="#38bdf8" fontFamily="monospace" fontWeight="700">
        {temp.toFixed(0)}°C
      </text>
      <circle cx="126" cy="60" r="3" fill="#10b981" />
      <circle cx="126" cy="74" r="5" fill="#334155" stroke="#64748b" strokeWidth="1" />

      {/* Label */}
      {label && (
        <text x="80" y="112" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#334155">
          {label}
        </text>
      )}
    </svg>
  );
};

// ── Specific Gravity Bottle (Pycnometer) ──────────────────────────

const SpecificGravityBottle: React.FC<ApparatusProps> = ({
  liquidLevel = 0.9,
  liquidColor = 'rgba(56, 189, 248, 0.65)',
  label = '25 mL Sp. Gr. Bottle',
  highlighted = false,
  width = 80,
  height = 120,
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#94a3b8';
  const fillHeight = 55 * liquidLevel;
  const fillY = 95 - fillHeight;

  return (
    <svg width={width} height={height} viewBox="0 0 80 120" fill="none">
      {/* Capillary Stopper */}
      <rect x="37" y="10" width="6" height="24" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Central fine capillary bore */}
      <line x1="40" y1="10" x2="40" y2="34" stroke="#ef4444" strokeWidth="0.8" />
      <ellipse cx="40" cy="10" rx="4" ry="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

      {/* Bottle Flask Body */}
      <path
        d="M 36 30 L 36 45 C 22 55 18 75 22 95 Q 24 100 40 100 Q 56 100 58 95 C 62 75 58 55 44 45 L 44 30 Z"
        stroke={strokeColor}
        strokeWidth="2"
        fill="rgba(255,255,255,0.12)"
      />

      {/* Liquid */}
      {liquidLevel > 0 && (
        <path
          d={`M ${24 + (95 - fillY) * 0.15} ${fillY}
              C 20 80 22 95 30 98
              L 50 98
              C 58 95 60 80 ${56 - (95 - fillY) * 0.15} ${fillY} Z`}
          fill={liquidColor}
        />
      )}

      {/* Label */}
      {label && (
        <text x="40" y="114" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#334155">
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
