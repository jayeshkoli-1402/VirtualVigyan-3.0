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
import type { ConservationState } from '../engine/conservationState';
import { calculateExpectedDeltaM, calculateExpectedDeviation, REACTION_EQUATION } from '../engine/conservationRules';
import { computeScore as computeConservationScore } from '../engine/conservationValidation';

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
 * Extract and build structured report data for Law of Conservation of Mass
 */
export function buildConservationReportData(
  state: ConservationState,
  user: User | null,
  language: Language,
  t: (key: string, paramsOrFallback?: Record<string, string | number> | string, fallback?: string) => string,
  tDynamic: (s: string | null | undefined) => string
): ReportData {
  const notProvided = t('report.notProvided', 'Not provided');

  // 1. Student metadata
  const studentName = user?.name?.trim() || notProvided;
  const userPrn = (user as any)?.prn ||
    (user?.rollNumber && user.rollNumber.toUpperCase().includes('PRN') ? user.rollNumber : '') ||
    (user?.username && !user.username.includes(' ') && user.username.length >= 8 && /\d/.test(user.username) ? user.username : '');
  const prn = userPrn?.trim() || notProvided;
  const rollNo = user?.rollNumber?.trim() || notProvided;
  const userGrade = user?.grade?.trim();
  const className = userGrade || 'Class 9' || notProvided;

  const dateLocale = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
  const experimentDate = new Date().toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const m1 = state.initialMass ?? 0;
  const m2 = state.finalMass ?? 0;
  const expectedDeltaM = calculateExpectedDeltaM(m1, m2);
  const expectedDeviation = calculateExpectedDeviation(m1, m2);

  const experimentTitle = t('conservation.title', 'Law of Conservation of Mass');
  const objective = t('conservation.objective', 'To verify the law of conservation of mass in a chemical reaction.');

  const apparatusList = [
    t('conservation.itemConicalFlask', 'Conical Flask (100 mL)'),
    t('conservation.itemIgnitionTube', 'Ignition Tube (10x75 mm)'),
    t('conservation.itemElectronicBalance', 'Electronic Balance (0.01 g)'),
    t('conservation.itemMeasuringCylinder', 'Measuring Cylinder (10 mL)'),
    t('conservation.itemRubberCork', 'Airtight Rubber Cork'),
    t('conservation.itemStand', 'Laboratory Stand with Thread & Clamp')
  ];

  const chemicalsList = [
    t('conservation.itemBacl2', 'Barium Chloride Solution (BaCl₂, 5% w/v, 5 mL)'),
    t('conservation.itemNa2so4', 'Sodium Sulphate Solution (Na₂SO₄, 5% w/v, 5 mL)')
  ];

  const procedure: ReportProcedureStep[] = [
    { stepNumber: 1, title: t('conservation.step1Title', 'Set Up Flask'), instruction: t('conservation.step1Desc', 'Place the conical flask on the workbench.') },
    { stepNumber: 2, title: t('conservation.step2Title', 'Place Ignition Tube'), instruction: t('conservation.step2Desc', 'Place the ignition tube on the stand.') },
    { stepNumber: 3, title: t('conservation.step3Title', 'Fill Ignition Tube with BaCl₂'), instruction: t('conservation.step3Desc', 'Add 5 mL barium chloride solution into the ignition tube.') },
    { stepNumber: 4, title: t('conservation.step4Title', 'Fill Flask with Na₂SO₄'), instruction: t('conservation.step4Desc', 'Add sodium sulphate solution into the conical flask.') },
    { stepNumber: 5, title: t('conservation.step5Title', 'Hang Ignition Tube in Flask'), instruction: t('conservation.step5Desc', 'Carefully hang the ignition tube inside the conical flask using thread.') },
    { stepNumber: 6, title: t('conservation.step6Title', 'Seal Flask with Cork'), instruction: t('conservation.step6Desc', 'Seal the flask opening tightly with the rubber cork.') },
    { stepNumber: 7, title: t('conservation.step7Title', 'Record Initial Mass (m₁)'), instruction: t('conservation.step7Desc', 'Weigh the sealed apparatus on the electronic balance and record initial mass m₁.') },
    { stepNumber: 8, title: t('conservation.step8Title', 'Tilt and Swirl to Mix'), instruction: t('conservation.step8Desc', 'Tilt and swirl the flask so the two solutions react completely.') },
    { stepNumber: 9, title: t('conservation.step9Title', 'Observe Precipitation Reaction'), instruction: t('conservation.step9Desc', 'Observe the white precipitate of barium sulphate (BaSO₄) formed.') },
    { stepNumber: 10, title: t('conservation.step10Title', 'Record Final Mass (m₂)'), instruction: t('conservation.step10Desc', 'Weigh the sealed flask again and record final mass m₂.') },
  ];

  const observations: ReportObservation[] = [
    { label: t('conservation.initialMass', 'Initial Mass of Sealed System (m₁)'), value: m1 > 0 ? `${m1.toFixed(2)}` : '—', unit: 'g' },
    { label: t('conservation.finalMass', 'Final Mass of Sealed System (m₂)'), value: m2 > 0 ? `${m2.toFixed(2)}` : '—', unit: 'g' },
    { label: t('conservation.deltaMCalc', 'Difference in Mass (ΔM = |m₁ - m₂|)'), value: `${expectedDeltaM.toFixed(2)}`, unit: 'g' },
    { label: t('conservation.observationTitle', 'Precipitate Formation'), value: state.precipitateFormed ? t('conservation.observationRecorded', 'White precipitate of Barium Sulphate (BaSO₄) formed') : t('conservation.noObservation', 'Reaction not completed') },
    { label: t('conservation.chemicalEquation', 'Chemical Reaction'), value: REACTION_EQUATION },
  ];

  const calculations: ReportCalculationItem[] = [
    {
      label: t('conservation.deltaMCalc', 'Mass Difference (ΔM)'),
      symbol: 'ΔM',
      formula: 'ΔM = |m₁ - m₂|',
      studentValue: state.studentDeltaM !== null ? `${state.studentDeltaM.toFixed(2)}` : notProvided,
      expectedValue: `${expectedDeltaM.toFixed(2)}`,
      unit: 'g',
      notes: t('conservation.deltaMNotes', 'Difference between initial and final mass readings'),
    },
    {
      label: t('conservation.deviationPercent', 'Percentage Mass Deviation'),
      symbol: '% Deviation',
      formula: '(% Deviation) = (|ΔM| / m₁) × 100',
      studentValue: state.studentDeviationPercent !== null ? `${state.studentDeviationPercent.toFixed(2)}` : notProvided,
      expectedValue: `${expectedDeviation.toFixed(2)}`,
      unit: '%',
      notes: t('conservation.deviationNotes', 'Experimental error relative to initial mass'),
    },
  ];

  const resultSummary = expectedDeltaM <= 0.02
    ? `m₁ = ${m1.toFixed(2)} g, m₂ = ${m2.toFixed(2)} g, ΔM = ${expectedDeltaM.toFixed(2)} g. ${t('conservation.conclusionVerified', 'The total mass remains conserved before and after the chemical reaction.')}`
    : `m₁ = ${m1.toFixed(2)} g, m₂ = ${m2.toFixed(2)} g, ΔM = ${expectedDeltaM.toFixed(2)} g.`;

  const conclusion = expectedDeltaM <= 0.02
    ? t('conservation.conclusionVerified', 'The total mass remains conserved before and after the chemical reaction, within the precision of the simulated balance. Hence, the law of conservation of mass is verified.')
    : t('conservation.massNotConserved', { deltaM: expectedDeltaM.toFixed(2) });

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

  const score = state.score ?? computeConservationScore(state);
  const maxScore = 100;
  const grade = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Satisfactory' : 'Needs Practice';

  const rubricBreakdown = [
    {
      name: t('conservation.procedureOrder', 'Procedure & Step Execution'),
      points: state.mistakes.length === 0 ? 20 : state.mistakes.length <= 2 ? 10 : 0,
      maxPoints: 20,
      explanation: state.mistakes.length === 0 ? t('conservation.expOrderPerfect', 'All steps executed in correct sequence with zero protocol errors.') : t('conservation.expOrderMistakes', 'Minor sequence errors recorded.'),
    },
    {
      name: t('conservation.flaskSealed', 'Airtight System Sealing'),
      points: state.flaskSealed && state.initialMass !== null ? 15 : 0,
      maxPoints: 15,
      explanation: state.flaskSealed ? t('conservation.expSealedGood', 'Flask was airtight and sealed before recording initial mass and mixing.') : t('conservation.expSealedBad', 'Flask was not sealed properly before mixing.'),
    },
    {
      name: t('conservation.m1Recorded', 'Initial Mass Recording (m₁)'),
      points: state.initialMass !== null ? 15 : 0,
      maxPoints: 15,
      explanation: state.initialMass !== null ? t('conservation.expM1Good', 'Initial mass of sealed apparatus recorded accurately on electronic balance.') : t('conservation.expM1Bad', 'Initial mass was omitted.'),
    },
    {
      name: t('conservation.mixingDone', 'Reactant Mixing & Observation'),
      points: state.reactantsMixed ? 10 : 0,
      maxPoints: 10,
      explanation: state.reactantsMixed ? t('conservation.expMixGood', 'Reactants thoroughly mixed and precipitate formation observed.') : t('conservation.expMixBad', 'Solutions were not mixed.'),
    },
    {
      name: t('conservation.m2Recorded', 'Final Mass Recording (m₂)'),
      points: state.finalMass !== null ? 10 : 0,
      maxPoints: 10,
      explanation: state.finalMass !== null ? t('conservation.expM2Good', 'Post-reaction mass measured accurately on electronic balance.') : t('conservation.expM2Bad', 'Final mass was omitted.'),
    },
    {
      name: t('conservation.deltaMCalc', 'Mass Difference Calculation (ΔM)'),
      points: state.studentDeltaM !== null
        ? Math.abs(state.studentDeltaM - expectedDeltaM) <= 0.005 ? 15 : Math.abs(state.studentDeltaM - expectedDeltaM) <= 0.02 ? 8 : 0
        : 0,
      maxPoints: 15,
      explanation: state.studentDeltaM !== null && Math.abs(state.studentDeltaM - expectedDeltaM) <= 0.005 ? t('conservation.expDeltaMGood', 'Accurately calculated difference in mass.') : t('conservation.expDeltaMBad', 'Calculation error in mass difference.'),
    },
    {
      name: t('conservation.deviationPercent', 'Percentage Deviation Calculation'),
      points: state.studentDeviationPercent !== null
        ? Math.abs(state.studentDeviationPercent - expectedDeviation) <= 0.02 ? 15 : Math.abs(state.studentDeviationPercent - expectedDeviation) <= 0.1 ? 8 : 0
        : 0,
      maxPoints: 15,
      explanation: state.studentDeviationPercent !== null && Math.abs(state.studentDeviationPercent - expectedDeviation) <= 0.02 ? t('conservation.expDevGood', 'Percentage error correctly computed.') : t('conservation.expDevBad', 'Error in deviation formula evaluation.'),
    },
  ];

  const cleanStudent = sanitizeFilename(user?.name || 'Student');
  const filename = `VirtualVigyan_Lab_Report_Law_of_Conservation_of_Mass_${cleanStudent}.pdf`;

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
