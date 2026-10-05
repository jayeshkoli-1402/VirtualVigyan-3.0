/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Lab-Specific Leaderboard Service
 * ═══════════════════════════════════════════════════════════════════
 *  Deterministic ranking strictly isolated to a single teacher-created Lab:
 *  1. Primary: Completed full assigned experiment > Incomplete / Not started
 *  2. Secondary: Higher experiment score / performance
 *  3. Third: Fewer attempts / retries (1st attempt > 2nd attempt for same score)
 *  4. Fourth: Earlier successful completion timestamp
 * ═══════════════════════════════════════════════════════════════════
 */

import type { PrivateLab, PrivateLabSubmission, PrivateLabEnrolledStudent } from '../types/privateLab';
import type { LabLeaderboardEntry, LabLeaderboardSummary } from '../types/labLeaderboard';

/**
 * Check whether a user (student or teacher) has permission to view a specific Lab's leaderboard.
 * - Teachers who created the lab (or admin faculty) have access.
 * - Students who are enrolled in the lab have access.
 * - Non-members are strictly denied access.
 */
export function canAccessLabLeaderboard(
  lab: PrivateLab | null | undefined,
  userEmail: string | undefined | null,
  userRole: string | undefined | null
): { allowed: boolean; reason?: string } {
  if (!lab) {
    return { allowed: false, reason: 'Lab not found.' };
  }

  if (!userEmail) {
    return { allowed: false, reason: 'Authentication required to view Lab Leaderboard.' };
  }

  const normEmail = userEmail.trim().toLowerCase();

  // Admin or the teacher who created this lab has full access
  if (
    userRole === 'admin' ||
    lab.teacherEmail?.toLowerCase() === normEmail ||
    (normEmail.includes('admin') && lab.teacherEmail?.includes('admin'))
  ) {
    return { allowed: true };
  }

  // Check if student is enrolled in this lab
  const isEnrolled = (lab.enrolledStudents || []).some(
    (st) => st.studentEmail?.toLowerCase() === normEmail
  );

  if (isEnrolled) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Access restricted. You must be an enrolled student in "${lab.title}" (${lab.code}) to view its leaderboard.`,
  };
}

/**
 * Compute the deterministic leaderboard for a specific PrivateLab.
 * Completely isolated to this lab's enrolled students and submissions.
 */
export function calculateLabLeaderboard(
  lab: PrivateLab,
  selectedExperimentId?: string,
  currentUserEmail?: string
): LabLeaderboardSummary {
  const normCurrentEmail = currentUserEmail?.trim().toLowerCase();
  const assignedExperimentIds = lab.experimentIds || [];

  // Filter submissions by labId and optional experimentId
  const relevantSubmissions = (lab.submissions || []).filter((sub) => {
    if (sub.labId && sub.labId !== lab.id) return false;
    if (selectedExperimentId && selectedExperimentId !== 'all') {
      return sub.experimentId === selectedExperimentId;
    }
    return true;
  });

  // Collect all unique students associated with this lab
  const studentMap = new Map<string, {
    studentId: string;
    studentName: string;
    studentEmail: string;
    avatar?: string;
  }>();

  // 1. Add all enrolled students (guarantees incomplete students are tracked)
  (lab.enrolledStudents || []).forEach((st: PrivateLabEnrolledStudent) => {
    const emailKey = st.studentEmail.toLowerCase();
    studentMap.set(emailKey, {
      studentId: st.studentId,
      studentName: st.studentName,
      studentEmail: st.studentEmail,
      avatar: st.avatar,
    });
  });

  // 2. Add any students who submitted (in case enrolled array sync differed)
  relevantSubmissions.forEach((sub: PrivateLabSubmission) => {
    const emailKey = sub.studentEmail.toLowerCase();
    if (!studentMap.has(emailKey)) {
      studentMap.set(emailKey, {
        studentId: sub.studentId,
        studentName: sub.studentName,
        studentEmail: sub.studentEmail,
        avatar: sub.avatar,
      });
    }
  });

  const completedEntries: LabLeaderboardEntry[] = [];
  const incompleteEntries: LabLeaderboardEntry[] = [];

  studentMap.forEach((studentInfo, emailKey) => {
    const studentSubs = relevantSubmissions.filter(
      (s) => s.studentEmail?.toLowerCase() === emailKey
    );

    const isCurrent = normCurrentEmail ? emailKey === normCurrentEmail : false;

    if (studentSubs.length > 0) {
      // Find best qualifying submission for this student:
      // Priority: Highest score -> Lowest attempt number -> Earliest completion timestamp
      const sortedSubs = [...studentSubs].sort((a, b) => {
        // 1. Higher score
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // 2. Lower attempt number (fewer retries)
        if (a.attemptNumber !== b.attemptNumber) {
          return a.attemptNumber - b.attemptNumber;
        }
        // 3. Earlier completion
        const timeA = new Date(a.completedAt || 0).getTime();
        const timeB = new Date(b.completedAt || 0).getTime();
        return timeA - timeB;
      });

      const bestSub = sortedSubs[0];

      completedEntries.push({
        rank: null, // assigned after sorting
        studentId: studentInfo.studentId || bestSub.studentId,
        studentName: bestSub.studentName || studentInfo.studentName,
        studentEmail: bestSub.studentEmail || studentInfo.studentEmail,
        avatar: bestSub.avatar || studentInfo.avatar || '🎓',
        status: 'completed',
        score: bestSub.score,
        maxScore: bestSub.maxScore || 100,
        percentage: bestSub.percentage ?? Math.round((bestSub.score / (bestSub.maxScore || 100)) * 100),
        attemptNumber: bestSub.attemptNumber,
        totalAttempts: studentSubs.length,
        timeSpentSeconds: bestSub.timeSpentSeconds ?? null,
        completedAt: bestSub.completedAt || null,
        mistakes: bestSub.mistakes || [],
        experimentId: bestSub.experimentId,
        experimentTitle: bestSub.experimentTitle,
        isCurrentStudent: isCurrent,
      });
    } else {
      // Incomplete student (Enrolled in lab but has not completed submission for selected experiment)
      incompleteEntries.push({
        rank: null,
        studentId: studentInfo.studentId,
        studentName: studentInfo.studentName,
        studentEmail: studentInfo.studentEmail,
        avatar: studentInfo.avatar || '🎓',
        status: 'not_started',
        score: null,
        maxScore: null,
        percentage: null,
        attemptNumber: null,
        totalAttempts: 0,
        timeSpentSeconds: null,
        completedAt: null,
        mistakes: [],
        experimentId: selectedExperimentId && selectedExperimentId !== 'all' ? selectedExperimentId : undefined,
        isCurrentStudent: isCurrent,
      });
    }
  });

  // Sort Completed Entries:
  // 1. Higher score / percentage
  // 2. Fewer attempts / retries
  // 3. Earlier completion timestamp
  completedEntries.sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    const attA = a.attemptNumber ?? 999;
    const attB = b.attemptNumber ?? 999;
    if (attA !== attB) {
      return attA - attB;
    }

    const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
    return timeA - timeB;
  });

  // Assign sequential ranks to completed students (1, 2, 3...)
  completedEntries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  // Sort Incomplete entries alphabetically by student name
  incompleteEntries.sort((a, b) => a.studentName.localeCompare(b.studentName));

  const allEntries = [...completedEntries, ...incompleteEntries];

  // Aggregate stats
  const totalEnrolled = studentMap.size;
  const totalCompleted = completedEntries.length;
  const totalInProgress = 0; // if partial sessions exist
  const totalNotStarted = incompleteEntries.length;

  const totalScoreSum = completedEntries.reduce((sum, e) => sum + (e.score ?? 0), 0);
  const averageScore = totalCompleted > 0 ? Math.round(totalScoreSum / totalCompleted) : 0;
  const highestScore = completedEntries.length > 0 ? (completedEntries[0].score ?? 0) : 0;

  const currentStudentEntry = allEntries.find((e) => e.isCurrentStudent) || null;

  return {
    labId: lab.id,
    labCode: lab.code,
    labTitle: lab.title,
    targetClass: lab.targetClass,
    teacherName: lab.teacherName,
    teacherEmail: lab.teacherEmail,
    dueDate: lab.dueDate,
    totalEnrolled,
    totalCompleted,
    totalInProgress,
    totalNotStarted,
    averageScore,
    highestScore,
    selectedExperimentId,
    assignedExperimentIds,
    entries: allEntries,
    currentStudentEntry,
  };
}

/**
 * Sanitize string for CSV injection safety
 */
function sanitizeCSV(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  let s = String(val).replace(/^[=+\-@\t\r]+/, '');
  s = s.replace(/"/g, '""');
  return `"${s}"`;
}

/**
 * Export the Lab Leaderboard as a formatted CSV file
 */
export function exportLabLeaderboardCSV(
  lab: PrivateLab,
  selectedExperimentId?: string
): void {
  const summary = calculateLabLeaderboard(lab, selectedExperimentId);

  const headers = [
    'Rank',
    'Student Name',
    'Student Email',
    'Status',
    'Score',
    'Max Score',
    'Percentage (%)',
    'Attempt Number',
    'Total Attempts',
    'Time Spent (s)',
    'Completed At',
    'Experiment Title',
  ];

  const rows: string[][] = summary.entries.map((e) => [
    sanitizeCSV(e.rank !== null ? e.rank : '—'),
    sanitizeCSV(e.studentName),
    sanitizeCSV(e.studentEmail),
    sanitizeCSV(e.status === 'completed' ? 'Completed' : 'Not Started'),
    sanitizeCSV(e.score !== null ? e.score : '—'),
    sanitizeCSV(e.maxScore !== null ? e.maxScore : '—'),
    sanitizeCSV(e.percentage !== null ? `${e.percentage}%` : '—'),
    sanitizeCSV(e.attemptNumber !== null ? e.attemptNumber : '—'),
    sanitizeCSV(e.totalAttempts),
    sanitizeCSV(e.timeSpentSeconds !== null ? e.timeSpentSeconds : '—'),
    sanitizeCSV(e.completedAt ? new Date(e.completedAt).toLocaleString() : 'N/A'),
    sanitizeCSV(e.experimentTitle || 'Assigned Experiment'),
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `VirtualVigyan_Leaderboard_${lab.code}_${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
