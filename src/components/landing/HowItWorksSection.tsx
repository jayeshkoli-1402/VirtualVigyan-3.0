import React from 'react';

const steps = [
  {
    num: '01',
    title: 'Select Experiment',
    desc: 'Choose from syllabus-aligned modules',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Set Up',
    desc: 'Prepare apparatus & reagents',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Perform',
    desc: 'Interact with glassware',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Validate',
    desc: 'Real-time rule checks',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Correct',
    desc: 'Diagnostic feedback',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Observe & Learn',
    desc: 'Master concepts',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="ln-section ln-section-alt">
      <div className="ln-container">
        <div className="ln-section-header ln-reveal">
          <span className="ln-section-label ln-section-label-green">Workflow</span>
          <h2 className="ln-section-heading">From Theory to Practical Learning</h2>
          <p className="ln-section-desc">
            A guided scientific workflow designed to build authentic laboratory skills step by step.
          </p>
        </div>

        <div className="ln-timeline">
          {steps.map((step, i) => (
            <div key={step.num} className={`ln-timeline-step ln-reveal ln-reveal-d${i + 1}`}>
              <div className="ln-timeline-circle">{step.num}</div>
              <div>
                <div className="ln-timeline-title">{step.title}</div>
                <div className="ln-timeline-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
