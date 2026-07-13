# BRIEF: Sprint Calculadoras Donostia y Vitoria

## Objetivo
Crear las 10 calculadoras especializadas (5 Donostia + 5 Vitoria) replicando la estructura exacta de Bilbao con precios regionales.

## Estructura a crear
```
src/pages/donostia/calculadora/
  bano-donostia.astro      ← copia de bano-bilbao.astro
  cocina-donostia.astro    ← copia de cocina-bilbao.astro
  pintura-donostia.astro   ← copia de pintura-bilbao.astro
  suelo-donostia.astro     ← copia de suelo-bilbao.astro
  integral-donostia.astro  ← copia de integral-bilbao.astro

src/pages/vitoria/calculadora/
  bano-vitoria.astro       ← copia de bano-bilbao.astro
  cocina-vitoria.astro     ← copia de cocina-bilbao.astro
  pintura-vitoria.astro    ← copia de pintura-bilbao.astro
  suelo-vitoria.astro      ← copia de suelo-bilbao.astro
  integral-vitoria.astro   ← copia de integral-bilbao.astro
```

## Precios regionales (referencia Bilbao ya existe)

### Baño
| Elemento | Bilbao | Donostia (x1.1) | Vitoria (x0.9) |
|---|---|---|---|
| ducha | 450 | 500 | 400 |
| banera | 550 | 600 | 500 |
| ducha+banera | 750 | 820 | 680 |
| sanitarios | 200 | 220 | 180 |
| plato_convencional | 600 | 660 | 540 |
| walk_in | 1400 | 1540 | 1260 |
| mampara_corredera | 850 | 935 | 765 |
| banera_acero | 900 | 990 | 810 |
| banera_hidro | 3500 | 3850 | 3150 |
| azulejo_parcial | 45/m² | 50/m² | 40/m² |
| azulejo_completo | 85/m² | 93/m² | 77/m² |
| gresite | 120/m² | 132/m² | 108/m² |
| gres_antideslizante | 0 | 0 | 0 |
| gresite_suelo | 50/m² | 55/m² | 45/m² |
| microcemento | 95/m² | 104/m² | 85/m² |
| piedra_natural | 150/m² | 165/m² | 135/m² |
| MIN_BATHROOM | 2500 | 2750 | 2250 |

### Cocina
| Parámetro | Bilbao | Donostia (x1.1) | Vitoria (x0.9) |
|---|---|---|---|
| base rate m² | 550 | 600 | 500 |
| mueble basico mult | 1.0 | 1.0 | 1.0 |
| mueble medio mult | 1.4 | 1.4 | 1.4 |
| mueble premium mult | 2.0 | 2.0 | 2.0 |
| encimera gres extra | 30/m² | 33/m² | 27/m² |
| encimera silestone | 100/m² | 110/m² | 90/m² |
| encimera madera | 80/m² | 88/m² | 72/m² |
| encimera granito | 120/m² | 132/m² | 108/m² |
| electro existing | 0 | 0 | 0 |
| electro basico | 2000 | 2200 | 1800 |
| electro completo | 4500 | 4950 | 4050 |
| electro gama_alta | 8000 | 8800 | 7200 |
| distrib lineal | 0 | 0 | 0 |
| distrib pared_doble | 600 | 660 | 540 |
| distrib isla | 1500 | 1650 | 1350 |
| distrib americana | 2000 | 2200 | 1800 |
| MIN_KITCHEN | 5000 | 5500 | 4500 |

### Pintura
| Parámetro | Bilbao | Donostia (x1.1) | Vitoria (x0.9) |
|---|---|---|---|
| plastica | 8/m² | 9/m² | 7/m² |
| premium | 12/m² | 13/m² | 11/m² |
| ecologica | 18/m² | 20/m² | 16/m² |

### Suelo
| Parámetro | Bilbao | Donostia (x1.1) | Vitoria (x0.9) |
|---|---|---|---|
| laminado | 30/m² | 33/m² | 27/m² |
| vinylico | 42/m² | 46/m² | 38/m² |
| porcelanico | 57/m² | 63/m² | 51/m² |
| parque | 80/m² | 88/m² | 72/m² |

### Integral
| Parámetro | Bilbao | Donostia (x1.1) | Vitoria (x0.9) |
|---|---|---|---|
| basica | 700/m² | 780/m² | 630/m² |
| media | 950/m² | 1050/m² | 855/m² |
| alta | 1200/m² | 1320/m² | 1080/m² |
| electricidad extra | 3000 | 3300 | 2700 |
| fontaneria extra | 2500 | 2750 | 2250 |
| ambas extra | 5000 | 5500 | 4500 |

## Cambios en cada archivo
Para cada archivo copiar del correspondiente Bilbao:
1. Cambiar import paths (3 levels up en vez de 2)
2. Props de CalculadoraLayout: `city="donostia"` o `city="vitoria"`
3. Canonical URL: `https://www.bilbaoreforma.es/donostia/calculadora/bano-donostia.html`
4. Ajustar todos los precios según tablas arriba
5. Cambiar título h1: "Reforma de Baño en Donostia" / "en Vitoria"
6. Cambiar badges de precio en las cards: "desde X EUR" con nuevos valores

## rewrites en vercel.json (AL FINAL, después de crear los archivos)
Añadir:
```json
{ "source": "/donostia/calculadora/bano", "destination": "/donostia/calculadora/bano-donostia.html" },
{ "source": "/donostia/calculadora/cocina", "destination": "/donostia/calculadora/cocina-donostia.html" },
{ "source": "/donostia/calculadora/pintura", "destination": "/donostia/calculadora/pintura-donostia.html" },
{ "source": "/donostia/calculadora/suelo", "destination": "/donostia/calculadora/suelo-donostia.html" },
{ "source": "/donostia/calculadora/integral", "destination": "/donostia/calculadora/integral-donostia.html" },
{ "source": "/vitoria/calculadora/bano", "destination": "/vitoria/calculadora/bano-vitoria.html" },
{ "source": "/vitoria/calculadora/cocina", "destination": "/vitoria/calculadora/cocina-vitoria.html" },
{ "source": "/vitoria/calculadora/pintura", "destination": "/vitoria/calculadora/pintura-vitoria.html" },
{ "source": "/vitoria/calculadora/suelo", "destination": "/vitoria/calculadora/suelo-vitoria.html" },
{ "source": "/vitoria/calculadora/integral", "destination": "/vitoria/calculadora/integral-vitoria.html" },
```

## Antigua calculadora genérica donostia/calculadora/index.astro
La página existente con las cards de tipo (baño, cocina, pintura) debe actualizarse para enlazar a las nuevas calculadoras específicas:
- Card "Reforma básica/media/integral" → `/donostia/calculadora/integral-donostia.html`
- Los botones "Siguiente" y los type-cards deben apuntar a los URLs correctos.

Mismo para Vitoria.

## Criterios QA
- `npm run build` pasa (verde)
- 10 archivos nuevos creados
- vercel.json tiene los 10 rewrites nuevos
- Antigua calculadora genérica donostia/calculadora/index.html y vitoria/calculadora/index.html siguen funcionando (se mantienen como fallback, o se actualizan los links)
