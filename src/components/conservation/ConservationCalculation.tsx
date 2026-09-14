import React, { useState } from 'react';
import type { ConservationAction } from '../../engine/conservationState';
import {
  validateDeltaM,
  validateDeviationPercent,
} from '../../engine/conservationRules';

interface ConservationCalculationProps {
  m1: number;
  m2: number;
  dispatch: React.Dispatch<ConservationAction>;
}

const ConservationCalculation: React.FC<ConservationCalculationProps> = ({ m1, m2, dispatch }) => {
  const [deltaMInput, setDeltaMInput] = useState('');
  const [deviationInput, setDeviationInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [deltaMResult, setDeltaMResult] = useState<ReturnType<typeof validateDeltaM> | null>(null);
  const [deviationResult, setDeviationResult] = useState<ReturnType<typeof validateDeviationPercent> | null>(null);

  const handleSubmit = () => {
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

    const correct = dmResult.correct && dvResult.correct;

    // Submit after a delay to show feedback
    setTimeout(() => {
      dispatch({
        type: 'SUBMIT_CALCULATION',
        payload: {
          deltaM: studentDeltaM,
          deviationPercent: studentDeviation,
          correct,
        },
      });
    }, 3000);
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: 28, maxWidth: 520 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(13, 148, 136, 0.12))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            border: '1px solid rgba(5, 150, 105, 0.2)',
          }}
        >
          <span style={{ fontSize: 22 }}>🧮</span>
        </div>
        <h2
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}
        >
          Calculate Mass Difference
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Use your recorded masses to verify the Law of Conservation of Mass.
        </p>
      </div>

      {/* Recorded values */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 24,
          padding: '14px',
          background: 'rgba(5, 150, 105, 0.04)',
          borderRadius: 10,
          border: '1px solid rgba(5, 150, 105, 0.1)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#059669', marginBottom: 4, textTransform: 'uppercase' }}>
            Initial Mass (M₁)
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {m1.toFixed(2)} g
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', marginBottom: 4, textTransform: 'uppercase' }}>
            Final Mass (M₂)
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {m2.toFixed(2)} g
          </div>
        </div>
      </div>

      {/* Formulas reference */}
      <div
        style={{
          marginBottom: 20,
          padding: '10px 14px',
          background: 'var(--bg-secondary)',
          borderRadius: 8,
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
          Formulas:
        </div>
        <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          ΔM = |M₂ - M₁|<br />
          Deviation % = (ΔM / M₁) × 100
        </div>
      </div>

      {/* Input fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        <div>
          <label
            htmlFor="delta-m-input"
            style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}
          >
            ΔM (mass difference in grams)
          </label>
          <input
            id="delta-m-input"
            type="number"
            step="0.01"
            value={deltaMInput}
            onChange={(e) => setDeltaMInput(e.target.value)}
            disabled={submitted}
            placeholder="e.g. 0.01"
            style={{
              width: '100%',
              padding: '10px 14px',
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
            }}
          />
          {submitted && deltaMResult && !deltaMResult.correct && (
            <div
              style={{
                marginTop: 6,
                padding: '8px 10px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 6,
                fontSize: '0.72rem',
                color: '#991b1b',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'pre-line',
                lineHeight: 1.5,
              }}
            >
              {deltaMResult.workedFormula}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="deviation-input"
            style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}
          >
            Deviation % (percentage mass deviation)
          </label>
          <input
            id="deviation-input"
            type="number"
            step="0.001"
            value={deviationInput}
            onChange={(e) => setDeviationInput(e.target.value)}
            disabled={submitted}
            placeholder="e.g. 0.008"
            style={{
              width: '100%',
              padding: '10px 14px',
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
            }}
          />
          {submitted && deviationResult && !deviationResult.correct && (
            <div
              style={{
                marginTop: 6,
                padding: '8px 10px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 6,
                fontSize: '0.72rem',
                color: '#991b1b',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'pre-line',
                lineHeight: 1.5,
              }}
            >
              {deviationResult.workedFormula}
            </div>
          )}
        </div>
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          id="btn-submit-conservation-calc"
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!deltaMInput || !deviationInput}
          style={{ width: '100%', padding: '12px 20px' }}
        >
          Submit Calculation
        </button>
      )}

      {/* Post-submission feedback */}
      {submitted && (
        <div
          className="animate-slide-in-up"
          style={{
            padding: '12px',
            borderRadius: 8,
            background: deltaMResult?.correct && deviationResult?.correct
              ? '#f0fdf4'
              : '#fffbeb',
            border: `1px solid ${deltaMResult?.correct && deviationResult?.correct ? '#bbf7d0' : '#fde68a'}`,
            fontSize: '0.82rem',
            color: deltaMResult?.correct && deviationResult?.correct ? '#166534' : '#92400e',
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          {deltaMResult?.correct && deviationResult?.correct ? (
            <>✅ Both calculations correct! Mass is conserved. Proceeding to results...</>
          ) : (
            <>⚠️ Some calculations need correction. See the worked formulas above. Proceeding to results...</>
          )}
        </div>
      )}
    </div>
  );
};

export default ConservationCalculation;
