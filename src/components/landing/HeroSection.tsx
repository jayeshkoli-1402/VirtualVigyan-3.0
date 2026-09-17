import React from 'react';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';

interface HeroSectionProps {
  onStartExperiment: () => void;
  onExploreExperiments: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartExperiment, onExploreExperiments }) => {
  return (
    <section id="hero" className="ln-hero-wrapper">
      <div className="ln-container">
        <div className="ln-hero-panel">
          {/* Background molecular watermark */}
          <svg className="ln-hero-watermark" viewBox="0 0 1200 500" fill="none" aria-hidden="true">
            {/* Benzene ring */}
            <g stroke="#ffffff" strokeWidth="1.2">
              <polygon points="680,70 710,90 710,130 680,150 650,130 650,90" fill="none" />
              <line x1="680" y1="76" x2="704" y2="94" />
              <line x1="704" y1="124" x2="680" y2="142" />
              <line x1="656" y1="96" x2="656" y2="124" />
              <line x1="680" y1="70" x2="680" y2="45" />
              <line x1="710" y1="130" x2="738" y2="144" />
            </g>
            <text x="672" y="40" fill="#fff" fontSize="11" fontFamily="sans-serif" fontWeight="600">CH₃</text>
            <text x="741" y="150" fill="#fff" fontSize="11" fontFamily="sans-serif" fontWeight="600">OH</text>

            {/* Zigzag chain */}
            <g stroke="#ffffff" strokeWidth="1">
              <line x1="820" y1="100" x2="850" y2="80" />
              <line x1="850" y1="80" x2="880" y2="100" />
              <line x1="880" y1="100" x2="910" y2="80" />
              <line x1="850" y1="80" x2="850" y2="55" />
            </g>

            {/* Scattered particles */}
            <g stroke="#ffffff" strokeWidth="0.8" opacity="0.5">
              <circle cx="980" cy="100" r="3" fill="#38bdf8" />
              <line x1="980" y1="100" x2="1020" y2="80" />
              <circle cx="1020" cy="80" r="5" fill="#10b981" />
              <line x1="1020" y1="80" x2="1050" y2="95" />
              <circle cx="1050" cy="95" r="2.5" fill="#fff" />
            </g>

            {/* Lower bonds */}
            <g stroke="#ffffff" strokeWidth="0.8" opacity="0.3">
              <line x1="120" y1="280" x2="165" y2="305" />
              <line x1="165" y1="305" x2="210" y2="285" />
              <circle cx="120" cy="280" r="4" fill="#38bdf8" />
              <circle cx="210" cy="285" r="3" fill="#10b981" />
              <line x1="350" y1="320" x2="395" y2="295" />
              <line x1="395" y1="295" x2="420" y2="320" />
              <circle cx="395" cy="295" r="5" fill="rgba(255,255,255,0.25)" />
            </g>

            {/* Extra scattered atoms */}
            <g opacity="0.2">
              <circle cx="1100" cy="200" r="2" fill="#38bdf8" />
              <circle cx="1130" cy="220" r="3" fill="#10b981" />
              <line x1="1100" y1="200" x2="1130" y2="220" stroke="#fff" strokeWidth="0.8" />
              <circle cx="500" cy="380" r="2.5" fill="#f59e0b" />
              <circle cx="530" cy="370" r="1.5" fill="#38bdf8" />
              <line x1="500" y1="380" x2="530" y2="370" stroke="#fff" strokeWidth="0.6" />
            </g>
          </svg>

          {/* Left: Hero Content */}
          <div className="ln-hero-content">
            <div className="ln-hero-eyebrow">
              <VirtualVigyanLogo size={20} />
              <span>Interactive Virtual Chemistry Laboratory</span>
            </div>

            <h1 className="ln-hero-title">
              Practice Chemistry.<br />
              Experience the Laboratory.
            </h1>

            <p className="ln-hero-desc">
              Perform interactive chemistry experiments, practice laboratory procedures, and learn safely through a virtual laboratory designed for repeatable hands-on learning.
            </p>

            <div className="ln-hero-buttons">
              <button onClick={onStartExperiment} className="ln-btn ln-btn-primary" style={{ padding: '14px 30px', fontSize: '0.95rem' }}>
                <span>▶</span> Start Experiment
              </button>
              <button onClick={onExploreExperiments} className="ln-btn ln-btn-hero-outline" style={{ padding: '14px 26px', fontSize: '0.95rem' }}>
                Explore Experiments
              </button>
            </div>

            <div className="ln-hero-meta">
              <span>Interactive</span>
              <span className="ln-hero-meta-dot" />
              <span>Safe</span>
              <span className="ln-hero-meta-dot" />
              <span>Repeatable</span>
              <span className="ln-hero-meta-dot" />
              <span>Educational</span>
            </div>
          </div>

          {/* Right: Chemistry Visual — Large detailed SVG */}
          <div className="ln-hero-visual">
            <svg width="420" height="340" viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="lnFlaskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="lnGlass" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                </linearGradient>
                <linearGradient id="lnAmberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="lnPinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* ── Test Tube Rack (Stationary on Bench) ── */}
              <g transform="translate(18, 60)">
                {/* Rack structure */}
                <rect x="0" y="50" width="135" height="5" rx="2.5" fill="#475569" opacity="0.85" />
                <rect x="0" y="115" width="135" height="6" rx="3" fill="#334155" />
                <rect x="3" y="50" width="4" height="68" rx="2" fill="#334155" />
                <rect x="128" y="50" width="4" height="68" rx="2" fill="#334155" />

                {/* Tube 1: Cyan */}
                <rect x="18" y="16" width="16" height="96" rx="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
                <path d="M18 56 L34 56 L34 104 Q34 112 26 112 Q18 112 18 104 Z" fill="#06b6d4" opacity="0.9" />
                <ellipse cx="26" cy="56" rx="8" ry="2" fill="#67e8f9" />
                {/* Bubble */}
                <circle cx="26" cy="90" r="1.8" fill="#fff" opacity="0.7">
                  <animate attributeName="cy" values="100;60" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="r" values="1.8;0.8" dur="2.5s" repeatCount="indefinite" />
                </circle>

                {/* Tube 2: Amber */}
                <rect x="44" y="16" width="16" height="96" rx="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
                <path d="M44 48 L60 48 L60 104 Q60 112 52 112 Q44 112 44 104 Z" fill="url(#lnAmberGrad)" opacity="0.9" />
                <ellipse cx="52" cy="48" rx="8" ry="2" fill="#fde68a" />

                {/* Tube 3: Pink */}
                <rect x="70" y="16" width="16" height="96" rx="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
                <path d="M70 38 L86 38 L86 104 Q86 112 78 112 Q70 112 70 104 Z" fill="url(#lnPinkGrad)" opacity="0.9" />
                <ellipse cx="78" cy="38" rx="8" ry="2" fill="#fbcfe8" />
                <circle cx="78" cy="78" r="1.2" fill="#fff" opacity="0.6">
                  <animate attributeName="cy" values="95;44" dur="3.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0" dur="3.2s" repeatCount="indefinite" />
                </circle>

                {/* Tube 4: Emerald */}
                <rect x="96" y="16" width="16" height="96" rx="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
                <path d="M96 62 L112 62 L112 104 Q112 112 104 112 Q96 112 96 104 Z" fill="#10b981" opacity="0.9" />
                <ellipse cx="104" cy="62" rx="8" ry="2" fill="#a7f3d0" />
              </g>

              {/* ── Erlenmeyer Flask (Center) ── */}
              <g transform="translate(185, 30)">
                {/* Flask body */}
                <path d="M40 10 L40 60 L8 140 Q4 152 18 152 L82 152 Q96 152 92 140 L60 60 L60 10 Z"
                      fill="url(#lnGlass)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
                {/* Liquid fill */}
                <path d="M16 115 L84 115 L91 140 Q93 148 82 148 L18 148 Q7 148 9 140 Z"
                      fill="url(#lnFlaskGrad)" opacity="0.92" />
                {/* Liquid surface */}
                <ellipse cx="50" cy="115" rx="34" ry="5" fill="#7dd3fc" opacity="0.9" />
                {/* Glass reflection */}
                <path d="M40 14 L40 60 L18 115" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" strokeLinecap="round" />
                {/* Neck rim */}
                <rect x="37" y="6" width="26" height="4" rx="2" fill="rgba(255,255,255,0.3)" />

                {/* Animated bubbles */}
                <circle cx="42" cy="138" r="2.2" fill="#fff" opacity="0.75">
                  <animate attributeName="cy" values="142;116" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.75;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="58" cy="135" r="1.6" fill="#fff" opacity="0.6">
                  <animate attributeName="cy" values="140;118" dur="1.7s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0" dur="1.7s" repeatCount="indefinite" />
                </circle>
                <circle cx="35" cy="130" r="1.2" fill="#fff" opacity="0.5">
                  <animate attributeName="cy" values="138;120" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0" dur="2.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="66" cy="134" r="0.9" fill="#fff" opacity="0.4">
                  <animate attributeName="cy" values="136;122" dur="3.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0" dur="3.4s" repeatCount="indefinite" />
                </circle>
              </g>

              {/* ── Burette (Right side) ── */}
              <g transform="translate(310, 20)">
                {/* Retort stand */}
                <rect x="-10" y="260" width="80" height="8" rx="3" fill="#64748b" />
                <rect x="25" y="8" width="6" height="252" rx="2.5" fill="#94a3b8" />
                <rect x="25" y="50" width="38" height="6" rx="2" fill="#64748b" />
                <rect x="59" y="46" width="4" height="14" rx="2" fill="#cbd5e1" />

                {/* Burette tube */}
                <rect x="55" y="12" width="13" height="175" rx="5" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                {/* Liquid level */}
                <rect x="57" y="50" width="9" height="135" fill="rgba(56,189,248,0.4)" rx="3" />
                <path d="M57 50 Q61.5 54 66 50" stroke="#38bdf8" strokeWidth="1" fill="none" />

                {/* Graduation marks */}
                {[40, 60, 80, 100, 120, 140, 160].map((y) => (
                  <g key={y}>
                    <line x1="64" y1={y} x2="68" y2={y} stroke="#94a3b8" strokeWidth="0.7" />
                    <line x1="62" y1={y + 10} x2="68" y2={y + 10} stroke="#64748b" strokeWidth="0.5" />
                  </g>
                ))}

                {/* Stopcock */}
                <circle cx="61" cy="193" r="5.5" fill="#f59e0b" />
                <rect x="55" y="191" width="12" height="4" rx="2" fill="#fbbf24" />

                {/* Nozzle */}
                <polygon points="59,200 63,200 62,215 60,215" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" />

                {/* Animated falling drop */}
                <circle cx="61" cy="218" r="2.5" fill="#38bdf8" opacity="0">
                  <animate attributeName="cy" values="218;258" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.9;0.9;0" dur="2.8s" keyTimes="0;0.1;0.8;1" repeatCount="indefinite" />
                </circle>
              </g>

              {/* ── Beaker (Stationary on Bench) ── */}
              <g transform="translate(330, 180)">
                <rect x="0" y="20" width="60" height="70" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                {/* Spout */}
                <path d="M0 20 L-6 28" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
                {/* Liquid */}
                <rect x="2" y="45" width="56" height="43" rx="2" fill="rgba(16,185,129,0.5)" />
                <ellipse cx="30" cy="45" rx="28" ry="3" fill="#34d399" opacity="0.7" />
                {/* Markings */}
                <line x1="52" y1="35" x2="56" y2="35" stroke="#94a3b8" strokeWidth="0.6" />
                <line x1="52" y1="50" x2="56" y2="50" stroke="#94a3b8" strokeWidth="0.6" />
                <line x1="52" y1="65" x2="56" y2="65" stroke="#94a3b8" strokeWidth="0.6" />
              </g>

              {/* ── Floating Molecule 1 (top right) ── */}
              <g style={{ animation: 'lnFloat 7s ease-in-out infinite' }} opacity="0.55">
                <circle cx="370" cy="40" r="7" fill="#38bdf8" opacity="0.45" />
                <circle cx="355" cy="28" r="5" fill="#10b981" opacity="0.45" />
                <line x1="370" y1="40" x2="355" y2="28" stroke="#ffffff" strokeWidth="1.2" opacity="0.35" />
                <circle cx="384" cy="30" r="4" fill="#f59e0b" opacity="0.35" />
                <line x1="370" y1="40" x2="384" y2="30" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
                <circle cx="360" cy="52" r="3" fill="#ec4899" opacity="0.3" />
                <line x1="370" y1="40" x2="360" y2="52" stroke="#ffffff" strokeWidth="0.8" opacity="0.2" />
              </g>

              {/* ── Floating Molecule 2 (bottom left) ── */}
              <g style={{ animation: 'lnFloat2 9s ease-in-out infinite', animationDelay: '-3s' }} opacity="0.4">
                <circle cx="30" cy="290" r="5.5" fill="#ec4899" opacity="0.45" />
                <circle cx="48" cy="278" r="3.5" fill="#38bdf8" opacity="0.4" />
                <line x1="30" y1="290" x2="48" y2="278" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
                <circle cx="16" cy="278" r="3" fill="#10b981" opacity="0.35" />
                <line x1="30" y1="290" x2="16" y2="278" stroke="#ffffff" strokeWidth="0.8" opacity="0.25" />
              </g>

              {/* ── Floating Molecule 3 (mid right) ── */}
              <g style={{ animation: 'lnFloat3 11s ease-in-out infinite', animationDelay: '-5s' }} opacity="0.35">
                <circle cx="400" cy="180" r="4" fill="#7c3aed" opacity="0.4" />
                <circle cx="412" cy="170" r="3" fill="#38bdf8" opacity="0.35" />
                <line x1="400" y1="180" x2="412" y2="170" stroke="#ffffff" strokeWidth="0.8" opacity="0.2" />
              </g>

              {/* ── Small floating particles ── */}
              <circle cx="160" cy="295" r="2" fill="#38bdf8" opacity="0.2" style={{ animation: 'lnFloat 12s ease-in-out infinite', animationDelay: '-6s' }} />
              <circle cx="290" cy="310" r="1.5" fill="#10b981" opacity="0.15" style={{ animation: 'lnFloat2 14s ease-in-out infinite', animationDelay: '-4s' }} />
              <circle cx="80" cy="20" r="1.5" fill="#f59e0b" opacity="0.2" style={{ animation: 'lnFloat3 10s ease-in-out infinite', animationDelay: '-2s' }} />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
