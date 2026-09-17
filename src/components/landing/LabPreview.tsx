import React from 'react';

interface LabPreviewProps {
  onStartExperiment: () => void;
}

const LabPreview: React.FC<LabPreviewProps> = ({ onStartExperiment }) => {
  const features = [
    {
      title: 'Interactive Apparatus',
      desc: 'Burettes, pipettes, graduated cylinders with precision controls',
    },
    {
      title: 'Chemical Handling',
      desc: 'Reagent additions, indicator transitions, color changes',
    },
    {
      title: 'Step-by-Step Procedure',
      desc: 'Guided checklists with contextual hints',
    },
    {
      title: 'Validation',
      desc: 'Live rule engine monitors every procedural step',
    },
    {
      title: 'Calculations',
      desc: 'Built-in formula solvers and titration curves',
    },
  ];

  return (
    <section className="ln-section ln-section-alt">
      <div className="ln-container">
        <div className="ln-section-header ln-reveal">
          <span className="ln-section-label">Virtual Workbench</span>
          <h2 className="ln-section-heading">Step Inside the Virtual Laboratory</h2>
          <p className="ln-section-desc">
            A purpose-built digital workbench where physical bench procedures are accurately mirrored.
          </p>
        </div>

        <div className="ln-lab-box ln-reveal">
          <div className="ln-lab-grid">
            {/* SVG Lab Visual */}
            <div className="ln-lab-visual">
              <svg viewBox="0 0 520 360" fill="none" style={{ width: '100%', maxWidth: 480, height: 'auto' }} aria-hidden="true">
                {/* Bench surface */}
                <rect x="20" y="290" width="480" height="12" rx="4" fill="#334155" />
                <rect x="20" y="302" width="480" height="5" fill="#1e293b" />

                {/* Grid lines (bench texture) */}
                <g stroke="#475569" strokeWidth="0.3" opacity="0.3">
                  {[60, 120, 180, 240, 300, 360, 420].map((x) => (
                    <line key={`v${x}`} x1={x} y1="290" x2={x} y2="302" />
                  ))}
                </g>

                {/* Retort Stand */}
                <rect x="80" y="278" width="110" height="12" rx="3" fill="#64748b" />
                <rect x="132" y="48" width="7" height="230" rx="3" fill="#94a3b8" />
                {/* Clamp */}
                <rect x="132" y="110" width="48" height="8" rx="3" fill="#64748b" />
                <rect x="175" y="104" width="6" height="18" rx="3" fill="#cbd5e1" />

                {/* Burette */}
                <rect x="171" y="36" width="14" height="170" rx="5" fill="rgba(255,255,255,0.12)" stroke="#38bdf8" strokeWidth="1.5" />
                {/* Liquid in burette */}
                <rect x="173" y="80" width="10" height="123" fill="rgba(56,189,248,0.4)" rx="3" />
                {/* Meniscus */}
                <path d="M173 80 Q178 84 183 80" stroke="#38bdf8" strokeWidth="1.2" fill="none" />

                {/* Graduation marks */}
                {[65, 90, 115, 140, 165, 190].map((y) => (
                  <line key={y} x1="181" y1={y} x2="185" y2={y} stroke="#94a3b8" strokeWidth="0.8" />
                ))}
                {[77, 102, 127, 152, 177].map((y) => (
                  <line key={`m${y}`} x1="179" y1={y} x2="185" y2={y} stroke="#64748b" strokeWidth="0.5" />
                ))}

                {/* Stopcock */}
                <circle cx="178" cy="212" r="6" fill="#f59e0b" />
                <rect x="171" y="210" width="14" height="4" rx="2" fill="#fbbf24" />
                {/* Nozzle */}
                <polygon points="175,218 181,218 180,234 176,234" fill="rgba(255,255,255,0.2)" stroke="rgba(56,189,248,0.6)" strokeWidth="0.8" />

                {/* Animated dropping liquid */}
                <circle cx="178" cy="238" r="2.8" fill="#38bdf8" opacity="0.85">
                  <animate attributeName="cy" values="236;268" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.85;0" dur="1.5s" repeatCount="indefinite" />
                </circle>

                {/* Conical Flask */}
                <path d="M162 254 L194 254 L194 263 L218 288 L138 288 L162 263 Z"
                      fill="rgba(255,255,255,0.08)" stroke="#cbd5e1" strokeWidth="1.5" />
                {/* Liquid in flask */}
                <path d="M148 272 L208 272 L216 286 L140 286 Z" fill="rgba(236,72,153,0.45)" />
                {/* Liquid surface */}
                <ellipse cx="178" cy="272" rx="30" ry="3" fill="rgba(236,72,153,0.6)" />

                {/* pH Meter */}
                <rect x="310" y="168" width="160" height="115" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                {/* Screen */}
                <rect x="324" y="184" width="132" height="48" rx="5" fill="#0f172a" />
                {/* pH reading */}
                <text x="346" y="218" fill="#06b6d4" fontFamily="'JetBrains Mono', monospace" fontSize="24" fontWeight="700">pH 7.00</text>
                {/* Power indicator */}
                <circle cx="438" cy="198" r="4" fill="#10b981">
                  <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* Label */}
                <text x="332" y="260" fill="#64748b" fontSize="9.5" fontFamily="'Inter', sans-serif" fontWeight="500">DIGITAL SENSOR ACTIVE</text>

                {/* Connection cable */}
                <path d="M310 232 Q252 245 205 275" stroke="#64748b" strokeWidth="1.8" fill="none" strokeDasharray="4,3" />
                {/* Probe tip */}
                <rect x="195" y="262" width="5" height="20" rx="2.5" fill="#94a3b8" />

                {/* Beaker (right side) */}
                <g transform="translate(370, 200)">
                  <rect x="0" y="10" width="58" height="78" rx="3" fill="rgba(255,255,255,0.06)" stroke="#475569" strokeWidth="1.2" />
                  <path d="M0 10 L-6 18" stroke="#475569" strokeWidth="1" fill="none" />
                  <rect x="2" y="40" width="54" height="46" rx="2" fill="rgba(56,189,248,0.25)" />
                  <ellipse cx="29" cy="40" rx="27" ry="3" fill="rgba(56,189,248,0.4)" />
                  {/* Level markings */}
                  {[25, 40, 55, 70].map((y) => (
                    <line key={y} x1="48" y1={y} x2="54" y2={y} stroke="#475569" strokeWidth="0.5" />
                  ))}
                </g>
              </svg>
            </div>

            {/* Feature Labels */}
            <div className="ln-lab-info">
              {features.map((f, i) => (
                <div key={i} className={`ln-lab-feature ln-reveal ln-reveal-d${Math.min(i + 1, 5)}`}>
                  <div className="ln-lab-dot" />
                  <div>
                    <div className="ln-lab-feature-title">{f.title}</div>
                    <div className="ln-lab-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
              <button
                onClick={onStartExperiment}
                className="ln-btn ln-btn-primary"
                style={{ marginTop: 12, alignSelf: 'flex-start' }}
              >
                Enter Laboratory →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LabPreview;
