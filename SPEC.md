# SPEC.md — Calculadora de Presupuestos de Reformas para Bilbao

## 1. Concepto y Visión

**Qué es:** Una herramienta web interactiva que estima presupuestos de reforma de viviendas en Bilbao y Bizkaia, permitiendo a los usuarios obtener un rango de precio orientativo en menos de 2 minutos sin registrar sus datos.

**Propuesta de valor única:** A diferencia de calculadoras genéricas (idealista, Cronoshare) o competidores locales que requieren contacto, esta calculadora es instantáneamente útil para el usuario, con datos de precios locales verificados y un UX que se siente bilbaino — no corporativo.

**Propósito SEO:** Capturar tráfico de búsqueda local ("precio reforma piso Bilbao", "cuánto cuesta reformar cocina Bilbao") y convertirlo en leads para empresas de reforma locales a través de secciones de monetización.

---

## 2. Nichos y Features

### 2.1 Tipos de Reforma Soportados

| Tipo | Descripción | €/m² (rango Bilbao) |
|------|-------------|---------------------|
| **Pintura** | Paredes + techos, 2 manos | 8–15 €/m² |
| **Suelo** | Parqué, vinílico, porcelánico (incluye mano de obra) | 25–80 €/m² |
| **Baño parcial** | Cambio sanitarios + alicatado | 1.300–3.100 €/baño |
| **Baño completo** | Plato ducha, alicatado, fontanería nueva | 5.000–7.000 €/baño |
| **Cocina básica** | Muebles econômicos, encimera laminada | 5.000–6.000 € (8–10 m²) |
| **Cocina media** | Muebles质量media, encimera cuarzo, electrodomésticos Bosch/Balay | 8.000–10.000 € |
| **Cocina premium** | Muebles a medida, Silestone/Dekton, electrodomésticos Gaggenau | 12.000–16.000 € |
| **Reforma básica** | Pintura + suelo + puertas (sin tocar instalaciones) | 200–300 €/m² |
| **Reforma media** | Básica + fontanería + electricidad + baño/cocina | 400–500 €/m² |
| **Reforma integral** | Redistribución + instalaciones + cocina + baños + suelo radiante | 600–800 €/m² |
| **Reforma lujo** | Materiales premium, domótica, piedra natural | 900–1.400 €/m² |

### 2.2 Features Core

1. **Selector de metros cuadrados** — Input numérico o slider (20–200 m²), con presets por tipología (piso 2 dormitorios ~70m², piso 3 dormitorios ~90m², ático ~120m²).

2. **Tipo de reforma** — Seleção visual: Tarjetas con iconos para cada tipo (pintura, suelo, baño, cocina, integral). Multi-selección permitida.

3. **Antigüedad del edificio** — Factor multiplicador importante:
   - Edificio < 20 años (instalaciones modernas)
   - Edificio 20–40 años (renovación parcial instalaciones recomendada)
   - Edificio > 40 años (posible plomb piping, electrics outdated → +15-25% presupuesto)
   - Edificio > 70 años / casco viejo (+20-30% por complejidad)

4. **Nivel de calidad de materiales** — Tres opciones:
   - **Básica**: Leroy Merlin, marca blanca,anchos estándares
   - **Media**: Cosentino (Silestone), Porcelanosa gama media, Roca, Grohe
   - **Premium**: Dekton, Saloni alta gama, Villeroy & Boch, Hansgrohe

5. **Extras opcionales** (checkboxes):
   - Cambio ventanas (PVC, aluminio): +150–300 €/ventana
   - Terraza/balcón: +200–500 €/m²
   - Demolición tabiques: 16–27 €/m²
   - Suelo radiante: +60–90 €/m²
   - Aerotermia: +3.000–6.000 €
   - Domótica básica: +1.500–3.000 €
   - Imprevistos (calculadora muestra 15% por defecto)

6. **Resultado instanténeo** — Muestra:
   - Rango bajo – alto (ej: "24.000 € – 38.000 €")
   - Desglose por partidas
   -同行comparison (m2 vs precio medio Bilbao)
   - CTA: "Descarga tu presupuesto en PDF" o "Recibe 3 presupuestos de empresas locales"

---

## 3. UX/UI — Flujo de Usuario

### 3.1 Flujo Paso a Paso (Wizard de 5–7 pasos)

```
[PASO 1] ¿Qué quieres reformar?
├─ Tarjetas visuales: Pintura | Suelo | Baño | Cocina | Integral
├─ Multi-selección
└─ Botón: "Calcular presupuesto" (habilitado tras selección)

[PASO 2] ¿Cuántos metros tiene tu vivienda?
├─ Input numérico (20–200 m²)
├─ Slider visual
└─ Presets: "Piso 2 hab (~70m²)", "Piso 3 hab (~90m²)", "Ático (~120m²)"

[PASO 3] ¿Qué tipo de edificio?
├─ Radio: < 20 años | 20–40 años | 40–70 años | > 70 años / Casco Viejo
└─ Nota contextual: "Los edificios antiguos pueden necesitar renovation de tuberías y electrics"

[PASO 4] ¿Qué calidad de materiales prefieres?
├─ Tarjetas: Básica | Media | Premium
└─ Incluir breve descripción de cada nivel con marcas ejemplo

[PASO 5] Extras (opcional)
├─ Checkboxes: Ventanas, Terraza, Suelo radiante, Demolición tabiques, Domótica
└─ Mostrar impacto en precio en tiempo real (+X €)

[PASO 6] RESULTADO
├─ Rango de presupuesto (bajo–alto)
├─ Desglose por partidas (gráfico de barras horizontales)
├─ Comparador: "El precio medio en Bilbao para tu reforma es X €/m²"
├─cta: "Descarga PDF" (email req) + "Recibe 3 presupuestos de empresas de Bilbao" (teléfono req)
└─ Micro-CTA: "Ver desglose completo"
```

### 3.2 Diseño de la Página de Resultado

- **Headline**: "Tu reforma en Bilbao cuesta entre **24.000 € y 38.000 €**"
- **Subhead**: "Estimación para un piso de 80m² con reforma media"
- **Gráfico de barras**: Desglose visual por partidas (Cocina: 35%, Baño: 25%, Suelo: 15%, Pintura: 10%, Instalaciones: 10%, Imprevistos: 5%)
- **Tabla**: Partida | Cantidad | €/m² | Total
- **Disclaimer**: "Este presupuesto es orientativo. Solicita presupuestos personalizados a empresas locales."
- **Lead gen**: Formulario simplificado (nombre + teléfono + email opcional)

### 3.3 Principios UX

- **Mobile-first**: 70%+ de usuarios buscarán desde móvil
- **Max 2 campos visibles por paso** — no scroll required
- **Progreso visible**: Barra de progreso en la parte superior (Paso 1/5, 2/5...)
- **Validadores suaves**: Si el usuario no rellena un campo, mostrar el impacto ("Sin indicar metros, mostraremos un promedio de 80m²")
- **Sin registro obligatorio**: Los datos de contacto solo paralead gen opcional
- **Offline-friendly**: El resultado se calcula 100% en cliente (JavaScript)

---

## 4. Diseño Visual

### 4.1 Paleta de Colores

Evitar azul corporativo genérico. Paleta cálida, local, de confianza:

| Rol | Color | Hex | Uso |
|-----|-------|-----|-----|
| **Primario** | Terracota bilbaina | `#C45C3E` | CTAs, headlines, elementos clave |
| **Secundario** | Verde montaña (Euskadi) | `#4A6741` | Acentos, iconos, bordes |
| **Fondo principal** | Crema cálido | `#FAF7F2` | Página principal background |
| **Fondo cards** | Blanco roto | `#FFFFFF` | Cards, inputs |
| **Texto principal** | Grafito | `#2D2D2D` | Cuerpo de texto |
| **Texto secundario** | Gris medio | `#6B6B6B` | Labels, hints |
| **Acento éxito** | Verde txakoli | `#7FA650` | Indicadores positivos, checks |
| **Borde suave** | Beige | `#E8E2D9` | Separadores, bordes de cards |
| **Sombra** | Marrón claro | `rgba(45,30,15,0.08)` | Sombras de cards |

### 4.2 Tipografía

- **Títulos**: `Playfair Display` (serif, elegante, con personalidad local) — fallback: Georgia
- **Cuerpo / UI**: `Inter` (legible, moderna, excelente para números) — fallback: system-ui
- **Números / Precios**: `DM Mono` (monospace para alineación de cifras) — fallback: monospace

**Escala**:
- H1 (resultado): 32–40px, bold
- H2 (secciones): 24px, semibold
- Body: 16px, regular
- Labels: 14px, medium
- Precios grandes: 48px, bold

### 4.3 Estilo Visual

- **Framework**: Tailwind CSS (config custom con colores de arriba)
- **Cards**: Bordes redondeados (12px), sombra suave, fondo blanco
- **Botones CTA**: Terracota con texto blanco, border-radius 8px, transición hover (+5% dark)
- **Inputs**: Borde beige, focus border terracota, label flotante
- **Iconografía**: Lucide Icons (línea, 24px, stroke 1.5)
- **Ilustraciones**: Ninguna — usar fotografías de reformas locales en la página de resultados (Unsplash con query "Bilbao interior" o "vasque kitchen")
- **Decorativos**: Líneas sutiles inspiradas enla arquitectura bilbaina (ladrillo visto, hierro forjado) como separadores gráficos

### 4.4 Responsive

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 640px) | 1 columna, cards stacked, slider principal |
| Tablet (640–1024px) | 2 columnas para cards de tipo de reforma |
| Desktop (> 1024px) | 3 columnas para extras, sidebar con resumen sticky |

---

## 5. SEO Local para Bilbao

### 5.1 Keywords Principales (Long-tail + Local)

**Alto volumen (objetivo):
- "precio reforma piso Bilbao"
- "cuánto cuesta reformar una cocina en Bilbao"
- "reforma integral piso Bilbao precio"
- "reforma baño Bilbao precio"
- "empresas reformas Bilbao"
- "presupuesto reforma Bilbao"

**Long-tail de oportunidad**:
- "precio metro cuadrado reforma Bilbao 2025"
- "cuánto cuesta pintar un piso en Bilbao"
- "reformas integrales Bizkaia precios"
- "reforma cocina abierta Bilbao"
- "reforma piso antiguo Bilbao coste"
- "reforma baño pequeño Bilbao presupuesto"
- "cambiar suelo piso Bilbao precio"
- "reforma integral ático Bilbao"

### 5.2 Estructura SEO

**URLs amigables**:
- `/calculadora-reforma-bilbao` (página principal)
- `/calculadora/cocina-bilbao`
- `/calculadora/bano-bilbao`
- `/calculadora/pintura-bilbao`
- `/calculadora/integral-bilbao`
- `/presupuesto/reforma-piso-bilbao-80m2` (página de resultado, dinamica)

**Meta titles**:
- "Calculadora de Reforma en Bilbao 2025 — Precio Instantáneo"
- "Precio Reforma Cocina Bilbao 2025: Calcula en 2 Minutos"
- "Cuánto Cuesta Reformar un Piso en Bilbao? — Estimador Gratis"

**Meta descriptions**:
- "Calcula al instante el presupuesto de tu reforma en Bilbao. Precios por m² actualizados 2025 para pintura, suelo, baño, cocina y reforma integral. Sin registro."

### 5.3 Blog — Artículos SEO Necesarios

| # | Título | Keyword objetivo | Objetivo |
|---|--------|------------------|----------|
| 1 | "Precio reforma integral Bilbao 2025: Guía completa con €/m²" | "reforma integral Bilbao precio" | Pillar keywords informacionales, nutrir leads |
| 2 | "Cuánto cuesta reformar una cocina en Bilbao en 2025" | "reforma cocina Bilbao precio" | Top-funnel cocina |
| 3 | "Reforma de baño en Bilbao: presupuestos y consejos" | "reforma baño Bilbao" | Baño |
| 4 | "Pintar un piso en Bilbao: precios por m² 2025" | "pintar piso Bilbao precio" | Pintura |
| 5 | "Cambiar suelo en Bilbao: parqué vs porcelánico vs vinílico" | "cambiar suelo Bilbao" | Suelo |
| 6 | "Reformas en el Casco Viejo de Bilbao: particularidades y precios" | "reforma casco viejo Bilbao" | Nicho específico + oportunidad link-building |
| 7 | "Subvenciones y ayudas para reformas en Bilbao 2025" | "subvenciones reforma Bilbao" | Atracción + autoridad + leads cualificados |
| 8 | "Empresas de reformas en Bilbao: cómo elegir la mejor" | "empresas reformas Bilbao" | Lead gen para monetización |
| 9 | "Reforma piso 80m2 Bilbao: ejemplo real con presupuesto" | "reforma piso 80m2 Bilbao" | Caso de uso + long-tail |
| 10 | "Reforma vs comprar piso nuevo en Bilbao: qué sale más a cuenta" | "reformar piso Bilbao vs comprar" | Comparativa, alto volumen |

### 5.4 Schema Markup

- **LocalBusiness**: `location: Bilbao, Bizkaia`, `areaServed: Bilbao`
- **FAQPage**: Para las páginas de blog, marcar preguntas frecuentes con schema
- **PriceSpecification**: En páginas de servicio, marcar rangos de precio por tipo de reforma
- **AggregateRating**: En páginas de empresas (para monetización), si hay reviews

### 5.5 Google My Business

Crear GMB categoría "Contratista de reformas" + "Tienda de materiales de construcción" para aparecer en mapas cuando usuarios busquen "reformas Bilbao" o "tienda materiales Bilbao".

---

## 6. Monetización Local

### 6.1 Modelo de Ingresos

**Primario**: Afiliación + Lead generation (empresas de reforma)
**Secundario**: Afiliación a tiendas de materiales (comisiones por venta)

### 6.2 Empresas de Reformas Locales (Objetivos de Monetización)

Empresas bilbainas que aparecerían en la sección "Empresas recomendadas" tras el resultado de la calculadora:

| Empresa | Tipo | Web | ¿Por qué pagar? |
|---------|------|-----|-----------------|
| **Vascol Reformas** | Integral | vascol.eus | Ya tiene calculadora — sabe el valor. Quiere ser opción destacada |
| **RB Interiores** | Integral | reformas-bilbao.com | Presencia fuerte en SEO local |
| **Eraber** | Integral + interiorismo | eraber.com | Gama alta — cliente de la calculadora premium |
| **Reformas Bilbao Proyectos** | Integral | reformasbilbao.pro | 15+ años, muy posicionados |
| **BDBN Reformas** | Integral | bdbnreformas.com | Contenido SEO activo |
| **Bigoi Construcciones** | Locales + integrales | bigoiconstrucciones.com | Nicho commerciale |
| **TM Reformas** | Integral | (encontrada via tiendamanilla.com) | — |

### 6.3 Tiendas de Materiales de Construcción

| Tienda | Qué venden | ¿Afiliación potencial? | Notas |
|--------|------------|----------------------|-------|
| **Leroy Merlin Bilbao** (Barakaldo) | Todo | Sí (programa afil. propio) | Gran distribucion, 2 tiendas cerca |
| **JICASA** (Bilbao) | Baño, cocina, materiales | Posible acuerdo B2B directo | Distribuidor local, marca blanca |
| **Cocinas OB** (zona Gipuzkoa, pero envío BIlbao) | Cocinas a medida | Sí, comisión por venta derivada | Popular en País Vasco |
| **Porcelanosa Bilbao** | Pavimento, revestimiento, baño | Sí (programa afil. o acordo directo) | Gama alta |
| **Silestone/Cosentino** (showroom Bilbao) | Encimeras | Posible acordo de contenido patrocinado | Marca premium, alto-ticket |
| **Martin Rodriguez** (Bilbao) | Materiales construcción, cerámica, baño | Acordo local | 30+ años, almacenje cerca |
| **Ferretería Leku** (Bilbao) | Ferretería, herramientas | Patrocinio contenido "herramientas para tu reforma" | Tienda local, comunidad |

### 6.4 Formatos de Monetización

1. **Listas de empresas destacadas**: "Top 3 empresas de reforma en Bilbao" —展位 destacada (150–300 €/mes por empresa)
2. **Sidebar de "Proveedores recomendados"**: Links a tiendas con parámetros de afiliación ( Leroy Merlin, Cosentino)
3. **Content partnerships**: Artículos patrocinados en el blog (cosentino sobre encimeras, Roca sobre baños) — 300–800 €/artículo
4. **Lead qualification**: Formulario post-calculadora → datos a empresas (5–15 € por lead cualificado)
5. **PDF descargable con presupuesto**: Requiere email — nurturing por email para affiliates

---

## 7. Datos de Precios — Tabla de Referencia Completa

### 7.1 €/m² por Tipo de Reforma (Bilbao 2025)

| Tipo | Calidad Básica | Calidad Media | Calidad Premium |
|------|---------------|--------------|----------------|
| Reforma básica (pintura + suelo + puertas) | 200–250 €/m² | 250–300 €/m² | 300+ €/m² |
| Reforma media (básica + fontanería + electrics) | 350–400 €/m² | 400–500 €/m² | 500–600 €/m² |
| Reforma integral | 500–600 €/m² | 600–800 €/m² | 800–1.400 €/m² |

### 7.2 Precios por Estancia (Ejemplos para 80m²)

| Estancia | Básico | Medio | Premium |
|----------|--------|-------|---------|
| **Pintura** (paredes + techo, 2 manos) | 8–10 €/m² | 10–12 €/m² | 12–15 €/m² |
| **Suelo parquet flotante** (material + colocación) | 25–35 €/m² | 35–50 €/m² | 50–80 €/m² |
| **Suelo porcelánico** (material + colocación) | 30–45 €/m² | 45–65 €/m² | 65–100 €/m² |
| **Suelo vinílico** (material + colocación) | 20–30 €/m² | 30–40 €/m² | 40–55 €/m² |
| **Baño** (completo, 5–6 m²) | 3.000–5.000 € | 5.000–7.000 € | 7.000–12.000 € |
| **Cocina** (8–10 m²) | 5.000–6.000 € | 8.000–10.000 € | 12.000–16.000 € |
| **Demolición tabiques** | 16–27 €/m² | — | — |
| **Desescombro** | 200–1.500 € (fijo) | — | — |
| **Instalación eléctrica** (piso 70m²) | 1.500–2.500 € | 2.500–4.000 € | 4.000+ € |
| **Fontanería nueva** (completa) | 1.200–2.000 € | 2.000–3.500 € | 3.500+ € |
| **Ventanas PVC** (por unidad, 2 hojas) | 150–200 €/ud | 200–300 €/ud | 300–500 €/ud |
| **Puertas interiores** (abatibles, incl. colocación) | 80–150 €/ud | 150–250 €/ud | 250–400 €/ud |
| **Suelo radiante** (material + instalación) | 60–80 €/m² | 80–100 €/m² | 100–130 €/m² |
| **Aerotermia** (equipo + instalación) | 3.000–4.500 € | 4.500–6.000 € | 6.000–9.000 € |
| **Domótica básica** | 1.000–1.500 € | 1.500–3.000 € | 3.000+ € |

### 7.3 Factores que Modifican el Precio en Bilbao

| Factor | Impacto |
|--------|---------|
| **Antigüedad edificio > 40 años** | +15–25% (tuberías plomo/hierro, electrics obsoletos) |
| **Casco Viejo / Casco Antiguo** | +20–30% (materials más caros acceso, licencia especial) |
| **Edificio con rima significance histórica** | +10–20% (restricciones patrimonio) |
| **Acceso difícil** (sin ascensor, 4+ piso) | +5–15% |
| **Necesidad de habitabilidad durante obra** | +10–15% (logística) |
| **Cambio de distribución (derribo tabiques)** | +8–15% según m² |
| **Calefacción actual gasoil → gas natural** | +2.000–4.000 € adicional |

### 7.4 Licencias y Tasas (Bilbao)

| Concepto | Coste |
|----------|-------|
| Comunicación previa (obra menor) | Gratis |
| Licencia obra menor (procedimiento abreviado) | ~100–300 € |
| Licencia obra menor (procedimiento ordinario) | ~300–600 € |
| Licencia obra mayor | ~1.000–3.000 €+ |
| IVA (obra > 2 años antigüedad) | 10% |
| Imprevistos (recomendado) | 15% del total |

---

## 8. stack Técnico Recomendado

| Capa | Tecnología |
|------|------------|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS + TypeScript |
| **Calculadora** | React + Zustand (estado de wizard) |
| **Estilo** | Tailwind config custom con paleta bilbaina |
| **Formularios** | React Hook Form + Zod (validación) |
| **PDF** | @react-pdf/renderer (generación presupuesto) |
| **SEO** | next-seo + schemas dinámicos |
| **Analytics** | Google Analytics 4 + Search Console |
| **Hosting** | Vercel (edge, rápido para SEO local) |
| **Email marketing** | Mailchimp o Brevo (nurturing leads) |
| **Maps** | Google Maps Embed API (sección empresas) |

---

## 9. Competidores Existentes — Análisis

| Competidor | Fortalezas | Debilidades | Diferenciador nuestro |
|------------|-----------|-------------|----------------------|
| **Vascol calculadora** | Detallada, paso a paso,本地 | Requiere email para ver resultado, no mobile-first | Resultado instantáneo, mobile-first |
| **idealista/reformas** | Gran marca, alto tráfico | Genérica, no local Bilbao, UX lenta | Datos locales, UX moderna |
| **Cronoshare Bilbao** |-many empresas, Reviews | Genérico, cálculo complejo | Calculadora simple, contenido local |
| **Caasa** | Detallada | Sin optimización SEO local | SEO local + blog |
| **PlanReforma** |-many empresas | Muy genérico,spam feel | Identidad local fuerte |

---

## 10. Próximos Pasos (Roadmap)

1. **Fase 1**: Prototipo HTML/CSS con calculadora funcional (2–3 días)
2. **Fase 2**: Integrar datos de precios reales, validar con 3 empresas locales (3–4 días)
3. **Fase 3**: Blog con 5 artículos SEO prioritarios (1 semana)
4. **Fase 4**: Sistema de lead gen + onboarding 2–3 empresas piloto (1 semana)
5. **Fase 5**: Analytics, iterate, scale

---

*Documento preparado para servir como spec de desarrollo. Todos los precios son orientativos basados en datos públicos de 2024-2025 y deben validarse con empresas locales antes del lanzamiento.*
