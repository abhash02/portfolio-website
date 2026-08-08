import Lenis from 'lenis';
import { initCustomCursor } from './cursor.js';

// Initialize Lenis smooth scroll for projects page
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1.0,
});

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
  if (e && typeof e.scroll === 'number') {
    handleNavbarScroll(e.scroll);
  }
});
window.addEventListener('scroll', () => handleNavbarScroll(), { passive: true });

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Category Filter & Expand Functionality
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  const filterButtons = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card-expanded');
  const extraProjects = document.querySelectorAll('.extra-project');
  const viewAllBtn = document.getElementById('view-all-btn');
  const viewAllCta = document.getElementById('view-all-cta');

  let isExpanded = false;

  function revealExtraProjects() {
    isExpanded = true;
    if (viewAllCta) {
      viewAllCta.classList.add('hidden');
    }
    extraProjects.forEach((card, index) => {
      card.classList.add('revealed');
      card.style.display = 'flex';
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) scale(0.98)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, index * 120);
    });

    setTimeout(() => {
      lenis.resize();
    }, 600);
  }

  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', revealExtraProjects);
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // If user filters by a specific category (not 'all'), auto-expand if not expanded
      if (filterValue !== 'all' && !isExpanded) {
        isExpanded = true;
        if (viewAllCta) viewAllCta.classList.add('hidden');
        extraProjects.forEach((card) => card.classList.add('revealed'));
      }

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const isExtra = card.classList.contains('extra-project');

        if (filterValue === 'all') {
          if (!isExpanded && isExtra) {
            card.style.opacity = '0';
            card.style.display = 'none';
          } else {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 50);
          }
        } else {
          if (category.includes(filterValue)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px) scale(0.98)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        }
      });

      setTimeout(() => {
        lenis.resize();
      }, 350);
    });
  });

  // Modal Detail Functionality
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalTechStack = document.getElementById('modal-tech-stack');
  const modalMetrics = document.getElementById('modal-metrics');
  const modalImg = document.getElementById('modal-img');

  const cardDetailButtons = document.querySelectorAll('.btn-card-details');

  cardDetailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card-expanded');
      if (!card) return;

      const title = card.querySelector('.project-card-title').textContent;
      const tech = card.querySelector('.project-tech').textContent;
      const desc = card.getAttribute('data-full-desc') || card.querySelector('.project-card-desc').textContent;
      const imgSrc = card.querySelector('img').src;
      const metrics = card.getAttribute('data-metrics') || 'Performance: High • Latency: <50ms • Status: Production Ready';

      modalTitle.textContent = title;
      modalCategory.textContent = tech;
      modalDesc.textContent = desc;
      modalImg.src = imgSrc;
      
      // Clear and populate tech tags
      modalTechStack.innerHTML = '';
      tech.split('•').forEach((item) => {
        const span = document.createElement('span');
        span.className = 'tech-pill-tag';
        span.textContent = item.trim();
        modalTechStack.appendChild(span);
      });

      modalMetrics.textContent = metrics;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  // Mobile Menu Toggle for Projects Page
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggleBtn && navLinks) {
    function toggleMenu() {
      const isActive = navLinks.classList.contains('active');
      if (isActive) {
        closeNavMenu();
      } else {
        openNavMenu();
      }
    }

    function openNavMenu() {
      navLinks.classList.add('active');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeNavMenu() {
      navLinks.classList.remove('active');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', toggleMenu);

    const links = navLinks.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('click', closeNavMenu);
    });
  }

  // Scroll Reveal for Projects Page
  const revealElements = document.querySelectorAll('.projects-hero-grid, .projects-stats-strip, .filter-bar-wrapper, .project-card-expanded, .arch-card, .stack-card, .view-all-cta-card');
  revealElements.forEach((el, index) => {
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
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach((el) => observer.observe(el));
});
