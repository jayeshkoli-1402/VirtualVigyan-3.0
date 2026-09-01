import React from 'react';

interface IgnitionTubeProps {
  isFilled: boolean;
  isFilling: boolean;
  isSuspended: boolean;
  /** Position when not suspended — centered in the SVG */
  x?: number;
  y?: number;
}

const IgnitionTube: React.FC<IgnitionTubeProps> = ({
  isFilled,
  isFilling,
  isSuspended,
  x = 0,
  y = 0,
}) => {
  // When suspended, the tube is drawn inside the flask by the parent component
  // When standalone, it's drawn at x, y

  const tubeWidth = 10;
  const tubeHeight = 30;
  const liquidColor = isFilled ? 'rgba(200, 220, 254, 0.55)' : 'transparent';

  return (
    <g transform={`translate(${x}, ${y})`} id="ignition-tube">
      {/* Thread (when suspended) */}
      {isSuspended && (
        <line
          x1={tubeWidth / 2} y1={-15}
          x2={tubeWidth / 2} y2={0}
          stroke="rgba(161, 137, 104, 0.7)"
          strokeWidth={0.8}
          strokeDasharray="2,1"
        />
      )}

      {/* Tube body (open at top, rounded at bottom) */}
      <path
        d={`M 0 0 L 0 ${tubeHeight - 4} Q 0 ${tubeHeight} ${tubeWidth / 2} ${tubeHeight} Q ${tubeWidth} ${tubeHeight} ${tubeWidth} ${tubeHeight - 4} L ${tubeWidth} 0`}
        fill="rgba(220, 230, 245, 0.2)"
        stroke="rgba(148, 163, 184, 0.5)"
        strokeWidth={0.8}
      />

      {/* Liquid level */}
      {isFilled && (
        <path
          d={`M 1 ${tubeHeight * 0.35} L 1 ${tubeHeight - 4} Q 1 ${tubeHeight - 1} ${tubeWidth / 2} ${tubeHeight - 1} Q ${tubeWidth - 1} ${tubeHeight - 1} ${tubeWidth - 1} ${tubeHeight - 4} L ${tubeWidth - 1} ${tubeHeight * 0.35} Z`}
          fill={liquidColor}
        >
          {isFilling && (
            <animate
              attributeName="d"
              from={`M 1 ${tubeHeight - 2} L 1 ${tubeHeight - 4} Q 1 ${tubeHeight - 1} ${tubeWidth / 2} ${tubeHeight - 1} Q ${tubeWidth - 1} ${tubeHeight - 1} ${tubeWidth - 1} ${tubeHeight - 4} L ${tubeWidth - 1} ${tubeHeight - 2} Z`}
              to={`M 1 ${tubeHeight * 0.35} L 1 ${tubeHeight - 4} Q 1 ${tubeHeight - 1} ${tubeWidth / 2} ${tubeHeight - 1} Q ${tubeWidth - 1} ${tubeHeight - 1} ${tubeWidth - 1} ${tubeHeight - 4} L ${tubeWidth - 1} ${tubeHeight * 0.35} Z`}
              dur="1s"
              fill="freeze"
            />
          )}
        </path>
      )}

      {/* Label */}
      {!isSuspended && (
        <text
          x={tubeWidth / 2}
          y={tubeHeight + 10}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="5"
          fontFamily="var(--font-mono)"
        >
          Tube
        </text>
      )}
    </g>
  );
};

export default IgnitionTube;
