# Análisis: Calculadoras Pintura, Suelo e Integral

> **Descubrimiento crítico:** Los tres archivos HTML (`pintura-bilbao.html`, `suelo-bilbao.html`, `integral-bilbao.html`) son **estructuralmente idénticos**. Mismos 6 pasos, mismas opciones, mismo código. Solo cambian: meta tags, texto editorial de la cabecera, y el precio comparativo en el resultado. Esto explica por qué ninguna es específica de su oficio.

---

## Calculadora Pintura — Estado Actual vs Ideal

### Preguntas actuales (Steps 1–6):

| Step | Título | Opciones |
|------|--------|----------|
| 1 | ¿Qué quieres reformar? | Reforma completa (básica/media/integral/premium) **O** Estancias: pintura, suelo, baño, cocina |
| 2 | ¿Cuántos metros tiene tu vivienda? | Slider 20–500 m² con presets (piso 2 hab ~70m², piso 3 hab ~90m², ático ~120m²) |
| 3 | ¿Qué tipo de edificio? | <20 años (×1.00), 20-40 años (×1.05), 40-70 años (×1.15), >70 años/Casco Viejo (×1.30) |
| 4 | ¿Qué calidad de materiales prefieres? | Básica (Leroy Merlin), Media (Cosentino/Porcelanosa), Premium (Dekton/Villeroy) |
| 5 | ¿Algún extra? | Cambio ventanas, Terraza/balcón, Suelo radiante, Demolición tabiques, Domótica, Aerotermia |
| 6 | Resultado | Desglose + descargar PDF + pedir 3 presupuestos |

### Lo que falta (partidas específicas de pintura):

- ❌ **Gotelé** — No pregunta si hay gotelé que eliminar. Es la partida más importante y costosa en pintura (8–15 €/m² adicional por alisado)
- ❌ **Humedad/moho** — No detecta si hay paredes con humedad, lo que requiere tratamiento previo (fungicida, imprimación antimoho)
- ❌ **Tipo de pintura** — No pregunta: vinílica vs acrílica vs lavable vs antisuciedad vs antimoho. Son rangos de precio muy distintos
- ❌ **Color** — No diferencia blanco (estándar) vs colores especiales (todal color, necesitan más capas)
- ❌ **Cielorrasos/techos** — No pregunta si pinta también el techo. Es m² adicionales y encarece el trabajo
- ❌ **Puertas y ventanas** — No pregunta si pinta puertas (lisat/barniz), marcos de ventana o rodapiés
- ❌ **Número de habitaciones** — No consulta dormitorios vs salón vs pasillo (distinta demanda de metros/paredes)
- ❌ **Alto de paredes** — No diferencia estándar (~2.50m) vs techos altos (>2.80m) que multiplican m² de pared
- ❌ **Estado de la pared actual** — No pregunta si la pared está en buen estado, tiene grietas, o es obra nueva
- ❌ **Retirada de muebles** — No pregunta si necesita que el pintor mueva/retire muebles (sobrecoste)

### Propuesta de nuevos steps:

```
STEP 1: Tipo de pintura que necesitas
  - Solo pintar paredes (sin gotelé)
  - Pintar + alisado de gotelé
  - Pintar + tratar humedad/moho
  - Obra nueva (paredes vírgenes)

STEP 2: Superficie
  - m² de pared a pintar (slider)
  - ¿Pintar también techos? Sí/No (+m² techo)
  - Número de habitaciones: estudio / 2 hab / 3 hab / 4+ hab
  - Alto de techos: estándar (~2.50m) / alto (>2.80m)

STEP 3: Tipo de pintura (calidad)
  - Económica: vinílica básica (8–12 €/m²)
  - Estándar: acrílica lavable (12–18 €/m²)
  - Premium: paint + antisuciedad (18–25 €/m²)
  - Especial: antimoho / antihumedad (25–35 €/m²)

STEP 4: Color
  - Blanco (estándar, 1–2 capas)
  - Colores claros (beige, gris claro... +1 capa)
  - Colores oscuros o intensos (+2 capas)

STEP 5: Extras de pintura
  - Puertas: pintar/lijar (+150–400 €/ud)
  - Ventanas/marcos (+80–200 €/ventana)
  - Rodapiés (+3–6 €/m lineal)
  - Tratamientos especiales: imprimación antimoho (+5 €/m²)
  - Retirada de cuadros/interruptores (incluido vs servicio extra)

STEP 6: Estado del edificio (para factor难得 de complejidad)
  - Edificio <20 años: paredes en buen estado
  - Edificio 20-40 años: posible need de repaso
  - Edificio 40-70 años: gotelé frecuente, posibles humedades
  - Edificio >70 años / Casco Viejo: amianto en gotelé (estudio obligatorio)

STEP 7: Resultado con desglose:
  - Preparación paredes (limpieza, lijado, emplastecido)
  - Tratamiento gotelé / imprimación
  - Pintura (material + mano de obra x m²)
  - Techos (si aplica)
  - Extras (puertas, ventanas, rodapiés)
  - TOTAL €/m²
```

---

## Calculadora Suelo — Estado Actual vs Ideal

### Preguntas actuales (Steps 1–6):

| Step | Título | Opciones |
|------|--------|----------|
| 1 | ¿Qué quieres reformar? | Reforma completa o estancias sueltas (pintura, suelo, baño, cocina) |
| 2 | ¿Cuántos metros tiene tu vivienda? | Slider 20–500 m² con presets |
| 3 | ¿Qué tipo de edificio? | <20 años (×1.00), 20-40 años (×1.05), 40-70 años (×1.15), >70 años (×1.30) |
| 4 | ¿Qué calidad de materiales prefieres? | Básica/Media/Premium |
| 5 | ¿Algún extra? | Ventanas, Terraza, Suelo radiante, Demolición, Domótica, Aerotermia |
| 6 | Resultado | Desglose + PDF + pedir presupuestos |

### Lo que falta (partidas específicas de suelo):

- ❌ **Tipo de suelo actual** — No pregunta qué hay ahora (baldosa, parqué, moqueta, terrazo...). La retirada tiene costes radicalmente distintos
- ❌ **Suelo nuevo específico** — No pregunta: parqué flotante vs parqué macizo vs tarima vs gres/cerámica vs vinilo/LVT. Son ofícios completamente distintos con rangos de 25 a 140 €/m²
- ❌ **Demolición del suelo antiguo** — No pregunta si hay que quitar el anterior. Baldosa viejas = +15–25 €/m² en demolición
- ❌ **Nivelación del subsuelo** — No pregunta si el suelo está nivelado. Un mortero autonivelante cuesta +5–12 €/m²
- ❌ **Aislamiento térmico/acústico** — No ofrece la opción de poner aislamiento debajo del nuevo suelo
- ❌ **Zonas húmedas** — No diferencia baño/cocina (necesitan material impermeable) del resto de la casa
- ❌ **Habitación por habitación** — No permite calcular dormitorios (parqué) diferente a baños (gres/antideslizante)
- ❌ **Tipo de parqué** — No diferencia laminado (económico) vs macizo (premium)
- ❌ **Colocación de rodapiés** — Siempre se cambian con el suelo pero no se pregunta como partida
- ❌ **Perfiles de transición** — No pregunta transiciones entre habitaciones (necesitan profile strip)

### Propuesta de nuevos steps:

```
STEP 1: ¿Qué tipo de suelo nuevo quieres?
  - Parqué flotante / laminado (35–65 €/m²)
  - Parqué macizo de madera (65–130 €/m²)
  - Tarima sintética (30–55 €/m²)
  - Gres porcelánico (35–90 €/m²)
  - Cerámica (30–70 €/m²)
  - Vinilo/LVT (25–60 €/m²)
  - Hormigón pulido (40–80 €/m²)

STEP 2: Superficie a cubrir
  - m² totales (slider)
  - Desglose por estancia (dormitorio A: X m², Dormitorio B: X m², Salon: X m², Baño: X m², Cocina: X m²)
  - Esto permite asignar material diferente a cada zona

STEP 3: ¿Qué hay ahora? (para calcular retirada)
  - No hay suelo / obra nueva (sin coste retirada)
  - Parqué/flotante actual (+retirada +5–10 €/m²)
  - Baldosa/gres actual (+retirada +15–25 €/m²)
  - Moqueta/catido (+retirada +5–8 €/m²)
  - Terrazo pulido (+retirada +12–20 €/m², difícil de quitar)

STEP 4: Estado del subsuelo
  - Suelo nivelado y firme (sin sobrecoste)
  - Necesita nivelación con mortero autonivelante (+5–12 €/m²)
  - Necesita formación de pendientes (baño) (+8–15 €/m²)

STEP 5: Extras de suelo
  - Aislamiento térmico debajo del suelo (+8–15 €/m²)
  - Aislamiento acústico (+5–12 €/m²)
  - Zonas húmedas (baño/cocina): material antideslizante/especial (+10–20 €/m²)
  - Rodapiés nuevos (+8–15 €/m lineal)
  - Perfiles de transición entre materiales (+15–30 €/ud)
  - Puertas: rebaje para nuevo suelo (+40–80 €/ud)

STEP 6: Resultado con desglose:
  - Suministro material (×m² × precio material)
  - Retirada suelo antiguo
  - Nivelación del subsuelo
  - Instalación del nuevo suelo
  - Rodapiés y perfiles
  - TOTAL €/m²
```

---

## Calculadora Integral — Estado Actual vs Ideal

### Preguntas actuales (Steps 1–6):

| Step | Título | Opciones |
|------|--------|----------|
| 1 | ¿Qué quieres reformar? | Reforma completa (básica/media/integral/premium) o estancias individuales |
| 2 | ¿Cuántos metros tiene tu vivienda? | Slider 20–500 m² |
| 3 | ¿Qué tipo de edificio? | <20 / 20-40 / 40-70 / >70 años con multiplicadores |
| 4 | ¿Qué calidad de materiales prefieres? | Básica/Media/Premium |
| 5 | ¿Algún extra? | Ventanas, Terraza, Suelo radiante, Demolición, Domótica, Aerotermia |
| 6 | Resultado | Desglose + PDF + pedir presupuestos |

### Lo que falta (partidas específicas de reforma integral):

- ❌ **Número de habitaciones** — No pregunta distribución (2 hab, 3 hab, 4+ hab). Un piso de 80m² con 2 hab vs 4 hab tienen presupuestos radicalmente distintos (más baños, más cocina, más pintura)
- ❌ **Electricidad: completa o parcial** — No pregunta si cambia toda la instalación (cuadro + cableado + mecanismos) o solo hace modificaciones parciales. Es la partida más cara de la reforma (3.000–12.000 € completa)
- ❌ **Fontanería: completa o parcial** — No pregunta si cambia toda la tubería (cobre/PPR) o solo griferías/sanitarios. Completa = 2.500–8.000 €
- ❌ **Cambio de ventanas** — Ya aparece en Extras, pero debería ser step propio porque es una decisión mayor (no siempre se quiere cambiar)
- ❌ **Licencia de obra** — No diferencia entre licencia de obra menor (<40.000 €) vs mayor (>40.000 €) vs proyecto de arquitecto (edificios >70 años). Coste: 500–5.000 €+
- ❌ **Estructura** — No pregunta si se toca elementos estructurales (quitar muro portante). Necesita cálculo de arquitecto (+1.500–5.000 €)
- ❌ **Calidad diferenciada por partida** — En integral real, no toda la casa tiene la misma calidad. Puedes querer grifería media pero suelo premium. La calculadora actual aplica una calidad única
- ❌ **Plazo de ejecución** — No pregunta si necesita la obra para ayer (urgencia = +20-30% sobrecoste)
- ❌ **Desperfectos por reforma** — No pregunta si hay que reparar humedades, grietas estructurales, amianto antes de empezar
- ❌ **Aseo de obra** — Durante la reforma, ¿el cliente vive en la vivienda? (+coste por logística)

### Propuesta de nuevos steps:

```
STEP 1: Tipo de reforma integral (alcance)
  - Básica: pintura, suelos, baños y cocina standard
  - Media: + electricidad nueva + fontanería parcial
  - Integral: toda fontanería + electricidad + suelos + pintura + baños + cocina
  - Premium: + domótica + aerotermia + materiales alta gama

STEP 2: Distribución
  - Número de dormitorios: 1 / 2 / 3 / 4 / 5+
  - Número de baños: 1 / 2 / 3
  - ¿Cocina abierta (open plan)? Sí/No (afecta a tabiques)
  - ¿Se eliminan tabiques? Sí/No (demolición + obra de albañilería)

STEP 3: Instalación eléctrica (partida crítica)
  - Instalación eléctrica completa (cuadro, cableado, mecanismos) → 3.000–12.000 €
  - Modificación parcial (añadir puntos de luz, mecanismos) → 500–2.000 €
  - No se toca (instalación existente en buen estado)

STEP 4: Fontanería (partida crítica)
  - Fontanería completa nueva (tuberías, desagües, llaves) → 2.500–8.000 €
  - Fontanería parcial (solo baños o cocina) → 1.000–4.000 €
  - Solo cambiar sanitarios y griferías → 500–2.000 €
  - No se toca

STEP 5: Carpintería exterior
  - Cambiar todas las ventanas: ¿cuántas? (slider 2–15)
  - Material: PVC / Aluminio / Madera
  - No se cambian (solo pintar marcos)

STEP 6: Acabados por estancia (calidad personalizada)
  - Dormitorios: Básica / Media / Premium
  - Salon: Básica / Media / Premium
  - Cocina: Básica / Media / Premium
  - Baño(s): Básica / Media / Premium

STEP 7: Extras especiales
  - ¿Licencia de obra mayor? (Sí → +500–5.000 € con arquitecto)
  - ¿Retirada de amianto? (edificios >40 años con gotelé → +2.000–8.000 €)
  - ¿Vives en la vivienda durante la obra? (sobrecoste +15% por logística)
  - ¿Plazo urgente? (menos de 2 meses → +20-30%)
  - ¿Trastero o cuarto trastero? (m² extra)
  - Suelo radiante (+70–140 €/m²)

STEP 8: Metros cuadrados + Antigüedad
  (Se mantiene igual que ahora: slider + age multiplier)

STEP 9: Resultado con desglose detallado:
  - Demolición y retirada de residuos
  - Albañilería (tabiques, rozas, cargas)
  - Electricidad (material + mano de obra + certificados)
  - Fontanería (material + mano de obra + certificados)
  - Pintura (paredes + techos)
  - Suelos
  - Cocina (mobiliario + electrodomésticos + instalación)
  - Baño(s) (sanitarios + griferías + ducha/banera)
  - Carpintería (puertas + ventanas)
  - Licencia y proyecto (si aplica)
  - Imprevistos (15%)
  - TOTAL € y €/m²
```

---

## Nota Importante: La Integral como "calculadora padre"

Las tres calculadoras son **idénticas en estructura** porque aparentemente comparten el mismo código JS (`calculator.min.js`). Esto significa que:

1. **Reescribir Integral primero**: La calculadora Integral debería ser la "calculadora padre" que integre las otras 4 como módulos:
   - Si el usuario marca "reforma integral" en Step 1, se desplega un asistente que pregunta por cada una de las 5 partidas (pintura, suelo, baño, cocina, eléctrica/fontanería)
   - Las calculadoras individuales (pintura, suelo, baño, cocina) deberían ser "hijas" que heredan sus steps específicos

2. **Arquitectura recomendada para el desarrollador**:
   ```
   CalculadoraIntegral
   ├── Step 1: Seleccionar partida → [pintura, suelo, baño, cocina, eléctrica, fontanería]
   ├── Para CADA partida seleccionada → ir a sub-flow de esa partida
   ├── Step de integración: ¿Algo más o ya está?
   ├── Step de instalaciones (eléctrica + fontanería) — solo para integral
   ├── Step de licencia/proyecto
   └── Resultado consolidado de todas las partidas
   ```

3. **Partidas que SOLO la integral debe preguntar** (y las individuales no):
   - Electricidad completa vs parcial
   - Fontanería completa vs parcial
   - Licencia de obra
   - Retirada de amianto
   - Urgencia/plazo
   - Vivir durante la obra

4. **Pasar de 6 a 9–10 steps en Integral** es aceptable porque es una reforma compleja. Las calculadoras individuales (pintura, suelo) pueden quedarse en 6–7 pasos con preguntas específicas del oficio.

---

## Resumen de Brecha

| Característica | Pintura | Suelo | Integral |
|----------------|---------|-------|----------|
| Preguntas específicas del oficio | 0/10 | 0/10 | 0/10 |
| Steps compartidos vs propios | 5/6 compartidos | 5/6 compartidos | 5/6 compartidos |
| Partidas que ignora completamente | Gotelé, humedad, color, techo, puertas | Suelo actual, nivelación, zonas húmedas | Electricidad completa, fontanería, licencia, urgencia |
| Calidad personalizada por estancia | ❌ | ❌ | ❌ |
| Factor urgencia/plazo | ❌ | ❌ | ❌ |
