# Análisis: Calculadoras Baño y Cocina

## Calculadora Baño — Estado Actual vs Ideal

### Preguntas actuales (bano-bilbao.html):

| Step | Pregunta | Opciones |
|------|----------|----------|
| 1 | ¿Qué quieres reformar? | Reforma completa (básica/media/integral/premium por m²) + selección de estancias sueltas (pintura, suelo, baño completo, cocina) |
| 2 | ¿Cuántos metros tiene tu vivienda? | Slider 20-500 m² + presets (piso 2 hab ~70m², piso 3 hab ~90m², ático ~120m²) |
| 3 | ¿Qué tipo de edificio? | <20 años (×1.00), 20-40 años (×1.05), 40-70 años (×1.15), >70 años/Casco Viejo (×1.30) |
| 4 | ¿Qué calidad de materiales prefieres? | Básica (Leroy Merlin/marca blanca), Media (Cosentino, Porcelanosa, Roca, Grohe), Premium (Dekton, Saloni, Villeroy & Boch, Hansgrohe) |
| 5 | ¿Algún extra? | Cambio de ventanas, Terraza/Balcón, Suelo radiante, Demolición tabiques, Domótica, Aerotermia + toggle imprevistos (+15%) |
| 6 | Resultado | Rango de precio + desglose + descarga PDF + pedir 3 presupuestos |

---

### Lo que falta — Partidas específicas de reforma de baño:

La calculadora actual es una **calculadora genérica de reforma de vivienda** que incluye "baño completo" como una de las opciones de estancia. NO es una calculadora especializada de baño. Le faltan completamente estas preguntas:

**🚿 FASE 1 — Elemento de ducha/bañera (CRÍTICO)**
- [ ] ¿Ducha o bañera? (la demolición y fontanería son completamente distintas)
- [ ] Si ducha: ¿plato de ducha convencional vs ducha a ras de suelo (walk-in)?
- [ ] Si bañera: ¿bañera de acero/acrílico vs bañera de hidromasaje/exenta?
- [ ] ¿Se mantiene la ubicación actual o se mueve?

**🏠 FASE 2 — Albicatado/Revestimiento (CRÍTICO)**
- [ ] ¿Se cambia el azulejo de las paredes?
- [ ] Si sí: ¿parcial (suelo hasta 1m + techo) vs completo (paredes al completo)?
- [ ] ¿Azulejo cerámico estándar vs gresite (más caro) vs piedra natural?
- [ ] ¿Metros cuadrados específicos del baño (no de la vivienda)?

**🔧 FASE 3 — Fontanería**
- [ ] ¿Se toca fontanería? (mover puntos de agua = sobrecoste enorme)
- [ ] ¿Tuberías vistas o empotradas? (edificios antiguos pueden tener plomo/hierro)
- [ ] ¿Cambio de caldera/termo?

**🚽 FASE 4 — Sanitarios**
- [ ] ¿Tipo de inodoro? (estándar vs suspendido — el suspendido necesita bidet/chasis empotrado)
- [ ] ¿Tipo de lavabo? (de pedestal vs encastrado vs sobre encimera)
- [ ] ¿Bidet? (sí/no)
- [ ] ¿Mueble lavabo? (moderno con cajones vs tradicional)

**🪜 FASE 5 — Suelo del baño**
- [ ] ¿Tipo de suelo? (antideslizante cerámico vs gresite vs microcemento vs piedra)
- [ ] ¿Metros cuadrados del suelo del baño (diferente a m² de vivienda)?

**🚪 FASE 6 — Puertas y carpintería**
- [ ] ¿Cambio de puerta de baño? (estándar vs ciega vs corredera)

**💡 FASE 7 — Electricidad y ventilación**
- [ ] ¿CAMBIO de puntos de luz o solo repintar?
- [ ] ¿Extractor de aire? (obligatorio en baños sin ventana exterior)
- [ ] ¿Espejo con iluminación LED?

**🎨 FASE 8 — Pintura**
- [ ] ¿Pintura lavable antihumedad? (importante en baños)

---

### Propuesta de nuevos steps para hacerla específica de baño:

```
STEP 1: Tipo de reforma de baño
  - Completa (todo nuevo)
  - Parcial (solo algunos elementos)
  - Minimum (pintura + saneamiento)

STEP 2: Dimensiones del baño
  - Metros cuadrados del baño (slider 3-15 m², NO m² de vivienda)
  - Altura del techo (estándar 2.5m vs alto 3m+)
  - Forma: rectangular / cuadrada / irregular (con selector visual)

STEP 3: Ducha vs Bañera (DECISIÓN CLAVE)
  - Opción A: Ducha
    - Plato de ducha (estándar, a ras de suelo, extraplano)
    - Mampara (corredera, pivotante, walk-in sin mampara)
  - Opción B: Bañera
    - Bañera estándar (acero/acrílico)
    - Bañera exenta / de hidromasaje
  - Opción C: Ambas (ducha + bañera)
  - ¿Se mantiene ubicación actual? (sí/no — si no, +fontanería)

STEP 4: Revestimiento de paredes (alicatado)
  - No se toca / Parcial (hasta 1.20m) / Completo (paredes al completo)
  - Material: Cerámico económico / Porcelánico / Gresite / Piedra natural
  - Rango de metros lineales (perímetro × altura)

STEP 5: Suelo del baño
  - Material: Cerámico antideslizante / Gresite / Microcemento / Hidráulico
  - Metros cuadrados (normalmente = m² del baño)

STEP 6: Sanitarios
  - Inodoro: Estándar (de suelo) / Suspendido (empotrado) / Pack completo
  - Lavabo: De pedestal / Encastrado / Sobre encimera
  - ¿Bidet? (sí/no)
  - Mueble lavabo: Sin mueble / Mueble básico / Mueble moderno con cajones

STEP 7: Fontanería
  - ¿Se toca fontanería? (No / Sí, solo reparaciones / Sí, se redistribuyen puntos de agua)
  - Estado de tuberías: No lo sé / Cobre/PVC (OK) / Plomo/Hierro (renovar)
  - Nota: mover puntos de agua = +800-1500€

STEP 8: Electricidad y ventilación
  - ¿Extractor de aire? (obligatorio si no hay ventana)
  - ¿Cambio de luminarias? (sí/no)
  - ¿Espejo con LED? (sí/no)

STEP 9: Calidad de materiales (igual que ahora pero adaptado a baño)
  - Básica (Leroy Merlin)
  - Media (Roca, Grohe, Porcelanosa)
  - Premium (Villeroy & Boch, Hansgrohe, Saloni)

STEP 10: Extras específicos de baño
  - Mampara de ducha (+200-800€ según tipo)
  - Grifería termostática (+150-400€)
  - Toallero calefactado (+200-600€)
  - Vestidor/mini衣柜 (si hay espacio)

STEP 11: Resultado con desglose por partida:
  - Demolición
  - Albicatado
  - Suelo
  - Fontanería
  - Sanitarios
  - Electricidad
  - Mano de obra
  - Imprevistos (15%)
```

---

## Calculadora Cocina — Estado Actual vs Ideal

### Preguntas actuales (cocina-bilbao.html):

| Step | Pregunta | Opciones |
|------|----------|----------|
| 1 | ¿Qué quieres reformar? | Reforma completa (básica/media/integral/premium por m²) + selección de estancias sueltas (pintura, suelo, baño completo, cocina) |
| 2 | ¿Cuántos metros tiene tu vivienda? | Slider 20-500 m² + presets (piso 2 hab ~70m², piso 3 hab ~90m², ático ~120m²) |
| 3 | ¿Qué tipo de edificio? | <20 años (×1.00), 20-40 años (×1.05), 40-70 años (×1.15), >70 años/Casco Viejo (×1.30) |
| 4 | ¿Qué calidad de materiales prefieres? | Básica / Media / Premium (mismas marcas que baño) |
| 5 | ¿Algún extra? | Ventanas, Terraza, Suelo radiante, Demolición, Domótica, Aerotermia + imprevistos |
| 6 | Resultado | Rango + desglose + PDF + presupuestos |

**Problema fundamental identical al baño**: Pide m² de la **vivienda**, no de la cocina. Una cocina de 8m² en un piso de 120m² tiene un coste muy diferente dependiendo de si es una cocina de 6m² o de 15m².

---

### Lo que falta — Partidas específicas de reforma de cocina:

**📐 FASE 1 — Dimensiones de la cocina (CRÍTICO)**
- [ ] Metros cuadrados de la cocina (NO de la vivienda)
- [ ] Forma de la cocina (rectangular, en L, en U, americana/abierta)
- [ ] Altura del techo

**🍳 FASE 2 — Distribución y layout**
- [ ] ¿Cocina abierta vs cerrada? (abierta al salón = sin puerta, diferente presupuesto)
- [ ] ¿Se cambia la distribución de muebles? (mover muebles = tocar fontanería y gas)
- [ ] Metros lineales de muebles (dato clave que falta completamente)

**🗄️ FASE 3 — Mobiliario de cocina**
- [ ] ¿Muebles modulares (IKEA/cajas) vs hechos a medida?
- [ ] Material/acabado: DM chapado / Lacado / MDF lacado / Madera maciza
- [ ] Sistema de apertura: Bisagras normales / Cierre amortiguado / Push-to-open
- [ ] Acabado frontal: Mate / Brillo / Madera / Cemento

**🪨 FASE 4 — Encimera (PARTIDA CLAVE)**
- [ ] Material: Marble/Granito barato / Silestone / Dekton / Acero inoxidable / Madera
- [ ] Metros lineales de encimera
- [ ] ¿Salpicadero? (mismo material que encimera o diferente)
- [ ] Grosor del canto (20mm vs 12mm — afecta precio)

**🔌 FASE 5 — Electrodomésticos**
- [ ] ¿Se cambian todos o se reaprovechan algunos?
- [ ] Nivel: Pack básico ( Beko/Consumo ) / Gama media (Bosch/Siemens) / Premium (Miele/Gaggenau)
- [ ] ¿Campana extractora? (necesita salida de humos — si no hay, +200-500€ hacer salida)
- [ ] ¿Horno convencional vs vapor vs combi?
- [ ] ¿Placa de inducción vs gas vs vitrocerámica? (mover placa de gas =触 gasista autorizado)
- [ ] ¿Lavavajillas? (añadir uno nuevo = toma de agua + desagüe + eléctrico)
- [ ] ¿Frigorífico side-by-side o integrable?

**🚿 FASE 6 — Fregadero y grifería**
- [ ] Fregadero: Encastrar vs sobre encimera vs de un seno vs dos senos
- [ ] Grifo: Monomando básico / Grifo profesional (tipo restaurante) / Grifo con ducha extraíble
- [ ] ¿Dispensador de jabón integrado?

**⚡ FASE 7 — Electricidad**
- [ ] ¿Se toca la instalación eléctrica? (cocinas viejas pueden tener cable de 1.5mm — insuficiente para placa)
- [ ] ¿Tomas de corriente nuevas? (isla de cocina = cableado nuevo)
- [ ] ¿Iluminación: downlights vs LED bajo mueble vs tiras LED?

**🔥 FASE 8 — Gas**
- [ ] ¿Hay gas natural/butano? (cocina de gas necesita toma)
- [ ] ¿Se mueve la caldera/termo? (si la caldera está en cocina y se muda, hay que derivar gas)
- [ ] ¿Normativa IRAM para cocinas de gas en interiores?

**🧱 FASE 9 — Albicatado y suelos**
- [ ] ¿Se cambia el azulejo de la cocina? (cocinas necesitan pintura antihumedad/grasa específica)
- [ ] Tipo de pintura: Lavable standard / Específica para cocinas (resistente a grasas)
- [ ] ¿Suelo: el mismo que el resto de la casa o diferente? (parquet vs cerámico en cocina = problema)

**🚪 FASE 10 — Carpintería**
- [ ] ¿Puerta de cocina? (si es cocina cerrada: puerta cortafuegos vs normal)
- [ ] ¿Ventanas? (si se cambia ventana sobre fregadero, implica grifería)

---

### Propuesta de nuevos steps para hacerla específica de cocina:

```
STEP 1: Tipo de reforma de cocina
  - Completa (muebles + electrodomésticos + obra)
  - Solo muebles y encimera (electrodomésticos se reaprovechan)
  - Solo obra (pintura, suelos, electricidad) — muebles existentes
  - Mínima (pintura + pequeños retoques)

STEP 2: Dimensiones de la cocina
  - Metros cuadrados de la cocina (slider 4-25 m²)
  - Forma: Rectangular / En L / En U / Americana (abierta al salón)
  - Altura del techo

STEP 3: Layout y distribución
  - ¿La cocina está abierta al salón? (sí/no — afecta a pintura, aislamiento, campana)
  - ¿Se redistribuyen los muebles? (mover = tocar fontanería y gas)
  - Metros lineales de muebles bajos (con selector visual)
  - Metros lineales de muebles altos

STEP 4: Mobiliario
  - Tipo: Modular (IKEA/cajas) / A medida
  - Material: DM chapado / Lacado / MDF / Madera maciza
  - Apertura: Normal / Amortiguada / Push-to-open
  - Acabado: Mate / Brillo / Madera

STEP 5: Encimera
  - Material: Granito económico / Silestone / Dekton / Acero inoxidable / Mármol / Madera
  - Grosor: Estándar 20mm / Extra fino 12mm
  - ¿Salpicadero? (mismo material / diferente / sin salpicadero)
  - Metros lineales

STEP 6: Electrodomésticos
  - Nivel de gama: Básica / Media / Premium
  - ¿Horno? (convencional / vapor / combi)
  - ¿Placa? (gas / inducción / vitrocerámica)
  - ¿Campana extractora? (si sí: ¿recirculación o salida directa? — la salida directa necesita obra)
  - ¿Lavavajillas? (nuevo / existente / no hay)
  - ¿Frigorífico integrable?

STEP 7: Fregadero y grifería
  - Tipo de fregadero: Un seno / Dos senos / Encastrar / Sobre encimera
  - Grifo: Básico / Monomando calidad / Profesional con ducha
  - ¿Dispensador de jabón? (sí/no)

STEP 8: Fontanería y gas
  - ¿Se toca fontanería? (mover fregadero/lavavajillas = obra)
  - ¿Se toca instalación de gas? (mover caldera/encimera de gas = gasista obligatorio)
  - Estado de tuberías: Normal / Plomo/Hierro a renovar

STEP 9: Electricidad
  - ¿Instalación eléctrica nueva? (cable de 6mm para placa de inducción)
  - ¿Puntos de luz nuevos?
  - ¿Iluminación LED bajo muebles? (sí/no)

STEP 10: Revestimientos
  - ¿Pintura de cocina? (estándar / específica antihumedad y grasas)
  - ¿Azulejo/alicatado? (parcial / completo / no)
  - Material del suelo: Mismo que casa / Cerámico / Parquet (parquet en cocina = riesgo)
  - ¿Metros cuadrados de suelo?

STEP 11: Calidad de materiales (adaptado a cocina)
  - Básica (IKEA, marca blanca, Bosch gama entrada)
  - Media (Leroy Merlin PRO, Balay, Teka)
  - Premium (Miele, Gaggenau, SieMatic, Dekton premium)

STEP 12: Extras específicos de cocina
  - Isla de cocina (+800-3000€ según tamaño)
  - Tiradores: Empuñaduras normales / Sin tiradores (gola) / Perfiladores
  - Cajones extraíbles (+80-150€/cajón)
  - Esquina mágica (+150-300€)
  - Papelera integrada (+80-150€)

STEP 13: Resultado con desglose por partida:
  - Demolición
  - Albicatado/pintura
  - Suelo
  - Fontanería
  - Electricidad
  - Gas (si aplica)
  - Mobiliario
  - Encimera
  - Electrodomésticos
  - Montaje e instalación
  - Imprevistos (15%)
```

---

## Comparativa Competencia

| Fuente | Qué tiene bien | Enfoque |
|--------|----------------|---------|
| **calculadorareformas.com** (cocina) | 7 fases específicas: base (layout + metros lineales), mobiliario (tipo/material/sistema apertura), encimera (material + metros + salpicadero), electrodomésticos (packs o individual), fregadero/grifería, extras (LED, cierre amortiguado, extraíbles, esquinas mágicas, reciclaje), obra asociada (electricidad, fontanería, suelos, alicatado) | Detalle de cada partida individual, permite afinar por componentes |
| **bricocalculadora.com** (baño) | Lista clara de extras específicos: fontanería, electricidad, sanitarios, cambio de ducha o bañera. Desglose de resultado por partidas incluidas. | Simple pero con items específicos de baño |
| **vivacalculator.com** (baño) | Tamaños específicos de baño (pequeño/mediano/grande), niveles de renovación (básico a lujo), desglose de coste por categoría (mano de obra 40-50%, accesorios 15-20%, tocador 10-15%, suelo 8-12%, iluminación 5-8%, pintura 3-5%). Incluye opción DIY vs profesional. | Orientado a USA pero con estructura de desglose muy clara |
| **calculamirenta.com** (genérica) | Permite seleccionar elementos adicionales específicos: Fontanería, Electricidad, Albañilería, Carpintería, Pintura — cada uno con su propio coste. Incluye IVA y duración estimada. | Selectores por partida de obra |

---

## Problemas Comunes Detectados en Ambas Calculadoras

### 1. Error fatal: m² de vivienda vs m² de estancia
Ambas calculadoras preguntan **metros cuadrados de la vivienda completa** (20-500 m²) cuando deberían preguntar los metros de la estancia específica (baño: 3-12 m²; cocina: 5-20 m²). Una cocina de 6m² en un piso de 120m² cuesta parecido a una de 6m² en un piso de 70m². Los m² de vivienda solo son relevantes para reforma integral completa.

### 2. Las calculadoras son genéricas, no especializadas
El Step 1 pregunta "¿Qué quieres reformar?" con opciones que incluyen "Baño completo" o "Cocina" como una estancia más entre pintura y suelo. Pero luego los siguientes steps son exactamente los mismos para todas las opciones. No hay lógica específica de baño ni de cocina.

### 3. Extras irrelevantes para baño/cocina específicos
Los "extras" son elementos de vivienda general (terraza, suelo radiante, aerotermia). Faltan extras específicos como:
- **Baño**: mampara, toallero calefactado, espejo LED, grifería termostática
- **Cocina**: isla de cocina, campana extractora con salida de humos, encimera de material específico, lavavajillas

### 4. No hay preguntas de fontanería específicas
Mover un inodoro, un fregadero o una ducha de posición puede costar entre 800€ y 2000€ adicionales. No preguntar si se van a mover puntos de agua es un fallo grave de precisión.

### 5. No hay preguntas de gas (cocina)
Una placa de gas o caldera movida requiere gasista autorizado con certificado. Es una partida de 300-800€ que no se contempla.

### 6. No hay desglose de precio por partida en el resultado
El resultado muestra un rango pero no indica cuánto corresponde a cada concepto. Un usuario que ve "8000-12000€" no sabe cuánto es mano de obra vs materiales vsfontanería. La competencia como bricocalculadora SÍ incluye esto.

---

## Priorización para Implementación

### Fase 1 (MVP — cambios mínimos con máximo impacto SEO/UX):
1. Cambiar Step 2 para preguntar m² de la estancia (baño o cocina), no m² de vivienda
2. Añadir pregunta de ducha vs bañera (baño) o layout de cocina (cocina)
3. Añadir extras específicos por estancia
4. Añadir desglose por partida en el resultado

### Fase 2 (Calculadora realmente competitiva):
1. Rediseñar flow con preguntas específicas por estancia
2. Implementar lógica de precios por partida individual
3. Añadir preguntas de fontanería y gas
4. Añadir preguntas de calidad específicas (no las mismas marcas para baño y cocina)

### Fase 3 (Diferenciación):
1. Añadir visual selector de layouts (plantas de baño/cocina simplificadas)
2. Integrar con directorio de empresas locales
3. Añadir estimación de duración de obra
4. Generar PDF con desglose detallado por partida