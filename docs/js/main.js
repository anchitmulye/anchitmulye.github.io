/* main.js — portfolio logic, reads from portfolio.json */

const DATA_URL = 'data/portfolio.json';

const ICONS = {
  github:   `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>`,
  linkedin: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
  scholar:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  research: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  semantic: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></svg>`,
  arxiv:    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/></svg>`,
  link:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  brain:    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.5 2A2.5 2.5 0 017 4.5v.5a2.5 2.5 0 01-2.5 2.5H4a2.5 2.5 0 000 5h.5A2.5 2.5 0 017 15v.5a2.5 2.5 0 002.5 2.5H10a2 2 0 012-2v-1a2 2 0 012-2h1a2.5 2.5 0 002.5-2.5v-.5A2.5 2.5 0 0120 7.5h-.5A2.5 2.5 0 0117 5v-.5A2.5 2.5 0 0014.5 2H9.5z"/></svg>`,
  chip:     `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M7 9H4M7 12H4M7 15H4M17 9h3M17 12h3M17 15h3M9 7V4M12 7V4M15 7V4M9 17v3M12 17v3M15 17v3"/></svg>`,
  eye:      `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  code:     `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
};

// ── Bootstrap ───────────────────────────────────────────────────────────────
(async function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  setupNav();
  setupReveal();

  try {
    const data = await fetch(DATA_URL, { cache: 'no-cache' }).then(r => r.json());
    applyMeta(data.meta);
    buildNav(data.nav);
    buildSectionLabels(data.sections);
    buildHero(data.hero);
    buildAbout(data.about);
    buildExperience(data.experience);
    buildEducation(data.education);
    buildResearchAreas(data.researchAreas);
    buildSkills(data.skills);
    buildProjects(data.projects);
    buildPublications(data.publications);
    buildContact(data.contact);
    document.getElementById('footerName').textContent = data.hero.name;
    const footerCopy = document.getElementById('footerCopy');
    if (footerCopy) {
      const year = new Date().getFullYear();
      const updated = data.footer?.lastUpdated ? ` &mdash; Updated ${data.footer.lastUpdated} ` : '';
      const copy = data.footer?.copy ? `${data.footer.copy} &mdash; ` : '';
      footerCopy.innerHTML = `${copy}${year}${updated}`;
    }
    startTyping(data.hero.roles);
  } catch (e) {
    console.error('Failed to load portfolio.json:', e);
  }
})();

// ── Nav ──────────────────────────────────────────────────────────────────────
function buildNav(nav) {
  if (!nav) return;
  if (nav.logo) document.getElementById('navName').textContent = nav.logo;
  if (nav.links?.length) {
    const html = nav.links.map(l =>
      `<li><a href="${l.href}" class="nav__link">${l.label}</a></li>`
    ).join('');
    document.getElementById('navLinks').innerHTML       = html;
    document.getElementById('mobileNavLinks').innerHTML = nav.links.map(l =>
      `<li><a href="${l.href}">${l.label}</a></li>`
    ).join('');
  }
}

// ── Section labels ────────────────────────────────────────────────────────────
function buildSectionLabels(sections) {
  if (!sections) return;
  const map = {
    about:        'labelAbout',
    experience:   'labelExperience',
    education:    'labelEducation',
    skills:       'labelSkills',
    projects:     'labelProjects',
    publications: 'labelPublications',
    contact:      'labelContact',
  };
  Object.entries(map).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el && sections[key]) el.textContent = sections[key];
  });
}

// ── Meta ────────────────────────────────────────────────────────────────────
function applyMeta(meta) {
  if (meta.title)       document.title = meta.title;
  if (meta.description) document.querySelector('meta[name=description]')?.setAttribute('content', meta.description);
}

// ── Hero ────────────────────────────────────────────────────────────────────
function buildHero(hero) {
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
  set('heroName',    hero.name);
  set('heroTagline', hero.tagline);
  set('navName',     hero.name.split(' ').map(w => w[0]).join(''));

  if (hero.cta)  { const el = document.getElementById('heroCta');  if (el) { el.textContent = hero.cta.label; el.href = hero.cta.href; } }
  if (hero.cta2) { const el = document.getElementById('heroCta2'); if (el) { el.textContent = hero.cta2.label; el.href = hero.cta2.href; } }

}

// ── Typing animation ────────────────────────────────────────────────────────
function startTyping(roles) {
  if (!roles?.length) return;
  const el  = document.getElementById('heroRole');
  let ri = 0, ci = 0, deleting = false;
  const TYPE_SPEED = 80, DEL_SPEED = 40, PAUSE = 1800;

  function tick() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; return setTimeout(tick, PAUSE); }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? DEL_SPEED : TYPE_SPEED);
  }
  setTimeout(tick, 800);
}

// ── About ────────────────────────────────────────────────────────────────────
function buildAbout(about) {
  // Profile photo — show real photo or initials placeholder
  const wrap = document.getElementById('aboutPhotoWrap');
  const img  = document.getElementById('aboutPhoto');
  if (wrap) {
    if (about.photo) {
      img.src     = about.photo;
      img.alt     = document.getElementById('heroName')?.textContent || 'Profile';
      img.hidden  = false;
      wrap.querySelector('.about__photo-initials')?.remove();
    } else {
      // Show initials placeholder
      img.style.display = 'none';
      const name     = document.getElementById('heroName')?.textContent || 'AM';
      const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const ph = document.createElement('div');
      ph.className   = 'about__photo-initials';
      ph.textContent = initials;
      wrap.appendChild(ph);
    }
    wrap.hidden = false;
  }

  const textEl = document.getElementById('aboutText');
  if (textEl && about.bio?.length) {
    textEl.innerHTML = about.bio.map(p => `<p>${p}</p>`).join('');
  }

  const statsEl = document.getElementById('aboutStats');
  if (statsEl && about.stats?.length) {
    statsEl.innerHTML = about.stats.map(s => `
      <div class="about__stat-card">
        <span class="about__stat-num">${s.value}</span>
        <span class="about__stat-label">${s.label}</span>
      </div>`).join('');
  }
}

// ── Experience ────────────────────────────────────────────────────────────────
function logoEl(name, logoUrl) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const inner = logoUrl
    ? `<img src="${logoUrl}" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
       <span class="timeline-item__logo-initials" style="display:none">${initials}</span>`
    : `<span class="timeline-item__logo-initials">${initials}</span>`;
  return `<div class="timeline-item__logo">${inner}</div>`;
}

function buildExperience(list) {
  const el = document.getElementById('experienceList');
  if (!el || !list?.length) return;
  el.innerHTML = list.map(e => `
    <div class="timeline-item ${e.current ? 'timeline-item--current' : ''}">
      ${logoEl(e.company, e.logo)}
      <p class="timeline-item__company">${e.company}</p>
      <p class="timeline-item__role">${e.role}</p>
      <span class="timeline-item__period">${e.period}</span>
      ${e.current ? '<span class="timeline-item__current-badge">Current</span>' : ''}
      <p class="timeline-item__desc">${e.description}</p>
    </div>`).join('');
}

function buildEducation(list) {
  const el = document.getElementById('educationList');
  if (!el || !list?.length) { document.getElementById('education')?.remove(); return; }
  el.innerHTML = list.map(e => `
    <div class="timeline-item">
      ${logoEl(e.institution, e.logo || '')}
      <p class="timeline-item__company">${e.institution}</p>
      <p class="timeline-item__role">${e.degree}</p>
      <span class="timeline-item__period">${e.period}</span>
      <p class="timeline-item__desc">${e.description}</p>
      ${e.gpa ? `<p class="timeline-item__gpa">GPA: ${e.gpa}</p>` : ''}
    </div>`).join('');
}

// ── Research Areas ───────────────────────────────────────────────────────────
function buildResearchAreas(areas) {
  const wrap = document.getElementById('researchAreas');
  const list = document.getElementById('researchAreasList');
  if (!wrap || !list || !areas?.length) return;
  list.innerHTML = areas.map(a =>
    `<li class="research-areas__item">${a}</li>`
  ).join('');
  wrap.hidden = false;
}

// ── Skills ───────────────────────────────────────────────────────────────────
function buildSkills(skills) {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = skills.categories.map(cat => `
    <div class="skill-card">
      <div class="skill-card__icon">${ICONS[cat.icon] || ''}</div>
      <h3 class="skill-card__name">${cat.name}</h3>
      <ul class="skill-card__list">
        ${cat.items.map(item => `<li class="skill-tag">${item}</li>`).join('')}
      </ul>
    </div>`).join('');
}

// ── Projects ─────────────────────────────────────────────────────────────────
function buildProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = projects.map(p => {
    const links = Object.entries(p.links || {}).map(([k, v]) =>
      `<a href="${v}" target="_blank" rel="noopener" class="project-link">${k === 'github' ? ICONS.github : ICONS.link} ${k}</a>`
    ).join('');
    return `
    <div class="project-card ${p.highlight ? 'project-card--highlight' : ''}">
      <div class="project-card__top">
        <span class="project-status">${p.status}</span>
        <div class="project-links">${links}</div>
      </div>
      <h3 class="project-card__name">${p.name}</h3>
      <p class="project-card__tagline">${p.tagline}</p>
      <p class="project-card__desc">${p.description}</p>
      <div class="project-tech">
        ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
    </div>`;
  }).join('');
}

// ── Publications ─────────────────────────────────────────────────────────────
function buildPublications(pubs) {
  const list = document.getElementById('papersList');
  if (!list) return;
  list.innerHTML = pubs.map((p, i) => {
    const links = Object.entries(p.links || {}).map(([k, v]) =>
      `<a href="${v}" target="_blank" rel="noopener" class="paper-link">${ICONS.link} ${k}</a>`
    ).join('');
    return `
    <div class="paper-card">
      <div class="paper-card__num">[${String(i + 1).padStart(2, '0')}]</div>
      <div class="paper-card__body">
        <h3 class="paper-card__title">${p.title}</h3>
        <p class="paper-card__meta">${p.authors} &mdash; <em>${p.venue}</em> &mdash; ${p.year}</p>
        <div class="paper-card__footer">
          ${p.citations ? `<span class="paper-citations">${p.citations} citations</span>` : '<span class="paper-citations paper-citations--new">New</span>'}
          ${links}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── Contact ───────────────────────────────────────────────────────────────────
function buildContact(contact) {
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
  set('contactHeading', contact.heading);
  set('contactSub',     contact.sub);
  const linksEl = document.getElementById('contactLinks');
  if (!linksEl) return;
  linksEl.innerHTML = contact.links.map(l => `
    <a href="${l.href}" target="_blank" rel="noopener" class="contact-link">
      <span class="contact-link__icon">${ICONS[l.icon] || ICONS.link}</span>
      <span class="contact-link__label">${l.label}</span>
    </a>`).join('');
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function setupNav() {
  const nav     = document.getElementById('nav');
  const ham     = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileOverlay');

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Toggle menu on hamburger click
  ham?.addEventListener('click', () => {
    const isOpen = overlay?.classList.toggle('open');
    ham.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    overlay?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  });

  // Event delegation — works even after buildNav() injects links later
  overlay?.addEventListener('click', e => {
    if (e.target.closest('a')) {
      overlay.classList.remove('open');
      ham.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
        document.querySelector(`.nav__link[href="#${e.target.id}"]`)?.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
}

// ── Reveal ────────────────────────────────────────────────────────────────────
function setupReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Trigger hero immediately
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150 + 300);
    });
  });
}
