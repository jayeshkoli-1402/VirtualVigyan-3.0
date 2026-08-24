import React, { useCallback, useRef, useEffect } from 'react';
import type { TitrationAction } from '../engine/titrationState';

interface StopcockControlProps {
  enabled: boolean;
  stopcockOpen: number;
  dispatch: React.Dispatch<TitrationAction>;
}

/**
 * Rotatable Tap Valve System for Burette.
 * The student rotates the tap key/handle from 0° (horizontal/closed) to 90° (vertical/open).
 * Flow rate adjusts proportionally to the tap angle.
 * Supports both clicking to step rotation and dragging to rotate smoothly.
 */
const StopcockControl: React.FC<StopcockControlProps> = ({ enabled, stopcockOpen, dispatch }) => {
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const startOpenRef = useRef(0);
  const lastFrameRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  // Continuous flow animation loop when tap is open (>0)
  useEffect(() => {
    if (stopcockOpen <= 0) {
      lastFrameRef.current = 0;
      return;
    }

    const tick = (timestamp: number) => {
      if (lastFrameRef.current === 0) {
        lastFrameRef.current = timestamp;
      }
      const deltaMs = Math.min(timestamp - lastFrameRef.current, 100);
      lastFrameRef.current = timestamp;

      if (deltaMs > 0) {
        dispatch({ type: 'TICK_FLOW', payload: { deltaMs } });
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [stopcockOpen > 0, dispatch]);

  // Click handler: cycle through angles 0% -> 30% -> 60% -> 90% -> 0%
  const handleClick = useCallback(() => {
    if (!enabled) return;
    let nextOpen = 0;
    if (stopcockOpen === 0) nextOpen = 0.3;
    else if (stopcockOpen < 0.5) nextOpen = 0.6;
    else if (stopcockOpen < 0.9) nextOpen = 1.0;
    else nextOpen = 0;

    dispatch({ type: 'SET_STOPCOCK', payload: { open: nextOpen } });
  }, [enabled, stopcockOpen, dispatch]);

  // Drag to rotate handler
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      startOpenRef.current = stopcockOpen;
    },
    [enabled, stopcockOpen]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = e.clientY - dragStartPosRef.current.y;
      const deltaX = e.clientX - dragStartPosRef.current.x;

      // Vertical or horizontal drag rotates tap 0 to 1 (0° to 90°)
      const dragDelta = (deltaY - deltaX) / 60;
      const newOpen = Math.max(0, Math.min(1, startOpenRef.current + dragDelta));
      dispatch({ type: 'SET_STOPCOCK', payload: { open: newOpen } });
    },
    [dispatch]
  );

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Tap angle: 0deg (horizontal/closed) to 90deg (vertical/open)
  const tapAngle = stopcockOpen * 90;

  // Flow status label text
  const getFlowText = () => {
    if (stopcockOpen === 0) return 'Tap Closed (0°)';
    if (stopcockOpen < 0.35) return `Slow Drop (${Math.round(stopcockOpen * 100)}%)`;
    if (stopcockOpen < 0.7) return `Fast Drop (${Math.round(stopcockOpen * 100)}%)`;
    return `Full Stream (${Math.round(stopcockOpen * 100)}%)`;
  };

  return (
    <g
      id="stopcock-control"
      style={{
        cursor: enabled ? 'pointer' : 'not-allowed',
        opacity: enabled ? 1 : 0.45,
      }}
    >
      {/* Tap Valve Housing Barrel */}
      <rect
        x={133}
        y={280}
        width={14}
        height={10}
        rx={2}
        fill="#475569"
        stroke="#334155"
        strokeWidth={0.8}
      />
      <rect
        x={135}
        y={282}
        width={10}
        height={6}
        fill="#94a3b8"
        opacity={0.3}
      />

      {/* Interactive Hit Area for Tap Handle */}
      <circle
        cx={140}
        cy={285}
        r={18}
        fill="transparent"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      />

      {/* Rotatable Tap Valve Handle / Plug */}
      <g
        transform={`rotate(${tapAngle}, 140, 285)`}
        style={{ transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out' }}
      >
        {/* Central Plug Shaft */}
        <circle cx={140} cy={285} r={3.5} fill="#1e293b" stroke="#475569" strokeWidth={0.8} />

        {/* Rotatable Tap Lever Wings / Wings of stopcock handle */}
        <rect
          x={126}
          y={283.5}
          width={28}
          height={3}
          rx={1.5}
          fill={stopcockOpen > 0 ? '#2563eb' : '#475569'}
          stroke={stopcockOpen > 0 ? '#1d4ed8' : '#334155'}
          strokeWidth={0.6}
        />
        {/* Knob Grip Ends */}
        <circle cx={127} cy={285} r={2.5} fill={stopcockOpen > 0 ? '#1d4ed8' : '#334155'} />
        <circle cx={153} cy={285} r={2.5} fill={stopcockOpen > 0 ? '#1d4ed8' : '#334155'} />
      </g>

      {/* Rotation direction indicator arrow */}
      {enabled && stopcockOpen === 0 && (
        <g opacity={0.7}>
          <text
            x={172}
            y={284}
            fill="#2563eb"
            fontSize="6"
            fontFamily="var(--font-sans)"
            fontWeight={600}
          >
            ↻ Click / Rotate Tap
          </text>
          <text
            x={172}
            y={292}
            fill="var(--text-muted)"
            fontSize="5"
            fontFamily="var(--font-sans)"
          >
            Adjust Titration Flow
          </text>
        </g>
      )}

      {/* Active Flow Rate & Angle Readout */}
      {stopcockOpen > 0 && (
        <g>
          <rect
            x={168}
            y={255}
            width={82}
            height={17}
            rx={4}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={0.8}
          />
          <text
            x={209}
            y={266}
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="6.2"
            fontFamily="var(--font-mono)"
            fontWeight={700}
          >
            {getFlowText()}
          </text>
        </g>
      )}

      {!enabled && (
        <text
          x={172}
          y={288}
          fill="#dc2626"
          fontSize="5.5"
          fontFamily="var(--font-sans)"
          fontWeight={500}
        >
          🔒 Tap Locked
        </text>
      )}
    </g>
  );
};

export default StopcockControl;
