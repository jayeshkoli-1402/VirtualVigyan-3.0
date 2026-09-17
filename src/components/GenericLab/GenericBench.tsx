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
import { ChemicalInspectorModal } from './ChemicalInspectorModal';
import { createEmptyMixture } from '../../engine/stoichiometrySolver';

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

  // Burette presence and liquid fill detection (Universal across all practicals)
  const hasBurette = Boolean(
    config.apparatus.some(a => a.component === 'Burette') ||
    config.bench.backgroundElements?.some(b => b.component === 'Burette' || b.component === 'BuretteStand') ||
    Object.keys(state.placedApparatus).some(id => id.includes('burette')) ||
    config.steps.some(s => s.id === 'titrating' || s.id.includes('titrat'))
  );

  const isBuretteFilled = Boolean(
    hasBurette && (
      state.flags.buretteFilled === true ||
      state.flags['burette-filled'] === true ||
      ((state.apparatusProps['burette']?.liquidLevel as number ?? 0) > 0)
    ) &&
    state.flags.buretteFilled !== false &&
    state.flags['burette-filled'] !== false
  );

  // Listen for burette stopcock rotation events from SVG interactive cork handles
  React.useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ open: number; id: string }>;
      if (typeof custom.detail?.open === 'number') {
        if (!hasBurette || !isBuretteFilled) {
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
  }, [dispatch, hasBurette, isBuretteFilled]);

  // Continuous flow animation and titration variable advancement when stopcock is open
  React.useEffect(() => {
    if (!hasBurette || !isBuretteFilled || stopcockOpen <= 0) return;

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
  }, [stopcockOpen, dispatch, config.interactions, state, hasBurette, isBuretteFilled]);

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

  // Determine primary reaction vessel (flask, beaker, viscometer, etc.)
  const vesselComponents = [
    'ConicalFlask',
    'Beaker',
    'BODBottle',
    'TestTube',
    'VolumetricFlask',
    'MeasuringCylinder',
    'OstwaldViscometer',
    'Viscometer',
    'SpecificGravityBottle',
    'SeparatingFunnel',
    'Calorimeter',
  ];

  // Prioritize placed vessel on workbench; fallback to config apparatus
  const placedVesselId = Object.keys(state.placedApparatus).find(id => {
    const app = config.apparatus.find(a => a.id === id);
    return app && vesselComponents.includes(app.component);
  });
  const configVessel = config.apparatus.find(a => vesselComponents.includes(a.component));
  const primaryVesselId = placedVesselId ?? configVessel?.id ?? 'flask';
  const primaryVesselLabel = config.apparatus.find(a => a.id === primaryVesselId)?.label ?? 'Reaction Vessel';



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

      {/* ── Viscometry Cleaning & Draining Banner (Step 2) ── */}
      {config.steps[state.currentStepIndex]?.id === 'clean' && (() => {
        const hasChromic = !!state.flags['cleanedChromic'] && ((state.apparatusProps['viscometer']?.liquidLevel as number ?? 0) > 0);
        const isDrained = !!state.flags['chromicDrained'];
        const isCleanedAndDry = !!state.flags['isCleanedAndDry'];

        if (!hasChromic && !isDrained && !isCleanedAndDry) return null;

        return (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.97), rgba(240, 249, 255, 0.97))',
              border: `1.5px solid ${isCleanedAndDry ? '#10b981' : hasChromic ? '#ea580c' : '#0284c7'}`,
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
            <div style={{ fontSize: 18 }}>
              {isCleanedAndDry ? '✅' : hasChromic ? '🧪' : '💨'}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isCleanedAndDry ? '#059669' : hasChromic ? '#ea580c' : '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isCleanedAndDry ? 'Viscometer Cleaned & Dried' : hasChromic ? 'Chromic Acid Wash' : 'Ready For Acetone Rinse'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {isCleanedAndDry
                  ? 'Viscometer is thoroughly cleaned, dry, and ready for test liquid introduction.'
                  : hasChromic
                    ? 'Viscometer washed with chromic acid. Click below to drain it into the waste jar.'
                    : 'Chromic acid drained! Now pour Acetone into the broad limb to rinse and dry completely.'}
              </div>
            </div>

            {/* Drain Chromic Acid to Waste Button */}
            {hasChromic && !isCleanedAndDry && (
              <button
                id="btn-drain-chromic"
                className="btn-primary"
                onClick={() => {
                  dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'drain-chromic' } });
                }}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  whiteSpace: 'nowrap',
                  background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)',
                }}
              >
                🚰 Drain Chromic Acid to Waste
              </button>
            )}
          </div>
        );
      })()}

      {/* ── Viscometry Capillary Flow & Timing Banner ── */}
      {(config.steps[state.currentStepIndex]?.id === 'flow-timing' || config.steps[state.currentStepIndex]?.id === 'water-reference') && (() => {
        const stepId = config.steps[state.currentStepIndex]?.id;
        const isTiming = !!state.flags['timerRunning'];
        const isSample = stepId === 'flow-timing';
        const isCleared = isSample || !!state.flags['viscoCleared'];
        const isCompleted = isSample ? !!state.flags['sampleTimed'] : !!state.flags['waterTimed'];
        const readyAtC = isSample
          ? !!state.flags['suckedAboveMark']
          : (isCleared && !!state.flags['waterIntroduced'] && !!state.flags['suckedAboveMark']);

        const sampleTime = (state.variables['flowTimeSample'] ?? state.variables['_timerSeconds'] ?? 0) as number;
        const waterTime = (state.variables['flowTimeWater'] ?? state.variables['_timerSeconds'] ?? 0) as number;
        const currentTime = isSample ? sampleTime : waterTime;
        const rawProgress = (state.variables['_flowProgress'] ?? 0) as number;
        const flowProg = rawProgress;
        const bulbBProg = Math.max(0, Math.min(1, flowProg));
        const isBelowD = flowProg > 1.0;
        const isBalanced = flowProg >= 1.5;

        let statusText = '';
        if (isSample) {
          if (isTiming) {
            statusText = isBalanced
              ? `Hydrostatic balance reached at ${sampleTime.toFixed(1)} s! Both limbs equalized. Press Stop Timing.`
              : isBelowD
                ? `Timing Liquid A: ${sampleTime.toFixed(1)} s. Meniscus flowed below Mark D towards balance. Stop whenever ready.`
                : `Timing Liquid A: ${sampleTime.toFixed(1)} s (${Math.round(bulbBProg * 100)}% through Bulb B). Meniscus flowing C → D. Stop whenever ready.`;
          } else if (isCompleted || sampleTime > 0) {
            statusText = isBalanced
              ? `Both sides balanced at hydrostatic equilibrium (${sampleTime.toFixed(1)} s). You can restart from Mark C, or continue.`
              : isBelowD
                ? `Flow paused below Mark D at ${sampleTime.toFixed(1)} s. Resume dropping to balance, restart from Mark C, or continue.`
                : `Flow paused at ${sampleTime.toFixed(1)} s (${Math.round(bulbBProg * 100)}% of Bulb B). Resume dropping, restart, or continue with current reading.`;
          } else {
            statusText = 'Liquid A ready above Mark C. Start the stopwatch to begin timing.';
          }
        } else {
          if (!isCleared) {
            statusText = 'Drain Liquid A from viscometer before introducing distilled water.';
          } else if (!state.flags['waterIntroduced']) {
            statusText = 'Introduce distilled water into the broad limb.';
          } else if (!state.flags['suckedAboveMark']) {
            statusText = 'Attach suction tube to capillary limb to draw water above Mark C.';
          } else if (isTiming) {
            statusText = isBalanced
              ? `Hydrostatic balance reached at ${waterTime.toFixed(1)} s! Both limbs equalized. Press Stop Timing.`
              : isBelowD
                ? `Timing Distilled Water: ${waterTime.toFixed(1)} s. Meniscus flowed below Mark D towards balance. Stop whenever ready.`
                : `Timing Distilled Water: ${waterTime.toFixed(1)} s (${Math.round(bulbBProg * 100)}% through Bulb B). Meniscus flowing C → D. Stop whenever ready.`;
          } else if (isCompleted || waterTime > 0) {
            statusText = isBalanced
              ? `Both sides balanced at hydrostatic equilibrium (${waterTime.toFixed(1)} s). You can restart from Mark C, or continue to calculations.`
              : isBelowD
                ? `Water flow paused below Mark D at ${waterTime.toFixed(1)} s. Resume dropping to balance, restart from Mark C, or continue to calculations.`
                : `Water flow paused at ${waterTime.toFixed(1)} s (${Math.round(bulbBProg * 100)}% of Bulb B). Resume dropping, restart, or continue to calculations.`;
          } else {
            statusText = 'Water ready above Mark C. Start the stopwatch to begin timing.';
          }
        }

        const handleStop = () => {
          const elementId = isSample ? 'stop-sample-flow' : 'stop-water-flow';
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
              border: `1.5px solid ${isTiming ? '#059669' : (isCompleted || currentTime > 0) ? '#10b981' : '#0284c7'}`,
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
                background: isTiming ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {isTiming ? '⏱️' : (isCompleted || currentTime > 0) ? '✅' : '🧪'}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isTiming ? '#059669' : '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isTiming ? 'Capillary Flow Active • Stopwatch Running' : 'Viscometer Flow Measurement'}
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

            {/* Initial Start Timing Button */}
            {!isTiming && !isCompleted && currentTime === 0 && readyAtC && (
              <button
                id={isSample ? 'btn-start-sample-flow' : 'btn-start-water-flow'}
                className="btn-primary"
                onClick={handleStart}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  whiteSpace: 'nowrap',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                }}
              >
                ▶ Start Timing
              </button>
            )}

            {/* Stop Timing Button (Student Can Stop At Any Moment) */}
            {isTiming && (
              <button
                id={isSample ? 'btn-stop-sample-flow' : 'btn-stop-water-flow'}
                className="btn-primary"
                onClick={handleStop}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  whiteSpace: 'nowrap',
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)',
                }}
              >
                ■ Stop Timing
              </button>
            )}

            {/* Resume Dropping Button (Student can stop and continue from where they left off, all the way to balance) */}
            {!isTiming && (isCompleted || currentTime > 0) && readyAtC && flowProg < 1.5 && (
              <button
                id={isSample ? 'btn-resume-sample-flow' : 'btn-resume-water-flow'}
                className="btn-primary"
                onClick={handleStart}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  whiteSpace: 'nowrap',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                }}
              >
                ▶ Resume Dropping
              </button>
            )}

            {/* Option to Restart from Mark C if student wants another attempt */}
            {!isTiming && (isCompleted || currentTime > 0) && (
              <button
                id={isSample ? 'btn-retry-sample-flow' : 'btn-retry-water-flow'}
                onClick={() => {
                  const elementId = isSample ? 'retry-sample-flow' : 'retry-water-flow';
                  dispatch({ type: 'CLICK_ELEMENT', payload: { elementId } });
                }}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 12px',
                  whiteSpace: 'nowrap',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  color: '#475569',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                ↺ Restart from Mark C
              </button>
            )}

            {/* Continue button after student stops timing */}
            {!isTiming && (isCompleted || currentTime > 0) && (
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
                {isSample ? 'Continue to Water Reference →' : 'Continue to Calculations →'}
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
                  if (stepId === 'flow-timing') {
                    if (state.flags['timerRunning']) {
                      dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'stop-sample-flow' } });
                    } else if (state.flags['suckedAboveMark']) {
                      dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'start-sample-flow' } });
                    }
                  } else if (stepId === 'water-reference') {
                    if (state.flags['timerRunning']) {
                      dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'stop-water-flow' } });
                    } else if (state.flags['viscoCleared'] && state.flags['waterIntroduced'] && state.flags['suckedAboveMark']) {
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
        const isBurette = apparatusConfig.component === 'Burette' || apparatusConfig.component === 'BuretteStand';
        const isVessel = ['ConicalFlask', 'Beaker', 'BODBottle', 'TestTube', 'VolumetricFlask'].includes(apparatusConfig.component);
        const isTool = ['Dropper', 'Pipette', 'Matchstick', 'ReagentBottle', 'GlassRod'].includes(apparatusConfig.component);
        const isHardware = ['RetortStand', 'Tripod', 'WireGauze'].includes(apparatusConfig.component);
        const apparatusZIndex = isTool ? 25 : isBurette ? 20 : isVessel ? 18 : 10;

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
                flags={{ ...state.flags, ...state.animations, swirling: isSwirling, stirring: isStirring, isTitrating: stopcockOpen > 0 || state.flags['isTitrating'] }}
                variables={{ ...state.variables, stopcockOpen }}
                extraProps={{
                  stopcockOpen,
                  onSetStopcock: (val: number) => {
                    setStopcockOpen(val);
                    dispatch({ type: 'SET_STOPCOCK', payload: { apparatusId: 'burette', openAmount: val } });
                  },
                }}
                {...dynamicProps}
                label=""
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
                  zIndex: 30,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  pointerEvents: 'auto',
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
                    pointerEvents: 'none',
                  }}
                >
                  {apparatusConfig.label}
                </span>

                {isVessel && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'INSPECT_VESSEL', payload: { vesselId: apparatusId } });
                    }}
                    title={`Inspect chemical reactions & stoichiometry inside ${apparatusConfig.label}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: '#4f46e5',
                      background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(224, 231, 255, 0.95))',
                      padding: '2px 7px',
                      borderRadius: 10,
                      border: '1px solid rgba(129, 140, 248, 0.8)',
                      boxShadow: '0 2px 5px rgba(79, 70, 229, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>🧪</span>
                    <span>Inspect</span>
                  </button>
                )}
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

        {/* Burette Titration Controls (Only for experiments featuring a burette) */}
        {hasBurette && (
          <>
            {/* Single Drop Dispense (+0.05 mL) for precise titration endpoint control */}
            <button
              type="button"
              id="btn-generic-single-drop"
              onClick={() => {
                if (!isBuretteFilled) {
                  window.dispatchEvent(new CustomEvent('burette_empty_click'));
                  return;
                }
                dispatch({ type: 'ADD_SINGLE_DROP', payload: { dropVolumeMl: 0.05 } });
              }}
              title="Dispense exactly 1 drop (0.05 mL) — essential for finding the exact titration endpoint without overshooting!"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid #0284c7',
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(3, 105, 161, 0.20))',
                color: '#0284c7',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.18)',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>💧</span>
              <span>+1 Drop (0.05 mL)</span>
            </button>

            {/* Burette Cork / Stopcock Quick Step Tap Button */}
            <button
              type="button"
              id="btn-generic-tap-cork"
              onClick={() => {
                if (!isBuretteFilled) {
                  window.dispatchEvent(new CustomEvent('burette_empty_click'));
                  return;
                }
                let nextOpen = 0;
                if (stopcockOpen === 0) nextOpen = 0.15;
                else if (stopcockOpen < 0.25) nextOpen = 0.35;
                else if (stopcockOpen < 0.50) nextOpen = 0.65;
                else nextOpen = 0;
                setStopcockOpen(nextOpen);
                dispatch({ type: 'SET_STOPCOCK', payload: { apparatusId: 'burette', openAmount: nextOpen } });
                window.dispatchEvent(new CustomEvent('burette_stopcock_change', { detail: { open: nextOpen, id: 'burette' } }));
              }}
              title="Click to cycle burette flow rate: Closed → Fine Drip (15%) → Slow Drops (35%) → Stream (65%) → Closed"
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
              <span style={{ fontSize: '0.85rem' }}>🚰</span>
              <span>
                {stopcockOpen === 0
                  ? 'Cork: Closed'
                  : stopcockOpen <= 0.20
                  ? 'Fine Drip (15%)'
                  : stopcockOpen <= 0.45
                  ? 'Slow Drops (35%)'
                  : `Flow: ${Math.round(stopcockOpen * 100)}%`}
              </span>
            </button>
          </>
        )}

        {/* Reaction & Stoichiometry Inspector Button */}
        <button
          type="button"
          id="btn-generic-inspect-chemistry"
          onClick={() => {
            dispatch({ type: 'INSPECT_VESSEL', payload: { vesselId: primaryVesselId } });
          }}
          title={`Inspect live molecular concentrations, reactions, and volume for ${primaryVesselLabel}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid #6366f1',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.22))',
            color: '#4f46e5',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.20)',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '0.85rem' }}>🧪</span>
          <span>Inspect {primaryVesselLabel.length > 18 ? 'Reaction' : primaryVesselLabel}</span>
        </button>
      </div>

      {/* Live volume reading indicator (Positioned in top-right empty space) */}
      {hasBurette && (isBuretteFilled || (state.variables['volumeAdded'] ?? 0) > 0) && (
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
      {hasBurette && config.interactions.some(i => i.trigger.type === 'stopcock') && state.flags['stopcockEnabled'] && (
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

      {/* ── Real-Time Reaction & Stoichiometry Inspector Modal ── */}
      {state.activeVesselInspectionId && (() => {
        const vesselId = state.activeVesselInspectionId;
        const mixture = state.vesselMixtures?.[vesselId] ?? createEmptyMixture(vesselId, 0);
        const appConfig = config.apparatus.find(a => a.id === vesselId);
        const vesselLabel = appConfig?.label ?? 'Reaction Vessel';

        return (
          <ChemicalInspectorModal
            mixture={mixture}
            vesselLabel={vesselLabel}
            onClose={() => dispatch({ type: 'INSPECT_VESSEL', payload: { vesselId: null } })}
            onAddChemical={(addition) => {
              dispatch({ type: 'MIX_CHEMICAL', payload: { vesselId, addition } });
            }}
          />
        );
      })()}
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
