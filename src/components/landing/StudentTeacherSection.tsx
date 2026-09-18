import React from 'react';

interface Props {
  onStartExperiment: () => void;
  onOpenTeacherPortal: () => void;
}

const StudentTeacherSection: React.FC<Props> = ({ onStartExperiment, onOpenTeacherPortal }) => {
  return (
    <section id="roles" className="ln-section ln-section-alt">
      <div className="ln-container">
        <div className="ln-section-header ln-reveal">
          <span className="ln-section-label">Built for Education</span>
          <h2 className="ln-section-heading">Students & Teachers</h2>
          <p className="ln-section-desc">
            A unified platform that empowers students with independent practice and gives educators clear learning insights.
          </p>
        </div>

        <div className="ln-roles-grid">
          {/* Student */}
          <div id="student-role" className="ln-card ln-role-card ln-role-student ln-reveal ln-reveal-d1">
            <div className="ln-role-icon">🎓</div>
            <h3 className="ln-role-title">Student Experience</h3>
            <p className="ln-role-desc">
              Practice experiments, follow procedures, record observations, complete calculations and track progress.
            </p>
            <ul className="ln-role-list">
              <li>Perform experiments virtually</li>
              <li>Follow step-by-step procedures</li>
              <li>Record observations & data</li>
              <li>Track accuracy & progress</li>
            </ul>
            <button onClick={onStartExperiment} className="ln-btn ln-btn-primary">
              Explore Student Experience →
            </button>
          </div>

          {/* Teacher */}
          <div id="teacher-role" className="ln-card ln-role-card ln-role-teacher ln-reveal ln-reveal-d2">
            <div className="ln-role-icon">👨‍🏫</div>
            <h3 className="ln-role-title">Teacher Portal</h3>
            <p className="ln-role-desc">
              Assign experiments, monitor activity, review performance and understand student learning.
            </p>
            <ul className="ln-role-list">
              <li>Assign experiments to students</li>
              <li>Monitor student activity</li>
              <li>Review performance data</li>
              <li>View learning insights</li>
            </ul>
            <button onClick={onOpenTeacherPortal} className="ln-btn ln-btn-secondary">
              Explore Teacher Portal →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentTeacherSection;
