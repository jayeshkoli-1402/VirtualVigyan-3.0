import React, { useState } from 'react';
import type { TitrationState, TitrationAction } from '../engine/titrationState';
import { Step, STEP_ORDER, STEP_LABELS, getStepInstruction } from '../engine/titrationState';
import { useLanguage } from '../i18n/LanguageContext';
import { EXPERIMENT_TRANSLATIONS } from '../i18n/experimentTranslations';
import { getStepWhyExplanation } from '../data/experimentWhyData';
import ContextualWhyModal from './common/ContextualWhyModal';

interface InstructionsPanelProps {
  state: TitrationState;
  dispatch?: React.Dispatch<TitrationAction>;
  mistakeMessage: string | null;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const InstructionsPanel: React.FC<InstructionsPanelProps> = ({
  state,
  dispatch,
  mistakeMessage,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { t, language, tDynamic } = useLanguage();
  const [whyModalOpen, setWhyModalOpen] = useState<boolean>(false);
  const currentStepIndex = STEP_ORDER.indexOf(state.step);

  const getLocalizedInstruction = (): string => {
    const expTrans = EXPERIMENT_TRANSLATIONS['titration']?.[language];
    if (expTrans?.steps[state.step]) {
      const stepTrans = expTrans.steps[state.step];
      if (state.step === Step.SETUP_STAND && stepTrans.dynamicInstructions) {
        if (!state.standPlaced) {
          return stepTrans.dynamicInstructions['place_stand'];
        }
        if (!state.flaskPlaced) {
          return stepTrans.dynamicInstructions['place_flask'];
        }
        if (!state.buretteMounted) {
          return stepTrans.dynamicInstructions['mount_burette'];
        }
      }
      if (state.step === Step.MEASURE_ACID && stepTrans.dynamicInstructions) {
        if (!state.hclPlaced) {
          return stepTrans.dynamicInstructions['place_hcl'];
        }
        if (!state.pipetteFilled) {
          return stepTrans.dynamicInstructions['draw_acid'];
        }
        if (!state.acidMeasured) {
          return stepTrans.dynamicInstructions['dispense_acid'];
        }
      }
      return stepTrans.instruction;
    }
    return getStepInstruction(state);
  };

  const getLocalizedStepLabel = (step: Step): string => {
    const expTrans = EXPERIMENT_TRANSLATIONS['titration']?.[language];
    if (expTrans?.steps[step]) {
      return expTrans.steps[step].title;
    }
    return STEP_LABELS[step];
  };

  const stepGuidance = EXPERIMENT_TRANSLATIONS['titration']?.[language]?.steps[state.step];

  return (
    <div
      id="instructions-panel"
      style={{
        padding: isCollapsed ? '12px 6px' : '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        height: '100%',
        overflowY: 'auto',
        alignItems: isCollapsed ? 'center' : 'stretch',
        transition: 'padding 0.2s ease',
      }}
    >
      {/* Header with Collapse/Expand Toggle Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          marginBottom: 2,
          borderBottom: '1px solid var(--border)',
          paddingBottom: 8,
          width: '100%',
        }}
      >
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                margin: 0,
              }}
            >
              {t('lab.instructions', 'Instructions')}
            </h2>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? t('lab.expand', 'Expand') : t('lab.collapse', 'Collapse')}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '3px 6px',
              fontSize: '0.65rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {isCollapsed ? '◀' : `${t('lab.collapse', 'Collapse')} ▶`}
          </button>
        )}
      </div>

      {!isCollapsed ? (
        <>
          {/* Current instruction */}
          {(() => {
            const whyExplanation = getStepWhyExplanation('titration', state.step, language);

            return (
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 'var(--radius-md)',
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.65rem',
                      color: '#1d4ed8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontWeight: 700,
                    }}
                  >
                    {t('lab.currentInstruction', 'Current Step')}
                  </div>

                  {/* Contextual Why Button */}
                  {whyExplanation && (
                    <button
                      id="btn-step-why-titration"
                      type="button"
                      onClick={() => setWhyModalOpen(true)}
                      aria-label={t('why.buttonAria', 'Learn the scientific reason behind this step')}
                      title={t('why.buttonAria', 'Learn the scientific reason behind this step')}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(37, 99, 235, 0.15)',
                        border: '1px solid rgba(37, 99, 235, 0.35)',
                        color: '#1d4ed8',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(37, 99, 235, 0.25)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ fontWeight: 800 }}>?</span>
                      <span>{t('why.buttonLabel', 'Why?')}</span>
                    </button>
                  )}
                </div>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {getLocalizedInstruction()}
            </p>

            {/* DO / DON'T guidance if available */}
            {stepGuidance?.doGuidance && (
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px dashed #bfdbfe', fontSize: '0.74rem' }}>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>✓ {t('lab.doGuidance', 'DO')}: </span>
                <span style={{ color: 'var(--text-secondary)' }}>{stepGuidance.doGuidance}</span>
              </div>
            )}
            {stepGuidance?.dontGuidance && (
              <div style={{ marginTop: 4, fontSize: '0.74rem' }}>
                <span style={{ fontWeight: 700, color: '#dc2626' }}>✕ {t('lab.dontGuidance', 'DON\'T')}: </span>
                <span style={{ color: 'var(--text-secondary)' }}>{stepGuidance.dontGuidance}</span>
              </div>
            )}
            </div>
          );
        })()}

          {/* ── Educational Neutralization Reaction Card ── */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              ⚗️ {t('lab.neutralizationReaction', 'Neutralization Reaction')}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary)',
                textAlign: 'center',
                padding: '4px 0',
              }}
            >
              HCl (aq) + NaOH (aq) → NaCl (aq) + H₂O (l)
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 2 }}>
              1 mol HCl reacts with 1 mol NaOH (1:1 stoichiometry)
            </div>
          </div>

          {/* ── Indicator & Endpoint Color Reference Card ── */}
          {(state.step === Step.ADD_INDICATOR || state.step === Step.TITRATING || state.step === Step.ENDPOINT_MARKED) && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(253, 242, 248, 0.9), rgba(255, 255, 255, 0.95))',
                border: '1px solid #fbcfe8',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
              }}
            >
              <div
                style={{
                  fontSize: '0.62rem',
                  color: '#be185d',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 700,
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>💧</span>
                <span>{t('lab.endpointGuide', 'Phenolphthalein Endpoint Guide')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid #94a3b8', background: 'rgba(255,255,255,0.9)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}><strong>Acidic / Initial:</strong> Colourless (pH &lt; 8.2)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid #ec4899', background: 'rgba(244, 114, 182, 0.65)' }} />
                  <span style={{ color: '#9d174d' }}><strong>Endpoint:</strong> Persistent Pale Pink (Stop here!)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid #be185d', background: 'rgba(219, 39, 119, 0.9)' }} />
                  <span style={{ color: '#831843' }}><strong>Overshot:</strong> Deep Magenta / Dark Pink (Excess Base)</span>
                </div>
              </div>
            </div>
          )}

          {/* Action button for ENDPOINT_MARKED */}
          {state.step === Step.ENDPOINT_MARKED && dispatch && (
            <button
              id="btn-proceed-calculation"
              className="btn-primary"
              onClick={() => dispatch({ type: 'PROCEED_TO_CALCULATION' })}
              style={{ width: '100%', padding: '10px 14px' }}
            >
              {t('lab.proceedCalculation', 'Proceed to Calculation →')}
            </button>
          )}

          {/* Mistake message */}
          {mistakeMessage && (
            <div
              className="animate-fade-in"
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: '0.65rem',
                  color: '#b45309',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 4,
                  fontWeight: 700,
                }}
              >
                ⚠️ {t('lab.notice', 'Notice')}
              </div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#92400e',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {tDynamic(mistakeMessage)}
              </p>
            </div>
          )}

          {/* Step checklist */}
          <div>
            <div
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
                fontWeight: 700,
              }}
            >
              {t('common.step', 'Step')} Checklist
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {STEP_ORDER.map((step, i) => {
                const isCompleted = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;

                return (
                  <div
                    key={step}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: isCurrent
                        ? '#eff6ff'
                        : 'transparent',
                      border: isCurrent ? '1px solid #dbeafe' : '1px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Status indicator */}
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        border: isCompleted
                          ? '1.5px solid #16a34a'
                          : isCurrent
                            ? '1.5px solid #2563eb'
                            : '1.5px solid #cbd5e1',
                        background: isCompleted
                          ? '#f0fdf4'
                          : isCurrent
                            ? '#ffffff'
                            : '#f8fafc',
                        color: isCompleted
                          ? '#16a34a'
                          : isCurrent
                            ? '#2563eb'
                            : '#94a3b8',
                      }}
                    >
                      {isCompleted ? '✓' : i + 1}
                    </div>

                    {/* Label */}
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: isCurrent ? 600 : 400,
                        color: isCompleted
                          ? '#16a34a'
                          : isCurrent
                            ? '#1e40af'
                            : 'var(--text-secondary)',
                        opacity: isCompleted ? 0.9 : 1,
                      }}
                    >
                      {getLocalizedStepLabel(step)} {isCompleted && <span style={{ fontSize: '0.6rem', color: '#16a34a', marginLeft: 4 }}>✓</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Collapsed Slim Icon Progress Bar */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', marginTop: 8 }}>
          {STEP_ORDER.map((step, i) => {
            const isCompleted = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;

            return (
              <div
                key={step}
                title={`${i + 1}. ${STEP_LABELS[step]}${isCompleted ? ' (Completed ✓)' : isCurrent ? ' (Current)' : ''}`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  border: isCompleted
                    ? '1.5px solid #16a34a'
                    : isCurrent
                      ? '1.5px solid #2563eb'
                      : '1.5px solid #cbd5e1',
                  background: isCompleted
                    ? '#f0fdf4'
                    : isCurrent
                      ? '#eff6ff'
                      : '#ffffff',
                  color: isCompleted
                    ? '#16a34a'
                    : isCurrent
                      ? '#2563eb'
                      : '#94a3b8',
                }}
              >
                {isCompleted ? '✓' : i + 1}
              </div>
            );
          })}
        </div>
      )}

      {/* Contextual Why Explanation Modal */}
      {(() => {
        const whyExplanation = getStepWhyExplanation('titration', state.step, language);
        const expTrans = EXPERIMENT_TRANSLATIONS['titration']?.[language];
        const stepTitle = expTrans?.steps[state.step]?.title || STEP_LABELS[state.step];

        return (
          <ContextualWhyModal
            isOpen={whyModalOpen}
            onClose={() => setWhyModalOpen(false)}
            stepTitle={stepTitle}
            conceptTitle={whyExplanation?.conceptTitle}
            explanation={whyExplanation?.explanation || ''}
          />
        );
      })()}
    </div>
  );
};

export default InstructionsPanel;
