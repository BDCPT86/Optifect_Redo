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

/* ── ANIMATED CANVAS BACKGROUNDS ───────────────────────── */
(function initCanvases() {

  /* ── Utility ── */
  function resize(canvas) {
    const section = canvas.parentElement;
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight * 0.7;
  }

  function getScrollRatio(el) {
    const rect = el.getBoundingClientRect();
    const wh   = window.innerHeight;
    // 0 = just entered viewport bottom, 1 = just left viewport top
    return Math.max(0, Math.min(1, (wh - rect.top) / (wh + rect.height)));
  }

  /* ════════════════════════════════════════════════════
     HERO CANVAS — flowing organic mesh / hex grid
     Soft copper + slate nodes, animated drift
  ════════════════════════════════════════════════════ */
  (function heroCanvas() {
    const canvas  = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx     = canvas.getContext('2d');
    let W, H, nodes, raf;

    const COPPER  = [181, 104, 42];
    const SLATE   = [74,  81,  96];
    const NODE_COUNT = 48;

    function makeNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x:   Math.random() * W,
        y:   Math.random() * H,
        vx:  (Math.random() - 0.5) * 0.28,
        vy:  (Math.random() - 0.5) * 0.18,
        r:   2 + Math.random() * 2.5,
        col: Math.random() > 0.5 ? COPPER : SLATE,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function init() {
      resize(canvas);
      W = canvas.width;
      H = canvas.height;
      makeNodes();
    }

    let scrollY = 0;
    let t = 0;

    function draw() {
      scrollY = getScrollRatio(canvas.parentElement);
      t += 0.007;
      ctx.clearRect(0, 0, W, H);

      // Parallax offset — nodes shift upward as user scrolls
      const parallax = scrollY * H * 0.28;

      // Draw edges between close nodes
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = (a.y - parallax) - (b.y - parallax);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.13;
            const mx = (a.col[0] + b.col[0]) / 2;
            const my = (a.col[1] + b.col[1]) / 2;
            const mz = (a.col[2] + b.col[2]) / 2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${mx},${my},${mz},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(a.x, a.y - parallax);
            ctx.lineTo(b.x, b.y - parallax);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const pulse = Math.sin(t + n.phase) * 0.5 + 0.5;
        const alpha = 0.18 + pulse * 0.22;
        ctx.beginPath();
        ctx.arc(n.x, n.y - parallax, n.r + pulse * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},${alpha})`;
        ctx.fill();

        // Move
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20)  n.x = W + 20;
        if (n.x > W+20) n.x = -20;
        if (n.y < -20)  n.y = H + 20;
        if (n.y > H+20) n.y = -20;
      });

      raf = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); init(); draw(); });
  })();

  /* ════════════════════════════════════════════════════
     DIVISIONS CANVAS — geometric hexagonal grid
     Subtle copper wireframe hexagons, parallax float
  ════════════════════════════════════════════════════ */
  (function divisionsCanvas() {
    const canvas = document.getElementById('divisionsCanvas');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    let W, H, hexes, raf;

    function hexPath(cx, cy, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    function makeHexes() {
      hexes = [];
      const R   = 44;
      const col = Math.sqrt(3) * R;
      const row = 1.5 * R;
      const cols = Math.ceil(W / col) + 2;
      const rows = Math.ceil(H / row) + 2;

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const offset = c % 2 === 0 ? 0 : R * 0.866;
          hexes.push({
            x:     c * col - col * 0.5,
            y:     r * row + offset,
            r:     R,
            phase: Math.random() * Math.PI * 2,
            speed: 0.003 + Math.random() * 0.004,
          });
        }
      }
    }

    function init() {
      resize(canvas);
      W = canvas.width;
      H = canvas.height;
      makeHexes();
    }

    let t = 0;

    function draw() {
      t += 0.012;
      const parallax = getScrollRatio(canvas.parentElement) * H * 0.22;
      ctx.clearRect(0, 0, W, H);

      hexes.forEach(h => {
        const pulse = (Math.sin(t * h.speed * 80 + h.phase) + 1) / 2;
        const alpha = 0.04 + pulse * 0.07;
        const fill  = 0.01 + pulse * 0.025;

        ctx.save();
        hexPath(h.x, h.y - parallax, h.r * 0.88);
        ctx.strokeStyle = `rgba(181,104,42,${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
        ctx.fillStyle   = `rgba(181,104,42,${fill})`;
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); init(); draw(); });
  })();

  /* ════════════════════════════════════════════════════
     CONTACT CANVAS — slow flowing sine waves
     Soft slate/copper gradient ribbons
  ════════════════════════════════════════════════════ */
  (function contactCanvas() {
    const canvas = document.getElementById('contactCanvas');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    let W, H, raf;

    const waves = [
      { amp: 28, freq: 0.0055, speed: 0.018, yFrac: 0.35, col: '181,104,42',  alpha: 0.07 },
      { amp: 20, freq: 0.008,  speed: 0.025, yFrac: 0.50, col: '74,81,96',    alpha: 0.055 },
      { amp: 36, freq: 0.004,  speed: 0.013, yFrac: 0.65, col: '181,104,42',  alpha: 0.045 },
      { amp: 16, freq: 0.011,  speed: 0.03,  yFrac: 0.78, col: '74,81,96',    alpha: 0.04 },
      { amp: 24, freq: 0.007,  speed: 0.02,  yFrac: 0.88, col: '181,104,42',  alpha: 0.035 },
    ];

    function init() {
      resize(canvas);
      W = canvas.width;
      H = canvas.height;
    }

    let t = 0;

    function drawWave(wave, offset) {
      const baseY = H * wave.yFrac - offset;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      for (let x = 0; x <= W; x += 3) {
        const y = baseY + Math.sin(x * wave.freq + t * wave.speed * 60) * wave.amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H + 10);
      ctx.lineTo(0, H + 10);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, baseY - wave.amp, 0, H);
      grad.addColorStop(0,   `rgba(${wave.col},${wave.alpha})`);
      grad.addColorStop(1,   `rgba(${wave.col},0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function draw() {
      t += 0.016;
      const parallax = getScrollRatio(canvas.parentElement) * H * 0.25;
      ctx.clearRect(0, 0, W, H);
      waves.forEach(w => drawWave(w, parallax));
      raf = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); init(); draw(); });
  })();

})();
