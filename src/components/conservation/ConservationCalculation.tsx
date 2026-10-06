import React, { useState } from 'react';
import type { ConservationAction } from '../../engine/conservationState';
import {
  validateDeltaM,
  validateDeviationPercent,
} from '../../engine/conservationRules';
import { useLanguage } from '../../i18n/LanguageContext';

interface ConservationCalculationProps {
  m1: number;
  m2: number;
  dispatch: React.Dispatch<ConservationAction>;
}

const ConservationCalculation: React.FC<ConservationCalculationProps> = ({ m1, m2, dispatch }) => {
  const { t, language } = useLanguage();
  const [deltaMInput, setDeltaMInput] = useState('');
  const [deviationInput, setDeviationInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [deltaMResult, setDeltaMResult] = useState<ReturnType<typeof validateDeltaM> | null>(null);
  const [deviationResult, setDeviationResult] = useState<ReturnType<typeof validateDeviationPercent> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentDeltaM = parseFloat(deltaMInput);
    const studentDeviation = parseFloat(deviationInput);

    if (isNaN(studentDeltaM) || isNaN(studentDeviation)) {
      return;
    }

    const dmResult = validateDeltaM(studentDeltaM, m1, m2);
    const dvResult = validateDeviationPercent(studentDeviation, m1, m2);

    setDeltaMResult(dmResult);
    setDeviationResult(dvResult);
    setSubmitted(true);
    // Explicit user action required to continue — no automatic timeout/navigation
  };

  const handleContinueToNextStep = () => {
    const studentDeltaM = parseFloat(deltaMInput);
    const studentDeviation = parseFloat(deviationInput);
    const correct = (deltaMResult?.correct && deviationResult?.correct) ?? false;

    dispatch({
      type: 'SUBMIT_CALCULATION',
      payload: {
        deltaM: studentDeltaM,
        deviationPercent: studentDeviation,
        correct,
      },
    });
  };

  const isAllCorrect = deltaMResult?.correct && deviationResult?.correct;

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: '32px 28px',
        maxWidth: 560,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        borderRadius: 16,
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            minWidth: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(13, 148, 136, 0.15))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(5, 150, 105, 0.25)',
          }}
        >
          <span style={{ fontSize: 24 }}>🧮</span>
        </div>
        <div>
          <h2
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {t('conservation.calcTitle', 'Calculate Mass Difference')}
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {t('conservation.calcSubtitle', 'Use your recorded masses to verify the Law of Conservation of Mass.')}
          </p>
        </div>
      </div>

      {/* Recorded values */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 20,
          padding: '16px 20px',
          background: 'rgba(5, 150, 105, 0.04)',
          borderRadius: 12,
          border: '1px solid rgba(5, 150, 105, 0.15)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('conservation.initialMass', 'Initial Mass (M₁)')}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {m1.toFixed(2)} g
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563eb', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('conservation.finalMass', 'Final Mass (M₂)')}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {m2.toFixed(2)} g
          </div>
        </div>
      </div>

      {/* Formulas reference */}
      <div
        style={{
          marginBottom: 24,
          padding: '12px 18px',
          background: 'var(--bg-secondary)',
          borderRadius: 10,
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {t('conservation.formulas', 'Formulas:')}
        </div>
        <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', lineHeight: 1.8 }}>
          <div><strong>ΔM</strong> = |M₂ − M₁|</div>
          <div><strong>Deviation %</strong> = (ΔM / M₁) × 100</div>
        </div>
      </div>

      {/* Input fields Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
        {/* Field 1: Delta M */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label
            htmlFor="delta-m-input"
            style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}
          >
            {t('conservation.deltaMLabel', 'ΔM (mass difference in grams)')}
          </label>
          <input
            id="delta-m-input"
            type="number"
            step="0.01"
            value={deltaMInput}
            onChange={(e) => setDeltaMInput(e.target.value)}
            disabled={submitted}
            placeholder="e.g. 0.00"
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)',
              borderRadius: 8,
              border: submitted
                ? deltaMResult?.correct
                  ? '2px solid #059669'
                  : '2px solid #dc2626'
                : '1px solid var(--border)',
              background: 'var(--bg-card)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease',
            }}
          />
          {submitted && deltaMResult && (
            deltaMResult.correct ? (
              <div
                style={{
                  marginTop: 6,
                  padding: '8px 12px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  color: '#166534',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>✅</span>
                <span>{language === 'hi' ? 'ΔM सही है!' : language === 'mr' ? 'ΔM बरोबर आहे!' : 'ΔM is correct!'}</span>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 6,
                  padding: '10px 14px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  color: '#991b1b',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.6,
                }}
              >
                {deltaMResult.workedFormula}
              </div>
            )
          )}
        </div>

        {/* Field 2: Deviation % */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label
            htmlFor="deviation-input"
            style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}
          >
            {t('conservation.deviationLabel', 'Deviation % (percentage mass deviation)')}
          </label>
          <input
            id="deviation-input"
            type="number"
            step="0.001"
            value={deviationInput}
            onChange={(e) => setDeviationInput(e.target.value)}
            disabled={submitted}
            placeholder="e.g. 0.00"
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)',
              borderRadius: 8,
              border: submitted
                ? deviationResult?.correct
                  ? '2px solid #059669'
                  : '2px solid #dc2626'
                : '1px solid var(--border)',
              background: 'var(--bg-card)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease',
            }}
          />
          {submitted && deviationResult && (
            deviationResult.correct ? (
              <div
                style={{
                  marginTop: 6,
                  padding: '8px 12px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  color: '#166534',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>✅</span>
                <span>{language === 'hi' ? 'विचलन % सही है!' : language === 'mr' ? 'विचलन % बरोबर आहे!' : 'Deviation % is correct!'}</span>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 6,
                  padding: '10px 14px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  color: '#991b1b',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.6,
                }}
              >
                {deviationResult.workedFormula}
              </div>
            )
          )}
        </div>

        {/* Submit button (Initial check) */}
        {!submitted && (
          <button
            type="submit"
            id="btn-submit-conservation-calc"
            className="btn-primary"
            disabled={!deltaMInput || !deviationInput}
            style={{
              width: '100%',
              padding: '14px 20px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: (!deltaMInput || !deviationInput) ? 'not-allowed' : 'pointer',
              marginTop: 4,
            }}
          >
            {t('conservation.submitCalc', 'Submit Calculation')}
          </button>
        )}
      </form>

      {/* Post-submission Result Summary Card & Explicit Continue Button */}
      {submitted && (
        <div className="animate-slide-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              padding: '16px 18px',
              borderRadius: 10,
              background: isAllCorrect ? '#f0fdf4' : '#fffbeb',
              border: `1px solid ${isAllCorrect ? '#bbf7d0' : '#fde68a'}`,
              fontSize: '0.86rem',
              color: isAllCorrect ? '#166534' : '#92400e',
              lineHeight: 1.6,
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            {isAllCorrect ? (
              <>{language === 'hi' ? '✅ दोनों गणनाएं सही हैं! द्रव्यमान पूरी तरह संरक्षित है।' : language === 'mr' ? '✅ दोन्ही गणने बरोबर आहेत! वस्तुमान पूर्णपणे संरक्षित आहे.' : '✅ Both calculations correct! Mass is strictly conserved.'}</>
            ) : (
              <>{language === 'hi' ? '⚠️ कुछ गणनाओं में त्रुटि है। ऊपर दिए गए सही समाधान देखें।' : language === 'mr' ? '⚠️ काही गणनेत त्रुटी आहे. वरील योग्य सोडवणूक पहा.' : '⚠️ Some calculations need correction. See the worked formulas above.'}</>
            )}
          </div>

          {/* Explicit User-Controlled Progression Button */}
          <button
            type="button"
            id="btn-continue-conservation-next"
            className="btn-primary"
            onClick={handleContinueToNextStep}
            style={{
              width: '100%',
              padding: '14px 24px',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 10,
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
            }}
          >
            <span>{language === 'hi' ? 'अगले चरण पर जाएँ →' : language === 'mr' ? 'पुढील चरणावर जा →' : 'Continue to Next Step →'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ConservationCalculation;

