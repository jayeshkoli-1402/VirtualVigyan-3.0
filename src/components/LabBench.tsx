import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { TitrationState, TitrationAction } from '../engine/titrationState';
import { Step, DROP_ZONES } from '../engine/titrationState';
import { getFlaskColor } from '../engine/chemistryRules';
import { canOperateStopcock } from '../engine/validation';
import Burette from './Burette';
import Flask from './Flask';
import StopcockControl from './StopcockControl';
import Pipette from './Pipette';

interface LabBenchProps {
  state: TitrationState;
  dispatch: React.Dispatch<TitrationAction>;
  activeDropZone: string | null;
}

const LabBench: React.FC<LabBenchProps> = ({ state, dispatch, activeDropZone }) => {
  const [isSwirling, setIsSwirling] = React.useState(false);
  const [isStirring, setIsStirring] = React.useState(false);
  const flaskColor = getFlaskColor(state.volumeAdded, state.hasIndicator);
  const stopcockEnabled = canOperateStopcock(state).allowed && state.step === Step.TITRATING;

  return (
    <div
      id="lab-bench"
      className="glass-card"
      style={{ padding: '12px', overflow: 'hidden', flex: 1, position: 'relative' }}
    >
      {/* Action Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 35,
          display: 'flex',
          gap: 6,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '4px 6px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <button
          type="button"
          id="btn-shake-flask"
          onClick={() => setIsSwirling(prev => !prev)}
          title="Shake & swirl the conical flask"
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: isSwirling ? '1px solid var(--accent-blue)' : '1px solid var(--border)',
            background: isSwirling ? 'var(--accent-blue)' : 'var(--bg-secondary)',
            color: isSwirling ? '#ffffff' : 'var(--text-secondary)',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '0.85rem', display: 'inline-block', animation: isSwirling ? 'spinBarRapid 1s linear infinite' : 'none' }}>🔄</span>
          <span>{isSwirling ? 'Swirling' : 'Shake'}</span>
        </button>

        <button
          type="button"
          id="btn-stir-solution"
          onClick={() => setIsStirring(prev => !prev)}
          title="Toggle magnetic stirring"
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: isStirring ? '1px solid var(--accent-green)' : '1px solid var(--border)',
            background: isStirring ? 'var(--accent-green)' : 'var(--bg-secondary)',
            color: isStirring ? '#ffffff' : 'var(--text-secondary)',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '0.85rem', display: 'inline-block', animation: isStirring ? 'spinBarRapid 0.4s linear infinite' : 'none' }}>🌀</span>
          <span>{isStirring ? 'Stirring' : 'Stir'}</span>
        </button>
      </div>
      <svg
        viewBox="0 0 280 420"
        width="100%"
        height="100%"
        style={{
          maxHeight: '75vh',
          display: 'block',
          margin: '0 auto',
        }}
        aria-label="Titration lab bench with retort stand, drop zones for apparatus"
      >
        <defs>
          {/* Metal gradient for retort stand */}
          <linearGradient id="metalGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(100, 116, 139, 0.6)" />
            <stop offset="40%" stopColor="rgba(148, 163, 184, 0.5)" />
            <stop offset="60%" stopColor="rgba(148, 163, 184, 0.4)" />
            <stop offset="100%" stopColor="rgba(100, 116, 139, 0.5)" />
          </linearGradient>

          {/* Bench wood gradient */}
          <linearGradient id="benchGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(120, 90, 60, 0.5)" />
            <stop offset="100%" stopColor="rgba(80, 55, 35, 0.6)" />
          </linearGradient>
        </defs>

        {/* Lab bench surface */}
        <rect x={0} y={392} width={280} height={28} rx={4} fill="url(#benchGradient)" stroke="rgba(148, 163, 184, 0.15)" strokeWidth={0.5} />
        <rect x={0} y={392} width={280} height={2} rx={1} fill="rgba(255, 255, 255, 0.04)" />

        {/* Retort stand - vertical pole */}
        <rect x={75} y={10} width={4} height={320} rx={2} fill="url(#metalGradient)" opacity={0.42} />

        {/* Retort stand - base */}
        <rect x={40} y={320} width={80} height={6} rx={3} fill="url(#metalGradient)" opacity={0.42} />

        {/* Clamp (visible when burette is mounted) */}
        {state.buretteMounted && (
          <path
            d="M 79 40 Q 100 40 110 38 L 128 38 L 128 48 L 110 48 Q 100 46 79 46 Z"
            fill="url(#metalGradient)"
            opacity={0.5}
          />
        )}

        {/* ── Drop Zone: Clamp (burette) ── */}
        {!state.buretteMounted && (
          <DropZoneOverlay
            zoneId={DROP_ZONES.CLAMP}
            x={115} y={25} width={50} height={270}
            label="Burette"
            isActive={activeDropZone === DROP_ZONES.CLAMP}
            step={state.step}
            targetStep={Step.SETUP_STAND}
          />
        )}

        {/* ── Drop Zone: Base (flask) ── */}
        {!state.flaskPlaced && (
          <DropZoneOverlay
            zoneId={DROP_ZONES.BASE}
            x={90} y={300} width={100} height={92}
            label="Conical Flask"
            isActive={activeDropZone === DROP_ZONES.BASE}
            step={state.step}
            targetStep={Step.SETUP_STAND}
          />
        )}

        {/* ── Drop Zone: Burette top (NaOH) ── */}
        {state.buretteMounted && !state.buretteFilled && (
          <DropZoneOverlay
            zoneId={DROP_ZONES.BURETTE_TOP}
            x={115} y={8} width={50} height={32}
            label="NaOH Reagent"
            isActive={activeDropZone === DROP_ZONES.BURETTE_TOP}
            step={state.step}
            targetStep={Step.FILL_BURETTE}
          />
        )}

        {/* ── Drop Zone: Flask (pipette dispense / indicator) ── */}
        {state.flaskPlaced && (
          <DropZoneOverlay
            zoneId={DROP_ZONES.FLASK_ZONE}
            x={110} y={292} width={60} height={52}
            label={!state.acidMeasured ? 'Pipette' : !state.hasIndicator ? 'Indicator' : ''}
            isActive={activeDropZone === DROP_ZONES.FLASK_ZONE}
            step={state.step}
            targetStep={!state.acidMeasured ? Step.MEASURE_ACID : Step.ADD_INDICATOR}
            hidden={state.acidMeasured && state.hasIndicator}
          />
        )}

        {/* ── Drop Zone: HCl Bottle placement onto bench ── */}
        {state.step === Step.MEASURE_ACID && !state.hclPlaced && (
          <DropZoneOverlay
            zoneId={DROP_ZONES.HCL_BENCH_ZONE}
            x={8} y={340} width={58} height={50}
            label="HCl Stock"
            isActive={activeDropZone === DROP_ZONES.HCL_BENCH_ZONE}
            step={state.step}
            targetStep={Step.MEASURE_ACID}
          />
        )}

        {/* ── Placed HCl bottle on bench ── */}
        {state.hclPlaced && !state.acidMeasured && (
          <g>
            {/* HCl bottle graphic */}
            <rect x={20} y={356} width={32} height={34} rx={4} fill="#78350f" stroke="#451a03" strokeWidth={1} />
            <rect x={29} y={348} width={14} height={9} rx={2} fill="#451a03" stroke="#292524" strokeWidth={0.8} />
            <rect x={22} y={362} width={28} height={22} rx={2} fill="#ffffff" stroke="#e2e8f0" strokeWidth={0.8} />
            <text x={36} y={374} textAnchor="middle" fill="#dc2626" fontSize="6.5" fontFamily="var(--font-mono)" fontWeight={700}>HCl</text>
            <text x={36} y={381} textAnchor="middle" fill="#991b1b" fontSize="4.5" fontFamily="var(--font-mono)">Stock</text>

            {/* Drop zone over placed HCl bottle for Pipette */}
            <DropZoneOverlay
              zoneId={DROP_ZONES.HCL_BOTTLE_ZONE}
              x={8} y={340} width={58} height={50}
              label="Pipette"
              isActive={activeDropZone === DROP_ZONES.HCL_BOTTLE_ZONE}
              step={state.step}
              targetStep={Step.MEASURE_ACID}
            />
          </g>
        )}

        {/* NaOH label */}
        {state.buretteMounted && (
          <text x={210} y={30} fill="#64748b" fontSize="7" fontFamily="var(--font-sans)">
            NaOH (0.1 M)
          </text>
        )}

        {/* Mounted Burette */}
        <Burette
          volumeAdded={state.volumeAdded}
          isMounted={state.buretteMounted}
          isFilled={state.buretteFilled}
          stopcockOpen={state.stopcockOpen}
        />

        {/* Stopcock control */}
        {state.buretteMounted && (
          <StopcockControl
            enabled={stopcockEnabled}
            stopcockOpen={state.stopcockOpen}
            dispatch={dispatch}
          />
        )}

        {/* Mounted Flask */}
        <Flask
          color={flaskColor}
          hasIndicator={state.hasIndicator}
          isPlaced={state.flaskPlaced}
          acidMeasured={state.acidMeasured}
          isReceivingDrop={state.stopcockOpen > 0}
          volumeAdded={state.volumeAdded}
          isSwirling={isSwirling || isStirring}
        />

        {/* Animated Pipette filling at HCl bottle */}
        {state.isPipetteFilling && (
          <Pipette
            x={36}
            y={255}
            isFilled={false}
            isFilling={true}
            label="Drawing 25 mL HCl..."
          />
        )}

        {/* Animated Pipette dispensing into Flask */}
        {state.isPipetteDispensing && (
          <Pipette
            x={140}
            y={200}
            isFilled={true}
            isDispensing={true}
            label="Dispensing 25 mL HCl..."
          />
        )}

        {/* Animated NaOH pouring into Burette top */}
        {state.isPouring && (
          <g transform="translate(140, 5)" id="pouring-overlay">
            {/* Tipped Reagent bottle */}
            <g transform="rotate(-45, 15, 10)">
              <rect x={0} y={0} width={24} height={35} rx={4} fill="#eff6ff" stroke="#3b82f6" strokeWidth={0.8} />
              <rect x={6} y={-6} width={12} height={8} rx={2} fill="#dbeafe" />
              <text x={12} y={20} textAnchor="middle" fill="#1d4ed8" fontSize="5.5" fontFamily="var(--font-mono)">NaOH</text>
            </g>
            {/* Pour stream */}
            <line x1={0} y1={12} x2={0} y2={28} stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round">
              <animate attributeName="stroke-dasharray" values="1,4; 5,2; 2,3" dur="0.2s" repeatCount="indefinite" />
            </line>
            {/* Status text */}
            <rect x={15} y={0} width={85} height={18} rx={4} fill="#ffffff" stroke="#2563eb" strokeWidth={0.5} />
            <text x={57} y={12} textAnchor="middle" fill="#1d4ed8" fontSize="6" fontFamily="var(--font-mono)">Pouring NaOH...</text>
          </g>
        )}

        {/* Animated Indicator Dropper with EXACTLY 2 Discrete Drops */}
        {state.isAddingIndicator && (
          <g transform="translate(140, 240)" id="dropper-indicator-overlay">
            {/* Dropper Pipette Body */}
            <g transform="translate(-10, -50)">
              {/* Rubber bulb */}
              <ellipse cx={10} cy={6} rx={7} ry={9} fill="#dc2626" stroke="#991b1b" strokeWidth={0.8} />
              <rect x={7} y={13} width={6} height={3} fill="#475569" rx={0.5} />
              {/* Glass stem */}
              <rect x={8} y={16} width={4} height={38} rx={0.5} fill="rgba(241, 245, 249, 0.35)" stroke="#94a3b8" strokeWidth={0.6} />
              {/* Internal indicator liquid column */}
              <rect x={8.5} y={24} width={3} height={30} fill="rgba(236, 72, 153, 0.75)" />
              {/* Tapered glass jet nozzle */}
              <polygon points="8,54 12,54 10.5,62 9.5,62" fill="rgba(241, 245, 249, 0.4)" stroke="#94a3b8" strokeWidth={0.5} />
            </g>

            {/* DROP 1: Exactly 1st Drop (starts 0.2s, falls to surface at y=100) */}
            <ellipse cx={0} cy={14} rx={1.8} ry={2.6} fill="rgba(236, 72, 153, 0.9)">
              <animate attributeName="cy" values="14;14;96" keyTimes="0;0.12;0.45" dur="2s" fill="freeze" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.44;0.46" dur="2s" fill="freeze" />
            </ellipse>
            {/* Ripple from Drop 1 */}
            <ellipse cx={0} cy={96} rx={0} ry={0} fill="none" stroke="rgba(236, 72, 153, 0.8)" strokeWidth={1}>
              <animate attributeName="rx" values="0;0;14;18" keyTimes="0;0.45;0.65;0.75" dur="2s" fill="freeze" />
              <animate attributeName="ry" values="0;0;3.5;4.5" keyTimes="0;0.45;0.65;0.75" dur="2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.44;0.46;0.75" dur="2s" fill="freeze" />
            </ellipse>

            {/* DROP 2: Exactly 2nd Drop (starts 1.0s, falls to surface at y=100) */}
            <ellipse cx={0} cy={14} rx={1.8} ry={2.6} fill="rgba(236, 72, 153, 0.9)">
              <animate attributeName="cy" values="14;14;96" keyTimes="0;0.55;0.82" dur="2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.50;0.54;0.81;0.83" dur="2s" fill="freeze" />
            </ellipse>
            {/* Ripple from Drop 2 */}
            <ellipse cx={0} cy={96} rx={0} ry={0} fill="none" stroke="rgba(236, 72, 153, 0.8)" strokeWidth={1}>
              <animate attributeName="rx" values="0;0;14;18" keyTimes="0;0.82;0.94;1.0" dur="2s" fill="freeze" />
              <animate attributeName="ry" values="0;0;3.5;4.5" keyTimes="0;0.82;0.94;1.0" dur="2s" fill="freeze" />
              <animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.81;0.83;1.0" dur="2s" fill="freeze" />
            </ellipse>

            {/* Clean Status Badge */}
            <g transform="translate(18, -35)">
              <rect x={0} y={0} width={105} height={18} rx={4} fill="#ffffff" stroke="#ec4899" strokeWidth={0.8} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
              <text x={52} y={12} textAnchor="middle" fill="#db2777" fontSize="5.8" fontFamily="var(--font-mono)" fontWeight={600}>
                Adding 2 Drops Indicator...
              </text>
            </g>
          </g>
        )}

        {/* Unified Non-Overlapping Titration Control & Volume Readout Panel (only during TITRATING) */}
        {state.step === Step.TITRATING && (
          <foreignObject x={146} y={322} width={128} height={66}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                background: '#ffffff',
                border: '1.5px solid #bfdbfe',
                borderRadius: 8,
                padding: '6px 8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: '0.66rem',
                  color: '#1d4ed8',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                Dispensed: {state.volumeAdded.toFixed(1)} mL
              </div>
              <button
                id="btn-mark-endpoint"
                className="btn-danger"
                onClick={() => {
                  dispatch({ type: 'MARK_ENDPOINT' });
                }}
                style={{ fontSize: '0.62rem', padding: '5px 8px', width: '100%', whiteSpace: 'nowrap', borderRadius: 6 }}
              >
                ✋ Mark Endpoint
              </button>
            </div>
          </foreignObject>
        )}

        {/* Proceed to Calculation button (when endpoint is marked) */}
        {state.step === Step.ENDPOINT_MARKED && (
          <foreignObject x={158} y={345} width={118} height={40}>
            <button
              id="btn-proceed-calculation-bench"
              className="btn-primary"
              onClick={() => dispatch({ type: 'PROCEED_TO_CALCULATION' })}
              style={{ fontSize: '0.65rem', padding: '8px 10px', width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              Proceed to Calculation →
            </button>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

// ── Drop Zone Overlay (dnd-kit droppable) ──
const DropZoneOverlay: React.FC<{
  zoneId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  isActive: boolean;
  step: Step;
  targetStep: Step;
  hidden?: boolean;
}> = ({ zoneId, x, y, width, height, label, isActive, step, targetStep, hidden }) => {
  const { setNodeRef, isOver } = useDroppable({ id: zoneId });

  if (hidden) return null;

  const isRelevant = step === targetStep;
  const borderColor = isOver
    ? 'rgba(29, 78, 216, 0.85)'
    : isActive
      ? 'rgba(37, 99, 235, 0.65)'
      : isRelevant
        ? 'rgba(59, 130, 246, 0.45)'
        : 'rgba(148, 163, 184, 0.25)';
  const bgColor = isOver
    ? 'rgba(219, 234, 254, 0.5)'
    : isRelevant
      ? 'rgba(219, 234, 254, 0.22)'
      : 'transparent';

  // Badge position: placed in empty space to avoid colliding with retort pole & apparatus
  const badgeWidth = 110;
  const badgeHeight = 24;
  const isClampZone = zoneId.includes('clamp');
  const badgeX = isClampZone
    ? Math.min(270 - badgeWidth, x + width + 8)
    : Math.max(5, Math.min(270 - badgeWidth, x + width / 2 - badgeWidth / 2));
  const badgeY = isClampZone
    ? y + 30
    : Math.max(10, y - badgeHeight - 6);

  return (
    <g id={`dropzone-${zoneId}`}>
      {/* Interactive Droppable Box */}
      <foreignObject x={x} y={y} width={width} height={height}>
        <div
          ref={setNodeRef}
          style={{
            width: '100%',
            height: '100%',
            border: `1.5px dashed ${borderColor}`,
            borderRadius: 6,
            background: bgColor,
            transition: 'all 0.15s ease',
            boxSizing: 'border-box',
          }}
        />
      </foreignObject>

      {/* Floating Full Name Badge Tag (positioned nearby/centered so full name is NEVER truncated) */}
      {isRelevant && label && (
        <foreignObject x={badgeX} y={badgeY} width={badgeWidth} height={badgeHeight} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.62rem',
                color: isOver ? '#1e40af' : '#1d4ed8',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                fontWeight: 800,
                textAlign: 'center',
                padding: '3px 8px',
                background: '#ffffff',
                borderRadius: 5,
                border: '1.5px solid #2563eb',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default LabBench;
