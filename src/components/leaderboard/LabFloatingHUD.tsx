import React, { useState, useMemo } from 'react';
import type { PrivateLab } from '../../types/privateLab';
import { calculateLabLeaderboard } from '../../services/labLeaderboardService';

interface LabFloatingHUDProps {
  lab: PrivateLab;
  currentUserEmail?: string;
  onOpenFullLeaderboard?: () => void;
}

export const LabFloatingHUD: React.FC<LabFloatingHUDProps> = ({
  lab,
  currentUserEmail,
  onOpenFullLeaderboard,
}) => {
  const [expanded, setExpanded] = useState(false);

  const summary = useMemo(() => {
    return calculateLabLeaderboard(lab, undefined, currentUserEmail);
  }, [lab, currentUserEmail]);

  const currentStudent = summary.currentStudentEntry;
  const isLocked = lab.isLocked ?? false;

  return (
    <div
      style={{
        position: 'fixed',
        top: 64,
        right: 18,
        zIndex: 9990,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 6,
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
      }}
    >
      {/* Floating Toggle Button */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: 9999,
          background: 'var(--bg-card, rgba(15, 23, 42, 0.9))',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.76rem',
          fontWeight: 700,
          color: 'var(--text-primary, #ffffff)',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>🏆</span>
        <span>
          {currentStudent?.rank !== null && currentStudent?.rank !== undefined
            ? `Standing: #${currentStudent.rank}`
            : 'Lab Standing'}
        </span>
        <span
          style={{
            fontSize: '0.66rem',
            padding: '1px 6px',
            borderRadius: 6,
            background: isLocked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(5, 150, 105, 0.2)',
            color: isLocked ? '#ef4444' : '#10b981',
            fontWeight: 800,
          }}
        >
          {isLocked ? '🔒 Locked' : '🔓 Active'}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Expanded Academic Performance Popover */}
      {expanded && (
        <div
          className="animate-fade-in"
          style={{
            width: 280,
            padding: '16px',
            borderRadius: 14,
            background: 'var(--bg-card, #0f172a)',
            border: '1.5px solid var(--border, rgba(255, 255, 255, 0.15))',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary, #ffffff)' }}>
                {lab.title}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted, #94a3b8)' }}>
                Code: <strong>{lab.code}</strong> • {summary.totalCompleted}/{summary.totalEnrolled} completed
              </div>
            </div>
          </div>

          {/* Current Student Position Badge */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(37, 99, 235, 0.08))',
              border: '1px solid rgba(2, 132, 199, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                Your Current Position
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary, #ffffff)' }}>
                {currentStudent?.rank !== null && currentStudent?.rank !== undefined
                  ? `#${currentStudent.rank} of ${summary.totalCompleted}`
                  : '— In Progress'}
              </div>
            </div>
            {currentStudent?.score !== null && currentStudent?.score !== undefined && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted, #94a3b8)' }}>BEST SCORE</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#059669' }}>
                  {currentStudent.score}/100
                </div>
              </div>
            )}
          </div>

          {/* Top Performers Preview */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: 6 }}>
              Top Performers
            </div>
            {summary.entries.filter((e) => e.status === 'completed').slice(0, 3).length === 0 ? (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', fontStyle: 'italic', padding: '4px 0' }}>
                No completed submissions yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {summary.entries
                  .filter((e) => e.status === 'completed')
                  .slice(0, 3)
                  .map((entry) => {
                    const isYou = entry.isCurrentStudent;
                    const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉';
                    return (
                      <div
                        key={entry.studentEmail}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.72rem',
                          padding: '3px 6px',
                          borderRadius: 6,
                          background: isYou ? 'rgba(2, 132, 199, 0.12)' : 'transparent',
                        }}
                      >
                        <span style={{ fontWeight: 700, color: 'var(--text-primary, #ffffff)' }}>
                          {medal} {entry.studentName} {isYou && '(You)'}
                        </span>
                        <span style={{ fontWeight: 800, color: '#059669' }}>
                          {entry.score} pts
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Action to view full leaderboard */}
          {onOpenFullLeaderboard && (
            <button
              onClick={() => {
                setExpanded(false);
                onOpenFullLeaderboard();
              }}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: 8,
                background: 'var(--bg-secondary, rgba(255, 255, 255, 0.08))',
                border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                color: '#0284c7',
                fontWeight: 700,
                fontSize: '0.72rem',
                textAlign: 'center',
                marginTop: 2,
              }}
            >
              View Full Lab Leaderboard →
            </button>
          )}
        </div>
      )}
    </div>
  );
};
