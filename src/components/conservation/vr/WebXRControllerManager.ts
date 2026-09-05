/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — WebXR 6-DOF Motion Controller Manager
 * ═══════════════════════════════════════════════════════════════════
 *  Handles native WebXR immersive VR sessions for Meta Quest, Pico,
 *  and PC VR headsets with motion-tracked controllers, laser pointers,
 *  and haptic pulse feedback.
 * ═══════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';

export type ControllerSelectCallback = (raycaster: THREE.Raycaster) => void;

export class WebXRControllerManager {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  public controller1: THREE.XRTargetRaySpace;
  public controller2: THREE.XRTargetRaySpace;
  public controllerGrip1: THREE.XRGripSpace;
  public controllerGrip2: THREE.XRGripSpace;

  public raycaster: THREE.Raycaster = new THREE.Raycaster();
  private onSelectCallbacks: ControllerSelectCallback[] = [];

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
    this.renderer = renderer;
    this.scene = scene;

    // Controller 1 (Right Hand)
    this.controller1 = this.renderer.xr.getController(0);
    this.controller1.addEventListener('selectstart', () => this.handleSelect(this.controller1));
    this.scene.add(this.controller1);

    // Controller 2 (Left Hand)
    this.controller2 = this.renderer.xr.getController(1);
    this.controller2.addEventListener('selectstart', () => this.handleSelect(this.controller2));
    this.scene.add(this.controller2);

    // Controller Grips (for rendering physical controller models)
    this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
    this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
    this.scene.add(this.controllerGrip1);
    this.scene.add(this.controllerGrip2);

    // Attach visible laser pointer rays
    this.controller1.add(this.buildLaserPointer('#0d9488'));
    this.controller2.add(this.buildLaserPointer('#2563eb'));

    // Attach basic controller grip visuals
    this.controllerGrip1.add(this.buildControllerMesh('#0f172a'));
    this.controllerGrip2.add(this.buildControllerMesh('#0f172a'));
  }

  public onSelect(cb: ControllerSelectCallback) {
    this.onSelectCallbacks.push(cb);
  }

  private handleSelect(controller: THREE.XRTargetRaySpace) {
    // Cast ray forward from controller
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    // Trigger haptic feedback if supported
    this.triggerHaptic(controller);

    for (const cb of this.onSelectCallbacks) {
      cb(this.raycaster);
    }
  }

  private triggerHaptic(_controller: THREE.XRTargetRaySpace) {
    try {
      const session = this.renderer.xr.getSession();
      if (!session) return;

      const sources = session.inputSources;
      for (const source of sources) {
        if (source.gamepad && source.gamepad.hapticActuators && source.gamepad.hapticActuators.length > 0) {
          const actuator = source.gamepad.hapticActuators[0] as unknown as {
            pulse?: (value: number, duration: number) => void;
          };
          actuator.pulse?.(0.6, 60); // 60ms subtle vibration pulse
        }
      }
    } catch {
      // Haptics optional
    }
  }

  private buildLaserPointer(color: string): THREE.Line {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -3), // 3 meter laser ray
    ]);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.7,
      linewidth: 2,
    });
    return new THREE.Line(geometry, material);
  }

  private buildControllerMesh(color: string): THREE.Group {
    const group = new THREE.Group();

    // Grip cylinder
    const gripGeo = new THREE.CylinderGeometry(0.015, 0.018, 0.12, 16);
    const gripMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.3,
      metalness: 0.8,
    });
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.rotation.x = Math.PI / 4;
    group.add(grip);

    // Tracking ring
    const ringGeo = new THREE.TorusGeometry(0.045, 0.006, 12, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: '#2dd4bf', emissive: '#0f766e', emissiveIntensity: 0.4 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 0.05, -0.04);
    group.add(ring);

    return group;
  }
}
