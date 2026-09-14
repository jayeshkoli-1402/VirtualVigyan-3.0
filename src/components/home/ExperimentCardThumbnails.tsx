import React from 'react';

interface ThumbnailProps {
  type: string;
  width?: number;
  height?: number;
}

/**
 * High-fidelity SVG Apparatus Thumbnail Illustrations
 * Matches the realistic 3D-styled glassware in the dashboard cards:
 * - Viscometer (Ostwald)
 * - pH-Metric meter with probe & beaker
 * - Conductometer with electrode & beaker
 * - Reagent bottles (AgNO3, NaCl)
 * - Two Conical Flasks (magenta & cyan)
 * - Burette on Stand with Conical Flask
 * - Beaker with precision glass dropper
 * - Estimation of Iron (beaker with brownish-red complex)
 */
export const ExperimentThumbnail: React.FC<ThumbnailProps> = ({ type, width = 280, height = 135 }) => {
  switch (type) {
    // ── 1. Ostwald's Viscometer ──
    case 'viscosity-ostwald':
      return (
        <svg width={width} height={height} viewBox="0 0 280 135" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="viscGlass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="30%" stopColor="rgba(224,242,254,0.3)" />
              <stop offset="70%" stopColor="rgba(186,230,253,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.85)" />
            </linearGradient>
            <linearGradient id="viscBlueLiquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="viscShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Stand Rod */}
          <rect x="180" y="10" width="6" height="120" rx="3" fill="#334155" />
          {/* Clamp */}
          <rect x="150" y="48" width="34" height="6" rx="2" fill="#475569" />
          <circle cx="150" cy="51" r="5" fill="#64748b" />
          <circle cx="183" cy="51" r="5" fill="#0f172a" />

          {/* Ostwald Viscometer Glass Tube */}
          <g filter="url(#viscShadow)">
            {/* Left wide arm */}
            <path
              d="M 120 18 L 120 65 Q 120 85 130 98 Q 140 108 147 108 Q 154 108 160 98 L 160 30"
              stroke="url(#viscGlass)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 120 18 L 120 65 Q 120 85 130 98 Q 140 108 147 108 Q 154 108 160 98 L 160 30"
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Left Upper Bulb */}
            <ellipse cx="120" cy="42" rx="10" ry="14" fill="url(#viscGlass)" stroke="#94a3b8" strokeWidth="0.8" />
            <ellipse cx="120" cy="46" rx="8" ry="9" fill="url(#viscBlueLiquid)" opacity="0.85" />
            {/* Etched marks */}
            <line x1="112" y1="26" x2="128" y2="26" stroke="#0284c7" strokeWidth="1" />
            <line x1="112" y1="58" x2="128" y2="58" stroke="#0284c7" strokeWidth="1" />

            {/* Right Lower Bulb with blue liquid */}
            <ellipse cx="156" cy="88" rx="11" ry="13" fill="url(#viscGlass)" stroke="#94a3b8" strokeWidth="0.8" />
            <ellipse cx="156" cy="90" rx="9.5" ry="10.5" fill="url(#viscBlueLiquid)" />
            {/* Liquid in U-bend */}
            <path
              d="M 128 96 Q 138 106 147 106 Q 154 106 156 98"
              stroke="url(#viscBlueLiquid)"
              strokeWidth="5"
              fill="none"
            />

            {/* Capillary Line Highlight */}
            <line x1="120" y1="60" x2="120" y2="82" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2" />
          </g>
        </svg>
      );

    // ── 2. pH-Metric Titration (Acid–Base) ──
    case 'ph-metric-titration':
      return (
        <svg width={width} height={height} viewBox="0 0 280 135" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="phPinkLiquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="phBeakerGlass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="20%" stopColor="rgba(241,245,249,0.2)" />
              <stop offset="80%" stopColor="rgba(203,213,225,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
            </linearGradient>
          </defs>

          {/* Beaker on the left */}
          <g transform="translate(70, 30)">
            {/* Beaker Body */}
            <rect x="5" y="10" width="55" height="68" rx="4" fill="url(#phBeakerGlass)" stroke="#94a3b8" strokeWidth="1.2" />
            {/* Pink Solution */}
            <path d="M 7 42 L 58 42 L 58 74 Q 58 76 55 76 L 10 76 Q 7 76 7 74 Z" fill="url(#phPinkLiquid)" />
            <ellipse cx="32.5" cy="42" rx="25.5" ry="3.5" fill="#fda4af" opacity="0.9" />
            {/* Graduations */}
            <line x1="7" y1="48" x2="17" y2="48" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="7" y1="56" x2="15" y2="56" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="7" y1="64" x2="17" y2="64" stroke="#cbd5e1" strokeWidth="1" />
            {/* Glass Rim */}
            <ellipse cx="32.5" cy="10" rx="27.5" ry="3" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </g>

          {/* Digital pH Meter Console on the right */}
          <g transform="translate(145, 22)">
            {/* Outer Box */}
            <rect x="0" y="0" width="54" height="84" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            {/* Green LCD Display */}
            <rect x="7" y="10" width="40" height="24" rx="4" fill="#064e3b" stroke="#047857" strokeWidth="1" />
            <text x="27" y="27" textAnchor="middle" fill="#34d399" fontSize="13" fontFamily="monospace" fontWeight="800">
              7.02
            </text>
            <text x="40" y="17" textAnchor="middle" fill="#6ee7b7" fontSize="5" fontFamily="monospace">
              pH
            </text>

            {/* Buttons */}
            <circle cx="16" cy="46" r="4.5" fill="#f59e0b" />
            <circle cx="27" cy="46" r="4.5" fill="#10b981" />
            <circle cx="38" cy="46" r="4.5" fill="#3b82f6" />
            <circle cx="16" cy="62" r="3.5" fill="#64748b" />
            <circle cx="27" cy="62" r="3.5" fill="#64748b" />
            <circle cx="38" cy="62" r="3.5" fill="#64748b" />
            <rect x="14" y="72" width="26" height="5" rx="2" fill="#334155" />
          </g>

          {/* Electrode Cable & Glass Probe dipping into Beaker */}
          <path d="M 145 64 Q 120 85 106 60 L 106 32" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Glass Probe */}
          <rect x="103" y="18" width="6" height="48" rx="2" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
          <ellipse cx="106" cy="66" rx="4" ry="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
        </svg>
      );

    // ── 3. Conductometric Titration (HCl vs NaOH) ──
    case 'conductometric-titration':
      return (
        <svg width={width} height={height} viewBox="0 0 280 135" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="condCyanLiquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>

          {/* Bench Device (Conductivity Bridge) on Left */}
          <g transform="translate(68, 32)">
            <rect x="0" y="10" width="70" height="64" rx="7" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* Slanted top effect */}
            <path d="M 0 16 L 10 0 L 80 0 L 70 16 Z" fill="#334155" />
            {/* Digital Display */}
            <rect x="10" y="18" width="50" height="24" rx="4" fill="#042f2e" stroke="#0d9488" strokeWidth="1" />
            <text x="35" y="34" textAnchor="middle" fill="#2dd4bf" fontSize="11" fontFamily="monospace" fontWeight="800">
              14.28
            </text>
            <text x="52" y="24" textAnchor="middle" fill="#5eead4" fontSize="4.5" fontFamily="monospace">
              mS/cm
            </text>

            {/* Controls */}
            <circle cx="20" cy="54" r="5" fill="#475569" stroke="#64748b" />
            <circle cx="35" cy="54" r="5" fill="#475569" stroke="#64748b" />
            <circle cx="50" cy="54" r="5" fill="#0ea5e9" stroke="#38bdf8" />
          </g>

          {/* Beaker with Cyan Liquid on Right */}
          <g transform="translate(162, 38)">
            <rect x="0" y="10" width="48" height="58" rx="4" fill="rgba(255,255,255,0.7)" stroke="#94a3b8" strokeWidth="1.2" />
            <path d="M 2 34 L 46 34 L 46 64 Q 46 66 44 66 L 4 66 Q 2 66 2 64 Z" fill="url(#condCyanLiquid)" />
            <ellipse cx="24" cy="34" rx="22" ry="3" fill="#67e8f9" opacity="0.8" />
            <ellipse cx="24" cy="10" rx="24" ry="2.5" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
          </g>

          {/* Conductance Cell Probe (Black Pen-style) */}
          <g transform="translate(182, 8)">
            <rect x="0" y="0" width="7" height="62" rx="3.5" fill="#0f172a" />
            <rect x="2" y="56" width="3" height="14" fill="#94a3b8" />
            {/* Platinum electrodes */}
            <rect x="1" y="66" width="5" height="2" fill="#475569" />
            {/* Cable to bridge */}
            <path d="M 3 5 Q -20 -8 -50 35" fill="none" stroke="#0f172a" strokeWidth="2" />
          </g>
        </svg>
      );

    // ── 4. Chloride Content by Mohr's Method (AgNO3 & NaCl Bottles) ──
    case 'chloride-mohr-method':
      return (
        <svg width={width} height={height} viewBox="0 0 280 135" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="bottleGlass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#f8fafc" />
              <stop offset="85%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="bottleCap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>

          {/* Bottle 1: AgNO3 (Left) */}
          <g transform="translate(90, 24)">
            {/* Cap */}
            <rect x="12" y="0" width="18" height="12" rx="2" fill="url(#bottleCap)" />
            <line x1="12" y1="4" x2="30" y2="4" stroke="#60a5fa" strokeWidth="0.8" />
            <line x1="12" y1="8" x2="30" y2="8" stroke="#60a5fa" strokeWidth="0.8" />

            {/* Neck & Shoulder */}
            <path d="M 15 12 L 15 18 Q 15 24 5 28 L 3 84 Q 3 88 7 88 L 35 88 Q 39 88 39 84 L 37 28 Q 27 24 27 18 L 27 12 Z" fill="url(#bottleGlass)" stroke="#94a3b8" strokeWidth="1" />

            {/* Liquid inside */}
            <rect x="5" y="44" width="32" height="42" rx="2" fill="rgba(224, 242, 254, 0.45)" />

            {/* Label Paper */}
            <rect x="6" y="38" width="30" height="34" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
            <text x="21" y="58" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="800" fontFamily="sans-serif">
              AgNO₃
            </text>
            <text x="21" y="67" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="sans-serif">
              0.02 N
            </text>
          </g>

          {/* Bottle 2: NaCl (Right) */}
          <g transform="translate(148, 24)">
            {/* Cap */}
            <rect x="12" y="0" width="18" height="12" rx="2" fill="#0f172a" />
            <line x1="12" y1="4" x2="30" y2="4" stroke="#475569" strokeWidth="0.8" />
            <line x1="12" y1="8" x2="30" y2="8" stroke="#475569" strokeWidth="0.8" />

            {/* Neck & Shoulder */}
            <path d="M 15 12 L 15 18 Q 15 24 5 28 L 3 84 Q 3 88 7 88 L 35 88 Q 39 88 39 84 L 37 28 Q 27 24 27 18 L 27 12 Z" fill="url(#bottleGlass)" stroke="#94a3b8" strokeWidth="1" />

            {/* Liquid inside */}
            <rect x="5" y="48" width="32" height="38" rx="2" fill="rgba(207, 250, 254, 0.35)" />

            {/* Label Paper */}
            <rect x="6" y="38" width="30" height="34" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
            <text x="21" y="58" textAnchor="middle" fill="#0f172a" fontSize="8.5" fontWeight="800" fontFamily="sans-serif">
              NaCl
            </text>
            <text x="21" y="67" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="sans-serif">
              Std. Soln
            </text>
          </g>
        </svg>
      );

    // ── 5. Acidity of Water Sample (Two Conical Flasks - Pink & Cyan) ──
    case 'water-acidity':
      return (
        <svg width={width} height={height} viewBox="0 0 280 135" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="flaskPink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="flaskCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Left Flask: Phenolphthalein Pink */}
          <g transform="translate(80, 28)">
            {/* Glass body */}
            <path d="M 20 6 L 20 22 L 5 66 Q 3 72 10 72 L 50 72 Q 57 72 55 66 L 40 22 L 40 6 Z" fill="rgba(255,255,255,0.7)" stroke="#94a3b8" strokeWidth="1.2" />
            {/* Pink Solution */}
            <path d="M 12 48 L 48 48 L 52 66 Q 54 70 48 70 L 12 70 Q 6 70 8 66 Z" fill="url(#flaskPink)" opacity="0.9" />
            <ellipse cx="30" cy="48" rx="18" ry="3" fill="#f43f5e" opacity="0.8" />
            {/* Rim */}
            <ellipse cx="30" cy="6" rx="10" ry="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </g>

          {/* Right Flask: Methyl Orange / Cyan Neutralized */}
          <g transform="translate(142, 28)">
            {/* Glass body */}
            <path d="M 20 6 L 20 22 L 5 66 Q 3 72 10 72 L 50 72 Q 57 72 55 66 L 40 22 L 40 6 Z" fill="rgba(255,255,255,0.7)" stroke="#94a3b8" strokeWidth="1.2" />
            {/* Cyan Solution */}
            <path d="M 12 44 L 48 44 L 52 66 Q 54 70 48 70 L 12 70 Q 6 70 8 66 Z" fill="url(#flaskCyan)" opacity="0.9" />
            <ellipse cx="30" cy="44" rx="18" ry="3" fill="#38bdf8" opacity="0.8" />
            {/* Rim */}
            <ellipse cx="30" cy="6" rx="10" ry="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </g>
        </svg>
      );

    // ── 6. Determination of Alkalinity of Water (Burette Stand + Flask) ──
    case 'water-alkalinity':
      return (
        <svg width={width} height={height} viewBox="0 0 280 135" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {/* Stand Base */}
          <rect x="110" y="118" width="80" height="8" rx="2" fill="#334155" />
          {/* Retort Rod */}
          <rect x="126" y="8" width="5" height="112" rx="2.5" fill="#475569" />
          {/* Clamp */}
          <rect x="128" y="32" width="22" height="5" rx="1" fill="#1e293b" />
          <circle cx="148" cy="34.5" r="4" fill="#0f172a" />

          {/* Burette Glass Tube */}
          <rect x="145" y="8" width="6" height="68" rx="1" fill="rgba(224,242,254,0.6)" stroke="#94a3b8" strokeWidth="0.8" />
          {/* Graduations */}
          <line x1="145" y1="18" x2="149" y2="18" stroke="#64748b" strokeWidth="0.8" />
          <line x1="145" y1="28" x2="149" y2="28" stroke="#64748b" strokeWidth="0.8" />
          <line x1="145" y1="38" x2="149" y2="38" stroke="#64748b" strokeWidth="0.8" />
          <line x1="145" y1="48" x2="149" y2="48" stroke="#64748b" strokeWidth="0.8" />

          {/* Stopcock valve */}
          <rect x="143" y="66" width="10" height="3" rx="1" fill="#0284c7" />
          {/* Tip */}
          <path d="M 147 69 L 147.5 78 L 148.5 78 L 149 69 Z" fill="#94a3b8" />
          {/* Falling drop */}
          <circle cx="148" cy="84" r="1.5" fill="#f43f5e" />

          {/* Conical Flask with Phenolphthalein Pink */}
          <g transform="translate(126, 74)">
            <path d="M 18 10 L 18 18 L 8 42 Q 6 46 11 46 L 33 46 Q 38 46 36 42 L 26 18 L 26 10 Z" fill="rgba(255,255,255,0.7)" stroke="#94a3b8" strokeWidth="1" />
            <path d="M 12 30 L 32 30 L 34 42 Q 36 45 31 45 L 13 45 Q 8 45 10 42 Z" fill="#e11d48" opacity="0.9" />
            <ellipse cx="22" cy="30" rx="10" ry="2" fill="#fda4af" />
          </g>
        </svg>
      );

    // ── 7. Hardness of Water by EDTA Method (Beaker + Dropper) ──
    case 'water-hardness-edta':
      return (
        <svg width={width} height={height} viewBox="0 0 280 135" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {/* Beaker on bench */}
          <g transform="translate(112, 42)">
            <rect x="0" y="8" width="56" height="66" rx="4" fill="rgba(255,255,255,0.8)" stroke="#94a3b8" strokeWidth="1.2" />
            {/* Water solution */}
            <path d="M 2 32 L 54 32 L 54 70 Q 54 72 51 72 L 5 72 Q 2 72 2 70 Z" fill="rgba(224, 242, 254, 0.6)" />
            <ellipse cx="28" cy="32" rx="26" ry="3.5" fill="#bae6fd" opacity="0.8" />
            <ellipse cx="28" cy="8" rx="28" ry="3" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
          </g>

          {/* Precision Glass Pipette / Dropper tilted */}
          <g transform="translate(142, 10) rotate(-15)">
            {/* Rubber bulb */}
            <ellipse cx="10" cy="8" rx="8" ry="12" fill="#1e293b" />
            {/* Glass stem */}
            <rect x="7" y="18" width="6" height="50" rx="2" fill="rgba(255,255,255,0.9)" stroke="#94a3b8" strokeWidth="0.8" />
            {/* Tapered tip */}
            <path d="M 8 68 L 9 84 L 11 84 L 12 68 Z" fill="#64748b" />
            {/* Droplet falling */}
            <circle cx="10" cy="92" r="2.2" fill="#0284c7" />
          </g>
        </svg>
      );

    // ── 8. Estimation of Iron / Reaction Beaker (Brown complex / Oil) ──
    case 'acid-value-oil':
    case 'dissolved-oxygen-winkler':
    default:
      return (
        <svg width={width} height={height} viewBox="0 0 280 135" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="brownIronLiquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b45309" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Large Beaker with Reaction Precipitate */}
          <g transform="translate(112, 34)">
            <rect x="0" y="8" width="56" height="72" rx="4" fill="rgba(255,255,255,0.85)" stroke="#94a3b8" strokeWidth="1.2" />
            {/* Liquid */}
            <path d="M 2 34 L 54 34 L 54 76 Q 54 78 51 78 L 5 78 Q 2 78 2 76 Z" fill="url(#brownIronLiquid)" />
            <ellipse cx="28" cy="34" rx="26" ry="3.5" fill="#d97706" opacity="0.8" />

            {/* Floating precipitate specks */}
            <circle cx="18" cy="46" r="1.8" fill="#451a03" opacity="0.6" />
            <circle cx="28" cy="56" r="2.2" fill="#451a03" opacity="0.8" />
            <circle cx="38" cy="48" r="1.5" fill="#451a03" opacity="0.6" />
            <circle cx="22" cy="66" r="2.5" fill="#451a03" opacity="0.8" />
            <circle cx="36" cy="64" r="1.9" fill="#451a03" opacity="0.7" />

            {/* Rim */}
            <ellipse cx="28" cy="8" rx="28" ry="3" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
          </g>
        </svg>
      );
  }
};
