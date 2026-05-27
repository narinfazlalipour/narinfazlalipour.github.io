/* -------------------------------------------------------------------------
   Meditation Breathing Orb Logic — Narin Fazlalipour Portfolio
   ------------------------------------------------------------------------- */

export function initBreathe() {
  const orb = document.querySelector('.breath-orb');
  const ring = document.querySelector('.breath-ring');
  const prompt = document.querySelector('.breath-prompt');
  const btns = document.querySelectorAll('.breath-btn');

  if (!orb || !ring || !prompt) return;

  let breatheInterval = null;
  let activeTempo = 'coherent'; // 'coherent' or 'calm'

  // Clear running loops
  const stopBreathe = () => {
    if (breatheInterval) {
      clearTimeout(breatheInterval);
      breatheInterval = null;
    }
    // Remove inline animation rules to let JS take over transition overrides
    orb.style.animation = 'none';
    ring.style.animation = 'none';
  };

  // State Machine Runner
  const runBreatheCycle = () => {
    stopBreathe();

    if (activeTempo === 'coherent') {
      // Coherent: 5s Inhale (scale up), 5s Exhale (scale down)
      const step = () => {
        // Inhale phase
        prompt.textContent = 'Inhale';
        orb.style.transition = 'transform 5000ms ease-in-out, opacity 5000ms ease-in-out';
        ring.style.transition = 'transform 5000ms ease-in-out, opacity 5000ms ease-in-out';
        orb.style.transform = 'scale(1.0)';
        orb.style.opacity = '1';
        ring.style.transform = 'scale(1.15)';
        ring.style.opacity = '0.8';

        breatheInterval = setTimeout(() => {
          // Exhale phase
          prompt.textContent = 'Exhale';
          orb.style.transition = 'transform 5000ms ease-in-out, opacity 5000ms ease-in-out';
          ring.style.transition = 'transform 5000ms ease-in-out, opacity 5000ms ease-in-out';
          orb.style.transform = 'scale(0.72)';
          orb.style.opacity = '0.7';
          ring.style.transform = 'scale(0.9)';
          ring.style.opacity = '0.25';

          breatheInterval = setTimeout(step, 5000);
        }, 5000);
      };
      step();
    } else if (activeTempo === 'calm') {
      // 4-7-8 Calm: 4s Inhale, 7s Hold, 8s Exhale
      const step = () => {
        // Inhale phase (4s)
        prompt.textContent = 'Inhale';
        orb.style.transition = 'transform 4000ms ease-in-out, opacity 4000ms ease-in-out';
        ring.style.transition = 'transform 4000ms ease-in-out, opacity 4000ms ease-in-out';
        orb.style.transform = 'scale(1.0)';
        orb.style.opacity = '1';
        ring.style.transform = 'scale(1.1)';
        ring.style.opacity = '0.7';

        breatheInterval = setTimeout(() => {
          // Hold phase (7s)
          prompt.textContent = 'Hold';
          // Gently pulse opacity to represent held breath energy
          orb.style.transition = 'opacity 7000ms ease-in-out';
          ring.style.transition = 'transform 7000ms ease-in-out';
          orb.style.opacity = '0.85';
          ring.style.transform = 'scale(1.15)'; // expand ring slightly further

          breatheInterval = setTimeout(() => {
            // Exhale phase (8s)
            prompt.textContent = 'Exhale';
            orb.style.transition = 'transform 8000ms ease-in-out, opacity 8000ms ease-in-out';
            ring.style.transition = 'transform 8000ms ease-in-out, opacity 8000ms ease-in-out';
            orb.style.transform = 'scale(0.72)';
            orb.style.opacity = '0.6';
            ring.style.transform = 'scale(0.85)';
            ring.style.opacity = '0.15';

            breatheInterval = setTimeout(step, 8000);
          }, 7000);
        }, 4000);
      };
      step();
    }
  };

  // Wire buttons
  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeTempo = btn.dataset.tempo;
      runBreatheCycle();
    });
  });

  // Start breathing exercise
  runBreatheCycle();

  // Listen to mode-change events: pause loop when off Narrative mode to conserve performance
  document.addEventListener('modechange', (e) => {
    if (e.detail === 'narrative') {
      runBreatheCycle();
    } else {
      stopBreathe();
    }
  });
}
