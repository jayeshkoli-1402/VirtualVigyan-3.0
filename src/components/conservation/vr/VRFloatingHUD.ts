/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — 3D VR In-World Floating HUD & Whiteboard
 * ═══════════════════════════════════════════════════════════════════
 *  Creates a floating 3D canvas board positioned in front of the
 *  student displaying live experiment instructions, equations,
 *  digital balance readings, and interactive 3D action buttons.
 * ═══════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';

export type HUDButton = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
  action: () => void;
};

export class VRFloatingHUD {
  public mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private buttons: HUDButton[] = [];

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = 512;
    this.ctx = this.canvas.getContext('2d')!;

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    // Curved or flat floating panel
    const geometry = new THREE.PlaneGeometry(1.6, 0.8);
    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 1.65, -1.2); // Positioned comfortably at eye level above bench
    this.mesh.rotation.x = 0.05; // Slight tilt towards viewer

    this.renderHUD({
      stepTitle: 'Step 1: Set Up Conical Flask',
      instruction: 'Drag or gaze at the Conical Flask to place it on the lab bench, then add Na₂SO₄.',
      reaction: 'BaCl₂ (aq) + Na₂SO₄ (aq) → BaSO₄ (s)↓ + 2NaCl (aq)',
      mass1: null,
      mass2: null,
      actionButton: null,
    });
  }

  public renderHUD(data: {
    stepTitle: string;
    instruction: string;
    reaction?: string;
    mass1?: number | null;
    mass2?: number | null;
    actionButton?: { label: string; action: () => void } | null;
  }) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.buttons = [];

    // Background Card
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'; // Dark slate lab HUD
    ctx.beginPath();
    ctx.roundRect(10, 10, w - 20, h - 20, 24);
    ctx.fill();

    // Border Glow
    ctx.strokeStyle = '#0d9488'; // Teal accent
    ctx.lineWidth = 4;
    ctx.stroke();

    // Header bar
    ctx.fillStyle = 'rgba(13, 148, 136, 0.2)';
    ctx.beginPath();
    ctx.roundRect(14, 14, w - 28, 70, [20, 20, 0, 0]);
    ctx.fill();

    // Header Title
    ctx.fillStyle = '#2dd4bf';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText('🔬 VIRTUALVIGYAN — 3D VR CHEMISTRY LAB', 36, 58);

    // VR Mode Indicator badge
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.roundRect(w - 240, 26, 200, 42, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText('🥽 6-DOF / PHONE VR', w - 225, 53);

    // Current Step Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.fillText(data.stepTitle, 40, 135);

    // Instruction Text (wrap if needed)
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '24px Inter, sans-serif';
    this.wrapText(ctx, data.instruction, 40, 185, w - 80, 36);

    // Chemical Equation Bar
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.beginPath();
    ctx.roundRect(40, 255, w - 80, 60, 12);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillText(data.reaction || 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl', 56, 292);

    // Digital Balance Live Mass Readouts
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText('Scale Initial (M₁):', 40, 360);
    ctx.fillStyle = data.mass1 ? '#34d399' : '#64748b';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillText(data.mass1 ? `${data.mass1.toFixed(2)} g` : '---.-- g', 230, 360);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText('Scale Final (M₂):', 420, 360);
    ctx.fillStyle = data.mass2 ? '#34d399' : '#64748b';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillText(data.mass2 ? `${data.mass2.toFixed(2)} g` : '---.-- g', 590, 360);

    if (data.mass1 && data.mass2) {
      const diff = Math.abs(data.mass1 - data.mass2);
      ctx.fillStyle = diff < 0.05 ? '#34d399' : '#f59e0b';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText(`ΔM = ${diff.toFixed(2)} g (Mass Conserved ✓)`, 780, 360);
    }

    // Action button if available
    if (data.actionButton) {
      const btnX = 40;
      const btnY = 405;
      const btnW = w - 80;
      const btnH = 68;

      ctx.fillStyle = '#0d9488';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 14);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.actionButton.label, btnX + btnW / 2, btnY + 44);
      ctx.textAlign = 'left';

      this.buttons.push({
        id: 'action-btn',
        x: btnX,
        y: btnY,
        width: btnW,
        height: btnH,
        label: data.actionButton.label,
        color: '#0d9488',
        action: data.actionButton.action,
      });
    }

    this.texture.needsUpdate = true;
  }

  public checkClick(uv: THREE.Vector2): boolean {
    const px = uv.x * this.canvas.width;
    const py = (1 - uv.y) * this.canvas.height;

    for (const btn of this.buttons) {
      if (px >= btn.x && px <= btn.x + btn.width && py >= btn.y && py <= btn.y + btn.height) {
        btn.action();
        return true;
      }
    }
    return false;
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currY);
  }

  public dispose() {
    this.texture.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.mesh.geometry.dispose();
  }
}
