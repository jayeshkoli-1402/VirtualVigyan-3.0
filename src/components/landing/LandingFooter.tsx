import React from 'react';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';

interface LandingFooterProps {
  onStartExperiment: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onStartExperiment }) => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="ln-footer">
      <div className="ln-container">
        <div className="ln-footer-grid">
          {/* Brand */}
          <div className="ln-footer-brand">
            <VirtualVigyanLogo size={36} showText subtitle="Interactive Chemistry Laboratory" />
            <p>Interactive Virtual Chemistry Laboratory designed for safe, repeatable practical learning.</p>
          </div>

          {/* Navigation */}
          <div className="ln-footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>Home</a></li>
              <li><a href="#experiments" onClick={(e) => { e.preventDefault(); scrollTo('experiments'); }}>Experiments</a></li>
              <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>How It Works</a></li>
              <li><a href="#student-role" onClick={(e) => { e.preventDefault(); scrollTo('student-role'); }}>Students</a></li>
              <li><a href="#teacher-role" onClick={(e) => { e.preventDefault(); scrollTo('teacher-role'); }}>Teachers</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About</a></li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="ln-footer-col">
            <h4>Quick Access</h4>
            <ul>
              <li><button onClick={onStartExperiment}>Enter Laboratory</button></li>
              <li><button onClick={onStartExperiment}>All Experiments</button></li>
            </ul>
          </div>

          {/* Information */}
          <div className="ln-footer-col">
            <h4>Information</h4>
            <ul>
              <li><a href="#help" onClick={(e) => { e.preventDefault(); scrollTo('help'); }}>Help & FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="ln-footer-bottom">
          <span>© 2026 VirtualVigyan</span>
          <span>Interactive Virtual Chemistry Laboratory</span>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
