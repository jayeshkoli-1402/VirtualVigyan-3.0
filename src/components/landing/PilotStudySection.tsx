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
  { name: 'Kirti Mukesh Chaudhari', email: 'kirtichaudhari1506@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '9m 00s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Diptanshu Sunil Bagul', email: 'diptanshusb@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '10m 20s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Ghanshyam Mali', email: 'ghanshyam2323@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 00s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Rohan Verma', email: 'roshan1234@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '11m 50s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Ruchita Borse', email: 'ruchitaborse676@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '9m 20s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Alice Smith', email: 'yamela1652@hudzer.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '10m 30s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Aishwarya Patil', email: 'aishwarya2006patil@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 30s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Soham Pradip Chikorde', email: 'master.sohamchikorde2006@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '9m 40s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Kalyani Chaudhari', email: 'ckalyani721@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 45s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Shreyash Bhat', email: 'shreyashbhat1111@gmai.lcom', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '12m 40s', attempt: 2, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Chavan Pratik Dipak', email: 'pratikch3518@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '10m 40s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Tejal Bhadane', email: 'pankaj28.com@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 15s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Yashodeep Anilsing Girase', email: 'yashgirase101@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '7m 30s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Bharati Badgujar', email: 'bharatibadgujar743@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '10m 15s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Piyush Rakesh Borse', email: 'borsepiyush389@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '11m 20s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Dipali Ishi', email: 'abc@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 50s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Patil Siddhi Jitendra', email: 'siddhipatil911@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '7m 50s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
  { name: 'Kunal Chaudhari', email: 'kunalchaudhari919@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '11m 30s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Pavan Wadile', email: 'pavanwadile777@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '9m 50s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Raj Borase', email: 'borase.raj11@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 35s', attempt: 1, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Mohit Chaudhari', email: 'rajmali@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '12m 10s', attempt: 2, avatar: '👨‍🎓', status: 'Tested & Verified' },
  { name: 'Sanskruti Yogesh Bhalerao', email: 'sanskrutibhalerao44@gmail.com', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', timeSpent: '8m 25s', attempt: 1, avatar: '👩‍🎓', status: 'Tested & Verified' },
];

export const PilotStudySection: React.FC = () => {
  const { t } = useLanguage();
  const [showAllStudents, setShowAllStudents] = useState(false);

  const visibleRecords = showAllStudents ? PILOT_RECORDS : PILOT_RECORDS.slice(0, 6);

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
          {/* Left Column: Real Mentor & Classroom Photo Card */}
          <div className="ln-pilot-photo-column">
            <div className="ln-pilot-photo-frame">
              <div className="ln-pilot-img-wrapper">
                <img
                  src="/images/mentor-lab-pilot.jpg"
                  alt="VirtualVigyan team and students with SIH mentor during chemistry lab trial"
                  className="ln-pilot-img"
                  loading="lazy"
                />
                <div className="ln-pilot-img-overlay">
                  <div className="ln-pilot-img-badge">
                    <span>🏆</span>
                    <span>{t('landing.pilot.photoTag', 'SIH Pilot Testing Session • Smart Lab Demonstration')}</span>
                  </div>
                </div>
              </div>
              <div className="ln-pilot-photo-info">
                <div className="ln-pilot-mentor-meta">
                  <span className="ln-mentor-avatar">👨‍🏫</span>
                  <div>
                    <h4 className="ln-pilot-mentor-name">
                      {t('landing.pilot.mentorTitle', 'Our SIH Mentor & Research Team')}
                    </h4>
                    <p className="ln-pilot-mentor-role">
                      {t('landing.pilot.mentorRole', 'Smart India Hackathon (SIH) Faculty Mentor & Guide')}
                    </p>
                  </div>
                </div>
                <p className="ln-pilot-photo-caption">
                  {t(
                    'landing.pilot.photoCaption',
                    'Our SIH mentor and student team evaluating titration procedures, stopcock control, and stoichiometric calculations on the digital smartboard.'
                  )}
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

