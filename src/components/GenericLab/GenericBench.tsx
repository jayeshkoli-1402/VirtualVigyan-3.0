/**
 * ═══════════════════════════════════════════════════════════════════
 *  GenericBench — Config-driven lab bench with drop zones
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { ExperimentConfig, ExperimentState, ExperimentAction, DropZoneConfig, ApparatusConfig } from '../../engine/experimentConfig';
import { getApparatusComponent } from '../../apparatus';
import { getSolutionColor } from '../../engine/chemistryLib';
import { evaluateCondition } from '../../engine/experimentRunner';
import { FluidDynamicsLayer } from './FluidDynamicsLayer';
import { ChemicalInspectorModal, type VesselInspectionItem } from './ChemicalInspectorModal';
import { createEmptyMixture } from '../../engine/stoichiometrySolver';
import { useLanguage } from '../../i18n/LanguageContext';

type GenericBenchProps = {
  config: ExperimentConfig;
  state: ExperimentState;
  dispatch: React.Dispatch<ExperimentAction>;
  activeDropZone: string | null;
  activeDragId?: string | null;
};

const GenericBench: React.FC<GenericBenchProps> = ({
  config,
  state,
  dispatch,
  activeDropZone,
  activeDragId,
}) => {
  const { t, tDynamic } = useLanguage();
  const [isSwirling, setIsSwirling] = React.useState(false);
  const [isStirring, setIsStirring] = React.useState(false);
  const [stopcockOpen, setStopcockOpen] = React.useState(0);

  // Persisted state to show/hide the dark workbench table surface
  const [showTableSurface, setShowTableSurface] = React.useState<boolean>(() => {
    const stored = localStorage.getItem('vv_show_bench_table');
    return stored !== null ? stored === 'true' : true;
  });

  const handleToggleTable = React.useCallback(() => {
    setShowTableSurface((prev) => {
      const next = !prev;
      localStorage.setItem('vv_show_bench_table', String(next));
      return next;
    });
  }, []);

  // Sync with state.variables.stopcockOpen if updated by reducer
  React.useEffect(() => {
    if (state.variables.stopcockOpen !== undefined && state.variables.stopcockOpen !== stopcockOpen) {
      setStopcockOpen(state.variables.stopcockOpen);
    }
  }, [state.variables.stopcockOpen]);

  // Sync swirling state to global experiment state flags so engine tracks mixing technique
  const handleToggleSwirling = React.useCallback(() => {
    setIsSwirling(prev => {
      const next = !prev;
      dispatch({ type: 'SET_FLAG', payload: { flag: 'swirling', value: next } });
      return next;
    });
  }, [dispatch]);

  // Reset swirling on step transitions
  React.useEffect(() => {
    setIsSwirling(false);
    dispatch({ type: 'SET_FLAG', payload: { flag: 'swirling', value: false } });
  }, [state.currentStepIndex, dispatch]);

  // Pre-titration swirl guidance prompt condition
  const currentStep = config.steps[state.currentStepIndex];
  const isWaterAlkalinityTitration =
    config.id === 'water-alkalinity' &&
    ((currentStep?.id === 'phenolphthalein-titration' &&
      Boolean(state.flags['phenolphthaleinAdded']) &&
      !state.flags['pEndpointReached']) ||
     (currentStep?.id === 'methyl-orange-titration' &&
      Boolean(state.flags['methylOrangeAdded']) &&
      !state.flags['mEndpointReached']));

  const showSwirlPrompt = isWaterAlkalinityTitration && !isSwirling && stopcockOpen === 0;

  // Burette presence and liquid fill detection (Universal across all practicals)
  const hasBurette = Boolean(
    config.apparatus.some(a => a.component === 'Burette') ||
    config.bench.backgroundElements?.some(b => b.component === 'Burette' || b.component === 'BuretteStand') ||
    Object.keys(state.placedApparatus).some(id => id.includes('burette')) ||
    config.steps.some(s => s.id === 'titrating' || s.id.includes('titrat'))
  );

  // Swirlable vessel presence (Conical flask, reaction flask, test tube, beaker, or active titration)
  const hasSwirlableApparatus = Boolean(
    hasBurette ||
    config.apparatus.some(a => ['ConicalFlask', 'Flask', 'TestTube', 'Beaker'].includes(a.component)) ||
    Object.keys(state.placedApparatus).some(id => ['flask', 'beaker', 'tube'].some(k => id.toLowerCase().includes(k)))
  );

  // Magnetic stirrer presence (Stirrer plate in apparatus, bench background, or placed items)
  const hasMagneticStirrer = Boolean(
    config.apparatus.some(a => a.component === 'MagneticStirrer') ||
    config.bench.backgroundElements?.some(b => b.component === 'MagneticStirrer') ||
    Object.keys(state.placedApparatus).some(id => id.toLowerCase().includes('stirrer'))
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

  // Find all apparatus that hold liquid or chemicals
  const allVesselConfigs = config.apparatus.filter(a => {
    const comp = a.component.toLowerCase();
    return comp.includes('beaker') || comp.includes('flask') || comp.includes('tube') || comp.includes('bottle') || comp.includes('cylinder') || comp.includes('burette');
  });

  const vesselsList: VesselInspectionItem[] = allVesselConfigs.map(a => {
    const isPlaced = Boolean(state.placedApparatus[a.id]);
    const mixture = state.vesselMixtures?.[a.id] ?? createEmptyMixture(a.id, 0);
    const dynamicProps = state.apparatusProps[a.id] ?? {};
    const label = (dynamicProps.label as string) || a.label;

    let chemicalSummary = '';
    let physicalState = '';
    const isBeakerA = a.id.includes('solution') || a.id.includes('beaker-a') || a.id === 'beaker-1';
    const isBeakerB = a.id.includes('suspension') || a.id.includes('beaker-b') || a.id === 'beaker-2';
    const isBeakerC = a.id.includes('colloid') || a.id.includes('beaker-c') || a.id === 'beaker-3';

    if (isBeakerA) {
      const hasWater = state.flags['hasWaterA'] || state.completedActions.includes('water-added-a');
      const hasSalt = state.flags['hasSalt'] || state.completedActions.includes('solute-added-a');
      const stirred = state.flags['stirredA'] || state.completedActions.includes('stirred-a');
      if (hasSalt && stirred) {
        chemicalSummary = 'Water (50 mL) + Sodium Chloride (NaCl 0.5 g). Fully dissociated Na⁺ & Cl⁻ ions.';
        physicalState = 'True Solution (<1 nm particles). Completely transparent and homogeneous; invisible 650 nm laser path.';
      } else if (hasWater && hasSalt) {
        chemicalSummary = 'Water (50 mL) + Undissolved Salt crystals (NaCl).';
        physicalState = 'Dissolution in progress; needs stirring.';
      } else if (hasWater) {
        chemicalSummary = 'Distilled Water (H₂O, 50 mL).';
        physicalState = 'Pure solvent, clear liquid.';
      } else {
        chemicalSummary = 'Empty vessel.';
        physicalState = 'Clean borosilicate glass.';
      }
    } else if (isBeakerB) {
      const hasWater = state.flags['hasWaterB'] || state.completedActions.includes('water-added-b');
      const hasSoil = state.flags['hasSoil'] || state.completedActions.includes('solute-added-b');
      const stirred = state.flags['stirredB'] || state.completedActions.includes('stirred-b');
      if (hasSoil && stirred) {
        chemicalSummary = 'Water (50 mL) + Fine Garden Soil / Sand grains.';
        physicalState = 'Suspension (>1000 nm particles). Coarse mud sediment gradually settling at bottom; opaque and blocks laser beam.';
      } else if (hasWater && hasSoil) {
        chemicalSummary = 'Water (50 mL) + Soil resting at bottom.';
        physicalState = 'Heterogeneous mixture; unmixed sediment.';
      } else if (hasWater) {
        chemicalSummary = 'Distilled Water (H₂O, 50 mL).';
        physicalState = 'Pure solvent, clear liquid.';
      } else {
        chemicalSummary = 'Empty vessel.';
        physicalState = 'Clean borosilicate glass.';
      }
    } else if (isBeakerC) {
      const hasWater = state.flags['hasWaterC'] || state.completedActions.includes('water-added-c');
      const hasStarch = state.flags['hasStarch'] || state.completedActions.includes('solute-added-c');
      const stirred = state.flags['stirredC'] || state.completedActions.includes('stirred-c');
      if (hasStarch && stirred) {
        chemicalSummary = 'Water (50 mL) + Soluble Starch macromolecules (Amylose & Amylopectin).';
        physicalState = 'Colloid (1–1000 nm particles). Stable translucent sol; scatters 650 nm light brilliantly (Tyndall Effect).';
      } else if (hasWater && hasStarch) {
        chemicalSummary = 'Water (50 mL) + Starch paste resting at bottom.';
        physicalState = 'Colloidal dispersion in progress; needs stirring.';
      } else if (hasWater) {
        chemicalSummary = 'Distilled Water (H₂O, 50 mL).';
        physicalState = 'Pure solvent, clear liquid.';
      } else {
        chemicalSummary = 'Empty vessel.';
        physicalState = 'Clean borosilicate glass.';
      }
    } else {
      const speciesNames = Object.entries(mixture.moles)
        .filter(([, m]) => m > 1e-6)
        .map(([id]) => id);
      chemicalSummary = speciesNames.length > 0 ? speciesNames.join(', ') : (mixture.volumeMl > 0 ? 'Aqueous solution' : 'Empty vessel');
      physicalState = mixture.volumeMl > 0 ? `Liquid volume: ${mixture.volumeMl.toFixed(1)} mL, pH: ${mixture.pH.toFixed(1)}` : 'Empty';
    }

    return {
      id: a.id,
      label,
      component: a.component,
      isPlaced,
      mixture,
      chemicalSummary,
      physicalState,
      volumeMl: mixture.volumeMl > 0 ? mixture.volumeMl : ((dynamicProps.liquidLevel as number ?? 0) * 100),
      ph: mixture.pH,
    };
  });

  const hasBottomBarContent = Boolean(
    hasSwirlableApparatus ||
    hasMagneticStirrer ||
    hasBurette ||
    (primaryVesselId && Boolean(config?.chemistry?.reaction)) ||
    showSwirlPrompt ||
    Boolean(state.flags.buretteEmpty || (!state.flags.buretteFilled && hasBurette && ((state.apparatusProps['burette']?.liquidLevel as number ?? 0) <= 0.02))) ||
    stopcockOpen > 0
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
      {showTableSurface && (
        <div
          id="bench-table-surface"
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
            animation: 'fadeIn 0.25s ease-out',
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
      )}

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
              {tDynamic('Reaction Active • Vigorous Effervescence')}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              {tDynamic('H₂ gas bubbles are rapidly evolving. Zinc dissolves forming ZnSO₄ solution.')}
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
              {t('common.continue')} →
            </button>
          )}
        </div>
      )}

      {/* ── Stability & Settling Observation Banner (True Solution, Suspension & Colloid) ── */}
      {config.steps[state.currentStepIndex]?.id === 'observe-stability' && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            zIndex: 30,
            background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.98), rgba(255, 255, 255, 0.98))',
            border: '1.5px solid #d97706',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 16px',
            boxShadow: '0 10px 25px -5px rgba(217, 119, 6, 0.25), 0 4px 10px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            animation: 'fadeIn 0.3s ease-out',
            maxWidth: '460px',
          }}
        >
          <div style={{ fontSize: 20 }}>⏳</div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {state.flags['stabilityObserved']
                ? tDynamic('Settling Observed • Suspension is Unstable')
                : tDynamic('Step 4: Leave Mixtures Undisturbed')}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              {state.flags['stabilityObserved']
                ? tDynamic('Soil particles in Beaker B have settled into mud sediment. Beakers A & C remain uniform and stable.')
                : tDynamic('Allow mixtures to stand undisturbed for 5 minutes to test stability.')}
            </div>
          </div>
          {!state.flags['stabilityObserved'] ? (
            <button
              id="btn-bench-settle-action"
              className="btn-primary"
              onClick={() => {
                dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'observe-settling' } });
              }}
              style={{
                fontSize: '0.75rem',
                padding: '6px 14px',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
              }}
            >
              ⏳ {tDynamic('Wait 5 Mins (Let Settle)')}
            </button>
          ) : (
            <button
              id="btn-bench-proceed-stability"
              className="btn-primary"
              onClick={() => {
                dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'advance-step' } });
                dispatch({ type: 'ADVANCE_STEP' });
              }}
              style={{
                fontSize: '0.75rem',
                padding: '6px 14px',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              {tDynamic('Tyndall Test')} →
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
              {tDynamic('POP Sound Observed • H₂ Gas Confirmed!')}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
              {tDynamic('Hydrogen burns rapidly with a characteristic pop sound.')}
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
            {t('bench.proceedToQuestions')}
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
              top: 14,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(240, 249, 255, 0.98))',
              border: `1.5px solid ${isCleanedAndDry ? '#10b981' : hasChromic ? '#ea580c' : '#0284c7'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '8px 16px',
              boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.25), 0 4px 10px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              animation: 'fadeIn 0.3s ease-out',
              maxWidth: '92%',
            }}
          >
            <div style={{ fontSize: 18 }}>
              {isCleanedAndDry ? '✅' : hasChromic ? '🧪' : '💨'}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isCleanedAndDry ? '#059669' : hasChromic ? '#ea580c' : '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isCleanedAndDry ? tDynamic('Viscometer Cleaned & Dried') : hasChromic ? tDynamic('Chromic Acid Wash') : tDynamic('Ready For Acetone Rinse')}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {isCleanedAndDry
                  ? tDynamic('Viscometer is thoroughly cleaned, dry, and ready for test liquid introduction.')
                  : hasChromic
                    ? tDynamic('Viscometer washed with chromic acid. Click below to drain it into the waste jar.')
                    : tDynamic('Chromic acid drained! Now pour Acetone into the broad limb to rinse and dry completely.')}
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
                {t('bench.drainChromic')}
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
        const isBelowD = flowProg >= 1.0;
        const isBalanced = flowProg >= 1.5;

        let statusText = '';
        if (isSample) {
          if (isTiming) {
            statusText = isBalanced
              ? `Hydrostatic balance reached at ${sampleTime.toFixed(1)} s! Both limbs equalized. Press Stop Timing.`
              : isBelowD
                ? `Timing Liquid A: ${sampleTime.toFixed(1)} s. Meniscus reached Mark D! Press Stop Timing to record efflux time.`
                : `Timing Liquid A: ${sampleTime.toFixed(1)} s (${Math.round(bulbBProg * 100)}% through Bulb B). Meniscus flowing C → D. Stop once meniscus reaches Mark D.`;
          } else if (isCompleted || sampleTime > 0) {
            statusText = isCompleted
              ? isBalanced
                ? `Both sides balanced at hydrostatic equilibrium (${sampleTime.toFixed(1)} s). You can restart from Mark C, or continue to water reference.`
                : `Liquid A efflux completed to Mark D (${sampleTime.toFixed(1)} s). You can restart from Mark C, or continue to water reference.`
              : `Liquid has not reached Mark D yet (${sampleTime.toFixed(1)} s, ${Math.round(bulbBProg * 100)}% through Bulb B). Resume the flow and continue timing.`;
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
                ? `Timing Distilled Water: ${waterTime.toFixed(1)} s. Meniscus reached Mark D! Press Stop Timing to record efflux time.`
                : `Timing Distilled Water: ${waterTime.toFixed(1)} s (${Math.round(bulbBProg * 100)}% through Bulb B). Meniscus flowing C → D. Stop once meniscus reaches Mark D.`;
          } else if (isCompleted || waterTime > 0) {
            statusText = isCompleted
              ? isBalanced
                ? `Both sides balanced at hydrostatic equilibrium (${waterTime.toFixed(1)} s). You can restart from Mark C, or continue to calculations.`
                : `Water efflux completed to Mark D (${waterTime.toFixed(1)} s). You can restart from Mark C, or continue to calculations.`
              : `Liquid has not reached Mark D yet (${waterTime.toFixed(1)} s, ${Math.round(bulbBProg * 100)}% through Bulb B). Resume the flow and continue timing.`;
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
              top: 14,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(240, 249, 255, 0.98))',
              border: `1.5px solid ${isTiming ? '#059669' : isCompleted ? '#10b981' : currentTime > 0 ? '#f59e0b' : '#0284c7'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '8px 16px',
              boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.25), 0 4px 10px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              animation: 'fadeIn 0.3s ease-out',
              maxWidth: '92%',
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
                {isTiming ? tDynamic('Capillary Flow Active • Stopwatch Running') : tDynamic('Viscometer Flow Measurement')}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {tDynamic(statusText)}
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
                {t('bench.drainLiquidA')}
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
                {t('bench.startTiming')}
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
                {t('bench.stopTiming')}
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
                ▶ {t('bench.resumeDropping', 'Resume Dropping')}
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
                ↺ {t('bench.restartMarkC', 'Restart from Mark C')}
              </button>
            )}

            {/* Continue button after student stops timing */}
            {!isTiming && isCompleted && (
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
                {isSample ? t('bench.continueWaterRef', 'Continue to Water Reference →') : t('bench.continueCalcs', 'Continue to Calculations →')}
              </button>
            )}
          </div>
        );
      })()}

      {/* ── Tyndall Effect Laser Scattering & Real-World Optics Observation Toolbar ── */}
      {config.steps[state.currentStepIndex]?.id === 'test-tyndall' && (() => {
        const activeTarget = state.flags['tyndallTargetAll']
          ? 'all'
          : state.flags['tyndallTargetA']
            ? 'a'
            : state.flags['tyndallTargetB']
              ? 'b'
              : state.flags['tyndallTargetC']
                ? 'c'
                : (state.flags['tyndallTestedC'] ? 'c' : state.flags['tyndallTestedB'] ? 'b' : state.flags['tyndallTestedA'] ? 'a' : 'none');
        const testedA = Boolean(state.flags['tyndallTestedA'] || state.completedActions.includes('tested-tyndall-a'));
        const testedB = Boolean(state.flags['tyndallTestedB'] || state.completedActions.includes('tested-tyndall-b'));
        const testedC = Boolean(state.flags['tyndallTestedC'] || state.completedActions.includes('tested-tyndall-c'));
        const allTested = testedA && testedB && testedC;

        const handleTarget = (targetId: 'a' | 'b' | 'c' | 'all') => {
          dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: `btn-tyndall-${targetId}` } });
        };

        const handleAdvance = () => {
          dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'advance-step' } });
          dispatch({ type: 'ADVANCE_STEP' });
        };

        return (
          <div
            id="tyndall-observation-banner"
            style={{
              position: 'absolute',
              top: 14,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 35,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.96))',
              border: '1.5px solid rgba(239, 68, 68, 0.45)',
              borderRadius: 14,
              padding: '10px 18px',
              boxShadow: '0 12px 32px rgba(220, 38, 38, 0.25), 0 4px 14px rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              maxWidth: '94%',
              color: '#f8fafc',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, filter: 'drop-shadow(0 0 6px #ef4444)' }}>🔴</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#f87171' }}>
                    {tDynamic('650 nm Laser Scattering & Tyndall Effect')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    {tDynamic('Aim the ruby laser at each beaker to observe beam path visibility across different particle sizes.')}
                  </div>
                </div>
              </div>

              {/* Ready to Advance CTA Button (User Controls When To Proceed) */}
              {allTested && (
                <button
                  id="btn-advance-from-tyndall"
                  onClick={handleAdvance}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '7px 16px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{tDynamic('Proceed to Analysis')}</span>
                  <span>➔</span>
                </button>
              )}
            </div>

            {/* Interactive Target Selector Buttons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                id="btn-shine-a"
                onClick={() => handleTarget('a')}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: activeTarget === 'a' ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: activeTarget === 'a' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  color: activeTarget === 'a' ? '#fca5a5' : '#e2e8f0',
                  boxShadow: activeTarget === 'a' ? '0 0 10px rgba(239, 68, 68, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{testedA ? '✅' : '⚪'}</span>
                <span>{tDynamic('Beaker A (True Solution)')}</span>
              </button>

              <button
                id="btn-shine-b"
                onClick={() => handleTarget('b')}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: activeTarget === 'b' ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: activeTarget === 'b' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  color: activeTarget === 'b' ? '#fca5a5' : '#e2e8f0',
                  boxShadow: activeTarget === 'b' ? '0 0 10px rgba(239, 68, 68, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{testedB ? '✅' : '⚪'}</span>
                <span>{tDynamic('Beaker B (Suspension)')}</span>
              </button>

              <button
                id="btn-shine-c"
                onClick={() => handleTarget('c')}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: activeTarget === 'c' ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: activeTarget === 'c' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  color: activeTarget === 'c' ? '#fca5a5' : '#e2e8f0',
                  boxShadow: activeTarget === 'c' ? '0 0 10px rgba(239, 68, 68, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{testedC ? '✅' : '⚪'}</span>
                <span>{tDynamic('Beaker C (Colloid)')}</span>
              </button>

              <button
                id="btn-shine-all"
                onClick={() => handleTarget('all')}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: activeTarget === 'all' ? '1.5px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.3)',
                  background: activeTarget === 'all' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(56, 189, 248, 0.08)',
                  color: activeTarget === 'all' ? '#7dd3fc' : '#bae6fd',
                  boxShadow: activeTarget === 'all' ? '0 0 10px rgba(56, 189, 248, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>🔬</span>
                <span>{tDynamic('Compare All 3 Side-by-Side')}</span>
              </button>
            </div>

            {/* Scientific Observation Insight Box */}
            <div
              style={{
                fontSize: '0.72rem',
                lineHeight: 1.4,
                padding: '6px 10px',
                borderRadius: 6,
                background: 'rgba(0, 0, 0, 0.35)',
                borderLeft: '3px solid #ef4444',
                color: '#cbd5e1',
              }}
            >
              {activeTarget === 'a' && (
                <span>
                  <strong style={{ color: '#67e8f9' }}>Beaker A (True Solution, &lt;1 nm):</strong> Ions are completely dissolved and smaller than the wavelength of light. Rayleigh scattering is zero — <em>the beam path through the liquid is completely INVISIBLE</em>, passing straight through to the exit wall.
                </span>
              )}
              {activeTarget === 'b' && (
                <span>
                  <strong style={{ color: '#fb923c' }}>Beaker B (Suspension, &gt;1000 nm):</strong> Coarse mud/soil particles block, absorb, and diffusely scatter photons at the entrance surface. The laser beam is <em>totally extinguished</em> within a few millimeters — zero light emerges.
                </span>
              )}
              {activeTarget === 'c' && (
                <span>
                  <strong style={{ color: '#f472b6' }}>Beaker C (Colloid, 1–1000 nm):</strong> Intermediate starch macromolecules scatter light in all directions (<strong>Tyndall Effect</strong>). A <em>brilliant luminous red beam cone</em> with scintillating Brownian particles is visible across the entire beaker!
                </span>
              )}
              {activeTarget === 'all' && (
                <span>
                  <strong style={{ color: '#38bdf8' }}>Comparative Observation:</strong> Notice how identical 650 nm laser light reveals particle nature: <em>Invisible</em> in True Solution (&lt;1 nm) vs <em>Extinguished</em> in Suspension (&gt;1000 nm) vs <em>Glowing Tyndall Corridor</em> in Colloid (1–1000 nm)!
                </span>
              )}
              {activeTarget === 'none' && (
                <span>
                  Select any beaker above or drag the Laser Pointer from the tray onto a beaker to test.
                </span>
              )}
            </div>
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

        const isDragCompatible = Boolean(activeDragId && zone.accepts?.includes(activeDragId));

        return (
          <DropZone
            key={zone.id}
            zone={zone}
            isActive={activeDropZone === zone.id}
            isDragCompatible={isDragCompatible}
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

        const isAnimationTarget =
          !state.activeAnimation?.targetZoneId ||
          state.activeAnimation.targetZoneId === zoneId ||
          (state.activeAnimation.targetZoneId === 'beaker-a-mouth' && (apparatusId.includes('solution') || apparatusId.includes('beaker-a'))) ||
          (state.activeAnimation.targetZoneId === 'beaker-b-mouth' && (apparatusId.includes('suspension') || apparatusId.includes('beaker-b'))) ||
          (state.activeAnimation.targetZoneId === 'beaker-c-mouth' && (apparatusId.includes('colloid') || apparatusId.includes('beaker-c')));

        const isApparatusStirring = Boolean(
          (isStirring && hasMagneticStirrer) ||
          (Boolean(state.animations['isStirring'] || state.flags['isStirring']) && isAnimationTarget)
        );

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
                flags={{
                  ...state.flags,
                  ...state.animations,
                  swirling: isSwirling,
                  stirring: isApparatusStirring,
                  isTitrating: stopcockOpen > 0 || state.flags['isTitrating'],
                  isObserveStabilityStep: config.steps[state.currentStepIndex]?.id === 'observe-stability',
                }}
                variables={{ ...state.variables, stopcockOpen }}
                extraProps={{
                  stopcockOpen,
                  currentStepId: config.steps[state.currentStepIndex]?.id,
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
            {apparatusConfig.label && !isHardware && !isBurette && (
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
                  {tDynamic((dynamicProps.label as string) || apparatusConfig.label)}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Interactive Workbench Action Bar (Shake / Swirl, Stirrer & Burette Cork Tap) ── */}
      {hasBottomBarContent && (
        <div
          id="generic-bench-action-toolbar"
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
        {/* Pre-titration swirl prompt when user has not started swirling before titration */}
        {showSwirlPrompt && (
          <div
            id="swirl-pre-titration-prompt"
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              background: '#fffbeb',
              border: '1px solid #f59e0b',
              color: '#92400e',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
              pointerEvents: 'none',
              zIndex: 40,
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>💡</span>
            <span>{t('bench.preTitrationSwirl')}</span>
          </div>
        )}

        {/* Real-time titration technique guidance banners */}
        {Boolean(state.flags.buretteEmpty || (!state.flags.buretteFilled && hasBurette && ((state.apparatusProps['burette']?.liquidLevel as number ?? 0) <= 0.02))) && (
          <div
            id="titration-burette-empty-warning"
            className="animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.74rem',
              fontWeight: 800,
              background: 'rgba(239, 68, 68, 0.16)',
              border: '1.5px solid #ef4444',
              color: '#dc2626',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
            }}
          >
            <span>⚠️</span>
            <span>Burette Empty: Drag titrant bottle to top of burette to refill to 0.00 mL!</span>
          </div>
        )}

        {stopcockOpen >= 0.75 && (
          <div
            id="titration-fast-flow-warning"
            className="animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#dc2626',
            }}
          >
            <span>⚠️</span>
            <span>Fast Flow: Reduce rate near endpoint to avoid overshooting!</span>
          </div>
        )}

        {stopcockOpen > 0 && !isSwirling && (
          <div
            id="titration-unswirled-warning"
            className="animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#b45309',
            }}
          >
            <span>💡</span>
            <span>Swirl flask continuously while dispensing!</span>
          </div>
        )}

        {/* Shake / Swirl Flask button (Only for experiments with swirlable glassware or active titrations) */}
        {hasSwirlableApparatus && (
          <button
            type="button"
            id="btn-generic-shake-flask"
            onClick={handleToggleSwirling}
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
            <span>{isSwirling ? t('bench.swirlingOn') : `${t('lab.shake')} / ${t('lab.swirling')}`}</span>
          </button>
        )}

        {/* Magnetic Stirrer Toggle (Only for experiments with a magnetic stirrer plate) */}
        {hasMagneticStirrer && (
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
            <span>{isStirring ? t('bench.stirrerRun') : t('bench.stirrerPlate')}</span>
          </button>
        )}

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
              <span>{t('bench.singleDrop')}</span>
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
                  ? t('lab.tapClosed')
                  : stopcockOpen <= 0.20
                  ? `${t('lab.slowDrop')} (15%)`
                  : stopcockOpen <= 0.45
                  ? `${t('lab.fastDrop')} (35%)`
                  : `${t('lab.rapidFlow')}: ${Math.round(stopcockOpen * 100)}%`}
              </span>
            </button>
          </>
        )}

        {/* Reaction & Stoichiometry Inspector Button */}
        <button
          type="button"
          id="btn-generic-inspect-chemistry"
          onClick={() => {
            const firstVessel = vesselsList[0]?.id ?? primaryVesselId;
            dispatch({ type: 'INSPECT_VESSEL', payload: { vesselId: firstVessel } });
          }}
          title={t('bench.inspectAllApparatus', 'Inspect all apparatus and chemicals on the bench')}
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
          <span>{t('bench.inspectApparatus', 'Inspect Apparatus & Chemicals')}</span>
        </button>
      </div>
      )}

      {/* ── Single Central Workbench Apparatus & Chemicals Inspector Button ── */}
      <button
        type="button"
        id="btn-bench-inspect-all-apparatus"
        onClick={() => {
          const firstVessel = vesselsList[0]?.id ?? primaryVesselId;
          dispatch({ type: 'INSPECT_VESSEL', payload: { vesselId: firstVessel } });
        }}
        title={t('bench.inspectAllApparatus', 'Inspect all apparatus and chemicals on the bench')}
        style={{
          position: 'absolute',
          top: 12,
          right: (hasBurette && (isBuretteFilled || (state.variables['volumeAdded'] ?? 0) > 0) ? 140 : 12) + 115,
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 12px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(224, 231, 255, 0.95))',
          border: '1.5px solid #6366f1',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#4338ca',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.20)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span style={{ fontSize: '0.85rem' }}>🧪</span>
        <span>{t('bench.inspectApparatus', 'Inspect Chemicals & Apparatus')}</span>
      </button>

      {/* Quick Workbench Table Surface Corner Toggle */}
      <button
        type="button"
        id="btn-bench-table-corner-toggle"
        onClick={handleToggleTable}
        title={showTableSurface ? t('bench.hideTable', 'Hide Table') : t('bench.showTable', 'Show Table')}
        style={{
          position: 'absolute',
          top: 12,
          right: hasBurette && (isBuretteFilled || (state.variables['volumeAdded'] ?? 0) > 0) ? 140 : 12,
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 10px',
          borderRadius: 'var(--radius-md)',
          background: showTableSurface ? 'var(--bg-card)' : 'rgba(59, 130, 246, 0.15)',
          border: showTableSurface ? '1px solid var(--border)' : '1px solid #3b82f6',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: showTableSurface ? 'var(--text-secondary)' : '#2563eb',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-xs)',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span style={{ fontSize: '0.85rem' }}>{showTableSurface ? '🪵' : '✨'}</span>
        <span>{showTableSurface ? t('bench.hideTable', 'Hide Table') : t('bench.showTable', 'Show Table')}</span>
      </button>

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
          {t('common.volume', 'Vol')}: {(state.variables['volumeAdded'] ?? 0).toFixed(1)} mL
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

      {/* Mark Endpoint button (Docked cleanly above the action bar during titration step) */}
      {config.steps[state.currentStepIndex]?.id === 'titrating' && (
        <button
          id="btn-mark-endpoint"
          className="btn-primary"
          onClick={() => dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'mark-endpoint' } })}
          style={{
            position: 'absolute',
            bottom: 58,
            left: 12,
            zIndex: 36,
            fontSize: '0.8rem',
            padding: '7px 14px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
          }}
        >
          ✓ {t('lab.markEndpoint')}
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
            vessels={vesselsList}
            initialVesselId={vesselId}
            onClose={() => dispatch({ type: 'INSPECT_VESSEL', payload: { vesselId: null } })}
            onAddChemical={(addition, targetVesselId) => {
              dispatch({ type: 'MIX_CHEMICAL', payload: { vesselId: targetVesselId || vesselId, addition } });
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
  isDragCompatible?: boolean;
  state: ExperimentState;
  config: ExperimentConfig;
  solutionColor: string;
  benchScale?: number;
};

const DropZone: React.FC<DropZoneProps> = ({
  zone,
  isActive,
  isDragCompatible = false,
  state,
  config,
}) => {
  const { tDynamic } = useLanguage();
  const hasItem = Object.values(state.placedApparatus).includes(zone.id);

  // Look up accepted apparatus details from config
  const acceptedApparatuses = (zone.accepts ?? [])
    .map(id => config?.apparatus?.find(a => a.id === id))
    .filter(Boolean) as ApparatusConfig[];

  const primaryApparatus = acceptedApparatuses[0];

  const isMouthOrOpening =
    zone.id.includes('mouth') ||
    zone.id.includes('opening') ||
    zone.id.includes('neck') ||
    (!zone.id.includes('top-zone') && zone.id.includes('top'));

  const reagentComponentTypes = ['ReagentBottle', 'Dropper', 'Matchstick', 'GlassRod', 'RubberCork'];

  // A zone is an apparatus placement zone if:
  // 1. It explicitly accepts non-reagent apparatus equipment, OR
  // 2. Its ID indicates a bench/stand placement position (e.g. bench-zone-a, balance-zone, stand-tube-zone, burner-top-zone)
  // 3. And it is not an opening/mouth of an already-placed vessel
  const isBenchPlacementZone =
    !isMouthOrOpening &&
    (
      acceptedApparatuses.some(app => !reagentComponentTypes.includes(app.component)) ||
      zone.id.startsWith('bench-') ||
      zone.id.endsWith('-zone')
    );

  const { setNodeRef, isOver } = useDroppable({
    id: zone.id,
    disabled: Boolean(hasItem && isBenchPlacementZone),
  });

  // Bench placement zones waiting for apparatus are always visible so students know where to place items!
  const isZoneVisible = isOver || isActive || isDragCompatible || (!hasItem && isBenchPlacementZone);

  return (
    <div
      ref={setNodeRef}
      id={`dropzone-${zone.id}`}
      style={{
        position: 'absolute',
        left: `${zone.position.x - zone.size.width / 2}%`,
        top: `${zone.position.y - zone.size.height / 2}%`,
        width: `${zone.size.width}%`,
        height: `${zone.size.height}%`,
        borderRadius: zone.shape === 'circle' ? '50%' : 'var(--radius-lg, 12px)',
        border: `2px dashed ${
          isOver
            ? '#2563eb'
            : isActive || isDragCompatible
              ? '#3b82f6'
              : isBenchPlacementZone && !hasItem
                ? 'rgba(59, 130, 246, 0.55)'
                : hasItem || !isZoneVisible
                  ? 'transparent'
                  : 'rgba(148, 163, 184, 0.22)'
        }`,
        background: isOver
          ? 'rgba(37, 99, 235, 0.18)'
          : isActive || isDragCompatible
            ? 'rgba(59, 130, 246, 0.12)'
            : isBenchPlacementZone && !hasItem
              ? 'rgba(59, 130, 246, 0.04)'
              : 'transparent',
        boxShadow: isOver
          ? '0 0 20px rgba(37, 99, 235, 0.45)'
          : isActive || isDragCompatible
            ? '0 0 16px rgba(59, 130, 246, 0.35)'
            : isBenchPlacementZone && !hasItem
              ? '0 2px 10px rgba(59, 130, 246, 0.08)'
              : 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: isOver || isActive ? 22 : isBenchPlacementZone && !hasItem ? 12 : 5,
        pointerEvents: hasItem && !isActive ? 'none' : 'auto',
      }}
    >
      {/* Drop Zone Label: Dedicated opaque pill pinned above the zone */}
      {!hasItem && isZoneVisible && (
        <div
          style={{
            position: 'absolute',
            top: zone.position.y < 25 ? '105%' : '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 14,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.68rem',
              fontWeight: 700,
              color: isOver ? '#1e3a8a' : isActive || isDragCompatible ? '#1d4ed8' : '#2563eb',
              background: 'rgba(255, 255, 255, 0.96)',
              padding: '3px 10px',
              borderRadius: 12,
              border: `1.5px solid ${
                isOver ? '#2563eb' : isActive || isDragCompatible ? '#60a5fa' : 'rgba(59, 130, 246, 0.45)'
              }`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              letterSpacing: '0.02em',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '0.75rem' }}>📍</span>
            <span>{tDynamic(zone.label)}</span>
          </span>
        </div>
      )}

      {/* Central placement watermark & apparatus silhouette */}
      {!hasItem && isBenchPlacementZone && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            pointerEvents: 'none',
            userSelect: 'none',
            opacity: isOver ? 0.95 : isActive || isDragCompatible ? 0.9 : 0.7,
            transition: 'all 0.2s ease',
            textAlign: 'center',
            padding: '6px',
            maxWidth: '100%',
          }}
        >
          <span
            style={{
              fontSize: '1.9rem',
              lineHeight: 1,
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12))',
              transform: isOver ? 'scale(1.15)' : isDragCompatible ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.2s ease',
            }}
          >
            {primaryApparatus?.icon ?? '🥛'}
          </span>
          <span
            style={{
              fontSize: '0.64rem',
              fontWeight: 700,
              color: '#1d4ed8',
              background: 'rgba(239, 246, 255, 0.92)',
              padding: '2px 8px',
              borderRadius: 8,
              border: '1px solid rgba(191, 219, 254, 0.9)',
              whiteSpace: 'nowrap',
              maxWidth: '96%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {primaryApparatus ? tDynamic(primaryApparatus.label) : tDynamic(zone.label)}
          </span>
          <span
            style={{
              fontSize: '0.55rem',
              fontWeight: 600,
              color: isOver ? '#1e40af' : isActive || isDragCompatible ? '#2563eb' : '#64748b',
              letterSpacing: '0.01em',
            }}
          >
            {isOver
              ? tDynamic('Drop to place')
              : isDragCompatible
                ? tDynamic('Place here')
                : tDynamic('Drag here')}
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
  const { t } = useLanguage();
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
        {t('lab.stopcock')}
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
