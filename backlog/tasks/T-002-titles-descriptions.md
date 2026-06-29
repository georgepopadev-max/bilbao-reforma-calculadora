# T-002 [ALTA] — Optimizar titles + descriptions

## Estado: PENDIENTE
## Estimación: 2h

## 🎯 Objetivo
Google penaliza titles >60 chars y descriptions >155 chars. Esta tarea optimiza TODAS las 97 páginas para SEO óptimo.

## 📋 Acciones atómicas

### A. Auditar longitudes actuales
```bash
cd /home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora
echo "=== TITLES >60 chars (penalización Google) ==="
for f in $(find dist -name "*.html"); do
  title=$(grep -m1 '<title>' "$f" 2>/dev/null | sed 's/<[^>]*>//g' | sed 's/^[[:space:]]*//')
  len=${#title}
  if [ "$len" -gt 60 ]; then
    echo "[$len] $f: $title"
  fi
done | sort -rn | head -20

echo ""
echo "=== DESCRIPTIONS >155 chars ==="
for f in $(find dist -name "*.html"); do
  desc=$(grep 'name="description"' "$f" 2>/dev/null | sed 's/.*content="//;s/".*//' | head -1)
  len=${#desc}
  if [ "$len" -gt 155 ]; then
    echo "[$len] $f: ${desc:0:80}..."
  fi
done | sort -rn | head -20
```

### B. Estrategia de reescritura

**Reglas duras:**
- Title: 50-60 chars (óptimo 55)
- Description: 140-155 chars (óptimo 150)
- Title SIEMPRE incluye keyword principal + ciudad (si aplica)
- Description SIEMPRE tiene CTA implícito ("calcula", "descubre", "ver precios")

**Patrón de title recomendado:**
```
[Keyword principal] [año] | Bilbao Reforma
```
O si no entra en 60:
```
[Keyword] [ciudad] - [subtítulo] | Bilbao Reforma
```

**Patrón de description recomendado:**
```
[Resumen valor]. [CTA]. [Keyword long-tail].
```
Ejemplo:
```
Calcula tu reforma integral en Bilbao en 2 minutos. Precios actualizados 2026 con desglose por partidas. Gratis, sin registro.
```

### C. Páginas prioritarias (las que más tráfico SEO dan)
1. `index.html` (homepage)
2. `reformas-bilbao.html`
3. `presupuesto-reforma-bilbao.html`
4. Todos los blogs (53+5+5+8 = 71 blogs)
5. `calculadora/*.html` (5 calculadoras)
6. `donostia/index.html`, `vitoria/index.html`

### D. Implementación
Para cada página:
1. Identificar si title/description está sobre límite
2. Si sobre límite → reescribir con keyword principal + estructura recomendada
3. Si dentro de límite pero con copy flojo → reescribir
4. Actualizar frontmatter del blog correspondiente o layout de la página

### E. Verificar después
```bash
echo "=== VERIFICACIÓN FINAL ==="
ok=0
bad=0
for f in $(find dist -name "*.html"); do
  title=$(grep -m1 '<title>' "$f" 2>/dev/null | sed 's/<[^>]*>//g' | sed 's/^[[:space:]]*//')
  desc=$(grep 'name="description"' "$f" 2>/dev/null | sed 's/.*content="//;s/".*//' | head -1)
  tlen=${#title}
  dlen=${#desc}
  if [ "$tlen" -le 60 ] && [ "$dlen" -le 155 ]; then
    ok=$((ok+1))
  else
    bad=$((bad+1))
    echo "MAL: t=$tlen d=$dlen $f"
  fi
done
echo "OK: $ok / MAL: $bad"
# MAL debe ser 0
```

## 🚦 QA TEXTOS (OBLIGATORIO)
Cada reescritura debe:
- Mantener coherencia con el contenido real de la página
- Incluir keyword principal al inicio del title
- Description con gancho emocional + CTA
- NO keyword stuffing
- NO títulos clickbait ("No creerás lo que...")
- Lenguaje natural, tipo conversación

### Ejemplos de BIEN y MAL:
❌ MAL: `"Reforma baño Bilbao precio presupuesto cuánto cuesta reformas baños Bilbao Bizkaia 2026"`
✅ BIEN: `"Reforma Baño Bilbao 2026: Precios Actualizados"`

❌ MAL description: `"Reforma tu baño en Bilbao con nuestra empresa de reformas. Llámanos y solicita presupuesto. Servicio profesional..."` (genérico)
✅ BIEN: `"Calcula el presupuesto de tu reforma de baño en Bilbao en 2 minutos. Precios por m² actualizados 2026 con desglose por partidas."`

## 📤 Output esperado
- Lista de páginas con title/description reescritos (diff antes/después)
- Output build verde
- Verificación final: todas <60/+155 chars
- Tiempo gastado por página (sanidad)

## 📚 Contexto
- `legacy/*.html` (referencia SEO original)
- `src/content/blog/*.md` (frontmatter `title`, `description`)
- `src/pages/*.astro` (Frontmatter)
- `src/layouts/*.astro`
