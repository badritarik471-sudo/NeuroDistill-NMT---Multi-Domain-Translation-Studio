import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sliders, Eye, RefreshCw, Layers, Zap, Info } from 'lucide-react';
import { DomainType } from '../types';

interface ThreeNeuralSceneProps {
  activeDomain: DomainType | 'all';
  onSelectDomain: (domain: DomainType | 'all') => void;
  temperature: number;
  alpha: number;
  onTemperatureChange: (val: number) => void;
  onAlphaChange: (val: number) => void;
}

export const ThreeNeuralScene: React.FC<ThreeNeuralSceneProps> = ({
  activeDomain,
  onSelectDomain,
  temperature,
  alpha,
  onTemperatureChange,
  onAlphaChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [explodedView, setExplodedView] = useState(false);
  const [inspectingNode, setInspectingNode] = useState<string | null>('Multi-Teacher Distilled Student');
  const [activeCamPreset, setActiveCamPreset] = useState<'default' | 'student' | 'teachers' | 'top'>('default');

  // Mutable refs for Three.js state loop
  const propsRef = useRef({
    activeDomain,
    temperature,
    alpha,
    explodedView,
    activeCamPreset,
  });

  useEffect(() => {
    propsRef.current = {
      activeDomain,
      temperature,
      alpha,
      explodedView,
      activeCamPreset,
    };
  }, [activeDomain, temperature, alpha, explodedView, activeCamPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js skill directive
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.028);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 10, 18);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going under floor
    controls.minDistance = 5;
    controls.maxDistance = 35;
    controls.target.set(0, 2.5, 0);

    // RoomEnvironment reflection map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.2);
    keyLight.position.set(8, 15, 8);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 40;
    const d = 12;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x7090ff, 0x1a2035, 1.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.5);
    rimLight.position.set(-10, 6, -10);
    scene.add(rimLight);

    // Ground Floor Grid + Radial Shadow
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c1220,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Floor Grid lines
    const gridHelper = new THREE.GridHelper(40, 40, 0x1e3a8a, 0x0f2042);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // ==========================================
    // 1. Central Student Model (Composite 3-12 Part Mesh)
    // ==========================================
    const studentGroup = new THREE.Group();
    studentGroup.position.set(0, 0, 0);
    scene.add(studentGroup);

    // Part 1: Heavy Octagonal Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.5, 0.4, 8);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.2;
    base.castShadow = !isSoftwareGl;
    base.receiveShadow = !isSoftwareGl;
    studentGroup.add(base);

    // Part 2: Beveled Gold Ring Trim
    const ringGeo = new THREE.TorusGeometry(2.3, 0.08, 16, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ring = new THREE.Mesh(ringGeo, goldMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.42;
    studentGroup.add(ring);

    // Part 3: Encoder Stack (6 modular layer slabs)
    const encoderLayers: THREE.Mesh[] = [];
    const layerGeo = new THREE.BoxGeometry(2.4, 0.22, 2.4);
    const encMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.7,
      roughness: 0.25,
    });
    for (let i = 0; i < 6; i++) {
      const layer = new THREE.Mesh(layerGeo, encMat);
      layer.position.y = 0.65 + i * 0.32;
      layer.castShadow = !isSoftwareGl;
      studentGroup.add(layer);
      encoderLayers.push(layer);
    }

    // Part 4: Central Multi-Head Attention Core (Glow Cylinder & Glass Sleeve)
    const coreGeo = new THREE.CylinderGeometry(0.5, 0.5, 3.8, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 2.4;
    studentGroup.add(core);

    // Part 5: Decoder Stack (6 modular layer slabs)
    const decoderLayers: THREE.Mesh[] = [];
    const decMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.7,
      roughness: 0.25,
    });
    for (let i = 0; i < 6; i++) {
      const layer = new THREE.Mesh(layerGeo, decMat);
      layer.position.y = 2.7 + i * 0.32;
      layer.castShadow = !isSoftwareGl;
      studentGroup.add(layer);
      decoderLayers.push(layer);
    }

    // Part 6: Output Softmax Projection Disc
    const outputGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.3, 16);
    const outputMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x059669,
      emissiveIntensity: 0.3,
    });
    const outputDisc = new THREE.Mesh(outputGeo, outputMat);
    outputDisc.position.y = 4.8;
    studentGroup.add(outputDisc);

    // Part 7: Crown Halo / Target Generator
    const haloGeo = new THREE.TorusGeometry(1.6, 0.06, 16, 32);
    const halo = new THREE.Mesh(haloGeo, goldMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 5.0;
    studentGroup.add(halo);

    // ==========================================
    // 2. Specialized Teachers (Composite 3-12 Part Models)
    // ==========================================
    interface TeacherModelData {
      id: DomainType;
      name: string;
      color: number;
      angle: number;
      group: THREE.Group;
      beaconMesh: THREE.Mesh;
    }

    const teacherData: { id: DomainType; name: string; color: number; angle: number }[] = [
      { id: 'finance', name: 'Finance (IFRS & Audit)', color: 0x10b981, angle: -Math.PI * 0.4 },
      { id: 'banque', name: 'Banque (Crédit & Paiements)', color: 0x06b6d4, angle: -Math.PI * 0.2 },
      { id: 'technologie', name: 'Technologie & IT (Code & API)', color: 0x3b82f6, angle: 0 },
      { id: 'droit', name: 'Droit & Conformité (Contrats)', color: 0xf59e0b, angle: Math.PI * 0.2 },
      { id: 'sante', name: 'Santé & Médecine (Dosages)', color: 0xef4444, angle: Math.PI * 0.4 },
    ];

    const teacherRadius = 7.8;
    const teachers: TeacherModelData[] = [];

    teacherData.forEach((t) => {
      const tGroup = new THREE.Group();
      const x = Math.sin(t.angle) * teacherRadius;
      const z = Math.cos(t.angle) * teacherRadius;
      tGroup.position.set(x, 0, z);
      scene.add(tGroup);

      // Part 1: Pedestal Base
      const tBaseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.3, 12);
      const tBaseMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.3,
      });
      const tBase = new THREE.Mesh(tBaseGeo, tBaseMat);
      tBase.position.y = 0.15;
      tBase.castShadow = !isSoftwareGl;
      tGroup.add(tBase);

      // Part 2: Column Body (Hexagonal Tower)
      const colGeo = new THREE.CylinderGeometry(0.8, 1.0, 2.6, 6);
      const colMat = new THREE.MeshStandardMaterial({
        color: t.color,
        metalness: 0.6,
        roughness: 0.25,
      });
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.y = 1.5;
      col.castShadow = !isSoftwareGl;
      tGroup.add(col);

      // Part 3: Metallic Ring
      const tRing = new THREE.Mesh(ringGeo, goldMat);
      tRing.scale.set(0.45, 0.45, 0.45);
      tRing.rotation.x = Math.PI / 2;
      tRing.position.y = 2.85;
      tGroup.add(tRing);

      // Part 4: Emissive Beacon Transmitter (Soft Distribution Emitter)
      const beaconGeo = new THREE.IcosahedronGeometry(0.5, 1);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: t.color,
        emissive: t.color,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 3.4;
      tGroup.add(beacon);

      teachers.push({
        id: t.id,
        name: t.name,
        color: t.color,
        angle: t.angle,
        group: tGroup,
        beaconMesh: beacon,
      });
    });

    // ==========================================
    // 3. Knowledge Distillation Particle Streams (Soft targets flow)
    // ==========================================
    const streamParticleCount = 60;
    const particlePositions = new Float32Array(streamParticleCount * 3);
    const particleColors = new Float32Array(streamParticleCount * 3);

    for (let i = 0; i < streamParticleCount; i++) {
      const teacherIdx = i % teachers.length;
      const t = teachers[teacherIdx];
      const c = new THREE.Color(t.color);
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;

      // Start somewhere on line between teacher and student
      const frac = Math.random();
      particlePositions[i * 3] = t.group.position.x * (1 - frac);
      particlePositions[i * 3 + 1] = 3.4 * (1 - frac) + 2.5 * frac + Math.sin(frac * Math.PI) * 1.5;
      particlePositions[i * 3 + 2] = t.group.position.z * (1 - frac);
    }

    const streamGeo = new THREE.BufferGeometry();
    streamGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    streamGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const streamMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const streamParticles = new THREE.Points(streamGeo, streamMat);
    scene.add(streamParticles);

    // ==========================================
    // Render loop and Pacing (as per Three.js skill)
    // ==========================================
    let frameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const currentProps = propsRef.current;

      // Rotate crowns & beacons
      halo.rotation.z += 0.01;
      teachers.forEach((t, idx) => {
        t.beaconMesh.rotation.y += 0.02 * (idx % 2 === 0 ? 1 : -1);
        t.beaconMesh.rotation.x += 0.01;

        // Domain highlighting: pulse emissive when domain is active
        const isDomainActive = currentProps.activeDomain === 'all' || currentProps.activeDomain === t.id;
        const mat = t.beaconMesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isDomainActive ? 0.8 + Math.sin(elapsedTime * 3) * 0.3 : 0.15;
      });

      // Animate Distillation Particle Stream
      const posAttr = streamGeo.attributes.position as THREE.BufferAttribute;
      const speed = 0.5 + currentProps.temperature * 0.1;

      for (let i = 0; i < streamParticleCount; i++) {
        const teacherIdx = i % teachers.length;
        const teacher = teachers[teacherIdx];
        const isDomainActive = currentProps.activeDomain === 'all' || currentProps.activeDomain === teacher.id;

        let frac = ((elapsedTime * speed + (i / streamParticleCount)) % 1);
        if (!isDomainActive) {
          frac = 0; // suspend inactive teacher stream
        }

        const tx = teacher.group.position.x;
        const tz = teacher.group.position.z;
        const ty = 3.4;

        const sx = 0;
        const sz = 0;
        const sy = 2.5;

        // Bezier arch trajectory
        const arch = Math.sin(frac * Math.PI) * (1.2 + currentProps.alpha);
        const curX = tx * (1 - frac) + sx * frac;
        const curY = ty * (1 - frac) + sy * frac + arch;
        const curZ = tz * (1 - frac) + sz * frac;

        posAttr.setXYZ(i, curX, curY, curZ);
      }
      posAttr.needsUpdate = true;

      // Handle Exploded View separation smoothly with exponential damping
      const targetSep = currentProps.explodedView ? 0.28 : 0.0;
      encoderLayers.forEach((l, i) => {
        const baseOffset = 0.65 + i * 0.32;
        const targetY = baseOffset + i * targetSep;
        l.position.y = THREE.MathUtils.damp(l.position.y, targetY, 6, delta);
      });
      decoderLayers.forEach((l, i) => {
        const baseOffset = 2.7 + i * 0.32;
        const targetY = baseOffset + (i + 6) * targetSep;
        l.position.y = THREE.MathUtils.damp(l.position.y, targetY, 6, delta);
      });
      outputDisc.position.y = THREE.MathUtils.damp(outputDisc.position.y, 4.8 + 12 * targetSep, 6, delta);
      halo.position.y = outputDisc.position.y + 0.2;

      // Camera preset transitions
      if (currentProps.activeCamPreset === 'student') {
        camera.position.lerp(new THREE.Vector3(0, 5, 8), 0.04);
        controls.target.lerp(new THREE.Vector3(0, 2.5, 0), 0.04);
      } else if (currentProps.activeCamPreset === 'teachers') {
        camera.position.lerp(new THREE.Vector3(0, 8, 15), 0.04);
        controls.target.lerp(new THREE.Vector3(0, 2, 4), 0.04);
      } else if (currentProps.activeCamPreset === 'top') {
        camera.position.lerp(new THREE.Vector3(0, 20, 2), 0.04);
        controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.04);
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[560px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Spec Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-lg shadow-lg pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-slate-200">
            Multi-Teacher Knowledge Distillation (ECAI 2020)
          </span>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800 px-1.5 py-0.5 rounded">
            BLEU +2.0
          </span>
        </div>
        <div className="text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg max-w-sm pointer-events-auto">
          Inspect 4 Domain Teachers (BNP Paribas Finance, Legal, Medical, Tech) distilling soft target probability tensors into the single Student Transformer.
        </div>
      </div>

      {/* Camera Presets & Exploded View Pill in Top Right */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-lg shadow-lg">
        <button
          onClick={() => setActiveCamPreset('default')}
          className={`px-2.5 py-1 text-xs rounded font-medium transition ${
            activeCamPreset === 'default' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          aria-label="Default camera view"
        >
          Overview
        </button>
        <button
          onClick={() => setActiveCamPreset('student')}
          className={`px-2.5 py-1 text-xs rounded font-medium transition ${
            activeCamPreset === 'student' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          aria-label="Student model focus"
        >
          Student
        </button>
        <button
          onClick={() => setActiveCamPreset('teachers')}
          className={`px-2.5 py-1 text-xs rounded font-medium transition ${
            activeCamPreset === 'teachers' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          aria-label="Teacher models focus"
        >
          Teachers
        </button>
        <button
          onClick={() => setActiveCamPreset('top')}
          className={`px-2.5 py-1 text-xs rounded font-medium transition ${
            activeCamPreset === 'top' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          aria-label="Top-down stream view"
        >
          Top-Down
        </button>
        <div className="w-[1px] h-4 bg-slate-700 mx-1" />
        <button
          onClick={() => setExplodedView(!explodedView)}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded font-medium transition ${
            explodedView ? 'bg-amber-600 text-white' : 'text-amber-400 hover:bg-slate-800'
          }`}
          aria-label="Toggle exploded layer view"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{explodedView ? 'Collapse' : 'Explode 6 Layers'}</span>
        </button>
      </div>

      {/* Unified Bottom Control Dock (Compliant with Three.js Skill Directives) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl transition-all duration-300 ${
          isCollapsed ? 'translate-y-[calc(100%-2.25rem)]' : 'translate-y-0'
        }`}
      >
        {/* Dock Collapse Toggle Button */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1 rounded-t-lg text-xs font-semibold text-slate-300 hover:text-white shadow-md transition"
            aria-label="Toggle 3D control dock"
          >
            <span>{isCollapsed ? '▴ Show Distillation Controls' : '▾ Hide Controls (Zen Mode)'}</span>
          </button>
        </div>

        {/* Dock Main Surface (Solid/rgba without CSS backdrop-blur over WebGL) */}
        <div className="bg-slate-900/95 border border-slate-700 rounded-xl p-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          {/* Domain Teacher Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-medium mr-1">Professeur :</span>
            {(['all', 'finance', 'banque', 'technologie', 'droit', 'sante'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onSelectDomain(d)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition cursor-pointer ${
                  activeDomain === d
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
                aria-label={`Sélectionner l'agent ${d}`}
              >
                {d === 'all' ? 'Tous (Multi-Professeurs)' : d}
              </button>
            ))}
          </div>

          {/* Hyperparameter Controls (Temperature T and Alpha) */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <label htmlFor="temp-slider" className="text-xs text-slate-300 font-mono">
                T = {temperature.toFixed(1)}
              </label>
              <input
                id="temp-slider"
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={temperature}
                onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                aria-label="Softmax temperature T"
              />
              <span className="text-[10px] text-slate-500">Softness</span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="alpha-slider" className="text-xs text-slate-300 font-mono">
                α = {alpha.toFixed(2)}
              </label>
              <input
                id="alpha-slider"
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={alpha}
                onChange={(e) => onAlphaChange(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                aria-label="Distillation loss weight alpha"
              />
              <span className="text-[10px] text-slate-500">KD Weight</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
