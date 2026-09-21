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
  hideProcedure?: boolean;
};

const GenericInstructions: React.FC<GenericInstructionsProps> = ({
  config,
  state,
  dispatch,
  mistakeMessage,
  isCollapsed,
  onToggleCollapse,
  hideProcedure = false,
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
    <div style={{ padding: '12px 14px 20px 14px', height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
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
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        background: hideProcedure
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.05))'
          : 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(13, 148, 136, 0.06))',
        border: hideProcedure
          ? '1.5px solid rgba(239, 68, 68, 0.3)'
          : '1.5px solid rgba(37, 99, 235, 0.22)',
        boxShadow: hideProcedure
          ? '0 2px 8px rgba(239, 68, 68, 0.08)'
          : '0 2px 8px rgba(37, 99, 235, 0.06)',
      }}>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: hideProcedure ? '#dc2626' : '#1d4ed8',
          letterSpacing: '0.02em',
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          {hideProcedure && <span>🔒</span>}
          <span>{hideProcedure ? 'Assessment Mode' : (currentStep?.label ?? 'Step')}</span>
        </div>
        {hideProcedure ? (
          <div style={{
            fontSize: '0.8rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
          }}>
            Detailed step instructions are concealed by your instructor for this evaluation. Proceed with the reaction using standard laboratory protocols.
          </div>
        ) : (
          <div style={{
            fontSize: '0.8125rem',
            lineHeight: 1.5,
            color: 'var(--text-primary)',
            fontWeight: 450,
          }}>
            {getInstruction()}
          </div>
        )}
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

      {/* Chemistry / Governing Principle info card */}
      {config.chemistry.reaction && (
        <div style={{
          marginTop: 'auto',
          marginBottom: 6,
          padding: '12px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.05))',
          border: '1.5px solid rgba(99, 102, 241, 0.25)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#6366f1',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 6,
          }}>
            <span>⚖️</span>
            <span>{config.chemistry.reactionType || 'Governing Principle'}</span>
          </div>
          <div style={{
            fontSize: '0.76rem',
            lineHeight: 1.45,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            wordBreak: 'break-word',
          }}>
            {config.chemistry.reaction}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericInstructions;
