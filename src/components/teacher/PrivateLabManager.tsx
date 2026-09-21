import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getAllExperiments } from '../../experiments';
import {
  getAllPrivateLabs,
  createPrivateLab,
  toggleLabStatus,
  deletePrivateLab,
  exportGradebookCSV,
  updateSubmissionFeedback,
  syncPrivateLabsWithCloud,
} from '../../services/privateLabService';
import type { PrivateLab, PrivateLabSubmission } from '../../types/privateLab';

interface PrivateLabManagerProps {
  onLaunchExperiment?: (id: string) => void;
}

export const PrivateLabManager: React.FC<PrivateLabManagerProps> = ({ onLaunchExperiment }) => {
  const { user } = useAuth();
  const [labs, setLabs] = useState<PrivateLab[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsLab, setDetailsLab] = useState<PrivateLab | null>(null);
  const [detailsTab, setDetailsTab] = useState<'submissions' | 'progress' | 'roster'>('submissions');
  const [selectedSubForInspect, setSelectedSubForInspect] = useState<PrivateLabSubmission | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Create Lab Form State
  const [title, setTitle] = useState('');
  const [targetClass, setTargetClass] = useState('Class 11 - Science');
  const [description, setDescription] = useState('');
  const [selectedExperiments, setSelectedExperiments] = useState<string[]>(['titration-water-acidity']);
  const [hideProcedure, setHideProcedure] = useState(true);
  const [hideFormulas, setHideFormulas] = useState(true);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [strictSafety, setStrictSafety] = useState(true);
  const [customCode, setCustomCode] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const experiments = getAllExperiments();

  const loadLabs = () => {
    const all = getAllPrivateLabs();
    setLabs(all);
    if (detailsLab) {
      const updated = all.find((l) => l.id === detailsLab.id);
      if (updated) {
        setDetailsLab(updated);
        if (selectedSubForInspect) {
          const freshSub = updated.submissions.find((s) => s.id === selectedSubForInspect.id);
          if (freshSub) setSelectedSubForInspect(freshSub);
        }
      }
    }
  };

  useEffect(() => {
    loadLabs();
    syncPrivateLabsWithCloud().then(loadLabs);

    const handleUpdate = () => {
      loadLabs();
    };

    window.addEventListener('vv_privatelabs_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Continuous real-time auto-sync (every 2.5s) so teacher never has to refresh tab
    const interval = setInterval(loadLabs, 2500);

    return () => {
      window.removeEventListener('vv_privatelabs_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, [detailsLab?.id, selectedSubForInspect?.id]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleToggleStatus = (labId: string) => {
    toggleLabStatus(labId);
    loadLabs();
  };

  const handleDeleteLab = (labId: string) => {
    if (window.confirm('Are you sure you want to delete this private lab and all associated student submissions?')) {
      deletePrivateLab(labId);
      loadLabs();
      if (detailsLab?.id === labId) {
        setDetailsLab(null);
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please provide a descriptive title for this private lab.');
      return;
    }
    if (selectedExperiments.length === 0) {
      setFormError('Please select at least one experiment to include in this lab.');
      return;
    }

    createPrivateLab({
      title: title.trim(),
      targetClass,
      description: description.trim(),
      teacherId: user?.id || 'usr_teacher',
      teacherName: user?.name || 'Professor',
      teacherEmail: user?.email || 'teacher@virtualvigyan.in',
      institution: user?.institution || 'VirtualVigyan Academy',
      department: user?.department || 'Department of Chemistry',
      experimentIds: selectedExperiments,
      restrictions: {
        hideProcedure,
        hideFormulas,
        timeLimitMinutes: Number(timeLimitMinutes),
        maxAttempts: Number(maxAttempts),
        strictSafety,
      },
      status: 'active',
      dueDate: dueDate || undefined,
      customCode: customCode.trim() || undefined,
    });

    loadLabs();
    setCreateModalOpen(false);

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedExperiments(['titration-water-acidity']);
    setHideProcedure(true);
    setHideFormulas(true);
    setTimeLimitMinutes(30);
    setMaxAttempts(1);
    setCustomCode('');
    setFormError(null);
  };

  const toggleExperimentSelect = (expId: string) => {
    setSelectedExperiments((prev) =>
      prev.includes(expId) ? prev.filter((id) => id !== expId) : [...prev, expId]
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Classrooms & Private Labs
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Create evaluation sessions, share join codes, and inspect student attempts & scores.
          </p>
        </div>

        <button
          id="btn-create-private-lab"
          onClick={() => {
            setFormError(null);
            setCreateModalOpen(true);
          }}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
          }}
        >
          <span>➕</span>
          <span>Create New Private Lab</span>
        </button>
      </div>

      {/* Labs Grid */}
      {labs.length === 0 ? (
        <div
          className="clay-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontSize: 36 }}>🔬</span>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            No Private Labs Created Yet
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: 440, margin: 0 }}>
            Create your first private lab with custom exam restrictions (hide procedures, hide formulas, set countdown timers) and share the join code with your students.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '10px 20px',
              borderRadius: 10,
              background: '#0284c7',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.84rem',
            }}
          >
            Create Lab Now →
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
          {labs.map((lab) => {
            const labExperiments = experiments.filter((e) => lab.experimentIds.includes(e.id));
            const avgScore =
              lab.submissions.length > 0
                ? Math.round(
                    lab.submissions.reduce((sum, s) => sum + s.score, 0) /
                      lab.submissions.length
                  )
                : 0;

            return (
              <div
                key={lab.id}
                className="clay-card"
                style={{
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  borderRadius: 16,
                  border: '1.5px solid var(--border)',
                  background: 'var(--bg-card)',
                }}
              >
                <div>
                  {/* Top Bar with Class Badge and Status Toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'rgba(2, 132, 199, 0.12)',
                        color: '#0284c7',
                      }}
                    >
                      {lab.targetClass || 'Chemistry Batch'}
                    </span>

                    <button
                      onClick={() => handleToggleStatus(lab.id)}
                      title="Click to toggle session active/closed"
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: lab.status === 'active' ? 'rgba(5, 150, 105, 0.12)' : 'rgba(100, 116, 139, 0.15)',
                        color: lab.status === 'active' ? '#059669' : '#64748b',
                        border: lab.status === 'active' ? '1px solid rgba(5, 150, 105, 0.3)' : '1px solid rgba(100, 116, 139, 0.3)',
                      }}
                    >
                      {lab.status === 'active' ? '● Active' : '○ Closed'}
                    </button>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-primary)' }}>
                    {lab.title}
                  </h4>

                  {lab.description && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.4 }}>
                      {lab.description}
                    </p>
                  )}

                  {/* Join Code Box */}
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                        Student Join Code
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 900, fontSize: '1.15rem', color: '#0284c7', letterSpacing: '0.04em' }}>
                        {lab.code}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyCode(lab.code)}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: copiedCode === lab.code ? '#059669' : '#0284c7',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {copiedCode === lab.code ? '✓ Copied' : 'Copy Code'}
                    </button>
                  </div>

                  {/* Restrictions Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {lab.restrictions.hideProcedure && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#dc2626', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 7px', borderRadius: 4 }}>
                        🔒 No Procedure
                      </span>
                    )}
                    {lab.restrictions.hideFormulas && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7c3aed', background: 'rgba(124, 58, 237, 0.1)', padding: '2px 7px', borderRadius: 4 }}>
                        📐 No Formulas
                      </span>
                    )}
                    {lab.restrictions.timeLimitMinutes && lab.restrictions.timeLimitMinutes > 0 ? (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0284c7', background: 'rgba(2, 132, 199, 0.1)', padding: '2px 7px', borderRadius: 4 }}>
                        ⏱️ {lab.restrictions.timeLimitMinutes}m Limit
                      </span>
                    ) : null}
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 7px', borderRadius: 4 }}>
                      🔄 {lab.restrictions.maxAttempts ? `Max ${lab.restrictions.maxAttempts} att.` : 'Unlimited'}
                    </span>
                  </div>

                  {/* Included Experiments List */}
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    <strong>Experiments ({labExperiments.length}):</strong>{' '}
                    {labExperiments.map((e) => e.title.split('(')[0]).join(', ')}
                  </div>
                </div>

                {/* Metrics & Actions */}
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: 8,
                      padding: '10px 0',
                      borderTop: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: 12,
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {lab.enrolledStudents.length}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Enrolled</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>
                        {lab.submissions.length}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Submissions</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: avgScore >= 75 ? '#059669' : '#d97706' }}>
                        {lab.submissions.length > 0 ? `${avgScore}%` : '—'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Score</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        setDetailsLab(lab);
                        setDetailsTab('submissions');
                      }}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        flex: 1,
                        padding: '8px',
                        borderRadius: 8,
                        background: 'rgba(2, 132, 199, 0.1)',
                        border: '1px solid rgba(2, 132, 199, 0.3)',
                        color: '#0284c7',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textAlign: 'center',
                      }}
                    >
                      📊 View Roster & Grades
                    </button>

                    <button
                      onClick={() => exportGradebookCSV(lab.id)}
                      title="Download Gradebook CSV"
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textAlign: 'center',
                      }}
                    >
                      📥 CSV
                    </button>

                    <button
                      onClick={() => handleDeleteLab(lab.id)}
                      title="Delete Lab"
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#dc2626',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textAlign: 'center',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CREATE PRIVATE LAB MODAL ── */}
      {createModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 11000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            padding: 16,
          }}
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 620,
              maxHeight: '90vh',
              background: 'var(--bg-card)',
              borderRadius: 20,
              border: '1.5px solid var(--border)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(37, 99, 235, 0.06))',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Create Private Assessment Lab
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                style={{ all: 'unset', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {formError && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>
                  ⚠️ {formError}
                </div>
              )}

              {/* Lab Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                  Lab Title: *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Chemical Kinetics & Titration Assessment"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Target Class / Cohort, Join Code, Due Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                    Class / Cohort:
                  </label>
                  <input
                    type="text"
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    placeholder="e.g. Class 11 Science"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                    Custom Join Code:
                  </label>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                    placeholder="Auto if blank"
                    maxLength={10}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                    Submission Due Date:
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Experiment Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                  Select Included Experiments: * ({selectedExperiments.length} chosen)
                </label>
                <div
                  style={{
                    maxHeight: 180,
                    overflowY: 'auto',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: 8,
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {experiments.map((exp) => {
                    const isChecked = selectedExperiments.includes(exp.id);
                    return (
                      <label
                        key={exp.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '6px 10px',
                          borderRadius: 8,
                          background: isChecked ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontWeight: isChecked ? 700 : 500,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleExperimentSelect(exp.id)}
                          style={{ accentColor: '#0284c7' }}
                        />
                        <span>{exp.icon || '🧪'}</span>
                        <span>{exp.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Assessment Restrictions Section */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🛡️</span>
                  <span>Exam Mode & Assessment Restrictions</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hideProcedure}
                      onChange={(e) => setHideProcedure(e.target.checked)}
                      style={{ accentColor: '#dc2626' }}
                    />
                    <span>🔒 Hide Step Procedure</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hideFormulas}
                      onChange={(e) => setHideFormulas(e.target.checked)}
                      style={{ accentColor: '#7c3aed' }}
                    />
                    <span>📐 Conceal Worked Formulas</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={strictSafety}
                      onChange={(e) => setStrictSafety(e.target.checked)}
                      style={{ accentColor: '#059669' }}
                    />
                    <span>⚠️ Strict Safety Mode</span>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 4 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Countdown Timer:
                    </label>
                    <select
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '0.82rem',
                      }}
                    >
                      <option value={0}>No Time Limit</option>
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Max Attempts Allowed:
                    </label>
                    <select
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '0.82rem',
                      }}
                    >
                      <option value={1}>1 Attempt Only (Strict Exam)</option>
                      <option value={2}>2 Attempts Allowed</option>
                      <option value={3}>3 Attempts Allowed</option>
                      <option value={0}>Unlimited Attempts</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '10px 18px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '10px 22px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                  }}
                >
                  Generate Private Lab & Join Code →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DETAILS & GRADEBOOK MODAL ── */}
      {detailsLab && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 11000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            padding: 16,
          }}
          onClick={() => setDetailsLab(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 850,
              maxHeight: '90vh',
              background: 'var(--bg-card)',
              borderRadius: 20,
              border: '1.5px solid var(--border)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(37, 99, 235, 0.06))',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {detailsLab.title}
                  </h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: 6, fontSize: '0.78rem' }}>
                    {detailsLab.code}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  {detailsLab.targetClass} • {detailsLab.enrolledStudents.length} Students Enrolled • {detailsLab.submissions.length} Submissions
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Assigned:</span>
                  {detailsLab.experimentIds.map((expId) => {
                    const exp = experiments.find((e) => e.id === expId);
                    return (
                      <span
                        key={expId}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                        }}
                      >
                        <span>{exp?.icon || '🧪'}</span>
                        <span>{exp?.title || expId}</span>
                        {onLaunchExperiment && (
                          <button
                            onClick={() => {
                              setDetailsLab(null);
                              onLaunchExperiment(expId);
                            }}
                            title="Preview Experiment Simulation"
                            style={{
                              all: 'unset',
                              cursor: 'pointer',
                              color: '#0284c7',
                              fontWeight: 700,
                              fontSize: '0.68rem',
                              marginLeft: 4,
                              textDecoration: 'underline',
                            }}
                          >
                            Preview ↗
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Live Auto-Sync Status Indicator */}
                <div
                  title="Submissions and enrolled roster synchronize automatically in real-time"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.72rem',
                    color: '#059669',
                    fontWeight: 700,
                    background: 'rgba(5, 150, 105, 0.1)',
                    border: '1px solid rgba(5, 150, 105, 0.25)',
                    padding: '5px 10px',
                    borderRadius: 9999,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 8px #10b981',
                      display: 'inline-block',
                    }}
                  />
                  <span>Live Auto-Sync Active</span>
                </div>

                <button
                  onClick={() => exportGradebookCSV(detailsLab.id)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: '#059669',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
                  }}
                >
                  📥 Export CSV
                </button>
                <button
                  onClick={() => {
                    setDetailsLab(null);
                    setSelectedSubForInspect(null);
                  }}
                  style={{ all: 'unset', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tab Switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '0 24px', gap: 8 }}>
              <button
                onClick={() => setDetailsTab('submissions')}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '12px 16px',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  color: detailsTab === 'submissions' ? '#0284c7' : 'var(--text-muted)',
                  borderBottom: detailsTab === 'submissions' ? '2px solid #0284c7' : 'none',
                }}
              >
                📊 Submissions Log ({detailsLab.submissions.length})
              </button>
              <button
                onClick={() => setDetailsTab('progress')}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '12px 16px',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  color: detailsTab === 'progress' ? '#0284c7' : 'var(--text-muted)',
                  borderBottom: detailsTab === 'progress' ? '2px solid #0284c7' : 'none',
                }}
              >
                📈 Student Analytics & Progress ({detailsLab.enrolledStudents.length})
              </button>
              <button
                onClick={() => setDetailsTab('roster')}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '12px 16px',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  color: detailsTab === 'roster' ? '#0284c7' : 'var(--text-muted)',
                  borderBottom: detailsTab === 'roster' ? '2px solid #0284c7' : 'none',
                }}
              >
                👥 Enrolled Roster ({detailsLab.enrolledStudents.length})
              </button>
            </div>

            {/* Content Area */}
            <div style={{ padding: 24, overflowX: 'auto' }}>
              {detailsTab === 'submissions' ? (
                detailsLab.submissions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
                    No student submissions logged yet for this private lab.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Student</th>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Experiment</th>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Score</th>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Attempt</th>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Mistakes</th>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Time</th>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Date</th>
                        <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailsLab.submissions.map((sub) => (
                        <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 20 }}>{sub.avatar || '🎓'}</span>
                              <div>
                                <div style={{ fontWeight: 800 }}>{sub.studentName}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub.studentEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px', fontWeight: 600 }}>{sub.experimentTitle}</td>
                          <td style={{ padding: '12px' }}>
                            <span
                              style={{
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: sub.score >= 80 ? 'rgba(5, 150, 105, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                                color: sub.score >= 80 ? '#059669' : '#d97706',
                              }}
                            >
                              {sub.score}/100
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontWeight: 600 }}>Attempt #{sub.attemptNumber}</td>
                          <td style={{ padding: '12px' }}>
                            {sub.mistakes && sub.mistakes.length > 0 ? (
                              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}>
                                ⚠️ {sub.mistakes.length} {sub.mistakes.length === 1 ? 'flaw' : 'flaws'}
                              </span>
                            ) : (
                              <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.75rem' }}>
                                Clean
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                            {Math.floor(sub.timeSpentSeconds / 60)}m {sub.timeSpentSeconds % 60}s
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                            {new Date(sub.completedAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                setSelectedSubForInspect(sub);
                                setFeedbackInput(sub.teacherFeedback || '');
                                setFeedbackSaved(false);
                              }}
                              style={{
                                all: 'unset',
                                cursor: 'pointer',
                                padding: '5px 12px',
                                borderRadius: 8,
                                background: 'rgba(2, 132, 199, 0.1)',
                                border: '1px solid rgba(2, 132, 199, 0.3)',
                                color: '#0284c7',
                                fontWeight: 700,
                                fontSize: '0.74rem',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              🔍 Inspect Performance
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              ) : detailsTab === 'progress' ? (
                /* ── Tab 2: Student Analytics & Progress ── */
                detailsLab.enrolledStudents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
                    No students have enrolled in this private lab yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {detailsLab.enrolledStudents.map((st) => {
                      const studentSubs = detailsLab.submissions.filter(
                        (s) => s.studentEmail?.toLowerCase() === st.studentEmail.toLowerCase()
                      );
                      const completedExpIds = new Set(studentSubs.map((s) => s.experimentId));
                      const progressPct = Math.round(
                        (completedExpIds.size / Math.max(1, detailsLab.experimentIds.length)) * 100
                      );
                      const bestScore = studentSubs.length > 0 ? Math.max(...studentSubs.map((s) => s.score)) : null;
                      const latestSub = studentSubs[studentSubs.length - 1];
                      const totalMistakes = studentSubs.reduce((acc, s) => acc + (s.mistakes?.length || 0), 0);

                      return (
                        <div
                          key={st.studentId}
                          style={{
                            padding: '16px 20px',
                            borderRadius: 12,
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 16,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 240 }}>
                            <span style={{ fontSize: 30 }}>{st.avatar || '🎓'}</span>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                {st.studentName}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {st.studentEmail} • Enrolled {new Date(st.joinedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div style={{ flex: 1, minWidth: 200, maxWidth: 300 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4 }}>
                              <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                                {completedExpIds.size} / {detailsLab.experimentIds.length} Practicals Done
                              </span>
                              <span style={{ fontWeight: 800, color: progressPct === 100 ? '#059669' : '#0284c7' }}>
                                {progressPct}%
                              </span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${progressPct}%`,
                                  background: progressPct === 100 ? '#059669' : 'linear-gradient(90deg, #0284c7, #2563eb)',
                                  borderRadius: 3,
                                }}
                              />
                            </div>
                          </div>

                          {/* Stats Pill */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>BEST SCORE</div>
                              <div
                                style={{
                                  fontWeight: 800,
                                  fontSize: '1rem',
                                  color: bestScore !== null ? (bestScore >= 80 ? '#059669' : '#d97706') : 'var(--text-muted)',
                                }}
                              >
                                {bestScore !== null ? `${bestScore}/100` : '—'}
                              </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>ATTEMPTS</div>
                              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                {studentSubs.length}
                              </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>MISTAKES</div>
                              <div style={{ fontWeight: 800, fontSize: '1rem', color: totalMistakes > 0 ? '#ef4444' : '#059669' }}>
                                {totalMistakes}
                              </div>
                            </div>

                            {latestSub ? (
                              <button
                                onClick={() => {
                                  setSelectedSubForInspect(latestSub);
                                  setFeedbackInput(latestSub.teacherFeedback || '');
                                  setFeedbackSaved(false);
                                }}
                                style={{
                                  all: 'unset',
                                  cursor: 'pointer',
                                  padding: '7px 14px',
                                  borderRadius: 8,
                                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                                }}
                              >
                                📊 Diagnostic & Notes
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Not started yet
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* ── Tab 3: Enrolled Roster ── */
                detailsLab.enrolledStudents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
                    No students have entered the join code <strong>{detailsLab.code}</strong> yet.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Student</th>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Email</th>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Enrolled Date</th>
                        <th style={{ padding: '10px 12px', fontWeight: 800 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailsLab.enrolledStudents.map((st) => (
                        <tr key={st.studentId} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 20 }}>{st.avatar || '🎓'}</span>
                              <span style={{ fontWeight: 800 }}>{st.studentName}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{st.studentEmail}</td>
                          <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                            {new Date(st.joinedAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ color: '#059669', fontWeight: 700, background: 'rgba(5, 150, 105, 0.1)', padding: '2px 8px', borderRadius: 6 }}>
                              Enrolled
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Student Diagnostic & Performance Drawer Modal ── */}
      {selectedSubForInspect && detailsLab && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 12000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.78)',
            backdropFilter: 'blur(8px)',
            padding: 16,
          }}
          onClick={() => setSelectedSubForInspect(null)}
        >
          <div
            className="clay-card animate-scale-up"
            style={{
              maxWidth: 620,
              width: '100%',
              background: 'var(--bg-card)',
              borderRadius: 20,
              border: '1.5px solid var(--border)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(37, 99, 235, 0.08))',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>{selectedSubForInspect.avatar || '🎓'}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {selectedSubForInspect.studentName}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {selectedSubForInspect.studentEmail} • {selectedSubForInspect.experimentTitle}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubForInspect(null)}
                style={{ all: 'unset', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18, maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Score & Timing Card */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 12,
                  padding: 14,
                  borderRadius: 12,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>FINAL SCORE</div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: selectedSubForInspect.score >= 80 ? '#059669' : '#d97706',
                    }}
                  >
                    {selectedSubForInspect.score}/100
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>ATTEMPT</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    #{selectedSubForInspect.attemptNumber}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>TIME SPENT</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {Math.floor(selectedSubForInspect.timeSpentSeconds / 60)}m {selectedSubForInspect.timeSpentSeconds % 60}s
                  </div>
                </div>
              </div>

              {/* Logged Mistakes / Infractions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                  Engine Logged Mistakes & Safety Penalties:
                </label>
                {selectedSubForInspect.mistakes && selectedSubForInspect.mistakes.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedSubForInspect.mistakes.map((m, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 8,
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#ef4444',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span>⚠️</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'rgba(5, 150, 105, 0.08)',
                      border: '1px solid rgba(5, 150, 105, 0.25)',
                      color: '#059669',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    ✓ Flawless laboratory execution. Zero procedural or safety infractions detected.
                  </div>
                )}
              </div>

              {/* Submitted Calculation Variables */}
              {selectedSubForInspect.calculationAnswers && Object.keys(selectedSubForInspect.calculationAnswers).length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                    Student Submitted Values:
                  </label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {Object.entries(selectedSubForInspect.calculationAnswers).map(([k, v]) => (
                      <div
                        key={k}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          fontSize: '0.76rem',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>{k}: </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teacher Feedback Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                  Instructor Evaluation Feedback:
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Leave personalized feedback, correction hints, or commendation for this student..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  {feedbackSaved ? (
                    <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 700 }}>
                      ✓ Feedback note successfully saved!
                    </span>
                  ) : <span />}

                  <button
                    onClick={() => {
                      updateSubmissionFeedback(detailsLab.id, selectedSubForInspect.id, feedbackInput.trim());
                      loadLabs();
                      setFeedbackSaved(true);
                      setTimeout(() => setFeedbackSaved(false), 2500);
                    }}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      padding: '8px 18px',
                      borderRadius: 8,
                      background: '#0284c7',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                    }}
                  >
                    💾 Save Feedback Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
