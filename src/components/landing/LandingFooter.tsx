import React from 'react';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';
import { useLanguage } from '../../i18n/LanguageContext';

interface LandingFooterProps {
  onStartExperiment: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onStartExperiment }) => {
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="ln-footer">
      <div className="ln-container">
        <div className="ln-footer-grid">
          {/* Brand */}
          <div className="ln-footer-brand">
            <VirtualVigyanLogo size={36} showText subtitle={t('brand.tagline', 'Interactive Chemistry Laboratory')} />
            <p>{t('landing.footer.desc', 'VirtualVigyan is an open-access, curriculum-aligned virtual chemistry laboratory designed for Indian students and educators.')}</p>
          </div>

          {/* Navigation */}
          <div className="ln-footer-col">
            <h4>{t('landing.footer.curriculum', 'Navigation')}</h4>
            <ul>
              <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>{t('landing.nav.home', 'Home')}</a></li>
              <li><a href="#experiments" onClick={(e) => { e.preventDefault(); scrollTo('experiments'); }}>{t('landing.nav.experiments', 'Experiments')}</a></li>
              <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>{t('landing.nav.howItWorks', 'How It Works')}</a></li>
              <li><a href="#student-role" onClick={(e) => { e.preventDefault(); scrollTo('student-role'); }}>{t('landing.nav.forStudents', 'Students')}</a></li>
              <li><a href="#teacher-role" onClick={(e) => { e.preventDefault(); scrollTo('teacher-role'); }}>{t('landing.nav.forTeachers', 'Teachers')}</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>{t('landing.nav.about', 'About')}</a></li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="ln-footer-col">
            <h4>{t('landing.footer.quickAccess', 'Quick Access')}</h4>
            <ul>
              <li><button onClick={onStartExperiment}>{t('common.enterLaboratory', 'Enter Laboratory')}</button></li>
              <li><button onClick={onStartExperiment}>{t('landing.showcase.all', 'All Experiments')}</button></li>
            </ul>
          </div>

          {/* Information */}
          <div className="ln-footer-col">
            <h4>{t('landing.footer.legal', 'Platform')}</h4>
            <ul>
              <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>{t('about.title', 'About VirtualVigyan')}</a></li>
            </ul>
          </div>
        </div>

        <div className="ln-footer-bottom">
          <span>{t('landing.footer.copyright', '© 2026 VirtualVigyan. Built for accessible chemistry education in India.')}</span>
          <span>{t('brand.tagline', 'Interactive Virtual Chemistry Laboratory')}</span>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
