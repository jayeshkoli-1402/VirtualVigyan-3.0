import React from 'react';

type GraphType =
  | 'ph-titration'
  | 'conductometric'
  | 'viscosity-comparison'
  | 'do-titration'
  | 'acidity-titration'
  | 'alkalinity-titration';

interface TitrationGraphProps {
  type: GraphType;
  width?: number;
  height?: number;
}

/**
 * Pure SVG graphs for experiment theory notes.
 * No charting library needed — hand-drawn curves for clarity.
 */
export const TitrationGraph: React.FC<TitrationGraphProps> = ({
  type,
  width = 420,
  height = 260,
}) => {
  const pad = { top: 30, right: 30, bottom: 44, left: 54 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '16px 12px 8px',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: 8,
          paddingLeft: 4,
        }}
      >
        {graphTitle(type)}
      </div>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block', maxWidth: '100%' }}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={pad.left}
            y1={pad.top + h * f}
            x2={pad.left + w}
            y2={pad.top + h * f}
            stroke="var(--border)"
            strokeDasharray="4 3"
            strokeWidth={0.7}
          />
        ))}

        {/* Axes */}
        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={pad.top + h}
          stroke="var(--text-muted)"
          strokeWidth={1.5}
        />
        <line
          x1={pad.left}
          y1={pad.top + h}
          x2={pad.left + w}
          y2={pad.top + h}
          stroke="var(--text-muted)"
          strokeWidth={1.5}
        />

        {/* Axis labels */}
        <text
          x={pad.left + w / 2}
          y={height - 6}
          textAnchor="middle"
          style={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 600 }}
        >
          {xLabel(type)}
        </text>
        <text
          x={14}
          y={pad.top + h / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${pad.top + h / 2})`}
          style={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 600 }}
        >
          {yLabel(type)}
        </text>

        {/* Curve */}
        <g transform={`translate(${pad.left}, ${pad.top})`}>
          {renderCurve(type, w, h)}
        </g>
      </svg>
    </div>
  );
};

/* ── Helpers ── */

function graphTitle(type: GraphType): string {
  const map: Record<GraphType, string> = {
    'ph-titration': 'pH vs Volume of NaOH — Titration Curve',
    conductometric: 'Conductance vs Volume of NaOH — V-Shape Plot',
    'viscosity-comparison': 'Flow Time Comparison — Water vs Test Liquid',
    'do-titration': 'Iodometric Titration — Na₂S₂O₃ vs I₂',
    'acidity-titration': 'Acidity Titration — NaOH vs Water Sample',
    'alkalinity-titration': 'Alkalinity Titration — H₂SO₄ vs Water Sample',
  };
  return map[type];
}

function xLabel(type: GraphType): string {
  const map: Record<GraphType, string> = {
    'ph-titration': 'Volume of NaOH added (mL)',
    conductometric: 'Volume of NaOH added (mL)',
    'viscosity-comparison': '',
    'do-titration': 'Volume of Na₂S₂O₃ (mL)',
    'acidity-titration': 'Volume of NaOH added (mL)',
    'alkalinity-titration': 'Volume of H₂SO₄ added (mL)',
  };
  return map[type];
}

function yLabel(type: GraphType): string {
  const map: Record<GraphType, string> = {
    'ph-titration': 'pH',
    conductometric: 'Conductance (mS)',
    'viscosity-comparison': 'Flow time (s)',
    'do-titration': 'Free I₂ remaining',
    'acidity-titration': 'pH of solution',
    'alkalinity-titration': 'pH of solution',
  };
  return map[type];
}

function renderCurve(type: GraphType, w: number, h: number): React.ReactNode {
  switch (type) {
    case 'ph-titration':
      return <PhTitrationCurve w={w} h={h} />;
    case 'conductometric':
      return <ConductometricCurve w={w} h={h} />;
    case 'viscosity-comparison':
      return <ViscosityBars w={w} h={h} />;
    case 'do-titration':
      return <DoTitrationCurve w={w} h={h} />;
    case 'acidity-titration':
      return <AcidityTitrationCurve w={w} h={h} />;
    case 'alkalinity-titration':
      return <AlkalinityTitrationCurve w={w} h={h} />;
    default:
      return null;
  }
}

/* ── Individual Graph SVGs ── */

const PhTitrationCurve: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  // Sigmoidal S-curve: pH starts ~1, jumps at equivalence (~50%), ends ~13
  const pts: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * w;
    // Logistic function centered at 50%
    const t = (i - 50) / 6;
    const pH = 1 + 12 / (1 + Math.exp(-t));
    const y = h - (pH / 14) * h;
    pts.push([x, y]);
  }
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');

  // Equivalence point
  const eqX = w * 0.5;
  const eqY = h - (7 / 14) * h;

  return (
    <>
      <defs>
        <linearGradient id="phGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill under curve */}
      <path
        d={`${path} L${w},${h} L0,${h} Z`}
        fill="url(#phGrad)"
      />
      {/* Main curve */}
      <path d={path} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round" />
      {/* Equivalence point */}
      <line x1={eqX} y1={0} x2={eqX} y2={h} stroke="#ef4444" strokeDasharray="5 3" strokeWidth={1} />
      <circle cx={eqX} cy={eqY} r={5} fill="#ef4444" />
      <text x={eqX + 8} y={eqY - 8} style={{ fontSize: 10, fill: '#ef4444', fontWeight: 700 }}>
        Equivalence Point
      </text>
      {/* pH axis labels */}
      <text x={-6} y={h} textAnchor="end" style={{ fontSize: 9, fill: 'var(--text-muted)' }}>0</text>
      <text x={-6} y={h / 2} textAnchor="end" style={{ fontSize: 9, fill: 'var(--text-muted)' }}>7</text>
      <text x={-6} y={6} textAnchor="end" style={{ fontSize: 9, fill: 'var(--text-muted)' }}>14</text>
    </>
  );
};

const ConductometricCurve: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  // V-shape: conductance falls until equivalence (~45%), then rises
  const pts: [number, number][] = [];
  const eqFrac = 0.45;
  for (let i = 0; i <= 100; i++) {
    const frac = i / 100;
    const x = frac * w;
    let cond: number;
    if (frac <= eqFrac) {
      // Falling: high conductance → minimum
      cond = 0.85 - (frac / eqFrac) * 0.55;
    } else {
      // Rising: minimum → moderate
      cond = 0.3 + ((frac - eqFrac) / (1 - eqFrac)) * 0.45;
    }
    const y = h - cond * h;
    pts.push([x, y]);
  }
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');

  const eqX = eqFrac * w;
  const eqY = h - 0.3 * h;

  return (
    <>
      <defs>
        <linearGradient id="condGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#condGrad)" />
      <path d={path} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" />
      {/* Equivalence */}
      <line x1={eqX} y1={0} x2={eqX} y2={h} stroke="#ef4444" strokeDasharray="5 3" strokeWidth={1} />
      <circle cx={eqX} cy={eqY} r={5} fill="#ef4444" />
      <text x={eqX + 8} y={eqY - 8} style={{ fontSize: 10, fill: '#ef4444', fontWeight: 700 }}>
        End Point
      </text>
      {/* Slope labels */}
      <text x={eqX / 2 - 20} y={h * 0.35} style={{ fontSize: 9, fill: '#10b981', fontWeight: 600 }}>
        H⁺ replaced by Na⁺
      </text>
      <text x={eqX + (w - eqX) / 2 - 10} y={h * 0.35} style={{ fontSize: 9, fill: '#10b981', fontWeight: 600 }}>
        Excess OH⁻ added
      </text>
    </>
  );
};

const ViscosityBars: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const barW = w * 0.2;
  const gap = w * 0.15;
  const x1 = w / 2 - barW - gap / 2;
  const x2 = w / 2 + gap / 2;
  const h1 = h * 0.5; // Water — shorter flow time
  const h2 = h * 0.82; // Test liquid — longer flow time

  return (
    <>
      <defs>
        <linearGradient id="barWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="barLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Water bar */}
      <rect x={x1} y={h - h1} width={barW} height={h1} rx={6} fill="url(#barWater)" opacity={0.85} />
      <text x={x1 + barW / 2} y={h - h1 - 8} textAnchor="middle" style={{ fontSize: 12, fill: '#0284c7', fontWeight: 700 }}>
        t_W
      </text>
      <text x={x1 + barW / 2} y={h + 16} textAnchor="middle" style={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 600 }}>
        Water
      </text>

      {/* Test liquid bar */}
      <rect x={x2} y={h - h2} width={barW} height={h2} rx={6} fill="url(#barLiquid)" opacity={0.85} />
      <text x={x2 + barW / 2} y={h - h2 - 8} textAnchor="middle" style={{ fontSize: 12, fill: '#d97706', fontWeight: 700 }}>
        t_A
      </text>
      <text x={x2 + barW / 2} y={h + 16} textAnchor="middle" style={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 600 }}>
        Test Liquid
      </text>
    </>
  );
};

const DoTitrationCurve: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  // Linear decrease to endpoint, then flat
  const eqFrac = 0.6;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const frac = i / 100;
    const x = frac * w;
    let val: number;
    if (frac <= eqFrac) {
      val = 0.9 - (frac / eqFrac) * 0.8;
    } else {
      val = 0.1;
    }
    const y = h - val * h;
    pts.push([x, y]);
  }
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');

  const eqX = eqFrac * w;
  const eqY = h - 0.1 * h;

  return (
    <>
      <defs>
        <linearGradient id="doGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#doGrad)" />
      <path d={path} fill="none" stroke="#0284c7" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={eqX} y1={0} x2={eqX} y2={h} stroke="#ef4444" strokeDasharray="5 3" strokeWidth={1} />
      <circle cx={eqX} cy={eqY} r={5} fill="#ef4444" />
      <text x={eqX + 8} y={eqY - 8} style={{ fontSize: 10, fill: '#ef4444', fontWeight: 700 }}>
        End Point (Blue → Colorless)
      </text>
    </>
  );
};

const AcidityTitrationCurve: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  // Two-stage: pH rises from ~3 to ~4.5 (MO endpoint), then to ~8.3 (PP endpoint)
  const pts: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const frac = i / 100;
    const x = frac * w;
    let pH: number;
    if (frac <= 0.35) {
      pH = 3 + (frac / 0.35) * 1.5;
    } else if (frac <= 0.7) {
      pH = 4.5 + ((frac - 0.35) / 0.35) * 3.8;
    } else {
      pH = 8.3 + ((frac - 0.7) / 0.3) * 2;
    }
    const y = h - ((pH - 2) / 10) * h;
    pts.push([x, y]);
  }
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');

  const mo_x = 0.35 * w;
  const mo_y = h - ((4.5 - 2) / 10) * h;
  const pp_x = 0.7 * w;
  const pp_y = h - ((8.3 - 2) / 10) * h;

  return (
    <>
      <defs>
        <linearGradient id="acidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#acidGrad)" />
      <path d={path} fill="none" stroke="#f97316" strokeWidth={2.5} strokeLinecap="round" />
      {/* MO endpoint */}
      <line x1={mo_x} y1={0} x2={mo_x} y2={h} stroke="#ef4444" strokeDasharray="5 3" strokeWidth={1} />
      <circle cx={mo_x} cy={mo_y} r={4} fill="#ef4444" />
      <text x={mo_x + 6} y={mo_y - 8} style={{ fontSize: 9, fill: '#ef4444', fontWeight: 700 }}>
        MO (pH 4.5)
      </text>
      {/* PP endpoint */}
      <line x1={pp_x} y1={0} x2={pp_x} y2={h} stroke="#a855f7" strokeDasharray="5 3" strokeWidth={1} />
      <circle cx={pp_x} cy={pp_y} r={4} fill="#a855f7" />
      <text x={pp_x + 6} y={pp_y - 8} style={{ fontSize: 9, fill: '#a855f7', fontWeight: 700 }}>
        PP (pH 8.3)
      </text>
    </>
  );
};

const AlkalinityTitrationCurve: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  // pH drops from ~11 → 8.3 (PP endpoint) → 4.5 (MO endpoint)
  const pts: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const frac = i / 100;
    const x = frac * w;
    let pH: number;
    if (frac <= 0.35) {
      pH = 11 - (frac / 0.35) * 2.7;
    } else if (frac <= 0.7) {
      pH = 8.3 - ((frac - 0.35) / 0.35) * 3.8;
    } else {
      pH = 4.5 - ((frac - 0.7) / 0.3) * 1.5;
    }
    const y = h - ((pH - 2) / 10) * h;
    pts.push([x, y]);
  }
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');

  const pp_x = 0.35 * w;
  const pp_y = h - ((8.3 - 2) / 10) * h;
  const mo_x = 0.7 * w;
  const mo_y = h - ((4.5 - 2) / 10) * h;

  return (
    <>
      <defs>
        <linearGradient id="alkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#alkGrad)" />
      <path d={path} fill="none" stroke="#8b5cf6" strokeWidth={2.5} strokeLinecap="round" />
      {/* PP endpoint */}
      <line x1={pp_x} y1={0} x2={pp_x} y2={h} stroke="#a855f7" strokeDasharray="5 3" strokeWidth={1} />
      <circle cx={pp_x} cy={pp_y} r={4} fill="#a855f7" />
      <text x={pp_x + 6} y={pp_y - 8} style={{ fontSize: 9, fill: '#a855f7', fontWeight: 700 }}>
        PP (pH 8.3)
      </text>
      {/* MO endpoint */}
      <line x1={mo_x} y1={0} x2={mo_x} y2={h} stroke="#ef4444" strokeDasharray="5 3" strokeWidth={1} />
      <circle cx={mo_x} cy={mo_y} r={4} fill="#ef4444" />
      <text x={mo_x + 6} y={mo_y - 8} style={{ fontSize: 9, fill: '#ef4444', fontWeight: 700 }}>
        MO (pH 4.5)
      </text>
    </>
  );
};
