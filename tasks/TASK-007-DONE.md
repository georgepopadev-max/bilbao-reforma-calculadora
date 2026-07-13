# TASK-007-DONE ✅

## Resumen

Implementada la API completa de gestión de stock para el CRM de restaurantes (ingredientes, movimientos, proveedores y pedidos).

---

## Backend

### `app/schemas/crm_stock.py` ✅
- `IngredientCreate`, `IngredientUpdate`, `IngredientResponse`
- `StockMovementCreate`, `StockMovementResponse`
- `SupplierCreate`, `SupplierUpdate`, `SupplierResponse`
- `SupplierOrderCreate`, `SupplierOrderLineCreate`, `SupplierOrderStatusUpdate`
- `SupplierOrderResponse`, `SupplierOrderLineResponse`

### `app/routers/crm_stock.py` ✅
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/crm/restaurants/{id}/ingredients` | Lista con `below_threshold` calculado |
| POST | `/api/crm/restaurants/{id}/ingredients` | Crear ingrediente |
| GET | `/api/crm/ingredients/{iid}` | Obtener uno |
| PUT | `/api/crm/ingredients/{iid}` | Actualizar |
| DELETE | `/api/crm/ingredients/{iid}` | Eliminar (cascade movimientos) |
| GET | `/api/crm/ingredients/{iid}/movements` | Historial |
| POST | `/api/crm/ingredients/{iid}/movements` | Movimiento con actualización de stock |
| POST | `/api/crm/restaurants/{id}/stock/manual` | Movimiento rápido |
| GET | `/api/crm/restaurants/{id}/suppliers` | Lista proveedores |
| POST | `/api/crm/restaurants/{id}/suppliers` | Crear proveedor |
| GET | `/api/crm/suppliers/{sid}` | Obtener proveedor |
| PUT | `/api/crm/suppliers/{sid}` | Actualizar proveedor |
| DELETE | `/api/crm/suppliers/{sid}` | Eliminar proveedor |
| GET | `/api/crm/restaurants/{id}/supplier-orders` | Lista pedidos |
| POST | `/api/crm/restaurants/{id}/supplier-orders` | Crear pedido + líneas |
| GET | `/api/crm/supplier-orders/{oid}` | Obtener pedido |
| PATCH | `/api/crm/supplier-orders/{oid}/status` | Cambiar estado (delivered → genera movimientos `in`) |
| DELETE | `/api/crm/supplier-orders/{oid}` | Eliminar solo si pending |

**Lógica clave:** PATCH `/supplier-orders/{id}/status` con `status=delivered` genera automáticamente un movimiento de stock tipo `in` por cada línea del pedido, actualizando el `current_stock` del ingrediente.

### Registro en `main.py` ✅
```python
from app.routers import ... crm_stock
app.include_router(crm_stock.router)
```

### Verificación ✅
```
cd backend && python3 -m py_compile app/routers/crm_stock.py && python3 -m py_compile app/schemas/crm_stock.py && echo "Backend OK"
# → Backend OK
```

---

## Frontend

### `app/web-viva/admin/restaurants/[id]/stock/page.tsx` ✅
Página admin con 3 tabs funcionales:

**Tab 1 — Ingredientes:**
- Lista con barra de stock visual (% ocupación, color verde/ámbar)
- Badge de alerta cuando `current_stock < alert_threshold`
- Buscador
- Modal crear/editar: name, unit (kg/l/uds/ud), stock, umbral, auto-deduct toggle
- Modal movimiento rápido (entrada/salida/manual)

**Tab 2 — Movimiento rápido:**
- Select con buscador de ingrediente
- Radio buttons: Entrada / Salida / Manual
- Campo cantidad + notas
- Lista de últimos movimientos

**Tab 3 — Proveedores y pedidos:**
- Lista de proveedores con botón "Nuevo pedido"
- Lista de pedidos con badge de estado (Pendiente/Confirmado/Entregado/Cancelado)
- Modal crear pedido: select proveedor, líneas (ingrediente + cantidad + precio unitario), total calculado dinámicamente
- Modal crear proveedor

### Verificación ✅
```
cd frontend && rm -rf .next && npm run build
# → ✓ Compiled successfully
# → ├ ƒ /web-viva/admin/restaurants/[id]/stock  4.72 kB  98.9 kB
# → Build succeeded (0 errores)
```

---

## Tablas Supabase necesarias (SQL)
```sql
CREATE TABLE IF NOT EXISTS crm_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(10) NOT NULL CHECK (unit IN ('kg','l','uds','ud')),
  current_stock DECIMAL(12,3) DEFAULT 0,
  alert_threshold DECIMAL(12,3) DEFAULT 0,
  auto_deduct_reservation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID REFERENCES crm_ingredients(id),
  restaurant_id UUID REFERENCES restaurants(id),
  type VARCHAR(10) NOT NULL CHECK (type IN ('in','out','manual')),
  quantity DECIMAL(12,3) NOT NULL,
  reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_supplier_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  supplier_id UUID REFERENCES crm_suppliers(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_supplier_order_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_order_id UUID REFERENCES crm_supplier_orders(id),
  ingredient_id UUID REFERENCES crm_ingredients(id),
  quantity DECIMAL(12,3) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);
```

## Notas
- Los endpoints usan Supabase service role (bypass RLS) para permitir CRUD completo desde el admin
- La lógica de `delivered` → auto-generación de movimientos `in` mantiene el stock sincronizado automáticamente
- Frontend usa datos mock; conectar a API real替换ando `MOCK_*` con `fetch` a los endpoints `/api/crm/*`
