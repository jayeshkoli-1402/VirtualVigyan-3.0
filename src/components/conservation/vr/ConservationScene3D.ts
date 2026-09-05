/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — 3D Conservation of Mass Scene & Physics Manager
 * ═══════════════════════════════════════════════════════════════════
 *  Three.js 3D laboratory environment with procedural glass flask,
 *  ignition tube, rubber cork, digital scale, and animated precipitation.
 * ═══════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import { VRFloatingHUD } from './VRFloatingHUD';

export type VRStep =
  | 'SETUP_FLASK'
  | 'FILL_TUBE'
  | 'SUSPEND_TUBE'
  | 'SEAL_FLASK'
  | 'WEIGH_INITIAL'
  | 'MIX_REACTANTS'
  | 'OBSERVE'
  | 'WEIGH_FINAL'
  | 'COMPLETE';

export class ConservationScene3D {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public hud: VRFloatingHUD;

  // 3D Objects
  public flaskGroup: THREE.Group = new THREE.Group();
  public tubeGroup: THREE.Group = new THREE.Group();
  public corkMesh!: THREE.Mesh;
  public balanceGroup: THREE.Group = new THREE.Group();
  public na2so4Bottle: THREE.Group = new THREE.Group();
  public bacl2Bottle: THREE.Group = new THREE.Group();
  public testTubeRack: THREE.Group = new THREE.Group();

  // Materials & Liquid meshes
  private flaskLiquidMesh!: THREE.Mesh;
  private tubeLiquidMesh!: THREE.Mesh;
  private balanceCanvas!: HTMLCanvasElement;
  private balanceTexture!: THREE.CanvasTexture;

  // State
  public currentStep: VRStep = 'SETUP_FLASK';
  public mass1: number = 148.65;
  public mass2: number = 148.65;
  public isFlaskOnBalance: boolean = false;
  public isMixed: boolean = false;
  public isSealed: boolean = false;
  public isSuspended: boolean = false;

  // Animation controllers
  private mixers: Array<() => void> = [];

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0b0f19'); // Dark lab ambiance

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.45, 0.7); // Standing at the bench

    // Add HUD
    this.hud = new VRFloatingHUD();
    this.scene.add(this.hud.mesh);

    this.setupLighting();
    this.buildLabEnvironment();
    this.buildDigitalBalance();
    this.buildConicalFlask();
    this.buildIgnitionTube();
    this.buildRubberCork();
    this.buildReagentBottles();
    this.buildTestTubeRack();

    this.updateHUDForStep();
  }

  // ── 1. Lighting ──
  private setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 4, 2);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4); // Cool cyan lab glow
    fillLight.position.set(-2, 2, -1);
    this.scene.add(fillLight);
  }

  // ── 2. Laboratory Room Environment ──
  private buildLabEnvironment() {
    // Laboratory Workbench Surface
    const benchGeo = new THREE.BoxGeometry(2.4, 0.1, 1.2);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.1,
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(0, 0.85, -0.3);
    this.scene.add(bench);

    // Bench front bevel trim
    const trimGeo = new THREE.BoxGeometry(2.42, 0.03, 0.04);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.3 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, 0.9, 0.3);
    this.scene.add(trim);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.7 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.scene.add(floor);

    // Back Wall
    const wallGeo = new THREE.PlaneGeometry(8, 4);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 2, -1.8);
    this.scene.add(wall);
  }

  // ── 3. Digital Balance with glowing 7-segment readout ──
  private buildDigitalBalance() {
    const group = this.balanceGroup;
    group.position.set(0.45, 0.9, -0.25);

    // Balance Base Housing
    const baseGeo = new THREE.BoxGeometry(0.24, 0.05, 0.26);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Stainless Steel Weighing Pan
    const panGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.01, 32);
    const panMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1, metalness: 0.9 });
    const pan = new THREE.Mesh(panGeo, panMat);
    pan.position.y = 0.03;
    group.add(pan);

    // Digital LED display screen
    this.balanceCanvas = document.createElement('canvas');
    this.balanceCanvas.width = 256;
    this.balanceCanvas.height = 64;
    this.balanceTexture = new THREE.CanvasTexture(this.balanceCanvas);
    this.updateBalanceDisplay(0.0);

    const displayGeo = new THREE.PlaneGeometry(0.12, 0.03);
    const displayMat = new THREE.MeshBasicMaterial({ map: this.balanceTexture });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0, 0.015, 0.131);
    group.add(display);

    this.scene.add(group);
  }

  public updateBalanceDisplay(mass: number) {
    const ctx = this.balanceCanvas.getContext('2d')!;
    ctx.fillStyle = '#022c22';
    ctx.fillRect(0, 0, 256, 64);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 38px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass.toFixed(2)} g`, 128, 46);

    this.balanceTexture.needsUpdate = true;
  }

  // ── 4. Conical Flask (Transparent Borosilicate Glass) ──
  private buildConicalFlask() {
    const group = this.flaskGroup;
    group.position.set(-0.15, 0.9, -0.25);

    // Flask Glass Body
    // Using a LatheGeometry for authentic Erlenmeyer curve
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.07, 0.005));
    points.push(new THREE.Vector2(0.075, 0.03));
    points.push(new THREE.Vector2(0.025, 0.14));
    points.push(new THREE.Vector2(0.025, 0.18));
    points.push(new THREE.Vector2(0.027, 0.185));

    const latheGeo = new THREE.LatheGeometry(points, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.08,
      metalness: 0.0,
      transmission: 0.85,
      ior: 1.52, // Borosilicate glass refractive index
      side: THREE.DoubleSide,
    });

    const flaskGlass = new THREE.Mesh(latheGeo, glassMat);
    group.add(flaskGlass);

    // Liquid in Flask (Na₂SO₄ / BaSO₄ precipitate)
    const liquidPoints: THREE.Vector2[] = [];
    liquidPoints.push(new THREE.Vector2(0, 0.002));
    liquidPoints.push(new THREE.Vector2(0.068, 0.006));
    liquidPoints.push(new THREE.Vector2(0.062, 0.04));
    liquidPoints.push(new THREE.Vector2(0, 0.04));

    const liquidGeo = new THREE.LatheGeometry(liquidPoints, 32);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Initial translucent cyan-blue
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
    });

    this.flaskLiquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    group.add(this.flaskLiquidMesh);

    this.scene.add(group);
  }

  // ── 5. Ignition Tube with Thread ──
  private buildIgnitionTube() {
    const group = this.tubeGroup;
    group.position.set(-0.45, 1.0, -0.25); // Starts on test tube stand

    // Small cylindrical tube
    const tubeGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.07, 16);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      transmission: 0.85,
      roughness: 0.1,
    });
    const tube = new THREE.Mesh(tubeGeo, glassMat);
    group.add(tube);

    // Liquid in tube (BaCl₂)
    const tubeLiquidGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.05, 16);
    const tubeLiquidMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.85,
    });
    this.tubeLiquidMesh = new THREE.Mesh(tubeLiquidGeo, tubeLiquidMat);
    this.tubeLiquidMesh.position.y = -0.01;
    group.add(this.tubeLiquidMesh);

    // Thread attached to top
    const threadPoints = [new THREE.Vector3(0, 0.035, 0), new THREE.Vector3(0, 0.15, 0)];
    const threadGeo = new THREE.BufferGeometry().setFromPoints(threadPoints);
    const threadMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const thread = new THREE.Line(threadGeo, threadMat);
    group.add(thread);

    this.scene.add(group);
  }

  // ── 6. Rubber Cork Stopper ──
  private buildRubberCork() {
    const corkGeo = new THREE.CylinderGeometry(0.026, 0.022, 0.03, 16);
    const corkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    this.corkMesh = new THREE.Mesh(corkGeo, corkMat);
    this.corkMesh.position.set(-0.3, 0.92, -0.15); // Resting on bench initially
    this.scene.add(this.corkMesh);
  }

  // ── 7. Reagent Bottles ──
  private buildReagentBottles() {
    // Na₂SO₄ Bottle
    this.na2so4Bottle = this.createBottle('Na₂SO₄ (aq)', 0x38bdf8);
    this.na2so4Bottle.position.set(-0.6, 0.9, -0.45);
    this.scene.add(this.na2so4Bottle);

    // BaCl₂ Bottle
    this.bacl2Bottle = this.createBottle('BaCl₂ (aq)', 0x0284c7);
    this.bacl2Bottle.position.set(-0.75, 0.9, -0.45);
    this.scene.add(this.bacl2Bottle);
  }

  private createBottle(_label: string, color: number): THREE.Group {
    const group = new THREE.Group();
    const bodyGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.12, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.7, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.06;
    group.add(body);

    const capGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.025, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.13;
    group.add(cap);

    return group;
  }

  // ── 8. Wooden Test Tube Rack ──
  private buildTestTubeRack() {
    const group = this.testTubeRack;
    group.position.set(-0.45, 0.9, -0.25);

    const rackGeo = new THREE.BoxGeometry(0.12, 0.08, 0.08);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const rack = new THREE.Mesh(rackGeo, woodMat);
    rack.position.y = 0.04;
    group.add(rack);

    this.scene.add(group);
  }

  // ── STEP TRANSITIONS & ANIMATIONS ──

  public triggerNextAction() {
    switch (this.currentStep) {
      case 'SETUP_FLASK':
        // Pour Na₂SO₄ into flask
        this.currentStep = 'FILL_TUBE';
        this.updateHUDForStep();
        break;

      case 'FILL_TUBE':
        // Suspend ignition tube inside flask
        this.currentStep = 'SUSPEND_TUBE';
        this.tubeGroup.position.set(-0.15, 0.97, -0.25); // Inside flask neck
        this.isSuspended = true;
        this.updateHUDForStep();
        break;

      case 'SUSPEND_TUBE':
        // Cork seals the flask
        this.currentStep = 'SEAL_FLASK';
        this.corkMesh.position.set(-0.15, 1.08, -0.25); // Snapped into flask mouth
        this.isSealed = true;
        this.updateHUDForStep();
        break;

      case 'SEAL_FLASK':
        // Place sealed flask on digital balance
        this.currentStep = 'WEIGH_INITIAL';
        this.flaskGroup.position.set(0.45, 0.93, -0.25);
        this.tubeGroup.position.set(0.45, 1.0, -0.25);
        this.corkMesh.position.set(0.45, 1.11, -0.25);
        this.isFlaskOnBalance = true;
        this.updateBalanceDisplay(this.mass1);
        this.updateHUDForStep();
        break;

      case 'WEIGH_INITIAL':
        // Move back to bench ready to mix
        this.currentStep = 'MIX_REACTANTS';
        this.flaskGroup.position.set(0.0, 0.9, -0.25);
        this.tubeGroup.position.set(0.0, 0.97, -0.25);
        this.corkMesh.position.set(0.0, 1.08, -0.25);
        this.isFlaskOnBalance = false;
        this.updateBalanceDisplay(0.0);
        this.updateHUDForStep();
        break;

      case 'MIX_REACTANTS':
        // Invert flask in 3D arc to mix chemicals
        this.animateFlaskInversion();
        break;

      case 'OBSERVE':
        // Place on balance for final weighing M₂
        this.currentStep = 'WEIGH_FINAL';
        this.flaskGroup.position.set(0.45, 0.93, -0.25);
        this.tubeGroup.position.set(0.45, 1.0, -0.25);
        this.corkMesh.position.set(0.45, 1.11, -0.25);
        this.isFlaskOnBalance = true;
        this.updateBalanceDisplay(this.mass2);
        this.updateHUDForStep();
        break;

      case 'WEIGH_FINAL':
        this.currentStep = 'COMPLETE';
        this.updateHUDForStep();
        break;

      case 'COMPLETE':
        // Restart sequence
        this.currentStep = 'SETUP_FLASK';
        this.resetScene();
        this.updateHUDForStep();
        break;
    }
  }

  private animateFlaskInversion() {
    let t = 0;
    const duration = 90; // frames (~1.5s)
    const startPos = new THREE.Vector3(0.0, 0.9, -0.25);

    const animate = () => {
      t++;
      const progress = t / duration;

      if (progress < 0.5) {
        // Tilting upside down
        const angle = Math.sin(progress * Math.PI) * 2.5;
        this.flaskGroup.rotation.z = angle;
        this.flaskGroup.position.y = startPos.y + 0.15 * Math.sin(progress * Math.PI);
        this.tubeGroup.rotation.z = angle;
        this.tubeGroup.position.y = this.flaskGroup.position.y + 0.07;
        this.corkMesh.rotation.z = angle;
      } else {
        // Returning upright with white precipitate
        const angle = Math.sin(progress * Math.PI) * 2.5;
        this.flaskGroup.rotation.z = angle;
        this.flaskGroup.position.y = startPos.y;
        this.tubeGroup.rotation.z = angle;
        this.corkMesh.rotation.z = angle;

        // Turn liquid into bright milky white BaSO₄ precipitate
        (this.flaskLiquidMesh.material as THREE.MeshStandardMaterial).color.set('#f8fafc');
        (this.flaskLiquidMesh.material as THREE.MeshStandardMaterial).opacity = 0.95;
      }

      if (t < duration) {
        requestAnimationFrame(animate);
      } else {
        this.flaskGroup.rotation.z = 0;
        this.tubeGroup.rotation.z = 0;
        this.corkMesh.rotation.z = 0;
        this.isMixed = true;
        this.currentStep = 'OBSERVE';
        this.updateHUDForStep();
      }
    };
    animate();
  }

  public updateHUDForStep() {
    switch (this.currentStep) {
      case 'SETUP_FLASK':
        this.hud.renderHUD({
          stepTitle: 'Step 1: Set Up & Add Na₂SO₄',
          instruction: 'Conical flask is on the bench with 10 mL Na₂SO₄ solution.',
          reaction: 'BaCl₂ (aq) + Na₂SO₄ (aq) → BaSO₄ (s)↓ + 2NaCl (aq)',
          actionButton: { label: 'Fill Ignition Tube with BaCl₂ →', action: () => this.triggerNextAction() },
        });
        break;

      case 'FILL_TUBE':
        this.hud.renderHUD({
          stepTitle: 'Step 2: Fill Ignition Tube',
          instruction: 'Ignition tube filled with 5 mL BaCl₂ solution. Suspend it carefully inside the flask.',
          reaction: 'BaCl₂ (aq) + Na₂SO₄ (aq) → BaSO₄ (s)↓ + 2NaCl (aq)',
          actionButton: { label: 'Suspend Tube in Flask with Thread →', action: () => this.triggerNextAction() },
        });
        break;

      case 'SUSPEND_TUBE':
        this.hud.renderHUD({
          stepTitle: 'Step 3: Suspend Tube in Flask',
          instruction: 'Tube is suspended without spilling into the Na₂SO₄. Now seal airtight with rubber cork.',
          reaction: 'BaCl₂ (aq) + Na₂SO₄ (aq) → BaSO₄ (s)↓ + 2NaCl (aq)',
          actionButton: { label: 'Seal Flask with Rubber Cork →', action: () => this.triggerNextAction() },
        });
        break;

      case 'SEAL_FLASK':
        this.hud.renderHUD({
          stepTitle: 'Step 4: Seal Flask Airtight',
          instruction: 'System is hermetically sealed. Place on digital balance to record initial mass M₁.',
          reaction: 'BaCl₂ (aq) + Na₂SO₄ (aq) → BaSO₄ (s)↓ + 2NaCl (aq)',
          actionButton: { label: 'Place Sealed Flask on Scale (Weigh M₁) →', action: () => this.triggerNextAction() },
        });
        break;

      case 'WEIGH_INITIAL':
        this.hud.renderHUD({
          stepTitle: 'Step 5: Record Initial Mass (M₁)',
          instruction: `Initial mass recorded: M₁ = ${this.mass1.toFixed(2)} g. Prepare to mix the reactants.`,
          reaction: 'BaCl₂ (aq) + Na₂SO₄ (aq) → BaSO₄ (s)↓ + 2NaCl (aq)',
          mass1: this.mass1,
          actionButton: { label: 'Move to Bench to Mix Reactants →', action: () => this.triggerNextAction() },
        });
        break;

      case 'MIX_REACTANTS':
        this.hud.renderHUD({
          stepTitle: 'Step 6: Mix Reactants',
          instruction: 'Invert and swirl the flask to mix BaCl₂ with Na₂SO₄.',
          reaction: 'BaCl₂ (aq) + Na₂SO₄ (aq) → BaSO₄ (s)↓ + 2NaCl (aq)',
          mass1: this.mass1,
          actionButton: { label: '🔄 Invert Flask to Mix Reactants', action: () => this.triggerNextAction() },
        });
        break;

      case 'OBSERVE':
        this.hud.renderHUD({
          stepTitle: 'Step 7: Observe White Precipitate',
          instruction: 'Curdy white precipitate of BaSO₄ has formed! Now reweigh the sealed flask.',
          reaction: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ (White Precipitate) + 2NaCl',
          mass1: this.mass1,
          actionButton: { label: 'Place on Scale for Final Mass (M₂) →', action: () => this.triggerNextAction() },
        });
        break;

      case 'WEIGH_FINAL':
        this.hud.renderHUD({
          stepTitle: 'Step 8: Final Mass (M₂)',
          instruction: `Final mass M₂ = ${this.mass2.toFixed(2)} g. M₁ equals M₂! Total mass is perfectly conserved.`,
          reaction: 'Law Verified: Total Mass Before = Total Mass After',
          mass1: this.mass1,
          mass2: this.mass2,
          actionButton: { label: 'Complete Experiment & Review Score →', action: () => this.triggerNextAction() },
        });
        break;

      case 'COMPLETE':
        this.hud.renderHUD({
          stepTitle: '🎉 Law of Conservation of Mass Verified!',
          instruction: `M₁ (${this.mass1.toFixed(2)} g) = M₂ (${this.mass2.toFixed(2)} g). ΔM = 0.00 g. 100/100 Points!`,
          reaction: 'Total Mass of Reactants = Total Mass of Products',
          mass1: this.mass1,
          mass2: this.mass2,
          actionButton: { label: 'Restart 3D VR Simulation ↺', action: () => this.triggerNextAction() },
        });
        break;
    }
  }

  public resetScene() {
    this.flaskGroup.position.set(-0.15, 0.9, -0.25);
    this.tubeGroup.position.set(-0.45, 1.0, -0.25);
    this.corkMesh.position.set(-0.3, 0.92, -0.15);
    (this.flaskLiquidMesh.material as THREE.MeshStandardMaterial).color.set('#38bdf8');
    (this.flaskLiquidMesh.material as THREE.MeshStandardMaterial).opacity = 0.75;
    this.isFlaskOnBalance = false;
    this.isMixed = false;
    this.isSealed = false;
    this.isSuspended = false;
    this.updateBalanceDisplay(0.0);
  }

  public update() {
    for (const fn of this.mixers) fn();
  }

  public dispose() {
    this.hud.dispose();
  }
}
