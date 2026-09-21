import React, { useState } from 'react';
import type { ConservationState, ConservationAction } from '../../engine/conservationState';
import {
  ConservationStep,
  CONSERVATION_STEP_ORDER,
  CONSERVATION_STEP_LABELS,
  getConservationStepInstruction,
} from '../../engine/conservationState';
import { useLanguage } from '../../i18n/LanguageContext';
import { EXPERIMENT_TRANSLATIONS } from '../../i18n/experimentTranslations';
import { getStepWhyExplanation } from '../../data/experimentWhyData';
import ContextualWhyModal from '../common/ContextualWhyModal';
import ExperimentSafetyModal from '../common/ExperimentSafetyModal';

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
  const { t, tStep, tDynamic, language } = useLanguage();
  const [whyModalOpen, setWhyModalOpen] = useState<boolean>(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState<boolean>(false);
  const currentStepIndex = CONSERVATION_STEP_ORDER.indexOf(state.step);
  const stepData = tStep(
    'conservation',
    state.step,
    CONSERVATION_STEP_LABELS[state.step],
    getConservationStepInstruction(state)
  );

  let currentInstruction = stepData.instruction;
  if (state.step === ConservationStep.SETUP_FLASK) {
    if (!state.flaskPlaced) {
      currentInstruction = language === 'hi'
        ? 'टूलबॉक्स से शंक्वाकार फ्लास्क को लैब बेंच पर रखें।'
        : language === 'mr'
          ? 'टूलबॉक्समधून शंकूपात्र लॅब बेंचवर ठेवा.'
          : 'Drag the Conical Flask from the toolbox onto the lab bench.';
    } else if (!state.na2so4Poured) {
      currentInstruction = language === 'hi'
        ? '10 mL सोडियम सल्फेट विलयन डालने के लिए Na₂SO₄ बोतल को फ्लास्क पर ले जाएं।'
        : language === 'mr'
          ? '10 mL सोडियम सल्फेट द्रावण ओतण्यासाठी Na₂SO₄ बाटली फ्लास्कवर ओढा.'
          : 'Drag the Na₂SO₄ bottle onto the flask to pour 10 mL of sodium sulfate solution.';
    }
  }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
              }}
            >
              {t('lab.instructions', 'Instructions')}
            </span>
            <button
              id="btn-instructions-safety-conservation"
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
                fontSize: '0.66rem',
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
          {(() => {
            const whyExplanation = getStepWhyExplanation('conservation', state.step, language);

            return (
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#059669',
                    }}
                  >
                    {t('lab.currentInstruction', 'Current Step')}
                  </div>

                  {/* Contextual Why Button */}
                  {whyExplanation && (
                    <button
                      id="btn-step-why-conservation"
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
                        background: 'rgba(5, 150, 105, 0.12)',
                        border: '1px solid rgba(5, 150, 105, 0.35)',
                        color: '#059669',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(5, 150, 105, 0.22)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(5, 150, 105, 0.12)';
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
                {t('conservation.invertFlask', '🔄 Invert Flask to Mix')}
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
                {t('conservation.mixingProgress', '⏳ Mixing in progress...')}
              </div>
            )}
            {showObserveButton && (
              <button
                id="btn-finish-observe"
                className="btn-primary"
                onClick={() => dispatch({ type: 'FINISH_OBSERVE' })}
                style={{ marginTop: 10, fontSize: '0.72rem', padding: '6px 14px', width: '100%' }}
              >
                {t('conservation.observedPrecipitate', '✅ I\'ve Observed the Precipitate → Continue')}
              </button>
            )}
            </div>
          );
        })()}

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
              ⚠️ {tDynamic(mistakeMessage)}
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
            {t('common.step', 'Progress')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {CONSERVATION_STEP_ORDER.filter(
              (s) => s !== ConservationStep.SELECT && s !== ConservationStep.RESULTS
            ).map((step, i) => {
              const stepIndex = CONSERVATION_STEP_ORDER.indexOf(step);
              const isCompleted = stepIndex < currentStepIndex;
              const isCurrent = stepIndex === currentStepIndex;
              const stepTitle = tStep('conservation', step, CONSERVATION_STEP_LABELS[step], '').title;

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
                    {stepTitle}
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
              {t('conservation.reaction', 'Reaction')}
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
              {t('conservation.reactionType', 'Double Displacement (Metathesis)')}
            </p>
          </div>
        </>
      )}

      {/* Contextual Why Explanation Modal */}
      {(() => {
        const whyExplanation = getStepWhyExplanation('conservation', state.step, language);

        return (
          <ContextualWhyModal
            isOpen={whyModalOpen}
            onClose={() => setWhyModalOpen(false)}
            stepTitle={stepData.title}
            conceptTitle={whyExplanation?.conceptTitle}
            explanation={whyExplanation?.explanation || ''}
          />
        );
      })()}

      {/* Experiment Safety Center Modal */}
      <ExperimentSafetyModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
        experimentId="conservation"
        experimentTitle={EXPERIMENT_TRANSLATIONS['conservation']?.[language]?.title || 'Law of Conservation of Mass'}
      />
    </div>
  );
};

export default ConservationInstructions;
