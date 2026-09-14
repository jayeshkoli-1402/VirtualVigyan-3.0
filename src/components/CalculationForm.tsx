import React, { useState } from 'react';
import type { TitrationAction } from '../engine/titrationState';
import { validateConcentration, evaluateEndpoint } from '../engine/validation';

interface CalculationFormProps {
  markedVolume: number;
  dispatch: React.Dispatch<TitrationAction>;
}

const CalculationForm: React.FC<CalculationFormProps> = ({ markedVolume, dispatch }) => {
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof validateConcentration> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const concentration = parseFloat(inputValue);
    if (isNaN(concentration) || concentration <= 0) return;

    const validationResult = validateConcentration(concentration, markedVolume);
    setResult(validationResult);
    setSubmitted(true);
  };

  const handleContinue = () => {
    const concentration = parseFloat(inputValue);
    const endpointEval = evaluateEndpoint(markedVolume);

    let score = 0;
    if (endpointEval.accuracy === 'excellent') score += 40;
    else if (endpointEval.accuracy === 'good') score += 25;
    else score += 10;

    if (result?.correct) score += 40;
    else score += 10;

    score += 10; // indicator added
    if (markedVolume <= 27) score += 10; // no overshoot

    dispatch({
      type: 'SUBMIT_CALCULATION',
      payload: { concentration, correct: result?.correct ?? false },
    });
    dispatch({ type: 'COMPUTE_SCORE', payload: { score } });
  };

  return (
    <div className="glass-card animate-slide-in-up" style={{ padding: '24px' }}>
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: 6,
          color: 'var(--text-primary)',
        }}
      >
        Calculate Unknown Concentration
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 20, lineHeight: 1.5 }}>
        Using your recorded endpoint volume, calculate the molar concentration of the unknown HCl solution.
      </p>

      {/* Given values */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 10,
            fontWeight: 700,
          }}
        >
          Given Experimental Values
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>V<sub>NaOH</sub> (your reading):</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
            {markedVolume.toFixed(1)} mL
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>M<sub>NaOH</sub> (known):</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
            0.100 M
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>V<sub>HCl</sub> (flask volume):</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
            25.0 mL
          </div>
        </div>
      </div>

      {/* Formula hint */}
      <div
        style={{
          background: 'var(--accent-glow)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 12,
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Formula: </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
          M<sub>HCl</sub> = (V<sub>NaOH</sub> × M<sub>NaOH</sub>) / V<sub>HCl</sub>
        </span>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
          Calculated HCl Concentration (M):
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            id="input-concentration"
            type="number"
            step="any"
            min="0"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setSubmitted(false); }}
            placeholder="e.g. 0.100"
            disabled={submitted && (result?.correct ?? false)}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'var(--bg-card)',
              border: `1px solid ${submitted ? (result?.correct ? '#16a34a' : '#dc2626') : '#cbd5e1'}`,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
          />
          {!submitted && (
            <button
              id="btn-check-answer"
              type="submit"
              className="btn-primary"
              disabled={!inputValue || parseFloat(inputValue) <= 0}
            >
              Verify Answer
            </button>
          )}
        </div>
      </form>

      {/* Result feedback */}
      {submitted && result && (
        <div className="animate-fade-in" style={{ marginTop: 16 }}>
          {result.correct ? (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-md)',
                padding: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>
                  Correct Calculation!
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                Your answer is within ±10% tolerance of the expected concentration ({result.expected.toFixed(4)} M).
              </p>
            </div>
          ) : (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                padding: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>❌</span>
                <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.9rem' }}>
                  Calculation Error
                </span>
              </div>
              <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: 10, lineHeight: 1.5 }}>
                Here is the correct worked formula:
              </p>
              <pre
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 12,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#b45309',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                }}
              >
                {result.workedFormula}
              </pre>
            </div>
          )}

          <button
            id="btn-continue-results"
            className="btn-primary"
            onClick={handleContinue}
            style={{ width: '100%', marginTop: 16 }}
          >
            Continue to Results →
          </button>
        </div>
      )}
    </div>
  );
};

export default CalculationForm;
