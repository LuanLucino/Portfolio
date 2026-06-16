/* ================================================
   NAVBAR — blur on scroll
   ================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ================================================
   HAMBURGER MENU
   ================================================ */
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMenu() {
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  mobileOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () =>
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
);

mobileOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-menu nav a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ================================================
   TYPING ANIMATION
   ================================================ */
const words = [
  'Desenvolvedor Web',
  'Frontend Developer',
  'UI Designer',
  'Criador Digital',
];

let wordIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const typedEl  = document.getElementById('typed');

function type() {
  if (!typedEl) return;

  const current = words[wordIndex];

  typedEl.textContent = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);

  isDeleting ? charIndex-- : charIndex++;

  let delay = isDeleting ? 55 : 95;

  if (!isDeleting && charIndex === current.length) {
    delay      = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex  = (wordIndex + 1) % words.length;
    delay      = 380;
  }

  setTimeout(type, delay);
}

type();

/* ================================================
   SCROLL REVEAL — Intersection Observer
   ================================================ */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    el.classList.add('visible');

    // Reset transition-delay after animation so hover is instant
    const delay = parseFloat(getComputedStyle(el).transitionDelay) * 1000 || 0;
    setTimeout(() => { el.style.transitionDelay = '0s'; }, 750 + delay);

    revealObserver.unobserve(el);
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
});

reveals.forEach(el => revealObserver.observe(el));

/* ================================================
   PARALLAX — hero background orbs
   ================================================ */
const orbs = document.querySelectorAll('.orb');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  orbs.forEach((orb, i) => {
    orb.style.transform = `translateY(${y * (i + 1) * 0.06}px)`;
  });
}, { passive: true });

/* ================================================
   ACTIVE NAV LINK on scroll
   ================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${current}`
    );
  });
}, { passive: true });

/* ================================================
   SERVICE WORKER — PWA
   ================================================ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(() => console.log('PWA ativo'))
      .catch(err => console.error('Erro no PWA:', err));
  });
}
