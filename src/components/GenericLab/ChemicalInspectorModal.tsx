/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Chemical & Stoichiometry Inspector Modal
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Interactive, real-time chemical diagnostic HUD allowing students
 *  to inspect the microscopic and macroscopic state of any reaction vessel:
 *  - Molar breakdown of dissolved & unreacted species
 *  - Limiting reagent identification & excess tracking
 *  - Real thermodynamic enthalpy & vessel temperature ΔT
 *  - Precipitates & insoluble sediment mass (g)
 *  - Gas effervescence rates & bubbling mechanics
 *  - Safety hazards (spattering, flammable H₂, toxic fumes)
 *  - Reagent playground: lets students add variable quantities of any
 *    chemical X1...Xn to see real deterministic scientific consequences!
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { VesselMixture, ChemicalAddition } from '../../engine/stoichiometrySolver';
import { CHEMICAL_DATABASE } from '../../engine/chemicalDatabase';
import { useLanguage } from '../../i18n/LanguageContext';

interface ChemicalInspectorModalProps {
  mixture: VesselMixture;
  vesselLabel: string;
  onClose: () => void;
  onAddChemical: (addition: ChemicalAddition) => void;
}

export const ChemicalInspectorModal: React.FC<ChemicalInspectorModalProps> = ({
  mixture,
  vesselLabel,
  onClose,
  onAddChemical,
}) => {
  const { t, tDynamic } = useLanguage();
  const [selectedSubstance, setSelectedSubstance] = useState('hcl');
  const [volumeMl, setVolumeMl] = useState(10);
  const [molarity, setMolarity] = useState(0.1);
  const [massGrams, setMassGrams] = useState(1.0);
  const [activeTab, setActiveTab] = useState<'composition' | 'history' | 'test'>('composition');

  const selectedSpecies = CHEMICAL_DATABASE[selectedSubstance];
  const isSolid = selectedSpecies?.stateAtRoomTemp === 'solid';

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolid) {
      onAddChemical({
        substanceId: selectedSubstance,
        massGrams,
      });
    } else {
      onAddChemical({
        substanceId: selectedSubstance,
        volumeMl,
        molarity,
      });
    }
  };

  // Convert dissolved moles to array for table display
  const dissolvedSpeciesList = Object.entries(mixture.moles)
    .filter(([, mol]) => mol > 1e-7)
    .map(([id, mol]) => {
      const spec = CHEMICAL_DATABASE[id];
      const volumeL = Math.max(0.001, mixture.volumeMl / 1000);
      const concM = mol / volumeL;
      return {
        id,
        name: spec?.name ?? id,
        formula: spec?.formula ?? id,
        type: spec?.type ?? 'salt',
        baseColor: spec?.baseColor ?? '#94a3b8',
        moles: mol,
        milliMoles: mol * 1000,
        molarity: concM,
      };
    })
    .sort((a, b) => b.moles - a.moles);

  const precipitateList = Object.entries(mixture.precipitateGrams)
    .filter(([, grams]) => grams > 0.001)
    .map(([id, grams]) => {
      const spec = CHEMICAL_DATABASE[id];
      return {
        id,
        name: spec?.name ?? id,
        formula: spec?.formula ?? id,
        grams,
        baseColor: spec?.baseColor ?? '#e2e8f0',
      };
    });

  // pH color gradient
  const getPhColor = (ph: number) => {
    if (ph < 3) return '#ef4444'; // Red
    if (ph < 6) return '#f97316'; // Orange
    if (ph <= 8) return '#10b981'; // Green
    if (ph < 11) return '#0ea5e9'; // Cyan
    return '#8b5cf6'; // Purple
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '92vh',
          backgroundColor: 'var(--bg-card, #ffffff)',
          color: 'var(--text-primary, #0f172a)',
          borderRadius: '16px',
          border: '1px solid var(--border, #cbd5e1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ── Modal Header ── */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border, #cbd5e1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(99, 102, 241, 0.04))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                color: '#fff',
                boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
              }}
            >
              🧪
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {tDynamic('Chemical & Stoichiometry Engine')}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #64748b)' }}>
                {tDynamic('Live Reaction Diagnostics for')} <strong style={{ color: '#2563eb' }}>{tDynamic(vesselLabel)}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-secondary, #64748b)',
              padding: '4px 8px',
              borderRadius: '8px',
              lineHeight: 1,
            }}
            title={t('common.close', 'Close')}
          >
            ✕
          </button>
        </div>

        {/* ── Live Metric Ribbon ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            padding: '14px 24px',
            backgroundColor: 'var(--bg-secondary, #f8fafc)',
            borderBottom: '1px solid var(--border, #cbd5e1)',
          }}
        >
          {/* Volume */}
          <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--bg-card, #fff)', border: '1px solid var(--border, #e2e8f0)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>{tDynamic('Total Volume')}</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: mixture.volumeMl > 0 ? '#0284c7' : '#94a3b8' }}>
              {mixture.volumeMl === 0 ? '0.0' : mixture.volumeMl.toFixed(mixture.volumeMl % 0.1 !== 0 ? 2 : 1)} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>mL</span>
            </div>
          </div>

          {/* Temperature */}
          <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--bg-card, #fff)', border: '1px solid var(--border, #e2e8f0)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>{tDynamic('Temperature')}</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: mixture.temperatureC > 35 ? '#ea580c' : '#059669' }}>
              {mixture.temperatureC.toFixed(1)} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>°C</span>
              {mixture.temperatureC > 25.5 && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, marginLeft: 4, color: '#ea580c' }}>
                  (+{(mixture.temperatureC - 25.0).toFixed(1)}°C)
                </span>
              )}
            </div>
          </div>

          {/* pH */}
          <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--bg-card, #fff)', border: '1px solid var(--border, #e2e8f0)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>{tDynamic('pH Value')}</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: getPhColor(mixture.pH), display: 'flex', alignItems: 'center', gap: 6 }}>
              {mixture.pH.toFixed(2)}
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: 6,
                  color: '#fff',
                  backgroundColor: getPhColor(mixture.pH),
                  fontWeight: 700,
                }}
              >
                {mixture.pH < 6.5 ? tDynamic('Acidic') : mixture.pH > 7.5 ? tDynamic('Alkaline') : tDynamic('Neutral')}
              </span>
            </div>
          </div>

          {/* Precipitate Mass */}
          <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--bg-card, #fff)', border: '1px solid var(--border, #e2e8f0)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>{tDynamic('Precipitate')}</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: precipitateList.length > 0 ? '#d97706' : '#64748b' }}>
              {precipitateList.reduce((acc, p) => acc + p.grams, 0).toFixed(2)} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>g</span>
            </div>
          </div>

          {/* Effervescence */}
          <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--bg-card, #fff)', border: '1px solid var(--border, #e2e8f0)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>{tDynamic('Gas Evolution')}</div>
            <div style={{ fontSize: '1.0rem', fontWeight: 700, color: mixture.effervescenceRate > 0 ? '#3b82f6' : '#94a3b8' }}>
              {mixture.effervescenceRate > 0 ? `🫧 ${tDynamic(mixture.effervescenceGas ?? 'Gas')}` : tDynamic('None')}
            </div>
          </div>
        </div>

        {/* ── Active Hazard Alerts ── */}
        {mixture.activeHazards.length > 0 && (
          <div style={{ padding: '8px 24px', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626' }}>⚠️ {tDynamic('Lab Hazards Detected')}:</span>
            {mixture.activeHazards.map((haz, i) => (
              <span key={i} style={{ fontSize: '0.72rem', backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                {tDynamic(haz)}
              </span>
            ))}
          </div>
        )}

        {/* ── Navigation Tabs ── */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border, #cbd5e1)', backgroundColor: 'var(--bg-card, #fff)' }}>
          <button
            onClick={() => setActiveTab('composition')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'composition' ? 'var(--bg-card, #fff)' : 'transparent',
              borderBottom: activeTab === 'composition' ? '2px solid #2563eb' : 'none',
              fontWeight: activeTab === 'composition' ? 700 : 500,
              color: activeTab === 'composition' ? '#2563eb' : 'var(--text-secondary, #64748b)',
              cursor: 'pointer',
              fontSize: '0.88rem',
            }}
          >
            📊 {tDynamic('Chemical Composition')} ({dissolvedSpeciesList.length + precipitateList.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'history' ? 'var(--bg-card, #fff)' : 'transparent',
              borderBottom: activeTab === 'history' ? '2px solid #2563eb' : 'none',
              fontWeight: activeTab === 'history' ? 700 : 500,
              color: activeTab === 'history' ? '#2563eb' : 'var(--text-secondary, #64748b)',
              cursor: 'pointer',
              fontSize: '0.88rem',
            }}
          >
            📜 {tDynamic('Reaction Events & Explanations')} ({mixture.recentEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('test')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'test' ? 'var(--bg-card, #fff)' : 'transparent',
              borderBottom: activeTab === 'test' ? '2px solid #2563eb' : 'none',
              fontWeight: activeTab === 'test' ? 700 : 500,
              color: activeTab === 'test' ? '#2563eb' : 'var(--text-secondary, #64748b)',
              cursor: 'pointer',
              fontSize: '0.88rem',
            }}
          >
            ⚗️ {tDynamic('Add Any Chemical Reagent (Playground)')}
          </button>
        </div>

        {/* ── Tab Contents ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* TAB 1: CHEMICAL COMPOSITION */}
          {activeTab === 'composition' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Dissolved Aqueous Species */}
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-secondary, #64748b)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Dissolved Aqueous Reagents & Ions
                </h4>
                {dissolvedSpeciesList.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', backgroundColor: 'var(--bg-secondary, #f8fafc)', borderRadius: '10px' }}>
                    No dissolved chemical solutes in vessel.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border, #e2e8f0)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-secondary, #f1f5f9)', borderBottom: '1px solid var(--border, #cbd5e1)' }}>
                          <th style={{ padding: '8px 12px' }}>Species</th>
                          <th style={{ padding: '8px 12px' }}>Formula</th>
                          <th style={{ padding: '8px 12px' }}>Type</th>
                          <th style={{ padding: '8px 12px' }}>Amount (mmol)</th>
                          <th style={{ padding: '8px 12px' }}>Molarity (M)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dissolvedSpeciesList.map((item) => (
                          <tr key={item.id} style={{ borderBottom: '1px solid var(--border, #f1f5f9)' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.baseColor, display: 'inline-block', border: '1px solid rgba(0,0,0,0.2)' }} />
                              {item.name}
                            </td>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>
                              {item.formula}
                            </td>
                            <td style={{ padding: '10px 12px', textTransform: 'capitalize', color: 'var(--text-secondary, #64748b)' }}>
                              {item.type}
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 700 }}>
                              {item.milliMoles.toFixed(3)} mmol
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 700, color: '#059669' }}>
                              {item.molarity.toFixed(4)} M
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Insoluble Solid Precipitates */}
              {precipitateList.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Insoluble Solid Precipitates (Sediment)
                  </h4>
                  <div style={{ overflowX: 'auto', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'rgba(254, 243, 199, 0.6)', borderBottom: '1px solid rgba(217, 119, 6, 0.2)' }}>
                          <th style={{ padding: '8px 12px' }}>Precipitate Name</th>
                          <th style={{ padding: '8px 12px' }}>Formula</th>
                          <th style={{ padding: '8px 12px' }}>Mass Formed (g)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {precipitateList.map((item) => (
                          <tr key={item.id} style={{ borderBottom: '1px solid rgba(254, 243, 199, 0.4)' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: item.baseColor, display: 'inline-block', border: '1px solid rgba(0,0,0,0.2)' }} />
                              {item.name}
                            </td>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700 }}>
                              {item.formula}
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 800, color: '#d97706' }}>
                              {item.grams.toFixed(3)} g
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REACTION EVENTS & SCIENTIFIC EXPLANATIONS */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {mixture.recentEvents.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', backgroundColor: 'var(--bg-secondary, #f8fafc)', borderRadius: '12px' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔬</div>
                  <div>No chemical reactions have occurred in this vessel yet.</div>
                  <div style={{ fontSize: '0.78rem', marginTop: 4 }}>Add reactants or drop chemicals into the vessel to observe stoichiometry in action.</div>
                </div>
              ) : (
                mixture.recentEvents.map((evt, idx) => (
                  <div
                    key={evt.id ?? idx}
                    style={{
                      border: '1px solid var(--border, #cbd5e1)',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: 'var(--bg-card, #ffffff)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#2563eb' }}>
                          {evt.reactionName}
                        </h4>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, marginTop: 2, color: 'var(--text-primary, #0f172a)' }}>
                          {evt.equation}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 6,
                            backgroundColor: evt.deltaT > 0 ? '#fef3c7' : '#f1f5f9',
                            color: evt.deltaT > 0 ? '#b45309' : '#475569',
                          }}
                        >
                          ΔT: +{evt.deltaT.toFixed(1)}°C
                        </span>
                      </div>
                    </div>

                    {/* Stoichiometry Badges */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: '0.75rem' }}>
                      <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>
                        Limiting Reagent: {evt.limitingReagent} ({(evt.limitingMoles * 1000).toFixed(2)} mmol consumed)
                      </span>
                      {evt.excessReagents.map((ex, i) => (
                        <span key={i} style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>
                          Excess Reagent: {ex.name} ({(ex.remainingMoles * 1000).toFixed(2)} mmol left)
                        </span>
                      ))}
                      {evt.precipitateFormedGrams && (
                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>
                          Precipitate: {evt.precipitateName} ({evt.precipitateFormedGrams.toFixed(2)} g)
                        </span>
                      )}
                      {evt.gasEvolvedMl && (
                        <span style={{ backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>
                          Gas Evolved: {evt.gasName} (~{evt.gasEvolvedMl.toFixed(1)} mL)
                        </span>
                      )}
                    </div>

                    {/* Scientific Explanation Text */}
                    <div style={{ fontSize: '0.82rem', lineHeight: 1.45, color: 'var(--text-secondary, #334155)', backgroundColor: 'var(--bg-secondary, #f8fafc)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                      {evt.explanation}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: REAGENT PLAYGROUND */}
          {activeTab === 'test' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.82rem', color: '#1e40af' }}>
                💡 <strong>Explore "What If?":</strong> Test unscripted combinations, add reagents in excess, or mix arbitrary chemicals to discover their real physical, thermal, and visual consequences in this vessel.
              </div>

              <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Select Reagent */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary, #0f172a)' }}>
                    Select Chemical Reagent:
                  </label>
                  <select
                    value={selectedSubstance}
                    onChange={(e) => setSelectedSubstance(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border, #cbd5e1)',
                      backgroundColor: 'var(--bg-card, #fff)',
                      color: 'var(--text-primary, #0f172a)',
                      fontSize: '0.88rem',
                    }}
                  >
                    {Object.values(CHEMICAL_DATABASE).map((chem) => (
                      <option key={chem.id} value={chem.id}>
                        {chem.name} ({chem.formula}) — {chem.type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Inputs */}
                {isSolid ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary, #0f172a)' }}>
                      Mass Added (grams):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="50"
                      value={massGrams}
                      onChange={(e) => setMassGrams(parseFloat(e.target.value) || 0.1)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border, #cbd5e1)',
                        backgroundColor: 'var(--bg-card, #fff)',
                        color: 'var(--text-primary, #0f172a)',
                        fontSize: '0.88rem',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary, #0f172a)' }}>
                        Volume (mL):
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        max="100"
                        value={volumeMl}
                        onChange={(e) => setVolumeMl(parseFloat(e.target.value) || 1)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border, #cbd5e1)',
                          backgroundColor: 'var(--bg-card, #fff)',
                          color: 'var(--text-primary, #0f172a)',
                          fontSize: '0.88rem',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary, #0f172a)' }}>
                        Concentration (Molarity M):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.001"
                        max="5.0"
                        value={molarity}
                        onChange={(e) => setMolarity(parseFloat(e.target.value) || 0.1)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border, #cbd5e1)',
                          backgroundColor: 'var(--bg-card, #fff)',
                          color: 'var(--text-primary, #0f172a)',
                          fontSize: '0.88rem',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Chemical Species Info Card */}
                {selectedSpecies && (
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary, #f8fafc)', border: '1px solid var(--border, #e2e8f0)', fontSize: '0.78rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>{selectedSpecies.name} ({selectedSpecies.formula})</div>
                    <div style={{ color: 'var(--text-secondary, #64748b)', marginTop: 2 }}>{selectedSpecies.description}</div>
                    {selectedSpecies.hazards.length > 0 && (
                      <div style={{ color: '#dc2626', marginTop: 4, fontWeight: 600 }}>
                        Hazards: {selectedSpecies.hazards.join(' • ')}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  ➕ Pour Reagent into {vesselLabel}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--border, #cbd5e1)',
            backgroundColor: 'var(--bg-secondary, #f8fafc)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)' }}>
            100% Deterministic Client-Side Physical & Chemical Solver
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: '1px solid var(--border, #cbd5e1)',
              backgroundColor: 'var(--bg-card, #fff)',
              color: 'var(--text-primary, #0f172a)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
