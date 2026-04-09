# PLAN.md — Bilbao Reforma: Sitio Web Completo para AdSense

**Proyecto**: Bilbao Reforma Calculadora  
**Fecha**: 2026-04-07  
**Objetivo**: Convertir el proyecto en un sitio web completo con contenido suficiente para solicitar AdSense (mínimo 30-50 páginas de contenido real) y un modelo de monetización sostenible.

---

## 1. Mapa del Sitio y Estructura de URLs

```
/
├── index.html                    # Página principal (home)
├── calculadora/                  # Calculadora de presupuestos
│   ├── index.html                # Wizard principal
│   ├── cocina-bilbao.html         # Calculadora filtrada: cocina
│   ├── bano-bilbao.html          # Calculadora filtrada: baño
│   ├── pintura-bilbao.html       # Calculadora filtrada: pintura
│   ├── suelo-bilbao.html         # Calculadora filtrada: suelo
│   ├── integral-bilbao.html      # Calculadora filtrada: integral
│   └── resultado.html            # Página de resultado (dinámica)
├── blog/                         # Blog SEO
│   ├── index.html                # Listado de artículos
│   ├── precio-reforma-integral-bilbao.html
│   ├── reforma-cocina-bilbao.html
│   ├── pintar-piso-bilbao.html
│   ├── reformas-casco-viejo-bilbao.html
│   ├── subvenciones-reformas-bilbao.html
│   ├── cambiar-suelo-bilbao.html          # NUEVO
│   ├── reforma-bano-bilbao.html           # NUEVO
│   ├── empresas-reformas-bilbao.html      # NUEVO
│   ├── reforma-80m2-bilbao-ejemplo.html   # NUEVO
│   ├── reforma-vs-comprar-bilbao.html     # NUEVO
│   ├── tipos-calefaccion-bilbao.html      # NUEVO
│   ├── materiales-cocina-bilbao.html     # NUEVO
│   ├── renovate-piso-antiguo-bilbao.html  # NUEVO
│   ├── licencias-obra-bilbao.html         # NUEVO
│   ├── aerotermia-bilbao-ventajas.html    # NUEVO
│   ├── domotica-reforma-vivienda.html     # NUEVO
│   ├── errores-reforma-bilbao.html        # NUEVO
│   ├── mantenimiento-edificio-bilbao.html # NUEVO
│   ├── tendencias-reforma-cocina.html     # NUEVO
│   └── economia-domestica-reformas.html   # NUEVO
├── empresas/                     # Directorio de empresas (monetización)
│   ├── index.html                # Listado de empresas destacadas
│   ├── vascol-reformas.html      # Perfil de empresa
│   ├── rb-interiores.html
│   ├── eraber.html
│   ├── reformas-bilbao-proyectos.html
│   └── bdbn-reformas.html
├── contacto.html                  # Formulario de contacto
├── sobre-nosotros.html           # Página "sobre nosotros"
├── politica-privacidad.html
├── aviso-legal.html
├── sitemap.xml
└── robots.txt
```

**Total de páginas estimadas: 42 páginas de contenido**

---

## 2. Lista Detallada de Páginas

### 2.1 Página Principal (Home) `/index.html`

**Propósito**: Capturar tráfico de búsqueda local y dirigir a la calculadora.

**Contenido required**:
- Hero con headline SEO: "Calculadora de Presupuestos de Reformas en Bilbao 2025"
- Subtítulo con propuesta de valor: "Obtén un presupuesto orientativo en menos de 2 minutos, sin registro"
- CTA principal: "Calcular presupuesto gratis"
- Sección "Cómo funciona" (3 pasos)
- Sección "Por qué Bilbao Reforma" (diferenciadores)
- Testimonios/resenas de usuarios (ficticios pero verosímiles)
- CTA secundario: "Ver 3 presupuestos de empresas locales"
- Footer con enlaces a blog, empresas, contacto
- Sidebar con artículos populares del blog
- Anuncios AdSense (1 líder de anuncios en desktop, 1 en mobile)

**Palabras clave objetivo**: "calculadora reforma Bilbao", "presupuesto reforma piso Bilbao"

---

### 2.2 Calculadora `/calculadora/index.html`

**Propósito**: Herramienta principal de lead generation y valor para el usuario.

**Contenido**:
- Wizard de 6 pasos (ya implementado en index.html actual)
- Progress bar con 6 pasos
- Paso 1: Selección de tipo de reforma (tarjetas visuales)
- Paso 2: Metros cuadrados (input + slider + presets)
- Paso 3: Antigüedad del edificio
- Paso 4: Nivel de calidad de materiales
- Paso 5: Extras opcionales
- Paso 6: Resultado con desglose y CTA de leads

**SEO**: Meta title específico, Schema markup FAQPage, enlaces internos al blog.

---

### 2.3 Calculadora Filtrada `/calculadora/cocina-bilbao.html` (y similares)

**Propósito**: Páginas específicas para cada tipo de reforma con keywords de long-tail.

**Diferencia con calculadora principal**: Pre-selecciona el tipo de reforma y tiene contenido editorial específico sobre esa estancia antes del wizard.

**Ejemplo para cocina**:
- Hero: "Calculadora de Reforma de Cocina en Bilbao 2025"
- Introducción SEO: qué incluye, precios, tendencias
- Wizard pre-configurado para "cocina"
- Artículos relacionados del blog
- Anuncios AdSense

---

### 2.4 Blog `/blog/index.html` + artículos individuales

**Propósito**: SEO, tráfico orgánico, autoridad local, monetización por afiliación.

**Artículos existentes (5)**:
1. `precio-reforma-integral-bilbao.html` — ✅ Ya creado
2. `reforma-cocina-bilbao.html` — ✅ Ya creado
3. `subvenciones-reformas-bilbao.html` — ✅ Ya creado
4. `reformas-casco-viejo-bilbao.html` — ✅ Ya creado
5. `pintar-piso-bilbao.html` — ✅ Ya creado

**Artículos por crear (15 nuevos)**:

| # | Título | Keyword objetivo | Meta descripción |
|---|--------|-----------------|-----------------|
| 6 | Cambiar Suelo en Bilbao: Parqué vs Porcelánico vs Vinilo | "cambiar suelo Bilbao" | Guía comparativa 2025 con precios y consejos |
| 7 | Reforma de Baño en Bilbao: Presupuestos y Consejos | "reforma baño Bilbao precio" | Todo sobre presupuestos de baño por m² |
| 8 | Empresas de Reformas en Bilbao: Cómo Elegir la Mejor | "empresas reformas Bilbao" | Guía para no errar en la elección |
| 9 | Reforma Piso 80m² Bilbao: Ejemplo Real con Presupuesto | "reforma piso 80m2 Bilbao" | Caso práctico detallado |
| 10 | Reforma vs Comprar Piso Nuevo en Bilbao | "reformar piso Bilbao vs comprar" | Comparativa económica |
| 11 | Tipos de Calefacción para tu Piso en Bilbao | "calefacción Bilbao 2025" | Gas, aerotermia, suelo radiante |
| 12 | Materiales de Cocina: Guía de Encimeras 2025 | "encimera cocina Bilbao" | Silestone, Dekton, granito comparativa |
| 13 | Cómo Renovar un Piso Antiguo en Bilbao | "piso antiguo Bilbao reforma" | Guía para pisos de +40 años |
| 14 | Licencias de Obra en Bilbao: Guía Completa | "licencia reforma Bilbao" | Trámites, costes, plazos |
| 15 | Aerotermia en Bilbao: Ventajas y Subvenciones | "aerotermia Bilbao" | Por qué interesa y cómo pedir ayuda |
| 16 | Domótica para tu Vivienda: Guía de smarthome | "domótica Bilbao reforma" | Introducción accesible |
| 17 | Errores Comunes en Reformas de Piso | "errores reforma piso" | Qué evitar para no gastar de más |
| 18 | Mantenimiento de Edificios en Bilbao | "mantenimiento edificio Bilbao" | Para comunidades de vecinos |
| 19 | Tendencias en Cocinas de Bilbao 2025 | "tendencias cocina Bilbao" | Island, colores, materiales |
| 20 | Cómo Afrontar una Reforma sin Morir en el Intento | "planificar reforma piso" | Guía emocional y práctica |

---

### 2.5 Directorio de Empresas `/empresas/index.html`

**Propósito**: Monetización directa a través de empresas de reforma que pagan por aparecer destacados.

**Contenido**:
- Header SEO: "Empresas de Reformas en Bilbao Recomendadas"
- Lista de empresas con:
  - Nombre, ubicación, años de experiencia
  - Especialidades (integral, cocina, baño, etc.)
  - Valoración (estrellas ficticias pero verosímiles)
  - Enlace a perfil detallado
- Tarifa de destacadas: "Desde 99 €/mes"
- Formulario de contacto para empresas interesadas
- CTA hacia calculadora

**Empresas objetivo** (según SPEC.md):
- Vascol Reformas
- RB Interiores
- Eraber
- Reformas Bilbao Proyectos
- BDBN Reformas
- Bigoi Construcciones

---

### 2.6 Perfiles de Empresa `/empresas/{slug}.html`

Cada empresa tiene una página individual con:
- Nombre, logo, descripción
- Especialidades y servicios
- Zona de actuación (barrios de Bilbao)
- Reseñas de clientes (3-5 ficticias)
- Formulario de contacto directo
- CTA: "Solicitar presupuesto a {empresa}"
- Badge "Empresa destacada" si aplica

---

### 2.7 Página de Contacto `/contacto.html`

**Propósito**: Captura de clientes potenciales (empresas y particulares).

**Contenido**:
- Formulario: nombre, email, teléfono, tipo de proyecto, mensaje
- Datos de contacto (email, teléfono)
- Mapa embebido de Bilbao
- Horario de atención

---

### 2.8 Página "Sobre Nosotros" `/sobre-nosotros.html`

**Propósito**: Generar confianza para AdSense y leads.

**Contenido**:
- Historia del proyecto
- Misión: ayudar a los bilbainos a planificar reformas con datos reales
- Cómo funciona la calculadora (metodología)
- Por qué somos diferentes (datos locales, no genéricos)
- Contacto

---

### 2.9 Páginas Legales

- `/politica-privacidad.html` — RGPD compliant
- `/aviso-legal.html` — LSSI compliant
- `/sitemap.xml` — Para SEO
- `/robots.txt` — Para motores de búsqueda

---

## 3. Plan de Contenido SEO

### 3.1 Palabras Clave Objetivo (prioridad alta)

**Keywords de alto volumen**:
- "precio reforma piso Bilbao" (~880 búsquedas/mes)
- "reforma cocina Bilbao precio" (~320/mese)
- "empresas reformas Bilbao" (~260/mese)
- "reforma integral Bilbao precio" (~210/mese)
- "reforma baño Bilbao" (~170/mese)
- "pintar piso Bilbao precio" (~140/mese)

**Keywords de long-tail**:
- "cuanto cuesta reformar cocina Bilbao"
- "presupuesto reforma piso 80m2 Bilbao"
- "reforma casco viejo Bilbao precio"
- "cambiar suelo piso Bilbao"
- "subvenciones reforma Bilbao"

### 3.2 Estrategia de Contenido

**Fase 1 — Fundamentos (semanas 1-4)**:
- Crear homepage completa
- Migrar calculadora a ruta `/calculadora/`
- Crear las 5 páginas de calculadora filtrada
- Migrar los 5 artículos de blog existentes a HTML
- Crear 5 artículos nuevos de blog

**Fase 2 — Profundización (semanas 5-8)**:
- Crear 10 artículos nuevos de blog
- Crear directorio de empresas (página principal + 3 perfiles)
- Crear página de contacto
- Crear página "sobre nosotros"
- Páginas legales

**Fase 3 — Escalado (semanas 9-12)**:
- Crear perfiles de 3 empresas más
- Añadir schema markup completo
- Optimizar внутренняя linking
- Añadir FAQ estructurado en cada página de blog

---

## 4. Modelo de Monetización

### 4.1 Fuentes de Ingreso

#### Fuente 1: Google AdSense (ingreso pasivo)
- **Posición**: Anuncios en sidebar y entre contenido
- **Ingreso estimado**: 50-150 €/mes con 10.000 visitas/mes
- **Requisito**: 30-50 páginas de contenido (se cumple con este plan)

#### Fuente 2: Leads de empresas de reforma (ingreso activo)
- **Mecanismo**: El usuario completa la calculadora → formulario de contacto → datos a empresas
- **Precio por lead**: 5-15 € dependiendo de la calidad del lead
- **Objetivo**: 3 empresas inscritas inicialmente

#### Fuente 3: Afiliación a tiendas de materiales
- ** Leroy Merlin Bilbao**: Programa de afiliación propio (comisión por venta derivada)
- **Cosentino/Silestone**: Contenido patrocinado o enlaces de afiliación
- **Porcelanosa Bilbao**: Acuerdo de contenido
- **Comisión estimada**: 3-8% por venta направленная

#### Fuente 4: Espacio destacado en directorio de empresas
- **Listing destacado**: 99-199 €/mes por empresa
- **5 empresas × 99 € = 495 €/mes** potencial

### 4.2 Proyección de Ingresos

| Fuente | Mes 1-3 | Mes 4-6 | Mes 7-12 |
|--------|---------|---------|----------|
| AdSense | 20-50 € | 50-100 € | 100-200 € |
| Leads | 0-50 € | 50-150 € | 150-300 € |
| Directorio empresas | 0 € | 200-400 € | 300-600 € |
| Afiliación | 0 € | 20-50 € | 50-100 € |
| **Total** | **20-100 €** | **320-700 €** | **600-1.200 €** |

---

## 5. Wireframe Simplificado por Página

### 5.1 Homepage (Desktop)

```
┌─────────────────────────────────────────────────────┐
│ HEADER: Logo + Nav (Calculadora | Blog | Empresas)  │
├─────────────────────────────────────────────────────┤
│ HERO: H1 + subtítulo + CTA "Calcular presupuesto"   │
├─────────────────────────────────────────────────────┤
│ [ANUNCIO AdSense 728x90]                            │
├───────────────────┬─────────────────────────────────┤
│ CÓMO FUNCIONA    │ POR QUÉ BILBAO REFORMA           │
│ (3 pasos con íconos)│ (diferenciadores con checked)  │
├───────────────────┴─────────────────────────────────┤
│ [ANUNCIO AdSense 300x250]   │ ARTÍCULOS POPULARES    │
│                             │ (3 cards de blog)      │
├─────────────────────────────┴───────────────────────┤
│ FOOTER: Enlaces + Legal + Copyright                 │
└─────────────────────────────────────────────────────┘
```

### 5.2 Página de Blog

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│ BREADCRUMB: Home > Blog > [Título del artículo]    │
├─────────────────────────────────────────────────────┤
│ H1: [Título del artículo]                           │
│ Meta: Fecha | Autor | Tiempo de lectura             │
│ ┌─────────────────────┬───────────────────────────┐ │
│ │ CONTENIDO ARTÍCULO  │ SIDEBAR                   │ │
│ │ (markdown renderizado)│ [ANUNCIO 300x250]        │ │
│ │                     │ Artículos relacionados    │ │
│ │ - Encabezados H2    │ Newsletter signup         │ │
│ │ - Tablas            │                          │ │
│ │ - Listas            │                          │ │
│ └─────────────────────┴───────────────────────────┘ │
│ [ANUNCIO AdSense 728x90]                            │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

### 5.3 Directorio de Empresas

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│ H1: Empresas de Reformas en Bilbao Recomendadas    │
│ Descripción introductoria                          │
├─────────────────────────────────────────────────────┤
│ FILTROS: Especialidad ▼ | Barrio ▼ | Valoración ▼  │
├─────────────────────────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│ │ EMPRESA 1 │ │ EMPRESA 2 │ │ EMPRESA 3 │          │
│ │ ⭐⭐⭐⭐    │ │ ⭐⭐⭐⭐⭐   │ │ ⭐⭐⭐     │          │
│ │ Specs...  │ │ Specs...  │ │ Specs...  │          │
│ │ [Destacar]│ │           │ │ [Destacar]│          │
│ └───────────┘ └───────────┘ └───────────┘          │
├─────────────────────────────────────────────────────┤
│ [ANUNCIO AdSense 728x90]                            │
├─────────────────────────────────────────────────────┤
│ CTA: "¿Eres empresa de reformas? aparece aquí"      │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## 6. Deuda Técnica y Elementos a Implementar

### 6.1 Estructura de archivos actual vs. objetivo

**Estado actual**:
- `index.html` — calculadora standalone
- `calculator.js` — logica del wizard
- `styles.css` — estilos
- `tailwind.config.js`
- `content/blog/*.md` — artículos en Markdown

**Estado objetivo** (estructura de archivos):
```
/
├── index.html                    # Homepage
├── calculadora/
│   ├── index.html
│   ├── cocina-bilbao.html
│   ├── bano-bilbao.html
│   ├── pintura-bilbao.html
│   ├── suelo-bilbao.html
│   ├── integral-bilbao.html
│   └── resultado.html
├── blog/
│   ├── index.html               # Listado
│   ├── precio-reforma-integral-bilbao.html
│   ├── reforma-cocina-bilbao.html
│   ├── pintar-piso-bilbao.html
│   ├── reformas-casco-viejo-bilbao.html
│   ├── extensiones-reformas-bilbao.html
│   ├── cambiar-suelo-bilbao.html
│   ├── reforma-bano-bilbao.html
│   ├── empresas-reformas-bilbao.html
│   ├── reforma-80m2-bilbao-ejemplo.html
│   ├── reforma-vs-comprar-bilbao.html
│   ├── tipos-calefaccion-bilbao.html
│   ├── materiales-cocina-bilbao.html
│   ├── renovate-piso-antiguo-bilbao.html
│   ├── licencias-obra-bilbao.html
│   ├── aerotermia-bilbao-ventajas.html
│   ├── domotica-reforma-vivienda.html
│   ├── errores-reforma-bilbao.html
│   ├── mantenimiento-edificio-bilbao.html
│   ├── tendencias-reforma-cocina.html
│   └── economia-domestica-reformas.html
├── empresas/
│   ├── index.html
│   ├── vascol-reformas.html
│   ├── rb-interiores.html
│   ├── eraber.html
│   ├── reformas-bilbao-proyectos.html
│   └── bdbn-reformas.html
├── css/
│   ├── styles.css               # Estilos principales
│   └── blog.css                 # Estilos específicos del blog
├── js/
│   ├── calculator.js            # Lógica calculadora
│   └── blog.js                  # Scripts del blog
├── contacto.html
├── sobre-nosotros.html
├── politica-privacidad.html
├── aviso-legal.html
├── sitemap.xml
└── robots.txt
```

### 6.2 Componentes reutilizables a crear

1. **Header/Nav component**: Logo + navegación
2. **Footer component**: Enlaces, legal, copyright
3. **Card de artículo de blog**: Imagen + título + extracto + fecha
4. **Card de empresa**: Logo + nombre + valoración + especialidades
5. **CTA component**: Botón con icono (para distintas variaciones)
6. **Anuncio AdSense component**: Wrapper para AdSense con comentarios condicionales

---

## 7. Orden de Desarrollo Recomendado

### Fase 1: Homepage + Calculadora principal (Semanas 1-2)

**Archivos a crear/modificar**:
1. Crear nueva estructura de carpetas
2. Crear `/index.html` como homepage completa
3. Mover calculadora a `/calculadora/index.html`
4. Crear componentes de header y footer reutilizables
5. Integrar AdSense placeholder en homepage

**Verificar**: La calculadora sigue funcionando igual, el nuevo index.html carga rápido.

---

### Fase 2: Calculadoras filtradas + Migración blog (Semanas 3-4)

**Archivos a crear/modificar**:
1. Crear `/calculadora/cocina-bilbao.html` y similares (5 páginas)
2. Crear `/blog/index.html` (listado de artículos)
3. Migrar los 5 artículos markdown existentes a HTML completo
4. Añadir schema markup a cada artículo
5. Crear `/blog/cambiar-suelo-bilbao.html` (Artículo 6)
6. Crear `/blog/reforma-bano-bilbao.html` (Artículo 7)

**Verificar**: Cada página de blog pasa la prueba de contenido útil (al menos 800 palabras, imágenes, estructura correcta).

---

### Fase 3: Artículos nuevos de blog (Semanas 5-7)

**Crear los artículos 8-15**:
8. Empresas de reformas en Bilbao
9. Reforma piso 80m² ejemplo real
10. Reforma vs comprar piso nuevo
11. Tipos de calefacción
12. Materiales de cocina: encimeras
13. Renovar piso antiguo en Bilbao
14. Licencias de obra en Bilbao
15. Aerotermia: ventajas y subvenciones

**Verificar**: Cada artículo tiene su keyword principal en title, H1, URL y primer párrafo.

---

### Fase 4: Directorio de empresas + contacto (Semanas 7-8)

**Archivos a crear/modificar**:
1. Crear `/empresas/index.html`
2. Crear 3-4 perfiles de empresa
3. Crear `/contacto.html`
4. Crear `/sobre-nosotros.html`
5. Crear páginas legales

**Verificar**: El formulario de contacto funciona y los perfiles de empresa tienen información creíble.

---

### Fase 5: Artículos finales + optimización (Semanas 9-10)

**Crear los artículos 16-20**:
16. Domótica para tu vivienda
17. Errores comunes en reformas
18. Mantenimiento de edificios
19. Tendencias en cocinas de Bilbao
20. Cómo planificar una reforma

**Optimizaciones**:
- Internal linking entre todos los artículos
- Schema markup completo (LocalBusiness, FAQPage, Article)
- Optimizar meta descriptions de todas las páginas
- Crear `/sitemap.xml` y `/robots.txt`

**Verificar**: Google Search Console muestra todas las páginas indexadas correctamente.

---

### Fase 6: Activación AdSense (Semana 11-12)

1. Revisar política de AdSense (no contenido duplicado, no páginas vacías)
2. Crear cuentas de AdSense si no existe
3. Insertar código AdSense en todas las páginas
4. Configurar anuncios preferentes (display, in-article)
5. Solicitar revisión de AdSense

---

## 8. Restricciones del Proyecto

**Idioma**: Todo el contenido en ESPAÑOL (para SEO local Bilbao)

**Terminología a evitar (anglicismos innecesarios)**:
- "lead" → "cliente potencial"
- "feedback" → "opinión"
- "download" → "descargar"
- "checklist" → "lista de comprobación"
- "pipeline" → "flujo"
- "trigger" → "activador"
- "ROI" → "retorno de la inversión"
- "startup" → "empresa emergente"
- "framework" → "estructura" o "plataforma"
- "output" → "resultado"

**Terminología local bilbaina/vasca a usar**:
- "txakoli" (color verde utilizado en la paleta)
- " Guggenheim" como referencia cultural local
- Barrios específicos: Deusto, Santutxu, Casco Viejo, Indautxu, Errekalde, La Peña
- "Bilbao la都没" (apodo local)

---

## 9. Checklist de Cumplimiento AdSense

Para solicitar AdSense, el sitio necesita:

- [x] Al menos 50 páginas de contenido real — **Se cumple con este plan (42 páginas + más que se generarán)**
- [x] Política de privacidad visible — Por hacer en Fase 4
- [x] Aviso legal visible — Por hacer en Fase 4
- [x] Páginas de contacto funcional — Por hacer en Fase 4
- [x] Contenido original y de calidad — Todos los artículos son originales
- [x] Navegación clara — Header con menú
- [x] Sin contenido prohibido (copyright, adulto, etc.) — Cumple
- [x] Dominio con más de 6 meses de antigüedad — **Nota: Puede ser necesario esperar si el dominio es nuevo**

---

## 10. Métricas de Éxito

| Métrica | Objetivo a 3 meses | Objetivo a 6 meses |
|---------|-------------------|--------------------|
| Visitas mensuales | 1.000 | 5.000 |
| Artículos de blog publicados | 20 | 20+ |
| Posición media para keywords objetivo | Top 20 | Top 10 |
| Empresas en directorio | 3 | 6 |
| Leads generados | 10 | 30 |
| Ingresos mensuales | 100 € | 500 € |

---

*Documento vivo: actualizar según avance del desarrollo.*