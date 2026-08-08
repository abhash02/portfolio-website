import Lenis from 'lenis';
import { initContactForm } from './contact.js';
import { initCustomCursor } from './cursor.js';

const TOTAL_FRAMES = 240;
const FRAME_DIR = './ezgif-49a8d832d7852ae3-jpg';

const canvas = document.getElementById('scroll-canvas');
const ctx = canvas.getContext('2d');
const loader = document.getElementById('loader');
const loaderProgressBar = document.getElementById('loader-progress-bar');
const loaderPercentage = document.getElementById('loader-percentage');

const frames = [];
let loadedCount = 0;

let targetFrameIndex = 0;
let currentFrameIndex = 0;

// Initialize Lenis smooth scroll engine
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1.0,
});

function updateTargetFrame(progress) {
  if (typeof progress === 'number' && !isNaN(progress)) {
    targetFrameIndex = Math.min(1, Math.max(0, progress)) * (TOTAL_FRAMES - 1);
  } else {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const p = Math.min(1, Math.max(0, scrollY / maxScroll));
      targetFrameIndex = p * (TOTAL_FRAMES - 1);
    }
  }
}

function handleNavbarScroll(scrollY) {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const currentY = typeof scrollY === 'number' ? scrollY : window.scrollY;
  if (currentY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

lenis.on('scroll', (e) => {
  if (e && typeof e.progress === 'number') {
    updateTargetFrame(e.progress);
  } else {
    updateTargetFrame();
  }
  if (e && typeof e.scroll === 'number') {
    handleNavbarScroll(e.scroll);
  }
});

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  render();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', () => {
  updateTargetFrame();
  handleNavbarScroll();
}, { passive: true });

function drawFrame(img) {
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const canvasW = canvas.width;
  const canvasH = canvas.height;
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  const scale = Math.max(canvasW / imgW, canvasH / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;

  let x = (canvasW - drawW) / 2;
  let y = (canvasH - drawH) / 2;

  // On mobile screens (width <= 768), optimize horizontal focal point so face is fully visible
  if (window.innerWidth <= 768) {
    x = (canvasW - drawW) * 0.52; // Subtle shift to keep subject/face fully visible & centered
    y = Math.min(0, (canvasH - drawH) / 3); // Align top portion for portrait visibility
  }

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, x, y, drawW, drawH);
}

function render() {
  const roundedIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameIndex)));
  const img = frames[roundedIndex];
  if (img && img.complete) {
    drawFrame(img);
  }
}

function animate(time) {
  lenis.raf(time);

  const diff = targetFrameIndex - currentFrameIndex;
  if (Math.abs(diff) > 0.001) {
    currentFrameIndex += diff * 0.15;
    render();
  } else if (currentFrameIndex !== targetFrameIndex) {
    currentFrameIndex = targetFrameIndex;
    render();
  }

  requestAnimationFrame(animate);
}

function updateLoaderUI(percent) {
  if (loaderProgressBar) {
    loaderProgressBar.style.width = `${percent}%`;
  }
  if (loaderPercentage) {
    loaderPercentage.textContent = `${percent}%`;
  }
}

function preloadFrames() {
  resizeCanvas();

  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(3, '0');
    img.src = `${FRAME_DIR}/ezgif-frame-${frameNum}.jpg`;

    img.onload = () => {
      loadedCount++;
      const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
      updateLoaderUI(percent);

      if (i === 1) {
        render();
      }

      if (loadedCount === TOTAL_FRAMES) {
        onPreloadComplete();
      }
    };

    img.onerror = () => {
      loadedCount++;
      const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
      updateLoaderUI(percent);
      if (loadedCount === TOTAL_FRAMES) {
        onPreloadComplete();
      }
    };

    frames.push(img);
  }
}

function onPreloadComplete() {
  updateLoaderUI(100);
  setTimeout(() => {
    if (loader) {
      loader.classList.add('hidden');
    }
    updateTargetFrame();
    currentFrameIndex = targetFrameIndex;
    render();
  }, 250);
}

preloadFrames();
requestAnimationFrame(animate);

// Workflow Section Premium Animations & Interactions
function initWorkflowInteractions() {
  const workflowSection = document.getElementById('workflow');
  if (!workflowSection) return;

  const cards = Array.from(workflowSection.querySelectorAll('.timeline-node-card'));

  // 1. IntersectionObserver for Stagger Reveal & Connector Line
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        workflowSection.classList.add('in-view');
        observer.unobserve(workflowSection);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(workflowSection);

  // 2. Active Card Highlight on Scroll
  function updateActiveCard() {
    if (!workflowSection.classList.contains('in-view')) return;
    const viewportCenter = window.innerHeight / 2;
    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const dist = Math.abs(viewportCenter - cardCenter);

      if (dist < minDistance && rect.bottom > 0 && rect.top < window.innerHeight) {
        minDistance = dist;
        closestCard = card;
      }
    });

    cards.forEach((card) => {
      if (card === closestCard) {
        card.classList.add('card-active');
      } else {
        card.classList.remove('card-active');
      }
    });
  }

  lenis.on('scroll', updateActiveCard);
  window.addEventListener('scroll', updateActiveCard, { passive: true });

  // 3. Lightweight Mouse Parallax (2-3px max offset)
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let isHovering = false;

  workflowSection.addEventListener('mousemove', (e) => {
    const rect = workflowSection.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    targetX = ((e.clientX - centerX) / (rect.width / 2)) * 3;
    targetY = ((e.clientY - centerY) / (rect.height / 2)) * 3;
    isHovering = true;
  });

  workflowSection.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    isHovering = false;
  });

  function updateParallax() {
    if (isHovering || Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      cards.forEach((card) => {
        if (!card.matches(':hover')) {
          card.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        }
      });
    }
    requestAnimationFrame(updateParallax);
  }

  requestAnimationFrame(updateParallax);
}

// Global Scroll Reveal Animations & Mobile Interactions
function initScrollReveal() {
  const selectors = [
    '.hero-services',
    '.brands-section',
    '.exp-mini-card',
    '.behind-header',
    '.project-card',
    '.workflow-header-grid',
    '.timeline-node-card',
    '.color-card',
    '.contact-header',
    '.contact-info-banner',
    '.contact-form'
  ];

  const elements = document.querySelectorAll(selectors.join(', '));

  elements.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    const delayClass = `reveal-delay-${(index % 3) + 1}`;
    el.classList.add(delayClass);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach((el) => observer.observe(el));
}

function initMobileCardHighlight() {
  const cards = document.querySelectorAll('.project-card, .exp-mini-card, .color-card, .timeline-node-card');
  if (cards.length === 0) return;

  function checkActiveCards() {
    if (window.innerWidth > 768) return;
    const viewportCenter = window.innerHeight / 2;
    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(viewportCenter - cardCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestCard = card;
        }
      }
    });

    cards.forEach((card) => {
      if (card === closestCard) {
        card.classList.add('mobile-card-active');
      } else {
        card.classList.remove('mobile-card-active');
      }
    });
  }

  lenis.on('scroll', checkActiveCards);
  window.addEventListener('scroll', checkActiveCards, { passive: true });
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  function toggleMenu() {
    const isActive = navLinks.classList.contains('active');
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    navLinks.classList.add('active');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('active');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggleMenu);

  const links = navLinks.querySelectorAll('a');
  links.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

function initAllAnimations() {
  initCustomCursor();
  initWorkflowInteractions();
  initScrollReveal();
  initMobileCardHighlight();
  initMobileMenu();
  initContactForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
  initAllAnimations();
}
