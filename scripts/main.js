/* -------------------------------------------------------------------------
   Main Entry Point — Narin Fazlalipour Portfolio
   ------------------------------------------------------------------------- */

import { initCursor } from './cursor.js';
import { initReveal } from './reveal.js';
import { initBreathe } from './breathe.js';
import { initSeam } from './seam.js';
import { initCouch } from './couch.js';
import { initJourney } from './journey.js';
import { initEvidence } from './evidence.js';
import { initWords } from './words.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize custom cursor
  initCursor();

  // 2. Initialize scroll reveals
  initReveal();

  // 3. Set default page mode: Narrative
  document.body.classList.add('mode-narrative');

  // 4. Set up the dual-aspect mode toggle
  initModeSwitch();

  // 5. Initialize Narrative elements
  initBreathe();
  initSeam();
  initCouch();
  initJourney();

  // 6. Initialize Evidence elements
  initEvidence();

  // 7. Initialize quote cross-fades
  initWords();
});

function initModeSwitch() {
  const toggle = document.querySelector('.mode-switch');
  if (!toggle) return;

  const toggleMode = () => {
    const isNarrative = document.body.classList.contains('mode-narrative');

    if (isNarrative) {
      document.body.classList.remove('mode-narrative');
      document.body.classList.add('mode-evidence');
      // Scroll to top when switching modes for visual cleanliness
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Notify components that mode shifted if needed
      document.dispatchEvent(new CustomEvent('modechange', { detail: 'evidence' }));
    } else {
      document.body.classList.remove('mode-evidence');
      document.body.classList.add('mode-narrative');
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.dispatchEvent(new CustomEvent('modechange', { detail: 'narrative' }));
    }
  };

  toggle.addEventListener('click', toggleMode);

  // Keyboard navigation support
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMode();
    }
  });
}
