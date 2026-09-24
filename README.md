# VirtualVigyan 3.0 — Interactive Virtual Chemistry Laboratory

> **VirtualVigyan** is a state-of-the-art interactive virtual chemistry laboratory platform engineered for Indian secondary schools (**NCERT / CBSE Classes 9–12**) and engineering universities (**Dr. Babasaheb Ambedkar Technological University — DBATU**).

VirtualVigyan empowers students to perform authentic chemistry practicals in web browsers and immersive VR—bridging the educational equity gap for institutions lacking physical laboratory infrastructure, reagents, or specialized equipment.

---

## 🔬 Key Capabilities & Innovations

### 1. Unified Generic Experiment Engine
- **Declarative Experiment Architecture:** Experiments are specified through data-driven schemas (`ExperimentConfig`), enabling curriculum scaling with zero duplicated UI code.
- **Deterministic State Machines:** Pure TypeScript state machines manage apparatus placement, reagent dispensing, multi-step procedures, and guardrail validations without relying on non-deterministic models.
- **Mistake Interception & Guidance:** Provides contextual, educational feedback when errors occur (e.g., titrating without indicator, incorrect drop zones, improper reagent sequence) rather than failing silently.

### 2. Universal Chemical Database & Stoichiometric Reaction Matrix
- **60+ Chemical Species Database:** Accurate molar masses, physical states, densities, enthalpies of formation, aqueous dissociation constants, and indicator color transitions across the pH scale.
- **Stoichiometry & Reaction Solver:** Real-time equilibrium, limiting reagent computation, gas evolution volume estimation ($H_2 \uparrow$, $CO_2 \uparrow$), precipitation mass ($BaSO_4 \downarrow$, $PbI_2$ Golden Rain), and enthalpy temperature changes.
- **Live Chemical Inspector:** Interactive inspector modal allowing students to examine beaker/flask contents, molarity concentrations, spectator ions, and reaction progress.

### 3. Comprehensive Curriculum Coverage (11+ Experiments)

#### Secondary & Higher Secondary (NCERT / CBSE Classes 9–12)
- **Acid-Base Volumetric Titration:** Unknown $HCl$ titrated with standardized $0.1\text{ M } NaOH$ using phenolphthalein indicator with dropwise flow control.
- **Verification of Law of Conservation of Mass:** Reaction of Barium Chloride ($BaCl_2$) with Sodium Sulphate ($Na_2SO_4$) on high-precision digital balance with molecular reaction chain visualization.
- **Single Displacement Reaction:** Granulated Zinc ($Zn$) with Dilute Sulphuric Acid ($H_2SO_4$) featuring dynamic effervescence, hydrogen gas collection, and splinter "💥 POP!" combustion test.

#### Engineering Chemistry (DBATU F.Y. B.Tech)
1. **Viscosity by Ostwald's Viscometer:** Determination of relative viscosity of test liquids against water using timing meniscus gates.
2. **pH-Metric Titration:** Strong acid ($HCl$) vs. Strong base ($NaOH$) using simulated digital pH electrode and titration curve plotting.
3. **Conductometric Titration:** Conductance curve analysis with sharp equivalence intersection detection.
4. **Chloride Content by Mohr's Method:** Argentometric titration with silver nitrate ($AgNO_3$) and potassium chromate indicator with brick-red endpoint.
5. **Water Acidity:** Determination of mineral (methyl orange) and total (phenolphthalein) acidity in industrial water samples.
6. **Water Alkalinity:** Determination of hydroxide, carbonate, and bicarbonate alkalinity using phenolphthalein and methyl orange.
7. **Acid Value of Vegetable Oil:** Saponification titration of free fatty acids in oil samples.
8. **Dissolved Oxygen by Winkler's Method:** Iodometric determination of DO in environmental water samples with starch endpoint.
9. **Water Hardness by EDTA Chelation:** Complexometric determination of temporary, permanent, and total hardness using EBT indicator.

### 4. Dual-Mode Visualization: 2D Bench & Immersive 3D/WebXR Lab
- **Interactive 2D Lab Bench:** High-contrast scalable vector graphics (SVG) with liquid meniscus rendering, bubbling effervescence, flame effects, and smooth responsive touch interactions.
- **3D Virtual Reality Lab (WebXR & Google Cardboard):**
  - **Phone VR (Cardboard):** Stereoscopic dual-viewport rendering with mobile gyroscope head tracking (360° orientation) and gaze-dwell circular reticle triggers.
  - **6-DOF WebXR:** Motion controller tracking, raycast pointers, and haptic actuator feedback for standalone VR headsets (Meta Quest, Pico).
  - **Floating 3D Whiteboard HUD:** Live reaction status, molecular equations, and mass readouts in 3D laboratory space.

### 5. Academic Report Generator & Evaluation Engine
- **Automated Laboratory Reports:** Generates standardized, formal A4 PDF reports (aim, apparatus, chemicals, step-by-step procedure, observations, student calculations, mistake logs, and rubric breakdown).
- **Rubric-Based Deterministic Scoring:** Grades accuracy, procedures, and calculated answers against acceptable scientific tolerances with worked step-by-step solution proofs.

### 6. Classroom Management & Multilingual Support
- **Private Classroom Labs:** Teachers can create custom assignments, set attempt caps and deadlines, issue 6-character cohort codes, and review student submissions with analytics.
- **Trilingual Accessibility:** Complete UI localization in **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**.

---

## 🛠️ Architecture & Tech Stack

```
virtualvigyan/
├── public/                 # Static assets, WebXR icons, security headers
├── src/
│   ├── apparatus/          # Scalable SVG laboratory apparatus library
│   ├── auth/               # Firebase Authentication & session context
│   ├── components/
│   │   ├── GenericLab/     # Declarative 3-panel lab orchestrator & bench
│   │   ├── conservation/   # Conservation experiment & 3D WebXR engine
│   │   ├── landing/        # Public landing presentation page
│   │   ├── teacher/        # Private lab management & submission inspector
│   │   └── student/        # Student classroom view & lab join modals
│   ├── data/               # Safety datasheets, GHS hazard codes, pedagogy
│   ├── engine/             # State machines, chemistry rules, stoichiometry
│   ├── experiments/        # Declarative experiment configs (NCERT & DBATU)
│   ├── firebase/           # Firebase configuration & Cloud Firestore service
│   ├── i18n/               # Internationalization engine (EN, HI, MR)
│   └── services/           # PDF report generator, private lab service
├── firestore.rules         # Role-based Cloud Firestore security rules
├── serve.json              # Production server security headers configuration
└── vite.config.ts          # Vite build pipeline
```

### Core Technologies
- **Frontend Core:** React 19, TypeScript (Strict Mode), Vite
- **Interaction Layer:** `@dnd-kit/core` with unified Pointer and Touch sensors
- **3D & VR Engine:** Three.js, WebXR Device API, Stereoscopic Cardboard Shader
- **Chemical Rendering:** KaTeX for LaTeX mathematical & chemical typesetting
- **Cloud Backend:** Firebase Authentication, Cloud Firestore (Offline & Realtime)
- **Export & Printing:** jsPDF, html2canvas with sanitized filename traversal protection
- **Styling:** CSS Design Tokens, Glassmorphism, Dark/Light theme switching

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/jayeshkoli-1402/VirtualVigyan-3.0.git
cd VirtualVigyan-3.0

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase project credentials
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5174` in your browser.

### Automated Test Suite

Run the engine unit tests and stoichiometry reaction matrix verification suite:

```bash
npm test
```

### Production Build

```bash
npm run build
```

The production-ready artifacts are compiled to `dist/` with optimized chunking and minification.

---

## 🔒 Security Architecture

- **Content Security Policy (CSP):** Strict CSP directives restricting script execution, style injection, object loading, and font origins.
- **Enterprise Security Headers:** HSTS (`max-age=31536000`), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- **Role-Based Access Control (RBAC):** Firestore security rules strictly isolate student submissions, prevent privilege escalation, enforce teacher lab ownership, and maintain designated admin privileges.
- **Input Sanitization:** Parameterized filename sanitization preventing directory traversal during report generation, and strict HTTPS protocol validation on custom profile avatars.
- **Client-Side Rate Limiting:** Brute-force protection on authentication attempts.

---

## 📜 License & Acknowledgments

Developed for the **Smart India Hackathon (SIH)**.  
Built to advance national digital education initiatives under NEP 2020 by democratizing experiential STEM learning for students across India.
