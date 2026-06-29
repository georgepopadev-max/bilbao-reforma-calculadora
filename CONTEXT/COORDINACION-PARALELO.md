# 🚦 COORDINACIÓN 3 AGENTES EN PARALELO

**Para:** A1, A2, A3
**Patrón:** Zonas separadas + checkpoints de sincronización

---

## 🎯 Principio fundamental

Cada agente tiene **zona propia delimitada** en filesystem. NO se tocan entre sí. Si un agente necesita algo de otro, **lee pero NO modifica**.

## 🗺️ Mapa de zonas

```
bilbao-reforma-calculadora/
├── package.json                                  [A1]
├── astro.config.mjs                              [A1]
├── tailwind.config.mjs                           [A1]
├── tsconfig.json                                 [A1]
├── legacy/                                       [A1 — backup]
├── src/
│   ├── styles/                                   [A1 — tokens + base + components + tailwind]
│   ├── layouts/
│   │   ├── BaseLayout.astro                      [A1]
│   │   ├── BlogLayout.astro                      [A1]
│   │   ├── HubLayout.astro                       [A1]
│   │   ├── CityLayout.astro                      [A3 ← NUEVO]
│   │   ├── EmpresaLayout.astro                   [A3 ← NUEVO]
│   │   └── CalculadoraLayout.astro               [A3 ← NUEVO]
│   ├── components/
│   │   ├── Header.astro                          [A1]
│   │   ├── Footer.astro                          [A1]
│   │   ├── CitySwitcher.astro                    [A1]
│   │   ├── ArticleMeta.astro                     [A1]
│   │   ├── FAQSection.astro                      [A1]
│   │   ├── BreadcrumbSchema.astro                [A1]
│   │   ├── InContentCTA.astro                    [A1]
│   │   ├── PriceTable.astro                      [A1]
│   │   └── Callout.astro                         [A1]
│   ├── content/
│   │   ├── config.ts                             [A1 — define schema blog]
│   │   │                                         [A3 — AÑADE schema empresas + barrios]
│   │   ├── blog/                                 [A1 — 1 piloto .md]
│   │   │                                         [A2 — 46 archivos .md restantes]
│   │   ├── empresas/                             [A3 ← NUEVO]
│   │   └── barrios/                              [A3 ← NUEVO]
│   ├── data/                                     [A3 ← NUEVO]
│   ├── pages/
│   │   ├── index.astro                           [A3]
│   │   ├── reformas-bilbao.astro                 [A3]
│   │   ├── presupuesto-reforma-bilbao.astro      [A3]
│   │   ├── sobre-nosotros.astro                  [A3]
│   │   ├── contacto.astro                        [A3]
│   │   ├── aviso-legal.astro                     [A3]
│   │   ├── politica-privacidad.astro             [A3]
│   │   ├── blog/
│   │   │   ├── [slug].astro                      [A2 o A1 si A1 quiere crear]
│   │   │   ├── index.astro                       [A2]
│   │   │   ├── reforma-bano-bilbao.md            [A1 — piloto]
│   │   │   ├── hub-reforma-bano-bilbao.astro     [A1 — MANUAL con ItemList]
│   │   │   ├── subvencion-accesibilidad-bilbao/
│   │   │   │   └── index.astro                   [A1 — piloto]
│   │   │   └── [A2 — resto de blogs y subcarpetas subvención]
│   │   ├── calculadora/                          [A3]
│   │   ├── empresas/                             [A3]
│   │   ├── barrios/                              [A3]
│   │   ├── donostia/                             [A3]
│   │   └── vitoria/                              [A3]
│   └── scripts/
│       ├── analyzers/                            [A2 ← NUEVO]
│       └── calculator/                           [A3 ← NUEVO 6 TS modules]
```

## 🚦 Checkpoints de sincronización

### Checkpoint 1 (A1 publica public API) — en los primeros 90 min
**A1 emite git commit `chore(a1): publish BaseLayout + Header + Footer + content/config + FAQ/InContent/ArticleMeta components`**

Estos archivos son críticos para que A2 y A3 puedan hacer build/check:
- `src/layouts/BaseLayout.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/FAQSection.astro`
- `src/components/InContentCTA.astro`
- `src/components/ArticleMeta.astro`
- `src/components/PriceTable.astro`
- `src/styles/tokens.css`
- `src/styles/base.css`
- `src/styles/tailwind.css`
- `src/content/config.ts` (con schema blog)
- `tailwind.config.mjs`
- `astro.config.mjs`
- `package.json`

A2 y A3 pueden usar estos archivos después de este checkpoint.

### Checkpoint 2 (A2 termina blogs) — en ~5h
**A2 emite git commit `feat(a2): migrate 46 blogs + 7 subvencion subcarpetas`**

### Checkpoint 3 (A3 termina páginas) — en ~6h
**A3 emite git commit `feat(a3): migrate non-blog pages + split calculator`**

### Checkpoint FINAL (integrador)
- Hace `git merge octopus` o sequential merge
- `npm install` consolidado
- `npm run build`
- QA diff HTML byte-a-byte en los 3 blogs piloto

## ⚠️ Reglas de coexistencia

### Si A1 NO ha publicado BaseLayout.astro aún
- A2 sigue creando `.md` files (no las usa aún)
- A3 lee el contenido directamente, importa `BaseLayout` cuando exista. Si no existe, usa placeholder.

### Si A3 empieza antes que A1 termine A1
- A3 puede crear sus archivos sin esperar. Usa `BaseLayout` cuando esté disponible. Si `extends BaseLayout` falla, usa inline `<head>` con las mismas clases.

### Si dos agentes chocan con el mismo archivo
- **Ganador:** el que tenga el archivo en su zona delimitada.
- Si ambos lo modifican por error, el integrador resuelve con `git diff` y toma la versión mejor.

### Si `content/config.ts` es tocado por A1 y A3
- A1 crea con schema `blog`.
- A3 EDITA (no rewrite) para añadir schemas `empresas` y `barrios`.
- Si hay conflicto de merge, A3 gana porque A3 sabe su zona.

## 🚀 Orden de lanzamiento

El orquestrador lanza a la vez:
1. **A1** (setup + blog piloto + hub)
2. **A2** (migración masiva 46 blogs + script)
3. **A3** (no-blog pages + calculator split)

Los 3 corren con `mode="run"` (background), el orquestrador espera completion events.

## 📞 Quién reporta a quién
- A1 reporta completion event → orquestrador hace checkpoint 1
- A2 reporta completion event → orquestrador hace checkpoint 2
- A3 reporta completion event → orquestrador hace checkpoint 3
- Cuando los 3 terminan → integrador (orquestrador) hace build + QA
