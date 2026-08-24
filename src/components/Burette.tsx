import React from 'react';
import { BURETTE_MAX_ML } from '../engine/chemistryRules';

interface BuretteProps {
  volumeAdded: number;
  isMounted: boolean;
  isFilled: boolean;
  stopcockOpen: number;
}

const Burette: React.FC<BuretteProps> = ({ volumeAdded, isMounted, isFilled, stopcockOpen }) => {
  if (!isMounted) return null;

  // Burette visual parameters
  const buretteTop = 25;
  const buretteHeight = 240; // 0 to 50 mL graduated section
  const buretteBottom = buretteTop + buretteHeight; // y = 265
  const buretteWidth = 20;
  const buretteX = 140;

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
          x1={buretteX - buretteWidth / 2 - (isLarge ? 7 : 4)}
          y1={y}
          x2={buretteX - buretteWidth / 2}
          y2={y}
          stroke="#475569"
          strokeWidth={isLarge ? 1 : 0.6}
        />
        {isLarge && (
          <text
            x={buretteX - buretteWidth / 2 - 9}
            y={y + 2.5}
            textAnchor="end"
            fill="#334155"
            fontSize="6.5"
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
          x1={buretteX - buretteWidth / 2 - 2.5}
          y1={y}
          x2={buretteX - buretteWidth / 2}
          y2={y}
          stroke="#64748b"
          strokeWidth={0.4}
        />
      );
    }
  }

  return (
    <g id="burette-assembly">
      {/* Upper Glass Rim */}
      <ellipse
        cx={buretteX}
        cy={buretteTop}
        rx={buretteWidth / 2}
        ry={2}
        fill="#ffffff"
        stroke="#94a3b8"
        strokeWidth={1}
      />

      {/* Main Glass Barrel Cylinder */}
      <rect
        x={buretteX - buretteWidth / 2}
        y={buretteTop}
        width={buretteWidth}
        height={buretteHeight}
        fill="rgba(241, 245, 249, 0.25)"
        stroke="#94a3b8"
        strokeWidth={1}
      />

      {/* Glass Tapered Lower Neck (transition from barrel to stopcock) */}
      <polygon
        points={`${buretteX - buretteWidth / 2},${buretteBottom} ${buretteX + buretteWidth / 2},${buretteBottom} ${buretteX + 5},${buretteBottom + 15} ${buretteX - 5},${buretteBottom + 15}`}
        fill="rgba(241, 245, 249, 0.3)"
        stroke="#94a3b8"
        strokeWidth={1}
      />

      {/* Lower Head: Stopcock Valve Barrel Housing (y: 280..290) */}
      <rect
        x={buretteX - 6}
        y={buretteBottom + 15}
        width={12}
        height={10}
        rx={2}
        fill="#cbd5e1"
        stroke="#64748b"
        strokeWidth={1}
      />

      {/* Lower Head: Tapered Glass Jet Tip / Delivery Nozzle (y: 290..308) */}
      <polygon
        points={`${buretteX - 4},${buretteBottom + 25} ${buretteX + 4},${buretteBottom + 25} ${buretteX + 1.2},${buretteBottom + 42} ${buretteX - 1.2},${buretteBottom + 42}`}
        fill="rgba(241, 245, 249, 0.35)"
        stroke="#94a3b8"
        strokeWidth={0.8}
      />

      {/* Glass Sheen Highlights */}
      <line
        x1={buretteX - buretteWidth / 2 + 2}
        y1={buretteTop}
        x2={buretteX - buretteWidth / 2 + 2}
        y2={buretteBottom + 14}
        stroke="#ffffff"
        strokeWidth={1.5}
        opacity={0.8}
      />

      {/* Liquid Column in Burette */}
      {isFilled && liquidFraction > 0 && (
        <g id="burette-liquid">
          {/* Main Liquid Body in Cylinder */}
          <rect
            x={buretteX - buretteWidth / 2 + 0.8}
            y={liquidTop}
            width={buretteWidth - 1.6}
            height={buretteBottom - liquidTop}
            fill="rgba(37, 99, 235, 0.35)"
            style={{ transition: 'y 0.1s linear, height 0.1s linear' }}
          />

          {/* Liquid filling Lower Tapered Neck & Jet Tip */}
          <polygon
            points={`${buretteX - buretteWidth / 2 + 0.8},${buretteBottom} ${buretteX + buretteWidth / 2 - 0.8},${buretteBottom} ${buretteX + 4.5},${buretteBottom + 15} ${buretteX - 4.5},${buretteBottom + 15}`}
            fill="rgba(37, 99, 235, 0.35)"
          />
          <rect
            x={buretteX - 5}
            y={buretteBottom + 15}
            width={10}
            height={10}
            fill="rgba(37, 99, 235, 0.35)"
          />
          <polygon
            points={`${buretteX - 3.5},${buretteBottom + 25} ${buretteX + 3.5},${buretteBottom + 25} ${buretteX + 1},${buretteBottom + 42} ${buretteX - 1},${buretteBottom + 42}`}
            fill="rgba(37, 99, 235, 0.35)"
          />

          {/* Fluid Dynamics: Realistic Concave Liquid Meniscus Curve */}
          <path
            d={`M ${buretteX - buretteWidth / 2 + 0.8} ${liquidTop} Q ${buretteX} ${liquidTop + 3} ${buretteX + buretteWidth / 2 - 0.8} ${liquidTop}`}
            fill="none"
            stroke="rgba(29, 78, 216, 0.6)"
            strokeWidth={1.2}
            style={{ transition: 'd 0.1s linear' }}
          />
        </g>
      )}

      {/* Volumetric Scale Graduations */}
      {graduations}

      {/* Fluid Dynamics: Dynamic Flow Stream / Droplets from Jet Tip (y = 307 down to 330) */}
      {isFilled && stopcockOpen > 0 && (
        <g id="fluid-dynamics-stream">
          {/* Continuous Fluid Jet Stream (High flow rate > 65%) */}
          {stopcockOpen >= 0.65 ? (
            <g>
              <line
                x1={buretteX}
                y1={buretteBottom + 42}
                x2={buretteX}
                y2={buretteBottom + 70}
                stroke="rgba(37, 99, 235, 0.75)"
                strokeWidth={1.8 + stopcockOpen * 0.8}
                strokeLinecap="round"
              />
              <path
                d={`M ${buretteX - 1} ${buretteBottom + 45} Q ${buretteX + 1} ${buretteBottom + 55} ${buretteX} ${buretteBottom + 68}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth={0.6}
                opacity={0.6}
              />
            </g>
          ) : stopcockOpen >= 0.3 ? (
            /* Fast Dripping Stream (Medium flow rate 30%–65%) */
            <g>
              <circle cx={buretteX} cy={buretteBottom + 45} r={2} fill="rgba(37, 99, 235, 0.8)">
                <animate attributeName="cy" values={`${buretteBottom + 45};${buretteBottom + 70}`} dur="0.25s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4" dur="0.25s" repeatCount="indefinite" />
              </circle>
              <circle cx={buretteX} cy={buretteBottom + 45} r={1.6} fill="rgba(37, 99, 235, 0.7)">
                <animate attributeName="cy" values={`${buretteBottom + 45};${buretteBottom + 70}`} dur="0.25s" begin="0.12s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4" dur="0.25s" begin="0.12s" repeatCount="indefinite" />
              </circle>
            </g>
          ) : (
            /* Discrete Single Drops (Low flow rate < 30%) */
            <circle cx={buretteX} cy={buretteBottom + 45} r={1.6} fill="rgba(37, 99, 235, 0.85)">
              <animate attributeName="cy" values={`${buretteBottom + 45};${buretteBottom + 70}`} dur="0.45s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.2" dur="0.45s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      )}

      {/* Burette Volume Label Readout */}
      {isFilled && (
        <g transform={`translate(${buretteX + buretteWidth / 2 + 10}, ${Math.min(Math.max(liquidTop, buretteTop + 10), buretteBottom - 10)})`}>
          <rect
            x={0}
            y={-10}
            width={52}
            height={18}
            rx={4}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={0.8}
          />
          <text
            x={26}
            y={2}
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="9"
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
