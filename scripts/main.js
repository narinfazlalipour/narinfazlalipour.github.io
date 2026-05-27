/* ═══════════════════════════════════════════════════════════════
   Main JS — Tab Switching + Internal Links
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  /**
   * Switch to a given tab by name.
   */
  function switchTab(tabName) {
    // Update buttons
    tabBtns.forEach(btn => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    // Update panels
    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash
    if (history.pushState) {
      history.pushState(null, null, `#${tabName}`);
    }
  }

  // ── Tab button clicks ──
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      if (tabName) switchTab(tabName);
    });
  });

  // ── Internal links with data-tab attribute ──
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-tab]');
    if (!link) return;
    e.preventDefault();
    const tabName = link.dataset.tab;
    if (tabName) switchTab(tabName);
  });

  // ── Handle initial hash on load ──
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const validTabs = ['narin', 'medicine', 'media', 'publications'];
    if (validTabs.includes(hash)) {
      switchTab(hash);
    }
  }

  // ── Handle browser back/forward ──
  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.replace('#', '');
    const validTabs = ['narin', 'medicine', 'media', 'publications'];
    if (validTabs.includes(newHash)) {
      switchTab(newHash);
    }
  });

});
