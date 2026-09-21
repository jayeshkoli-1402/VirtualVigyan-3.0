import React, { useState, useEffect } from 'react';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';

interface LandingNavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogin?: () => void;
  onStartExperiment: () => void;
}

const LandingNavbar: React.FC<LandingNavbarProps> = ({
  theme,
  onToggleTheme,
  onStartExperiment,
}) => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth > 768 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const links = [
    { label: t('landing.nav.home', 'Home'), id: 'hero' },
    { label: t('landing.nav.experiments', 'Experiments'), id: 'experiments' },
    { label: t('landing.nav.howItWorks', 'How It Works'), id: 'how-it-works' },
    { label: t('landing.nav.forStudents', 'For Students'), id: 'student-role' },
    { label: t('landing.nav.forTeachers', 'For Teachers'), id: 'teacher-role' },
    { label: t('landing.nav.about', 'About'), id: 'about' },
  ];

  return (
    <header className={`ln-navbar ${scrolled ? 'ln-navbar-scrolled' : ''}`}>
      <div className="ln-navbar-inner">
        {/* Logo */}
        <div
          className="ln-navbar-logo"
          onClick={() => scrollTo('hero')}
          role="button"
          tabIndex={0}
          title="VirtualVigyan - Return to top"
          aria-label="VirtualVigyan - Interactive Chemistry Laboratory Home"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollTo('hero'); }}
        >
          <VirtualVigyanLogo size={36} showText subtitle="Interactive Chemistry Laboratory" />
        </div>

        {/* Desktop Nav Links */}
        <nav className="ln-navbar-links">
          {links.map((link) => (
            <a
              key={link.label}
              href={`#${link.id}`}
              className="ln-navbar-link"
              onClick={(e) => { e.preventDefault(); scrollTo(link.id); }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="ln-navbar-actions">
          {/* Language Selector */}
          <LanguageSelector variant="pill" />

          <button
            className="ln-theme-toggle"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button onClick={onStartExperiment} className="ln-btn ln-btn-primary ln-btn-sm">
            {t('landing.nav.startExperiment', 'Start Experiment')}
          </button>

          <button
            className="ln-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div className={`ln-mobile-overlay ${mobileOpen ? 'open' : ''}`}>
        {links.map((link) => (
          <a
            key={link.label}
            href={`#${link.id}`}
            className="ln-mobile-nav-link"
            onClick={(e) => { e.preventDefault(); scrollTo(link.id); }}
          >
            {link.label}
          </a>
        ))}
        <div className="ln-mobile-actions" style={{ flexDirection: 'column', gap: 10 }}>
          <LanguageSelector variant="buttons" style={{ width: '100%', marginBottom: 4 }} />
          <button onClick={() => { setMobileOpen(false); onStartExperiment(); }} className="ln-btn ln-btn-primary" style={{ width: '100%' }}>
            {t('landing.nav.startExperiment', 'Start Experiment')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
