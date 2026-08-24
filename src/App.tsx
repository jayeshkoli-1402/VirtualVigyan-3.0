import React, { useReducer, useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  titrationReducer,
  initialState,
  Step,
  STEP_ORDER,
  STEP_LABELS,
  DRAG_ITEMS,
  DROP_ZONES,
  VALID_DROPS,
} from './engine/titrationState';
import { canMarkEndpoint, canDropOnZone, canDispensePipette } from './engine/validation';
import Toolbox from './components/Toolbox';
import LabBench from './components/LabBench';
import InstructionsPanel from './components/InstructionsPanel';
import CalculationForm from './components/CalculationForm';
import ResultsScreen from './components/ResultsScreen';

const App: React.FC = () => {
  const [state, dispatch] = useReducer(titrationReducer, initialState);
  const [mistakeMessage, setMistakeMessage] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [shakeItem, setShakeItem] = useState<string | null>(null);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // dnd-kit sensors: pointer (mouse) + touch
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  // Responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Clear mistake messages after delay
  useEffect(() => {
    if (mistakeMessage) {
      const timer = setTimeout(() => setMistakeMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mistakeMessage]);

  // ── Drag handlers ──
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
    setMistakeMessage(null);
  }, []);

  const handleDragOver = useCallback((event: { over: { id: string } | null }) => {
    setActiveDropZone(event.over ? (event.over.id as string) : null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragId(null);
      setActiveDropZone(null);

      if (!over) return;

      const itemId = active.id as string;
      const zoneId = over.id as string;

      // Validate the drop
      const validation = canDropOnZone(itemId, zoneId);
      if (!validation.allowed) {
        setMistakeMessage(validation.message);
        // Shake animation
        setShakeItem(itemId);
        setTimeout(() => setShakeItem(null), 500);
        return;
      }

      // ── Handle valid drops by zone ──

      // Burette → clamp
      if (zoneId === DROP_ZONES.CLAMP && itemId === DRAG_ITEMS.BURETTE) {
        dispatch({ type: 'MOUNT_BURETTE' });
        return;
      }

      // Flask → base
      if (zoneId === DROP_ZONES.BASE && itemId === DRAG_ITEMS.FLASK) {
        dispatch({ type: 'PLACE_FLASK' });
        return;
      }

      // HCl Stock bottle → Bench
      if (zoneId === DROP_ZONES.HCL_BENCH_ZONE && itemId === DRAG_ITEMS.HCL_BOTTLE) {
        dispatch({ type: 'PLACE_HCL' });
        return;
      }

      // Pipette → HCl bottle (draw acid)
      if (zoneId === DROP_ZONES.HCL_BOTTLE_ZONE && itemId === DRAG_ITEMS.PIPETTE) {
        if (state.pipetteFilled) {
          setMistakeMessage('Pipette is already filled with 25 mL acid.');
          return;
        }
        // Animate fill
        dispatch({ type: 'FILL_PIPETTE_START' });
        setTimeout(() => dispatch({ type: 'FILL_PIPETTE_END' }), 1200);
        return;
      }

      // Pipette → Flask (dispense acid)
      if (zoneId === DROP_ZONES.FLASK_ZONE && itemId === DRAG_ITEMS.PIPETTE) {
        const check = canDispensePipette(state.pipetteFilled);
        if (!check.allowed) {
          setMistakeMessage(check.message);
          return;
        }
        // Animate dispense
        dispatch({ type: 'DISPENSE_PIPETTE_START' });
        setTimeout(() => dispatch({ type: 'DISPENSE_PIPETTE_END' }), 1500);
        return;
      }

      // NaOH bottle → burette top
      if (zoneId === DROP_ZONES.BURETTE_TOP && itemId === DRAG_ITEMS.NAOH_BOTTLE) {
        dispatch({ type: 'FILL_BURETTE_START' });
        setTimeout(() => dispatch({ type: 'FILL_BURETTE_END' }), 1500);
        return;
      }

      // Indicator → flask
      if (zoneId === DROP_ZONES.FLASK_ZONE && itemId === DRAG_ITEMS.INDICATOR) {
        dispatch({ type: 'ADD_INDICATOR' });
        return;
      }
    },
    [state.pipetteFilled, dispatch]
  );

  // ── Mark Endpoint validation (intercept from LabBench) ──
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.id === 'btn-mark-endpoint') {
        e.preventDefault();
        e.stopPropagation();
        const result = canMarkEndpoint(state.volumeAdded);
        if (!result.allowed) {
          setMistakeMessage(result.message);
          // Undo the dispatch from LabBench (we dispatch here instead)
          return;
        }
        if (result.message) {
          setMistakeMessage(result.message);
        }
        dispatch({ type: 'MARK_ENDPOINT' });
      }
    };
    // Capture phase to intercept before LabBench's onClick
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [state.volumeAdded, dispatch]);

  const currentStepIndex = STEP_ORDER.indexOf(state.step);
  const showFullLab = ![Step.SELECT, Step.CALCULATION, Step.RESULTS].includes(state.step);

  // Drag overlay label
  const getDragLabel = (id: string) => {
    const labels: Record<string, { icon: string; label: string }> = {
      [DRAG_ITEMS.BURETTE]: { icon: '🧪', label: 'Burette' },
      [DRAG_ITEMS.FLASK]: { icon: '⚗️', label: 'Conical Flask' },
      [DRAG_ITEMS.PIPETTE]: { icon: '💉', label: 'Pipette' },
      [DRAG_ITEMS.HCL_BOTTLE]: { icon: '🧴', label: 'HCl Stock' },
      [DRAG_ITEMS.NAOH_BOTTLE]: { icon: '🫧', label: 'NaOH Reagent' },
      [DRAG_ITEMS.INDICATOR]: { icon: '💧', label: 'Phenolphthalein' },
    };
    return labels[id] || { icon: '📦', label: id };
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header
          style={{
            padding: '10px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              ⚗️
            </div>
            <div>
              <h1
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: 'var(--text-primary)',
                }}
              >
                VirtualVigyan
              </h1>
              <p
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Interactive Chemistry Lab
              </p>
            </div>
          </div>

          {/* Step progress */}
          {state.step !== Step.SELECT && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {STEP_ORDER.map((step, i) => {
                const isCompleted = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div
                    key={step}
                    title={STEP_LABELS[step]}
                    style={{
                      width: isCurrent ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: isCompleted
                        ? 'var(--accent-teal)'
                        : isCurrent
                          ? 'linear-gradient(90deg, var(--accent-teal), var(--accent-blue))'
                          : 'rgba(148, 163, 184, 0.15)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                );
              })}
            </div>
          )}
        </header>

        {/* Main content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* SELECT screen */}
          {state.step === Step.SELECT && (
            <div
              className="animate-fade-in"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
              }}
            >
              <div className="glass-card" style={{ padding: 32, maxWidth: 420, textAlign: 'center' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    background:
                      'linear-gradient(135deg, rgba(45, 212, 191, 0.15), rgba(59, 130, 246, 0.15))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(45, 212, 191, 0.2)',
                  }}
                >
                  <span style={{ fontSize: 28 }}>🧪</span>
                </div>
                <h2
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    marginBottom: 8,
                    background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Acid-Base Titration
                </h2>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    marginBottom: 24,
                    lineHeight: 1.6,
                  }}
                >
                  Determine the unknown concentration of HCl by titrating with NaOH solution.
                  Drag apparatus onto the lab bench and operate the stopcock to titrate.
                </p>
                <button
                  id="btn-start-experiment"
                  className="btn-primary"
                  onClick={() => dispatch({ type: 'START_EXPERIMENT' })}
                  style={{ width: '100%', padding: '12px 20px' }}
                >
                  Start Experiment →
                </button>
              </div>
            </div>
          )}

          {/* CALCULATION screen */}
          {state.step === Step.CALCULATION && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <div style={{ maxWidth: 500, width: '100%' }}>
                <CalculationForm markedVolume={state.endpointMarkedAt ?? 0} dispatch={dispatch} />
              </div>
            </div>
          )}

          {/* RESULTS screen */}
          {state.step === Step.RESULTS && (
            <div style={{ flex: 1, padding: 20 }}>
              <ResultsScreen state={state} dispatch={dispatch} />
            </div>
          )}

          {/* Three-panel lab layout */}
          {showFullLab && (
            <div
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : `${leftCollapsed ? '52px' : '200px'} 1fr ${rightCollapsed ? '52px' : '240px'}`,
                gap: 0,
                minHeight: 0,
                transition: 'grid-template-columns 0.2s ease',
              }}
            >
              {/* Left: Toolbox */}
              <div
                style={{
                  borderRight: isMobile ? 'none' : '1px solid var(--border-subtle)',
                  borderBottom: isMobile ? '1px solid var(--border-subtle)' : 'none',
                  background: '#ffffff',
                  order: isMobile ? 1 : 0,
                }}
              >
                <Toolbox
                  state={state}
                  isCollapsed={leftCollapsed}
                  onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
                />
              </div>

              {/* Center: Lab bench */}
              <div
                style={{
                  display: 'flex',
                  padding: 8,
                  order: isMobile ? 0 : 1,
                  background: '#f8fafc',
                }}
              >
                <LabBench
                  state={state}
                  dispatch={dispatch}
                  activeDropZone={activeDropZone}
                />
              </div>

              {/* Right: Instructions */}
              <div
                style={{
                  borderLeft: isMobile ? 'none' : '1px solid var(--border-subtle)',
                  borderTop: isMobile ? '1px solid var(--border-subtle)' : 'none',
                  background: '#ffffff',
                  order: 2,
                }}
              >
                <InstructionsPanel
                  state={state}
                  dispatch={dispatch}
                  mistakeMessage={mistakeMessage}
                  isCollapsed={rightCollapsed}
                  onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Drag overlay (ghost while dragging) */}
      <DragOverlay>
        {activeDragId ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              border: '1.5px solid #2563eb',
              opacity: 0.95,
              cursor: 'grabbing',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              animation: shakeItem === activeDragId ? 'shake 0.3s ease' : undefined,
            }}
          >
            <span style={{ fontSize: 18 }}>{getDragLabel(activeDragId).icon}</span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#1d4ed8',
              }}
            >
              {getDragLabel(activeDragId).label}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;
