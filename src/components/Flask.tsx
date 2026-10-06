import React from 'react';

interface FlaskProps {
  color: string;
  hasIndicator: boolean;
  isPlaced: boolean;
  acidMeasured: boolean;
  isReceivingDrop: boolean;
  volumeAdded?: number;
  isSwirling?: boolean;
  centerX?: number;
  baseY?: number;
}

const Flask: React.FC<FlaskProps> = ({
  color,
  hasIndicator,
  isPlaced,
  acidMeasured,
  isReceivingDrop,
  volumeAdded = 0,
  isSwirling = false,
  centerX = 360,
  baseY = 324,
}) => {
  if (!isPlaced) return null;

  // Flask geometry in 640x400 coordinate system
  const flaskCenterX = centerX;
  const flaskNeckTop = baseY - 59; // y = 265 (mouth opening)
  const flaskNeckWidth = 18;
  const flaskBodyTop = baseY - 39; // y = 285
  const flaskBodyBottom = baseY - 4; // y = 320
  const flaskBodyWidth = 76;
  const flaskBaseWidth = 84;

  // Cumulative Liquid Level: Base acid 25 mL (~0.45) + titrant volume (0 to 50 mL -> +0.40)
  const titrantFraction = Math.min(1, Math.max(0, volumeAdded / 50));
  const effectiveLevel = acidMeasured ? 0.45 + titrantFraction * 0.40 : 0;
  const fillHeight = (flaskBodyBottom - flaskBodyTop) * effectiveLevel;
  const liquidTop = flaskBodyBottom - fillHeight;
  const liquidRadiusX = getWidthAtY(liquidTop, flaskNeckWidth, flaskBodyWidth, flaskBodyTop, flaskBodyBottom) / 2 - 1;

  const clipId = `flask-clip-${centerX}-${baseY}`;

  return (
    <g
      id="flask-assembly"
      style={{
        transformOrigin: `${flaskCenterX}px ${baseY}px`,
        animation: isSwirling ? 'flaskShakeSwirl 0.75s ease-in-out infinite' : 'none',
      }}
    >
      {/* Flask Glass Geometry Definitions */}
      <defs>
        <clipPath id={clipId}>
          <path
            d={`M ${flaskCenterX - flaskNeckWidth / 2} ${flaskNeckTop + 4}
                L ${flaskCenterX - flaskNeckWidth / 2} ${flaskBodyTop}
                L ${flaskCenterX - flaskBaseWidth / 2} ${flaskBodyBottom}
                Q ${flaskCenterX - flaskBaseWidth / 2} ${baseY} ${flaskCenterX - flaskBaseWidth / 2 + 6} ${baseY}
                L ${flaskCenterX + flaskBaseWidth / 2 - 6} ${baseY}
                Q ${flaskCenterX + flaskBaseWidth / 2} ${baseY} ${flaskCenterX + flaskBaseWidth / 2} ${flaskBodyBottom}
                L ${flaskCenterX + flaskNeckWidth / 2} ${flaskBodyTop}
                L ${flaskCenterX + flaskNeckWidth / 2} ${flaskNeckTop + 4}
                Z`}
          />
        </clipPath>
      </defs>

      {/* Flask Rim Collar */}
      <ellipse
        cx={flaskCenterX}
        cy={flaskNeckTop}
        rx={flaskNeckWidth / 2 + 2}
        ry={3}
        fill="rgba(241, 245, 249, 0.4)"
        stroke="#94a3b8"
        strokeWidth={1}
      />
      <ellipse
        cx={flaskCenterX}
        cy={flaskNeckTop}
        rx={flaskNeckWidth / 2 - 1}
        ry={1.8}
        fill="rgba(203, 213, 225, 0.3)"
      />

      {/* Flask Neck Body */}
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
        opacity={0.6}
      />

      {/* Flask Main Body (Erlenmeyer conical geometry) */}
      <path
        d={`M ${flaskCenterX - flaskNeckWidth / 2} ${flaskBodyTop}
            L ${flaskCenterX - flaskBaseWidth / 2} ${flaskBodyBottom}
            Q ${flaskCenterX - flaskBaseWidth / 2} ${baseY} ${flaskCenterX - flaskBaseWidth / 2 + 6} ${baseY}
            L ${flaskCenterX + flaskBaseWidth / 2 - 6} ${baseY}
            Q ${flaskCenterX + flaskBaseWidth / 2} ${baseY} ${flaskCenterX + flaskBaseWidth / 2} ${flaskBodyBottom}
            L ${flaskCenterX + flaskNeckWidth / 2} ${flaskBodyTop}
            Z`}
        fill="rgba(241, 245, 249, 0.15)"
        stroke="#94a3b8"
        strokeWidth={1}
      />

      {/* Liquid Fill - Clipped to Erlenmeyer Shape */}
      <g clipPath={`url(#${clipId})`} id="flask-liquid-body">
        {/* Main Liquid Bulk */}
        <rect
          x={flaskCenterX - flaskBaseWidth / 2}
          y={liquidTop}
          width={flaskBaseWidth}
          height={baseY + 10 - liquidTop}
          fill={color}
          style={{
            transition: 'y 0.3s cubic-bezier(0.25, 1, 0.5, 1), height 0.3s cubic-bezier(0.25, 1, 0.5, 1), fill 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
            opacity: acidMeasured ? 1 : 0,
          }}
        />

        {/* Fluid Dynamics: Plume swirl center when titrant stream enters */}
        {isReceivingDrop && acidMeasured && (
          <g>
            <ellipse
              cx={flaskCenterX}
              cy={liquidTop + 8}
              rx={10}
              ry={5}
              fill={color}
              opacity={0.6}
            >
              <animate attributeName="rx" values="6;14;6" dur="0.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="0.4s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}

        {/* Fluid Dynamics: Interactive Swirling Vortex Streamlines */}
        {isSwirling && acidMeasured && (
          <g>
            <ellipse cx={flaskCenterX} cy={liquidTop + 4} rx={liquidRadiusX * 0.5} ry={3} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={1}>
              <animateTransform attributeName="transform" type="rotate" from={`0 ${flaskCenterX} ${liquidTop + 4}`} to={`360 ${flaskCenterX} ${liquidTop + 4}`} dur="0.55s" repeatCount="indefinite" />
            </ellipse>
            <path
              d={`M ${flaskCenterX - 14} ${liquidTop + 12} Q ${flaskCenterX} ${liquidTop + 15} ${flaskCenterX + 14} ${liquidTop + 12}`}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1}
              fill="none"
            >
              <animateTransform attributeName="transform" type="rotate" from={`0 ${flaskCenterX} ${liquidTop + 12}`} to={`360 ${flaskCenterX} ${liquidTop + 12}`} dur="0.5s" repeatCount="indefinite" />
            </path>
          </g>
        )}
      </g>

      {/* Fluid Dynamics: Curved Concave Surface Meniscus */}
      <path
        d={`M ${flaskCenterX - liquidRadiusX} ${liquidTop} Q ${flaskCenterX} ${liquidTop + 3} ${flaskCenterX + liquidRadiusX} ${liquidTop}`}
        fill="none"
        stroke="rgba(148, 163, 184, 0.7)"
        strokeWidth={0.9}
        clipPath={`url(#${clipId})`}
        style={{
          transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          opacity: acidMeasured ? 0.9 : 0,
        }}
      />

      {/* Dynamic Surface Ripples on Impact */}
      {acidMeasured && isReceivingDrop && (
        <g clipPath={`url(#${clipId})`}>
          <ellipse
            cx={flaskCenterX}
            cy={liquidTop + 2}
            rx={5}
            ry={1.5}
            fill="none"
            stroke="#ffffff"
            strokeWidth={0.8}
            opacity={0.7}
          >
            <animate attributeName="rx" values="2;12" dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {/* Flask Glass Reflection Highlights */}
      <path
        d={`M ${flaskCenterX - flaskNeckWidth / 2 + 2} ${flaskBodyTop}
            L ${flaskCenterX - flaskBaseWidth / 2 + 6} ${flaskBodyBottom}
            L ${flaskCenterX - flaskBaseWidth / 2 + 10} ${flaskBodyBottom}
            L ${flaskCenterX - flaskNeckWidth / 2 + 5} ${flaskBodyTop}
            Z`}
        fill="#ffffff"
        opacity={0.35}
      />

      {/* Indicator Solution Molecules visual */}
      {hasIndicator && (
        <g opacity={0.6}>
          <circle cx={flaskCenterX - 10} cy={flaskBodyBottom - 6} r={1.2} fill="#7c3aed" />
          <circle cx={flaskCenterX + 8} cy={flaskBodyBottom - 10} r={1} fill="#7c3aed" />
          <circle cx={flaskCenterX - 3} cy={flaskBodyBottom - 3} r={1.2} fill="#7c3aed" />
        </g>
      )}

      {/* Flask Volume Marking Graduations on Glass */}
      <g opacity={0.55} stroke="#94a3b8" strokeWidth={0.6}>
        <line x1={flaskCenterX + 16} y1={flaskBodyTop + 10} x2={flaskCenterX + 24} y2={flaskBodyTop + 10} />
        <line x1={flaskCenterX + 18} y1={flaskBodyTop + 18} x2={flaskCenterX + 28} y2={flaskBodyTop + 18} />
        <line x1={flaskCenterX + 20} y1={flaskBodyTop + 26} x2={flaskCenterX + 32} y2={flaskBodyTop + 26} />
      </g>
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
