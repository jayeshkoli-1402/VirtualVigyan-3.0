/**
 * ═══════════════════════════════════════════════════════════════════
 *  GenericCalculation — Config-driven calculation form
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { ExperimentConfig, ExperimentState, ExperimentAction } from '../../engine/experimentConfig';
import { validateCalculation } from '../../engine/scoringEngine';

type GenericCalculationProps = {
  config: ExperimentConfig;
  state: ExperimentState;
  dispatch: React.Dispatch<ExperimentAction>;
};

const GenericCalculation: React.FC<GenericCalculationProps> = ({
  config,
  state,
  dispatch,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ReturnType<typeof validateCalculation> | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const calcConfig = config.calculation;
  if (!calcConfig) return null;

  const handleSubmit = () => {
    const numericAnswers: Record<string, number> = {};
    for (const field of calcConfig.fields) {
      numericAnswers[field.id] = parseFloat(answers[field.id] ?? '0') || 0;
    }

    const validationResults = validateCalculation(config, state, numericAnswers);
    setResults(validationResults);
    setSubmitted(true);

    // Dispatch to state
    dispatch({
      type: 'SUBMIT_CALCULATION',
      payload: { answers: numericAnswers },
    });
  };

  return (
    <div style={{
      maxWidth: 500,
      width: '100%',
      margin: '0 auto',
      padding: 24,
      animation: 'fadeIn 0.3s ease-out',
    }}>
      {/* Title */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 16 }}>
        <h2 style={{
          fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)',
          marginBottom: 6,
        }}>
          {calcConfig.title}
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {calcConfig.instruction}
        </p>

        {/* Real Mathematical Fraction Typography for Formulas */}
        {calcConfig.formulas && calcConfig.formulas.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
            {calcConfig.formulas.map((form, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-inset, #f8fafc)',
                  padding: '16px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border, #cbd5e1)',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                {form.label && (
                  <div style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: 'var(--accent-blue, #2563eb)',
                    marginBottom: 10,
                  }}>
                    {form.label}
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                  fontSize: '0.98rem',
                  color: 'var(--text-primary)',
                  overflowX: 'auto',
                  padding: '4px 0',
                }}>
                  <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    {form.symbol} =
                  </span>
                  <div style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    verticalAlign: 'middle',
                  }}>
                    <div style={{
                      padding: '0 12px 4px 12px',
                      borderBottom: '2px solid currentColor',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}>
                      {form.numerator}
                    </div>
                    <div style={{
                      padding: '4px 12px 0 12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}>
                      {form.denominator}
                    </div>
                  </div>
                  {form.unit && (
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                    }}>
                      {renderChemicalSubscripts(form.unit)}
                    </span>
                  )}
                </div>
                {form.notes && (
                  <div style={{
                    fontSize: '0.80rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginTop: 10,
                    borderTop: '1px solid var(--border, rgba(148, 163, 184, 0.3))',
                    paddingTop: 8,
                  }}>
                    {renderChemicalSubscripts(form.notes)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recorded values */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 16 }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
        }}>
          Recorded Values
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Object.entries(state.variables)
            .filter(([key]) => !key.startsWith('_') && !['stopcockOpen', 'maxFlowRate', 'pAlkalinity', 'mAlkalinity', 'mineralAcidity', 'totalAcidity'].includes(key))
            .map(([key, value]) => {
              const isMasked = calcConfig.hideRecordedValueKeys?.includes(key) || ['volumeA', 'volumeB', 'volumeY', 'volumeZ', 'volumeAdded'].includes(key);
              return (
                <div key={key} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '0.8rem', padding: '4px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {formatVariableName(key)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: isMasked ? 'var(--text-muted)' : 'inherit' }}>
                    {isMasked ? '— (Recorded by student)' : typeof value === 'number' ? value.toFixed(2) : value}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Input fields */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 16 }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12,
        }}>
          Your Calculation
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {calcConfig.fields.map(field => {
            const result = results?.find(r => r.fieldId === field.id);
            return (
              <div key={field.id}>
                <label style={{
                  display: 'block', fontSize: '0.78rem', fontWeight: 500,
                  color: 'var(--text-primary)', marginBottom: 4,
                }}>
                  {field.label}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    step="any"
                    placeholder={field.placeholder ?? 'Enter value...'}
                    value={answers[field.id] ?? ''}
                    onChange={e => setAnswers({ ...answers, [field.id]: e.target.value })}
                    disabled={submitted}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${
                        result ? (result.correct ? '#059669' : '#dc2626') : 'var(--border)'
                      }`,
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      background: submitted ? 'var(--bg-secondary)' : 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 30 }}>
                    {field.unit}
                  </span>
                </div>

                {/* Optional helper text & example explaining how to find this value */}
                {field.helperText && (
                  <div style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    marginTop: 6,
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-inset, rgba(148, 163, 184, 0.08))',
                    border: '1px solid var(--border, rgba(148, 163, 184, 0.25))',
                  }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {field.helperText}
                    </div>
                    {field.helperExample && (
                      <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>
                        {field.helperExample}
                      </div>
                    )}
                  </div>
                )}

                {/* Result feedback */}
                {result && (
                  <div style={{
                    marginTop: 8,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: result.correct ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                    border: `1.5px solid ${result.correct ? '#059669' : '#dc2626'}`,
                    fontSize: '0.78rem',
                    color: result.correct ? '#065f46' : '#991b1b',
                    lineHeight: 1.5,
                  }}>
                    {result.correct ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                          <span>✓</span>
                          <span>
                            {field.expectedRangeLabel
                              ? 'Correct — within acceptable experimental range'
                              : `Correct! (${result.expectedValue.toFixed(4)} ${field.unit})`}
                          </span>
                        </div>
                        {field.expectedRangeLabel && (
                          <div style={{ fontSize: '0.74rem', marginTop: 3, color: '#047857' }}>
                            Expected range: <strong>{field.expectedRangeLabel}</strong>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
                          <span>✗</span>
                          <span>
                            {field.expectedRangeLabel
                              ? 'Outside acceptable experimental range'
                              : `Incorrect (You entered: ${answers[field.id] || '0'} ${field.unit} — Expected: ${result.expectedValue.toFixed(4)} ${field.unit})`}
                          </span>
                        </div>
                        {field.expectedRangeLabel && (
                          <div style={{ fontSize: '0.74rem', color: '#b91c1c', marginBottom: 6 }}>
                            You entered: <strong>{answers[field.id] || '0'} {field.unit}</strong> — Expected range: <strong>{field.expectedRangeLabel}</strong>
                          </div>
                        )}
                        <div style={{
                          padding: '8px 10px',
                          background: 'var(--bg-card)',
                          borderRadius: 6,
                          border: '1px solid rgba(220, 38, 38, 0.2)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'pre-line',
                        }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>
                            Worked Solution:
                          </div>
                          {result.workedFormula}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary status after submission */}
      {submitted && results && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 16,
            background: results.every(r => r.correct) ? 'rgba(5, 150, 105, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1.5px solid ${results.every(r => r.correct) ? '#059669' : '#ef4444'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 22 }}>
            {results.every(r => r.correct) ? '🎉' : '⚠️'}
          </div>
          <div>
            <div style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: results.every(r => r.correct) ? '#065f46' : '#991b1b',
            }}>
              {results.every(r => r.correct) ? 'Calculations Verified Correct!' : 'Calculation Check Completed'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {results.every(r => r.correct)
                ? 'Great job! Full marks awarded for the calculation section.'
                : 'Review the correct solutions above before viewing your final score.'}
            </div>
          </div>
        </div>
      )}

      {/* Submit / Continue buttons */}
      {!submitted ? (
        <button
          id="btn-submit-calculation"
          className="btn-primary"
          onClick={handleSubmit}
          style={{ width: '100%', padding: '12px 20px', fontSize: '0.85rem', fontWeight: 700 }}
        >
          Submit Calculation & Verify
        </button>
      ) : (
        <button
          id="btn-view-results"
          className="btn-primary"
          onClick={() => dispatch({ type: 'ADVANCE_STEP' })}
          style={{
            width: '100%',
            padding: '12px 20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #059669, #0d9488)',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
          }}
        >
          View Final Score & Results →
        </button>
      )}

    </div>
  );
};


// ── Helpers ──────────────────────────────────────────────────────

function formatVariableName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .replace(/([a-z])(\d)/g, '$1 $2');
}

function renderChemicalSubscripts(text: string): React.ReactNode {
  const parts = text.split(/(CaCO[3₃]|H[2₂]SO[4₄])/g);
  return parts.map((part, i) => {
    if (part === 'CaCO3' || part === 'CaCO₃') {
      return <span key={i}>CaCO<sub>3</sub></span>;
    }
    if (part === 'H2SO4' || part === 'H₂SO₄') {
      return <span key={i}>H<sub>2</sub>SO<sub>4</sub></span>;
    }
    return part;
  });
}


export default GenericCalculation;
