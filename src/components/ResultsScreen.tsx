import React, { useEffect, useRef } from 'react';
import type { TitrationState, TitrationAction } from '../engine/titrationState';
import { evaluateEndpoint } from '../engine/validation';
import { EQUIVALENCE_VOLUME_ML } from '../engine/chemistryRules';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { recordPrivateLabSubmission } from '../services/privateLabService';
import { recordStudentPerformance } from '../services/studentHistoryService';
import type { PrivateLabContext } from '../types/privateLab';
import { LabResultsLeaderboardCard } from './leaderboard/LabResultsLeaderboardCard';

interface ResultsScreenProps {
  state: TitrationState;
  dispatch: React.Dispatch<TitrationAction>;
  privateLabContext?: PrivateLabContext;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ state, dispatch, privateLabContext }) => {
  const { t, tDynamic } = useLanguage();
  const { user } = useAuth();
  const recordedRef = useRef(false);
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
    if (score >= 90) return t('results.gradeExcellent', undefined, 'Outstanding!');
    if (score >= 70) return t('results.gradeGood', undefined, 'Great Work!');
    if (score >= 50) return t('results.gradeSatisfactory', undefined, 'Good Effort');
    return t('results.gradeNeedsPractice', undefined, 'Keep Practicing');
  };

  const scoreColor = getScoreColor(totalScore);

  useEffect(() => {
    const effectiveUser = user || (() => {
      try {
        const raw = localStorage.getItem('vv_active_user') || localStorage.getItem('vv_user');
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    if (effectiveUser && !recordedRef.current) {
      recordedRef.current = true;
      const mistakes: string[] = [];
      if ((state.endpointMarkedAt ?? 0) > 27) {
        mistakes.push('Overshot equivalence endpoint');
      }
      if (!state.calculationCorrect) {
        mistakes.push('Molarity calculation discrepancy');
      }

      if (privateLabContext) {
        recordPrivateLabSubmission({
          labId: privateLabContext.lab.id,
          studentId: effectiveUser.id,
          studentName: effectiveUser.name || 'Student',
          studentEmail: effectiveUser.email,
          avatar: effectiveUser.avatar || '🎓',
          experimentId: 'titration',
          experimentTitle: 'Acid-Base Titration',
          score: totalScore,
          maxScore: 100,
          attemptNumber: privateLabContext.attemptNumber || 1,
          timeSpentSeconds: 150,
          mistakes,
          calculationAnswers: state.studentConcentration
            ? { studentConcentration: state.studentConcentration }
            : undefined,
        });
      } else {
        recordStudentPerformance({
          studentId: effectiveUser.id,
          studentName: effectiveUser.name || 'Student',
          studentEmail: effectiveUser.email,
          avatar: effectiveUser.avatar || '🎓',
          experimentId: 'titration',
          experimentTitle: 'Acid-Base Titration',
          type: 'practice',
          score: totalScore,
          maxScore: 100,
          attemptNumber: 1,
          timeSpentSeconds: 150,
          mistakes,
          calculationAnswers: state.studentConcentration
            ? { studentConcentration: state.studentConcentration }
            : undefined,
        });
      }
    }
  }, [user, privateLabContext, totalScore, state]);

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
            background: `conic-gradient(${scoreColor} ${totalScore * 3.6}deg, var(--border) 0deg)`,
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
              background: 'var(--bg-card)',
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
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 2 }}>/ 100</span>
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
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          {tDynamic('Acid-Base Titration Performance Evaluation')}
        </p>
      </div>

      {/* Score breakdown */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 14, color: 'var(--text-secondary)' }}>
          {t('results.rubricBreakdown', undefined, 'Score Breakdown')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ScoreRow
            label={tDynamic('Endpoint Precision')}
            sublabel={tDynamic(endpointEval.label)}
            score={endpointScore}
            maxScore={40}
            color={endpointEval.accuracy === 'excellent' ? '#16a34a' : endpointEval.accuracy === 'good' ? '#0284c7' : '#d97706'}
          />

          <ScoreRow
            label={tDynamic('Concentration Calculation')}
            sublabel={state.calculationCorrect ? t('common.correct', 'Correct') : t('common.incorrect', 'Incorrect')}
            score={calculationScore}
            maxScore={40}
            color={state.calculationCorrect ? '#16a34a' : '#dc2626'}
          />

          <ScoreRow
            label={tDynamic('Indicator Added')}
            sublabel={tDynamic('Before titration')}
            score={indicatorScore}
            maxScore={10}
            color="#16a34a"
          />

          <ScoreRow
            label={tDynamic('No Overshoot')}
            sublabel={overshootScore > 0 ? tDynamic('Stopped in range') : tDynamic('Overshot endpoint')}
            score={overshootScore}
            maxScore={10}
            color={overshootScore > 0 ? '#16a34a' : '#dc2626'}
          />
        </div>
      </div>

      {/* Detailed feedback */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>
          Detailed Feedback
        </h3>

        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 14,
            marginBottom: 12,
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {endpointEval.explanation}
          </p>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          <p style={{ marginBottom: 6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Your recorded endpoint:</strong>{' '}
            {state.endpointMarkedAt?.toFixed(1)} mL
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>True equivalence point:</strong>{' '}
            {EQUIVALENCE_VOLUME_ML}.0 mL
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Your calculated concentration:</strong>{' '}
            {state.studentConcentration?.toFixed(4)} M
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Ground truth HCl concentration:</strong>{' '}
            0.1000 M
          </p>
        </div>
      </div>

      {/* ── Educational Summary: "What Did We Find?" ── */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: '1rem' }}>🎓</span>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>
            What Did We Find? • Scientific Conclusion
          </h3>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 14 }}>
          The unknown hydrochloric acid solution (<strong>25.0 mL aliquot</strong>) was titrated against standardized <strong>0.100 M NaOH</strong> titrant. Phenolphthalein indicated the endpoint by changing from colourless in acidic medium to a <strong>persistent pale-pink colour</strong> at the equivalence point. Using your measured endpoint volume of <strong>{state.endpointMarkedAt?.toFixed(1)} mL NaOH</strong>, the calculated concentration of the HCl solution is <strong>{state.studentConcentration?.toFixed(4)} M</strong>.
        </p>

        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 12,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            fontSize: '0.73rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Titrated Solution (Analyte):</span>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>25.0 mL HCl</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Titrant Delivered:</span>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>0.100 M NaOH</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Endpoint Indicator:</span>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Phenolphthalein (Pale Pink)</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Stoichiometric Reaction:</span>
            <div style={{ fontWeight: 600, color: '#2563eb', fontFamily: 'var(--font-mono)' }}>HCl + NaOH → NaCl + H₂O</div>
          </div>
        </div>
      </div>

      {/* Lab Leaderboard & Class Standing Card */}
      {privateLabContext && (
        <div style={{ marginBottom: 16 }}>
          <LabResultsLeaderboardCard
            lab={privateLabContext.lab}
            currentUserEmail={user?.email}
            currentUserRole={user?.role}
            currentScore={totalScore}
            onLaunchExperiment={() => dispatch({ type: 'RESET' })}
          />
        </div>
      )}

      {/* Try Again */}
      <button
        id="btn-try-again"
        className="btn-primary"
        onClick={() => dispatch({ type: 'RESET' })}
        style={{ width: '100%', padding: '12px' }}
      >
        🔄 {t('results.tryAgain', undefined, 'Perform Experiment Again')}
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
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
          <span style={{ fontSize: '0.7rem', color, marginLeft: 8, fontWeight: 600 }}>{sublabel}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color }}>
          {score}/{maxScore}
        </span>
      </div>
      <div
        style={{
          height: 5,
          background: 'var(--border)',
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
