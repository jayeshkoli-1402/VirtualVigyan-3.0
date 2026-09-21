/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — LabReportModal (Academic Practical Lab Report)
 * ═══════════════════════════════════════════════════════════════════
 *  Presents a structured, academic laboratory report preview with
 *  one-click PDF download, native print option, and full multilingual
 *  localization (English, Hindi, Marathi).
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useRef, useState } from 'react';
import type { ReportData } from '../../services/reportService';
import { downloadReportPdf, printReport } from '../../services/reportService';
import { VirtualVigyanLogo } from '../common/VirtualVigyanLogo';
import { useLanguage } from '../../i18n/LanguageContext';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  const { t } = useLanguage();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!reportRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      await downloadReportPdf(reportRef.current, reportData.filename);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Unable to generate PDF directly. Please use the Print option and select "Save as PDF".');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    printReport();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Container Box */}
      <div
        style={{
          width: '100%',
          maxWidth: 880,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-primary, #ffffff)',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border, #e2e8f0)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {/* Modal Top Control Bar */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            background: 'var(--bg-secondary, #f8fafc)',
            borderBottom: '1px solid var(--border, #e2e8f0)',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.25rem' }}>📑</span>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t('report.academicReport', 'Academic Laboratory Practical Report')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {t('report.authenticatedRecord', 'Certified Virtual Laboratory Record')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 8,
                background: 'var(--bg-card, #ffffff)',
                border: '1px solid var(--border, #cbd5e1)',
                color: 'var(--text-primary, #1e293b)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Print via Browser"
            >
              <span>🖨️</span>
              <span>{t('report.print', 'Print')}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 16px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: isDownloading ? 'wait' : 'pointer',
                opacity: isDownloading ? 0.7 : 1,
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{isDownloading ? '⏳' : '📥'}</span>
              <span>
                {isDownloading
                  ? t('common.loading', 'Generating...')
                  : t('report.downloadPdf', 'Download PDF')}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                all: 'unset',
                cursor: 'pointer',
                width: 32,
                height: 32,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: '1.2rem',
                fontWeight: 700,
              }}
              title={t('report.close', 'Close')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Report Content (Rendered onto PDF & Print) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            background: '#ffffff',
            color: '#0f172a',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            ref={reportRef}
            id="vv-lab-report-printable"
            style={{
              maxWidth: 780,
              margin: '0 auto',
              background: '#ffffff',
              color: '#0f172a',
              padding: '28px 32px',
              borderRadius: 8,
              border: '1.5px solid #e2e8f0',
              boxSizing: 'border-box',
            }}
          >
            {/* Header / Institutional Branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 18,
                borderBottom: '2.5px solid #0284c7',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <VirtualVigyanLogo size={44} showText={false} />
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      color: '#0369a1',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('report.title', 'VIRTUALVIGYAN LABORATORY REPORT')}
                  </h1>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginTop: 2 }}>
                    {t('report.academicReport', 'Academic Laboratory Practical Report')}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    color: '#0369a1',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  SCORE: {reportData.score}/{reportData.maxScore}
                </span>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
                  Grade: <strong>{reportData.grade}</strong>
                </div>
              </div>
            </div>

            {/* Student Information Section */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '14px 18px',
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#475569',
                  marginBottom: 10,
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: 4,
                }}
              >
                {t('report.studentInfo', 'Student Information')}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '10px 16px',
                  fontSize: '0.82rem',
                }}
              >
                <div>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>
                    {t('report.studentName', 'Student Name')}:
                  </span>{' '}
                  <strong style={{ color: '#0f172a' }}>{reportData.student.name}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>
                    {t('report.prnNo', 'PRN No.')}:
                  </span>{' '}
                  <strong style={{ color: '#0f172a' }}>{reportData.student.prn}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>
                    {t('report.rollNo', 'Roll No.')}:
                  </span>{' '}
                  <strong style={{ color: '#0f172a' }}>{reportData.student.rollNo}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>
                    {t('report.class', 'Class')}:
                  </span>{' '}
                  <strong style={{ color: '#0f172a' }}>{reportData.student.className}</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>
                    {t('report.experimentDate', 'Experiment Date')}:
                  </span>{' '}
                  <strong style={{ color: '#0f172a' }}>{reportData.student.date}</strong>
                </div>
              </div>
            </div>

            {/* Experiment Title */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#0284c7',
                  marginBottom: 4,
                }}
              >
                {t('report.experiment', 'Experiment')}
              </div>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.35,
                }}
              >
                {reportData.experimentTitle}
              </div>
            </div>

            {/* Objective */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#1e293b',
                  marginBottom: 6,
                }}
              >
                {t('report.objective', 'Objective')}
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: '#334155' }}>
                {reportData.objective}
              </p>
            </div>

            {/* Apparatus & Chemicals (2 columns or side-by-side) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 20,
              }}
            >
              {/* Apparatus */}
              <div
                style={{
                  padding: '12px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                }}
              >
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>🧪</span>
                  <span>{t('report.apparatus', 'Apparatus')}</span>
                </h3>
                {reportData.apparatus.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.8rem', color: '#334155', lineHeight: 1.55 }}>
                    {reportData.apparatus.map((app, i) => (
                      <li key={i}>{app}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {t('report.notProvided', 'Standard laboratory glassware')}
                  </div>
                )}
              </div>

              {/* Chemicals */}
              <div
                style={{
                  padding: '12px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                }}
              >
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>🧴</span>
                  <span>{t('report.chemicals', 'Chemicals')}</span>
                </h3>
                {reportData.chemicals.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.8rem', color: '#334155', lineHeight: 1.55 }}>
                    {reportData.chemicals.map((chem, i) => (
                      <li key={i}>{chem}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {t('report.notProvided', 'Analytical grade reagents')}
                  </div>
                )}
              </div>
            </div>

            {/* Procedure */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#1e293b',
                  marginBottom: 8,
                }}
              >
                {t('report.procedure', 'Procedure')}
              </h3>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  fontSize: '0.82rem',
                  lineHeight: 1.6,
                  color: '#334155',
                }}
              >
                {reportData.procedure.map((step) => (
                  <li key={step.stepNumber} style={{ marginBottom: 6 }}>
                    <strong>{step.title}:</strong> {step.instruction}
                  </li>
                ))}
              </ol>
            </div>

            {/* Observations */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#1e293b',
                  marginBottom: 8,
                }}
              >
                {t('report.observations', 'Observations')}
              </h3>
              {reportData.observations.length > 0 ? (
                <div
                  style={{
                    overflowX: 'auto',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                  }}
                >
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.8rem',
                      textAlign: 'left',
                    }}
                  >
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '8px 12px', fontWeight: 700, color: '#334155' }}>#</th>
                        <th style={{ padding: '8px 12px', fontWeight: 700, color: '#334155' }}>Parameter / Observation</th>
                        <th style={{ padding: '8px 12px', fontWeight: 700, color: '#334155', textAlign: 'right' }}>Recorded Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.observations.map((obs, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: idx < reportData.observations.length - 1 ? '1px solid #f1f5f9' : 'none',
                          }}
                        >
                          <td style={{ padding: '7px 12px', color: '#64748b' }}>{idx + 1}</td>
                          <td style={{ padding: '7px 12px', fontWeight: 600, color: '#1e293b' }}>{obs.label}</td>
                          <td
                            style={{
                              padding: '7px 12px',
                              textAlign: 'right',
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              color: '#0284c7',
                            }}
                          >
                            {obs.value} {obs.unit || ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>
                  {t('report.noObservationData', 'No observation data recorded.')}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#1e293b',
                  marginBottom: 8,
                }}
              >
                {t('report.calculations', 'Calculations')}
              </h3>
              {reportData.calculations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {reportData.calculations.map((calc, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        fontSize: '0.8rem',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 3 }}>
                        {calc.label}
                      </div>
                      {calc.formula && (
                        <div
                          style={{
                            fontFamily: 'monospace',
                            color: '#0369a1',
                            background: '#e0f2fe',
                            padding: '4px 8px',
                            borderRadius: 4,
                            display: 'inline-block',
                            margin: '3px 0 6px 0',
                            fontSize: '0.78rem',
                          }}
                        >
                          {calc.formula}
                        </div>
                      )}
                      {calc.studentValue !== undefined && (
                        <div style={{ marginTop: 2 }}>
                          <span style={{ color: '#64748b' }}>Calculated Value: </span>
                          <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>
                            {calc.studentValue} {calc.unit || ''}
                          </strong>
                        </div>
                      )}
                      {calc.notes && (
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, whiteSpace: 'pre-line' }}>
                          {calc.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>
                  {t('report.noCalculationData', 'No calculation data recorded.')}
                </p>
              )}
            </div>

            {/* Result */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#1e293b',
                  marginBottom: 6,
                }}
              >
                {t('report.result', 'Result')}
              </h3>
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 6,
                  fontSize: '0.84rem',
                  lineHeight: 1.55,
                  color: '#065f46',
                  fontWeight: 500,
                }}
              >
                {reportData.result}
              </div>
            </div>

            {/* Conclusion */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#1e293b',
                  marginBottom: 6,
                }}
              >
                {t('report.conclusion', 'Conclusion')}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.84rem',
                  lineHeight: 1.55,
                  color: '#334155',
                  fontStyle: reportData.conclusion.includes('Not recorded') ? 'italic' : 'normal',
                }}
              >
                {reportData.conclusion}
              </p>
            </div>

            {/* Mistakes Made */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#d97706',
                  marginBottom: 6,
                }}
              >
                {t('report.mistakesMade', 'Mistakes Made')}
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  color: reportData.mistakes[0] === t('report.noneRecorded', 'None recorded') ? '#10b981' : '#b45309',
                }}
              >
                {reportData.mistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            {/* Corrections */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#0284c7',
                  marginBottom: 6,
                }}
              >
                {t('report.corrections', 'Corrections')}
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  color: '#334155',
                }}
              >
                {reportData.corrections.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Score & Rubric */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '14px 18px',
                marginTop: 22,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: 6,
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#1e293b',
                  }}
                >
                  {t('report.score', 'Score')} & {t('report.rubricBreakdown', 'Rubric Breakdown')}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0369a1' }}>
                  {reportData.score} / {reportData.maxScore} ({reportData.grade})
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {reportData.rubricBreakdown.map((cat, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      color: '#334155',
                    }}
                  >
                    <span>{cat.name}</span>
                    <strong style={{ fontFamily: 'monospace' }}>
                      {cat.points} / {cat.maxPoints}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Report Sign-off & Verification Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginTop: 36,
                paddingTop: 16,
                borderTop: '1px dashed #cbd5e1',
                fontSize: '0.72rem',
                color: '#64748b',
              }}
            >
              <div>
                <div>VirtualVigyan Interactive Chemistry Laboratory</div>
                <div>System-generated authenticated evaluation record.</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ borderBottom: '1px solid #94a3b8', width: 140, marginBottom: 4 }} />
                <div>Instructor / Lab In-charge</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
