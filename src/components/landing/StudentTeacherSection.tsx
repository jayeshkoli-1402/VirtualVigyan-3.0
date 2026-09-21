import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  onStartExperiment: () => void;
  onOpenTeacherPortal: () => void;
}

const StudentTeacherSection: React.FC<Props> = ({ onStartExperiment, onOpenTeacherPortal }) => {
  const { t } = useLanguage();

  return (
    <section id="roles" className="ln-section ln-section-alt">
      <div className="ln-container">
        <div className="ln-section-header ln-reveal">
          <span className="ln-section-label">{t('landing.hero.badgeBilingual', 'Built for Education')}</span>
          <h2 className="ln-section-heading">{t('landing.roles.heading', 'Students & Teachers')}</h2>
          <p className="ln-section-desc">
            {t('landing.how.subheading', 'A unified platform that empowers students with independent practice and gives educators clear learning insights.')}
          </p>
        </div>

        <div className="ln-roles-grid">
          {/* Student */}
          <div id="student-role" className="ln-card ln-role-card ln-role-student ln-reveal ln-reveal-d1">
            <div className="ln-role-icon">🎓</div>
            <h3 className="ln-role-title">{t('landing.roles.studentTitle', 'For Students')}</h3>
            <p className="ln-role-desc">
              {t('landing.roles.studentDesc', 'Practice practicals unlimited times before actual exams.')}
            </p>
            <ul className="ln-role-list">
              <li>{t('landing.roles.studentPoint1', 'Unlimited, consequence-free lab practice')}</li>
              <li>{t('landing.roles.studentPoint2', 'Self-paced step-by-step guidance')}</li>
              <li>{t('landing.roles.studentPoint3', 'Automated calculation grading with worked solutions')}</li>
            </ul>
            <button onClick={onStartExperiment} className="ln-btn ln-btn-primary">
              {t('landing.nav.startExperiment', 'Explore Student Experience')} →
            </button>
          </div>

          {/* Teacher */}
          <div id="teacher-role" className="ln-card ln-role-card ln-role-teacher ln-reveal ln-reveal-d2">
            <div className="ln-role-icon">👨‍🏫</div>
            <h3 className="ln-role-title">{t('landing.roles.teacherTitle', 'For Teachers & Institutions')}</h3>
            <p className="ln-role-desc">
              {t('landing.roles.teacherDesc', 'Track student performance, identify class-wide conceptual misunderstandings, and ensure lab preparedness.')}
            </p>
            <ul className="ln-role-list">
              <li>{t('landing.roles.teacherPoint1', 'Real-time student progress & rubric analytics')}</li>
              <li>{t('landing.roles.teacherPoint2', 'Standardized DBATU & NCERT curriculum coverage')}</li>
              <li>{t('landing.roles.teacherPoint3', 'Zero recurring reagent or glassware breakage costs')}</li>
            </ul>
            <button onClick={onOpenTeacherPortal} className="ln-btn ln-btn-secondary">
              {t('nav.teacherPortal', 'Teacher Portal')} →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentTeacherSection;
