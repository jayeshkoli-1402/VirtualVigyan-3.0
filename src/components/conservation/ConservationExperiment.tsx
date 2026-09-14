import React, { useReducer, useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import {
  conservationReducer,
  conservationInitialState,
  ConservationStep,
  CONSERVATION_DRAG_ITEMS,
  CONSERVATION_DROP_ZONES,
} from '../../engine/conservationState';
import {
  canDropOnZone,
  canSuspendTube,
  canSealFlask,
} from '../../engine/conservationValidation';
import ConservationToolbox from './ConservationToolbox';
import ConservationLabBench from './ConservationLabBench';
import ConservationInstructions from './ConservationInstructions';
import ConservationCalculation from './ConservationCalculation';
import ConservationResults from './ConservationResults';
import LabSafetyModal from './LabSafetyModal';
import ChemicalHazardWarningToast from './ChemicalHazardWarningToast';
import type { HazardWarningData } from './ChemicalHazardWarningToast';
import ConservationVRLab from './vr/ConservationVRLab';

interface ConservationExperimentProps {
  onBackToSelector: () => void;
  initialVRMode?: boolean;
}

const ConservationExperiment: React.FC<ConservationExperimentProps> = ({ onBackToSelector, initialVRMode = false }) => {
  const [isVRMode, setIsVRMode] = useState<boolean>(initialVRMode);
  const [state, dispatch] = useReducer(conservationReducer, conservationInitialState);
  const [mistakeMessage, setMistakeMessage] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);

  // Safety Briefing Modal & Hazard Toasts
  const [safetyModalOpen, setSafetyModalOpen] = useState<boolean>(true);
  const [hazardWarning, setHazardWarning] = useState<HazardWarningData | null>(null);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // Sensors
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  // Responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Clear mistake messages after delay
  useEffect(() => {
    if (mistakeMessage) {
      const timer = setTimeout(() => setMistakeMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mistakeMessage]);

  // Auto-trigger hazard warning when entering FILL_TUBE step (BaCl2 handling)
  useEffect(() => {
    if (state.step === ConservationStep.FILL_TUBE && !state.tubeFilled) {
      setHazardWarning({
        title: 'Toxic Chemical Handling Alert',
        chemical: 'Barium Chloride (BaCl₂ 5% w/v)',
        hazardClass: 'Class 6.1 Toxic (H301, H332)',
        icon: '☠️',
        description: 'Barium ions are toxic heavy-metal poisons. Ingestion or direct dermal contact causes severe physiological distress.',
        precaution: 'Ensure safety goggles and nitrile gloves are worn. Dispense carefully with zero spillage.',
      });
    }
  }, [state.step, state.tubeFilled]);

  // Auto-start experiment
  useEffect(() => {
    if (state.step === ConservationStep.SELECT) {
      dispatch({ type: 'START_EXPERIMENT' });
    }
  }, [state.step]);

  // ── Drag handlers ──
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
    setMistakeMessage(null);

    // Contextual chemical warning on dragging BaCl2
    if (event.active.id === CONSERVATION_DRAG_ITEMS.BACL2_BOTTLE) {
      setHazardWarning({
        title: 'Toxic Chemical Handling Alert',
        chemical: 'Barium Chloride (BaCl₂ 5% w/v)',
        hazardClass: 'Class 6.1 Toxic (H301, H332)',
        icon: '☠️',
        description: 'Barium ions are toxic heavy-metal poisons. Ingestion or direct dermal contact causes severe physiological distress.',
        precaution: 'Ensure safety goggles and nitrile gloves are worn. Dispense carefully with zero spillage.',
      });
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setActiveDropZone(event.over ? (event.over.id as string) : null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragId(null);
      setActiveDropZone(null);

      if (!over) return;

      const itemId = active.id as string;
      const zoneId = over.id as string;

      // Validate the drop
      const validation = canDropOnZone(itemId, zoneId);
      if (!validation.allowed) {
        setMistakeMessage(validation.message);
        return;
      }

      // ── Handle valid drops by zone ──

      // Flask → bench
      if (zoneId === CONSERVATION_DROP_ZONES.BENCH_ZONE && itemId === CONSERVATION_DRAG_ITEMS.FLASK) {
        dispatch({ type: 'PLACE_FLASK' });
        return;
      }

      // Na₂SO₄ → flask
      if (zoneId === CONSERVATION_DROP_ZONES.FLASK_ZONE && itemId === CONSERVATION_DRAG_ITEMS.NA2SO4_BOTTLE) {
        if (!state.flaskPlaced) {
          setMistakeMessage('Place the Conical Flask on the bench first before pouring solutions.');
          return;
        }
        dispatch({ type: 'POUR_NA2SO4_START' });
        setTimeout(() => dispatch({ type: 'POUR_NA2SO4_END' }), 1500);
        return;
      }

      // Ignition tube → stand
      if (zoneId === CONSERVATION_DROP_ZONES.TUBE_STAND_ZONE && itemId === CONSERVATION_DRAG_ITEMS.IGNITION_TUBE) {
        dispatch({ type: 'PLACE_TUBE_ON_STAND' });
        return;
      }

      // BaCl₂ → tube fill zone
      if (zoneId === CONSERVATION_DROP_ZONES.TUBE_FILL_ZONE && itemId === CONSERVATION_DRAG_ITEMS.BACL2_BOTTLE) {
        dispatch({ type: 'FILL_TUBE_START' });
        setTimeout(() => dispatch({ type: 'FILL_TUBE_END' }), 1200);
        return;
      }

      // Ignition tube → flask (suspend)
      if (zoneId === CONSERVATION_DROP_ZONES.FLASK_ZONE && itemId === CONSERVATION_DRAG_ITEMS.IGNITION_TUBE) {
        const check = canSuspendTube(state);
        if (!check.allowed) {
          setMistakeMessage(check.message);
          return;
        }
        dispatch({ type: 'SUSPEND_TUBE' });
        return;
      }

      // Rubber cork → flask (seal)
      if (zoneId === CONSERVATION_DROP_ZONES.FLASK_ZONE && itemId === CONSERVATION_DRAG_ITEMS.RUBBER_CORK) {
        const check = canSealFlask(state);
        if (!check.allowed) {
          setMistakeMessage(check.message);
          return;
        }
        dispatch({ type: 'SEAL_FLASK' });
        return;
      }

      // Flask → balance (weigh at any phase)
      if (zoneId === CONSERVATION_DROP_ZONES.BALANCE_ZONE && itemId === CONSERVATION_DRAG_ITEMS.FLASK) {
        dispatch({ type: 'PLACE_ON_BALANCE' });
        return;
      }
    },
    [state]
  );

  const showFullLab = state.step !== ConservationStep.CALCULATION && state.step !== ConservationStep.RESULTS;

  // Drag overlay label
  const getDragLabel = (id: string) => {
    const labels: Record<string, { icon: string; label: string }> = {
      [CONSERVATION_DRAG_ITEMS.FLASK]: { icon: '⚗️', label: 'Conical Flask' },
      [CONSERVATION_DRAG_ITEMS.IGNITION_TUBE]: { icon: '🧫', label: 'Ignition Tube' },
      [CONSERVATION_DRAG_ITEMS.NA2SO4_BOTTLE]: { icon: '🧴', label: 'Na₂SO₄ Solution' },
      [CONSERVATION_DRAG_ITEMS.BACL2_BOTTLE]: { icon: '🧴', label: 'BaCl₂ Solution' },
      [CONSERVATION_DRAG_ITEMS.RUBBER_CORK]: { icon: '🔌', label: 'Rubber Cork' },
      [CONSERVATION_DRAG_ITEMS.MEASURING_CYLINDER]: { icon: '📏', label: 'Measuring Cylinder' },
    };
    return labels[id] || { icon: '📦', label: id };
  };

  if (isVRMode) {
    return <ConservationVRLab onBackToLab={() => setIsVRMode(false)} />;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* ── Mandatory Lab Safety PPE Briefing Modal ── */}
      <LabSafetyModal
        isOpen={safetyModalOpen}
        onAcknowledge={() => setSafetyModalOpen(false)}
      />

      {/* ── Contextual Chemical Hazard Alert Toast ── */}
      <ChemicalHazardWarningToast
        warning={hazardWarning}
        onDismiss={() => setHazardWarning(null)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* CALCULATION screen */}
        {state.step === ConservationStep.CALCULATION && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ maxWidth: 520, width: '100%' }}>
              <ConservationCalculation
                m1={state.initialMass ?? 0}
                m2={state.finalMass ?? 0}
                dispatch={dispatch}
              />
            </div>
          </div>
        )}

        {/* RESULTS screen */}
        {state.step === ConservationStep.RESULTS && (
          <div style={{ flex: 1, padding: 20 }}>
            <ConservationResults
              state={state}
              dispatch={dispatch}
              onBackToSelector={onBackToSelector}
            />
          </div>
        )}

        {/* Three-panel lab layout */}
        {showFullLab && (
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : `${leftCollapsed ? '52px' : '200px'} 1fr ${rightCollapsed ? '52px' : '260px'}`,
              gap: 0,
              minHeight: 0,
              transition: 'grid-template-columns 0.2s ease',
            }}
          >
            {/* Left: Toolbox */}
            <div
              style={{
                borderRight: isMobile ? 'none' : '1px solid var(--border)',
                borderBottom: isMobile ? '1px solid var(--border)' : 'none',
                background: 'var(--bg-card)',
                order: isMobile ? 1 : 0,
              }}
            >
              <ConservationToolbox
                state={state}
                isCollapsed={leftCollapsed}
                onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
              />
            </div>

            {/* Center: Lab bench */}
            <div
              style={{
                display: 'flex',
                padding: 8,
                order: isMobile ? 0 : 1,
                background: 'var(--bg-secondary)',
              }}
            >
              <ConservationLabBench
                state={state}
                dispatch={dispatch}
                activeDropZone={activeDropZone}
                onLaunchVR={() => setIsVRMode(true)}
              />
            </div>

            {/* Right: Instructions */}
            <div
              style={{
                borderLeft: isMobile ? 'none' : '1px solid var(--border)',
                borderTop: isMobile ? '1px solid var(--border)' : 'none',
                background: 'var(--bg-card)',
                order: 2,
              }}
            >
              <ConservationInstructions
                state={state}
                dispatch={dispatch}
                mistakeMessage={mistakeMessage}
                isCollapsed={rightCollapsed}
                onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Drag overlay (ghost while dragging) */}
      <DragOverlay>
        {activeDragId ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1.5px solid #059669',
              opacity: 0.95,
              cursor: 'grabbing',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            }}
          >
            <span style={{ fontSize: 18 }}>{getDragLabel(activeDragId).icon}</span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#059669',
              }}
            >
              {getDragLabel(activeDragId).label}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ConservationExperiment;
