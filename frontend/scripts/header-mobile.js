/**
 * Header Mobile Drawer — Lote B Sprint UI-1
 * Handles: toggle, focus trap, close on outside click/Escape, aria-sync
 */
export function initHeaderMobile() {
  const toggle = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileBackdrop');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const drawerLinks = drawer?.querySelectorAll('a');

  if (!toggle || !drawer) return;

  // Focusable elements inside drawer for focus trap
  function getFocusableElements() {
    return drawer.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
  }

  function openDrawer() {
    toggle.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus first link
    const first = getFocusableElements()[0];
    if (first) first.focus();
  }

  function closeDrawer() {
    toggle.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.style.overflow = '';
    toggle.focus();
  }

  // Toggle button
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  // Close button (X)
  closeBtn?.addEventListener('click', closeDrawer);

  // Close on backdrop click
  backdrop?.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeDrawer();
    }
  });

  // Focus trap inside drawer
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

  // Close on link click inside drawer
  drawerLinks?.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// Auto-init if DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderMobile);
} else {
  initHeaderMobile();
}
