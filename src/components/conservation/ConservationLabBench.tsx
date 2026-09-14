import React, { useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { ConservationState, ConservationAction } from '../../engine/conservationState';
import { ConservationStep, CONSERVATION_DROP_ZONES } from '../../engine/conservationState';
import { getConservationFlaskColor, calculateLiveMass } from '../../engine/conservationRules';
import ConicalFlaskConservation from './ConicalFlaskConservation';
import DigitalBalance from './DigitalBalance';
import MolecularReactionChain from './MolecularReactionChain';

interface ConservationLabBenchProps {
  state: ConservationState;
  dispatch: React.Dispatch<ConservationAction>;
  activeDropZone: string | null;
  onLaunchVR?: () => void;
}

const ConservationLabBench: React.FC<ConservationLabBenchProps> = ({
  state,
  dispatch,
  activeDropZone,
  onLaunchVR,
}) => {
  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  // Free movable flask position on table (90 = bench, 220 = balance)
  const [flaskPosX, setFlaskPosX] = useState<number>(90);
  const [isDraggingFlask, setIsDraggingFlask] = useState<boolean>(false);
  const flaskDragRef = useRef<{ startSvgX: number; startFlaskX: number }>({ startSvgX: 0, startFlaskX: 90 });

  // Free movable ignition tube position from stand into flask
  const [tubePosX, setTubePosX] = useState<number>(29);
  const [tubePosY, setTubePosY] = useState<number>(320);
  const [isDraggingTube, setIsDraggingTube] = useState<boolean>(false);
  const tubeDragRef = useRef<{ startSvgX: number; startSvgY: number; startTubeX: number; startTubeY: number }>({
    startSvgX: 0,
    startSvgY: 0,
    startTubeX: 29,
    startTubeY: 320,
  });

  const [tubeHovered, setTubeHovered] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const flaskColor = getConservationFlaskColor(
    state.precipitateFormed,
    state.na2so4Poured,
    state.isMixing
  );

  // Helper: Convert client screen (x, y) to exact SVG coordinates
  const getSvgCoords = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const point = svgRef.current.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPoint = point.matrixTransform(ctm.inverse());
    return { x: svgPoint.x, y: svgPoint.y };
  };

  // Live mass readout at ANY phase of the experiment
  const currentLiveMass = calculateLiveMass(state);

  // Instant toggle between bench (90) and balance (220)
  const toggleFlaskOnBalance = () => {
    if (state.flaskOnBalance || flaskPosX >= 155) {
      setFlaskPosX(90);
      dispatch({ type: 'REMOVE_FROM_BALANCE' });
    } else {
      setFlaskPosX(220);
      dispatch({ type: 'PLACE_ON_BALANCE' });
    }
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.8, Math.round((z + 0.2) * 100) / 100));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.7, Math.round((z - 0.2) * 100) / 100));
  const handleZoomReset = () => {
    setZoomLevel(1.0);
    setPanX(0);
    setPanY(0);
  };

  // Pan directional buttons
  const handlePanUp = () => setPanY((y) => y + 35);
  const handlePanDown = () => setPanY((y) => y - 35);
  const handlePanLeft = () => setPanX((x) => x + 35);
  const handlePanRight = () => setPanX((x) => x - 35);

  // ── Global pointer handlers on the SVG root for 100% reliable drag ──
  const handlePointerMoveRoot = (e: React.PointerEvent) => {
    const svgCoords = getSvgCoords(e.clientX, e.clientY);

    if (isDraggingFlask) {
      const deltaX = svgCoords.x - flaskDragRef.current.startSvgX;
      const newX = Math.max(50, Math.min(235, flaskDragRef.current.startFlaskX + deltaX));
      setFlaskPosX(newX);
    }

    if (isDraggingTube) {
      const dx = svgCoords.x - tubeDragRef.current.startSvgX;
      const dy = svgCoords.y - tubeDragRef.current.startSvgY;
      setTubePosX(tubeDragRef.current.startTubeX + dx);
      setTubePosY(tubeDragRef.current.startTubeY + dy);
    }
  };

  const handlePointerUpRoot = () => {
    if (isDraggingFlask) {
      setIsDraggingFlask(false);
      if (flaskPosX >= 155) {
        setFlaskPosX(220);
        dispatch({ type: 'PLACE_ON_BALANCE' });
      } else {
        setFlaskPosX(90);
        dispatch({ type: 'REMOVE_FROM_BALANCE' });
      }
    }

    if (isDraggingTube) {
      setIsDraggingTube(false);
      if (tubePosX >= 55 || Math.abs(tubePosX - flaskPosX) < 50) {
        dispatch({ type: 'SUSPEND_TUBE' });
      }
      setTubePosX(29);
      setTubePosY(320);
    }
  };

  // ── Flask drag initiation ──
  const handleFlaskPointerDown = (e: React.PointerEvent) => {
    if (!state.flaskPlaced) return;
    const svgCoords = getSvgCoords(e.clientX, e.clientY);
    setIsDraggingFlask(true);
    flaskDragRef.current = {
      startSvgX: svgCoords.x,
      startFlaskX: state.flaskOnBalance ? 220 : flaskPosX,
    };
  };

  // ── Tube drag initiation ──
  const handleTubePointerDown = (e: React.PointerEvent) => {
    if (!state.tubeFilled || state.tubeSuspended) return;
    e.stopPropagation();
    const svgCoords = getSvgCoords(e.clientX, e.clientY);
    setIsDraggingTube(true);
    tubeDragRef.current = {
      startSvgX: svgCoords.x,
      startSvgY: svgCoords.y,
      startTubeX: 29,
      startTubeY: 320,
    };
  };

  return (
    <div
      id="conservation-lab-bench"
      className="glass-card"
      style={{
        padding: '10px 12px',
        overflow: 'hidden',
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top Unified Lab Toolbar (Tip + Zoom/Pan Controls in ONE tidy row) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: '8px',
          padding: '4px 8px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
          flexShrink: 0,
        }}
      >
        {/* Left: Tip badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.68rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
          }}
        >
          <span>💡</span>
          <span>
            <strong>Double-click</strong> flask to move on/off scale
          </span>
        </div>

        {/* Right: Inline Zoom & Pan Controls + 3D VR Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onLaunchVR && (
            <button
              id="btn-launch-3d-vr"
              onClick={onLaunchVR}
              title="Switch to 3D Virtual Reality Lab (Google Cardboard & WebXR Headsets)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 6,
                background: 'linear-gradient(135deg, #059669, #0284c7)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🥽</span>
              <span>3D VR Lab</span>
            </button>
          )}

          {/* Zoom buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg-secondary)', padding: '2px 4px', borderRadius: 6 }}>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              disabled={zoomLevel <= 0.7}
              style={{
                all: 'unset',
                cursor: zoomLevel <= 0.7 ? 'not-allowed' : 'pointer',
                padding: '2px 6px',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--text-secondary)',
                borderRadius: 4,
                opacity: zoomLevel <= 0.7 ? 0.4 : 1,
              }}
            >
              −
            </button>
            <button
              onClick={handleZoomReset}
              title="Reset Zoom & Pan"
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '2px 6px',
                fontSize: '0.62rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: '#059669',
                borderRadius: 4,
                background: 'var(--bg-card)',
                border: '1px solid #a7f3d0',
              }}
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              disabled={zoomLevel >= 1.8}
              style={{
                all: 'unset',
                cursor: zoomLevel >= 1.8 ? 'not-allowed' : 'pointer',
                padding: '2px 6px',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--text-secondary)',
                borderRadius: 4,
                opacity: zoomLevel >= 1.8 ? 0.4 : 1,
              }}
            >
              +
            </button>
          </div>

          {/* Pan directional buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg-secondary)', padding: '2px 4px', borderRadius: 6 }}>
            <button
              onClick={handlePanLeft}
              title="Pan Left"
              style={{ all: 'unset', cursor: 'pointer', padding: '2px 5px', fontSize: '0.65rem', color: 'var(--text-secondary)', background: '#fff', borderRadius: 3, border: '1px solid var(--border)' }}
            >
              ←
            </button>
            <button
              onClick={handlePanUp}
              title="Pan Up"
              style={{ all: 'unset', cursor: 'pointer', padding: '2px 5px', fontSize: '0.65rem', color: 'var(--text-secondary)', background: '#fff', borderRadius: 3, border: '1px solid var(--border)' }}
            >
              ↑
            </button>
            <button
              onClick={handlePanDown}
              title="Pan Down"
              style={{ all: 'unset', cursor: 'pointer', padding: '2px 5px', fontSize: '0.65rem', color: 'var(--text-secondary)', background: '#fff', borderRadius: 3, border: '1px solid var(--border)' }}
            >
              ↓
            </button>
            <button
              onClick={handlePanRight}
              title="Pan Right"
              style={{ all: 'unset', cursor: 'pointer', padding: '2px 5px', fontSize: '0.65rem', color: 'var(--text-secondary)', background: '#fff', borderRadius: 3, border: '1px solid var(--border)' }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* ── Live High-Definition Molecular Reaction & Ion Exchange HUD Chamber ── */}
      <MolecularReactionChain state={state} />

      {/* ── SVG Lab Scene with Root Pointer Tracking & Double Click Support ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          userSelect: 'none',
          minHeight: '280px',
        }}
        onPointerMove={handlePointerMoveRoot}
        onPointerUp={handlePointerUpRoot}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 310 420"
          width="100%"
          height="100%"
          style={{
            maxHeight: '68vh',
            display: 'block',
            margin: '0 auto',
            touchAction: 'none',
          }}
          aria-label="Conservation of Mass lab bench"
        >
          <defs>
            {/* Lab bench wood surface gradient */}
            <linearGradient id="benchWoodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(120, 90, 60, 0.45)" />
              <stop offset="100%" stopColor="rgba(80, 55, 35, 0.6)" />
            </linearGradient>

            {/* Reagent Bottle Amber Glass Gradient */}
            <linearGradient id="amberBottleGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="40%" stopColor="#b45309" />
              <stop offset="80%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>

          {/* ── Scalable / Pannable Lab Workspace Group (Bench + Apparatuses Move Together) ── */}
          <g
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
              transformOrigin: '155px 330px',
              transition: isDraggingFlask || isDraggingTube ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            {/* Wooden Lab Table Worktop (Locked underneath apparatuses) */}
            <rect x={-50} y={390} width={410} height={60} rx={4} fill="url(#benchWoodGrad)" stroke="rgba(148, 163, 184, 0.2)" strokeWidth={0.5} />
            <rect x={-50} y={390} width={410} height={2} rx={1} fill="rgba(255, 255, 255, 0.12)" />

            {/* ── Drop Zone: Bench (Initial Flask placement) ── */}
            {!state.flaskPlaced && state.step === ConservationStep.SETUP_FLASK && (
              <DropZoneOverlay
                zoneId={CONSERVATION_DROP_ZONES.BENCH_ZONE}
                x={45} y={280} width={90} height={110}
                label="Conical Flask"
                isActive={activeDropZone === CONSERVATION_DROP_ZONES.BENCH_ZONE}
                step={state.step}
                targetStep={ConservationStep.SETUP_FLASK}
              />
            )}

            {/* ── Drop Zone: Flask Mouth (Pour Na2SO4, Seal Cork) ── */}
            {state.flaskPlaced && !state.flaskSealed && !state.flaskOnBalance && (
              <DropZoneOverlay
                zoneId={CONSERVATION_DROP_ZONES.FLASK_ZONE}
                x={flaskPosX - 35} y={280} width={70} height={110}
                label={
                  !state.na2so4Poured
                    ? 'Na₂SO₄ Bottle'
                    : state.tubeFilled && !state.tubeSuspended
                      ? 'Drop Tube Here'
                      : !state.flaskSealed && state.tubeSuspended
                        ? 'Rubber Cork'
                        : ''
                }
                isActive={activeDropZone === CONSERVATION_DROP_ZONES.FLASK_ZONE || isDraggingTube}
                step={state.step}
                targetStep={
                  !state.na2so4Poured
                    ? ConservationStep.SETUP_FLASK
                    : !state.tubeSuspended
                      ? ConservationStep.SUSPEND_TUBE
                      : ConservationStep.SEAL_FLASK
                }
                hidden={state.na2so4Poured && state.tubeSuspended && state.flaskSealed}
              />
            )}

            {/* ── Test Tube Stand on Lab Bench ── */}
            {(state.step === ConservationStep.PLACE_TUBE_ON_STAND || state.tubePlacedOnStand) && !state.tubeSuspended && (
              <g
                id="ignition-tube-bench-station"
                onMouseEnter={() => setTubeHovered(true)}
                onMouseLeave={() => setTubeHovered(false)}
              >
                {/* Wooden Test Tube Stand Rack Base */}
                <rect x={12} y={365} width={34} height={24} rx={3} fill="#78350f" stroke="#451a03" strokeWidth={0.8} />
                <rect x={14} y={335} width={30} height={8} rx={2} fill="#92400e" stroke="#451a03" strokeWidth={0.6} />
                <rect x={16} y={335} width={4} height={32} fill="#78350f" />
                <rect x={38} y={335} width={4} height={32} fill="#78350f" />

                {/* Drop zone to place ignition tube on stand from toolbox if not yet placed */}
                {!state.tubePlacedOnStand && (
                  <DropZoneOverlay
                    zoneId={CONSERVATION_DROP_ZONES.TUBE_STAND_ZONE}
                    x={10} y={300} width={40} height={90}
                    label="Place Ignition Tube"
                    isActive={activeDropZone === CONSERVATION_DROP_ZONES.TUBE_STAND_ZONE}
                    step={state.step}
                    targetStep={ConservationStep.PLACE_TUBE_ON_STAND}
                  />
                )}

                {/* Ignition Tube on Stand (Interactive drag or click/double-click to suspend into flask) */}
                {state.tubePlacedOnStand && (
                  <g
                    onPointerDown={handleTubePointerDown}
                    onDoubleClick={() => {
                      if (state.tubeFilled && !state.tubeSuspended) {
                        dispatch({ type: 'SUSPEND_TUBE' });
                      }
                    }}
                    onClick={() => {
                      if (state.tubeFilled && !state.tubeSuspended) {
                        dispatch({ type: 'SUSPEND_TUBE' });
                      }
                    }}
                    style={{
                      cursor: state.tubeFilled ? 'pointer' : 'default',
                      touchAction: 'none',
                    }}
                  >
                    {/* Render tube at tubePosX, tubePosY during drag */}
                    <g transform={`translate(${isDraggingTube ? tubePosX - 29 : 0}, ${isDraggingTube ? tubePosY - 320 : 0})`}>
                      <ellipse cx={29} cy={320} rx={6.5} ry={2.2} fill="rgba(241, 245, 249, 0.4)" stroke="#94a3b8" strokeWidth={0.8} />
                      <path
                        d="M 23 320 L 23 368 Q 23 376 29 376 Q 35 376 35 368 L 35 320 Z"
                        fill="rgba(241, 245, 249, 0.25)"
                        stroke="#64748b"
                        strokeWidth={0.9}
                      />
                      <line x1={25} y1={322} x2={25} y2={370} stroke="#ffffff" strokeWidth={1} opacity={0.7} />

                      {/* BaCl2 solution fill */}
                      {state.tubeFilled && (
                        <g>
                          <path
                            d="M 24 332 L 24 367 Q 24 374 29 374 Q 34 374 34 367 L 34 332 Z"
                            fill="rgba(224, 242, 254, 0.55)"
                          />
                          <ellipse cx={29} cy={332} rx={5} ry={1.5} fill="none" stroke="rgba(148, 163, 184, 0.7)" strokeWidth={0.6} />
                        </g>
                      )}

                      {/* Cotton suspension thread tied to lip */}
                      <path
                        d="M 23 321 Q 18 312 29 308 Q 40 312 35 321"
                        fill="none"
                        stroke="#b45309"
                        strokeWidth={0.8}
                        strokeDasharray="2,1"
                      />

                      {/* Large invisible grab area for easy drag / double click */}
                      <rect x={18} y={305} width={24} height={70} fill="transparent" />
                    </g>

                    {/* Drop zone to fill with BaCl2 if not filled */}
                    {!state.tubeFilled && (
                      <DropZoneOverlay
                        zoneId={CONSERVATION_DROP_ZONES.TUBE_FILL_ZONE}
                        x={10} y={290} width={40} height={100}
                        label="BaCl₂ Bottle"
                        isActive={activeDropZone === CONSERVATION_DROP_ZONES.TUBE_FILL_ZONE}
                        step={state.step}
                        targetStep={ConservationStep.FILL_TUBE}
                      />
                    )}
                  </g>
                )}

                {/* Hover tooltip for stand */}
                {tubeHovered && (
                  <g style={{ pointerEvents: 'none' }}>
                    <rect x={2} y={290} width={140} height={18} rx={4} fill="#0f172a" opacity={0.92} />
                    <text x={72} y={302} textAnchor="middle" fill="#ffffff" fontSize="5.2" fontFamily="var(--font-sans)" fontWeight={600}>
                      {state.tubePlacedOnStand
                        ? state.tubeFilled
                          ? 'Click or Drag Tube into Conical Flask'
                          : 'Empty Ignition Tube on Stand'
                        : 'Test Tube Stand'}
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* ── Digital Electronic Balance (Double click / click to toggle flask on/off pan) ── */}
            <g
              onClick={toggleFlaskOnBalance}
              onDoubleClick={toggleFlaskOnBalance}
              style={{ cursor: state.flaskPlaced ? 'pointer' : 'default' }}
            >
              <DigitalBalance
                massReading={currentLiveMass}
                showReading={state.flaskOnBalance || state.initialMass !== null}
                isActive={state.flaskOnBalance}
              />
            </g>

            {/* ── Drop Zone: Digital Balance Pan (Active at ANY phase for weighing) ── */}
            {!state.flaskOnBalance && (
              <DropZoneOverlay
                zoneId={CONSERVATION_DROP_ZONES.BALANCE_ZONE}
                x={180} y={240} width={80} height={100}
                label="Double-click to Weigh"
                isActive={activeDropZone === CONSERVATION_DROP_ZONES.BALANCE_ZONE}
                step={state.step}
                targetStep={state.step}
              />
            )}

            {/* ── Conical Flask (Double click, click, or drag to move on/off scale) ── */}
            {state.flaskPlaced && (
              <g
                onPointerDown={handleFlaskPointerDown}
              >
                <ConicalFlaskConservation
                  liquidColor={flaskColor}
                  na2so4Poured={state.na2so4Poured}
                  tubeSuspended={state.tubeSuspended}
                  tubeFilled={state.tubeFilled}
                  flaskSealed={state.flaskSealed}
                  precipitateFormed={state.precipitateFormed}
                  isMixing={state.isMixing}
                  onBalance={state.flaskOnBalance}
                  customX={isDraggingFlask ? flaskPosX : state.flaskOnBalance ? 220 : 90}
                  onPlaceOnBalance={() => {
                    setFlaskPosX(220);
                    dispatch({ type: 'PLACE_ON_BALANCE' });
                  }}
                  onMoveToBench={() => {
                    setFlaskPosX(90);
                    dispatch({ type: 'REMOVE_FROM_BALANCE' });
                  }}
                />
              </g>
            )}

            {/* ── Animated Na2SO4 Reagent Bottle Pouring into Flask ── */}
            {state.isPouringNa2SO4 && (
              <g transform={`translate(${flaskPosX + 20}, 240)`}>
                <g transform="rotate(-40, 20, 15)">
                  <rect x={0} y={0} width={26} height={38} rx={4} fill="url(#amberBottleGrad)" stroke="#451a03" strokeWidth={1} />
                  <rect x={6} y={-8} width={14} height={8} rx={2} fill="#1e293b" />
                  <rect x={2} y={10} width={22} height={20} rx={2} fill="#ffffff" stroke="#e2e8f0" strokeWidth={0.6} />
                  <text x={13} y={20} textAnchor="middle" fill="#059669" fontSize="4.5" fontFamily="var(--font-mono)" fontWeight={700}>Na₂SO₄</text>
                  <text x={13} y={27} textAnchor="middle" fill="#334155" fontSize="3.5" fontFamily="var(--font-sans)">5% w/v</text>
                </g>
                <line x1={-10} y1={25} x2={-20} y2={65} stroke="#059669" strokeWidth={2.2} strokeLinecap="round">
                  <animate attributeName="strokeDasharray" values="1,4;5,2;2,3" dur="0.2s" repeatCount="indefinite" />
                </line>
                <rect x={-8} y={-14} width={90} height={18} rx={4} fill="#ffffff" stroke="#059669" strokeWidth={0.8} />
                <text x={37} y={-2} textAnchor="middle" fill="#059669" fontSize="6" fontFamily="var(--font-mono)" fontWeight={700}>
                  Pouring 10 mL Na₂SO₄...
                </text>
              </g>
            )}

            {/* ── Animated BaCl2 Bottle Filling Ignition Tube ── */}
            {state.isFillingTube && (
              <g transform="translate(45, 270)">
                <g transform="rotate(-35, 15, 15)">
                  <rect x={0} y={0} width={24} height={35} rx={4} fill="url(#amberBottleGrad)" stroke="#451a03" strokeWidth={1} />
                  <rect x={5} y={-7} width={14} height={7} rx={2} fill="#1e293b" />
                  <rect x={2} y={8} width={20} height={20} rx={2} fill="#ffffff" stroke="#dc2626" strokeWidth={0.6} />
                  <text x={12} y={18} textAnchor="middle" fill="#dc2626" fontSize="4.5" fontFamily="var(--font-mono)" fontWeight={700}>BaCl₂</text>
                  <text x={12} y={25} textAnchor="middle" fill="#991b1b" fontSize="3.5" fontFamily="var(--font-sans)">⚠️ Toxic</text>
                </g>
                <line x1={-8} y1={25} x2={-16} y2={55} stroke="#3b82f6" strokeWidth={2} strokeLinecap="round">
                  <animate attributeName="strokeDasharray" values="1,3;4,2;2,2" dur="0.15s" repeatCount="indefinite" />
                </line>
                <rect x={-5} y={-15} width={85} height={18} rx={4} fill="#ffffff" stroke="#ef4444" strokeWidth={0.8} />
                <text x={37.5} y={-3} textAnchor="middle" fill="#dc2626" fontSize="6" fontFamily="var(--font-mono)" fontWeight={700}>
                  Filling with BaCl₂...
                </text>
              </g>
            )}

            {/* ── Mass Readings Live Ledger / Tag ── */}
            {state.initialMass !== null && (
              <foreignObject x={152} y={180} width={135} height={52}>
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid #059669',
                    borderRadius: 8,
                    padding: '6px 10px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                  }}
                >
                  <div style={{ color: '#059669', fontWeight: 800 }}>
                    M₁ (Initial) = {state.initialMass.toFixed(2)} g
                  </div>
                  {state.finalMass !== null && (
                    <div style={{ color: '#2563eb', fontWeight: 800, marginTop: 3 }}>
                      M₂ (Final) = {state.finalMass.toFixed(2)} g
                    </div>
                  )}
                </div>
              </foreignObject>
            )}

            {/* ── Proceed to Calculation button (when final mass M2 is recorded) ── */}
            {state.finalMass !== null && (
              <foreignObject x={152} y={135} width={135} height={38}>
                <button
                  id="btn-proceed-calculation-conservation"
                  className="btn-primary"
                  onClick={() => dispatch({ type: 'PROCEED_TO_CALCULATION' })}
                  style={{
                    fontSize: '0.66rem',
                    padding: '8px 10px',
                    width: '100%',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  }}
                >
                  Proceed to Calculation →
                </button>
              </foreignObject>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};

// ── Drop Zone Overlay (dnd-kit droppable) ──
const DropZoneOverlay: React.FC<{
  zoneId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  isActive: boolean;
  step: ConservationStep;
  targetStep: ConservationStep;
  hidden?: boolean;
}> = ({ zoneId, x, y, width, height, label, isActive, step, targetStep, hidden }) => {
  const { setNodeRef, isOver } = useDroppable({ id: zoneId });

  if (hidden) return null;

  const isRelevant = step === targetStep;
  const borderColor = isOver
    ? 'rgba(5, 150, 105, 0.9)'
    : isActive
      ? 'rgba(5, 150, 105, 0.7)'
      : isRelevant
        ? 'rgba(5, 150, 105, 0.45)'
        : 'rgba(148, 163, 184, 0.25)';
  const bgColor = isOver
    ? 'rgba(209, 250, 229, 0.55)'
    : isRelevant
      ? 'rgba(209, 250, 229, 0.25)'
      : 'transparent';

  const badgeWidth = 115;
  const badgeHeight = 22;
  const badgeX = Math.max(5, Math.min(305 - badgeWidth, x + width / 2 - badgeWidth / 2));
  const badgeY = y + height / 2 - badgeHeight / 2;

  return (
    <g id={`dropzone-${zoneId}`}>
      <foreignObject x={x} y={y} width={width} height={height}>
        <div
          ref={setNodeRef}
          style={{
            width: '100%',
            height: '100%',
            border: `1.5px dashed ${borderColor}`,
            borderRadius: 8,
            background: bgColor,
            transition: 'all 0.15s ease',
            boxSizing: 'border-box',
          }}
        />
      </foreignObject>

      {/* Badge tag appears only when dragging an active item or hovering over zone */}
      {(isOver || isActive) && label && (
        <foreignObject x={badgeX} y={badgeY} width={badgeWidth} height={badgeHeight} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.62rem',
                color: isOver ? '#065f46' : '#059669',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                fontWeight: 800,
                textAlign: 'center',
                padding: '3px 8px',
                background: 'var(--bg-card)',
                borderRadius: 5,
                border: '1.5px solid #059669',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default ConservationLabBench;
