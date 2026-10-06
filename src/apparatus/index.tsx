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
import { useDraggable } from '@dnd-kit/core';

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
  effervescenceRate,
}) => {
  const isSwirling = Boolean(flags?.swirling || extraProps?.swirling || flags?.shaking || extraProps?.shaking);
  const effRate = typeof effervescenceRate === 'number'
    ? effervescenceRate
    : (typeof extraProps?.effervescenceRate === 'number' ? (extraProps.effervescenceRate as number) : 0);
  const isEvolvingGas = Boolean(flags?.gasEvolving || flags?.reactionStarted || effRate > 0);
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

        {/* ── Effervescence / Gas Bubbles (when reacting/foaming) ── */}
        {isEvolvingGas && effectiveLevel > 0.05 && (
          <g id={`flask-effervescence-${id || 'def'}`} clipPath={`url(#flaskInnerClip-${id || 'def'})`}>
            <circle cx="50" cy="115" r="2.2" fill="rgba(255,255,255,0.85)" stroke="#0284c7" strokeWidth="0.5">
              <animate attributeName="cy" values="118;85;55" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;1;0" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="cx" values="50;53;49" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="112" r="3.0" fill="rgba(255,255,255,0.9)" stroke="#0284c7" strokeWidth="0.5">
              <animate attributeName="cy" values="115;80;50" dur="0.95s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;1;0" dur="0.95s" repeatCount="indefinite" />
              <animate attributeName="cx" values="60;58;62" dur="0.95s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="116" r="2.4" fill="rgba(255,255,255,0.85)" stroke="#0284c7" strokeWidth="0.5">
              <animate attributeName="cy" values="118;88;52" dur="1.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;1;0" dur="1.3s" repeatCount="indefinite" />
              <animate attributeName="cx" values="70;73;68" dur="1.3s" repeatCount="indefinite" />
            </circle>
            {/* Surface fizzing at meniscus */}
            <circle cx="52" cy={fillY - 1} r="2" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" strokeWidth="0.5">
              <animate attributeName="r" values="1;2.5;0" dur="0.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy={fillY - 2} r="2.5" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" strokeWidth="0.5">
              <animate attributeName="r" values="1.5;3;0" dur="0.35s" repeatCount="indefinite" />
            </circle>
            <circle cx="68" cy={fillY - 1} r="2" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" strokeWidth="0.5">
              <animate attributeName="r" values="1;2.2;0" dur="0.45s" repeatCount="indefinite" />
            </circle>
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
  variables = {},
  extraProps = {},
  effervescenceRate,
  ...rest
}) => {
  const isStirring = Boolean(flags?.stirring || extraProps?.stirring);
  const effRate = typeof effervescenceRate === 'number'
    ? effervescenceRate
    : (typeof extraProps?.effervescenceRate === 'number' ? (extraProps.effervescenceRate as number) : 0);
  const isEvolvingGas = Boolean(flags?.gasEvolving || flags?.reactionStarted || effRate > 0 || flags?.waterBoiled || flags?.isReacting);
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  // Total fillable height in beaker aligns with 100 mL graduation mark (y=32 to y=108 => 76px)
  const fillHeight = 76 * effectiveLevel;
  const fillY = 108 - fillHeight;
  const beamY = fillY + (108 - fillY) * 0.45;
  const gradId = `beakerLiquid-${id || 'def'}`;

  // Multi-mixture & physical dispersion props (True Solution, Suspension, Colloid)
  const restProps = rest as Record<string, unknown>;
  const isBeakerA = id.includes('solution') || id.includes('beaker-a') || id === 'beaker-1';
  const isBeakerB = id.includes('suspension') || id.includes('beaker-b') || id === 'beaker-2';
  const isBeakerC = id.includes('colloid') || id.includes('beaker-c') || id === 'beaker-3';

  const explicitSalt = restProps.hasSaltCrystals ?? extraProps?.hasSaltCrystals;
  const explicitIce = restProps.hasIce ?? extraProps?.hasIce;
  const explicitSediment = restProps.hasSediment ?? extraProps?.hasSediment;
  const explicitSuspension = restProps.hasSuspension ?? extraProps?.hasSuspension;
  const explicitTyndallBeam = restProps.tyndallBeam ?? extraProps?.tyndallBeam;
  const explicitTyndallBlocked = restProps.tyndallBlocked ?? extraProps?.tyndallBlocked;

  // Solid crushed ice in Beaker (Melting Point of Ice experiment)
  const meltProgress = typeof variables?.iceMeltProgress === 'number'
    ? Math.max(0, Math.min(1, variables.iceMeltProgress))
    : (flags.iceMelted ? 1 : 0);

  const isIceVisible =
    effectiveLevel > 0 &&
    (explicitIce !== undefined
      ? Boolean(explicitIce)
      : (Boolean(flags.iceAdded) && meltProgress < 1));

  // Salt crystals (NaCl) only in Beaker A (or single default beaker), never in B or C
  const isSaltVisible =
    effectiveLevel > 0 &&
    (explicitSalt !== undefined
      ? Boolean(explicitSalt)
      : (isBeakerA || (!isBeakerB && !isBeakerC)) && Boolean(flags.hasSalt) && !flags.stirredAll && !flags.stirredA);

  // Step-aware settling: only in post-stability steps ('test-tyndall', 'calculation', 'results') or when flags.stabilityObserved is true
  const currentStep = extraProps?.currentStepId as string | undefined;
  const isPostStabilityStep =
    currentStep === 'test-tyndall' ||
    currentStep === 'calculation' ||
    currentStep === 'results';

  // Mud sediment settles at bottom of Beaker B (suspension) ONLY after Beaker B was actually stirred (flags.stirredB) and stability is observed (or subsequent steps)!
  const isMudSettled =
    effectiveLevel > 0 &&
    (explicitSediment !== undefined
      ? Boolean(explicitSediment)
      : isBeakerB && Boolean(flags.hasSoil) && Boolean(flags.stirredB) && (Boolean(flags.stabilityObserved) || isPostStabilityStep));

  // Soil particles suspended in water in Beaker B (only after soil added AND stirred, before settling)
  const isSoilSuspended =
    !isMudSettled &&
    effectiveLevel > 0 &&
    (explicitSuspension !== undefined
      ? Boolean(explicitSuspension)
      : isBeakerB && Boolean(flags.hasSoil) && Boolean(flags.stirredB));

  // Soil granules resting at the bottom of Beaker B before stirring
  const explicitSoilGrains = restProps.hasSoilGrains ?? extraProps?.hasSoilGrains;
  const isSoilGrainsVisible =
    effectiveLevel > 0 &&
    !flags.stirredB &&
    (explicitSoilGrains !== undefined
      ? Boolean(explicitSoilGrains)
      : isBeakerB && Boolean(flags.hasSoil));

  // Starch paste resting at bottom of Beaker C before stirring
  const explicitStarchPaste = restProps.hasStarchPaste ?? extraProps?.hasStarchPaste;
  const isStarchPasteVisible =
    effectiveLevel > 0 &&
    !flags.stirredC &&
    (explicitStarchPaste !== undefined
      ? Boolean(explicitStarchPaste)
      : isBeakerC && Boolean(flags.hasStarch));

  // Liquid color clarification for supernatant in Beaker B once mud settles
  const displayLiquidColor =
    isBeakerB && isMudSettled && (liquidColor.includes('105, 55, 15') || liquidColor.includes('0.90'))
      ? 'rgba(180, 145, 80, 0.48)'
      : liquidColor;

  // Check if laser is actively pointing at this beaker or in compare-all mode
  const isTargeted =
    Boolean(flags.tyndallTargetAll)
      ? true
      : Boolean(flags.tyndallTargetA)
        ? isBeakerA
        : Boolean(flags.tyndallTargetB)
          ? isBeakerB
          : Boolean(flags.tyndallTargetC)
            ? isBeakerC
            : true;

  // Tyndall beam scattering in Beaker C (colloid)
  const isTyndallBeamActive =
    effectiveLevel > 0 &&
    isTargeted &&
    (explicitTyndallBeam !== undefined
      ? Boolean(explicitTyndallBeam)
      : isBeakerC && Boolean(flags.tyndallTestedC) && Boolean(flags.hasStarch));

  // Tyndall beam blocked in Beaker B (suspension)
  const isTyndallBlockedActive =
    effectiveLevel > 0 &&
    isTargeted &&
    (explicitTyndallBlocked !== undefined
      ? Boolean(explicitTyndallBlocked)
      : isBeakerB && Boolean(flags.tyndallTestedB) && (Boolean(flags.hasSoil) || Boolean(explicitSuspension)));

  // Tyndall test in Beaker A (true solution): light passes straight through without beam path scattering
  const explicitTyndallPassed = restProps.tyndallPassed ?? extraProps?.tyndallPassed;
  const isTyndallPassedActive =
    effectiveLevel > 0 &&
    isTargeted &&
    (explicitTyndallPassed !== undefined
      ? Boolean(explicitTyndallPassed)
      : isBeakerA && Boolean(flags.tyndallTestedA));

  return (
    <svg width={width} height={height} viewBox="0 0 100 120" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <style>{`
          @keyframes sedimentSettle {
            0% {
              transform: translateY(16px) scaleY(0.05);
              opacity: 0.2;
            }
            100% {
              transform: translateY(0) scaleY(1);
              opacity: 1;
            }
          }
          @keyframes glassRodStir {
            0% {
              transform: rotate(-2.5deg);
            }
            100% {
              transform: rotate(3deg);
            }
          }
        `}</style>

        <clipPath id={`beakerInnerClip-${id || 'def'}`}>
          <path d="M 18 16 L 18 102 Q 18 110 26 110 L 74 110 Q 82 110 82 102 L 82 16 Z" />
        </clipPath>

        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={displayLiquidColor} style={{ stopColor: displayLiquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.75" />
          <stop offset="40%" stopColor={displayLiquidColor} style={{ stopColor: displayLiquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.88" />
          <stop offset="100%" stopColor={displayLiquidColor} style={{ stopColor: displayLiquidColor, transition: 'stop-color 2.2s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.98" />
        </linearGradient>

        <linearGradient id={`mudGradient-${id || 'def'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#542e0d" />
          <stop offset="35%" stopColor="#3d1f07" />
          <stop offset="100%" stopColor="#261203" />
        </linearGradient>

        <linearGradient id={`beakerGleam-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
        </linearGradient>

        <linearGradient id={`laserEmitterBodyGrad-${id || 'def'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="30%" stopColor="#64748b" />
          <stop offset="70%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* 650 nm Ruby Red Laser Photonic Bloom & Scattering Filters */}
        <filter id={`laserBloom-${id || 'def'}`} x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="3.5" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id={`tyndallBeamGrad-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="15%" stopColor="#ff003c" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#ff1744" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#d50000" stopOpacity="0.8" />
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
          stroke={displayLiquidColor}
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

        {/* ── Dynamic Stirring Vortex ── */}
        {isStirring && (
          <g transform="translate(50, 105)">
            {/* Rapidly spinning PTFE magnetic stir bar only if magnetic stirrer instrument present */}
            {Boolean(flags.hasMagneticStirrer || extraProps?.hasMagneticStirrer) && (
              <rect x="-7" y="-2.5" width="14" height="5" rx="2.5" fill="#ffffff" stroke="#475569" strokeWidth="0.8">
                <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="0.3s" repeatCount="indefinite" />
              </rect>
            )}

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

        {/* ── Effervescence / Gas Bubbles (when reacting/foaming) ── */}
        {isEvolvingGas && effectiveLevel > 0.05 && (
          <g id={`beaker-effervescence-${id || 'def'}`} clipPath={`url(#beakerInnerClip-${id || 'def'})`}>
            <circle cx="35" cy="100" r="2.0" fill="rgba(255,255,255,0.85)" stroke="#0284c7" strokeWidth="0.5">
              <animate attributeName="cy" values="102;70;40" dur="1.1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;1;0" dur="1.1s" repeatCount="indefinite" />
              <animate attributeName="cx" values="35;38;34" dur="1.1s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="98" r="2.8" fill="rgba(255,255,255,0.9)" stroke="#0284c7" strokeWidth="0.5">
              <animate attributeName="cy" values="100;65;35" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;1;0" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="cx" values="50;48;52" dur="0.9s" repeatCount="indefinite" />
            </circle>
            <circle cx="65" cy="102" r="2.2" fill="rgba(255,255,255,0.85)" stroke="#0284c7" strokeWidth="0.5">
              <animate attributeName="cy" values="104;72;38" dur="1.25s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;1;0" dur="1.25s" repeatCount="indefinite" />
              <animate attributeName="cx" values="65;68;63" dur="1.25s" repeatCount="indefinite" />
            </circle>
            {/* Surface fizzing at meniscus */}
            <circle cx="40" cy={fillY - 1} r="2" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" strokeWidth="0.5">
              <animate attributeName="r" values="1;2.4;0" dur="0.38s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy={fillY - 1.5} r="2.4" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" strokeWidth="0.5">
              <animate attributeName="r" values="1.2;2.8;0" dur="0.32s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy={fillY - 1} r="2" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" strokeWidth="0.5">
              <animate attributeName="r" values="1;2.2;0" dur="0.42s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* ── Boiling Steam Wisps (Water Boiling at 100 °C) ── */}
        {Boolean(flags?.waterBoiled) && (
          <g id={`beaker-boiling-steam-${id || 'def'}`}>
            <path d="M 32 20 Q 26 10, 36 2 T 30 -10" fill="none" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="2.5" strokeLinecap="round">
              <animate attributeName="d" values="M 32 20 Q 26 10, 36 2 T 30 -10;M 32 20 Q 38 10, 28 2 T 34 -10;M 32 20 Q 26 10, 36 2 T 30 -10" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M 50 18 Q 58 8, 46 0 T 52 -12" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="3" strokeLinecap="round">
              <animate attributeName="d" values="M 50 18 Q 58 8, 46 0 T 52 -12;M 50 18 Q 42 8, 54 0 T 48 -12;M 50 18 Q 58 8, 46 0 T 52 -12" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.4s" repeatCount="indefinite" />
            </path>
            <path d="M 68 20 Q 62 10, 72 2 T 66 -10" fill="none" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="2.5" strokeLinecap="round">
              <animate attributeName="d" values="M 68 20 Q 62 10, 72 2 T 66 -10;M 68 20 Q 74 10, 64 2 T 70 -10;M 68 20 Q 62 10, 72 2 T 66 -10" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.8s" repeatCount="indefinite" />
            </path>
          </g>
        )}

        {/* ── Solid Crushed Ice Chunks (Melting Point experiment) ── */}
        {isIceVisible && (
          <g
            id={`beaker-crushed-ice-${id || 'def'}`}
            clipPath={`url(#beakerInnerClip-${id || 'def'})`}
            style={{
              transform: `scale(${1 - meltProgress * 0.7})`,
              transformOrigin: '50px 92px',
              opacity: 1 - meltProgress * 0.95,
              transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
            }}
          >
            {/* Submerged and floating faceted ice chunks */}
            <polygon points="24,96 32,90 40,94 36,104 26,103" fill="rgba(224, 242, 254, 0.92)" stroke="#93c5fd" strokeWidth="0.8" />
            <polygon points="38,100 46,93 56,96 52,106 42,105" fill="rgba(240, 249, 255, 0.95)" stroke="#60a5fa" strokeWidth="0.8" />
            <polygon points="48,94 58,88 66,93 62,102 52,101" fill="rgba(224, 242, 254, 0.92)" stroke="#93c5fd" strokeWidth="0.8" />
            <polygon points="28,84 38,78 46,83 40,92 30,90" fill="rgba(255, 255, 255, 0.95)" stroke="#93c5fd" strokeWidth="0.8" />
            <polygon points="44,86 54,80 63,85 56,93 46,91" fill="rgba(240, 249, 255, 0.9)" stroke="#60a5fa" strokeWidth="0.8" />
            <polygon points="34,74 44,68 52,73 46,82 36,80" fill="rgba(224, 242, 254, 0.88)" stroke="#bae6fd" strokeWidth="0.8" />
            <polygon points="50,76 60,70 68,75 62,84 52,82" fill="rgba(255, 255, 255, 0.92)" stroke="#93c5fd" strokeWidth="0.8" />
            {/* Frost crystal facets and specular highlights */}
            <line x1="32" y1="90" x2="36" y2="104" stroke="#ffffff" strokeWidth="0.9" />
            <line x1="46" y1="93" x2="52" y2="106" stroke="#ffffff" strokeWidth="0.9" />
            <line x1="58" y1="88" x2="62" y2="102" stroke="#ffffff" strokeWidth="0.9" />
            <circle cx="34" cy="85" r="1.4" fill="#ffffff" opacity="0.85" />
            <circle cx="50" cy="83" r="1.6" fill="#ffffff" opacity="0.85" />
            <circle cx="60" cy="95" r="1.3" fill="#ffffff" opacity="0.85" />
          </g>
        )}

        {/* ── Glass Stirring Rod Dipping in Beaker ── */}
        {(Boolean(flags.glassRodUsed) || Boolean(flags.stirring) || Boolean(restProps.isStirring) || Boolean(extraProps?.isStirring)) && (
          <g id={`beaker-glass-stirrer-${id || 'def'}`}>
            <g style={{
              transformOrigin: '42px 90px',
              animation: 'glassRodStir 1.4s ease-in-out infinite alternate',
            }}>
              {/* Glass Rod Body */}
              <line
                x1="74"
                y1="-14"
                x2="34"
                y2="92"
                stroke="rgba(241, 245, 249, 0.75)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
              />
              {/* Glass Rod Core Reflection */}
              <line
                x1="73"
                y1="-13"
                x2="35"
                y2="91"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Glass Tip rounded bead */}
              <circle cx="34" cy="92" r="2.5" fill="rgba(224, 242, 254, 0.85)" stroke="#94a3b8" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* ── Solid Salt Crystals (NaCl) at bottom before dissolution ── */}
        {isSaltVisible && (
          <g id={`beaker-salt-crystals-${id || 'def'}`} clipPath={`url(#beakerInnerClip-${id || 'def'})`}>
            <polygon points="46,108 48,103 52,103 54,108" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.95" />
            <polygon points="41,109 43,105 46,105 48,109" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.4" opacity="0.92" />
            <polygon points="51,109 53,104 57,104 59,109" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.95" />
            <circle cx="45" cy="107" r="0.9" fill="#ffffff" />
            <circle cx="50" cy="106" r="1.1" fill="#ffffff" />
            <circle cx="55" cy="107" r="1.0" fill="#ffffff" />
          </g>
        )}

        {/* ── Unstirred Soil Grains (dark granules resting at bottom before stirring) ── */}
        {isSoilGrainsVisible && (
          <g id={`beaker-soil-grains-${id || 'def'}`} clipPath={`url(#beakerInnerClip-${id || 'def'})`}>
            <polygon points="44,109 47,104 53,104 56,109" fill="#3e1d08" stroke="#261202" strokeWidth="0.5" opacity="0.95" />
            <polygon points="38,110 41,106 45,106 48,110" fill="#542e0d" stroke="#381e09" strokeWidth="0.4" opacity="0.92" />
            <polygon points="52,110 55,105 60,105 63,110" fill="#2b1404" stroke="#1c0b01" strokeWidth="0.5" opacity="0.95" />
            <ellipse cx="50" cy="107" rx="3.5" ry="1.5" fill="#432107" />
            <circle cx="43" cy="107.5" r="1.3" fill="#261202" />
            <circle cx="57" cy="107" r="1.4" fill="#381e09" />
            <circle cx="49" cy="106" r="1.0" fill="#6d3911" />
          </g>
        )}

        {/* ── Unstirred Starch Paste (translucent white gel layer at bottom before stirring) ── */}
        {isStarchPasteVisible && (
          <g id={`beaker-starch-paste-${id || 'def'}`} clipPath={`url(#beakerInnerClip-${id || 'def'})`}>
            <ellipse cx="50" cy="107" rx="14" ry="3.5" fill="rgba(255,255,255,0.85)" stroke="#cbd5e1" strokeWidth="0.6" />
            <ellipse cx="50" cy="106.5" rx="9" ry="2" fill="rgba(255,255,255,0.95)" />
          </g>
        )}

        {/* ── Suspended Coarse Soil Particles (Cloudy Suspension) ── */}
        {isSoilSuspended && (
          <g id={`beaker-suspension-particles-${id || 'def'}`} clipPath={`url(#beakerInnerClip-${id || 'def'})`}>
            {[
              { cx: 28, cy: 75, r: 1.2, color: '#381e09' },
              { cx: 38, cy: 85, r: 1.6, color: '#542e0d' },
              { cx: 48, cy: 72, r: 1.0, color: '#2b1404' },
              { cx: 58, cy: 82, r: 1.8, color: '#432107' },
              { cx: 68, cy: 76, r: 1.3, color: '#6d3911' },
              { cx: 32, cy: 92, r: 1.5, color: '#261202' },
              { cx: 44, cy: 96, r: 2.0, color: '#3e1d08' },
              { cx: 56, cy: 90, r: 1.4, color: '#5a2d0c' },
              { cx: 66, cy: 94, r: 1.7, color: '#2b1405' },
              { cx: 36, cy: 65, r: 0.9, color: '#4a250a' },
              { cx: 52, cy: 62, r: 1.1, color: '#381e09' },
              { cx: 62, cy: 66, r: 0.8, color: '#5e320e' },
            ].map((p, idx) => (
              <circle key={idx} cx={p.cx} cy={Math.max(fillY + 3, p.cy)} r={p.r} fill={p.color} opacity="0.88">
                <animate
                  attributeName="cy"
                  values={`${p.cy};${p.cy + 3};${p.cy - 2};${p.cy}`}
                  dur={`${2 + (idx % 3) * 0.7}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}

        {/* ── Sediment / Mud Layer at Bottom (Settled Soil Suspension Formation) ── */}
        {isMudSettled && (
          <g id={`beaker-sediment-${id || 'def'}`} clipPath={`url(#beakerInnerClip-${id || 'def'})`}>
            {/* Base thick mud cake filling the bottom curve with an organic contoured upper surface */}
            <path
              d="M 16 96 Q 30 93, 46 96 T 70 94 Q 78 95, 84 94 L 84 112 L 16 112 Z"
              fill={`url(#mudGradient-${id || 'def'})`}
              style={{
                animation: 'sedimentSettle 2.2s cubic-bezier(0.2, 0.8, 0.4, 1) forwards',
                transformOrigin: '50% 112px',
              }}
            />
            {/* Silt & fine sediment highlight ridge */}
            <path
              d="M 18 96 Q 32 93, 46 96 T 70 94 Q 78 95, 82 94"
              stroke="#7c3f13"
              strokeWidth="1.2"
              fill="none"
              opacity="0.9"
            />
            {/* Sedimented organic silt and grit speckles */}
            <ellipse cx="28" cy="103" rx="2.5" ry="1.2" fill="#261202" opacity="0.85" />
            <ellipse cx="40" cy="101" rx="1.8" ry="1.0" fill="#6d3911" opacity="0.9" />
            <ellipse cx="52" cy="104" rx="3.0" ry="1.4" fill="#1c0b01" opacity="0.85" />
            <ellipse cx="64" cy="102" rx="2.2" ry="1.1" fill="#713f17" opacity="0.85" />
            <ellipse cx="73" cy="104" rx="2.0" ry="1.2" fill="#2b1404" opacity="0.8" />
            <circle cx="34" cy="98.5" r="0.8" fill="#8c511e" />
            <circle cx="48" cy="98.5" r="0.9" fill="#2d1303" />
            <circle cx="61" cy="97.5" r="0.8" fill="#8c511e" />
            {/* Fine settling silt specks slowly descending into the mud bed */}
            <circle cx="38" cy="88" r="0.9" fill="#542e0d" opacity="0.6">
              <animate attributeName="cy" values="84;95" dur="3s" fill="freeze" />
              <animate attributeName="opacity" values="0.7;0" dur="3s" fill="freeze" />
            </circle>
            <circle cx="58" cy="85" r="1.1" fill="#381e09" opacity="0.7">
              <animate attributeName="cy" values="79;95" dur="3.5s" fill="freeze" />
              <animate attributeName="opacity" values="0.7;0" dur="3.5s" fill="freeze" />
            </circle>
          </g>
        )}

        {/* ── Real-World Physics Inspired Laser Beam & Tyndall Optics (650 nm Ruby Red) ── */}

        {/* Incoming horizontal collimated laser beam from left emitter striking beaker */}
        {(isTyndallBeamActive || isTyndallBlockedActive || isTyndallPassedActive) && (
          <g id={`beaker-laser-incoming-${id || 'def'}`}>
            {/* Mounted Benchtop Laser Pointer Emitter at beaker entrance */}
            <g id={`laser-pointer-emitter-${id || 'def'}`}>
              {/* Laser pointer barrel body */}
              <rect
                x="-46"
                y={beamY - 5}
                width="30"
                height="10"
                rx="2"
                fill={`url(#laserEmitterBodyGrad-${id || 'def'})`}
                stroke="#0f172a"
                strokeWidth="0.8"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
              />
              {/* Knurled grip grooves */}
              <line x1="-40" y1={beamY - 4.5} x2="-40" y2={beamY + 4.5} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
              <line x1="-37" y1={beamY - 4.5} x2="-37" y2={beamY + 4.5} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
              <line x1="-34" y1={beamY - 4.5} x2="-34" y2={beamY + 4.5} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
              {/* Gold collimation aperture ring */}
              <rect x="-16.5" y={beamY - 4} width="4.5" height="8" rx="1" fill="#d97706" stroke="#92400e" strokeWidth="0.6" />
              {/* Laser Warning Sticker */}
              <rect x="-31" y={beamY - 3.8} width="9.5" height="7.6" rx="0.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" />
              <polygon points={`-26.25,${beamY - 3} -29,${beamY + 2} -23.5,${beamY + 2}`} fill="#000" />
              {/* Active Green Power LED */}
              <circle cx="-43" cy={beamY} r="1.3" fill="#22c55e" filter="drop-shadow(0 0 2px #22c55e)" />
              {/* Laser Aperture red glow */}
              <ellipse cx="-12" cy={beamY} rx="0.8" ry="2" fill="#ff003c" filter="drop-shadow(0 0 2px #ff003c)" />
            </g>

            {/* Atmospheric laser beam blooming halo in air */}
            <line x1="-12" y1={beamY} x2="18" y2={beamY} stroke="rgba(255, 0, 60, 0.45)" strokeWidth="5" filter={`url(#laserBloom-${id || 'def'})`} />
            <line x1="-12" y1={beamY} x2="18" y2={beamY} stroke="#ff003c" strokeWidth="2.2" />
            <line x1="-12" y1={beamY} x2="18" y2={beamY} stroke="#ffffff" strokeWidth="0.8" />
            {/* Cylindrical glass wall entrance specular refraction flare */}
            <circle cx="18" cy={beamY} r="3.2" fill="#ffffff" filter="drop-shadow(0 0 5px #ff003c)" />
            <ellipse cx="18" cy={beamY} rx="1.6" ry="5.5" fill="rgba(255, 255, 255, 0.95)" />
          </g>
        )}

        {/* ── COLLOID (Beaker C): Brilliant Tyndall Scattering Cone & Glowing Path ── */}
        {isTyndallBeamActive && (
          <g id={`beaker-tyndall-beam-${id || 'def'}`} clipPath={`url(#beakerInnerClip-${id || 'def'})`}>
            {/* Wide volumetric luminous scattering halo cone across the milky liquid */}
            <path
              d={`M 18,${beamY - 4.5} L 82,${beamY - 8} L 82,${beamY + 8} L 18,${beamY + 4.5} Z`}
              fill="rgba(255, 0, 60, 0.32)"
              filter={`url(#laserBloom-${id || 'def'})`}
            />
            {/* Saturated illuminated colloidal laser corridor */}
            <path
              d={`M 18,${beamY - 2.2} L 82,${beamY - 3.6} L 82,${beamY + 3.6} L 18,${beamY + 2.2} Z`}
              fill={`url(#tyndallBeamGrad-${id || 'def'})`}
            />
            {/* Brilliant core laser filament */}
            <line
              x1="18"
              y1={beamY}
              x2="82"
              y2={beamY}
              stroke="#ffffff"
              strokeWidth="1.3"
              filter="drop-shadow(0 0 4px #ff003c)"
            />
            {/* Twinkling starch colloidal micelle particles scattering photons (Brownian scintillation) */}
            {[
              { cx: 23, cy: beamY - 1.8, dur: '0.8s', r: 1.2 },
              { cx: 28, cy: beamY + 2.5, dur: '1.2s', r: 1.0 },
              { cx: 34, cy: beamY - 1.2, dur: '0.7s', r: 1.4 },
              { cx: 40, cy: beamY + 1.8, dur: '0.9s', r: 1.1 },
              { cx: 46, cy: beamY - 2.4, dur: '1.3s', r: 1.3 },
              { cx: 52, cy: beamY + 1.2, dur: '0.6s', r: 1.0 },
              { cx: 57, cy: beamY - 1.6, dur: '1.0s', r: 1.3 },
              { cx: 63, cy: beamY + 2.8, dur: '0.8s', r: 1.2 },
              { cx: 69, cy: beamY - 1.0, dur: '1.1s', r: 1.4 },
              { cx: 75, cy: beamY + 2.0, dur: '0.7s', r: 1.1 },
            ].map((p, idx) => (
              <circle
                key={idx}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="#ffffff"
                filter="drop-shadow(0 0 2px #ff3366)"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur={p.dur}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
            {/* Exit Wall Specular Refraction Flare & Transmitted Ray */}
            <circle cx="82" cy={beamY} r="3.2" fill="#ffffff" filter="drop-shadow(0 0 5px #ff003c)" />
            <ellipse cx="82" cy={beamY} rx="1.8" ry="6" fill="rgba(255, 255, 255, 0.95)" />
            <line x1="82" y1={beamY} x2="116" y2={beamY} stroke="rgba(255, 0, 60, 0.45)" strokeWidth="6" filter={`url(#laserBloom-${id || 'def'})`} />
            <line x1="82" y1={beamY} x2="116" y2={beamY} stroke="#ff003c" strokeWidth="2.5" />
            <line x1="82" y1={beamY} x2="116" y2={beamY} stroke="#ffffff" strokeWidth="0.9" />
          </g>
        )}

        {/* ── SUSPENSION (Beaker B): Beam Blocked & Absorbed by Coarse Mud ── */}
        {isTyndallBlockedActive && (
          <g id={`beaker-tyndall-blocked-${id || 'def'}`} clipPath={`url(#beakerInnerClip-${id || 'def'})`}>
            {/* Intense turbid entry glow cloud — total scattering/absorption at surface */}
            <ellipse cx="23" cy={beamY} rx="7" ry="9" fill="rgba(239, 68, 68, 0.85)" filter={`url(#laserBloom-${id || 'def'})`} />
            <path
              d={`M 18,${beamY - 3.5} L 31,${beamY - 4.5} Q 36,${beamY} 31,${beamY + 4.5} L 18,${beamY + 3.5} Z`}
              fill="#ef4444"
              opacity="0.9"
            />
            {/* Core laser dies abruptly inside the muddy suspension */}
            <line x1="18" y1={beamY} x2="30" y2={beamY} stroke="#ffffff" strokeWidth="1.5" />
            {/* Mud particles absorbing light and casting shadows */}
            <circle cx="26" cy={beamY - 2.5} r="1.6" fill="#3e1d08" />
            <circle cx="28" cy={beamY + 2.5} r="2.0" fill="#2b1404" />
            <circle cx="32" cy={beamY} r="1.4" fill="#542e0d" />
            {/* Notice: Extinction! No light reaches beyond x=33, and exit glass remains dark! */}
          </g>
        )}

        {/* ── TRUE SOLUTION (Beaker A): No Scattering — Beam Path is INVISIBLE ── */}
        {isTyndallPassedActive && (
          <g id={`beaker-tyndall-passed-${id || 'def'}`} clipPath={`url(#beakerInnerClip-${id || 'def'})`}>
            {/* Solute particles (<1 nm) do NOT scatter visible light!
                The beam path through the liquid is completely dark and invisible.
                Only a hairline dashed guide indicates the optical ray passing through. */}
            <line
              x1="18"
              y1={beamY}
              x2="82"
              y2={beamY}
              stroke="rgba(255, 0, 60, 0.16)"
              strokeWidth="0.8"
              strokeDasharray="3 4"
            />
            {/* Sharp exit refraction spot on the right glass wall where uninterrupted light leaves */}
            <circle cx="82" cy={beamY} r="3.2" fill="#ffffff" filter="drop-shadow(0 0 5px #ff003c)" />
            <ellipse cx="82" cy={beamY} rx="1.6" ry="6" fill="rgba(255, 255, 255, 0.95)" />
            {/* Unattenuated transmitted laser ray continuing through air on the right */}
            <line x1="82" y1={beamY} x2="116" y2={beamY} stroke="rgba(255, 0, 60, 0.45)" strokeWidth="6" filter={`url(#laserBloom-${id || 'def'})`} />
            <line x1="82" y1={beamY} x2="116" y2={beamY} stroke="#ff003c" strokeWidth="2.5" />
            <line x1="82" y1={beamY} x2="116" y2={beamY} stroke="#ffffff" strokeWidth="0.9" />
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
  hasIronNail,
  nailCoated,
  isReacting,
  popEffect,
  effervescenceRate,
  extraProps,
  ...props
}) => {
  const p = props as Record<string, unknown>;
  const dispatch = p.dispatch as React.Dispatch<any> | undefined;
  const hasClampSupport = Boolean(
    p.clampSupport ??
    extraProps?.['clampSupport']
  );

  const isFeSTest = Boolean(
    flags?.feSCooled ||
    flags?.feSPowderReady ||
    flags?.feSObserved ||
    flags?.feSMagnetTested ||
    flags?.spatulaHasFeSSample ||
    flags?.feSCS2SamplePrepared ||
    flags?.feSCS2Added ||
    flags?.feSCS2Corked ||
    flags?.feSCS2Shaken ||
    flags?.feSCS2Settled ||
    flags?.feSCS2TestComplete ||
    p.powderType === 'fes' ||
    (typeof p.label === 'string' && p.label.toLowerCase().includes('fes'))
  );

  const hasCork = isFeSTest
    ? Boolean(flags?.feSCS2Corked)
    : Boolean(flags?.cs2Corked && !flags?.feSPowderReady);

  const isShakingCS2 = isFeSTest
    ? Boolean(flags?.isShakingCS2Tube || (flags?.feSCS2Shaken && !flags?.feSCS2Settled && flags?.isShaking))
    : Boolean(flags?.isShakingCS2Tube || extraProps?.isShaking || flags?.isShaking);

  const hasSediment = isFeSTest
    ? Boolean(flags?.feSCS2Settled)
    : Boolean(flags?.cs2Settled && !flags?.feSPowderReady);

  const hasPowder = isFeSTest
    ? Boolean(flags?.feSCS2SamplePrepared || flags?.feSCS2Added || flags?.feSCS2Corked || flags?.feSCS2Shaken || flags?.feSCS2Settled)
    : Boolean(flags?.cs2SamplePrepared || (p.hasPowder && !flags?.feSPowderReady));

  // Check flags or explicit props for state
  const effRate = typeof effervescenceRate === 'number'
    ? effervescenceRate
    : (typeof extraProps?.effervescenceRate === 'number' ? (extraProps.effervescenceRate as number) : 0);
  const showZinc = Boolean(hasZinc || flags?.zincAdded);
  const isEvolvingGas = Boolean(isReacting || flags?.reactionStarted || flags?.gasEvolving || effRate > 0);
  const showPop = Boolean(popEffect || flags?.popSoundHeard);

  const hasNail = Boolean(
    hasIronNail ||
    extraProps?.hasIronNail ||
    flags?.nailDipped ||
    flags?.hasIronNail ||
    flags?.isDisplacing
  );
  const isDisplacing = Boolean(flags?.isDisplacing || extraProps?.isDisplacing);
  const isNailCoated = Boolean(
    nailCoated ||
    extraProps?.nailCoated ||
    (flags?.nailDipped && !isDisplacing)
  );

  const gradId = `ttLiquidGrad-${id || 'def'}`;

  // ── Heating Station: Compact Support Stand & Angled Boiling Tube ──
  // ── Heating Station: Grounded Support Stand & Angled Boiling Tube ──
  if (hasClampSupport) {
    const effLevel = Math.min(1, Math.max(0, liquidLevel));
    const fillH = 75 * effLevel;
    const liqTopY = 128 - fillH;

    // Optional powder solid support for Fe+S heating
    const powderType = (p.powderType as string | undefined) ?? (extraProps?.powderType as string | undefined);
    const hasPowder = Boolean(p.hasPowder || extraProps?.['hasPowder'] || powderType);
    const isFeS = powderType === 'fes' || powderType === 'compound';
    const isGlowing = powderType === 'glowing' || powderType === 'hot' || Boolean(flags?.reactionGlowing || flags?.isGlowing);

    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 320"
        fill="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="clampRodMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="65%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="clampBaseMetal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="40%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s ease' }} stopOpacity="0.8" />
            <stop offset="35%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s ease' }} stopOpacity="0.88" />
            <stop offset="85%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s ease' }} stopOpacity="0.95" />
            <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 2.2s ease' }} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* ── Retort Stand Hardware (Resting firmly on workbench surface) ── */}
        {/* Solid Cast Iron Base Plate sitting directly on tabletop */}
        <rect x="10" y="286" width="60" height="14" rx="3" fill="url(#clampBaseMetal)" stroke="#1e293b" strokeWidth="1.2" />
        <rect x="12" y="287.5" width="56" height="2.5" rx="1" fill="rgba(255,255,255,0.28)" />

        {/* Vertical Stainless Steel Support Rod extending upward with clear headroom */}
        <rect x="36" y="25" width="8" height="261" rx="4" fill="url(#clampRodMetal)" stroke="#334155" strokeWidth="1" />
        <line x1="39" y1="28" x2="39" y2="286" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />

        {/* Bosshead clamp connector on rod */}
        <rect x="30" y="75" width="20" height="22" rx="2.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
        <circle cx="40" cy="86" r="4.5" fill="#64748b" stroke="#334155" strokeWidth="1" />
        <circle cx="40" cy="86" r="2.2" fill="#475569" />

        {/* Horizontal clamp arm extending toward boiling tube */}
        <rect x="48" y="82.5" width="40" height="7" rx="1.5" fill="url(#clampRodMetal)" stroke="#334155" strokeWidth="1" />
        <ellipse cx="84" cy="86" rx="3" ry="5.5" fill="#64748b" stroke="#334155" strokeWidth="0.8" />

        {/* Rear Clamp Jaw (behind the glass tube) */}
        <path d="M 80 81 Q 95 76 112 83" stroke="#334155" strokeWidth="5.5" strokeLinecap="round" fill="none" />

        {/* ── Angled Boiling Tube (Held firmly at 12° inclination, clear gap above burner) ── */}
        <g transform="translate(95, 86) rotate(-12) translate(-14, -35)">
          {/* Outer glow when highlighted */}
          {highlighted && (
            <path
              d="M -2 1 L -2 126 Q -2 140 14 140 Q 30 140 30 126 L 30 1"
              stroke="#3b82f6"
              strokeWidth="6"
              opacity="0.6"
              filter="blur(2px)"
            />
          )}

          {/* Tube Glass Back Wall */}
          <path
            d="M 0 3 L 0 125 Q 0 135 14 135 Q 28 135 28 125 L 28 3"
            fill="rgba(241, 245, 249, 0.22)"
            stroke="#cbd5e1"
            strokeWidth="1.4"
          />

          {/* Liquid Fill with Meniscus */}
          {effLevel > 0 && (
            <g>
              <path
                d={`M 1.5 ${liqTopY} L 1.5 125 Q 1.5 133.5 14 133.5 Q 26.5 133.5 26.5 125 L 26.5 ${liqTopY} Z`}
                fill={`url(#${gradId})`}
                style={{ transition: 'all 1.5s ease' }}
              />
              <ellipse
                cx="14"
                cy={liqTopY}
                rx="12.5"
                ry="3.2"
                fill="rgba(255, 255, 255, 0.4)"
                stroke={liquidColor}
                strokeWidth="0.8"
              />
            </g>
          )}

          {/* Powder / Solid at bottom of boiling tube */}
          {hasPowder && (
            <g id="clamp-tube-solid">
              <path
                d="M 1.5 102 Q 14 96 26.5 102 L 26.5 125 Q 26.5 133.5 14 133.5 Q 1.5 133.5 1.5 125 Z"
                fill={isFeS ? '#09090b' : isGlowing ? '#b91c1c' : '#ca8a04'}
                stroke={isFeS ? '#18181b' : isGlowing ? '#ef4444' : '#a16207'}
                strokeWidth="1.2"
              />
              <ellipse
                cx="14"
                cy={102}
                rx="12.5"
                ry="3.2"
                fill={isFeS ? '#27272a' : isGlowing ? '#ef4444' : '#eab308'}
                stroke={isFeS ? '#09090b' : isGlowing ? '#f87171' : '#a16207'}
                strokeWidth="0.8"
              />
              {isGlowing && (
                <path
                  d="M 2 103 Q 14 98 26 103 L 26 124 Q 26 132 14 132 Q 2 132 2 124 Z"
                  fill="#ef4444"
                  opacity="0.85"
                >
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="0.7s" repeatCount="indefinite" />
                </path>
              )}
              {isFeS && !isGlowing && (
                <g opacity="0.85">
                  <circle cx="7" cy="112" r="1.4" fill="#3f3f46" />
                  <circle cx="15" cy="120" r="1.8" fill="#52525b" />
                  <circle cx="21" cy="113" r="1.2" fill="#3f3f46" />
                  <circle cx="11" cy="126" r="1.3" fill="#27272a" />
                  <circle cx="18" cy="108" r="1.1" fill="#71717a" />
                </g>
              )}
            </g>
          )}

          {/* Effervescence Bubbles */}
          {isEvolvingGas && (
            <g id="clamp-effervescence">
              <circle cx="10" cy="120" r="2.0" fill="rgba(255,255,255,0.85)">
                <animate attributeName="cy" values="120;55;12" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;0" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="17" cy="116" r="2.4" fill="rgba(255,255,255,0.9)">
                <animate attributeName="cy" values="116;50;10" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;1;0" dur="0.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="13" cy="110" r="1.6" fill="#ffffff">
                <animate attributeName="cy" values="110;45;8" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;1;0" dur="0.6s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Frosted pyrex measurement backing strip for maximum legibility */}
          <rect
            x="1"
            y="48"
            width="26"
            height="72"
            rx="2"
            fill="rgba(255, 255, 255, 0.55)"
            stroke="rgba(255, 255, 255, 0.75)"
            strokeWidth="0.6"
          />

          {/* Etched Volumetric Graduations (Clear horizontal ticks & high-contrast labels) */}
          {[
            { y: 54, label: '5 mL' },
            { y: 68, label: '4 mL' },
            { y: 82, label: '3 mL' },
            { y: 96, label: '2 mL' },
            { y: 110, label: '1 mL' },
          ].map((g, i) => (
            <g key={i}>
              {/* Major horizontal tick mark */}
              <line x1="1" y1={g.y} x2="9" y2={g.y} stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="1" y1={g.y - 0.4} x2="9" y2={g.y - 0.4} stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" />
              {/* Readable mL text */}
              <text
                x="11"
                y={g.y + 2.4}
                fontSize="6.8"
                fontWeight="700"
                fill="#0f172a"
                fontFamily="var(--font-mono, monospace)"
                letterSpacing="-0.02em"
              >
                {g.label}
              </text>
            </g>
          ))}

          {/* Minor half-mL ticks */}
          {[61, 75, 89, 103, 117].map((y, i) => (
            <line
              key={`sub-${i}`}
              x1="1"
              y1={y}
              x2="5.5"
              y2={y}
              stroke="#334155"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          ))}

          {/* Front Glass Wall & Specular Highlights */}
          <path
            d="M 0 3 L 0 125 Q 0 135 14 135 Q 28 135 28 125 L 28 3"
            stroke={highlighted ? '#2563eb' : '#64748b'}
            strokeWidth="1.8"
            fill="none"
          />
          <line x1="3" y1="8" x2="3" y2="123" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="25" y1="8" x2="25" y2="123" stroke="rgba(255,255,255,0.25)" strokeWidth="0.9" strokeLinecap="round" />

          {/* Flared Glass Lip at Top */}
          <ellipse cx="14" cy="3" rx="15" ry="4" fill="rgba(241, 245, 249, 0.45)" stroke="#64748b" strokeWidth="1.8" />
          <ellipse cx="14" cy="3" rx="11.5" ry="2.8" fill="rgba(255, 255, 255, 0.25)" stroke="#94a3b8" strokeWidth="0.8" />
        </g>

        {/* Front Clamp Jaw (Heat-resistant red rubber sleeve gripping glass firmly in upper third) */}
        <g id="clamp-jaw-front">
          <rect x="78" y="83.5" width="10" height="5" rx="1" fill="url(#clampRodMetal)" stroke="#334155" strokeWidth="0.8" />
          <ellipse cx="83" cy="86" rx="2.5" ry="4" fill="#64748b" stroke="#334155" strokeWidth="0.6" />
          <path d="M 76 87 Q 95 95 112 89" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 77 86 Q 95 94 111 88" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>

        {/* ── Interactive Action Pills for Heating & FeS Synthesis ── */}
        {flags?.partBPrepared && !flags?.heatingStarted && (
          <foreignObject x="35" y="140" width="130" height="36" style={{ overflow: 'visible' }}>
            <button
              type="button"
              id="btn-start-heating"
              onClick={(e) => {
                e.stopPropagation();
                dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'start-heating-btn' } });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '4px 9px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(234, 88, 12, 0.45)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>🔥</span>
              <span>Start Heating</span>
            </button>
          </foreignObject>
        )}

        {flags?.heatingStarted && !flags?.reactionGlowing && (
          <foreignObject x="30" y="140" width="140" height="36" style={{ overflow: 'visible' }}>
            <button
              type="button"
              id="btn-observe-glow"
              onClick={(e) => {
                e.stopPropagation();
                dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'observe-glow-btn' } });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '4px 9px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.45)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>🔥</span>
              <span>Heat Strongly</span>
            </button>
          </foreignObject>
        )}

        {flags?.reactionGlowing && !flags?.feSFormed && (
          <foreignObject x="30" y="140" width="140" height="36" style={{ overflow: 'visible' }}>
            <button
              type="button"
              id="btn-form-fes"
              onClick={(e) => {
                e.stopPropagation();
                dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'form-fes-btn' } });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#b91c1c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '4px 9px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(185, 28, 28, 0.45)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>⚡</span>
              <span>Form FeS</span>
            </button>
          </foreignObject>
        )}

        {flags?.feSFormed && !flags?.removedFromHeat && (
          <foreignObject x="25" y="140" width="150" height="36" style={{ overflow: 'visible' }}>
            <button
              type="button"
              id="btn-remove-heat"
              onClick={(e) => {
                e.stopPropagation();
                dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'remove-heat-btn' } });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '4px 9px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.45)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>❄️</span>
              <span>Remove from Heat</span>
            </button>
          </foreignObject>
        )}

        {flags?.removedFromHeat && !flags?.feSCooled && (
          <foreignObject x="25" y="140" width="150" height="36" style={{ overflow: 'visible' }}>
            <button
              type="button"
              id="btn-complete-cooling"
              onClick={(e) => {
                e.stopPropagation();
                dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'complete-cooling-btn' } });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#0d9488',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '4px 9px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.45)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>⏳</span>
              <span>Allow to Cool</span>
            </button>
          </foreignObject>
        )}

        {label && (
          <text
            x="100"
            y="312"
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            fill="var(--text-secondary)"
            fontFamily="var(--font-sans)"
          >
            {label}
          </text>
        )}
      </svg>
    );
  }

  // ── Standard Unmounted Test Tube ──
  // Liquid geometry
  // Tube body: x from 22 to 54 (width 32). Tube height: 18 to 195 (lip at 18, bottom curved at 195).
  // Total tube height is ~175.
  const effectiveLevel = Math.min(1, Math.max(0, liquidLevel));
  const maxFill = 150;
  const fillHeight = maxFill * effectiveLevel;
  const liquidTopY = 195 - fillHeight;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 76 230"
      fill="none"
      style={{
        overflow: 'visible',
        animation: isShakingCS2 ? 'testTubeShake 0.12s ease-in-out infinite alternate' : undefined,
        transformOrigin: '50% 85%',
        cursor: (hasCork && !flags?.cs2Shaken) || (flags?.cs2Shaken && !flags?.cs2Settled) ? 'pointer' : undefined,
      }}
      onClick={() => {
        if (hasCork && !flags?.cs2Shaken && !flags?.isShakingCS2Tube) {
          dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'shake-cs2-tube' } });
        } else if (flags?.cs2Shaken && !flags?.cs2Settled && !flags?.isSettlingCS2Tube) {
          dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'settle-cs2-tube' } });
        }
      }}
    >
      <defs>
        <style>{`
          @keyframes testTubeShake {
            0% { transform: rotate(-7deg) translateX(-3px); }
            100% { transform: rotate(7deg) translateX(3px); }
          }
        `}</style>
        {/* Glass reflection gradient */}
        <linearGradient id={`ttGlassStreak-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>

        {/* Liquid depth gradient with 4.0s progressive color shift */}
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 4.0s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.8" />
          <stop offset="35%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 4.0s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.88" />
          <stop offset="85%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 4.0s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="0.95" />
          <stop offset="100%" stopColor={liquidColor} style={{ stopColor: liquidColor, transition: 'stop-color 4.0s cubic-bezier(0.4, 0, 0.2, 1)' }} stopOpacity="1" />
        </linearGradient>

        {/* Zinc metallic gradient */}
        <linearGradient id="zincGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Steel Iron Nail Gradient */}
        <linearGradient id={`ttSteelGrad-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="25%" stopColor="#94a3b8" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="85%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Displaced Copper Coating Gradient */}
        <linearGradient id={`ttCopperGrad-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="25%" stopColor="#c2410c" />
          <stop offset="55%" stopColor="#ea580c" />
          <stop offset="85%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#431407" />
        </linearGradient>

        {/* Copper Deposition Progressive Keyframe */}
        <style>{`
          @keyframes depositCopper-${id || 'def'} {
            0% {
              opacity: 0;
            }
            20% {
              opacity: 0.25;
            }
            55% {
              opacity: 0.65;
            }
            85% {
              opacity: 0.9;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>
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

      {/* ── Dry Fe + S Powder Sample at bottom (before CS2 solvent) ── */}
      {hasPowder && !hasSediment && effectiveLevel === 0 && (
        <g id="dry-sample-powder">
          <ellipse cx="38" cy="204" rx="14" ry="5.5" fill="#ca8a04" opacity="0.85" />
          {/* Iron dark grains */}
          <circle cx="31" cy="203" r="1.5" fill="#1e293b" />
          <circle cx="35" cy="206" r="1.3" fill="#334155" />
          <circle cx="41" cy="205" r="1.6" fill="#1e293b" />
          <circle cx="45" cy="202" r="1.4" fill="#475569" />
          <circle cx="38" cy="201" r="1.5" fill="#1e293b" />
          {/* Sulphur yellow grains */}
          <circle cx="33" cy="205" r="1.6" fill="#facc15" />
          <circle cx="37" cy="204" r="1.4" fill="#fde047" />
          <circle cx="43" cy="204" r="1.5" fill="#facc15" />
          <circle cx="29" cy="202" r="1.3" fill="#facc15" />
        </g>
      )}

      {/* ── Agitated Swirling Particles during CS2 Shaking ── */}
      {isShakingCS2 && effectiveLevel > 0 && (
        <g id="shaking-particles">
          {/* Swirling yellow sulphur particles */}
          <circle cx="32" cy="180" r="2.2" fill="#facc15">
            <animate attributeName="cy" values="190;150;185;140;190" dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="cx" values="28;46;35;26;28" dur="0.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="42" cy="165" r="2.0" fill="#fde047">
            <animate attributeName="cy" values="170;140;180;150;170" dur="0.35s" repeatCount="indefinite" />
            <animate attributeName="cx" values="44;28;40;48;44" dur="0.35s" repeatCount="indefinite" />
          </circle>
          {/* Swirling dark iron particles */}
          <circle cx="36" cy="175" r="2.0" fill="#1e293b">
            <animate attributeName="cy" values="195;160;190;170;195" dur="0.45s" repeatCount="indefinite" />
            <animate attributeName="cx" values="36;44;30;40;36" dur="0.45s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="188" r="1.8" fill="#334155">
            <animate attributeName="cy" values="192;165;188;175;192" dur="0.38s" repeatCount="indefinite" />
            <animate attributeName="cx" values="30;38;26;34;30" dur="0.38s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* ── Settled Insoluble Iron Solid Bed at Bottom (CS2 Settle Complete) ── */}
      {hasSediment && (
        <g id="iron-settled-sediment">
          {/* Dense dark iron sediment base */}
          <path
            d="M 23 192 L 23 192 Q 23 214 38 214 Q 53 214 53 192 L 53 192 Q 38 195 23 192 Z"
            fill="#0f172a"
            stroke="#020617"
            strokeWidth="0.8"
          />
          {/* Distinct top meniscus boundary of sediment */}
          <ellipse cx="38" cy="192.5" rx="14.8" ry="3.2" fill="#1e293b" stroke="#334155" strokeWidth="0.7" />
          {/* Granular dark iron solid texture */}
          <circle cx="28" cy="197" r="1.5" fill="#475569" />
          <circle cx="34" cy="201" r="1.7" fill="#334155" />
          <circle cx="40" cy="198" r="1.6" fill="#475569" />
          <circle cx="46" cy="202" r="1.5" fill="#334155" />
          <circle cx="32" cy="206" r="1.6" fill="#0f172a" />
          <circle cx="38" cy="207" r="1.7" fill="#334155" />
          <circle cx="43" cy="206" r="1.4" fill="#475569" />
          <circle cx="35" cy="210" r="1.3" fill="#0f172a" />
          <circle cx="39" cy="211" r="1.3" fill="#334155" />
          {/* Subtle gleams on metallic iron */}
          <circle cx="30" cy="196" r="0.6" fill="#94a3b8" />
          <circle cx="42" cy="200" r="0.6" fill="#94a3b8" />
          <circle cx="36" cy="208" r="0.5" fill="#94a3b8" />
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

      {/* ── Persistent Iron Nail & Copper Displacement Reaction ── */}
      {hasNail && (
        <g id="iron-nail-assembly">
          {/* Suspension nylon thread tied from rim to nail head */}
          <path
            d="M 38 18 C 39 42, 43 68, 44 91"
            stroke="#94a3b8"
            strokeWidth="0.8"
            strokeDasharray="2,2"
            fill="none"
          />
          {/* Thread knot around head */}
          <ellipse cx="44" cy="91" rx="2" ry="1.2" fill="#64748b" stroke="#334155" strokeWidth="0.5" />

          {/* 1. Unsubmerged Upper Portion (Above meniscus, stays clean metallic steel Fe) */}
          {/* Flat nail head */}
          <ellipse
            cx="44"
            cy="92"
            rx="5.8"
            ry="2.2"
            fill={`url(#ttSteelGrad-${id || 'def'})`}
            stroke="#334155"
            strokeWidth="0.8"
            transform="rotate(-12 44 92)"
          />
          <ellipse
            cx="44"
            cy="91.5"
            rx="4.5"
            ry="1.4"
            fill="rgba(255,255,255,0.45)"
            stroke="none"
            transform="rotate(-12 44 92)"
          />

          {/* Upper shaft (y: 93 to liquidTopY) */}
          <polygon
            points={`42,93 46,93 ${46 - (liquidTopY - 93) * 0.13},${liquidTopY} ${42 - (liquidTopY - 93) * 0.13},${liquidTopY}`}
            fill={`url(#ttSteelGrad-${id || 'def'})`}
            stroke="#334155"
            strokeWidth="0.6"
          />
          <line
            x1="44"
            y1="94"
            x2={44 - (liquidTopY - 94) * 0.13}
            y2={liquidTopY}
            stroke="#ffffff"
            strokeWidth="0.8"
            opacity="0.9"
          />

          {/* 2. Submerged Portion: Base Steel Nail */}
          <polygon
            points={`${42 - (liquidTopY - 93) * 0.13},${liquidTopY} ${46 - (liquidTopY - 93) * 0.13},${liquidTopY} 32,204 28,203`}
            fill={`url(#ttSteelGrad-${id || 'def'})`}
            stroke="#334155"
            strokeWidth="0.6"
          />
          <polygon
            points="28,203 32,204 29.5,208"
            fill={`url(#ttSteelGrad-${id || 'def'})`}
            stroke="#334155"
            strokeWidth="0.6"
          />
          <line
            x1={44 - (liquidTopY - 94) * 0.13}
            y1={liquidTopY}
            x2="30.5"
            y2="204"
            stroke="#ffffff"
            strokeWidth="0.6"
            opacity="0.5"
          />

          {/* 3. Displaced Copper Coating Overlay (Progressive reddish-brown layer) */}
          <g
            id="copper-displacement-layer"
            style={{
              animation: isDisplacing
                ? `depositCopper-${id || 'def'} 4.0s cubic-bezier(0.4, 0, 0.2, 1) forwards`
                : undefined,
              opacity: isNailCoated ? 1 : (isDisplacing ? undefined : 0),
              transition: isDisplacing ? undefined : 'opacity 0.8s ease',
            }}
          >
            {/* Reddish-brown coated shaft */}
            <polygon
              points={`${41.8 - (liquidTopY - 93) * 0.13},${liquidTopY} ${46.2 - (liquidTopY - 93) * 0.13},${liquidTopY} 32.4,204.4 27.6,203.4`}
              fill={`url(#ttCopperGrad-${id || 'def'})`}
              stroke="#5c1d0a"
              strokeWidth="0.7"
            />
            {/* Coated pointed tip */}
            <polygon
              points="27.6,203.4 32.4,204.4 29.5,209"
              fill={`url(#ttCopperGrad-${id || 'def'})`}
              stroke="#5c1d0a"
              strokeWidth="0.7"
            />
            {/* Copper metallic specular sheen */}
            <line
              x1={44 - (liquidTopY - 94) * 0.13}
              y1={liquidTopY + 2}
              x2="30.5"
              y2="204"
              stroke="#fed7aa"
              strokeWidth="0.8"
              opacity="0.8"
            />

            {/* Granular porous copper crust nodules adhering to the submerged nail */}
            <circle cx="41.5" cy="132" r="1.6" fill="#ea580c" stroke="#7c2d12" strokeWidth="0.5" />
            <circle cx="36.5" cy="144" r="1.8" fill="#c2410c" stroke="#5c1d0a" strokeWidth="0.5" />
            <circle cx="39.8" cy="156" r="2.0" fill="#ea580c" stroke="#7c2d12" strokeWidth="0.5" />
            <circle cx="34.8" cy="168" r="1.7" fill="#c2410c" stroke="#5c1d0a" strokeWidth="0.5" />
            <circle cx="37.5" cy="180" r="1.9" fill="#ea580c" stroke="#7c2d12" strokeWidth="0.5" />
            <circle cx="32.0" cy="192" r="1.7" fill="#c2410c" stroke="#5c1d0a" strokeWidth="0.5" />
            <circle cx="34.5" cy="200" r="1.8" fill="#ea580c" stroke="#7c2d12" strokeWidth="0.5" />
            <circle cx="27.8" cy="205" r="1.4" fill="#9a3412" stroke="#5c1d0a" strokeWidth="0.5" />

            {/* Settled displaced copper flakes & precipitate at curved bottom */}
            <ellipse cx="33" cy="210" rx="3.2" ry="1.2" fill="#9a3412" stroke="#7c2d12" strokeWidth="0.5" />
            <ellipse cx="42" cy="209" rx="2.8" ry="1.0" fill="#c2410c" stroke="#5c1d0a" strokeWidth="0.5" />
            <ellipse cx="38" cy="211.5" rx="4.2" ry="1.4" fill="#ea580c" stroke="#431407" strokeWidth="0.5" />
          </g>

          {/* 4. Active Displacement Ion-Exchange Micro-Bubbles & Reaction Glow */}
          {isDisplacing && (
            <g id="displacement-microbubbles">
              <circle cx="38" cy="140" r="1.2" fill="rgba(255,255,255,0.85)">
                <animate attributeName="cy" values="180;140;120" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.3;0" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="35" cy="160" r="1.0" fill="rgba(255,255,255,0.75)">
                <animate attributeName="cy" values="190;150;120" dur="1.0s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0.2;0" dur="1.0s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="180" r="1.3" fill="rgba(255,255,255,0.85)">
                <animate attributeName="cy" values="200;160;120" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.3;0" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="40" cy="150" r="1.1" fill="rgba(255,255,255,0.8)">
                <animate attributeName="cy" values="170;135;120" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0" dur="0.9s" repeatCount="indefinite" />
              </circle>

              {/* Displacement reaction status badge */}
              <text x="38" y="52" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#047857" filter="drop-shadow(0 1px 2px rgba(255,255,255,0.9))">
                Fe + CuSO₄
              </text>
              <text x="38" y="61" textAnchor="middle" fontSize="5.2" fontWeight="600" fill="#065f46" filter="drop-shadow(0 1px 2px rgba(255,255,255,0.9))">
                Displacement...
                <animate attributeName="opacity" values="0.4;1;0.4" dur="0.8s" repeatCount="indefinite" />
              </text>
            </g>
          )}
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

      {/* ── Rubber Cork Stopper sealing tube mouth ── */}
      {hasCork && (
        <g id="test-tube-rubber-cork" style={{ zIndex: 12 }}>
          {/* Stopper body plug extending into glass neck */}
          <polygon points="26,6 50,6 46,23 30,23" fill="#334155" stroke="#1e293b" strokeWidth="1.2" />
          {/* Ribbed grip lines on rubber */}
          <line x1="27" y1="10" x2="49" y2="10" stroke="#475569" strokeWidth="1.1" />
          <line x1="28.5" y1="14" x2="47.5" y2="14" stroke="#475569" strokeWidth="1.1" />
          <line x1="29.5" y1="18" x2="46.5" y2="18" stroke="#475569" strokeWidth="1.1" />
          {/* Flanged top rim */}
          <ellipse cx="38" cy="6" rx="14" ry="3.5" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
          {/* Highlight sheen */}
          <ellipse cx="36" cy="5.5" rx="9" ry="1.8" fill="rgba(255,255,255,0.25)" />
        </g>
      )}

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

      {/* ── Interactive Action Pills for Shaking & Settling ── */}
      {((!isFeSTest && hasCork && !flags?.cs2Shaken && !flags?.isShakingCS2Tube) ||
        (isFeSTest && flags?.feSCS2Corked && !flags?.feSCS2Shaken && !flags?.isShakingCS2Tube)) && (
        <foreignObject x="-26" y="-44" width="128" height="38" style={{ overflow: 'visible', zIndex: 60 }}>
          <button
            type="button"
            id="btn-shake-cs2-tube"
            onClick={(e) => {
              e.stopPropagation();
              dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'shake-cs2-tube' } });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
              color: '#ffffff',
              border: '1.5px solid #818cf8',
              borderRadius: '12px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>🔄</span>
            <span>Shake Tube</span>
          </button>
        </foreignObject>
      )}

      {((!isFeSTest && flags?.cs2Shaken && !flags?.cs2Settled && !flags?.isSettlingCS2Tube) ||
        (isFeSTest && flags?.feSCS2Shaken && !flags?.feSCS2Settled && !flags?.isSettlingCS2Tube)) && (
        <foreignObject x="-26" y="-44" width="128" height="38" style={{ overflow: 'visible', zIndex: 60 }}>
          <button
            type="button"
            id="btn-settle-cs2-tube"
            onClick={(e) => {
              e.stopPropagation();
              dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'settle-cs2-tube' } });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
              color: '#ffffff',
              border: '1.5px solid #34d399',
              borderRadius: '12px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>⏳</span>
            <span>Allow to Settle</span>
          </button>
        </foreignObject>
      )}

      {/* Observation Badges (shown ONLY when settled and NO action button is active) */}
      {flags?.cs2Settled && !isFeSTest && !flags?.feSPowderReady && !flags?.feSCooled && (
        <foreignObject x="-46" y="-36" width="168" height="30" style={{ overflow: 'visible' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(255, 255, 255, 0.96)',
              color: '#0f172a',
              border: '1.2px solid #cbd5e1',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '8px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: '#16a34a' }}>✓</span>
            <span>Yellow S solution + Dark Fe solid</span>
          </div>
        </foreignObject>
      )}

      {flags?.feSCS2Settled && (
        <foreignObject x="-54" y="-36" width="184" height="30" style={{ overflow: 'visible' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(255, 255, 255, 0.96)',
              color: '#0f172a',
              border: '1.2px solid #cbd5e1',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '8px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: '#16a34a' }}>✓</span>
            <span>FeS Insoluble in CS₂ (Clear solvent)</span>
          </div>
        </foreignObject>
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
  const hasSpecificVar =
    variables.buretteReading !== undefined ||
    variables.kohVolume !== undefined ||
    variables.naohVolume !== undefined ||
    variables.volumeA !== undefined ||
    variables.volumeB !== undefined ||
    variables.stdEdtaVolume !== undefined ||
    variables.sampleEdtaVolume !== undefined ||
    variables.thiosulphateVolume !== undefined;
  const hasVolumeVar = hasSpecificVar || variables.volumeAdded !== undefined;

  const edtaVol = flags?.buretteRefilled
    ? (variables.sampleEdtaVolume ?? 0)
    : (variables.stdEdtaVolume ?? 0);

  const currentVolume = hasSpecificVar
    ? (variables.buretteReading ?? 0) +
      (variables.kohVolume ?? 0) +
      (variables.naohVolume ?? 0) +
      (variables.volumeA ?? 0) +
      (variables.volumeB ?? 0) +
      edtaVol +
      (variables.thiosulphateVolume ?? 0)
    : (variables.volumeAdded ?? 0);
  const maxVolume = 50;

  const isBuretteFilled = Boolean(
    (flags?.buretteFilled === true ||
      extraProps?.buretteFilled === true ||
      extraProps?.isFilled === true ||
      flags?.['burette-filled'] === true ||
      (flags?.buretteFilled === undefined && typeof _liquidLevel === 'number' && _liquidLevel > 0)) &&
    flags?.buretteFilled !== false &&
    flags?.['burette-filled'] !== false &&
    extraProps?.isFilled !== false
  );

  const effectiveLevel = isBuretteFilled
    ? Math.max(0, Math.min(1, (maxVolume - currentVolume) / maxVolume))
    : 0;

  const [localOpen, setLocalOpen] = React.useState(0);
  const [emptyWarning, setEmptyWarning] = React.useState(false);
  const [isDraggingValve, setIsDraggingValve] = React.useState(false);
  const isPointerDownRef = React.useRef(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const hasMovedRef = React.useRef(false);
  const startOpenRef = React.useRef(0);

  const parentOpen = (extraProps?.stopcockOpen as number | undefined) ?? (variables.stopcockOpen ?? undefined);
  const stopcockOpen = isBuretteFilled ? (parentOpen !== undefined ? parentOpen : localOpen) : 0;
  const isTitrating = Boolean(
    isBuretteFilled &&
    effectiveLevel > 0 &&
    (stopcockOpen > 0 ||
      flags?.isTitrating ||
      extraProps?.isTitrating ||
      flags?.titrating ||
      extraProps?.titrating)
  );


  const handleSetOpen = React.useCallback((openVal: number) => {
    if (!isBuretteFilled && openVal > 0) {
      setEmptyWarning(true);
      setTimeout(() => setEmptyWarning(false), 2500);
      return;
    }
    const clamped = Math.max(0, Math.min(1, Math.round(openVal * 100) / 100));
    setLocalOpen(clamped);
    if (typeof extraProps?.onSetStopcock === 'function') {
      (extraProps.onSetStopcock as (v: number) => void)(clamped);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('burette_stopcock_change', { detail: { open: clamped, id } }));
    }
  }, [extraProps, id, isBuretteFilled]);

  const stepUpFlow = React.useCallback(() => {
    if (!isBuretteFilled) {
      setEmptyWarning(true);
      setTimeout(() => setEmptyWarning(false), 2500);
      return;
    }
    let nextOpen: number;
    if (stopcockOpen === 0) {
      nextOpen = 0.25;
    } else if (stopcockOpen < 0.45) {
      nextOpen = 0.50;
    } else if (stopcockOpen < 0.70) {
      nextOpen = 0.75;
    } else {
      nextOpen = 1.00;
    }
    handleSetOpen(nextOpen);
  }, [stopcockOpen, handleSetOpen, isBuretteFilled]);

  const stepDownFlow = React.useCallback(() => {
    let nextOpen: number;
    if (stopcockOpen > 0.85) {
      nextOpen = 0.75;
    } else if (stopcockOpen > 0.60) {
      nextOpen = 0.50;
    } else if (stopcockOpen > 0.30) {
      nextOpen = 0.25;
    } else {
      nextOpen = 0;
    }
    handleSetOpen(nextOpen);
  }, [stopcockOpen, handleSetOpen]);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    if (!isBuretteFilled) {
      setEmptyWarning(true);
      setTimeout(() => setEmptyWarning(false), 2500);
      return;
    }
    isPointerDownRef.current = true;
    setIsDraggingValve(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    startOpenRef.current = stopcockOpen;
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  }, [stopcockOpen, isBuretteFilled]);

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
    setIsDraggingValve(false);
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
          style={{ transition: isDraggingValve ? 'none' : 'transform 0.18s ease-out' }}
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

      {/* If Burette is empty, show Fill Guide badge in empty space */}
      {!isBuretteFilled && (
        <g
          transform={`translate(${buretteX + 22}, ${buretteBottom - 12})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            setEmptyWarning(true);
            setTimeout(() => setEmptyWarning(false), 2500);
          }}
        >
          <rect
            x="-2"
            y="-7"
            width="64"
            height="18"
            rx="3.5"
            fill={emptyWarning ? '#fee2e2' : '#fef3c7'}
            stroke={emptyWarning ? '#ef4444' : '#f59e0b'}
            strokeWidth="0.9"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
          />
          <text
            x="30"
            y="0"
            textAnchor="middle"
            fill={emptyWarning ? '#b91c1c' : '#b45309'}
            fontSize="5.2"
            fontWeight={800}
            fontFamily="var(--font-sans)"
          >
            {emptyWarning ? '⚠️ Fill Titrant First!' : '⚠️ Burette is Empty'}
          </text>
          <text
            x="30"
            y="7"
            textAnchor="middle"
            fill={emptyWarning ? '#dc2626' : '#92400e'}
            fontSize="4.2"
            fontFamily="var(--font-sans)"
            fontWeight={600}
          >
            {emptyWarning ? 'Pour titrant into top' : 'Fill before opening'}
          </text>
        </g>
      )}

      {/* Interactive Guide / Direction Label when closed (Clickable in empty space) */}
      {isBuretteFilled && stopcockOpen === 0 && (
        <g
          transform={`translate(${buretteX + 22}, ${buretteBottom - 12})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepUpFlow();
          }}
        >
          <rect
            x="-2"
            y="-7"
            width="62"
            height="18"
            rx="3.5"
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth="0.8"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
          />
          <text x="29" y="-0.5" textAnchor="middle" fill="#2563eb" fontSize="5.2" fontWeight={800} fontFamily="var(--font-sans)">
            ↻ Right: Open | Left: Close
          </text>
          <text x="29" y="6.5" textAnchor="middle" fill="#64748b" fontSize="4.2" fontFamily="var(--font-sans)" fontWeight={600}>
            Click Wings to Adjust
          </text>
        </g>
      )}

      {/* Active Flow Rate Badge when open (Clickable to slow down/step down flow) */}
      {stopcockOpen > 0 && (
        <g
          transform={`translate(${buretteX + 22}, ${buretteBottom - 12})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepDownFlow();
          }}
        >
          <rect x="-2" y="-7" width="62" height="14" rx="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="0.8" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
          <text x="29" y="2.5" textAnchor="middle" fill="#1d4ed8" fontSize="5" fontWeight={800} fontFamily="var(--font-mono)">
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
      {isBuretteFilled && hasVolumeVar && (
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
  width = 75,
  height = 125,
  flags = {},
  extraProps = {},
  ...rest
}) => {
  const p = rest as Record<string, unknown>;
  // Dynamic flags/extraProps take precedence, or checks prop isLit, defaulting to false
  const isLit =
    typeof extraProps?.['isLit'] === 'boolean'
      ? (extraProps['isLit'] as boolean)
      : typeof extraProps?.burnerLit === 'boolean'
      ? (extraProps.burnerLit as boolean)
      : typeof flags?.burnerLit === 'boolean'
      ? (flags.burnerLit as boolean)
      : typeof flags?.isLit === 'boolean'
      ? (flags.isLit as boolean)
      : typeof p.isLit === 'boolean'
      ? (p.isLit as boolean)
      : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof extraProps?.onToggleBurner === 'function') {
      (extraProps.onToggleBurner as () => void)();
    }
  };

  return (
    <svg width={width} height={height} viewBox="0 0 75 125" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        {/* Stainless steel / chrome barrel gradient */}
        <linearGradient id="burnerBarrelGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="25%" stopColor="#94a3b8" />
          <stop offset="55%" stopColor="#f1f5f9" />
          <stop offset="85%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Cast iron heavy base gradient */}
        <linearGradient id="burnerBaseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Brass needle valve & collar gradient */}
        <linearGradient id="burnerBrassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        {/* Outer flame mantle gradient */}
        <linearGradient id="flameOuterGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="rgba(37, 99, 235, 0.85)" />
          <stop offset="40%" stopColor="rgba(56, 189, 248, 0.75)" />
          <stop offset="80%" stopColor="rgba(96, 165, 250, 0.6)" />
          <stop offset="100%" stopColor="rgba(251, 146, 60, 0.8)" />
        </linearGradient>

        {/* Hot inner oxidizing/reducing cone gradient */}
        <linearGradient id="flameInnerGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0.95)" />
          <stop offset="70%" stopColor="rgba(165, 243, 252, 0.95)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.9)" />
        </linearGradient>
      </defs>

      {/* Highlight glow */}
      {highlighted && (
        <rect x="5" y="38" width="65" height="60" rx="6" stroke="#3b82f6" strokeWidth="3" opacity="0.5" filter="blur(2px)" />
      )}

      {/* ── Dynamic Bunsen Flame (when lit) ── */}
      {isLit && (
        <g id="bunsen-flame">
          {/* Heat convection shimmer wave wisps */}
          <path d="M 34 38 Q 30 20 37 4" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.2" strokeDasharray="3,3" fill="none">
            <animate attributeName="stroke-dashoffset" values="6;0" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.2s" repeatCount="indefinite" />
          </path>
          <path d="M 41 38 Q 45 18 39 2" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.2" strokeDasharray="3,3" fill="none">
            <animate attributeName="stroke-dashoffset" values="6;0" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.4s" repeatCount="indefinite" />
          </path>

          {/* Outer high-temperature blue flame cone */}
          <path
            d="M 37.5 4 Q 48 18 45 32 Q 44 42 37.5 42 Q 31 42 30 32 Q 27 18 37.5 4 Z"
            fill="url(#flameOuterGrad)"
            filter="drop-shadow(0 0 6px rgba(56, 189, 248, 0.6))"
          >
            <animate
              attributeName="d"
              values="
                M 37.5 4 Q 48 18 45 32 Q 44 42 37.5 42 Q 31 42 30 32 Q 27 18 37.5 4 Z;
                M 37.5 2 Q 46 17 44 32 Q 43 42 37.5 42 Q 32 42 31 32 Q 29 17 37.5 2 Z;
                M 37.5 5 Q 49 19 46 32 Q 44 42 37.5 42 Q 31 42 29 32 Q 26 19 37.5 5 Z;
                M 37.5 4 Q 48 18 45 32 Q 44 42 37.5 42 Q 31 42 30 32 Q 27 18 37.5 4 Z
              "
              dur="0.45s"
              repeatCount="indefinite"
            />
          </path>

          {/* Inner intense pale cyan reducing cone */}
          <path
            d="M 37.5 16 Q 43 25 42 34 Q 41 42 37.5 42 Q 34 42 33 34 Q 32 25 37.5 16 Z"
            fill="url(#flameInnerGrad)"
            opacity="0.95"
          >
            <animate
              attributeName="d"
              values="
                M 37.5 16 Q 43 25 42 34 Q 41 42 37.5 42 Q 34 42 33 34 Q 32 25 37.5 16 Z;
                M 37.5 14 Q 42 24 41 34 Q 40 42 37.5 42 Q 35 42 34 34 Q 33 24 37.5 14 Z;
                M 37.5 16 Q 43 25 42 34 Q 41 42 37.5 42 Q 34 42 33 34 Q 32 25 37.5 16 Z
              "
              dur="0.35s"
              repeatCount="indefinite"
            />
          </path>

          {/* Luminous flame tip micro-flicker */}
          <ellipse cx="37.5" cy="5" rx="1.6" ry="3.5" fill="#fde047" opacity="0.85">
            <animate attributeName="cy" values="5;3;6;5" dur="0.25s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.85;0.5;0.9;0.85" dur="0.25s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {/* ── Burner Metal Structure ── */}

      {/* Gas inlet connector hose on left */}
      <path d="M 0 88 C 10 88, 14 86, 20 86" stroke="#475569" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M 0 88 C 10 88, 14 86, 20 86" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" strokeLinecap="round" fill="none" />
      <rect x="18" y="83" width="7" height="6" rx="1" fill="url(#burnerBrassGrad)" stroke="#78350f" strokeWidth="0.6" />

      {/* Heavy cast-iron wide base (rests flat on bench) */}
      <rect x="10" y="85" width="55" height="13" rx="3.5" fill="url(#burnerBaseGrad)" stroke="#1e293b" strokeWidth="1.2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.35))" />
      <rect x="12" y="86" width="51" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
      {/* Rubber anti-slip feet pads */}
      <rect x="14" y="98" width="8" height="2" rx="1" fill="#0f172a" />
      <rect x="53" y="98" width="8" height="2" rx="1" fill="#0f172a" />

      {/* Vertical Chimney Barrel Tube */}
      <rect x="32" y="42" width="11" height="44" rx="1" fill="url(#burnerBarrelGrad)" stroke="#334155" strokeWidth="0.8" />
      {/* Burner nozzle rim at top */}
      <ellipse cx="37.5" cy="42" rx="6.5" ry="2" fill="#64748b" stroke="#334155" strokeWidth="0.8" />
      <ellipse cx="37.5" cy="42" rx="4.5" ry="1.2" fill="#0f172a" />

      {/* Rotatable Air Collar with Dual Air Vent Holes */}
      <rect x="30" y="65" width="15" height="8" rx="1.5" fill="url(#burnerBrassGrad)" stroke="#78350f" strokeWidth="0.6" />
      <ellipse cx="34" cy="69" rx="1.8" ry="2.2" fill="#0f172a" />
      <ellipse cx="41" cy="69" rx="1.8" ry="2.2" fill="#0f172a" />

      {/* Brass Needle-Valve Gas Knob (Interactive) */}
      <g
        id="burner-valve-knob"
        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
        onClick={handleToggle}
      >
        <rect x="44" y="82" width="10" height="6" rx="1.5" fill="url(#burnerBrassGrad)" stroke="#78350f" strokeWidth="0.6" />
        <line x1="47" y1="82" x2="47" y2="88" stroke="#78350f" strokeWidth="0.6" />
        <line x1="50" y1="82" x2="50" y2="88" stroke="#78350f" strokeWidth="0.6" />
      </g>

      {/* ── Interactive Start / Stop Flame Button Pill ── */}
      <g
        id="burner-start-stop-pill"
        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
        onClick={handleToggle}
      >
        {/* Button container */}
        <rect
          x="11"
          y="104"
          width="53"
          height="18"
          rx="5"
          fill={isLit ? '#dc2626' : '#16a34a'}
          stroke={isLit ? '#991b1b' : '#15803d'}
          strokeWidth="1"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
        />
        {/* Glow indicator bulb */}
        <circle cx="20" cy="113" r="3.5" fill={isLit ? '#fecaca' : '#bbf7d0'} />
        <circle cx="20" cy="113" r="1.8" fill="#ffffff">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
        </circle>
        {/* Label */}
        <text
          x="42"
          y="116.5"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="700"
          fill="#ffffff"
          fontFamily="var(--font-sans)"
          letterSpacing="0.04em"
        >
          {isLit ? 'STOP' : 'START'}
        </text>
      </g>
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

      {/* Stopper / Cap (removed when unstoppered/pouring) */}
      {!id?.startsWith('pouring-') ? (
        <g id="bottle-stopper">
          <rect x="16" y="14" width="18" height="8" rx="2.5" fill="#475569" stroke="#334155" strokeWidth="1" />
          <rect x="19" y="16" width="12" height="4" rx="1.5" fill="#64748b" />
        </g>
      ) : (
        <ellipse cx="25" cy="20" rx="6.5" ry="2" fill="rgba(241,245,249,0.35)" stroke="#94a3b8" strokeWidth="1.2" />
      )}

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
  ...rest
}) => {
  const restProps = rest as Record<string, unknown>;
  const hideLowerClamp = !!(extraProps as Record<string, unknown>).hideLowerClamp || !!restProps.hideLowerClamp;
  const hideUpperClamp = !!(extraProps as Record<string, unknown>).hideUpperClamp || !!restProps.hideUpperClamp;

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
      {!hideUpperClamp && (
        <>
          <rect x="38" y="55" width="15" height="14" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <circle cx="49" cy="62" r="3" fill="#64748b" stroke="#334155" strokeWidth="0.6" />
          <path d="M 53 58 L 72 58 L 78 54 L 78 68 L 72 64 L 53 64 Z" fill="url(#metalStandGrad)" stroke="#334155" strokeWidth="0.8" />
        </>
      )}
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
  const hasSpecificVar =
    variables.buretteReading !== undefined ||
    variables.kohVolume !== undefined ||
    variables.naohVolume !== undefined ||
    variables.volumeA !== undefined ||
    variables.volumeB !== undefined ||
    variables.stdEdtaVolume !== undefined ||
    variables.sampleEdtaVolume !== undefined ||
    variables.thiosulphateVolume !== undefined;
  const hasVolumeVar = hasSpecificVar || variables.volumeAdded !== undefined;

  const edtaVol = flags?.buretteRefilled
    ? (variables.sampleEdtaVolume ?? 0)
    : (variables.stdEdtaVolume ?? 0);

  const currentVolume = hasSpecificVar
    ? (variables.buretteReading ?? 0) +
      (variables.kohVolume ?? 0) +
      (variables.naohVolume ?? 0) +
      (variables.volumeA ?? 0) +
      (variables.volumeB ?? 0) +
      edtaVol +
      (variables.thiosulphateVolume ?? 0)
    : (variables.volumeAdded ?? 0);
  const maxVolume = 50;

  const isBuretteFilled = Boolean(
    (flags?.buretteFilled === true ||
      extraProps?.buretteFilled === true ||
      extraProps?.isFilled === true ||
      flags?.['burette-filled'] === true ||
      (flags?.buretteFilled === undefined && typeof _liquidLevel === 'number' && _liquidLevel > 0)) &&
    flags?.buretteFilled !== false &&
    flags?.['burette-filled'] !== false &&
    extraProps?.isFilled !== false
  );

  const effectiveLevel = isBuretteFilled
    ? Math.max(0, Math.min(1, (maxVolume - currentVolume) / maxVolume))
    : 0;

  const [localOpen, setLocalOpen] = React.useState(0);
  const [emptyWarning, setEmptyWarning] = React.useState(false);
  const [isDraggingValve, setIsDraggingValve] = React.useState(false);
  const isPointerDownRef = React.useRef(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const hasMovedRef = React.useRef(false);
  const startOpenRef = React.useRef(0);

  const parentOpen = (extraProps?.stopcockOpen as number | undefined) ?? (variables.stopcockOpen ?? undefined);
  const stopcockOpen = isBuretteFilled ? (parentOpen !== undefined ? parentOpen : localOpen) : 0;
  const isTitrating = Boolean(
    isBuretteFilled &&
    effectiveLevel > 0 &&
    (stopcockOpen > 0 ||
      flags?.isTitrating ||
      extraProps?.isTitrating ||
      flags?.titrating ||
      extraProps?.titrating)
  );


  const handleSetOpen = React.useCallback((openVal: number) => {
    if (!isBuretteFilled && openVal > 0) {
      setEmptyWarning(true);
      setTimeout(() => setEmptyWarning(false), 2500);
      return;
    }
    const clamped = Math.max(0, Math.min(1, Math.round(openVal * 100) / 100));
    setLocalOpen(clamped);
    if (typeof extraProps?.onSetStopcock === 'function') {
      (extraProps.onSetStopcock as (v: number) => void)(clamped);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('burette_stopcock_change', { detail: { open: clamped, id } }));
    }
  }, [extraProps, id, isBuretteFilled]);

  const stepUpFlow = React.useCallback(() => {
    if (!isBuretteFilled) {
      setEmptyWarning(true);
      setTimeout(() => setEmptyWarning(false), 2500);
      return;
    }
    let nextOpen: number;
    if (stopcockOpen === 0) {
      nextOpen = 0.25;
    } else if (stopcockOpen < 0.45) {
      nextOpen = 0.50;
    } else if (stopcockOpen < 0.70) {
      nextOpen = 0.75;
    } else {
      nextOpen = 1.00;
    }
    handleSetOpen(nextOpen);
  }, [stopcockOpen, handleSetOpen, isBuretteFilled]);

  const stepDownFlow = React.useCallback(() => {
    let nextOpen: number;
    if (stopcockOpen > 0.85) {
      nextOpen = 0.75;
    } else if (stopcockOpen > 0.60) {
      nextOpen = 0.50;
    } else if (stopcockOpen > 0.30) {
      nextOpen = 0.25;
    } else {
      nextOpen = 0;
    }
    handleSetOpen(nextOpen);
  }, [stopcockOpen, handleSetOpen]);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    if (!isBuretteFilled) {
      setEmptyWarning(true);
      setTimeout(() => setEmptyWarning(false), 2500);
      return;
    }
    isPointerDownRef.current = true;
    setIsDraggingValve(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    startOpenRef.current = stopcockOpen;
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  }, [stopcockOpen, isBuretteFilled]);

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
    setIsDraggingValve(false);
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
      <g id="bstand-hardware" opacity="0.30" style={{ transition: 'opacity 0.3s ease' }}>
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
          style={{ transition: isDraggingValve ? 'none' : 'transform 0.18s ease-out' }}
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

      {/* If Burette is empty, show Fill Guide badge instead of Open */}
      {!isBuretteFilled && (
        <g
          transform={`translate(${buretteX + 16}, ${tubeBottom + 10})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            setEmptyWarning(true);
            setTimeout(() => setEmptyWarning(false), 2500);
          }}
        >
          <rect
            x="-2"
            y="-7"
            width="64"
            height="18"
            rx="3.5"
            fill={emptyWarning ? '#fee2e2' : '#fef3c7'}
            stroke={emptyWarning ? '#ef4444' : '#f59e0b'}
            strokeWidth="0.9"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
          />
          <text
            x="30"
            y="0"
            textAnchor="middle"
            fill={emptyWarning ? '#b91c1c' : '#b45309'}
            fontSize="5.2"
            fontWeight={800}
            fontFamily="var(--font-sans)"
          >
            {emptyWarning ? '⚠️ Fill Titrant First!' : '⚠️ Burette is Empty'}
          </text>
          <text
            x="30"
            y="7"
            textAnchor="middle"
            fill={emptyWarning ? '#dc2626' : '#92400e'}
            fontSize="4.2"
            fontFamily="var(--font-sans)"
            fontWeight={600}
          >
            {emptyWarning ? 'Pour titrant into top' : 'Fill before opening'}
          </text>
        </g>
      )}

      {/* If Burette is empty, show Fill Guide badge in empty space */}
      {!isBuretteFilled && (
        <g
          transform={`translate(${buretteX + 26}, ${tubeBottom - 12})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            setEmptyWarning(true);
            setTimeout(() => setEmptyWarning(false), 2500);
          }}
        >
          <rect
            x="-2"
            y="-7"
            width="64"
            height="18"
            rx="3.5"
            fill={emptyWarning ? '#fee2e2' : '#fef3c7'}
            stroke={emptyWarning ? '#ef4444' : '#f59e0b'}
            strokeWidth="0.9"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
          />
          <text
            x="30"
            y="0"
            textAnchor="middle"
            fill={emptyWarning ? '#b91c1c' : '#b45309'}
            fontSize="5.2"
            fontWeight={800}
            fontFamily="var(--font-sans)"
          >
            {emptyWarning ? '⚠️ Fill Titrant First!' : '⚠️ Burette is Empty'}
          </text>
          <text
            x="30"
            y="7"
            textAnchor="middle"
            fill={emptyWarning ? '#dc2626' : '#92400e'}
            fontSize="4.2"
            fontFamily="var(--font-sans)"
            fontWeight={600}
          >
            {emptyWarning ? 'Pour titrant into top' : 'Fill before opening'}
          </text>
        </g>
      )}

      {/* Interactive Guide / Direction Label when closed (Clickable in empty space) */}
      {isBuretteFilled && stopcockOpen === 0 && (
        <g
          transform={`translate(${buretteX + 26}, ${tubeBottom - 12})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepUpFlow();
          }}
        >
          <rect
            x="-2"
            y="-7"
            width="62"
            height="18"
            rx="3.5"
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth="0.8"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
          />
          <text x="29" y="-0.5" textAnchor="middle" fill="#2563eb" fontSize="5.2" fontWeight={800} fontFamily="var(--font-sans)">
            ↻ Right: Open | Left: Close
          </text>
          <text x="29" y="6.5" textAnchor="middle" fill="#64748b" fontSize="4.2" fontFamily="var(--font-sans)" fontWeight={600}>
            Click Wings to Adjust
          </text>
        </g>
      )}

      {/* Active Flow Rate Badge when open (Clickable to slow down/step down flow) */}
      {stopcockOpen > 0 && (
        <g
          transform={`translate(${buretteX + 26}, ${tubeBottom - 12})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepDownFlow();
          }}
        >
          <rect x="-2" y="-7" width="62" height="15" rx="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="0.8" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
          <text x="29" y="3" textAnchor="middle" fill="#1d4ed8" fontSize="5" fontWeight={800} fontFamily="var(--font-mono)">
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
      {isBuretteFilled && hasVolumeVar && (
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

      {/* Burette Label Plaque (Positioned in empty space to the right of tube mouth) */}
      {label && (
        <g transform={`translate(${buretteX + 28}, 14)`}>
          <rect x="-2" y="0" width="56" height="13" rx="3" fill="rgba(255,255,255,0.95)" stroke="#cbd5e1" strokeWidth="0.8" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
          <text x="26" y="9" textAnchor="middle" fontSize="5.8" fontWeight="700" fill="#1e293b" fontFamily="var(--font-sans)">
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
  ...props
}) => {
  const p = props as Record<string, unknown>;
  const rawReading =
    typeof p.reading === 'number'
      ? (p.reading as number)
      : typeof p.massGrams === 'number'
      ? (p.massGrams as number)
      : typeof p.mass === 'number'
      ? (p.mass as number)
      : typeof extraProps?.['reading'] === 'number'
      ? (extraProps['reading'] as number)
      : 0;
  const displayValue = rawReading > 0 ? rawReading.toFixed(2) : '0.00';

  return (
    <svg width={width} height={height} viewBox="0 0 120 70" fill="none">
      <defs>
        <linearGradient id="balancePanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="25%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="75%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="balanceBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="30%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="balanceBezelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Rubber anti-slip feet */}
      <rect x="14" y="65" width="16" height="4" rx="1.5" fill="#1e293b" />
      <rect x="90" y="65" width="16" height="4" rx="1.5" fill="#1e293b" />

      {/* Main Chassis Body */}
      <rect
        x="6"
        y="18"
        width="108"
        height="48"
        rx="5"
        fill="url(#balanceBodyGrad)"
        stroke={highlighted ? '#3b82f6' : '#94a3b8'}
        strokeWidth={highlighted ? 2 : 1.2}
      />
      {/* Upper casing bevel highlight */}
      <path d="M 11 19 L 109 19" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Center Weighing Pan Pillar/Stem */}
      <rect x="54" y="12" width="12" height="7" rx="1" fill="#64748b" stroke="#475569" strokeWidth="0.8" />

      {/* Top Stainless Steel Weighing Pan Platform */}
      {/* Pan 3D rim edge */}
      <ellipse cx="60" cy="12" rx="46" ry="6" fill="#475569" />
      <rect x="14" y="9" width="92" height="4" fill="url(#balancePanGrad)" stroke="#64748b" strokeWidth="0.6" />
      {/* Pan Top Surface */}
      <ellipse cx="60" cy="9" rx="46" ry="5.5" fill="url(#balancePanGrad)" stroke="#94a3b8" strokeWidth="0.8" />
      {/* Pan concentric calibration ring & specular shine */}
      <ellipse cx="60" cy="9" rx="38" ry="4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" />
      <ellipse cx="60" cy="8.5" rx="26" ry="2.8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />

      {/* ── Front Face Control Panel & Display (Below the pan, 100% visible) ── */}
      {/* Screen Bezel */}
      <rect x="22" y="27" width="76" height="25" rx="3" fill="url(#balanceBezelGrad)" stroke="#334155" strokeWidth="1" />
      {/* Inner display screen */}
      <rect x="24" y="29" width="72" height="21" rx="2" fill="#020617" />

      {/* Fluorescent LED Readout */}
      <text
        x="60"
        y="44"
        textAnchor="middle"
        fontSize="13"
        fill="#4ade80"
        fontFamily="var(--font-mono, monospace)"
        fontWeight="700"
        letterSpacing="0.05em"
      >
        {displayValue} <tspan fontSize="8.5" fill="#22c55e">g</tspan>
      </text>

      {/* Small status indicators on display */}
      <text x="27" y="35" fontSize="4.5" fill="#22c55e" fontFamily="var(--font-mono, monospace)" fontWeight="700">ZERO</text>
      <text x="83" y="35" fontSize="4.5" fill="#22c55e" fontFamily="var(--font-mono, monospace)" fontWeight="700">STABLE</text>

      {/* Control Buttons */}
      <g>
        <rect x="10" y="32" width="9" height="15" rx="2" fill="#334155" stroke="#475569" strokeWidth="0.8" />
        <text x="14.5" y="42" textAnchor="middle" fontSize="4" fill="#94a3b8" fontWeight="700" fontFamily="var(--font-sans)">TARE</text>

        <rect x="101" y="32" width="9" height="15" rx="2" fill="#334155" stroke="#475569" strokeWidth="0.8" />
        <text x="105.5" y="42" textAnchor="middle" fontSize="4" fill="#94a3b8" fontWeight="700" fontFamily="var(--font-sans)">CAL</text>
      </g>

      {/* Brand / Precision Rating on Lower Apron */}
      <text
        x="60"
        y="59"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fill="#64748b"
        letterSpacing="0.06em"
        fontFamily="var(--font-sans)"
      >
        {label || 'DIGITAL BALANCE  d = 0.01 g'}
      </text>
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
      fill={highlighted ? '#a78bfa' : '#334155'}
      stroke={highlighted ? '#7c3aed' : '#1e293b'}
      strokeWidth="1.5" />
    <line x1="14" y1="10" x2="26" y2="10" stroke="#475569" strokeWidth="0.8" />
    <line x1="13" y1="15" x2="27" y2="15" stroke="#475569" strokeWidth="0.8" />
  </svg>
);


// ── Stainless Steel Lab Spatula ──────────────────────────────────

const Spatula: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 50,
  height = 90,
  label,
  flags,
  extraProps,
  ...props
}) => {
  const p = props as Record<string, unknown>;
  const hasSample = Boolean(p.hasSample || extraProps?.hasSample || flags?.spatulaHasSample);

  return (
    <svg width={width} height={height} viewBox="0 0 50 90" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="spatulaMetalGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="45%" stopColor="#f1f5f9" />
          <stop offset="75%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
      {/* Handle */}
      <rect x="22" y="8" width="6" height="52" rx="2" fill="url(#spatulaMetalGrad)" stroke="#475569" strokeWidth="0.8" />
      <line x1="24" y1="12" x2="24" y2="56" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
      {/* Scoop / Flat Blade */}
      <path d="M 19 60 C 17 72, 17 82, 25 82 C 33 82, 33 72, 31 60 Z" fill="url(#spatulaMetalGrad)" stroke="#334155" strokeWidth="0.9" />
      <ellipse cx="25" cy="72" rx="4.5" ry="6.5" fill="rgba(255,255,255,0.3)" />

      {/* Scooped Fe + S powder on blade */}
      {hasSample && (
        <g id="spatula-powder-heap">
          <ellipse cx="25" cy="72" rx="4.5" ry="5.5" fill="#ca8a04" opacity="0.85" />
          {/* Iron dark grains */}
          <circle cx="23" cy="71" r="1.3" fill="#1e293b" />
          <circle cx="26" cy="74" r="1.2" fill="#334155" />
          <circle cx="27" cy="70" r="1.1" fill="#1e293b" />
          {/* Sulphur yellow grains */}
          <circle cx="25" cy="72" r="1.3" fill="#facc15" />
          <circle cx="23" cy="75" r="1.1" fill="#fde047" />
          <circle cx="27" cy="73" r="1.2" fill="#facc15" />
        </g>
      )}

      {label && (
        <text x="25" y="88" textAnchor="middle" fontSize="6.5" fill="var(--text-secondary)" fontWeight="600">
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Thermometer ──────────────────────────────────────────────────

const Thermometer: React.FC<ApparatusProps> = ({
  id = 'thermometer',
  highlighted = false,
  width = 35,
  height = 160,
  flags = {},
  variables = {},
  extraProps = {},
  ...rest
}) => {
  const restProps = rest as Record<string, unknown>;
  const rawTemp =
    variables?.temperature !== undefined
      ? Number(variables.temperature)
      : (restProps.temperature !== undefined
          ? Number(restProps.temperature)
          : (extraProps?.['temperature'] !== undefined
              ? Number(extraProps['temperature'])
              : (restProps.temp !== undefined ? Number(restProps.temp) : 25)));

  const temperature = isNaN(rawTemp) ? 25 : rawTemp;
  const isClamped = Boolean(
    restProps.isClamped ??
    extraProps?.isClamped ??
    flags?.thermometerInserted ??
    flags?.['thermometerInserted'] ??
    false
  );

  // Range -10 to 110 °C
  const minTemp = -10;
  const maxTemp = 110;
  const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temperature));
  const fillFraction = (clampedTemp - minTemp) / (maxTemp - minTemp);
  const capillaryTop = 20;
  const capillaryBottom = 110;
  const capillaryHeight = capillaryBottom - capillaryTop;
  const mercuryY = capillaryBottom - fillFraction * capillaryHeight;

  // Temperature phase badge info
  const isMeltingIce = temperature <= 0;
  const isBoiling = temperature >= 100;
  const kelvinVal = (temperature + 273.15).toFixed(1);

  if (!isClamped) {
    // Regular standalone lab thermometer (used in toolbox or unmounted)
    return (
      <svg width={width} height={height} viewBox="0 0 32 150" fill="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`thermoGlassGrad-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="35%" stopColor="rgba(224,242,254,0.3)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(148,163,184,0.6)" />
          </linearGradient>
          <linearGradient id={`mercuryGrad-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="70%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <radialGradient id={`bulbGrad-${id}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
        </defs>

        {highlighted && (
          <rect x="7" y="10" width="18" height="135" rx="9" stroke="#3b82f6" strokeWidth="3" opacity="0.6" filter="blur(2px)" />
        )}

        {/* Stem Glass Body */}
        <rect x="11" y="12" width="10" height="108" rx="5" fill={`url(#thermoGlassGrad-${id})`} stroke="#94a3b8" strokeWidth="1.2" />

        {/* Capillary bore */}
        <rect x="14.5" y="18" width="3" height="98" rx="1.5" fill="rgba(15,23,42,0.12)" />

        {/* Mercury thread */}
        <rect
          x="14.5"
          y={mercuryY}
          width="3"
          height={Math.max(4, capillaryBottom - mercuryY + 4)}
          rx="1.5"
          fill={`url(#mercuryGrad-${id})`}
          style={{ transition: 'y 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />

        {/* Mercury reservoir bulb */}
        <circle cx="16" cy="125" r="9" fill={`url(#bulbGrad-${id})`} stroke="#94a3b8" strokeWidth="1.2" />
        <ellipse cx="14" cy="122" rx="3" ry="2" fill="rgba(255,255,255,0.6)" />

        {/* Scale markings */}
        {[-10, 0, 20, 40, 60, 80, 100, 110].map(t => {
          const y = capillaryBottom - ((t - minTemp) / (maxTemp - minTemp)) * capillaryHeight;
          const isMajor = t === 0 || t === 100;
          return (
            <g key={t}>
              <line x1="10" y1={y} x2={isMajor ? "6" : "8"} y2={y} stroke={isMajor ? (t === 0 ? "#0284c7" : "#ea580c") : "#64748b"} strokeWidth={isMajor ? "1.2" : "0.7"} />
              {isMajor && (
                <text x="5" y={y + 2.5} textAnchor="end" fontSize="6" fontWeight="bold" fill={t === 0 ? "#0284c7" : "#ea580c"}>
                  {t}°
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // Clamped state (mounted inside beaker from retort stand clamp)
  return (
    <svg width={260} height={height} viewBox="-126 0 260 160" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`thermoGlassGradClamped-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="35%" stopColor="rgba(224,242,254,0.35)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(148,163,184,0.7)" />
        </linearGradient>
        <linearGradient id={`mercuryGradClamped-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="40%" stopColor="#ef4444" />
          <stop offset="70%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <radialGradient id={`bulbGradClamped-${id}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="40%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
        <linearGradient id={`clampMetalGrad-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="40%" stopColor="#94a3b8" />
          <stop offset="70%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id={`clampJawGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* ── Mechanical Clamp Arm Assembly (Extending from Retort Stand on Left) ── */}
      <g id={`thermometer-clamp-arm-${id}`}>
        {/* Boss-Head Clamp Collar locking around Retort Stand Stainless Rod on Left */}
        <rect x="-124" y="37" width="16" height="20" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.35))" />
        <rect x="-120" y="35" width="8" height="24" rx="2" fill="url(#metalStandGrad)" stroke="#334155" strokeWidth="0.6" opacity="0.9" />
        <circle cx="-116" cy="47" r="3" fill="#64748b" stroke="#334155" strokeWidth="0.6" />
        <circle cx="-121" cy="47" r="2.8" fill="#f59e0b" stroke="#b45309" strokeWidth="0.6" />

        {/* Horizontal chrome steel connecting clamp arm */}
        <rect x="-114" y="44" width="116" height="6.5" rx="3" fill={`url(#clampMetalGrad-${id})`} stroke="#334155" strokeWidth="0.8" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.3))" />

        {/* Dual-prong clamp collar body around thermometer stem */}
        <rect x="-4" y="41" width="16" height="12.5" rx="3" fill={`url(#clampJawGrad-${id})`} stroke="#0f172a" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.35))" />
        
        {/* Brass adjustment knurled thumb screw on clamp */}
        <rect x="3" y="35" width="4" height="6" rx="1" fill="#f59e0b" stroke="#b45309" strokeWidth="0.6" />
        <circle cx="5" cy="35" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />

        {/* Heat-resistant dark silicone protective jaw pads gripping glass */}
        <rect x="-2" y="43" width="3" height="8.5" rx="1.5" fill="#b91c1c" opacity="0.9" />
        <rect x="7" y="43" width="3" height="8.5" rx="1.5" fill="#b91c1c" opacity="0.9" />

        {/* Retort Stand Support Boss Indicator */}
        <text x="-120" y="33" fontSize="5.5" fontWeight="700" fill="#64748b" letterSpacing="0.03em">
          RETORT CLAMP
        </text>
      </g>

      {/* ── Thermometer Glass Body ── */}
      <g id={`thermometer-glass-${id}`}>
        {/* Stem Glass Body */}
        <rect x="-2" y="10" width="12" height="116" rx="6" fill={`url(#thermoGlassGradClamped-${id})`} stroke="#64748b" strokeWidth="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />

        {/* Capillary bore */}
        <rect x="2.5" y="18" width="3" height="100" rx="1.5" fill="rgba(15,23,42,0.15)" />

        {/* Mercury thread */}
        <rect
          x="2.5"
          y={mercuryY}
          width="3"
          height={Math.max(4, capillaryBottom - mercuryY + 4)}
          rx="1.5"
          fill={`url(#mercuryGradClamped-${id})`}
          style={{ transition: 'y 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />

        {/* Mercury reservoir bulb (immersed in beaker liquid, suspended above bottom) */}
        <circle cx="4" cy="130" r="9.5" fill={`url(#bulbGradClamped-${id})`} stroke="#64748b" strokeWidth="1.2" filter="drop-shadow(0 2px 5px rgba(220,38,38,0.4))" />
        <ellipse cx="2" cy="127" rx="3.2" ry="2.2" fill="rgba(255,255,255,0.7)" />

        {/* Scale markings */}
        {[-10, 0, 20, 40, 60, 80, 100, 110].map(t => {
          const y = capillaryBottom - ((t - minTemp) / (maxTemp - minTemp)) * capillaryHeight;
          const isMelting = t === 0;
          const isBoilingMark = t === 100;
          const isSpecial = isMelting || isBoilingMark;
          return (
            <g key={t}>
              <line
                x1="10"
                y1={y}
                x2={isSpecial ? "17" : "14"}
                y2={y}
                stroke={isMelting ? "#0284c7" : isBoilingMark ? "#ea580c" : "#475569"}
                strokeWidth={isSpecial ? "1.5" : "0.7"}
              />
              <text
                x="19"
                y={y + 2.5}
                fontSize={isSpecial ? "6.5" : "5"}
                fontWeight={isSpecial ? "bold" : "normal"}
                fill={isMelting ? "#0284c7" : isBoilingMark ? "#ea580c" : "#64748b"}
                fontFamily="var(--font-mono, monospace)"
              >
                {t}°
              </text>
            </g>
          );
        })}
      </g>

      {/* ── High-Visibility Real-Time Temperature HUD Pill Badge ── */}
      <g id={`thermometer-live-hud-${id}`} transform="translate(18, 12)">
        {/* Glow backdrop */}
        <rect
          x="0"
          y="0"
          width="52"
          height="23"
          rx="6"
          fill={isMeltingIce ? 'rgba(240, 249, 255, 0.96)' : isBoiling ? 'rgba(255, 247, 237, 0.96)' : 'rgba(248, 250, 252, 0.96)'}
          stroke={isMeltingIce ? '#0284c7' : isBoiling ? '#ea580c' : '#3b82f6'}
          strokeWidth="1.2"
          filter={isMeltingIce ? 'drop-shadow(0 2px 8px rgba(14, 165, 233, 0.35))' : isBoiling ? 'drop-shadow(0 2px 8px rgba(234, 88, 12, 0.35))' : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15))'}
        />

        {/* Temperature label */}
        <text
          x="6"
          y="10.5"
          fontSize="7.5"
          fontWeight="800"
          fill={isMeltingIce ? '#0369a1' : isBoiling ? '#c2410c' : '#1e293b'}
          fontFamily="var(--font-mono, monospace)"
        >
          {temperature.toFixed(1)} °C
        </text>

        {/* Kelvin converted label */}
        <text
          x="6"
          y="19"
          fontSize="5.2"
          fontWeight="600"
          fill={isMeltingIce ? '#0284c7' : isBoiling ? '#ea580c' : '#64748b'}
          fontFamily="var(--font-mono, monospace)"
        >
          {kelvinVal} K {isMeltingIce ? '• Ice Melt' : isBoiling ? '• Boiling' : ''}
        </text>
      </g>
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


// ── Tripod Stand & Wire Gauze ─────────────────────────────────────

const Tripod: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 110,
  height = 115,
  flags = {},
  extraProps = {},
  label,
}) => {
  const isHeating = Boolean(flags?.burnerLit ?? flags?.isHeating ?? extraProps?.isHeating);

  return (
    <svg width={width} height={height} viewBox="0 0 110 115" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        {/* Cast iron metallic gradient for legs */}
        <linearGradient id="tripodLegGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="40%" stopColor="#475569" />
          <stop offset="70%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Heavy top ring cast iron gradient */}
        <linearGradient id="tripodRingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Wire gauze mesh pattern */}
        <pattern id="wireGauzeMesh" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M 0 2 L 4 2 M 2 0 L 2 4" stroke="#a1a1aa" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* Highlight glow */}
      {highlighted && (
        <ellipse cx="55" cy="22" rx="42" ry="12" stroke="#3b82f6" strokeWidth="3" opacity="0.6" filter="blur(2px)" />
      )}

      {/* ── 3 Cast-Iron Tubular Legs (rest flat on the workbench table at y = 110) ── */}

      {/* Back center leg */}
      <line x1="55" y1="26" x2="55" y2="110" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="55" y1="26" x2="55" y2="110" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      {/* Back foot */}
      <ellipse cx="55" cy="110" rx="3.5" ry="1.5" fill="#0f172a" />

      {/* Open central chamber for burner clearance (burner flame rises here) */}

      {/* Left splayed leg */}
      <line x1="28" y1="24" x2="12" y2="110" stroke="url(#tripodLegGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="28.5" y1="24" x2="12.5" y2="109" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
      {/* Left rubber anti-slip foot pad */}
      <rect x="7" y="108" width="10" height="3.5" rx="1.5" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" />

      {/* Right splayed leg */}
      <line x1="82" y1="24" x2="98" y2="110" stroke="url(#tripodLegGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="81.5" y1="24" x2="97.5" y2="109" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
      {/* Right rubber anti-slip foot pad */}
      <rect x="93" y="108" width="10" height="3.5" rx="1.5" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" />

      {/* Leg mounting brackets under top ring */}
      <polygon points="24,22 32,22 28,30" fill="#334155" />
      <polygon points="51,25 59,25 55,32" fill="#1e293b" />
      <polygon points="78,22 86,22 82,30" fill="#334155" />

      {/* ── Heavy Circular Cast-Iron Top Ring (Outer rim) ── */}
      <ellipse cx="55" cy="22" rx="38" ry="9" fill="url(#tripodRingGrad)" stroke="#1e293b" strokeWidth="1.5" />
      <ellipse cx="55" cy="22" rx="34" ry="7.5" fill="#0f172a" stroke="#334155" strokeWidth="1" />

      {/* ── Wire Gauze Platform with Ceramic Heat-Diffuser Center ── */}
      {/* Square Wire Gauze Mesh plate mounted over the ring */}
      <g transform="translate(18, 14)">
        <polygon
          points="20,0 54,0 74,15 0,15"
          fill="url(#wireGauzeMesh)"
          stroke="#94a3b8"
          strokeWidth="0.8"
        />
        {/* Ceramic fibrous circular center heat-diffuser patch */}
        <ellipse
          cx="37"
          cy="8"
          rx="18"
          ry="5.5"
          fill={isHeating ? '#fef08a' : '#f8fafc'}
          stroke={isHeating ? '#f59e0b' : '#cbd5e1'}
          strokeWidth="0.8"
          style={{ transition: 'all 0.5s ease' }}
          filter={isHeating ? 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.7))' : undefined}
        />
        {/* Porous ceramic surface speckles */}
        <circle cx="31" cy="7" r="0.6" fill={isHeating ? '#d97706' : '#94a3b8'} opacity="0.6" />
        <circle cx="43" cy="8" r="0.8" fill={isHeating ? '#d97706' : '#94a3b8'} opacity="0.6" />
        <circle cx="37" cy="6" r="0.5" fill={isHeating ? '#d97706' : '#94a3b8'} opacity="0.6" />
        <circle cx="39" cy="10" r="0.7" fill={isHeating ? '#d97706' : '#94a3b8'} opacity="0.6" />
      </g>

      {/* Front edge rim highlight */}
      <path d="M 18 22 Q 55 31 92 22" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />

      {label && (
        <text x="55" y="122" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#64748b" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Evaporating Dish (China Dish / Porcelain Basin) ──────────────

const EvaporatingDish: React.FC<ApparatusProps> = ({
  liquidLevel = 0,
  liquidColor = 'rgba(224, 242, 254, 0.35)',
  label,
  highlighted = false,
  width = 95,
  height = 55,
  flags = {},
  extraProps = {},
}) => {
  const hasNH4Cl = Boolean(flags?.nh4clSublimed || extraProps?.hasNH4Cl || flags?.isSubliming);
  const isSubliming = Boolean(flags?.isSubliming || extraProps?.isSubliming);

  const hasMgAsh = Boolean(flags?.mgBurned || extraProps?.hasMgAsh || flags?.isBurningMg);
  const isBurningMg = Boolean(flags?.isBurningMg || extraProps?.isBurningMg);

  return (
    <svg width={width} height={height} viewBox="0 0 100 65" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        {/* Porcelain ceramic glaze gradient */}
        <linearGradient id="porcelainGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f8fafc" />
          <stop offset="75%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Inner basin shadow gradient */}
        <linearGradient id="basinInnerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#cbd5e1" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.9" />
        </linearGradient>

        {/* NH4Cl sublimation fume blur filter */}
        <filter id="fumeBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <filter id="starBurstGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Highlight glow when active drop target */}
      {highlighted && (
        <ellipse cx="50" cy="38" rx="44" ry="18" stroke="#3b82f6" strokeWidth="4" opacity="0.6" filter="blur(2px)" />
      )}

      {/* ── Sublimation White Fumes / Dense Vapours (Rising Clouds) ── */}
      {isSubliming && (
        <g id="nh4cl-sublimation-fumes">
          {/* Cloud Billow 1 (Left puff) */}
          <circle cx="36" cy="18" r="14" fill="rgba(255, 255, 255, 0.85)" filter="url(#fumeBlur)">
            <animate attributeName="cy" values="24;8;-2" dur="2.0s" repeatCount="indefinite" />
            <animate attributeName="r" values="10;16;22" dur="2.0s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.85;0.6;0" dur="2.0s" repeatCount="indefinite" />
          </circle>
          {/* Cloud Billow 2 (Center dense puff) */}
          <circle cx="50" cy="14" r="16" fill="rgba(255, 255, 255, 0.9)" filter="url(#fumeBlur)">
            <animate attributeName="cy" values="22;6;-6" dur="1.7s" repeatCount="indefinite" />
            <animate attributeName="r" values="12;18;26" dur="1.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.7;0" dur="1.7s" repeatCount="indefinite" />
          </circle>
          {/* Cloud Billow 3 (Right puff) */}
          <circle cx="64" cy="16" r="13" fill="rgba(255, 255, 255, 0.85)" filter="url(#fumeBlur)">
            <animate attributeName="cy" values="23;7;-3" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="9;15;21" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.85;0.6;0" dur="2.2s" repeatCount="indefinite" />
          </circle>

          {/* Sublimation reaction status banner */}
          <rect x="10" y="-18" width="80" height="15" rx="4" fill="rgba(15, 23, 42, 0.88)" stroke="#38bdf8" strokeWidth="0.8" />
          <text x="50" y="-8" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#38bdf8" fontFamily="var(--font-sans)">
            NH₄Cl Subliming: Solid ➔ Vapours
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
          </text>
        </g>
      )}

      {/* ── Burning Magnesium Dazzling Flash ── */}
      {isBurningMg && (
        <g id="mg-dazzling-burn">
          {/* Blinding white starburst flash */}
          <circle cx="50" cy="30" r="24" fill="rgba(255, 255, 255, 0.95)" filter="url(#starBurstGlow)">
            <animate attributeName="r" values="22;28;22" dur="0.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;1;0.9" dur="0.15s" repeatCount="indefinite" />
          </circle>
          {/* Spark rays */}
          <path d="M 50 2 L 53 27 L 78 30 L 53 33 L 50 58 L 47 33 L 22 30 L 47 27 Z" fill="#ffffff" filter="url(#starBurstGlow)">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="0.2s" repeatCount="indefinite" />
          </path>
          <path d="M 32 12 L 48 28 L 68 12 L 52 32 L 68 48 L 48 32 L 32 48 L 48 28 Z" fill="#e0e7ff" opacity="0.9">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="0.25s" repeatCount="indefinite" />
          </path>

          {/* Burning Mg reaction banner */}
          <rect x="10" y="-18" width="80" height="15" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#f59e0b" strokeWidth="0.8" />
          <text x="50" y="-8" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#fde047" fontFamily="var(--font-sans)">
            ✨ Dazzling Flame: 2Mg + O₂ ➔ 2MgO
            <animate attributeName="opacity" values="0.7;1;0.7" dur="0.6s" repeatCount="indefinite" />
          </text>
        </g>
      )}

      {/* ── China Dish Body (Porcelain Basin) ── */}

      {/* Outer porcelain bowl wall */}
      <path
        d="M 8 28 Q 8 60 50 60 Q 92 60 92 28 Z"
        fill="url(#porcelainGrad)"
        stroke="#94a3b8"
        strokeWidth="1.6"
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
      />

      {/* Dish base foot ring */}
      <ellipse cx="50" cy="59" rx="20" ry="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />

      {/* Inner basin cavity */}
      <ellipse cx="50" cy="28" rx="40" ry="12" fill="url(#basinInnerGrad)" stroke="#cbd5e1" strokeWidth="1" />

      {/* Rim top edge with pouring spout on left */}
      <path
        d="M 5 27 Q 8 26 12 28 Q 50 36 88 28 Q 92 27 95 28 Q 50 16 5 27 Z"
        fill="#ffffff"
        stroke="#94a3b8"
        strokeWidth="0.8"
      />

      {/* Liquid Fill (if used as evaporating dish with solution) */}
      {liquidLevel > 0 && !hasNH4Cl && !hasMgAsh && (
        <path
          d={`M 15 32 Q 15 ${32 + liquidLevel * 18} 50 ${32 + liquidLevel * 18} Q 85 ${32 + liquidLevel * 18} 85 32 Z`}
          fill={liquidColor}
          style={{ transition: 'fill 0.5s ease' }}
        />
      )}

      {/* ── Solid Contents ── */}

      {/* Ammonium Chloride Solid & Sublimate Encrustation */}
      {hasNH4Cl && (
        <g id="nh4cl-solid-and-crystals">
          {/* White crystalline powder layer resting at bottom */}
          <polygon
            points="24,42 76,42 70,55 30,55"
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="0.8"
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
          />
          {/* Crystal grains and texture facets */}
          <circle cx="34" cy="46" r="1.2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.4" />
          <circle cx="42" cy="49" r="1.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.4" />
          <circle cx="50" cy="46" r="1.4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.4" />
          <circle cx="58" cy="48" r="1.6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.4" />
          <circle cx="66" cy="46" r="1.3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.4" />
          <circle cx="46" cy="52" r="1.2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.4" />
          <circle cx="54" cy="52" r="1.3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.4" />

          {/* Sublimate crystalline crust along upper cooler dish rim */}
          <path d="M 12 28 Q 25 31 35 28" stroke="#ffffff" strokeWidth="2" strokeDasharray="1.5,1.5" fill="none" opacity="0.9" />
          <path d="M 65 28 Q 75 31 88 28" stroke="#ffffff" strokeWidth="2" strokeDasharray="1.5,1.5" fill="none" opacity="0.9" />
        </g>
      )}

      {/* White Magnesium Oxide (MgO) Ash Powder Bed */}
      {hasMgAsh && !isBurningMg && (
        <g id="mgo-ash-powder">
          <ellipse cx="50" cy="48" rx="22" ry="7" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
          {/* Powdery fluffy ash mounds and texture */}
          <ellipse cx="44" cy="47" rx="9" ry="4" fill="#ffffff" opacity="0.9" />
          <ellipse cx="56" cy="48" rx="10" ry="4" fill="#ffffff" opacity="0.9" />
          <circle cx="48" cy="49" r="1.5" fill="#94a3b8" opacity="0.5" />
          <circle cx="52" cy="46" r="1.2" fill="#94a3b8" opacity="0.4" />
          <circle cx="41" cy="48" r="1.4" fill="#94a3b8" opacity="0.4" />
          <circle cx="59" cy="49" r="1.3" fill="#94a3b8" opacity="0.4" />
        </g>
      )}

      {/* Porcelain glossy specular light reflection streak */}
      <path
        d="M 16 36 Q 22 52 46 54"
        stroke="rgba(255, 255, 255, 0.75)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {label && (
        <text x="50" y="65" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#64748b" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Watch Glass ──────────────────────────────────────────────────

type LabMagnetDraggableProps = {
  wNum: number;
  hNum: number;
  children: (
    dragOffsetX: number,
    dragOffsetY: number,
    isDragging: boolean,
    listeners: any,
    attributes: any,
    setRef: (node: SVGGElement | null) => void
  ) => React.ReactNode;
};

const LabMagnetDraggable: React.FC<LabMagnetDraggableProps> = ({ wNum, hNum, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'lab-bar-magnet',
  });
  const dragOffsetX = transform ? (transform.x * 100) / wNum : 0;
  const dragOffsetY = transform ? (transform.y * 36) / hNum : 0;
  const setRef = (node: SVGGElement | null) => setNodeRef(node as unknown as HTMLElement);

  return <>{children(dragOffsetX, dragOffsetY, isDragging, listeners, attributes, setRef)}</>;
};

const WatchGlass: React.FC<ApparatusProps> = ({
  id = 'watch-glass',
  highlighted = false,
  width = 126,
  height = 44,
  label,
  flags = {},
  extraProps,
  ...props
}) => {
  const p = props as Record<string, unknown>;
  const dispatch = p.dispatch as React.Dispatch<any> | undefined;
  const isAddingIron = Boolean(
    flags?.isAddingIron ||
    flags?.addingIron ||
    p.isAddingIron ||
    extraProps?.['isAddingIron']
  );

  const isAddingSulphur = Boolean(
    flags?.isAddingSulphur ||
    flags?.addingSulphur ||
    p.isAddingSulphur ||
    extraProps?.['isAddingSulphur']
  );

  const isSeparatingMagnet = Boolean(
    flags?.isSeparatingMagnet ||
    flags?.separatingMagnet ||
    p.isSeparatingMagnet ||
    extraProps?.['isSeparatingMagnet']
  );

  const isReleasingIron = Boolean(
    flags?.isReleasingIron ||
    flags?.releasingIron ||
    p.isReleasingIron ||
    extraProps?.['isReleasingIron']
  );

  const mixtureRestored = Boolean(
    flags?.mixtureRestored ||
    p.mixtureRestored ||
    extraProps?.['mixtureRestored']
  );

  const hasIronSeparated = Boolean(
    (flags?.magnetSeparationComplete ||
    flags?.magnetTestedMix ||
    p.hasIronSeparated ||
    extraProps?.['hasIronSeparated']) &&
    !mixtureRestored
  );

  const showMagneticSeparation = isSeparatingMagnet || hasIronSeparated || isReleasingIron;
  const isDispensing = isAddingIron || isAddingSulphur;

  const canDragMagnet = false;

  const wNum = typeof width === 'number' && width > 0 ? width : 126;
  const hNum = typeof height === 'number' && height > 0 ? height : 44;

  const powderType =
    (p.powderType as string | undefined) ??
    (p.solidType as string | undefined) ??
    (extraProps?.powderType as string | undefined) ??
    (extraProps?.solidType as string | undefined);

  const powderColor =
    (p.powderColor as string | undefined) ??
    (p.solidColor as string | undefined) ??
    (extraProps?.powderColor as string | undefined) ??
    (extraProps?.solidColor as string | undefined);

  const powderLevel =
    typeof p.powderLevel === 'number'
      ? (p.powderLevel as number)
      : typeof p.solidLevel === 'number'
      ? (p.solidLevel as number)
      : typeof extraProps?.['powderLevel'] === 'number'
      ? (extraProps['powderLevel'] as number)
      : 0.55;

  const showPowder = Boolean(
    p.hasPowder ||
    p.hasSolid ||
    extraProps?.['hasPowder'] ||
    extraProps?.['hasSolid'] ||
    powderType ||
    powderColor
  );

  const normType = (powderType || '').toLowerCase().trim();
  const isFeS = normType === 'fes' || normType === 'compound' || normType === 'black' || normType === 'iron-sulphide' || normType === 'iron-sulfide';
  const isIron = (normType === 'iron' || normType === 'iron-filings' || normType === 'fe') && !hasIronSeparated;
  const isSulphur = (normType === 'sulphur' || normType === 'sulfur' || normType === 's' || hasIronSeparated) && !isFeS;
  const isMixture = (normType === 'mixture' || normType === 'fe+s' || normType === 'iron-sulphur' || normType === 'iron-sulfur') && !hasIronSeparated;

  // Determine base fill color
  const defaultFillColor = isIron
    ? '#334155'
    : isSulphur
    ? '#facc15'
    : isMixture
    ? '#ca8a04'
    : isFeS
    ? '#18181b'
    : powderColor || '#e2e8f0';

  const moundTopY = Math.max(9, 18 - 9 * Math.min(1, Math.max(0.1, powderLevel)));

  const renderMagnetVisuals = (isDragging: boolean, isDraggable: boolean) => (
    <>
      {/* Generous hit-box for comfortable cursor/finger grabbing */}
      {isDraggable && (
        <rect
          x="-50"
          y="-90"
          width="100"
          height="125"
          fill="#000000"
          fillOpacity="0.001"
          style={{ cursor: isDragging ? 'grabbing' : 'grab', pointerEvents: 'all' }}
        />
      )}
      {/* Magnet cast shadow on table/dish surface below */}
      <ellipse cx="0" cy="65" rx="30" ry="2.8" fill="rgba(0,0,0,0.08)" />

      {/* ── Metallic Horseshoe Yoke (Arch) ── */}
      <path
        d="M -44 -4 L -44 -30 C -44 -76, 44 -76, 44 -30 L 44 -4 L 22 -4 L 22 -26 C 22 -54, -22 -54, -22 -26 L -22 -4 Z"
        fill={`url(#uMagnetArch-${id || 'def'})`}
        stroke="#475569"
        strokeWidth="1.2"
      />
      {/* Specular highlight along outer curvature */}
      <path
        d="M -41 -30 C -41 -72, 41 -72, 41 -30"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.4"
        fill="none"
      />

      {/* ── North Pole (Red, Left Leg) ── */}
      <rect x="-44" y="-30" width="22" height="26" rx="0.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.9" />
      {/* North Pole Metallic Face Cap */}
      <rect x="-44" y="-4" width="22" height="4" rx="0.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
      {/* 'N' Pole Stamp */}
      <text
        x="-33"
        y="-13"
        textAnchor="middle"
        fontSize="14"
        fontWeight="900"
        fill="#ffffff"
        fontFamily="var(--font-sans, system-ui, sans-serif)"
        filter="drop-shadow(0 1.2px 1.5px rgba(0,0,0,0.6))"
      >
        N
      </text>

      {/* ── South Pole (Blue, Right Leg) ── */}
      <rect x="22" y="-30" width="22" height="26" rx="0.5" fill="#2563eb" stroke="#1e40af" strokeWidth="0.9" />
      {/* South Pole Metallic Face Cap */}
      <rect x="22" y="-4" width="22" height="4" rx="0.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
      {/* 'S' Pole Stamp */}
      <text
        x="33"
        y="-13"
        textAnchor="middle"
        fontSize="14"
        fontWeight="900"
        fill="#ffffff"
        fontFamily="var(--font-sans, system-ui, sans-serif)"
        filter="drop-shadow(0 1.2px 1.5px rgba(0,0,0,0.6))"
      >
        S
      </text>

      {/* ── Final Static Iron Clusters at Poles (only AFTER 3s animation completes and NOT while releasing iron) ── */}
      {hasIronSeparated && !isSeparatingMagnet && !isReleasingIron && (
        <g id="final-pole-clusters">
          {/* North pole cluster (centered at x = -33, y = 0) */}
          <path
            d="M -46 0 Q -42 14 -33 17 Q -24 14 -20 0 Q -26 6 -33 7 Q -40 6 -46 0 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="0.6"
          />
          <line x1="-42" y1="0" x2="-48" y2="12" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-38" y1="0" x2="-41" y2="17" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="-33" y1="0" x2="-33" y2="20" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="-28" y1="0" x2="-25" y2="17" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="-24" y1="0" x2="-18" y2="12" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="-37" cy="10" r="1.3" fill="#94a3b8" />
          <circle cx="-29" cy="12" r="1.1" fill="#cbd5e1" />

          {/* South pole cluster (centered at x = 33, y = 0) */}
          <path
            d="M 20 0 Q 24 14 33 17 Q 42 14 46 0 Q 40 6 33 7 Q 26 6 20 0 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="0.6"
          />
          <line x1="24" y1="0" x2="18" y2="12" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="28" y1="0" x2="25" y2="17" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="33" y1="0" x2="33" y2="20" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="38" y1="0" x2="41" y2="17" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="42" y1="0" x2="48" y2="12" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="29" cy="10" r="1.3" fill="#94a3b8" />
          <circle cx="37" cy="12" r="1.1" fill="#cbd5e1" />

          {/* Inter-pole field line arch */}
          <path d="M -20 2 Q 0 -2 20 2" stroke="#334155" strokeWidth="1.2" strokeDasharray="2.5 2" fill="none" />
        </g>
      )}

      {/* Collapsing pole clusters during iron release */}
      {isReleasingIron && (
        <g id="collapsing-pole-clusters">
          <circle cx="-33" cy="2" r="4" fill="#1e293b">
            <animate attributeName="r" values="4; 1.5; 0" dur="0.25s" fill="freeze" />
            <animate attributeName="opacity" values="1; 0.5; 0" dur="0.25s" fill="freeze" />
          </circle>
          <circle cx="33" cy="2" r="4" fill="#1e293b">
            <animate attributeName="r" values="4; 1.5; 0" dur="0.25s" fill="freeze" />
            <animate attributeName="opacity" values="1; 0.5; 0" dur="0.25s" fill="freeze" />
          </circle>
        </g>
      )}

      {/* ── Action Button: Return Iron to Mixture ── */}
      {hasIronSeparated && !isSeparatingMagnet && !isReleasingIron && !mixtureRestored ? (
        <foreignObject x="-65" y="-124" width="130" height="34" style={{ overflow: 'visible' }}>
          <button
            type="button"
            id="btn-return-iron"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'release-iron-btn' } });
              dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'return-iron-btn' } });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              border: '1.5px solid #93c5fd',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>↩</span>
            <span>Release Iron</span>
          </button>
        </foreignObject>
      ) : (
        /* Scientific separation callout badge */
        <g transform="translate(0, -88)">
          <rect
            x="-44"
            y="0"
            width="88"
            height="12"
            rx="2.5"
            fill="rgba(15, 23, 42, 0.94)"
            stroke={isReleasingIron ? '#22c55e' : '#38bdf8'}
            strokeWidth={0.8}
          />
          <text
            x="0"
            y="8"
            textAnchor="middle"
            fontSize="5.2"
            fontWeight="700"
            fill="#f8fafc"
            fontFamily="var(--font-sans, system-ui, sans-serif)"
          >
            {isReleasingIron
              ? '⬇️ Returning Fe Filings'
              : '🧲 Fe Filings Attracted to Poles'}
          </text>
        </g>
      )}
    </>
  );

  return (
    <svg width={width} height={height} viewBox="0 0 100 36" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        {/* Watch Glass Shadow / Glow */}
        {highlighted && (
          <filter id={`wgGlow-${id || 'def'}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#3b82f6" floodOpacity="0.7" />
          </filter>
        )}

        {/* Horseshoe Magnet Arch Gradient */}
        <linearGradient id={`uMagnetArch-${id || 'def'}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="35%" stopColor="#94a3b8" />
          <stop offset="70%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Powder mound gradients */}
        <linearGradient id={`wgIronGrad-${id || 'def'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        <linearGradient id={`wgSulphurGrad-${id || 'def'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        <linearGradient id={`wgMixtureGrad-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="18%" stopColor="#334155" />
          <stop offset="38%" stopColor="#eab308" />
          <stop offset="58%" stopColor="#1e293b" />
          <stop offset="78%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        <linearGradient id={`wgFeSGrad-${id || 'def'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#27272a" />
          <stop offset="60%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>
      </defs>

      {/* Caustic Contact Shadow Underneath (where dish sits on pan) */}
      <ellipse cx="50" cy="31" rx="36" ry="2.5" fill="rgba(0,0,0,0.12)" />

      {/* ── Concave Glass Basin (Back Wall) ── */}
      <path
        d="M 8 10 C 8 30.5, 92 30.5, 92 10"
        stroke={highlighted ? '#2563eb' : '#94a3b8'}
        strokeWidth="1.4"
        fill="rgba(224, 242, 254, 0.22)"
        filter={highlighted ? `url(#wgGlow-${id || 'def'})` : undefined}
      />
      <path
        d="M 10 11.5 C 10 29, 90 29, 90 11.5"
        fill="rgba(241, 245, 249, 0.15)"
      />

      {/* ── Active Reagent Deposit Animation (Tilted Reagent Container + Granular Cascade) ── */}
      {isDispensing && (
        <g id={`wg-dispensing-${id || 'def'}`}>
          {/* Tilted Glass Reagent Jar hovering above watch glass mouth */}
          <g id="tilted-reagent-jar" transform="translate(56, 3) rotate(-130)">
            {/* Jar Glass Body */}
            <rect
              x="-8.5"
              y="6"
              width="17"
              height="20"
              rx="3"
              fill="rgba(241, 245, 249, 0.3)"
              stroke="#64748b"
              strokeWidth="0.9"
            />
            {/* Neck & Mouth Lip */}
            <path
              d="M -4 0 L -4 6 L 4 6 L 4 0"
              fill="rgba(241, 245, 249, 0.3)"
              stroke="#64748b"
              strokeWidth="0.9"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="4.5"
              ry="1.4"
              fill="rgba(224, 242, 254, 0.45)"
              stroke="#475569"
              strokeWidth="0.8"
            />

            {/* Reagent powder inside jar tilted toward mouth */}
            <path
              d="M -7 18 Q 0 14 7 8 L 7 24 L -7 24 Z"
              fill={isAddingIron ? '#334155' : '#facc15'}
            />
            {isAddingIron ? (
              <>
                <circle cx="2" cy="14" r="0.8" fill="#94a3b8" />
                <circle cx="-2" cy="20" r="0.9" fill="#1e293b" />
                <circle cx="4" cy="18" r="0.7" fill="#cbd5e1" />
              </>
            ) : (
              <>
                <circle cx="2" cy="14" r="0.8" fill="#fef08a" />
                <circle cx="-2" cy="20" r="0.9" fill="#ca8a04" />
                <circle cx="4" cy="18" r="0.7" fill="#fef9c3" />
              </>
            )}

            {/* Upright horizontal label plaque on jar */}
            <g transform="translate(0, 16) rotate(130)">
              <rect
                x="-8.5"
                y="-4.5"
                width="17"
                height="9"
                rx="1.5"
                fill="#ffffff"
                stroke="#94a3b8"
                strokeWidth="0.6"
              />
              <text
                x="0"
                y="1.8"
                textAnchor="middle"
                fontSize="3.6"
                fontWeight="700"
                fill={isAddingIron ? '#0f172a' : '#854d0e'}
                fontFamily="var(--font-sans, system-ui, sans-serif)"
              >
                {isAddingIron ? 'Fe (7g)' : 'S (4g)'}
              </text>
            </g>

            {/* Specular highlight streak on glass */}
            <line
              x1="-6.5"
              y1="8"
              x2="-6.5"
              y2="23"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>

          {/* Granular cascade pouring from container mouth into dish bowl */}
          {isAddingIron && (
            <g id="falling-iron-cascade">
              <circle cx="56" cy="4" r="1.3" fill="#1e293b">
                <animate attributeName="cy" values="3;20" dur="0.32s" repeatCount="indefinite" />
                <animate attributeName="cx" values="56;49" dur="0.32s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.32s" repeatCount="indefinite" />
              </circle>
              <circle cx="57" cy="5" r="1.1" fill="#475569">
                <animate attributeName="cy" values="4;22" dur="0.28s" begin="0.06s" repeatCount="indefinite" />
                <animate attributeName="cx" values="57;51" dur="0.28s" begin="0.06s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.28s" begin="0.06s" repeatCount="indefinite" />
              </circle>
              <circle cx="55" cy="4" r="1.4" fill="#334155">
                <animate attributeName="cy" values="3;21" dur="0.35s" begin="0.12s" repeatCount="indefinite" />
                <animate attributeName="cx" values="55;47" dur="0.35s" begin="0.12s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.35s" begin="0.12s" repeatCount="indefinite" />
              </circle>
              <circle cx="56.5" cy="5" r="1.0" fill="#94a3b8">
                <animate attributeName="cy" values="4;23" dur="0.3s" begin="0.18s" repeatCount="indefinite" />
                <animate attributeName="cx" values="56.5;53" dur="0.3s" begin="0.18s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.3s" begin="0.18s" repeatCount="indefinite" />
              </circle>
              <circle cx="55.5" cy="4.5" r="1.2" fill="#1e293b">
                <animate attributeName="cy" values="4;20" dur="0.34s" begin="0.22s" repeatCount="indefinite" />
                <animate attributeName="cx" values="55.5;48" dur="0.34s" begin="0.22s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.34s" begin="0.22s" repeatCount="indefinite" />
              </circle>
              <circle cx="57.5" cy="5" r="0.9" fill="#cbd5e1">
                <animate attributeName="cy" values="5;21" dur="0.27s" begin="0.1s" repeatCount="indefinite" />
                <animate attributeName="cx" values="57.5;52" dur="0.27s" begin="0.1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.27s" begin="0.1s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {isAddingSulphur && (
            <g id="falling-sulphur-cascade">
              <circle cx="56" cy="4" r="1.3" fill="#facc15">
                <animate attributeName="cy" values="3;18" dur="0.32s" repeatCount="indefinite" />
                <animate attributeName="cx" values="56;49" dur="0.32s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.32s" repeatCount="indefinite" />
              </circle>
              <circle cx="57" cy="5" r="1.1" fill="#eab308">
                <animate attributeName="cy" values="4;20" dur="0.28s" begin="0.06s" repeatCount="indefinite" />
                <animate attributeName="cx" values="57;51" dur="0.28s" begin="0.06s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.28s" begin="0.06s" repeatCount="indefinite" />
              </circle>
              <circle cx="55" cy="4" r="1.4" fill="#fef08a">
                <animate attributeName="cy" values="3;19" dur="0.35s" begin="0.12s" repeatCount="indefinite" />
                <animate attributeName="cx" values="55;47" dur="0.35s" begin="0.12s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.35s" begin="0.12s" repeatCount="indefinite" />
              </circle>
              <circle cx="56.5" cy="5" r="1.0" fill="#ca8a04">
                <animate attributeName="cy" values="4;21" dur="0.3s" begin="0.18s" repeatCount="indefinite" />
                <animate attributeName="cx" values="56.5;53" dur="0.3s" begin="0.18s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.3s" begin="0.18s" repeatCount="indefinite" />
              </circle>
              <circle cx="55.5" cy="4.5" r="1.2" fill="#facc15">
                <animate attributeName="cy" values="4;19" dur="0.34s" begin="0.22s" repeatCount="indefinite" />
                <animate attributeName="cx" values="55.5;48" dur="0.34s" begin="0.22s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.34s" begin="0.22s" repeatCount="indefinite" />
              </circle>
              <circle cx="57.5" cy="5" r="0.9" fill="#fef9c3">
                <animate attributeName="cy" values="5;20" dur="0.27s" begin="0.1s" repeatCount="indefinite" />
                <animate attributeName="cx" values="57.5;52" dur="0.27s" begin="0.1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;1;1;0" keyTimes="0;0.1;0.85;1" dur="0.27s" begin="0.1s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Initial accumulating mound deposit inside bowl for iron */}
          {isAddingIron && !showPowder && (
            <g id="initial-accumulating-deposit">
              <path
                d="M 36 21 Q 50 17 64 21 Q 50 25 36 21 Z"
                fill={`url(#wgIronGrad-${id || 'def'})`}
                stroke="#1e293b"
                strokeWidth="0.5"
              >
                <animate
                  attributeName="d"
                  values="M 44 23 Q 50 21 56 23 Q 50 24.5 44 23 Z; M 36 21 Q 50 17 64 21 Q 50 25 36 21 Z"
                  dur="0.5s"
                  fill="freeze"
                />
              </path>
              <circle cx="48" cy="20" r="0.9" fill="#94a3b8" />
              <circle cx="52" cy="19" r="1.0" fill="#f8fafc" />
              <circle cx="45" cy="21" r="0.8" fill="#64748b" />
              <circle cx="54" cy="21" r="0.9" fill="#cbd5e1" />
            </g>
          )}
        </g>
      )}

      {/* ── Active Magnetic Separation & Suspended Magnet Display ── */}
      {showMagneticSeparation && (
        <g id={`wg-magnet-separation-${id || 'def'}`}>
          {/* ═══ Large Horseshoe Magnet — hovering with ~70px clear air gap above watch glass ═══ */}
          {canDragMagnet ? (
            <LabMagnetDraggable wNum={wNum} hNum={hNum}>
              {(dragOffsetX, dragOffsetY, isDragging, listeners, attributes, setRef) => (
                <g
                  id="suspended-horseshoe-magnet"
                  ref={setRef}
                  {...listeners}
                  {...attributes}
                  transform={`translate(${50 + dragOffsetX}, ${-45 + dragOffsetY})`}
                  style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    filter: isDragging
                      ? 'drop-shadow(0 14px 28px rgba(37, 99, 235, 0.45))'
                      : 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))',
                    transition: isDragging ? 'none' : 'transform 0.2s ease',
                  }}
                >
                  {renderMagnetVisuals(isDragging, true)}
                </g>
              )}
            </LabMagnetDraggable>
          ) : (
            <g
              id="suspended-horseshoe-magnet"
              transform="translate(50, -45)"
              style={{ transition: 'transform 0.2s ease' }}
            >
              {renderMagnetVisuals(false, false)}
            </g>
          )}

          {/* ═══ TRAVELING IRON PARTICLES — Visible flight through ~70px air gap ═══ */}
          {/*
            Pole tip coordinates in WatchGlass space:
              North pole center: x = 50 + (-33) = 17,  y = -45
              South pole center: x = 50 + (33)  = 83,  y = -45
            Dish powder surface: y ≈ 17–22
            Total vertical travel through air: ~62–67 units (~78–84 screen pixels!)
          */}
          {isSeparatingMagnet && (
            <g id="traveling-iron-particles">
              {/* ─── PHASE 1: First responders lift off (begin 0.45s–0.7s) ─── */}

              {/* N1: Center-left liftoff */}
              <circle cx="40" cy="18" r="2.6" fill="#0f172a">
                <animate attributeName="cx" values="40; 35; 26; 17" keyTimes="0; 0.3; 0.7; 1" dur="1.45s" begin="0.45s" fill="freeze" />
                <animate attributeName="cy" values="18; 4; -22; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.45s" begin="0.45s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.45s" begin="0.45s" fill="freeze" />
              </circle>

              {/* S1: Center-right liftoff */}
              <circle cx="60" cy="18" r="2.6" fill="#0f172a">
                <animate attributeName="cx" values="60; 65; 74; 83" keyTimes="0; 0.3; 0.7; 1" dur="1.45s" begin="0.45s" fill="freeze" />
                <animate attributeName="cy" values="18; 4; -22; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.45s" begin="0.45s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.45s" begin="0.45s" fill="freeze" />
              </circle>

              {/* N2: Mid-left liftoff */}
              <circle cx="28" cy="19" r="2.4" fill="#1e293b">
                <animate attributeName="cx" values="28; 25; 20; 15" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.6s" fill="freeze" />
                <animate attributeName="cy" values="19; 5; -20; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.6s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.4s" begin="0.6s" fill="freeze" />
              </circle>

              {/* S2: Mid-right liftoff */}
              <circle cx="72" cy="19" r="2.4" fill="#1e293b">
                <animate attributeName="cx" values="72; 75; 80; 85" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.6s" fill="freeze" />
                <animate attributeName="cy" values="19; 5; -20; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.6s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.4s" begin="0.6s" fill="freeze" />
              </circle>

              {/* ─── PHASE 2: Main stream of particles rising through air (begin 0.8s–1.6s) ─── */}

              {/* N3: Deep dish needle sliver */}
              <line x1="38" y1="20" x2="41" y2="22" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round">
                <animate attributeName="x1" values="38; 32; 22; 15" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.8s" fill="freeze" />
                <animate attributeName="x2" values="41; 35; 25; 18" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.8s" fill="freeze" />
                <animate attributeName="y1" values="20; 5; -20; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.8s" fill="freeze" />
                <animate attributeName="y2" values="22; 7; -18; -42" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.8s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.4s" begin="0.8s" fill="freeze" />
              </line>

              {/* S3: Deep dish needle sliver */}
              <line x1="62" y1="20" x2="59" y2="22" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round">
                <animate attributeName="x1" values="62; 68; 78; 85" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.8s" fill="freeze" />
                <animate attributeName="x2" values="59; 65; 75; 82" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.8s" fill="freeze" />
                <animate attributeName="y1" values="20; 5; -20; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.8s" fill="freeze" />
                <animate attributeName="y2" values="22; 7; -18; -42" keyTimes="0; 0.3; 0.7; 1" dur="1.4s" begin="0.8s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.4s" begin="0.8s" fill="freeze" />
              </line>

              {/* N4: Large central filing */}
              <circle cx="44" cy="21" r="2.8" fill="#0f172a">
                <animate attributeName="cx" values="44; 37; 27; 19" keyTimes="0; 0.3; 0.7; 1" dur="1.35s" begin="0.95s" fill="freeze" />
                <animate attributeName="cy" values="21; 6; -19; -44" keyTimes="0; 0.3; 0.7; 1" dur="1.35s" begin="0.95s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.35s" begin="0.95s" fill="freeze" />
              </circle>

              {/* S4: Large central filing */}
              <circle cx="56" cy="21" r="2.8" fill="#0f172a">
                <animate attributeName="cx" values="56; 63; 73; 81" keyTimes="0; 0.3; 0.7; 1" dur="1.35s" begin="0.95s" fill="freeze" />
                <animate attributeName="cy" values="21; 6; -19; -44" keyTimes="0; 0.3; 0.7; 1" dur="1.35s" begin="0.95s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.35s" begin="0.95s" fill="freeze" />
              </circle>

              {/* N5: Outer left filing */}
              <circle cx="22" cy="18" r="2.5" fill="#1e293b">
                <animate attributeName="cx" values="22; 20; 16; 13" keyTimes="0; 0.3; 0.7; 1" dur="1.3s" begin="1.1s" fill="freeze" />
                <animate attributeName="cy" values="18; 4; -21; -44" keyTimes="0; 0.3; 0.7; 1" dur="1.3s" begin="1.1s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.3s" begin="1.1s" fill="freeze" />
              </circle>

              {/* S5: Outer right filing */}
              <circle cx="78" cy="18" r="2.5" fill="#1e293b">
                <animate attributeName="cx" values="78; 80; 84; 87" keyTimes="0; 0.3; 0.7; 1" dur="1.3s" begin="1.1s" fill="freeze" />
                <animate attributeName="cy" values="18; 4; -21; -44" keyTimes="0; 0.3; 0.7; 1" dur="1.3s" begin="1.1s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.3s" begin="1.1s" fill="freeze" />
              </circle>

              {/* N6: Metallic glint particle */}
              <circle cx="34" cy="19" r="2.0" fill="#cbd5e1">
                <animate attributeName="cx" values="34; 29; 22; 17" keyTimes="0; 0.3; 0.7; 1" dur="1.25s" begin="1.25s" fill="freeze" />
                <animate attributeName="cy" values="19; 5; -20; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.25s" begin="1.25s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.25s" begin="1.25s" fill="freeze" />
              </circle>

              {/* S6: Metallic glint particle */}
              <circle cx="66" cy="19" r="2.0" fill="#cbd5e1">
                <animate attributeName="cx" values="66; 71; 78; 83" keyTimes="0; 0.3; 0.7; 1" dur="1.25s" begin="1.25s" fill="freeze" />
                <animate attributeName="cy" values="19; 5; -20; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.25s" begin="1.25s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.25s" begin="1.25s" fill="freeze" />
              </circle>

              {/* N7: Cross-over from center-right to North pole */}
              <circle cx="48" cy="17" r="2.4" fill="#0f172a">
                <animate attributeName="cx" values="48; 40; 28; 18" keyTimes="0; 0.3; 0.7; 1" dur="1.25s" begin="1.4s" fill="freeze" />
                <animate attributeName="cy" values="17; 3; -22; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.25s" begin="1.4s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.25s" begin="1.4s" fill="freeze" />
              </circle>

              {/* S7: Cross-over from center-left to South pole */}
              <circle cx="52" cy="17" r="2.4" fill="#0f172a">
                <animate attributeName="cx" values="52; 60; 72; 82" keyTimes="0; 0.3; 0.7; 1" dur="1.25s" begin="1.4s" fill="freeze" />
                <animate attributeName="cy" values="17; 3; -22; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.25s" begin="1.4s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.25s" begin="1.4s" fill="freeze" />
              </circle>

              {/* N8: Needle sliver */}
              <line x1="30" y1="21" x2="33" y2="23" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round">
                <animate attributeName="x1" values="30; 25; 18; 12" keyTimes="0; 0.3; 0.7; 1" dur="1.2s" begin="1.55s" fill="freeze" />
                <animate attributeName="x2" values="33; 28; 21; 15" keyTimes="0; 0.3; 0.7; 1" dur="1.2s" begin="1.55s" fill="freeze" />
                <animate attributeName="y1" values="21; 6; -19; -44" keyTimes="0; 0.3; 0.7; 1" dur="1.2s" begin="1.55s" fill="freeze" />
                <animate attributeName="y2" values="23; 8; -17; -41" keyTimes="0; 0.3; 0.7; 1" dur="1.2s" begin="1.55s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.2s" begin="1.55s" fill="freeze" />
              </line>

              {/* S8: Needle sliver */}
              <line x1="70" y1="21" x2="67" y2="23" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round">
                <animate attributeName="x1" values="70; 75; 82; 88" keyTimes="0; 0.3; 0.7; 1" dur="1.2s" begin="1.55s" fill="freeze" />
                <animate attributeName="x2" values="67; 72; 79; 85" keyTimes="0; 0.3; 0.7; 1" dur="1.2s" begin="1.55s" fill="freeze" />
                <animate attributeName="y1" values="21; 6; -19; -44" keyTimes="0; 0.3; 0.7; 1" dur="1.2s" begin="1.55s" fill="freeze" />
                <animate attributeName="y2" values="23; 8; -17; -41" keyTimes="0; 0.3; 0.7; 1" dur="1.2s" begin="1.55s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.2s" begin="1.55s" fill="freeze" />
              </line>

              {/* ─── PHASE 3: Late sweep & stragglers completing the brush (begin 1.7s–2.1s) ─── */}

              {/* N9: Deep bottom bowl straggler */}
              <circle cx="42" cy="22" r="2.3" fill="#0f172a">
                <animate attributeName="cx" values="42; 34; 24; 16" keyTimes="0; 0.3; 0.7; 1" dur="1.1s" begin="1.7s" fill="freeze" />
                <animate attributeName="cy" values="22; 6; -19; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.1s" begin="1.7s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.1s" begin="1.7s" fill="freeze" />
              </circle>

              {/* S9: Deep bottom bowl straggler */}
              <circle cx="58" cy="22" r="2.3" fill="#0f172a">
                <animate attributeName="cx" values="58; 66; 76; 84" keyTimes="0; 0.3; 0.7; 1" dur="1.1s" begin="1.7s" fill="freeze" />
                <animate attributeName="cy" values="22; 6; -19; -45" keyTimes="0; 0.3; 0.7; 1" dur="1.1s" begin="1.7s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.1s" begin="1.7s" fill="freeze" />
              </circle>

              {/* N10: Left rim straggler */}
              <circle cx="26" cy="18" r="2.1" fill="#334155">
                <animate attributeName="cx" values="26; 22; 17; 14" keyTimes="0; 0.3; 0.7; 1" dur="1.0s" begin="1.85s" fill="freeze" />
                <animate attributeName="cy" values="18; 3; -21; -44" keyTimes="0; 0.3; 0.7; 1" dur="1.0s" begin="1.85s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.0s" begin="1.85s" fill="freeze" />
              </circle>

              {/* S10: Right rim straggler */}
              <circle cx="74" cy="18" r="2.1" fill="#334155">
                <animate attributeName="cx" values="74; 78; 83; 86" keyTimes="0; 0.3; 0.7; 1" dur="1.0s" begin="1.85s" fill="freeze" />
                <animate attributeName="cy" values="18; 3; -21; -44" keyTimes="0; 0.3; 0.7; 1" dur="1.0s" begin="1.85s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="1.0s" begin="1.85s" fill="freeze" />
              </circle>

              {/* N11: Final glint particle */}
              <circle cx="36" cy="17" r="1.8" fill="#f8fafc">
                <animate attributeName="cx" values="36; 30; 23; 17" keyTimes="0; 0.3; 0.7; 1" dur="0.95s" begin="2.0s" fill="freeze" />
                <animate attributeName="cy" values="17; 3; -21; -45" keyTimes="0; 0.3; 0.7; 1" dur="0.95s" begin="2.0s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="0.95s" begin="2.0s" fill="freeze" />
              </circle>

              {/* S11: Final glint particle */}
              <circle cx="64" cy="17" r="1.8" fill="#f8fafc">
                <animate attributeName="cx" values="64; 70; 77; 83" keyTimes="0; 0.3; 0.7; 1" dur="0.95s" begin="2.0s" fill="freeze" />
                <animate attributeName="cy" values="17; 3; -21; -45" keyTimes="0; 0.3; 0.7; 1" dur="0.95s" begin="2.0s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="0.95s" begin="2.0s" fill="freeze" />
              </circle>

              {/* N12: Final brush needle */}
              <line x1="34" y1="20" x2="37" y2="22" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round">
                <animate attributeName="x1" values="34; 28; 21; 16" keyTimes="0; 0.3; 0.7; 1" dur="0.85s" begin="2.1s" fill="freeze" />
                <animate attributeName="x2" values="37; 31; 24; 19" keyTimes="0; 0.3; 0.7; 1" dur="0.85s" begin="2.1s" fill="freeze" />
                <animate attributeName="y1" values="20; 5; -20; -45" keyTimes="0; 0.3; 0.7; 1" dur="0.85s" begin="2.1s" fill="freeze" />
                <animate attributeName="y2" values="22; 7; -18; -42" keyTimes="0; 0.3; 0.7; 1" dur="0.85s" begin="2.1s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="0.85s" begin="2.1s" fill="freeze" />
              </line>

              {/* S12: Final brush needle */}
              <line x1="66" y1="20" x2="63" y2="22" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round">
                <animate attributeName="x1" values="66; 72; 79; 84" keyTimes="0; 0.3; 0.7; 1" dur="0.85s" begin="2.1s" fill="freeze" />
                <animate attributeName="x2" values="63; 69; 76; 81" keyTimes="0; 0.3; 0.7; 1" dur="0.85s" begin="2.1s" fill="freeze" />
                <animate attributeName="y1" values="20; 5; -20; -45" keyTimes="0; 0.3; 0.7; 1" dur="0.85s" begin="2.1s" fill="freeze" />
                <animate attributeName="y2" values="22; 7; -18; -42" keyTimes="0; 0.3; 0.7; 1" dur="0.85s" begin="2.1s" fill="freeze" />
                <animate attributeName="opacity" values="0; 1; 1; 1" keyTimes="0; 0.08; 0.9; 1" dur="0.85s" begin="2.1s" fill="freeze" />
              </line>
            </g>
          )}

          {/* ═══ RELEASING IRON PARTICLES — Cascading downward through ~70px air gap into the dish basin ═══ */}
          {isReleasingIron && (
            <g id="releasing-iron-cascade">
              {/* ── North pole particle releases (detaching from x ≈ 17, y ≈ -45) ── */}
              {/* N1: Fast dropping central-left grain */}
              <circle cx="17" cy="-45" r="2.5" fill="#0f172a">
                <animate attributeName="cx" values="17; 22; 30; 36" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.05s" fill="freeze" />
                <animate attributeName="cy" values="-45; -20; 4; 18" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.05s" fill="freeze" />
                <animate attributeName="opacity" values="1; 1; 1; 1" dur="0.85s" begin="0.05s" fill="freeze" />
              </circle>

              {/* N2: Outer-left dropping grain */}
              <circle cx="15" cy="-45" r="2.3" fill="#1e293b">
                <animate attributeName="cx" values="15; 17; 22; 26" keyTimes="0; 0.25; 0.65; 1" dur="0.8s" begin="0.12s" fill="freeze" />
                <animate attributeName="cy" values="-45; -18; 5; 19" keyTimes="0; 0.25; 0.65; 1" dur="0.8s" begin="0.12s" fill="freeze" />
                <animate attributeName="opacity" values="1; 1; 1; 1" dur="0.8s" begin="0.12s" fill="freeze" />
              </circle>

              {/* N3: Deep center-dish dropping grain */}
              <circle cx="19" cy="-45" r="2.7" fill="#0f172a">
                <animate attributeName="cx" values="19; 26; 36; 44" keyTimes="0; 0.25; 0.65; 1" dur="0.9s" begin="0.18s" fill="freeze" />
                <animate attributeName="cy" values="-45; -22; 3; 21" keyTimes="0; 0.25; 0.65; 1" dur="0.9s" begin="0.18s" fill="freeze" />
                <animate attributeName="opacity" values="1; 1; 1; 1" dur="0.9s" begin="0.18s" fill="freeze" />
              </circle>

              {/* N4: Needle sliver tumbling downward */}
              <line x1="16" y1="-45" x2="19" y2="-43" stroke="#0f172a" strokeWidth="1.7" strokeLinecap="round">
                <animate attributeName="x1" values="16; 22; 29; 34" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.22s" fill="freeze" />
                <animate attributeName="x2" values="19; 25; 32; 37" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.22s" fill="freeze" />
                <animate attributeName="y1" values="-45; -20; 5; 20" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.22s" fill="freeze" />
                <animate attributeName="y2" values="-43; -18; 7; 22" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.22s" fill="freeze" />
              </line>

              {/* N5: Metallic glint particle */}
              <circle cx="18" cy="-45" r="1.8" fill="#cbd5e1">
                <animate attributeName="cx" values="18; 24; 32; 40" keyTimes="0; 0.25; 0.65; 1" dur="0.8s" begin="0.28s" fill="freeze" />
                <animate attributeName="cy" values="-45; -20; 4; 18" keyTimes="0; 0.25; 0.65; 1" dur="0.8s" begin="0.28s" fill="freeze" />
              </circle>

              {/* N6: Far rim dropping grain */}
              <circle cx="14" cy="-45" r="2.1" fill="#334155">
                <animate attributeName="cx" values="14; 16; 19; 22" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.32s" fill="freeze" />
                <animate attributeName="cy" values="-45; -18; 3; 17" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.32s" fill="freeze" />
              </circle>

              {/* N7: Central crossover particle landing near x = 48 */}
              <circle cx="17" cy="-45" r="2.4" fill="#0f172a">
                <animate attributeName="cx" values="17; 26; 38; 48" keyTimes="0; 0.25; 0.65; 1" dur="0.9s" begin="0.35s" fill="freeze" />
                <animate attributeName="cy" values="-45; -20; 3; 22" keyTimes="0; 0.25; 0.65; 1" dur="0.9s" begin="0.35s" fill="freeze" />
              </circle>

              {/* N8: Late needle sliver */}
              <line x1="17" y1="-45" x2="20" y2="-43" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round">
                <animate attributeName="x1" values="17; 21; 26; 30" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.42s" fill="freeze" />
                <animate attributeName="x2" values="20; 24; 29; 33" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.42s" fill="freeze" />
                <animate attributeName="y1" values="-45; -20; 4; 21" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.42s" fill="freeze" />
                <animate attributeName="y2" values="-43; -18; 6; 23" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.42s" fill="freeze" />
              </line>

              {/* ── South pole particle releases (detaching from x ≈ 83, y ≈ -45) ── */}
              {/* S1: Fast dropping central-right grain */}
              <circle cx="83" cy="-45" r="2.5" fill="#0f172a">
                <animate attributeName="cx" values="83; 78; 70; 64" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.05s" fill="freeze" />
                <animate attributeName="cy" values="-45; -20; 4; 18" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.05s" fill="freeze" />
              </circle>

              {/* S2: Outer-right dropping grain */}
              <circle cx="85" cy="-45" r="2.3" fill="#1e293b">
                <animate attributeName="cx" values="85; 83; 78; 74" keyTimes="0; 0.25; 0.65; 1" dur="0.8s" begin="0.12s" fill="freeze" />
                <animate attributeName="cy" values="-45; -18; 5; 19" keyTimes="0; 0.25; 0.65; 1" dur="0.8s" begin="0.12s" fill="freeze" />
              </circle>

              {/* S3: Deep center-dish dropping grain */}
              <circle cx="81" cy="-45" r="2.7" fill="#0f172a">
                <animate attributeName="cx" values="81; 74; 64; 56" keyTimes="0; 0.25; 0.65; 1" dur="0.9s" begin="0.18s" fill="freeze" />
                <animate attributeName="cy" values="-45; -22; 3; 21" keyTimes="0; 0.25; 0.65; 1" dur="0.9s" begin="0.18s" fill="freeze" />
              </circle>

              {/* S4: Needle sliver tumbling downward */}
              <line x1="84" y1="-45" x2="81" y2="-43" stroke="#0f172a" strokeWidth="1.7" strokeLinecap="round">
                <animate attributeName="x1" values="84; 78; 71; 66" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.22s" fill="freeze" />
                <animate attributeName="x2" values="81; 75; 68; 63" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.22s" fill="freeze" />
                <animate attributeName="y1" values="-45; -20; 5; 20" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.22s" fill="freeze" />
                <animate attributeName="y2" values="-43; -18; 7; 22" keyTimes="0; 0.25; 0.65; 1" dur="0.85s" begin="0.22s" fill="freeze" />
              </line>

              {/* S5: Metallic glint particle */}
              <circle cx="82" cy="-45" r="1.8" fill="#cbd5e1">
                <animate attributeName="cx" values="82; 76; 68; 60" keyTimes="0; 0.25; 0.65; 1" dur="0.8s" begin="0.28s" fill="freeze" />
                <animate attributeName="cy" values="-45; -20; 4; 18" keyTimes="0; 0.25; 0.65; 1" dur="0.8s" begin="0.28s" fill="freeze" />
              </circle>

              {/* S6: Far rim dropping grain */}
              <circle cx="86" cy="-45" r="2.1" fill="#334155">
                <animate attributeName="cx" values="86; 84; 81; 78" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.32s" fill="freeze" />
                <animate attributeName="cy" values="-45; -18; 3; 17" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.32s" fill="freeze" />
              </circle>

              {/* S7: Central crossover particle landing near x = 52 */}
              <circle cx="83" cy="-45" r="2.4" fill="#0f172a">
                <animate attributeName="cx" values="83; 74; 62; 52" keyTimes="0; 0.25; 0.65; 1" dur="0.9s" begin="0.35s" fill="freeze" />
                <animate attributeName="cy" values="-45; -20; 3; 22" keyTimes="0; 0.25; 0.65; 1" dur="0.9s" begin="0.35s" fill="freeze" />
              </circle>

              {/* S8: Late needle sliver */}
              <line x1="83" y1="-45" x2="80" y2="-43" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round">
                <animate attributeName="x1" values="83; 79; 74; 70" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.42s" fill="freeze" />
                <animate attributeName="x2" values="80; 76; 71; 67" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.42s" fill="freeze" />
                <animate attributeName="y1" values="-45; -20; 4; 21" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.42s" fill="freeze" />
                <animate attributeName="y2" values="-43; -18; 6; 23" keyTimes="0; 0.25; 0.65; 1" dur="0.75s" begin="0.42s" fill="freeze" />
              </line>

              {/* Central landing sparkles / dust puffs when particles hit powder surface */}
              <circle cx="36" cy="18" r="1.5" fill="#f8fafc" opacity="0">
                <animate attributeName="opacity" values="0; 0.8; 0" keyTimes="0; 0.5; 1" dur="0.35s" begin="0.75s" fill="freeze" />
                <animate attributeName="r" values="1.5; 3.5" dur="0.35s" begin="0.75s" fill="freeze" />
              </circle>
              <circle cx="64" cy="18" r="1.5" fill="#f8fafc" opacity="0">
                <animate attributeName="opacity" values="0; 0.8; 0" keyTimes="0; 0.5; 1" dur="0.35s" begin="0.75s" fill="freeze" />
                <animate attributeName="r" values="1.5; 3.5" dur="0.35s" begin="0.75s" fill="freeze" />
              </circle>
              <circle cx="50" cy="21" r="1.5" fill="#cbd5e1" opacity="0">
                <animate attributeName="opacity" values="0; 0.8; 0" keyTimes="0; 0.5; 1" dur="0.35s" begin="0.95s" fill="freeze" />
                <animate attributeName="r" values="1.5; 4.0" dur="0.35s" begin="0.95s" fill="freeze" />
              </circle>
            </g>
          )}
        </g>
      )}

      {/* ── Powder / Solid Mass (Contained inside broad concave glass basin) ── */}
      {showPowder && (
        <g id={`wg-powder-${id || 'def'}`}>
          {/* Main Heap Mound */}
          {isMixture ? (
            <>
              {/* Sulphur Yellow Base — always visible, never moves */}
              <path
                d={`M 18 16 Q 50 ${moundTopY} 82 16 Q 50 28.5 18 16 Z`}
                fill={`url(#wgSulphurGrad-${id || 'def'})`}
                stroke="#ca8a04"
                strokeWidth="0.5"
              />
              {/* Iron layer on top of Sulphur — fades away over 3s during separation */}
              <path
                d={`M 18 16 Q 50 ${moundTopY} 82 16 Q 50 28.5 18 16 Z`}
                fill={`url(#wgIronGrad-${id || 'def'})`}
                stroke="#1e293b"
                strokeWidth="0.5"
                opacity={0.75}
              >
                {isSeparatingMagnet && (
                  <animate
                    attributeName="opacity"
                    values="0.75; 0.75; 0.4; 0.1; 0"
                    keyTimes="0; 0.13; 0.4; 0.7; 1"
                    dur="3s"
                    fill="freeze"
                  />
                )}
              </path>
            </>
          ) : (
            <path
              d={`M 18 16 Q 50 ${moundTopY} 82 16 Q 50 28.5 18 16 Z`}
              fill={
                isIron
                  ? `url(#wgIronGrad-${id || 'def'})`
                  : isSulphur
                  ? `url(#wgSulphurGrad-${id || 'def'})`
                  : isFeS
                  ? `url(#wgFeSGrad-${id || 'def'})`
                  : defaultFillColor
              }
              stroke={isIron ? '#1e293b' : isSulphur ? '#ca8a04' : isFeS ? '#09090b' : 'rgba(0,0,0,0.15)'}
              strokeWidth="0.5"
            >
              {isIron && (
                <animate
                  attributeName="opacity"
                  values="0.5; 1"
                  dur="0.25s"
                  fill="freeze"
                />
              )}
            </path>
          )}

          {/* Returning Iron Layer accumulating over Sulphur base as particles fall */}
          {isSulphur && isReleasingIron && (
            <path
              d={`M 18 16 Q 50 ${moundTopY} 82 16 Q 50 28.5 18 16 Z`}
              fill={`url(#wgIronGrad-${id || 'def'})`}
              stroke="#1e293b"
              strokeWidth="0.5"
              opacity={0}
            >
              <animate
                attributeName="opacity"
                values="0; 0.1; 0.45; 0.75"
                keyTimes="0; 0.3; 0.65; 1"
                dur="1.2s"
                fill="freeze"
              />
            </path>
          )}

          {/* Granule & Particle Highlights */}
          {isIron && (
            <g id="iron-filings-specks">
              <circle cx="36" cy="18" r="1.1" fill="#94a3b8" />
              <circle cx="50" cy="15" r="1.2" fill="#f8fafc" />
              <circle cx="62" cy="17" r="1.0" fill="#cbd5e1" />
              <circle cx="44" cy="21" r="1.1" fill="#64748b" />
              <circle cx="58" cy="22" r="1.2" fill="#94a3b8" />
              <circle cx="32" cy="20" r="1.0" fill="#cbd5e1" />
              <circle cx="52" cy="24" r="0.9" fill="#f1f5f9" />
              <circle cx="68" cy="19" r="0.8" fill="#94a3b8" />
              {isAddingSulphur && (
                <g id="accumulating-sulphur-specks">
                  <circle cx="48" cy="17" r="1.3" fill="#facc15">
                    <animate attributeName="opacity" values="0;1" dur="0.25s" fill="freeze" />
                  </circle>
                  <circle cx="53" cy="16" r="1.4" fill="#fef08a">
                    <animate attributeName="opacity" values="0;1" dur="0.32s" fill="freeze" />
                  </circle>
                  <circle cx="44" cy="19" r="1.2" fill="#eab308">
                    <animate attributeName="opacity" values="0;1" dur="0.4s" fill="freeze" />
                  </circle>
                  <circle cx="58" cy="18" r="1.2" fill="#facc15">
                    <animate attributeName="opacity" values="0;1" dur="0.45s" fill="freeze" />
                  </circle>
                </g>
              )}
            </g>
          )}

          {isSulphur && (
            <g id="sulphur-powder-specks">
              <circle cx="40" cy="16" r="1.2" fill="#fef08a" />
              <circle cx="52" cy="14" r="1.3" fill="#fef9c3" />
              <circle cx="64" cy="17" r="1.1" fill="#fef08a" />
              <circle cx="46" cy="20" r="1.2" fill="#fef08a" />
              <circle cx="56" cy="22" r="1.1" fill="#fef9c3" />
              <circle cx="34" cy="19" r="1.0" fill="#fef08a" />
              <circle cx="68" cy="18" r="0.9" fill="#fef08a" />
            </g>
          )}

          {/* Returning Iron Specks appearing as particles land */}
          {isSulphur && isReleasingIron && (
            <g id="releasing-iron-specks">
              <circle cx="28" cy="19" r="1.5" fill="#0f172a" opacity="0">
                <animate attributeName="opacity" values="0; 0; 0.6; 1" keyTimes="0; 0.35; 0.7; 1" dur="1.2s" fill="freeze" />
              </circle>
              <circle cx="34" cy="18" r="1.6" fill="#1e293b" opacity="0">
                <animate attributeName="opacity" values="0; 0; 0.6; 1" keyTimes="0; 0.35; 0.7; 1" dur="1.2s" fill="freeze" />
              </circle>
              <circle cx="48" cy="14.5" r="1.7" fill="#0f172a" opacity="0">
                <animate attributeName="opacity" values="0; 0; 0.6; 1" keyTimes="0; 0.4; 0.75; 1" dur="1.2s" fill="freeze" />
              </circle>
              <circle cx="60" cy="17" r="1.6" fill="#1e293b" opacity="0">
                <animate attributeName="opacity" values="0; 0; 0.6; 1" keyTimes="0; 0.35; 0.7; 1" dur="1.2s" fill="freeze" />
              </circle>
              <circle cx="66" cy="21" r="1.6" fill="#0f172a" opacity="0">
                <animate attributeName="opacity" values="0; 0; 0.6; 1" keyTimes="0; 0.4; 0.75; 1" dur="1.2s" fill="freeze" />
              </circle>
              <circle cx="54" cy="23" r="1.5" fill="#0f172a" opacity="0">
                <animate attributeName="opacity" values="0; 0; 0.6; 1" keyTimes="0; 0.45; 0.8; 1" dur="1.2s" fill="freeze" />
              </circle>
            </g>
          )}

          {isMixture && (
            <g id="mixture-specks">
              {/* Bright yellow sulphur grains — 100% stationary throughout! */}
              <g id="mixture-sulphur-grains">
                <circle cx="24" cy="17" r="1.5" fill="#facc15" />
                <circle cx="31" cy="21" r="1.4" fill="#fef08a" />
                <circle cx="38" cy="16" r="1.6" fill="#facc15" />
                <circle cx="45" cy="19" r="1.5" fill="#fef9c3" />
                <circle cx="52" cy="15" r="1.6" fill="#facc15" />
                <circle cx="58" cy="21" r="1.5" fill="#fef08a" />
                <circle cx="64" cy="16" r="1.6" fill="#facc15" />
                <circle cx="70" cy="20" r="1.4" fill="#fef08a" />
                <circle cx="76" cy="17" r="1.3" fill="#facc15" />
                <circle cx="35" cy="19" r="1.3" fill="#fef08a" />
                <circle cx="48" cy="17" r="1.4" fill="#facc15" />
                <circle cx="61" cy="19" r="1.3" fill="#fef9c3" />
              </g>

              {/* Dark metallic iron filings intermixed — depleted over 3s during separation */}
              <g id="mixture-iron-filings">
                {isSeparatingMagnet && (
                  <>
                    {/* Phase 1: Micro-quiver & orientation shift under magnetic field */}
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; -0.3,-0.4; 0.4,-0.2; -0.2,-0.7; 0.3,-0.5; 0,-1.0; 0,-1.0"
                      keyTimes="0; 0.04; 0.08; 0.12; 0.16; 0.2; 1"
                      dur="3s"
                      fill="freeze"
                    />
                    {/* Phase 2 & 3: Smooth depletion as iron is attracted to magnet poles */}
                    <animate
                      attributeName="opacity"
                      values="1; 1; 0.5; 0.15; 0"
                      keyTimes="0; 0.13; 0.4; 0.7; 1"
                      dur="3s"
                      fill="freeze"
                    />
                  </>
                )}
                {/* Individual high-contrast iron specks and needle slivers */}
                <circle cx="28" cy="19" r="1.5" fill="#0f172a" />
                <circle cx="34" cy="18" r="1.6" fill="#1e293b" />
                <line x1="33" y1="17" x2="36" y2="19" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="42" cy="22" r="1.5" fill="#1e293b" />
                <circle cx="48" cy="14.5" r="1.7" fill="#0f172a" />
                <line x1="47" y1="13.5" x2="50" y2="15.5" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="54" cy="23" r="1.5" fill="#0f172a" />
                <circle cx="60" cy="17" r="1.6" fill="#1e293b" />
                <line x1="59" y1="16" x2="62" y2="18" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="66" cy="21" r="1.6" fill="#0f172a" />
                <circle cx="72" cy="18" r="1.4" fill="#1e293b" />
                {/* Distinct metallic specular glints */}
                <circle cx="34.5" cy="17.5" r="0.8" fill="#cbd5e1" />
                <circle cx="48.5" cy="14" r="0.9" fill="#f8fafc" />
                <circle cx="66.5" cy="20.5" r="0.8" fill="#94a3b8" />
                <circle cx="54" cy="22.5" r="0.7" fill="#cbd5e1" />
              </g>
            </g>
          )}

          {isFeS && (
            <g id="fes-crystalline-specks">
              <polygon points="40,16 43,14 46,17 43,18" fill="#3f3f46" />
              <polygon points="52,15 56,13.5 58,17 54,18" fill="#27272a" />
              <circle cx="46" cy="21" r="0.9" fill="#52525b" />
              <circle cx="62" cy="19" r="1.0" fill="#3f3f46" />
              <circle cx="34" cy="19" r="0.9" fill="#27272a" />
            </g>
          )}
        </g>
      )}

      {/* ── Glass Front Specular Rim & Gleam (Perspective Elliptical Aperture) ── */}
      <ellipse
        cx="50"
        cy="10"
        rx="42"
        ry="4.5"
        stroke={highlighted ? '#2563eb' : 'rgba(148, 163, 184, 0.55)'}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 12 11 Q 50 21 88 11"
        stroke="rgba(255, 255, 255, 0.75)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Rim Glint at Left and Right Lips */}
      <ellipse cx="14" cy="10.5" rx="3" ry="1.2" fill="rgba(255, 255, 255, 0.85)" />
      <ellipse cx="86" cy="10.5" rx="2.5" ry="1.0" fill="rgba(255, 255, 255, 0.5)" />

      {label && (
        <text
          x="50"
          y="34"
          textAnchor="middle"
          fontSize="6"
          fontWeight="600"
          fill="#64748b"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
        >
          {label}
        </text>
      )}
    </svg>
  );
};


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


// ── Iron Nail (Reagent / Specimen) ──────────────────────────────

const IronNail: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 28,
  height = 110,
  label,
  flags = {},
  extraProps = {},
}) => {
  const isCoated = Boolean(flags?.nailCoated || extraProps?.isCoated);

  return (
    <svg width={width} height={height} viewBox="0 0 28 110" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="ironNailSteelGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="25%" stopColor="#94a3b8" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="85%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="ironNailCopperGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="30%" stopColor="#ea580c" />
          <stop offset="65%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#431407" />
        </linearGradient>
      </defs>

      {/* Highlight glow */}
      {highlighted && (
        <rect x="5" y="8" width="18" height="96" rx="4" stroke="#3b82f6" strokeWidth="4" opacity="0.5" filter="blur(2px)" />
      )}

      {/* Flat circular nail head */}
      <ellipse cx="14" cy="12" rx="8" ry="3.5" fill={isCoated ? 'url(#ironNailCopperGrad)' : 'url(#ironNailSteelGrad)'} stroke={isCoated ? '#7c2d12' : '#334155'} strokeWidth="1" />
      <ellipse cx="14" cy="11.5" rx="6.5" ry="2.2" fill="rgba(255,255,255,0.4)" stroke="none" />

      {/* Nail shaft / stem */}
      <rect x="11.5" y="14" width="5" height="78" rx="0.5" fill={isCoated ? 'url(#ironNailCopperGrad)' : 'url(#ironNailSteelGrad)'} stroke={isCoated ? '#7c2d12' : '#334155'} strokeWidth="0.8" />
      <line x1="13" y1="15" x2="13" y2="92" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />

      {/* Chiseled pointed nail tip */}
      <polygon points="11.5,92 16.5,92 14,104" fill={isCoated ? 'url(#ironNailCopperGrad)' : 'url(#ironNailSteelGrad)'} stroke={isCoated ? '#7c2d12' : '#334155'} strokeWidth="0.8" />

      {label && (
        <text x="14" y="114" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#64748b" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Laser Pointer (Class 3R 650 nm Ruby Red Diode Source) ──────────

const LaserPointer: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 30,
  height = 115,
  label,
  flags = {},
  ...rest
}) => {
  const isOn = rest.isLit !== false && rest.isOn !== false && flags.laserOff !== true;

  return (
    <svg width={width} height={height} viewBox="0 0 30 115" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        {/* Metallic cylindrical gradient for aluminum pen barrel */}
        <linearGradient id="laserBodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="25%" stopColor="#334155" />
          <stop offset="55%" stopColor="#64748b" />
          <stop offset="80%" stopColor="#334155" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>

        <linearGradient id="laserGoldGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="35%" stopColor="#fde047" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        <linearGradient id="laserChromeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="45%" stopColor="#f8fafc" />
          <stop offset="75%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Emitter Glow Filter */}
        <filter id="laserRayGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Focus halo when dragged/highlighted */}
      {highlighted && (
        <rect x="7" y="16" width="16" height="88" rx="8" stroke="#3b82f6" strokeWidth="4" opacity="0.6" filter="blur(2px)" />
      )}

      {/* Main Pen Cylindrical Barrel */}
      <rect x="9" y="24" width="12" height="74" rx="2" fill="url(#laserBodyGrad)" stroke="#090d16" strokeWidth="0.8" />

      {/* Knurled Anti-Slip Grip Ridges */}
      {[48, 52, 56, 60].map(y => (
        <line key={y} x1="9" y1={y} x2="21" y2={y} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      ))}

      {/* Chrome Pocket Clip */}
      <path d="M 9 32 L 6 34 L 6 62 Q 6 64 8 64" stroke="url(#laserChromeGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="7" cy="63" r="1.1" fill="#94a3b8" />

      {/* Gold Trim Ring Accents */}
      <rect x="8.5" y="24" width="13" height="2.5" fill="url(#laserGoldGrad)" rx="0.5" />
      <rect x="8.5" y="68" width="13" height="1.8" fill="url(#laserGoldGrad)" rx="0.5" />

      {/* Laser Radiation Warning Hazard Label */}
      <rect x="10.5" y="34" width="9" height="11" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" rx="0.8" />
      <polygon points="15,36 12,41 18,41" fill="#000000" />
      <line x1="15" y1="37.5" x2="15" y2="39.5" stroke="#fef08a" strokeWidth="0.5" />
      <circle cx="15" cy="40.3" r="0.3" fill="#fef08a" />

      {/* Tactile Push-Button Switch */}
      <rect x="12.5" y="74" width="5" height="9" rx="2" fill={isOn ? '#dc2626' : '#475569'} stroke="#0f172a" strokeWidth="0.6" />
      {isOn && (
        <circle cx="15" cy="78.5" r="1.4" fill="#fef2f2" filter="drop-shadow(0 0 3px #ef4444)" />
      )}

      {/* Tail Cap */}
      <path d="M 9 98 L 21 98 L 19 104 L 11 104 Z" fill="url(#laserChromeGrad)" stroke="#475569" strokeWidth="0.6" />

      {/* Optical Diode Aperture Housing */}
      <path d="M 9 24 L 21 24 L 18 16 L 12 16 Z" fill="url(#laserChromeGrad)" stroke="#475569" strokeWidth="0.6" />
      <rect x="12" y="12" width="6" height="4" fill="#090d16" stroke="#475569" strokeWidth="0.5" rx="0.5" />
      <ellipse cx="15" cy="12" rx="2.2" ry="1.2" fill={isOn ? '#ff003c' : '#334155'} />

      {/* Active Collimated Laser Ray Projection */}
      {isOn && (
        <g id="laser-projected-ray">
          {/* Intense core laser beam */}
          <line x1="15" y1="12" x2="15" y2="-4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          {/* Saturated 650nm Ruby Red corridor */}
          <line x1="15" y1="12" x2="15" y2="-4" stroke="#ff003c" strokeWidth="3" opacity="0.95" strokeLinecap="round" />
          {/* Soft outer Gaussian beam blooming halo */}
          <line x1="15" y1="12" x2="15" y2="-4" stroke="rgba(255, 0, 60, 0.45)" strokeWidth="7" filter="url(#laserRayGlow)" strokeLinecap="round" />
          {/* Aperture specular flare */}
          <circle cx="15" cy="12" r="3.2" fill="#ffffff" filter="drop-shadow(0 0 6px #ff003c)" />
          <ellipse cx="15" cy="12" rx="6" ry="1.4" fill="rgba(255, 255, 255, 0.95)" />
        </g>
      )}

      {/* Label */}
      {label && (
        <text x="15" y="112" textAnchor="middle" fontSize="6.2" fill="#64748b" fontWeight="700" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
};



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
  label = '',
  highlighted = false,
  width = 140,
  height = 280,
  variables = {},
  flags = {},
}) => {
  const strokeColor = highlighted ? '#2563eb' : '#334155';
  const rawProgress = (variables._flowProgress ?? variables.flowProgress ?? 0) as number;
  const hasSucked = !!flags.suckedAboveMark;
  const isSucking = !!flags.isSucking;

  // Upper timing mark C is at y = 55, Lower timing mark D is at y = 114
  // Bulb B (upper bulb on right capillary limb) spans y = 55 to y = 114
  const upperMarkY = 55;
  const lowerMarkY = 114;
  const balanceLevelY = 166; // Hydrostatic equilibrium line where communicating limbs balance

  // Flow through Bulb B (0.0 at C -> 1.0 at D)
  const bulbBProgress = Math.max(0, Math.min(1, rawProgress));
  const meniscusY = upperMarkY + bulbBProgress * (lowerMarkY - upperMarkY);

  // Flow below Mark D:
  // When rawProgress > 1.0, meniscus continues flowing below D down the narrow capillary tube
  // until reaching hydrostatic balance at balanceLevelY (166) at rawProgress = 1.5.
  const belowDProgress = Math.max(0, Math.min(1, (rawProgress - 1.0) / 0.5));
  const isBelowD = hasSucked && rawProgress > 1.0;
  const isBalanced = hasSucked && rawProgress >= 1.5;
  const capillaryMeniscusY = isBelowD
    ? lowerMarkY + belowDProgress * (balanceLevelY - lowerMarkY)
    : lowerMarkY;

  // Coupled liquid level in lower Bulb A:
  // Before suction: sits at bulbAInitialY (approx 166)
  // When sucked: drawn down to bulbASuckedStartY (188)
  // As liquid drains from Bulb B (rawProgress 0 -> 1): rises to 154
  // As liquid drains below D towards balance (rawProgress 1.0 -> 1.5): equalizes to balanceLevelY (166)
  const bulbAInitialY = Math.round(202 - Math.min(1, Math.max(0.12, liquidLevel)) * 60);
  const bulbASuckedStartY = 188;
  const bulbADrainedDY = 154;

  let bulbAY = bulbAInitialY;
  if (hasSucked) {
    if (rawProgress <= 1.0) {
      bulbAY = bulbASuckedStartY - bulbBProgress * (bulbASuckedStartY - bulbADrainedDY);
    } else {
      bulbAY = bulbADrainedDY + belowDProgress * (balanceLevelY - bulbADrainedDY);
    }
  }

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

        {/* Radial suction bulb rubber gradient */}
        <radialGradient id="suctionBulbGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="40%" stopColor="#dc2626" />
          <stop offset="85%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>

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
        fill="none"
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
        fill="none"
      />

      {/* ── Liquid Layer ── */}
      {liquidLevel > 0 && (
        <g
          opacity="0.95"
          style={{
            transition: 'opacity 0.3s ease',
          }}
        >
          {/* Continuous liquid volume: Bulb A + U-bend + right capillary connection */}
          <g clipPath="url(#lowerLimbClip)">
            {isSucking ? (
              <>
                {/* Liquid in Bulb A dropping smoothly down as vacuum draws fluid */}
                <rect
                  x="16"
                  y={bulbAInitialY}
                  width="90"
                  height={260 - bulbAInitialY}
                  fill={liquidColor}
                >
                  <animate
                    attributeName="y"
                    from={bulbAInitialY}
                    to={bulbASuckedStartY}
                    dur="2.4s"
                    fill="freeze"
                  />
                  <animate
                    attributeName="height"
                    from={260 - bulbAInitialY}
                    to={260 - bulbASuckedStartY}
                    dur="2.4s"
                    fill="freeze"
                  />
                </rect>
                {/* Meniscus on top of lowering liquid in Bulb A */}
                <ellipse
                  cx="40"
                  cy={bulbAInitialY}
                  rx={bulbARadiusX}
                  ry="2.6"
                  fill="rgba(255,255,255,0.6)"
                  stroke={liquidColor}
                  strokeWidth="1"
                >
                  <animate
                    attributeName="cy"
                    from={bulbAInitialY}
                    to={bulbASuckedStartY}
                    dur="2.4s"
                    fill="freeze"
                  />
                </ellipse>
              </>
            ) : (
              <>
                {/* Liquid filling from bulbAY down through U-tube */}
                <rect
                  x="16"
                  y={bulbAY}
                  width="90"
                  height={260 - bulbAY}
                  fill={liquidColor}
                />
                {/* Meniscus on top of liquid in Bulb A */}
                <ellipse
                  cx="40"
                  cy={bulbAY}
                  rx={bulbARadiusX}
                  ry="2.6"
                  fill="rgba(255,255,255,0.6)"
                  stroke={liquidColor}
                  strokeWidth="1"
                />
                {/* Matching level in right capillary arm when not sucked */}
                {!hasSucked && (
                  <ellipse
                    cx="98"
                    cy={bulbAY}
                    rx="4.5"
                    ry="1.4"
                    fill="rgba(255,255,255,0.55)"
                    stroke={liquidColor}
                    strokeWidth="0.8"
                  />
                )}
              </>
            )}
          </g>

          {/* Liquid in Upper Bulb B (on right capillary limb) */}
          {isSucking ? (
            <g clipPath="url(#upperBulbClip)">
              {/* Smooth liquid rise filling Bulb B upwards above Mark C (y=48) */}
              <rect
                x="76"
                y="114"
                width="44"
                height="0"
                fill={liquidColor}
                opacity="0.95"
              >
                <animate attributeName="y" values="114; 114; 48" keyTimes="0; 0.35; 1" dur="2.4s" fill="freeze" />
                <animate attributeName="height" values="0; 0; 70" keyTimes="0; 0.35; 1" dur="2.4s" fill="freeze" />
              </rect>
              {/* Rising meniscus surface */}
              <ellipse
                cx="98"
                cy="114"
                rx="14"
                ry="2.6"
                fill="rgba(255,255,255,0.6)"
                stroke={liquidColor}
                strokeWidth="1"
                opacity="0"
              >
                <animate attributeName="cy" values="114; 114; 48" keyTimes="0; 0.35; 1" dur="2.4s" fill="freeze" />
                <animate attributeName="opacity" values="0; 0; 1" keyTimes="0; 0.34; 0.38" dur="2.4s" fill="freeze" />
              </ellipse>
            </g>
          ) : hasSucked ? (
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
              {meniscusY <= lowerMarkY && (
                <ellipse
                  cx="98"
                  cy={meniscusY}
                  rx="14"
                  ry="2.6"
                  fill="rgba(255,255,255,0.45)"
                  stroke={liquidColor}
                  strokeWidth="0.8"
                />
              )}
            </g>
          ) : null}

          {/* Narrow Capillary liquid column (connecting below lower Mark D down into U-tube) */}
          {isSucking ? (
            <rect
              x="95"
              y="215"
              width="6"
              height="0"
              fill={liquidColor}
              opacity="0.9"
            >
              <animate attributeName="y" values="215; 114; 114" keyTimes="0; 0.35; 1" dur="2.4s" fill="freeze" />
              <animate attributeName="height" values="0; 101; 101" keyTimes="0; 0.35; 1" dur="2.4s" fill="freeze" />
            </rect>
          ) : hasSucked ? (
            <>
              {/* Liquid column in narrow capillary from meniscus down to U-bend */}
              <rect
                x="95"
                y={capillaryMeniscusY}
                width="6"
                height={Math.max(0, 215 - capillaryMeniscusY)}
                fill={liquidColor}
                opacity="0.9"
              />
              {/* Curved meniscus surface inside narrow capillary when below D */}
              {isBelowD && capillaryMeniscusY < 215 && (
                <ellipse
                  cx="98"
                  cy={capillaryMeniscusY}
                  rx="3"
                  ry="1.2"
                  fill="rgba(255,255,255,0.7)"
                  stroke={liquidColor}
                  strokeWidth="0.6"
                />
              )}
            </>
          ) : null}
        </g>
      )}

      {/* Capillary bore centerline in narrow right limb */}
      <line x1="98" y1="114" x2="98" y2="185" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />

      {/* ── Continuous Dynamic Capillary Flow Streamlines During Timing ── */}
      {flags.timerRunning && !isBalanced && (
        <g opacity="0.85">
          {/* Capillary bore downward fluid stream */}
          <line x1="98" y1={capillaryMeniscusY} x2="98" y2="212" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeDasharray="6 8" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="0;28" dur="0.55s" repeatCount="indefinite" />
          </line>
          {/* Fluid flow around lower U-bend into Bulb A */}
          <path
            d="M 98 214 C 98 242 40 242 40 214"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2.2"
            strokeDasharray="8 10"
            fill="none"
            strokeLinecap="round"
          >
            <animate attributeName="stroke-dashoffset" values="36;0" dur="0.85s" repeatCount="indefinite" />
          </path>
        </g>
      )}

      {/* ── Hydrostatic Balance Line (When both limbs level off and balance) ── */}
      {isBalanced && (
        <g opacity="0.9" style={{ animation: 'fadeIn 0.35s ease-out' }}>
          <line x1="24" y1={balanceLevelY} x2="108" y2={balanceLevelY} stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 2" />
          <g transform={`translate(66, ${balanceLevelY})`}>
            <rect x="-26" y="-6.5" width="52" height="13" rx="2.5" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="0.8" />
            <text x="0" y="2.5" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#047857" letterSpacing="0.04em">
              BALANCED
            </text>
          </g>
        </g>
      )}

      {/* ── Suction Assembly & Tube when Suction Bulb is applied ── */}
      {isSucking && (
        <g id="suction-assembly" style={{ animation: 'fadeIn 0.25s ease-out' }}>
          {/* Rubber adapter sleeve fitted over capillary limb top */}
          <rect x="91" y="10" width="14" height="13" rx="2.5" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
          <rect x="93" y="8" width="10" height="4" rx="1" fill="#64748b" />

          {/* Flexible rubber tubing extending up to suction bulb */}
          <path
            d="M 98 10 C 98 -2 108 -6 108 -18"
            stroke="#dc2626"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 98 10 C 98 -2 108 -6 108 -18"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Classic laboratory rubber suction bulb / pipetting aid */}
          <g transform="translate(108, -32)">
            {/* Rubber bulb body with pulsing vacuum suction */}
            <ellipse
              cx="0"
              cy="0"
              rx="13"
              ry="16"
              fill="url(#suctionBulbGrad)"
              stroke="#7f1d1d"
              strokeWidth="1.6"
              filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))"
            >
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1 1; 0.86 0.94; 0.92 0.97; 0.88 0.95; 1 1"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Bulb ribbed grip rings */}
            <path d="M -10 -4 Q 0 -2 10 -4" stroke="#991b1b" strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M -11 2 Q 0 4 11 2" stroke="#991b1b" strokeWidth="1.2" fill="none" opacity="0.7" />

            {/* Top valve / release stem */}
            <rect x="-3" y="-22" width="6" height="7" rx="1.5" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
            <circle cx="0" cy="-24" r="3.5" fill="#b91c1c" stroke="#450a0a" strokeWidth="1" />

            {/* Negative vacuum suction indicator waves */}
            <circle cx="0" cy="0" r="16" fill="none" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="1.5" opacity="0">
              <animate attributeName="r" values="14;24" dur="0.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="0.8s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Floating Active Vacuum Status Badge */}
          <g transform="translate(108, -60)">
            <rect
              x="-62"
              y="-9"
              width="124"
              height="18"
              rx="4"
              fill="rgba(15, 23, 42, 0.92)"
              stroke="#ef4444"
              strokeWidth="1.2"
              filter="drop-shadow(0 2px 8px rgba(239,68,68,0.4))"
            />
            <text
              x="0"
              y="3.5"
              textAnchor="middle"
              fontSize="8"
              fontWeight="800"
              fill="#fecaca"
              letterSpacing="0.03em"
            >
              SUCTION ACTIVE • RAISING LIQUID
            </text>
          </g>
        </g>
      )}

      {/* ── Upward Suction Fluid Streamlines & Microbubbles During Suction ── */}
      {isSucking && (
        <g opacity="0.92">
          {/* Upward stream of fluid particles */}
          <line x1="98" y1="212" x2="98" y2="50" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="36;0" dur="0.38s" repeatCount="indefinite" />
          </line>
          {/* Vacuum microbubbles rising */}
          <circle cx="98" cy="190" r="1.6" fill="rgba(255,255,255,0.85)">
            <animate attributeName="cy" values="210;50" dur="0.75s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="0.75s" repeatCount="indefinite" />
          </circle>
          <circle cx="97.5" cy="160" r="1.4" fill="rgba(255,255,255,0.85)">
            <animate attributeName="cy" values="210;50" dur="0.65s" begin="0.25s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="0.65s" begin="0.25s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* ── Upper Timing Mark (Mark C) ── */}
      <line x1="88" y1={upperMarkY} x2="110" y2={upperMarkY} stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      <g transform={`translate(115, ${upperMarkY + 4})`}>
        <text x="0" y="0" fontSize="13" fontWeight="900" fill="#dc2626" stroke="rgba(255,255,255,0.85)" strokeWidth="2" paintOrder="stroke fill">C</text>
      </g>

      {/* ── Lower Timing Mark (Mark D) ── */}
      <line x1="88" y1={lowerMarkY} x2="110" y2={lowerMarkY} stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      <g transform={`translate(115, ${lowerMarkY + 4})`}>
        <text x="0" y="0" fontSize="13" fontWeight="900" fill="#dc2626" stroke="rgba(255,255,255,0.85)" strokeWidth="2" paintOrder="stroke fill">D</text>
      </g>

      {/* ── Clean, High-Contrast Limb & Bulb Labels (Positioned outside liquid flow paths) ── */}
      {/* Broad Limb Header */}
      <g transform="translate(38, 8)">
        <rect x="-24" y="-7.5" width="48" height="13" rx="3" fill="rgba(255, 255, 255, 0.94)" stroke="#cbd5e1" strokeWidth="0.8" />
        <text x="0" y="2" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#334155" letterSpacing="0.02em">Broad Limb</text>
      </g>

      {/* Capillary Limb Header */}
      <g transform="translate(98, 8)">
        <rect x="-28" y="-7.5" width="56" height="13" rx="3" fill="rgba(255, 255, 255, 0.94)" stroke="#cbd5e1" strokeWidth="0.8" />
        <text x="0" y="2" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#334155" letterSpacing="0.02em">Capillary Limb</text>
      </g>

      {/* Bulb B Tag (Positioned cleanly between limbs, avoiding liquid path) */}
      <g transform="translate(64, 85)">
        <rect x="-18" y="-7.5" width="36" height="15" rx="3" fill="rgba(255, 255, 255, 0.94)" stroke="#cbd5e1" strokeWidth="0.8" />
        <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1e293b">Bulb B</text>
        <line x1="18" y1="0" x2="24" y2="0" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 1" />
      </g>

      {/* Bulb A Tag (Positioned cleanly between limbs, avoiding liquid path) */}
      <g transform="translate(68, 168)">
        <rect x="-18" y="-7.5" width="36" height="15" rx="3" fill="rgba(255, 255, 255, 0.94)" stroke="#cbd5e1" strokeWidth="0.8" />
        <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1e293b">Bulb A</text>
        <line x1="-18" y1="0" x2="-24" y2="0" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 1" />
      </g>

      {/* Capillary Tag (Positioned outside liquid column with leader tick) */}
      <g transform="translate(116, 150)">
        <line x1="-12" y1="0" x2="-3" y2="0" stroke="#64748b" strokeWidth="1" strokeDasharray="2 1.5" />
        <text x="0" y="3" fontSize="8" fontWeight="700" fill="#475569">Capillary</text>
      </g>

      {/* Glass reflections & highlights */}
      <path d="M 35 25 L 35 135" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 97 25 L 97 50" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 23 165 C 21 175 25 185 30 190" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none" />

      {/* Stand Clamp Attachment Graphic (gripping upper broad limb naturally) */}
      <rect x="25" y="70" width="30" height="11" rx="2.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" opacity="0.85" />
      <circle cx="40" cy="75.5" r="2.5" fill="#94a3b8" />

      {/* ── Apparatus Title Badge (Clean, high-contrast placard associated with apparatus) ── */}
      {label ? (
        <g transform="translate(68, 268)">
          <rect
            x="-58"
            y="-9"
            width="116"
            height="18"
            rx="5"
            fill="rgba(255, 255, 255, 0.95)"
            stroke="rgba(37, 99, 235, 0.35)"
            strokeWidth="1.2"
            filter="drop-shadow(0 2px 5px rgba(0,0,0,0.15))"
          />
          <text
            x="0"
            y="3.5"
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="800"
            fill="#1e3a8a"
            letterSpacing="0.02em"
          >
            {label}
          </text>
        </g>
      ) : null}
    </svg>
  );
};

// ── Digital Stopwatch ─────────────────────────────────────────────

const Stopwatch: React.FC<ApparatusProps> = ({
  label = 'Digital Stopwatch',
  highlighted = false,
  width = 110,
  height = 136,
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
    <svg width={width} height={height} viewBox="0 0 110 136" fill="none">
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
        1/100 SEC
      </text>

      {/* Status indicator LED */}
      <circle cx="55" cy="80" r="3.5" fill={isRunning ? '#10b981' : '#64748b'} />
      <text x="55" y="92" textAnchor="middle" fontSize="7" fontWeight="600" fill={isRunning ? '#34d399' : '#94a3b8'}>
        {isRunning ? 'RUNNING' : 'STOPPED'}
      </text>

      {/* Label Badge: Docked cleanly below the dial casing with high-contrast pill background */}
      {label && (
        <g transform="translate(55, 125)">
          <rect
            x={-Math.min(52, Math.max(34, (label.length * 3.2) + 8))}
            y="-7.5"
            width={Math.min(104, Math.max(68, (label.length * 6.4) + 16))}
            height="15"
            rx="5"
            fill="var(--bg-card, rgba(255, 255, 255, 0.96))"
            stroke="var(--border, rgba(203, 213, 225, 0.85))"
            strokeWidth="1"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
          />
          <text
            x="0"
            y="3.5"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="var(--text-secondary, #334155)"
            letterSpacing="0.02em"
          >
            {label}
          </text>
        </g>
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

      {/* Label Badge */}
      {label && (
        <g transform="translate(80, 133)">
          <rect
            x={-Math.min(70, Math.max(40, (label.length * 3.4) + 8))}
            y="-7.5"
            width={Math.min(140, Math.max(80, (label.length * 6.8) + 16))}
            height="15"
            rx="5"
            fill="var(--bg-card, rgba(255, 255, 255, 0.96))"
            stroke="var(--border, rgba(203, 213, 225, 0.85))"
            strokeWidth="1"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
          />
          <text
            x="0"
            y="3.5"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="var(--text-secondary, #334155)"
            letterSpacing="0.02em"
          >
            {label}
          </text>
        </g>
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

      {/* Label Badge */}
      {label && (
        <g transform="translate(80, 133)">
          <rect
            x={-Math.min(70, Math.max(40, (label.length * 3.4) + 8))}
            y="-7.5"
            width={Math.min(140, Math.max(80, (label.length * 6.8) + 16))}
            height="15"
            rx="5"
            fill="var(--bg-card, rgba(255, 255, 255, 0.96))"
            stroke="var(--border, rgba(203, 213, 225, 0.85))"
            strokeWidth="1"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
          />
          <text
            x="0"
            y="3.5"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="var(--text-secondary, #334155)"
            letterSpacing="0.02em"
          >
            {label}
          </text>
        </g>
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



// ── Bar Magnet ───────────────────────────────────────────────────

const BarMagnet: React.FC<ApparatusProps> = ({
  id = 'bar-magnet',
  highlighted = false,
  width = 36,
  height = 110,
  label,
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 36 110" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        {/* North Pole Red Gradient */}
        <linearGradient id={`magnetNorthGrad-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="30%" stopColor="#ef4444" />
          <stop offset="70%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        {/* South Pole Blue Gradient */}
        <linearGradient id={`magnetSouthGrad-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="30%" stopColor="#2563eb" />
          <stop offset="70%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>

        {/* Metallic Pole Tip Gradient */}
        <linearGradient id={`magnetTipGrad-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="40%" stopColor="#f1f5f9" />
          <stop offset="70%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Gloss / Specular Streak */}
        <linearGradient id={`magnetShine-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Highlight Glow when focused or dragged */}
      {highlighted && (
        <rect
          x="3"
          y="4"
          width="30"
          height="102"
          rx="4"
          stroke="#3b82f6"
          strokeWidth="4"
          opacity="0.6"
          filter="blur(2px)"
        />
      )}

      {/* Main Magnet Body Shadow */}
      <rect x="6" y="7" width="24" height="96" rx="3" fill="rgba(0,0,0,0.2)" />

      {/* North Pole (Red, Upper Half) */}
      <path
        d="M 6 10 C 6 8.3 7.3 7 9 7 L 27 7 C 28.7 7 30 8.3 30 10 L 30 55 L 6 55 Z"
        fill={`url(#magnetNorthGrad-${id || 'def'})`}
        stroke="#991b1b"
        strokeWidth="1"
      />

      {/* South Pole (Blue, Lower Half) */}
      <path
        d="M 6 55 L 30 55 L 30 100 C 30 101.7 28.7 103 27 103 L 9 103 C 7.3 103 6 101.7 6 100 Z"
        fill={`url(#magnetSouthGrad-${id || 'def'})`}
        stroke="#1e3a8a"
        strokeWidth="1"
      />

      {/* Top Silver Pole Cap */}
      <rect
        x="6"
        y="7"
        width="24"
        height="5"
        rx="2"
        fill={`url(#magnetTipGrad-${id || 'def'})`}
        stroke="#64748b"
        strokeWidth="0.8"
      />

      {/* Bottom Silver Pole Cap */}
      <rect
        x="6"
        y="98"
        width="24"
        height="5"
        rx="2"
        fill={`url(#magnetTipGrad-${id || 'def'})`}
        stroke="#64748b"
        strokeWidth="0.8"
      />

      {/* Center Neutral Dividing Seam */}
      <line x1="6" y1="55" x2="30" y2="55" stroke="#0f172a" strokeWidth="1.2" />
      <line x1="7" y1="55.6" x2="29" y2="55.6" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />

      {/* Specular Longitudinal Reflection */}
      <rect
        x="8"
        y="12"
        width="4"
        height="86"
        rx="1"
        fill={`url(#magnetShine-${id || 'def'})`}
      />

      {/* Pole Lettering */}
      {/* 'N' Letter */}
      <text
        x="18"
        y="35"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill="#ffffff"
        fontFamily="var(--font-sans, system-ui, sans-serif)"
        letterSpacing="0.5"
        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
      >
        N
      </text>

      {/* 'S' Letter */}
      <text
        x="18"
        y="83"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill="#ffffff"
        fontFamily="var(--font-sans, system-ui, sans-serif)"
        letterSpacing="0.5"
        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
      >
        S
      </text>

      {label && (
        <text
          x="18"
          y="108"
          textAnchor="middle"
          fontSize="6"
          fontWeight="700"
          fill="#475569"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
        >
          {label}
        </text>
      )}
    </svg>
  );
};



// ── Horseshoe / U-Shaped Magnet ──────────────────────────────────

const HorseshoeMagnet: React.FC<ApparatusProps> = ({
  id = 'horseshoe-magnet',
  highlighted = false,
  width = 120,
  height = 140,
  label,
  flags = {},
  extraProps,
  ...props
}) => {
  const p = props as Record<string, unknown>;
  const hasAttractedIron = Boolean(
    (p.hasAttractedIron ||
      extraProps?.['hasAttractedIron'] ||
      flags?.magnetSeparationComplete ||
      flags?.magnetTestedMix) &&
      !flags?.mixtureRestored &&
      !flags?.isReleasingIron &&
      !p.ironReturned
  );

  return (
    <svg width={width} height={height} viewBox="0 0 84 98" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        {/* Curved Steel Arch Metallic Gradient */}
        <linearGradient id={`uMagnetMetal-${id || 'def'}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="35%" stopColor="#94a3b8" />
          <stop offset="70%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* North Pole Red Gradient */}
        <linearGradient id={`uMagnetNorth-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="30%" stopColor="#ef4444" />
          <stop offset="70%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        {/* South Pole Blue Gradient */}
        <linearGradient id={`uMagnetSouth-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Metallic Pole Face Gradient */}
        <linearGradient id={`uMagnetTip-${id || 'def'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>

      {/* Highlight glow when hovered/dragged */}
      {highlighted && (
        <path
          d="M 12 76 L 12 34 C 12 10, 72 10, 72 34 L 72 76 L 52 76 L 52 38 C 52 26, 32 26, 32 38 L 32 76 Z"
          stroke="#3b82f6"
          strokeWidth="4"
          fill="none"
          opacity="0.6"
          filter="blur(2px)"
        />
      )}

      {/* Cast Shadow */}
      <ellipse cx="42" cy="85" rx="34" ry="4" fill="rgba(0,0,0,0.14)" />

      {/* ── Metallic Horseshoe Yoke (Arch) ── */}
      <path
        d="M 14 50 L 14 34 C 14 12, 70 12, 70 34 L 70 50 L 54 50 L 54 36 C 54 24, 30 24, 30 36 L 30 50 Z"
        fill={`url(#uMagnetMetal-${id || 'def'})`}
        stroke="#475569"
        strokeWidth="1.2"
      />
      {/* Specular Highlight along outer curvature */}
      <path
        d="M 16 34 C 16 15, 68 15, 68 34"
        stroke="rgba(255, 255, 255, 0.65)"
        strokeWidth="1.4"
        fill="none"
      />

      {/* ── North Pole (Red, Left Leg) ── */}
      <rect
        x="14"
        y="50"
        width="16"
        height="24"
        rx="0.5"
        fill={`url(#uMagnetNorth-${id || 'def'})`}
        stroke="#7f1d1d"
        strokeWidth="1"
      />
      {/* North Pole Metallic Face Cap */}
      <rect
        x="14"
        y="74"
        width="16"
        height="3.5"
        rx="0.5"
        fill={`url(#uMagnetTip-${id || 'def'})`}
        stroke="#64748b"
        strokeWidth="0.8"
      />
      {/* 'N' Pole Stamp */}
      <text
        x="22"
        y="68"
        textAnchor="middle"
        fontSize="13"
        fontWeight="900"
        fill="#ffffff"
        fontFamily="var(--font-sans, system-ui, sans-serif)"
        filter="drop-shadow(0 1px 1px rgba(0,0,0,0.4))"
      >
        N
      </text>

      {/* ── South Pole (Blue, Right Leg) ── */}
      <rect
        x="54"
        y="50"
        width="16"
        height="24"
        rx="0.5"
        fill={`url(#uMagnetSouth-${id || 'def'})`}
        stroke="#1e3a8a"
        strokeWidth="1"
      />
      {/* South Pole Metallic Face Cap */}
      <rect
        x="54"
        y="74"
        width="16"
        height="3.5"
        rx="0.5"
        fill={`url(#uMagnetTip-${id || 'def'})`}
        stroke="#64748b"
        strokeWidth="0.8"
      />
      {/* 'S' Pole Stamp */}
      <text
        x="62"
        y="68"
        textAnchor="middle"
        fontSize="13"
        fontWeight="900"
        fill="#ffffff"
        fontFamily="var(--font-sans, system-ui, sans-serif)"
        filter="drop-shadow(0 1px 1px rgba(0,0,0,0.4))"
      >
        S
      </text>

      {/* ── Clustered Iron Filings (When iron has been magnetically separated) ── */}
      {hasAttractedIron && (
        <g id="attracted-iron-clusters">
          {/* North pole filings cluster */}
          <path
            d="M 11 77 Q 14 88 22 91 Q 30 88 33 77 Q 27 82 22 83 Q 17 82 11 77 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="0.6"
          />
          {/* North pole bristling needles/whiskers */}
          <line x1="14" y1="77" x2="9" y2="86" stroke="#334155" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="17" y1="77" x2="14" y2="90" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="22" y1="77" x2="22" y2="94" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="27" y1="77" x2="30" y2="90" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="30" y1="77" x2="35" y2="86" stroke="#334155" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="18" cy="85" r="1.1" fill="#94a3b8" />
          <circle cx="26" cy="86" r="1.0" fill="#cbd5e1" />

          {/* South pole filings cluster */}
          <path
            d="M 51 77 Q 54 88 62 91 Q 70 88 73 77 Q 67 82 62 83 Q 57 82 51 77 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="0.6"
          />
          {/* South pole bristling needles/whiskers */}
          <line x1="54" y1="77" x2="49" y2="86" stroke="#334155" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="57" y1="77" x2="54" y2="90" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="62" y1="77" x2="62" y2="94" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="67" y1="77" x2="70" y2="90" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="70" y1="77" x2="75" y2="86" stroke="#334155" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="58" cy="85" r="1.1" fill="#94a3b8" />
          <circle cx="66" cy="86" r="1.0" fill="#cbd5e1" />

          {/* Magnetic field line filament bridge */}
          <path
            d="M 30 79 Q 42 75 54 79"
            stroke="#334155"
            strokeWidth="1.0"
            strokeDasharray="2 1.5"
            fill="none"
          />
        </g>
      )}

      {label && (
        <text
          x="42"
          y="96"
          textAnchor="middle"
          fontSize="5"
          fontWeight="700"
          fill="#475569"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
        >
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Mortar ────────────────────────────────────────────────────────

const Mortar: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 90,
  height = 55,
  label,
  flags,
  extraProps,
  ...props
}) => {
  const p = props as Record<string, unknown>;
  const dispatch = p.dispatch as React.Dispatch<any> | undefined;
  const powderType = (p.powderType as string | undefined) ?? (extraProps?.powderType as string | undefined);
  const hasSolid = Boolean(p.hasSolid || extraProps?.['hasSolid'] || flags?.feSTransferredToMortar || flags?.feSInMortar);
  const hasPowder = Boolean(p.hasPowder || extraProps?.['hasPowder'] || powderType || flags?.feSPowderReady);
  const isFeS = powderType === 'fes' || powderType === 'compound' || Boolean(flags?.feSTransferredToMortar || flags?.feSInMortar || flags?.feSPowderReady);
  const isCrushing = Boolean(flags?.isCrushingFeS);

  return (
    <svg width={width} height={height} viewBox="0 0 90 55" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="mortarOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="mortarInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      {/* Base rim */}
      <ellipse cx="45" cy="48" rx="28" ry="5" fill="#94a3b8" />
      <path
        d="M 20 47 Q 45 52 70 47 L 76 22 Q 45 28 14 22 Z"
        fill="url(#mortarOuterGrad)"
        stroke={highlighted ? '#2563eb' : '#94a3b8'}
        strokeWidth={highlighted ? 2 : 1.2}
      />
      {/* Pouring lip on the left */}
      <path
        d="M 14 22 C 10 20 8 18 10 16 C 13 17 17 19 20 20"
        fill="#e2e8f0"
        stroke={highlighted ? '#2563eb' : '#94a3b8'}
        strokeWidth="1.2"
      />
      {/* Outer top rim */}
      <ellipse
        cx="45"
        cy="20"
        rx="34"
        ry="9"
        fill="url(#mortarOuterGrad)"
        stroke={highlighted ? '#2563eb' : '#94a3b8'}
        strokeWidth="1.2"
      />
      {/* Inner cavity */}
      <ellipse
        cx="45"
        cy="21"
        rx="28"
        ry="7"
        fill="url(#mortarInnerGrad)"
        stroke="#cbd5e1"
        strokeWidth="0.8"
      />

      {/* Solid chunk inside Mortar before crushing */}
      {hasSolid && !hasPowder && (
        <g id="mortar-solid-chunk">
          <ellipse cx="45" cy="22" rx="16" ry="4.5" fill="#09090b" stroke="#27272a" strokeWidth="0.8" />
          <circle cx="41" cy="21" r="1.8" fill="#3f3f46" />
          <circle cx="48" cy="23" r="1.5" fill="#27272a" />
          <circle cx="45" cy="22" r="1.2" fill="#52525b" />
        </g>
      )}

      {/* Finely ground powder inside Mortar after crushing */}
      {hasPowder && (
        <g id="mortar-powder-bed">
          <ellipse
            cx="45"
            cy="22"
            rx="23"
            ry="5.8"
            fill={isFeS ? '#09090b' : '#ca8a04'}
            stroke={isFeS ? '#18181b' : '#a16207'}
            strokeWidth="0.8"
          />
          {isFeS ? (
            <g opacity="0.85">
              <circle cx="36" cy="22" r="1" fill="#3f3f46" />
              <circle cx="42" cy="21" r="1.1" fill="#52525b" />
              <circle cx="48" cy="23" r="1" fill="#27272a" />
              <circle cx="53" cy="22" r="0.9" fill="#3f3f46" />
              <circle cx="45" cy="24" r="1" fill="#27272a" />
            </g>
          ) : (
            <g opacity="0.85">
              <circle cx="36" cy="22" r="1" fill="#facc15" />
              <circle cx="42" cy="21" r="1.1" fill="#1e293b" />
              <circle cx="48" cy="23" r="1" fill="#facc15" />
              <circle cx="53" cy="22" r="0.9" fill="#1e293b" />
            </g>
          )}
        </g>
      )}

      {/* Pestle crushing animation inside mortar */}
      {isCrushing && (
        <g transform="translate(45, 12)">
          <path d="M -4 -18 L -3 6 Q 0 9 3 6 L 4 -18 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-15 0 0; 15 0 0; -15 0 0"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      )}

      {/* Interactive Action Pill on Mortar to Crush / Grind */}
      {hasSolid && !hasPowder && !isCrushing && (
        <foreignObject x="-20" y="-34" width="140" height="34" style={{ overflow: 'visible' }}>
          <button
            type="button"
            id="btn-crush-fes"
            onClick={(e) => {
              e.stopPropagation();
              dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'crush-fes-btn' } });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#475569',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '4px 9px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(71, 85, 105, 0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>🔨</span>
            <span>Crush / Grind FeS</span>
          </button>
        </foreignObject>
      )}

      {/* Interactive Action Pill on Mortar to Record Visual Observation */}
      {hasPowder && !flags?.feSObserved && (
        <foreignObject x="-30" y="-34" width="160" height="34" style={{ overflow: 'visible' }}>
          <button
            type="button"
            id="btn-observe-fes"
            onClick={(e) => {
              e.stopPropagation();
              dispatch?.({ type: 'CLICK_ELEMENT', payload: { elementId: 'observe-fes-btn' } });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '4px 9px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>👁️</span>
            <span>Record Visual Observation</span>
          </button>
        </foreignObject>
      )}

      {label && (
        <text
          x="45"
          y="40"
          textAnchor="middle"
          fontSize="6.5"
          fill="#64748b"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
};


// ── Pestle ────────────────────────────────────────────────────────

const Pestle: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 30,
  height = 70,
  label,
}) => (
  <svg width={width} height={height} viewBox="0 0 30 70" fill="none">
    <defs>
      <linearGradient id="pestleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="40%" stopColor="#ffffff" />
        <stop offset="80%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
    </defs>
    {/* Handle to head body */}
    <path
      d="M 12 10 C 12 6 18 6 18 10 L 17 42 C 17 48 24 54 23 60 C 22 66 8 66 7 60 C 6 54 13 48 13 42 Z"
      fill="url(#pestleGrad)"
      stroke={highlighted ? '#2563eb' : '#94a3b8'}
      strokeWidth={highlighted ? 2 : 1.2}
    />
    {/* Rounded top knob */}
    <ellipse
      cx="15"
      cy="9"
      rx="3.5"
      ry="2"
      fill="#f8fafc"
      stroke={highlighted ? '#2563eb' : '#94a3b8'}
      strokeWidth="1"
    />
    {/* Bottom rounded grinding head highlight */}
    <ellipse
      cx="15"
      cy="61"
      rx="7"
      ry="4"
      fill="#e2e8f0"
      stroke="#cbd5e1"
      strokeWidth="0.8"
    />
    {label && (
      <text
        x="15"
        y="35"
        textAnchor="middle"
        fontSize="5"
        fill="#64748b"
        transform="rotate(-90 15 35)"
      >
        {label}
      </text>
    )}
  </svg>
);


// ── Magnifying Glass ──────────────────────────────────────────────

const MagnifyingGlass: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 65,
  height = 85,
  label,
}) => (
  <svg width={width} height={height} viewBox="0 0 65 85" fill="none">
    <defs>
      <linearGradient id="lensGrad" x1="20%" y1="20%" x2="80%" y2="80%">
        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
        <stop offset="40%" stopColor="rgba(224, 242, 254, 0.3)" />
        <stop offset="100%" stopColor="rgba(186, 230, 253, 0.4)" />
      </linearGradient>
      <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* Handle angled downwards to the right */}
    <rect
      x="36"
      y="44"
      width="8"
      height="38"
      rx="3"
      transform="rotate(-40 36 44)"
      fill="url(#handleGrad)"
      stroke={highlighted ? '#2563eb' : '#334155'}
      strokeWidth="1.2"
    />
    {/* Ferrule / connector */}
    <rect
      x="34"
      y="41"
      width="6"
      height="6"
      rx="1"
      transform="rotate(-40 34 41)"
      fill="#cbd5e1"
      stroke="#94a3b8"
      strokeWidth="0.8"
    />
    {/* Outer metallic rim */}
    <circle
      cx="26"
      cy="26"
      r="22"
      fill="#f1f5f9"
      stroke={highlighted ? '#2563eb' : '#64748b'}
      strokeWidth="2.5"
    />
    {/* Inner lens */}
    <circle
      cx="26"
      cy="26"
      r="19.5"
      fill="url(#lensGrad)"
      stroke="#94a3b8"
      strokeWidth="0.8"
    />
    {/* Lens glare / highlight arc */}
    <path
      d="M 14 20 A 15 15 0 0 1 26 11"
      stroke="rgba(255, 255, 255, 0.85)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {label && (
      <text
        x="26"
        y="30"
        textAnchor="middle"
        fontSize="6"
        fill="#475569"
        fontWeight="600"
      >
        {label}
      </text>
    )}
  </svg>
);


// ── Filter Funnel ─────────────────────────────────────────────────

const FilterFunnel: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 60,
  height = 80,
  label,
}) => (
  <svg width={width} height={height} viewBox="0 0 60 80" fill="none">
    <defs>
      <linearGradient id="funnelGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.35)" />
        <stop offset="30%" stopColor="rgba(240, 249, 255, 0.15)" />
        <stop offset="70%" stopColor="rgba(224, 242, 254, 0.2)" />
        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
      </linearGradient>
    </defs>
    {/* Stem */}
    <path
      d="M 27 42 L 27 75 L 33 71 L 33 42 Z"
      fill="url(#funnelGlassGrad)"
      stroke={highlighted ? '#2563eb' : '#94a3b8'}
      strokeWidth={highlighted ? 1.8 : 1.2}
    />
    {/* Conical body */}
    <polygon
      points="5,10 55,10 33,42 27,42"
      fill="url(#funnelGlassGrad)"
      stroke={highlighted ? '#2563eb' : '#94a3b8'}
      strokeWidth={highlighted ? 1.8 : 1.2}
    />
    {/* Top rim ellipse */}
    <ellipse
      cx="30"
      cy="10"
      rx="25"
      ry="4"
      fill="rgba(255, 255, 255, 0.4)"
      stroke={highlighted ? '#2563eb' : '#94a3b8'}
      strokeWidth="1.2"
    />
    {/* Glass shine line */}
    <path
      d="M 12 13 L 28 39"
      stroke="rgba(255, 255, 255, 0.7)"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {label && (
      <text
        x="30"
        y="25"
        textAnchor="middle"
        fontSize="6"
        fill="#64748b"
        fontWeight="600"
      >
        {label}
      </text>
    )}
  </svg>
);


// ── Filter Paper ──────────────────────────────────────────────────

const FilterPaper: React.FC<ApparatusProps> = ({
  highlighted = false,
  width = 60,
  height = 60,
  label,
}) => (
  <svg width={width} height={height} viewBox="0 0 60 60" fill="none">
    <defs>
      <linearGradient id="filterPaperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    {/* Circular disc with slight 3D perspective / depth */}
    <circle
      cx="30"
      cy="30"
      r="26"
      fill="url(#filterPaperGrad)"
      stroke={highlighted ? '#2563eb' : '#cbd5e1'}
      strokeWidth={highlighted ? 2 : 1.2}
    />
    {/* Subtle fold lines (laboratory quadrant folding for funnel fitting) */}
    <line x1="30" y1="4" x2="30" y2="56" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="4" y1="30" x2="56" y2="30" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />
    {/* Center crease mark */}
    <circle cx="30" cy="30" r="1.5" fill="#cbd5e1" />
    {label && (
      <text
        x="30"
        y="42"
        textAnchor="middle"
        fontSize="6"
        fill="#64748b"
        fontWeight="600"
      >
        {label}
      </text>
    )}
  </svg>
);



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
  // Containers & Mixing
  ConicalFlask,
  Beaker,
  TestTube,
  EvaporatingDish,
  ChinaDish: EvaporatingDish,
  Mortar,
  Pestle,
  WatchGlass,
  VolumetricFlask,
  BODBottle,
  SpecificGravityBottle,
  MeasuringCylinder,

  // Transfer, Separation & Fluid Dynamics
  Burette: BuretteSVG,
  Pipette: PipetteSVG,
  Dropper: DropperBottle,
  ReagentBottle,
  GlassRod,
  IronNail,
  Matchstick,
  LaserPointer,
  LaserTorch: LaserPointer,
  Spatula,
  FilterFunnel,
  Funnel: FilterFunnel,
  FilterPaper,
  OstwaldViscometer,

  // Magnetic & Physical Testing
  HorseshoeMagnet,
  BarMagnet,
  Magnet: HorseshoeMagnet,
  MagnifyingGlass,

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
