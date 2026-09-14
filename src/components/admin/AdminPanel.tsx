import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getAllExperiments } from '../../experiments';
import type { UserRole } from '../../auth/types';

interface AdminPanelProps {
  onLaunchExperiment: (id: string) => void;
  onViewAsStudent: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLaunchExperiment, onViewAsStudent }) => {
  const { user, allUsers, deleteUser, changeUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'experiments'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  const engineExperiments = getAllExperiments();
  const totalExperiments = engineExperiments.length + 2; // + Titration + Conservation

  const studentsCount = allUsers.filter((u) => u.role === 'student').length;
  const teachersCount = allUsers.filter((u) => u.role === 'teacher').length;
  const adminsCount = allUsers.filter((u) => u.role === 'admin').length;

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
      {/* Claymorphic Admin Header Banner */}
      <div
        className="clay-card"
        style={{
          padding: '26px 32px',
          background: 'linear-gradient(145deg, var(--bg-card), rgba(124, 58, 237, 0.08))',
          marginBottom: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            className="clay-badge"
            style={{
              width: 62,
              height: 62,
              borderRadius: 20,
              background: 'linear-gradient(145deg, #a855f7, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              boxShadow: '6px 8px 20px rgba(124, 58, 237, 0.35), inset 2px 2px 4px rgba(255, 255, 255, 0.5)',
            }}
          >
            🛡️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
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
                Admin & Moderator Command Center
              </h2>
              <span
                className="clay-badge"
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: 'rgba(124, 58, 237, 0.15)',
                  color: '#7c3aed',
                  padding: '3px 10px',
                }}
              >
                Superuser Access
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '5px 0 0', fontWeight: 500 }}>
              Welcome back, <strong>{user?.name || 'Administrator'}</strong>. Monitor real-time telemetry, manage user cohorts, and inspect active curriculum simulations.
            </p>
          </div>
        </div>

        {/* Quick Action Button */}
        <div>
          <button
            onClick={onViewAsStudent}
            className="clay-btn clay-btn-emerald"
            style={{
              padding: '12px 22px',
              borderRadius: 18,
              fontSize: '0.86rem',
              fontWeight: 800,
            }}
          >
            <span>🔬</span>
            <span>View Labs as Student</span>
          </button>
        </div>
      </div>

      {/* Claymorphic KPI Stats Cards */}
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
            Total Registered Users
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 6px' }}>
            {allUsers.length}
          </div>
          <div style={{ fontSize: '0.74rem', display: 'flex', gap: 10, flexWrap: 'wrap', fontWeight: 700 }}>
            <span style={{ color: '#059669' }}>🎓 {studentsCount} Students</span>
            <span style={{ color: '#0284c7' }}>👨‍🏫 {teachersCount} Teachers</span>
            <span style={{ color: '#7c3aed' }}>🛡️ {adminsCount} Admin</span>
          </div>
        </div>

        <div className="clay-card-sm" style={{ padding: 22 }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Curriculum Labs Available
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 900, color: '#0284c7', margin: '6px 0 6px' }}>
            {totalExperiments}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            DBATU F.Y. B.Tech & NCERT Classes 9–12
          </div>
        </div>

        <div className="clay-card-sm" style={{ padding: 22 }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            3D VR Subsystem
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 900, color: '#059669', margin: '6px 0 6px' }}>
            Active
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Google Cardboard 360° & WebXR 6-DOF
          </div>
        </div>

        <div className="clay-card-sm" style={{ padding: 22 }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Engine Health & Accuracy
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 900, color: '#10b981', margin: '6px 0 6px' }}>
            100%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Zero Reported Errors • 60 FPS Target
          </div>
        </div>
      </div>

      {/* Claymorphic Tab Navigation */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          borderRadius: 22,
          padding: 6,
          boxShadow: 'var(--clay-input-shadow)',
          marginBottom: 24,
          maxWidth: 680,
          gap: 6,
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          className="clay-btn"
          style={{
            flex: 1,
            padding: '10px 18px',
            borderRadius: 16,
            fontSize: '0.84rem',
            fontWeight: 800,
            background:
              activeTab === 'overview'
                ? 'linear-gradient(145deg, #ffffff, var(--bg-card))'
                : 'transparent',
            color: activeTab === 'overview' ? '#7c3aed' : 'var(--text-muted)',
            boxShadow:
              activeTab === 'overview'
                ? '4px 6px 14px rgba(0, 0, 0, 0.08), inset 2px 2px 3px rgba(255, 255, 255, 0.9)'
                : 'none',
          }}
        >
          📊 System Overview
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className="clay-btn"
          style={{
            flex: 1,
            padding: '10px 18px',
            borderRadius: 16,
            fontSize: '0.84rem',
            fontWeight: 800,
            background:
              activeTab === 'users'
                ? 'linear-gradient(145deg, #ffffff, var(--bg-card))'
                : 'transparent',
            color: activeTab === 'users' ? '#7c3aed' : 'var(--text-muted)',
            boxShadow:
              activeTab === 'users'
                ? '4px 6px 14px rgba(0, 0, 0, 0.08), inset 2px 2px 3px rgba(255, 255, 255, 0.9)'
                : 'none',
          }}
        >
          👥 User Roster ({allUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('experiments')}
          className="clay-btn"
          style={{
            flex: 1,
            padding: '10px 18px',
            borderRadius: 16,
            fontSize: '0.84rem',
            fontWeight: 800,
            background:
              activeTab === 'experiments'
                ? 'linear-gradient(145deg, #ffffff, var(--bg-card))'
                : 'transparent',
            color: activeTab === 'experiments' ? '#7c3aed' : 'var(--text-muted)',
            boxShadow:
              activeTab === 'experiments'
                ? '4px 6px 14px rgba(0, 0, 0, 0.08), inset 2px 2px 3px rgba(255, 255, 255, 0.9)'
                : 'none',
          }}
        >
          🧪 Curriculum Labs ({totalExperiments})
        </button>
      </div>

      {/* TAB 1: SYSTEM OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, flexWrap: 'wrap' }}>
          <div className="clay-card" style={{ padding: 26 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Platform Architecture Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                className="clay-card-sm"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Active Architecture Engine</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Generic Lab Engine with Dynamic Rule & Step Verification
                  </div>
                </div>
                <span className="clay-badge" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.14)', padding: '4px 12px', fontSize: '0.76rem' }}>
                  Operational
                </span>
              </div>

              <div
                className="clay-card-sm"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>3D Virtual Reality Lab Engine</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Three.js WebGL + Stereo Cardboard Gyroscope & WebXR 6-DOF
                  </div>
                </div>
                <span className="clay-badge" style={{ color: '#0284c7', background: 'rgba(2, 132, 199, 0.14)', padding: '4px 12px', fontSize: '0.76rem' }}>
                  Ready
                </span>
              </div>

              <div
                className="clay-card-sm"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Role Security & Moderation Policy</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Public registration strictly isolated to Student & Teacher entities
                  </div>
                </div>
                <span className="clay-badge" style={{ color: '#7c3aed', background: 'rgba(124, 58, 237, 0.14)', padding: '4px 12px', fontSize: '0.76rem' }}>
                  Enforced
                </span>
              </div>
            </div>
          </div>

          <div className="clay-card" style={{ padding: 26 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Recent Registrations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {allUsers.slice(-4).map((u) => (
                <div
                  key={u.id}
                  className="clay-card-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{u.avatar || '👤'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{u.email}</div>
                    </div>
                  </div>
                  <span
                    className="clay-badge"
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '3px 10px',
                      background:
                        u.role === 'admin'
                          ? 'rgba(124, 58, 237, 0.15)'
                          : u.role === 'teacher'
                          ? 'rgba(2, 132, 199, 0.15)'
                          : 'rgba(5, 150, 105, 0.15)',
                      color:
                        u.role === 'admin' ? '#7c3aed' : u.role === 'teacher' ? '#0284c7' : '#059669',
                    }}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER ROSTER & ROLES */}
      {activeTab === 'users' && (
        <div className="clay-card" style={{ padding: 26 }}>
          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              marginBottom: 20,
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Search by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="clay-input"
              style={{
                padding: '11px 18px',
                fontSize: '0.88rem',
                minWidth: 280,
                fontWeight: 600,
              }}
            />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['all', 'student', 'teacher', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`clay-btn ${roleFilter === r ? 'clay-btn-purple' : 'clay-btn-neutral'}`}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 14,
                    fontSize: '0.78rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {r === 'all' ? 'All Roles' : `${r}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>User Profile</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>Role</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>Grade / Affiliation</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800 }}>Joined</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{u.avatar || '👤'}</span>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{u.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span
                        className="clay-badge"
                        style={{
                          fontSize: '0.7rem',
                          padding: '3px 10px',
                          background:
                            u.role === 'admin'
                              ? 'rgba(124, 58, 237, 0.15)'
                              : u.role === 'teacher'
                              ? 'rgba(2, 132, 199, 0.15)'
                              : 'rgba(5, 150, 105, 0.15)',
                          color:
                            u.role === 'admin' ? '#7c3aed' : u.role === 'teacher' ? '#0284c7' : '#059669',
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {u.grade || u.department || u.school || u.institution || '—'}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      {u.createdAt}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        {u.role !== 'admin' && changeUserRole && (
                          <button
                            onClick={() =>
                              changeUserRole(u.id, u.role === 'student' ? 'teacher' : 'student')
                            }
                            className="clay-btn clay-btn-neutral"
                            style={{
                              padding: '6px 12px',
                              borderRadius: 12,
                              fontSize: '0.74rem',
                            }}
                          >
                            Switch to {u.role === 'student' ? 'Teacher' : 'Student'}
                          </button>
                        )}
                        {u.role !== 'admin' && deleteUser && (
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="clay-btn"
                            style={{
                              padding: '6px 12px',
                              borderRadius: 12,
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              fontSize: '0.74rem',
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM MANAGEMENT */}
      {activeTab === 'experiments' && (
        <div className="clay-card" style={{ padding: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              Curriculum Experiments Registry
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Click "Inspect Lab" to launch simulation directly
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {/* Conservation of Mass (Special 3D VR) */}
            <div
              className="clay-card-sm"
              style={{
                padding: 18,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>⚖️</span>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Conservation of Mass</div>
                  <span
                    className="clay-badge"
                    style={{
                      fontSize: '0.64rem',
                      background: 'rgba(5, 150, 105, 0.15)',
                      color: '#059669',
                      padding: '2px 8px',
                    }}
                  >
                    🥽 3D VR Ready
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
                  Class 9 NCERT • BaCl₂ + Na₂SO₄
                </div>
              </div>
              <button
                onClick={() => onLaunchExperiment('conservation')}
                className="clay-btn clay-btn-emerald"
                style={{
                  padding: '8px 16px',
                  borderRadius: 14,
                  fontSize: '0.78rem',
                }}
              >
                Inspect
              </button>
            </div>

            {/* Acid-Base Titration */}
            <div
              className="clay-card-sm"
              style={{
                padding: 18,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>🧪</span>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Acid-Base Titration</div>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
                  Class 11 NCERT • HCl + NaOH
                </div>
              </div>
              <button
                onClick={() => onLaunchExperiment('titration')}
                className="clay-btn clay-btn-blue"
                style={{
                  padding: '8px 16px',
                  borderRadius: 14,
                  fontSize: '0.78rem',
                }}
              >
                Inspect
              </button>
            </div>

            {/* Generic Engine Experiments */}
            {engineExperiments.map((exp) => (
              <div
                key={exp.id}
                className="clay-card-sm"
                style={{
                  padding: 18,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{exp.icon}</span>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{exp.title}</div>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
                    {typeof exp.class === 'number' ? `Class ${exp.class}` : exp.class} • {exp.chapter}
                  </div>
                </div>
                <button
                  onClick={() => onLaunchExperiment(exp.id)}
                  className="clay-btn clay-btn-purple"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 14,
                    fontSize: '0.78rem',
                  }}
                >
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
