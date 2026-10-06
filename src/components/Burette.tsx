import React from 'react';
import { BURETTE_MAX_ML } from '../engine/chemistryRules';

interface BuretteProps {
  volumeAdded: number;
  isMounted: boolean;
  isFilled: boolean;
  stopcockOpen: number;
  x?: number;
  topY?: number;
  height?: number;
  width?: number;
}

const Burette: React.FC<BuretteProps> = ({
  volumeAdded,
  isMounted,
  isFilled,
  stopcockOpen,
  x = 360,
  topY = 30,
  height = 180,
  width = 16,
}) => {
  if (!isMounted) return null;

  // Burette visual parameters
  const buretteTop = topY;
  const buretteHeight = height; // 0 to 50 mL graduated section
  const buretteBottom = buretteTop + buretteHeight; // y = 210
  const buretteWidth = width;
  const buretteX = x;

  // Liquid level calculation
  const liquidFraction = isFilled ? Math.max(0, 1 - volumeAdded / BURETTE_MAX_ML) : 0;
  const liquidTop = buretteBottom - buretteHeight * liquidFraction;

  // Graduation marks every 5 mL and 1 mL
  const graduations = [];
  for (let ml = 0; ml <= BURETTE_MAX_ML; ml += 5) {
    const y = buretteTop + (ml / BURETTE_MAX_ML) * buretteHeight;
    const isLarge = ml % 10 === 0;
    graduations.push(
      <g key={ml}>
        <line
          x1={buretteX - buretteWidth / 2 - (isLarge ? 6 : 3.5)}
          y1={y}
          x2={buretteX - buretteWidth / 2}
          y2={y}
          stroke="#475569"
          strokeWidth={isLarge ? 0.9 : 0.5}
        />
        {isLarge && (
          <text
            x={buretteX - buretteWidth / 2 - 8}
            y={y + 2}
            textAnchor="end"
            fill="#334155"
            fontSize="5.5"
            fontFamily="var(--font-mono)"
            fontWeight={600}
          >
            {ml}
          </text>
        )}
      </g>
    );
  }

  for (let ml = 0; ml <= BURETTE_MAX_ML; ml += 1) {
    if (ml % 5 !== 0) {
      const y = buretteTop + (ml / BURETTE_MAX_ML) * buretteHeight;
      graduations.push(
        <line
          key={`s-${ml}`}
          x1={buretteX - buretteWidth / 2 - 2}
          y1={y}
          x2={buretteX - buretteWidth / 2}
          y2={y}
          stroke="#64748b"
          strokeWidth={0.35}
        />
      );
    }
  }

  return (
    <g id="burette-assembly">
      {/* Upper Glass Funnel Rim */}
      <ellipse
        cx={buretteX}
        cy={buretteTop}
        rx={buretteWidth / 2}
        ry={1.8}
        fill="#ffffff"
        stroke="#94a3b8"
        strokeWidth={0.9}
      />

      {/* Main Glass Barrel Cylinder */}
      <rect
        x={buretteX - buretteWidth / 2}
        y={buretteTop}
        width={buretteWidth}
        height={buretteHeight}
        fill="rgba(241, 245, 249, 0.25)"
        stroke="#94a3b8"
        strokeWidth={0.9}
      />

      {/* Glass Tapered Lower Neck (transition from barrel to stopcock) */}
      <polygon
        points={`${buretteX - buretteWidth / 2},${buretteBottom} ${buretteX + buretteWidth / 2},${buretteBottom} ${buretteX + 4},${buretteBottom + 10} ${buretteX - 4},${buretteBottom + 10}`}
        fill="rgba(241, 245, 249, 0.3)"
        stroke="#94a3b8"
        strokeWidth={0.9}
      />

      {/* Lower Head: Stopcock Valve Barrel Housing (y: 220..228) */}
      <rect
        x={buretteX - 5}
        y={buretteBottom + 10}
        width={10}
        height={8}
        rx={1.5}
        fill="#cbd5e1"
        stroke="#64748b"
        strokeWidth={0.8}
      />

      {/* Lower Head: Tapered Glass Jet Tip / Delivery Nozzle (y: 228..246) */}
      <polygon
        points={`${buretteX - 3},${buretteBottom + 18} ${buretteX + 3},${buretteBottom + 18} ${buretteX + 0.8},${buretteBottom + 36} ${buretteX - 0.8},${buretteBottom + 36}`}
        fill="rgba(241, 245, 249, 0.35)"
        stroke="#94a3b8"
        strokeWidth={0.7}
      />

      {/* Glass Sheen Highlights */}
      <line
        x1={buretteX - buretteWidth / 2 + 1.5}
        y1={buretteTop}
        x2={buretteX - buretteWidth / 2 + 1.5}
        y2={buretteBottom + 10}
        stroke="#ffffff"
        strokeWidth={1.2}
        opacity={0.8}
      />

      {/* Liquid Column in Burette */}
      {isFilled && liquidFraction > 0 && (
        <g id="burette-liquid">
          {/* Main Liquid Body in Cylinder */}
          <rect
            x={buretteX - buretteWidth / 2 + 0.6}
            y={liquidTop}
            width={buretteWidth - 1.2}
            height={buretteBottom - liquidTop}
            fill="rgba(37, 99, 235, 0.35)"
            style={{ transition: 'y 0.1s linear, height 0.1s linear' }}
          />

          {/* Liquid filling Lower Tapered Neck & Jet Tip */}
          <polygon
            points={`${buretteX - buretteWidth / 2 + 0.6},${buretteBottom} ${buretteX + buretteWidth / 2 - 0.6},${buretteBottom} ${buretteX + 3.5},${buretteBottom + 10} ${buretteX - 3.5},${buretteBottom + 10}`}
            fill="rgba(37, 99, 235, 0.35)"
          />
          <rect
            x={buretteX - 4}
            y={buretteBottom + 10}
            width={8}
            height={8}
            fill="rgba(37, 99, 235, 0.35)"
          />
          <polygon
            points={`${buretteX - 2.5},${buretteBottom + 18} ${buretteX + 2.5},${buretteBottom + 18} ${buretteX + 0.7},${buretteBottom + 36} ${buretteX - 0.7},${buretteBottom + 36}`}
            fill="rgba(37, 99, 235, 0.35)"
          />

          {/* Fluid Dynamics: Realistic Concave Liquid Meniscus Curve */}
          <path
            d={`M ${buretteX - buretteWidth / 2 + 0.6} ${liquidTop} Q ${buretteX} ${liquidTop + 2.5} ${buretteX + buretteWidth / 2 - 0.6} ${liquidTop}`}
            fill="none"
            stroke="rgba(29, 78, 216, 0.6)"
            strokeWidth={1}
            style={{ transition: 'd 0.1s linear' }}
          />
        </g>
      )}

      {/* Volumetric Scale Graduations */}
      {graduations}

      {/* Fluid Dynamics: Dynamic Flow Stream / Droplets from Jet Tip (y = 246 down to 264) */}
      {isFilled && stopcockOpen > 0 && (
        <g id="fluid-dynamics-stream">
          {/* Continuous Fluid Jet Stream (High flow rate > 65%) */}
          {stopcockOpen >= 0.65 ? (
            <g>
              <line
                x1={buretteX}
                y1={buretteBottom + 36}
                x2={buretteX}
                y2={buretteBottom + 56}
                stroke="rgba(37, 99, 235, 0.75)"
                strokeWidth={1.5 + stopcockOpen * 0.6}
                strokeLinecap="round"
              />
              <path
                d={`M ${buretteX - 0.8} ${buretteBottom + 38} Q ${buretteX + 0.8} ${buretteBottom + 46} ${buretteX} ${buretteBottom + 55}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth={0.5}
                opacity={0.6}
              />
            </g>
          ) : stopcockOpen >= 0.3 ? (
            /* Fast Dripping Stream (Medium flow rate 30%–65%) */
            <g>
              <circle cx={buretteX} cy={buretteBottom + 38} r={1.6} fill="rgba(37, 99, 235, 0.8)">
                <animate attributeName="cy" values={`${buretteBottom + 38};${buretteBottom + 56}`} dur="0.22s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4" dur="0.22s" repeatCount="indefinite" />
              </circle>
              <circle cx={buretteX} cy={buretteBottom + 38} r={1.3} fill="rgba(37, 99, 235, 0.7)">
                <animate attributeName="cy" values={`${buretteBottom + 38};${buretteBottom + 56}`} dur="0.22s" begin="0.11s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4" dur="0.22s" begin="0.11s" repeatCount="indefinite" />
              </circle>
            </g>
          ) : (
            /* Discrete Single Drops (Low flow rate < 30%) */
            <circle cx={buretteX} cy={buretteBottom + 38} r={1.4} fill="rgba(37, 99, 235, 0.85)">
              <animate attributeName="cy" values={`${buretteBottom + 38};${buretteBottom + 56}`} dur="0.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.2" dur="0.4s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      )}

      {/* Burette Reading Readout Tag */}
      {isFilled && (
        <g transform={`translate(${buretteX + buretteWidth / 2 + 8}, ${Math.min(Math.max(liquidTop, buretteTop + 8), buretteBottom - 8)})`}>
          <rect
            x={0}
            y={-8}
            width={44}
            height={15}
            rx={3}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={0.7}
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
          />
          <text
            x={22}
            y={2.5}
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="7"
            fontFamily="var(--font-mono)"
            fontWeight={700}
          >
            {volumeAdded.toFixed(1)} mL
          </text>
        </g>
      )}
    </g>
  );
};

export default Burette;
