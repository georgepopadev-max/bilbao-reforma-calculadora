# T-009: Lógica automática de stock + Integración web pública con disponibilidad real

## Objetivo
Dos cosas:
1. Lógica de deducción automática de ingredientes al confirmar reserva (si `auto_deduct_reservation=true`)
2. Modificar la web pública de demo para consultar disponibilidad real del CRM

## Proyecto
`/home/ubuntu/.openclaw/workspace/lead-machine/backend/`
`/home/ubuntu/.openclaw/workspace/lead-machine/frontend/`

---

## PARTE A: Lógica automática de stock

### Archivo a crear: `app/services/stock_deduction.py`

```python
"""
stock_deduction.py — Se ejecuta al confirmar una reserva.
Por cada plato en la reserva, busca recipe_lines y descuenta stock.
"""
from uuid import UUID
from decimal import Decimal
from app.services.supabase_client import get_supabase_admin

def deduct_stock_for_reservation(
    reservation_id: str,
    restaurant_id: str,
    dishes: list[dict] = None,  # [{dish_id, quantity}, ...]
) -> dict:
    """
    Si dishes es None, no hace nada (reserva sin carta).
    Por cada dish_id, obtiene recipe_lines, y por cada línea:
      - Si ingredient.auto_deduct_reservation == True:
        - Crea stock_movement tipo 'out' con la cantidad correspondiente
        - Actualiza current_stock del ingrediente
    Devuelve dict con {deducted: [...], skipped: [...], warnings: [...]}
    """
    supabase = get_supabase_admin()
    deducted = []
    skipped = []
    warnings = []

    if not dishes:
        return {"deducted": [], "skipped": [], "warnings": ["Sin platos asociados"]}

    for item in dishes:
        dish_id = item.get("dish_id")
        quantity = Decimal(str(item.get("quantity", 1)))

        # Obtener recipe_lines del plato
        result = supabase.table("recipe_lines").select(
            "ingredient_id, quantity, unit"
        ).eq("dish_id", dish_id).execute()

        for line in result.data:
            ingredient_id = line["ingredient_id"]
            qty_per_dish = Decimal(str(line["quantity"]))
            total_qty = qty_per_dish * quantity

            # Obtener ingrediente
            ing_result = supabase.table("ingredients").select(
                "id, name, current_stock, auto_deduct_reservation"
            ).eq("id", ingredient_id).single().execute()

            if not ing_result.data:
                warnings.append(f"Ingrediente {ingredient_id} no encontrado")
                continue

            ing = ing_result.data
            if not ing.get("auto_deduct_reservation"):
                skipped.append(f"{ing['name']}: auto-deduct desactivado")
                continue

            current = Decimal(str(ing["current_stock"]))
            new_stock = current - total_qty

            if new_stock < 0:
                warnings.append(
                    f"{ing['name']}: stock actual {current} < cantidad necesaria {total_qty}. "
                    f"Se deja a 0."
                )
                new_stock = Decimal("0")

            # Actualizar stock
            supabase.table("ingredients").update(
                {"current_stock": str(new_stock)}
            ).eq("id", ingredient_id).execute()

            # Registrar movimiento
            supabase.table("stock_movements").insert({
                "ingredient_id": ingredient_id,
                "restaurant_id": restaurant_id,
                "type": "out",
                "quantity": str(total_qty),
                "reference": reservation_id,
                "notes": f"Reserva {reservation_id} - {int(quantity)} platos"
            }).execute()

            deducted.append(
                f"{ing['name']}: -{total_qty} {line['unit']}"
            )

    return {
        "deducted": deducted,
        "skipped": skipped,
        "warnings": warnings,
    }
```

### Modificar router de reservas
En `app/routers/crm_reservations.py`, dentro de `create_reservation`:
- Aceptar parámetro opcional `dishes: list[dict]` en `ReservationCreate`
- Después de crear la reserva, llamar a `deduct_stock_for_reservation(res.id, restaurant_id, dishes)`

### Modificar schema ReservationCreate
En `app/schemas/crm_reservations.py`, añadir a `ReservationCreate`:
```python
dishes: Optional[List[dict]] = None  # [{dish_id: uuid, quantity: int}, ...]
```

---

## PARTE B: Web pública consulta disponibilidad real

### Modificar `ReservationForm.tsx` del DemoTemplate

En la demo, el formulario de reserva actual tiene slots hardcoded (13:00, 14:00...).
Modificar para que:

1. Al seleccionar fecha → hacer GET `/api/crm/reservations/availability?restaurant_id={id}&date={date}&party_size={size}`
2. Mostrar slots devueltos por la API (disponibles = selectable, ocupados = disabled)
3. Al enviar → POST `/api/crm/reservations`

**Cambios en `components/web-viva/ReservationForm.tsx`:**
- Estado adicional: `availableSlots: string[]`
- `useEffect`: cuando `selectedDate` cambia, hacer fetch de disponibilidad
- Los time slots mostrados se construyen desde `availableSlots` en vez de array hardcoded
- Si la API falla → fallback a slots hardcoded con mensaje de error sutil

### Endpoint público de disponibilidad

**Crear** `frontend/app/api/public/availability/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const date = searchParams.get('date');
  const partySize = searchParams.get('party_size') || '2';

  if (!slug || !date) {
    return NextResponse.json(
      { error: 'Faltan parámetros: slug y date son obligatorios' },
      { status: 400 }
    );
  }

  try {
    // Llamar al backend FastAPI
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const res = await fetch(
      `${backendUrl}/api/crm/reservations/availability?restaurant_id=${slug}&date=${date}&party_size=${partySize}`,
      { next: { revalidate: 0 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Error consultando disponibilidad' },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: 'Backend no disponible' },
      { status: 503 }
    );
  }
}
```

**Crear** `frontend/app/api/public/reservations/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    const res = await fetch(`${backendUrl}/api/crm/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}
```

## Verificación
1. `python -c "from app.services.stock_deduction import deduct_stock_for_reservation; print('OK')"`
2. `cd frontend && npm run build` — 0 errores
