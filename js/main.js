/* ══════════════════════════════════════════════
   KAYRI ESSENCE — main.js
   Partículas · Scroll Reveal · Navbar · Form
   ══════════════════════════════════════════════ */

/* ── PARTICLES CANVAS ── */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const COLORS = ['#FF2D8B', '#00E5FF', '#D4AF37', '#ffffff'];
  const COUNT = 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      r: randomBetween(1, 3),
      speedX: randomBetween(-0.3, 0.3),
      speedY: randomBetween(-0.5, -0.1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: randomBetween(0.2, 0.7),
      twinkleSpeed: randomBetween(0.01, 0.03),
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.opacity += p.twinkleSpeed * p.twinkleDir;
      if (p.opacity >= 0.8 || p.opacity <= 0.1) p.twinkleDir *= -1;

      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y < -10) { p.y = H + 10; p.x = randomBetween(0, W); }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  draw();
})();

/* ── SCROLL REVEAL ── */
(function () {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

/* ── NAVBAR SCROLL STATE ── */
(function () {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── MOBILE MENU ── */
(function () {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const open = links.classList.contains('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
})();

/* ── ACTIVE NAV LINK ON SCROLL ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(sec => observer.observe(sec));
})();

/* ── HERO TITLE STAGGER ANIMATION ── */
(function () {
  // Trigger reveal animations on hero items immediately (no need for scroll)
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 300 + i * 150);
  });
})();

/* ── CONTACT FORM → WHATSAPP ── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre   = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const evento   = form.evento.value;
    const servicio = form.servicio.value;
    const fecha    = form.fecha.value;
    const mensaje  = form.mensaje.value.trim();

    const text = [
      `¡Hola! Me gustaría reservar con *Kayri Essence* 👑`,
      ``,
      `*Nombre:* ${nombre}`,
      `*WhatsApp:* ${telefono}`,
      `*Tipo de evento:* ${evento}`,
      `*Show de interés:* ${servicio}`,
      `*Fecha del evento:* ${fecha ? formatDate(fecha) : 'Por confirmar'}`,
      mensaje ? `*Detalles:* ${mensaje}` : '',
      ``,
      `¡Espero su respuesta! 🎉`,
    ].filter(line => line !== null).join('\n');

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/51920180520?text=${encoded}`, '_blank');
  });

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${d} de ${months[parseInt(m, 10) - 1]} de ${y}`;
  }
})();

/* ── SMOOTH ANCHOR SCROLL (fallback for older browsers) ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── PARALLAX GLOW ON MOUSE MOVE ── */
(function () {
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');
  if (!glow1 || !glow2) return;

  document.addEventListener('mousemove', (e) => {
    const cx = e.clientX / window.innerWidth;
    const cy = e.clientY / window.innerHeight;
    glow1.style.transform = `translate(${cx * 30}px, ${cy * 30}px)`;
    glow2.style.transform = `translate(${-cx * 20}px, ${-cy * 20}px)`;
  }, { passive: true });
})();

/* ── CARD TILT EFFECT ON SERVICES ── */
(function () {
  const cards = document.querySelectorAll('.service-card, .pillar, .testimonio-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.35s cubic-bezier(.4,0,.2,1)';
    });
  });
})();
