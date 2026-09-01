import React from 'react';

interface PipetteProps {
  x: number;
  y: number;
  isFilled: boolean;
  isFilling?: boolean;
  isDispensing?: boolean;
  label?: string;
}

const Pipette: React.FC<PipetteProps> = ({
  x,
  y,
  isFilled,
  isFilling = false,
  isDispensing = false,
  label,
}) => {
  // Liquid height in pipette tube (0 to 60px)
  const liquidHeight = isFilling
    ? 60
    : isDispensing
      ? 0
      : isFilled
        ? 60
        : 0;

  return (
    <g transform={`translate(${x}, ${y})`} id="pipette-overlay">
      {/* Red rubber suction bulb */}
      <ellipse
        cx={0}
        cy={0}
        rx={8}
        ry={12}
        fill="#dc2626"
        stroke="#b91c1c"
        strokeWidth={1}
      />
      <rect x={-4} y={10} width={8} height={4} fill="#475569" rx={1} />

      {/* Glass tube */}
      <rect
        x={-3}
        y={14}
        width={6}
        height={70}
        rx={1}
        fill="rgba(241, 245, 249, 0.3)"
        stroke="#94a3b8"
        strokeWidth={0.8}
      />

      {/* Volumetric mark ring (25 mL graduation mark) */}
      <line x1={-3} y1={25} x2={3} y2={25} stroke="#2563eb" strokeWidth={0.8} />

      {/* Tapered glass jet tip */}
      <polygon
        points="-3,84 3,84 0.8,94 -0.8,94"
        fill="rgba(241, 245, 249, 0.4)"
        stroke="#94a3b8"
        strokeWidth={0.8}
      />

      {/* Clear aqueous acid liquid inside pipette */}
      {(isFilled || isFilling || isDispensing) && (
        <rect
          x={-2}
          y={84 - liquidHeight}
          width={4}
          height={liquidHeight}
          fill="rgba(59, 130, 246, 0.45)"
          rx={0.5}
          style={{
            transition: isFilling || isDispensing ? 'height 1.2s ease, y 1.2s ease' : 'none',
          }}
        />
      )}

      {/* Dispensing droplet stream */}
      {isDispensing && (
        <g>
          <circle cx={0} cy={98} r={1.5} fill="rgba(59, 130, 246, 0.75)">
            <animate attributeName="cy" values="98;120" dur="0.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx={0} cy={98} r={1.2} fill="rgba(59, 130, 246, 0.65)">
            <animate attributeName="cy" values="98;120" dur="0.3s" begin="0.15s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="0.3s" begin="0.15s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Clean high-contrast status badge */}
      {label && (
        <g>
          <rect
            x={10}
            y={30}
            width={115}
            height={20}
            rx={4}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={0.8}
          />
          <text
            x={67}
            y={43}
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="6.5"
            fontFamily="var(--font-mono)"
            fontWeight={700}
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

export default Pipette;
