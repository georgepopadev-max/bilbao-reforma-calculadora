# 📋 Backlog Bilbao Reforma — SEO + Contenido + Revisión Textos

**Proyecto:** `/home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora/`
**Stack:** Astro 4.x + Tailwind + TypeScript strict

## 🎯 Reglas de oro (establecidas con George)

1. **Cada tarea tiene revisión de TEXTOS como gate obligatoria** (no se cierra tarea sin QA de copy)
2. **Máximo 2 agentes concurrently** (regla del workspace)
3. **1 agente = 1 tarea atómica** (no mezclar)
4. **Tareas acumulan progreso, no se cierran sin QA passed**

---

## 📊 Estado actual (verificado)

✅ **Completado:**
- Migración a Astro 4.x (97 páginas)
- Tailwind + design tokens
- Calculadora partida en 6 TS modules
- Header adaptativo por ruta
- URLs `.html` mantenidas
- 5 blogs Donostia nuevos + 5 blogs Vitoria nuevos
- og:image + twitter:card en 59 blogs

---

## 🔥 Tareas pendientes (ordenadas por prioridad)

### T-001 [ALTA] — Asegurar og:image en TODAS las páginas (no solo blogs)
- **Scope:** 97 páginas, no solo blogs (incluir index, contacto, empresas, calculadoras, ciudades)
- **Qué:** Verificar que cada página tenga og:image real (no genérico)
- **QA textos:** Verificar alt text de cada imagen (accesibilidad + SEO)
- **Estimación:** 1h
- **Espera aprobación del TEST ENRIQUECIDO**

### T-002 [ALTA] — Optimizar titles y meta descriptions (>60 chars penaliza Google)
- **Scope:** 97 páginas
- **Qué:** Auditar title (max 60) + description (max 155). Reescribir los que pasan el límite.
- **QA textos:** Revisión copy por humano/native speaker. Keywords principales en title y description.
- **Output:** Lista de páginas modificadas + antes/después
- **Estimación:** 2h (97 páginas × 30 segundos cada una)

### T-003 [ALTA] — Añadir H2 con keywords long-tail en blogs débiles
- **Scope:** Blogs con pocas secciones (under 5 H2)
- **Qué:** Añadir 2-3 H2 con keywords long-tail específicas (ej: "cuánto cuesta reformar baño pequeño Bilbao", "licencias obra menor Bilbao 2026")
- **QA textos:** Revisar coherencia con contenido + posicionamiento keyword
- **Estimación:** 3h (afecta ~30 blogs)

### T-004 [MEDIA] — Crear 5 blogs nuevos para Donostia (faltan verticales)
- **Scope:** Nuevos blogs con topics no cubiertos para Donostia
- **Ideas:**
  - `tipos-calefaccion-donostia.md` (ya existe para Bilbao, falta Donostia)
  - `reforma-integral-piso-donostia.md`
  - `cambiar-suelo-donostia.md`
  - `pintar-piso-donostia.md`
  - `materiales-cocina-donostia.md`
- **QA textos:** Adaptación geográfica (precios, empresas, barrios), copy coherente
- **Estimación:** 4h

### T-005 [MEDIA] — Crear 5 blogs nuevos para Vitoria (faltan verticales)
- **Scope:** Como T-004 pero para Vitoria
- **Ideas:**
  - `tipos-calefaccion-vitoria.md`
  - `reforma-integral-piso-vitoria.md`
  - `cambiar-suelo-vitoria.md`
  - `pintar-piso-vitoria.md`
  - `materiales-cocina-vitoria.md`
- **QA textos:** Mismo nivel de adaptación
- **Estimación:** 4h

### T-006 [MEDIA] — Cluster temático: crear hub de "Subvenciones" único
- **Scope:** 8 blogs subvenciones Bilbao + 2 Donostia + 1 Vitoria
- **Qué:** Crear `hub-subvenciones-bilbao.astro` estilo `hub-reforma-bano-bilbao` (con ItemList)
- **QA textos:** Copy introductorio, justificación, llamadas a la acción
- **Estimación:** 2h

### T-007 [MEDIA] — Cluster temático: crear hub de "Errores comunes"
- **Scope:** 3 blogs sobre errores (reforma baño, cocina, integral)
- **Qué:** Crear `hub-errores-reformas-bilbao.astro` similar al de subvenciones
- **QA textos:** Copy, FAQs, CTAs
- **Estimación:** 1.5h

### T-008 [MEDIA] — Mejorar SEO local de empresas (7 fichas)
- **Scope:** Empresas/*.astro (7 empresas)
- **Qué:** Cada empresa con:
  - LocalBusiness schema completo (horarios, geo, servicios[])
  - Reviews/testimonios (si hay)
  - Galería imágenes proyectos
  - Servicio por ciudad (Bilbao + Donostia + Vitoria si aplica)
- **QA textos:** Revisión copy empresa por empresa, tono coherente
- **Estimación:** 3h

### T-009 [BAJA] — Internal linking: enlazar blogs relacionados automáticamente
- **Scope:** Todos los blogs
- **Qué:** Lógica para mostrar 3-4 blogs relacionados al final de cada post (por category)
- **QA textos:** Anclas descriptivas, no spam
- **Estimación:** 4h

### T-010 [BAJA] — Schema.org Article en todos los blogs
- **Scope:** Todos los blogs (59 actualmente)
- **Qué:** Añadir Article schema con author, datePublished, dateModified, image
- **QA textos:** Verificar fechas coherentes (no futuro)
- **Estimación:** 2h

### T-011 [BAJA] — hreflang tags para es-ES (preparar i18n futuro)
- **Scope:** Site entero
- **Qué:** Añadir `<link rel="alternate" hreflang="es-ES" href="...">` en cada página
- **QA textos:** No requiere copy, solo estructura
- **Estimación:** 1h

### T-012 [BAJA] — Sitemap.xml dinámico con todas las páginas nuevas
- **Scope:** Site entero
- **Qué:** Generar sitemap.xml con @astrojs/sitemap + lastmod por página
- **QA textos:** No, validación XML
- **Estimación:** 30min

### T-013 [MEDIA] — Reescribir robots.txt con directivas SEO modernas
- **Scope:** robots.txt
- **Qué:** Permitir todo excepto /admin, /private. Sitemap URL correcta.
- **Estimación:** 30min

### T-014 [MEDIA] — Métricas GTM/GA4 (recordatorio original de George)
- **Scope:** GTM container, GA4 events
- **Qué:** Configurar tags según `docs/MEDICION-GTM-GA4.md`:
  - Tag GA4 Config (G-YLV6ZG2VMZ)
  - 5 tags de eventos: clic_telefono, generate_lead, clic_email, scroll, engaged_session_2min
  - Triggers asociados
  - Vincular Search Console
  - Marcar 2 conversiones
- **Estimación:** 15min (George ya tiene la doc)
- **NOTA:** Esta tarea es la del recordatorio original — hacerla cuanto antes

### T-015 [MEDIA] — Auditar contenido duplicado o thin content
- **Scope:** Todos los blogs
- **Qué:** Identificar blogs con <300 palabras de contenido real (Google penaliza)
- **QA textos:** Evaluación por humano
- **Output:** Lista de blogs a expandir o consolidar
- **Estimación:** 2h

---

## 🎯 Cómo ejecutar (protocolo)

### Para cada tarea:

1. **Asignar agente M2.7** con scope atómico
2. **Agente trabaja** con instrucciones explícitas de revisión de textos
3. **Al terminar**, agente entrega:
   - Lista de archivos modificados
   - Output build verde
   - **Diff de textos** (antes/después) si afecta copy
   - Lista de copy pendiente de revisión humana
4. **Orquestrador (M3) revisa QA de TEXTOS**:
   - Coherencia con brand voice
   - Keywords principales presentes
   - Sin duplicación de contenido
   - Tono profesional pero cercano
5. **Cierra o re-asigna** según resultado

### Ejemplo de brief para agente (T-002):
```
Tarea: T-002 (title/description optimization)
Scope: 97 páginas
Restricción: máximo 60 chars title, 155 chars description
QA textos: cada cambio debe ser coherente con brand, NO keyword stuffing
Output esperado: lista de cambios, build verde, diff copy
```

---

## 📈 Roadmap sugerido

**Sprint SEO Q3 2026:**
1. T-014 (GTM/GA4) — primero (15min)
2. T-002 (titles/descriptions) — segundo (2h) ← más impacto
3. T-001 (og:image) — tercero (1h)
4. T-003 (H2 keywords long-tail) — cuarto (3h)
5. T-004 + T-005 (blogs nuevas ciudades) — quinto (8h en paralelo)
6. T-006 + T-007 (hubs temáticos) — sexto (3.5h)
7. T-008 (empresas SEO) — séptimo (3h)
8. T-009 (internal linking) — octavo (4h)
9. T-010 (Article schema) — noveno (2h)
10. T-011 + T-012 + T-013 (técnicos) — décimo (2h)
11. T-015 (auditoría contenido) — undécimo (2h)

**Total estimado:** ~32h tareas, **ejecutable en ~16h con 2 agentes en paralelo**

---

## 🚦 Estado del backlog

| ID | Prioridad | Estado | Estimación | Notas |
|---|---|---|---|---|
| T-001 | ALTA | Pendiente | 1h | og:image en todas |
| T-002 | ALTA | Pendiente | 2h | titles/descriptions |
| T-003 | ALTA | Pendiente | 3h | H2 keywords long-tail |
| T-004 | MEDIA | Pendiente | 4h | 5 blogs Donostia |
| T-005 | MEDIA | Pendiente | 4h | 5 blogs Vitoria |
| T-006 | MEDIA | Pendiente | 2h | hub subvenciones |
| T-007 | MEDIA | Pendiente | 1.5h | hub errores |
| T-008 | MEDIA | Pendiente | 3h | SEO empresas |
| T-009 | BAJA | Pendiente | 4h | internal linking |
| T-010 | BAJA | Pendiente | 2h | Article schema |
| T-011 | BAJA | Pendiente | 1h | hreflang |
| T-012 | BAJA | Pendiente | 30min | sitemap.xml |
| T-013 | MEDIA | Pendiente | 30min | robots.txt |
| T-014 | MEDIA | Pendiente | 15min | GTM/GA4 |
| T-015 | MEDIA | Pendiente | 2h | auditoría thin content |

---

## 📝 Cómo aprobar una tarea

George responde:
- `"lanza T-002"` → orquestador lanza 1 agente M2.7
- `"lanza T-002 + T-004 paralelo"` → 2 agentes en paralelo
- `"lanza todas las ALTA"` → múltiples agentes hasta máximo 2 concurrentes

**IMPORTANTE:** No se cierra tarea sin diff de textos y confirmación de coherencia.
