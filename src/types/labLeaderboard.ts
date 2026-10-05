/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Lab-Specific Leaderboard Types
 * ═══════════════════════════════════════════════════════════════════
 */

export interface LabLeaderboardEntry {
  /** Rank in this specific lab (1, 2, 3... or null for incomplete/not started) */
  rank: number | null;
  /** Student identification */
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar?: string;
  /** Status in this assigned lab/experiment */
  status: 'completed' | 'in_progress' | 'not_started';
  /** Performance metrics */
  score: number | null;
  maxScore: number | null;
  percentage: number | null;
  /** Attempts */
  attemptNumber: number | null;
  totalAttempts: number;
  /** Time spent in seconds */
  timeSpentSeconds: number | null;
  /** Completion timestamp (ISO string) */
  completedAt: string | null;
  /** Mistakes summary for teacher review */
  mistakes?: string[];
  /** Associated experiment */
  experimentId?: string;
  experimentTitle?: string;
  /** Flag if this entry belongs to the logged-in student */
  isCurrentStudent?: boolean;
}

export interface LabLeaderboardSummary {
  labId: string;
  labCode: string;
  labTitle: string;
  targetClass?: string;
  teacherName: string;
  teacherEmail: string;
  dueDate?: string;
  totalEnrolled: number;
  totalCompleted: number;
  totalInProgress: number;
  totalNotStarted: number;
  averageScore: number;
  highestScore: number;
  selectedExperimentId?: string;
  assignedExperimentIds: string[];
  entries: LabLeaderboardEntry[];
  currentStudentEntry?: LabLeaderboardEntry | null;
}
