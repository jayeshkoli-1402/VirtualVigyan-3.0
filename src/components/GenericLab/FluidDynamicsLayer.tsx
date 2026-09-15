/**
 * ═══════════════════════════════════════════════════════════════════
 *  FluidDynamicsLayer — High-Fidelity Physics & Pouring Simulation
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Renders rich visual fluid mechanics during lab interactions:
 *  - Tilted source container pouring animation
 *  - Laminar liquid stream with gravity arc & velocity streaks
 *  - Accelerated falling fluid droplets
 *  - Surface ripple impact waves on receiving vessels
 *  - Rising micro-bubbles and effervescence
 *  - Thermal convection steam wisps during heating
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import type { ExperimentConfig, ExperimentState } from '../../engine/experimentConfig';
import { getApparatusComponent } from '../../apparatus';

type FluidDynamicsLayerProps = {
  config: ExperimentConfig;
  state: ExperimentState;
  solutionColor: string;
  benchScale: number;
};

export const FluidDynamicsLayer: React.FC<FluidDynamicsLayerProps> = ({
  config,
  state,
  solutionColor,
  benchScale,
}) => {
  // Find currently active animation
  const activeAnimationEntries = Object.entries(state.animations).filter(([, isActive]) => isActive);
  if (activeAnimationEntries.length === 0) return null;

  const [activeFlag] = activeAnimationEntries[0];

  // Find the interaction corresponding to this animation flag
  const interaction = config.interactions.find(
    (i) => i.animation?.animatingFlag === activeFlag
  );

  if (!interaction || !interaction.animation) return null;

  const animType = interaction.animation.type;
  const sourceApparatusId = interaction.trigger.type === 'drop' ? interaction.trigger.source : null;
  const targetZoneId = interaction.trigger.type === 'drop' ? interaction.trigger.target : null;

  const sourceApparatus = sourceApparatusId
    ? config.apparatus.find((a) => a.id === sourceApparatusId)
    : null;
  const targetZone = targetZoneId
    ? config.dropZones.find((z) => z.id === targetZoneId)
    : null;

  const SourceComponent = sourceApparatus ? getApparatusComponent(sourceApparatus.component) : null;
  const sourceProps = (sourceApparatus ? state.apparatusProps[sourceApparatus.id] : {}) ?? {};
  const fluidColor =
    (sourceProps.liquidColor as string | undefined) ??
    (sourceApparatus?.initialProps?.liquidColor as string | undefined) ??
    solutionColor ??
    'rgba(56, 189, 248, 0.8)';

  // Target position on bench
  const targetX = targetZone ? targetZone.position.x : 50;
  const targetY = targetZone ? targetZone.position.y : 65;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 25,
        overflow: 'visible',
      }}
    >
      {/* ── 1A. EXACT 2-DROP DISPENSER / DROPPER ANIMATION (Indicator Dropper Bottle) ── */}
      {animType === 'drip' && (
        <div
          style={{
            position: 'absolute',
            left: `${targetX}%`,
            top: `${targetY}%`,
            transform: 'translate(-50%, -100%)',
            width: 0,
            height: 0,
            overflow: 'visible',
          }}
        >
          {/* Vertical Dropper Dispenser hovering above target */}
          {SourceComponent && sourceApparatus && (
            <div
              style={{
                position: 'absolute',
                left: -20 * benchScale,
                top: -110 * benchScale,
                animation: 'dropperHover 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                filter: 'drop-shadow(0 12px 16px rgba(0,0,0,0.35))',
              }}
            >
              <div style={{ transform: `scale(${benchScale * 0.95})` }}>
                <SourceComponent
                  id={`dripping-${sourceApparatus.id}`}
                  liquidColor={fluidColor}
                  liquidLevel={0.75}
                  flags={state.flags}
                  variables={state.variables}
                  {...sourceProps}
                />
              </div>
            </div>
          )}

          {/* SVG for EXACTLY 2 Discrete Liquid Drops and Ripples */}
          <svg
            width={240 * benchScale}
            height={260 * benchScale}
            viewBox="0 0 240 260"
            style={{
              position: 'absolute',
              left: -120 * benchScale,
              top: -130 * benchScale,
              overflow: 'visible',
            }}
          >
            <defs>
              <radialGradient id="dropShimmer" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="40%" stopColor={fluidColor} stopOpacity="0.95" />
                <stop offset="100%" stopColor={fluidColor} stopOpacity="1" />
              </radialGradient>
            </defs>

            {/* DROP 1: Exactly First Drop (forms at 0.15s, falls 0.3s -> 0.75s, lands at y=190) */}
            <ellipse cx="120" cy="50" rx="2.5" ry="3.8" fill="url(#dropShimmer)">
              <animate attributeName="cy" values="50;50;190" keyTimes="0;0.14;0.45" dur="2.2s" fill="freeze" />
              <animate attributeName="ry" values="1.8;3.5;5.0" keyTimes="0;0.14;0.45" dur="2.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.44;0.46" dur="2.2s" fill="freeze" />
            </ellipse>
            {/* Surface Ripple 1 */}
            <ellipse cx="120" cy="190" rx="0" ry="0" fill="none" stroke={fluidColor} strokeWidth="1.5">
              <animate attributeName="rx" values="0;0;18;24" keyTimes="0;0.45;0.65;0.75" dur="2.2s" fill="freeze" />
              <animate attributeName="ry" values="0;0;4.5;6.0" keyTimes="0;0.45;0.65;0.75" dur="2.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.44;0.46;0.75" dur="2.2s" fill="freeze" />
            </ellipse>

            {/* DROP 2: Exactly Second Drop (forms at 1.0s, falls 1.15s -> 1.60s, lands at y=190) */}
            <ellipse cx="120" cy="50" rx="2.5" ry="3.8" fill="url(#dropShimmer)">
              <animate attributeName="cy" values="50;50;190" keyTimes="0;0.52;0.82" dur="2.2s" fill="freeze" />
              <animate attributeName="ry" values="1.8;3.5;5.0" keyTimes="0;0.52;0.82" dur="2.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.48;0.52;0.81;0.83" dur="2.2s" fill="freeze" />
            </ellipse>
            {/* Surface Ripple 2 */}
            <ellipse cx="120" cy="190" rx="0" ry="0" fill="none" stroke={fluidColor} strokeWidth="1.5">
              <animate attributeName="rx" values="0;0;18;24" keyTimes="0;0.82;0.94;1.0" dur="2.2s" fill="freeze" />
              <animate attributeName="ry" values="0;0;4.5;6.0" keyTimes="0;0.82;0.94;1.0" dur="2.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.81;0.83;1.0" dur="2.2s" fill="freeze" />
            </ellipse>

            {/* Faint indicator diffusion bloom at surface */}
            <ellipse cx="120" cy="190" rx="0" ry="0" fill={fluidColor} opacity="0">
              <animate attributeName="rx" values="0;0;12;26" keyTimes="0;0.45;0.75;1.0" dur="2.2s" fill="freeze" />
              <animate attributeName="ry" values="0;0;4;8" keyTimes="0;0.45;0.75;1.0" dur="2.2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0;0.4;0.1" keyTimes="0;0.45;0.75;1.0" dur="2.2s" fill="freeze" />
            </ellipse>
          </svg>
        </div>
      )}

      {/* ── 1B. POURING / DISPENSING ANIMATION (Tilted Source + Laminar Stream + Droplets + Ripples) ── */}
      {(animType === 'pour' || animType === 'dispense') && (() => {
        const isTubeOpening = targetZoneId?.includes('visco') || targetZoneId?.includes('limb') || targetZoneId?.includes('tube');
        const streamEndY = isTubeOpening ? 130 : 180;
        const streamControlX = isTubeOpening ? 114 : 110;
        const streamControlY = isTubeOpening ? 108 : 130;
        // Bottle mouth is at SVG (25, 20) in a 50×90 viewBox, scaled by benchScale*0.92
        // So mouth pixel offset from div origin = (25*0.92, 20*0.92) = (23, 18.4)
        const mouthPixelX = 23;   // 25 * 0.92
        const mouthPixelY = 18.4; // 20 * 0.92
        // Position the bottle so its mouth lands at the stream start in container-space
        // Stream SVG origin in container = (-120*bs, -130*bs), so SVG coord (X,Y) → container (X-120)*bs, (Y-130)*bs
        // We want mouth container pos to equal stream start container pos
        const streamStartX = isTubeOpening ? 110 : 104;
        const streamStartY = isTubeOpening ? 88 : 80;
        const bottleLeft = ((streamStartX - 120) - mouthPixelX) * benchScale;
        const bottleTop = ((streamStartY - 130) - mouthPixelY) * benchScale;

        return (
          <div
            style={{
              position: 'absolute',
              left: `${targetX}%`,
              top: `${targetY}%`,
              transform: 'translate(-50%, -100%)',
              width: 0,
              height: 0,
              overflow: 'visible',
            }}
          >
            {/* Tilted Source Reagent Dispenser - pivots precisely around its mouth */}
            {SourceComponent && sourceApparatus && (
              <div
                style={{
                  position: 'absolute',
                  left: bottleLeft,
                  top: bottleTop,
                  transformOrigin: `${mouthPixelX * benchScale}px ${mouthPixelY * benchScale}px`,
                  animation: 'pourTilt 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                  filter: 'drop-shadow(0 12px 16px rgba(0,0,0,0.32))',
                }}
              >
                <div style={{ transform: `scale(${benchScale * 0.92})` }}>
                  <SourceComponent
                    id={`pouring-${sourceApparatus.id}`}
                    label={(sourceProps.label as string | undefined) ?? (sourceApparatus.initialProps?.label as string | undefined) ?? sourceApparatus.label}
                    liquidColor={fluidColor}
                    liquidLevel={0.75}
                    flags={state.flags}
                    variables={state.variables}
                    {...sourceProps}
                  />
                </div>
              </div>
            )}

            {/* SVG Laminar Stream & Droplets & Ripples */}
            <svg
              width={240 * benchScale}
              height={260 * benchScale}
              viewBox="0 0 240 260"
              style={{
                position: 'absolute',
                left: -120 * benchScale,
                top: -130 * benchScale,
                overflow: 'visible',
                animation: 'streamFade 2.2s ease-in-out forwards',
              }}
            >
              <defs>
                {/* Fluid stream depth gradient */}
                <linearGradient id="fluidStreamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fluidColor} stopOpacity="0.95" />
                  <stop offset="70%" stopColor={fluidColor} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={fluidColor} stopOpacity="0.98" />
                </linearGradient>

                {/* Shimmer light streak */}
                <linearGradient id="streamShimmer" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>

                {/* Filter for glowing liquid stream */}
                <filter id="liquidGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Continuous Curved Laminar Fluid Stream originating from exact bottle mouth */}
              <g filter="url(#liquidGlow)">
                {/* Main liquid stream from mouth to receiving opening */}
                <path
                  d={`M ${streamStartX} ${streamStartY} Q ${streamControlX} ${streamControlY} 120 ${streamEndY}`}
                  stroke="url(#fluidStreamGrad)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Internal specular highlight streak */}
                <path
                  d={`M ${streamStartX + 0.5} ${streamStartY + 1} Q ${streamControlX + 0.5} ${streamControlY} 120.5 ${streamEndY}`}
                  stroke="url(#streamShimmer)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  fill="none"
                />
              </g>

              {/* Liquid bead at bottle mouth forming the stream origin */}
              <ellipse
                cx={streamStartX}
                cy={streamStartY}
                rx={4}
                ry={2.2}
                fill={fluidColor}
                opacity={0.92}
              />

              {/* Gravity-Accelerated Liquid Droplets along the stream */}
              <circle cx={streamStartX + 3} cy={streamStartY + 15} r={2.8} fill={fluidColor}>
                <animate attributeName="cy" values={`${streamStartY + 10};${streamEndY}`} dur="0.42s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;1;0.9" dur="0.42s" repeatCount="indefinite" />
              </circle>

              <circle cx="120" cy={streamStartY + 25} r={2.2} fill={fluidColor}>
                <animate attributeName="cy" values={`${streamStartY + 20};${streamEndY + 2}`} dur="0.36s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;1;0.9" dur="0.36s" repeatCount="indefinite" />
              </circle>

              {/* Surface Impact Ripple Waves in receiving opening */}
              <g transform={`translate(120, ${streamEndY + 2})`}>
                {/* Ripple 1 */}
                <ellipse cx="0" cy="0" rx="12" ry="3.5" fill="none" stroke={fluidColor} strokeWidth="1.5" opacity="0.8">
                  <animate attributeName="rx" values="3;20" dur="0.8s" repeatCount="indefinite" />
                  <animate attributeName="ry" values="1;5" dur="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0" dur="0.8s" repeatCount="indefinite" />
                  <animate attributeName="stroke-width" values="2;0.5" dur="0.8s" repeatCount="indefinite" />
                </ellipse>

                {/* Ripple 2 */}
                <ellipse cx="0" cy="0" rx="7" ry="2" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" opacity="0.6">
                  <animate attributeName="rx" values="2;14" dur="0.8s" begin="0.3s" repeatCount="indefinite" />
                  <animate attributeName="ry" values="1;3.5" dur="0.8s" begin="0.3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="0.8s" begin="0.3s" repeatCount="indefinite" />
                </ellipse>

                {/* Impact splash beads */}
                <circle cx="-4" cy="-2" r="1.4" fill={fluidColor}>
                  <animate attributeName="cy" values="0;-8;0" dur="0.55s" repeatCount="indefinite" />
                  <animate attributeName="cx" values="0;-8;-12" dur="0.55s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.8;0" dur="0.55s" repeatCount="indefinite" />
                </circle>
                <circle cx="4" cy="-2" r="1.4" fill={fluidColor}>
                  <animate attributeName="cy" values="0;-8;0" dur="0.5s" begin="0.15s" repeatCount="indefinite" />
                  <animate attributeName="cx" values="0;8;12" dur="0.5s" begin="0.15s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.8;0" dur="0.5s" begin="0.15s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>
        );
      })()}

      {/* ── 2. TITRATION JET STREAM & DROPLET ACCELERATION ANIMATION (Titrant from Burette) ── */}
      {(animType === 'titrate' || (animType === 'color-change' && activeFlag === 'isTitrating')) && (
        <div
          style={{
            position: 'absolute',
            left: `${targetX}%`,
            top: `${targetY}%`,
            transform: 'translate(-50%, -100%)',
            width: 0,
            height: 0,
            overflow: 'visible',
          }}
        >
          {/* Tilted Source Reagent Dispenser if dragging a titrant container */}
          {SourceComponent && sourceApparatus && sourceApparatus.component !== 'Burette' && sourceApparatus.component !== 'BuretteStand' && (
            <div
              style={{
                position: 'absolute',
                left: -70 * benchScale,
                top: -120 * benchScale,
                transformOrigin: 'bottom right',
                animation: 'pourTilt 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.35))',
              }}
            >
              <div style={{ transform: `scale(${benchScale * 0.92})` }}>
                <SourceComponent
                  id={`titrating-${sourceApparatus.id}`}
                  liquidColor={fluidColor}
                  liquidLevel={0.75}
                  flags={state.flags}
                  variables={state.variables}
                  {...sourceProps}
                />
              </div>
            </div>
          )}

          {/* SVG Vertical Burette Jet Stream & Rapid Droplets & Meniscus Ripples */}
          <svg
            width={240 * benchScale}
            height={260 * benchScale}
            viewBox="0 0 240 260"
            style={{
              position: 'absolute',
              left: -120 * benchScale,
              top: -130 * benchScale,
              overflow: 'visible',
              animation: 'streamFade 2.2s ease-in-out forwards',
            }}
          >
            <defs>
              <linearGradient id="titrantStreamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fluidColor} stopOpacity="0.95" />
                <stop offset="60%" stopColor={fluidColor} stopOpacity="0.9" />
                <stop offset="100%" stopColor={fluidColor} stopOpacity="0.98" />
              </linearGradient>

              <filter id="titrantGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Vertical Laminar Titrant Jet Stream flowing from burette tip (y=40) down to liquid surface (y=190) */}
            <g filter="url(#titrantGlow)">
              <line
                x1="120"
                y1="35"
                x2="120"
                y2="190"
                stroke="url(#titrantStreamGrad)"
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              <line
                x1="120"
                y1="35"
                x2="120"
                y2="190"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth={1.2}
                strokeLinecap="round"
              />
            </g>

            {/* Rapid Discrete Accelerated Droplets */}
            <circle cx="120" cy="70" r={2.8} fill={fluidColor}>
              <animate attributeName="cy" values="35;190" dur="0.28s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;1;0.8" dur="0.28s" repeatCount="indefinite" />
            </circle>
            <circle cx="120" cy="115" r={2.5} fill={fluidColor}>
              <animate attributeName="cy" values="35;190" dur="0.32s" begin="0.12s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;1;0.8" dur="0.32s" begin="0.12s" repeatCount="indefinite" />
            </circle>
            <circle cx="120" cy="155" r={2.6} fill={fluidColor}>
              <animate attributeName="cy" values="35;190" dur="0.29s" begin="0.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;1;0.8" dur="0.29s" begin="0.2s" repeatCount="indefinite" />
            </circle>

            {/* Surface Impact Ripple Waves on receiving flask liquid */}
            <g transform="translate(120, 190)">
              {/* Ripple 1 */}
              <ellipse cx="0" cy="0" rx="16" ry="4.5" fill="none" stroke={fluidColor} strokeWidth="1.6" opacity="0.9">
                <animate attributeName="rx" values="3;28" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="ry" values="1;7" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1.8;0.4" dur="0.6s" repeatCount="indefinite" />
              </ellipse>

              {/* Ripple 2 */}
              <ellipse cx="0" cy="0" rx="10" ry="3" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" opacity="0.7">
                <animate attributeName="rx" values="2;20" dur="0.6s" begin="0.25s" repeatCount="indefinite" />
                <animate attributeName="ry" values="0.8;5" dur="0.6s" begin="0.25s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="0.6s" begin="0.25s" repeatCount="indefinite" />
              </ellipse>

              {/* Splash droplets */}
              <circle cx="-5" cy="-3" r="1.5" fill={fluidColor}>
                <animate attributeName="cy" values="0;-10;0" dur="0.45s" repeatCount="indefinite" />
                <animate attributeName="cx" values="0;-12;-14" dur="0.45s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.7;0" dur="0.45s" repeatCount="indefinite" />
              </circle>
              <circle cx="5" cy="-3" r="1.5" fill={fluidColor}>
                <animate attributeName="cy" values="0;-11;0" dur="0.42s" begin="0.1s" repeatCount="indefinite" />
                <animate attributeName="cx" values="0;12;15" dur="0.42s" begin="0.1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.7;0" dur="0.42s" begin="0.1s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>
      )}

      {/* ── 3. SUCTION / MENISCUS DRAWING ANIMATION (Viscometer / Pipette Bulb) ── */}
      {animType === 'suction' && (() => {
        const bulbScale = Math.min(benchScale * 0.68, 1.05);
        return (
          <div
            style={{
              position: 'absolute',
              left: `${targetX}%`,
              top: `${targetY}%`,
              width: 0,
              height: 0,
              overflow: 'visible',
              zIndex: 30,
            }}
          >
            {/* Dedicated Laboratory Suction Bulb & Flexible Tubing Assembly */}
            <div
              style={{
                position: 'absolute',
                left: -55 * bulbScale,
                top: -104 * bulbScale,
                transformOrigin: `${55 * bulbScale}px ${104 * bulbScale}px`,
                animation: 'suctionPulse 2.0s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.28))',
                overflow: 'visible',
              }}
            >
              <svg
                width={170 * bulbScale}
                height={115 * bulbScale}
                viewBox="0 0 170 115"
                fill="none"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  {/* Rubber bulb 3D shading */}
                  <radialGradient id="suctionRubberGrad" cx="36%" cy="28%" r="65%">
                    <stop offset="0%" stopColor="#fca5a5" />
                    <stop offset="25%" stopColor="#ef4444" />
                    <stop offset="60%" stopColor="#dc2626" />
                    <stop offset="90%" stopColor="#991b1b" />
                    <stop offset="100%" stopColor="#7f1d1d" />
                  </radialGradient>
                  {/* Silicone rubber tube gradient */}
                  <linearGradient id="suctionTubeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(251, 146, 60, 0.95)" />
                    <stop offset="40%" stopColor="rgba(254, 215, 170, 0.9)" />
                    <stop offset="100%" stopColor="rgba(234, 88, 12, 0.95)" />
                  </linearGradient>
                </defs>

                {/* ── Top Pinch Valve (narrow cylindrical tip at very top) ── */}
                <rect x="51.5" y="6" width="7" height="10" rx="2.5" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
                <line x1="50.5" y1="11" x2="59.5" y2="11" stroke="#fca5a5" strokeWidth="1" />
                <line x1="50.5" y1="12" x2="59.5" y2="12" stroke="#500724" strokeWidth="1" />

                {/* ── Main Rubber Suction Bulb (large, recognizable pear/egg shape) ── */}
                <ellipse cx="55" cy="38" rx="24" ry="25" fill="url(#suctionRubberGrad)" stroke="#7f1d1d" strokeWidth="1.8" />
                {/* Surface specular highlight arc */}
                <path d="M 40 22 C 34 29 34 46 41 55" stroke="rgba(255,255,255,0.6)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                {/* Secondary highlight */}
                <path d="M 44 24 C 39 31 39 44 43 51" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                {/* Shadow depth arc */}
                <path d="M 68 28 C 74 36 74 48 67 56" stroke="rgba(0,0,0,0.22)" strokeWidth="1.8" strokeLinecap="round" fill="none" />

                {/* ── Lower Collar / Ferrule (metal connector between bulb and tube) ── */}
                <rect x="49" y="60" width="12" height="8" rx="2" fill="#7f1d1d" stroke="#500724" strokeWidth="1.2" />
                <line x1="48" y1="63" x2="62" y2="63" stroke="#991b1b" strokeWidth="1.2" />
                <line x1="48" y1="65.5" x2="62" y2="65.5" stroke="#fca5a5" strokeWidth="0.8" opacity="0.7" />

                {/* ── Flexible Silicone Rubber Suction Tube ── */}
                <path
                  d="M 55 67 L 55 98"
                  stroke="url(#suctionTubeGrad)"
                  strokeWidth="8.5"
                  strokeLinecap="round"
                />
                {/* Tube specular center highlight */}
                <path
                  d="M 54.5 68 L 54.5 97"
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />

                {/* ── Upward suction flow dashes inside tube ── */}
                <line x1="55" y1="98" x2="55" y2="68" stroke="rgba(255,255,255,0.95)" strokeWidth="2.4" strokeDasharray="4 5">
                  <animate attributeName="stroke-dashoffset" values="18;0" dur="0.32s" repeatCount="indefinite" />
                </line>

                {/* ── Glass Adapter Sleeve (insertion into capillary limb mouth) ── */}
                <rect x="49" y="96" width="12" height="9" rx="2.5" fill="rgba(226, 232, 240, 0.92)" stroke="#475569" strokeWidth="1.3" />
                <line x1="47.5" y1="99" x2="62.5" y2="99" stroke="#64748b" strokeWidth="1.4" />
                <rect x="50" y="102" width="10" height="4" rx="1.5" fill="#334155" stroke="#1e293b" strokeWidth="1" />

                {/* ── Prominent Label near the Red Bulb ── */}
                <g transform="translate(86, 28)">
                  <line x1="-8" y1="10" x2="0" y2="10" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="2 1.5" />
                  <rect x="0" y="0" width="76" height="20" rx="5" fill="rgba(255, 255, 255, 0.96)" stroke="#ef4444" strokeWidth="1.2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.12))" />
                  <circle cx="9" cy="10" r="3.5" fill="#ef4444" />
                  <text x="17" y="13.5" fontSize="8.5" fontWeight="800" fill="#dc2626" fontFamily="var(--font-sans)" letterSpacing="0.02em">Suction Bulb</text>
                </g>
              </svg>
            </div>
          </div>
        );
      })()}

      {/* ── 4. HEATING & CONVECTION STEAM VAPORS ── */}
      {animType === 'heat' && (
        <div
          style={{
            position: 'absolute',
            left: `${targetX}%`,
            top: `${targetY - 15}%`,
            transform: 'translate(-50%, -100%)',
            width: 100 * benchScale,
            height: 120 * benchScale,
            pointerEvents: 'none',
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 120">
            {/* Steam plume 1 */}
            <path d="M 40 110 Q 30 70 45 40 Q 55 20 42 0" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeDasharray="4 4" fill="none">
              <animate attributeName="stroke-dashoffset" values="16;0" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.8;0" dur="1.4s" repeatCount="indefinite" />
            </path>
            {/* Steam plume 2 */}
            <path d="M 60 110 Q 72 70 58 40 Q 48 20 62 0" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeDasharray="4 4" fill="none">
              <animate attributeName="stroke-dashoffset" values="16;0" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.9;0" dur="1.2s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      )}

      {/* Embedded keyframe styles for smooth physics */}
      <style>{`
        @keyframes pourTilt {
          0% {
            transform: rotate(0deg);
            opacity: 0;
          }
          15% {
            transform: rotate(38deg);
            opacity: 1;
          }
          80% {
            transform: rotate(44deg);
            opacity: 1;
          }
          92% {
            transform: rotate(15deg);
            opacity: 0.9;
          }
          100% {
            transform: rotate(0deg);
            opacity: 0;
          }
        }

        [id^="pouring-"] #reagent-liquid rect {
          animation: bottleDrain 2.2s ease-in-out forwards;
          transform-origin: bottom;
        }

        @keyframes bottleDrain {
          0% {
            transform: scaleY(1);
          }
          20% {
            transform: scaleY(0.95);
          }
          75% {
            transform: scaleY(0.2);
          }
          100% {
            transform: scaleY(0.2);
          }
        }

        @keyframes viscoFillIn {
          0% {
            opacity: 0.2;
            transform: scaleY(0.15);
            transform-origin: bottom;
          }
          40% {
            opacity: 0.6;
            transform: scaleY(0.5);
            transform-origin: bottom;
          }
          100% {
            opacity: 0.92;
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }

        @keyframes streamFade {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          82% {
            opacity: 1;
          }
          95% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes suctionPulse {
          0% {
            transform: scale(0.98);
            opacity: 0;
          }
          15% {
            transform: scale(1);
            opacity: 1;
          }
          35% {
            transform: scale(0.94);
            opacity: 1;
          }
          75% {
            transform: scale(0.94);
            opacity: 1;
          }
          90% {
            transform: scale(1);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FluidDynamicsLayer;
