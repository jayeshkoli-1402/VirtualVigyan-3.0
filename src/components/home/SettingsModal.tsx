import React, { useState, useEffect } from 'react';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { useAuth } from '../../auth/AuthContext';
import { DeleteAccountModal } from '../auth/DeleteAccountModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenProfileEditor?: () => void;
}

type SettingsTab = 'profile' | 'language' | 'appearance' | 'audio' | 'simulation' | 'storage';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  onOpenProfileEditor,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  // Audio settings
  const [soundEffects, setSoundEffects] = useState(() => {
    return localStorage.getItem('vv_setting_sound') !== 'false';
  });
  const [soundVolume, setSoundVolume] = useState(() => {
    return Number(localStorage.getItem('vv_setting_volume')) || 80;
  });
  const [haptics, setHaptics] = useState(() => {
    return localStorage.getItem('vv_setting_haptics') !== 'false';
  });

  // Simulation & visual settings
  const [animations, setAnimations] = useState(() => {
    return localStorage.getItem('vv_setting_animations') !== 'false';
  });
  const [simulationSpeed, setSimulationSpeed] = useState<'0.5' | '1.0' | '1.5'>(() => {
    return (localStorage.getItem('vv_setting_sim_speed') as any) || '1.0';
  });
  const [formulaNotation, setFormulaNotation] = useState<'standard' | 'latex'>(() => {
    return (localStorage.getItem('vv_setting_formula') as any) || 'latex';
  });
  const [fontScale, setFontScale] = useState<'normal' | 'medium' | 'large'>(() => {
    return (localStorage.getItem('vv_setting_font_scale') as any) || 'normal';
  });
  const [safetyWarnings, setSafetyWarnings] = useState(() => {
    return localStorage.getItem('vv_setting_safety_warnings') !== 'false';
  });
  const [calculationHints, setCalculationHints] = useState(() => {
    return localStorage.getItem('vv_setting_calc_hints') !== 'false';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('vv_setting_sound', String(soundEffects));
  }, [soundEffects]);

  useEffect(() => {
    localStorage.setItem('vv_setting_volume', String(soundVolume));
  }, [soundVolume]);

  useEffect(() => {
    localStorage.setItem('vv_setting_haptics', String(haptics));
  }, [haptics]);

  useEffect(() => {
    localStorage.setItem('vv_setting_animations', String(animations));
  }, [animations]);

  useEffect(() => {
    localStorage.setItem('vv_setting_sim_speed', simulationSpeed);
  }, [simulationSpeed]);

  useEffect(() => {
    localStorage.setItem('vv_setting_formula', formulaNotation);
  }, [formulaNotation]);

  useEffect(() => {
    localStorage.setItem('vv_setting_font_scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('vv_setting_safety_warnings', String(safetyWarnings));
  }, [safetyWarnings]);

  useEffect(() => {
    localStorage.setItem('vv_setting_calc_hints', String(calculationHints));
  }, [calculationHints]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleClearCache = () => {
    localStorage.removeItem('vv_attempts');
    localStorage.removeItem('vv_lab_drafts');
    showToast('Experiment local cache cleared!');
  };

  const handleResetDefaults = () => {
    setSoundEffects(true);
    setSoundVolume(80);
    setHaptics(true);
    setAnimations(true);
    setSimulationSpeed('1.0');
    setFormulaNotation('latex');
    setFontScale('normal');
    setSafetyWarnings(true);
    setCalculationHints(true);
    showToast('Settings restored to laboratory defaults.');
  };

  if (!isOpen) return null;

  const tabs: Array<{ id: SettingsTab; label: string; icon: string }> = [
    { id: 'profile', label: t('settings.tabProfile', 'Profile'), icon: '👤' },
    { id: 'language', label: t('settings.tabLanguage', 'Language / भाषा'), icon: '🌐' },
    { id: 'appearance', label: t('settings.tabAppearance', 'Appearance'), icon: '🎨' },
    { id: 'audio', label: t('settings.tabAudio', 'Audio & Haptics'), icon: '🔊' },
    { id: 'simulation', label: t('settings.tabSimulation', 'Simulation & Safety'), icon: '⚡' },
    { id: 'storage', label: t('settings.tabStorage', 'Storage & Reset'), icon: '💾' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(8px)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-overlay)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VirtualVigyanLogo size={28} />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {t('settings.title', 'Laboratory Settings & Preferences')}
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                {t('settings.subtitle', 'Configure environment parameters, audio, safety aids, and student profile.')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border)',
            overflowX: 'auto',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#2563eb' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-card)' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div
            style={{
              margin: '12px 24px 0',
              padding: '8px 14px',
              borderRadius: 8,
              background: 'rgba(5, 150, 105, 0.1)',
              border: '1px solid rgba(5, 150, 105, 0.25)',
              color: '#059669',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            ✓ {toastMessage}
          </div>
        )}

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* ── TAB 1: Profile & Identity ── */}
          {activeTab === 'profile' && (
            <div>
              {user ? (
                <div>
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: 14,
                      padding: 18,
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 16,
                        background: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        color: '#fff',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {user.avatar && user.avatar.startsWith('http') ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span>{user.avatar || '🎓'}</span>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {user.name}
                        </div>
                        {user.username && (
                          <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600 }}>
                            @{user.username}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: user.role === 'admin' ? '#7c3aed' : user.role === 'teacher' ? '#0284c7' : '#059669',
                            color: '#fff',
                          }}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {user.grade || 'Academic Student'} {user.branch ? `• ${user.branch}` : ''}
                      </div>
                      {user.school && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          🏫 {user.school}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    {onOpenProfileEditor && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenProfileEditor();
                        }}
                        style={{
                          all: 'unset',
                          cursor: 'pointer',
                          padding: '8px 16px',
                          borderRadius: 8,
                          background: '#2563eb',
                          color: '#fff',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        ✏️ Edit Student Profile
                      </button>
                    )}
                    <button
                      id="btn-settings-profile-signout"
                      onClick={async () => {
                        onClose();
                        await logout();
                      }}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#ef4444',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ef4444';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                    >
                      🚪 {t('nav.logout', 'Sign Out')}
                    </button>
                  </div>

                  {/* Danger Zone: Delete Account */}
                  <div
                    style={{
                      marginTop: 24,
                      padding: '16px 18px',
                      borderRadius: 14,
                      background: 'rgba(239, 68, 68, 0.06)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>⚠️</span>
                          <span>Danger Zone: Delete Account</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, maxWidth: 360, lineHeight: 1.4 }}>
                          Accidentally registered as the wrong role (e.g. Teacher instead of Student)? Deleting your account releases your email so you can sign up again.
                        </div>
                      </div>
                      <button
                        id="btn-settings-delete-account"
                        onClick={() => setDeleteAccountModalOpen(true)}
                        style={{
                          all: 'unset',
                          cursor: 'pointer',
                          padding: '7px 14px',
                          borderRadius: 8,
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          color: '#dc2626',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#dc2626';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                          e.currentTarget.style.color = '#dc2626';
                        }}
                      >
                        🗑️ Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>👤</div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                    Guest Student Session
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                    Sign in or register an account to save your lab scores, custom avatar, and academic credentials.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: Dedicated Language & Regional Preferences ── */}
          {activeTab === 'language' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Heading & Context */}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🌐</span>
                  <span>{t('settings.languageHeading', 'Platform Language / भाषा निवडा')}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.45 }}>
                  {t('settings.languageSubheading', 'VirtualVigyan supports full multilingual learning in English, Hindi (हिन्दी), and Marathi (मराठी). Experiment instructions, apparatus, theory, observations, calculations, and rubrics update instantly.')}
                </div>
              </div>

              {/* Language Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: 12 }}>
                {[
                  {
                    code: 'en' as const,
                    name: 'English',
                    nativeName: 'English',
                    flag: '🇬🇧',
                    subtext: 'Global Standard',
                    badge: 'NCERT & CBSE',
                    greeting: 'Welcome to Lab',
                  },
                  {
                    code: 'hi' as const,
                    name: 'Hindi',
                    nativeName: 'हिन्दी',
                    flag: '🇮🇳',
                    subtext: 'राष्ट्रीय पाठ्यक्रम',
                    badge: '100% अनुवादित',
                    greeting: 'प्रयोगशाला में स्वागत है',
                  },
                  {
                    code: 'mr' as const,
                    name: 'Marathi',
                    nativeName: 'मराठी',
                    flag: '🇮🇳',
                    subtext: 'महाराष्ट्र व DBATU',
                    badge: '100% भाषांतरित',
                    greeting: 'प्रयोगशाळेत स्वागत आहे',
                  },
                ].map((item) => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        showToast(
                          item.code === 'hi'
                            ? 'भाषा बदलकर हिन्दी कर दी गई है! (Hindi activated)'
                            : item.code === 'mr'
                            ? 'भाषा बदलून मराठी करण्यात आली आहे! (Marathi activated)'
                            : 'Language changed to English!'
                        );
                      }}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '16px 14px',
                        borderRadius: 14,
                        border: isSelected
                          ? '2px solid var(--accent-blue, #2563eb)'
                          : '1.5px solid var(--border)',
                        background: isSelected
                          ? 'rgba(37, 99, 235, 0.08)'
                          : 'var(--bg-secondary)',
                        boxShadow: isSelected ? '0 0 0 1px var(--accent-blue, #2563eb)' : 'none',
                        transition: 'all 0.18s ease',
                        position: 'relative',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
                        <span style={{ fontSize: '1.5rem' }}>{item.flag}</span>
                        {isSelected ? (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              color: '#ffffff',
                              background: 'var(--accent-blue, #2563eb)',
                              padding: '3px 8px',
                              borderRadius: 999,
                            }}
                          >
                            ✓ {t('common.active', 'Active')}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.66rem',
                              color: 'var(--text-muted)',
                              background: 'var(--border)',
                              padding: '2px 7px',
                              borderRadius: 999,
                            }}
                          >
                            {item.subtext}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '1.18rem', fontWeight: 800, color: isSelected ? 'var(--accent-blue, #2563eb)' : 'var(--text-primary)' }}>
                        {item.nativeName}
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {item.name} • {item.greeting}
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: isSelected ? '#16a34a' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span>✓</span>
                        <span>{item.badge}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Preview Card */}
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: 14,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-blue, #2563eb)', marginBottom: 8 }}>
                  ⚡ {t('settings.livePreview', 'Live Translation Preview / थेट पूर्वावलोकन')}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {language === 'hi'
                    ? '🧪 अम्ल-क्षार अनुमापन (HCl बनाम NaOH)'
                    : language === 'mr'
                    ? '🧪 आम्ल-आम्लारी अनुमापन (HCl विरुद्ध NaOH)'
                    : '🧪 Acid-Base Titration (HCl vs NaOH)'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {language === 'hi'
                    ? 'निर्देश: 25 mL अज्ञात हाइड्रोक्लोरिक अम्ल वाले शंक्वाकार फ्लास्क में फिनॉल्फथलीन सूचक की 2 बूंदें मिलाएं।'
                    : language === 'mr'
                    ? 'सूचना: 25 mL अज्ञात हायड्रोक्लोरिक आम्ल असलेल्या शंकूपात्रात फिनॉल्फथॅलीन दर्शकाचे 2 थेंब टाका.'
                    : 'Instruction: Add 2 drops of Phenolphthalein indicator to the conical flask containing 25 mL unknown HCl.'}
                </div>
                <div style={{ marginTop: 10, fontSize: '0.74rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>✓</span>
                  <span>
                    {language === 'hi'
                      ? 'संपूर्ण प्रयोगशाला, उपकरण, सिद्धांत और गणनाएं इस भाषा में उपलब्ध हैं।'
                      : language === 'mr'
                      ? 'संपूर्ण प्रयोगशाळा, उपकरणे, सिद्धांत आणि गणना या भाषेत उपलब्ध आहेत.'
                      : 'All laboratory simulations, glassware, theory notes, and evaluations adapt to this language.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: Appearance & Display ── */}
          {activeTab === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Quick Language row in appearance */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t('settings.languageTitle', 'Interface Language / भाषा')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    English • हिन्दी (Hindi) • मराठी (Marathi)
                  </div>
                </div>
                <LanguageSelector variant="pill" />
              </div>

              {/* Theme */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Visual Interface Theme
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Toggle between high-clarity Light mode and Dark room mode.
                  </div>
                </div>
                <button
                  onClick={onToggleTheme}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>

              {/* Formula notation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Chemical Formula Notation
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Render chemical symbols using KaTeX mathematical typesetting or standard plaintext.
                  </div>
                </div>
                <select
                  value={formulaNotation}
                  onChange={(e) => setFormulaNotation(e.target.value as any)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="latex">KaTeX Formatted</option>
                  <option value="standard">Plaintext Standard</option>
                </select>
              </div>

              {/* Font scaling */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Interface Text Scaling
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Adjust text size across bench apparatus instructions and calculation forms.
                  </div>
                </div>
                <select
                  value={fontScale}
                  onChange={(e) => setFontScale(e.target.value as any)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="normal">Standard (100%)</option>
                  <option value="medium">Medium (110%)</option>
                  <option value="large">Large (120%)</option>
                </select>
              </div>
            </div>
          )}

          {/* ── TAB 3: Audio & Feedback ── */}
          {activeTab === 'audio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Sound toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Apparatus Sound Effects
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Pouring liquid, gas pop explosions, effervescence fizzing, and stopcock clicks.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
                />
              </div>

              {/* Volume Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Laboratory Audio Volume
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {soundVolume}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  disabled={!soundEffects}
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: '#2563eb' }}
                />
              </div>

              {/* Haptics */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Haptic Touch & Magnetic Alignment
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Subtle snapping alignment feedback when clamping glassware on stands and balance plates.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={haptics}
                  onChange={(e) => setHaptics(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
                />
              </div>
            </div>
          )}

          {/* ── TAB 4: Simulation & Safety ── */}
          {activeTab === 'simulation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Fluid animations */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Fluid Dynamics Visual Effects
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Curved meniscus, liquid vortex swirls, and droplet trail animations.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={animations}
                  onChange={(e) => setAnimations(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
                />
              </div>

              {/* Sim speed */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Simulation Reaction Pace
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Control drop discharge and reaction settling speed.
                  </div>
                </div>
                <select
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(e.target.value as any)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="0.5">Slow (0.5x)</option>
                  <option value="1.0">Standard (1.0x)</option>
                  <option value="1.5">Fast (1.5x)</option>
                </select>
              </div>

              {/* Safety warnings */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Precautionary Hazard Warnings
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Display chemical safety alerts before handling concentrated acids or strong bases.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={safetyWarnings}
                  onChange={(e) => setSafetyWarnings(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
                />
              </div>

              {/* Calculation hints */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Formula Hints on Calculation Errors
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Display worked formula derivation steps if calculation answers exceed acceptable error margins.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={calculationHints}
                  onChange={(e) => setCalculationHints(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
                />
              </div>
            </div>
          )}

          {/* ── TAB 5: Storage & Reset ── */}
          {activeTab === 'storage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Local Experiment Cache
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                  Reset stored draft observations and titration volume logs cached on this device.
                </div>
                <button
                  onClick={handleClearCache}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '7px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#dc2626',
                  }}
                >
                  Clear Cached Lab Runs
                </button>
              </div>

              <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Restore Defaults
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                  Reset all audio, simulation speed, and display settings back to standard laboratory defaults.
                </div>
                <button
                  onClick={handleResetDefaults}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '7px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  Reset Settings to Default
                </button>
              </div>

              {user && (
                <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>⚠️</span>
                    <span>Permanently Delete Account</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '4px 0 10px' }}>
                    Erase this account, reset all saved lab simulations, and release your email address for re-registration.
                  </div>
                  <button
                    onClick={() => setDeleteAccountModalOpen(true)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      padding: '7px 14px',
                      borderRadius: 8,
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#dc2626',
                    }}
                  >
                    Delete Account & Data
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)',
          }}
        >
          {user ? (
            <button
              id="btn-settings-footer-signout"
              onClick={async () => {
                onClose();
                await logout();
              }}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '7px 14px',
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#ef4444',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              <span>🚪</span>
              <span>{t('nav.logout', 'Sign Out')}</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '8px 20px',
              borderRadius: 8,
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            Done
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        isOpen={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
        onAccountDeleted={() => {
          setDeleteAccountModalOpen(false);
          onClose();
        }}
      />
    </div>
  );
};
