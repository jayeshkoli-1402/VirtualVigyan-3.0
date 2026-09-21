/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Automatic Laboratory Report Service
 * ═══════════════════════════════════════════════════════════════════
 *  Generates structured academic laboratory practical reports from
 *  existing experiment state, user profile, calculations, and rubric.
 *  Strictly presentation and export layer — DOES NOT mutate experiment.
 * ═══════════════════════════════════════════════════════════════════
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { ExperimentConfig, ExperimentState } from '../engine/experimentConfig';
import type { ScoreResult } from '../engine/scoringEngine';
import type { User } from '../auth/types';
import type { Language } from '../i18n/types';
import { EXPERIMENT_TRANSLATIONS } from '../i18n/experimentTranslations';

export interface ReportStudentInfo {
  name: string;
  prn: string;
  rollNo: string;
  className: string;
  date: string;
}

export interface ReportProcedureStep {
  stepNumber: number;
  title: string;
  instruction: string;
}

export interface ReportObservation {
  label: string;
  value: string | number;
  unit?: string;
}

export interface ReportCalculationItem {
  label: string;
  symbol?: string;
  formula?: string;
  studentValue?: string | number;
  expectedValue?: string | number;
  unit?: string;
  notes?: string;
}

export interface ReportData {
  student: ReportStudentInfo;
  experimentTitle: string;
  objective: string;
  apparatus: string[];
  chemicals: string[];
  procedure: ReportProcedureStep[];
  observations: ReportObservation[];
  calculations: ReportCalculationItem[];
  result: string;
  conclusion: string;
  mistakes: string[];
  corrections: string[];
  score: number;
  maxScore: number;
  grade: string;
  rubricBreakdown: Array<{
    name: string;
    points: number;
    maxPoints: number;
    explanation?: string;
  }>;
  filename: string;
}

/**
 * Sanitize filename strings for safe OS-level download
 */
export function sanitizeFilename(str: string): string {
  if (!str) return 'Untitled';
  return str
    .trim()
    .replace(/[^a-zA-Z0-9_\u0900-\u097F-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Maps a recorded mistake to constructive laboratory correction guidance
 */
function getMistakeCorrection(mistake: string, tDynamic: (s: string) => string): string {
  const lower = mistake.toLowerCase();
  if (lower.includes('tilt') || lower.includes('vertical')) {
    return tDynamic('Ensure apparatus is securely clamped in a strictly vertical position to eliminate capillary error.');
  }
  if (lower.includes('bubble') || lower.includes('meniscus')) {
    return tDynamic('Eliminate air bubbles from nozzle and ensure eye level is aligned with liquid meniscus.');
  }
  if (lower.includes('stopcock') || lower.includes('flow')) {
    return tDynamic('Regulate stopcock carefully to control drop rate and avoid overshooting titration endpoint.');
  }
  if (lower.includes('suction') || lower.includes('limb') || lower.includes('bulb')) {
    return tDynamic('Ensure limb is properly charged with liquid prior to applying suction bulb.');
  }
  if (lower.includes('temp') || lower.includes('heat') || lower.includes('bath')) {
    return tDynamic('Allow sample to reach thermal equilibrium at constant specified temperature.');
  }
  if (lower.includes('clean') || lower.includes('rinse') || lower.includes('acetone')) {
    return tDynamic('Rinse apparatus thoroughly with chromic acid and acetone, then dry completely before use.');
  }
  if (lower.includes('indicator') || lower.includes('drop')) {
    return tDynamic('Add exact recommended drops of indicator for sharp and discernible color transition.');
  }
  return tDynamic('Verify standard laboratory protocol and repeat the step following precise safety guidelines.');
}

/**
 * Extract and build structured report data from existing experiment & user context
 */
export function buildReportData(
  config: ExperimentConfig,
  state: ExperimentState,
  scoreResult: ScoreResult,
  user: User | null,
  language: Language,
  t: (key: string, fallback?: string) => string,
  tDynamic: (s: string | null | undefined) => string
): ReportData {
  const notProvided = t('report.notProvided', 'Not provided');
  const notRecorded = t('report.notRecorded', 'Not recorded.');

  // 1. Student metadata
  const studentName = user?.name?.trim() || notProvided;
  const userPrn = (user as any)?.prn ||
    (user?.rollNumber && user.rollNumber.toUpperCase().includes('PRN') ? user.rollNumber : '') ||
    (user?.username && !user.username.includes(' ') && user.username.length >= 8 && /\d/.test(user.username) ? user.username : '');
  const prn = userPrn?.trim() || notProvided;
  const rollNo = user?.rollNumber?.trim() || notProvided;
  const userGrade = user?.grade?.trim();
  const classLabel = typeof config.class === 'number' ? `Class ${config.class}` : config.class;
  const className = userGrade || classLabel || notProvided;

  const dateLocale = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
  const experimentDate = new Date().toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 2. Experiment title & objective
  const localizedExp = EXPERIMENT_TRANSLATIONS[config.id]?.[language];
  const experimentTitle = localizedExp?.title || tDynamic(config.title);
  const objective = localizedExp?.description || tDynamic(config.description);

  // 3. Apparatus & Chemicals separation
  const apparatusList: string[] = [];
  const chemicalsList: string[] = [];

  const chemicalKeywords = [
    'reagent', 'acid', 'sample', 'water', 'solution', 'indicator', 'powder',
    'granule', 'buffer', 'naoh', 'hcl', 'kmno4', 'edta', 'salt', 'acetone',
    'chromic', 'iodine', 'thiosulphate', 'starch', 'zinc', 'dye', 'base',
  ];

  config.apparatus.forEach((item) => {
    const isReagent =
      item.component === 'ReagentBottle' ||
      chemicalKeywords.some(
        (kw) =>
          item.id.toLowerCase().includes(kw) ||
          item.label.toLowerCase().includes(kw) ||
          item.component.toLowerCase().includes(kw)
      );

    const translatedLabel = tDynamic(item.label);
    if (isReagent) {
      if (!chemicalsList.includes(translatedLabel)) chemicalsList.push(translatedLabel);
    } else {
      if (!apparatusList.includes(translatedLabel)) apparatusList.push(translatedLabel);
    }
  });

  // If no chemicals were directly in apparatus toolbox, check chemistry.reaction
  if (chemicalsList.length === 0 && config.chemistry?.reaction) {
    chemicalsList.push(config.chemistry.reaction);
  }

  // 4. Procedure
  const procedure: ReportProcedureStep[] = config.steps.map((step, idx) => {
    const stepTrans = localizedExp?.steps[step.id];
    return {
      stepNumber: idx + 1,
      title: stepTrans?.title || tDynamic(step.label),
      instruction: stepTrans?.instruction || tDynamic(step.instruction),
    };
  });

  // 5. Observations
  const observations: ReportObservation[] = [];
  if (config.calculation?.recordedValues && config.calculation.recordedValues.length > 0) {
    config.calculation.recordedValues.forEach((rv) => {
      let rawVal: any = rv.value;
      if (rv.key && state.variables[rv.key] !== undefined) {
        rawVal = state.variables[rv.key];
      }
      let formattedVal: string | number = rawVal;
      if (typeof rawVal === 'number') {
        formattedVal = rv.decimals !== undefined ? rawVal.toFixed(rv.decimals) : Number(rawVal.toFixed(4));
      } else if (rawVal === undefined || rawVal === null) {
        formattedVal = '—';
      }
      observations.push({
        label: tDynamic(rv.label),
        value: formattedVal,
        unit: rv.unit,
      });
    });
  } else {
    // Check known state variables if no explicit recordedValues
    const candidateKeys = ['flowTimeSample', 'flowTimeWater', 'titrantVolume', 'volumeAdded', 'pH', 'temperature', 'm1', 'm2', 'conductance'];
    candidateKeys.forEach((k) => {
      if (state.variables[k] !== undefined && state.variables[k] !== 0) {
        observations.push({
          label: tDynamic(k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())),
          value: Number(state.variables[k].toFixed(2)),
        });
      }
    });
  }

  // 6. Calculations
  const calculations: ReportCalculationItem[] = [];
  if (config.calculation) {
    // Add mathematical formulas if defined
    if (config.calculation.formulas) {
      config.calculation.formulas.forEach((f) => {
        const formulaStr = `${f.symbol} = [ ${f.numerator} / ${f.denominator} ] ${f.multiplier || ''}`;
        calculations.push({
          label: f.label ? tDynamic(f.label) : `${t('report.calculations', 'Calculations')} (${f.symbol})`,
          symbol: f.symbol,
          formula: formulaStr,
          unit: f.unit,
          notes: f.notes,
        });
      });
    }

    // Add student answers
    config.calculation.fields.forEach((field) => {
      const studentAns = state.studentAnswers[field.id];
      calculations.push({
        label: tDynamic(field.label),
        studentValue: studentAns !== undefined ? studentAns : notProvided,
        expectedValue: field.expectedValue,
        unit: field.unit,
        notes: field.helperText ? tDynamic(field.helperText) : undefined,
      });
    });
  }

  // 7. Result
  let resultSummary = '';
  if (Object.keys(state.studentAnswers).length > 0) {
    const answersList = Object.entries(state.studentAnswers)
      .map(([k, v]) => {
        const fld = config.calculation?.fields.find((f) => f.id === k);
        const label = fld ? tDynamic(fld.label) : k;
        const unit = fld?.unit ? ` ${fld.unit}` : '';
        return `${label}: ${v}${unit}`;
      })
      .join('; ');
    resultSummary = `${answersList}. ${t('report.experimentCompletedSuccess', 'The practical was successfully executed following standardized laboratory protocols.')}`;
  } else {
    resultSummary = t('report.experimentCompletedSuccess', 'The laboratory practical was successfully performed and completed in accordance with standard operating procedures.');
  }

  // 8. Conclusion
  const conclusion = (config as any).conclusion
    ? tDynamic((config as any).conclusion)
    : notRecorded;

  // 9. Mistakes & Corrections
  let mistakes: string[] = [];
  let corrections: string[] = [];

  if (state.mistakes && state.mistakes.length > 0) {
    const uniqueMistakes = [...new Set(state.mistakes)];
    mistakes = uniqueMistakes.map((m) => tDynamic(m));
    corrections = uniqueMistakes.map((m) => getMistakeCorrection(m, tDynamic));
  } else {
    mistakes = [t('report.noneRecorded', 'None recorded')];
    corrections = [t('report.noCorrectionsRequired', 'No corrections required')];
  }

  // 10. Scoring & Rubric
  const score = scoreResult.totalScore;
  const maxScore = 100;
  const grade = scoreResult.grade;
  const rubricBreakdown = scoreResult.breakdown.map((cat) => ({
    name: tDynamic(cat.name),
    points: cat.points,
    maxPoints: cat.maxPoints,
    explanation: cat.explanation ? tDynamic(cat.explanation) : undefined,
  }));

  // Clean filename: VirtualVigyan_Lab_Report_[ExperimentName]_[StudentName].pdf
  const cleanExp = sanitizeFilename(config.title);
  const cleanStudent = sanitizeFilename(user?.name || 'Student');
  const filename = `VirtualVigyan_Lab_Report_${cleanExp}_${cleanStudent}.pdf`;

  return {
    student: {
      name: studentName,
      prn,
      rollNo,
      className,
      date: experimentDate,
    },
    experimentTitle,
    objective,
    apparatus: apparatusList,
    chemicals: chemicalsList,
    procedure,
    observations,
    calculations,
    result: resultSummary,
    conclusion,
    mistakes,
    corrections,
    score,
    maxScore,
    grade,
    rubricBreakdown,
    filename,
  };
}

/**
 * Generates and downloads a clean, multi-page A4 PDF of the report
 */
export async function downloadReportPdf(
  reportElement: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(reportElement, {
    scale: 2, // 2x DPI for crisp academic report typography
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 800,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = 210; // A4 width in mm
  const pdfHeight = 297; // A4 height in mm
  const margin = 10; // 10mm margins
  const contentWidth = pdfWidth - margin * 2;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  let heightLeft = contentHeight;
  let position = margin;

  // First page
  pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight, '', 'FAST');
  heightLeft -= (pdfHeight - margin * 2);

  // Subsequent pages if report content spans multiple pages
  while (heightLeft > 0) {
    position = heightLeft - contentHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight, '', 'FAST');
    heightLeft -= (pdfHeight - margin * 2);
  }

  pdf.save(filename);
}

/**
 * Triggers native high-fidelity browser print dialog
 */
export function printReport(): void {
  window.print();
}
