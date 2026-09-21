/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Private Lab & Classroom Assessment Service
 * ═══════════════════════════════════════════════════════════════════
 */

import type {
  PrivateLab,
  PrivateLabSubmission,
  PrivateLabEnrolledStudent,
} from '../types/privateLab';
import { recordStudentPerformance } from './studentHistoryService';
import {
  savePrivateLabToFirestore,
  getPrivateLabFromFirestoreByCode,
  getAllPrivateLabsFromFirestore,
  enrollStudentInFirestoreLab,
  deletePrivateLabFromFirestore,
} from '../firebase/firestoreService';

const STORAGE_KEY = 'vv_private_labs';

// Cross-tab broadcast & storage sync listener
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        window.dispatchEvent(new CustomEvent('vv_privatelabs_updated', { detail: parsed }));
      } catch {}
    }
  });
}

// Sample pre-seeded demo private lab for immediate exploration
const PRESEEDED_LABS: PrivateLab[] = [
  {
    id: 'lab_seed_chem101',
    code: 'CHEM-101',
    title: 'Mid-Term Volumetric & Gas Assessment',
    description: 'Complete the determination of water acidity and zinc-acid reaction under exam assessment conditions.',
    teacherId: 'usr_teacher_01',
    teacherName: 'Prof. Rajesh Sharma',
    teacherEmail: 'teacher@virtualvigyan.in',
    institution: 'DBATU Lonere / Kendriya Vidyalaya',
    department: 'Department of Chemistry',
    targetClass: 'Class 11 - Science (Batch A)',
    experimentIds: ['titration-water-acidity', 'zinc-acid-reaction'],
    restrictions: {
      hideProcedure: true,
      hideFormulas: true,
      timeLimitMinutes: 30,
      maxAttempts: 2,
      strictSafety: true,
      hideHints: true,
    },
    status: 'active',
    createdAt: '2026-03-01T10:00:00.000Z',
    dueDate: '2026-04-15',
    enrolledStudents: [
      {
        studentId: 'usr_student_01',
        studentName: 'Aarav Patel',
        studentEmail: 'student@virtualvigyan.in',
        avatar: '🎓',
        joinedAt: '2026-03-02T11:20:00.000Z',
      },
      {
        studentId: 'usr_student_02',
        studentName: 'Priya Deshmukh',
        studentEmail: 'priya.deshmukh@school.edu',
        avatar: '👩‍🎓',
        joinedAt: '2026-03-03T14:15:00.000Z',
      },
    ],
    submissions: [
      {
        id: 'sub_seed_01',
        labId: 'lab_seed_chem101',
        studentId: 'usr_student_01',
        studentName: 'Aarav Patel',
        studentEmail: 'student@virtualvigyan.in',
        avatar: '🎓',
        experimentId: 'titration-water-acidity',
        experimentTitle: 'Acidity of Water Sample (Titration with NaOH)',
        score: 95,
        maxScore: 100,
        percentage: 95,
        attemptNumber: 1,
        completedAt: '2026-03-05T15:30:00.000Z',
        timeSpentSeconds: 742,
        mistakes: ['Minor burette meniscus parallax error'],
      },
      {
        id: 'sub_seed_02',
        labId: 'lab_seed_chem101',
        studentId: 'usr_student_02',
        studentName: 'Priya Deshmukh',
        studentEmail: 'priya.deshmukh@school.edu',
        avatar: '👩‍🎓',
        experimentId: 'titration-water-acidity',
        experimentTitle: 'Acidity of Water Sample (Titration with NaOH)',
        score: 88,
        maxScore: 100,
        percentage: 88,
        attemptNumber: 1,
        completedAt: '2026-03-06T12:10:00.000Z',
        timeSpentSeconds: 890,
        mistakes: ['Titrant added slightly too quickly near endpoint'],
      },
    ],
  },
];

/**
 * Retrieve all private labs from storage
 */
export function getAllPrivateLabs(): PrivateLab[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRESEEDED_LABS));
      return PRESEEDED_LABS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : PRESEEDED_LABS;
  } catch (err) {
    console.warn('[PrivateLab] Failed to load private labs from localStorage:', err);
    return PRESEEDED_LABS;
  }
}

/**
 * Sync private labs with Firestore cloud database
 */
export async function syncPrivateLabsWithCloud(): Promise<PrivateLab[]> {
  try {
    const remoteLabs = await getAllPrivateLabsFromFirestore();
    if (remoteLabs && remoteLabs.length > 0) {
      const localLabs = getAllPrivateLabs();
      const map = new Map<string, PrivateLab>();
      // Preserve local labs
      localLabs.forEach((l) => map.set(l.id, l));
      // Merge cloud labs
      remoteLabs.forEach((rl) => {
        const existing = map.get(rl.id);
        if (existing) {
          // Merge enrolled students and submissions
          const enrolledMap = new Map<string, PrivateLabEnrolledStudent>();
          (existing.enrolledStudents || []).forEach((s) => enrolledMap.set(s.studentEmail.toLowerCase(), s));
          (rl.enrolledStudents || []).forEach((s) => enrolledMap.set(s.studentEmail.toLowerCase(), s));

          map.set(rl.id, {
            ...rl,
            ...existing,
            enrolledStudents: Array.from(enrolledMap.values()),
          });
        } else {
          map.set(rl.id, rl);
        }
      });
      const merged = Array.from(map.values());
      savePrivateLabs(merged);
      return merged;
    }
  } catch (e) {
    console.warn('[PrivateLab] Cloud sync warning:', e);
  }
  return getAllPrivateLabs();
}

/**
 * Persist private labs list to storage and broadcast update
 */
export function savePrivateLabs(labs: PrivateLab[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(labs));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vv_privatelabs_updated', { detail: labs }));
    }
  } catch (err) {
    console.error('[PrivateLab] Failed to save private labs to localStorage:', err);
  }
}

/**
 * Flexible lab code matcher (handles casing, hyphens, spaces, and numeric suffixes)
 */
export function matchLabCode(enteredCode: string, labCode: string): boolean {
  if (!enteredCode || !labCode) return false;
  const c1 = enteredCode.trim().toUpperCase();
  const c2 = labCode.trim().toUpperCase();
  if (c1 === c2) return true;

  const a1 = c1.replace(/[^A-Z0-9]/g, '');
  const a2 = c2.replace(/[^A-Z0-9]/g, '');
  if (a1 === a2) return true;

  // If user entered only the number part e.g. "2394" matching "CHEM-2394"
  if (a1.length >= 4 && (a2.endsWith(a1) || a1.endsWith(a2))) return true;

  return false;
}

/**
 * Generate a random, human-friendly 6-to-7 char lab join code
 */
export function generateLabCode(prefix = 'CHEM'): string {
  const existingLabs = getAllPrivateLabs();
  const existingCodes = new Set(existingLabs.map((l) => l.code.toUpperCase()));

  for (let i = 0; i < 50; i++) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `${prefix}-${randomNum}`;
    if (!existingCodes.has(code)) {
      return code;
    }
  }

  return `${prefix}-${Date.now().toString().slice(-4)}`;
}

/**
 * Create a new private lab (persists locally and to Firestore cloud)
 */
export function createPrivateLab(
  params: Omit<PrivateLab, 'id' | 'code' | 'createdAt' | 'enrolledStudents' | 'submissions'> & {
    customCode?: string;
  }
): PrivateLab {
  const labs = getAllPrivateLabs();
  const id = `lab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const code = (params.customCode?.trim().toUpperCase() || generateLabCode()).replace(/\s+/g, '-');

  const newLab: PrivateLab = {
    ...params,
    id,
    code,
    status: params.status || 'active',
    createdAt: new Date().toISOString(),
    enrolledStudents: [],
    submissions: [],
  };

  labs.unshift(newLab);
  savePrivateLabs(labs);

  // Synchronize with Firestore cloud
  savePrivateLabToFirestore(newLab).catch((err) => {
    console.warn('[PrivateLab] Cloud save notice:', err);
  });

  return newLab;
}

/**
 * Find a private lab by its unique join code (case-insensitive & tolerant)
 */
export function getPrivateLabByCode(code: string): PrivateLab | null {
  if (!code) return null;
  const labs = getAllPrivateLabs();
  return labs.find((l) => matchLabCode(code, l.code)) || null;
}

/**
 * Find a private lab by code, checking local cache then Firestore cloud
 */
export async function getPrivateLabByCodeAsync(code: string): Promise<PrivateLab | null> {
  if (!code) return null;
  // 1. Check local storage first
  const local = getPrivateLabByCode(code);
  if (local) return local;

  // 2. Query Firestore cloud
  try {
    const remoteLab = await getPrivateLabFromFirestoreByCode(code);
    if (remoteLab) {
      const labs = getAllPrivateLabs();
      if (!labs.some((l) => l.id === remoteLab.id)) {
        labs.unshift(remoteLab);
        savePrivateLabs(labs);
      }
      return remoteLab;
    }
  } catch (err) {
    console.warn('[PrivateLab] Cloud lookup failed:', err);
  }

  return null;
}

/**
 * Find a private lab by ID
 */
export function getPrivateLabById(id: string): PrivateLab | null {
  const labs = getAllPrivateLabs();
  return labs.find((l) => l.id === id) || null;
}

/**
 * Get private labs owned/created by a teacher
 */
export function getPrivateLabsByTeacher(teacherEmail: string): PrivateLab[] {
  if (!teacherEmail) return [];
  const norm = teacherEmail.trim().toLowerCase();
  const labs = getAllPrivateLabs();
  return labs.filter(
    (l) =>
      l.teacherEmail?.toLowerCase() === norm ||
      (norm.includes('admin') && l.teacherEmail?.includes('admin'))
  );
}

/**
 * Get private labs that a student is currently enrolled in
 */
export function getEnrolledLabsForStudent(studentEmail: string): PrivateLab[] {
  if (!studentEmail) return [];
  const norm = studentEmail.trim().toLowerCase();
  const labs = getAllPrivateLabs();
  return labs.filter((l) =>
    (l.enrolledStudents || []).some((st) => st.studentEmail?.toLowerCase() === norm)
  );
}

/**
 * Student joins a private lab via join code (synchronous local version)
 */
export function joinPrivateLab(
  code: string,
  student: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    avatar?: string;
  }
): { success: boolean; lab?: PrivateLab; message: string; alreadyEnrolled?: boolean } {
  const lab = getPrivateLabByCode(code);
  if (!lab) {
    return {
      success: false,
      message: `Invalid join code "${code}". Please check with your teacher.`,
    };
  }

  if (lab.status === 'closed') {
    return {
      success: false,
      message: `This private lab (${lab.title}) is currently closed for new enrollments.`,
    };
  }

  const studentEmailNorm = student.studentEmail.trim().toLowerCase();
  const alreadyEnrolled = (lab.enrolledStudents || []).some(
    (st) => st.studentEmail?.toLowerCase() === studentEmailNorm
  );

  if (alreadyEnrolled) {
    return {
      success: false,
      alreadyEnrolled: true,
      lab,
      message: `You are already enrolled in "${lab.title}". Duplicate enrollments are prohibited.`,
    };
  }

  const newEnrollment: PrivateLabEnrolledStudent = {
    studentId: student.studentId,
    studentName: student.studentName || 'Student',
    studentEmail: studentEmailNorm,
    avatar: student.avatar || '🎓',
    joinedAt: new Date().toISOString(),
  };

  const labs = getAllPrivateLabs();
  const updatedLabs = labs.map((l) => {
    if (l.id === lab.id) {
      return {
        ...l,
        enrolledStudents: [...(l.enrolledStudents || []), newEnrollment],
      };
    }
    return l;
  });

  savePrivateLabs(updatedLabs);

  enrollStudentInFirestoreLab(lab.id, newEnrollment).catch((e) => {
    console.warn('[PrivateLab] Cloud enrollment sync warning:', e);
  });

  const updatedLab = updatedLabs.find((l) => l.id === lab.id);
  return {
    success: true,
    lab: updatedLab,
    message: `Successfully enrolled in "${lab.title}"!`,
  };
}

/**
 * Student joins a private lab via join code (asynchronous with cloud fallback)
 */
export async function joinPrivateLabAsync(
  code: string,
  student: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    avatar?: string;
  }
): Promise<{ success: boolean; lab?: PrivateLab; message: string; alreadyEnrolled?: boolean }> {
  // Check local first, then cloud
  const lab = await getPrivateLabByCodeAsync(code);
  if (!lab) {
    return {
      success: false,
      message: `Invalid join code "${code}". Please check with your teacher.`,
    };
  }

  if (lab.status === 'closed') {
    return {
      success: false,
      message: `This private lab (${lab.title}) is currently closed for new enrollments.`,
    };
  }

  const studentEmailNorm = student.studentEmail.trim().toLowerCase();
  const alreadyEnrolled = (lab.enrolledStudents || []).some(
    (st) => st.studentEmail?.toLowerCase() === studentEmailNorm
  );

  if (alreadyEnrolled) {
    return {
      success: false,
      alreadyEnrolled: true,
      lab,
      message: `You are already enrolled in "${lab.title}". Duplicate enrollments are prohibited.`,
    };
  }

  const newEnrollment: PrivateLabEnrolledStudent = {
    studentId: student.studentId,
    studentName: student.studentName || 'Student',
    studentEmail: studentEmailNorm,
    avatar: student.avatar || '🎓',
    joinedAt: new Date().toISOString(),
  };

  const labs = getAllPrivateLabs();
  let updatedLab: PrivateLab | undefined;
  const updatedLabs = labs.map((l) => {
    if (l.id === lab.id) {
      updatedLab = {
        ...l,
        enrolledStudents: [...(l.enrolledStudents || []), newEnrollment],
      };
      return updatedLab;
    }
    return l;
  });

  if (!updatedLab) {
    updatedLab = {
      ...lab,
      enrolledStudents: [...(lab.enrolledStudents || []), newEnrollment],
    };
    updatedLabs.unshift(updatedLab);
  }

  savePrivateLabs(updatedLabs);

  enrollStudentInFirestoreLab(lab.id, newEnrollment).catch((e) => {
    console.warn('[PrivateLab] Cloud enrollment sync warning:', e);
  });

  return {
    success: true,
    lab: updatedLab,
    message: `Successfully enrolled in "${lab.title}"!`,
  };
}

/**
 * Record a student's experiment completion within a private lab
 */
export function recordPrivateLabSubmission(
  submissionData: Omit<PrivateLabSubmission, 'id' | 'completedAt' | 'percentage'>
): PrivateLabSubmission | null {
  const labs = getAllPrivateLabs();
  const lab = labs.find((l) => l.id === submissionData.labId);
  if (!lab) return null;

  const percentage = Math.round(
    (submissionData.score / (submissionData.maxScore || 100)) * 100
  );

  const submission: PrivateLabSubmission = {
    ...submissionData,
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    percentage,
    completedAt: new Date().toISOString(),
  };

  const updatedLabs = labs.map((l) => {
    if (l.id === submissionData.labId) {
      return {
        ...l,
        submissions: [...l.submissions, submission],
      };
    }
    return l;
  });

  savePrivateLabs(updatedLabs);

  // Synchronously record to unified student history
  try {
    recordStudentPerformance({
      studentId: submission.studentId,
      studentName: submission.studentName,
      studentEmail: submission.studentEmail,
      avatar: submission.avatar,
      experimentId: submission.experimentId,
      experimentTitle: submission.experimentTitle,
      type: 'private_lab',
      labId: lab.id,
      labTitle: lab.title,
      labCode: lab.code,
      score: submission.score,
      maxScore: submission.maxScore,
      attemptNumber: submission.attemptNumber,
      timeSpentSeconds: submission.timeSpentSeconds,
      mistakes: submission.mistakes,
      calculationAnswers: submission.calculationAnswers,
    });
  } catch (err) {
    console.error('[PrivateLab] Failed to record student history:', err);
  }

  return submission;
}

/**
 * Update teacher feedback notes on a student submission
 */
export function updateSubmissionFeedback(
  labId: string,
  submissionId: string,
  feedback: string
): boolean {
  const labs = getAllPrivateLabs();
  let found = false;
  const updatedLabs = labs.map((l) => {
    if (l.id === labId) {
      const updatedSubs = l.submissions.map((s) => {
        if (s.id === submissionId) {
          found = true;
          return { ...s, teacherFeedback: feedback };
        }
        return s;
      });
      return { ...l, submissions: updatedSubs };
    }
    return l;
  });

  if (found) {
    savePrivateLabs(updatedLabs);
  }
  return found;
}

/**
 * Count how many attempts a student has submitted for a given experiment in a private lab
 */
export function getStudentAttemptsCount(
  labId: string,
  studentEmail: string,
  experimentId: string
): number {
  const lab = getPrivateLabById(labId);
  if (!lab) return 0;
  const norm = studentEmail.trim().toLowerCase();
  return lab.submissions.filter(
    (s) => s.studentEmail?.toLowerCase() === norm && s.experimentId === experimentId
  ).length;
}

/**
 * Toggle a private lab's active/closed status
 */
export function toggleLabStatus(labId: string): boolean {
  const labs = getAllPrivateLabs();
  let nextStatus: 'active' | 'closed' = 'active';
  const updatedLabs = labs.map((l) => {
    if (l.id === labId) {
      nextStatus = l.status === 'active' ? 'closed' : 'active';
      return { ...l, status: nextStatus };
    }
    return l;
  });
  savePrivateLabs(updatedLabs);
  return nextStatus === 'active';
}

/**
 * Delete a private lab
 */
export function deletePrivateLab(labId: string): boolean {
  const labs = getAllPrivateLabs();
  const filtered = labs.filter((l) => l.id !== labId);
  if (filtered.length !== labs.length) {
    savePrivateLabs(filtered);
    deletePrivateLabFromFirestore(labId).catch((err) => {
      console.warn('[PrivateLab] Cloud delete error:', err);
    });
    return true;
  }
  return false;
}

/**
 * Export a lab's gradebook roster and submissions as a clean CSV file
 */
export function exportGradebookCSV(labId: string): void {
  const lab = getPrivateLabById(labId);
  if (!lab) return;

  const headers = [
    'Student Name',
    'Student Email',
    'Date Joined',
    'Experiment Title',
    'Score',
    'Max Score',
    'Percentage (%)',
    'Attempt Number',
    'Time Spent (s)',
    'Submission Date',
    'Mistakes Logged',
  ];

  const rows: string[][] = [];

  if (lab.submissions.length === 0) {
    // If no submissions yet, export enrolled roster
    lab.enrolledStudents.forEach((st) => {
      rows.push([
        `"${st.studentName}"`,
        `"${st.studentEmail}"`,
        `"${new Date(st.joinedAt).toLocaleDateString()}"`,
        '"Not Attempted"',
        '0',
        '100',
        '0',
        '0',
        '0',
        '"N/A"',
        '"None"',
      ]);
    });
  } else {
    lab.submissions.forEach((sub) => {
      const student = lab.enrolledStudents.find(
        (e) => e.studentEmail?.toLowerCase() === sub.studentEmail?.toLowerCase()
      );
      rows.push([
        `"${sub.studentName}"`,
        `"${sub.studentEmail}"`,
        student ? `"${new Date(student.joinedAt).toLocaleDateString()}"` : '"N/A"',
        `"${sub.experimentTitle}"`,
        sub.score.toString(),
        sub.maxScore.toString(),
        sub.percentage.toString(),
        sub.attemptNumber.toString(),
        sub.timeSpentSeconds.toString(),
        `"${new Date(sub.completedAt).toLocaleString()}"`,
        `"${sub.mistakes.join('; ')}"`,
      ]);
    });
  }

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `VirtualVigyan_Gradebook_${lab.code}_${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
