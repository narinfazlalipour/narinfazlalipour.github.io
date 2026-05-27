/* -------------------------------------------------------------------------
   Custom Candle Cursor Logic — Narin Fazlalipour Portfolio
   ------------------------------------------------------------------------- */

export function initCursor() {
  // Return early if touch device (no fine pointer support)
  if (window.matchMedia('(hover: none)').matches) return;

  const dot = document.createElement('div');
  const glow = document.createElement('div');
  dot.className = 'cursor-dot';
  glow.className = 'cursor-glow';
  document.body.append(dot, glow);

  // Core coordinates
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  // Tracking mouse movement
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot moves instantly
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }, { passive: true });

  // Smooth lerp (linear interpolation) animation loop for the glowing aura
  const tick = () => {
    // Easing formula: position += (target - position) * easing_factor
    glowX += (mouseX - glowX) * 0.085;
    glowY += (mouseY - glowY) * 0.085;

    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();

  // -------------------------------------------------------------------------
  // Hover & Click Interactions
  // -------------------------------------------------------------------------
  const hoverables = 'a, button, [role="button"], [data-hover], .station, .contact-card, .competency-chip';

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverables);
    if (target) {
      dot.classList.add('is-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverables);
    if (target) {
      dot.classList.remove('is-hover');
    }
  });

  document.addEventListener('mousedown', () => {
    dot.classList.add('is-pressed');
  });

  document.addEventListener('mouseup', () => {
    dot.classList.remove('is-pressed');
  });

  // Handle case where mouse leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    glow.style.opacity = '0.85';
  });
}
