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
  addSubmissionToFirestoreLab,
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

// Pre-seeded pilot trial lab and demo private labs
const PILOT_STUDENTS: PrivateLabEnrolledStudent[] = [
  { studentId: 'stu_01', studentName: 'Kirti Mukesh Chaudhari', studentEmail: 'kirtichaudhari1506@gmail.com', avatar: '👩‍🎓', joinedAt: '2026-10-01T09:15:00.000Z' },
  { studentId: 'stu_02', studentName: 'Diptanshu Sunil Bagul', studentEmail: 'diptanshusb@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:16:00.000Z' },
  { studentId: 'stu_03', studentName: 'Ghanshyam Mali', studentEmail: 'ghanshyam2323@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:17:00.000Z' },
  { studentId: 'stu_04', studentName: 'Rohan Verma', studentEmail: 'roshan1234@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:18:00.000Z' },
  { studentId: 'stu_05', studentName: 'Ruchita Borse', studentEmail: 'ruchitaborse676@gmail.com', avatar: '👩‍🎓', joinedAt: '2026-10-01T09:19:00.000Z' },
  { studentId: 'stu_06', studentName: 'Alice Smith', studentEmail: 'yamela1652@hudzer.com', avatar: '👩‍🎓', joinedAt: '2026-10-01T09:20:00.000Z' },
  { studentId: 'stu_07', studentName: 'Aishwarya Patil', studentEmail: 'aishwarya2006patil@gmail.com', avatar: '👩‍🎓', joinedAt: '2026-10-01T09:21:00.000Z' },
  { studentId: 'stu_08', studentName: 'Soham Pradip Chikorde', studentEmail: 'master.sohamchikorde2006@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:22:00.000Z' },
  { studentId: 'stu_09', studentName: 'Kalyani Chaudhari', studentEmail: 'ckalyani721@gmail.com', avatar: '👩‍🎓', joinedAt: '2026-10-01T09:23:00.000Z' },
  { studentId: 'stu_10', studentName: 'Shreyash Bhat', studentEmail: 'shreyashbhat1111@gmai.lcom', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:24:00.000Z' },
  { studentId: 'stu_11', studentName: 'Chavan Pratik Dipak', studentEmail: 'pratikch3518@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:25:00.000Z' },
  { studentId: 'stu_12', studentName: 'Tejal Bhadane', studentEmail: 'pankaj28.com@gmail.com', avatar: '👩‍🎓', joinedAt: '2026-10-01T09:26:00.000Z' },
  { studentId: 'stu_13', studentName: 'Yashodeep Anilsing Girase', studentEmail: 'yashgirase101@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:27:00.000Z' },
  { studentId: 'stu_14', studentName: 'Bharati Badgujar', studentEmail: 'bharatibadgujar743@gmail.com', avatar: '👩‍🎓', joinedAt: '2026-10-01T09:28:00.000Z' },
  { studentId: 'stu_15', studentName: 'Piyush Rakesh Borse', studentEmail: 'borsepiyush389@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:29:00.000Z' },
  { studentId: 'stu_16', studentName: 'Dipali Ishi', studentEmail: 'abc@gmail.com', avatar: '👩‍🎓', joinedAt: '2026-10-01T09:30:00.000Z' },
  { studentId: 'stu_17', studentName: 'Patil Siddhi Jitendra', studentEmail: 'siddhipatil911@gmail.com', avatar: '👩‍🎓', joinedAt: '2026-10-01T09:31:00.000Z' },
  { studentId: 'stu_18', studentName: 'Kunal Chaudhari', studentEmail: 'kunalchaudhari919@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:32:00.000Z' },
  { studentId: 'stu_19', studentName: 'Pavan Wadile', studentEmail: 'pavanwadile777@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:33:00.000Z' },
  { studentId: 'stu_20', studentName: 'Raj Borase', studentEmail: 'borase.raj11@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:34:00.000Z' },
  { studentId: 'stu_21', studentName: 'Mohit Chaudhari', studentEmail: 'rajmali@gmail.com', avatar: '👨‍🎓', joinedAt: '2026-10-01T09:35:00.000Z' },
  { studentId: 'stu_22', studentName: 'Sanskruti Yogesh Bhalerao', studentEmail: 'sanskrutibhalerao44@gmail.com', avatar: '👩‍🎓', joinedAt: '2026-10-01T09:36:00.000Z' },
];

const PILOT_SUBMISSIONS: PrivateLabSubmission[] = [
  { id: 'sub_p01', labId: 'lab_seed_chem101', studentId: 'stu_01', studentName: 'Kirti Mukesh Chaudhari', studentEmail: 'kirtichaudhari1506@gmail.com', avatar: '👩‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 92, maxScore: 100, percentage: 92, attemptNumber: 1, completedAt: '2026-10-01T11:15:32.000Z', timeSpentSeconds: 540, mistakes: ['None — accurate endpoint & stoichiometry'] },
  { id: 'sub_p02', labId: 'lab_seed_chem101', studentId: 'stu_02', studentName: 'Diptanshu Sunil Bagul', studentEmail: 'diptanshusb@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 88, maxScore: 100, percentage: 88, attemptNumber: 1, completedAt: '2026-10-01T11:22:10.000Z', timeSpentSeconds: 620, mistakes: ['Slight overshoot near endpoint (25.8 mL)'] },
  { id: 'sub_p03', labId: 'lab_seed_chem101', studentId: 'stu_03', studentName: 'Ghanshyam Mali', studentEmail: 'ghanshyam2323@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 95, maxScore: 100, percentage: 95, attemptNumber: 1, completedAt: '2026-10-01T11:34:45.000Z', timeSpentSeconds: 480, mistakes: ['Calculated molarity within 1.2% tolerance'] },
  { id: 'sub_p04', labId: 'lab_seed_chem101', studentId: 'stu_04', studentName: 'Rohan Verma', studentEmail: 'roshan1234@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 82, maxScore: 100, percentage: 82, attemptNumber: 1, completedAt: '2026-10-01T11:45:18.000Z', timeSpentSeconds: 710, mistakes: ['Rapid titrant dispensing initially; corrected dropwise'] },
  { id: 'sub_p05', labId: 'lab_seed_chem101', studentId: 'stu_05', studentName: 'Ruchita Borse', studentEmail: 'ruchitaborse676@gmail.com', avatar: '👩‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 90, maxScore: 100, percentage: 90, attemptNumber: 1, completedAt: '2026-10-01T11:52:04.000Z', timeSpentSeconds: 560, mistakes: ['Minor meniscus parallax reading discrepancy'] },
  { id: 'sub_p06', labId: 'lab_seed_chem101', studentId: 'stu_06', studentName: 'Alice Smith', studentEmail: 'yamela1652@hudzer.com', avatar: '👩‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 85, maxScore: 100, percentage: 85, attemptNumber: 1, completedAt: '2026-10-01T12:01:29.000Z', timeSpentSeconds: 630, mistakes: ['Added indicator after partial titration began'] },
  { id: 'sub_p07', labId: 'lab_seed_chem101', studentId: 'stu_07', studentName: 'Aishwarya Patil', studentEmail: 'aishwarya2006patil@gmail.com', avatar: '👩‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 94, maxScore: 100, percentage: 94, attemptNumber: 1, completedAt: '2026-10-01T12:08:50.000Z', timeSpentSeconds: 510, mistakes: ['None — clean sharp faint-pink endpoint'] },
  { id: 'sub_p08', labId: 'lab_seed_chem101', studentId: 'stu_08', studentName: 'Soham Pradip Chikorde', studentEmail: 'master.sohamchikorde2006@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 89, maxScore: 100, percentage: 89, attemptNumber: 1, completedAt: '2026-10-01T12:15:33.000Z', timeSpentSeconds: 580, mistakes: ['Titrated slightly past pale pink to deep magenta'] },
  { id: 'sub_p09', labId: 'lab_seed_chem101', studentId: 'stu_09', studentName: 'Kalyani Chaudhari', studentEmail: 'ckalyani721@gmail.com', avatar: '👩‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 91, maxScore: 100, percentage: 91, attemptNumber: 1, completedAt: '2026-10-01T12:22:15.000Z', timeSpentSeconds: 525, mistakes: ['Flask swirling paused during reagent addition'] },
  { id: 'sub_p10', labId: 'lab_seed_chem101', studentId: 'stu_10', studentName: 'Shreyash Bhat', studentEmail: 'shreyashbhat1111@gmai.lcom', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 78, maxScore: 100, percentage: 78, attemptNumber: 2, completedAt: '2026-10-01T12:31:02.000Z', timeSpentSeconds: 760, mistakes: ['Endpoint overshot on 1st attempt (28.4 mL); improved on retry (25.4 mL)'] },
  { id: 'sub_p11', labId: 'lab_seed_chem101', studentId: 'stu_11', studentName: 'Chavan Pratik Dipak', studentEmail: 'pratikch3518@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 87, maxScore: 100, percentage: 87, attemptNumber: 1, completedAt: '2026-10-01T12:38:40.000Z', timeSpentSeconds: 640, mistakes: ['Burette air bubble trapped near tip initially'] },
  { id: 'sub_p12', labId: 'lab_seed_chem101', studentId: 'stu_12', studentName: 'Tejal Bhadane', studentEmail: 'pankaj28.com@gmail.com', avatar: '👩‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 93, maxScore: 100, percentage: 93, attemptNumber: 1, completedAt: '2026-10-01T12:44:12.000Z', timeSpentSeconds: 495, mistakes: ['None — excellent stoichiometric calculation'] },
  { id: 'sub_p13', labId: 'lab_seed_chem101', studentId: 'stu_13', studentName: 'Yashodeep Anilsing Girase', studentEmail: 'yashgirase101@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 96, maxScore: 100, percentage: 96, attemptNumber: 1, completedAt: '2026-10-01T12:49:55.000Z', timeSpentSeconds: 450, mistakes: ['None — perfect concordant titer value'] },
  { id: 'sub_p14', labId: 'lab_seed_chem101', studentId: 'stu_14', studentName: 'Bharati Badgujar', studentEmail: 'bharatibadgujar743@gmail.com', avatar: '👩‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 86, maxScore: 100, percentage: 86, attemptNumber: 1, completedAt: '2026-10-01T12:55:20.000Z', timeSpentSeconds: 615, mistakes: ['Overfilled burette past 0.00 mL mark before zeroing'] },
  { id: 'sub_p15', labId: 'lab_seed_chem101', studentId: 'stu_15', studentName: 'Piyush Rakesh Borse', studentEmail: 'borsepiyush389@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 84, maxScore: 100, percentage: 84, attemptNumber: 1, completedAt: '2026-10-01T13:02:11.000Z', timeSpentSeconds: 680, mistakes: ['Pipetted slightly excess analyte volume; re-leveled'] },
  { id: 'sub_p16', labId: 'lab_seed_chem101', studentId: 'stu_16', studentName: 'Dipali Ishi', studentEmail: 'abc@gmail.com', avatar: '👩‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 90, maxScore: 100, percentage: 90, attemptNumber: 1, completedAt: '2026-10-01T13:08:44.000Z', timeSpentSeconds: 530, mistakes: ['Slight overshoot of endpoint (25.9 mL)'] },
  { id: 'sub_p17', labId: 'lab_seed_chem101', studentId: 'stu_17', studentName: 'Patil Siddhi Jitendra', studentEmail: 'siddhipatil911@gmail.com', avatar: '👩‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 95, maxScore: 100, percentage: 95, attemptNumber: 1, completedAt: '2026-10-01T13:14:02.000Z', timeSpentSeconds: 470, mistakes: ['None — ideal faint pink persistence (>30s)'] },
  { id: 'sub_p18', labId: 'lab_seed_chem101', studentId: 'stu_18', studentName: 'Kunal Chaudhari', studentEmail: 'kunalchaudhari919@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 83, maxScore: 100, percentage: 83, attemptNumber: 1, completedAt: '2026-10-01T13:19:30.000Z', timeSpentSeconds: 690, mistakes: ['Dispensed continuous stream instead of drops near 24 mL'] },
  { id: 'sub_p19', labId: 'lab_seed_chem101', studentId: 'stu_19', studentName: 'Pavan Wadile', studentEmail: 'pavanwadile777@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 88, maxScore: 100, percentage: 88, attemptNumber: 1, completedAt: '2026-10-01T13:24:55.000Z', timeSpentSeconds: 590, mistakes: ['Molarity calculation rounded prematurely'] },
  { id: 'sub_p20', labId: 'lab_seed_chem101', studentId: 'stu_20', studentName: 'Raj Borase', studentEmail: 'borase.raj11@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 92, maxScore: 100, percentage: 92, attemptNumber: 1, completedAt: '2026-10-01T13:29:40.000Z', timeSpentSeconds: 515, mistakes: ['None — precise burette control & accurate titer'] },
  { id: 'sub_p21', labId: 'lab_seed_chem101', studentId: 'stu_21', studentName: 'Mohit Chaudhari', studentEmail: 'rajmali@gmail.com', avatar: '👨‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 81, maxScore: 100, percentage: 81, attemptNumber: 2, completedAt: '2026-10-01T13:35:10.000Z', timeSpentSeconds: 730, mistakes: ['Forgot wash bottle rinse of flask walls; corrected on attempt 2'] },
  { id: 'sub_p22', labId: 'lab_seed_chem101', studentId: 'stu_22', studentName: 'Sanskruti Yogesh Bhalerao', studentEmail: 'sanskrutibhalerao44@gmail.com', avatar: '👩‍🎓', experimentId: 'titration', experimentTitle: 'Acidity of Water Sample (Titration with NaOH)', score: 94, maxScore: 100, percentage: 94, attemptNumber: 1, completedAt: '2026-10-01T13:40:22.000Z', timeSpentSeconds: 505, mistakes: ['None — excellent observation and calculation'] },
];

// Sample pre-seeded demo private lab for immediate exploration
const PRESEEDED_LABS: PrivateLab[] = [
  {
    id: 'lab_seed_chem101',
    code: 'CHEM-101',
    title: 'Pilot Assessment: Water Acidity Titration',
    description: 'College laboratory field trial testing volumetric analysis, endpoint titration, and stoichiometric calculation accuracy.',
    teacherId: 'usr_teacher_01',
    teacherName: 'SIH Mentor & Faculty Guide',
    teacherEmail: 'teacher@virtualvigyan.in',
    institution: 'DBATU Engineering Campus / College Chemistry Lab',
    department: 'Department of Chemistry',
    targetClass: 'First Year B.Tech (Pilot Batch 01)',
    experimentIds: ['titration-water-acidity', 'zinc-acid-reaction'],
    restrictions: {
      hideProcedure: false,
      hideFormulas: false,
      timeLimitMinutes: 30,
      maxAttempts: 3,
      strictSafety: true,
      hideHints: false,
    },
    status: 'active',
    isLocked: false,
    createdAt: '2026-10-01T09:00:00.000Z',
    dueDate: '2026-10-31',
    enrolledStudents: PILOT_STUDENTS,
    submissions: PILOT_SUBMISSIONS,
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
    const parsed: PrivateLab[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return PRESEEDED_LABS;
    }
    // Seamless migration: If stored lab has outdated dummy submissions or 0 submissions, update to real pilot cohort data
    const chem101 = parsed.find((l) => l.code === 'CHEM-101' || l.id === 'lab_seed_chem101');
    if (chem101 && (chem101.enrolledStudents.length <= 2 || chem101.submissions.length <= 2 || chem101.teacherName !== 'SIH Mentor & Faculty Guide')) {
      chem101.enrolledStudents = PILOT_STUDENTS;
      chem101.submissions = PILOT_SUBMISSIONS;
      chem101.title = 'Pilot Assessment: Water Acidity Titration';
      chem101.teacherName = 'SIH Mentor & Faculty Guide';
      savePrivateLabs(parsed);
    }
    return parsed;
  } catch (err) {
    console.warn('[PrivateLab] Failed to load private labs from localStorage:', err);
    return PRESEEDED_LABS;
  }
}

/**
 * Sync private labs with Firestore cloud database (two-way merge, never drops teacher labs)
 */
export async function syncPrivateLabsWithCloud(): Promise<PrivateLab[]> {
  try {
    const remoteLabs = await getAllPrivateLabsFromFirestore();
    const localLabs = getAllPrivateLabs();
    const map = new Map<string, PrivateLab>();

    // 1. Initialize map with local labs
    localLabs.forEach((l) => map.set(l.id, l));

    // 2. Merge remote labs from cloud
    if (remoteLabs && remoteLabs.length > 0) {
      remoteLabs.forEach((rl) => {
        const existing = map.get(rl.id);
        if (existing) {
          // Merge enrolled students (union by lowercase email)
          const enrolledMap = new Map<string, PrivateLabEnrolledStudent>();
          (existing.enrolledStudents || []).forEach((s) => enrolledMap.set(s.studentEmail.toLowerCase(), s));
          (rl.enrolledStudents || []).forEach((s) => enrolledMap.set(s.studentEmail.toLowerCase(), s));

          // Merge submissions (union by submission ID or composite student attempt key)
          const subMap = new Map<string, PrivateLabSubmission>();
          (existing.submissions || []).forEach((s) => {
            const key = s.id || `${s.studentEmail.toLowerCase()}_${s.experimentId}_${s.attemptNumber}`;
            subMap.set(key, s);
          });
          (rl.submissions || []).forEach((s) => {
            const key = s.id || `${s.studentEmail.toLowerCase()}_${s.experimentId}_${s.attemptNumber}`;
            subMap.set(key, s);
          });

          // Sort submissions newest first
          const mergedSubmissions = Array.from(subMap.values()).sort(
            (a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
          );

          map.set(rl.id, {
            ...existing,
            ...rl,
            status: rl.status || existing.status,
            dueDate: rl.dueDate || existing.dueDate,
            enrolledStudents: Array.from(enrolledMap.values()),
            submissions: mergedSubmissions,
          });
        } else {
          map.set(rl.id, rl);
        }
      });
    }

    const merged = Array.from(map.values());
    savePrivateLabs(merged);

    // 3. Two-way safety push: Ensure any local teacher-created lab is backed up to Firestore
    const remoteIdSet = new Set((remoteLabs || []).map((l) => l.id));
    for (const localLab of localLabs) {
      if (!remoteIdSet.has(localLab.id) && !localLab.id.startsWith('lab_seed_')) {
        savePrivateLabToFirestore(localLab).catch((err) => {
          console.warn('[PrivateLab] Cloud backup notice for local lab:', err);
        });
      }
    }

    return merged;
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

  // Allow omitting default "CHEM" prefix (e.g. entering "A1B2C3" for "CHEM-A1B2C3")
  if (a2.startsWith('CHEM') && a2.slice(4) === a1) return true;

  return false;
}

/**
 * Generate a random, human-friendly 6-to-7 char lab join code
 */
export function generateLabCode(prefix = 'CHEM'): string {
  const existingLabs = getAllPrivateLabs();
  const existingCodes = new Set(existingLabs.map((l) => l.code.toUpperCase()));
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Unambiguous charset (no 0/O, 1/I)

  for (let i = 0; i < 50; i++) {
    const array = new Uint8Array(6);
    crypto.getRandomValues(array);
    const code = `${prefix}-${Array.from(array, (b) => chars[b % chars.length]).join('')}`;
    if (!existingCodes.has(code)) {
      return code;
    }
  }

  return `${prefix}-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
}

/**
 * Create a new private lab (persists locally and to Firestore cloud)
 * If no due date is provided, defaults to a 5-day deadline.
 */
export function createPrivateLab(
  params: Omit<PrivateLab, 'id' | 'code' | 'createdAt' | 'enrolledStudents' | 'submissions'> & {
    customCode?: string;
  }
): PrivateLab {
  const labs = getAllPrivateLabs();
  const id = `lab_${crypto.randomUUID()}`;
  const code = (params.customCode?.trim().toUpperCase() || generateLabCode()).replace(/\s+/g, '-');

  // Default to 5-day deadline if teacher does not set one
  const fiveDaysLater = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dueDate = params.dueDate?.trim() || fiveDaysLater;

  const newLab: PrivateLab = {
    ...params,
    id,
    code,
    status: params.status || 'active',
    isLocked: params.isLocked !== undefined ? params.isLocked : true,
    dueDate,
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

  const percentage = Math.round(
    (submissionData.score / (submissionData.maxScore || 100)) * 100
  );

  const submission: PrivateLabSubmission = {
    ...submissionData,
    id: `sub_${crypto.randomUUID()}`,
    percentage,
    completedAt: new Date().toISOString(),
  };

  let updatedLab: PrivateLab | undefined;
  const updatedLabs = labs.map((l) => {
    if (l.id === submissionData.labId) {
      updatedLab = {
        ...l,
        submissions: [submission, ...(l.submissions || [])],
      };
      return updatedLab;
    }
    return l;
  });

  if (updatedLab) {
    savePrivateLabs(updatedLabs);
  }

  // Push submission directly to Firestore cloud database
  addSubmissionToFirestoreLab(submissionData.labId, submission).catch((err) => {
    console.warn('[PrivateLab] Cloud submission push warning:', err);
  });

  // Ensure full lab document is synced to Firestore
  if (updatedLab) {
    savePrivateLabToFirestore(updatedLab).catch(() => {});
  }

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
      labId: submissionData.labId,
      labTitle: lab?.title || 'Classroom Lab',
      labCode: lab?.code || '',
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
 * Toggle a private lab's locked/unlocked state
 * When locked, students cannot enter or perform the practical.
 * When unlocked, students can start and submit their experiment.
 */
export function toggleLabLock(labId: string): boolean {
  const labs = getAllPrivateLabs();
  let nextLocked = false;
  let updatedLab: PrivateLab | undefined;

  const updatedLabs = labs.map((l) => {
    if (l.id === labId) {
      nextLocked = !(l.isLocked ?? true);
      updatedLab = { ...l, isLocked: nextLocked };
      return updatedLab;
    }
    return l;
  });

  savePrivateLabs(updatedLabs);

  if (updatedLab) {
    savePrivateLabToFirestore(updatedLab).catch((err) => {
      console.warn('[PrivateLab] Cloud lock sync notice:', err);
    });
  }

  return nextLocked;
}

/**
 * Explicitly set a private lab's locked state
 */
export function setLabLock(labId: string, isLocked: boolean): boolean {
  const labs = getAllPrivateLabs();
  let updatedLab: PrivateLab | undefined;

  const updatedLabs = labs.map((l) => {
    if (l.id === labId) {
      updatedLab = { ...l, isLocked };
      return updatedLab;
    }
    return l;
  });

  if (updatedLab) {
    savePrivateLabs(updatedLabs);
    savePrivateLabToFirestore(updatedLab).catch((err) => {
      console.warn('[PrivateLab] Cloud lock sync notice:', err);
    });
    return true;
  }

  return false;
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
/**
 * Sanitize a string value for safe CSV export.
 * Prevents formula injection by stripping leading =, +, -, @, tab, CR characters
 * and properly escapes internal double-quotes.
 */
function escapeCSV(value: string): string {
  let safe = value.replace(/^[=+\-@\t\r]+/, '');
  safe = safe.replace(/"/g, '""');
  return `"${safe}"`;
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
        escapeCSV(st.studentName),
        escapeCSV(st.studentEmail),
        escapeCSV(new Date(st.joinedAt).toLocaleDateString()),
        escapeCSV('Not Attempted'),
        '0',
        '100',
        '0',
        '0',
        '0',
        escapeCSV('N/A'),
        escapeCSV('None'),
      ]);
    });
  } else {
    const submittedEmails = new Set<string>();
    lab.submissions.forEach((sub) => {
      if (sub.studentEmail) submittedEmails.add(sub.studentEmail.toLowerCase());
      const student = lab.enrolledStudents.find(
        (e) => e.studentEmail?.toLowerCase() === sub.studentEmail?.toLowerCase()
      );
      rows.push([
        escapeCSV(sub.studentName),
        escapeCSV(sub.studentEmail),
        student ? escapeCSV(new Date(student.joinedAt).toLocaleDateString()) : escapeCSV('N/A'),
        escapeCSV(sub.experimentTitle),
        sub.score.toString(),
        sub.maxScore.toString(),
        sub.percentage.toString(),
        sub.attemptNumber.toString(),
        sub.timeSpentSeconds.toString(),
        escapeCSV(new Date(sub.completedAt).toLocaleString()),
        escapeCSV(sub.mistakes.join('; ')),
      ]);
    });

    // Also include any enrolled students who haven't completed a submission yet
    lab.enrolledStudents.forEach((st) => {
      if (!submittedEmails.has(st.studentEmail.toLowerCase())) {
        rows.push([
          escapeCSV(st.studentName),
          escapeCSV(st.studentEmail),
          escapeCSV(new Date(st.joinedAt).toLocaleDateString()),
          escapeCSV('Not Attempted'),
          '0',
          '100',
          '0',
          '0',
          '0',
          escapeCSV('N/A'),
          escapeCSV('None'),
        ]);
      }
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
