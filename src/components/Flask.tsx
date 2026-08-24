import React, { useEffect, useState } from 'react';

interface FlaskProps {
  color: string;
  hasIndicator: boolean;
  isPlaced: boolean;
  acidMeasured: boolean;
  isReceivingDrop: boolean;
}

const Flask: React.FC<FlaskProps> = ({ color, hasIndicator, isPlaced, acidMeasured, isReceivingDrop }) => {
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    if (isReceivingDrop) {
      setRipple(true);
      const timer = setTimeout(() => setRipple(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isReceivingDrop]);

  if (!isPlaced) return null;

  // Flask dimensions
  const flaskCenterX = 140;
  const flaskNeckTop = 300;
  const flaskNeckWidth = 18;
  const flaskBodyTop = 330;
  const flaskBodyBottom = 385;
  const flaskBodyWidth = 90;

  // Liquid level (visible only when acid is measured)
  const liquidTop = acidMeasured ? flaskBodyTop + 10 : flaskBodyBottom;
  const liquidRadiusX = getWidthAtY(liquidTop, flaskNeckWidth, flaskBodyWidth, flaskBodyTop, flaskBodyBottom) / 2 - 1;

  return (
    <g id="flask-assembly">
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

      {acidMeasured && (
        <g clipPath="url(#flask-clip)" id="flask-liquid-body">
          {/* Main Liquid Bulk */}
          <rect
            x={flaskCenterX - flaskBodyWidth / 2}
            y={liquidTop}
            width={flaskBodyWidth}
            height={flaskBodyBottom + 6 - liquidTop}
            fill={color}
            style={{ transition: 'fill 0.3s ease' }}
          />

          {/* Fluid Dynamics: Plume swirl center when titrant stream enters */}
          {isReceivingDrop && (
            <g>
              <ellipse
                cx={flaskCenterX}
                cy={liquidTop + 14}
                rx={12}
                ry={8}
                fill={color}
                opacity={0.6}
              >
                <animate attributeName="rx" values="8;16;8" dur="0.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="0.4s" repeatCount="indefinite" />
              </ellipse>
            </g>
          )}
        </g>
      )}

      {/* Fluid Dynamics: Curved Concave Surface Meniscus */}
      {acidMeasured && (
        <path
          d={`M ${flaskCenterX - liquidRadiusX} ${liquidTop} Q ${flaskCenterX} ${liquidTop + 3.5} ${flaskCenterX + liquidRadiusX} ${liquidTop}`}
          fill="none"
          stroke="rgba(148, 163, 184, 0.7)"
          strokeWidth={1}
          clipPath="url(#flask-clip)"
        />
      )}

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
        {acidMeasured ? '25 mL HCl Solution' : 'Conical Flask (Empty)'}
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
