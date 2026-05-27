/* ═══════════════════════════════════════════════════════════════
   Main JS — Tabs · Progress · A11y
   ═══════════════════════════════════════════════════════════════ */

const VALID_TABS = ['narin', 'medicine', 'media', 'publications', 'projects'];

document.addEventListener('DOMContentLoaded', () => {
  const tabBtns   = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
  const mast      = document.querySelector('.mast');
  const progress  = document.querySelector('.read-progress');

  /* ── Tab switching ───────────────────────────────────────── */
  function switchTab(tabName, opts = {}) {
    const { pushHash = true, scroll = true } = opts;

    tabBtns.forEach(btn => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive);
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });

    updateProgressVisibility(tabName);

    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    if (pushHash && history.pushState) {
      history.pushState(null, '', `#${tabName}`);
    }
  }

  /* ── Tab button clicks ────────────────────────────────────── */
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      if (tabName) switchTab(tabName);
    });
  });

  /* ── Keyboard arrow nav for tabs ──────────────────────────── */
  tabBtns.forEach((btn, i) => {
    btn.addEventListener('keydown', (e) => {
      let nextIdx = null;
      if (e.key === 'ArrowRight') nextIdx = (i + 1) % tabBtns.length;
      else if (e.key === 'ArrowLeft') nextIdx = (i - 1 + tabBtns.length) % tabBtns.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = tabBtns.length - 1;
      if (nextIdx !== null) {
        e.preventDefault();
        const next = tabBtns[nextIdx];
        next.focus();
        switchTab(next.dataset.tab);
      }
    });
  });

  /* ── Internal links with data-tab ─────────────────────────── */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-tab], [data-tab][role="link"]');
    if (!link || link.classList.contains('tab-btn')) return;
    e.preventDefault();
    const tabName = link.dataset.tab;
    if (tabName) switchTab(tabName);
  });

  /* ── Initial hash routing ─────────────────────────────────── */
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && VALID_TABS.includes(initialHash)) {
    switchTab(initialHash, { pushHash: false, scroll: false });
  }

  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    if (VALID_TABS.includes(h)) switchTab(h, { pushHash: false });
  });

  /* ── Scroll: sticky header shadow + reading progress ──────── */
  function onScroll() {
    const y = window.scrollY;
    if (mast) mast.classList.toggle('is-scrolled', y > 8);

    if (progress) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      progress.style.width = `${pct}%`;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function updateProgressVisibility(tabName) {
    if (!progress) return;
    /* show on long content tabs */
    const show = tabName === 'medicine' || tabName === 'media' || tabName === 'projects';
    progress.classList.toggle('is-active', show);
  }

  /* ── Year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
