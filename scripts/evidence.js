/* -------------------------------------------------------------------------
   Evidence Dashboard Logic — Narin Fazlalipour Portfolio
   Maps AAMC Core Competencies to activities, filters, and controls cards
   ------------------------------------------------------------------------- */

export function initEvidence() {
  // 1. Publication Abstract Toggle
  const pubTrigger = document.querySelector('.pub-abstract-trigger');
  const pubAbstract = document.querySelector('.pub-abstract');

  if (pubTrigger && pubAbstract) {
    pubTrigger.addEventListener('click', () => {
      const isOpen = pubAbstract.classList.contains('open');
      pubTrigger.classList.toggle('active');
      pubAbstract.classList.toggle('open');

      if (isOpen) {
        pubAbstract.style.maxHeight = '0';
      } else {
        const paragraph = pubAbstract.querySelector('p');
        pubAbstract.style.maxHeight = `${paragraph.offsetHeight + 40}px`;
      }
    });
  }

  // 2. Activity Card Toggle Accordion
  const cards = document.querySelectorAll('.activity-card');
  cards.forEach((card) => {
    const header = card.querySelector('.activity-header');
    const toggleBtn = card.querySelector('.activity-card-toggle');
    const descWrapper = card.querySelector('.activity-desc-wrapper');
    const descContent = card.querySelector('.activity-desc-content');

    if (!descWrapper || !descContent) return;

    const toggleCard = (e) => {
      // Prevent double trigger if clicking inside the expanded text
      if (e.target.closest('.activity-desc-wrapper')) return;

      const isOpen = card.classList.contains('open');

      // Close all cards first to keep layout clean (Optional accordion behavior)
      cards.forEach((c) => {
        if (c !== card && c.classList.contains('open')) {
          c.classList.remove('open');
          const wrap = c.querySelector('.activity-desc-wrapper');
          if (wrap) wrap.style.maxHeight = '0';
        }
      });

      if (isOpen) {
        card.classList.remove('open');
        descWrapper.style.maxHeight = '0';
      } else {
        card.classList.add('open');
        descWrapper.style.maxHeight = `${descContent.offsetHeight + 40}px`;
      }
    };

    card.addEventListener('click', toggleCard);
    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(e);
      }
    });
  });

  // 3. Competency Filtering Matrix
  const chips = document.querySelectorAll('.competency-chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const competency = chip.dataset.competency;
      const isActive = chip.classList.contains('active');

      // Update active states on chips
      chips.forEach((c) => c.classList.remove('active'));

      if (isActive) {
        // Clicking an active filter de-activates it -> Show All
        filterActivities('all');
      } else {
        chip.classList.add('active');
        filterActivities(competency);
      }
    });
  });

  const filterActivities = (competencyId) => {
    cards.forEach((card) => {
      // Close card if currently open so height animations don't bug out
      card.classList.remove('open');
      const wrapper = card.querySelector('.activity-desc-wrapper');
      if (wrapper) wrapper.style.maxHeight = '0';

      if (competencyId === 'all') {
        card.classList.remove('hidden');
      } else {
        const competencies = card.dataset.competencies.split(',');
        if (competencies.includes(competencyId)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      }
    });
  };
}
