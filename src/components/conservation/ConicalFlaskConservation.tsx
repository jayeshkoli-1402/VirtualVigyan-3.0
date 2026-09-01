import React, { useState } from 'react';

interface ConicalFlaskConservationProps {
  liquidColor: string;
  na2so4Poured: boolean;
  tubeSuspended: boolean;
  tubeFilled: boolean;
  flaskSealed: boolean;
  precipitateFormed: boolean;
  isMixing: boolean;
  onBalance?: boolean;
  customX?: number;
  onPlaceOnBalance?: () => void;
  onMoveToBench?: () => void;
}

const ConicalFlaskConservation: React.FC<ConicalFlaskConservationProps> = ({
  liquidColor,
  na2so4Poured,
  tubeSuspended,
  tubeFilled,
  flaskSealed,
  precipitateFormed,
  isMixing,
  onBalance = false,
  customX,
  onPlaceOnBalance,
  onMoveToBench,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Center coordinates:
  // When on wooden bench: Table surface is at y = 390. Base bottom is at y = 390.
  // When on balance: Weighing pan surface is at y = 332. Base bottom is at y = 332.
  const flaskCenterX = customX !== undefined ? customX : onBalance ? 220 : 90;
  const isCurrentlyOverBalance = flaskCenterX >= 155;
  const effectiveOnBalance = onBalance || isCurrentlyOverBalance;

  const flaskBodyBottom = effectiveOnBalance ? 326 : 384;
  const flaskBodyTop = effectiveOnBalance ? 271 : 329;
  const flaskNeckHeight = 28;
  const flaskNeckTop = effectiveOnBalance ? 243 : 301;
  const flaskNeckWidth = 18;
  const flaskBodyWidth = 84;

  // Liquid level
  const liquidTop = flaskBodyBottom - (precipitateFormed ? 26 : 20);
  const liquidRadiusX = getWidthAtY(liquidTop, flaskNeckWidth, flaskBodyWidth, flaskBodyTop, flaskBodyBottom) / 2 - 1;

  // Tooltip content on hover
  const tooltipText = effectiveOnBalance
    ? 'On Scale (Double-click to return to table)'
    : precipitateFormed
      ? 'BaSO₄(s) + 2NaCl(aq) [Double-click to weigh]'
      : flaskSealed
        ? 'Sealed Conical Flask (Double-click to weigh on scale)'
        : tubeSuspended
          ? 'Flask with BaCl₂ Tube (Double-click to weigh)'
          : na2so4Poured
            ? '10 mL Na₂SO₄ in Flask (Double-click to weigh)'
            : 'Conical Flask (Double-click to weigh)';

  return (
    <g
      id="conservation-flask-interactive"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (!effectiveOnBalance && onPlaceOnBalance) onPlaceOnBalance();
        else if (effectiveOnBalance && onMoveToBench) onMoveToBench();
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!effectiveOnBalance && onPlaceOnBalance) onPlaceOnBalance();
        else if (effectiveOnBalance && onMoveToBench) onMoveToBench();
      }}
      style={{
        cursor: 'pointer',
        touchAction: 'none',
      }}
    >
      <defs>
        {/* Rubber Cork Gradient */}
        <linearGradient id="rubberCorkGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="35%" stopColor="#92400e" />
          <stop offset="70%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        {/* Realistic Aqueous Solution Fluid Gradient */}
        <linearGradient id="clearAqueousGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(224, 242, 254, 0.45)" />
          <stop offset="70%" stopColor="rgba(186, 230, 253, 0.55)" />
          <stop offset="100%" stopColor="rgba(125, 211, 252, 0.65)" />
        </linearGradient>

        {/* Dense BaSO4 Milky Curd Precipitate Fluid Gradient */}
        <linearGradient id="precipitateFluidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(241, 245, 249, 0.75)" />
          <stop offset="40%" stopColor="rgba(255, 255, 255, 0.92)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.98)" />
        </linearGradient>

        {/* Flask clip path for liquids & suspended apparatus */}
        <clipPath id={`flask-cons-clip-dynamic`}>
          <path
            d={`M ${flaskCenterX - flaskNeckWidth / 2} ${flaskBodyTop}
                L ${flaskCenterX - flaskBodyWidth / 2} ${flaskBodyBottom}
                Q ${flaskCenterX - flaskBodyWidth / 2} ${flaskBodyBottom + 6} ${flaskCenterX - flaskBodyWidth / 2 + 6} ${flaskBodyBottom + 6}
                L ${flaskCenterX + flaskBodyWidth / 2 - 6} ${flaskBodyBottom + 6}
                Q ${flaskCenterX + flaskBodyWidth / 2} ${flaskBodyBottom + 6} ${flaskCenterX + flaskBodyWidth / 2} ${flaskBodyBottom}
                L ${flaskCenterX + flaskNeckWidth / 2} ${flaskBodyTop}
                Z`}
          />
        </clipPath>
      </defs>

      {/* Rotation wrapper during mixing */}
      <g
        style={{
          transformOrigin: `${flaskCenterX}px ${flaskBodyBottom - 20}px`,
          animation: isMixing ? 'flask-mix-invert 2s ease-in-out infinite' : 'none',
        }}
      >
        {/* Hover Highlight Glow */}
        {isHovered && (
          <path
            d={`M ${flaskCenterX - flaskNeckWidth / 2 - 2} ${flaskBodyTop}
                L ${flaskCenterX - flaskBodyWidth / 2 - 3} ${flaskBodyBottom}
                Q ${flaskCenterX - flaskBodyWidth / 2 - 3} ${flaskBodyBottom + 8} ${flaskCenterX - flaskBodyWidth / 2 + 6} ${flaskBodyBottom + 8}
                L ${flaskCenterX + flaskBodyWidth / 2 - 6} ${flaskBodyBottom + 8}
                Q ${flaskCenterX + flaskBodyWidth / 2 + 3} ${flaskBodyBottom + 8} ${flaskCenterX + flaskBodyWidth / 2 + 3} ${flaskBodyBottom}
                L ${flaskCenterX + flaskNeckWidth / 2 + 2} ${flaskBodyTop}
                Z`}
            fill="none"
            stroke="#059669"
            strokeWidth={2}
            opacity={0.65}
          />
        )}

        {/* Flask Neck Rim (flanged lip) */}
        <ellipse
          cx={flaskCenterX}
          cy={flaskNeckTop}
          rx={flaskNeckWidth / 2 + 2}
          ry={2.5}
          fill="rgba(241, 245, 249, 0.3)"
          stroke="#94a3b8"
          strokeWidth={1}
        />

        {/* Flask Neck */}
        <rect
          x={flaskCenterX - flaskNeckWidth / 2}
          y={flaskNeckTop}
          width={flaskNeckWidth}
          height={flaskNeckHeight}
          fill="rgba(241, 245, 249, 0.2)"
          stroke="#94a3b8"
          strokeWidth={1}
        />

        {/* Flask Neck Sheen */}
        <rect
          x={flaskCenterX - flaskNeckWidth / 2 + 2}
          y={flaskNeckTop}
          width={2.5}
          height={flaskNeckHeight}
          fill="#ffffff"
          opacity={0.75}
        />

        {/* Flask Main Body (Erlenmeyer conical geometry resting on surface) */}
        <path
          d={`M ${flaskCenterX - flaskNeckWidth / 2} ${flaskBodyTop}
              L ${flaskCenterX - flaskBodyWidth / 2} ${flaskBodyBottom}
              Q ${flaskCenterX - flaskBodyWidth / 2} ${flaskBodyBottom + 6} ${flaskCenterX - flaskBodyWidth / 2 + 6} ${flaskBodyBottom + 6}
              L ${flaskCenterX + flaskBodyWidth / 2 - 6} ${flaskBodyBottom + 6}
              Q ${flaskCenterX + flaskBodyWidth / 2} ${flaskBodyBottom + 6} ${flaskCenterX + flaskBodyWidth / 2} ${flaskBodyBottom}
              L ${flaskCenterX + flaskNeckWidth / 2} ${flaskBodyTop}
              Z`}
          fill="rgba(241, 245, 249, 0.15)"
          stroke="#94a3b8"
          strokeWidth={1}
        />

        {/* Glass Reflection Highlight streaks */}
        <path
          d={`M ${flaskCenterX - flaskNeckWidth / 2 + 2} ${flaskBodyTop}
              L ${flaskCenterX - flaskBodyWidth / 2 + 7} ${flaskBodyBottom}
              L ${flaskCenterX - flaskBodyWidth / 2 + 12} ${flaskBodyBottom}
              L ${flaskCenterX - flaskNeckWidth / 2 + 4} ${flaskBodyTop}
              Z`}
          fill="#ffffff"
          opacity={0.4}
        />

        {/* Flask Volume Graduations */}
        <g stroke="#94a3b8" strokeWidth={0.6} opacity={0.75}>
          <line x1={flaskCenterX - 22} y1={flaskBodyBottom - 10} x2={flaskCenterX - 14} y2={flaskBodyBottom - 10} />
          <text x={flaskCenterX - 24} y={flaskBodyBottom - 8.5} fill="#64748b" fontSize="4.5" textAnchor="end" fontFamily="var(--font-mono)">25ml</text>

          <line x1={flaskCenterX - 19} y1={flaskBodyBottom - 22} x2={flaskCenterX - 12} y2={flaskBodyBottom - 22} />
          <text x={flaskCenterX - 21} y={flaskBodyBottom - 20.5} fill="#64748b" fontSize="4.5" textAnchor="end" fontFamily="var(--font-mono)">50ml</text>

          <line x1={flaskCenterX - 16} y1={flaskBodyBottom - 34} x2={flaskCenterX - 10} y2={flaskBodyBottom - 34} />
          <text x={flaskCenterX - 18} y={flaskBodyBottom - 32.5} fill="#64748b" fontSize="4.5" textAnchor="end" fontFamily="var(--font-mono)">75ml</text>
        </g>

        {/* ── Realistic Fluid Dynamics inside Erlenmeyer Flask ── */}
        {na2so4Poured && (
          <g clipPath={`url(#flask-cons-clip-dynamic)`} id="flask-liquid-contents">
            {/* Main Fluid Bulk */}
            <rect
              x={flaskCenterX - flaskBodyWidth / 2}
              y={liquidTop}
              width={flaskBodyWidth}
              height={flaskBodyBottom + 8 - liquidTop}
              fill={precipitateFormed ? 'url(#precipitateFluidGrad)' : isMixing ? 'rgba(235, 240, 245, 0.88)' : (liquidColor || 'url(#clearAqueousGrad)')}
              style={{ transition: 'fill 0.4s ease, height 0.4s ease' }}
            />

            {/* Fluid Refraction Bottom Depth Shadow */}
            <path
              d={`M ${flaskCenterX - flaskBodyWidth / 2} ${flaskBodyBottom + 2}
                  L ${flaskCenterX + flaskBodyWidth / 2} ${flaskBodyBottom + 2}
                  L ${flaskCenterX + flaskBodyWidth / 2} ${flaskBodyBottom + 7}
                  L ${flaskCenterX - flaskBodyWidth / 2} ${flaskBodyBottom + 7} Z`}
              fill={precipitateFormed ? '#e2e8f0' : 'rgba(14, 165, 233, 0.3)'}
            />

            {/* Precipitate turbidity & active swirling particles if reaction completed / mixing */}
            {(precipitateFormed || isMixing) && (
              <g>
                {/* Dense BaSO4 crystalline precipitate bed at bottom */}
                <path
                  d={`M ${flaskCenterX - flaskBodyWidth / 2} ${flaskBodyBottom - 7}
                      Q ${flaskCenterX - 15} ${flaskBodyBottom - 9} ${flaskCenterX} ${flaskBodyBottom - 7}
                      Q ${flaskCenterX + 20} ${flaskBodyBottom - 10} ${flaskCenterX + flaskBodyWidth / 2} ${flaskBodyBottom - 7}
                      L ${flaskCenterX + flaskBodyWidth / 2} ${flaskBodyBottom + 7}
                      L ${flaskCenterX - flaskBodyWidth / 2} ${flaskBodyBottom + 7} Z`}
                  fill="#ffffff"
                  stroke="rgba(203, 213, 225, 0.6)"
                  strokeWidth={0.5}
                />

                {/* Floating white BaSO4 colloidal flocculants & micro-crystals */}
                {[
                  { cx: flaskCenterX - 24, cy: flaskBodyBottom - 12, r: 2.4, dur: 2.1 },
                  { cx: flaskCenterX - 14, cy: flaskBodyBottom - 18, r: 2.0, dur: 2.7 },
                  { cx: flaskCenterX - 5, cy: flaskBodyBottom - 14, r: 1.8, dur: 2.4 },
                  { cx: flaskCenterX + 6, cy: flaskBodyBottom - 11, r: 2.6, dur: 2.2 },
                  { cx: flaskCenterX + 16, cy: flaskBodyBottom - 16, r: 1.9, dur: 2.8 },
                  { cx: flaskCenterX + 25, cy: flaskBodyBottom - 8, r: 2.2, dur: 2.0 },
                  { cx: flaskCenterX - 18, cy: flaskBodyBottom - 23, r: 1.5, dur: 3.1 },
                  { cx: flaskCenterX + 10, cy: flaskBodyBottom - 21, r: 1.7, dur: 2.9 },
                  { cx: flaskCenterX, cy: flaskBodyBottom - 25, r: 1.4, dur: 3.3 },
                ].map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.cx}
                    cy={p.cy}
                    r={p.r}
                    fill="#ffffff"
                    opacity={0.92}
                    stroke="rgba(226, 232, 240, 0.9)"
                    strokeWidth={0.4}
                  >
                    <animate
                      attributeName="cy"
                      values={`${p.cy - 1.5};${p.cy + 1.5};${p.cy - 1.5}`}
                      dur={`${p.dur}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}

                {/* Faint effervescent micro-bubbles rising during reaction */}
                {isMixing && (
                  <g>
                    {[flaskCenterX - 10, flaskCenterX, flaskCenterX + 12].map((bx, bidx) => (
                      <circle key={bidx} cx={bx} cy={flaskBodyBottom - 8} r={1.2} fill="#ffffff" opacity={0.8}>
                        <animate attributeName="cy" values={`${flaskBodyBottom - 5};${liquidTop}`} dur="0.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0" dur="0.8s" repeatCount="indefinite" />
                      </circle>
                    ))}
                  </g>
                )}
              </g>
            )}

            {/* Dynamic Surface Meniscus Wave Curve */}
            <path
              d={`M ${flaskCenterX - liquidRadiusX} ${liquidTop}
                  Q ${flaskCenterX - 8} ${liquidTop + (isMixing ? 4 : 2)} ${flaskCenterX} ${liquidTop + (isMixing ? 1 : 2)}
                  Q ${flaskCenterX + 8} ${liquidTop + (isMixing ? 0 : 2)} ${flaskCenterX + liquidRadiusX} ${liquidTop}`}
              fill="none"
              stroke={precipitateFormed ? '#ffffff' : 'rgba(148, 163, 184, 0.8)'}
              strokeWidth={1.2}
            />

            {/* Surface Glint */}
            <ellipse
              cx={flaskCenterX}
              cy={liquidTop + 1}
              rx={liquidRadiusX * 0.7}
              ry={1.2}
              fill="rgba(255, 255, 255, 0.45)"
            />
          </g>
        )}

        {/* ── Headspace Condensation Mist after reaction ── */}
        {precipitateFormed && (
          <g clipPath="url(#flask-cons-clip-dynamic)" opacity={0.35}>
            <ellipse cx={flaskCenterX - 8} cy={flaskBodyTop + 18} rx={6} ry={2} fill="#ffffff" />
            <ellipse cx={flaskCenterX + 10} cy={flaskBodyTop + 24} rx={8} ry={2.5} fill="#ffffff" />
            <ellipse cx={flaskCenterX - 4} cy={flaskBodyTop + 32} rx={5} ry={1.8} fill="#ffffff" />
          </g>
        )}

        {/* ── Suspended Ignition Tube strictly inside Flask ── */}
        {tubeSuspended && (
          <g clipPath="url(#flask-cons-clip-dynamic)" id="suspended-ignition-tube-group">
            {/* Cotton suspension thread tied from neck rim down to tube */}
            {!precipitateFormed ? (
              <g>
                <line
                  x1={flaskCenterX - 3}
                  y1={flaskNeckTop + 4}
                  x2={flaskCenterX - 4}
                  y2={flaskBodyTop + 10}
                  stroke="#b45309"
                  strokeWidth={0.8}
                  strokeDasharray="2,1"
                />
                <line
                  x1={flaskCenterX + 3}
                  y1={flaskNeckTop + 4}
                  x2={flaskCenterX + 2}
                  y2={flaskBodyTop + 10}
                  stroke="#b45309"
                  strokeWidth={0.8}
                  strokeDasharray="2,1"
                />
              </g>
            ) : (
              // After reaction/inversion: slack thread resting inside
              <path
                d={`M ${flaskCenterX - 2} ${flaskNeckTop + 4} Q ${flaskCenterX - 10} ${flaskBodyTop + 15} ${flaskCenterX - 14} ${flaskBodyBottom - 18}`}
                fill="none"
                stroke="#b45309"
                strokeWidth={0.7}
                strokeDasharray="2,1"
              />
            )}

            {/* 
              Ignition tube positioning:
              - Before mixing: Suspended upright at (flaskCenterX - 4, flaskBodyTop + 10)
              - After mixing / precipitate formed: Spilled & resting stably at bottom of flask inside liquid
            */}
            {!precipitateFormed ? (
              <g transform={`translate(${flaskCenterX - 4}, ${flaskBodyTop + 10}) rotate(10)`}>
                <ellipse cx={4} cy={0} rx={5} ry={1.6} fill="rgba(241, 245, 249, 0.5)" stroke="#94a3b8" strokeWidth={0.8} />
                <path
                  d="M 0 0 L 0 24 Q 0 30 4 30 Q 8 30 8 24 L 8 0 Z"
                  fill="rgba(241, 245, 249, 0.3)"
                  stroke="#64748b"
                  strokeWidth={0.9}
                />
                <line x1={1.5} y1={2} x2={1.5} y2={26} stroke="#ffffff" strokeWidth={1} opacity={0.8} />

                {tubeFilled && (
                  <g>
                    <path
                      d="M 1 8 L 1 23 Q 1 29 4 29 Q 7 29 7 23 L 7 8 Z"
                      fill="url(#clearAqueousGrad)"
                    />
                    <ellipse cx={4} cy={8} rx={3} ry={0.8} fill="none" stroke="rgba(148, 163, 184, 0.7)" strokeWidth={0.5} />
                  </g>
                )}
              </g>
            ) : (
              // After inversion: Resting securely horizontally in the bottom belly
              <g transform={`translate(${flaskCenterX - 18}, ${flaskBodyBottom - 12}) rotate(60)`}>
                <ellipse cx={4} cy={0} rx={4.5} ry={1.4} fill="rgba(241, 245, 249, 0.5)" stroke="#94a3b8" strokeWidth={0.8} />
                <path
                  d="M 0 0 L 0 22 Q 0 26 4 26 Q 8 26 8 22 L 8 0 Z"
                  fill="rgba(241, 245, 249, 0.3)"
                  stroke="#64748b"
                  strokeWidth={0.9}
                />
                <line x1={1.5} y1={2} x2={1.5} y2={22} stroke="#ffffff" strokeWidth={1} opacity={0.8} />
              </g>
            )}
          </g>
        )}

        {/* ── Rubber Stopper / Cork (Hermetic Seal) ── */}
        {flaskSealed && (
          <g id="rubber-cork-seal">
            <polygon
              points={`
                ${flaskCenterX - flaskNeckWidth / 2 - 3},${flaskNeckTop - 12}
                ${flaskCenterX + flaskNeckWidth / 2 + 3},${flaskNeckTop - 12}
                ${flaskCenterX + flaskNeckWidth / 2 - 1},${flaskNeckTop + 8}
                ${flaskCenterX - flaskNeckWidth / 2 + 1},${flaskNeckTop + 8}
              `}
              fill="url(#rubberCorkGrad2)"
              stroke="#451a03"
              strokeWidth={1}
            />

            <ellipse
              cx={flaskCenterX}
              cy={flaskNeckTop - 12}
              rx={flaskNeckWidth / 2 + 3.5}
              ry={3}
              fill="#92400e"
              stroke="#451a03"
              strokeWidth={0.8}
            />

            <line
              x1={flaskCenterX - flaskNeckWidth / 2}
              y1={flaskNeckTop - 6}
              x2={flaskCenterX + flaskNeckWidth / 2}
              y2={flaskNeckTop - 6}
              stroke="#451a03"
              strokeWidth={0.6}
              opacity={0.6}
            />
            <line
              x1={flaskCenterX - flaskNeckWidth / 2 + 1}
              y1={flaskNeckTop}
              x2={flaskCenterX + flaskNeckWidth / 2 - 1}
              y2={flaskNeckTop}
              stroke="#451a03"
              strokeWidth={0.6}
              opacity={0.6}
            />
          </g>
        )}
      </g>

      {/* ── Hover Tooltip Badge (ONLY shown on hover) ── */}
      {isHovered && (
        <g style={{ pointerEvents: 'none' }}>
          <rect
            x={Math.max(10, Math.min(130, flaskCenterX - 85))}
            y={Math.max(10, flaskNeckTop - 34)}
            width={170}
            height={20}
            rx={5}
            fill="#0f172a"
            opacity={0.92}
          />
          <text
            x={Math.max(10, Math.min(130, flaskCenterX - 85)) + 85}
            y={Math.max(10, flaskNeckTop - 34) + 13}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="5.2"
            fontFamily="var(--font-sans)"
            fontWeight={600}
          >
            {tooltipText}
          </text>
        </g>
      )}
    </g>
  );
};

function getWidthAtY(
  y: number,
  neckWidth: number,
  bodyWidth: number,
  bodyTop: number,
  bodyBottom: number
): number {
  if (y <= bodyTop) return neckWidth;
  if (y >= bodyBottom) return bodyWidth;
  const t = (y - bodyTop) / (bodyBottom - bodyTop);
  return neckWidth + t * (bodyWidth - neckWidth);
}

export default ConicalFlaskConservation;
