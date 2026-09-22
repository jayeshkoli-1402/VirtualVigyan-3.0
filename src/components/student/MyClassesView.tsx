import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  getEnrolledLabsForStudent,
  getStudentAttemptsCount,
  syncPrivateLabsWithCloud,
} from '../../services/privateLabService';
import { getAllExperiments } from '../../experiments';
import type { PrivateLab } from '../../types/privateLab';
import { JoinLabModal } from './JoinLabModal';

interface MyClassesViewProps {
  onLaunchPrivateExperiment: (experimentId: string, lab: PrivateLab, attemptNumber: number) => void;
  onOpenTeacherPortal?: () => void;
}

export const MyClassesView: React.FC<MyClassesViewProps> = ({ onLaunchPrivateExperiment, onOpenTeacherPortal }) => {
  const { user } = useAuth();
  const [enrolledLabs, setEnrolledLabs] = useState<PrivateLab[]>([]);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const refreshLabs = () => {
    if (user?.email) {
      setEnrolledLabs(getEnrolledLabsForStudent(user.email));
    }
  };

  useEffect(() => {
    refreshLabs();
    syncPrivateLabsWithCloud().then(() => {
      refreshLabs();
    });
  }, [user]);

  const allExperiments = getAllExperiments();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        flex: 1,
        padding: '28px 24px',
        maxWidth: 1240,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Teacher Guidance Alert */}
      {user?.role === 'teacher' && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.06))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>👨‍🏫</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#059669' }}>
                You are logged in as a Teacher!
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                To create private classroom labs, assign experiments, and view live student submissions, visit your Teacher Portal.
              </div>
            </div>
          </div>
          {onOpenTeacherPortal && (
            <button
              onClick={onOpenTeacherPortal}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '8px 18px',
                borderRadius: 10,
                background: '#059669',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
              }}
            >
              Open Teacher Portal ➔
            </button>
          )}
        </div>
      )}

      {/* Top Banner & Header */}
      <div
        className="clay-card"
        style={{
          padding: '24px 30px',
          background: 'linear-gradient(135deg, var(--bg-card), rgba(2, 132, 199, 0.08))',
          marginBottom: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              My Classroom Labs & Assessments
            </h2>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 8,
                background: 'rgba(2, 132, 199, 0.15)',
                color: '#0284c7',
              }}
            >
              {enrolledLabs.length} Enrolled {enrolledLabs.length === 1 ? 'Lab' : 'Labs'}
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Access private laboratory sessions, instructor evaluations, and exam assessments.
          </p>
        </div>

        <button
          id="btn-open-join-lab"
          onClick={() => setJoinModalOpen(true)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
            transition: 'all 0.15s ease',
          }}
        >
          <span>➕</span>
          <span>Join with Lab Code</span>
        </button>
      </div>

      {/* Enrolled Labs Grid or Empty State */}
      {enrolledLabs.length === 0 ? (
        <div
          className="clay-card"
          style={{
            padding: '50px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: 'rgba(2, 132, 199, 0.12)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}
          >
            🏫
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-primary)' }}>
              No Classroom Labs Joined Yet
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto', lineHeight: 1.5 }}>
              Has your teacher or lab instructor shared a private evaluation code? Enter the code to enroll and access assigned experiments.
            </p>
          </div>
          <button
            onClick={() => setJoinModalOpen(true)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '11px 24px',
              borderRadius: 12,
              background: '#0284c7',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.86rem',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
            }}
          >
            Enter Lab Join Code →
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {enrolledLabs.map((lab) => {
            const labExperiments = allExperiments.filter((exp) =>
              lab.experimentIds.includes(exp.id)
            );

            return (
              <div
                key={lab.id}
                className="clay-card"
                style={{
                  padding: 24,
                  borderRadius: 18,
                  border: '1.5px solid var(--border)',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                {/* Lab Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        {lab.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: lab.status === 'active' ? 'rgba(5, 150, 105, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                          color: lab.status === 'active' ? '#059669' : '#64748b',
                        }}
                      >
                        {lab.status === 'active' ? '● Active Session' : 'Submissions Closed'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Instructor: <strong>{lab.teacherName}</strong>
                      {lab.department ? ` • ${lab.department}` : ''}
                      {lab.institution ? ` (${lab.institution})` : ''}
                    </div>

                    {lab.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 0', lineHeight: 1.45 }}>
                        {lab.description}
                      </p>
                    )}
                  </div>

                  {/* Join Code Display */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        padding: '6px 14px',
                        borderRadius: 10,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {lab.code}
                    </div>
                    <button
                      onClick={() => handleCopyCode(lab.code)}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: 10,
                        background: copiedCode === lab.code ? '#059669' : 'rgba(2, 132, 199, 0.12)',
                        border: copiedCode === lab.code ? '1px solid #059669' : '1px solid rgba(2, 132, 199, 0.3)',
                        color: copiedCode === lab.code ? '#ffffff' : '#0284c7',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {copiedCode === lab.code ? '✓ Copied' : 'Copy Code'}
                    </button>
                  </div>
                </div>

                {/* Active Restrictions Ribbon */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.75rem',
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Classroom Rules:</span>
                  {lab.restrictions.hideProcedure && (
                    <span style={{ color: '#dc2626', fontWeight: 700, background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: 6 }}>
                      🔒 Assessment Mode (Procedure Concealed)
                    </span>
                  )}
                  {lab.restrictions.hideFormulas && (
                    <span style={{ color: '#7c3aed', fontWeight: 700, background: 'rgba(124, 58, 237, 0.1)', padding: '2px 8px', borderRadius: 6 }}>
                      📐 Formulas Concealed
                    </span>
                  )}
                  {lab.restrictions.timeLimitMinutes && lab.restrictions.timeLimitMinutes > 0 ? (
                    <span style={{ color: '#0284c7', fontWeight: 700, background: 'rgba(2, 132, 199, 0.1)', padding: '2px 8px', borderRadius: 6 }}>
                      ⏱️ {lab.restrictions.timeLimitMinutes} min Countdown Timer
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>⏱️ No time limit</span>
                  )}
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                    🔄 {lab.restrictions.maxAttempts ? `Max ${lab.restrictions.maxAttempts} ${lab.restrictions.maxAttempts === 1 ? 'Attempt' : 'Attempts'}` : 'Unlimited attempts'}
                  </span>
                </div>

                {/* Included Experiments Cards */}
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                    Assigned Experiments ({labExperiments.length})
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                    {labExperiments.map((exp) => {
                      const attemptsUsed = user?.email
                        ? getStudentAttemptsCount(lab.id, user.email, exp.id)
                        : 0;
                      const maxAttempts = lab.restrictions.maxAttempts || 0;
                      const canAttempt = maxAttempts === 0 || attemptsUsed < maxAttempts;

                      // Find latest submission if any
                      const userSubmissions = lab.submissions.filter(
                        (s) =>
                          s.studentEmail?.toLowerCase() === user?.email?.toLowerCase() &&
                          s.experimentId === exp.id
                      );
                      const bestScore = userSubmissions.length > 0
                        ? Math.max(...userSubmissions.map((s) => s.score))
                        : null;

                      return (
                        <div
                          key={exp.id}
                          style={{
                            padding: '14px 16px',
                            borderRadius: 12,
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 12,
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                              <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>
                                {exp.subject || 'Chemistry'}
                              </span>
                              {bestScore !== null && (
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    padding: '2px 8px',
                                    borderRadius: 6,
                                    background: bestScore >= 80 ? 'rgba(5, 150, 105, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                                    color: bestScore >= 80 ? '#059669' : '#d97706',
                                  }}
                                >
                                  Score: {bestScore}/100
                                </span>
                              )}
                            </div>

                            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '6px 0 4px', color: 'var(--text-primary)' }}>
                              {exp.title}
                            </h4>
                            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                              {exp.description}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              {maxAttempts > 0
                                ? `Attempt ${attemptsUsed} of ${maxAttempts}`
                                : `${attemptsUsed} ${attemptsUsed === 1 ? 'attempt' : 'attempts'} completed`}
                            </span>

                            <button
                              onClick={() => onLaunchPrivateExperiment(exp.id, lab, attemptsUsed + 1)}
                              disabled={!canAttempt || lab.status === 'closed'}
                              style={{
                                all: 'unset',
                                cursor: canAttempt && lab.status === 'active' ? 'pointer' : 'not-allowed',
                                padding: '6px 14px',
                                borderRadius: 8,
                                background: canAttempt && lab.status === 'active' ? '#0284c7' : 'rgba(148, 163, 184, 0.2)',
                                color: canAttempt && lab.status === 'active' ? '#ffffff' : 'var(--text-muted)',
                                fontWeight: 700,
                                fontSize: '0.76rem',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {!canAttempt
                                ? 'Attempts Limit Reached'
                                : lab.status === 'closed'
                                ? 'Closed'
                                : attemptsUsed > 0
                                ? 'Retake Assessment →'
                                : 'Start Assessment →'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Join Lab Modal */}
      <JoinLabModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoinedSuccess={() => {
          refreshLabs();
        }}
      />
    </div>
  );
};
