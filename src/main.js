import { HeroScene } from './3d/HeroScene.js';
import { CyberShieldScene } from './3d/CyberShieldScene.js';
import { SkillsScene } from './3d/SkillsScene.js';
import { BackgroundParticles } from './3d/BackgroundParticles.js';
import gsap from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Background Starfield
  new BackgroundParticles('bg-particles-viewport');

  // 2. Initialize Hero 3D Workstation
  const heroScene = new HeroScene('hero-3d-viewport');

  // Wireframe & Reset Camera Button Handlers
  const btnWireframe = document.getElementById('btn-wireframe');
  if (btnWireframe) {
    btnWireframe.addEventListener('click', () => {
      if (heroScene) heroScene.toggleWireframe();
    });
  }

  const btnResetCam = document.getElementById('btn-reset-cam');
  if (btnResetCam) {
    btnResetCam.addEventListener('click', () => {
      if (heroScene) heroScene.resetCamera();
    });
  }

  // 3. Initialize Skills 3D Polyhedra
  new SkillsScene('skills-3d-viewport');

  // 4. Initialize Cyber Shield 3D
  const cyberShieldScene = new CyberShieldScene('cyber-3d-viewport');

  // 5. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 6. Global Interactive Helpers attached to window object for inline onclick handlers
  window.toggleSlot = function (btn) {
    const isBooked = btn.classList.contains('slot-booked');
    if (isBooked) {
      btn.classList.remove('slot-booked');
      btn.classList.add('slot-open');
      btn.innerText = btn.innerText.replace('[BOOKED]', '[OPEN]');
    } else {
      btn.classList.remove('slot-open');
      btn.classList.add('slot-booked');
      btn.innerText = btn.innerText.replace('[OPEN]', '[BOOKED]');
    }
  };

  window.pingNode = function (element, message) {
    const log = document.getElementById('network-log');
    if (log) {
      log.innerText = `>>> AUDIT ACK: ${message} (0ms packet loss)`;
      log.classList.remove('text-outline');
      log.classList.add('text-primary-container', 'font-semibold');
      setTimeout(() => {
        log.classList.remove('text-primary-container', 'font-semibold');
        log.classList.add('text-outline');
      }, 2500);
    }
    if (cyberShieldScene) {
      cyberShieldScene.pingPulse();
    }
  };

  window.handleTransmit = function (e) {
    e.preventDefault();
    const btn = document.getElementById('btn-transmit');
    if (!btn) return;

    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined text-base animate-spin">refresh</span><span>TRANSMITTED TO CHANDRU</span>';
    btn.classList.add('bg-ruby-deep', 'text-white');

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('bg-ruby-deep', 'text-white');
      const form = document.getElementById('contact-form');
      if (form) form.reset();
    }, 3000);
  };

  // 7. Entrance GSAP Animation Sequence
  gsap.from('h1', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' });
  gsap.from('#hero-3d-viewport', { opacity: 0, scale: 0.95, duration: 1.2, delay: 0.2, ease: 'power3.out' });
});
