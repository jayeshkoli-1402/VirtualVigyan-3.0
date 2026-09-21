import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import {
  getStudentHistory,
  getStudentOverallStats,
  type StudentPerformanceRecord,
} from '../../services/studentHistoryService';

interface ProgressViewProps {
  onBackToHome: () => void;
  onLaunchExperiment: (id: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  onBackToHome,
  onLaunchExperiment,
}) => {
  const { t, tDynamic } = useLanguage();
  const { user } = useAuth();
  const [history, setHistory] = useState<StudentPerformanceRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'private_lab' | 'practice'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = () => {
    setHistory(getStudentHistory(user?.email));
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('vv_student_history_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('vv_student_history_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user?.email]);

  const stats = getStudentOverallStats(user?.email);

  const filteredHistory = history.filter((h) => {
    if (filter === 'all') return true;
    return h.type === filter;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#0284c7';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Satisfactory';
    return 'Needs Review';
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    if (mins === 0) return `${s}s`;
    return `${mins}m ${s.toString().padStart(2, '0')}s`;
  };

  const getGradeText = (grade: string) => {
    if (grade === 'Outstanding') return t('progress.gradeOutstanding', 'Outstanding');
    if (grade === 'Very Good') return t('progress.gradeVeryGood', 'Very Good');
    if (grade === 'Satisfactory') return t('progress.gradeSatisfactory', 'Satisfactory');
    return t('progress.gradeNeedsReview', 'Needs Review');
  };

  const badges = [
    { icon: '🎯', title: t('progress.badgeTitrationMaster', 'Titration Master'), desc: t('progress.badgeTitrationMasterDesc', 'Endpoint accuracy achieved within optimal range'), unlocked: stats.avgScore >= 85 },
    { icon: '⚖️', title: t('progress.badgeMassPreserver', 'Mass Preserver'), desc: t('progress.badgeMassPreserverDesc', 'Mass stoichiometry verification compliant'), unlocked: stats.totalCompleted >= 2 },
    { icon: '🥽', title: t('progress.badgeSafetyChampion', 'Safety Champion'), desc: t('progress.badgeSafetyChampionDesc', 'Zero severe laboratory safety penalty infractions'), unlocked: stats.totalCompleted >= 3 },
    { icon: '⚡', title: t('progress.badgeElectroChemist', 'Electro Chemist'), desc: t('progress.badgeElectroChemistDesc', 'Completed conductance and ionic analysis practicals'), unlocked: stats.totalCompleted >= 4 },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '4px 0 40px' }}>
      {/* Top Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onBackToHome}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8125rem',
            color: '#2563eb',
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          ← {t('common.backToDashboard', undefined, 'Back to Dashboard')}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0 }}>
              {t('views.progress.title', 'Laboratory Performance & Unified History')}
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {t('views.progress.subtitle', 'Comprehensive activity log tracking both your private classroom assessments and open practice sessions.')}
            </p>
          </div>
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 9999,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              <span>{user.avatar || '🎓'}</span>
              <span>{user.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: '#0284c7' }}>{user.role}</span>
            </div>
          )}
        </div>
      </div>

      {/* Aggregate Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          {
            label: t('progress.totalSessions', 'Total Sessions Run'),
            value: stats.totalCompleted,
            sub: `${stats.privateLabCount} Assessments • ${stats.practiceCount} Practice`,
            color: '#2563eb',
          },
          {
            label: t('progress.avgScore', 'Average Score'),
            value: `${stats.avgScore}%`,
            sub: stats.avgScore >= 80 ? t('progress.classHonors', 'Class Honors Tier') : t('progress.activeProgress', 'Active Progress'),
            color: getScoreColor(stats.avgScore),
          },
          {
            label: t('progress.totalLabHours', 'Time in Laboratory'),
            value: `${stats.totalTimeMinutes} mins`,
            sub: t('progress.benchTime', 'Hands-on interactive apparatus time'),
            color: '#8b5cf6',
          },
          {
            label: t('progress.distinctPracticals', 'Distinct Practicals'),
            value: `${stats.distinctExperimentsCount}`,
            sub: t('progress.syllabusCoverage', 'Syllabus coverage index'),
            color: '#f59e0b',
          },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '18px 20px',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: m.color, margin: '6px 0 2px' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        {[
          { id: 'all', label: `All Activity (${history.length})` },
          { id: 'private_lab', label: `🏫 Private Lab Assessments (${stats.privateLabCount})` },
          { id: 'practice', label: `🧪 Practice & Simulation (${stats.practiceCount})` },
        ].map((tab) => {
          const isSel = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: '0.78rem',
                fontWeight: isSel ? 700 : 500,
                background: isSel ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-card)',
                border: isSel ? '1px solid #0284c7' : '1px solid var(--border)',
                color: isSel ? '#0284c7' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Two Column Layout: Performance Activity Log + Accreditations */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Completed Experiments Table Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '22px 24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {t('progress.performanceRecords', 'Performance Records')} ({filteredHistory.length})
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {t('progress.breakdownDesc', 'Detailed breakdown of scores, attempts, and mistakes')}
            </span>
          </div>

          {filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🧪</div>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>{t('progress.noRecords', 'No experiment records found under this filter.')}</p>
              <button
                onClick={() => onBackToHome()}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  marginTop: 12,
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {t('progress.browseExperiments', 'Browse Experiments →')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredHistory.map((item) => {
                const isExpanded = expandedId === item.id;
                const scoreColor = getScoreColor(item.score);
                const gradeText = getGradeText(getGrade(item.score));

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '16px',
                      borderRadius: 12,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 260 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          {item.type === 'private_lab' ? (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: 6,
                                background: 'rgba(2, 132, 199, 0.15)',
                                color: '#0284c7',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <span>🏫</span>
                              <span>{t('progress.privateLab', 'Private Lab')}: {item.labCode || 'Exam'}</span>
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: 6,
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#10b981',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <span>🧪</span>
                              <span>{t('progress.practiceSession', 'Practice Session')}</span>
                            </span>
                          )}

                          {item.labTitle && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              • {item.labTitle}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {tDynamic(item.experimentTitle)}
                        </div>

                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          {new Date(item.completedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' '}• {t('progress.time', 'Time')}: <strong>{formatSeconds(item.timeSpentSeconds)}</strong>
                          {' '}• {t('progress.attempt', 'Attempt')} #{item.attemptNumber}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: scoreColor }}>
                            {item.score}%
                          </div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: scoreColor }}>
                            {gradeText}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <button
                            onClick={() => onLaunchExperiment(item.experimentId)}
                            style={{
                              all: 'unset',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              color: '#ffffff',
                              fontWeight: 700,
                              padding: '5px 12px',
                              borderRadius: 6,
                              background: '#0284c7',
                              textAlign: 'center',
                            }}
                          >
                            {t('progress.retake', 'Retake ↗')}
                          </button>

                          <button
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            style={{
                              all: 'unset',
                              cursor: 'pointer',
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                              fontWeight: 600,
                              textAlign: 'center',
                              textDecoration: 'underline',
                            }}
                          >
                            {isExpanded ? t('progress.hideDetails', 'Hide Details ▲') : t('progress.inspectMistakes', 'Inspect Mistakes ▼')}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Diagnostics (Mistakes & Calculation Answers) */}
                    {isExpanded && (
                      <div
                        style={{
                          marginTop: 14,
                          paddingTop: 12,
                          borderTop: '1px solid var(--border)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                          fontSize: '0.78rem',
                        }}
                      >
                        {/* Mistakes list */}
                        <div>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                            {t('progress.safetyObservations', 'Logged Safety & Technique Observations:')}
                          </span>
                          {item.mistakes && item.mistakes.length > 0 ? (
                            <ul style={{ margin: '4px 0 0 18px', padding: 0, color: '#ef4444' }}>
                              {item.mistakes.map((m, idx) => (
                                <li key={idx} style={{ marginBottom: 3 }}>
                                  {tDynamic(m)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span style={{ color: '#10b981', fontWeight: 600 }}>
                              {t('progress.cleanRun', '✅ Clean run! Zero procedural or calculation mistakes flagged by engine.')}
                            </span>
                          )}
                        </div>

                        {/* Calculation answers if present */}
                        {item.calculationAnswers && Object.keys(item.calculationAnswers).length > 0 && (
                          <div style={{ marginTop: 4 }}>
                            <span style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                              {t('progress.calculationValues', 'Submitted Calculation Values:')}
                            </span>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {Object.entries(item.calculationAnswers).map(([k, v]) => (
                                <span
                                  key={k}
                                  style={{
                                    padding: '2px 8px',
                                    borderRadius: 6,
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.74rem',
                                  }}
                                >
                                  {k}: <strong>{v}</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Badges & Accreditations Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '22px 24px',
            boxShadow: 'var(--shadow-sm)',
            height: 'fit-content',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>
            {t('progress.earnedAccreditations', 'Earned Accreditations')}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {badges.map((b, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: b.unlocked ? 'var(--bg-secondary)' : 'rgba(148, 163, 184, 0.05)',
                  border: b.unlocked ? '1px solid rgba(16, 185, 129, 0.25)' : '1px dashed var(--border)',
                  opacity: b.unlocked ? 1 : 0.6,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: b.unlocked ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem',
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {b.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {b.desc}
                  </div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: b.unlocked ? '#10b981' : 'var(--text-muted)', marginTop: 4 }}>
                    {b.unlocked ? '✓ Unlocked' : '🔒 In Progress'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

