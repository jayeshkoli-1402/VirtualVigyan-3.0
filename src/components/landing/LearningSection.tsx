import React from 'react';

const nodes = [
  {
    title: 'Student Action',
    desc: 'Add reagent / adjust control',
    type: '',
    icon: '🧪',
  },
  {
    title: 'Validation',
    desc: 'Engine checks step',
    type: '',
    icon: '⚡',
  },
  {
    title: 'Wrong?',
    desc: 'Overshot / wrong order',
    type: 'warn',
    icon: '⚠️',
  },
  {
    title: 'Feedback',
    desc: 'Instant diagnosis',
    type: '',
    icon: '💬',
  },
  {
    title: 'Retry',
    desc: 'Reset with zero hazard',
    type: '',
    icon: '🔄',
  },
  {
    title: 'Continue',
    desc: 'Master accuracy',
    type: 'ok',
    icon: '✅',
  },
];

const ArrowSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="14 7 19 12 14 17" />
  </svg>
);

const LearningSection: React.FC = () => {
  return (
    <section id="feedback" className="ln-section">
      <div className="ln-container">
        <div className="ln-section-header ln-reveal">
          <span className="ln-section-label ln-section-label-amber">Signature Feature</span>
          <h2 className="ln-section-heading">Make Mistakes. Understand Them. Try Again.</h2>
          <p className="ln-section-desc">
            In physical labs, errors waste chemicals. In VirtualVigyan, every mistake becomes an immediate learning opportunity.
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
