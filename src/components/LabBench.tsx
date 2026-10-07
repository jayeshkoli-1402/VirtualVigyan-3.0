import React, { useEffect, useRef, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { TitrationState, TitrationAction } from '../engine/titrationState';
import { Step, DROP_ZONES } from '../engine/titrationState';
import { getFlaskColor } from '../engine/chemistryRules';
import { canOperateStopcock } from '../engine/validation';
import { useLanguage } from '../i18n/LanguageContext';
import { APPARATUS_REGISTRY } from '../apparatus';

interface LabBenchProps {
  state: TitrationState;
  dispatch: React.Dispatch<TitrationAction>;
  activeDropZone: string | null;
  onMarkEndpoint?: () => void;
}

const RetortStand = APPARATUS_REGISTRY['RetortStand'];
const BuretteSVG = APPARATUS_REGISTRY['Burette'];
const ConicalFlask = APPARATUS_REGISTRY['ConicalFlask'];
const PipetteSVG = APPARATUS_REGISTRY['Pipette'];
const ReagentBottle = APPARATUS_REGISTRY['ReagentBottle'];
const DropperBottle = APPARATUS_REGISTRY['Dropper'];

const LabBench: React.FC<LabBenchProps> = ({ state, dispatch, activeDropZone, onMarkEndpoint }) => {
  const { t } = useLanguage();
  const [isSwirling, setIsSwirling] = React.useState(false);
  const [isStirring, setIsStirring] = React.useState(false);
  const flaskColor = getFlaskColor(state.volumeAdded, state.hasIndicator, isSwirling || isStirring);
  const stopcockEnabled = canOperateStopcock(state).allowed && state.step === Step.TITRATING;

  // Continuous flow animation loop when stopcock is open (> 0)
  const lastFrameRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (state.stopcockOpen <= 0) {
      lastFrameRef.current = 0;
      return;
    }

    const tick = (timestamp: number) => {
      if (lastFrameRef.current === 0) {
        lastFrameRef.current = timestamp;
      }
      const deltaMs = Math.min(timestamp - lastFrameRef.current, 100);
      lastFrameRef.current = timestamp;

      if (deltaMs > 0) {
        dispatch({ type: 'TICK_FLOW', payload: { deltaMs } });
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [state.stopcockOpen, dispatch]);

  const handleSetStopcock = useCallback((openVal: number) => {
    if (!stopcockEnabled) return;
    dispatch({ type: 'SET_STOPCOCK', payload: { open: openVal } });
  }, [stopcockEnabled, dispatch]);

  return (
    <div
      id="lab-bench"
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        background: 'radial-gradient(ellipse at 50% 30%, var(--bg-card) 0%, var(--bg-inset) 60%, var(--bg-secondary) 100%)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Realistic Lab Workbench Table Surface (Tabletop boundary at bottom: 16%) ── */}
      <div
        id="bench-table-surface"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '16%',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderTop: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: 'inset 0 8px 16px rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }}
      >
        {/* Tabletop reflection plane */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '16px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
          }}
        />
        {/* Reagents Shelf Title on Table Surface */}
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            left: '26%',
            transform: 'translateX(-50%)',
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'rgba(148, 163, 184, 0.5)',
            textTransform: 'uppercase',
            pointerEvents: 'none',
          }}
        >
          {t('apparatus.reagentsTray', 'Reagents & Standard Solutions')}
        </div>
      </div>

      {/* ── Top-Right Live Volume Readout Badge ── */}
      {state.buretteMounted && (
        <div
          id="titration-live-volume-badge"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
            zIndex: 25,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#2563eb', fontSize: '1.1rem' }}>🧪</span>
          <span>{t('lab.dispensed', { volume: state.volumeAdded.toFixed(1) }, `Dispensed: ${state.volumeAdded.toFixed(1)} mL`)}</span>
        </div>
      )}

      {/* ── 1. Retort Stand (Base plate resting on tabletop surface at bottom: 16%, left: 56%) ── */}
      {!state.standPlaced && (
        <DropZoneOverlay
          zoneId={DROP_ZONES.STAND}
          left="56%"
          bottom="16%"
          transform="translate(-50%, 14px)"
          width={200}
          height={480}
          label={t('apparatus.retortStand', 'Retort Stand')}
          isActive={activeDropZone === DROP_ZONES.STAND}
          step={state.step}
          targetStep={Step.SETUP_STAND}
        />
      )}

      {state.standPlaced && RetortStand && (
        <div
          id="placed-retort-stand"
          style={{
            position: 'absolute',
            left: '56%',
            bottom: '16%',
            transform: 'translate(-50%, 14px)',
            zIndex: 2,
            filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.35))',
            pointerEvents: 'none',
          }}
        >
          <RetortStand
            id="stand"
            width={200}
            height={480}
            extraProps={{ hideUpperClamp: false, hideLowerClamp: false }}
          />
        </div>
      )}

      {/* ── 2. Mounted Burette (Clamped securely in stand clamp jaws at left: calc(56% + 14px)) ── */}
      {state.standPlaced && !state.buretteMounted && (
        <DropZoneOverlay
          zoneId={DROP_ZONES.CLAMP}
          left="calc(56% + 14px)"
          bottom="calc(16% + 115px)"
          transform="translateX(-50%)"
          width={120}
          height={380}
          label={t('apparatus.burette', '50 mL Burette')}
          isActive={activeDropZone === DROP_ZONES.CLAMP}
          step={state.step}
          targetStep={Step.SETUP_STAND}
        />
      )}

      {state.buretteMounted && BuretteSVG && (
        <div
          id="placed-burette"
          style={{
            position: 'absolute',
            left: 'calc(56% + 14px)',
            bottom: 'calc(16% + 115px)',
            transform: 'translateX(-50%)',
            zIndex: 10,
            filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.30))',
          }}
        >
          <BuretteSVG
            id="burette"
            liquidLevel={state.isPouring || state.buretteFilled ? Math.max(0, (50 - state.volumeAdded) / 50) : 0}
            liquidColor="rgba(37, 99, 235, 0.42)"
            width={120}
            height={380}
            flags={{
              buretteFilled: state.isPouring || state.buretteFilled,
              'burette-filled': state.isPouring || state.buretteFilled,
              isTitrating: state.stopcockOpen > 0,
            }}
            variables={{
              volumeAdded: state.volumeAdded,
              naohVolume: state.volumeAdded,
              buretteReading: state.volumeAdded,
              stopcockOpen: state.stopcockOpen,
            }}
            extraProps={{
              buretteFilled: state.isPouring || state.buretteFilled,
              isFilled: state.isPouring || state.buretteFilled,
              stopcockOpen: state.stopcockOpen,
              onSetStopcock: handleSetStopcock,
            }}
          />

          {/* Burette Top Drop Zone for NaOH Bottle (Step 4) */}
          {!state.buretteFilled && (
            <DropZoneOverlay
              zoneId={DROP_ZONES.BURETTE_TOP}
              left="33%"
              top="4%"
              width={90}
              height={70}
              label={t('apparatus.naohBottle', '0.100 M NaOH Titrant')}
              isActive={activeDropZone === DROP_ZONES.BURETTE_TOP}
              step={state.step}
              targetStep={Step.FILL_BURETTE}
            />
          )}
        </div>
      )}

      {/* ── 3. Conical Flask (Directly under burette delivery tip at left: calc(56% + 7px)) ── */}
      {state.standPlaced && !state.flaskPlaced && (
        <DropZoneOverlay
          zoneId={DROP_ZONES.BASE}
          left="calc(56% + 7px)"
          bottom="16%"
          transform="translate(-50%, 18px)"
          width={150}
          height={175}
          label={t('apparatus.flask', 'Conical Flask (250 mL)')}
          isActive={activeDropZone === DROP_ZONES.BASE}
          step={state.step}
          targetStep={Step.SETUP_STAND}
        />
      )}

      {state.flaskPlaced && ConicalFlask && (
        <div
          id="placed-flask"
          style={{
            position: 'absolute',
            left: 'calc(56% + 7px)',
            bottom: '16%',
            transform: 'translate(-50%, 18px)',
            zIndex: 12,
            filter: 'drop-shadow(0 16px 22px rgba(0,0,0,0.38)) drop-shadow(0 2px 10px rgba(59,130,246,0.22))',
          }}
        >
          <div
            id="flask-swirl-wrapper"
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: '50% 88%',
              animation: isSwirling ? 'innerApparatusSwirl 0.8s ease-in-out infinite' : undefined,
              display: 'inline-block',
            }}
          >
            <ConicalFlask
              id="conical-flask"
              liquidLevel={state.acidMeasured ? (25 + state.volumeAdded) / 100 : 0}
              liquidColor={flaskColor}
              flags={{
                swirling: isSwirling || isStirring,
                shaking: isSwirling,
              }}
              width={150}
              height={175}
            />
          </div>

          {/* Flask Drop Zone (for Pipette / Indicator) */}
          {(!state.acidMeasured || !state.hasIndicator) && (
            <DropZoneOverlay
              zoneId={DROP_ZONES.FLASK_ZONE}
              left="50%"
              top="35%"
              width={100}
              height={100}
              label={!state.acidMeasured ? t('apparatus.pipette', 'Pipette (HCl Aliquot)') : t('apparatus.indicator', 'Phenolphthalein')}
              isActive={activeDropZone === DROP_ZONES.FLASK_ZONE}
              step={state.step}
              targetStep={!state.acidMeasured ? Step.MEASURE_ACID : Step.ADD_INDICATOR}
            />
          )}
        </div>
      )}

      {/* ── 4. Continuous Titrant Fluid Stream (falling from burette nozzle to flask mouth) ── */}
      {state.stopcockOpen > 0 && state.buretteFilled && state.flaskPlaced && (
        <svg
          style={{
            position: 'absolute',
            left: 'calc(56% + 7px)',
            bottom: 'calc(16% + 140px)',
            transform: 'translateX(-50%)',
            width: '28px',
            height: '42px',
            zIndex: 11,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <line
            x1="14"
            y1="0"
            x2="14"
            y2="40"
            stroke="rgba(59, 130, 246, 0.85)"
            strokeWidth={Math.max(1.8, state.stopcockOpen * 3.6)}
            strokeLinecap="round"
          >
            <animate attributeName="stroke-dasharray" values="4,2; 2,4; 5,1" dur="0.14s" repeatCount="indefinite" />
          </line>
          <circle cx="14" cy="14" r="1.8" fill="rgba(59, 130, 246, 0.95)">
            <animate attributeName="cy" values="0;40" dur="0.22s" repeatCount="indefinite" />
          </circle>
          <circle cx="14" cy="28" r="1.9" fill="rgba(59, 130, 246, 0.95)">
            <animate attributeName="cy" values="0;40" dur="0.22s" begin="0.11s" repeatCount="indefinite" />
          </circle>
        </svg>
      )}

      {/* ── 5. Reagents Bench Shelf (Left Side, flat base on table surface at bottom: 16%) ── */}

      {/* 5a. HCl Stock Bottle (Dropzone & Placed Bottle) */}
      {!state.hclPlaced && (state.step === Step.SETUP_STAND || state.step === Step.MEASURE_ACID) && (
        <DropZoneOverlay
          zoneId={DROP_ZONES.HCL_BENCH_ZONE}
          left="14%"
          bottom="16%"
          transform="translate(-50%, 14px)"
          width={90}
          height={135}
          label={t('apparatus.hclBottle', 'HCl Stock (0.1 M)')}
          isActive={activeDropZone === DROP_ZONES.HCL_BENCH_ZONE}
          step={state.step}
          targetStep={state.step}
        />
      )}

      {state.hclPlaced && ReagentBottle && (
        <div
          id="placed-hcl-bottle"
          style={{
            position: 'absolute',
            left: '14%',
            bottom: '16%',
            transform: 'translate(-50%, 14px)',
            zIndex: 6,
            filter: 'drop-shadow(0 12px 16px rgba(0,0,0,0.32))',
          }}
        >
          <ReagentBottle
            id="hcl-stock"
            liquidLevel={0.8}
            liquidColor="rgba(56, 189, 248, 0.65)"
            label="HCl Stock (0.1 M)"
            width={90}
            height={135}
          />
          {!state.acidMeasured && (
            <DropZoneOverlay
              zoneId={DROP_ZONES.HCL_BOTTLE_ZONE}
              left="50%"
              top="50%"
              width={90}
              height={135}
              label={t('apparatus.pipette', 'Pipette (Draw Acid)')}
              isActive={activeDropZone === DROP_ZONES.HCL_BOTTLE_ZONE}
              step={state.step}
              targetStep={Step.MEASURE_ACID}
            />
          )}
        </div>
      )}

      {/* ── 6. Animations (Pipette Drawing, Dispensing, Pouring, Dropper) ── */}

      {/* Animated Pipette drawing from HCl — glass stem inserted deep inside bottle */}
      {state.isPipetteFilling && PipetteSVG && (
        <div
          id="anim-pipette-fill"
          style={{
            position: 'absolute',
            left: '14%',
            bottom: 'calc(16% + 20px)',
            transform: 'translateX(-50%)',
            zIndex: 30,
            filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.3))',
          }}
        >
          <PipetteSVG
            id="pipette-filling"
            liquidLevel={0.8}
            liquidColor="rgba(56, 189, 248, 0.7)"
            label="Drawing 25.0 mL HCl..."
            width={75}
            height={240}
          />
        </div>
      )}

      {/* Animated Pipette dispensing into Flask — tip lowered into flask neck */}
      {state.isPipetteDispensing && PipetteSVG && (
        <div
          id="anim-pipette-dispense"
          style={{
            position: 'absolute',
            left: 'calc(56% + 7px)',
            bottom: 'calc(16% + 100px)',
            transform: 'translateX(-50%)',
            zIndex: 30,
            filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.3))',
          }}
        >
          <PipetteSVG
            id="pipette-dispensing"
            liquidLevel={0}
            liquidColor="rgba(56, 189, 248, 0.7)"
            label="Dispensing 25.0 mL HCl..."
            width={75}
            height={240}
          />
        </div>
      )}

      {/* Animated NaOH pouring into Burette top */}
      {state.isPouring && ReagentBottle && (
        <div
          id="anim-naoh-pouring"
          style={{
            position: 'absolute',
            left: 'calc(56% + 7px)',
            bottom: 'calc(16% + 460px)',
            transform: 'translate(-35%, -30%) rotate(-35deg)',
            zIndex: 30,
            filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.35))',
          }}
        >
          <ReagentBottle
            id="pouring-naoh"
            liquidLevel={0.65}
            liquidColor="rgba(59, 130, 246, 0.6)"
            label="Filling Burette with NaOH..."
            width={85}
            height={130}
          />
        </div>
      )}

      {/* Animated Indicator Dropper adding 2 drops */}
      {state.isAddingIndicator && DropperBottle && (
        <div
          id="anim-indicator-dropping"
          style={{
            position: 'absolute',
            left: 'calc(56% + 7px)',
            bottom: 'calc(16% + 155px)',
            transform: 'translateX(-50%)',
            zIndex: 30,
            filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.3))',
          }}
        >
          <DropperBottle
            id="dropping-indicator"
            liquidColor="rgba(236, 72, 153, 0.9)"
            label="Adding 2 Drops Indicator..."
            width={75}
            height={125}
          />
          {/* Animated Falling Droplets into Flask Opening */}
          <svg
            style={{
              position: 'absolute',
              left: '50%',
              top: '85%',
              transform: 'translateX(-50%)',
              width: '24px',
              height: '35px',
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            {/* Drop 1 */}
            <circle cx="12" cy="0" r="2.2" fill="rgba(236, 72, 153, 0.95)">
              <animate attributeName="cy" values="0;28" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;1;0" dur="0.9s" repeatCount="indefinite" />
            </circle>
            {/* Drop 2 */}
            <circle cx="12" cy="0" r="2.2" fill="rgba(236, 72, 153, 0.95)">
              <animate attributeName="cy" values="0;28" dur="0.9s" begin="0.45s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;1;0" dur="0.9s" begin="0.45s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      )}

      {/* ── 7. Interactive Workbench Action Toolbar ── */}
      <div
        id="generic-bench-action-toolbar"
        style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          zIndex: 35,
          display: 'flex',
          gap: 8,
          background: 'var(--bg-card)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '6px 10px',
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
            all: 'unset',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: isSwirling ? '1px solid #2563eb' : '1px solid var(--border)',
            background: isSwirling ? '#2563eb' : 'var(--bg-secondary)',
            color: isSwirling ? '#ffffff' : 'var(--text-secondary)',
            boxShadow: isSwirling ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '0.9rem', display: 'inline-block', animation: isSwirling ? 'spinBarRapid 1s linear infinite' : 'none' }}>🔄</span>
          <span>{isSwirling ? t('lab.swirling', 'Swirling') : t('lab.shake', 'Swirl Flask')}</span>
        </button>

        {/* Magnetic Stirrer toggle */}
        <button
          type="button"
          id="btn-generic-stir-solution"
          onClick={() => setIsStirring(prev => !prev)}
          title="Toggle magnetic stirring"
          style={{
            all: 'unset',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: isStirring ? '1px solid #10b981' : '1px solid var(--border)',
            background: isStirring ? '#10b981' : 'var(--bg-secondary)',
            color: isStirring ? '#ffffff' : 'var(--text-secondary)',
            boxShadow: isStirring ? '0 2px 8px rgba(16, 185, 129, 0.35)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '0.9rem', display: 'inline-block', animation: isStirring ? 'spinBarRapid 0.4s linear infinite' : 'none' }}>🌀</span>
          <span>{isStirring ? t('lab.stirring', 'Stirring') : t('lab.stir', 'Stir')}</span>
        </button>

        {/* Stopcock quick step button during Titration */}
        {state.buretteMounted && state.buretteFilled && (
          <button
            type="button"
            id="btn-generic-tap-cork"
            onClick={() => {
              if (!stopcockEnabled) return;
              let nextOpen = 0;
              if (state.stopcockOpen === 0) nextOpen = 0.25;
              else if (state.stopcockOpen < 0.45) nextOpen = 0.50;
              else if (state.stopcockOpen < 0.70) nextOpen = 0.75;
              else nextOpen = 0;
              handleSetStopcock(nextOpen);
            }}
            title="Click to step burette flow: Closed → Slow Drop (25%) → Fast Drop (50%) → Stream (75%) → Closed"
            style={{
              all: 'unset',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: stopcockEnabled ? 'pointer' : 'not-allowed',
              opacity: stopcockEnabled ? 1 : 0.5,
              border: state.stopcockOpen > 0 ? '1px solid #2563eb' : '1px solid var(--border)',
              background: state.stopcockOpen > 0 ? '#2563eb' : 'var(--bg-secondary)',
              color: state.stopcockOpen > 0 ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: state.stopcockOpen > 0 ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>🚰</span>
            <span>
              {state.stopcockOpen === 0
                ? t('lab.tapClosed', 'Tap Closed')
                : state.stopcockOpen <= 0.25
                ? `${t('lab.slowDrop', 'Slow Drop')} (25%)`
                : state.stopcockOpen <= 0.60
                ? `${t('lab.fastDrop', 'Fast Drop')} (50%)`
                : `${t('lab.rapidFlow', 'Rapid Stream')} (${Math.round(state.stopcockOpen * 100)}%)`}
            </span>
          </button>
        )}
      </div>

      {/* Mark Endpoint button (Docked above action bar during Titration step) */}
      {state.step === Step.TITRATING && (
        <button
          id="btn-mark-endpoint"
          className="btn-primary"
          onClick={() => {
            if (onMarkEndpoint) onMarkEndpoint();
            else dispatch({ type: 'MARK_ENDPOINT' });
          }}
          style={{
            position: 'absolute',
            bottom: 64,
            left: 14,
            zIndex: 36,
            fontSize: '0.82rem',
            fontWeight: 700,
            padding: '8px 18px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
          }}
        >
          ✓ {t('lab.markEndpoint', 'Mark Endpoint')}
        </button>
      )}

      {/* Proceed to Calculation button (Docked above action bar when Endpoint Marked) */}
      {state.step === Step.ENDPOINT_MARKED && (
        <button
          id="btn-proceed-calculation-bench"
          className="btn-primary"
          onClick={() => dispatch({ type: 'PROCEED_TO_CALCULATION' })}
          style={{
            position: 'absolute',
            bottom: 64,
            left: 14,
            zIndex: 36,
            fontSize: '0.82rem',
            fontWeight: 700,
            padding: '8px 18px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
          }}
        >
          {t('lab.proceedCalculation', 'Proceed to Calculation →')}
        </button>
      )}
    </div>
  );
};

// ── Drop Zone Overlay (matches GenericBench DropZone styling) ──
const DropZoneOverlay: React.FC<{
  zoneId: string;
  left?: string;
  top?: string;
  bottom?: string;
  right?: string;
  transform?: string;
  width: number;
  height: number;
  label: string;
  isActive: boolean;
  step: Step;
  targetStep: Step;
  hidden?: boolean;
}> = ({
  zoneId,
  left,
  top,
  bottom,
  right,
  transform = 'translate(-50%, -50%)',
  width,
  height,
  label,
  isActive,
  step,
  targetStep,
  hidden,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: zoneId });

  if (hidden) return null;

  const isRelevant = step === targetStep;
  const isHighlighted = isRelevant && (isOver || isActive);

  return (
    <div
      ref={setNodeRef}
      id={`dropzone-${zoneId}`}
      style={{
        position: 'absolute',
        left,
        top,
        bottom,
        right,
        width,
        height,
        transform,
        borderRadius: 'var(--radius-lg, 12px)',
        border: `2px dashed ${
          isOver
            ? '#2563eb'
            : isActive
            ? '#3b82f6'
            : isRelevant
            ? 'rgba(59, 130, 246, 0.55)'
            : 'transparent'
        }`,
        background: isOver
          ? 'rgba(37, 99, 235, 0.18)'
          : isActive
          ? 'rgba(59, 130, 246, 0.12)'
          : isRelevant
          ? 'rgba(59, 130, 246, 0.04)'
          : 'transparent',
        boxShadow: isOver
          ? '0 0 20px rgba(37, 99, 235, 0.45)'
          : isActive
          ? '0 0 16px rgba(59, 130, 246, 0.35)'
          : isRelevant
          ? '0 2px 10px rgba(59, 130, 246, 0.08)'
          : 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: isOver || isActive ? 24 : isRelevant ? 12 : 5,
        pointerEvents: isRelevant ? 'auto' : 'none',
      }}
    >
      {/* Drop Zone Label Pill */}
      {isHighlighted && label && (
        <div
          style={{
            position: 'absolute',
            top: '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 14,
            whiteSpace: 'nowrap',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.66rem',
              fontWeight: 700,
              color: isOver ? '#1e40af' : '#1d4ed8',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: '#ffffff',
              padding: '2px 8px',
              borderRadius: 12,
              border: '1.5px solid #3b82f6',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
            }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

export default LabBench;
