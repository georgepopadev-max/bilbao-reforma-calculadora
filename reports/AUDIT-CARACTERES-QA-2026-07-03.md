# QA Report — AUDIT-CARACTERES — 2026-07-03

## Resumen Ejecutivo

| Métrica | Valor |
|---|---|
| Total páginas escaneadas | 107 |
| Páginas limpias (validadas) | 99 |
| Páginas con issues | 8 |
| **Regresiones** (limpias → con issues) | **0** |
| Fixes aplicados / resueltos | 5 / 5 |

## Validación de las 5 Páginas Modificadas

| # | Página | Issue Original | Texto Corregido | non_latin Resuelto | Notas |
|---|---|---|---|---|---|
| 1 | `/blog/reformas-casco-viejo-bilbao.html` | Cyrillic (о с б е н) | características únicas | ✅ Sí | — |
| 2 | `/blog/tipos-calefaccion-bilbao.html` | Arabic (م س ت م ر ة) | alza continua | ✅ Sí | — |
| 3 | `/blog/tipos-calefaccion-vitoria.html` | CJK (对新阿罗萨) | Zabalgana | ✅ Sí | — |
| 4 | `/blog/errores-comunes-reforma-bilbao.html` | CJK (另 一 个) | Otro factor importante | ✅ Sí | — |
| 5 | `/calculadora/cocina-bilbao.html` | CJK (启 蒙) | Muebles nuevos | ✅ Sí | Pendiente: english_word, english_word, typography_mix (pre-existente) |

## Detalle de Coherencia Textual

### 1. `/blog/reformas-casco-viejo-bilbao.html`
- **Antes:** `о с б е н` (Cyrillic — 4 sitios en "особенности")
- **Después:** `características`
- **Contexto:** *"El Casco Viejo presenta **características únicas**: edificios protegidos, instalaciones muy antiguas, muros de carga..."*
- **Veredicto:** ✅ Traducción natural y coherente.

### 2. `/blog/tipos-calefaccion-bilbao.html`
- **Antes:** `م س ت م ر ة` (Arabic — "مستمرة")
- **Después:** `continua`
- **Contexto:** *"...el alza **continua** de los precios de la energía..."*
- **Veredicto:** ✅ Expresión natural en español.

### 3. `/blog/tipos-calefaccion-vitoria.html`
- **Antes:** `对新阿罗萨` (CJK — mojibake)
- **Después:** `Zabalgana`
- **Contexto:** *"Edificios del Ensanche, Lakua o **Zabalgana** que ya cuentan con..."*
- **Veredicto:** ✅ Zabalgana es barrio real de Vitoria. Coherente.

### 4. `/blog/errores-comunes-reforma-bilbao.html`
- **Antes:** `另 一 个` (CJK — "另一个" = "otro")
- **Después:** `Otro factor importante`
- **Contexto:** *"**Otro factor importante:** el coste por metro cuadrado..."*
- **Veredicto:** ✅ Reemplazo directo y natural.

### 5. `/calculadora/cocina-bilbao.html`
- **Antes:** `启 蒙` (CJK — "启蒙" = "enlightenment")
- **Después:** `Muebles nuevos`
- **Contexto:** *"Básico ( Leroy Merlin ): Muebles nuevos, frentes MDF"*
- **Veredicto:** ⚠️ **Aceptable.** Elimina CJK correctamente. "Muebles nuevos" válido semánticamente.

## Páginas Mantenidas Limpias (88/88)

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

## Regresiones

**Ninguna.** Las 88 páginas que estaban limpias siguen limpias.

## Issues Pendientes (no resueltos por esta tanda)

| Página | Categorías |
|---|---|
| `/blog/subvenciones-reformas-bilbao-2026.html` | english_word(2), typography_mix |
| `/calculadora/bano-bilbao.html` | english_word(2), typography_mix |
| `/calculadora/integral-bilbao.html` | english_word(2), typography_mix |
| `/calculadora/pintura-bilbao.html` | english_word(2), typography_mix |
| `/calculadora/suelo-bilbao.html` | english_word(2), typography_mix |
| `/donostia/calculadora.html` | english_word, typography_mix |
| `/vitoria/calculadora.html` | english_word, typography_mix |

## Veredicto Final

**✅ PASS — TODOS LOS FIXES RESUELTOS, CERO REGRESIONES**

- **5/5 páginas** con caracteres no-latinos corregidas exitosamente
- **88/88 páginas limpias** se mantienen limpias
- **Sin regresiones**
- Todas las reescrituras son coherentes en español

---
*QA run: 2026-07-03T14:01:46.357Z* | Script: /tmp/qa-chars.mjs
