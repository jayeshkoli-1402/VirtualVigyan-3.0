import React from 'react';

interface Props {
  onStartExperiment: () => void;
}

const FinalCTA: React.FC<Props> = ({ onStartExperiment }) => {
  return (
    <section className="ln-cta-section">
      <div className="ln-cta-bg" aria-hidden="true">
        <div className="ln-cta-glow" />

        {/* Floating molecules for background ambiance */}
        <svg
          className="ln-cta-molecule"
          style={{ top: '15%', left: '8%', animation: 'lnFloat 8s ease-in-out infinite' }}
          width="80" height="80" viewBox="0 0 80 80" fill="none"
        >
          <circle cx="40" cy="40" r="6" fill="#2563eb" opacity="0.3" />
          <circle cx="25" cy="28" r="4" fill="#10b981" opacity="0.25" />
          <line x1="40" y1="40" x2="25" y2="28" stroke="#2563eb" strokeWidth="1" opacity="0.2" />
          <circle cx="55" cy="28" r="3.5" fill="#38bdf8" opacity="0.2" />
          <line x1="40" y1="40" x2="55" y2="28" stroke="#38bdf8" strokeWidth="0.8" opacity="0.15" />
          <circle cx="40" cy="58" r="3" fill="#7c3aed" opacity="0.2" />
          <line x1="40" y1="40" x2="40" y2="58" stroke="#7c3aed" strokeWidth="0.8" opacity="0.15" />
        </svg>

        <svg
          className="ln-cta-molecule"
          style={{ bottom: '18%', right: '10%', animation: 'lnFloat2 10s ease-in-out infinite', animationDelay: '-3s' }}
          width="70" height="70" viewBox="0 0 70 70" fill="none"
        >
          <circle cx="35" cy="35" r="5" fill="#059669" opacity="0.25" />
          <circle cx="22" cy="22" r="3.5" fill="#2563eb" opacity="0.2" />
          <line x1="35" y1="35" x2="22" y2="22" stroke="#2563eb" strokeWidth="0.8" opacity="0.15" />
          <circle cx="50" cy="25" r="3" fill="#f59e0b" opacity="0.2" />
          <line x1="35" y1="35" x2="50" y2="25" stroke="#f59e0b" strokeWidth="0.8" opacity="0.15" />
        </svg>

        <svg
          className="ln-cta-molecule"
          style={{ top: '60%', left: '75%', animation: 'lnFloat3 12s ease-in-out infinite', animationDelay: '-5s' }}
          width="50" height="50" viewBox="0 0 50 50" fill="none"
        >
          <circle cx="25" cy="25" r="4" fill="#38bdf8" opacity="0.2" />
          <circle cx="15" cy="15" r="2.5" fill="#ec4899" opacity="0.15" />
          <line x1="25" y1="25" x2="15" y2="15" stroke="#ec4899" strokeWidth="0.6" opacity="0.12" />
        </svg>

        <svg
          className="ln-cta-molecule"
          style={{ top: '30%', right: '30%', animation: 'lnFloat 15s ease-in-out infinite', animationDelay: '-7s' }}
          width="40" height="40" viewBox="0 0 40 40" fill="none"
        >
          <circle cx="20" cy="20" r="3" fill="#7c3aed" opacity="0.15" />
          <circle cx="32" cy="14" r="2" fill="#2563eb" opacity="0.12" />
          <line x1="20" y1="20" x2="32" y2="14" stroke="#2563eb" strokeWidth="0.5" opacity="0.1" />
        </svg>
      </div>

      <div className="ln-container ln-cta-content ln-reveal">
        <span className="ln-section-label" style={{ marginBottom: 18 }}>Get Started</span>
        <h2 className="ln-section-heading">Ready to Enter the Virtual Laboratory?</h2>
        <p className="ln-section-desc" style={{ margin: '0 auto 40px' }}>
          Start exploring chemistry experiments in an interactive digital laboratory.
        </p>
        <button
          onClick={onStartExperiment}
          className="ln-btn ln-btn-primary"
          style={{ padding: '15px 36px', fontSize: '1rem' }}
        >
          Start Experiment →
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
