import React, { useState, useMemo } from 'react';
import type { PrivateLab } from '../../types/privateLab';
import {
  calculateLabLeaderboard,
  exportLabLeaderboardCSV,
  canAccessLabLeaderboard,
} from '../../services/labLeaderboardService';
import { getAllExperiments } from '../../experiments';

interface LabLeaderboardViewProps {
  lab: PrivateLab;
  currentUserEmail?: string;
  currentUserRole?: string;
  isTeacherView?: boolean;
  onLaunchExperiment?: (expId: string) => void;
  onClose?: () => void;
}

export const LabLeaderboardView: React.FC<LabLeaderboardViewProps> = ({
  lab,
  currentUserEmail,
  currentUserRole,
  isTeacherView = false,
  onLaunchExperiment,
  onClose,
}) => {
  const [selectedExpId, setSelectedExpId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Permission Check
  const access = useMemo(() => {
    return canAccessLabLeaderboard(lab, currentUserEmail, currentUserRole);
  }, [lab, currentUserEmail, currentUserRole]);

  const allExperiments = useMemo(() => getAllExperiments(), []);

  // Assigned experiments in this lab
  const assignedExperiments = useMemo(() => {
    return allExperiments.filter((exp) => (lab.experimentIds || []).includes(exp.id));
  }, [allExperiments, lab.experimentIds]);

  // Compute leaderboard summary
  const summary = useMemo(() => {
    return calculateLabLeaderboard(lab, selectedExpId, currentUserEmail);
  }, [lab, selectedExpId, currentUserEmail]);

  // Filter entries by search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return summary.entries;
    const q = searchQuery.toLowerCase();
    return summary.entries.filter(
      (e) =>
        e.studentName.toLowerCase().includes(q) ||
        e.studentEmail.toLowerCase().includes(q) ||
        (e.experimentTitle && e.experimentTitle.toLowerCase().includes(q))
    );
  }, [summary.entries, searchQuery]);

  // Top 3 Podium (Only completed students with ranks 1, 2, 3)
  const podiumWinners = useMemo(() => {
    return summary.entries.filter((e) => e.status === 'completed' && e.rank && e.rank <= 3);
  }, [summary.entries]);

  if (!access.allowed) {
    return (
      <div
        className="clay-card"
        style={{
          padding: '40px 24px',
          textAlign: 'center',
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1.5px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div style={{ fontSize: 40 }}>🔒</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Access Restricted
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: 460, margin: 0 }}>
          {access.reason || 'You do not have permission to view this private lab leaderboard.'}
        </p>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '9px 20px',
              borderRadius: 10,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.82rem',
            }}
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── LAB HEADER & CODE BADGE ── */}
      <div
        style={{
          padding: '20px 24px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(37, 99, 235, 0.06))',
          border: '1px solid rgba(2, 132, 199, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 24 }}>🏆</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {lab.title} — Leaderboard
            </h3>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 900,
                fontSize: '0.82rem',
                background: '#0284c7',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: 8,
                letterSpacing: '0.04em',
              }}
            >
              {lab.code}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 6 }}>
            {lab.targetClass ? `${lab.targetClass} • ` : ''}Instructor: <strong>{lab.teacherName}</strong>
            {lab.dueDate && (
              <span style={{ marginLeft: 8, color: '#d97706', fontWeight: 700 }}>
                • 📅 Due: {lab.dueDate}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isTeacherView && (
            <button
              onClick={() => exportLabLeaderboardCSV(lab, selectedExpId)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: 10,
                background: '#059669',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
              }}
            >
              <span>📥</span>
              <span>Export CSV</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: 8,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.78rem',
              }}
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* ── CURRENT STUDENT STANDING CARD (Student View) ── */}
      {!isTeacherView && summary.currentStudentEntry && (
        <div
          className="clay-card"
          style={{
            padding: '16px 22px',
            borderRadius: 14,
            background:
              summary.currentStudentEntry.status === 'completed'
                ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(16, 185, 129, 0.05))'
                : 'linear-gradient(135deg, rgba(217, 119, 6, 0.12), rgba(245, 158, 11, 0.05))',
            border:
              summary.currentStudentEntry.status === 'completed'
                ? '1.5px solid rgba(5, 150, 105, 0.35)'
                : '1.5px solid rgba(217, 119, 6, 0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>
              {summary.currentStudentEntry.rank === 1
                ? '🥇'
                : summary.currentStudentEntry.rank === 2
                ? '🥈'
                : summary.currentStudentEntry.rank === 3
                ? '🥉'
                : summary.currentStudentEntry.status === 'completed'
                ? '🎖️'
                : '⏳'}
            </span>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Your Performance & Standing
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {summary.currentStudentEntry.studentName}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                {summary.currentStudentEntry.status === 'completed' ? (
                  <>
                    Rank <strong>#{summary.currentStudentEntry.rank}</strong> of {summary.totalCompleted} completed (
                    {summary.totalEnrolled} participants)
                  </>
                ) : (
                  <>Status: <strong>Not Started Yet</strong> — Complete practical to earn your rank!</>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {summary.currentStudentEntry.status === 'completed' ? (
              <>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>YOUR SCORE</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669' }}>
                    {summary.currentStudentEntry.score}/100
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>ATTEMPTS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    #{summary.currentStudentEntry.attemptNumber}
                  </div>
                </div>
              </>
            ) : (
              assignedExperiments.length > 0 && onLaunchExperiment && (
                <button
                  onClick={() => onLaunchExperiment(assignedExperiments[0].id)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '8px 18px',
                    borderRadius: 10,
                    background: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                  }}
                >
                  Start Practical Now →
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* ── METRIC CARDS ROW ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 12,
        }}
      >
        <div
          className="clay-card"
          style={{
            padding: '14px 18px',
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            👥 Total Participants
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
            {summary.totalEnrolled}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Enrolled in this Lab
          </div>
        </div>

        <div
          className="clay-card"
          style={{
            padding: '14px 18px',
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            ✓ Completed
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: 4 }}>
            {summary.totalCompleted}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {summary.totalEnrolled > 0
              ? `${Math.round((summary.totalCompleted / summary.totalEnrolled) * 100)}% completion rate`
              : '0%'}
          </div>
        </div>

        <div
          className="clay-card"
          style={{
            padding: '14px 18px',
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            ⏳ Not Started / In Progress
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706', marginTop: 4 }}>
            {summary.totalNotStarted}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Pending submissions
          </div>
        </div>

        <div
          className="clay-card"
          style={{
            padding: '14px 18px',
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            📊 Class Average
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0284c7', marginTop: 4 }}>
            {summary.totalCompleted > 0 ? `${summary.averageScore}%` : '—'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Mean evaluation score
          </div>
        </div>

        <div
          className="clay-card"
          style={{
            padding: '14px 18px',
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            🌟 Highest Score
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#7c3aed', marginTop: 4 }}>
            {summary.totalCompleted > 0 ? `${summary.highestScore}/100` : '—'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Top performance
          </div>
        </div>
      </div>

      {/* ── TOP 3 PODIUM (If submissions exist) ── */}
      {podiumWinners.length > 0 && (
        <div
          className="clay-card"
          style={{
            padding: '20px 24px',
            borderRadius: 16,
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
            🌟 Top Performers Podium
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {podiumWinners.map((entry) => {
              const medal = entry.rank === 1 ? '🥇 1st Place' : entry.rank === 2 ? '🥈 2nd Place' : '🥉 3rd Place';
              const bgGrad =
                entry.rank === 1
                  ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(202, 138, 4, 0.05))'
                  : entry.rank === 2
                  ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.15), rgba(100, 116, 139, 0.05))'
                  : 'linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(180, 83, 9, 0.05))';
              const borderCol =
                entry.rank === 1
                  ? 'rgba(234, 179, 8, 0.4)'
                  : entry.rank === 2
                  ? 'rgba(148, 163, 184, 0.4)'
                  : 'rgba(217, 119, 6, 0.4)';

              return (
                <div
                  key={entry.studentEmail}
                  style={{
                    padding: '16px',
                    borderRadius: 12,
                    background: bgGrad,
                    border: `1.5px solid ${borderCol}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 32 }}>{entry.avatar || '🎓'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: entry.rank === 1 ? '#ca8a04' : entry.rank === 2 ? '#64748b' : '#b45309' }}>
                      {medal}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.studentName} {entry.isCurrentStudent && <span style={{ color: '#0284c7' }}>(You)</span>}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Attempt #{entry.attemptNumber}
                      {entry.timeSpentSeconds && ` • ${Math.floor(entry.timeSpentSeconds / 60)}m ${entry.timeSpentSeconds % 60}s`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#059669' }}>
                      {entry.score}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 700 }}>PTS</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FILTER & SEARCH BAR ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Experiment Filter Selector */}
        {assignedExperiments.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Filter Experiment:
            </label>
            <select
              value={selectedExpId}
              onChange={(e) => setSelectedExpId(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <option value="all">All Assigned Experiments ({assignedExperiments.length})</option>
              {assignedExperiments.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search Box */}
        <div style={{ flex: 1, maxWidth: 320, minWidth: 200, marginLeft: 'auto' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search student name..."
            style={{
              width: '100%',
              padding: '8px 14px',
              borderRadius: 8,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* ── LEADERBOARD TABLE ── */}
      <div
        className="clay-card"
        style={{
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {filteredEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No matching students found in this lab.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr
                  style={{
                    background: 'var(--bg-secondary)',
                    borderBottom: '2px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <th style={{ padding: '12px 14px', fontWeight: 800, width: 80 }}>Rank</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>Student</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>Score</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>Attempt</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>Time</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>Completion Date</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => {
                  const isTop3 = entry.rank && entry.rank <= 3;
                  const rankIcon =
                    entry.rank === 1
                      ? '🥇 1'
                      : entry.rank === 2
                      ? '🥈 2'
                      : entry.rank === 3
                      ? '🥉 3'
                      : entry.rank !== null
                      ? `#${entry.rank}`
                      : '—';

                  const rowHighlight = entry.isCurrentStudent
                    ? 'rgba(2, 132, 199, 0.08)'
                    : isTop3
                    ? 'rgba(234, 179, 8, 0.03)'
                    : 'transparent';

                  return (
                    <tr
                      key={entry.studentEmail}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: rowHighlight,
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* Rank */}
                      <td style={{ padding: '12px 14px', fontWeight: 900 }}>
                        <span
                          style={{
                            fontSize: isTop3 ? '0.95rem' : '0.84rem',
                            color:
                              entry.rank === 1
                                ? '#ca8a04'
                                : entry.rank === 2
                                ? '#64748b'
                                : entry.rank === 3
                                ? '#b45309'
                                : entry.rank !== null
                                ? 'var(--text-primary)'
                                : 'var(--text-muted)',
                          }}
                        >
                          {rankIcon}
                        </span>
                      </td>

                      {/* Student Info */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 22 }}>{entry.avatar || '🎓'}</span>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{entry.studentName}</span>
                              {entry.isCurrentStudent && (
                                <span
                                  style={{
                                    fontSize: '0.66rem',
                                    fontWeight: 800,
                                    padding: '1px 6px',
                                    borderRadius: 4,
                                    background: '#0284c7',
                                    color: '#ffffff',
                                  }}
                                >
                                  YOU
                                </span>
                              )}
                            </div>
                            {isTeacherView && (
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {entry.studentEmail}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td style={{ padding: '12px 14px' }}>
                        {entry.score !== null ? (
                          <span
                            style={{
                              fontWeight: 800,
                              padding: '3px 9px',
                              borderRadius: 6,
                              background: entry.score >= 80 ? 'rgba(5, 150, 105, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                              color: entry.score >= 80 ? '#059669' : '#d97706',
                              fontSize: '0.84rem',
                            }}
                          >
                            {entry.score}/100
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>—</span>
                        )}
                      </td>

                      {/* Attempt */}
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {entry.attemptNumber !== null ? (
                          <span>Attempt #{entry.attemptNumber}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      {/* Time Spent */}
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                        {entry.timeSpentSeconds !== null ? (
                          `${Math.floor(entry.timeSpentSeconds / 60)}m ${entry.timeSpentSeconds % 60}s`
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                        {entry.completedAt ? (
                          new Date(entry.completedAt).toLocaleDateString()
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        {entry.status === 'completed' ? (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: 6,
                              background: 'rgba(5, 150, 105, 0.12)',
                              color: '#059669',
                              border: '1px solid rgba(5, 150, 105, 0.25)',
                            }}
                          >
                            ✓ Completed
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: 6,
                              background: 'rgba(100, 116, 139, 0.12)',
                              color: '#64748b',
                              border: '1px solid rgba(100, 116, 139, 0.25)',
                            }}
                          >
                            ○ Not Started
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
