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
        const isBuretteFilled = state.flags.buretteFilled ?? state.flags['burette-filled'] ?? true;
        if (isBuretteFilled === false && custom.detail.open > 0) {
          setStopcockOpen(0);
          return;
        }
        const newOpen = custom.detail.open;
        setStopcockOpen(newOpen);
        dispatch({ type: 'SET_STOPCOCK', payload: { apparatusId: 'burette', openAmount: newOpen } });
      }
    };
    window.addEventListener('burette_stopcock_change', handler);
    return () => window.removeEventListener('burette_stopcock_change', handler);
  }, [dispatch, state.flags.buretteFilled, state.flags['burette-filled']]);

  // Continuous flow animation and titration variable advancement when stopcock is open
  React.useEffect(() => {
    const isBuretteFilled = state.flags.buretteFilled ?? state.flags['burette-filled'] ?? true;
    if (stopcockOpen <= 0 || isBuretteFilled === false) return;

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
        background: 'radial-gradient(ellipse at 50% 30%, var(--bg-card) 0%, var(--bg-inset) 60%, var(--bg-secondary) 100%)',
        border: '1px solid var(--border)',
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

      {/* ── Active Reaction Observation Banner (Positioned in top-left empty space) ── */}
      {config.steps[state.currentStepIndex]?.id === 'observe' && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            zIndex: 30,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(240, 249, 255, 0.98))',
            border: '1.5px solid #0284c7',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 16px',
            boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.25), 0 4px 10px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            animation: 'fadeIn 0.3s ease-out',
            maxWidth: '360px',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
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
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
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

      {/* ── Pop Sound Verified Banner (Positioned in top-left empty space) ── */}
      {state.flags['popSoundHeard'] && config.steps[state.currentStepIndex]?.id === 'test-gas' && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            zIndex: 30,
            background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.98), rgba(255, 255, 255, 0.98))',
            border: '1.5px solid #ef4444',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 16px',
            boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.25), 0 4px 10px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            animation: 'fadeIn 0.3s ease-out',
            maxWidth: '360px',
          }}
        >
          <div style={{ fontSize: 20 }}>💥</div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              POP Sound Observed • H₂ Gas Confirmed!
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
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

      {/* ── Viscometry Capillary Flow & Timing Banner ── */}
      {(config.steps[state.currentStepIndex]?.id === 'flow-timing' || config.steps[state.currentStepIndex]?.id === 'water-reference') && (() => {
        const stepId = config.steps[state.currentStepIndex]?.id;
        const isTiming = !!state.flags['timerRunning'];
        const isSample = stepId === 'flow-timing';
        const isCleared = isSample || !!state.flags['viscoCleared'];
        const isCompleted = isSample ? !!state.flags['sampleTimed'] : !!state.flags['waterTimed'];
        const flowProg = (state.variables['_flowProgress'] ?? state.variables['flowProgress'] ?? 0) as number;
        const reachedD = flowProg >= 0.98;
        const stoppedTooEarly = !!state.flags['stoppedTooEarly'];
        const readyAtC = isSample
          ? !!state.flags['suckedAboveMark']
          : (isCleared && !!state.flags['waterIntroduced'] && !!state.flags['suckedAboveMark']);

        const sampleTime = (state.variables['flowTimeSample'] ?? state.variables['_timerSeconds'] ?? 24.5) as number;
        const waterTime = (state.variables['flowTimeWater'] ?? state.variables['_timerSeconds'] ?? 18.2) as number;

        let statusText = '';
        if (isSample) {
          if (isTiming) {
            statusText = reachedD ? 'Meniscus reached mark D — stop the stopwatch.' : 'Liquid flowing from C → D — Stopwatch running';
          } else if (isCompleted) {
            statusText = `Flow complete — measured t_A = ${sampleTime.toFixed(1)} s`;
          } else if (stoppedTooEarly) {
            statusText = 'Meniscus has not reached mark D yet. Continue the measurement.';
          } else {
            statusText = 'Liquid A ready above mark C — start the stopwatch to begin timing.';
          }
        } else {
          if (!isCleared) {
            statusText = 'Drain and clear Liquid A from the viscometer before introducing distilled water.';
          } else if (!state.flags['waterIntroduced']) {
            statusText = 'Viscometer cleared! Introduce distilled water into the broad limb.';
          } else if (!state.flags['suckedAboveMark']) {
            statusText = 'Attach suction tube to capillary limb to draw water above mark C.';
          } else if (isTiming) {
            statusText = reachedD ? 'Meniscus reached mark D — stop the stopwatch.' : 'Water flowing from C → D — Stopwatch running';
          } else if (isCompleted) {
            statusText = `Flow complete — measured t_W = ${waterTime.toFixed(1)} s`;
          } else if (stoppedTooEarly) {
            statusText = 'Meniscus has not reached mark D yet. Continue the measurement.';
          } else {
            statusText = 'Water ready above mark C — start the stopwatch to begin timing.';
          }
        }

        const handleStop = () => {
          const elementId = flowProg < 0.98
            ? (isSample ? 'pause-sample-flow' : 'pause-water-flow')
            : (isSample ? 'stop-sample-flow' : 'stop-water-flow');
          dispatch({ type: 'CLICK_ELEMENT', payload: { elementId } });
        };

        const handleStart = () => {
          const elementId = isSample ? 'start-sample-flow' : 'start-water-flow';
          dispatch({ type: 'CLICK_ELEMENT', payload: { elementId } });
        };

        return (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.97), rgba(240, 249, 255, 0.97))',
              border: `1.5px solid ${isTiming ? (reachedD ? '#ef4444' : '#059669') : isCompleted ? '#10b981' : '#0284c7'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '8px 16px',
              boxShadow: '0 -4px 20px -4px rgba(2, 132, 199, 0.2), 0 4px 10px -4px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              animation: 'fadeIn 0.3s ease-out',
              maxWidth: '94%',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: isTiming ? (reachedD ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)') : 'rgba(2, 132, 199, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {isTiming ? (reachedD ? '🚨' : '⏱️') : isCompleted ? '✅' : '🧪'}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isTiming ? (reachedD ? '#dc2626' : '#059669') : '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isTiming ? (reachedD ? 'Meniscus At Mark D • Stop Watch' : 'Capillary Flow Active • Stopwatch Running') : 'Viscometer Flow Measurement'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {statusText}
              </div>
            </div>

            {/* Drain & Clear Viscometer button (Student control before water) */}
            {!isSample && !isCleared && (
              <button
                id="btn-drain-viscometer"
                className="btn-primary"
                onClick={() => {
                  dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'drain-viscometer' } });
                }}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  whiteSpace: 'nowrap',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                }}
              >
                🚰 Drain & Clear Liquid A
              </button>
            )}

            {/* Start / Resume Timing Button */}
            {!isTiming && !isCompleted && readyAtC && (
              <button
                id={isSample ? 'btn-start-sample-flow' : 'btn-start-water-flow'}
                className="btn-primary"
                onClick={handleStart}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  whiteSpace: 'nowrap',
                  background: stoppedTooEarly
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : 'linear-gradient(135deg, #0284c7, #0369a1)',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                }}
              >
                {stoppedTooEarly ? '▶ Continue Timing' : '▶ Start Timing'}
              </button>
            )}

            {/* Stop Timing Button (Explicit Student Control) */}
            {isTiming && (
              <button
                id={isSample ? 'btn-stop-sample-flow' : 'btn-stop-water-flow'}
                className="btn-primary"
                onClick={handleStop}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  whiteSpace: 'nowrap',
                  background: reachedD
                    ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
                    : 'linear-gradient(135deg, #dc2626, #991b1b)',
                  boxShadow: reachedD
                    ? '0 0 16px rgba(239, 68, 68, 0.6)'
                    : '0 4px 12px rgba(220, 38, 38, 0.35)',
                  animation: reachedD ? 'pulse 1s infinite' : 'none',
                }}
              >
                ■ Stop Timing
              </button>
            )}

            {/* Continue button after successful timing */}
            {isCompleted && (
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
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                }}
              >
                Continue →
              </button>
            )}
          </div>
        );
      })()}

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
              opacity: isStand ? 0.42 : (elem.component === 'BuretteStand' ? 1 : 0.95),
              filter: isStand ? 'drop-shadow(0 3px 6px rgba(0,0,0,0.18))' : 'drop-shadow(0 10px 10px rgba(0,0,0,0.25))',
              pointerEvents: elem.component === 'Stopwatch' ? 'auto' : 'none',
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
                onToggleStopwatch: () => {
                  const stepId = config.steps[state.currentStepIndex]?.id;
                  const flowProg = (state.variables['_flowProgress'] ?? state.variables['flowProgress'] ?? 0) as number;
                  if (stepId === 'flow-timing') {
                    if (state.flags['timerRunning']) {
                      const elementId = flowProg < 0.98 ? 'pause-sample-flow' : 'stop-sample-flow';
                      dispatch({ type: 'CLICK_ELEMENT', payload: { elementId } });
                    } else if (!state.flags['sampleTimed'] && state.flags['suckedAboveMark']) {
                      dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'start-sample-flow' } });
                    }
                  } else if (stepId === 'water-reference') {
                    if (state.flags['timerRunning']) {
                      const elementId = flowProg < 0.98 ? 'pause-water-flow' : 'stop-water-flow';
                      dispatch({ type: 'CLICK_ELEMENT', payload: { elementId } });
                    } else if (!state.flags['waterTimed'] && state.flags['viscoCleared'] && state.flags['waterIntroduced'] && state.flags['suckedAboveMark']) {
                      dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'start-water-flow' } });
                    }
                  }
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

        const dynamicProps = {
          ...(apparatusConfig.initialProps ?? {}),
          ...(state.apparatusProps[apparatusId] ?? {}),
        };
        const isTargetSwirling = isSwirling && (apparatusConfig.component === 'ConicalFlask' || apparatusConfig.component === 'Beaker' || apparatusConfig.component === 'TestTube');

        // Glassware and reaction vessels (Beakers, Flasks) have priority foreground z-index over the burette stand
        const isVessel = ['ConicalFlask', 'Beaker', 'BODBottle', 'TestTube', 'VolumetricFlask'].includes(apparatusConfig.component);
        const isTool = ['Dropper', 'Pipette', 'Matchstick', 'ReagentBottle', 'GlassRod'].includes(apparatusConfig.component);
        const isHardware = ['RetortStand', 'Tripod', 'WireGauze'].includes(apparatusConfig.component);
        const apparatusZIndex = isTool ? 25 : isVessel ? 18 : 10;

        return (
          <div
            key={`placed-${apparatusId}`}
            style={{
              position: 'absolute',
              left: `${zone.position.x}%`,
              top: `${zone.position.y}%`,
              transform: `translate(-50%, -50%) scale(${benchScale})`,
              animation: 'fadeIn 0.3s ease-out',
              filter: isVessel
                ? 'drop-shadow(0 14px 18px rgba(0,0,0,0.30)) drop-shadow(0 2px 8px rgba(59,130,246,0.18))'
                : 'drop-shadow(0 14px 14px rgba(0,0,0,0.25))',
              zIndex: apparatusZIndex,
              transition: 'transform 0.2s ease',
            }}
          >
            <div
              style={{
                animation: isTargetSwirling ? 'innerApparatusSwirl 0.8s ease-in-out infinite' : undefined,
                transformOrigin: '50% 88%',
                display: 'inline-block',
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
                label={undefined}
              />
            </div>

            {/* Clean, Non-Colliding Apparatus Title Badge in Empty Space Below Instrument */}
            {apparatusConfig.label && !isHardware && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(4px)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 30,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary, #334155)',
                    background: 'var(--bg-card, rgba(255, 255, 255, 0.96))',
                    padding: '2px 8px',
                    borderRadius: 12,
                    border: '1px solid var(--border, rgba(203, 213, 225, 0.8))',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {apparatusConfig.label}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Interactive Workbench Action Bar (Shake / Swirl, Stirrer & Burette Cork Tap) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 35,
          display: 'flex',
          gap: 6,
          background: 'var(--bg-card)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '4px 6px',
          boxShadow: 'var(--shadow-lg)',
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
            borderRadius: 'var(--radius-md)',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: isSwirling ? '1px solid var(--primary)' : '1px solid var(--border)',
            background: isSwirling ? 'var(--primary)' : 'var(--bg-secondary)',
            color: isSwirling ? '#ffffff' : 'var(--text-secondary)',
            boxShadow: isSwirling ? '0 2px 8px rgba(79, 70, 229, 0.35)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '0.85rem', display: 'inline-block', animation: isSwirling ? 'spinBarRapid 1s linear infinite' : 'none' }}>🔄</span>
          <span>{isSwirling ? 'Swirling (ON)' : 'Shake / Swirl'}</span>
        </button>

        {/* Magnetic Stirrer Toggle */}
        <button
          type="button"
          id="btn-generic-toggle-stirrer"
          onClick={() => {
            const next = !isStirring;
            setIsStirring(next);
            dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'magnetic-stirrer' } });
            dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'stir-solution' } });
          }}
          title="Turn magnetic stirrer motor ON or OFF"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: isStirring ? '1px solid #0284c7' : '1px solid var(--border)',
            background: isStirring ? '#0284c7' : 'var(--bg-secondary)',
            color: isStirring ? '#ffffff' : 'var(--text-secondary)',
            boxShadow: isStirring ? '0 2px 8px rgba(2, 132, 199, 0.35)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '0.85rem' }}>🧲</span>
          <span>{isStirring ? 'Stirrer (RUN)' : 'Stirrer Plate'}</span>
        </button>

        {/* Burette Cork / Stopcock Quick Step Tap Button */}
        <button
          type="button"
          id="btn-generic-tap-cork"
          onClick={() => {
            const isBuretteFilled = state.flags.buretteFilled ?? state.flags['burette-filled'] ?? true;
            if (isBuretteFilled === false) {
              window.dispatchEvent(new CustomEvent('burette_empty_click'));
              return;
            }
            let nextOpen = 0;
            if (stopcockOpen < 0.35) nextOpen = 0.50;
            else if (stopcockOpen < 0.70) nextOpen = 0.80;
            else if (stopcockOpen < 0.95) nextOpen = 1.00;
            else nextOpen = 0;
            setStopcockOpen(nextOpen);
            dispatch({ type: 'SET_STOPCOCK', payload: { apparatusId: 'burette', openAmount: nextOpen } });
            window.dispatchEvent(new CustomEvent('burette_stopcock_change', { detail: { open: nextOpen, id: 'burette' } }));
          }}
          title="Click to toggle or cycle titration flow rate"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: stopcockOpen > 0 ? '1px solid #2563eb' : '1px solid var(--border)',
            background: stopcockOpen > 0 ? '#2563eb' : 'var(--bg-secondary)',
            color: stopcockOpen > 0 ? '#ffffff' : 'var(--text-secondary)',
            boxShadow: stopcockOpen > 0 ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '0.85rem' }}>💧</span>
          <span>{stopcockOpen > 0 ? `Cork: ${Math.round(stopcockOpen * 100)}%` : 'Open Cork'}</span>
        </button>
      </div>

      {/* Live volume reading indicator (Positioned in top-right empty space) */}
      {state.variables['volumeAdded'] !== undefined && (
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          boxShadow: 'var(--shadow-card)',
          zIndex: 20,
        }}>
          Vol: {(state.variables['volumeAdded'] ?? 0).toFixed(1)} mL
        </div>
      )}

      {/* Stopcock control (docked cleanly in bottom-right empty space to avoid colliding with glassware) */}
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

  // Reagent drop targets over placed apparatuses should only display when actively dragging a compatible item
  const isReagentTarget = zone.accepts?.some(a => !['viscometer', 'burette', 'conical-flask', 'beaker'].includes(a)) ?? false;
  const isZoneVisible = isOver || isActive || (!hasItem && !isReagentTarget);

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
          hasItem || (!isZoneVisible) ? 'transparent' :
          'rgba(148, 163, 184, 0.22)'
        }`,
        background: isOver
          ? 'rgba(37, 99, 235, 0.12)'
          : isActive
            ? 'rgba(96, 165, 250, 0.08)'
            : 'transparent',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: isOver || isActive ? 22 : 5,
        pointerEvents: hasItem && !isActive ? 'none' : 'auto',
      }}
    >
      {/* Drop Zone Label: Positioned in clean empty space with dedicated opaque pill to avoid colliding with instruments */}
      {!hasItem && !isOver && isZoneVisible && (
        <div
          style={{
            position: 'absolute',
            top: zone.position.y < 25 ? '105%' : '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.60rem',
              fontWeight: 700,
              color: '#1e40af',
              background: 'rgba(255, 255, 255, 0.96)',
              padding: '2px 8px',
              borderRadius: 10,
              border: '1.2px solid rgba(59, 130, 246, 0.45)',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.12)',
              letterSpacing: '0.02em',
            }}
          >
            📍 {zone.label}
          </span>
        </div>
      )}
    </div>
  );
};


// ── Stopcock UI (Docked in empty space) ──────────────────────────

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
        bottom: 16,
        right: 16,
        zIndex: 25,
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
        background: 'var(--bg-card, rgba(255,255,255,0.95))',
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
        Stopcock:
      </span>
      <svg width="24" height="24" viewBox="0 0 30 30">
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
