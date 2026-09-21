import React from 'react';
import type { TitrationState, TitrationAction } from '../engine/titrationState';
import { Step, STEP_ORDER, STEP_LABELS, getStepInstruction } from '../engine/titrationState';
import { useLanguage } from '../i18n/LanguageContext';
import { EXPERIMENT_TRANSLATIONS } from '../i18n/experimentTranslations';

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
          <h2
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
            }}
          >
            {t('lab.instructions', 'Instructions')}
          </h2>
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
                fontSize: '0.65rem',
                color: '#1d4ed8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 6,
                fontWeight: 700,
              }}
            >
              {t('lab.currentInstruction', 'Current Step')}
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
    </div>
  );
};

export default InstructionsPanel;
