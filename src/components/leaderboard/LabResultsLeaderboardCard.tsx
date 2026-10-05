import React, { useMemo, useState } from 'react';
import type { PrivateLab } from '../../types/privateLab';
import { calculateLabLeaderboard } from '../../services/labLeaderboardService';
import { LabLeaderboardModal } from './LabLeaderboardModal';

interface LabResultsLeaderboardCardProps {
  lab: PrivateLab;
  currentUserEmail?: string;
  currentUserRole?: string;
  currentScore?: number;
  onLaunchExperiment?: (expId: string) => void;
}

export const LabResultsLeaderboardCard: React.FC<LabResultsLeaderboardCardProps> = ({
  lab,
  currentUserEmail,
  currentUserRole,
  currentScore,
  onLaunchExperiment,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const summary = useMemo(() => {
    return calculateLabLeaderboard(lab, undefined, currentUserEmail);
  }, [lab, currentUserEmail]);

  const currentStudent = summary.currentStudentEntry;
  const rank = currentStudent?.rank;

  return (
    <>
      <div
        className="clay-card animate-scale-up"
        style={{
          marginTop: 20,
          padding: '22px 26px',
          borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(16, 185, 129, 0.08))',
          border: '1.5px solid rgba(2, 132, 199, 0.35)',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Header Ribbon with subtle Sparkle effect */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                fontSize: 28,
                animation: 'vv_subtle_pulse 2s infinite ease-in-out',
                display: 'inline-block',
              }}
            >
              ✨
            </span>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.04em' }}>
                Verified Lab Performance Recorded ✓
              </div>
              <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {lab.title} — Class Standing
              </h4>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 800,
                fontSize: '0.78rem',
                background: '#0284c7',
                color: '#ffffff',
                padding: '3px 9px',
                borderRadius: 6,
              }}
            >
              {lab.code}
            </span>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.76rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
              }}
            >
              <span>🏆</span>
              <span>View Full Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Position & Highlights Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
          }}
        >
          {/* Your Rank Box */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 12,
              background: 'var(--bg-card)',
              border: '1.5px solid rgba(234, 179, 8, 0.4)',
              boxShadow: '0 0 16px rgba(234, 179, 8, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 32 }}>
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🎖️'}
            </span>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ca8a04', textTransform: 'uppercase' }}>
                Your Position
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {rank !== null && rank !== undefined ? `#${rank}` : '—'}
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginLeft: 4 }}>
                  of {summary.totalCompleted}
                </span>
              </div>
            </div>
          </div>

          {/* Recorded Score */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Evaluation Score
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#059669', marginTop: 2 }}>
              {currentScore !== undefined ? currentScore : currentStudent?.score ?? 100}
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>/100</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Attempt #{currentStudent?.attemptNumber || 1}
            </div>
          </div>

          {/* Class Average Comparison */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Class Average
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0284c7', marginTop: 2 }}>
              {summary.averageScore}%
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              {summary.totalCompleted} of {summary.totalEnrolled} finished
            </div>
          </div>
        </div>

        {/* Top 3 Quick Preview */}
        {summary.entries.filter((e) => e.status === 'completed').length > 0 && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
              fontSize: '0.78rem',
            }}
          >
            <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Top Classmates:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              {summary.entries
                .filter((e) => e.status === 'completed')
                .slice(0, 3)
                .map((e) => {
                  const medal = e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : '🥉';
                  const isYou = e.isCurrentStudent;
                  return (
                    <span
                      key={e.studentEmail}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontWeight: 700,
                        color: isYou ? '#0284c7' : 'var(--text-primary)',
                      }}
                    >
                      <span>{medal}</span>
                      <span>{e.studentName} {isYou && '(You)'}:</span>
                      <strong style={{ color: '#059669' }}>{e.score} pts</strong>
                    </span>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Modal */}
      <LabLeaderboardModal
        isOpen={modalOpen}
        lab={lab}
        onClose={() => setModalOpen(false)}
        currentUserEmail={currentUserEmail}
        currentUserRole={currentUserRole}
        onLaunchExperiment={onLaunchExperiment}
      />
    </>
  );
};
