import React from 'react';

interface ProgressViewProps {
  onBackToHome: () => void;
  onLaunchExperiment: (id: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  onBackToHome,
  onLaunchExperiment,
}) => {

  const completedLabs = [
    {
      id: 'viscosity-ostwald',
      title: "Determination of Viscosity by Ostwald's Viscometer",
      date: 'Sep 12, 2026',
      score: 95,
      grade: 'Outstanding',
      color: '#10b981',
    },
    {
      id: 'ph-metric-titration',
      title: 'pH-Metric Titration (Acid–Base)',
      date: 'Sep 10, 2026',
      score: 88,
      grade: 'Very Good',
      color: '#0ea5e9',
    },
    {
      id: 'conductometric-titration',
      title: 'Conductometric Titration (HCl vs NaOH)',
      date: 'Sep 06, 2026',
      score: 92,
      grade: 'Outstanding',
      color: '#10b981',
    },
    {
      id: 'water-hardness-edta',
      title: 'Hardness of Water by EDTA Method',
      date: 'Aug 29, 2026',
      score: 84,
      grade: 'Good',
      color: '#f59e0b',
    },
  ];

  const badges = [
    { icon: '🎯', title: 'Titration Master', desc: 'Accurate endpoint within ±0.1 mL' },
    { icon: '⚖️', title: 'Mass Preserver', desc: 'Verified conservation within 0.05%' },
    { icon: '🥽', title: 'Safety Champion', desc: '100% PPE compliance score' },
    { icon: '⚡', title: 'Electro Chemist', desc: 'Completed Conductometry with zero error' },
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
          ← Back to Dashboard
        </button>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0 }}>
          My Laboratory Progress & Analytics
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Real-time performance tracking across all engineering and senior secondary chemistry practicals.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Practicals Completed', value: '4 / 11', sub: '36% Course Progress', color: '#2563eb' },
          { label: 'Average Accuracy', value: '89.8%', sub: '+4.2% from last week', color: '#10b981' },
          { label: 'Total Lab Hours', value: '6.4 hrs', sub: 'Interactive time on bench', color: '#8b5cf6' },
          { label: 'Earned Badges', value: '4 Badges', sub: 'Top 10% of class cohort', color: '#f59e0b' },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '18px 20px',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: m.color, margin: '6px 0 2px' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Completed Practicals + Badges */}
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
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>
            Completed Practicals Record
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {completedLabs.map((lab) => (
              <div
                key={lab.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {lab.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Verified on {lab.date} • Rating: <strong style={{ color: lab.color }}>{lab.grade}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: lab.color }}>
                      {lab.score}%
                    </div>
                  </div>
                  <button
                    onClick={() => onLaunchExperiment(lab.id)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      color: '#2563eb',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    Redo →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '22px 24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>
            Earned Accreditations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {badges.map((b, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {b.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {b.desc}
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
