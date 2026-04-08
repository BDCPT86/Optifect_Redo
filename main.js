'use strict';

/* ── HLS VIDEO ── */
(function initVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  const HLS_URL = 'https://customer-cbeadsgr09pnsezs.cloudflarestream.com/697945ca6b876878dba3b23fbd2f1561/manifest/video.m3u8';
  const MP4_FALLBACK = '/_videos/v1/f0c78f536d5f21a047fb7792723a36f9d647daa1';

  function tryPlay() { video.play().catch(() => {}); }

  if (typeof Hls !== 'undefined' && Hls.isSupported()) {
    const hls = new Hls({ autoStartLoad: true, startLevel: -1 });
    hls.loadSource(HLS_URL);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) { video.src = MP4_FALLBACK; tryPlay(); }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = HLS_URL;
    video.addEventListener('loadedmetadata', tryPlay);
  } else {
    video.src = MP4_FALLBACK;
    tryPlay();
  }
})();

/* ── NAVBAR ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE MENU ── */
(function initMobileMenu() {
  const btn  = document.getElementById('navHamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
  });
  menu.querySelectorAll('.mobile-link').forEach(l =>
    l.addEventListener('click', () => { menu.classList.remove('open'); btn.classList.remove('open'); })
  );
})();

/* ── TICKER ── */
(function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;

  const items = [
    'BBBEE Level 1', 'CIDB Registered', 'SEIFSA Member', 'SAIA Partner',
    'Chamber of Mines', 'SAFCEC Member', 'IODSA Associate', 'SAPOA Affiliate',
    'Women Owned 51%', 'ISO Aligned', 'JSE Compliant', 'King IV Governance',
  ];

  let html = '';
  for (let c = 0; c < 2; c++) {
    items.forEach(t => {
      html += `<div class="ticker-item"><div class="ticker-sep"></div><span class="ticker-label">${t}</span></div>`;
    });
  }
  track.innerHTML = html;
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── CONTACT FORM ── */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    await new Promise(r => setTimeout(r, 1200));
    form.style.display = 'none';
    success.classList.add('visible');
  });
})();

/* ── FOOTER YEAR ── */
(function() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = `© ${new Date().getFullYear()} Optifect Group (Pty) Ltd. All rights reserved.`;
})();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  });
});

/* ── LEADER MODALS ── */
const leaderData = {
  aldrin: {
    title: 'Group CEO',
    body: `
      <p>Aldrin is the Group CEO of Optifect Solutions (Pty) Ltd, a Marketing Graduate who holds an MBA from Henley Business School. He is a Certified Business Coach and is currently completing a M.Sc. Coaching and Behavioural Change through the University of Reading (UK).</p>
      <p>Aldrin has more than 20 years of Corporate business experience and has worked in leading businesses such as Nampak, Saint-Gobain and Afrisam. During the course of his career Aldrin served on various EXCOs, had various General Management roles and is Managing Director of Capital Cement Distributors, a Division of the Afrisam Group.</p>
      <p>Aldrin is an entrepreneur with a passion for Business Management, Sales and Marketing, Human Capital and Business Development.</p>
    `
  },
  rozanne: {
    title: 'Director — Education and Training',
    body: `
      <p>Rozanne is a Director of Optifect Solutions (Pty) Ltd and holds a B.Ed Degree from the University of the Western Cape and a Masters' Degree in Educational Management and Leadership from WITS University.</p>
      <p>Rozanne has spent more than 20 years in Education and Training and is an Accredited Assessor and Facilitator. She has been involved in major training projects including the GDE's role out of the GPLMS – Gauteng Primary Literacy and Mathematics Strategy Programme, E-Learning Facilitator for Vastratech and Matthew Goniwe School of Leadership and Governance. She has done work with Macmillan Education, READ as well as multiple NGOs.</p>
      <p>Rozanne has a passion for the advancement of individuals through training and education and has spent more than half of her career working in marginalised and underprivileged communities. Her Thesis, <em>Successful School Leadership in Disadvantaged Schools</em>, is evident of her passion and dedication to liberate through education.</p>
    `
  },
  patricia: {
    title: 'Associate',
    body: `
      <p>Patricia holds a B.Com Honours degree from Fort Hare University and completed an Industrial Relations programme at Wits Business School.</p>
      <p>Patricia has 35 years of Corporate Business experience and held several Executive and Director level positions in leading local and international organisations, including Primedia – Group Human Resource Executive and Saint Gobain S.A. Human Resources Director. Patricia over the span of her career has also served on several Boards as non-executive member. Over the past five years Patricia has worked as an Executive Consultant across industries. Patricia is highly experienced in the Human Capital field with a passion for Business Management.</p>
    `
  }
};

function openModal(key) {
  const data = leaderData[key];
  if (!data) return;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalBody').innerHTML = data.body;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
