/**
 * ═══════════════════════════════════════════════════════════════════
 *  GenericBench — Config-driven lab bench with drop zones
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { ExperimentConfig, ExperimentState, ExperimentAction, DropZoneConfig } from '../../engine/experimentConfig';
import { getApparatusComponent } from '../../apparatus';
import { getSolutionColor } from '../../engine/chemistryLib';
import { evaluateCondition } from '../../engine/experimentRunner';
import { FluidDynamicsLayer } from './FluidDynamicsLayer';

type GenericBenchProps = {
  config: ExperimentConfig;
  state: ExperimentState;
  dispatch: React.Dispatch<ExperimentAction>;
  activeDropZone: string | null;
};

const GenericBench: React.FC<GenericBenchProps> = ({
  config,
  state,
  dispatch,
  activeDropZone,
}) => {
  const [isSwirling, setIsSwirling] = React.useState(false);
  const [isStirring, setIsStirring] = React.useState(false);
  const [stopcockOpen, setStopcockOpen] = React.useState(0);

  // Sync with state.variables.stopcockOpen if updated by reducer
  React.useEffect(() => {
    if (state.variables.stopcockOpen !== undefined && state.variables.stopcockOpen !== stopcockOpen) {
      setStopcockOpen(state.variables.stopcockOpen);
    }
  }, [state.variables.stopcockOpen]);

  // Listen for burette stopcock rotation events from SVG interactive cork handles
  React.useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ open: number; id: string }>;
      if (typeof custom.detail?.open === 'number') {
        const newOpen = custom.detail.open;
        setStopcockOpen(newOpen);
        dispatch({ type: 'SET_STOPCOCK', payload: { apparatusId: 'burette', openAmount: newOpen } });
      }
    };
    window.addEventListener('burette_stopcock_change', handler);
    return () => window.removeEventListener('burette_stopcock_change', handler);
  }, [dispatch]);

  // Continuous flow animation and titration variable advancement when stopcock is open
  React.useEffect(() => {
    if (stopcockOpen <= 0) return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK_FLOW', payload: { deltaMs: 100 } });

      // If there's an active titration interaction in config, trigger titration effects
      for (const inter of config.interactions) {
        if (inter.trigger.type === 'drop' && (inter.trigger.source === 'burette' || inter.trigger.source === 'micro-burette')) {
          const conditionsMet = !inter.conditions || inter.conditions.every(c => evaluateCondition(c, state));
          if (conditionsMet && inter.completesAction && !state.completedActions.includes(inter.completesAction)) {
            dispatch({ type: 'DROP_ITEM', payload: { itemId: inter.trigger.source, zoneId: inter.trigger.target } });
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [stopcockOpen, dispatch, config.interactions, state]);

  // Responsive scale factor for desktop & tablet
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const benchScale = windowWidth < 768 ? 1.15 : windowWidth < 1200 ? 1.45 : 1.7;



  // Compute current solution color
  const solutionColor = getSolutionColor(
    config.chemistry.colorModel,
    state.variables,
    state.flags,
    config.chemistry.colorModelArgs,
  );

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        background: 'radial-gradient(ellipse at 50% 30%, #ffffff 0%, #f1f5f9 60%, #e2e8f0 100%)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        minHeight: 520,
      }}
    >
      {/* ── Realistic Lab Workbench Table Surface ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '28%',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderTop: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: 'inset 0 8px 16px rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }}
      >
        {/* Tabletop depth / glossy reflection plane */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '20px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
          }}
        />

        {/* Specular front edge highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent 5%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.3) 75%, transparent 95%)',
          }}
        />

        {/* Cabinet / Drawer Grooves on table apron */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '100%',
            paddingTop: '20px',
            opacity: 0.25,
          }}
        >
          <div style={{ width: '28%', height: '55%', border: '1px solid #94a3b8', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '30%', height: 4, background: '#94a3b8', borderRadius: 2 }} />
          </div>
          <div style={{ width: '28%', height: '55%', border: '1px solid #94a3b8', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '30%', height: 4, background: '#94a3b8', borderRadius: 2 }} />
          </div>
          <div style={{ width: '28%', height: '55%', border: '1px solid #94a3b8', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '30%', height: 4, background: '#94a3b8', borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* ── High-Fidelity Fluid Dynamics & Pouring Physics Simulation ── */}
      <FluidDynamicsLayer
        config={config}
        state={state}
        solutionColor={solutionColor}
        benchScale={benchScale}
      />

      {/* ── Active Reaction Observation Banner ── */}
      {config.steps[state.currentStepIndex]?.id === 'observe' && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(240, 249, 255, 0.98))',
            border: '1.5px solid #0284c7',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 18px',
            boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            animation: 'fadeIn 0.3s ease-out',
            maxWidth: '90%',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(2, 132, 199, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            🫧
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Reaction Active • Vigorous Effervescence
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              H₂ gas bubbles are rapidly evolving. Zinc dissolves forming ZnSO₄ solution.
            </div>
          </div>
          {config.steps[state.currentStepIndex]?.advanceMode === 'button' && (
            <button
              id="btn-bench-advance"
              className="btn-primary"
              onClick={() => {
                dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'advance-step' } });
                dispatch({ type: 'ADVANCE_STEP' });
              }}
              style={{
                fontSize: '0.75rem',
                padding: '6px 14px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              Continue →
            </button>
          )}
        </div>
      )}

      {/* ── Pop Sound Verified Banner ── */}
      {state.flags['popSoundHeard'] && config.steps[state.currentStepIndex]?.id === 'test-gas' && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.98), rgba(255, 255, 255, 0.98))',
            border: '1.5px solid #ef4444',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 18px',
            boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            animation: 'fadeIn 0.3s ease-out',
            maxWidth: '90%',
          }}
        >
          <div style={{ fontSize: 22 }}>💥</div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              POP Sound Observed • H₂ Gas Confirmed!
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              Hydrogen burns rapidly with a characteristic pop sound.
            </div>
          </div>
          <button
            id="btn-bench-proceed"
            className="btn-primary"
            onClick={() => {
              dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'advance-step' } });
              dispatch({ type: 'ADVANCE_STEP' });
            }}
            style={{
              fontSize: '0.75rem',
              padding: '6px 14px',
              whiteSpace: 'nowrap',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
            }}
          >
            Proceed to Questions →
          </button>
        </div>
      )}

      {/* Background elements (retort stand, etc. - dimmed for glassware focus) */}
      {config.bench.backgroundElements?.map((elem, i) => {
        const Component = getApparatusComponent(elem.component);
        if (!Component) return null;
        const isStand = elem.component === 'RetortStand' || elem.component === 'Tripod';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${elem.position.x}%`,
              top: `${elem.position.y}%`,
              transform: `translate(-50%, -50%) scale(${(elem.scale ?? 1) * benchScale})`,
              zIndex: elem.component === 'BuretteStand' ? 12 : 2,
              opacity: isStand ? 0.35 : (elem.component === 'BuretteStand' ? 1 : 0.85),
              filter: isStand ? 'none' : 'drop-shadow(0 10px 10px rgba(0,0,0,0.25))',
              pointerEvents: 'none',
              transition: 'opacity 0.3s ease',
            }}
          >
            <Component
              id={`bg-${elem.component}-${i}`}
              flags={{ ...state.flags, isTitrating: stopcockOpen > 0 || state.flags['isTitrating'] }}
              variables={{ ...state.variables, stopcockOpen }}
              extraProps={{
                stopcockOpen,
                onSetStopcock: (val: number) => {
                  setStopcockOpen(val);
                  dispatch({ type: 'SET_STOPCOCK', payload: { apparatusId: 'burette', openAmount: val } });
                },
              }}
              {...(elem.props as Record<string, unknown>)}
            />
          </div>
        );
      })}

      {/* Drop zones */}
      {config.dropZones.map(zone => {
        // Check visibility condition
        if (zone.visibleWhen && !evaluateCondition(zone.visibleWhen, state)) {
          return null;
        }

        return (
          <DropZone
            key={zone.id}
            zone={zone}
            isActive={activeDropZone === zone.id}
            state={state}
            config={config}
            solutionColor={solutionColor}
            benchScale={benchScale}
          />
        );
      })}

      {/* Placed apparatus - Glassware, Beakers & Flasks in FRONT with high visual priority */}
      {Object.entries(state.placedApparatus).map(([apparatusId, zoneId]) => {
        const apparatusConfig = config.apparatus.find(a => a.id === apparatusId);
        const zone = config.dropZones.find(z => z.id === zoneId);
        if (!apparatusConfig || !zone) return null;

        const Component = getApparatusComponent(apparatusConfig.component);
        if (!Component) return null;

        const dynamicProps = state.apparatusProps[apparatusId] ?? {};
        const isTargetSwirling = isSwirling && (apparatusConfig.component === 'ConicalFlask' || apparatusConfig.component === 'Beaker' || apparatusConfig.component === 'TestTube');

        // Glassware and reaction vessels (Beakers, Flasks) have priority foreground z-index over the burette stand
        const isVessel = ['ConicalFlask', 'Beaker', 'BODBottle', 'TestTube', 'VolumetricFlask'].includes(apparatusConfig.component);
        const isTool = ['Dropper', 'Pipette', 'Matchstick', 'ReagentBottle', 'GlassRod'].includes(apparatusConfig.component);
        const apparatusZIndex = isTool ? 25 : isVessel ? 18 : 10;

        return (
          <div
            key={`placed-${apparatusId}`}
            style={{
              position: 'absolute',
              left: `${zone.position.x}%`,
              top: `${zone.position.y}%`,
              transform: `translate(-50%, -50%) scale(${benchScale})`,
              animation: isTargetSwirling ? 'apparatusSwirl 0.8s ease-in-out infinite' : 'fadeIn 0.3s ease-out',
              filter: isVessel
                ? 'drop-shadow(0 14px 18px rgba(0,0,0,0.30)) drop-shadow(0 2px 8px rgba(59,130,246,0.18))'
                : 'drop-shadow(0 14px 14px rgba(0,0,0,0.25))',
              zIndex: apparatusZIndex,
              transition: 'transform 0.2s ease',
            }}
          >
            <Component
              id={apparatusId}
              liquidColor={(dynamicProps.liquidColor as string | undefined) ?? solutionColor}
              flags={{ ...state.flags, swirling: isSwirling, stirring: isStirring, isTitrating: stopcockOpen > 0 || state.flags['isTitrating'] }}
              variables={{ ...state.variables, stopcockOpen }}
              extraProps={{
                stopcockOpen,
                onSetStopcock: (val: number) => {
                  setStopcockOpen(val);
                  dispatch({ type: 'SET_STOPCOCK', payload: { apparatusId: 'burette', openAmount: val } });
                },
              }}
              {...dynamicProps}
            />
          </div>
        );
      })}

      {/* ── Interactive Workbench Action Bar (Shake / Swirl, Stirrer & Burette Cork Tap) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          zIndex: 35,
          display: 'flex',
          gap: 8,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid var(--border-subtle, #e2e8f0)',
          borderRadius: 10,
          padding: '5px 8px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
        }}
      >
        {/* Shake / Swirl Flask button */}
        <button
          type="button"
          id="btn-generic-shake-flask"
          onClick={() => setIsSwirling(prev => !prev)}
          title="Continuously shake & swirl the conical flask for thorough mixing"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 6,
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: isSwirling ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
            background: isSwirling ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f8fafc',
            color: isSwirling ? '#ffffff' : '#334155',
            boxShadow: isSwirling ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '0.9rem', display: 'inline-block', animation: isSwirling ? 'spinBarRapid 1s linear infinite' : 'none' }}>🔄</span>
          <span>{isSwirling ? 'Swirling (ON)' : 'Shake / Swirl'}</span>
        </button>

        {/* Stir Solution button */}
        <button
          type="button"
          id="btn-generic-stir-solution"
          onClick={() => setIsStirring(prev => !prev)}
          title="Toggle rapid magnetic stirring and liquid vortex mixing"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 6,
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: isStirring ? '1.5px solid #059669' : '1px solid #cbd5e1',
            background: isStirring ? 'linear-gradient(135deg, #059669, #047857)' : '#f8fafc',
            color: isStirring ? '#ffffff' : '#334155',
            boxShadow: isStirring ? '0 2px 8px rgba(5, 150, 105, 0.35)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '0.9rem', display: 'inline-block', animation: isStirring ? 'spinBarRapid 0.4s linear infinite' : 'none' }}>🌀</span>
          <span>{isStirring ? 'Stirring (ON)' : 'Stir Solution'}</span>
        </button>
      </div>

      {/* Volume / measurement display */}
      {state.variables['volumeAdded'] !== undefined && state.flags['hasIndicator'] && (
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          boxShadow: 'var(--shadow-card)',
          zIndex: 20,
        }}>
          Vol: {(state.variables['volumeAdded'] ?? 0).toFixed(1)} mL
        </div>
      )}

      {/* Stopcock control (rendered when a stopcock interaction exists) */}
      {config.interactions.some(i => i.trigger.type === 'stopcock') && state.flags['stopcockEnabled'] && (
        <StopcockUI
          state={state}
          dispatch={dispatch}
          config={config}
        />
      )}

      {/* Mark Endpoint button (when in a step that needs it) */}
      {config.steps[state.currentStepIndex]?.id === 'titrating' && (
        <button
          id="btn-mark-endpoint"
          className="btn-primary"
          onClick={() => dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'mark-endpoint' } })}
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            fontSize: '0.8rem',
          }}
        >
          ✓ Mark Endpoint
        </button>
      )}
    </div>
  );
};


// ── Drop Zone Component ──────────────────────────────────────────

type DropZoneProps = {
  zone: DropZoneConfig;
  isActive: boolean;
  state: ExperimentState;
  config: ExperimentConfig;
  solutionColor: string;
  benchScale?: number;
};

const DropZone: React.FC<DropZoneProps> = ({ zone, isActive, state }) => {
  const hasItem = Object.values(state.placedApparatus).includes(zone.id);

  const { setNodeRef, isOver } = useDroppable({ id: zone.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: `${zone.position.x - zone.size.width / 2}%`,
        top: `${zone.position.y - zone.size.height / 2}%`,
        width: `${zone.size.width}%`,
        height: `${zone.size.height}%`,
        borderRadius: zone.shape === 'circle' ? '50%' : 'var(--radius-md)',
        border: `2px dashed ${
          isOver ? '#2563eb' :
          isActive ? '#60a5fa' :
          hasItem ? 'transparent' :
          'rgba(148, 163, 184, 0.3)'
        }`,
        background: isOver
          ? 'rgba(37, 99, 235, 0.08)'
          : isActive
            ? 'rgba(96, 165, 250, 0.05)'
            : 'transparent',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        pointerEvents: hasItem && !isActive ? 'none' : 'auto',
      }}
    >
      {!hasItem && !isOver && (
        <span style={{
          fontSize: '0.6rem',
          color: 'rgba(148, 163, 184, 0.6)',
          textAlign: 'center',
          padding: 4,
          pointerEvents: 'none',
        }}>
          {zone.label}
        </span>
      )}
    </div>
  );
};


// ── Stopcock UI ──────────────────────────────────────────────────

type StopcockUIProps = {
  state: ExperimentState;
  dispatch: React.Dispatch<ExperimentAction>;
  config: ExperimentConfig;
};

const StopcockUI: React.FC<StopcockUIProps> = ({ state, dispatch }) => {
  const stopcockOpen = state.variables['stopcockOpen'] ?? 0;
  const rotation = stopcockOpen * 90;

  const handlePointerDown = () => {
    dispatch({ type: 'SET_STOPCOCK', payload: { apparatusId: 'burette', openAmount: 0.3 } });
  };

  const handlePointerUp = () => {
    dispatch({ type: 'SET_STOPCOCK', payload: { apparatusId: 'burette', openAmount: 0 } });
  };

  // Flow tick interval
  React.useEffect(() => {
    if (stopcockOpen <= 0) return;
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_FLOW', payload: { deltaMs: 50 } });
    }, 50);
    return () => clearInterval(interval);
  }, [stopcockOpen, dispatch]);

  return (
    <div
      style={{
        position: 'absolute',
        left: '48%',
        top: '55%',
        zIndex: 15,
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg width="30" height="30" viewBox="0 0 30 30">
        <g transform={`rotate(${rotation}, 15, 15)`}>
          <rect x="6" y="13" width="18" height="4" rx="2"
            fill={stopcockOpen > 0 ? '#2563eb' : '#94a3b8'}
            stroke={stopcockOpen > 0 ? '#1d4ed8' : '#64748b'}
            strokeWidth="1" />
        </g>
        <circle cx="15" cy="15" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      </svg>
    </div>
  );
};


export default GenericBench;
