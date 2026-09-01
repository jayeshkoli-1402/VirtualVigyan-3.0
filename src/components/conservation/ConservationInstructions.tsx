import React from 'react';
import type { ConservationState, ConservationAction } from '../../engine/conservationState';
import {
  ConservationStep,
  CONSERVATION_STEP_ORDER,
  CONSERVATION_STEP_LABELS,
  getConservationStepInstruction,
} from '../../engine/conservationState';

interface ConservationInstructionsProps {
  state: ConservationState;
  dispatch: React.Dispatch<ConservationAction>;
  mistakeMessage: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ConservationInstructions: React.FC<ConservationInstructionsProps> = ({
  state,
  dispatch,
  mistakeMessage,
  isCollapsed,
  onToggleCollapse,
}) => {
  const currentStepIndex = CONSERVATION_STEP_ORDER.indexOf(state.step);
  const currentInstruction = getConservationStepInstruction(state);

  // Observation-specific step buttons
  const showObserveButton = state.step === ConservationStep.OBSERVE && state.precipitateFormed;
  const showMixButton = state.step === ConservationStep.MIX_REACTANTS && !state.isMixing;

  return (
    <div style={{ padding: isCollapsed ? '8px 4px' : '10px', height: '100%', overflow: 'auto' }}>
      {/* Collapse toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          marginBottom: 8,
          padding: '4px 0',
        }}
      >
        {!isCollapsed && (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
            }}
          >
            Instructions
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            padding: '2px 4px',
            borderRadius: 4,
          }}
        >
          {isCollapsed ? '←' : '→'}
        </button>
      </div>

      {isCollapsed ? (
        <div style={{ textAlign: 'center', fontSize: 18 }}>📋</div>
      ) : (
        <>
          {/* Current Instruction */}
          <div
            className="glass-card"
            style={{
              padding: '12px',
              marginBottom: 12,
              background: 'rgba(5, 150, 105, 0.04)',
              border: '1px solid rgba(5, 150, 105, 0.15)',
            }}
          >
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#059669',
                marginBottom: 6,
              }}
            >
              Current Step
            </div>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                fontWeight: 500,
              }}
            >
              {currentInstruction}
            </p>

            {/* Action buttons for specific steps */}
            {showMixButton && (
              <button
                id="btn-mix-reactants"
                className="btn-primary"
                onClick={() => {
                  dispatch({ type: 'MIX_REACTANTS_START' });
                  setTimeout(() => dispatch({ type: 'MIX_REACTANTS_END' }), 2000);
                }}
                style={{ marginTop: 10, fontSize: '0.72rem', padding: '6px 14px', width: '100%' }}
              >
                🔄 Invert Flask to Mix
              </button>
            )}
            {state.isMixing && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: '0.72rem',
                  color: '#059669',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                ⏳ Mixing in progress...
              </div>
            )}
            {showObserveButton && (
              <button
                id="btn-finish-observe"
                className="btn-primary"
                onClick={() => dispatch({ type: 'FINISH_OBSERVE' })}
                style={{ marginTop: 10, fontSize: '0.72rem', padding: '6px 14px', width: '100%' }}
              >
                ✅ I've Observed the Precipitate → Continue
              </button>
            )}
          </div>

          {/* Mistake Message */}
          {mistakeMessage && (
            <div
              className="animate-slide-in-up"
              style={{
                padding: '10px',
                marginBottom: 12,
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 8,
                fontSize: '0.75rem',
                color: '#b45309',
                lineHeight: 1.5,
              }}
            >
              ⚠️ {mistakeMessage}
            </div>
          )}

          {/* Step Checklist */}
          <div
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              marginBottom: 8,
            }}
          >
            Progress
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {CONSERVATION_STEP_ORDER.filter(
              (s) => s !== ConservationStep.SELECT && s !== ConservationStep.RESULTS
            ).map((step, i) => {
              const stepIndex = CONSERVATION_STEP_ORDER.indexOf(step);
              const isCompleted = stepIndex < currentStepIndex;
              const isCurrent = stepIndex === currentStepIndex;

              return (
                <div
                  key={step}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 8px',
                    borderRadius: 6,
                    background: isCurrent
                      ? 'rgba(5, 150, 105, 0.06)'
                      : 'transparent',
                    border: isCurrent
                      ? '1px solid rgba(5, 150, 105, 0.15)'
                      : '1px solid transparent',
                  }}
                >
                  {/* Step indicator */}
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.55rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      ...(isCompleted
                        ? {
                            background: '#059669',
                            color: '#ffffff',
                          }
                        : isCurrent
                          ? {
                              background: 'rgba(5, 150, 105, 0.12)',
                              color: '#059669',
                              border: '1.5px solid #059669',
                            }
                          : {
                              background: 'rgba(148, 163, 184, 0.1)',
                              color: 'var(--text-muted)',
                              border: '1px solid rgba(148, 163, 184, 0.2)',
                            }),
                    }}
                  >
                    {isCompleted ? '✓' : i + 1}
                  </div>

                  {/* Step label */}
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCompleted
                        ? '#059669'
                        : isCurrent
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                    }}
                  >
                    {CONSERVATION_STEP_LABELS[step]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chemical info */}
          <div
            style={{
              marginTop: 16,
              padding: '10px',
              background: 'rgba(59, 130, 246, 0.04)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#2563eb',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Reaction
            </div>
            <p
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl
            </p>
            <p
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                marginTop: 4,
              }}
            >
              Double Displacement (Metathesis)
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ConservationInstructions;
