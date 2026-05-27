/* -------------------------------------------------------------------------
   Scroll-Linked Timeline Journey — Narin Fazlalipour Portfolio
   Draws a glowing thread line on scroll and toggles reflective chapters
   ------------------------------------------------------------------------- */

export function initJourney() {
  const container = document.querySelector('.timeline-container');
  const glowLine = document.querySelector('.timeline-line-glow');
  const stations = document.querySelectorAll('.timeline-station');

  if (!container || !glowLine || stations.length === 0) return;

  // -------------------------------------------------------------------------
  // 1. Scroll-Drawn Thread Line
  // -------------------------------------------------------------------------
  const updateTimelineThread = () => {
    // Check if Narrative mode is currently displayed
    if (!document.body.classList.contains('mode-narrative')) return;

    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Start drawing when the top of the container crosses the middle of the screen
    const triggerStart = viewportHeight / 2;
    const scrollStart = rect.top - triggerStart;
    const scrollLength = rect.height;

    // Calculate percent scrolled
    let percent = 0;
    if (scrollStart < 0) {
      percent = Math.abs(scrollStart) / scrollLength;
    }
    percent = Math.max(0, Math.min(1, percent));

    // Map percentage to height
    glowLine.style.height = `${percent * 100}%`;
  };

  window.addEventListener('scroll', updateTimelineThread, { passive: true });
  window.addEventListener('resize', updateTimelineThread);
  updateTimelineThread(); // init sizing

  // -------------------------------------------------------------------------
  // 2. Active Node Highlighting (Intersection Observer)
  // -------------------------------------------------------------------------
  const observeOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px', // trigger in central viewport band
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Remove active from all and add to this
        stations.forEach((s) => s.classList.remove('active'));
        entry.target.classList.add('active');
      }
    });
  }, observeOptions);

  stations.forEach((station) => observer.observe(station));

  // -------------------------------------------------------------------------
  // 3. Collapsible handwritten reflection notes
  // -------------------------------------------------------------------------
  stations.forEach((station) => {
    const trigger = station.querySelector('.timeline-title');
    const toggleBtn = station.querySelector('.timeline-toggle-trigger');
    const contentWrapper = station.querySelector('.reflection-note-wrapper');
    const note = station.querySelector('.reflection-note');

    if (!contentWrapper || !note) return;

    const toggleAccordion = () => {
      const isOpen = station.classList.contains('open');

      if (isOpen) {
        station.classList.remove('open');
        contentWrapper.style.maxHeight = '0';
      } else {
        station.classList.add('open');
        // Set dynamic height for smooth animation in vanilla CSS
        contentWrapper.style.maxHeight = `${note.offsetHeight + 40}px`;
      }
    };

    if (trigger) trigger.addEventListener('click', toggleAccordion);
    if (toggleBtn) toggleBtn.addEventListener('click', toggleAccordion);
  });

  // Re-adjust heights when switching back to narrative mode
  document.addEventListener('modechange', (e) => {
    if (e.detail === 'narrative') {
      setTimeout(() => {
        updateTimelineThread();
      }, 50);
    }
  });
}
