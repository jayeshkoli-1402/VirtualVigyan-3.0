/**
 * ═══════════════════════════════════════════════════════════════════
 *  GenericLab — Main experiment renderer
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Takes an ExperimentConfig and renders the complete experiment:
 *  three-panel lab layout, calculation form, results screen.
 *  All driven by the config — zero experiment-specific code.
 * ═══════════════════════════════════════════════════════════════════
 */

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
import type { ExperimentConfig } from '../../engine/experimentConfig';
import { createExperiment } from '../../engine/experimentRunner';
import { validateDrop } from '../../engine/validationEngine';
import GenericToolbox from './GenericToolbox';
import GenericBench from './GenericBench';
import GenericInstructions from './GenericInstructions';
import GenericCalculation from './GenericCalculation';
import GenericResults from './GenericResults';
import { useLanguage } from '../../i18n/LanguageContext';

type GenericLabProps = {
  config: ExperimentConfig;
  onBackToSelector: () => void;
};

const GenericLab: React.FC<GenericLabProps> = ({ config, onBackToSelector }) => {
  const { tDynamic } = useLanguage();
  const [reducer, initialState] = createExperiment(config);
  const [state, dispatch] = useReducer(reducer, initialState);

  const [mistakeMessage, setMistakeMessage] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // DnD sensors
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

  // Start experiment on mount
  useEffect(() => {
    dispatch({ type: 'START_EXPERIMENT' });
  }, []);

  // Continuous TICK for timers and flow animations
  useEffect(() => {
    if (!config.continuousUpdates && !config.id.includes('titration')) return;

    const tickRate = 100; // ms
    const interval = setInterval(() => {
      dispatch({ type: 'TICK', payload: { deltaMs: tickRate } });
      // Legacy titration flow support
      dispatch({ type: 'TICK_FLOW', payload: { deltaMs: tickRate } });
    }, tickRate);

    return () => clearInterval(interval);
  }, [config.continuousUpdates, config.id]);

  // Clear mistake messages after delay
  useEffect(() => {
    if (mistakeMessage) {
      const timer = setTimeout(() => setMistakeMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mistakeMessage]);

  // Animation timers: when an animation starts, schedule its completion
  useEffect(() => {
    const activeAnims = Object.entries(state.animations).filter(([, v]) => v);
    for (const [flag] of activeAnims) {
      // Find the exact interaction that started this animation
      const interaction = state.activeAnimationInteractionId
        ? config.interactions.find(i => i.id === state.activeAnimationInteractionId)
        : config.interactions.find(i => i.animation?.animatingFlag === flag);

      const duration = interaction?.animation?.durationMs ?? 2000;
      const interId = interaction?.id ?? state.activeAnimationInteractionId ?? 'anim';

      const timer = setTimeout(() => {
        dispatch({
          type: 'ANIMATION_COMPLETE',
          payload: { animationFlag: flag, interactionId: interId },
        });
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [state.animations, state.activeAnimationInteractionId, config.interactions, dispatch]);

  // ── Drag handlers ──
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
    setMistakeMessage(null);
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
      const validation = validateDrop(config, state, itemId, zoneId);
      if (validation && !validation.allowed) {
        setMistakeMessage(validation.message);
        return;
      }
      if (validation?.message) {
        setMistakeMessage(validation.message);
      }

      // Dispatch to the generic reducer
      dispatch({
        type: 'DROP_ITEM',
        payload: { itemId, zoneId },
      });
    },
    [config, state],
  );

  // Determine current view
  const currentStep = config.steps[state.currentStepIndex];
  const isCalcStep = currentStep?.type === 'calculation';
  const isResultsStep = currentStep?.type === 'results' || state.finished;
  const isLabStep = !isCalcStep && !isResultsStep;

  // Drag overlay label
  const getDragLabel = (id: string) => {
    const apparatus = config.apparatus.find(a => a.id === id);
    return apparatus
      ? { icon: apparatus.icon, label: tDynamic(apparatus.label) }
      : { icon: '📦', label: id };
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Calculation screen */}
        {isCalcStep && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <GenericCalculation config={config} state={state} dispatch={dispatch} />
          </div>
        )}

        {/* Results screen */}
        {isResultsStep && (
          <div style={{ flex: 1, padding: 20 }}>
            <GenericResults
              config={config}
              state={state}
              dispatch={dispatch}
              onBackToSelector={onBackToSelector}
            />
          </div>
        )}

        {/* Three-panel lab layout */}
        {isLabStep && (
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : `${leftCollapsed ? '48px' : '210px'} 1fr ${rightCollapsed ? '48px' : '260px'}`,
              gap: 0,
              minHeight: 0,
              transition: 'grid-template-columns 0.2s ease',
            }}
          >
            {/* Left: Toolbox */}
            <div style={{
              borderRight: isMobile ? 'none' : '1px solid var(--border)',
              borderBottom: isMobile ? '1px solid var(--border)' : 'none',
              background: 'var(--bg-card)',
              order: isMobile ? 1 : 0,
            }}>
              <GenericToolbox
                config={config}
                state={state}
                isCollapsed={leftCollapsed}
                onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
              />
            </div>

            {/* Center: Lab bench */}
            <div style={{
              display: 'flex',
              padding: 8,
              order: isMobile ? 0 : 1,
              background: 'var(--bg-secondary)',
            }}>
              <GenericBench
                config={config}
                state={state}
                dispatch={dispatch}
                activeDropZone={activeDropZone}
              />
            </div>

            {/* Right: Instructions */}
            <div style={{
              borderLeft: isMobile ? 'none' : '1px solid var(--border)',
              borderTop: isMobile ? '1px solid var(--border)' : 'none',
              background: 'var(--bg-card)',
              order: 2,
            }}>
              <GenericInstructions
                config={config}
                state={state}
                dispatch={dispatch}
                mistakeMessage={mistakeMessage}
                isCollapsed={rightCollapsed}
                onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
              />
            </div>
          </div>
        )}

        {/* Drag overlay */}
        <DragOverlay>
          {activeDragId ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)', border: '1.5px solid var(--accent)',
              opacity: 0.95, cursor: 'grabbing',
              boxShadow: 'var(--shadow-lg)',
            }}>
              <span style={{ fontSize: 18 }}>{getDragLabel(activeDragId).icon}</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>
                {getDragLabel(activeDragId).label}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default GenericLab;
