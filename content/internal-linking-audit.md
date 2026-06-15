# Auditoría de Internal Linking — bilbaoreforma.es

## Resumen
- **Total artículos auditados:** 29 (30 archivos .html contando el index del blog)
- **Artículos CON enlace a calculadora en contenido/CTA:** 10
- **Artículos CON enlace a calculadora SOLO en navegación:** 7
- **Artículos SIN ningún enlace a calculadora:** 12
- **Enlaces rotos encontrados:** 2
- **CTAs que enlazan a index.html en lugar de la calculadora:** 9
- **Mejoras propuestas:** 29+

---

## Artículos sin CTA hacia calculadora

Estos artículos no tienen ningún enlace (ni en CTA, ni en navegación, ni en contenido) hacia ninguna página de la calculadora:

1. `aerotermia-bilbao-ventajas.html`
2. `empresas-reformas-bilbao.html`
3. `empresas-reformas-donostia.html`
4. `licencias-obra-bilbao.html`
5. `materiales-cocina-bilbao.html`
6. `reforma-80m2-bilbao-ejemplo.html`
7. `reforma-bano-bilbao.html`
8. `reforma-vs-comprar-bilbao.html`
9. `reformas-bilbao-guia-2025.html`
10. `renovar-piso-antiguo-bilbao.html`
11. `suelo-radiante-vs-calefaccion.html` *(tiene enlace en navegación pero NO en contenido)*
12. `tipos-calefaccion-bilbao.html`

---

## Artículos sin enlaces internos (entre artículos)

Ningún artículo del blog carece de enlaces a otros artículos del blog. Todos incluyen al menos un enlace interno. **Solo el `index.html` (listado del blog) no tiene enlaces a artículos individuales** (esperable).

---

## Enlaces rotos encontrados

### 1. `cambiar-suelo-bilbao.html` — Enlaces rotos (2)

**Sidebar:**
```
href="suelo-radiante-ventajas.html"
```
→ El archivo real es `suelo-radiante-ventajas-bilbao.html`. Falta el sufijo `-bilbao`.

**CTA del artículo:**
```
href="../contacto.html"
```
→ El CTA del artículo enlaza a contacto en lugar de a la calculadora específica de suelos (`../calculadora/suelo-bilbao.html`).

### 2. `reforma-personas-mayores-bilbao.html` — Enlace roto

**Sidebar:**
```
href="pintura-bilbao.html"
```
→ El archivo real es `pintar-piso-bilbao.html`. Typo: "pintura" en lugar de "pintar-piso".

### 3. `reforma-bano-bilbao.html` — Autoreferencia en sidebar

```
href="reforma-bano-bilbao.html"  (línea 909, sidebar)
```
→ El artículo se enlaza a sí mismo en el sidebar. Enlace redundante/inútil.

---

## Propuestas de mejora (por artículo)

### aerotermia-bilbao-ventajas.html
- **Añadir CTA:** Sí. El artículo tiene `blog-cta` al final que enlaza a `../index.html` en lugar de la calculadora.
  - **Propuesta:** Cambiar el enlace del CTA a `../calculadora/index.html` con texto: *"Calcula el coste de instalar aerotermia en tu piso de Bilbao →"*
  - **Ubicación:** Al final del artículo (ya existe la sección `.blog-cta`, solo falta cambiar el destino).
- **Añadir enlace interno a:** `tipos-calefaccion-bilbao.html` (ya lo enlaza), `licencias-obra-bilbao.html` (ya lo enlaza), `precio-reforma-integral-bilbao.html` (nuevo — para contextualizar costes).

---

### cambiar-suelo-bilbao.html
- **Enlace roto a corregir:** `suelo-radiante-ventajas.html` → `suelo-radiante-ventajas-bilbao.html`
- **CTA mejorado:** El CTA actual enlaza a `../calculadora/index.html`. Idealmente enlazar a `../calculadora/suelo-bilbao.html` para mayor precisión.
  - **Propuesta de texto:** *"Compara presupuestos para cambiar el suelo en Bilbao →"*
- **Añadir enlace interno a:** `suelo-radiante-ventajas-bilbao.html` (corregido), `precio-reforma-integral-bilbao.html` (ya lo tiene).

---

### empresas-reformas-bilbao.html
- **Añadir CTA:** Sí. El artículo tiene `article-cta` que enlaza a `../index.html`.
  - **Propuesta:** Crear una sección CTA al final del artículo:
    ```
    <div class="article-cta">
      <h3>¿Buscas empresas de reformas en Bilbao?</h3>
      <p>Usa nuestra calculadora para comparar presupuestos de empresas verificadas en Bilbao.</p>
      <a href="../calculadora/index.html">Comparar presupuestos →</a>
    </div>
    ```
  - **Ubicación:** Al final del artículo, antes del sidebar.
- **Añadir enlace interno a:** `precio-reforma-integral-bilbao.html`, `reforma-cocina-bilbao.html`, `reforma-bano-bilbao.html` (artículosRelated más buscados sobre reformas).

---

### empresas-reformas-donostia.html
- **Añadir CTA:** Sí. No tiene sección CTA dedicada. Solo hay un enlace de pie a `../index.html`.
  - **Propuesta:** Crear sección CTA:
    ```
    <div class="article-cta">
      <h3>Presupuesto orientativo para tu reforma en Donostia</h3>
      <p>Usa nuestra calculadora gratuita para estimar el coste de tu reforma en menos de 2 minutos.</p>
      <a href="../calculadora/index.html">Calcular presupuesto →</a>
    </div>
    ```
  - **Ubicación:** Al final del artículo.
  - **Nota:** No existe calculadora específica para Donostia, usar `../calculadora/index.html`.
- **Añadir enlace interno a:** `empresas-reformas-bilbao.html` (artículo hermano sobre Bilbao, coherente), `precio-reforma-integral-bilbao.html`.

---

### errores-comunes-reforma-bilbao.html
- **CTA:** ✅ Ya tiene CTA correcto enlazando a `../calculadora/index.html`. Bien.
- **Añadir enlace interno a:** `reforma-80m2-bilbao-ejemplo.html` (ejemplo práctico de presupuesto como contrapunto a los errores), `reforma-vs-comprar-bilbao.html` (contexto de decisión).

---

### errores-reforma-cocina-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `materiales-cocina-bilbao.html` (ya lo tiene), `reforma-cocina-bilbao.html` (ya lo tiene). Bien conectado.

---

### licencias-obra-bilbao.html
- **CTA incorrecto:** El artículo tiene `blog-cta` que enlaza a `../index.html`.
  - **Propuesta:** Cambiar a `../calculadora/index.html` con texto: *"Calcula los costes de licencia y reforma de tu piso en Bilbao →"*
- **Añadir enlace interno a:** `renovar-piso-antiguo-bilbao.html` (ya lo tiene), `aerotermia-bilbao-ventajas.html` (ya lo tiene), `reformas-casco-viejo-bilbao.html` (nuevo — relación con normativas de casco histórico).

---

### materiales-cocina-bilbao.html
- **CTA incorrecto:** `blog-cta` enlaza a `../index.html`.
  - **Propuesta:** Crear sección CTA:
    ```
    <div class="article-cta">
      <h3>¿Sabes cuánto cuestan los materiales de cocina?</h3>
      <p>Usa nuestra calculadora para estimar el presupuesto total de tu reforma de cocina en Bilbao.</p>
      <a href="../calculadora/cocina-bilbao.html">Calcular presupuesto de cocina →</a>
    </div>
    ```
- **Añadir enlace interno a:** `reforma-cocina-bilbao.html`, `tipos-calefaccion-bilbao.html` (ya lo tiene).

---

### pintar-piso-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `cambiar-suelo-bilbao.html` (ya lo tiene), `reforma-cocina-bilbao.html` (ya lo tiene). Bien.

---

### precio-reforma-integral-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `reforma-80m2-bilbao-ejemplo.html` (ejemplo práctico real — ya lo tiene), `suelo-radiante-ventajas-bilbao.html` (nuevo — correlación con costes de reforma integral y suelo radiante).

---

### reforma-80m2-bilbao-ejemplo.html
- **Añadir CTA:** No tiene sección CTA. Es un artículo clave (caso práctico real).
  - **Propuesta:** Añadir al final:
    ```
    <div class="article-cta">
      <h3>¿Quieres saber qué costaría tu reforma?</h3>
      <p>Usa la calculadora para obtener una estimación personalizada en menos de 2 minutos.</p>
      <a href="../calculadora/integral-bilbao.html">Calcular mi presupuesto →</a>
    </div>
    ```
  - **Ubicación:** Al final del artículo, antes del sidebar.
- **Añadir enlace interno a:** `precio-reforma-integral-bilbao.html` (ya lo tiene), `reforma-bano-bilbao.html` (ya lo tiene), `reforma-cocina-bilbao.html` (nuevo), `cambiar-suelo-bilbao.html` (nuevo — el ejemplo práctico menciona cambio de suelo).

---

### reforma-80m2-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `reforma-80m2-bilbao-ejemplo.html` (artículo gemelo — el ejemplo real), `reforma-bano-bilbao.html`, `reforma-cocina-bilbao.html`.

---

### reforma-bano-bilbao-2025.html
- **CTA incorrecto:** `article-cta` enlaza a `../index.html`.
  - **Propuesta:** Cambiar a `../calculadora/bano-bilbao.html` con texto: *"Calcula el presupuesto de tu reforma de baño en Bilbao →"*
- **Añadir enlace interno a:** `reforma-bano-pequeno-bilbao.html` (nuevo), `reforma-bano-bilbao.html` (ya lo tiene), `errores-comunes-reforma-bilbao.html` (nuevo).

---

### reforma-bano-bilbao.html
- **CTA incorrecto:** `article-cta` enlaza a `../index.html`.
  - **Propuesta:** Cambiar a `../calculadora/bano-bilbao.html`.
- **Autoreferencia rota:** El sidebar enlaza a `reforma-bano-bilbao.html` (sí mismo). Eliminar o cambiar por `reforma-bano-bilbao-2025.html`.
- **Añadir enlace interno a:** `cambiar-suelo-bilbao.html` (ya lo tiene), `errores-comunes-reforma-bilbao.html` (nuevo).

---

### reforma-bano-pequeno-bilbao.html
- **CTA:** No tiene sección CTA dedicada, pero incluye un enlace inline a la calculadora en el contenido (línea 282): *"Usa nuestra calculadora de presupuestos"*.
  - **Propuesta:** Crear una sección CTA formal para dar más visibilidad:
    ```
    <div class="article-cta">
      <h3>Presupuesto para reformar un baño pequeño en Bilbao</h3>
      <p>Calcula una estimación orientativa según metros y calidades.</p>
      <a href="../calculadora/bano-bilbao.html">Calcular presupuesto →</a>
    </div>
    ```
- **Añadir enlace interno a:** `reforma-bano-bilbao.html` (nuevo), `cambiar-suelo-bilbao.html` (nuevo), `reforma-80m2-bilbao-ejemplo.html` (nuevo).

---

### reforma-cocina-bano-santutxu.html
- **CTA:** No tiene sección CTA dedicada, pero incluye enlace inline a la calculadora en contenido (línea 319).
  - **Propuesta:** Crear sección CTA formal:
    ```
    <div class="article-cta">
      <h3>Presupuesto para tu reforma de cocina y baño en Santutxu</h3>
      <p>Usa la calculadora para estimar el coste según metros y materiales.</p>
      <a href="../calculadora/cocina-bilbao.html">Calcular presupuesto →</a>
    </div>
    ```
- **Añadir enlace interno a:** `reforma-cocina-bilbao.html` (nuevo), `reforma-bano-bilbao.html` (nuevo), `reforma-80m2-bilbao-ejemplo.html` (nuevo).

---

### reforma-cocina-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `tipos-calefaccion-bilbao.html` (ya lo tiene). Añadir también: `materiales-cocina-bilbao.html` (nuevo — correlación de temas).

---

### reforma-personas-mayores-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Enlace roto a corregir:** `pintura-bilbao.html` → `pintar-piso-bilbao.html` (línea 623, sidebar).
- **Añadir enlace interno a:** `pintar-piso-bilbao.html` (corregido), `reforma-bano-bilbao.html` (ya lo tiene).

---

### reforma-vs-comprar-bilbao.html
- **Añadir CTA:** No tiene sección CTA. Es un artículo estratégico (decisión de reforma vs. compra).
  - **Propuesta:**
    ```
    <div class="article-cta">
      <h3>Si has decidido reformar, saber cuánto costará</h3>
      <p>Usa la calculadora para obtener una primera estimación antes de dar el paso.</p>
      <a href="../calculadora/integral-bilbao.html">Calcular presupuesto de reforma →</a>
    </div>
    ```
  - **Ubicación:** Al final del artículo, antes del sidebar.
- **Añadir enlace interno a:** `precio-reforma-integral-bilbao.html` (nuevo), `reforma-80m2-bilbao-ejemplo.html` (nuevo), `empresas-reformas-bilbao.html` (nuevo).

---

### reforma-vs-reestructuracion-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `licencias-obra-bilbao.html` (ya lo tiene), `reformas-casco-viejo-bilbao.html` (ya lo tiene).

---

### reformas-bilbao-guia-2025.html
- **CTA incorrecto:** `article-cta` enlaza a `../index.html`.
  - **Propuesta:** Cambiar a `../calculadora/index.html` con texto: *"Explora la guía y luego calcula tu presupuesto →"*
- **Añadir enlace interno a:** `precio-reforma-integral-bilbao.html` (ya lo tiene), `reforma-bano-bilbao.html` (ya lo tiene), `reforma-cocina-bilbao.html` (ya lo tiene), `empresas-reformas-bilbao.html` (nuevo — la guía es buen momento para hablar de empresas), `reformas-casco-viejo-bilbao.html` (nuevo).

---

### reformas-casco-viejo-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `licencias-obra-bilbao.html` (ya lo tiene), `subvenciones-reformas-bilbao.html` (ya lo tiene).

---

### rehabilitacion-edificio-antiguo-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `renovar-piso-antiguo-bilbao.html` (ya lo tiene), `reformas-casco-viejo-bilbao.html` (nuevo).

---

### renovar-piso-antiguo-bilbao.html
- **CTA incorrecto:** `blog-cta` enlaza a `../index.html`.
  - **Propuesta:** Cambiar a `../calculadora/index.html` con texto: *"Calcula el presupuesto para renovar tu piso antiguo en Bilbao →"*
- **Añadir enlace interno a:** `licencias-obra-bilbao.html` (ya lo tiene), `reformas-casco-viejo-bilbao.html` (nuevo — relación con casco viejo y edificios antiguos), `rehabilitacion-edificio-antiguo-bilbao.html` (nuevo — es el siguiente paso lógico).

---

### sanciones-reformas-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `licencias-obra-bilbao.html` (ya lo tiene), `reformas-casco-viejo-bilbao.html` (ya lo tiene).

---

### suelo-radiante-ventajas-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `tipos-calefaccion-bilbao.html` (ya lo tiene), `suelo-radiante-vs-calefaccion.html` (ya lo tiene).

---

### suelo-radiante-vs-calefaccion.html
- **Añadir CTA:** No tiene sección CTA. Es un artículo de comparación temática.
  - **Propuesta:**
    ```
    <div class="article-cta">
      <h3>¿Qué sistema de calefacción se adapta mejor a tu piso?</h3>
      <p>Usa la calculadora para comparar presupuestos de aerotermia, gas y suelo radiante.</p>
      <a href="../calculadora/index.html">Calcular presupuesto →</a>
    </div>
    ```
- **Añadir enlace interno a:** `tipos-calefaccion-bilbao.html` (ya lo tiene), `aerotermia-bilbao-ventajas.html` (nuevo), `suelo-radiante-ventajas-bilbao.html` (ya lo tiene).

---

### tiempo-reforma-integral-bilbao.html
- **CTA:** ✅ Correcto, enlaza a `../calculadora/index.html`.
- **Añadir enlace interno a:** `reforma-80m2-bilbao-ejemplo.html` (ya lo tiene). Añadir también: `reforma-cocina-bilbao.html` (nuevo), `reforma-bano-bilbao.html` (nuevo).

---

### tipos-calefaccion-bilbao.html
- **CTA incorrecto:** `blog-cta` enlaza a `../index.html`.
  - **Propuesta:** Crear sección CTA:
    ```
    <div class="article-cta">
      <h3>Compara presupuestos de calefacción para tu piso en Bilbao</h3>
      <p>Aerotermia, gas, suelo radiante... usa la calculadora para ver qué sistema cabe en tu presupuesto.</p>
      <a href="../calculadora/index.html">Calcular presupuesto →</a>
    </div>
    ```
- **Añadir enlace interno a:** `aerotermia-bilbao-ventajas.html` (nuevo), `suelo-radiante-ventajas-bilbao.html` (nuevo), `suelo-radiante-vs-calefaccion.html` (nuevo).

---

## Acciones prioritarias (por impacto)

### 🔴 Crítico (enlaces rotos)
1. **Corregir** `suelo-radiante-ventajas.html` → `suelo-radiante-ventajas-bilbao.html` en `cambiar-suelo-bilbao.html`
2. **Corregir** `pintura-bilbao.html` → `pintar-piso-bilbao.html` en `reforma-personas-mayores-bilbao.html`
3. **Eliminar o reemplazar** la autorreferencia `reforma-bano-bilbao.html` → `reforma-bano-bilbao.html` en el sidebar

### 🟠 Alta prioridad (CTAs a index.html — pérdida de conversión)
1. **Corregir CTAs** de 9 artículos que enlazan a `../index.html` en lugar de la calculadora:
   - `licencias-obra-bilbao.html`
   - `materiales-cocina-bilbao.html`
   - `renovar-piso-antiguo-bilbao.html`
   - `tipos-calefaccion-bilbao.html`
   - `reforma-bano-bilbao.html`
   - `reforma-bano-bilbao-2025.html`
   - `reformas-bilbao-guia-2025.html`
   - `aerotermia-bilbao-ventajas.html`
   - `empresas-reformas-bilbao.html`

### 🟡 Media prioridad (artículos sin ningún enlace a calculadora)
2. **Añadir CTAs** a 5 artículos sin ninguna referencia a la calculadora:
   - `empresas-reformas-donostia.html`
   - `reforma-80m2-bilbao-ejemplo.html`
   - `reforma-vs-comprar-bilbao.html`
   - `suelo-radiante-vs-calefaccion.html`
   - `tipos-calefaccion-bilbao.html` (ya en la lista anterior)

### 🟢 Buena práctica (enriquecer linking interno)
3. **Añadir enlaces cruzados temáticos** entre artículos relacionados que actualmente no se enlazan entre sí (propuestas detalladas en cada sección anterior).

---

## Nota sobre calculadoras específicas

No todas las calculadoras existen para cada tipo de reforma. Guía de destinos recomendados:

| Tipo de artículo | Calculadora recomendada |
|---|---|
| Cocina | `../calculadora/cocina-bilbao.html` |
| Baño | `../calculadora/bano-bilbao.html` |
| Pintura | `../calculadora/pintura-bilbao.html` |
| Suelos | `../calculadora/suelo-bilbao.html` |
| Reforma integral / general | `../calculadora/index.html` o `../calculadora/integral-bilbao.html` |
| Aerotermia / Calefacción | `../calculadora/index.html` |
| Donostia (sin calculadora específica) | `../calculadora/index.html` |
