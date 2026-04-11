# REPORTE AGENTE 1 — REVISIÓN DE TEXTOS

**Proyecto:** Bilbao Reforma Calculadora  
**Fecha de revisión:** 11 abril 2026  
**Alcance:** Todos los archivos HTML y JS visibles  
**Tono objetivo:** Cercano, cálido, bilbaino (no corporativo genérico) · Directo y útil · Profesional pero accesible  

---

## ARCHIVOS CON ERRORES CRÍTICOS

### 1. `/sobre-nosotros.html` — TEXTO EN INGLÉS MEZCLADO (CRÍTICO)
**Línea 50:**
> `cuando necesitamos hacer obras en casa, es muy difícil saber si el presupuesto que nos daban era justo o no estaban inflated prices.`
- Error: frase en inglés insertada en medio del español
- **Sugerencia:** `cuando necesitamos hacer obras en casa, es muy difícil saber si el presupuesto que nos daban era justo o si nos estaban cobrando de más.`

**Línea 53:**
> `Así nació nuestra calculadora: un herramienta que permite obtener...`
- Error gramatical: "un**a** herramienta" (femenino)
- **Sugerencia:** `Así nació nuestra calculadora: una herramienta que permite obtener...`

**Línea 53 (continuación):**
> `...un herramienta que permite obtener un presupuesto orientativo en menos de dos minutos, sin registro ni datos personales.`
- Error gramatical: "herramienta" es femenino → debe ser "una herramienta"

---

### 2. `/aviso-legal.html` — RUSA INCORRECTA
**Línea 71:**
> `Todos los contenidos de este sitio web, incluyendo pero no limitado a textos, gráficos, logotipos... están protegidos por derechos de propiedad intelectual принадлежащие a Bilbao Reforma...`
- Error: palabra en ruso "принадлежащие" (pertenecientes) insertada en texto en español
- **Sugerencia:** `Todos los contenidos de este sitio web, incluyendo pero no limitado a textos, gráficos, logotipos, iconos, imágenes, audio y código, están protegidos por derechos de propiedad intelectual de Bilbao Reforma o de sus respectivos propietarios.`

---

### 3. `/aviso-legal.html` — INCONSISTENCIA DE EMAIL
- El aviso legal usa `info@bilbaoreforma.es`
- El resto del sitio (blog, footer, etc.) usa `hola@bilbaoreforma.es`
- **Inconsistencia crítica:** Dos direcciones de correo distintas sin explicación

---

### 4. `/blog/pintar-piso-bilbao.html` — VARIOS ERRORES
**Línea ~150 (revisar):**
> `Protectión de suelos` y `Protectión de marcos` (2 instancias)
- Error: falta la 'c' → debe ser "Protección"
- **Sugerencia:** Reemplazar "Protectión" por "Protección" en todas las instancias

**Línea ~155:**
> `El alisado de gotelé (también llamado "enlucir" o "empelaste")...`
- Error: "empelaste" debería ser "empaste" o "enlucir"
- **Sugerencia:** `El alisado de gotelé (también llamado "enlucir" o "empaste")...`

**Línea ~160:**
> `nocturno` donde debería decir "óptimo"
- Error claro de contexto: "el resultado es **óptimo**" no "nocturno"
- **Sugerencia:** `...pero el resultado es óptimo.`

**Línea ~170:**
> `el amianto` seguido de paréntesis `( fibrocemento)`
- Error: espacio extra antes del paréntesis
- **Sugerencia:** `(fibrocemento)` sin espacio

**Líneas ~220-230:**
> `Pintura decorativa (efecto vela, estuco)` — "vela" parece incorrecto, probablemente debería ser "deco" o no queda claro
- **Sugerencia:** Clarificar qué tipo de efecto decorativo se ofrece o verificar con la empresa si es un servicio real

**Línea ~215:**
> `Encarece si se hace antes` — frase incompleta/confusa
- El texto completo debería explicar por qué pintar al final de la reforma integral encarece si se hace antes
- **Sugerencia:** `Pintura al final de la obra — si se hace antes se estropeará con los trabajos de reforma` o similar

---

### 5. `/blog/subvenciones-reformas-bilbao.html` — VARIOS ERRORES
**Línea ~80:**
> `¿Cuántos años tiene tu edificio?` seguido de "¿Qué tipo de instalaciones tienes (tuberías,**electricidad**,calefacción)?"
- Error: falta espacio tras la coma → debería ser "electricidad**,**calefacción"
- **Sugerencia:** `(tuberías, electricidad, calefacción)`

**Líneas ~120-150:**
> `la plupart de las convocatorias` — galicismo (francés "la plupart")
- Error: "la plupart" no es español, debe ser "la mayoría"
- **Sugerencia:** `La mayoría de las convocatorias...`

---

### 6. `/blog/reformas-casco-viejo-bilbao.html` — VARIOS ERRORES
**Línea ~60:**
> `sus calles empedradas, sus edificios de ladrillo visto, sus balcones de hierro forjado y su ambiente único **attract** a familias`
- Error: "attract" en inglés en lugar de "atrae"
- **Sugerencia:** `...y su ambiente único atrae a familias...`

**Línea ~85:**
> `con edificios que datan de los siglos XVIII, XIX y principios del XX`
- Error: coma tras "XX" → debería ser "XX."
- **Sugerencia:** `...principios del XX.`

**Línea ~125:**
> `Este es el factor que más **surpreend** a quienes no lo han vivido`
- Error tipográfico: "surpreend" en lugar de "sorprende"
- **Sugerencia:** `Este es el factor que más sorprende a quienes no lo han vivido.`

**Línea ~140:**
> `Calles con ancho **Original**`
- Error: mayúscula innecesaria
- **Sugerencia:** `Calles con ancho original`

**Línea ~180:**
> `y **poxi**` → debería ser "epoxi"
- **Sugerencia:** `y resina epoxi`

**Línea ~210:**
> `para **acceder** a los vecinos del Casco Viejo`
- Error: "acceder" debería ser "acercar" en este contexto (acercarte a los vecinos)
- **Sugerencia:** `preséntate, explica el proyecto, ofrece horarios flexibles. Los vecinos del Casco Viejo son tu mejor aliado o tu peor enemigo.`

**Línea ~215:**
> `No **sie** transportan a mano` → debería ser "se"
- **Sugerencia:** `Los escombros se transportan a mano`

**Línea ~220:**
> `**dentro del** datos del Casco Viejo`
- Error: probablemente debería ser "dentro de los datos" o "en los datos"
- **Sugerencia:** `dentro de los datos del Casco Viejo`

---

### 7. `/empresas/vascol-reformas.html` — VARIOS ERRORES
**Línea ~170:**
> `"Markel nos **Asesoro** muy bien"`
- Error: "Asesoró" (con tilde, pretérito indefinido)
- **Sugerencia:** `Markel nos asesoró muy bien...`

**Línea ~200 (reseña de Javier López):**
> `"Tuve **pequeño** problema con el **موعد** de entrega pero lo resolvieron rápidamente."`
- Errores: "pequeño" debería ser "un pequeño" (falta artículo) Y "موعد" es árabe (appointment/plazo)
- **Sugerencia:** `Tuve un pequeño problema con el plazo de entrega...`

**Reseña de Javier López (continuación):**
> `"En general, buena experiencia."` — La puntuación y estructura son incorrectas
- **Sugerencia:** `En general, buena experiencia.` (o mejor: `En general, fue una buena experiencia.`)

---

## TEXTOS EN INGLÉS ENCONTRADOS

| Archivo | Texto en inglés | Sugerencia |
|---------|------------------|------------|
| `sobre-nosotros.html` | "inflated prices" | "cobrando de más" o "precios inflated" |
| `aviso-legal.html` | "принадлежащие" (propiedad intelectual) | "de Bilbao Reforma" |
| `blog/reformas-casco-viejo-bilbao.html` | "attract" | "atrae" |
| `empresas/vascol-reformas.html` | "mo sunrise" (en reseña árabe) | Eliminar o corregir a español |
| `blog/pintar-piso-bilbao.html` | Texto "adsense-sidebar" en CSS | No es visible al usuario, acceptable |
| Varios | "loading" o "submit" en JS | No visible al usuario, acceptable |

---

## ERRORES ORTOGRÁFICOS/GRAMATICALES

### Ortográficos
1. **"protectión"** → "protección" (falta 'c') — `/blog/pintar-piso-bilbao.html` (2 instancias)
2. **"empelaste"** → "empaste" o "enlucir" — `/blog/pintar-piso-bilbao.html`
3. **"nocturno"** → "óptimo" — `/blog/pintar-piso-bilbao.html`
4. **"surpreend"** → "sorprende" — `/blog/reformas-casco-viejo-bilbao.html`
5. **"poxi"** → "epoxi" — `/blog/reformas-casco-viejo-bilbao.html`
6. **"sie"** → "se" — `/blog/reformas-casco-viejo-bilbao.html`
7. **"Asesoro"** → "Asesoró" (falta tilde) — `/empresas/vascol-reformas.html`
8. **"un herramienta"** → "una herramienta" (género) — `/sobre-nosotros.html`

### Gramaticales
1. **"la plupart"** (galicismo) → "la mayoría" — `/blog/subvenciones-reformas-bilbao.html`
2. **"un pequeño problema"** → "un pequeño" (falta artículo) — `/empresas/vascol-reformas.html`
3. **"acceder a los vecinos"** → "acercarte a los vecinos" — `/blog/reformas-casco-viejo-bilbao.html`

---

## INCONSISTENCIAS DE TONO

### 1. Tono MIXTO: Corporativo vs. Cercano
La mayoría del sitio usa un tono relativamente cercano y directo, especialmente en los artículos del blog. Sin embargo:

- **`aviso-legal.html`** y **`politica-privacidad.html`**: Tono 100% legal/corporativo con frases como "En adelante, 'nosotros', 'nos' o 'nuestro' se refiere a Bilbao Reforma." — Suena a documento legal genérico, no bilbaino.

- **`sobre-nosotros.html`**: Intenta ser cercano pero hay errores que rompen la fluidez ("inflated prices").

### 2. EMAIL INCONSISTENTE
- `info@bilbaoreforma.es` aparece en: `aviso-legal.html`, `politica-privacidad.html`, `contacto.html`
- `hola@bilbaoreforma.es` aparece en: `blog/index.html`, `blog/*.html` (footers), `empresas/index.html`, `empresas/vascol-reformas.html`

**Recomendación:** Elegir UNA dirección y usarla en todo el sitio. `hola@bilbaoreforma.es` suena más cercano y se usa en más páginas.

### 3. VARIACIONES DE BOTONES EN FORMULARIO
- `contacto.html`: "Enviar mensaje"
- `empresas/vascol-reformas.html`: "Enviar solicitud"
- **Sugerencia:** Unificar a "Enviar mensaje" o "Enviar consulta" en todos los formularios

### 4. "BILBAINOS" vs "VECINOS" vs "BILBAÍNAS"
- Algunos textos dicen "bilbainos", otros "vecinos", otros "bilbainas"
- **Sugerencia:** Definir una línea editorial. "Bilbainos" es más específico y refuerza la identidad local.

---

## TEXTOS CONFUSOS O MEJORABLES

### 1. `/calculadora/index.html` — Mensaje de error en inglés
**"There was an error calculating. Please try again."** en lugar de "¿Se ha producido un error. Inténtalo de nuevo."
- El usuario ve un mensaje en inglés al fallar la calculadora

### 2. `/blog/pintar-piso-bilbao.html` — "efecto vela"
> `Pintura decorativa (efecto vela, estuco)`
- ¿Qué es "efecto vela"? No queda claro. ¿Efecto decapé? ¿Efecto vela (como de barco)?
- **Sugerencia:** Reemplazar por algo más específico o eliminar

### 3. `/blog/pintar-piso-bilbao.html` — "Encarece si se hace antes"
> `Pintura al final de la obra ( encarece si se hace antes)`
- La frase "encarece si se hace antes" está incompleta/confusa
- **Sugerencia:** `Pintura al final de la obra — si se hace antes se estropeará con los trabajos de reforma`

### 4. `/blog/reformas-casco-viejo-bilbao.html` — "tu mejor allies"
> `Los vecinos del Casco Viejo son tu mejor allies o tu peor enemigo.`
- "allies" debería ser "aliados" (o mejor aún, "aliados" no es la palabra correcta aquí — "amigos" o "aliados" según contexto)
- **Sugerencia:** `Los vecinos del Casco Viejo son tu mejor apoyo o tu peor enemigo.`

### 5. `/empresas/vascol-reformas.html` — Reseña en ARABE/INGLÉS mezclado
> `"Tuve pequeño problema con el موعد de entrega"`
- "موعد" es árabe (plazo/appointment)
- Reseña mezcla español e inglés/árabe → falta de control de calidad

### 6. `/blog/subvenciones-reformas-bilbao.html` — Información desactualizada
Los artículos del blog están fechados "6 abril 2025" pero estamos en 2026. Revisar si los datos de subvenciones aún son válidos o necesitan actualización.

---

## RECOMENDACIONES PRIORITARIAS

### 🔴 PRIORIDAD 1 (Crítico)
**Corregir texto en inglés/incomprensible mezclado en español:**
- `sobre-nosotros.html`: "inflated prices"
- `aviso-legal.html`: "принадлежащие"
- `blog/reformas-casco-viejo-bilbao.html`: "attract", "surpreend"
- `empresas/vascol-reformas.html`: Reseña con "موعد"

### 🟠 PRIORIDAD 2 (Alto)
**Unificar dirección de email:**
- Elegir `hola@bilbaoreforma.es` como dirección oficial
- Cambiar `info@bilbaoreforma.es` en aviso-legal y política-privacidad

**Corregir error gramatical "un herramienta":**
- `sobre-nosotros.html`: "una herramienta"

**Corregir "protectión" → "protección"** en blog de pintura

### 🟡 PRIORIDAD 3 (Medio)
**Revisar tono de aviso-legal y política-privacidad:**
- Hacer más cercano, menos genérico corporativo

**Corregir "la plupart" galicismo:**
- `blog/subvenciones-reformas-bilbao.html`: "la mayoría"

**Corregir errores tipográficos menores:**
- "empelaste" → "empaste"
- "nocturno" → "óptimo"
- "poxi" → "epoxi"
- "Asesoro" → "Asesoró"

### 🟢 PRIORIDAD 4 (Bajo)
**Clarificar "efecto vela"** en artículo de pintura o eliminar si no es un servicio real
**Corregir "Encarece si se hace antes"** frase incompleta
**Revisar fecha de artículos "6 abril 2025"** → potencialmente desactualizado en 2026

---

## RESUMEN

La revisión de textos de **bilbao-reforma-calculadora** revela un site con contenido generalmente bien escrito y útil, pero con varios errores que requieren atención inmediata:

**Problemas más graves:**
- Textos en inglés e idiomas extranjeros (ruso, árabe) insertados en medio de español — esto hace que el contenido parezca descuidado o generado por IA sin supervisión
- Error gramatical "un herramienta" que pasa desapercibido
- Inconsistencia de email entre las páginas legales y el resto del sitio

**Lo que funciona bien:**
- Los artículos del blog son extensos, informativos y bien estructurados
- El tono general de los artículos es apropiado: directo, con datos concretos y útil
- Las tablas de precios y los ejemplos reales son muy valiosos

**Próximo paso recomendado:**
Corregir los errores de Prioridad 1 y 2 (especialmente los textos en otros idiomas mezclados con español) antes de cualquier trabajo de mejora de contenido. Estos errores dan una impresión de falta de atención al detalle que puede socavar la credibilidad del proyecto.
