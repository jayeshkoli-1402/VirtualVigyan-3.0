import React from 'react';
import { getAllExperiments } from '../experiments';

interface ExperimentSelectorProps {
  onSelectExperiment: (id: 'titration' | 'conservation') => void;
  onSelectEngineExperiment?: (id: string) => void;
}

const experiments = [
  {
    id: 'conservation' as const,
    title: 'Conservation of Mass',
    subtitle: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',
    description: 'Verify the Law of Conservation of Mass by measuring the total mass of a sealed system before and after a double displacement reaction.',
    classLevel: 'Class 9',
    subject: 'Chemistry',
    topic: 'Chemical Reactions & Laws',
    difficulty: 'Beginner',
    icon: '⚖️',
    accentFrom: '#059669',
    accentTo: '#0d9488',
    borderAccent: 'rgba(5, 150, 105, 0.3)',
  },
  {
    id: 'titration' as const,
    title: 'Acid-Base Titration',
    subtitle: 'HCl + NaOH → NaCl + H₂O',
    description: 'Determine the unknown concentration of HCl by titrating with NaOH solution using phenolphthalein indicator.',
    classLevel: 'Class 11',
    subject: 'Chemistry',
    topic: 'Volumetric Analysis',
    difficulty: 'Intermediate',
    icon: '🧪',
    accentFrom: '#2563eb',
    accentTo: '#7c3aed',
    borderAccent: 'rgba(37, 99, 235, 0.3)',
  },
];

const ExperimentSelector: React.FC<ExperimentSelectorProps> = ({ onSelectExperiment, onSelectEngineExperiment }) => {
  const [category, setCategory] = React.useState<'all' | 'dbatu' | 'school'>('all');
  const engineExperiments = getAllExperiments();

  const showLegacy = category === 'all' || category === 'school';
  const filteredEngineExperiments = engineExperiments.filter((exp) => {
    if (category === 'all') return true;
    if (category === 'dbatu') return exp.class === 'F.Y. B.Tech' || exp.chapter.includes('Engineering');
    if (category === 'school') return typeof exp.class === 'number';
    return true;
  });

  return (
    <div
      className="animate-fade-in"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        minHeight: '80vh',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.12), rgba(59, 130, 246, 0.12))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(45, 212, 191, 0.2)',
          }}
        >
          <span style={{ fontSize: 32 }}>🔬</span>
        </div>
        <h2
          style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            marginBottom: 6,
            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Select Experiment
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            maxWidth: 480,
            margin: '0 auto 20px',
            lineHeight: 1.6,
          }}
        >
          Choose an experiment to begin your interactive virtual lab simulation.
        </p>

        {/* Category Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Experiments' },
            { id: 'dbatu', label: '🎓 F.Y. B.Tech (DBATU)' },
            { id: 'school', label: '🏫 Classes 9–12 (NCERT)' },
          ].map((tab) => {
            const active = category === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id as 'all' | 'dbatu' | 'school')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 20,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: active ? '1px solid var(--accent-teal)' : '1px solid var(--border-subtle)',
                  background: active ? 'rgba(13, 148, 136, 0.15)' : 'var(--bg-card)',
                  color: active ? 'var(--accent-teal)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experiment Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
          maxWidth: 1080,
          width: '100%',
        }}
      >
        {showLegacy && experiments.map((exp) => (
          <button
            key={exp.id}
            id={`btn-select-${exp.id}`}
            onClick={() => onSelectExperiment(exp.id)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
              background: 'var(--bg-card)',
              border: `1.5px solid ${exp.borderAccent}`,
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(-3px)';
              el.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
              el.style.borderColor = exp.accentFrom;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
              el.style.borderColor = exp.borderAccent;
            }}
          >
            {/* Decorative gradient bar at top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${exp.accentFrom}, ${exp.accentTo})`,
                borderRadius: '16px 16px 0 0',
              }}
            />

            {/* Icon + Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${exp.accentFrom}18, ${exp.accentTo}18)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {exp.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: exp.accentFrom,
                      background: `${exp.accentFrom}12`,
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {exp.classLevel}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      background: 'rgba(148, 163, 184, 0.1)',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {exp.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 4,
                lineHeight: 1.3,
              }}
            >
              {exp.title}
            </h3>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                color: exp.accentFrom,
                marginBottom: 10,
              }}
            >
              {exp.subtitle}
            </p>

            {/* Description */}
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                marginBottom: 16,
                flex: 1,
              }}
            >
              {exp.description}
            </p>

            {/* Topic tag */}
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: 12,
              }}
            >
              📖 {exp.topic}
            </div>

            {/* Start arrow */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${exp.accentFrom}, ${exp.accentTo})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              →
            </div>
          </button>
        ))}

        {/* ═══ NEW ENGINE EXPERIMENTS ═══ */}
        {filteredEngineExperiments.map((exp) => (
          <button
            key={exp.id}
            id={`btn-select-${exp.id}`}
            onClick={() => onSelectEngineExperiment?.(exp.id)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
              background: 'var(--bg-card)',
              border: `1.5px solid ${exp.themeColor}40`,
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(-3px)';
              el.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
              el.style.borderColor = exp.themeColor;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
              el.style.borderColor = `${exp.themeColor}40`;
            }}
          >
            {/* Gradient bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${exp.themeColor}, ${exp.themeColor}cc)`,
              borderRadius: '16px 16px 0 0',
            }} />

            {/* Icon + Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${exp.themeColor}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>
                {exp.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.04em', color: exp.themeColor,
                    background: `${exp.themeColor}12`, padding: '2px 8px', borderRadius: 4,
                  }}>
                    {typeof exp.class === 'number' ? `Class ${exp.class}` : exp.class}
                  </span>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-muted)',
                    background: 'rgba(148, 163, 184, 0.1)', padding: '2px 8px', borderRadius: 4,
                  }}>
                    {exp.difficulty}
                  </span>
                  {/* NEW ENGINE BADGE */}
                  <span style={{
                    fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.04em', color: '#7c3aed',
                    background: 'rgba(124, 58, 237, 0.1)',
                    padding: '2px 8px', borderRadius: 4,
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                  }}>
                    ⚡ New Engine
                  </span>
                </div>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h3 style={{
              fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)',
              marginBottom: 4, lineHeight: 1.3,
            }}>
              {exp.title}
            </h3>
            <p style={{
              fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
              color: exp.themeColor, marginBottom: 10,
            }}>
              {exp.subtitle}
            </p>

            {/* Description */}
            <p style={{
              fontSize: '0.82rem', color: 'var(--text-secondary)',
              lineHeight: 1.55, marginBottom: 16, flex: 1,
            }}>
              {exp.description}
            </p>

            {/* Chapter tag */}
            <div style={{
              fontSize: '0.7rem', color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-subtle)', paddingTop: 12,
            }}>
              📖 {exp.chapter}
            </div>

            {/* Start arrow */}
            <div style={{
              position: 'absolute', bottom: 24, right: 24,
              width: 32, height: 32, borderRadius: '50%',
              background: exp.themeColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', fontSize: 14, fontWeight: 700,
            }}>
              →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExperimentSelector;
