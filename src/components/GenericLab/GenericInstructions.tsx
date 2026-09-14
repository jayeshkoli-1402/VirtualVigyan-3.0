/**
 * ═══════════════════════════════════════════════════════════════════
 *  GenericInstructions — Config-driven instructions panel
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import type { ExperimentConfig, ExperimentState, ExperimentAction } from '../../engine/experimentConfig';
import { evaluateCondition } from '../../engine/experimentRunner';

type GenericInstructionsProps = {
  config: ExperimentConfig;
  state: ExperimentState;
  dispatch: React.Dispatch<ExperimentAction>;
  mistakeMessage: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

const GenericInstructions: React.FC<GenericInstructionsProps> = ({
  config,
  state,
  dispatch,
  mistakeMessage,
  isCollapsed,
  onToggleCollapse,
}) => {
  const currentStep = config.steps[state.currentStepIndex];

  // Get dynamic instruction text
  const getInstruction = (): string => {
    if (!currentStep) return '';
    if (currentStep.dynamicInstructions) {
      for (const di of currentStep.dynamicInstructions) {
        if (evaluateCondition(di.condition, state)) {
          return di.instruction;
        }
      }
    }
    return currentStep.instruction;
  };

  // Check if button advance is allowed for current step
  const hasActions = (currentStep?.requiredActions.length ?? 0) > 0;
  const stepActionsCompleted = currentStep?.requiredActions.every(
    a => state.completedActions.includes(a)
  ) ?? true;

  // Button is shown only if step is button-advance and all required actions are done
  const showAdvanceButton = currentStep?.advanceMode === 'button' && (!hasActions || stepActionsCompleted);


  const handleAdvance = () => {
    // Notify element click for any registered interaction triggers
    dispatch({ type: 'CLICK_ELEMENT', payload: { elementId: 'advance-step' } });
    // Advance to next experiment step
    dispatch({ type: 'ADVANCE_STEP' });
  };

  if (isCollapsed) {
    return (
      <div style={{ padding: '8px 4px', height: '100%' }}>
        <button
          onClick={onToggleCollapse}
          style={{
            all: 'unset', cursor: 'pointer', fontSize: '0.7rem',
            color: 'var(--text-muted)', padding: '2px 4px',
            borderRadius: 4, border: '1px solid var(--border)',
          }}
        >
          ←
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 12, height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{
          fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          Instructions
        </h2>
        <button
          onClick={onToggleCollapse}
          style={{
            all: 'unset', cursor: 'pointer', fontSize: '0.7rem',
            color: 'var(--text-muted)', padding: '2px 4px',
            borderRadius: 4, border: '1px solid var(--border)',
          }}
        >
          →
        </button>
      </div>

      {/* Current instruction */}
      <div style={{
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06), rgba(13, 148, 136, 0.06))',
        border: '1px solid rgba(37, 99, 235, 0.15)',
        fontSize: '0.8rem',
        lineHeight: 1.5,
        color: 'var(--text-primary)',
      }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#2563eb', marginBottom: 4,
          textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {currentStep?.label ?? 'Step'}
        </div>
        {getInstruction()}
      </div>

      {/* Advance button */}
      {showAdvanceButton && (
        <button
          id="btn-instructions-advance"
          className="btn-primary animate-fade-in"
          onClick={handleAdvance}
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            width: '100%',
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span>Continue to Next Step</span>
          <span>→</span>
        </button>
      )}


      {/* Step checklist */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
        }}>
          Progress
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {config.steps
            .filter(s => s.type !== 'results')
            .map((step, i) => {
              const isCompleted = i < state.currentStepIndex;
              const isCurrent = i === state.currentStepIndex;

              return (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: isCurrent ? 'rgba(37, 99, 235, 0.06)' : 'transparent',
                    fontSize: '0.72rem',
                    color: isCompleted ? 'var(--accent-teal)' :
                           isCurrent ? 'var(--text-primary)' :
                           'var(--text-muted)',
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                >
                  <span style={{ fontSize: '0.65rem', width: 14, textAlign: 'center' }}>
                    {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                  </span>
                  {step.label}
                </div>
              );
            })}
        </div>
      </div>

      {/* Mistake message toast */}
      {mistakeMessage && (
        <div style={{
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          color: '#b45309',
          fontSize: '0.75rem',
          lineHeight: 1.4,
          animation: 'slideInUp 0.2s ease-out',
        }}>
          ⚠️ {mistakeMessage}
        </div>
      )}

      {/* Chemistry info */}
      {config.chemistry.reaction && (
        <div style={{
          padding: '8px 10px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(124, 58, 237, 0.05)',
          border: '1px solid rgba(124, 58, 237, 0.1)',
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
        }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 600, color: '#7c3aed', marginBottom: 2 }}>
            Reaction
          </div>
          {config.chemistry.reaction}
        </div>
      )}
    </div>
  );
};

export default GenericInstructions;
