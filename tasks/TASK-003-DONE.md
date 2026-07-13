# TASK-003-DONE: Admin — Gestión de restaurantes y mesas

## Fecha de completion
2026-07-11

## Resumen
Se crearon las 3 páginas del panel admin de restaurantes en Next.js.

## Archivos creados/modificados

### 1. `/home/ubuntu/.openclaw/workspace/lead-machine/frontend/app/web-viva/admin/restaurants/page.tsx`
- Lista de restaurantes con grid de cards
- Mock data: 3 restaurantes (El Molino, La Tagliatella, Marisko)
- Modal crear restaurante: name, slug (auto-generado desde name), address, phone, email
- Validación de slug con patrón a-z0-9-
- GET desde mock (fallback vacío listo para API real)

### 2. `/home/ubuntu/.openclaw/workspace/lead-machine/frontend/app/web-viva/admin/restaurants/[id]/page.tsx`
- Dashboard restaurante con header (nombre, slug, dirección)
- 4 cards de resumen mock: reservas hoy, ocupación %, mesas activas, stock bajo
- 3 enlaces de navegación: Mesas, Reservas, Carta (placeholder)

### 3. `/home/ubuntu/.openclaw/workspace/lead-machine/frontend/app/web-viva/admin/restaurants/[id]/tables/page.tsx`
- Lista de mesas con tabla (nombre, sala, sillas, estado)
- Filtro por sala
- Modal crear mesa: name, sala, chairs
- Modal editar mesa existente
- Soft delete (desactivar) / reactivar
- Mock data por restaurante

## Fix adicional
- `reservations/page.tsx` contenía markdown en lugar de JSX → se reescribió completamente como componente React funcional con calendario semanal, vista por día, modal crear y modal detalle con cambio de estado

## Verificacion
```
cd /home/ubuntu/.openclaw/workspace/lead-machine/frontend && npm run build
✓ Compiled successfully — 0 errores
```

Rutas verificadas:
- `/web-viva/admin/restaurants` → ✅ (Static)
- `/web-viva/admin/restaurants/[id]` → ✅ (Dynamic)
- `/web-viva/admin/restaurants/[id]/tables` → ✅ (Dynamic)
- `/web-viva/admin/restaurants/[id]/reservations` → ✅ (Dynamic)

## Diseño
- Estilo consistente con admin existente (bg-slate-50, cards blancas, bordes slate-200)
- Header sticky con navegación breadcrumbs
- Spinner de carga, empty states con iconos
- Modales con backdrop, forms con validación
- Tipado TypeScript completo

## Notas
- Datos 100% mock (hardcoded) — UI funciona sin backend
- Los IDs de restaurante en mock: `1`, `2`, `3`
- Para conectar con API real: reemplazar `setTimeout` + mock por `fetch('/api/crm/restaurants')` con try/catch
