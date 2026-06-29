# T-003 [ALTA] — H2 con keywords long-tail en blogs débiles

## Estado: PENDIENTE
## Estimación: 3h

## 🎯 Objetivo
Blogs con pocas secciones (under 5 H2) tienen peor posicionamiento en Google. Esta tarea enriquece ~30 blogs añadiendo 2-3 H2 con keywords long-tail específicas.

## 📋 Acciones atómicas

### A. Identificar blogs débiles
```bash
cd /home/ubuntu/.openclaw/workspace/bilbao-reforma-calculadora
echo "=== Blogs con menos de 5 H2 ==="
for f in $(find dist/blog -name "*.html"); do
  count=$(grep -c '<h2' "$f" 2>/dev/null)
  if [ "$count" -lt 5 ]; then
    echo "[$count H2] $f"
  fi
done | head -30
```

### B. Estrategia de keywords long-tail

**Investigación rápida (sin herramientas externas):**
- Buscar en Google "¿Cuánto cuesta... Bilbao 2026" (no entrar, leer People Also Ask)
- Buscar el blog en cuestión y ver la sección "También te puede interesar" de Google
- Identificar long-tail con 4+ palabras + ciudad + año

**Banco de keywords long-tail por categoría:**
- Reforma baño: "cuánto cuesta reformar un baño pequeño Bilbao", "reforma baño sin obra Bilbao", "baño reforma 3 días Bilbao"
- Reforma cocina: "presupuesto reforma cocina Bilbao cuanto", "reformar cocina abierta al salón Bilbao", "reforma cocina sin obras Bilbao 2026"
- Reforma integral: "reforma integral piso antiguo Bilbao", "reforma integral con cambio distribución Bilbao"
- Suelo: "cambiar suelo sin levantar viejo Bilbao", "suelo radiante precio m2 Bilbao"
- Subvenciones: "subvenciones cambio ventanas Bilbao 2026", "ayudas rehabilitación fachada Bilbao"

### C. Por cada blog identificado, añadir 2-3 H2

**Patrón:**
```markdown
## [Pregunta long-tail con keyword natural]

[Contenido específico de 200-400 palabras que responda a la pregunta]
[Listas, ejemplos reales, datos específicos]
```

**Reglas:**
- H2 natural, NO keyword stuffing
- Contenido ÚTIL, no relleno
- Mínimo 150 palabras por nuevo H2
- Si la pregunta es respondida ya en el blog → reescribir como H2
- Si NO está respondida → añadir nueva sección

### D. Implementación
1. Identificar blogs débiles (paso A)
2. Por cada uno:
   - Leer el contenido actual
   - Identificar 2-3 long-tail que SÍ encajan
   - Para cada long-tail:
     - Si ya hay info → sacar como H2 propio
     - Si falta → escribir nuevo párrafo
3. Actualizar el .md en src/content/blog/
4. Rebuild

### E. Verificar
```bash
# Antes: <5 H2
# Después: >=5 H2
for f in $(find dist/blog -name "*.html"); do
  count=$(grep -c '<h2' "$f" 2>/dev/null)
  if [ "$count" -lt 5 ]; then
    echo "SIGUE DÉBIL: [$count H2] $f"
  fi
done
# Debe ser 0 o solo blogs cortos que no admitan más
```

## 🚦 QA TEXTOS (CRÍTICO)
Cada nuevo H2 debe tener copy que:
- Responda REALMENTE a la pregunta del H2 (no stuffing)
- Sea útil para alguien buscando esa keyword
- NO sea spun content ni parafraseo de Google
- Mantenga brand voice (cercano, profesional, datos reales 2026)
- Cite fuentes cuando sean datos específicos (ej: "según Ayuntamiento de Bilbao")
- Longitud: 150-400 palabras por sección

### Anti-patrones a evitar:
❌ H2 + texto sin valor ("En resumen, podemos decir que reformar una cocina puede variar mucho dependiendo de varios factores como...")
✅ H2 + contenido accionable + específico + datos

## 📤 Output esperado
- Lista de blogs modificados con conteo antes/después H2
- Listado de keywords long-tail usadas (con link al blog)
- Output build verde
- Verificación final: blogs con >=5 H2 (o justificados los <5)

## 📚 Contexto
- `src/content/blog/*.md` (los blogs a modificar)
- `legacy/blog/*.html` (referencia original)
- Archivo de keywords long-tail del sector (si A1 lo creó)
