# Prácticas de Desarrollo — George

## Reglas de Oro

1. **Frontend = piel fina** — Sin lógica de negocio en componentes UI
2. **Lógica = Backend** — Validaciones, reglas, transformaciones en el backend
3. **DRY** — Si escribes el mismo patrón 2 veces, extrae a componente genérico
4. **Clean Code** — Funciones cortas, nombres claros, sin comentarios innecesarios
5. **Contexto mínimo** — Trabaja solo con los archivos de la tarea, no con todo el proyecto

## Arquitectura Frontend

```
✅ BIEN:
- Componente recibe props → renderiza
- Lógica → API/backend

❌ MAL:
- Componente con fetch, validaciones, lógica de negocio
```

## Estructura de Proyecto (ejemplo)

```
src/
├── pages/           # Rutas/pages
├── components/      # UI pura (sin lógica)
│   ├── ui/         # Componentes genéricos
│   └── features/    # Componentes de dominio
├── lib/            # Utilidades, helpers
└── api/            # Llamadas a backend (si aplica)
```

## Al Crear Componentes

- Un componente = una responsabilidad
- Props tipadas si usa TypeScript
- Comments en español si la lógica no es obvia
- CSS modules o utility classes (Tailwind) — nunca CSS inline masivo

## Al Modificar Código

1. Lee solo el archivo que vas a tocar
2. Si necesitas entender un componente relacionado, lee ese específicamente
3. No cargues todo el proyecto en contexto

## PDF Profesional

- TODO texto en español limpio (sin mixed languages)
- ID secuencial: BR-YYYY-MM-DD-NNN
- Diseño premium
- Footer RGPD correcto
- Sin emojis en documento

## Testing

- QA automático: verificar que el cambio funciona sin romper nada
- Build verde antes de entregar

## Comunicación con OpenClaw

Al terminar, reporta:
- Archivos modificados
- Decisiones de código importantes
- Problemas encontrados
- Verificar build passing
