import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getAllExperiments } from '../../experiments';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';

interface TeacherDashboardProps {
  onLaunchExperiment: (id: string) => void;
  onNavigateToAuth?: (role?: 'student' | 'teacher') => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLaunchExperiment, onNavigateToAuth }) => {
  const { user, allUsers } = useAuth();
  const [assignedLabs, setAssignedLabs] = useState<string[]>(['conservation', 'titration', 'exp-ostwald-viscometer']);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const students = allUsers.filter((u) => u.role === 'student');
  const engineExperiments = getAllExperiments();

  const toggleAssign = (labId: string) => {
    setAssignedLabs((prev) => {
      const isAssigned = prev.includes(labId);
      const next = isAssigned ? prev.filter((id) => id !== labId) : [...prev, labId];
      setToastMsg(isAssigned ? 'Lab unassigned from student cohort.' : 'Lab assigned to students successfully!');
      setTimeout(() => setToastMsg(null), 3000);
      return next;
    });
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        flex: 1,
        padding: '28px 24px',
        maxWidth: 1240,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className="clay-card-sm"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            padding: '14px 22px',
            background: 'var(--bg-card)',
            border: '2px solid #0284c7',
            color: 'var(--text-primary)',
            fontSize: '0.86rem',
            fontWeight: 700,
          }}
        >
          📢 {toastMsg}
        </div>
      )}

      {/* Claymorphic Teacher Profile Banner */}
      <div
        className="clay-card"
        style={{
          padding: '26px 32px',
          background: 'linear-gradient(145deg, var(--bg-card), rgba(2, 132, 199, 0.08))',
          marginBottom: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <VirtualVigyanLogo size={48} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Teacher & Faculty Dashboard
              </h2>
              <span
                className="clay-badge"
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: 'rgba(2, 132, 199, 0.15)',
                  color: '#0284c7',
                  padding: '3px 10px',
                }}
              >
                Educator Portal
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '5px 0 0', fontWeight: 500 }}>
              Welcome back, <strong>{user?.name || 'Professor'}</strong>. {user?.department ? `${user.department} • ` : ''}
              {user?.institution || 'Academic Department'}
            </p>
          </div>
        </div>

        {user?.role !== 'teacher' && onNavigateToAuth && (
          <button
            id="btn-teacher-dashboard-signin"
            onClick={() => onNavigateToAuth('teacher')}
            className="clay-btn"
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '10px 18px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #2563eb, #0284c7)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            }}
          >
            <span>👨‍🏫</span>
            <span>Sign In to Faculty Account</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Claymorphic KPI Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          marginBottom: 28,
        }}
      >
        <div className="clay-card-sm" style={{ padding: 22 }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Enrolled Students in Cohort
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 6px' }}>
            {students.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>Active & Registered</div>
        </div>

        <div className="clay-card-sm" style={{ padding: 22 }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Assigned Experiments
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 900, color: '#0284c7', margin: '6px 0 6px' }}>
            {assignedLabs.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active in syllabus</div>
        </div>

        <div className="clay-card-sm" style={{ padding: 22 }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Cohort Performance Score
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 900, color: '#059669', margin: '6px 0 6px' }}>
            91.5%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Based on step accuracy & calculations</div>
        </div>
      </div>

      {/* Grid: Left = Student Roster; Right = Experiment Assignments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24, flexWrap: 'wrap' }}>
        {/* Student Performance Roster */}
        <div className="clay-card" style={{ padding: 26 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px' }}>
            Student Lab Performance Roster
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>Student</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>Class</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>Labs Done</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{st.avatar || '🎓'}</span>
                        <div>
                          <div style={{ fontWeight: 800 }}>{st.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{st.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{st.grade || 'General'}</td>
                    <td style={{ padding: '12px', fontWeight: 800 }}>{st.completedLabs || 4}</td>
                    <td style={{ padding: '12px' }}>
                      <span
                        className="clay-badge"
                        style={{
                          fontSize: '0.74rem',
                          color: '#059669',
                          background: 'rgba(5, 150, 105, 0.15)',
                          padding: '3px 10px',
                        }}
                      >
                        {st.avgScore || 92}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Experiment Curriculum Assignment & Demonstration */}
        <div className="clay-card" style={{ padding: 26 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px' }}>
            Class Practical Assignments
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Conservation of Mass */}
            <div
              className="clay-card-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>⚖️ Conservation of Mass</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Class 9 • BaCl₂ + Na₂SO₄</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => toggleAssign('conservation')}
                  className={`clay-btn ${assignedLabs.includes('conservation') ? 'clay-btn-emerald' : 'clay-btn-neutral'}`}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 12,
                    fontSize: '0.74rem',
                  }}
                >
                  {assignedLabs.includes('conservation') ? '✓ Assigned' : '+ Assign'}
                </button>
                <button
                  onClick={() => onLaunchExperiment('conservation')}
                  className="clay-btn clay-btn-neutral"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 12,
                    fontSize: '0.74rem',
                  }}
                >
                  Demonstrate
                </button>
              </div>
            </div>

            {/* Acid-Base Titration */}
            <div
              className="clay-card-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>🧪 Acid-Base Titration</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Class 11 • HCl + NaOH</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => toggleAssign('titration')}
                  className={`clay-btn ${assignedLabs.includes('titration') ? 'clay-btn-emerald' : 'clay-btn-neutral'}`}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 12,
                    fontSize: '0.74rem',
                  }}
                >
                  {assignedLabs.includes('titration') ? '✓ Assigned' : '+ Assign'}
                </button>
                <button
                  onClick={() => onLaunchExperiment('titration')}
                  className="clay-btn clay-btn-neutral"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 12,
                    fontSize: '0.74rem',
                  }}
                >
                  Demonstrate
                </button>
              </div>
            </div>

            {/* DBATU / Engine Experiments */}
            {engineExperiments.map((exp) => (
              <div
                key={exp.id}
                className="clay-card-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>
                    {exp.icon} {exp.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {typeof exp.class === 'number' ? `Class ${exp.class}` : exp.class}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => toggleAssign(exp.id)}
                    className={`clay-btn ${assignedLabs.includes(exp.id) ? 'clay-btn-emerald' : 'clay-btn-neutral'}`}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 12,
                      fontSize: '0.74rem',
                    }}
                  >
                    {assignedLabs.includes(exp.id) ? '✓ Assigned' : '+ Assign'}
                  </button>
                  <button
                    onClick={() => onLaunchExperiment(exp.id)}
                    className="clay-btn clay-btn-neutral"
                    style={{
                      padding: '6px 14px',
                      borderRadius: 12,
                      fontSize: '0.74rem',
                    }}
                  >
                    Demonstrate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
