# TASK-005-DONE — API menús + Admin editor de carta

## Fecha
2026-07-11

## Resumen
Implementación completa del sistema CRUD de menús/categorías/platos/variantes (backend) y el editor visual de carta (frontend).

---

## Backend

### Archivos creados

**`app/schemas/crm_menus.py`**
- `DishVariantSchema`, `DishVariantCreate` — variantes de plato
- `DishSchema`, `DishCreate`, `DishUpdate` — platos
- `CategorySchema`, `CategoryCreate`, `CategoryUpdate` — categorías
- `MenuSchema`, `MenuCreate`, `MenuUpdate` — menús

**`app/routers/crm_menus.py`**
Endpoints CRUD usando Supabase Admin:
```
GET    /api/crm/restaurants/{id}/menus
POST   /api/crm/restaurants/{id}/menus
GET    /api/crm/restaurants/{id}/menus/{mid}
PUT    /api/crm/restaurants/{id}/menus/{mid}
DELETE /api/crm/restaurants/{id}/menus/{mid}

GET    /api/crm/menus/{mid}/categories
POST   /api/crm/menus/{mid}/categories
PUT    /api/crm/menus/{mid}/categories/{cid}
DELETE /api/crm/menus/{mid}/categories/{cid}

GET    /api/crm/categories/{cid}/dishes
POST   /api/crm/categories/{cid}/dishes
PUT    /api/crm/dishes/{did}
DELETE /api/crm/dishes/{did}

POST   /api/crm/dishes/{did}/variants
DELETE /api/crm/variants/{vid}
```

**`main.py`** — router registrado con `app.include_router(crm_menus_router)`

### Verificación
```
cd backend && python3 -m py_compile app/routers/crm_menus.py && python3 -m py_compile app/schemas/crm_menus.py && echo "Backend OK"
```
✅ Backend OK

---

## Frontend

### Archivo creado
**`app/web-viva/admin/restaurants/[id]/menu/page.tsx`**

### Funcionalidades
- **Accordion jerárquico**: menús colapsables → categorías → platos
- **Tops de menú**: tabs para cada menú + "+ Nuevo Menú"
- **Modales**: crear/editar menú, categoría, plato
- **Plato modal**: nombre, descripción, precio, foto URL, alérgenos (toggle badges), variantes (nombre + precio_extra)
- **Variantes inline**: añadir variante directamente desde la tarjeta del plato
- **Badges alérgenos**: 11 tipos con colores diferenciados
- **Soft delete**: eliminar oculta en lugar de borrar
- **Mock data**: 2 menús con datos realistas de ejemplo

### Verificación
```
cd frontend && npm run build
```
✅ Build exitoso — 0 errores

Ruta verificada: `/web-viva/admin/restaurants/[id]/menu` aparece en el build output (5.58 kB)

---

## Notas técnicas
- El backend usa Supabase Admin para todas las operaciones
- `get_menu` carga recursivamente categorías y platos con sus variantes
- Todos los DELETE son soft delete (`active=false`)
- El frontend usa estado local React (mock data) sin llamadas API reales aún
- Los componentes están diseñados para evolver a llamadas API reales cuando el backend esté disponible
