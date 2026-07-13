# TASK-001-DONE

## Archivo creado

`/home/ubuntu/.openclaw/workspace/lead-machine/backend/migrations/007_restaurants_crm.sql`

## Tablas definidas (13 nuevas)

| # | Tabla | Dependencias |
|---|-------|--------------|
| 1 | `restaurants` | ninguna |
| 2 | `tables` | `restaurants` |
| 3 | `reservations` | `restaurants`, `tables` |
| 4 | `menus` | `restaurants` |
| 5 | `categories` | `menus` |
| 6 | `dishes` | `categories` |
| 7 | `dish_variants` | `dishes` |
| 8 | `ingredients` | `restaurants` |
| 9 | `recipe_lines` | `dishes`, `ingredients` |
| 10 | `stock_movements` | `ingredients`, `restaurants` |
| 11 | `suppliers` | `restaurants` |
| 12 | `supplier_orders` | `suppliers`, `restaurants` |
| 13 | `supplier_order_lines` | `supplier_orders`, `ingredients` |

También se hace `ALTER TABLE users ADD COLUMN restaurant_id` (idempotente, envuelto en `DO $$`).

## Cambios respecto a la versión anterior

- **Sustitución de la tabla `reservations`** existente (basada en `restaurant_slug TEXT`) por la nueva versión con `restaurant_id UUID` y campos ampliados (`time_end`, `customer_email`, `source`, `cancellation_token`, `reminder_sent`, `no_show` status, etc.).
- Se incluye `DROP TABLE IF EXISTS reservations CASCADE;` al inicio para garantizar re-ejecución limpia.

## Notas importantes para siguientes tareas

1. **Ejecutar con PostgreSQL real**: la verificación de sintaxis se hizo con checks estáticos (paréntesis, comillas, referencias FK). Para validación completa se necesita una BD PostgreSQL con `psycopg2` o `psql`.

2. **Orden de ejecución**: el archivo usa `BEGIN;` / `COMMIT;` y las tablas están en orden correcto de dependencias FK. Es ejecutable como script único.

3. **La tabla `users` ya existe** — el `ALTER TABLE` es idempotente (comprobado con `information_schema`).

4. **No usa Alembic Python** — es un SQL puro. Si el proyecto requiere migraciones vía Alembic (`alembic upgrade head`), habría que crear archivos Python en `alembic/versions/`. El script actual es SQL puro ejecutable con `psql` o similar.

5. **Indices creados**: 17 índices adicionales para las tablas más frecuentes (`restaurant_id`, `menu_id`, `category_id`, `dish_id`, etc.).

6. **Uniques y checks**:
   - `restaurants.slug` → UNIQUE
   - `reservations(restaurant_id, table_id, date, time_start)` → UNIQUE
   - `supplier_order_lines` → UNIQUE implícito por PK
   - CHECK constraints en `party_size` (1-20), `status` (enum), `unit` (kg/l/uds/ud), `type` stock (in/out/manual), etc.

7. **Siguiente paso lógico**: crear el modelo SQLAlchemy en `app/models.py` para estas 13 tablas y регистрировать la migración en Alembic si se desea gestión de versiones Python.
