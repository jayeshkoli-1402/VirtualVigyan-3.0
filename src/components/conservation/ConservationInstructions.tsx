import React, { useState } from 'react';
import type { ConservationState, ConservationAction } from '../../engine/conservationState';
import {
  ConservationStep,
  CONSERVATION_STEP_ORDER,
  CONSERVATION_STEP_LABELS,
  getConservationStepInstruction,
} from '../../engine/conservationState';
import { canMixReactants } from '../../engine/conservationValidation';
import { useLanguage } from '../../i18n/LanguageContext';
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
  const { t, tStep, language } = useLanguage();
  const [whyModalOpen, setWhyModalOpen] = useState<boolean>(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState<boolean>(false);

  const progressSteps = CONSERVATION_STEP_ORDER.filter(
    (s) => s !== ConservationStep.SELECT && s !== ConservationStep.RESULTS
  );
  const currentStepNum = (progressSteps as ConservationStep[]).indexOf(state.step) >= 0
    ? (progressSteps as ConservationStep[]).indexOf(state.step) + 1
    : 1;

  const currentStepIndex = CONSERVATION_STEP_ORDER.indexOf(state.step);

  const stepData = tStep(
    'conservation-of-mass',
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
        ? '5 mL सोडियम सल्फेट विलयन डालने के लिए Na₂SO₄ बोतल को फ्लास्क पर ले जाएं।'
        : language === 'mr'
          ? '5 mL सोडियम सल्फेट द्रावण ओतण्यासाठी Na₂SO₄ बाटली फ्लास्कवर ओढा.'
          : 'Drag the Na₂SO₄ bottle onto the flask to pour 5 mL of sodium sulfate solution.';
    }
  }

  const whyExplanation =
    getStepWhyExplanation('conservation-of-mass', state.step as any, language) ||
    getStepWhyExplanation('conservation', state.step as any, language);

  const showMixButton = state.step === ConservationStep.MIX_REACTANTS && !state.isMixing;
  const showObserveButton = state.step === ConservationStep.OBSERVE && state.precipitateFormed;
  const showProceedCalcButton = state.finalMass !== null;

  if (isCollapsed) {
    return (
      <div style={{ padding: '8px 4px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={onToggleCollapse}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            padding: '2px 4px',
            borderRadius: 4,
            border: '1px solid var(--border)',
            marginBottom: 10,
          }}
        >
          ←
        </button>
        <span style={{ fontSize: 18 }}>📋</span>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '12px 14px 20px 14px',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* ── Header: INSTRUCTIONS & Safety Button (Matching Reference UI) ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            {t('conservation.instructions', 'INSTRUCTIONS')}
          </h2>
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
        <button
          onClick={onToggleCollapse}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            padding: '2px 4px',
            borderRadius: 4,
            border: '1px solid var(--border)',
          }}
        >
          →
        </button>
      </div>

      {/* ── Active Step Card (Matching GenericInstructions blue/indigo style) ── */}
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(13, 148, 136, 0.06))',
          border: '1.5px solid rgba(37, 99, 235, 0.22)',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.06)',
        }}
      >
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#1d4ed8',
            letterSpacing: '0.02em',
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6,
          }}
        >
          <span>{currentStepNum}. {stepData.title}</span>

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

        <div
          style={{
            fontSize: '0.8125rem',
            lineHeight: 1.5,
            color: 'var(--text-primary)',
            fontWeight: 450,
          }}
        >
          {currentInstruction}
        </div>
      </div>

      {/* ── Active Action Buttons ── */}
      {showMixButton && (
        <button
          id="btn-mix-solutions-instructions"
          type="button"
          className="btn-primary animate-fade-in"
          onClick={() => {
            const check = canMixReactants(state);
            if (!check.allowed) {
              if (check.message) dispatch({ type: 'ADD_MISTAKE', payload: { message: check.message } });
              return;
            }
            dispatch({ type: 'MIX_REACTANTS_START' });
            setTimeout(() => dispatch({ type: 'MIX_REACTANTS_END' }), 2000);
          }}
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
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span>{t('conservation.mixSolutions', 'Invert Flask to Mix Solutions →')}</span>
        </button>
      )}

      {showObserveButton && (
        <button
          id="btn-observe-continue"
          type="button"
          className="btn-primary animate-fade-in"
          onClick={() => dispatch({ type: 'FINISH_OBSERVE' })}
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
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span>{t('common.continue', 'Continue to Final Weighing →')}</span>
        </button>
      )}

      {showProceedCalcButton && (
        <button
          id="btn-proceed-calculation-conservation"
          type="button"
          className="btn-primary animate-fade-in"
          onClick={() => dispatch({ type: 'PROCEED_TO_CALCULATION' })}
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
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span>{t('conservation.proceedCalculation', 'Proceed to Calculation →')}</span>
        </button>
      )}

      {/* ── PROGRESS & ANALYTICS Checklist (Matching Reference UI) ── */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 8,
          }}
        >
          {t('conservation.progressAnalytics', 'PROGRESS & ANALYTICS')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {progressSteps.map((step, i) => {
            const stepIndex = CONSERVATION_STEP_ORDER.indexOf(step);
            const isCompleted = stepIndex < currentStepIndex || (step === ConservationStep.WEIGH_FINAL && state.finalMass !== null);
            const isCurrent = stepIndex === currentStepIndex && !isCompleted;
            const stepTitle = tStep('conservation-of-mass', step, CONSERVATION_STEP_LABELS[step], '').title;

            return (
              <div
                key={step}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: isCurrent ? 'rgba(37, 99, 235, 0.06)' : 'transparent',
                  fontSize: '0.72rem',
                  color: isCompleted
                    ? 'var(--accent-teal)'
                    : isCurrent
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    width: 14,
                    textAlign: 'center',
                    fontWeight: 700,
                    color: isCompleted
                      ? 'var(--accent-teal)'
                      : isCurrent
                        ? '#2563eb'
                        : 'var(--text-muted)',
                  }}
                >
                  {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                </span>
                <span style={{ textDecoration: 'none' }}>
                  {i + 1}. {stepTitle}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mistake message toast if triggered ── */}
      {mistakeMessage && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#b45309',
            fontSize: '0.75rem',
            lineHeight: 1.4,
            animation: 'slideInUp 0.2s ease-out',
          }}
        >
          ⚠️ {mistakeMessage}
        </div>
      )}

      {/* ── Alert / Caution Card (Matching Reference Yellow Card) ── */}
      <div
        style={{
          padding: '10px 12px',
          borderRadius: 'var(--radius-md)',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          color: '#b45309',
          fontSize: '0.72rem',
          lineHeight: 1.4,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 6,
        }}
      >
        <span style={{ fontSize: '0.8rem', flexShrink: 0 }}>⚠️</span>
        <span>{t('conservation.safetyNote', 'Keep the flask tightly sealed with the rubber cork to prevent evaporation or aerosol mass loss.')}</span>
      </div>

      {/* ── Governing Principle / Chemistry Card (Matching Reference Purple Card) ── */}
      <div
        style={{
          marginTop: 'auto',
          marginBottom: 4,
          padding: '12px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.05))',
          border: '1.5px solid rgba(99, 102, 241, 0.25)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#6366f1',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 6,
          }}
        >
          <span>⚖️</span>
          <span>{t('conservation.reactionTypeHeader', 'LAW OF CONSERVATION OF MASS')}</span>
        </div>
        <div
          style={{
            fontSize: '0.76rem',
            lineHeight: 1.45,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            wordBreak: 'break-word',
          }}
        >
          BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(s)↓ + 2NaCl(aq)
        </div>
        <div
          style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            marginTop: 4,
          }}
        >
          {t('conservation.massInvariance', 'm₁ (reactants) = m₂ (products) within ±0.02 g balance precision')}
        </div>
      </div>

      {/* Reset Experiment link at very bottom */}
      <div style={{ textAlign: 'center', paddingTop: 4 }}>
        <button
          id="btn-instructions-reset-conservation"
          type="button"
          onClick={() => dispatch({ type: 'RESET' })}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: 4,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          🔄 {t('common.reset', 'Reset Experiment')}
        </button>
      </div>

      {/* Contextual Why Explanation Modal */}
      <ContextualWhyModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        stepTitle={stepData.title}
        conceptTitle={whyExplanation?.conceptTitle}
        explanation={whyExplanation?.explanation || ''}
      />

      {/* Experiment Safety Center Modal */}
      <ExperimentSafetyModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
        experimentId="conservation-of-mass"
        experimentTitle={stepData.title}
      />
    </div>
  );
};

export default ConservationInstructions;
