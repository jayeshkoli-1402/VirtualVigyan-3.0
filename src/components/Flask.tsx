import React from 'react';

interface FlaskProps {
  color: string;
  hasIndicator: boolean;
  isPlaced: boolean;
  acidMeasured: boolean;
  isReceivingDrop: boolean;
  volumeAdded?: number;
  isSwirling?: boolean;
}

const Flask: React.FC<FlaskProps> = ({ color, hasIndicator, isPlaced, acidMeasured, isReceivingDrop, volumeAdded = 0, isSwirling = false }) => {

  if (!isPlaced) return null;

  // Flask dimensions
  const flaskCenterX = 140;
  const flaskNeckTop = 300;
  const flaskNeckWidth = 18;
  const flaskBodyTop = 330;
  const flaskBodyBottom = 385;
  const flaskBodyWidth = 90;

  // Cumulative Liquid Level: Base acid 25 mL (~0.42) + titrant volume (0 to 50 mL -> +0.38)
  const titrantFraction = Math.min(1, Math.max(0, volumeAdded / 50));
  const effectiveLevel = acidMeasured ? 0.42 + titrantFraction * 0.38 : 0;
  const fillHeight = (flaskBodyBottom - flaskBodyTop) * effectiveLevel;
  const liquidTop = flaskBodyBottom - fillHeight;
  const liquidRadiusX = getWidthAtY(liquidTop, flaskNeckWidth, flaskBodyWidth, flaskBodyTop, flaskBodyBottom) / 2 - 1;

  return (
    <g id="flask-assembly" style={{ transformOrigin: '140px 385px', animation: isSwirling ? 'flaskShakeSwirl 0.75s ease-in-out infinite' : 'none' }}>
      {/* Flask Neck */}
      <rect
        x={flaskCenterX - flaskNeckWidth / 2}
        y={flaskNeckTop}
        width={flaskNeckWidth}
        height={flaskBodyTop - flaskNeckTop}
        fill="rgba(241, 245, 249, 0.2)"
        stroke="#94a3b8"
        strokeWidth={1}
      />

      {/* Flask Neck Sheen */}
      <rect
        x={flaskCenterX - flaskNeckWidth / 2 + 2}
        y={flaskNeckTop}
        width={2.5}
        height={flaskBodyTop - flaskNeckTop}
        fill="#ffffff"
        opacity={0.7}
      />

      {/* Flask Main Body (Erlenmeyer conical geometry) */}
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

      {/* Flask Glass Reflection Highlights */}
      <path
        d={`M ${flaskCenterX - flaskNeckWidth / 2 + 2} ${flaskBodyTop}
            L ${flaskCenterX - flaskBodyWidth / 2 + 8} ${flaskBodyBottom}
            L ${flaskCenterX - flaskBodyWidth / 2 + 13} ${flaskBodyBottom}
            L ${flaskCenterX - flaskNeckWidth / 2 + 5} ${flaskBodyTop}
            Z`}
        fill="#ffffff"
        opacity={0.4}
      />

      {/* Liquid Fill - Clipped to Erlenmeyer Shape */}
      <defs>
        <clipPath id="flask-clip">
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

      <g clipPath="url(#flask-clip)" id="flask-liquid-body">
        {/* Main Liquid Bulk */}
        <rect
          x={flaskCenterX - flaskBodyWidth / 2}
          y={liquidTop}
          width={flaskBodyWidth}
          height={flaskBodyBottom + 10 - liquidTop}
          fill={color}
          style={{
            transition: 'y 2.2s cubic-bezier(0.25, 1, 0.5, 1), height 2.2s cubic-bezier(0.25, 1, 0.5, 1), fill 2.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
            opacity: acidMeasured ? 1 : 0,
          }}
        />

        {/* Fluid Dynamics: Plume swirl center when titrant stream enters */}
        {isReceivingDrop && acidMeasured && (
          <g>
            <ellipse
              cx={flaskCenterX}
              cy={liquidTop + 12}
              rx={12}
              ry={7}
              fill={color}
              opacity={0.6}
            >
              <animate attributeName="rx" values="8;16;8" dur="0.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="0.4s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}

        {/* Fluid Dynamics: Interactive Swirling Vortex Streamlines */}
        {isSwirling && acidMeasured && (
          <g>
            <ellipse cx={flaskCenterX} cy={liquidTop + 6} rx={liquidRadiusX * 0.5} ry={4} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={1.2}>
              <animateTransform attributeName="transform" type="rotate" from={`0 ${flaskCenterX} ${liquidTop + 6}`} to={`360 ${flaskCenterX} ${liquidTop + 6}`} dur="0.55s" repeatCount="indefinite" />
            </ellipse>
            <path
              d={`M ${flaskCenterX - 18} ${liquidTop + 16} Q ${flaskCenterX} ${liquidTop + 20} ${flaskCenterX + 18} ${liquidTop + 16}`}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1.2}
              fill="none"
            >
              <animateTransform attributeName="transform" type="rotate" from={`0 ${flaskCenterX} ${liquidTop + 16}`} to={`360 ${flaskCenterX} ${liquidTop + 16}`} dur="0.5s" repeatCount="indefinite" />
            </path>
            <path
              d={`M ${flaskCenterX - 12} ${liquidTop + 28} Q ${flaskCenterX} ${liquidTop + 32} ${flaskCenterX + 12} ${liquidTop + 28}`}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1}
              fill="none"
            >
              <animateTransform attributeName="transform" type="rotate" from={`0 ${flaskCenterX} ${liquidTop + 28}`} to={`-360 ${flaskCenterX} ${liquidTop + 28}`} dur="0.6s" repeatCount="indefinite" />
            </path>
          </g>
        )}
      </g>

      {/* Fluid Dynamics: Curved Concave Surface Meniscus */}
      <path
        d={`M ${flaskCenterX - liquidRadiusX} ${liquidTop} Q ${flaskCenterX} ${liquidTop + 3.5} ${flaskCenterX + liquidRadiusX} ${liquidTop}`}
        fill="none"
        stroke="rgba(148, 163, 184, 0.7)"
        strokeWidth={1}
        clipPath="url(#flask-clip)"
        style={{
          transition: 'all 2.2s cubic-bezier(0.25, 1, 0.5, 1)',
          opacity: acidMeasured ? 0.9 : 0,
        }}
      />

      {/* Dynamic Surface Ripples on Impact */}
      {acidMeasured && isReceivingDrop && (
        <g clipPath="url(#flask-clip)">
          <ellipse
            cx={flaskCenterX}
            cy={liquidTop + 2}
            rx={6}
            ry={2}
            fill="none"
            stroke="#ffffff"
            strokeWidth={0.8}
            opacity={0.7}
          >
            <animate attributeName="rx" values="3;16" dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {/* Indicator Solution Molecules / Indicator visual */}
      {hasIndicator && (
        <g opacity={0.6}>
          <circle cx={flaskCenterX - 12} cy={flaskBodyBottom - 8} r={1.5} fill="#7c3aed" />
          <circle cx={flaskCenterX + 8} cy={flaskBodyBottom - 14} r={1.2} fill="#7c3aed" />
          <circle cx={flaskCenterX - 4} cy={flaskBodyBottom - 4} r={1.5} fill="#7c3aed" />
        </g>
      )}

      {/* Lab Desk Label */}
      <text
        x={flaskCenterX}
        y={flaskBodyBottom + 22}
        textAnchor="middle"
        fill="#475569"
        fontSize="7"
        fontFamily="var(--font-mono)"
        fontWeight={600}
      >
        {acidMeasured ? `Conical Flask (${(25 + volumeAdded).toFixed(1)} mL)` : 'Conical Flask (Empty)'}
      </text>
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

export default Flask;
