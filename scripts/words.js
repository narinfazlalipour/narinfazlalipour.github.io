/* -------------------------------------------------------------------------
   Words & Scripture Rotator — Narin Fazlalipour Portfolio
   Cycles through quotes and scriptures on a cross-fade interval
   ------------------------------------------------------------------------- */

export function initWords() {
  const items = document.querySelectorAll('.scripture-stack .scripture');
  if (items.length === 0) return;

  let currentIndex = 0;
  let timer = null;

  // Initialize first item
  items[0].classList.add('is-active');

  const rotate = () => {
    items[currentIndex].classList.remove('is-active');
    currentIndex = (currentIndex + 1) % items.length;
    items[currentIndex].classList.add('is-active');
  };

  const startRotation = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(rotate, 6500); // 6.5 seconds display time
  };

  const stopRotation = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  // Start rotation
  startRotation();

  // Pause rotation when mode shifts off Narrative to save background compute
  document.addEventListener('modechange', (e) => {
    if (e.detail === 'narrative') {
      startRotation();
    } else {
      stopRotation();
    }
  });
}
