/* -------------------------------------------------------------------------
   Yellow Couch Sanctuary Logic — Narin Fazlalipour Portfolio
   Clicking the couch opens an overlay, types the quote, and drifts particles
   ------------------------------------------------------------------------- */

export function initCouch() {
  const couch = document.querySelector('.couch-silhouette');
  const overlay = document.querySelector('.couch-overlay');
  const closeBtn = document.querySelector('.couch-close-btn');
  const quoteContainer = document.querySelector('.couch-quote');
  const citeContainer = document.querySelector('.couch-quote-cite');
  const particleCanvas = document.getElementById('couch-particles-canvas');

  if (!couch || !overlay || !closeBtn || !quoteContainer) return;

  const quoteText = "We will always need doctors. The difference you can bring to the field is to become a doctor that stays in her heart and stays present.";
  let typeInterval = null;
  let particleId = null;
  let active = false;

  // Accessibility accessibility
  couch.setAttribute('role', 'button');
  couch.setAttribute('tabindex', '0');
  couch.setAttribute('aria-label', 'Enter the Yellow Couch sanctuary');

  // -------------------------------------------------------------------------
  // Typewriter text effect
  // -------------------------------------------------------------------------
  const typeQuote = () => {
    quoteContainer.textContent = "";
    citeContainer.classList.remove('is-visible');
    let index = 0;

    if (typeInterval) clearInterval(typeInterval);

    typeInterval = setInterval(() => {
      if (index < quoteText.length) {
        quoteContainer.textContent += quoteText.charAt(index);
        index++;
      } else {
        clearInterval(typeInterval);
        typeInterval = null;
        // Fade in the citation once typing completes
        citeContainer.classList.add('is-visible');
      }
    }, 45); // 45ms per character typing speed
  };

  // -------------------------------------------------------------------------
  // Drift particles canvas (Embers)
  // -------------------------------------------------------------------------
  let particles = [];
  const startEmberSimulation = () => {
    if (!particleCanvas) return;
    const ctx = particleCanvas.getContext('2d');
    active = true;

    const resize = () => {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: particleCanvas.height + Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.5 + Math.random() * 1.2),
        size: 1 + Math.random() * 3,
        alpha: 0.1 + Math.random() * 0.5,
        targetAlpha: 0.1 + Math.random() * 0.6
      });
    }

    const animate = () => {
      if (!active) return;
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      particles.forEach((p) => {
        // move upward
        p.y += p.vy;
        p.x += p.vx;

        // swing drift slightly
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vx = Math.max(-0.6, Math.min(0.6, p.vx));

        // fade out near top
        if (p.y < 100) {
          p.alpha -= 0.005;
        }

        // recycle to bottom
        if (p.y < -20 || p.alpha <= 0) {
          p.y = particleCanvas.height + Math.random() * 50;
          p.x = Math.random() * particleCanvas.width;
          p.vx = (Math.random() - 0.5) * 0.4;
          p.vy = -(0.5 + Math.random() * 1.2);
          p.alpha = 0.1 + Math.random() * 0.5;
        }

        ctx.fillStyle = `rgba(245, 197, 153, ${p.alpha})`;
        ctx.shadowColor = '#D98A4F';
        ctx.shadowBlur = p.size * 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      particleId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      active = false;
      window.removeEventListener('resize', resize);
      if (particleId) cancelAnimationFrame(particleId);
    };
  };

  const stopEmberSimulation = () => {
    active = false;
    if (particleId) cancelAnimationFrame(particleId);
  };

  // -------------------------------------------------------------------------
  // Overlay Control
  // -------------------------------------------------------------------------
  const openOverlay = () => {
    overlay.classList.add('is-visible');
    typeQuote();
    startEmberSimulation();
  };

  const closeOverlay = () => {
    overlay.classList.remove('is-visible');
    if (typeInterval) {
      clearInterval(typeInterval);
      typeInterval = null;
    }
    stopEmberSimulation();
  };

  couch.addEventListener('click', openOverlay);
  couch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openOverlay();
    }
  });

  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  // ESC key closes overlay
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-visible')) {
      closeOverlay();
    }
  });
}
