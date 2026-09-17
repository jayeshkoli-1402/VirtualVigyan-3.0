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
import { AuthProvider } from './auth/AuthContext';
import AuthModal from './components/auth/AuthModal';
import { AuthPage } from './components/auth/AuthPage';
import AdminPanel from './components/admin/AdminPanel';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import { AppSidebar, type NavItem } from './components/layout/AppSidebar';
import { TopHeader } from './components/layout/TopHeader';
import { ClassesView } from './components/home/ClassesView';
import { TheoryNotesView } from './components/home/TheoryNotesView';
import { ProgressView } from './components/home/ProgressView';
import { SettingsModal } from './components/home/SettingsModal';
import { AboutModal } from './components/home/AboutModal';
import { HowItWorksModal } from './components/home/HowItWorksModal';

type ActiveExperiment = 'select' | 'auth' | 'admin' | 'teacher' | 'titration' | 'conservation' | 'conservation-vr' | string;

const AppContent: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<'student' | 'teacher'>('student');

  const [activeExperiment, setActiveExperiment] = useState<ActiveExperiment>('select');
  const [activeTab, setActiveTab] = useState<NavItem>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);

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

  const handleNavigateToAuth = (role: 'student' | 'teacher' = 'student') => {
    setAuthRole(role);
    setActiveExperiment('auth');
  };

  // ── Dedicated Authentication Page (Student & Teacher Login) ──
  if (activeExperiment === 'auth') {
    return (
      <AuthPage
        initialRole={authRole}
        theme={theme}
        onToggleTheme={toggleTheme}
        onBackToLab={() => {
          setActiveExperiment('select');
          setActiveTab('home');
        }}
        onRoleRedirect={(role) => {
          if (role === 'admin') {
            setActiveExperiment('admin');
          } else if (role === 'teacher') {
            setActiveExperiment('teacher');
          } else {
            setActiveExperiment('select');
            setActiveTab('home');
          }
        }}
      />
    );
  }

  // If in 'select' mode, render the full new Dashboard shell matching the user's mockup
  if (activeExperiment === 'select') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {/* ── Left Navigation Sidebar ── */}
        <AppSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'settings') {
              setSettingsModalOpen(true);
            } else if (tab === 'about') {
              setAboutModalOpen(true);
            } else if (tab === 'teacher') {
              setActiveTab('teacher');
              setActiveExperiment('teacher');
            } else if (tab === 'auth') {
              handleNavigateToAuth('student');
            } else {
              setActiveTab(tab);
              setActiveExperiment('select');
            }
          }}
          onNavigateToAuth={handleNavigateToAuth}
          isMobile={isMobile}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* ── Main Workspace Area ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
          {/* Top Header */}
          <TopHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenAuthModal={() => {
              handleNavigateToAuth('student');
            }}
            onNavigateToAuth={handleNavigateToAuth}
            isMobile={isMobile}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          {/* Views */}
          <main style={{ flex: 1, padding: isMobile ? '20px 16px' : '32px 36px', boxSizing: 'border-box' }}>
            {activeTab === 'home' || activeTab === 'experiments' ? (
              <ExperimentSelector
                onSelectExperiment={handleSelectExperiment}
                onSelectEngineExperiment={(id) => setActiveExperiment(id)}
                onSelectVR={() => setActiveExperiment('conservation-vr')}
                onGoToNotes={() => setActiveTab('theory-notes')}
                onOpenHowItWorks={() => setHowItWorksModalOpen(true)}
                externalSearchQuery={searchQuery}
              />
            ) : activeTab === 'classes' ? (
              <ClassesView
                onBackToHome={() => setActiveTab('home')}
                onLaunchExperiment={(id) => {
                  if (id === 'titration') handleSelectExperiment('titration');
                  else if (id === 'conservation') handleSelectExperiment('conservation');
                  else setActiveExperiment(id);
                }}
              />
            ) : activeTab === 'theory-notes' ? (
              <TheoryNotesView
                onBackToHome={() => setActiveTab('home')}
                onLaunchExperiment={(id) => {
                  if (id === 'titration') handleSelectExperiment('titration');
                  else if (id === 'conservation') handleSelectExperiment('conservation');
                  else setActiveExperiment(id);
                }}
              />
            ) : activeTab === 'progress' ? (
              <ProgressView
                onBackToHome={() => setActiveTab('home')}
                onLaunchExperiment={(id) => {
                  if (id === 'titration') handleSelectExperiment('titration');
                  else if (id === 'conservation') handleSelectExperiment('conservation');
                  else setActiveExperiment(id);
                }}
              />
            ) : null}
          </main>
        </div>

        {/* Global Modals */}
        <SettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <AboutModal
          isOpen={aboutModalOpen}
          onClose={() => setAboutModalOpen(false)}
        />
        <HowItWorksModal
          isOpen={howItWorksModalOpen}
          onClose={() => setHowItWorksModalOpen(false)}
          onStartExploring={() => {
            setActiveTab('home');
            const section = document.getElementById('browse-experiments-section');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialTab={authModalTab}
          onRoleRedirect={(role) => {
            if (role === 'admin') setActiveExperiment('admin');
            else if (role === 'teacher') setActiveExperiment('teacher');
            else setActiveExperiment('select');
          }}
        />
      </div>
    );
  }

  // ── When in active experiment mode (simulation, teacher, or admin) ──
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* ── Laboratory Top Header ── */}
      <header
        style={{
          padding: '0 20px',
          height: 54,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            id="btn-back-to-selector"
            onClick={handleBackToSelector}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#2563eb',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            ← Back to Dashboard
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--radius-md)',
                background: headerInfo.color,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}
            >
              ⚗️
            </div>
            <div>
              <h1
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1.2,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                VirtualVigyan Lab
              </h1>
              <p
                style={{
                  fontSize: '0.66rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {headerInfo.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Step progress indicator — titration */}
          {activeExperiment === 'titration' && state.step !== Step.SELECT && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginRight: 8 }}>
              {STEP_ORDER.map((step, i) => {
                const isCompleted = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div
                    key={step}
                    title={STEP_LABELS[step]}
                    style={{
                      width: isCurrent ? 18 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: isCompleted
                        ? 'var(--accent-teal)'
                        : isCurrent
                          ? 'var(--accent)'
                          : 'var(--border)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Theme toggle */}
          <button
            id="btn-toggle-theme-lab"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              background: 'var(--bg-secondary)',
            }}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Main Experiment Content */}
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
            onNavigateToAuth={handleNavigateToAuth}
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
                    : `${leftCollapsed ? '48px' : '210px'} 1fr ${rightCollapsed ? '48px' : '260px'}`,
                  gap: 0,
                  minHeight: 0,
                  transition: 'grid-template-columns 0.2s ease',
                }}
              >
                {/* Left: Toolbox */}
                <div
                  style={{
                    borderRight: isMobile ? 'none' : '1px solid var(--border)',
                    borderBottom: isMobile ? '1px solid var(--border)' : 'none',
                    background: 'var(--bg-card)',
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
                    background: 'var(--bg-secondary)',
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
                    borderLeft: isMobile ? 'none' : '1px solid var(--border)',
                    borderTop: isMobile ? '1px solid var(--border)' : 'none',
                    background: 'var(--bg-card)',
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
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--accent)',
                    opacity: 0.95,
                    cursor: 'grabbing',
                    boxShadow: 'var(--shadow-lg)',
                    animation: shakeItem === activeDragId ? 'shake 0.3s ease' : undefined,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{getDragLabel(activeDragId).icon}</span>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--accent)',
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
