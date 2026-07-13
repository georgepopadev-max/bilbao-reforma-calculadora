# SPRINT: Nuevas Demos Web Viva — Estructura Esencial/Pro + Demo Pro "Sukil"
**Agente único — Análisis + Desarrollo + QA**
**Stack:** Next.js 15 + Tailwind 4 + TypeScript

## 📋 CONTEXTO

Proyecto: `/home/ubuntu/.openclaw/workspace/lead-machine/`
Frontend: `frontend/`
URL: https://www.axonflow.es (o localhost:3000 en dev)

### Situación actual
- 3 demos existentes: La Mafia (lamafia), Mina (mina), La Viña (lavina)
- Página precios: Esencial 147€/mes, Pro 297€/mes, Premium 597€/mes (placeholder)

### Objetivo del sprint
**Reorganizar las 3 demos:**
- **Esencial 1:** La Mafia 🍝 (`lamafia`) — SIN cambios, ya existe
- **Esencial 2:** Mina 🐟 (`mina`) — SIN cambios, ya existe  
- **Pro:** NUEVA demo "Sukil" — alta cocina vasca contemporánea, con apartados premium

La demo Pro debe tener apartados que:
1. Justifiquen visualmente los 297€/mes vs 147€/mes
2. Muestren funcionalidades que el Esencial NO tiene
3. Den sensación de "están regalando la web comparado con lo que incluye"

## 🎯 TAREA ÚNICA (pero compleja)

### 1. Crear nueva demo "Sukil" en demoData.ts

**Restaurant fictional data:**
- **Nombre:** Sukil
- **Tipo:** Alta cocina vasca contemporánea
- **Ciudad:** Bilbao
- **Tagline:** "Producto del Cantábrico. Técnica sin compleja."
- **Descripción:** Restaurante de alta cocina en el Casco Viejo de Bilbao. Menú degustación de temporada con producto de lonja cada mañana. 8 pases, sala íntima para 24 comensales. Winner Best New Restaurant 2025 Bilbao.
- **成立:** 2023
- **tier:** `pro`
- **tone:** `minimal`

**Paleta de colores (oscura, premium):**
```typescript
palette: {
  bgAccent: 'bg-emerald-800 hover:bg-emerald-900',
  textAccent: 'text-emerald-700',
  bgSoftAccent: 'bg-emerald-50',
  ringAccent: 'ring-emerald-800',
}
```

**Hero gradient:** `from-slate-900 via-teal-900 to-slate-900`

### 2. Apartados EXTRA que tendrá la demo Pro (y NO tendrá Esencial)

Estos apartados son la CLAVE del sprint. Deben implementarse como secciones reales dentro de `DemoTemplate.tsx` para Sukil, y NO aparecer en lamafia ni mina.

#### Apartado A: "Eventos & Privatizaciones" (antes de la carta)
```
Sección con fondo oscuro, título "Celebra momentos únicos"
- 3 tipos de eventos: Cena privada (hasta 12 personas), Evento corporativo, Menú tasting exclusivo
- Cada uno con descripción, icono SVG, botón "Solicitar información"
- CTA: Abre modal de contacto específico para eventos
```

#### Apartado B: "Chefs Table Experience" (después de la carta)
```
Sección con fondo gradient esmeralda/oscuro
- "Sukil Chef's Table" — experiencia exclusiva en la cocina
- Capacidad 6 personas, menú 12 pases, maridaje incluido
- Precio: 195€/persona
- Galería de 3 fotos de la experiencia
- CTA: "Reservar Chef's Table" → WhatsApp
```

#### Apartado C: "Bonos Regalo" (después de Chef's Table)
```
Tarjetas de regalo digitales
- Bono Experiencia (65€) — menú degustación para 1 persona
- Bono Tasting (120€) — menú largo para 2 personas
- Bono Chef's Table (390€) — experiencia completa para 2
- "El regalo perfecto para los amantes de la gastronomía"
- Cada bono: icono, descripción, precio, botón "Solicitar"
```

#### Apartado D: "Prensa & Reconocimientos" (después de Trust Badges)
```
Carrusel o grid de menciones:
- "Best New Restaurant 2025" — Bilbao Gastro Awards
- "2 Tenedores" — Guía Repsol 2026
- "Mejor Restaurante Nuevo" — TripAdvisor Travelers' Choice 2025
Cada uno: logo/badges, nombre del premio, año
```

#### Apartado E: "Únete a nuestro Club" (después de los bonos, antes del mapa)
```
Programa de fidelización
- Titular + 1 acompañante gratis (2×1 en menú del día)
- Acceso prioritario a eventos exclusivos
- Descuentos en Chef's Table
- "Sukil Club — Próximamente" (botón con waitlist)
```

### 3. Modificar DemoTemplate.tsx para soportar secciones opcionales

El `DemoTemplate` recibe `demo: DemoData`. Añadir campos opcionales al interface y renderizar las secciones extra SOLO si existen en `demo`.

```typescript
// En demoData.ts, añadir al interface DemoData:
eventsSection?: EventsSection;
chefTable?: ChefTable;
giftCards?: GiftCard[];
pressAwards?: PressAward[];
loyaltyProgram?: LoyaltyProgram;

// Ejemplo:
eventsSection?: {
  title: string;
  subtitle: string;
  events: Array<{
    icon: string; // SVG path
    title: string;
    description: string;
    price?: string;
    cta: string;
  }>;
};
```

### 4. Actualizar SiteFooter.tsx para Sukil

Añadir `slug` de tipo `'lamafia' | 'mina' | 'lavina' | 'sukil'` al SiteFooter si es necesario (verificar que acepte 4 slugs).

### 5. Galería para Sukil

En `galleryImages.ts`, añadir imágenes Unsplash específicas para Sukil (alta cocina, plating, interior minimalista).

### 6. Actualizar page.tsx de precios

Cambiar "Premium" (597€) a "Esencial" para La Mafia y Mina, y "Pro" para Sukil. Mantener la estructura de 3 tiers pero:
- **Esencial** (147€/mes): La Mafia + Mina
- **Pro** (297€/mes): Sukil ← DESTACADO, RECOMENDADO
- **Premium** (597€/mes): placeholder "Próximamente" con ancla visual

### 7. DemoSelector — actualizar para mostrar las 3 demos

En `DemoSelector.tsx`, asegurar que lamafia, mina y sukil aparezcan como opciones.

## 📁 ARCHIVOS A MODIFICAR

1. `frontend/components/web-viva/demoData.ts` — Añadir Sukil + nuevos campos opcionales
2. `frontend/components/web-viva/DemoTemplate.tsx` — Renderizar secciones extra solo si existen
3. `frontend/components/web-viva/galleryImages.ts` — Añadir imágenes Sukil
4. `frontend/components/web-viva/SiteFooter.tsx` — Soportar slug 'sukil'
5. `frontend/app/precios/page.tsx` — Reordenar tiers
6. `frontend/components/web-viva/DemoSelector.tsx` — Actualizar lista

## 🚀 SECUENCIA DE TRABAJO

1. Añadir Sukil a demoData.ts con todos los campos base (menu, reviews, etc.)
2. Añadir los 5 apartados extra a demoData.ts
3. Modificar DemoTemplate.tsx para conditionally render cada sección
4. Crear los componentes de cada sección (inline en DemoTemplate o nuevos componentes)
5. Añadir imágenes a galleryImages.ts
6. Actualizar SiteFooter.tsx si necesita cambios
7. Actualizar DemoSelector.tsx
8. Actualizar página de precios
9. Build: `cd frontend && npm run build` → verde
10. QA manual: abrir /web-viva/demo/sukil y verificar todas las secciones

## ✅ CRITERIOS DE QA

- Sukil: todas las secciones extra visibles (Eventos, Chef's Table, Bonos, Prensa, Club)
- La Mafia y Mina: NO muestran las secciones extra (usan la plantilla base)
- Build verde
- Navegación entre 3 demos funciona
- Precios: Pro = 297€ y es el recomendado
- Mobile: todas las secciones legibles en 375px

## 🎨 DETALLES DE DISEÑO

- Usar paleta esmeralda/oscura de Sukil
- Tipografía: Playfair Display para títulos (already set), Inter para cuerpo
- Animaciones de scroll existentes ya en DemoTemplate (scroll-animate classes)
- Las secciones extra de Sukil usar `.scroll-animate` para entrar con fade
- Estilo visual: premium, oscuro, minimalista — el polo opuesto a La Mafia (cálido/rojo)

---

## ⏱️ TIMELINE

Este es un sprint MEDIO. Approximadamnte 1.5-2h si conoces la base.

## 🚦 EMPIEZA

1. Lee demoData.ts completo
2. Lee DemoTemplate.tsx para entender cómo renderiza secciones
3. Crea la nueva demo Sukil en demoData.ts
4. Añade los campos opcionales al interface
5. Modifica DemoTemplate para conditional rendering
6. Build y QA
