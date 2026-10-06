import React, { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { ConservationState, ConservationAction } from '../../engine/conservationState';
import { ConservationStep, CONSERVATION_DROP_ZONES } from '../../engine/conservationState';
import { getConservationFlaskColor, calculateLiveMass } from '../../engine/conservationRules';
import { canPlaceOnBalance, canSuspendTube, canMixReactants } from '../../engine/conservationValidation';
import { useLanguage } from '../../i18n/LanguageContext';
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
  const { t, language } = useLanguage();
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
  const [showInspection, setShowInspection] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Reset positions on experiment reset
  useEffect(() => {
    if (!state.flaskPlaced) {
      setFlaskPosX(90);
    }
    if (!state.tubePlacedOnStand) {
      setTubePosX(29);
      setTubePosY(320);
    }
  }, [state.flaskPlaced, state.tubePlacedOnStand]);

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
      const check = canPlaceOnBalance(state);
      if (!check.allowed) {
        if (check.message) dispatch({ type: 'ADD_MISTAKE', payload: { message: check.message } });
        return;
      }
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
        const check = canPlaceOnBalance(state);
        if (!check.allowed) {
          setFlaskPosX(90);
          dispatch({ type: 'REMOVE_FROM_BALANCE' });
          if (check.message) dispatch({ type: 'ADD_MISTAKE', payload: { message: check.message } });
        } else {
          setFlaskPosX(220);
          dispatch({ type: 'PLACE_ON_BALANCE' });
        }
      } else {
        setFlaskPosX(90);
        dispatch({ type: 'REMOVE_FROM_BALANCE' });
      }
    }

    if (isDraggingTube) {
      setIsDraggingTube(false);
      if (tubePosX >= 55 || Math.abs(tubePosX - flaskPosX) < 50) {
        const check = canSuspendTube(state);
        if (!check.allowed) {
          if (check.message) dispatch({ type: 'ADD_MISTAKE', payload: { message: check.message } });
        } else {
          dispatch({ type: 'SUSPEND_TUBE' });
        }
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
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 'var(--radius-lg, 12px)',
        background: 'radial-gradient(ellipse at 50% 30%, var(--bg-card) 0%, var(--bg-inset, #f8fafc) 60%, var(--bg-secondary, #f1f5f9) 100%)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        minHeight: 520,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Realistic Lab Workbench Table Surface (HTML Backdrop) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '22%',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderTop: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: 'inset 0 8px 16px rgba(0, 0, 0, 0.4)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {/* Tabletop depth / glossy reflection plane */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '18px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
          }}
        />

        {/* Specular front edge highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent 5%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.3) 75%, transparent 95%)',
          }}
        />

        {/* Cabinet / Drawer Grooves on table apron */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '100%',
            paddingTop: '18px',
            opacity: 0.25,
          }}
        >
          <div style={{ width: '28%', height: '55%', border: '1px solid #94a3b8', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '30%', height: 4, background: '#94a3b8', borderRadius: 2 }} />
          </div>
          <div style={{ width: '28%', height: '55%', border: '1px solid #94a3b8', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '30%', height: 4, background: '#94a3b8', borderRadius: 2 }} />
          </div>
          <div style={{ width: '28%', height: '55%', border: '1px solid #94a3b8', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '30%', height: 4, background: '#94a3b8', borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* ── Top-Left Subtle Tip Pill ── */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius-md, 8px)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
          fontSize: '0.68rem',
          color: 'var(--text-secondary)',
          fontWeight: 500,
          pointerEvents: 'none',
        }}
      >
        <span>💡</span>
        <span>
          {t('conservation.doubleClickTip', 'Double-click flask to move on/off scale')}
        </span>
      </div>

      {/* ── Top-Right Floating Controls (VR + Zoom & Pan) ── */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(10px)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-md, 8px)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
        }}
      >
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
            <span>{t('conservation.vrLab', '3D VR Lab')}</span>
          </button>
        )}

        {/* Zoom controls */}
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
          <button onClick={handlePanLeft} title="Pan Left" style={{ all: 'unset', cursor: 'pointer', padding: '2px 5px', fontSize: '0.65rem', color: 'var(--text-secondary)', background: '#fff', borderRadius: 3, border: '1px solid var(--border)' }}>←</button>
          <button onClick={handlePanUp} title="Pan Up" style={{ all: 'unset', cursor: 'pointer', padding: '2px 5px', fontSize: '0.65rem', color: 'var(--text-secondary)', background: '#fff', borderRadius: 3, border: '1px solid var(--border)' }}>↑</button>
          <button onClick={handlePanDown} title="Pan Down" style={{ all: 'unset', cursor: 'pointer', padding: '2px 5px', fontSize: '0.65rem', color: 'var(--text-secondary)', background: '#fff', borderRadius: 3, border: '1px solid var(--border)' }}>↓</button>
          <button onClick={handlePanRight} title="Pan Right" style={{ all: 'unset', cursor: 'pointer', padding: '2px 5px', fontSize: '0.65rem', color: 'var(--text-secondary)', background: '#fff', borderRadius: 3, border: '1px solid var(--border)' }}>→</button>
        </div>
      </div>

      {/* ── Bottom-Left Action Bar (Inspect Reaction Button) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 35,
          display: 'flex',
          gap: 6,
          background: 'var(--bg-card, rgba(255, 255, 255, 0.95))',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg, 10px)',
          padding: '4px 6px',
          boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
        }}
      >
        <button
          type="button"
          id="btn-inspect-reaction"
          onClick={() => setShowInspection(true)}
          title="Inspect live molecular concentrations, ion exchange, and precipitates"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 'var(--radius-md, 8px)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid #6366f1',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.22))',
            color: '#4f46e5',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.20)',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '0.85rem' }}>🧪</span>
          <span>{language === 'hi' ? 'अभिक्रिया का निरीक्षण' : language === 'mr' ? 'अभिक्रियेचे निरीक्षण' : 'Inspect Reaction'}</span>
        </button>
      </div>

      {/* ── Real-Time Reaction & Stoichiometry Inspector Modal ── */}
      {showInspection && (
        <div
          id="reaction-inspection-modal"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInspection(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '820px',
              maxHeight: '90vh',
              backgroundColor: 'var(--bg-card, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
              borderRadius: '16px',
              border: '1px solid var(--border, #cbd5e1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border, #e2e8f0)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.04))',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>🧪</span>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#4338ca' }}>
                  {language === 'hi' ? 'आणविक अभिक्रिया और आयन विनिमय कक्ष' : language === 'mr' ? 'रेण्वीय अभिक्रिया आणि आयन देवाणघेवाण कक्ष' : 'Molecular Reaction & Ion Exchange Chamber'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowInspection(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '14px 18px', overflowY: 'auto' }}>
              <MolecularReactionChain state={state} />
            </div>
          </div>
        </div>
      )}

      {/* ── SVG Lab Scene with Root Pointer Tracking & Double Click Support ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          userSelect: 'none',
          minHeight: '300px',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 2,
        }}
        onPointerMove={handlePointerMoveRoot}
        onPointerUp={handlePointerUpRoot}
      >
        <svg
          ref={svgRef}
          viewBox="-75 100 460 330"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '920px',
            maxHeight: '560px',
            display: 'block',
            margin: '0 auto',
            touchAction: 'none',
          }}
          aria-label="Conservation of Mass lab bench"
        >
          <defs>
            {/* Realistic Slate Bench Gradients */}
            <linearGradient id="benchSlateGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="benchHighlightGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="25%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.7)" />
              <stop offset="75%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Reagent Bottle Amber Glass Gradient */}
            <linearGradient id="amberBottleGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="40%" stopColor="#b45309" />
              <stop offset="80%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Clear Aqueous Na2SO4 Stream Gradients */}
            <linearGradient id="na2so4StreamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(186, 230, 253, 0.95)" />
              <stop offset="50%" stopColor="rgba(56, 189, 248, 0.9)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.95)" />
            </linearGradient>
            <linearGradient id="streamShimmerGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.35)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* ── Scalable / Pannable Lab Workspace Group (Bench + Apparatuses Move Together) ── */}
          <g
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
              transformOrigin: '155px 265px',
              transition: isDraggingFlask || isDraggingTube ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            {/* Realistic Dark Slate Lab Table Worktop (Locked underneath apparatuses) */}
            <rect x={-150} y={388} width={610} height={100} fill="url(#benchSlateGrad)" stroke="#334155" strokeWidth={0.8} />
            <rect x={-150} y={388} width={610} height={6} fill="rgba(255, 255, 255, 0.08)" />
            <rect x={-150} y={388} width={610} height={1.5} fill="url(#benchHighlightGrad)" />
            <rect x={-150} y={398} width={610} height={0.6} fill="rgba(0, 0, 0, 0.5)" />
            <g opacity={0.3}>
              <rect x={-35} y={403} width={75} height={25} rx={2} fill="none" stroke="#94a3b8" strokeWidth={0.8} />
              <rect x={-8} y={407} width={20} height={2} rx={1} fill="#94a3b8" />
              <rect x={55} y={403} width={75} height={25} rx={2} fill="none" stroke="#94a3b8" strokeWidth={0.8} />
              <rect x={82} y={407} width={20} height={2} rx={1} fill="#94a3b8" />
              <rect x={145} y={403} width={75} height={25} rx={2} fill="none" stroke="#94a3b8" strokeWidth={0.8} />
              <rect x={172} y={407} width={20} height={2} rx={1} fill="#94a3b8" />
              <rect x={235} y={403} width={75} height={25} rx={2} fill="none" stroke="#94a3b8" strokeWidth={0.8} />
              <rect x={262} y={407} width={20} height={2} rx={1} fill="#94a3b8" />
            </g>

            {/* ── Drop Zone: Bench (Initial Flask placement) ── */}
            {!state.flaskPlaced && state.step === ConservationStep.SETUP_FLASK && (
              <DropZoneOverlay
                zoneId={CONSERVATION_DROP_ZONES.BENCH_ZONE}
                x={48} y={290} width={84} height={98}
                label={t('apparatus.flask', 'Conical Flask')}
                isActive={activeDropZone === CONSERVATION_DROP_ZONES.BENCH_ZONE}
                step={state.step}
                targetStep={ConservationStep.SETUP_FLASK}
              />
            )}

            {/* ── Drop Zone: Flask Mouth (Pour Na2SO4, Seal Cork) ── */}
            {state.flaskPlaced && !state.flaskSealed && !state.flaskOnBalance && (
              <DropZoneOverlay
                zoneId={CONSERVATION_DROP_ZONES.FLASK_ZONE}
                x={flaskPosX - 35} y={280} width={70} height={105}
                label={
                  !state.na2so4Poured
                    ? t('apparatus.na2so4Bottle', 'Na₂SO₄ Bottle')
                    : state.tubeFilled && !state.tubeSuspended
                      ? (language === 'hi' ? 'नली यहाँ डालें' : language === 'mr' ? 'नळी येथे टाका' : 'Drop Tube Here')
                      : !state.flaskSealed && state.tubeSuspended
                        ? t('apparatus.rubberCork', 'Rubber Cork')
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
                    label={language === 'hi' ? 'ज्वलन नली रखें' : language === 'mr' ? 'ज्वलन नळी ठेवा' : 'Place Ignition Tube'}
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
                        const check = canSuspendTube(state);
                        if (!check.allowed) {
                          if (check.message) dispatch({ type: 'ADD_MISTAKE', payload: { message: check.message } });
                        } else {
                          dispatch({ type: 'SUSPEND_TUBE' });
                        }
                      }
                    }}
                    onClick={() => {
                      if (state.tubeFilled && !state.tubeSuspended) {
                        const check = canSuspendTube(state);
                        if (!check.allowed) {
                          if (check.message) dispatch({ type: 'ADD_MISTAKE', payload: { message: check.message } });
                        } else {
                          dispatch({ type: 'SUSPEND_TUBE' });
                        }
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
                          <ellipse cx={29} cy={332} rx={5} ry={1.5} fill="none" stroke="rgba(148, 163, 184, 0.7)" strokeWidth={0.5} />
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
                        label={language === 'hi' ? 'BaCl₂ बोतल' : language === 'mr' ? 'BaCl₂ बाटली' : 'BaCl₂ Bottle'}
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
                          ? (language === 'hi' ? 'शंक्वाकार फ्लास्क में नली को क्लिक करें या खींचें' : language === 'mr' ? 'शंकूपात्रात नळी क्लिक करा किंवा ओढा' : 'Click or Drag Tube into Conical Flask')
                          : (language === 'hi' ? 'स्टैंड पर खाली इग्निशन ट्यूब' : language === 'mr' ? 'स्टँडवर रिकामी ज्वलन नळी' : 'Empty Ignition Tube on Stand')
                        : (language === 'hi' ? 'परखनली स्टैंड' : language === 'mr' ? 'परीक्षानळी स्टँड' : 'Test Tube Stand')}
                    </text>
                  </g>
                )}

                {/* ── Apparatus Label: Ignition Tube Stand ── */}
                {state.tubePlacedOnStand && !state.tubeSuspended && (
                  <g transform="translate(29, 396)" style={{ pointerEvents: 'none' }}>
                    <rect x={-24} y={-8} width={48} height={16} rx={8} fill="rgba(255, 255, 255, 0.96)" stroke="rgba(203, 213, 225, 0.8)" strokeWidth={0.8} />
                    <text x={0} y={3.5} textAnchor="middle" fill="#334155" fontSize="4.6" fontFamily="var(--font-sans)" fontWeight={700}>
                      {language === 'hi' ? 'परखनली स्टैंड' : language === 'mr' ? 'परीक्षानळी स्टँड' : 'Tube Stand'}
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

            {/* ── Apparatus Label: Digital Electronic Balance ── */}
            <g transform="translate(220, 396)" style={{ pointerEvents: 'none' }}>
              <rect x={-42} y={-8} width={84} height={16} rx={8} fill="rgba(255, 255, 255, 0.96)" stroke="rgba(203, 213, 225, 0.8)" strokeWidth={0.8} />
              <text x={0} y={3.5} textAnchor="middle" fill="#334155" fontSize="5.2" fontFamily="var(--font-sans)" fontWeight={700}>
                {t('apparatus.balance', 'Digital Balance')}
              </text>
            </g>

            {/* ── Drop Zone: Digital Balance Pan (Active at ANY phase for weighing) ── */}
            {!state.flaskOnBalance && (
              <DropZoneOverlay
                zoneId={CONSERVATION_DROP_ZONES.BALANCE_ZONE}
                x={180} y={245} width={80} height={85}
                label={language === 'hi' ? 'तोलने के लिए डबल-क्लिक करें' : language === 'mr' ? 'वजन करण्यासाठी डबल-क्लिक करा' : 'Double-click to Weigh'}
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
                    const check = canPlaceOnBalance(state);
                    if (!check.allowed) {
                      if (check.message) dispatch({ type: 'ADD_MISTAKE', payload: { message: check.message } });
                      return;
                    }
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

            {/* ── Apparatus Label: Conical Flask ── */}
            {state.flaskPlaced && !state.flaskOnBalance && (
              <g transform={`translate(${flaskPosX}, 396)`} style={{ pointerEvents: 'none' }}>
                <rect x={-36} y={-8} width={72} height={16} rx={8} fill="rgba(255, 255, 255, 0.96)" stroke="rgba(203, 213, 225, 0.8)" strokeWidth={0.8} />
                <text x={0} y={3.5} textAnchor="middle" fill="#334155" fontSize="5.2" fontFamily="var(--font-sans)" fontWeight={700}>
                  {t('apparatus.flask', 'Conical Flask')}
                </text>
              </g>
            )}

            {/* ── Animated Na2SO4 Reagent Bottle Pouring into Flask ── */}
            {state.isPouringNa2SO4 && (
              <g id="na2so4-pouring-animation-group" style={{ animation: 'fadeIn 0.25s ease-out' }}>
                {/* Pouring Reagent Bottle positioned precisely near flask neck opening */}
                <g transform={`translate(${flaskPosX + 12}, 286)`}>
                  <g transform="rotate(-52, 0, 0)">
                    {/* Bottle Body */}
                    <rect x={-12} y={16} width={24} height={34} rx={3} fill="url(#amberBottleGrad)" stroke="#451a03" strokeWidth={1} />
                    {/* Bottle Shoulder */}
                    <path d="M -4 8 L -12 16 L 12 16 L 4 8 Z" fill="url(#amberBottleGrad)" stroke="#451a03" strokeWidth={0.8} />
                    {/* Bottle Neck */}
                    <rect x={-4} y={0} width={8} height={8} rx={1} fill="url(#amberBottleGrad)" stroke="#451a03" strokeWidth={0.8} />
                    {/* Bottle Lip */}
                    <ellipse cx={0} cy={0} rx={4.8} ry={1.6} fill="#78350f" stroke="#451a03" strokeWidth={0.8} />
                    {/* Glass Sheen */}
                    <line x1={-9} y1={18} x2={-9} y2={45} stroke="rgba(255, 255, 255, 0.45)" strokeWidth={1.5} strokeLinecap="round" />
                    {/* White Reagent Label */}
                    <rect x={-10} y={22} width={20} height={18} rx={2} fill="#ffffff" stroke="#cbd5e1" strokeWidth={0.6} />
                    <text x={0} y={30} textAnchor="middle" fill="#047857" fontSize="4.2" fontFamily="var(--font-mono)" fontWeight={800}>Na₂SO₄</text>
                    <text x={0} y={36} textAnchor="middle" fill="#334155" fontSize="3.2" fontFamily="var(--font-sans)" fontWeight={600}>5% (aq)</text>
                    {/* Tilted Liquid Level inside Bottle */}
                    <path d="M -11 26 L 11 26 L 11 48 L -11 48 Z" fill="rgba(186, 230, 253, 0.55)" />
                  </g>
                </g>

                {/* ── Continuous Laminar Liquid Stream from Bottle Mouth directly into Conical Flask ── */}
                <g>
                  {/* Outer fluid stream */}
                  <path
                    d={`M ${flaskPosX + 12} 286 Q ${flaskPosX + 2} 294 ${flaskPosX} 304 L ${flaskPosX} 364`}
                    stroke="url(#na2so4StreamGrad)"
                    strokeWidth={3.2}
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Specular internal highlight streak */}
                  <path
                    d={`M ${flaskPosX + 11.5} 287 Q ${flaskPosX + 1.5} 294 ${flaskPosX - 0.5} 304 L ${flaskPosX - 0.5} 364`}
                    stroke="url(#streamShimmerGrad)"
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Fluid droplet bead at bottle spout */}
                  <circle cx={flaskPosX + 12} cy={286} r={2.2} fill="#38bdf8" opacity={0.95} />

                  {/* Dynamic accelerated fluid droplets cascading down inside flask */}
                  <circle cx={flaskPosX} cy={305} r={1.6} fill="#38bdf8">
                    <animate attributeName="cy" values="290;364" dur="0.35s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;1;0.9" dur="0.35s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={flaskPosX + 0.5} cy={325} r={1.3} fill="#e0f2fe">
                    <animate attributeName="cy" values="290;364" dur="0.30s" begin="0.12s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;1;0.9" dur="0.30s" begin="0.12s" repeatCount="indefinite" />
                  </circle>

                  {/* Surface impact ripples at flask bottom */}
                  <ellipse cx={flaskPosX} cy={364} rx={3} ry={1} fill="none" stroke="rgba(56, 189, 248, 0.85)" strokeWidth={1.2}>
                    <animate attributeName="rx" values="2;16" dur="0.65s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="0.8;4" dur="0.65s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0" dur="0.65s" repeatCount="indefinite" />
                  </ellipse>
                  <ellipse cx={flaskPosX} cy={364} rx={1.5} ry={0.6} fill="none" stroke="#ffffff" strokeWidth={1}>
                    <animate attributeName="rx" values="1;10" dur="0.65s" begin="0.25s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="0.5;2.5" dur="0.65s" begin="0.25s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="0.65s" begin="0.25s" repeatCount="indefinite" />
                  </ellipse>

                  {/* Micro splash particles */}
                  <circle cx={flaskPosX - 3} cy={363} r={1.1} fill="#38bdf8">
                    <animate attributeName="cy" values="363;356;363" dur="0.45s" repeatCount="indefinite" />
                    <animate attributeName="cx" values={`${flaskPosX};${flaskPosX - 6};${flaskPosX - 8}`} dur="0.45s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.7;0" dur="0.45s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={flaskPosX + 3} cy={363} r={1.1} fill="#38bdf8">
                    <animate attributeName="cy" values="363;355;363" dur="0.48s" begin="0.12s" repeatCount="indefinite" />
                    <animate attributeName="cx" values={`${flaskPosX};${flaskPosX + 6};${flaskPosX + 8}`} dur="0.48s" begin="0.12s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.7;0" dur="0.48s" begin="0.12s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Pouring Status Badge */}
                <foreignObject x={flaskPosX - 65} y={232} width={160} height={34} style={{ pointerEvents: 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '5px 12px',
                      background: 'rgba(255, 255, 255, 0.96)',
                      backdropFilter: 'blur(8px)',
                      border: '1.2px solid rgba(5, 150, 105, 0.45)',
                      borderRadius: 20,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#047857',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem' }}>🧴</span>
                    <span>
                      {language === 'hi'
                        ? '5 mL Na₂SO₄ डाला जा रहा है...'
                        : language === 'mr'
                          ? '5 mL Na₂SO₄ ओतले जात आहे...'
                          : 'Pouring 5 mL Na₂SO₄...'}
                    </span>
                  </div>
                </foreignObject>
              </g>
            )}

            {/* ── Animated BaCl2 Bottle Filling Ignition Tube ── */}
            {state.isFillingTube && (
              <g id="bacl2-filling-animation-group" style={{ animation: 'fadeIn 0.25s ease-out' }}>
                <g transform="translate(39, 308)">
                  <g transform="rotate(-48, 0, 0)">
                    <rect x={-11} y={15} width={22} height={32} rx={3} fill="url(#amberBottleGrad)" stroke="#451a03" strokeWidth={1} />
                    <path d="M -4 8 L -11 15 L 11 15 L 4 8 Z" fill="url(#amberBottleGrad)" stroke="#451a03" strokeWidth={0.8} />
                    <rect x={-4} y={0} width={8} height={8} rx={1} fill="url(#amberBottleGrad)" stroke="#451a03" strokeWidth={0.8} />
                    <ellipse cx={0} cy={0} rx={4.5} ry={1.5} fill="#78350f" stroke="#451a03" strokeWidth={0.8} />
                    <line x1={-8} y1={17} x2={-8} y2={42} stroke="rgba(255, 255, 255, 0.4)" strokeWidth={1.4} strokeLinecap="round" />
                    <rect x={-9} y={20} width={18} height={18} rx={2} fill="#ffffff" stroke="#ef4444" strokeWidth={0.6} />
                    <text x={0} y={28} textAnchor="middle" fill="#dc2626" fontSize="4.2" fontFamily="var(--font-mono)" fontWeight={800}>BaCl₂</text>
                    <text x={0} y={34} textAnchor="middle" fill="#991b1b" fontSize="3" fontFamily="var(--font-sans)" fontWeight={600}>{language === 'hi' ? '⚠️ विषैला' : language === 'mr' ? '⚠️ विषारी' : '⚠️ Toxic'}</text>
                  </g>
                </g>

                {/* Fluid stream into ignition tube */}
                <g>
                  <path
                    d="M 39 308 Q 33 314 29 322 L 29 365"
                    stroke="url(#na2so4StreamGrad)"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 38.5 309 Q 32.5 314 28.5 322 L 28.5 365"
                    stroke="url(#streamShimmerGrad)"
                    strokeWidth={1}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx={39} cy={308} r={1.8} fill="#38bdf8" opacity={0.95} />
                  <ellipse cx={29} cy={365} rx={2.5} ry={0.8} fill="none" stroke="rgba(56, 189, 248, 0.85)" strokeWidth={1}>
                    <animate attributeName="rx" values="1;6" dur="0.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0" dur="0.5s" repeatCount="indefinite" />
                  </ellipse>
                </g>

                <foreignObject x={-15} y={260} width={130} height={32} style={{ pointerEvents: 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      padding: '4px 10px',
                      background: 'rgba(255, 255, 255, 0.96)',
                      backdropFilter: 'blur(8px)',
                      border: '1.2px solid rgba(220, 38, 38, 0.45)',
                      borderRadius: 16,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#dc2626',
                    }}
                  >
                    <span>🧴</span>
                    <span>
                      {language === 'hi'
                        ? 'BaCl₂ भरा जा रहा है...'
                        : language === 'mr'
                          ? 'BaCl₂ भरले जात आहे...'
                          : 'Filling with BaCl₂...'}
                    </span>
                  </div>
                </foreignObject>
              </g>
            )}

            {/* ── Interactive Invert/Mix Button on Bench during MIX_REACTANTS step ── */}
            {state.step === ConservationStep.MIX_REACTANTS && !state.reactantsMixed && !state.isMixing && (
              <foreignObject x={flaskPosX - 50} y={190} width={100} height={36}>
                <button
                  id="btn-mix-reactants-bench"
                  className="btn-primary"
                  onClick={() => {
                    const check = canMixReactants(state);
                    if (!check.allowed) {
                      if (check.message) dispatch({ type: 'ADD_MISTAKE', payload: { message: check.message } });
                      return;
                    }
                    dispatch({ type: 'MIX_REACTANTS_START' });
                    setTimeout(() => dispatch({ type: 'MIX_REACTANTS_END' }), 2000);
                  }}
                  style={{
                    fontSize: '0.62rem',
                    padding: '6px 8px',
                    width: '100%',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {language === 'hi' ? '🔄 फ्लास्क हिलाएं' : language === 'mr' ? '🔄 फ्लास्क हलवा' : '🔄 Tilt Flask'}
                </button>
              </foreignObject>
            )}

            {/* ── Interactive Observation Confirmation Button on Bench ── */}
            {state.step === ConservationStep.OBSERVE && (
              <foreignObject x={flaskPosX - 55} y={185} width={110} height={40}>
                <button
                  id="btn-finish-observe-bench"
                  className="btn-primary"
                  onClick={() => dispatch({ type: 'FINISH_OBSERVE' })}
                  style={{
                    fontSize: '0.62rem',
                    padding: '6px 8px',
                    width: '100%',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    background: '#059669',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {language === 'hi' ? '✅ अवक्षेप देखा →' : language === 'mr' ? '✅ अवक्षेप पाहिला →' : '✅ Precipitate Seen →'}
                </button>
              </foreignObject>
            )}

            {/* ── Mass Readings Live Ledger / Tag ── */}
            {state.initialMass !== null && (
              <foreignObject x={152} y={170} width={136} height={54}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(8px)',
                    border: '1.2px solid rgba(5, 150, 105, 0.45)',
                    borderRadius: 8,
                    padding: '5px 8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.64rem',
                  }}
                >
                  <div style={{ color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: '0.65rem' }}>⚖️</span>
                    <span>{language === 'hi' ? 'M₁ (प्रारंभिक)' : language === 'mr' ? 'M₁ (सुरुवातीचे)' : 'M₁ (Initial)'} = {state.initialMass.toFixed(2)} g</span>
                  </div>
                  {state.finalMass !== null && (
                    <div style={{ color: '#2563eb', fontWeight: 800, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: '0.65rem' }}>⚖️</span>
                      <span>{language === 'hi' ? 'M₂ (अंतिम)' : language === 'mr' ? 'M₂ (अंतिम)' : 'M₂ (Final)'} = {state.finalMass.toFixed(2)} g</span>
                    </div>
                  )}
                </div>
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
    ? '#2563eb'
    : isActive
      ? '#3b82f6'
      : isRelevant
        ? 'rgba(59, 130, 246, 0.45)'
        : 'rgba(148, 163, 184, 0.22)';
  const bgColor = isOver
    ? 'rgba(37, 99, 235, 0.12)'
    : isRelevant
      ? 'rgba(59, 130, 246, 0.06)'
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
                color: '#1e40af',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontWeight: 800,
                textAlign: 'center',
                padding: '3px 8px',
                background: 'rgba(255, 255, 255, 0.96)',
                borderRadius: 12,
                border: '1.2px solid rgba(59, 130, 246, 0.45)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                whiteSpace: 'nowrap',
              }}
            >
              📍 {label}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default ConservationLabBench;
