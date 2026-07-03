/**
 * Header Mobile Drawer — Lote B Sprint UI-1
 * Handles: toggle, focus trap, close on outside click/Escape, aria-sync
 */
export function initHeaderMobile() {
  const toggle = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileBackdrop');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

  if (!toggle || !drawer) return;

  function getFocusableElements() {
    return drawer.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
  }

  function openDrawer() {
    toggle.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    const first = getFocusableElements()[0];
    if (first) first.focus();
  }

  function closeDrawer() {
    if (!toggle || !drawer) return;
    toggle.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (toggle) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const expanded = toggle ? toggle.getAttribute('aria-expanded') : 'false';
      if (expanded === 'true') closeDrawer();
    }
  });

  drawer.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = getFocusableElements();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderMobile);
} else {
  initHeaderMobile();
}
