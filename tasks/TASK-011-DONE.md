# TASK-011 — DONE ✅

## Objetivo
Job de recordatorios WhatsApp + página pública de cancelación con token.

---

## PARTE A — Backend

### 1. `app/notifications.py` — añadida función `send_whatsapp_message()`
Ya existía `NotificationService` con método `send_whatsapp()`. Se añadió la función standalone `send_whatsapp_message(to, message)` que usa `notification_service` internamente y devuelve `bool`.

### 2. `app/services/whatsapp_reminder.py` — creado ✅
- `send_reminder_for_reservation(reservation)` → envía WhatsApp de recordatorio y devuelve bool
- `run_reminder_job()` → busca reservas confirmadas en ventana 2-2.5h, envía recordatorio, marca `reminder_sent = True`

### 3. `app/routers/crm_reservations.py` — endpoint añadido ✅
```python
POST /api/crm/reservations/reminders/send
```
Ejecuta `run_reminder_job()` y devuelve `{"sent": N, "failed": N}`.

### 4. Verificación backend
```bash
cd lead-machine/backend
.venv/bin/python3 -m py_compile app/services/whatsapp_reminder.py   # OK
.venv/bin/python3 -m py_compile app/routers/crm_reservations.py       # OK
.venv/bin/python3 -c "from app.services.whatsapp_reminder import run_reminder_job; print('OK')"  # OK
```
**Resultado: Backend OK** ✅

---

## PARTE B — Frontend

### 5. `app/web-viva/cancelar/[id]/page.tsx` — creado ✅
Página completa de cancelación:
- `GET /reservas/{id}/cancelar?token=xxx`
- Estados: loading → confirm → success | error
- Valida token contra `cancellation_token` de la reserva
- `PATCH /api/crm/reservations/{id}/status` con `{status: "cancelled"}`
- UI: mensaje de error si token inválido, confirmación con datos de la reserva, pantalla de éxito

### 6. Verificación frontend
```bash
cd lead-machine/frontend && npm run build
```
**Resultado: Compiled successfully — 0 errores** ✅
Nueva ruta visible en build output:
```
ƒ /web-viva/cancelar/[id]   1.26 kB   95.5 kB
```

---

## Notas de implementación
- El venv de Python está en `backend/.venv` (no usar `python3` del sistema, usar `.venv/bin/python3`)
- El `send_whatsapp_message` es un wrapper sobre el `NotificationService` existente
- El job está diseñado para ejecutarse cada hora via cron calling `POST /api/crm/reservations/reminders/send`
