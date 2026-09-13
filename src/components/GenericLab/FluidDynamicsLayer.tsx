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
      {(animType === 'pour' || animType === 'dispense') && (
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
          {/* Tilted Source Reagent Dispenser */}
          {SourceComponent && sourceApparatus && (
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
                  id={`pouring-${sourceApparatus.id}`}
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

            {/* Continuous Curved Laminar Fluid Stream */}
            <g filter="url(#liquidGlow)">
              <path
                d="M 85 45 Q 110 95 120 190"
                stroke="url(#fluidStreamGrad)"
                strokeWidth={7}
                strokeLinecap="round"
                fill="none"
              />
              {/* Internal high-velocity fluid streak */}
              <path
                d="M 86 46 Q 110 95 119 190"
                stroke="url(#streamShimmer)"
                strokeWidth={2.5}
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Gravity-Accelerated Liquid Droplets */}
            <circle cx="120" cy="110" r={3.5} fill={fluidColor}>
              <animate attributeName="cy" values="60;190" dur="0.45s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;1;0.9" dur="0.45s" repeatCount="indefinite" />
            </circle>

            <circle cx="121" cy="150" r={3} fill={fluidColor}>
              <animate attributeName="cy" values="90;192" dur="0.38s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.9" dur="0.38s" repeatCount="indefinite" />
            </circle>

            {/* Surface Impact Ripple Waves in receiving vessel */}
            <g transform="translate(120, 192)">
              {/* Ripple 1 */}
              <ellipse cx="0" cy="0" rx="14" ry="4" fill="none" stroke={fluidColor} strokeWidth="1.5" opacity="0.8">
                <animate attributeName="rx" values="4;30" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="ry" values="1.5;7.5" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="2;0.5" dur="0.8s" repeatCount="indefinite" />
              </ellipse>

              {/* Ripple 2 */}
              <ellipse cx="0" cy="0" rx="8" ry="2.5" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" opacity="0.6">
                <animate attributeName="rx" values="2;24" dur="0.8s" begin="0.3s" repeatCount="indefinite" />
                <animate attributeName="ry" values="1;6" dur="0.8s" begin="0.3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="0.8s" begin="0.3s" repeatCount="indefinite" />
              </ellipse>

              {/* Impact splash beads */}
              <circle cx="-6" cy="-4" r="1.8" fill={fluidColor}>
                <animate attributeName="cy" values="0;-12;0" dur="0.55s" repeatCount="indefinite" />
                <animate attributeName="cx" values="0;-14;-16" dur="0.55s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.8;0" dur="0.55s" repeatCount="indefinite" />
              </circle>
              <circle cx="6" cy="-4" r="1.8" fill={fluidColor}>
                <animate attributeName="cy" values="0;-14;0" dur="0.5s" begin="0.15s" repeatCount="indefinite" />
                <animate attributeName="cx" values="0;14;18" dur="0.5s" begin="0.15s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.8;0" dur="0.5s" begin="0.15s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>
      )}

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
      {animType === 'suction' && (
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
          {SourceComponent && sourceApparatus && (
            <div
              style={{
                position: 'absolute',
                left: -20 * benchScale,
                top: -80 * benchScale,
                animation: 'suctionPulse 2.0s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.3))',
              }}
            >
              <div style={{ transform: `scale(${benchScale * 0.95})` }}>
                <SourceComponent
                  id={`suction-${sourceApparatus.id}`}
                  liquidColor={fluidColor}
                  flags={state.flags}
                  variables={state.variables}
                  {...sourceProps}
                />
              </div>
            </div>
          )}
        </div>
      )}

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
            transform: rotate(0deg) translate(0, 0);
            opacity: 0;
          }
          15% {
            transform: rotate(-38deg) translate(-10px, -10px);
            opacity: 1;
          }
          80% {
            transform: rotate(-45deg) translate(-14px, -14px);
            opacity: 1;
          }
          92% {
            transform: rotate(-18deg) translate(-5px, -5px);
            opacity: 0.9;
          }
          100% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 0;
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
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          20% {
            transform: translate(0, 5px) scale(0.95);
            opacity: 1;
          }
          75% {
            transform: translate(0, 5px) scale(0.92);
            opacity: 1;
          }
          90% {
            transform: translate(0, 0) scale(1);
            opacity: 0.9;
          }
          100% {
            transform: translate(0, -10px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FluidDynamicsLayer;
