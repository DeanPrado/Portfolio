/* ══════════════════════════════════════════════════════
   SCRIPT.JS – Adrian Jose Portfolio Interactions
   ══════════════════════════════════════════════════════ */

// ── NAV SCROLL EFFECT ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ── MOBILE BURGER MENU ───────────────────────────────
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});


// ── SCROLL REVEAL ─────────────────────────────────────
const revealItems = document.querySelectorAll('.reveal-up');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Don't unobserve so it stays visible on re-scroll
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealItems.forEach(el => revealObserver.observe(el));


// ── SKILL BAR ANIMATIONS ──────────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const targetWidth = fill.getAttribute('data-w');
      setTimeout(() => {
        fill.style.width = targetWidth + '%';
      }, 200);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.5 });

skillFills.forEach(fill => skillObserver.observe(fill));


// ── COUNTER ANIMATIONS ───────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, target);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });

statNums.forEach(num => statObserver.observe(num));


// ── STUDYING STRIP CLONE (seamless loop) ─────────────
const stripItems = document.querySelector('.strip-items');
if (stripItems) {
  stripItems.innerHTML += stripItems.innerHTML; // duplicate for seamless scroll
}


// ── PARALLAX on HERO ─────────────────────────────────
const heroVideo = document.querySelector('.hero-video-wrap');
if (heroVideo) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroVideo.style.transform = `translateY(${scrollY * 0.3}px)`;
  }, { passive: true });
}


// ── CURSOR GLOW EFFECT (desktop only) ────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,90,240,.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)',
    transition: 'left .12s ease, top .12s ease',
    left: '-500px', top: '-500px',
  });
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}


// ── PROJECT CARD TILT EFFECT ─────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotate3d(${-y}, ${x}, 0, 6deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ── ACTIVE NAV HIGHLIGHT ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// Add active nav style
const activeStyle = document.createElement('style');
activeStyle.textContent = `.nav-links a.active { color: var(--white) !important; } .nav-links a.active::after { width: 100% !important; }`;
document.head.appendChild(activeStyle);


// ── CONTACT FORM HANDLER ─────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const btn = document.getElementById('submit-btn');
  const btnText = btn.querySelector('.btn-text');
  const btnIcon = btn.querySelector('.btn-icon');
  const contactStatus = document.getElementById('contact-status');

  const setContactStatus = (message, isError = false) => {
    if (!contactStatus) return;
    contactStatus.textContent = message;
    contactStatus.classList.toggle('is-error', isError);
  };

  const resetButton = () => {
    btn.disabled = false;
    btnText.textContent = 'Enviar Mensagem';
    btnIcon.textContent = '→';
    btn.style.background = '';
    btn.style.boxShadow = '';
  };

  ['input', 'change'].forEach(eventName => {
    contactForm.addEventListener(eventName, () => setContactStatus(''));
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      setContactStatus('Preencha nome, email e mensagem antes de enviar.', true);
      return;
    }

    const formData = new FormData(contactForm);
    const name = formData.get('name').toString().trim();
    const email = formData.get('email').toString().trim();
    const message = formData.get('message').toString().trim();
    const subject = encodeURIComponent(`Contato pelo portfólio - ${name}`);
    const body = encodeURIComponent([
      `Nome: ${name}`,
      `Email: ${email}`,
      '',
      'Mensagem:',
      message,
    ].join('\n'));

    btn.disabled = true;
    btnText.textContent = 'Abrindo email...';
    btnIcon.textContent = '↗';

    window.location.href = `mailto:suportedeanprado@email.com?subject=${subject}&body=${body}`;

    btn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
    btn.style.boxShadow = '0 0 30px rgba(16,185,129,.4)';
    setContactStatus('Seu app de email foi acionado com a mensagem preenchida.');
    contactForm.reset();

    setTimeout(resetButton, 1800);
  });
}


// ── SMOOTH ENTRY ANIMATION ───────────────────────────
// Trigger hero items right away
window.addEventListener('load', () => {
  document.querySelectorAll('#hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 100 + i * 120);
  });

  // Ensure video plays
  const vid = document.getElementById('hero-video');
  if (vid) {
    vid.play().catch(() => {
      // autoplay blocked – keep fallback (poster/bg)
    });
  }
});
