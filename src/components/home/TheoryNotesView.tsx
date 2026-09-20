import React, { useState } from 'react';
import { MathFormula } from '../common/MathFormula';
import { TitrationGraph } from '../common/TitrationGraph';

interface TheoryNotesViewProps {
  onBackToHome: () => void;
  onLaunchExperiment: (id: string) => void;
}

/* ── Topic Data ── */

interface VivaItem {
  q: string;
  a: string;
  /** Optional LaTeX in the answer */
  aTex?: string;
}

interface Topic {
  id: string;
  title: string;
  classLevel: string;
  expId: string;
  /** LaTeX formula string */
  formulaTex: string;
  /** Optional secondary formulas */
  secondaryFormulas?: { label: string; tex: string }[];
  theory: string;
  reactions: string[];
  viva: VivaItem[];
  /** Graph type to render (if applicable) */
  graphType?: 'ph-titration' | 'conductometric' | 'viscosity-comparison' | 'do-titration' | 'acidity-titration' | 'alkalinity-titration';
  /** Key concepts list */
  keyConcepts?: string[];
}

const topics: Topic[] = [
  // ─── 1. Viscosity ───
  {
    id: 'viscosity',
    title: "Viscosity by Ostwald's Viscometer",
    classLevel: 'F.Y. B.Tech / Engineering Chemistry',
    expId: 'viscosity-ostwald',
    formulaTex: '\\eta_A = \\frac{t_A \\cdot d_A}{t_W \\cdot d_W} \\cdot \\eta_W',
    secondaryFormulas: [
      { label: "Poiseuille's Equation", tex: '\\eta = \\frac{\\pi P r^4 t}{8 V l}' },
    ],
    theory:
      "Viscosity is the internal resistance of a liquid to flow. Ostwald's viscometer uses Poiseuille's Law to determine the relative viscosity of a test liquid compared to water by measuring their respective flow times between two marked etchings under identical pressure heads. The relative viscosity is directly proportional to the ratio of flow times and densities.",
    reactions: ['No chemical reaction (purely physical property determination).'],
    graphType: 'viscosity-comparison',
    keyConcepts: [
      'Viscosity decreases ~2% per °C — constant-temperature water bath is essential',
      'Relative viscosity is dimensionless',
      'Ostwald viscometer measures kinematic viscosity',
    ],
    viva: [
      { q: "What is Poiseuille's equation?", a: '', aTex: '\\eta = \\frac{\\pi \\cdot P \\cdot r^4 \\cdot t}{8 \\cdot V \\cdot l}' },
      { q: 'Why is a constant-temperature water bath required?', a: 'Viscosity of liquids decreases rapidly with increasing temperature (approx. 2% per °C).' },
      { q: 'What is the SI unit of viscosity?', a: 'Pascal-second (Pa·s). The CGS unit is poise (1 Pa·s = 10 poise).' },
    ],
  },

  // ─── 2. pH-Metric Titration ───
  {
    id: 'ph-metric',
    title: 'pH-Metric Titration (Acid–Base)',
    classLevel: 'F.Y. B.Tech / Engineering Chemistry',
    expId: 'ph-metric-titration',
    formulaTex: '\\text{pH} = -\\log_{10}[\\text{H}^+]',
    secondaryFormulas: [
      { label: 'At equivalence', tex: '\\frac{\\Delta \\text{pH}}{\\Delta V} \\text{ is maximum}' },
      { label: 'Strength of acid', tex: 'N_1 V_1 = N_2 V_2' },
    ],
    theory:
      'pH-metric titration measures the electromotive force (EMF) of a glass-calomel electrode cell as a strong base is incrementally added to a strong acid. The point of inflection on the sigmoidal titration curve corresponds precisely to the stoichiometric equivalence point. The first derivative curve (ΔpH/ΔV vs V) shows a sharp peak at the equivalence point.',
    reactions: ['HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)'],
    graphType: 'ph-titration',
    keyConcepts: [
      'Glass electrode generates potential proportional to [H⁺]',
      'Sigmoidal curve — steep rise at equivalence',
      'First derivative method gives exact endpoint',
    ],
    viva: [
      { q: 'What is the composition of the glass electrode membrane?', a: 'A thin bulb of lithium- or sodium-doped silicate glass that generates a potential proportional to [H⁺].' },
      { q: 'How is the exact endpoint located from the curve?', a: 'By plotting the first derivative curve (ΔpH/ΔV vs V) which shows a sharp peak at the equivalence point.' },
      { q: 'Why is pH-metric titration preferred over indicator-based titration?', a: 'It is more accurate for coloured/turbid solutions and can detect multiple endpoints in polyprotic acids.' },
    ],
  },

  // ─── 3. Conductometric Titration ───
  {
    id: 'conductometry',
    title: 'Conductometric Titration (HCl vs NaOH)',
    classLevel: 'F.Y. B.Tech / Engineering Chemistry',
    expId: 'conductometric-titration',
    formulaTex: 'G = \\kappa \\cdot \\frac{A}{l}',
    secondaryFormulas: [
      { label: 'Equivalent conductance', tex: '\\Lambda = \\frac{1000 \\cdot \\kappa}{C}' },
      { label: 'Ionic mobilities', tex: '\\lambda_{H^+} = 349.8,\\; \\lambda_{Na^+} = 50.1,\\; \\lambda_{OH^-} = 198.5 \\;\\text{S·cm}^2\\text{/mol}' },
    ],
    theory:
      'The conductance of an electrolyte solution depends on ion concentration and ionic mobility. Fast-moving H⁺ ions (λ = 349.8 S·cm²/mol) are replaced by slower Na⁺ ions (λ = 50.1 S·cm²/mol), causing conductance to fall sharply until the equivalence point. After the equivalence point, excess OH⁻ ions (λ = 198.5 S·cm²/mol) cause conductance to rise, producing a characteristic V-shape.',
    reactions: ['H⁺(aq) + Cl⁻(aq) + Na⁺(aq) + OH⁻(aq) → Na⁺(aq) + Cl⁻(aq) + H₂O(l)'],
    graphType: 'conductometric',
    keyConcepts: [
      'Conductance decreases before endpoint: fast H⁺ replaced by slow Na⁺',
      'Conductance increases after endpoint: excess fast OH⁻ ions',
      'V-shaped plot — intersection gives endpoint',
    ],
    viva: [
      { q: 'Why does conductance decrease before endpoint?', a: 'Because highly mobile hydronium ions (H⁺) are replaced by slower sodium ions (Na⁺).' },
      { q: 'Why does conductance rise after endpoint?', a: 'Because excess added NaOH contributes free fast-moving hydroxyl ions (OH⁻).' },
      { q: 'What is the advantage of conductometric over visual titration?', a: 'Applicable to coloured, turbid solutions and very dilute solutions where indicators fail.' },
    ],
  },

  // ─── 4. Mohr's Method ───
  {
    id: 'mohr',
    title: "Chloride Content by Mohr's Method",
    classLevel: 'F.Y. B.Tech / Analytical Chemistry',
    expId: 'chloride-mohr-method',
    formulaTex: '\\text{Cl}^- \\text{(ppm)} = \\frac{(V_{\\text{sample}} - V_{\\text{blank}}) \\times N_{\\text{AgNO}_3} \\times 35.45 \\times 1000}{V_{\\text{sample}}}',
    theory:
      "Mohr's method is an argentometric precipitation titration where chloride ions are precipitated as white silver chloride. When all chloride is consumed, excess silver ions react with potassium chromate indicator to form a brick-red silver chromate precipitate, marking the endpoint.",
    reactions: [
      'Ag⁺ + Cl⁻ → AgCl↓ (white, Ksp = 1.8 × 10⁻¹⁰)',
      '2Ag⁺ + CrO₄²⁻ → Ag₂CrO₄↓ (brick-red, Ksp = 1.2 × 10⁻¹²)',
    ],
    keyConcepts: [
      'pH must be 6.5–9.0 for chromate indicator to work',
      'Blank titration corrects for indicator error',
      'AgCl precipitates first (lower Ksp product at reaction conditions)',
    ],
    viva: [
      { q: 'Why must the solution pH be kept between 6.5 and 9.0?', a: 'In acidic solution, chromate converts to dichromate. In basic solution (pH > 10), silver precipitates as AgOH/Ag₂O.' },
      { q: 'Why is an indicator blank titration required?', a: 'A finite volume of AgNO₃ is needed to yield sufficient Ag₂CrO₄ for visible brick-red coloration.' },
      { q: 'Can this method be used for bromide and iodide determination?', a: 'Yes, but the endpoint is less sharp for iodide due to strong adsorption of I⁻ on AgI.' },
    ],
  },

  // ─── 5. EDTA Water Hardness ───
  {
    id: 'edta',
    title: 'Water Hardness by Complexometric EDTA',
    classLevel: 'F.Y. B.Tech / Water Technology',
    expId: 'water-hardness-edta',
    formulaTex: '\\text{Total Hardness (ppm CaCO}_3\\text{)} = \\frac{V_{\\text{EDTA}} \\times M_{\\text{EDTA}} \\times 100{,}000}{V_{\\text{sample}}}',
    secondaryFormulas: [
      { label: 'Permanent hardness', tex: '\\text{Permanent} = \\text{Total} - \\text{Temporary}' },
    ],
    theory:
      'Disodium EDTA forms 1:1 hexadentate chelate complexes with Ca²⁺ and Mg²⁺ at pH 10. Eriochrome Black T (EBT) indicator forms a wine-red complex with free metal ions, which turns sharp steel blue at the endpoint when EDTA chelates all metal ions. Temporary hardness is removed by boiling (decomposes bicarbonates).',
    reactions: [
      'M²⁺ + EBT (blue) → [M-EBT] (wine-red)',
      '[M-EBT] (wine-red) + EDTA → [M-EDTA] (colorless) + EBT (steel blue)',
    ],
    keyConcepts: [
      'EDTA is hexadentate (4 carboxyl O + 2 amino N)',
      'pH 10 buffer prevents Mg(OH)₂ precipitation',
      'Temporary hardness = bicarbonates, removed by boiling',
    ],
    viva: [
      { q: 'Why is NH₄Cl/NH₄OH buffer used at pH 10?', a: 'EDTA forms stable calcium and magnesium complexes at pH 10 without precipitating magnesium hydroxide.' },
      { q: 'What is the chelating denticity of EDTA?', a: 'Hexadentate — 4 carboxyl oxygen atoms and 2 amino nitrogen atoms coordinate to the metal ion.' },
      { q: 'How do you distinguish temporary and permanent hardness?', a: 'Boil the sample: temporary hardness (bicarbonates) decomposes. The remaining hardness after boiling is permanent.' },
    ],
  },

  // ─── 6. Water Acidity ───
  {
    id: 'water-acidity',
    title: 'Acidity of Water Sample',
    classLevel: 'F.Y. B.Tech / Water Technology',
    expId: 'water-acidity',
    formulaTex: '\\text{Mineral Acidity (ppm)} = Y \\times 10',
    secondaryFormulas: [
      { label: 'Total Acidity', tex: '\\text{Total Acidity (ppm)} = Z \\times 10' },
      { label: 'CO₂ Acidity', tex: '\\text{CO}_2 \\text{ Acidity} = (Z - Y) \\times 10 \\text{ ppm}' },
    ],
    theory:
      'Acidity of water is caused by mineral acids (HCl, H₂SO₄, HNO₃) and dissolved CO₂. Mineral acidity is determined by titrating with N/50 NaOH using methyl orange indicator (endpoint at pH 4.5). Total acidity is determined by continuing with phenolphthalein indicator (endpoint at pH 8.3). The difference gives CO₂ acidity.',
    reactions: [
      'HCl + NaOH → NaCl + H₂O (mineral acidity, pH 4.5)',
      'CO₂ + 2NaOH → Na₂CO₃ + H₂O (CO₂ acidity, pH 8.3)',
    ],
    graphType: 'acidity-titration',
    keyConcepts: [
      'Methyl orange changes at pH 4.5 (mineral acidity endpoint)',
      'Phenolphthalein changes at pH 8.3 (total acidity endpoint)',
      'High acidity corrodes pipes and harms aquatic life',
    ],
    viva: [
      { q: 'What causes acidity in water?', a: 'Mineral acids (HCl, H₂SO₄, HNO₃), dissolved CO₂, and organic acids from decomposition of organic matter.' },
      { q: 'Why are two indicators used?', a: 'Methyl orange detects strong mineral acids (pH 4.5), while phenolphthalein detects weak CO₂ acidity (pH 8.3).' },
      { q: 'What is the acceptable limit of acidity in drinking water?', a: 'Ideally zero mineral acidity; total acidity should be below 50 ppm as CaCO₃ equivalent.' },
    ],
  },

  // ─── 7. Water Alkalinity ───
  {
    id: 'water-alkalinity',
    title: 'Determination of Alkalinity of Water',
    classLevel: 'F.Y. B.Tech / Water Technology',
    expId: 'water-alkalinity',
    formulaTex: 'P = A \\times 10 \\text{ ppm},\\quad M = (A + B) \\times 10 \\text{ ppm}',
    secondaryFormulas: [
      { label: 'Alkalinity classification', tex: '\\text{If } P = 0: \\text{only HCO}_3^-;\\quad \\text{If } 2P < M: \\text{CO}_3^{2-} + \\text{HCO}_3^-' },
    ],
    theory:
      'Alkalinity in water is due to OH⁻, CO₃²⁻, and HCO₃⁻ ions. Phenolphthalein alkalinity (P) is measured by titrating with N/50 H₂SO₄ until pH 8.3 (pink → colorless). Total alkalinity (M) continues with methyl orange to pH 4.5 (yellow → orange). The relationship between P and M reveals which alkalinity species are present.',
    reactions: [
      'OH⁻ + H⁺ → H₂O',
      'CO₃²⁻ + H⁺ → HCO₃⁻ (at pH 8.3)',
      'HCO₃⁻ + H⁺ → H₂CO₃ → CO₂↑ + H₂O (at pH 4.5)',
    ],
    graphType: 'alkalinity-titration',
    keyConcepts: [
      'P alkalinity = OH⁻ + ½CO₃²⁻',
      'M alkalinity = OH⁻ + CO₃²⁻ + HCO₃⁻',
      'Five possible alkalinity combinations based on P vs M ratio',
    ],
    viva: [
      { q: 'What ions cause alkalinity in water?', a: 'Hydroxide (OH⁻), carbonate (CO₃²⁻), and bicarbonate (HCO₃⁻) ions.' },
      { q: 'How do you determine which type of alkalinity is present?', a: 'Compare P and M values: if P = 0, only bicarbonate; if P = M, only hydroxide; if 2P = M, only carbonate, etc.' },
      { q: 'Why does alkalinity matter in water treatment?', a: 'It acts as a buffer against pH changes and is essential for coagulation/flocculation processes in water treatment.' },
    ],
  },

  // ─── 8. Acid Value of Oil ───
  {
    id: 'acid-value',
    title: 'Acid Value of Vegetable Oil',
    classLevel: 'F.Y. B.Tech / Engineering Chemistry',
    expId: 'fy-chem-acid-value-oil',
    formulaTex: '\\text{Acid Value} = \\frac{V \\times N \\times 56.1}{W}',
    secondaryFormulas: [
      { label: '% Free Fatty Acid (as Oleic)', tex: '\\%\\text{FFA} = \\frac{V \\times N \\times 28.2}{W}' },
    ],
    theory:
      'Acid value measures the free fatty acid (FFA) content of an oil, indicating the degree of hydrolytic rancidity. The oil sample is dissolved in a neutral ethanol-ether mixture and titrated with standard 0.1 N KOH using phenolphthalein indicator. Higher acid value indicates greater degradation and rancidity of the oil.',
    reactions: [
      'RCOOH + KOH → RCOOK + H₂O',
      '(Free fatty acid + Alkali → Soap + Water)',
    ],
    keyConcepts: [
      '56.1 = molecular weight of KOH',
      'Neutral solvent ensures no false acidity',
      'Acid value < 1 mg KOH/g for fresh edible oil',
    ],
    viva: [
      { q: 'What does acid value indicate about oil quality?', a: 'It measures the degree of hydrolytic rancidity — higher acid value means more free fatty acids and greater degradation.' },
      { q: 'Why is the ethanol-ether solvent neutralized before use?', a: 'To ensure any acidity detected comes only from the oil sample, not from the solvent.' },
      { q: 'What is the acceptable acid value for edible oil?', a: 'Less than 1 mg KOH/g for fresh refined oil. Above 4 mg KOH/g, the oil is considered rancid.' },
    ],
  },

  // ─── 9. Dissolved Oxygen (Winkler) ───
  {
    id: 'dissolved-oxygen',
    title: "Dissolved Oxygen by Winkler's Method",
    classLevel: 'F.Y. B.Tech / Water Technology',
    expId: 'dissolved-oxygen-winkler',
    formulaTex: '\\text{DO (ppm)} = \\frac{V_2 \\times N \\times 8 \\times 1000}{V_{\\text{sample}}}',
    secondaryFormulas: [
      { label: 'Simplified', tex: '\\text{DO} = 0.8 \\times V_2 \\text{ ppm}' },
    ],
    theory:
      "Winkler's method is an iodometric technique for dissolved oxygen. MnSO₄ and alkaline KI are added to fix the dissolved oxygen as brown MnO(OH)₂ precipitate. Upon acidification, the precipitate liberates iodine in proportion to the dissolved oxygen. The liberated iodine is titrated with standard Na₂S₂O₃ using starch indicator (deep blue → colorless endpoint).",
    reactions: [
      'Mn²⁺ + 2OH⁻ → Mn(OH)₂↓ (white)',
      '2Mn(OH)₂ + O₂ → 2MnO(OH)₂↓ (brown)',
      'MnO(OH)₂ + 2I⁻ + 4H⁺ → Mn²⁺ + I₂ + 3H₂O',
      'I₂ + 2S₂O₃²⁻ → S₄O₆²⁻ + 2I⁻ (starch: blue → colorless)',
    ],
    graphType: 'do-titration',
    keyConcepts: [
      'Oxygen is "fixed" as insoluble MnO(OH)₂',
      'Iodine liberated is stoichiometrically equivalent to DO',
      'Starch indicator gives sharp blue → colorless endpoint',
    ],
    viva: [
      { q: 'Why is MnSO₄ added first?', a: 'To form Mn(OH)₂ which reacts with dissolved oxygen to form MnO(OH)₂, effectively "fixing" the oxygen.' },
      { q: 'What is the role of starch indicator?', a: 'Starch forms a deep blue complex with iodine, providing a sharp endpoint when all I₂ is consumed by thiosulphate.' },
      { q: 'What is the typical DO level for healthy aquatic life?', a: 'Above 5 ppm. Below 4 ppm causes stress, and below 2 ppm is lethal to most fish species.' },
    ],
  },

  // ─── 10. Zinc + Dilute H₂SO₄ ───
  {
    id: 'zinc-acid',
    title: 'Zinc + Dilute Sulphuric Acid',
    classLevel: 'Class 10 / NCERT Chemistry',
    expId: 'zinc-acid-reaction',
    formulaTex: '\\text{Zn} + \\text{H}_2\\text{SO}_4 \\rightarrow \\text{ZnSO}_4 + \\text{H}_2\\uparrow',
    theory:
      'When zinc granules are added to dilute sulphuric acid, a single displacement reaction occurs. Zinc being more reactive than hydrogen displaces it from the acid. Hydrogen gas is evolved, which can be confirmed by the "pop sound" test with a burning matchstick. The remaining solution contains zinc sulphate.',
    reactions: [
      'Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂↑(g)',
      'Test: H₂ gas burns with a "pop" sound near a flame',
    ],
    keyConcepts: [
      'Single displacement (substitution) reaction',
      'Zinc is above hydrogen in the reactivity series',
      'Exothermic reaction — test tube becomes warm',
    ],
    viva: [
      { q: 'What type of reaction is this?', a: 'Single displacement (substitution) reaction — zinc displaces hydrogen from the acid.' },
      { q: 'How do you test for hydrogen gas?', a: 'Bring a burning matchstick near the mouth of the test tube — H₂ burns with a characteristic "pop" sound.' },
      { q: 'Why does zinc react with dilute H₂SO₄ but copper does not?', a: 'Zinc is above hydrogen in the reactivity series and can displace it. Copper is below hydrogen and cannot.' },
    ],
  },
];

/* ── Component ── */

export const TheoryNotesView: React.FC<TheoryNotesViewProps> = ({
  onBackToHome,
  onLaunchExperiment,
}) => {
  const [selectedTopic, setSelectedTopic] = useState(topics[0].id);
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

      {/* Two Column Layout */}
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
          {/* Header */}
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
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Launch Practical Simulation →
            </button>
          </div>

          {/* Primary Formula Box */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '16px 20px',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.03em' }}>
              Working Mathematical Formula
            </div>
            <MathFormula tex={current.formulaTex} display style={{ fontSize: '1.15rem' }} />
          </div>

          {/* Secondary Formulas */}
          {current.secondaryFormulas && current.secondaryFormulas.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(current.secondaryFormulas.length, 2)}, 1fr)`,
                gap: 10,
                marginBottom: 16,
              }}
            >
              {current.secondaryFormulas.map((sf, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '10px 14px',
                  }}
                >
                  <div style={{ fontSize: '0.66rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                    {sf.label}
                  </div>
                  <MathFormula tex={sf.tex} display style={{ fontSize: '0.92rem' }} />
                </div>
              ))}
            </div>
          )}

          {/* Graph (if applicable) */}
          {current.graphType && <TitrationGraph type={current.graphType} />}

          {/* Theoretical Principle */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Theoretical Principle
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              {current.theory}
            </p>
          </div>

          {/* Key Concepts */}
          {current.keyConcepts && current.keyConcepts.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Key Concepts
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {current.keyConcepts.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      padding: '6px 10px',
                      borderRadius: 6,
                      background: 'rgba(37, 99, 235, 0.04)',
                      border: '1px solid rgba(37, 99, 235, 0.08)',
                    }}
                  >
                    <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0, marginTop: 1 }}>✦</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
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
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.6 }}>
                    {v.aTex ? (
                      <>
                        <strong>Ans: </strong>
                        <MathFormula tex={v.aTex} />
                      </>
                    ) : (
                      <>
                        <strong>Ans:</strong> {v.a}
                      </>
                    )}
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
