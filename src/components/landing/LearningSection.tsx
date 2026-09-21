import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

const ArrowSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="14 7 19 12 14 17" />
  </svg>
);

const LearningSection: React.FC = () => {
  const { t } = useLanguage();

  const nodes = [
    {
      title: t('common.actions', 'Student Action'),
      desc: t('landing.how.step3.desc', 'Add reagent / adjust control'),
      type: '',
      icon: '🧪',
    },
    {
      title: t('landing.preview.feature3.title', 'Validation'),
      desc: t('landing.trust.accuracySub', 'Engine checks step'),
      type: '',
      icon: '⚡',
    },
    {
      title: t('landing.learning.mistakeTitle', 'Mistake Detected'),
      desc: t('landing.learning.mistakeDesc', 'Overshot / wrong order'),
      type: 'warn',
      icon: '⚠️',
    },
    {
      title: t('landing.learning.feedbackTitle', 'Pedagogical Guidance'),
      desc: t('landing.learning.feedbackDesc', 'Instant diagnosis'),
      type: '',
      icon: '💬',
    },
    {
      title: t('landing.learning.retryTitle', 'Safe Retry'),
      desc: t('landing.learning.retryDesc', 'Reset with zero hazard'),
      type: '',
      icon: '🔄',
    },
    {
      title: t('common.continue', 'Continue'),
      desc: t('landing.how.step6.desc', 'Master accuracy'),
      type: 'ok',
      icon: '✅',
    },
  ];

  return (
    <section id="feedback" className="ln-section">
      <div className="ln-container">
        <div className="ln-section-header ln-reveal">
          <span className="ln-section-label ln-section-label-amber">{t('landing.trust.feedback', 'Signature Feature')}</span>
          <h2 className="ln-section-heading">{t('landing.learning.heading', 'Learn Through Mistakes, Without Danger')}</h2>
          <p className="ln-section-desc">
            {t('landing.learning.subheading', 'Traditional labs penalize mistakes with broken glassware or chemical hazards. VirtualVigyan transforms errors into learning milestones.')}
          </p>
        </div>

        <div className="ln-feedback-flow ln-reveal">
          {nodes.map((node, i) => (
            <React.Fragment key={i}>
              <div className={`ln-feedback-node ${node.type}`}>
                <div className="ln-feedback-node-icon">{node.icon}</div>
                <div className="ln-feedback-node-title">{node.title}</div>
                <div className="ln-feedback-node-desc">{node.desc}</div>
              </div>
              {i < nodes.length - 1 && (
                <div className="ln-feedback-arrow" aria-hidden="true">
                  <ArrowSvg />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
