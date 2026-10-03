import * as THREE from 'three';

export class CyberShieldScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight || 300;

    this.init();
    this.createShield();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 4.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xff2a55, 3, 10);
    redLight.position.set(2, 2, 3);
    this.scene.add(redLight);
  }

  createShield() {
    this.shieldGroup = new THREE.Group();
    this.scene.add(this.shieldGroup);

    // 1. Octahedron / Diamond Core Shield shape
    const shieldGeo = new THREE.OctahedronGeometry(1.2, 0);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xff2a55,
      emissive: 0x800d23,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: true
    });
    this.shield = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldGroup.add(this.shield);

    // Inner Solid Core
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xff3366,
      wireframe: false
    });
    this.core = new THREE.Mesh(coreGeo, coreMat);
    this.shieldGroup.add(this.core);

    // Orbital Ring 1
    const ring1Geo = new THREE.TorusGeometry(1.6, 0.015, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xff2a55, transparent: true, opacity: 0.8 });
    this.ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.ring1.rotation.x = Math.PI / 4;
    this.shieldGroup.add(this.ring1);

    // Orbital Ring 2
    const ring2Geo = new THREE.TorusGeometry(1.9, 0.012, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xffb2bd, transparent: true, opacity: 0.5 });
    this.ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.ring2.rotation.y = Math.PI / 3;
    this.shieldGroup.add(this.ring2);

    // Orbital Node Particles
    const nodesCount = 12;
    this.nodesGroup = new THREE.Group();
    for (let i = 0; i < nodesCount; i++) {
      const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xff2a55 });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / nodesCount) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0);
      this.nodesGroup.add(node);
    }
    this.nodesGroup.rotation.x = Math.PI / 4;
    this.shieldGroup.add(this.nodesGroup);
  }

  pingPulse() {
    if (!this.core) return;
    const origScale = this.core.scale.x;
    this.core.scale.set(1.4, 1.4, 1.4);
    setTimeout(() => {
      this.core.scale.set(origScale, origScale, origScale);
    }, 400);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.shieldGroup) {
      this.shieldGroup.rotation.y += 0.01;
    }
    if (this.shield) {
      this.shield.rotation.x += 0.005;
    }
    if (this.ring1) {
      this.ring1.rotation.z += 0.015;
    }
    if (this.ring2) {
      this.ring2.rotation.x -= 0.01;
    }
    if (this.nodesGroup) {
      this.nodesGroup.rotation.z += 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
