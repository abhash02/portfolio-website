/**
 * Custom Cursor System
 * - Tiny cyan glowing center dot (#00E5FF)
 * - Transparent ring with soft blur & smooth spring physics
 * - Motion-responsive particle trail with canvas
 * - Contextual hover states (Buttons, Links, Cards, Text)
 * - Click compression & pulse feedback
 * - Auto-disabled on mobile/touch devices & prefers-reduced-motion
 * - High-performance 60 FPS requestAnimationFrame loop
 */

export function initCustomCursor() {
  // Check for touch / mobile pointers
  const isTouchDevice = ('ontouchstart' in window) ||
                        (navigator.maxTouchPoints > 0) ||
                        window.matchMedia('(pointer: coarse)').matches;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice) {
    return;
  }

  if (document.getElementById('custom-cursor-container')) {
    return;
  }

  // Enable cursor hiding via CSS on non-touch devices
  document.documentElement.classList.add('has-custom-cursor');

  // Container
  const container = document.createElement('div');
  container.id = 'custom-cursor-container';
  container.className = 'custom-cursor-container is-hidden';

  // Canvas for faint particle trail
  const canvas = document.createElement('canvas');
  canvas.className = 'custom-cursor-canvas';
  container.appendChild(canvas);

  // Outer Ring
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  container.appendChild(ring);

  // Center Dot
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  container.appendChild(dot);

  document.body.appendChild(container);

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // State variables
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;
  let prevMouseX = mouseX;
  let prevMouseY = mouseY;

  let isHoverButton = false;
  let isHoverLink = false;
  let isHoverCard = false;
  let isHoverText = false;
  let isClicking = false;
  let isHidden = true;

  let ringScale = 1;
  let targetRingScale = 1;

  const particles = [];
  const maxParticles = 30;

  const pulses = [];

  class Particle {
    constructor(x, y, vx, vy, color) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.size = Math.random() * 2 + 1.2;
      this.alpha = 0.55;
      this.decay = Math.random() * 0.025 + 0.02;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.alpha -= this.decay;
    }
    draw(context) {
      if (this.alpha <= 0) return;
      context.save();
      context.globalAlpha = Math.max(0, this.alpha);
      context.fillStyle = this.color;
      context.shadowColor = this.color;
      context.shadowBlur = 6;
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  class Pulse {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.radius = 6;
      this.maxRadius = 36;
      this.alpha = 0.85;
      this.color = color;
    }
    update() {
      this.radius += (this.maxRadius - this.radius) * 0.16;
      this.alpha -= 0.045;
    }
    draw(context) {
      if (this.alpha <= 0) return;
      context.save();
      context.globalAlpha = Math.max(0, this.alpha);
      context.strokeStyle = this.color;
      context.lineWidth = 2;
      context.shadowColor = this.color;
      context.shadowBlur = 10;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }
  }

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (isHidden) {
      isHidden = false;
      container.classList.remove('is-hidden');
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isHidden = true;
    container.classList.add('is-hidden');
  });

  document.addEventListener('mouseenter', () => {
    isHidden = false;
    container.classList.remove('is-hidden');
  });

  document.addEventListener('mousedown', () => {
    isClicking = true;
    container.classList.add('is-clicking');

    let pulseColor = '#00E5FF';
    if (isHoverButton) pulseColor = '#FF7A00';
    else if (isHoverLink) pulseColor = '#FFFFFF';
    else if (isHoverCard) pulseColor = '#00E5FF';
    else if (isHoverText) pulseColor = '#8B5CF6';

    pulses.push(new Pulse(mouseX, mouseY, pulseColor));
  });

  document.addEventListener('mouseup', () => {
    isClicking = false;
    container.classList.remove('is-clicking');
  });

  // Event Delegation for hover detection
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target || !(target instanceof HTMLElement)) return;

    const btn = target.closest('button, .btn-primary, .btn-action, .btn-repo, .btn-submit, .btn-view-all, .filter-pill, .modal-close, [role="button"], input[type="submit"]');
    const link = target.closest('a, .nav-link, .info-link, a[href]');
    const card = target.closest('.project-card, .project-card-expanded, .arch-card, .stack-card, .timeline-node-card, .exp-mini-card');
    const text = target.closest('p, h1, h2, h3, h4, h5, h6, label, input[type="text"], input[type="email"], textarea');

    isHoverButton = !!btn;
    isHoverLink = !btn && !!link;
    isHoverCard = !btn && !link && !!card;
    isHoverText = !btn && !link && !card && !!text;

    container.classList.toggle('is-hover-button', isHoverButton);
    container.classList.toggle('is-hover-link', isHoverLink);
    container.classList.toggle('is-hover-card', isHoverCard);
    container.classList.toggle('is-hover-text', isHoverText);
  }, { passive: true });

  function render() {
    // Dot lerp (snappy position)
    const dotLerp = prefersReducedMotion ? 1 : 0.45;
    dotX += (mouseX - dotX) * dotLerp;
    dotY += (mouseY - dotY) * dotLerp;

    // Ring spring lerp (trailing effect)
    const ringLerp = prefersReducedMotion ? 1 : 0.15;
    ringX += (mouseX - ringX) * ringLerp;
    ringY += (mouseY - ringY) * ringLerp;

    // Determine target scale
    if (isClicking) {
      targetRingScale = 0.75;
    } else if (isHoverButton) {
      targetRingScale = 1.4;
    } else if (isHoverLink) {
      targetRingScale = 1.2;
    } else if (isHoverCard) {
      targetRingScale = 1.5;
    } else if (isHoverText) {
      targetRingScale = 0.65;
    } else {
      targetRingScale = 1.0;
    }

    ringScale += (targetRingScale - ringScale) * 0.18;

    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!prefersReducedMotion && !isHidden) {
      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const speed = Math.hypot(dx, dy);

      if (speed > 2.5 && particles.length < maxParticles) {
        const color = Math.random() > 0.45 ? '#00E5FF' : '#8B5CF6';
        const vx = (Math.random() - 0.5) * 1.2 - dx * 0.05;
        const vy = (Math.random() - 0.5) * 1.2 - dy * 0.05;
        particles.push(new Particle(dotX, dotY, vx, vy, color));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.update();
        pulse.draw(ctx);
        if (pulse.alpha <= 0) {
          pulses.splice(i, 1);
        }
      }
    }

    prevMouseX = mouseX;
    prevMouseY = mouseY;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
