import React, { useState, useMemo } from 'react';
import { HeroBanner } from './home/HeroBanner';
import { NotesPromoBanner } from './home/NotesPromoBanner';
import { ExperimentThumbnail } from './home/ExperimentCardThumbnails';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { EXPERIMENT_TRANSLATIONS } from '../i18n/experimentTranslations';

export interface ExperimentItem {
  id: string;
  type: 'legacy-titration' | 'legacy-conservation' | 'generic';
  title: string;
  description: string;
  classLevel: string; // 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  categoryTag: string; // e.g. 'Class 11 • Engineering Chemistry'
  difficulty: 'Easy' | 'Medium' | 'Hard';
  thumbnailType: string;
  order: number;
}

export const ALL_EXPERIMENTS: ExperimentItem[] = [
  {
    id: 'viscosity-ostwald',
    type: 'generic',
    title: "Determination of Viscosity by Ostwald's Viscometer",
    description: 'Measure the flow time of a liquid and determine its coefficient of viscosity.',
    classLevel: 'F.Y. B.Tech (DBATU)',
    categoryTag: 'F.Y. B.Tech • Engineering Chemistry',
    difficulty: 'Medium',
    thumbnailType: 'viscosity-ostwald',
    order: 1,
  },
  {
    id: 'ph-metric-titration',
    type: 'generic',
    title: 'pH-Metric Titration (Acid–Base)',
    description: 'Determine the strength of an acid or base using a pH meter and plot the titration curve.',
    classLevel: 'F.Y. B.Tech (DBATU)',
    categoryTag: 'F.Y. B.Tech • Engineering Chemistry',
    difficulty: 'Medium',
    thumbnailType: 'ph-metric-titration',
    order: 2,
  },
  {
    id: 'conductometric-titration',
    type: 'generic',
    title: 'Conductometric Titration (HCl vs NaOH)',
    description: 'Monitor conductance during neutralization and find the equivalence point.',
    classLevel: 'F.Y. B.Tech (DBATU)',
    categoryTag: 'F.Y. B.Tech • Engineering Chemistry',
    difficulty: 'Hard',
    thumbnailType: 'conductometric-titration',
    order: 3,
  },
  {
    id: 'chloride-mohr-method',
    type: 'generic',
    title: "Chloride Content by Mohr's Method",
    description: 'Estimate chloride content using silver nitrate and potassium chromate indicator.',
    classLevel: 'F.Y. B.Tech (DBATU)',
    categoryTag: 'F.Y. B.Tech • Engineering Chemistry',
    difficulty: 'Medium',
    thumbnailType: 'chloride-mohr-method',
    order: 4,
  },
  {
    id: 'water-acidity',
    type: 'generic',
    title: 'Acidity of Water Sample',
    description: 'Determine pH and total acidity of a water sample using standard methods.',
    classLevel: 'F.Y. B.Tech (DBATU)',
    categoryTag: 'F.Y. B.Tech • Engineering Chemistry',
    difficulty: 'Medium',
    thumbnailType: 'water-acidity',
    order: 5,
  },
  {
    id: 'water-alkalinity',
    type: 'generic',
    title: 'Determination of Alkalinity of Water',
    description: 'Determine phenolphthalein, methyl orange and total alkalinity by titration.',
    classLevel: 'F.Y. B.Tech (DBATU)',
    categoryTag: 'F.Y. B.Tech • Engineering Chemistry',
    difficulty: 'Hard',
    thumbnailType: 'water-alkalinity',
    order: 6,
  },
  {
    id: 'water-hardness-edta',
    type: 'generic',
    title: 'Hardness of Water by EDTA Method',
    description: 'Determine total, permanent and temporary hardness using EDTA.',
    classLevel: 'F.Y. B.Tech (DBATU)',
    categoryTag: 'F.Y. B.Tech • Engineering Chemistry',
    difficulty: 'Easy',
    thumbnailType: 'water-hardness-edta',
    order: 7,
  },
  {
    id: 'acid-value-oil',
    type: 'generic',
    title: 'Acid Value of Vegetable Oil',
    description: 'Determine the acid value and percentage of free fatty acids (FFA) in vegetable oil by KOH titration.',
    classLevel: 'F.Y. B.Tech (DBATU)',
    categoryTag: 'F.Y. B.Tech • Engineering Chemistry',
    difficulty: 'Medium',
    thumbnailType: 'acid-value-oil',
    order: 8,
  },
  {
    id: 'dissolved-oxygen-winkler',
    type: 'generic',
    title: "Dissolved Oxygen by Winkler's Method",
    description: 'Estimate dissolved oxygen in water sample using sodium thiosulfate iodometric titration.',
    classLevel: 'F.Y. B.Tech (DBATU)',
    categoryTag: 'F.Y. B.Tech • Environmental Chemistry',
    difficulty: 'Hard',
    thumbnailType: 'acid-value-oil',
    order: 9,
  },
  {
    id: 'titration',
    type: 'legacy-titration',
    title: 'Acid-Base Titration (Volumetric Analysis)',
    description: 'Determine the unknown concentration of HCl using standardized NaOH and phenolphthalein indicator.',
    classLevel: 'Class 11',
    categoryTag: 'Class 11 • Volumetric Analysis',
    difficulty: 'Medium',
    thumbnailType: 'water-alkalinity',
    order: 10,
  },
  {
    id: 'zinc-acid-reaction',
    type: 'generic',
    title: 'Zinc-Acid Reaction & Gas Evolution',
    description: 'Observe zinc reacting with dilute acid and test hydrogen gas evolution with pop sound.',
    classLevel: 'Class 10',
    categoryTag: 'Class 10 • Chemical Reactions',
    difficulty: 'Easy',
    thumbnailType: 'water-hardness-edta',
    order: 11,
  },
  {
    id: 'conservation',
    type: 'legacy-conservation',
    title: 'Law of Conservation of Mass',
    description: 'Verify mass invariance during BaCl₂ + Na₂SO₄ precipitation in a sealed conical flask.',
    classLevel: 'Class 9',
    categoryTag: 'Class 9 • Chemical Reactions',
    difficulty: 'Easy',
    thumbnailType: 'water-acidity',
    order: 12,
  },
];

interface ExperimentSelectorProps {
  onSelectExperiment: (id: 'titration' | 'conservation') => void;
  onSelectEngineExperiment?: (id: string) => void;
  onSelectVR?: () => void;
  onGoToNotes?: () => void;
  onOpenHowItWorks?: () => void;
  externalSearchQuery?: string;
  showHeroBanner?: boolean;
}

export const ExperimentSelector: React.FC<ExperimentSelectorProps> = ({
  onSelectExperiment,
  onSelectEngineExperiment,
  onGoToNotes = () => {},
  onOpenHowItWorks = () => {},
  externalSearchQuery = '',
  showHeroBanner = false,
}) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'latest' | 'difficulty-asc' | 'difficulty-desc' | 'alphabetical'>('latest');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const getPillLabel = (cls: string): string => {
    if (cls === 'All') return t('landing.showcase.all', 'All');
    if (cls === 'F.Y. B.Tech (DBATU)') return t('landing.showcase.dbatu', 'F.Y. B.Tech (DBATU)');
    if (cls === 'Class 12') return t('landing.showcase.class12', 'Class 12');
    if (cls === 'Class 11') return t('landing.showcase.class11', 'Class 11');
    if (cls === 'Class 10') return t('landing.showcase.class10', 'Class 10');
    if (cls === 'Class 9') return t('landing.showcase.class9', 'Class 9');
    return cls;
  };

  // Filter & sort experiments
  const filteredExperiments = useMemo(() => {
    let list = ALL_EXPERIMENTS;

    // Filter by class pill
    if (selectedClass !== 'All') {
      list = list.filter((item) => item.classLevel === selectedClass);
    }

    // Filter by search query (from top header)
    if (externalSearchQuery.trim()) {
      const q = externalSearchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categoryTag.toLowerCase().includes(q)
      );
    }

    // Sort options
    return [...list].sort((a, b) => {
      if (sortOption === 'alphabetical') return a.title.localeCompare(b.title);
      if (sortOption === 'difficulty-asc') {
        const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
        return diffWeight[a.difficulty] - diffWeight[b.difficulty];
      }
      if (sortOption === 'difficulty-desc') {
        const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
        return diffWeight[b.difficulty] - diffWeight[a.difficulty];
      }
      return a.order - b.order;
    });
  }, [selectedClass, externalSearchQuery, sortOption]);

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
        return {
          bg: '#dcfce7',
          color: '#15803d',
        };
      case 'Medium':
        return {
          bg: '#fef3c7',
          color: '#b45309',
        };
      case 'Hard':
        return {
          bg: '#fee2e2',
          color: '#dc2626',
        };
    }
  };

  const classPills = ['All', 'F.Y. B.Tech (DBATU)', 'Class 11', 'Class 10', 'Class 9'];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* ── 1. Hero Banner (shown when requested) ── */}
      {showHeroBanner ? (
        <HeroBanner
          onStartExploring={() => {
            const section = document.getElementById('browse-experiments-section');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
          onViewHowItWorks={onOpenHowItWorks}
        />
      ) : (
        /* Dedicated Browse Experiments Header */
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
                letterSpacing: '-0.025em',
              }}
            >
              {t('nav.experiments', 'Browse Experiments')}
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#2563eb',
                background: 'rgba(37, 99, 235, 0.1)',
                padding: '4px 10px',
                borderRadius: 9999,
              }}
            >
              {ALL_EXPERIMENTS.length} {t('experiments.totalPracticals', 'Total Practicals')}
            </span>
          </div>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            {t('experiments.exploreSubtitle', 'Explore all 12 curriculum-aligned interactive chemistry practicals with real-time procedural checks and grading.')}
          </p>
        </div>
      )}

      {/* ── Admin Superuser Active Banner ── */}
      {user?.role === 'admin' && (
        <div
          style={{
            margin: '20px 0 24px',
            padding: '14px 20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(168, 85, 247, 0.08))',
            border: '1.5px solid rgba(124, 58, 237, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                color: '#fff',
                boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)',
              }}
            >
              🛡️
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t('auth.adminActive', 'Administrator Superuser Active')} ({user.name})
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('auth.adminAccessDesc', 'Full lab access granted across all 12 curriculum simulations with moderator telemetry & editor privileges.')}
              </div>
            </div>
          </div>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: '#7c3aed',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {t('auth.allLabsUnlocked', 'All Labs Unlocked')}
          </span>
        </div>
      )}

      {/* ── 2. Browse Experiments Header Bar ── */}
      <div
        id="browse-experiments-section"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 22,
        }}
      >
        {/* Section Heading */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          {t('nav.experiments', 'Browse Experiments')}
        </h2>

        {/* Right side: Filter Pills & Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Class Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'var(--bg-secondary)',
              padding: 4,
              borderRadius: 9999,
              border: '1px solid var(--border)',
            }}
          >
            {classPills.map((cls) => {
              const isSelected = selectedClass === cls;
              return (
                <button
                  key={cls}
                  id={`filter-pill-${cls.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedClass(cls)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '6px 14px',
                    borderRadius: 9999,
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 700 : 500,
                    background: isSelected ? '#2563eb' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {getPillLabel(cls)}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              id="btn-sort-experiments"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 9999,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <span>
                {sortOption === 'latest'
                  ? t('common.filterAll', 'Latest')
                  : sortOption === 'difficulty-asc'
                    ? t('experiments.easiestFirst', 'Easiest First')
                    : sortOption === 'difficulty-desc'
                      ? t('experiments.hardestFirst', 'Hardest First')
                      : t('experiments.alphabetical', 'Alphabetical')}
              </span>
              <span style={{ fontSize: '0.65rem' }}>˅</span>
            </button>

            {sortDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 38,
                  right: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  boxShadow: 'var(--shadow-md)',
                  padding: 4,
                  width: 150,
                  zIndex: 100,
                }}
              >
                {[
                  { id: 'latest', label: t('common.filterAll', 'Latest') },
                  { id: 'difficulty-asc', label: t('experiments.easiestFirst', 'Easiest First') },
                  { id: 'difficulty-desc', label: t('experiments.hardestFirst', 'Hardest First') },
                  { id: 'alphabetical', label: t('experiments.alphabetical', 'Alphabetical') },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortOption(opt.id as any);
                      setSortDropdownOpen(false);
                    }}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'block',
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 6,
                      fontSize: '0.78rem',
                      fontWeight: sortOption === opt.id ? 700 : 500,
                      color: sortOption === opt.id ? '#2563eb' : 'var(--text-primary)',
                      boxSizing: 'border-box',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. 4-Column Grid of Experiment Cards ── */}
      {filteredExperiments.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {t('experiments.noExperimentsFound', 'No experiments found')}
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
            {t('experiments.noMatch', 'No practicals matched your search query.')}
          </p>
          <button
            onClick={() => setSelectedClass('All')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '8px 18px',
              borderRadius: 8,
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            {t('experiments.showAll', 'Show All Experiments')}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {filteredExperiments.map((item) => {
            const badge = getDifficultyBadge(item.difficulty);
            const expTrans = EXPERIMENT_TRANSLATIONS[item.id]?.[language];
            const cardTitle = expTrans?.title || item.title;
            const cardDesc = expTrans?.description || item.description;
            const difficultyText = item.difficulty === 'Easy'
              ? t('common.easy', 'Easy')
              : item.difficulty === 'Medium'
                ? t('common.medium', 'Medium')
                : t('common.hard', 'Hard');

            return (
              <div
                key={item.id}
                id={`card-${item.id}`}
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
                {/* ── Top Image Container ── */}
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

                {/* ── Card Content ── */}
                <div
                  style={{
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Difficulty Badge */}
                    <div style={{ marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: badge.bg,
                          color: badge.color,
                          display: 'inline-block',
                        }}
                      >
                        {difficultyText}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.94rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: '0 0 6px 0',
                        lineHeight: 1.35,
                      }}
                    >
                      {cardTitle}
                    </h3>

                    {/* Description */}
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
                      {cardDesc}
                    </p>
                  </div>

                  {/* ── Card Footer: Tag & Action Arrow ── */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 18,
                      paddingTop: 12,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    {/* Category Tag Pill */}
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

                    {/* Action Arrow Icon Button */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.08)',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        transition: 'all 0.15s ease',
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
      )}

      {/* ── 4. Bottom Notes Promo Banner ── */}
      <NotesPromoBanner onGoToNotes={onGoToNotes} />
    </div>
  );
};

export default ExperimentSelector;
