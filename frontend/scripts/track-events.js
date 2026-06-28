/**
 * Track events fallback for bilbaoreforma.es
 * Funciona con o sin GTM cargado
 */
(function() {
  'use strict';

  // Solo trackear si no estamos en localhost o preview
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app')) {
    return;
  }

  // Función genérica para enviar eventos a GTM dataLayer
  function trackEvent(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params
    });

    // Fallback: enviar a GA4 directamente si existe gtag
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }

    // Console log para debug
    if (window.location.search.includes('debug=1')) {
      console.log('[track]', eventName, params);
    }
  }

  // 1. Clic en enlaces tel:
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href^="tel:"]');
    if (link) {
      trackEvent('clic_telefono', {
        telefono: link.getAttribute('href').replace('tel:', ''),
        pagina: window.location.pathname
      });
    }
  });

  // 2. Submit de formularios (calculadora, contacto, etc.)
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (form && form.tagName === 'FORM') {
      trackEvent('generate_lead', {
        form_id: form.id || form.className || 'unknown',
        pagina: window.location.pathname
      });
    }
  });

  // 3. Clic en mailto:
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href^="mailto:"]');
    if (link) {
      trackEvent('clic_email', {
        email: link.getAttribute('href').replace('mailto:', '').split('?')[0],
        pagina: window.location.pathname
      });
    }
  });

  // 4. Scroll depth (25, 50, 75, 100)
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };
  function checkScroll() {
    var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = scrollHeight > 0 ? Math.round((window.scrollY / scrollHeight) * 100) : 0;
    Object.keys(scrollMarks).forEach(function(mark) {
      if (scrollPercent >= parseInt(mark, 10) && !scrollMarks[mark]) {
        scrollMarks[mark] = true;
        trackEvent('scroll', { percent: parseInt(mark, 10), pagina: window.location.pathname });
      }
    });
  }
  var scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkScroll, 100);
  });

  // 5. Tiempo en página (2 min)
  setTimeout(function() {
    trackEvent('engaged_session_2min', { pagina: window.location.pathname });
  }, 120000);

})();