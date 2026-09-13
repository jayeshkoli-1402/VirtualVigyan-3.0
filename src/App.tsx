import React, { useReducer, useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import {
  titrationReducer,
  initialState,
  Step,
  STEP_ORDER,
  STEP_LABELS,
  DRAG_ITEMS,
  DROP_ZONES,
} from './engine/titrationState';
import { canMarkEndpoint, canDropOnZone, canDispensePipette } from './engine/validation';
import Toolbox from './components/Toolbox';
import LabBench from './components/LabBench';
import InstructionsPanel from './components/InstructionsPanel';
import CalculationForm from './components/CalculationForm';
import ResultsScreen from './components/ResultsScreen';
import ExperimentSelector from './components/ExperimentSelector';
import ConservationExperiment from './components/conservation/ConservationExperiment';
import GenericLab from './components/GenericLab/GenericLab';
import { getExperimentById } from './experiments';
import { AuthProvider, useAuth } from './auth/AuthContext';
import AuthModal from './components/auth/AuthModal';
import AdminPanel from './components/admin/AdminPanel';
import TeacherDashboard from './components/teacher/TeacherDashboard';

type ActiveExperiment = 'select' | 'admin' | 'teacher' | 'titration' | 'conservation' | 'conservation-vr' | string;

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const [activeExperiment, setActiveExperiment] = useState<ActiveExperiment>('select');
  const [state, dispatch] = useReducer(titrationReducer, initialState);
  const [mistakeMessage, setMistakeMessage] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [shakeItem, setShakeItem] = useState<string | null>(null);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // Theme support (light / dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('vv_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('vv_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

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

  const handleDragOver = useCallback((event: DragOverEvent) => {
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

      // Indicator → flask (Animate exactly 2 drops into flask)
      if (zoneId === DROP_ZONES.FLASK_ZONE && itemId === DRAG_ITEMS.INDICATOR) {
        dispatch({ type: 'ADD_INDICATOR_START' });
        setTimeout(() => dispatch({ type: 'ADD_INDICATOR_END' }), 2000);
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

  const handleSelectExperiment = (id: 'titration' | 'conservation') => {
    setActiveExperiment(id);
    if (id === 'titration') {
      dispatch({ type: 'RESET' });
      dispatch({ type: 'START_EXPERIMENT' });
    }
  };

  const handleBackToSelector = () => {
    setActiveExperiment('select');
    dispatch({ type: 'RESET' });
  };

  const currentStepIndex = STEP_ORDER.indexOf(state.step);
  const showFullLab = activeExperiment === 'titration' && state.step !== Step.SELECT && state.step !== Step.CALCULATION && state.step !== Step.RESULTS;

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

  // Get experiment-specific header info
  const getHeaderInfo = () => {
    if (activeExperiment === 'admin') {
      return { subtitle: '🛡️ Admin & Moderator Command Center', color: '#7c3aed' };
    }
    if (activeExperiment === 'teacher') {
      return { subtitle: '👨‍🏫 Teacher & Faculty Portal', color: '#0284c7' };
    }
    if (activeExperiment === 'conservation') {
      return { subtitle: 'Conservation of Mass', color: '#059669' };
    }
    if (activeExperiment === 'conservation-vr') {
      return { subtitle: '🥽 Conservation of Mass (3D VR Lab)', color: '#059669' };
    }
    if (activeExperiment === 'titration') {
      return { subtitle: 'Acid-Base Titration', color: '#2563eb' };
    }
    if (activeExperiment !== 'select') {
      const engineExp = getExperimentById(activeExperiment);
      if (engineExp) {
        return { subtitle: engineExp.title, color: engineExp.themeColor };
      }
    }
    return { subtitle: 'Interactive Chemistry Lab', color: '#2563eb' };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          padding: '10px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {activeExperiment !== 'select' && (
            <button
              id="btn-back-to-selector"
              onClick={handleBackToSelector}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              ← Back
            </button>
          )}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: headerInfo.color,
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
                color: headerInfo.color,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {headerInfo.subtitle}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Step progress — titration only */}
          {activeExperiment === 'titration' && state.step !== Step.SELECT && (
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

          {/* Theme Switcher Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="clay-btn clay-btn-neutral"
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>

          {/* User Auth Profile / Login Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {user.role === 'admin' && (
                <button
                  id="btn-nav-admin"
                  onClick={() => setActiveExperiment(activeExperiment === 'admin' ? 'select' : 'admin')}
                  className={`clay-btn ${activeExperiment === 'admin' ? 'clay-btn-neutral' : 'clay-btn-purple'}`}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 14,
                    fontSize: '0.78rem',
                  }}
                >
                  <span>🛡️</span>
                  <span>{activeExperiment === 'admin' ? 'Browse Labs' : 'Admin Panel'}</span>
                </button>
              )}

              {user.role === 'teacher' && (
                <button
                  id="btn-nav-teacher"
                  onClick={() => setActiveExperiment(activeExperiment === 'teacher' ? 'select' : 'teacher')}
                  className={`clay-btn ${activeExperiment === 'teacher' ? 'clay-btn-neutral' : 'clay-btn-blue'}`}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 14,
                    fontSize: '0.78rem',
                  }}
                >
                  <span>👨‍🏫</span>
                  <span>{activeExperiment === 'teacher' ? 'Browse Labs' : 'Teacher Portal'}</span>
                </button>
              )}

              {/* User Profile Pill */}
              <div
                className="clay-badge"
                style={{
                  padding: '4px 10px 4px 6px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              >
                <span style={{ fontSize: 18 }}>{user.avatar || '👤'}</span>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {user.name}
                </span>
                <span
                  className="clay-badge"
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    background:
                      user.role === 'admin'
                        ? 'rgba(124, 58, 237, 0.18)'
                        : user.role === 'teacher'
                        ? 'rgba(2, 132, 199, 0.18)'
                        : 'rgba(5, 150, 105, 0.18)',
                    color:
                      user.role === 'admin' ? '#a78bfa' : user.role === 'teacher' ? '#38bdf8' : '#34d399',
                  }}
                >
                  {user.role}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                id="btn-sign-out"
                onClick={() => {
                  logout();
                  setActiveExperiment('select');
                }}
                title="Sign Out"
                className="clay-btn clay-btn-neutral"
                style={{
                  padding: '6px 12px',
                  borderRadius: 12,
                  fontSize: '0.75rem',
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              id="btn-open-auth-modal"
              onClick={() => {
                setAuthModalTab('login');
                setAuthModalOpen(true);
              }}
              className="clay-btn clay-btn-emerald"
              style={{
                padding: '7px 18px',
                borderRadius: 20,
                fontSize: '0.82rem',
                fontWeight: 800,
              }}
            >
              <span>🔑</span>
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Admin Command Center */}
        {activeExperiment === 'admin' && (
          <AdminPanel
            onLaunchExperiment={(id) => setActiveExperiment(id)}
            onViewAsStudent={() => setActiveExperiment('select')}
          />
        )}

        {/* Teacher Dashboard */}
        {activeExperiment === 'teacher' && (
          <TeacherDashboard
            onLaunchExperiment={(id) => setActiveExperiment(id)}
          />
        )}

        {/* Experiment Selector */}
        {activeExperiment === 'select' && (
          <ExperimentSelector
            onSelectExperiment={handleSelectExperiment}
            onSelectEngineExperiment={(id) => setActiveExperiment(id)}
            onSelectVR={() => setActiveExperiment('conservation-vr')}
          />
        )}

        {/* Engine-driven Experiments (New Architecture) */}
        {activeExperiment !== 'select' && activeExperiment !== 'admin' && activeExperiment !== 'teacher' && activeExperiment !== 'titration' && activeExperiment !== 'conservation' && activeExperiment !== 'conservation-vr' && (() => {
          const engineConfig = getExperimentById(activeExperiment);
          return engineConfig ? (
            <GenericLab config={engineConfig} onBackToSelector={handleBackToSelector} />
          ) : null;
        })()}

        {/* Conservation Experiment (2D Lab) */}
        {activeExperiment === 'conservation' && (
          <ConservationExperiment onBackToSelector={handleBackToSelector} />
        )}

        {/* Conservation Experiment (3D VR Mode) */}
        {activeExperiment === 'conservation-vr' && (
          <ConservationExperiment initialVRMode={true} onBackToSelector={handleBackToSelector} />
        )}

        {/* Titration Experiment */}
        {activeExperiment === 'titration' && (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
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
        )}
      </main>

      {/* Global Authentication & Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
        onRoleRedirect={(role) => {
          if (role === 'admin') {
            setActiveExperiment('admin');
          } else if (role === 'teacher') {
            setActiveExperiment('teacher');
          } else {
            setActiveExperiment('select');
          }
        }}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
