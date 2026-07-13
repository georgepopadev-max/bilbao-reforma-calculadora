# T-011: WhatsApp recordatorios + link de cancelación

## Objetivo
Job que envía recordatorios de reserva por WhatsApp y página pública para cancelar con token.

## Proyecto
`/home/ubuntu/.openclaw/workspace/lead-machine/backend/`

---

## PARTE A: Servicio de recordatorios WhatsApp

### Crear `app/services/whatsapp_reminder.py`

```python
"""
whatsapp_reminder.py — Job de recordatorios WhatsApp.
Se ejecuta periódicamente (cada hora vía cron en el backend).
"""
from datetime import datetime, timedelta
from app.services.supabase_client import get_supabase_admin
from app.notifications import send_whatsapp_message

def send_reminder_for_reservation(reservation: dict) -> bool:
    """
    Envía WhatsApp de recordatorio para una reserva.
    Devuelve True si se envió, False si falló.
    """
    customer_name = reservation["customer_name"]
    date = reservation["date"]
    time_start = reservation["time_start"]
    restaurant_id = reservation["restaurant_id"]

    # Obtener config del restaurante para el nombre
    supabase = get_supabase_admin()
    r = supabase.table("restaurants").select("name").eq(
        "id", restaurant_id
    ).single().execute()
    restaurant_name = r.data["name"] if r.data else "tu restaurante"

    cancel_url = f"https://webviva.com/reservas/{reservation['id']}/cancelar?token={reservation['cancellation_token']}"

    message = (
        f"Hola {customer_name} 👋\n\n"
        f"Te recordamos tu reserva en {restaurant_name} para el "
        f"{date} a las {time_start}.\n\n"
        f"¿Vas a poder venir? Responde SÍ o pulsa para cancelar:\n"
        f"{cancel_url}\n\n"
        f"¡Te esperamos! 🍽️"
    )

    return send_whatsapp_message(
        to=reservation["customer_phone"],
        message=message
    )


def run_reminder_job():
    """
    Busca reservas confirmadas en las próximas 2-2.5 horas sin reminder_sent.
    Envía recordatorio y marca reminder_sent = True.
    """
    supabase = get_supabase_admin()
    now = datetime.utcnow()
    window_start = now + timedelta(hours=2)
    window_end = now + timedelta(hours=2, minutes=30)

    # Reservas confirmadas sin recordatorio, dentro de la ventana
    result = supabase.table("reservations").select("*").eq(
        "status", "confirmed"
    ).eq("reminder_sent", False).execute()

    sent = 0
    failed = 0

    for res in result.data:
        try:
            # Verificar que está en ventana
            res_datetime = datetime.combine(
                datetime.strptime(res["date"], "%Y-%m-%d").date(),
                datetime.strptime(res["time_start"], "%H:%M").time()
            )
            # Convertir a naive para comparar
            res_datetime = res_datetime.replace(tzinfo=None)
            if window_start <= res_datetime <= window_end:
                ok = send_reminder_for_reservation(res)
                if ok:
                    supabase.table("reservations").update(
                        {"reminder_sent": True}
                    ).eq("id", res["id"]).execute()
                    sent += 1
                else:
                    failed += 1
        except Exception as e:
            print(f"Error procesando reserva {res['id']}: {e}")
            failed += 1

    return {"sent": sent, "failed": failed}
```

### Endpoint para ejecutar el job (via HTTP trigger)

En `app/routers/crm_reservations.py`, añadir:

```python
@router.post("/reminders/send")
async def send_reminders():
    """Endpoint para触发 el job de recordatorios. En producción se llama desde un cron."""
    from app.services.whatsapp_reminder import run_reminder_job
    result = run_reminder_job()
    return result
```

### Verificar `app/notifications.py` (Twilio)

Revisar que `send_whatsapp_message` existe y funciona. Si no existe, crearlo:

```python
import os
from twilio.rest import Client

def send_whatsapp_message(to: str, message: str) -> bool:
    """
    Envía mensaje WhatsApp via Twilio.
    to: número en formato +34XXXXXXXXX
    """
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    from_number = os.environ.get("TWILIO_WHATSAPP_FROM")

    if not all([account_sid, auth_token, from_number]):
        print("Twilio no configurado, saltando envío de WhatsApp")
        return False

    client = Client(account_sid, auth_token)
    try:
        client.messages.create(
            body=message,
            from_=f"whatsapp:{from_number}",
            to=f"whatsapp:{to}"
        )
        return True
    except Exception as e:
        print(f"Error enviando WhatsApp: {e}")
        return False
```

---

## PARTE B: Página pública de cancelación

### Crear `frontend/app/web-viva/cancelar/[id]/page.tsx`

```
GET  /reservas/{id}/cancelar?token=xxx
```

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CancelarPage() {
  const params = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<'loading' | 'confirm' | 'success' | 'error'>('loading');
  const [reservation, setReservation] = useState<any>(null);

  useEffect(() => {
    // Obtener datos de la reserva
    fetch(`/api/crm/reservations/${params.get('id')}`)
      .then(r => r.json())
      .then(data => {
        if (data.cancellation_token === token) {
          setReservation(data);
          setStatus('confirm');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [params, token]);

  async function handleCancel() {
    const res = await fetch(`/api/crm/reservations/${reservation.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    if (res.ok) setStatus('success');
    else setStatus('error');
  }

  if (status === 'loading') return <div className="p-8 text-center">Verificando...</div>;

  if (status === 'error') return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Enlace no válido</h1>
        <p className="mt-2 text-slate-600">Este enlace de cancelación no es válido o ya ha sido utilizado.</p>
        <Link href="/" className="mt-4 inline-block text-indigo-600 underline">Volver al inicio</Link>
      </div>
    </div>
  );

  if (status === 'success') return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-slate-900">Reserva cancelada</h1>
        <p className="mt-2 text-slate-600">Tu reserva ha sido cancelada. Esperamos verte pronto.</p>
        <Link href="/" className="mt-4 inline-block text-indigo-600 underline">Volver al inicio</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Cancelar reserva</h1>
        <p className="text-slate-600 mb-2">
          ¿Quieres cancelar tu reserva en <strong>{reservation?.restaurant_id}</strong>?
        </p>
        <p className="text-slate-600 mb-6">
          <strong>{reservation?.date}</strong> a las <strong>{reservation?.time_start}</strong> para <strong>{reservation?.party_size}</strong> personas.
        </p>
        <div className="flex gap-3">
          <Link href="/" className="flex-1 text-center border border-slate-300 rounded-xl py-3 font-medium text-slate-700 hover:bg-slate-50">
            No, mantener reserva
          </Link>
          <button
            onClick={handleCancel}
            className="flex-1 bg-red-600 text-white rounded-xl py-3 font-semibold hover:bg-red-700"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Verificación
1. `python -c "from app.services.whatsapp_reminder import run_reminder_job; print('OK')"`
2. `cd frontend && npm run build` — 0 errores
