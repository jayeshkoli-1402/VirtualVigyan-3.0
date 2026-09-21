import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const audiences = [
    {
      icon: '🎓',
      title: t('about.audienceSchoolTitle', 'Secondary & High School'),
      level: t('about.audienceSchoolLevel', 'Classes 9 – 12'),
      desc: t('about.audienceSchoolDesc', 'Master fundamental chemical reactions, volumetric analysis, and mass conservation before entering the physical laboratory.'),
    },
    {
      icon: '🔬',
      title: t('about.audienceEnggTitle', 'Engineering Chemistry'),
      level: t('about.audienceEnggLevel', 'F.Y. B.Tech (DBATU & State)'),
      desc: t('about.audienceEnggDesc', 'Hands-on practice for Ostwald viscometry, pH-metric curves, conductometric titration, and water quality analysis.'),
    },
    {
      icon: '👨‍🏫',
      title: t('about.audienceTeacherTitle', 'Educators & Institutions'),
      level: t('about.audienceTeacherLevel', 'Teachers & Lab In-Charge'),
      desc: t('about.audienceTeacherDesc', 'Demonstrate complex procedures visually, assign repeatable lab tasks, and monitor student procedural accuracy.'),
    },
  ];

  const faqs = [
    {
      q: t('about.faq1Q', 'How do I perform an experiment in VirtualVigyan?'),
      a: t('about.faq1A', 'Select any experiment from the showcase or dashboard. Use mouse or touch to position apparatus, add reagents, adjust stopcocks, and record readings. The real-time validation engine guides each step.'),
    },
    {
      q: t('about.faq2Q', 'Do I need special software, VR headsets, or plugins?'),
      a: t('about.faq2A', 'No special hardware is required. VirtualVigyan runs entirely in any standard modern web browser on desktops, laptops, tablets, and smartphones with zero installations.'),
    },
    {
      q: t('about.faq3Q', 'What happens when I make a procedural mistake?'),
      a: t('about.faq3A', 'Unlike physical labs where mistakes waste reagents or pose safety risks, VirtualVigyan diagnoses the error instantly, explains why it occurred, and lets you retry immediately.'),
    },
  ];

  return (
    <section id="about" className="ln-section">
      <div className="ln-container">
        {/* ── About Block ── */}
        <div className="ln-section-header ln-reveal">
          <span className="ln-section-label">{t('about.title', 'About VirtualVigyan')}</span>
          <h2 className="ln-section-heading">{t('about.heading', 'Purpose-Built for Authentic Practical Science')}</h2>
          <p className="ln-section-desc">
            {t('about.description', 'VirtualVigyan is an interactive virtual chemistry laboratory created to bridge theoretical concepts and hands-on laboratory practice through safe, repeatable digital experimentation.')}
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="ln-about-grid ln-reveal">
          {audiences.map((aud, idx) => (
            <div key={idx} className="ln-card ln-about-card">
              <div className="ln-about-icon">{aud.icon}</div>
              <div className="ln-about-level">{aud.level}</div>
              <h3 className="ln-about-title">{aud.title}</h3>
              <p className="ln-about-desc">{aud.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Help / FAQ Block ── */}
        <div id="help" className="ln-help-wrapper ln-reveal" style={{ marginTop: 64 }}>
          <div className="ln-section-header" style={{ marginBottom: 32 }}>
            <span className="ln-section-label ln-section-label-green">{t('about.helpLabel', 'Help & Instructions')}</span>
            <h3 className="ln-section-heading" style={{ fontSize: '2rem' }}>{t('about.faqHeading', 'Frequently Asked Questions')}</h3>
            <p className="ln-section-desc">
              {t('about.faqSubheading', 'Quick answers to help you get started with the virtual workbench.')}
            </p>
          </div>

          <div className="ln-faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`ln-card ln-faq-item ${isOpen ? 'open' : ''}`}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenFaq(isOpen ? null : idx); }}
                >
                  <div className="ln-faq-question">
                    <span>{faq.q}</span>
                    <span className="ln-faq-toggle">{isOpen ? '−' : '+'}</span>
                  </div>
                  {isOpen && (
                    <div className="ln-faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
