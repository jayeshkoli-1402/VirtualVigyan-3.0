import React, { useState } from 'react';

interface ClassesViewProps {
  onBackToHome: () => void;
  onLaunchExperiment: (id: string) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  onBackToHome,
  onLaunchExperiment,
}) => {
  const [activeClass, setActiveClass] = useState<'all' | 'class9' | 'class10' | 'class11' | 'btech'>('all');

  const classes = [
    {
      id: 'btech',
      name: 'F.Y. B.Tech (DBATU)',
      syllabus: 'Engineering Chemistry Laboratory Practicals',
      tag: 'Undergraduate',
      experiments: [
        { id: 'viscosity-ostwald', title: "Determination of Viscosity by Ostwald's Viscometer", time: '20 mins', diff: 'Medium' },
        { id: 'ph-metric-titration', title: 'pH-Metric Titration (Acid–Base)', time: '25 mins', diff: 'Medium' },
        { id: 'conductometric-titration', title: 'Conductometric Titration (HCl vs NaOH)', time: '25 mins', diff: 'Hard' },
        { id: 'chloride-mohr-method', title: "Chloride Content by Mohr's Method", time: '20 mins', diff: 'Medium' },
        { id: 'water-acidity', title: 'Acidity of Water Sample', time: '15 mins', diff: 'Medium' },
        { id: 'water-alkalinity', title: 'Determination of Alkalinity of Water', time: '20 mins', diff: 'Hard' },
        { id: 'water-hardness-edta', title: 'Hardness of Water by EDTA Method', time: '20 mins', diff: 'Easy' },
        { id: 'acid-value-oil', title: 'Acid Value of Vegetable Oil', time: '20 mins', diff: 'Medium' },
        { id: 'dissolved-oxygen-winkler', title: 'Dissolved Oxygen by Winkler’s Method', time: '30 mins', diff: 'Hard' },
      ],
    },
    {
      id: 'class11',
      name: 'Class 11 (NCERT / CBSE / State)',
      syllabus: 'Senior Secondary Chemistry Practical Curriculum',
      tag: 'Higher Secondary',
      experiments: [
        { id: 'titration', title: 'Acid-Base Titration (Volumetric Analysis)', time: '20 mins', diff: 'Medium' },
      ],
    },
    {
      id: 'class10',
      name: 'Class 10 (NCERT / CBSE / State)',
      syllabus: 'Chemical Reactions, Acids, Bases & Salts',
      tag: 'Secondary',
      experiments: [
        { id: 'zinc-acid-reaction', title: 'Zinc-Acid Reaction & Gas Evolution', time: '10 mins', diff: 'Beginner' },
      ],
    },
    {
      id: 'class9',
      name: 'Class 9 (NCERT / CBSE / State)',
      syllabus: 'Matter, Chemical Reactions & Fundamental Laws',
      tag: 'Secondary',
      experiments: [
        { id: 'conservation', title: 'Law of Conservation of Mass (Double Displacement)', time: '15 mins', diff: 'Beginner' },
      ],
    },
  ];

  const filtered = activeClass === 'all' ? classes : classes.filter((c) => c.id === activeClass);

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
          Curriculum by Class & Academic Level
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Aligned with DBATU Engineering Chemistry and NCERT / State Board Science syllabi.
        </p>
      </div>

      {/* Class Level Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Levels' },
          { id: 'btech', label: 'F.Y. B.Tech (DBATU)' },
          { id: 'class11', label: 'Class 11' },
          { id: 'class10', label: 'Class 10' },
          { id: 'class9', label: 'Class 9' },
        ].map((tab) => {
          const isSel = activeClass === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveClass(tab.id as any)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '7px 16px',
                borderRadius: 9999,
                fontSize: '0.8125rem',
                fontWeight: isSel ? 700 : 500,
                background: isSel ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
                border: isSel ? '1px solid #2563eb' : '1px solid var(--border)',
                color: isSel ? '#2563eb' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Class Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {filtered.map((c) => (
          <div
            key={c.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '24px 28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#2563eb',
                    background: 'rgba(37, 99, 235, 0.08)',
                    padding: '3px 8px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {c.tag}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 2px' }}>
                  {c.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {c.syllabus}
                </div>
              </div>
            </div>

            {/* Experiment List Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {c.experiments.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => onLaunchExperiment(exp.id)}
                  style={{
                    cursor: 'pointer',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                    {exp.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>⏱️ {exp.time}</span>
                    <span style={{ color: '#2563eb', fontWeight: 600 }}>Start Lab →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
