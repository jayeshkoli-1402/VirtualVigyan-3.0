import React, { useState } from 'react';

interface TheoryNotesViewProps {
  onBackToHome: () => void;
  onLaunchExperiment: (id: string) => void;
}

export const TheoryNotesView: React.FC<TheoryNotesViewProps> = ({
  onBackToHome,
  onLaunchExperiment,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('viscosity');

  const topics = [
    {
      id: 'viscosity',
      title: "Viscosity by Ostwald's Viscometer",
      classLevel: 'Class 11 / F.Y. B.Tech',
      expId: 'viscosity-ostwald',
      formula: 'η_A = (t_A · d_A) / (t_W · d_W) · η_W',
      theory:
        'Viscosity is the internal resistance of a liquid to flow. Ostwald’s viscometer uses Poiseuille’s Law to determine the relative viscosity of a test liquid compared to water by measuring their respective flow times between two marked etchings under identical pressure heads.',
      reactions: ['No chemical reaction (purely physical property determination).'],
      viva: [
        { q: 'What is Poiseuille’s equation?', a: 'η = (π · P · r⁴ · t) / (8 · V · l), where r is capillary radius and l is length.' },
        { q: 'Why is a constant-temperature water bath required?', a: 'Viscosity of liquids decreases rapidly with increasing temperature (approx. 2% per °C).' },
      ],
    },
    {
      id: 'ph-metric',
      title: 'pH-Metric Titration (Acid–Base)',
      classLevel: 'Class 11 / Engineering Chemistry',
      expId: 'ph-metric-titration',
      formula: 'pH = -log₁₀[H⁺], at equivalence ΔpH/ΔV is maximum',
      theory:
        'pH-metric titration measures the electromotive force (EMF) of a glass-calomel electrode cell as a strong base is incrementally added to a strong acid. The point of inflection on the sigmoidal titration curve corresponds precisely to the stoichiometric equivalence point.',
      reactions: ['HCl (aq) + NaOH (aq) → NaCl (aq) + H₂O (l)'],
      viva: [
        { q: 'What is the composition of the glass electrode membrane?', a: 'A thin bulb of lithium- or sodium-doped silicate glass that generates potential proportional to [H⁺].' },
        { q: 'How is the exact endpoint located from the curve?', a: 'By plotting the first derivative curve (ΔpH/ΔV vs V) which shows a sharp peak at the equivalence point.' },
      ],
    },
    {
      id: 'conductometry',
      title: 'Conductometric Titration (HCl vs NaOH)',
      classLevel: 'Class 12 / Engineering Chemistry',
      expId: 'conductometric-titration',
      formula: 'G = κ · (A / l), equivalent conductance λ = 1000 · κ / C',
      theory:
        'The conductance of an electrolyte solution depends on ion concentration and ionic mobility. Fast-moving H⁺ ions (λ = 349.8 S·cm²/mol) are replaced by slower Na⁺ ions (λ = 50.1 S·cm²/mol), causing conductance to fall sharply until the equivalence point, after which excess OH⁻ ions (λ = 198.5 S·cm²/mol) cause conductance to rise.',
      reactions: ['H⁺ (aq) + Cl⁻ (aq) + Na⁺ (aq) + OH⁻ (aq) → Na⁺ (aq) + Cl⁻ (aq) + H₂O (l)'],
      viva: [
        { q: 'Why does conductance decrease before endpoint?', a: 'Because highly mobile hydronium ions (H⁺) are replaced by slower sodium ions (Na⁺).' },
        { q: 'Why does conductance rise after endpoint?', a: 'Because excess added NaOH contributes free fast-moving hydroxyl ions (OH⁻).' },
      ],
    },
    {
      id: 'mohr',
      title: "Chloride Content by Mohr's Method",
      classLevel: 'Class 12 / Analytical Chemistry',
      expId: 'chloride-mohr-method',
      formula: 'Cl⁻ (ppm) = [(V_sample - V_blank) × N_AgNO3 × 35.45 × 1000] / V_sample',
      theory:
        'Mohr’s method is an argentometric precipitation titration where chloride ions are precipitated as white silver chloride. When all chloride is consumed, excess silver ions react with potassium chromate indicator to form a brick-red silver chromate precipitate.',
      reactions: [
        'Ag⁺ + Cl⁻ → AgCl (white precipitate, Ksp = 1.8 × 10⁻¹⁰)',
        '2Ag⁺ + CrO₄²⁻ → Ag₂CrO₄ (brick-red precipitate, Ksp = 1.2 × 10⁻¹²)',
      ],
      viva: [
        { q: 'Why must the solution pH be kept between 6.5 and 9.0?', a: 'In acidic solution, chromate converts to dichromate. In basic solution (pH > 10), silver precipitates as AgOH/Ag₂O.' },
        { q: 'Why is an indicator blank titration required?', a: 'A finite volume of AgNO₃ is needed to yield sufficient Ag₂CrO₄ for visible brick-red coloration.' },
      ],
    },
    {
      id: 'edta',
      title: 'Water Hardness by Complexometric EDTA',
      classLevel: 'Class 11 / Water Technology',
      expId: 'water-hardness-edta',
      formula: 'Total Hardness (ppm CaCO₃) = (V_EDTA × M_EDTA × 100,000) / V_sample',
      theory:
        'Disodium ethylenediaminetetraacetate (EDTA) forms 1:1 hexadentate chelate complexes with Ca²⁺ and Mg²⁺ at pH 10. Eriochrome Black T (EBT) indicator forms a wine-red complex with free metal ions, which turns sharp steel blue at the endpoint when EDTA chelates all metal ions.',
      reactions: [
        'M²⁺ + EBT (blue) → [M-EBT] (wine-red)',
        '[M-EBT] (wine-red) + EDTA (free) → [M-EDTA] (colorless chelate) + EBT (steel blue)',
      ],
      viva: [
        { q: 'Why is NH₄Cl/NH₄OH buffer used at pH 10?', a: 'EDTA forms stable calcium and magnesium complexes at pH 10 without precipitating magnesium hydroxide.' },
        { q: 'What is the chelating denticity of EDTA?', a: 'Hexadentate (4 carboxyl oxygen atoms and 2 amino nitrogen atoms).' },
      ],
    },
  ];

  const current = topics.find((t) => t.id === selectedTopic) || topics[0];

  return (
    <div className="animate-fade-in" style={{ padding: '4px 0 40px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <button
            onClick={onBackToHome}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.8125rem',
              color: '#2563eb',
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            ← Back to Dashboard
          </button>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0 }}>
            Theory, Formulas & Practical Notes
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Comprehensive laboratory references, chemical reaction equations, and viva voce questions.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Topic Selector (Left) + Detail Reader (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
        {/* Left Topic List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {topics.map((t) => {
            const isSel = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: isSel ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-card)',
                  border: isSel ? '1.5px solid #2563eb' : '1px solid var(--border)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: isSel ? 700 : 600, color: isSel ? '#2563eb' : 'var(--text-primary)' }}>
                  {t.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {t.classLevel}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detail Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '28px 32px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#2563eb',
                  background: 'rgba(37, 99, 235, 0.08)',
                  padding: '3px 10px',
                  borderRadius: 9999,
                }}
              >
                {current.classLevel}
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '10px 0 4px' }}>
                {current.title}
              </h3>
            </div>

            <button
              onClick={() => onLaunchExperiment(current.expId)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                background: '#2563eb',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: '0.8125rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              }}
            >
              Launch Practical Simulation →
            </button>
          </div>

          {/* Formula Box */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '14px 18px',
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Working Mathematical Formula
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 700, color: '#0284c7', marginTop: 4 }}>
              {current.formula}
            </div>
          </div>

          {/* Theoretical Principle */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Theoretical Principle
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {current.theory}
            </p>
          </div>

          {/* Chemical Reactions */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Balanced Chemical Reactions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {current.reactions.map((rxn, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--bg-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  {rxn}
                </div>
              ))}
            </div>
          </div>

          {/* Viva Voce Questions */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
              Frequently Asked Viva Voce Questions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {current.viva.map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Q{i + 1}: {v.q}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                    <strong>Ans:</strong> {v.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
