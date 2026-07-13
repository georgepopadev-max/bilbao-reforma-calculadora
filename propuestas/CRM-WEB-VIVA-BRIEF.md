# CRM Web Viva — Brief Completo

## Quién valida
George (@+34642147856) — confirmado 2026-07-11 15:09 UTC

## Stack
- Frontend: Next.js (ya existe en `/frontend`)
- Backend: FastAPI (ya existe en `/backend`)
- DB: Supabase (PostgreSQL)
- WhatsApp: Twilio (ya configurado en backend)

## Modelo de datos completo

```
restaurant
  - id (uuid)
  - name
  - slug (único)
  - address, phone, email
  - config JSON: { slot_duration_minutes, turn_duration_minutes, default_turns: [{name, start_time, end_time}], max_cover_per_slot, ... }
  - created_at, updated_at

table
  - id, restaurant_id (FK), name, sala, chairs, position_x, position_y, active
  - status: enum('available','reserved','occupied','maintenance')

reservation
  - id (uuid)
  - restaurant_id (FK)
  - table_id (FK, nullable)
  - date, time_start, time_end
  - party_size
  - customer_name, customer_phone, customer_email
  - status: enum('confirmed','cancelled','completed','no_show')
  - source: enum('web','phone','walkin','admin')
  - notes
  - cancellation_token (uuid, para link cancelar)
  - reminder_sent (bool)
  - created_at

menu
  - id, restaurant_id (FK)
  - name, valid_from, valid_until, active

category
  - id, menu_id (FK), name, description, sort_order, active

dish
  - id, category_id (FK)
  - name, description, price, photo_url, allergens (text[]), active

dish_variant
  - id, dish_id (FK)
  - name, price_extra

recipe_line
  - id, dish_id (FK), ingredient_id (FK)
  - quantity, unit

ingredient
  - id, restaurant_id (FK)
  - name, unit (kg|l|uds|ud)
  - current_stock, alert_threshold
  - auto_deduct_reservation (bool)
  - created_at

stock_movement
  - id, ingredient_id (FK), restaurant_id (FK)
  - type: enum('in','out','manual')
  - quantity (positive)
  - reference (reservation_id | supplier_order_id | manual_note)
  - created_at

supplier
  - id, restaurant_id (FK)
  - name, phone, email, address, notes

supplier_order
  - id, restaurant_id (FK), supplier_id (FK)
  - date, status: enum('pending','confirmed','delivered','cancelled')
  - total

supplier_order_line
  - id, supplier_order_id (FK), ingredient_id (FK)
  - quantity, unit_price

user (ya existe — ampliar con restaurant_id FK para login restaurante)
```

## Decisiones confirmadas

| Pregunta | Respuesta |
|---|---|
| Calendario | Libre configuración por restaurante (slot duration, turnos, horarios) |
| Stock | Manual + opción lógica: si auto_deduct_reservation=true, al confirmar reserva descuenta ingredientes |
| Multi-restaurante | Sí — cada restaurante su config, mesas, carta, stock |
| Web ↔ CRM | Web consulta disponibilidad vía API antes de mostrar horarios |
| Recordatorios | WhatsApp (Twilio) — confirmación + recordatorio 2h antes con link cancelar |

## Reglas de negocio

### Slots de reserva
- Cada restaurante define turnos (ej: "Comida" 13:00-15:00, "Cena" 20:00-23:00)
- Dentro de cada turno: slots de X minutos (configurable, ej: 60min = 1 slot por mesa/hora)
- Capacidad por slot = suma de sillas de mesas disponibles ÷ cover_medio (configurable, ej: 2)
- Si mesa(s) disponible(s) para el slot → disponible

### Stock automático
- En ingredient: `auto_deduct_reservation = true` → al confirmar reserva, buscar recipe_lines del plato solicitado
- Opción: cada reserva indica qué platos se van a pedir (o se marca en closing del turno)
- Si no hay stock suficiente → alerta en admin, no bloquea reserva

### Cancelación de reserva
- Al crear: generar `cancellation_token = uuid`
- Enviar por WhatsApp: "Pincha aquí para cancelar: https://webviva.com/reservas/{id}/cancelar?token={token}"
- GET: mostrar página confirmar cancelación
- POST con token válido: marcar cancelled

### Recordatorio WhatsApp
- Job: cada hora, buscar reservas confirmadas en las próximas 2h sin reminder_sent
- Enviar: "Hola {name}, te recordarmos tu reserva mañana {date} a las {time}. ¿Vas a poder venir? Responde SÍ o pincha para cancelar: {cancel_url}"
- Marcar reminder_sent = true

## Migraciones necesarias

### Fase 1 (Sprint 1)
- `001_restaurant_config.sql` — restaurants, tables
- `002_reservations_enhanced.sql` — reservations con campos nuevos
- `003_menu_system.sql` — menus, categories, dishes, dish_variants
- `004_recipe_ingredients.sql` — ingredients, recipe_lines
- `005_stock_movements.sql` — stock_movements, suppliers, supplier_orders, supplier_order_lines

## API endpoints

```
Backend FastAPI:

/api/crm/restaurants          GET, POST
/api/crm/restaurants/{id}     GET, PUT, DELETE
/api/crm/restaurants/{id}/tables     GET, POST
/api/crm/restaurants/{id}/tables/{t} PUT, DELETE
/api/crm/restaurants/{id}/reservations    GET (lista con filtros)
                                                   POST (crear, con disponibilidad en tiempo real)
                                                   PUT /{rid}/cancelar  (con token)
                                                   GET /{rid}/cancelar  (confirmar token)
                                                   POST /{rid}/status   (confirmar/no_show/completar)
                                                   GET /availability?restaurant_id=&date=&party_size= (slots disponibles con config real)
/api/crm/restaurants/{id}/menus        GET, POST
/api/crm/restaurants/{id}/categories  GET, POST
/api/crm/restaurants/{id}/dishes       GET, POST, PUT
/api/crm/restaurants/{id}/ingredients GET, POST
/api/crm/restaurants/{id}/stock        GET (stock actual)
                                          POST (movimiento manual)
/api/crm/restaurants/{id}/suppliers   GET, POST
/api/crm/restaurants/{id}/supplier-orders GET, POST

Frontend admin:
/web-viva/admin/restaurants           — lista restaurantes
/web-viva/admin/restaurants/[id]     — detalle/config
/web-viva/admin/restaurants/[id]/tables   — gestión mesas
/web-viva/admin/restaurants/[id]/reservations  — calendario reservas
/web-viva/admin/restaurants/[id]/menu  — editor carta
/web-viva/admin/restaurants/[id]/stock  — stock + pedidos

Frontend pública (web demo):
GET /api/public/availability?slug=&date=&party_size= → slots disponibles (sin auth)
POST /api/public/reservations → crear reserva (captcha?)

Cancelación pública:
GET /reservas/[id]/cancelar → página confirmar
POST /reservas/[id]/cancelar → cancelar con token
```

## Estructura archivos

```
backend/
  app/
    routers/
      crm_restaurants.py
      crm_reservations.py
      crm_menus.py
      crm_stock.py
      public_reservations.py    (disponible sin auth para web pública)
    schemas/
      crm_restaurants.py
      crm_reservations.py
      crm_menus.py
      crm_stock.py
    services/
      availability.py           (lógica de cálculo de slots disponibles)
      stock_deduction.py       (lógica de deducción automática de stock)
      whatsapp_reminder.py      (job de recordatorios)
    migrations/
      001_...sql
      002_...sql
      ...

frontend/
  app/
    web-viva/admin/restaurants/[id]/
      page.tsx                  — dashboard restaurante
      tables/page.tsx           — gestión mesas
      reservations/page.tsx     — calendario reservas
      menu/page.tsx             — editor carta
      stock/page.tsx            — stock + pedidos
    web-viva/admin/restaurants/page.tsx  — lista restaurantes
    web-viva/admin/restaurants/new/page.tsx — crear restaurante
    api/
      public/
        availability/route.ts   — GET slots disponibles (público)
        reservations/route.ts   — POST crear reserva (público)
```

## Prioridad de desarrollo

1. ✅ T-001: Modelo de datos + migraciones SQL (restaurants, tables, reservations mejoradas)
2. ✅ T-002: API restaurants + tables (CRUD)
3. ✅ T-003: Admin — panel restaurante + gestión de mesas
4. ✅ T-004: API disponibilidad con slots configurables (lógica real)
5. ✅ T-005: Admin — calendario reservas con disponibilidad real
6. ✅ T-006: Modelo + API menús y platos
7. ✅ T-007: Admin — editor de carta
8. ✅ T-008: Ingredientes + movimientos stock + proveedores
9. ✅ T-009: Admin — stock + pedidos proveedor
10. ✅ T-010: Lógica automática de stock
11. ✅ T-011: Integración web pública con disponibilidad real
12. ✅ T-012: WhatsApp recordatorios con link cancelación

## Reglas de implementación

- Auth: los endpoints `/api/crm/*` requieren login de admin (George) — misma auth que el resto del sistema
- Los endpoints `/api/public/*` son públicos (para las web de los restaurantes)
- Cada endpoint devuelve errores 400/404/409/500 con mensaje claro en español
- El frontend admin usa el diseño existente del portal (sandbox, cards, etc.)
- Build verde antes de cada commit
- Máximo 4 agentes concurrently
- Duración máxima 20 min por tarea — si se excede, partir la tarea
