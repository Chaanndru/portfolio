import * as THREE from 'three';

export class SkillsScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight || 250;

    this.init();
    this.createPolyhedra();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xff2a55, 2.5, 12);
    mainLight.position.set(3, 3, 4);
    this.scene.add(mainLight);
  }

  createPolyhedra() {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Shape 1: Octahedron (C / Hardware)
    const shape1Geo = new THREE.OctahedronGeometry(0.75, 0);
    const shape1Mat = new THREE.MeshStandardMaterial({
      color: 0xff2a55,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true
    });
    this.shape1 = new THREE.Mesh(shape1Geo, shape1Mat);
    this.shape1.position.set(-1.8, 0, 0);
    this.group.add(this.shape1);

    // Shape 2: TorusKnot (Algorithms / DSA)
    const shape2Geo = new THREE.TorusKnotGeometry(0.55, 0.15, 64, 16);
    const shape2Mat = new THREE.MeshStandardMaterial({
      color: 0xffb2bd,
      emissive: 0x800d23,
      metalness: 0.9,
      roughness: 0.1
    });
    this.shape2 = new THREE.Mesh(shape2Geo, shape2Mat);
    this.shape2.position.set(0, 0, 0);
    this.group.add(this.shape2);

    // Shape 3: Dodecahedron (Database / Relational Nodes)
    const shape3Geo = new THREE.DodecahedronGeometry(0.7, 0);
    const shape3Mat = new THREE.MeshStandardMaterial({
      color: 0xff2a55,
      metalness: 0.7,
      roughness: 0.3,
      wireframe: false
    });
    this.shape3 = new THREE.Mesh(shape3Geo, shape3Mat);
    this.shape3.position.set(1.8, 0, 0);
    this.group.add(this.shape3);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const t = Date.now() * 0.0015;

    if (this.shape1) {
      this.shape1.rotation.x = t;
      this.shape1.rotation.y = t * 0.8;
      this.shape1.position.y = Math.sin(t * 1.5) * 0.15;
    }
    if (this.shape2) {
      this.shape2.rotation.y = t * 1.2;
      this.shape2.rotation.z = t * 0.5;
      this.shape2.position.y = Math.cos(t * 1.8) * 0.12;
    }
    if (this.shape3) {
      this.shape3.rotation.y = -t * 0.9;
      this.shape3.rotation.x = t * 0.7;
      this.shape3.position.y = Math.sin(t * 1.3 + 1) * 0.15;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
