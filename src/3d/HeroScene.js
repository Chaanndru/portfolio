import * as THREE from 'three';

export class HeroScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight || 450;
    this.wireframeMode = false;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.init();
    this.createObjects();
    this.addEvents();
    this.animate();
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0e17, 0.035);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.defaultCamPos = { x: 0, y: 1.5, z: 6.5 };
    this.camera.position.set(this.defaultCamPos.x, this.defaultCamPos.y, this.defaultCamPos.z);
    this.camera.lookAt(0, 0, 0);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear existing canvas if any
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xff2a55, 2.2);
    mainLight.position.set(4, 8, 5);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    const rimLight = new THREE.PointLight(0xff3366, 3, 12);
    rimLight.position.set(-4, 3, -2);
    this.scene.add(rimLight);

    const cyanRim = new THREE.PointLight(0x00f0ff, 1.5, 10);
    cyanRim.position.set(3, -1, -3);
    this.scene.add(cyanRim);
  }

  createObjects() {
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    // 1. Desk Base Platform
    const deskGeo = new THREE.BoxGeometry(4.2, 0.12, 2.4);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x181b25,
      roughness: 0.2,
      metalness: 0.8
    });
    this.desk = new THREE.Mesh(deskGeo, deskMat);
    this.desk.position.set(0, -0.6, 0);
    this.desk.receiveShadow = true;
    this.mainGroup.add(this.desk);

    // 2. Central Monitor Frame
    const screenFrameGeo = new THREE.BoxGeometry(2.6, 1.6, 0.08);
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f131c, roughness: 0.3 });
    const screenFrame = new THREE.Mesh(screenFrameGeo, screenFrameMat);
    screenFrame.position.set(0, 0.5, -0.2);
    this.mainGroup.add(screenFrame);

    // Screen Display Panel (Glowing Cyberpunk Terminal)
    const displayGeo = new THREE.PlaneGeometry(2.45, 1.45);
    // Canvas texture for live code lines
    this.canvasTexture = this.createCodeTexture();
    const displayMat = new THREE.MeshBasicMaterial({ map: this.canvasTexture });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0, 0.5, -0.15);
    this.mainGroup.add(display);

    // Monitor Stand Base & Arm
    const standGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.06, 32);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x31353f, metalness: 0.9 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, -0.52, -0.2);
    this.mainGroup.add(stand);

    const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 16);
    const pole = new THREE.Mesh(poleGeo, standMat);
    pole.position.set(0, -0.25, -0.25);
    this.mainGroup.add(pole);

    // 3. Cyber Security Holographic Core Orb floating next to desk
    const orbGeo = new THREE.IcosahedronGeometry(0.4, 2);
    this.orbMat = new THREE.MeshStandardMaterial({
      color: 0xff2a55,
      emissive: 0x800d23,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: false
    });
    this.orb = new THREE.Mesh(orbGeo, this.orbMat);
    this.orb.position.set(1.8, 0.6, 0.4);
    this.mainGroup.add(this.orb);

    // Floating Ring around Orb
    const ringGeo = new THREE.TorusGeometry(0.65, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff2a55, wireframe: true });
    this.orbRing = new THREE.Mesh(ringGeo, ringMat);
    this.orbRing.position.set(1.8, 0.6, 0.4);
    this.orbRing.rotation.x = Math.PI / 3;
    this.mainGroup.add(this.orbRing);

    // 4. Keyboard Platform
    const kbGeo = new THREE.BoxGeometry(1.4, 0.04, 0.5);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x1c1f29, roughness: 0.5 });
    const kb = new THREE.Mesh(kbGeo, kbMat);
    kb.position.set(-0.2, -0.52, 0.5);
    this.mainGroup.add(kb);

    // Keyboard Key Glow Strips
    const keyGlowGeo = new THREE.PlaneGeometry(1.3, 0.42);
    const keyGlowMat = new THREE.MeshBasicMaterial({ color: 0xff2a55, transparent: true, opacity: 0.25 });
    const keyGlow = new THREE.Mesh(keyGlowGeo, keyGlowMat);
    keyGlow.rotation.x = -Math.PI / 2;
    keyGlow.position.set(-0.2, -0.49, 0.5);
    this.mainGroup.add(keyGlow);

    // 5. Grid Floor Plane
    const grid = new THREE.GridHelper(12, 24, 0xff2a55, 0x31353f);
    grid.position.y = -0.61;
    this.mainGroup.add(grid);

    // 6. Floating Particles
    const particleCount = 70;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 8;
      pPos[i + 1] = (Math.random() - 0.2) * 4;
      pPos[i + 2] = (Math.random() - 0.5) * 6;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xff2a55,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.mainGroup.add(this.particles);
  }

  createCodeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Background terminal fill
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, 512, 300);

    // Terminal header strip
    ctx.fillStyle = '#1c1f29';
    ctx.fillRect(0, 0, 512, 35);
    ctx.fillStyle = '#ff2a55';
    ctx.beginPath(); ctx.arc(20, 17, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(38, 17, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(56, 17, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#e6bcbd';
    ctx.font = '14px JetBrains Mono';
    ctx.fillText('kernel_defense_matrix.py — IIIT KTM', 80, 22);

    // Code lines
    ctx.font = '13px JetBrains Mono';
    const lines = [
      'import security_kernel as sec',
      'class CyberDefenseEngine:',
      '  def __init__(self, node_id):',
      '    self.auth_state = sec.SALTED_HASH',
      '    self.perimeter = sec.ISOLATED',
      '    self.graph = sec.DijkstraQueue()',
      '',
      '  def execute_packet_audit(self):',
      '    return sec.verify_signature()',
      '',
      '# Status: HARDENED | FPS: 60'
    ];

    let y = 65;
    lines.forEach((line) => {
      if (line.startsWith('import') || line.startsWith('class') || line.startsWith('def')) {
        ctx.fillStyle = '#ff2a55';
      } else if (line.startsWith('#')) {
        ctx.fillStyle = '#ad8789';
      } else {
        ctx.fillStyle = '#dfe2ef';
      }
      ctx.fillText(line, 25, y);
      y += 20;
    });

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  addEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
      if (!this.container) return;
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight || 450;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });
  }

  toggleWireframe() {
    this.wireframeMode = !this.wireframeMode;
    this.scene.traverse((obj) => {
      if (obj.isMesh && obj !== this.desk) {
        obj.material.wireframe = this.wireframeMode;
      }
    });
  }

  resetCamera() {
    this.camera.position.set(this.defaultCamPos.x, this.defaultCamPos.y, this.defaultCamPos.z);
    this.mouse.targetX = 0;
    this.mouse.targetY = 0;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Mouse Lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Group Rotation and Cam Parallax
    this.mainGroup.rotation.y = this.mouse.x * 0.25;
    this.mainGroup.rotation.x = -this.mouse.y * 0.15;

    // Orb Animations
    if (this.orb) {
      this.orb.rotation.y += 0.015;
      this.orb.position.y = 0.6 + Math.sin(Date.now() * 0.002) * 0.08;
    }
    if (this.orbRing) {
      this.orbRing.rotation.z += 0.02;
      this.orbRing.position.y = this.orb.position.y;
    }

    // Particles Drift
    if (this.particles) {
      this.particles.rotation.y += 0.001;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
