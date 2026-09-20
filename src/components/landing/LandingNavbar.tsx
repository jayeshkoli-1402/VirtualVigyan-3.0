import React, { useState, useEffect } from 'react';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';

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
    { label: 'Home', id: 'hero' },
    { label: 'Experiments', id: 'experiments' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'For Students', id: 'student-role' },
    { label: 'For Teachers', id: 'teacher-role' },
    { label: 'About', id: 'about' },
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
          <button
            className="ln-theme-toggle"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button onClick={onStartExperiment} className="ln-btn ln-btn-primary ln-btn-sm">
            Start Experiment
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
        <div className="ln-mobile-actions">
          <button onClick={() => { setMobileOpen(false); onStartExperiment(); }} className="ln-btn ln-btn-primary" style={{ flex: 1 }}>
            Start Experiment
          </button>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
