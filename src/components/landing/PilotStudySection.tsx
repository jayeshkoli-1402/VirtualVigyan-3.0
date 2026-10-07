import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface StudentRecord {
  name: string;
  email: string;
  experimentTitle: string;
  timeSpent: string;
  attempt: number;
  avatar: string;
  status: string;
}

const PILOT_RECORDS: StudentRecord[] = [
  { name: 'Kirti C.', email: 'pilot.stu01@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '9m 00s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Diptanshu B.', email: 'pilot.stu02@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '10m 20s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Ghanshyam M.', email: 'pilot.stu03@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 00s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Rohan V.', email: 'pilot.stu04@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '11m 50s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Ruchita B.', email: 'pilot.stu05@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '9m 20s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Alice S.', email: 'pilot.stu06@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '10m 30s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Aishwarya P.', email: 'pilot.stu07@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 30s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Soham C.', email: 'pilot.stu08@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '9m 40s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Kalyani C.', email: 'pilot.stu09@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 45s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Shreyash B.', email: 'pilot.stu10@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '12m 40s', attempt: 2, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Pratik C.', email: 'pilot.stu11@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '10m 40s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Tejal B.', email: 'pilot.stu12@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 15s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Yashodeep G.', email: 'pilot.stu13@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '7m 30s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Bharati B.', email: 'pilot.stu14@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '10m 15s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Piyush B.', email: 'pilot.stu15@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '11m 20s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Dipali I.', email: 'pilot.stu16@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 50s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Siddhi P.', email: 'pilot.stu17@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '7m 50s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Kunal C.', email: 'pilot.stu18@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '11m 30s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Pavan W.', email: 'pilot.stu19@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '9m 50s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Raj B.', email: 'pilot.stu20@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 35s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Mohit C.', email: 'pilot.stu21@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '12m 10s', attempt: 2, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Sanskruti B.', email: 'pilot.stu22@virtualvigyan.in', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 25s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
];

interface PilotPhoto {
  id: string;
  image: string;
  badge: string;
  avatar: string;
  title: string;
  role: string;
  caption: string;
  tabLabel: string;
}

const PILOT_PHOTOS: PilotPhoto[] = [
  {
    id: 'photo-mentor-team',
    image: '/images/mentor-lab-pilot.jpg',
    badge: 'SIH Pilot Testing Session • Smart Lab Demonstration',
    avatar: '👨‍🏫',
    title: 'Our SIH Mentor & Research Team',
    role: 'Smart India Hackathon (SIH) Faculty Mentor & Guide',
    caption: 'Our SIH mentor and student team evaluating titration procedures, stopcock control, and stoichiometric calculations on the digital smartboard.',
    tabLabel: 'Mentor & Team',
  },
  {
    id: 'photo-smartboard',
    image: '/images/student-testing-1.jpg',
    badge: 'Interactive Smartboard Trial • Hands-On Calibration',
    avatar: '👩‍🔬',
    title: 'Live Titration Demonstration on Smartboard',
    role: 'Physical Bench Touchscreen Experiment Pilot',
    caption: 'Students performing EDTA water hardness titration on the interactive digital smartboard, calibrating real-time drop delivery and color indicators.',
    tabLabel: 'Smartboard Trial',
  },
  {
    id: 'photo-lab-cohort',
    image: '/images/student-testing-2.jpg',
    badge: 'Full 20+ Student Computer Lab Trial • Concurrent Practice',
    avatar: '💻',
    title: '20+ Student Concurrent Lab Testing Session',
    role: 'Classroom Evaluation & Workstation Simulation',
    caption: 'Full laboratory classroom cohort of 22 students actively testing VirtualVigyan across individual workstations simultaneously.',
    tabLabel: '20+ Student Lab',
  },
  {
    id: 'photo-peer-feedback',
    image: '/images/student-testing-3.jpg',
    badge: 'Individual Workstation Feedback • Peer Discussion',
    avatar: '👥',
    title: 'Peer Discussion & Real-Time Procedure Validation',
    role: 'Collaborative Problem Solving & Faculty Review',
    caption: 'Students collaborating at individual lab workstations, discussing titration endpoints and validating procedural correctness with mentors.',
    tabLabel: 'Peer Discussion',
  },
];

export const PilotStudySection: React.FC = () => {
  const { t } = useLanguage();
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto-scroll slideshow effect every 4 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PILOT_PHOTOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 45) {
      setCurrentSlide((prev) => (prev + 1) % PILOT_PHOTOS.length);
    } else if (touchEnd - touchStart > 45) {
      setCurrentSlide((prev) => (prev - 1 + PILOT_PHOTOS.length) % PILOT_PHOTOS.length);
    }
    setTouchStart(null);
  };

  const visibleRecords = showAllStudents ? PILOT_RECORDS : PILOT_RECORDS.slice(0, 6);
  const activePhoto = PILOT_PHOTOS[currentSlide];

  return (
    <section id="pilot-study" className="ln-section ln-pilot-section">
      <div className="ln-container">
        {/* Section Header */}
        <div className="ln-section-header ln-reveal">
          <span className="ln-section-label ln-section-label-amber">
            🧪 {t('landing.pilot.tag', 'Tested & Validated in the Physical Lab')}
          </span>
          <h2 className="ln-section-heading">
            {t('landing.pilot.heading', "Tested With 20+ Students Under Our SIH Mentor's Guidance")}
          </h2>
          <p className="ln-section-desc">
            {t(
              'landing.pilot.subheading',
              'VirtualVigyan was rigorously pilot-tested on 20+ students in real laboratory classrooms under the direct guidance of our Smart India Hackathon (SIH) mentor.'
            )}
          </p>
        </div>

        {/* 4 Quick Stat Counters */}
        <div className="ln-pilot-stats-strip ln-reveal">
          <div className="ln-pilot-stat-card">
            <span className="ln-pilot-stat-icon">🎓</span>
            <div className="ln-pilot-stat-num">{t('landing.pilot.statStudents', '22 Students')}</div>
            <div className="ln-pilot-stat-label">{t('landing.pilot.statStudentsSub', 'Tested in live classroom trial')}</div>
          </div>
          <div className="ln-pilot-stat-card">
            <span className="ln-pilot-stat-icon">👨‍🏫</span>
            <div className="ln-pilot-stat-num">{t('landing.pilot.statMentor', 'SIH Mentor Guided')}</div>
            <div className="ln-pilot-stat-label">{t('landing.pilot.statMentorSub', 'Smart India Hackathon Mentorship')}</div>
          </div>
          <div className="ln-pilot-stat-card">
            <span className="ln-pilot-stat-icon">✅</span>
            <div className="ln-pilot-stat-num">{t('landing.pilot.statCompletion', '100% Completed')}</div>
            <div className="ln-pilot-stat-label">{t('landing.pilot.statCompletionSub', 'All cohorts finished trials')}</div>
          </div>
          <div className="ln-pilot-stat-card">
            <span className="ln-pilot-stat-icon">🛡️</span>
            <div className="ln-pilot-stat-num">{t('landing.pilot.statZero', 'Zero Risk')}</div>
            <div className="ln-pilot-stat-label">{t('landing.pilot.statZeroSub', 'No hazardous reagent exposure')}</div>
          </div>
        </div>

        {/* Main 2-Column Showcase */}
        <div className="ln-pilot-grid ln-reveal">
          {/* Left Column: Real Mentor & Classroom Photo Card with Auto-Scroll */}
          <div className="ln-pilot-photo-column">
            <div
              className="ln-pilot-photo-frame"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Auto-scroll progress line */}
              <div className="ln-pilot-carousel-progress-track">
                <div
                  key={currentSlide}
                  className="ln-pilot-carousel-progress-bar"
                />
              </div>

              {/* Main Image Slider Viewport */}
              <div className="ln-pilot-img-wrapper">
                <div
                  className="ln-pilot-slider-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {PILOT_PHOTOS.map((photo, index) => (
                    <div key={photo.id} className="ln-pilot-slide">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="ln-pilot-img"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  type="button"
                  className="ln-pilot-arrow-btn ln-pilot-arrow-prev"
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + PILOT_PHOTOS.length) % PILOT_PHOTOS.length)}
                  aria-label="Previous photo"
                  title="Previous photo"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="ln-pilot-arrow-btn ln-pilot-arrow-next"
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % PILOT_PHOTOS.length)}
                  aria-label="Next photo"
                  title="Next photo"
                >
                  ›
                </button>

                {/* Overlay Badge at bottom-left */}
                <div className="ln-pilot-img-overlay">
                  <div className="ln-pilot-img-badge">
                    <span>🏆</span>
                    <span>{activePhoto.badge}</span>
                  </div>
                </div>

                {/* Pagination Dots at bottom-right */}
                <div className="ln-pilot-dots-bar">
                  {PILOT_PHOTOS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`ln-pilot-dot ${idx === currentSlide ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Jump to photo ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* 4 Interactive Thumbnail Buttons */}
              <div className="ln-pilot-thumbs-strip">
                {PILOT_PHOTOS.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    className={`ln-pilot-thumb-btn ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    title={photo.title}
                  >
                    <img src={photo.image} alt={photo.tabLabel} className="ln-pilot-thumb-img" />
                    <span className="ln-pilot-thumb-label">{photo.tabLabel}</span>
                  </button>
                ))}
              </div>

              {/* Photo Metadata and Live Caption */}
              <div className="ln-pilot-photo-info">
                <div className="ln-pilot-mentor-meta">
                  <span className="ln-mentor-avatar">{activePhoto.avatar}</span>
                  <div>
                    <h4 className="ln-pilot-mentor-name">
                      {activePhoto.title}
                    </h4>
                    <p className="ln-pilot-mentor-role">
                      {activePhoto.role}
                    </p>
                  </div>
                </div>
                <p className="ln-pilot-photo-caption">
                  {activePhoto.caption}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Participant Cohort & Download */}
          <div className="ln-pilot-data-column">
            <div className="ln-pilot-data-header">
              <div className="ln-pilot-badge-verified">
                <span>🧪</span>
                <span>Verified 22-Student Trial Cohort</span>
              </div>
              <h3 className="ln-pilot-data-title">
                {t('landing.pilot.rosterTitle', 'Students Who Tested the Platform')}
              </h3>
              <p className="ln-pilot-data-desc">
                {t(
                  'landing.pilot.rosterDesc',
                  'Cohort of 22 students who actively performed and validated experiments during our physical laboratory pilot session.'
                )}
              </p>

              {/* Dedicated full-width action bar: no overflow, perfectly aligned */}
              <div className="ln-pilot-header-actions">
                <a
                  href="/VirtualVigyan_Pilot_Trial_Gradebook.csv"
                  download="VirtualVigyan_Pilot_Trial_Gradebook.csv"
                  className="ln-btn ln-btn-primary ln-btn-sm ln-pilot-download-btn"
                  title="Download verified student trial dataset in CSV format"
                >
                  <span>📥</span>
                  <span>{t('landing.pilot.downloadCsv', 'Download Full Trial Data (.CSV)')}</span>
                </a>
                <span className="ln-pilot-file-meta">📊 22 Verified Students</span>
              </div>
            </div>

            {/* Student Participant Roster List */}
            <div className="ln-pilot-roster-list">
              {visibleRecords.map((st) => (
                <div key={st.email} className="ln-pilot-student-row">
                  <div className="ln-pilot-student-avatar">{st.avatar}</div>
                  <div className="ln-pilot-student-info">
                    <div className="ln-pilot-student-name">
                      <span className="ln-st-name-text">{st.name}</span>
                      <span className="ln-pilot-attempt-tag">Attempt {st.attempt}</span>
                    </div>
                    <div className="ln-pilot-student-sub">
                      <span className="ln-pilot-exp-label" title={st.experimentTitle}>
                        🧪 Water Acidity Titration
                      </span>
                      <span>•</span>
                      <span className="ln-pilot-time-label">⏱️ {st.timeSpent}</span>
                    </div>
                  </div>
                  <div className="ln-pilot-score-box">
                    <div className="ln-pilot-status-pill">
                      <span>✓</span>
                      <span>Tested</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Toggle Full Roster Button */}
            <div className="ln-pilot-data-footer">
              <button
                className="ln-btn ln-btn-secondary ln-btn-sm"
                onClick={() => setShowAllStudents(!showAllStudents)}
              >
                {showAllStudents
                  ? '▲ Show First 6 Students'
                  : `▼ View All 22 Students (${PILOT_RECORDS.length - 6} More)`}
              </button>

              <div className="ln-pilot-session-info">
                <span>🗓️ Trial Date: Oct 01, 2026</span>
                <span>•</span>
                <span>🏆 SIH 2026 Pilot Cohort</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PilotStudySection;

