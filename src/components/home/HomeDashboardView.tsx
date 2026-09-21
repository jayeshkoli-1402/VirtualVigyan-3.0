import React from 'react';
import { HeroBanner } from './HeroBanner';
import { NotesPromoBanner } from './NotesPromoBanner';
import { ExperimentThumbnail } from './ExperimentCardThumbnails';
import { ALL_EXPERIMENTS, type ExperimentItem } from '../ExperimentSelector';

interface HomeDashboardViewProps {
  onSelectExperiment: (id: 'titration' | 'conservation') => void;
  onSelectEngineExperiment?: (id: string) => void;
  onBrowseAll: () => void;
  onGoToNotes: () => void;
  onGoToClasses: () => void;
  onGoToProgress: () => void;
  onOpenHowItWorks: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  onSelectExperiment,
  onSelectEngineExperiment,
  onBrowseAll,
  onGoToNotes,
  onGoToClasses,
  onGoToProgress,
  onOpenHowItWorks,
}) => {
  // Top 4 curated featured practicals for the home dashboard
  const featuredIds = [
    'viscosity-ostwald',
    'ph-metric-titration',
    'conductometric-titration',
    'titration',
  ];

  const featuredExperiments = featuredIds
    .map((id) => ALL_EXPERIMENTS.find((e) => e.id === id))
    .filter((e): e is ExperimentItem => Boolean(e));

  const handleCardClick = (item: ExperimentItem) => {
    if (item.type === 'legacy-titration') {
      onSelectExperiment('titration');
    } else if (item.type === 'legacy-conservation') {
      onSelectExperiment('conservation');
    } else if (onSelectEngineExperiment) {
      onSelectEngineExperiment(item.id);
    }
  };

  const getDifficultyBadge = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return { bg: '#dcfce7', color: '#15803d' };
      case 'Medium':
        return { bg: '#fef3c7', color: '#b45309' };
      case 'Hard':
        return { bg: '#fee2e2', color: '#dc2626' };
    }
  };

  const statMetrics = [
    {
      icon: '🧪',
      value: '12 Practicals',
      label: 'Interactive Lab Experiments',
      desc: 'Complete apparatus and reagent setups ready to simulate',
    },
    {
      icon: '🎓',
      value: 'DBATU & CBSE',
      label: 'Curriculum Aligned',
      desc: 'University engineering & high school syllabus coverage',
    },
    {
      icon: '⚡',
      value: 'Stoichiometry Engine',
      label: 'Real-time Calculations',
      desc: 'Dynamic pH solver, limiting reagents & reaction kinetics',
    },
    {
      icon: '🎯',
      value: 'Instant Diagnostics',
      label: 'Mistake Detection & Rubrics',
      desc: 'Procedural guidance with automated student grading',
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* ── 1. Welcome Hero Banner ── */}
      <HeroBanner
        onStartExploring={onBrowseAll}
        onViewHowItWorks={onOpenHowItWorks}
      />

      {/* ── 2. Platform Overview Metrics Strip ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: 36,
        }}
      >
        {statMetrics.map((stat, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                  marginBottom: 2,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: '0.73rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.4,
                }}
              >
                {stat.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Featured Experiments Section ── */}
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                Featured Experiments
              </h2>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  background: 'rgba(37, 99, 235, 0.1)',
                  padding: '3px 10px',
                  borderRadius: 9999,
                }}
              >
                Recommended
              </span>
            </div>
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                margin: '4px 0 0',
              }}
            >
              Core engineering and chemistry practical simulations to get started with hands-on learning.
            </p>
          </div>

          <button
            onClick={onBrowseAll}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#2563eb',
              background: 'rgba(37, 99, 235, 0.08)',
              padding: '8px 16px',
              borderRadius: 8,
              transition: 'background 0.15s ease',
            }}
          >
            Browse All 12 Experiments →
          </button>
        </div>

        {/* 4 Featured Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {featuredExperiments.map((item) => {
            const badge = getDifficultyBadge(item.difficulty);
            return (
              <div
                key={item.id}
                id={`featured-card-${item.id}`}
                onClick={() => handleCardClick(item)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: 'var(--shadow-xs)',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    height: 135,
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ExperimentThumbnail type={item.thumbnailType} width={280} height={135} />
                </div>

                {/* Content */}
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 9999,
                          background: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {item.difficulty}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.classLevel}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: '0 0 6px',
                        lineHeight: 1.35,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        margin: 0,
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 16,
                      paddingTop: 10,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: '#2563eb',
                        background: 'rgba(37, 99, 235, 0.08)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        maxWidth: '78%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.categoryTag}
                    </span>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.08)',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      →
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Learning Hub Modules (Quick Jump) ── */}
      <div style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
          }}
        >
          Learning Hub
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 18,
          }}
        >
          {/* Card 1: Theory & Notes */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  marginBottom: 14,
                }}
              >
                📖
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: '0 0 6px',
                }}
              >
                Theory & Notes
              </h3>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Master titration curves, chemical reaction mechanisms, calculations, and official laboratory manuals.
              </p>
            </div>
            <button
              onClick={onGoToNotes}
              style={{
                all: 'unset',
                cursor: 'pointer',
                marginTop: 18,
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#2563eb',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Explore Notes →
            </button>
          </div>

          {/* Card 2: My Classes */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(5, 150, 105, 0.1)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  marginBottom: 14,
                }}
              >
                📚
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: '0 0 6px',
                }}
              >
                My Classes & Curriculum
              </h3>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                View structured practical syllabi organized by academic class: F.Y. B.Tech DBATU, Class 11, Class 10, and Class 9.
              </p>
            </div>
            <button
              onClick={onGoToClasses}
              style={{
                all: 'unset',
                cursor: 'pointer',
                marginTop: 18,
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              View Class Syllabi →
            </button>
          </div>

          {/* Card 3: Progress & Analytics */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(217, 119, 6, 0.1)',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  marginBottom: 14,
                }}
              >
                📊
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: '0 0 6px',
                }}
              >
                Progress & Analytics
              </h3>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Track completion percentage, procedural accuracy rubrics, and diagnostic reports across all experiments.
              </p>
            </div>
            <button
              onClick={onGoToProgress}
              style={{
                all: 'unset',
                cursor: 'pointer',
                marginTop: 18,
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#d97706',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Check Progress Records →
            </button>
          </div>
        </div>
      </div>

      {/* ── 5. Bottom Notes Promo Banner ── */}
      <NotesPromoBanner onGoToNotes={onGoToNotes} />
    </div>
  );
};
