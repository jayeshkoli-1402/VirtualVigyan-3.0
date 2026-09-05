/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — 3D VR Laboratory Component (WebXR & Phone VR)
 * ═══════════════════════════════════════════════════════════════════
 *  Full-screen 3D virtual chemistry laboratory for Conservation of Mass.
 *  Supports:
 *  1. Phone VR (Google Cardboard): Stereoscopic split-screen, 360° Gyro, Gaze Reticle.
 *  2. WebXR (Meta Quest, Pico): 6-DOF motion controllers & laser pointers.
 *  3. Desktop 3D: Mouse orbit & pointer click.
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ConservationScene3D } from './ConservationScene3D';
import { CardboardStereoManager } from './CardboardStereoManager';
import { WebXRControllerManager } from './WebXRControllerManager';

interface ConservationVRLabProps {
  onBackToLab: () => void;
}

type VRMode = 'desktop' | 'cardboard' | 'webxr';

const ConservationVRLab: React.FC<ConservationVRLabProps> = ({ onBackToLab }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vrMode, setVrMode] = useState<VRMode>('desktop');
  const [isXRSupported, setIsXRSupported] = useState(false);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const scene3DRef = useRef<ConservationScene3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardboardRef = useRef<CardboardStereoManager | null>(null);
  const webxrRef = useRef<WebXRControllerManager | null>(null);

  // Mouse / Raycast tracking for desktop
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Check WebXR support
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-vr').then((supported) => {
        setIsXRSupported(supported);
      }).catch(() => setIsXRSupported(false));
    }

    // Initialize Three.js WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.xr.enabled = true;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Initialize 3D Scene
    const scene3D = new ConservationScene3D();
    scene3DRef.current = scene3D;

    // Initialize Phone VR Cardboard Manager
    const cardboard = new CardboardStereoManager(renderer, scene3D.scene, scene3D.camera);
    cardboardRef.current = cardboard;

    // Initialize WebXR Controller Manager
    const webxr = new WebXRControllerManager(renderer, scene3D.scene);
    webxrRef.current = webxr;

    webxr.onSelect((controllerRay) => {
      // Check HUD intersection
      const intersects = controllerRay.intersectObject(scene3D.hud.mesh);
      if (intersects.length > 0 && intersects[0].uv) {
        scene3D.hud.checkClick(intersects[0].uv);
      } else {
        // Trigger apparatus action
        scene3D.triggerNextAction();
      }
    });

    // ── Gaze Reticle Raycaster for Phone VR ──
    const gazeRaycaster = new THREE.Raycaster();
    let gazeDwell = 0;

    // ── Animation Loop ──
    let isRunning = true;
    const animate = () => {
      if (!isRunning) return;

      scene3D.update();

      if (vrMode === 'cardboard') {
        // Update Mobile Gyroscope 360° orientation
        cardboard.updateOrientation();

        // Gaze Raycast from camera center
        gazeRaycaster.setFromCamera(new THREE.Vector2(0, 0), scene3D.camera);
        const hudHits = gazeRaycaster.intersectObject(scene3D.hud.mesh);

        if (hudHits.length > 0) {
          gazeDwell += 0.016; // ~60fps step
          const progress = Math.min(gazeDwell / 1.2, 1.0); // 1.2 second dwell
          cardboard.drawReticle(progress, true);

          if (progress >= 1.0) {
            gazeDwell = 0;
            if (hudHits[0].uv) {
              scene3D.hud.checkClick(hudHits[0].uv);
            }
          }
        } else {
          gazeDwell = Math.max(0, gazeDwell - 0.05);
          cardboard.drawReticle(0, false);
        }

        // Render stereoscopic split-screen
        cardboard.renderStereo();
      } else if (renderer.xr.isPresenting) {
        renderer.render(scene3D.scene, scene3D.camera);
      } else {
        // Desktop standard rendering
        renderer.render(scene3D.scene, scene3D.camera);
      }
    };

    renderer.setAnimationLoop(animate);

    // Resize handler
    const handleResize = () => {
      if (!renderer || !scene3D) return;
      scene3D.camera.aspect = window.innerWidth / window.innerHeight;
      scene3D.camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isRunning = false;
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      cardboard.dispose();
      scene3D.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [vrMode]);

  // ── Mode Switchers ──

  const enterPhoneCardboardVR = async () => {
    if (!cardboardRef.current) return;
    const granted = await cardboardRef.current.enableGyro();
    if (granted) {
      setVrMode('cardboard');
      showToast('📱 Phone VR Mode Active! Place phone into Google Cardboard. Gaze at buttons for 1.2s or tap screen.');
      // Attempt fullscreen
      try {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } catch {
        // Fullscreen optional
      }
    }
  };

  const enterWebXR = async () => {
    if (!rendererRef.current) return;
    try {
      const session = await navigator.xr?.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
      });
      if (session) {
        await rendererRef.current.xr.setSession(session);
        setVrMode('webxr');
        session.addEventListener('end', () => setVrMode('desktop'));
      }
    } catch (err) {
      console.warn('Could not enter WebXR session', err);
      showToast('WebXR VR headset not detected. Launching in Desktop 3D Mode.');
    }
  };

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 4000);
  };

  // ── Desktop Mouse Orbit & Interaction ──

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !scene3DRef.current || vrMode !== 'desktop') return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    // Orbit camera gently around the lab bench
    scene3DRef.current.camera.rotation.y -= deltaX * 0.003;
    scene3DRef.current.camera.rotation.x -= deltaY * 0.002;
    scene3DRef.current.camera.rotation.x = Math.max(-0.6, Math.min(0.6, scene3DRef.current.camera.rotation.x));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!scene3DRef.current) return;

    // In Phone VR mode, any screen tap triggers the current action!
    if (vrMode === 'cardboard') {
      scene3DRef.current.triggerNextAction();
      return;
    }

    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, scene3DRef.current.camera);

    // Check HUD button hit
    const hudHits = raycaster.current.intersectObject(scene3DRef.current.hud.mesh);
    if (hudHits.length > 0 && hudHits[0].uv) {
      const handled = scene3DRef.current.hud.checkClick(hudHits[0].uv);
      if (handled) return;
    }

    // Check apparatus hits
    const flaskHits = raycaster.current.intersectObjects([
      scene3DRef.current.flaskGroup,
      scene3DRef.current.tubeGroup,
      scene3DRef.current.corkMesh,
      scene3DRef.current.balanceGroup,
    ], true);

    if (flaskHits.length > 0) {
      scene3DRef.current.triggerNextAction();
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#090d16',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* VR Mode Controls Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      >
        {/* Left: Back button & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
          <button
            onClick={onBackToLab}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            ← Exit 3D VR
          </button>
          <div style={{ color: '#f8fafc', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Conservation of Mass — 3D VR Lab
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#2dd4bf', margin: 0 }}>
              BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl
            </p>
          </div>
        </div>

        {/* Right: VR Mode Selectors */}
        <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
          {/* Phone VR (Google Cardboard) Button */}
          <button
            onClick={enterPhoneCardboardVR}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              background: vrMode === 'cardboard' ? 'rgba(13, 148, 136, 0.9)' : 'rgba(15, 23, 42, 0.85)',
              border: '1px solid #0d9488',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>📱</span>
            <span>Phone VR (Cardboard)</span>
          </button>

          {/* WebXR Headset Button */}
          <button
            onClick={enterWebXR}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              background: vrMode === 'webxr' ? 'rgba(37, 99, 235, 0.9)' : 'rgba(15, 23, 42, 0.85)',
              border: '1px solid #2563eb',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>🥽</span>
            <span>{isXRSupported ? 'Enter WebXR Headset' : 'WebXR VR'}</span>
          </button>

          {/* Desktop 3D Mode */}
          {vrMode !== 'desktop' && (
            <button
              onClick={() => setVrMode('desktop')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🖥️ Desktop 3D
            </button>
          )}
        </div>
      </div>

      {/* Floating Status Toast */}
      {statusToast && (
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #0d9488',
            color: '#f8fafc',
            padding: '12px 24px',
            borderRadius: 30,
            fontSize: '0.88rem',
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          {statusToast}
        </div>
      )}

      {/* Mobile Cardboard Viewport Divider Line (split-screen) */}
      {vrMode === 'cardboard' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: 2,
            background: 'rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
};

export default ConservationVRLab;
