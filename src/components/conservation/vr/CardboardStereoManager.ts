/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Google Cardboard & Mobile Phone VR Manager
 * ═══════════════════════════════════════════════════════════════════
 *  Provides dual-viewport stereoscopic rendering (Left Eye & Right Eye)
 *  and real-time 360° Gyroscope head tracking with a center Gaze Reticle.
 *  Works on any Android or iPhone placed into Google Cardboard or VR goggles.
 * ═══════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';

export class CardboardStereoManager {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;

  // Stereoscopic cameras
  private leftCamera: THREE.PerspectiveCamera;
  private rightCamera: THREE.PerspectiveCamera;
  public eyeSeparation: number = 0.064; // 64 mm standard inter-pupillary distance

  // Gyroscope orientation
  private isGyroEnabled: boolean = false;
  private screenOrientation: number = 0;
  private deviceOrientation: { alpha: number; beta: number; gamma: number } | null = null;

  // Gaze Reticle
  public reticleMesh: THREE.Mesh;
  private reticleCanvas: HTMLCanvasElement;
  private reticleTexture: THREE.CanvasTexture;
  public gazeDwellProgress: number = 0; // 0 to 1
  public isGazingAtTarget: boolean = false;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    // Create Left and Right eye cameras
    this.leftCamera = camera.clone();
    this.rightCamera = camera.clone();

    // Create Gaze Reticle (attached to camera at 0.8m distance)
    this.reticleCanvas = document.createElement('canvas');
    this.reticleCanvas.width = 128;
    this.reticleCanvas.height = 128;
    this.reticleTexture = new THREE.CanvasTexture(this.reticleCanvas);

    const reticleGeo = new THREE.PlaneGeometry(0.04, 0.04);
    const reticleMat = new THREE.MeshBasicMaterial({
      map: this.reticleTexture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    this.reticleMesh.position.set(0, 0, -0.8);
    this.camera.add(this.reticleMesh);

    this.drawReticle(0, false);
    this.setupOrientationListeners();
  }

  /**
   * Request sensor permissions and enable gyroscope head tracking (iOS 13+ & Android).
   */
  public async enableGyro(): Promise<boolean> {
    try {
      // iOS 13+ permission request
      const deviceOrientationEvent = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof deviceOrientationEvent?.requestPermission === 'function') {
        const response = await deviceOrientationEvent.requestPermission();
        if (response !== 'granted') {
          console.warn('[CardboardVR] Gyroscope permission denied');
          return false;
        }
      }

      this.isGyroEnabled = true;
      return true;
    } catch (err) {
      console.warn('[CardboardVR] Error requesting orientation permission', err);
      this.isGyroEnabled = true;
      return true;
    }
  }

  private setupOrientationListeners() {
    window.addEventListener('orientationchange', () => {
      this.screenOrientation = window.orientation ? Number(window.orientation) : 0;
    });

    window.addEventListener('deviceorientation', (event) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        this.deviceOrientation = {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma,
        };
      }
    });
  }

  /**
   * Update head rotation based on mobile device orientation sensor.
   */
  public updateOrientation() {
    if (!this.isGyroEnabled || !this.deviceOrientation) return;

    const alpha = THREE.MathUtils.degToRad(this.deviceOrientation.alpha || 0);
    const beta = THREE.MathUtils.degToRad(this.deviceOrientation.beta || 0);
    const gamma = THREE.MathUtils.degToRad(this.deviceOrientation.gamma || 0);
    const orient = THREE.MathUtils.degToRad(this.screenOrientation || 0);

    // Standard Tait-Bryan mobile sensor quaternion conversion
    const zee = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around X-axis

    euler.set(beta, alpha, -gamma, 'YXZ');
    this.camera.quaternion.setFromEuler(euler);
    this.camera.quaternion.multiply(q1);
    this.camera.quaternion.multiply(q0.setFromAxisAngle(zee, -orient));
  }

  /**
   * Draw circular gaze dwell progress on the reticle canvas.
   */
  public drawReticle(progress: number, isHovering: boolean) {
    const ctx = this.reticleCanvas.getContext('2d')!;
    ctx.clearRect(0, 0, 128, 128);

    const cx = 64;
    const cy = 64;
    const radius = 36;

    // Outer faint ring
    ctx.strokeStyle = isHovering ? 'rgba(45, 212, 191, 0.5)' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner center dot
    ctx.fillStyle = isHovering ? '#2dd4bf' : '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Progress arc when gazing
    if (progress > 0) {
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
      ctx.stroke();
    }

    this.reticleTexture.needsUpdate = true;
  }

  /**
   * Render side-by-side stereoscopic dual viewports for Google Cardboard.
   */
  public renderStereo() {
    const size = new THREE.Vector2();
    this.renderer.getSize(size);

    const halfWidth = Math.floor(size.x / 2);
    const height = size.y;

    this.renderer.clear();

    // ── LEFT EYE VIEWPORT ──
    this.leftCamera.copy(this.camera);
    this.leftCamera.translateX(-this.eyeSeparation / 2);
    this.leftCamera.aspect = halfWidth / height;
    this.leftCamera.updateProjectionMatrix();

    this.renderer.setViewport(0, 0, halfWidth, height);
    this.renderer.setScissor(0, 0, halfWidth, height);
    this.renderer.setScissorTest(true);
    this.renderer.render(this.scene, this.leftCamera);

    // ── RIGHT EYE VIEWPORT ──
    this.rightCamera.copy(this.camera);
    this.rightCamera.translateX(this.eyeSeparation / 2);
    this.rightCamera.aspect = halfWidth / height;
    this.rightCamera.updateProjectionMatrix();

    this.renderer.setViewport(halfWidth, 0, halfWidth, height);
    this.renderer.setScissor(halfWidth, 0, halfWidth, height);
    this.renderer.setScissorTest(true);
    this.renderer.render(this.scene, this.rightCamera);

    this.renderer.setScissorTest(false);
  }

  public dispose() {
    this.reticleTexture.dispose();
    this.reticleMesh.geometry.dispose();
    (this.reticleMesh.material as THREE.Material).dispose();
  }
}
