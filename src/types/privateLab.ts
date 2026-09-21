/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Private Labs & Classroom Assessment Types
 * ═══════════════════════════════════════════════════════════════════
 */

export interface PrivateLabRestrictions {
  /** Hide step-by-step procedure in experiment runner (Exam / Assessment mode) */
  hideProcedure: boolean;
  /** Conceal worked calculation formulas and stoichiometry aids */
  hideFormulas: boolean;
  /** Optional time limit in minutes (0 or undefined = unlimited) */
  timeLimitMinutes?: number;
  /** Maximum attempts allowed per student (0 or undefined = unlimited, e.g. 1, 2) */
  maxAttempts?: number;
  /** Strict lab safety: immediate score penalty or hazard alert */
  strictSafety?: boolean;
  /** Hide observation tips and hints */
  hideHints?: boolean;
}

export interface PrivateLabEnrolledStudent {
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar?: string;
  joinedAt: string; // ISO string
}

export interface PrivateLabSubmission {
  id: string;
  labId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar?: string;
  experimentId: string;
  experimentTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  attemptNumber: number;
  completedAt: string; // ISO string
  timeSpentSeconds: number;
  mistakes: string[];
  calculationAnswers?: Record<string, number>;
  teacherFeedback?: string;
}

export interface PrivateLab {
  id: string;
  code: string; // e.g. "VV-7821" or "CHEM-9012"
  title: string;
  description?: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  institution?: string;
  department?: string;
  targetClass?: string; // e.g. "Class 11 - Batch A", "F.Y. B.Tech Chem 101"
  experimentIds: string[]; // IDs from getAllExperiments()
  restrictions: PrivateLabRestrictions;
  status: 'active' | 'closed';
  createdAt: string;
  dueDate?: string;
  enrolledStudents: PrivateLabEnrolledStudent[];
  submissions: PrivateLabSubmission[];
}

export interface PrivateLabContext {
  lab: PrivateLab;
  attemptNumber: number;
}
