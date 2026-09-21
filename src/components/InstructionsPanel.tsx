import React, { useState } from 'react';
import type { TitrationState, TitrationAction } from '../engine/titrationState';
import { Step, STEP_ORDER, STEP_LABELS, getStepInstruction } from '../engine/titrationState';
import { useLanguage } from '../i18n/LanguageContext';
import { EXPERIMENT_TRANSLATIONS } from '../i18n/experimentTranslations';
import { getStepWhyExplanation } from '../data/experimentWhyData';
import ContextualWhyModal from './common/ContextualWhyModal';
import ExperimentSafetyModal from './common/ExperimentSafetyModal';

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
  const [safetyModalOpen, setSafetyModalOpen] = useState<boolean>(false);
  const currentStepIndex = STEP_ORDER.indexOf(state.step);

  const getLocalizedInstruction = (): string => {
    const expTrans = EXPERIMENT_TRANSLATIONS['titration']?.[language];
    if (expTrans?.steps[state.step]) {
      const stepTrans = expTrans.steps[state.step];
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
            <button
              id="btn-instructions-safety-titration"
              type="button"
              onClick={() => setSafetyModalOpen(true)}
              aria-label={t('safety.buttonAria', 'Open Experiment Safety Center')}
              title={t('safety.subtitle', 'Essential precautions & laboratory safety guidance')}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#d97706',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                padding: '2px 7px',
                borderRadius: 5,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.22)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>🛡️</span>
              <span>{t('safety.buttonLabel', 'Safety')}</span>
            </button>
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

      {/* Experiment Safety Center Modal */}
      <ExperimentSafetyModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
        experimentId="titration"
        experimentTitle={EXPERIMENT_TRANSLATIONS['titration']?.[language]?.title || 'Acid-Base Titration (HCl vs NaOH)'}
      />
    </div>
  );
};

export default InstructionsPanel;
