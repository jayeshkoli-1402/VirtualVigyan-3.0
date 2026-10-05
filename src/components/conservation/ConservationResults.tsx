import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { ConservationState, ConservationAction } from '../../engine/conservationState';
import { computeScore, evaluateCalculation } from '../../engine/conservationValidation';
import { calculateExpectedDeltaM, calculateExpectedDeviation, REACTION_EQUATION } from '../../engine/conservationRules';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import { recordPrivateLabSubmission } from '../../services/privateLabService';
import { recordStudentPerformance } from '../../services/studentHistoryService';
import type { PrivateLabContext } from '../../types/privateLab';
import { buildConservationReportData } from '../../services/reportService';
import { LabReportModal } from '../report/LabReportModal';

interface ConservationResultsProps {
  state: ConservationState;
  dispatch: React.Dispatch<ConservationAction>;
  onBackToSelector: () => void;
  privateLabContext?: PrivateLabContext;
}

const ConservationResults: React.FC<ConservationResultsProps> = ({
  state,
  dispatch,
  onBackToSelector,
  privateLabContext,
}) => {
  const { t, language, tDynamic } = useLanguage();
  const { user } = useAuth();
  const recordedRef = useRef(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);

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

  // Compute score on mount if not yet set
  useEffect(() => {
    if (state.score === null) {
      dispatch({ type: 'COMPUTE_SCORE', payload: { score: computeScore(state) } });
    }
  }, [state, dispatch]);

  // Record student performance
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
      const mistakes: string[] = [...state.mistakes];
      if (Math.abs(expectedDeviation) > 2) {
        mistakes.push('Mass balance deviation recorded');
      }

      if (privateLabContext) {
        recordPrivateLabSubmission({
          labId: privateLabContext.lab.id,
          studentId: effectiveUser.id,
          studentName: effectiveUser.name || 'Student',
          studentEmail: effectiveUser.email,
          avatar: effectiveUser.avatar || '🎓',
          experimentId: 'conservation-of-mass',
          experimentTitle: 'Law of Conservation of Mass',
          score,
          maxScore: 100,
          attemptNumber: privateLabContext.attemptNumber || 1,
          timeSpentSeconds: 160,
          mistakes,
          calculationAnswers: {
            deltaM: state.studentDeltaM ?? 0,
            deviationPercent: state.studentDeviationPercent ?? 0,
          },
        });
      } else {
        recordStudentPerformance({
          studentId: effectiveUser.id,
          studentName: effectiveUser.name || 'Student',
          studentEmail: effectiveUser.email,
          avatar: effectiveUser.avatar || '🎓',
          experimentId: 'conservation-of-mass',
          experimentTitle: 'Law of Conservation of Mass',
          type: 'practice',
          score,
          maxScore: 100,
          attemptNumber: 1,
          timeSpentSeconds: 160,
          mistakes,
          calculationAnswers: {
            deltaM: state.studentDeltaM ?? 0,
            deviationPercent: state.studentDeviationPercent ?? 0,
          },
        });
      }
    }
  }, [user, privateLabContext, score, state, expectedDeviation]);

  // Score count-up animation
  useEffect(() => {
    const target = score;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [score]);

  // Build report data for modal
  const reportData = useMemo(() => {
    return buildConservationReportData(state, user, language, t, tDynamic);
  }, [state, user, language, t, tDynamic]);

  // Determine grade and colors matching design system
  const gradeKey = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Satisfactory' : 'Needs Practice';

  const gradeColors: Record<string, string> = {
    'Excellent': '#059669',
    'Good': '#2563eb',
    'Satisfactory': '#d97706',
    'Needs Practice': '#dc2626',
  };

  const gradeNames: Record<string, string> = {
    'Excellent': t('results.gradeExcellent', 'Excellent'),
    'Good': t('results.gradeGood', 'Good'),
    'Satisfactory': t('results.gradeSatisfactory', 'Satisfactory'),
    'Needs Practice': t('results.gradeNeedsPractice', 'Needs Practice'),
  };

  const displayGrade = gradeNames[gradeKey] ?? gradeKey;
  const gradeColor = gradeColors[gradeKey] ?? '#059669';

  // Pedagogical Rubric Categories
  const rubricCategories = useMemo(() => [
    {
      name: t('conservation.procedureOrder', 'Procedure & Step Sequence'),
      points: state.mistakes.length === 0 ? 20 : state.mistakes.length <= 2 ? 10 : 0,
      maxPoints: 20,
      explanation: state.mistakes.length === 0
        ? t('conservation.expOrderPerfect', 'All steps executed in correct sequence with zero protocol errors.')
        : t('conservation.expOrderMistakes', 'Minor sequence errors recorded during execution.'),
    },
    {
      name: t('conservation.flaskSealed', 'Airtight System Sealing'),
      points: state.flaskSealed && state.initialMass !== null ? 15 : 0,
      maxPoints: 15,
      explanation: state.flaskSealed
        ? t('conservation.expSealedGood', 'Flask was airtight and sealed before recording initial mass and mixing.')
        : t('conservation.expSealedBad', 'Flask was not sealed properly before mixing.'),
    },
    {
      name: t('conservation.m1Recorded', 'Initial Mass Recording (m₁)'),
      points: state.initialMass !== null ? 15 : 0,
      maxPoints: 15,
      explanation: state.initialMass !== null
        ? t('conservation.expM1Good', 'Initial mass of sealed apparatus recorded accurately on electronic balance.')
        : t('conservation.expM1Bad', 'Initial mass measurement was omitted.'),
    },
    {
      name: t('conservation.mixingDone', 'Reactant Mixing & Observation'),
      points: state.reactantsMixed ? 10 : 0,
      maxPoints: 10,
      explanation: state.reactantsMixed
        ? t('conservation.expMixGood', 'Reactants thoroughly mixed and precipitate formation observed.')
        : t('conservation.expMixBad', 'Reactants were not mixed.'),
    },
    {
      name: t('conservation.m2Recorded', 'Final Mass Recording (m₂)'),
      points: state.finalMass !== null ? 10 : 0,
      maxPoints: 10,
      explanation: state.finalMass !== null
        ? t('conservation.expM2Good', 'Post-reaction mass measured accurately on electronic balance.')
        : t('conservation.expM2Bad', 'Final mass measurement was omitted.'),
    },
    {
      name: t('conservation.deltaMCalc', 'Mass Difference Calculation (ΔM)'),
      points: state.studentDeltaM !== null
        ? Math.abs(state.studentDeltaM - expectedDeltaM) <= 0.005 ? 15 : Math.abs(state.studentDeltaM - expectedDeltaM) <= 0.02 ? 8 : 0
        : 0,
      maxPoints: 15,
      explanation: state.studentDeltaM !== null && Math.abs(state.studentDeltaM - expectedDeltaM) <= 0.005
        ? t('conservation.expDeltaMGood', 'Accurately calculated difference in mass between initial and final readings.')
        : t('conservation.expDeltaMBad', 'Calculation error in mass difference formula.'),
    },
    {
      name: t('conservation.deviationPercent', 'Percentage Deviation Calculation'),
      points: state.studentDeviationPercent !== null
        ? Math.abs(state.studentDeviationPercent - expectedDeviation) <= 0.02 ? 15 : Math.abs(state.studentDeviationPercent - expectedDeviation) <= 0.1 ? 8 : 0
        : 0,
      maxPoints: 15,
      explanation: state.studentDeviationPercent !== null && Math.abs(state.studentDeviationPercent - expectedDeviation) <= 0.02
        ? t('conservation.expDevGood', 'Percentage error correctly computed relative to initial mass.')
        : t('conservation.expDevBad', 'Error in percentage deviation calculation.'),
    },
  ], [state, expectedDeltaM, expectedDeviation, t]);

  const handleRepeatExperiment = () => {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'START_EXPERIMENT' });
  };

  return (
    <div
      style={{
        maxWidth: 640,
        width: '100%',
        margin: '0 auto',
        padding: '24px 16px',
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      {/* Classroom Lab Evaluation Banner */}
      {privateLabContext && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(5, 150, 105, 0.12))',
            border: '1.5px solid rgba(2, 132, 199, 0.35)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>🏫</span>
              <span>Classroom Lab Evaluation</span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
              {privateLabContext.lab.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Instructor: {privateLabContext.lab.teacherName} • Attempt #{privateLabContext.attemptNumber}
            </div>
          </div>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#059669',
              background: 'rgba(5, 150, 105, 0.15)',
              border: '1px solid rgba(5, 150, 105, 0.3)',
              padding: '5px 12px',
              borderRadius: 8,
            }}
          >
            ✓ Recorded to Gradebook
          </span>
        </div>
      )}

      {/* Top Score Circle & Performance Feedback Card */}
      <div
        className="glass-card"
        style={{
          padding: '32px 24px',
          textAlign: 'center',
          marginBottom: 18,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: `4px solid ${gradeColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            background: `${gradeColor}10`,
          }}
        >
          <span
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: gradeColor,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {animatedScore}
          </span>
        </div>
        <div
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: gradeColor,
            marginBottom: 6,
          }}
        >
          {displayGrade}
        </div>
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            maxWidth: 440,
            margin: '0 auto',
          }}
        >
          {calcEval.explanation}
        </p>
      </div>

      {/* Mass Conservation Summary (Result & Comparison Readings) */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          marginBottom: 18,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
        }}
      >
        <h3
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>⚖️</span>
          <span>{t('conservation.verificationTitle', 'Mass Conservation Verification')}</span>
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ textAlign: 'center', padding: '12px 8px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669', marginBottom: 4 }}>
              {t('conservation.initialMass', 'Initial Mass (m₁)')}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
              {m1.toFixed(2)} g
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 8px', background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>
              {t('conservation.finalMass', 'Final Mass (m₂)')}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
              {m2.toFixed(2)} g
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 8px', background: '#fefce8', borderRadius: 10, border: '1px solid #fef08a' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#d97706', marginBottom: 4 }}>
              ΔM = |m₁ - m₂|
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
              {expectedDeltaM.toFixed(2)} g
            </div>
          </div>
        </div>

        {/* Scientific observation badge */}
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: '0.78rem',
            color: 'var(--text-primary)',
            lineHeight: 1.5,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>👁️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
              {t('conservation.observationTitle', 'Scientific Observation')}
            </div>
            {state.precipitateFormed
              ? t('conservation.observationRecorded', 'A white precipitate of barium sulphate (BaSO₄) is formed when barium chloride reacts with sodium sulphate.')
              : t('conservation.noObservation', 'Reaction not completed.')}
          </div>
        </div>

        {/* Reaction equation */}
        <div
          style={{
            padding: '10px 14px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 8,
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#059669',
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          {REACTION_EQUATION}
        </div>

        {/* Conclusion statement */}
        <div
          style={{
            padding: '12px 14px',
            background: expectedDeltaM <= 0.02 ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${expectedDeltaM <= 0.02 ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: 8,
            fontSize: '0.78rem',
            color: expectedDeltaM <= 0.02 ? '#166534' : '#991b1b',
            lineHeight: 1.5,
          }}
        >
          <strong>{t('conservation.conclusionTitle', 'Conclusion')}: </strong>
          {expectedDeltaM <= 0.02
            ? t('conservation.conclusionVerified', 'The total mass remains conserved before and after the chemical reaction, within the precision of the simulated balance. Hence, the law of conservation of mass is verified.')
            : t('conservation.massNotConserved', { deltaM: expectedDeltaM.toFixed(2) })}
        </div>
      </div>

      {/* Pedagogical Rubric Breakdown */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          marginBottom: 18,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
        }}
      >
        <h3
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 14,
          }}
        >
          {t('results.rubricBreakdown', 'Pedagogical Rubric Breakdown')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rubricCategories.map((cat, i) => (
            <div key={i}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {cat.name}
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color:
                      cat.points >= cat.maxPoints * 0.7
                        ? '#059669'
                        : cat.points >= cat.maxPoints * 0.4
                        ? '#d97706'
                        : '#dc2626',
                  }}
                >
                  {cat.points}/{cat.maxPoints}
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: 5,
                  borderRadius: 3,
                  background: 'rgba(148, 163, 184, 0.15)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(cat.points / cat.maxPoints) * 100}%`,
                    borderRadius: 3,
                    background:
                      cat.points >= cat.maxPoints * 0.7
                        ? '#059669'
                        : cat.points >= cat.maxPoints * 0.4
                        ? '#d97706'
                        : '#dc2626',
                    transition: 'width 0.8s ease-out',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginTop: 3,
                }}
              >
                {cat.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mistakes summary */}
      {state.mistakes.length > 0 && (
        <div
          className="glass-card"
          style={{
            padding: '16px 20px',
            marginBottom: 18,
            background: 'var(--bg-card)',
            border: '1px solid #fed7aa',
            borderRadius: 14,
          }}
        >
          <h3
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#d97706',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}
          >
            {t('results.mistakesMade', 'Mistakes Made')} ({state.mistakes.length})
          </h3>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {[...new Set(state.mistakes)].map((m, i) => (
              <li
                key={i}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  marginBottom: 4,
                  lineHeight: 1.4,
                }}
              >
                {tDynamic(m)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Generate Lab Report Action Button */}
      {reportData && (
        <div style={{ marginBottom: 14 }}>
          <button
            id="btn-generate-report"
            type="button"
            onClick={() => setShowReportModal(true)}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7, #0f766e)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>📄</span>
            <span>{t('report.generateReport', 'Generate Lab Report')}</span>
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          id="btn-repeat-conservation"
          className="btn-secondary"
          onClick={handleRepeatExperiment}
          style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <span>🔄</span>
          <span>{t('results.tryAgain', 'Repeat Experiment')}</span>
        </button>
        <button
          id="btn-back-selector"
          className="btn-primary"
          onClick={onBackToSelector}
          style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <span>←</span>
          <span>{t('results.backToExperiments', 'Return to Experiment List')}</span>
        </button>
      </div>

      {/* Lab Report Modal */}
      {reportData && (
        <LabReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportData={reportData}
        />
      )}
    </div>
  );
};

export default ConservationResults;
