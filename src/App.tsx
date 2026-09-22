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
import { AuthPage } from './components/auth/AuthPage';
import AdminPanel from './components/admin/AdminPanel';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import { AppSidebar, type NavItem } from './components/layout/AppSidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MyClassesView } from './components/student/MyClassesView';
import { JoinLabModal } from './components/student/JoinLabModal';
import type { PrivateLab, PrivateLabContext } from './types/privateLab';
import { TheoryNotesView } from './components/home/TheoryNotesView';
import { ProgressView } from './components/home/ProgressView';
import { SettingsModal } from './components/home/SettingsModal';
import { AboutModal } from './components/home/AboutModal';
import { HowItWorksModal } from './components/home/HowItWorksModal';
import { StudentProfileSetupModal } from './components/auth/StudentProfileSetupModal';
import LandingPage from './components/landing/LandingPage';
import { VirtualVigyanLogo } from './components/common/VirtualVigyanLogo';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { LanguageSelector } from './components/common/LanguageSelector';
import { getLocalizedExperimentTitle } from './i18n/experimentTranslations';
import ExperimentSafetyModal from './components/common/ExperimentSafetyModal';

type ActiveExperiment = 'select' | 'auth' | 'admin' | 'teacher' | 'titration' | 'conservation' | 'conservation-vr' | string;

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<'student' | 'teacher'>('student');
  const [showLanding, setShowLanding] = useState(() => {
    const stored = sessionStorage.getItem('vv_showLanding');
    if (stored !== null) return stored === 'true';
    const cachedUser = localStorage.getItem('vv_active_user');
    return cachedUser ? false : true;
  });

  const [activeExperiment, setActiveExperiment] = useState<ActiveExperiment>(() => {
    const stored = sessionStorage.getItem('vv_activeExperiment');
    if (stored) return stored as ActiveExperiment;
    const cachedUser = localStorage.getItem('vv_active_user');
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        if (parsed.role === 'teacher') return 'teacher';
        if (parsed.role === 'admin') return 'admin';
      } catch {}
    }
    return 'select';
  });
  const [activeTab, setActiveTab] = useState<NavItem>(() => {
    return (sessionStorage.getItem('vv_activeTab') as NavItem) || 'experiments';
  });
  const [headerSafetyModalOpen, setHeaderSafetyModalOpen] = useState(false);

  // When user is authenticated, keep landing hidden and route properly
  useEffect(() => {
    if (user) {
      setShowLanding(false);
      sessionStorage.setItem('vv_showLanding', 'false');
      if (activeExperiment === 'auth') {
        if (user.role === 'admin') {
          setActiveExperiment('admin');
        } else if (user.role === 'teacher') {
          setActiveExperiment('teacher');
        } else {
          setActiveExperiment('select');
          setActiveTab('experiments');
        }
      }
    }
  }, [user, activeExperiment]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [profileSetupOpen, setProfileSetupOpen] = useState(false);
  const [joinLabModalOpen, setJoinLabModalOpen] = useState(false);
  const [activePrivateLabContext, setActivePrivateLabContext] = useState<PrivateLabContext | null>(null);

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

  // Persist navigation state to sessionStorage for refresh resilience
  useEffect(() => {
    sessionStorage.setItem('vv_showLanding', String(showLanding));
  }, [showLanding]);

  useEffect(() => {
    sessionStorage.setItem('vv_activeExperiment', activeExperiment);
  }, [activeExperiment]);

  useEffect(() => {
    sessionStorage.setItem('vv_activeTab', activeTab);
  }, [activeTab]);

  // Ensure teachers are never kept on the student-only 'classes' tab
  useEffect(() => {
    if (user?.role === 'teacher' && activeTab === 'classes') {
      setActiveTab('teacher');
      setActiveExperiment('teacher');
    }
  }, [user?.role, activeTab]);

  // Automatically open pre-lab Safety Briefing when entering an experiment
  useEffect(() => {
    const isActualExperiment =
      !showLanding &&
      activeExperiment !== 'select' &&
      activeExperiment !== 'admin' &&
      activeExperiment !== 'teacher' &&
      activeExperiment !== 'auth';

    if (isActualExperiment) {
      setHeaderSafetyModalOpen(true);
    }
  }, [activeExperiment, showLanding]);

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

  // ── Mark Endpoint validation ──
  const handleMarkEndpoint = useCallback(() => {
    const result = canMarkEndpoint(state.volumeAdded);
    if (!result.allowed) {
      setMistakeMessage(result.message);
      return;
    }
    if (result.message) {
      setMistakeMessage(result.message);
    }
    dispatch({ type: 'MARK_ENDPOINT' });
  }, [state.volumeAdded, dispatch]);

  const handleLaunchPrivateExperiment = (experimentId: string, lab: PrivateLab, attemptNumber: number) => {
    setActivePrivateLabContext({ lab, attemptNumber });
    if (experimentId === 'titration') {
      setActiveExperiment('titration');
      dispatch({ type: 'RESET' });
      dispatch({ type: 'START_EXPERIMENT' });
    } else if (experimentId === 'conservation') {
      setActiveExperiment('conservation');
    } else {
      setActiveExperiment(experimentId);
    }
  };

  const handleSelectExperiment = (id: 'titration' | 'conservation') => {
    setActivePrivateLabContext(null);
    setActiveExperiment(id);
    if (id === 'titration') {
      dispatch({ type: 'RESET' });
      dispatch({ type: 'START_EXPERIMENT' });
    }
  };

  const handleBackToSelector = () => {
    setActiveExperiment('select');
    setActivePrivateLabContext(null);
    dispatch({ type: 'RESET' });
  };

  const currentStepIndex = STEP_ORDER.indexOf(state.step);
  const showFullLab = activeExperiment === 'titration' && state.step !== Step.SELECT && state.step !== Step.CALCULATION && state.step !== Step.RESULTS;

  // Drag overlay label
  const getDragLabel = (id: string) => {
    const labels: Record<string, { icon: string; label: string }> = {
      [DRAG_ITEMS.BURETTE]: { icon: '🧪', label: t('apparatus.burette', 'Burette') },
      [DRAG_ITEMS.FLASK]: { icon: '⚗️', label: t('apparatus.flask', 'Conical Flask') },
      [DRAG_ITEMS.PIPETTE]: { icon: '💉', label: t('apparatus.pipette', 'Pipette') },
      [DRAG_ITEMS.HCL_BOTTLE]: { icon: '🧴', label: t('apparatus.hclBottle', 'HCl Stock') },
      [DRAG_ITEMS.NAOH_BOTTLE]: { icon: '🫧', label: t('apparatus.naohBottle', 'NaOH Reagent') },
      [DRAG_ITEMS.INDICATOR]: { icon: '💧', label: t('apparatus.indicator', 'Phenolphthalein') },
    };
    return labels[id] || { icon: '📦', label: id };
  };

  // Get experiment-specific header info
  const getHeaderInfo = () => {
    if (activePrivateLabContext) {
      const expTitle = getExperimentById(activeExperiment)?.title || (activeExperiment === 'titration' ? 'Acid-Base Titration' : activeExperiment === 'conservation' ? 'Conservation of Mass' : activeExperiment);
      return {
        subtitle: `🏫 ${activePrivateLabContext.lab.title} — ${expTitle}`,
        color: '#0284c7',
      };
    }
    if (activeExperiment === 'admin') {
      return { subtitle: t('nav.adminPanel', '🛡️ Admin & Moderator Command Center'), color: '#7c3aed' };
    }
    if (activeExperiment === 'teacher') {
      return { subtitle: t('nav.teacherPortal', '👨‍🏫 Teacher & Faculty Portal'), color: '#0284c7' };
    }
    if (activeExperiment === 'conservation') {
      return { subtitle: getLocalizedExperimentTitle('conservation-of-mass', language, 'Conservation of Mass'), color: '#059669' };
    }
    if (activeExperiment === 'conservation-vr') {
      return { subtitle: `🥽 ${getLocalizedExperimentTitle('conservation-of-mass', language, 'Conservation of Mass')} (3D VR Lab)`, color: '#059669' };
    }
    if (activeExperiment === 'titration') {
      return { subtitle: getLocalizedExperimentTitle('titration', language, 'Acid-Base Titration'), color: '#2563eb' };
    }
    if (activeExperiment !== 'select') {
      const engineExp = getExperimentById(activeExperiment);
      if (engineExp) {
        return { subtitle: getLocalizedExperimentTitle(activeExperiment, language, engineExp.title), color: engineExp.themeColor };
      }
    }
    return { subtitle: t('brand.tagline', 'Interactive Chemistry Lab'), color: '#2563eb' };
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
          setShowLanding(false);
          setActiveExperiment('select');
          setActiveTab('experiments');
        }}
        onRoleRedirect={(role) => {
          setShowLanding(false);
          if (role === 'admin') {
            setActiveExperiment('admin');
          } else if (role === 'teacher') {
            setActiveExperiment('teacher');
          } else {
            setActiveExperiment('select');
            setActiveTab('experiments');
          }
        }}
        onOpenProfileSetup={() => {
          setShowLanding(false);
          setActiveExperiment('select');
          setActiveTab('experiments');
          setProfileSetupOpen(true);
        }}
      />
    );
  }

  // If landing page is active, render LandingPage with AuthModal
  if (showLanding) {
    return (
      <>
        <LandingPage
          onEnterApp={() => {
            setShowLanding(false);
            sessionStorage.setItem('vv_showLanding', 'false');
            setActiveTab('experiments');
          }}
          onOpenLogin={() => {
            setAuthModalTab('login');
            setAuthModalOpen(true);
          }}
          onOpenTeacherPortal={() => {
            setShowLanding(false);
            sessionStorage.setItem('vv_showLanding', 'false');
            setActiveTab('teacher');
            setActiveExperiment('teacher');
          }}
          onStartExperiment={(expId?: string) => {
            setShowLanding(false);
            sessionStorage.setItem('vv_showLanding', 'false');
            if (expId) {
              if (expId === 'titration') handleSelectExperiment('titration');
              else if (expId === 'conservation') handleSelectExperiment('conservation');
              else setActiveExperiment(expId);
            } else {
              setActiveExperiment('select');
              setActiveTab('experiments');
            }
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialTab={authModalTab}
          onOpenProfileSetup={() => {
            setShowLanding(false);
            sessionStorage.setItem('vv_showLanding', 'false');
            setActiveExperiment('select');
            setActiveTab('experiments');
            setProfileSetupOpen(true);
          }}
          onRoleRedirect={(role) => {
            setShowLanding(false);
            sessionStorage.setItem('vv_showLanding', 'false');
            if (role === 'admin') {
              setActiveExperiment('admin');
            } else if (role === 'teacher') {
              setActiveExperiment('teacher');
            } else {
              setActiveExperiment('select');
              setActiveTab('experiments');
            }
          }}
        />
        <StudentProfileSetupModal
          isOpen={profileSetupOpen}
          onClose={() => setProfileSetupOpen(false)}
        />
      </>
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
            if (tab === 'home') {
              setShowLanding(true);
              sessionStorage.setItem('vv_showLanding', 'true');
              setActiveExperiment('select');
            } else if (tab === 'settings') {
              setSettingsModalOpen(true);
            } else if (tab === 'about') {
              setAboutModalOpen(true);
            } else if (tab === 'teacher') {
              setActiveTab('teacher');
              setActiveExperiment('teacher');
            } else if (tab === 'admin') {
              setActiveTab('admin');
              setActiveExperiment('admin');
            } else if (tab === 'auth') {
              handleNavigateToAuth('student');
            } else {
              setActiveTab(tab);
              setActiveExperiment('select');
            }
          }}
          onReturnToLanding={() => {
            setShowLanding(true);
            sessionStorage.setItem('vv_showLanding', 'true');
            setActiveExperiment('select');
          }}
          onNavigateToAuth={handleNavigateToAuth}
          onOpenProfileSetup={() => setProfileSetupOpen(true)}
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
            onOpenAdminPanel={() => setActiveExperiment('admin')}
            onOpenJoinLab={user?.role === 'student' ? () => setJoinLabModalOpen(true) : undefined}
            isMobile={isMobile}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            onOpenSettings={() => setSettingsModalOpen(true)}
          />

          {/* Views */}
          <main style={{ flex: 1, padding: isMobile ? '20px 16px' : '32px 36px', boxSizing: 'border-box' }}>
            {activeTab === 'experiments' || activeTab === 'home' ? (
              <ExperimentSelector
                showHeroBanner={false}
                onSelectExperiment={handleSelectExperiment}
                onSelectEngineExperiment={(id) => {
                  setActivePrivateLabContext(null);
                  setActiveExperiment(id);
                }}
                onSelectVR={() => setActiveExperiment('conservation-vr')}
                onGoToNotes={() => setActiveTab('theory-notes')}
                onOpenHowItWorks={() => setHowItWorksModalOpen(true)}
                externalSearchQuery={searchQuery}
              />
            ) : activeTab === 'classes' ? (
              <MyClassesView
                onLaunchPrivateExperiment={handleLaunchPrivateExperiment}
                onOpenTeacherPortal={() => {
                  setActiveTab('teacher');
                  setActiveExperiment('teacher');
                }}
              />
            ) : activeTab === 'theory-notes' ? (
              <TheoryNotesView
                onBackToHome={() => setActiveTab('experiments')}
                onLaunchExperiment={(id) => {
                  if (id === 'titration') handleSelectExperiment('titration');
                  else if (id === 'conservation') handleSelectExperiment('conservation');
                  else setActiveExperiment(id);
                }}
              />
            ) : activeTab === 'progress' ? (
              <ProgressView
                onBackToHome={() => setActiveTab('experiments')}
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
          onOpenProfileEditor={() => {
            setSettingsModalOpen(false);
            setProfileSetupOpen(true);
          }}
        />
        <AboutModal
          isOpen={aboutModalOpen}
          onClose={() => setAboutModalOpen(false)}
        />
        <HowItWorksModal
          isOpen={howItWorksModalOpen}
          onClose={() => setHowItWorksModalOpen(false)}
          onStartExploring={() => {
            setActiveTab('experiments');
            const section = document.getElementById('browse-experiments-section');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialTab={authModalTab}
          onOpenProfileSetup={() => setProfileSetupOpen(true)}
          onRoleRedirect={(role) => {
            if (role === 'admin') setActiveExperiment('admin');
            else if (role === 'teacher') setActiveExperiment('teacher');
            else setActiveExperiment('select');
          }}
        />
        <StudentProfileSetupModal
          isOpen={profileSetupOpen}
          onClose={() => setProfileSetupOpen(false)}
        />
        <JoinLabModal
          isOpen={joinLabModalOpen}
          onClose={() => setJoinLabModalOpen(false)}
          onJoinedSuccess={() => {
            setActiveTab('classes');
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
            {t('lab.backToDashboard', '← Back to Dashboard')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VirtualVigyanLogo size={28} />
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

          {/* Safety Center Header Button */}
          {activeExperiment !== 'select' && activeExperiment !== 'admin' && activeExperiment !== 'teacher' && activeExperiment !== 'auth' && (
            <button
              id="btn-top-safety-center"
              onClick={() => setHeaderSafetyModalOpen(true)}
              title={t('safety.subtitle', 'Essential precautions & laboratory safety guidance')}
              aria-label={t('safety.buttonAria', 'Open Experiment Safety Center')}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#d97706',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                padding: '5px 11px',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.22)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>🛡️</span>
              <span>{t('safety.buttonLabel', 'Safety')}</span>
            </button>
          )}

          {/* Language Selector */}
          <LanguageSelector variant="pill" />

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
            <GenericLab
              config={engineConfig}
              onBackToSelector={handleBackToSelector}
              privateLabContext={activePrivateLabContext || undefined}
            />
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
                    onMarkEndpoint={handleMarkEndpoint}
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
        onOpenProfileSetup={() => setProfileSetupOpen(true)}
        onRoleRedirect={(role) => {
          setShowLanding(false);
          if (role === 'admin') {
            setActiveExperiment('admin');
          } else if (role === 'teacher') {
            setActiveExperiment('teacher');
          } else {
            setActiveExperiment('select');
            setActiveTab('experiments');
          }
        }}
      />
      <StudentProfileSetupModal
        isOpen={profileSetupOpen}
        onClose={() => setProfileSetupOpen(false)}
      />

      {/* Global Laboratory Safety Center Modal */}
      <ExperimentSafetyModal
        isOpen={headerSafetyModalOpen}
        onClose={() => setHeaderSafetyModalOpen(false)}
        experimentId={activeExperiment === 'conservation-vr' ? 'conservation' : activeExperiment}
        experimentTitle={headerInfo.subtitle}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
