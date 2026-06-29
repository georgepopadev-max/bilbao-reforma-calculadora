# 📋 Plan Completo — Migración Bilbao Reforma a Astro

**Para:** George
**Estado:** Pendiente de tu approval para arrancar desarrollo
**Análisis completo por:** Claw 🐾 con M3
**Ejecución por:** 3 sub-agentes M2.7 (A1 secuencial, A2+A3 en paralelo)

---

## 🎯 Lo que vas a ganar

| Hoy (vanilla) | Mañana (Astro) |
|---|---|
| 103 HTMLs con `<head>` repetido | 1 `BaseLayout.astro` + 103 markdowns |
| Header/Footer copy-paste en cada blog | 2 componentes, editas 1 vez |
| FAQSchema inline en cada HTML | Frontmatter `faqs:` automático |
| `calculator.js` 1.695 líneas monolítico | 6 TS modules tipados |
| `styles.css` 3.987 líneas | Tokens + Tailwind components |
| Añadir blog = 45min, 6 sitios de fallo | Nuevo `.md` con frontmatter = 5min |
| Cambiar footer = 66 edits | 1 archivo |

## 📅 Plan de 3 sprints

### Sprint A1 — Setup + 7 blogs piloto (8h) 🔒 SECUENCIAL
- Crea proyecto Astro + Tailwind + Vercel adapter
- Define design tokens en `tailwind.config.mjs` desde `styles.css`
- Crea `legacy/` con copia de los 103 HTML (backup)
- Migra 7 blogs piloto: 5 estándar + 1 hub + 1 subcarpeta subvención
- QA: diff HTML byte-a-byte vs legacy
- **Bloqueante:** A2 y A3 esperan a A1

### Sprint A2 — Migración masiva 46 blogs (6h) ⚡ PARALELO a A3
- Script `html-to-markdown.ts` automático
- 46 blogs restantes + 7 subvenciones subcarpeta manuales
- Index de blog con filtros
- 1 solo agente (el script es la magia)

### Sprint A3 — Páginas no-blog + Calculadora split (8h) ⚡ PARALELO a A2
- 8 páginas raíz Bilbao + 11 Donostia + 13 Vitoria
- 7 fichas empresa + 3 barrios
- 6 calculadoras con TS modules (split del `calculator.js`)
- Mantiene clamps 2.500€/5.000€ y multiplicadores barrio
- 1 solo agente

**Total: 3 sprints, ~22h, 3 agentes (1 secuencial + 2 paralelos)**

## ✅ Tus decisiones de hoy
1. ✅ URLs mantienen `.html` (sin migración a `/blog/<slug>/`)
2. ✅ Tailwind + tokens (no monolítico de 3.987 líneas)
3. ✅ `calculator.js` partido en TS modules
4. ✅ NO MDX (blogs con markdown simple)
5. ✅ Mantener `legacy/` como backup

## ⚠️ Riesgos SEO + mitigación
- URLs rotas → mantener `.html` exacto
- Schema diferente → diff HTML QA + test Rich Results
- Cache Vercel → cache-bust agresivo primer deploy
- Cambios visuales → diff pixel-piloto en blogs piloto

## 🤔 Lo que necesito saber antes de lanzar

¿Apruebas arrancar el **Sprint A1** con estas condiciones?

- [ ] ✅ Sí, lanza A1
- [ ] 🟡 Quiero ajustar algo primero
- [ ] ❌ Cancela, lo pensamos más

**Si apruebo A1:**
- Lanzo 1 sub-agente M2.7 con la TASK-A1.md
- Te aviso cuando termine (~8h o menos)
- Mientras tanto, tú puedes configurar GTM/GA4 (15min del recordatorio) o seguir con Bilbao Reforma
- Cuando A1 termine, A2+A3 en paralelo (te aviso)

**¿Tiro adelante?**
