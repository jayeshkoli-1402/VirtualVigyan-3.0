/**
 * ═══════════════════════════════════════════════════════════════════
 *  GenericCalculation — Config-driven calculation form
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { ExperimentConfig, ExperimentState, ExperimentAction } from '../../engine/experimentConfig';
import { validateCalculation } from '../../engine/scoringEngine';
import { useLanguage } from '../../i18n/LanguageContext';

type GenericCalculationProps = {
  config: ExperimentConfig;
  state: ExperimentState;
  dispatch: React.Dispatch<ExperimentAction>;
  hideFormulas?: boolean;
};

const GenericCalculation: React.FC<GenericCalculationProps> = ({
  config,
  state,
  dispatch,
  hideFormulas = false,
}) => {
  const { t, tDynamic } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [vivaAnswers, setVivaAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<ReturnType<typeof validateCalculation> | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const calcConfig = config.calculation;
  if (!calcConfig) return null;

  const handleSubmit = () => {
    const numericAnswers: Record<string, number> = {};
    for (const field of calcConfig.fields) {
      numericAnswers[field.id] = parseFloat(answers[field.id] ?? '0') || 0;
    }
    for (const [qId, optIdx] of Object.entries(vivaAnswers)) {
      numericAnswers[`viva_${qId}`] = optIdx;
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
      maxWidth: 560,
      width: '100%',
      margin: '0 auto',
      padding: '16px 12px 64px 12px',
      animation: 'fadeIn 0.3s ease-out',
    }}>
      {/* Title */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 16 }}>
        <h2 style={{
          fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)',
          marginBottom: 6,
        }}>
          {tDynamic(calcConfig.title)}
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {tDynamic(calcConfig.instruction)}
        </p>

        {/* Real Mathematical Fraction Typography for Formulas (or Concealed Notice) */}
        {hideFormulas ? (
          <div style={{
            marginTop: 14,
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.04))',
            border: '1.5px solid rgba(239, 68, 68, 0.25)',
          }}>
            <div style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 4,
            }}>
              <span>🔒</span>
              <span>Formula Guide Concealed (Assessment Mode)</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Your instructor has withheld worked formula aids for this assessment. Calculate the results using standard stoichiometry principles.
            </div>
          </div>
        ) : calcConfig.formulas && calcConfig.formulas.length > 0 ? (
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
                    {tDynamic(form.label)}
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
                  {form.bracketed && (
                    <span style={{ fontSize: '1.6rem', fontWeight: 300, color: 'var(--text-secondary)', lineHeight: 1 }}>
                      [
                    </span>
                  )}
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
                  {form.bracketed && (
                    <span style={{ fontSize: '1.6rem', fontWeight: 300, color: 'var(--text-secondary)', lineHeight: 1 }}>
                      ]
                    </span>
                  )}
                  {form.multiplier && (
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {form.multiplier}
                    </span>
                  )}
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
                    whiteSpace: 'pre-line',
                  }}>
                    {renderChemicalSubscripts(form.notes)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Recorded values */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 16 }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
        }}>
          {t('calc.recordedValues', 'Recorded Values')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {calcConfig.recordedValues ? (
            calcConfig.recordedValues.map((item, idx) => {
              const isMasked = item.key ? (calcConfig.hideRecordedValueKeys?.includes(item.key) || ['volumeA', 'volumeB', 'volumeY', 'volumeZ', 'volumeAdded'].includes(item.key)) : false;
              const rawVal = item.key ? (state.variables[item.key] ?? item.value) : item.value;
              let formattedVal: string;
              if (typeof rawVal === 'number') {
                formattedVal = item.decimals !== undefined ? rawVal.toFixed(item.decimals) : rawVal.toString();
              } else if (rawVal !== undefined && rawVal !== null) {
                formattedVal = String(rawVal);
              } else {
                formattedVal = '—';
              }
              const displayVal = item.unit ? `${formattedVal} ${item.unit}` : formattedVal;

              return (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '0.8rem', padding: '4px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {tDynamic(item.label)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: isMasked ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {isMasked ? t('calc.recordedByStudent', '— (Recorded by student)') : displayVal}
                  </span>
                </div>
              );
            })
          ) : (
            Object.entries(state.variables)
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
              })
          )}
        </div>
      </div>

      {/* Input fields */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 16 }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12,
        }}>
          {t('calc.yourCalculation', 'Your Calculation')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {calcConfig.fields.map((field, fIdx) => {
            const result = results?.find(r => r.fieldId === field.id);
            const isFirstInSection = field.section && (fIdx === 0 || calcConfig.fields[fIdx - 1]?.section !== field.section);

            return (
              <div key={field.id}>
                {isFirstInSection && (
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: '#2563eb',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginTop: fIdx > 0 ? 16 : 4,
                    marginBottom: 10,
                    paddingBottom: 4,
                    borderBottom: '1.5px solid rgba(37, 99, 235, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <span>📝</span>
                    <span>{tDynamic(field.section!)}</span>
                  </div>
                )}

                <label style={{
                  display: 'block', fontSize: '0.78rem', fontWeight: 600,
                  color: 'var(--text-primary)', marginBottom: 4,
                }}>
                  {tDynamic(field.label)}
                </label>

                {field.options && field.options.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                    {field.options.map((opt, optIdx) => {
                      const optVal = (optIdx + 1).toString();
                      const isSelected = answers[field.id] === optVal;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={submitted}
                          onClick={() => setAnswers({ ...answers, [field.id]: optVal })}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: `1.5px solid ${
                              isSelected ? '#2563eb' : 'var(--border, #cbd5e1)'
                            }`,
                            background: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            textAlign: 'left',
                            fontSize: '0.8rem',
                            cursor: submitted ? 'default' : 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: isSelected ? '#2563eb' : 'var(--bg-secondary)',
                            color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                            flexShrink: 0,
                          }}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span style={{ lineHeight: 1.4, flex: 1 }}>{tDynamic(opt)}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="number"
                      step="any"
                      placeholder={field.placeholder ? tDynamic(field.placeholder) : t('calc.enterValue', 'Enter value...')}
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
                )}

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
                      {tDynamic(field.helperText)}
                    </div>
                    {field.helperExample && (
                      <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>
                        {tDynamic(field.helperExample)}
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
                            {field.options && field.options.length > 0
                              ? `${t('common.correct', 'Correct!')} (Option ${String.fromCharCode(64 + Math.round(result.expectedValue))})`
                              : field.expectedRangeLabel
                              ? t('calc.correctRange', 'Correct — within acceptable experimental range')
                              : `${t('common.correct', 'Correct!')} (${result.expectedValue.toFixed(2)} ${field.unit})`}
                          </span>
                        </div>
                        {field.expectedRangeLabel && (
                          <div style={{ fontSize: '0.74rem', marginTop: 3, color: '#047857' }}>
                            {t('calc.expectedRange', 'Expected range')}: <strong>{field.expectedRangeLabel}</strong>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
                          <span>✗</span>
                          <span>
                            {field.options && field.options.length > 0
                              ? `${t('common.incorrect', 'Incorrect')} (${answers[field.id] ? `Selected Option ${String.fromCharCode(64 + parseInt(answers[field.id], 10))}` : 'No answer'} — Expected: Option ${String.fromCharCode(64 + Math.round(result.expectedValue))})`
                              : field.expectedRangeLabel
                              ? t('calc.outsideRange', 'Outside acceptable experimental range')
                              : `${t('common.incorrect', 'Incorrect')} (${answers[field.id] || '0'} ${field.unit} — ${t('calc.expectedRange', 'Expected')}: ${result.expectedValue.toFixed(2)} ${field.unit})`}
                          </span>
                        </div>
                        {field.expectedRangeLabel && (
                          <div style={{ fontSize: '0.74rem', color: '#b91c1c', marginBottom: 6 }}>
                            {t('calc.yourCalculation', 'You entered')}: <strong>{answers[field.id] || '0'} {field.unit}</strong> — {t('calc.expectedRange', 'Expected range')}: <strong>{field.expectedRangeLabel}</strong>
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
                            {t('calc.workedSolution', 'Worked Solution')}:
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

      {/* ── Viva Voce Conceptual Examination Section ── */}
      {config.viva?.questions && config.viva.questions.length > 0 && (
        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: 0,
            }}>
              <span>🎓</span>
              <span>Viva Voce Conceptual Examination</span>
            </h3>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--accent-blue, #2563eb)',
              background: 'rgba(37, 99, 235, 0.1)',
              padding: '3px 8px',
              borderRadius: 6,
            }}>
              {config.viva.questions.length} Questions
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
            Select the most accurate scientific answer for each question based on your laboratory observations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {config.viva.questions.map((q, qIdx) => {
              const selectedIdx = vivaAnswers[q.id];
              const isSubmitted = submitted;
              const isCorrect = isSubmitted && selectedIdx === q.correctIndex;
              const isWrong = isSubmitted && selectedIdx !== undefined && selectedIdx !== q.correctIndex;
              const isUnanswered = isSubmitted && selectedIdx === undefined;

              return (
                <div
                  key={q.id}
                  style={{
                    padding: 14,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-inset, #f8fafc)',
                    border: isSubmitted
                      ? isCorrect
                        ? '1.5px solid #059669'
                        : isWrong || isUnanswered
                        ? '1.5px solid #dc2626'
                        : '1px solid var(--border)'
                      : '1px solid var(--border)',
                  }}
                >
                  <div style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 10,
                    lineHeight: 1.4,
                  }}>
                    <span style={{ color: 'var(--accent-blue, #2563eb)', fontWeight: 700, marginRight: 6 }}>
                      Q{qIdx + 1}.
                    </span>
                    {q.question}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedIdx === optIdx;
                      const isOptionCorrect = isSubmitted && optIdx === q.correctIndex;

                      let optBg = 'var(--bg-card, #ffffff)';
                      let optBorder = '1px solid var(--border, #cbd5e1)';
                      let optColor = 'var(--text-primary)';

                      if (!isSubmitted) {
                        if (isChosen) {
                          optBg = 'rgba(37, 99, 235, 0.1)';
                          optBorder = '1.5px solid #2563eb';
                          optColor = '#1d4ed8';
                        }
                      } else {
                        if (isOptionCorrect) {
                          optBg = 'rgba(5, 150, 105, 0.12)';
                          optBorder = '1.5px solid #059669';
                          optColor = '#065f46';
                        } else if (isChosen && !isOptionCorrect) {
                          optBg = 'rgba(239, 68, 68, 0.12)';
                          optBorder = '1.5px solid #dc2626';
                          optColor = '#991b1b';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={submitted}
                          onClick={() => setVivaAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                          style={{
                            all: 'unset',
                            cursor: submitted ? 'default' : 'pointer',
                            padding: '8px 12px',
                            borderRadius: 6,
                            background: optBg,
                            border: optBorder,
                            color: optColor,
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            background: isChosen ? '#2563eb' : 'var(--bg-inset, #e2e8f0)',
                            color: isChosen ? '#fff' : 'var(--text-secondary)',
                            flexShrink: 0,
                          }}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span style={{ flex: 1 }}>{opt}</span>
                          {isSubmitted && isOptionCorrect && <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>}
                          {isSubmitted && isChosen && !isOptionCorrect && <span style={{ color: '#dc2626', fontWeight: 700 }}>✗</span>}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && q.explanation && (
                    <div style={{
                      marginTop: 10,
                      padding: '8px 10px',
                      borderRadius: 6,
                      fontSize: '0.74rem',
                      color: isCorrect ? '#065f46' : '#991b1b',
                      background: isCorrect ? 'rgba(5, 150, 105, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: `1px solid ${isCorrect ? 'rgba(5, 150, 105, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                      lineHeight: 1.4,
                    }}>
                      <strong>{isCorrect ? '✓ Correct! ' : isUnanswered ? '⚠️ Unanswered! ' : '✗ Incorrect. '}</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              {results.every(r => r.correct) ? t('calc.verifiedCorrect', 'Calculations Verified Correct!') : t('calc.checkCompleted', 'Calculation Check Completed')}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {results.every(r => r.correct)
                ? t('calc.greatJob', 'Great job! Full marks awarded for the calculation section.')
                : t('calc.reviewSolutions', 'Review the correct solutions above before viewing your final score.')}
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
          style={{ width: '100%', padding: '12px 20px', fontSize: '0.85rem' }}
        >
          {t('calc.submitAnswers', 'Check Answers & Verify Steps')}
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
          {t('calc.viewFinalScore', 'View Final Score & Results')} →
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
