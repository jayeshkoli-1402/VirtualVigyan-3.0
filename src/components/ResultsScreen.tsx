import React from 'react';
import type { TitrationState, TitrationAction } from '../engine/titrationState';
import { evaluateEndpoint } from '../engine/validation';
import { EQUIVALENCE_VOLUME_ML } from '../engine/chemistryRules';

interface ResultsScreenProps {
  state: TitrationState;
  dispatch: React.Dispatch<TitrationAction>;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ state, dispatch }) => {
  const endpointEval = evaluateEndpoint(state.endpointMarkedAt ?? 0);

  // Score breakdown
  const endpointScore = endpointEval.accuracy === 'excellent' ? 40 : endpointEval.accuracy === 'good' ? 25 : 10;
  const calculationScore = state.calculationCorrect ? 40 : 10;
  const indicatorScore = 10;
  const overshootScore = (state.endpointMarkedAt ?? 0) <= 27 ? 10 : 0;
  const totalScore = state.score ?? (endpointScore + calculationScore + indicatorScore + overshootScore);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#16a34a';
    if (score >= 70) return '#0284c7';
    if (score >= 50) return '#d97706';
    return '#dc2626';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Outstanding!';
    if (score >= 70) return 'Great Work!';
    if (score >= 50) return 'Good Effort';
    return 'Keep Practicing';
  };

  const scoreColor = getScoreColor(totalScore);

  return (
    <div className="animate-slide-in-up" style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Score header */}
      <div
        className="glass-card"
        style={{
          padding: '32px 24px',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            margin: '0 auto 16px',
            background: `conic-gradient(${scoreColor} ${totalScore * 3.6}deg, #e2e8f0 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <span
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {totalScore}
            </span>
            <span style={{ fontSize: '0.6rem', color: '#64748b', marginTop: 2 }}>/ 100</span>
          </div>
        </div>
        <h2
          style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            marginBottom: 4,
            color: scoreColor,
          }}
        >
          {getScoreLabel(totalScore)}
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
          Acid-Base Titration Performance Evaluation
        </p>
      </div>

      {/* Score breakdown */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 14, color: '#334155' }}>
          Score Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ScoreRow
            label="Endpoint Precision"
            sublabel={endpointEval.label}
            score={endpointScore}
            maxScore={40}
            color={endpointEval.accuracy === 'excellent' ? '#16a34a' : endpointEval.accuracy === 'good' ? '#0284c7' : '#d97706'}
          />

          <ScoreRow
            label="Concentration Calculation"
            sublabel={state.calculationCorrect ? 'Correct' : 'Incorrect'}
            score={calculationScore}
            maxScore={40}
            color={state.calculationCorrect ? '#16a34a' : '#dc2626'}
          />

          <ScoreRow
            label="Indicator Added"
            sublabel="Before titration"
            score={indicatorScore}
            maxScore={10}
            color="#16a34a"
          />

          <ScoreRow
            label="No Overshoot"
            sublabel={overshootScore > 0 ? 'Stopped in range' : 'Overshot endpoint'}
            score={overshootScore}
            maxScore={10}
            color={overshootScore > 0 ? '#16a34a' : '#dc2626'}
          />
        </div>
      </div>

      {/* Detailed feedback */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, color: '#334155' }}>
          Detailed Feedback
        </h3>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: 14,
            marginBottom: 12,
          }}
        >
          <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.6 }}>
            {endpointEval.explanation}
          </p>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.7 }}>
          <p style={{ marginBottom: 6 }}>
            <strong style={{ color: '#0f172a' }}>Your recorded endpoint:</strong>{' '}
            {state.endpointMarkedAt?.toFixed(1)} mL
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong style={{ color: '#0f172a' }}>True equivalence point:</strong>{' '}
            {EQUIVALENCE_VOLUME_ML}.0 mL
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong style={{ color: '#0f172a' }}>Your calculated concentration:</strong>{' '}
            {state.studentConcentration?.toFixed(4)} M
          </p>
          <p>
            <strong style={{ color: '#0f172a' }}>Ground truth HCl concentration:</strong>{' '}
            0.1000 M
          </p>
        </div>
      </div>

      {/* Try Again */}
      <button
        id="btn-try-again"
        className="btn-primary"
        onClick={() => dispatch({ type: 'RESET' })}
        style={{ width: '100%', padding: '12px' }}
      >
        🔄 Perform Experiment Again
      </button>
    </div>
  );
};

// ── Score Row sub-component ──
const ScoreRow: React.FC<{
  label: string;
  sublabel: string;
  score: number;
  maxScore: number;
  color: string;
}> = ({ label, sublabel, score, maxScore, color }) => {
  const pct = (score / maxScore) * 100;
  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>{label}</span>
          <span style={{ fontSize: '0.7rem', color, marginLeft: 8, fontWeight: 600 }}>{sublabel}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color }}>
          {score}/{maxScore}
        </span>
      </div>
      <div
        style={{
          height: 5,
          background: '#e2e8f0',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 3,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
};

export default ResultsScreen;
