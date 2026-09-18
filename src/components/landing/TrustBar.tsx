import React from 'react';

const TrustBar: React.FC = () => {
  const items = [
    {
      title: 'Interactive Experiments',
      desc: 'Realistic glassware & reagents',
      color: 'blue' as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6M10 3v5.172a2 2 0 01-.586 1.414L5.5 13.5M14 3v5.172a2 2 0 00.586 1.414l2.914 2.914" />
          <path d="M4.5 16.5c-.3.5-.5 1.2-.2 1.8.3.6.9 1.7 2 1.7h11.4c1.1 0 1.7-1.1 2-1.7.3-.6.1-1.3-.2-1.8L14.6 10" />
          <path d="M7 17c1.5-1 3 .5 5-.5s3.5 .5 5-.5" fill="rgba(37,99,235,0.15)" />
        </svg>
      ),
    },
    {
      title: 'Action Validation',
      desc: 'Real-time procedural checks',
      color: 'green' as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      title: 'Feedback & Retry',
      desc: 'Learn from every mistake',
      color: 'amber' as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
        </svg>
      ),
    },
    {
      title: 'Progress Tracking',
      desc: 'Accuracy & completion metrics',
      color: 'purple' as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="ln-container ln-value-strip-wrapper">
      <div className="ln-value-strip">
        {items.map((item, i) => (
          <div key={i} className={`ln-value-item ln-reveal ln-reveal-d${i + 1}`}>
            <div className={`ln-value-icon ln-value-icon-${item.color}`}>
              {item.icon}
            </div>
            <div className="ln-value-text">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;
