# TASK-004-DONE: Backend — Disponibilidad + Stock Deduction

## Fecha de completion
2026-07-11

## Resumen
Implementación completa de la lógica de disponibilidad (PARTE A: TASK-004) y deducción automática de stock (PARTE A: TASK-009) en el backend FastAPI.

## Archivos creados

### 1. `app/services/availability.py`
- Función `get_available_slots(restaurant_id, target_date, party_size)`
- Lee config del restaurante (turns, slot_duration_minutes, average_cover)
- Obtiene reservas confirmadas del día y mesas activas
- Para cada slot configurable: verifica solapamiento de reservas y filtro por tamaño de mesa
- Devuelve dict con `all_slots`, `available_slots`, `booked_slots`

### 2. `app/schemas/crm_reservations.py`
- `SlotInfo`: time_start, time_end, available, tables_fit
- `DayAvailability`: date, slots
- `ReservationCreate`: restaurant_id, date, time_start, party_size, customer_name, customer_phone, customer_email, table_id, notes, **dishes** (opcional, añadido de TASK-009)
- `ReservationStatusUpdate`: status
- `ReservationResponse`: todos los campos incluyendo cancellation_token y source

### 3. `app/services/stock_deduction.py`
- Función `deduct_stock_for_reservation(reservation_id, restaurant_id, dishes)`
- Por cada plato en `dishes`: obtiene recipe_lines y descuenta ingredientes con `auto_deduct_reservation=True`
- Registra stock_movement tipo 'out' por cada deducción
- Devuelve `{deducted, skipped, warnings}`

### 4. `app/routers/crm_reservations.py` (reescrito)
- `GET /api/crm/reservations/availability` — slots disponibles (usa get_available_slots)
- `POST /api/crm/reservations` — crear reserva con verificación de disponibilidad + deducción de stock
- `GET /api/crm/reservations/{id}` — obtener una reserva
- `GET /api/crm/reservations?restaurant_id=&date_from=&date_to=&status=` — listar
- `PATCH /api/crm/reservations/{id}/status` — cambiar estado

### 5. `main.py` (modificado)
- Importado `crm_reservations` router
- Registrado `app.include_router(crm_reservations.router)`

## Verificacion
```
cd /home/ubuntu/.openclaw/workspace/lead-machine/backend && \
  python3 -m py_compile app/services/availability.py && \
  python3 -m py_compile app/services/stock_deduction.py && \
  python3 -m py_compile app/routers/crm_reservations.py && \
  python3 -m py_compile app/schemas/crm_reservations.py && \
  echo "All OK"
→ All OK
```

## Notas
- Los endpoints de disponibilidad usan `restaurant_id` (UUID) en vez de `slug`
- El schema ReservationCreate incluye `dishes: Optional[List[dict]]` para la deducción automática de stock
- La deducción de stock se ejecuta dentro de `create_reservation` de forma no-bloqueante (warning en caso de error, no falla la reserva)
- La tabla `reservations` en Supabase debe tener: id, restaurant_id, table_id, date, time_start, time_end, party_size, customer_name, customer_phone, customer_email, status, source, notes, cancellation_token, reminder_sent
