import React, { useState } from 'react';
import { ALL_EXPERIMENTS } from '../ExperimentSelector';
import type { ExperimentItem } from '../ExperimentSelector';
import { ExperimentThumbnail } from '../home/ExperimentCardThumbnails';

interface ExperimentShowcaseProps {
  onSelectExperiment: (experimentId: string) => void;
  onViewAllExperiments: () => void;
}

const ExperimentShowcase: React.FC<ExperimentShowcaseProps> = ({
  onSelectExperiment,
  onViewAllExperiments,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const pills = ['All', 'F.Y. B.Tech (DBATU)', 'Class 12', 'Class 11', 'Class 10', 'Class 9'];

  // Curate balanced representation across classes for the initial "All" view
  const defaultShowcaseIds = [
    'titration',
    'conservation',
    'viscosity-ostwald',
    'ph-metric-titration',
    'zinc-acid-reaction',
    'conductometric-titration',
  ];

  const filtered: ExperimentItem[] = activeFilter === 'All'
    ? defaultShowcaseIds
        .map((id) => ALL_EXPERIMENTS.find((e) => e.id === id))
        .filter((e): e is ExperimentItem => Boolean(e))
    : ALL_EXPERIMENTS.filter((e) => e.classLevel === activeFilter).slice(0, 6);

  return (
    <section id="experiments" className="ln-section">
      <div className="ln-container">
        <div className="ln-section-header ln-reveal">
          <span className="ln-section-label">Curriculum Ready</span>
          <h2 className="ln-section-heading">Explore the Virtual Laboratory</h2>
          <p className="ln-section-desc">
            Interactive experiments directly aligned with engineering and science curricula.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="ln-pills ln-reveal">
          {pills.map((pill) => (
            <button
              key={pill}
              className={`ln-pill ${activeFilter === pill ? 'active' : ''}`}
              onClick={() => setActiveFilter(pill)}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Experiment Cards Grid */}
        <div className="ln-exp-grid">
          {filtered.length > 0 ? (
            filtered.map((item: ExperimentItem) => {
              return (
                <div
                  key={item.id}
                  className="ln-card ln-exp-card"
                  onClick={() => onSelectExperiment(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelectExperiment(item.id); }}
                >
                  <div className="ln-exp-thumb">
                    <ExperimentThumbnail type={item.thumbnailType} width={280} height={150} />
                  </div>
                  <div className="ln-exp-body">
                    <div>
                      <span className={`ln-exp-difficulty ln-diff-${item.difficulty.toLowerCase()}`}>
                        {item.difficulty}
                      </span>
                      <h3 className="ln-exp-title">{item.title}</h3>
                      <p className="ln-exp-desc">{item.description}</p>
                    </div>
                    <div className="ln-exp-footer">
                      <span className="ln-exp-tag">{item.categoryTag}</span>
                      <button
                        className="ln-btn ln-btn-explore"
                        onClick={(e) => { e.stopPropagation(); onSelectExperiment(item.id); }}
                      >
                        Explore →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className="ln-card"
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '48px 24px',
                background: 'var(--bg-card)',
                borderRadius: 16,
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🧪</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                No experiments available for this class yet.
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Explore experiments in other classes or select "All" to view available modules.
              </p>
            </div>
          )}
        </div>

        {/* View All */}
        <div style={{ textAlign: 'center', marginTop: 48 }} className="ln-reveal">
          <button onClick={onViewAllExperiments} className="ln-btn ln-btn-secondary">
            View All Experiments ({ALL_EXPERIMENTS.length})
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExperimentShowcase;
