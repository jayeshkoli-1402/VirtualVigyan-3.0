import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { DeleteAccountModal } from './DeleteAccountModal';

interface StudentProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  initialName?: string;
  initialGrade?: string;
  initialSchool?: string;
}

const PRESET_AVATARS = [
  { id: 'flask', icon: '🧪', label: 'Flask' },
  { id: 'microscope', icon: '🔬', label: 'Microscope' },
  { id: 'female_scientist', icon: '👩‍🔬', label: 'Scientist' },
  { id: 'male_scientist', icon: '👨‍🔬', label: 'Researcher' },
  { id: 'alembic', icon: '⚗️', label: 'Retort' },
  { id: 'dna', icon: '🧬', label: 'DNA' },
  { id: 'atom', icon: '⚛️', label: 'Atom' },
  { id: 'grad', icon: '🎓', label: 'Scholar' },
  { id: 'laptop', icon: '💻', label: 'Tech' },
  { id: 'rocket', icon: '🚀', label: 'Explorer' },
];

const CLASS_OPTIONS = [
  { id: 'F.Y. B.Tech (DBATU)', label: 'F.Y. B.Tech (First Year Engineering)' },
  { id: 'S.Y. B.Tech', label: 'S.Y. B.Tech (Second Year)' },
  { id: 'T.Y. B.Tech', label: 'T.Y. B.Tech (Third Year)' },
  { id: 'Final Year B.Tech', label: 'Final Year B.Tech' },
  { id: 'Class 12', label: 'Class 12 (Higher Secondary)' },
  { id: 'Class 11', label: 'Class 11 (Senior Secondary)' },
  { id: 'Class 10', label: 'Class 10 (Secondary)' },
  { id: 'Class 9', label: 'Class 9 (Foundational)' },
  { id: 'Other', label: 'Other College / University' },
];

const ENGINEERING_BRANCHES = [
  'Chemical Engineering',
  'Computer Science & Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics Engineering',
  'Information Technology',
  'Biotechnology',
  'Petrochemical Engineering',
  'General First Year Engineering',
];

const SCHOOL_STREAMS = [
  'Science (PCM - Physics, Chemistry, Math)',
  'Science (PCB - Physics, Chemistry, Biology)',
  'Science (PCMB)',
  'General Science',
];

export const StudentProfileSetupModal: React.FC<StudentProfileSetupModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialName,
  initialGrade,
  initialSchool,
}) => {
  const { user, updateUserProfile } = useAuth();

  // Form states
  const [selectedAvatar, setSelectedAvatar] = useState('🧪');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [grade, setGrade] = useState('F.Y. B.Tech (DBATU)');
  const [branch, setBranch] = useState('Chemical Engineering');
  const [school, setSchool] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Initialize from user or passed props
  useEffect(() => {
    if (user) {
      setName(user.name || initialName || '');
      // Suggest clean username from email or name
      const suggestedUser =
        user.username ||
        (user.email
          ? user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()
          : (user.name || 'student').toLowerCase().replace(/\s+/g, '_'));
      setUsername(suggestedUser);
      setSelectedAvatar(user.avatar && user.avatar.length <= 4 ? user.avatar : '🧪');
      if (user.avatar && user.avatar.startsWith('http')) {
        setCustomAvatarUrl(user.avatar);
        setUseCustomUrl(true);
      }
      setGrade(user.grade || initialGrade || 'F.Y. B.Tech (DBATU)');
      setBranch(user.branch || 'Chemical Engineering');
      setSchool(user.school || initialSchool || '');
      setRollNumber(user.rollNumber || '');
      setBio(user.bio || '');
    } else {
      if (initialName) setName(initialName);
      if (initialGrade) setGrade(initialGrade);
      if (initialSchool) setSchool(initialSchool);
    }
  }, [user, initialName, initialGrade, initialSchool]);

  if (!isOpen) return null;

  const isCollegeLevel = grade.includes('B.Tech') || grade === 'Other';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!username.trim()) {
      setError('Please choose a username.');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const isSafeAvatarUrl = (url: string) => /^https:\/\/[^\s/$.?#].[^\s]*$/i.test(url.trim());
      const finalAvatar = useCustomUrl && isSafeAvatarUrl(customAvatarUrl) ? customAvatarUrl.trim() : selectedAvatar;
      const cleanUsername = username.trim().replace(/^@/, '').toLowerCase();

      await updateUserProfile({
        name: name.trim(),
        username: cleanUsername,
        avatar: finalAvatar,
        grade,
        branch,
        school: school.trim(),
        rollNumber: rollNumber.trim(),
        bio: bio.trim(),
        profileCompleted: true,
      });

      if (onComplete) onComplete();
      onClose();
    } catch {
      setError('Could not save profile details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    onClose();
    if (onComplete) onComplete();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 11000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(8px)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 540,
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-overlay)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Top Header Banner */}
        <div
          style={{
            padding: '24px 28px 18px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(5, 150, 105, 0.08))',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #2563eb, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                color: '#fff',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              🎓
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Set Up Your Student Profile
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Personalize your virtual laboratory identity, curriculum, and branch.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '24px 28px' }}>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.25)',
                color: '#dc2626',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: 18,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* 1. Avatar Selector */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}
            >
              Choose Laboratory Avatar
            </label>

            {/* Avatar preview and choices */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 16,
                  background: 'var(--bg-secondary)',
                  border: '2px solid #2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.15)',
                }}
              >
                {useCustomUrl && customAvatarUrl.trim() ? (
                  <img
                    src={customAvatarUrl.trim()}
                    alt="Custom Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setUseCustomUrl(false)}
                  />
                ) : (
                  <span>{selectedAvatar}</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    title={av.label}
                    onClick={() => {
                      setSelectedAvatar(av.icon);
                      setUseCustomUrl(false);
                    }}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      background: !useCustomUrl && selectedAvatar === av.icon ? 'rgba(37, 99, 235, 0.15)' : 'var(--bg-secondary)',
                      border: !useCustomUrl && selectedAvatar === av.icon ? '1.5px solid #2563eb' : '1px solid var(--border)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {av.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image URL Option */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="text"
                placeholder="Or paste custom image URL (https://...)"
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value);
                  if (e.target.value.trim().startsWith('http')) {
                    setUseCustomUrl(true);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '0.76rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              {customAvatarUrl && (
                <button
                  type="button"
                  onClick={() => setUseCustomUrl(!useCustomUrl)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: useCustomUrl ? '#2563eb' : 'var(--bg-secondary)',
                    color: useCustomUrl ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {useCustomUrl ? 'Using Image' : 'Use Image'}
                </button>
              )}
            </div>
          </div>

          {/* 2. Full Name & Username */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!username) {
                    setUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_'));
                  }
                }}
                placeholder="e.g. Jayesh Koli"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '0.84rem',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                Username (@handle) *
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                  }}
                >
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/^@/, '').replace(/\s+/g, '_').toLowerCase())}
                  placeholder="jayesh_koli"
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 24px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3. Class/Year & Branch */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                Class or Academic Year *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {CLASS_OPTIONS.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                {isCollegeLevel ? 'Engineering Branch *' : 'Stream / Focus *'}
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {(isCollegeLevel ? ENGINEERING_BRANCHES : SCHOOL_STREAMS).map((br) => (
                  <option key={br} value={br}>
                    {br}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. School/College & Roll No */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                Institution / College Name
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. DBATU Lonere / KV IIT Powai"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                Roll No. / PRN
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 2026-CH-042"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* 5. Short Bio / Learning Goal */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}
            >
              Academic Bio or Learning Goal
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Preparing for DBATU Engineering Chemistry semester practicals and titration analysis."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <button
              type="button"
              onClick={handleSkip}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                padding: '10px 14px',
              }}
            >
              Skip for now
            </button>

            <button
              type="submit"
              disabled={isSaving}
              style={{
                all: 'unset',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                padding: '11px 24px',
                borderRadius: 10,
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.86rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {isSaving ? 'Saving Profile...' : 'Save & Enter Laboratory →'}
            </button>
          </div>

          {/* Accidental registration helper */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Accidentally registered with the wrong role or email?{' '}
            </span>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#dc2626',
                textDecoration: 'underline',
              }}
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onAccountDeleted={() => {
          setDeleteModalOpen(false);
          onClose();
        }}
      />
    </div>
  );
};
