# Auditoria de Caracteres / Idiomas / Emojis / Tipografia
**Fecha:** 2026-07-03T11:09:00Z
**Archivos HTML escaneados:** 107

## Resumen Ejecutivo

| Categoria | Total Issues | Paginas Afectadas |
|---|---|---|
| Alfabetos no-latinos | 20 | 5 |
| Mojibake (encoding corrupto) | 0 | 0 |
| Palabras en ingles | 13 | 13 |
| Emojis | 0 | 0 |
| Tipografia mixta | 8 | 8 |

- **Paginas con issues:** 19
- **Paginas limpias (validadas):** 88

> **Nota sobre falsos positivos:**
> - "Next" en "Next Generation EU" se excluye (nombre propio de fondo europeo, legitimo en espanol)
> - "Email" en etiquetas de formulario se reporta como MEDIUM (preferible: "Correo electronico")

## Top 10 Paginas con Mas Issues

| # | Pagina | Issues | Detalle |
|---|---|---|---|
| 1 | /blog/reformas-casco-viejo-bilbao.html | 5 | no-latino(5) |
| 2 | /blog/tipos-calefaccion-bilbao.html | 5 | no-latino(5) |
| 3 | /blog/tipos-calefaccion-vitoria.html | 5 | no-latino(5) |
| 4 | /calculadora/cocina-bilbao.html | 4 | no-latino(2), ingles(1), tipografia(1) |
| 5 | /blog/errores-comunes-reforma-bilbao.html | 3 | no-latino(3) |
| 6 | /blog/subvenciones-reformas-bilbao-2026.html | 2 | ingles(1), tipografia(1) |
| 7 | /calculadora/bano-bilbao.html | 2 | ingles(1), tipografia(1) |
| 8 | /calculadora/integral-bilbao.html | 2 | ingles(1), tipografia(1) |
| 9 | /calculadora/pintura-bilbao.html | 2 | ingles(1), tipografia(1) |
| 10 | /calculadora/suelo-bilbao.html | 2 | ingles(1), tipografia(1) |

## Detalle de Issues por Pagina

### /blog/reformas-casco-viejo-bilbao.html (5 issues)

- **[HIGH] Alfabeto no-latino (texto visible (Cyrillic)):** `о`
  - Eliminar caracteres Cyrillic del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (Cyrillic)):** `с`
  - Eliminar caracteres Cyrillic del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (Cyrillic)):** `б`
  - Eliminar caracteres Cyrillic del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (Cyrillic)):** `е`
  - Eliminar caracteres Cyrillic del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (Cyrillic)):** `н`
  - Eliminar caracteres Cyrillic del texto visible

### /blog/tipos-calefaccion-bilbao.html (5 issues)

- **[HIGH] Alfabeto no-latino (texto visible (Arabic)):** `م`
  - Eliminar caracteres Arabic del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (Arabic)):** `س`
  - Eliminar caracteres Arabic del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (Arabic)):** `ت`
  - Eliminar caracteres Arabic del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (Arabic)):** `ر`
  - Eliminar caracteres Arabic del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (Arabic)):** `ة`
  - Eliminar caracteres Arabic del texto visible

### /blog/tipos-calefaccion-vitoria.html (5 issues)

- **[HIGH] Alfabeto no-latino (texto visible (CJK)):** `对`
  - Eliminar caracteres CJK del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (CJK)):** `新`
  - Eliminar caracteres CJK del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (CJK)):** `阿`
  - Eliminar caracteres CJK del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (CJK)):** `罗`
  - Eliminar caracteres CJK del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (CJK)):** `萨`
  - Eliminar caracteres CJK del texto visible

### /calculadora/cocina-bilbao.html (4 issues)

- **[HIGH] Alfabeto no-latino (texto visible (CJK)):** `启`
  - Eliminar caracteres CJK del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (CJK)):** `蒙`
  - Eliminar caracteres CJK del texto visible
- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)
- **[LOW] Tipografia mixta:** em+en_dash_mixed
  - Mezcla em-dash y en-dash

### /blog/errores-comunes-reforma-bilbao.html (3 issues)

- **[HIGH] Alfabeto no-latino (texto visible (CJK)):** `另`
  - Eliminar caracteres CJK del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (CJK)):** `一`
  - Eliminar caracteres CJK del texto visible
- **[HIGH] Alfabeto no-latino (texto visible (CJK)):** `个`
  - Eliminar caracteres CJK del texto visible

### /blog/subvenciones-reformas-bilbao-2026.html (2 issues)

- **[MEDIUM] Palabra en ingles:** `Next` (contexto: CTA)
  - Traducir al espanol (ej: Enviar, Continuar, Ver mas)
- **[LOW] Tipografia mixta:** em+en_dash_mixed
  - Mezcla em-dash y en-dash

### /calculadora/bano-bilbao.html (2 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)
- **[LOW] Tipografia mixta:** em+en_dash_mixed
  - Mezcla em-dash y en-dash

### /calculadora/integral-bilbao.html (2 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)
- **[LOW] Tipografia mixta:** em+en_dash_mixed
  - Mezcla em-dash y en-dash

### /calculadora/pintura-bilbao.html (2 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)
- **[LOW] Tipografia mixta:** em+en_dash_mixed
  - Mezcla em-dash y en-dash

### /calculadora/suelo-bilbao.html (2 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)
- **[LOW] Tipografia mixta:** em+en_dash_mixed
  - Mezcla em-dash y en-dash

### /contacto.html (1 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)

### /donostia/calculadora.html (1 issues)

- **[LOW] Tipografia mixta:** em+en_dash_mixed
  - Mezcla em-dash y en-dash

### /vitoria/calculadora.html (1 issues)

- **[LOW] Tipografia mixta:** em+en_dash_mixed
  - Mezcla em-dash y en-dash

### /empresas/eraber.html (1 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)

### /empresas/raquel-gonzalez-interiorismo.html (1 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)

### /empresas/rb-interiores.html (1 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)

### /empresas/reformas-fernandez.html (1 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)

### /empresas/reformas-zunzunegui.html (1 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)

### /empresas/vascol-reformas.html (1 issues)

- **[MEDIUM] Palabra en ingles:** `Email` (contexto: form)
  - Traducir al espanol (ej: Correo electronico, Telefono)

## Paginas Limpias (Validadas)

88 paginas completamente limpias:

- /aviso-legal.html
- /barrios/reforma-deusto.html
- /barrios/reforma-indautxu.html
- /barrios/reforma-santutxu.html
- /blog.html
- /blog/aerotermia-bilbao-ventajas.html
- /blog/cambiar-suelo-bilbao.html
- /blog/cambiar-suelo-donostia.html
- /blog/cambiar-suelo-vitoria.html
- /blog/comparativa-reforma-bano-bilbao.html
- /blog/comparativa-reforma-cocina-bilbao.html
- /blog/empresas-reformas-bilbao.html
- /blog/empresas-reformas-donostia.html
- /blog/empresas-reformas-vitoria.html
- /blog/errores-comunes-reforma-bano-bilbao.html
- /blog/errores-reforma-cocina-bilbao.html
- /blog/hub-reforma-bano-bilbao.html
- /blog/licencias-obra-bilbao-2026.html
- /blog/licencias-obra-bilbao.html
- /blog/materiales-cocina-bilbao.html
- /blog/materiales-cocina-donostia.html
- /blog/materiales-cocina-vitoria.html
- /blog/pintar-piso-bilbao.html
- /blog/pintar-piso-donostia.html
- /blog/pintar-piso-vitoria.html
- /blog/precio-m2-reforma-bano-bilbao.html
- /blog/precio-m2-reforma-cocina-bilbao.html
- /blog/precio-reforma-integral-bilbao.html
- /blog/precio-reforma-integral-donostia.html
- /blog/precio-reforma-integral-vitoria.html
- /blog/presupuesto-reforma-bano-bilbao.html
- /blog/presupuesto-reforma-cocina-bilbao.html
- /blog/presupuesto-reforma-integral-bilbao.html
- /blog/reforma-80m2-bilbao-ejemplo.html
- /blog/reforma-80m2-bilbao.html
- /blog/reforma-bano-bilbao-2025.html
- /blog/reforma-bano-bilbao.html
- /blog/reforma-bano-donostia.html
- /blog/reforma-bano-pequeno-bilbao.html
- /blog/reforma-bano-vitoria.html
- /blog/reforma-cocina-bano-santutxu.html
- /blog/reforma-cocina-bilbao.html
- /blog/reforma-cocina-donostia.html
- /blog/reforma-cocina-vitoria.html
- /blog/reforma-integral-piso-donostia.html
- /blog/reforma-integral-piso-vitoria.html
- /blog/reforma-personas-mayores-bilbao.html
- /blog/reforma-vs-comprar-bilbao.html
- /blog/reforma-vs-reestructuracion-bilbao.html
- /blog/reformas-bilbao-guia-2025.html
- /blog/reformas-bilbao-precios.html
- /blog/rehabilitacion-edificio-antiguo-bilbao.html
- /blog/renovar-piso-antiguo-bilbao.html
- /blog/subvencion-accesibilidad-bilbao.html
- /blog/subvencion-accesibilidad-donostia.html
- /blog/subvencion-cambio-calderas-vitoria.html
- /blog/subvencion-cambio-ventanas-bilbao.html
- /blog/subvencion-eficiencia-energetica-bilbao.html
- /blog/subvencion-fachadas-bilbao.html
- /blog/subvencion-rehabilitacion-energetica-donostia.html
- /blog/subvenciones-reformas-bilbao.html
- /blog/subvenciones-reformas-donostia.html
- /blog/subvenciones-reformas-vitoria.html
- /blog/suelo-radiante-ventajas-bilbao.html
- /blog/suelo-radiante-vs-calefaccion.html
- /blog/tendencias-reforma-bano-bilbao-2026.html
- /blog/tendencias-reforma-cocina-bilbao-2026.html
- /blog/tiempo-reforma-integral-bilbao.html
- /blog/tipos-calefaccion-donostia.html
- /calculadora.html
- /donostia.html
- /donostia/blog.html
- /donostia/calcular-reforma.html
- /donostia/empresas.html
- /donostia/reforma-donostia.html
- /empresas.html
- /index.html
- /politica-privacidad.html
- /presupuesto-reforma-bilbao.html
- /reformas-bilbao.html
- /sobre-nosotros.html
- /vitoria.html
- /vitoria/blog.html
- /vitoria/calcular-reforma.html
- /vitoria/empresas.html
- /vitoria/empresas/ara-reformas.html
- /vitoria/empresas/renova-gasteiz.html
- /vitoria/reforma-vitoria.html

---
*Auditado: 2026-07-03T11:09:00Z | 107 paginas HTML | Tool: audit-chars.py*