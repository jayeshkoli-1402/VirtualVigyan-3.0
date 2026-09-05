/**
 * ═══════════════════════════════════════════════════════════════════
 *  GenericResults — Config-driven results/scoring screen
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useMemo } from 'react';
import type { ExperimentConfig, ExperimentState, ExperimentAction } from '../../engine/experimentConfig';
import { computeScore } from '../../engine/scoringEngine';

type GenericResultsProps = {
  config: ExperimentConfig;
  state: ExperimentState;
  dispatch: React.Dispatch<ExperimentAction>;
  onBackToSelector: () => void;
};

const GenericResults: React.FC<GenericResultsProps> = ({
  config,
  state,
  dispatch,
  onBackToSelector,
}) => {
  const scoreResult = useMemo(() => computeScore(config, state), [config, state]);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score count-up
    const target = scoreResult.totalScore;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [scoreResult.totalScore]);

  if (!scoreResult) return null;

  const gradeColors: Record<string, string> = {
    'Excellent': '#059669',
    'Good': '#2563eb',
    'Satisfactory': '#d97706',
    'Needs Practice': '#dc2626',
  };

  const gradeColor = gradeColors[scoreResult.grade] ?? '#64748b';

  return (
    <div style={{
      maxWidth: 600,
      width: '100%',
      margin: '0 auto',
      padding: 24,
      animation: 'fadeIn 0.4s ease-out',
    }}>
      {/* Score circle */}
      <div className="glass-card" style={{
        padding: '32px 24px',
        textAlign: 'center',
        marginBottom: 20,
      }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          border: `4px solid ${gradeColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          background: `${gradeColor}10`,
        }}>
          <span style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: gradeColor,
            fontFamily: 'var(--font-mono)',
          }}>
            {animatedScore}
          </span>
        </div>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: gradeColor,
          marginBottom: 4,
        }}>
          {scoreResult.grade}
        </div>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          maxWidth: 400,
          margin: '0 auto',
        }}>
          {scoreResult.feedback}
        </p>
      </div>

      {/* Score breakdown */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 20 }}>
        <h3 style={{
          fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12,
        }}>
          Score Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {scoreResult.breakdown.map((cat, i) => (
            <div key={i}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 4,
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {cat.name}
                </span>
                <span style={{
                  fontSize: '0.78rem', fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: cat.points >= cat.maxPoints * 0.7 ? '#059669' :
                         cat.points >= cat.maxPoints * 0.4 ? '#d97706' : '#dc2626',
                }}>
                  {cat.points}/{cat.maxPoints}
                </span>
              </div>
              {/* Progress bar */}
              <div style={{
                height: 4,
                borderRadius: 2,
                background: 'rgba(148, 163, 184, 0.15)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${(cat.points / cat.maxPoints) * 100}%`,
                  borderRadius: 2,
                  background: cat.points >= cat.maxPoints * 0.7 ? '#059669' :
                              cat.points >= cat.maxPoints * 0.4 ? '#d97706' : '#dc2626',
                  transition: 'width 0.8s ease-out',
                }} />
              </div>
              <div style={{
                fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2,
              }}>
                {cat.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mistakes summary */}
      {state.mistakes.length > 0 && (
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
          <h3 style={{
            fontSize: '0.75rem', fontWeight: 700, color: '#d97706',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
          }}>
            Mistakes Made ({state.mistakes.length})
          </h3>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {[...new Set(state.mistakes)].map((m, i) => (
              <li key={i} style={{
                fontSize: '0.75rem', color: 'var(--text-secondary)',
                marginBottom: 4, lineHeight: 1.4,
              }}>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn-secondary"
          onClick={() => dispatch({ type: 'RESET' })}
          style={{ flex: 1 }}
        >
          Try Again
        </button>
        <button
          className="btn-primary"
          onClick={onBackToSelector}
          style={{ flex: 1 }}
        >
          Back to Experiments
        </button>
      </div>
    </div>
  );
};

export default GenericResults;
