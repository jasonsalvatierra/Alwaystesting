/* ============================================
   APEX TRAINING — Interactive Scripts
   ============================================ */

'use strict';

// ─── NAV scroll effect ───────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
}, { passive: true });

// ─── Hamburger / mobile menu ─────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu(open) {
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));

  // Animate hamburger into X
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  toggleMenu(!isOpen);
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
    toggleMenu(false);
  }
});

// ─── Counter animation ────────────────────────
function animateCounter(el, target, duration = 1800) {
  const isDecimal = target < 100;
  const suffix = el.closest('.stat')?.querySelector('.stat__label')?.textContent.startsWith('%') ? '' : '';
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const value = Math.round(eased * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }

  requestAnimationFrame(step);
}

// ─── Intersection Observer — scroll reveal & counters ──
const revealElements = document.querySelectorAll('.reveal');
const statNumbers = document.querySelectorAll('.stat__number');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target, 10);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ─── Apply reveal class dynamically ──────────
const revealTargets = [
  '.program-card',
  '.workout-row',
  '.athlete-card',
  '.gear-card',
  '.stat',
];

revealTargets.forEach((selector, si) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.07}s`;
    revealObserver.observe(el);
  });
});

// ─── Newsletter form ─────────────────────────
const newsletterForm = document.getElementById('newsletterForm');

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input[type="email"]');
  const btn = newsletterForm.querySelector('button');

  btn.textContent = 'Subscribed!';
  btn.style.background = '#16a34a';
  btn.style.borderColor = '#16a34a';
  input.value = '';
  input.disabled = true;
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
    btn.style.borderColor = '';
    input.disabled = false;
    btn.disabled = false;
  }, 4000);
});

// ─── Workout row hover sound-free click feel ──
document.querySelectorAll('.workout-row').forEach(row => {
  row.addEventListener('click', () => {
    row.style.outline = '2px solid #e50914';
    setTimeout(() => { row.style.outline = ''; }, 300);
  });
});

// ─── Smooth active nav link highlight ────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = '#ffffff';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
