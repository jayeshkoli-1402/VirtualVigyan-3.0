import React, { useCallback, useRef, useEffect } from 'react';
import type { TitrationAction } from '../engine/titrationState';
import { useLanguage } from '../i18n/LanguageContext';

interface StopcockControlProps {
  enabled: boolean;
  stopcockOpen: number;
  dispatch: React.Dispatch<TitrationAction>;
}

/**
 * Rotatable Directional Tap Valve System for Burette (Class 11 Titration).
 * - Click Right Wing / Side: Rotates clockwise -> steps up flow: 0% -> 20% (Slow Drop) -> 50% (Fast Drop) -> 80% (Rapid Stream) -> 100% (Full Stream).
 * - Click Left Wing / Side: Rotates counter-clockwise -> steps down flow: 100% -> 50% -> 20% -> 0% (Closed).
 * - Drag Cork: Smooth pointer dragging rotates tap dynamically.
 */
const StopcockControl: React.FC<StopcockControlProps> = ({ enabled, stopcockOpen, dispatch }) => {
  const { t } = useLanguage();
  const isPointerDownRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
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
  }, [stopcockOpen, dispatch]);

  const stepUpFlow = useCallback(() => {
    if (!enabled) return;
    let nextOpen = 0.20;
    if (stopcockOpen === 0) nextOpen = 0.20;
    else if (stopcockOpen < 0.35) nextOpen = 0.50;
    else if (stopcockOpen < 0.70) nextOpen = 0.80;
    else nextOpen = 1.00;

    dispatch({ type: 'SET_STOPCOCK', payload: { open: nextOpen } });
  }, [enabled, stopcockOpen, dispatch]);

  const stepDownFlow = useCallback(() => {
    if (!enabled) return;
    let nextOpen = 0;
    if (stopcockOpen > 0.85) nextOpen = 0.50;
    else if (stopcockOpen > 0.35) nextOpen = 0.20;
    else nextOpen = 0;

    dispatch({ type: 'SET_STOPCOCK', payload: { open: nextOpen } });
  }, [enabled, stopcockOpen, dispatch]);

  // Pointer event handlers supporting both seamless click and smooth drag
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
      e.stopPropagation();
      isPointerDownRef.current = true;
      hasMovedRef.current = false;
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      startOpenRef.current = stopcockOpen;
      try {
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
      } catch {
        // fallback
      }
    },
    [enabled, stopcockOpen]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDownRef.current) return;
      const deltaY = e.clientY - dragStartPosRef.current.y;
      const deltaX = e.clientX - dragStartPosRef.current.x;

      if (!hasMovedRef.current && Math.hypot(deltaX, deltaY) > 5) {
        hasMovedRef.current = true;
      }

      if (hasMovedRef.current) {
        const dragDelta = (deltaY - deltaX) / 60;
        const newOpen = Math.max(0, Math.min(1, startOpenRef.current + dragDelta));
        dispatch({ type: 'SET_STOPCOCK', payload: { open: Math.round(newOpen * 100) / 100 } });
      }
    },
    [dispatch]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;
      try {
        if ((e.currentTarget as Element).hasPointerCapture?.(e.pointerId)) {
          (e.currentTarget as Element).releasePointerCapture(e.pointerId);
        }
      } catch {
        // fallback
      }

      if (!hasMovedRef.current && enabled) {
        const rect = (e.currentTarget as Element).getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX >= rect.width / 2) {
          stepUpFlow();
        } else {
          stepDownFlow();
        }
      }
    },
    [enabled, stepUpFlow, stepDownFlow]
  );

  // Tap angle: 0deg (horizontal/closed) to 90deg (vertical/open)
  const tapAngle = stopcockOpen * 90;

  // Flow status label text
  const getFlowText = () => {
    if (stopcockOpen === 0) return t('lab.tapClosed', 'Tap Closed (0°)');
    if (stopcockOpen <= 0.25) return `${t('lab.slowDrop', '💧 Slow Drop')} (${Math.round(stopcockOpen * 100)}%)`;
    if (stopcockOpen <= 0.60) return `${t('lab.fastDrop', '💧 Fast Drop')} (${Math.round(stopcockOpen * 100)}%)`;
    if (stopcockOpen <= 0.85) return `${t('lab.rapidFlow', '🌊 Rapid Flow')} (${Math.round(stopcockOpen * 100)}%)`;
    return `${t('lab.fullStream', '🌊 Full Stream')} (${Math.round(stopcockOpen * 100)}%)`;
  };

  const buretteX = 140;
  const corkY = 285;

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

      {/* ── Stopcock Interactive Group (Supports Drag & Direct Side Clicks) ── */}
      <g
        id="stopcock-interactive-valve"
        style={{ cursor: enabled ? 'pointer' : 'not-allowed', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Invisible enlarged hit circle for dragging */}
        <circle
          cx={buretteX}
          cy={corkY}
          r={24}
          fill="rgba(0, 0, 0, 0.001)"
          style={{ pointerEvents: 'all' }}
        />

        {/* Rotatable Tap Valve Handle / Plug */}
        <g
          transform={`rotate(${tapAngle}, ${buretteX}, ${corkY})`}
          style={{ transition: isPointerDownRef.current ? 'none' : 'transform 0.18s ease-out' }}
        >
          {/* Central Plug Shaft */}
          <circle cx={buretteX} cy={corkY} r={3.5} fill="#1e293b" stroke="#475569" strokeWidth={0.8} />

          {/* Left Wing Lever (Close / Slow) */}
          <rect
            x={buretteX - 14}
            y={corkY - 1.5}
            width={14}
            height={3}
            rx={1.5}
            fill={stopcockOpen > 0 ? '#2563eb' : '#475569'}
            stroke={stopcockOpen > 0 ? '#1d4ed8' : '#334155'}
            strokeWidth={0.6}
          />

          {/* Right Wing Lever (Open / Faster) */}
          <rect
            x={buretteX}
            y={corkY - 1.5}
            width={14}
            height={3}
            rx={1.5}
            fill={stopcockOpen > 0 ? '#2563eb' : '#475569'}
            stroke={stopcockOpen > 0 ? '#1d4ed8' : '#334155'}
            strokeWidth={0.6}
          />

          {/* Knob Grip Ends */}
          <circle cx={buretteX - 13} cy={corkY} r={2.5} fill={stopcockOpen > 0 ? '#1d4ed8' : '#334155'} />
          <circle cx={buretteX + 13} cy={corkY} r={2.5} fill={stopcockOpen > 0 ? '#1d4ed8' : '#334155'} />
        </g>

        {/* Dedicated Left Wing Click Target (Rotate Counter-Clockwise -> Close / Slow down) */}
        <rect
          x={buretteX - 25}
          y={corkY - 14}
          width={25}
          height={28}
          fill="rgba(0, 0, 0, 0.001)"
          style={{ cursor: enabled && stopcockOpen > 0 ? 'pointer' : 'default', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepDownFlow();
          }}
        />

        {/* Dedicated Right Wing Click Target (Rotate Clockwise -> Open / Speed up) */}
        <rect
          x={buretteX}
          y={corkY - 14}
          width={25}
          height={28}
          fill="rgba(0, 0, 0, 0.001)"
          style={{ cursor: enabled ? 'pointer' : 'default', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepUpFlow();
          }}
        />
      </g>

      {/* Rotation direction indicator arrow / prompt when closed (Clickable) */}
      {enabled && stopcockOpen === 0 && (
        <g
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            stepUpFlow();
          }}
        >
          <text
            x={172}
            y={284}
            fill="#2563eb"
            fontSize="6"
            fontFamily="var(--font-sans)"
            fontWeight={700}
          >
            {t('lab.clickRightToOpen', '↻ Click Right to Open')}
          </text>
          <text
            x={172}
            y={292}
            fill="var(--text-muted, #64748b)"
            fontSize="5"
            fontFamily="var(--font-sans)"
          >
            {t('lab.slowDrop', 'Slow Drop')} (20%)
          </text>
        </g>
      )}

      {/* Active Flow Rate & Angle Readout (Clickable) */}
      {enabled && stopcockOpen > 0 && (
        <g
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            if (stopcockOpen < 0.9) stepUpFlow();
            else stepDownFlow();
          }}
        >
          <rect
            x={168}
            y={255}
            width={88}
            height={18}
            rx={4}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={0.8}
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
          />
          <text
            x={212}
            y={267}
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
          fontWeight={600}
        >
          {t('lab.tapLocked', '🔒 Tap Locked')}
        </text>
      )}
    </g>
  );
};

export default StopcockControl;
