import React, { useState } from 'react';
import type { ConservationState } from '../../engine/conservationState';
import { ConservationStep } from '../../engine/conservationState';

interface MolecularReactionChainProps {
  state: ConservationState;
}

/**
 * Compact, High-Definition Molecular Reaction Chamber.
 * Clean, responsive design that never overlaps with controls.
 */
const MolecularReactionChain: React.FC<MolecularReactionChainProps> = ({ state }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ions' | 'equation' | 'spectator'>('ions');

  const isPreReaction = !state.reactantsMixed && !state.precipitateFormed;
  const isReacting = state.isMixing;
  const isPostReaction = state.precipitateFormed || state.reactantsMixed;

  if (state.step === ConservationStep.SETUP_FLASK && !state.na2so4Poured) {
    return null;
  }

  return (
    <div
      id="molecular-reaction-hud"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '6px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #091124 0%, #0f172a 100%)',
        border: '1px solid #1e293b',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        color: '#f8fafc',
        fontFamily: 'var(--font-sans)',
        flexShrink: 0,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: isCollapsed ? 'none' : '1px solid #1e293b',
          cursor: 'pointer',
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isPostReaction ? '#10b981' : isReacting ? '#f59e0b' : '#38bdf8',
              boxShadow: `0 0 8px ${isPostReaction ? '#10b981' : isReacting ? '#f59e0b' : '#38bdf8'}`,
            }}
          />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc' }}>
            🔬 Live Ion Exchange Chamber
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '12px',
              background: isPostReaction ? 'rgba(16, 185, 129, 0.2)' : isReacting ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
              color: isPostReaction ? '#34d399' : isReacting ? '#fbbf24' : '#38bdf8',
              border: `1px solid ${isPostReaction ? '#059669' : isReacting ? '#d97706' : '#0284c7'}`,
            }}
          >
            {isPostReaction ? 'BaSO₄↓ Precipitate Formed' : isReacting ? '⚡ Reacting...' : 'Hydrated Reactants Ready'}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          style={{
            all: 'unset',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: '#94a3b8',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          {isCollapsed ? '▼ Show Reaction' : '▲ Minimize'}
        </button>
      </div>

      {/* Main Content */}
      {!isCollapsed && (
        <div style={{ padding: '8px 12px' }}>
          {/* Reaction Equation Row */}
          <div
            style={{
              background: '#070d1e',
              border: '1px solid #1e293b',
              borderRadius: '6px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 6,
              marginBottom: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>BaCl₂</span>
              <span style={{ color: '#64748b' }}>+</span>
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>Na₂SO₄</span>
              <span style={{ color: '#f8fafc', fontWeight: 900 }}>⟶</span>
              <span style={{ color: '#ffffff', fontWeight: 800, background: 'rgba(255, 255, 255, 0.1)', padding: '1px 4px', borderRadius: 3, border: '1px solid #ffffff' }}>
                BaSO₄↓
              </span>
              <span style={{ color: '#64748b' }}>+</span>
              <span style={{ color: '#a78bfa', fontWeight: 700 }}>2NaCl</span>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', gap: 3 }}>
              <button
                onClick={() => setActiveTab('ions')}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: 3,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  background: activeTab === 'ions' ? '#0284c7' : 'transparent',
                  color: activeTab === 'ions' ? '#ffffff' : '#94a3b8',
                }}
              >
                ⚛️ Ions
              </button>
              <button
                onClick={() => setActiveTab('equation')}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: 3,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  background: activeTab === 'equation' ? '#0284c7' : 'transparent',
                  color: activeTab === 'equation' ? '#ffffff' : '#94a3b8',
                }}
              >
                📝 Net Ionic
              </button>
              <button
                onClick={() => setActiveTab('spectator')}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: 3,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  background: activeTab === 'spectator' ? '#0284c7' : 'transparent',
                  color: activeTab === 'spectator' ? '#ffffff' : '#94a3b8',
                }}
              >
                👀 Spectators
              </button>
            </div>
          </div>

          {/* TAB 1: Ion Animation Stage */}
          {activeTab === 'ions' && (
            <div
              style={{
                background: '#050a17',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                minHeight: '65px',
              }}
            >
              {isPreReaction && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
                  <div
                    style={{
                      background: 'rgba(56, 189, 248, 0.04)',
                      border: '1px dashed rgba(56, 189, 248, 0.25)',
                      borderRadius: 6,
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>🧫 BaCl₂ (aq)</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#0284c7', color: '#fff', fontSize: '0.62rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Ba²⁺
                      </span>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#16a34a', color: '#fff', fontSize: '0.55rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Cl⁻
                      </span>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#16a34a', color: '#fff', fontSize: '0.55rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Cl⁻
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(251, 191, 36, 0.04)',
                      border: '1px dashed rgba(251, 191, 36, 0.25)',
                      borderRadius: 6,
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: 700 }}>⚗️ Na₂SO₄ (aq)</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#d97706', color: '#fff', fontSize: '0.58rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        SO₄²⁻
                      </span>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#7c3aed', color: '#fff', fontSize: '0.55rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Na⁺
                      </span>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#7c3aed', color: '#fff', fontSize: '0.55rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Na⁺
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isReacting && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, width: '100%' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#0284c7', color: '#fff', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'bounce 0.6s ease infinite' }}>
                    Ba²⁺
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 900 }}>⚡ ➔ 💥 ⚡</span>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#d97706', color: '#fff', fontSize: '0.62rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'bounce 0.6s ease infinite' }}>
                    SO₄²⁻
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 600 }}>
                    Insoluble BaSO₄ lattice bonding
                  </span>
                </div>
              )}

              {isPostReaction && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.06)', border: '1px solid #ffffff', borderRadius: 6, padding: '4px 10px' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#0284c7', color: '#fff', fontSize: '0.55rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ba²⁺</span>
                    <span style={{ width: 8, height: 3, background: '#fff', borderRadius: 1 }} />
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#d97706', color: '#fff', fontSize: '0.52rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SO₄²⁻</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff' }}>BaSO₄(s) ↓ Precipitate</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(167, 139, 250, 0.05)', border: '1px solid #475569', borderRadius: 6, padding: '4px 8px' }}>
                    <span style={{ fontSize: '0.62rem', color: '#a78bfa', fontWeight: 700 }}>Spectators:</span>
                    <span style={{ padding: '1px 5px', borderRadius: 3, background: '#7c3aed', color: '#fff', fontSize: '0.58rem', fontWeight: 700 }}>Na⁺</span>
                    <span style={{ padding: '1px 5px', borderRadius: 3, background: '#16a34a', color: '#fff', fontSize: '0.58rem', fontWeight: 700 }}>Cl⁻</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Net Ionic */}
          {activeTab === 'equation' && (
            <div style={{ background: '#050a17', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px 10px', fontSize: '0.68rem' }}>
              <div style={{ color: '#94a3b8', marginBottom: 2 }}>Complete Ionic:</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: '#e2e8f0', marginBottom: 4 }}>
                Ba²⁺(aq) + 2Cl⁻(aq) + 2Na⁺(aq) + SO₄²⁻(aq) ⟶ BaSO₄(s)↓ + 2Na⁺(aq) + 2Cl⁻(aq)
              </div>
              <div style={{ color: '#4ade80', fontWeight: 700 }}>Net Ionic Equation: Ba²⁺(aq) + SO₄²⁻(aq) ⟶ BaSO₄(s)↓</div>
            </div>
          )}

          {/* TAB 3: Spectators */}
          {activeTab === 'spectator' && (
            <div style={{ background: '#050a17', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px 10px', fontSize: '0.64rem', color: '#cbd5e1', lineHeight: 1.3 }}>
              Spectator ions (<span style={{ color: '#a78bfa', fontWeight: 700 }}>Na⁺</span> and <span style={{ color: '#4ade80', fontWeight: 700 }}>Cl⁻</span>) do not participate in precipitate formation and remain unchanged in solution, proving mass is conserved.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MolecularReactionChain;
