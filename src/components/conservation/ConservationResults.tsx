import React, { useEffect } from 'react';
import type { ConservationState, ConservationAction } from '../../engine/conservationState';
import { computeScore, evaluateCalculation } from '../../engine/conservationValidation';
import { calculateExpectedDeltaM, calculateExpectedDeviation, REACTION_EQUATION } from '../../engine/conservationRules';
import { useLanguage } from '../../i18n/LanguageContext';

interface ConservationResultsProps {
  state: ConservationState;
  dispatch: React.Dispatch<ConservationAction>;
  onBackToSelector: () => void;
}

const ConservationResults: React.FC<ConservationResultsProps> = ({ state, dispatch, onBackToSelector }) => {
  const { t } = useLanguage();
  const m1 = state.initialMass ?? 0;
  const m2 = state.finalMass ?? 0;
  const expectedDeltaM = calculateExpectedDeltaM(m1, m2);
  const expectedDeviation = calculateExpectedDeviation(m1, m2);

  const calcEval = evaluateCalculation(
    state.studentDeltaM ?? 0,
    expectedDeltaM,
    state.studentDeviationPercent ?? 0,
    expectedDeviation
  );

  const score = state.score ?? computeScore(state);

  // Compute score on mount
  useEffect(() => {
    if (state.score === null) {
      dispatch({ type: 'COMPUTE_SCORE', payload: { score: computeScore(state) } });
    }
  }, [state, dispatch]);

  const getScoreColor = (s: number) => {
    if (s >= 85) return '#059669';
    if (s >= 60) return '#d97706';
    return '#dc2626';
  };

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case 'excellent': return '#059669';
      case 'good': return '#d97706';
      default: return '#dc2626';
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}>
      {/* Score Circle */}
      <div
        className="glass-card"
        style={{
          padding: 28,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, rgba(148, 163, 184, 0.12) 0deg)`,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: getScoreColor(score),
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              / 100
            </span>
          </div>
        </div>

        <h2
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}
        >
          {score >= 85 ? t('conservation.excellentWork') : score >= 60 ? t('conservation.goodEffort') : t('conservation.keepPracticing')}
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {t('conservation.experimentComplete')}
        </p>
      </div>

      {/* Mass Conservation Summary */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}
        >
          {t('conservation.verificationTitle')}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div style={{ textAlign: 'center', padding: '10px', background: '#f0fdf4', borderRadius: 8 }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#059669', marginBottom: 4 }}>{t('conservation.initialMass')}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{m1.toFixed(2)} g</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', background: '#eff6ff', borderRadius: 8 }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>{t('conservation.finalMass')}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{m2.toFixed(2)} g</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', background: '#fefce8', borderRadius: 8 }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#d97706', marginBottom: 4 }}>ΔM</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{expectedDeltaM.toFixed(2)} g</div>
          </div>
        </div>

        <div
          style={{
            padding: '10px 14px',
            background: expectedDeltaM <= 0.02 ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${expectedDeltaM <= 0.02 ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: 8,
            fontSize: '0.78rem',
            color: expectedDeltaM <= 0.02 ? '#166534' : '#991b1b',
            lineHeight: 1.5,
          }}
        >
          {expectedDeltaM <= 0.02
            ? t('conservation.massConserved', { deltaM: expectedDeltaM.toFixed(2) })
            : t('conservation.massNotConserved', { deltaM: expectedDeltaM.toFixed(2) })}
        </div>
      </div>

      {/* Calculation Accuracy */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 10,
          }}
        >
          {t('conservation.calcAccuracy')}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 12,
              fontSize: '0.7rem',
              fontWeight: 700,
              background: `${getAccuracyColor(calcEval.accuracy)}15`,
              color: getAccuracyColor(calcEval.accuracy),
              border: `1px solid ${getAccuracyColor(calcEval.accuracy)}30`,
            }}
          >
            {calcEval.accuracy === 'excellent'
              ? t('conservation.calcAccExcellent')
              : calcEval.accuracy === 'good'
              ? t('conservation.calcAccGood')
              : t('conservation.calcAccNeedsPractice')}
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {calcEval.accuracy === 'excellent'
            ? t('conservation.calcExpExcellent', { deltaM: (state.studentDeltaM ?? 0).toFixed(2), expectedDeltaM: expectedDeltaM.toFixed(2) })
            : calcEval.accuracy === 'good'
            ? t('conservation.calcExpGood', { deltaM: (state.studentDeltaM ?? 0).toFixed(2), expectedDeltaM: expectedDeltaM.toFixed(2) })
            : t('conservation.calcExpNeedsPractice', { deltaM: (state.studentDeltaM ?? 0).toFixed(2), expectedDeltaM: expectedDeltaM.toFixed(2) })}
        </p>
      </div>

      {/* Scoring breakdown */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}
        >
          {t('conservation.scoreBreakdown')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: t('conservation.procedureOrder'), points: state.mistakes.length === 0 ? 20 : state.mistakes.length <= 2 ? 10 : 0, max: 20 },
            { label: t('conservation.flaskSealed'), points: state.flaskSealed && state.initialMass !== null ? 15 : 0, max: 15 },
            { label: t('conservation.m1Recorded'), points: state.initialMass !== null ? 15 : 0, max: 15 },
            { label: t('conservation.mixingDone'), points: state.reactantsMixed ? 10 : 0, max: 10 },
            { label: t('conservation.m2Recorded'), points: state.finalMass !== null ? 10 : 0, max: 10 },
            {
              label: t('conservation.deltaMCalc'),
              points: state.studentDeltaM !== null
                ? Math.abs(state.studentDeltaM - expectedDeltaM) <= 0.005 ? 15 : Math.abs(state.studentDeltaM - expectedDeltaM) <= 0.02 ? 8 : 0
                : 0,
              max: 15,
            },
            {
              label: t('conservation.deviationPercent'),
              points: state.studentDeviationPercent !== null
                ? Math.abs(state.studentDeviationPercent - expectedDeviation) <= 0.02 ? 15 : Math.abs(state.studentDeviationPercent - expectedDeviation) <= 0.1 ? 8 : 0
                : 0,
              max: 15,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                background: item.points === item.max ? 'rgba(5, 150, 105, 0.04)' : 'transparent',
                borderRadius: 6,
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {item.points === item.max ? '✅' : item.points > 0 ? '🟡' : '❌'} {item.label}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: item.points === item.max ? '#059669' : item.points > 0 ? '#d97706' : '#dc2626',
                }}
              >
                {item.points}/{item.max}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chemical reaction reference */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>⚗️ {t('conservation.chemicalEquation')}</h3>
        <p
          style={{
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
            color: '#059669',
            fontWeight: 600,
            textAlign: 'center',
            padding: '10px',
            background: '#f0fdf4',
            borderRadius: 8,
          }}
        >
          {REACTION_EQUATION}
        </p>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
          {t('conservation.equationDesc')}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          id="btn-retry-conservation"
          className="btn-secondary"
          onClick={() => dispatch({ type: 'RESET' })}
          style={{ flex: 1, padding: '12px' }}
        >
          🔄 {t('common.retry')}
        </button>
        <button
          id="btn-back-selector"
          className="btn-primary"
          onClick={onBackToSelector}
          style={{ flex: 1, padding: '12px' }}
        >
          ← {t('common.back')}
        </button>
      </div>
    </div>
  );
};

export default ConservationResults;
