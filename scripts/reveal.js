/* -------------------------------------------------------------------------
   Scroll Reveal Observer — Narin Fazlalipour Portfolio
   Gentle entry animations when elements enter the viewport
   ------------------------------------------------------------------------- */

export function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (elements.length === 0) return;

  // Fallback if IntersectionObserver is not supported
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -8% 0px' // triggers slightly before scrolling fully in
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve once shown so animation only plays once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach((el) => observer.observe(el));

  // Reset observer when switching modes to catch hidden content
  document.addEventListener('modechange', () => {
    // Re-check elements and trigger observer on elements that might have become visible
    elements.forEach((el) => {
      if (!el.classList.contains('is-visible')) {
        observer.observe(el);
      }
    });
  });
}
