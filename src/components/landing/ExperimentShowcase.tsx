import React, { useState } from 'react';
import { ALL_EXPERIMENTS } from '../ExperimentSelector';
import type { ExperimentItem } from '../ExperimentSelector';
import { ExperimentThumbnail } from '../home/ExperimentCardThumbnails';
import { useLanguage } from '../../i18n/LanguageContext';
import { EXPERIMENT_TRANSLATIONS } from '../../i18n/experimentTranslations';

interface ExperimentShowcaseProps {
  onSelectExperiment: (experimentId: string) => void;
  onViewAllExperiments: () => void;
}

const ExperimentShowcase: React.FC<ExperimentShowcaseProps> = ({
  onSelectExperiment,
  onViewAllExperiments,
}) => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');

  const filterOptions = [
    { key: 'All', label: t('landing.showcase.all', 'All') },
    { key: 'F.Y. B.Tech (DBATU)', label: t('landing.showcase.dbatu', 'F.Y. B.Tech (DBATU)') },
    { key: 'Class 12', label: t('landing.showcase.class12', 'Class 12') },
    { key: 'Class 11', label: t('landing.showcase.class11', 'Class 11') },
    { key: 'Class 10', label: t('landing.showcase.class10', 'Class 10') },
    { key: 'Class 9', label: t('landing.showcase.class9', 'Class 9') },
  ];

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
          <span className="ln-section-label">{t('landing.hero.badgeCurriculum', 'Curriculum Ready')}</span>
          <h2 className="ln-section-heading">{t('landing.showcase.heading', 'Explore the Virtual Laboratory')}</h2>
          <p className="ln-section-desc">
            {t('landing.showcase.subheading', 'Interactive experiments directly aligned with engineering and science curricula.')}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="ln-pills ln-reveal">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              className={`ln-pill ${activeFilter === opt.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Experiment Cards Grid */}
        <div className="ln-exp-grid">
          {filtered.length > 0 ? (
            filtered.map((item: ExperimentItem) => {
              const expTrans = EXPERIMENT_TRANSLATIONS[item.id]?.[language];
              const title = expTrans?.title || item.title;
              const description = expTrans?.description || item.description;
              const difficultyLabel = item.difficulty === 'Easy'
                ? t('common.easy', 'Easy')
                : item.difficulty === 'Medium'
                  ? t('common.medium', 'Medium')
                  : t('common.hard', 'Hard');

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
                        {difficultyLabel}
                      </span>
                      <h3 className="ln-exp-title">{title}</h3>
                      <p className="ln-exp-desc">{description}</p>
                    </div>
                    <div className="ln-exp-footer">
                      <span className="ln-exp-tag">{item.categoryTag}</span>
                      <button
                        className="ln-btn ln-btn-explore"
                        onClick={(e) => { e.stopPropagation(); onSelectExperiment(item.id); }}
                      >
                        {t('common.startExperiment', 'Explore →')}
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
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔬</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                {t('landing.showcase.noResults', 'No experiments found')}
              </h3>
              <p style={{ fontSize: '0.86rem', maxWidth: 400, margin: '0 auto 16px' }}>
                {t('landing.showcase.search', 'No practical modules registered under this curriculum filter yet.')}
              </p>
              <button
                className="ln-btn ln-btn-secondary ln-btn-sm"
                onClick={() => setActiveFilter('All')}
              >
                {t('landing.showcase.all', 'View All Experiments')}
              </button>
            </div>
          )}
        </div>

        {/* View All CTA */}
        <div style={{ textAlign: 'center', marginTop: 40 }} className="ln-reveal">
          <button onClick={onViewAllExperiments} className="ln-btn ln-btn-secondary" style={{ padding: '12px 32px' }}>
            {t('landing.showcase.all', 'View All Experiments')} →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExperimentShowcase;
