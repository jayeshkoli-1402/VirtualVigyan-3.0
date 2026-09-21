/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Unified Student Experiment History Service
 *  Tracks performances both inside private labs and free practice.
 * ═══════════════════════════════════════════════════════════════════
 */

export interface StudentPerformanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar?: string;
  experimentId: string;
  experimentTitle: string;
  /** Activity context: whether completed as a private classroom assessment or open practice */
  type: 'private_lab' | 'practice';
  labId?: string;
  labTitle?: string;
  labCode?: string;
  score: number;
  maxScore: number;
  percentage: number;
  attemptNumber: number;
  timeSpentSeconds: number;
  mistakes: string[];
  calculationAnswers?: Record<string, number>;
  completedAt: string; // ISO string
}

const STORAGE_KEY = 'vv_student_performance_history';

// ── Seed history for demonstration and new users ──
const SEED_HISTORY: StudentPerformanceRecord[] = [
  {
    id: 'hist_seed_01',
    studentId: 'usr_student_01',
    studentName: 'Aarav Patel',
    studentEmail: 'student@virtualvigyan.in',
    avatar: '🎓',
    experimentId: 'viscosity-ostwald',
    experimentTitle: "Determination of Viscosity by Ostwald's Viscometer",
    type: 'private_lab',
    labId: 'lab_seed_chem101',
    labTitle: 'F.Y. B.Tech Engineering Chemistry Assessment',
    labCode: 'CHEM-101',
    score: 95,
    maxScore: 100,
    percentage: 95,
    attemptNumber: 1,
    timeSpentSeconds: 780,
    mistakes: ['Slight parallax angle when observing lower fiducial mark'],
    calculationAnswers: { viscosity: 1.002, density: 0.998 },
    completedAt: '2026-03-05T14:20:00.000Z',
  },
  {
    id: 'hist_seed_02',
    studentId: 'usr_student_01',
    studentName: 'Aarav Patel',
    studentEmail: 'student@virtualvigyan.in',
    avatar: '🎓',
    experimentId: 'titration-water-acidity',
    experimentTitle: 'Acidity of Water Sample (Volumetric Titration)',
    type: 'practice',
    score: 92,
    maxScore: 100,
    percentage: 92,
    attemptNumber: 1,
    timeSpentSeconds: 640,
    mistakes: ['Titrated 0.2 mL past pale-pink equivalence point'],
    calculationAnswers: { totalAcidity: 48.5 },
    completedAt: '2026-03-03T11:45:00.000Z',
  },
  {
    id: 'hist_seed_03',
    studentId: 'usr_student_01',
    studentName: 'Aarav Patel',
    studentEmail: 'student@virtualvigyan.in',
    avatar: '🎓',
    experimentId: 'conductometric-titration',
    experimentTitle: 'Conductometric Titration (Strong Acid vs Strong Base)',
    type: 'practice',
    score: 88,
    maxScore: 100,
    percentage: 88,
    attemptNumber: 2,
    timeSpentSeconds: 910,
    mistakes: ['Did not swirl beaker thoroughly after initial 2.0 mL addition'],
    calculationAnswers: { equivalenceVolume: 10.4 },
    completedAt: '2026-02-27T16:10:00.000Z',
  },
  {
    id: 'hist_seed_04',
    studentId: 'usr_student_01',
    studentName: 'Aarav Patel',
    studentEmail: 'student@virtualvigyan.in',
    avatar: '🎓',
    experimentId: 'water-hardness-edta',
    experimentTitle: 'Hardness of Water Sample by EDTA Complexometric Titration',
    type: 'practice',
    score: 85,
    maxScore: 100,
    percentage: 85,
    attemptNumber: 1,
    timeSpentSeconds: 720,
    mistakes: ['Buffer solution added slightly late during sample preparation'],
    calculationAnswers: { totalHardness: 240 },
    completedAt: '2026-02-20T10:30:00.000Z',
  },
];

/**
 * Initialize storage with default history if empty
 */
function initStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_HISTORY));
    }
  } catch {
    // ignore
  }
}

/**
 * Get all performance records from storage
 */
export function getAllPerformanceRecords(): StudentPerformanceRecord[] {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SEED_HISTORY;
  } catch {
    return SEED_HISTORY;
  }
}

/**
 * Persist records to storage and broadcast update event
 */
function saveRecords(records: StudentPerformanceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vv_student_history_updated', { detail: records }));
    }
  } catch (err) {
    console.error('[StudentHistory] Failed to save records:', err);
  }
}

/**
 * Record a student's performance (works for both private lab assessments and open practice)
 */
export function recordStudentPerformance(
  entry: Omit<StudentPerformanceRecord, 'id' | 'completedAt' | 'percentage'>
): StudentPerformanceRecord {
  const records = getAllPerformanceRecords();
  const percentage = Math.round((entry.score / (entry.maxScore || 100)) * 100);

  const newRecord: StudentPerformanceRecord = {
    ...entry,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    percentage,
    completedAt: new Date().toISOString(),
  };

  records.unshift(newRecord);
  saveRecords(records);
  return newRecord;
}

/**
 * Get all performance records for a specific student (or all if email not provided)
 * Sorted newest to oldest.
 */
export function getStudentHistory(studentEmail?: string): StudentPerformanceRecord[] {
  const all = getAllPerformanceRecords();
  if (!studentEmail) return all;
  const norm = studentEmail.trim().toLowerCase();
  return all
    .filter((r) => r.studentEmail?.toLowerCase() === norm)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
}

/**
 * Compute aggregate performance statistics for a student
 */
export function getStudentOverallStats(studentEmail?: string): {
  totalCompleted: number;
  avgScore: number;
  totalTimeMinutes: number;
  privateLabCount: number;
  practiceCount: number;
  distinctExperimentsCount: number;
} {
  const history = getStudentHistory(studentEmail);
  if (history.length === 0) {
    return {
      totalCompleted: 0,
      avgScore: 0,
      totalTimeMinutes: 0,
      privateLabCount: 0,
      practiceCount: 0,
      distinctExperimentsCount: 0,
    };
  }

  const totalScore = history.reduce((acc, h) => acc + h.score, 0);
  const totalSeconds = history.reduce((acc, h) => acc + (h.timeSpentSeconds || 0), 0);
  const privateLabs = history.filter((h) => h.type === 'private_lab').length;
  const practice = history.filter((h) => h.type === 'practice').length;
  const distinct = new Set(history.map((h) => h.experimentId)).size;

  return {
    totalCompleted: history.length,
    avgScore: Math.round(totalScore / history.length),
    totalTimeMinutes: Math.round(totalSeconds / 60),
    privateLabCount: privateLabs,
    practiceCount: practice,
    distinctExperimentsCount: distinct,
  };
}
