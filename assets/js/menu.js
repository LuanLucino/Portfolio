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
   LINHA DO TEMPO — gráfico de linha ascendente
   - Largura fluida (recalculada no resize): nunca precisa
     de barra de rolagem.
   - Abaixo de TL_MODE_BREAKPOINT (mesmo breakpoint em que a
     navbar vira hamburguer) troca para uma lista vertical
     conectada, que reaproveita o revealObserver acima.
   Estamos em julho/2026: nada é mostrado além do mês atual.
   ================================================ */
const MILESTONES = [
  { year: 2024, months: 'Jan – Mar', langs: ['SQL'], desc: 'Bancos de dados e fundamentos de consultas', yearStart: true },
  { year: 2024, months: 'Abr – Jun', langs: ['HTML'], desc: 'Primeiros contatos com estrutura web' },
  { year: 2024, months: 'Jul – Dez', langs: ['CSS'], desc: 'Estilização e primeiros layouts' },

  { year: 2025, months: 'Jan – Abr', langs: ['JavaScript'], desc: 'Interatividade e lógica de programação', yearStart: true },
  { year: 2025, months: 'Mai – Ago', langs: ['Python'], desc: 'Automação de tarefas e scripts' },
  { year: 2025, months: 'Set – Out', langs: ['C#'], desc: 'Criação de pequenos jogos' },
  { year: 2025, months: 'Nov', langs: ['Fluig', 'RM'], desc: 'Início na área corporativa/ERP, em andamento até hoje', current: true },

  { year: 2026, months: 'Jan – Fev', langs: ['TypeScript', 'JavaScript'], desc: 'Tipagem estática e projetos mais robustos', yearStart: true },
  { year: 2026, months: 'Mar', langs: ['HTML', 'CSS'], desc: 'Refino de interfaces e responsividade em novos sites' },
  { year: 2026, months: 'Abr – Mai', langs: ['PHP', 'React Native'], desc: 'Back-end dinâmico e apps móveis multiplataforma' },
  { year: 2026, months: 'Jun – Jul', langs: ['Node.js'], desc: 'APIs em JavaScript — seguindo com sites em HTML/CSS/JS e com Fluig/RM em paralelo', current: true },
];

const TL_MODE_BREAKPOINT = 1024; // mesmo breakpoint em que a navbar vira hamburguer
const TL_CHART_HEIGHT    = 460;
const TL_X_MARGIN        = 80;
const TL_Y_MARGIN        = 60;
const TL_DRAW_DURATION   = 2200; // ms

let tlCurrentMode     = null;
let tlChartRefs       = null;
let tlResizeScheduled = false;

function tlCatmullRomToBezier(points) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function tlSvgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const key in attrs) el.setAttribute(key, attrs[key]);
  return el;
}

function tlCardContentHTML(m) {
  const langTags = m.langs.map(l => `<span class="tl-tech-tag">${l}</span>`).join('');
  const currentBadge = m.current ? '<span class="tl-badge-current">● Atual</span>' : '';

  return `<span class="tl-months">${m.months} · ${m.year}${currentBadge}</span>` +
         `<div class="tl-langs">${langTags}</div>` +
         `<p class="tl-desc">${m.desc}</p>`;
}

function tlComputeGeometry(width) {
  const xStep = (width - TL_X_MARGIN * 2) / (MILESTONES.length - 1);
  const yStep = (TL_CHART_HEIGHT - TL_Y_MARGIN * 2) / (MILESTONES.length - 1);

  MILESTONES.forEach((m, i) => {
    m.x = TL_X_MARGIN + i * xStep;
    m.y = (TL_CHART_HEIGHT - TL_Y_MARGIN) - i * yStep; // ascendente: índice maior = y menor
  });
}

/* ---------- Modo gráfico ---------- */

function tlBuildGraphChart(root, width) {
  root.innerHTML = '';
  tlComputeGeometry(width);

  const canvas = document.createElement('div');
  canvas.className = 'tl-chart-canvas';
  canvas.style.height = `${TL_CHART_HEIGHT}px`;

  const svg = tlSvgEl('svg', {
    class: 'tl-chart-svg',
    viewBox: `0 0 ${width} ${TL_CHART_HEIGHT}`,
    width,
    height: TL_CHART_HEIGHT,
    preserveAspectRatio: 'none',
  });
  svg.style.width = `${width}px`;

  const defs = tlSvgEl('defs', {});
  const gradient = tlSvgEl('linearGradient', { id: 'tl-area-gradient', x1: '0', y1: '0', x2: '0', y2: '1' });
  gradient.appendChild(tlSvgEl('stop', { offset: '0%', 'stop-color': '#22d3ee', 'stop-opacity': '0.28' }));
  gradient.appendChild(tlSvgEl('stop', { offset: '100%', 'stop-color': '#22d3ee', 'stop-opacity': '0' }));
  defs.appendChild(gradient);
  svg.appendChild(defs);

  const gridGroup = tlSvgEl('g', { class: 'tl-chart-grid' });
  for (let g = 1; g <= 3; g++) {
    const gy = (TL_CHART_HEIGHT / 4) * g;
    gridGroup.appendChild(tlSvgEl('line', { class: 'tl-chart-grid-line', x1: 0, y1: gy, x2: width, y2: gy }));
  }
  svg.appendChild(gridGroup);

  const linePath = tlCatmullRomToBezier(MILESTONES);
  const first = MILESTONES[0];
  const last  = MILESTONES[MILESTONES.length - 1];
  const areaPath = `${linePath} L ${last.x} ${TL_CHART_HEIGHT - TL_Y_MARGIN + 20} L ${first.x} ${TL_CHART_HEIGHT - TL_Y_MARGIN + 20} Z`;

  const area = tlSvgEl('path', { class: 'tl-chart-area', d: areaPath });
  const line = tlSvgEl('path', { class: 'tl-chart-line', d: linePath });
  svg.appendChild(area);
  svg.appendChild(line);
  canvas.appendChild(svg);

  MILESTONES.forEach((m) => {
    if (!m.yearStart) return;
    const marker = document.createElement('div');
    marker.className = 'tl-year-marker';
    marker.style.left = `${m.x}px`;
    marker.innerHTML = `<span>${m.year}</span>`;
    canvas.appendChild(marker);
  });

  MILESTONES.forEach((m, i) => {
    const point = document.createElement('div');
    point.className = 'tl-chart-point';
    point.style.left = `${m.x}px`;
    point.style.top = `${m.y}px`;

    const dot = document.createElement('span');
    dot.className = 'tl-point-dot';

    const card = document.createElement('div');
    card.className = `tl-point-card ${i % 2 === 0 ? 'tl-card-top' : 'tl-card-bottom'}`;
    card.innerHTML = tlCardContentHTML(m);

    point.appendChild(dot);
    point.appendChild(card);
    canvas.appendChild(point);

    m._dot = dot;
    m._card = card;
  });

  root.appendChild(canvas);
  return { line, area };
}

function tlUpdateGraphGeometry(root, width) {
  tlComputeGeometry(width);

  const svg = root.querySelector('.tl-chart-svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${TL_CHART_HEIGHT}`);
  svg.setAttribute('width', width);
  svg.style.width = `${width}px`;

  root.querySelectorAll('.tl-chart-grid-line').forEach((line) => line.setAttribute('x2', width));

  const linePath = tlCatmullRomToBezier(MILESTONES);
  const first = MILESTONES[0];
  const last  = MILESTONES[MILESTONES.length - 1];
  const areaPath = `${linePath} L ${last.x} ${TL_CHART_HEIGHT - TL_Y_MARGIN + 20} L ${first.x} ${TL_CHART_HEIGHT - TL_Y_MARGIN + 20} Z`;

  root.querySelector('.tl-chart-line').setAttribute('d', linePath);
  root.querySelector('.tl-chart-area').setAttribute('d', areaPath);

  const yearStarts = MILESTONES.filter((m) => m.yearStart);
  root.querySelectorAll('.tl-year-marker').forEach((marker, i) => {
    marker.style.left = `${yearStarts[i].x}px`;
  });

  root.querySelectorAll('.tl-chart-point').forEach((point, i) => {
    point.style.left = `${MILESTONES[i].x}px`;
    point.style.top = `${MILESTONES[i].y}px`;
  });
}

function tlAnimateGraph(refs, width) {
  const length = refs.line.getTotalLength();
  refs.line.style.strokeDasharray = length;
  refs.line.style.strokeDashoffset = length;
  refs.line.style.transition = `stroke-dashoffset ${TL_DRAW_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;

  requestAnimationFrame(() => requestAnimationFrame(() => {
    refs.line.style.strokeDashoffset = '0';
  }));

  refs.area.style.transitionDelay = `${TL_DRAW_DURATION}ms`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    refs.area.style.opacity = '1';
  }));

  MILESTONES.forEach((m) => {
    const fraction = width > 0 ? m.x / width : 1;
    const delayMs = Math.round(fraction * TL_DRAW_DURATION);

    m._dot.style.transitionDelay = `${delayMs}ms`;
    m._card.style.transitionDelay = `${delayMs + 150}ms`;

    requestAnimationFrame(() => {
      m._dot.classList.add('is-visible');
      m._card.classList.add('is-visible');
    });
  });
}

/* ---------- Modo lista (reaproveita o revealObserver do topo do arquivo) ---------- */

function tlBuildListChart(root) {
  root.innerHTML = '';

  const list = document.createElement('div');
  list.className = 'tl-list';

  MILESTONES.forEach((m, i) => {
    if (m.yearStart) {
      const yearLabel = document.createElement('div');
      yearLabel.className = 'tl-list-year';
      yearLabel.textContent = m.year;
      list.appendChild(yearLabel);
    }

    const item = document.createElement('div');
    item.className = 'tl-list-item reveal';

    const dotSize = Math.round(10 + (i / (MILESTONES.length - 1)) * 8);
    const dot = document.createElement('span');
    dot.className = 'tl-list-dot';
    dot.style.width = `${dotSize}px`;
    dot.style.height = `${dotSize}px`;

    const card = document.createElement('div');
    card.className = 'tl-list-card';
    card.innerHTML = tlCardContentHTML(m);

    item.appendChild(dot);
    item.appendChild(card);
    list.appendChild(item);

    revealObserver.observe(item);
  });

  root.appendChild(list);
}

/* ---------- Orquestração ---------- */

function tlObserveAndAnimate(root, callback) {
  if (!('IntersectionObserver' in window)) {
    callback();
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(root);
}

function tlRenderTimeline() {
  const root = document.querySelector('.tl-chart-scroll');
  if (!root) return;

  const width = Math.round(root.clientWidth);
  const mode = width < TL_MODE_BREAKPOINT ? 'list' : 'graph';

  if (mode !== tlCurrentMode) {
    tlCurrentMode = mode;

    if (mode === 'graph') {
      tlChartRefs = tlBuildGraphChart(root, width);
      tlObserveAndAnimate(root, () => tlAnimateGraph(tlChartRefs, width));
    } else {
      tlBuildListChart(root);
    }
  } else if (mode === 'graph') {
    tlUpdateGraphGeometry(root, width);
  }
}

tlRenderTimeline();

window.addEventListener('resize', () => {
  if (tlResizeScheduled) return;
  tlResizeScheduled = true;
  requestAnimationFrame(() => {
    tlResizeScheduled = false;
    tlRenderTimeline();
  });
});

/* ================================================
   SERVICE WORKER — PWA
   ================================================ */
if ('serviceWorker' in navigator && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(() => console.log('PWA ativo'))
      .catch(err => console.error('Erro no PWA:', err));
  });
}
