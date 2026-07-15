# PLAN-GTM-GA4 — Bilbao Reforma

## 1. Estado actual

| Item | Estado | Detalle |
|------|--------|---------|
| GTM | ⚠️ Instalado con ID placeholder | `GTM-MJNJJ3L6` en `BaseLayout.astro` líneas 71-75 (snippet) y 100 (noscript). No es un ID real. |
| GA4 | ❌ No instalado | No hay script GA4, no hay `@astrojs/google-analytics`, no hay `G-XXXXXXXXXX` en ningún archivo. |
| Consentimiento cookies | ❌ No implementado | No hay banner de cookies ni lógica de consentimiento. |
| Eventos custom | ❌ No configurados | No hay `dataLayer` pushes ni llamadas `gtag()`. |

**Archivos que contienen referencias a Google:**
- `src/layouts/BaseLayout.astro` — GTM snippet (líneas 71-75 `<head>`, línea 100 `<noscript>`)
- `src/scripts/analyzers/fix-blog-bodies.ts` — elimina iframes de GTM en body (línea 123); irrelevante para implementación
- `src/pages/politica-privacidad.astro` — política sin mención a Google Analytics ni cookies

**Stack confirmado:** Astro 4.16 + Tailwind 3.4 + `@astrojs/tailwind`

---

## 2. Recomendación

### Opción A — GTM + GA4 (✅ Recomendada)
- **GTM** como contenedor central: permite añadir/editar tags sin tocar código (píxel de Meta, tags de remarketing, conversiones, etc.) en el futuro.
- **GA4** dentro de GTM: configuración de GA4 Measurement Protocol via GTM.
- **Coste de implementación:** ~1.5h.
- **Gestión de consentimiento:** GTM permite pausar/activar tags según consentimiento.

### Opción B — Solo GA4 directo
- Snippet GA4 directamente en `<head>` sin GTM.
- Más simple inicialmente, pero menos flexible para futuras expansiones.
- **Coste de implementación:** ~45 min.

### Decisión: Opción A (GTM + GA4)
GTM está ya parcialmente preparado en el layout. Añadir GA4 dentro de GTM cuesta poco y abre la puerta a eventos complejos, conversiones y otros tags sin cambiar código.

---

## 3. Código a insertar

### 3.1 GTM — Reemplazar snippet en `BaseLayout.astro`

**Ubicación:** `src/layouts/BaseLayout.astro`, líneas 71-75 (reemplazar el bloque GTM existente).

```html
<!-- Google Tag Manager -->
<script is:inline>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
```

> **Placeholder:** `GTM-XXXXXXX` → substituir por el ID real del contenedor GTM.

---

### 3.2 GA4 — Añadir como tag dentro de GTM (NO en el código)

GA4 no se instala directamente en el HTML. Se configura dentro del **contenedor GTM** como un tag de tipo "Google Analytics: GA4 Configuration":

```
Measurement ID: G-XXXXXXXXXX
Fields to set:
  - cookie_flags: SameSite=None;Secure
  - send_page_view: true (automático)
```

> **Placeholder:** `G-XXXXXXXXXX` → substituir por el Measurement ID real de GA4.

---

### 3.3 dataLayer con consentimiento (para después del cookie banner)

Una vez el usuario acepte cookies, ejecutar:

```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'analytics_storage': 'denied'
});
// Tras aceptación del banner:
gtag('consent', 'update', {
  'analytics_storage': 'granted'
});
```

---

## 4. Archivos a modificar

| Archivo | Qué tocar | Ubicación aprox. |
|---------|-----------|-------------------|
| `src/layouts/BaseLayout.astro` | Reemplazar ID GTM (`GTM-MJNJJ3L6` → `GTM-XXXXXXX`) | Líneas 71-75 y 100 |
| `src/layouts/BaseLayout.astro` | Añadir `<script is:inline>` de configuración `gtag` con consentimiento | Tras snippet GTM, antes del cierre de `</head>` |
| `src/layouts/BaseLayout.astro` | Añadir HTML del banner de cookies | Dentro de `<body>`, tras `<slot />` |
| `src/components/Calculator.astro` | Añadir `dataLayer.push` tras cálculo completado | Componente StepFinal |
| `src/components/calculator/StepFinal.astro` | Añadir `dataLayer.push` tras calculadora completada | En el handler del botón WhatsApp |
| `src/components/Footer.astro` | Añadir `dataLayer.push` en enlaces de política/cookies | Si aplica |
| `src/pages/politica-privacidad.astro` | Actualizar política con referencia a Google Analytics y cookie banner | — |

---

## 5. Eventos a trackear

| Evento | Trigger | `dataLayer.push` |
|--------|---------|-----------------|
| `page_view` | Automático en GA4 | `dataLayer.push({'event': 'page_view', 'page_location': window.location.href})` |
| `calculadora_completada` | Usuario completa un paso de calculadora (Step 1-4) | `dataLayer.push({'event': 'calculadora_completada', 'calculadora_tipo': 'bano\|cocina\|pintura\|suelo\|integral', 'ciudad': 'bilbao\|donostia\|vitoria'})` |
| `boton_whatsapp_pulsado` | Click en botón WhatsApp en StepFinal | `dataLayer.push({'event': 'boton_whatsapp_pulsado', 'calculadora_tipo': tipo, 'ciudad': ciudad})` |
| `pdf_descargado` | Click en enlace/botón de descarga de PDF | `dataLayer.push({'event': 'pdf_descargado', 'pdf_nombre': nombre})` |
| `formulario_enviado` | Submit de formulario de contacto | `dataLayer.push({'event': 'formulario_enviado', 'form_id': id})` |

### Implementación sugerida para Astro

Crear un helper `src/scripts/analytics.ts`:

```typescript
// src/scripts/analytics.ts
export type EventName = 'calculadora_completada' | 'boton_whatsapp_pulsado' | 'pdf_descargado' | 'formulario_enviado';

interface EventPayload {
  event: EventName;
  [key: string]: unknown;
}

export function trackEvent(payload: EventPayload): void {
  if (typeof window !== 'undefined' && typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push(payload);
  }
}
```

Luego en cada componente `.astro`:

```astro
<script>
  import { trackEvent } from '../scripts/analytics';
  // ...
  botonWhatsapp.addEventListener('click', () => {
    trackEvent({
      event: 'boton_whatsapp_pulsado',
      calculadora_tipo: 'integral',
      ciudad: 'bilbao'
    });
  });
</script>
```

---

## 6. Cookies / RGPD

### Situación actual
No hay banner de cookies. El sitio está potencialmente en breach del RGPD si GTM está cargando scripts de tracking sin consentimiento.

### Solución recomendada: Consent mode básico

**Paso 1 — Cookie banner en HTML (añadir en `BaseLayout.astro` tras `<slot />`):**

```html
<!-- Cookie Banner -->
<div id="cookie-banner" class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg hidden" role="dialog" aria-label="Política de cookies">
  <div class="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4">
    <p class="text-sm text-gray-700 flex-1">
      Utilizamos cookies para mejorar tu experiencia y analizar el tráfico. 
      <a href="/politica-privacidad" class="underline">Más información</a>
    </p>
    <div class="flex gap-3">
      <button id="cookie-reject" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Rechazar</button>
      <button id="cookie-accept" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Aceptar</button>
    </div>
  </div>
</div>

<script is:inline>
(function() {
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;
  if (localStorage.getItem('cookieConsent')) return;
  banner.classList.remove('hidden');

  document.getElementById('cookie-accept').addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.classList.add('hidden');
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  });

  document.getElementById('cookie-reject').addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'rejected');
    banner.classList.add('hidden');
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
  });
})();
</script>
```

**Paso 2 — Configurar GTM con Consent Initialization**
En el contenedor GTM:
1. Crear un tag de tipo **"Consent Initialization"** (disponible en GTM nuevo)
2. Configurar `analytics_storage: denied` por defecto
3. Añadir un trigger de tipo **"DOM Ready"** con condición de `cookieConsent == 'accepted'`

**Paso 3 — Actualizar política de privacidad**
En `src/pages/politica-privacidad.astro`: añadir sección de cookies mencionando Google Analytics y GTM como responsables del tratamiento.

---

## 7. Resumen de pasos de implementación

### Fase 1 — GTM + GA4 (30 min)
1. Reemplazar `GTM-MJNJJ3L6` por `GTM-XXXXXXX` real en `BaseLayout.astro`
2. Crear contenedor GTM en [tagmanager.google.com](https://tagmanager.google.com)
3. Añadir tag GA4 Configuration (`G-XXXXXXXXXX`) dentro del contenedor GTM
4. Configurar `page_view` como trigger en GA4
5. Verificar con GTM Preview Mode

### Fase 2 — Eventos custom (45 min)
6. Crear `src/scripts/analytics.ts`
7. Insertar `trackEvent` en `StepFinal.astro` (WhatsApp)
8. Insertar `trackEvent` en calculadora completa
9. Insertar `trackEvent` en descarga de PDF (si existe)
10. Insertar `trackEvent` en formulario de contacto

### Fase 3 — Cookie Banner / RGPD (30 min)
11. Añadir banner HTML en `BaseLayout.astro`
12. Conectar botones con `gtag('consent', 'update', ...)`
13. Configurar Consent Initialization en GTM
14. Actualizar `politica-privacidad.astro`
15. Testing completo con GTM Preview Mode y Tag Assistant

---

## 8. Dependencias

No se necesitan packages npm nuevos. La implementación usa:
- JavaScript vanilla (`dataLayer`, `gtag`)
- HTML/CSS del banner (Tailwind ya disponible)
- GTM como tag manager externo

---

*Documento generado: 2026-07-15 | Tiempo estimado de implementación: 1.5h*
