/**
 * ═══════════════════════════════════════════════════════════════════
 *  GenericToolbox — Config-driven draggable apparatus panel
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { ExperimentConfig, ExperimentState } from '../../engine/experimentConfig';

type GenericToolboxProps = {
  config: ExperimentConfig;
  state: ExperimentState;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

const GenericToolbox: React.FC<GenericToolboxProps> = ({
  config,
  state,
  isCollapsed,
  onToggleCollapse,
}) => {
  const currentStep = config.steps[state.currentStepIndex];

  return (
    <div style={{ padding: isCollapsed ? '8px 4px' : '12px', height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: isCollapsed ? 8 : 12,
      }}>
        {!isCollapsed && (
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Apparatus
          </h2>
        )}
        <button
          onClick={onToggleCollapse}
          style={{
            all: 'unset', cursor: 'pointer', fontSize: '0.625rem',
            color: 'var(--text-muted)', padding: '3px 6px',
            borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            transition: 'all 0.15s ease',
          }}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Apparatus cards */}
      {!isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {config.apparatus
            .filter(a => !a.prePlaced)
            .map(apparatus => {
              const isPlaced = apparatus.id in state.placedApparatus;
              const isActiveStep = !apparatus.activeInSteps ||
                (currentStep && apparatus.activeInSteps.includes(currentStep.id));

              return (
                <DraggableCard
                  key={apparatus.id}
                  id={apparatus.id}
                  icon={apparatus.icon}
                  label={apparatus.label}
                  disabled={isPlaced}
                  dimmed={!isActiveStep}
                />
              );
            })}
        </div>
      )}

      {/* Collapsed: icons only */}
      {isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          {config.apparatus
            .filter(a => !a.prePlaced)
            .map(apparatus => {
              const isPlaced = apparatus.id in state.placedApparatus;
              return (
                <DraggableCard
                  key={apparatus.id}
                  id={apparatus.id}
                  icon={apparatus.icon}
                  label=""
                  disabled={isPlaced}
                  dimmed={false}
                  compact
                />
              );
            })}
        </div>
      )}
    </div>
  );
};


// ── Draggable Card ───────────────────────────────────────────────

type DraggableCardProps = {
  id: string;
  icon: string;
  label: string;
  disabled: boolean;
  dimmed: boolean;
  compact?: boolean;
};

const DraggableCard: React.FC<DraggableCardProps> = ({
  id, icon, label, disabled, dimmed, compact = false,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 0 : 8,
        padding: compact ? '6px' : '8px 10px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${isDragging ? 'var(--accent)' : disabled ? 'var(--border)' : 'var(--border)'}`,
        background: disabled ? 'var(--bg-secondary)' : 'var(--bg-card)',
        opacity: disabled ? 0.45 : dimmed ? 0.55 : 1,
        cursor: disabled ? 'not-allowed' : 'grab',
        transition: 'all 0.15s ease',
        fontSize: compact ? '1rem' : '0.8125rem',
        fontWeight: 500,
        color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
        justifyContent: compact ? 'center' : 'flex-start',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <span style={{ fontSize: compact ? '1rem' : '1rem' }}>{icon}</span>
      {!compact && label && <span>{label}</span>}
      {disabled && !compact && (
        <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', color: 'var(--accent-green)' }}>✓</span>
      )}
    </div>
  );
};


export default GenericToolbox;
