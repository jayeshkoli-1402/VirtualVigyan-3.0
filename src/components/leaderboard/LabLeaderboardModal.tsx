import React from 'react';
import type { PrivateLab } from '../../types/privateLab';
import { LabLeaderboardView } from './LabLeaderboardView';

interface LabLeaderboardModalProps {
  isOpen: boolean;
  lab: PrivateLab | null;
  onClose: () => void;
  currentUserEmail?: string;
  currentUserRole?: string;
  isTeacherView?: boolean;
  onLaunchExperiment?: (expId: string) => void;
}

export const LabLeaderboardModal: React.FC<LabLeaderboardModalProps> = ({
  isOpen,
  lab,
  onClose,
  currentUserEmail,
  currentUserRole,
  isTeacherView = false,
  onLaunchExperiment,
}) => {
  if (!isOpen || !lab) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 11500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(8px)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 920,
          maxHeight: '92vh',
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1.5px solid var(--border)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
        }}
      >
        <LabLeaderboardView
          lab={lab}
          currentUserEmail={currentUserEmail}
          currentUserRole={currentUserRole}
          isTeacherView={isTeacherView}
          onLaunchExperiment={onLaunchExperiment}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
