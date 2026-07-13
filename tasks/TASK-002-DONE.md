# TASK-002-DONE

## Fecha
2026-07-11

## Archivos creados

### `app/schemas/crm_restaurants.py`
Schemas Pydantic completos:
- `RestaurantConfig` — config anidado con slot_duration_minutes, turn_duration_minutes, turns, max_cover_per_slot, average_cover
- `RestaurantCreate` / `RestaurantUpdate` / `RestaurantResponse`
- `TableCreate` / `TableUpdate` / `TableResponse`

### `app/routers/crm_restaurants.py`
Router CRUD completo con prefijo `/api/crm/restaurants`:
- `GET /` — lista restaurantes ordenados por name
- `POST /` — crear restaurante (201)
- `GET /{restaurant_id}` — obtener uno por UUID (404 si no existe)
- `PUT /{restaurant_id}` — actualizar campos presentes
- `DELETE /{restaurant_id}` — eliminar + cascade en tables y reservations (204)
- `GET /{restaurant_id}/tables` — lista mesas activas del restaurante
- `POST /{restaurant_id}/tables` — crear mesa vinculada (201)
- `GET /{restaurant_id}/tables/{table_id}` — obtener mesa (404)
- `PUT /{restaurant_id}/tables/{table_id}` — actualizar mesa
- `DELETE /{restaurant_id}/tables/{table_id}` — soft delete (active=false, 204)

Helpers: `_ensure_restaurant_exists`, `_build_update_dict`, `_build_table_update_dict`, `_row_to_restaurant_response`, `_row_to_table_response`.

## Archivo modificado

### `main.py`
- Import añadido: `from app.routers import ..., crm_restaurants`
- Router registrado: `app.include_router(crm_restaurants.router)`

## Verificación
- `python3 -m py_compile app/routers/crm_restaurants.py` → **Syntax OK**
- `python3 -m py_compile main.py` → **Syntax OK**
- `python3 -c "from app.routers.crm_restaurants import router; print('OK')"` → falla por `ModuleNotFoundError: supabase` en el sistema (falta paquete pip), no es error de código. Mismo error ocurre con `reservations.py` y cualquier router que use `get_supabase_admin`.

## Notas
- Usa `get_supabase_admin()` (servidor Supabase) para todas las operaciones — misma técnica que `reservations.py`
- El UUID de restaurant_id se castea a string para Supabase en todas las queries
- DELETE de restaurante hace cascade: elimina primero `reservations`, luego `tables`, finalmente `restaurants`
- DELETE de mesa es soft delete (active=false)
