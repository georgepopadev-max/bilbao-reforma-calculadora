# T-007: API ingredientes, stock y proveedores

## Objetivo
Router CRUD para ingredientes, movimientos de stock y proveedores.

## Proyecto
`/home/ubuntu/.openclaw/workspace/lead-machine/backend/`

## Archivos a crear

### 1. `app/schemas/crm_stock.py`

```python
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import date, datetime
from typing import Optional, List
from decimal import Decimal

# ── Ingredient ────────────────────────────────────────────────────────────────

class IngredientCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    unit: str = Field(..., pattern=r"^(kg|l|uds|ud)$")
    current_stock: Decimal = Decimal("0")
    alert_threshold: Decimal = Decimal("0")
    auto_deduct_reservation: bool = False

class IngredientUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    current_stock: Optional[Decimal] = None
    alert_threshold: Optional[Decimal] = None
    auto_deduct_reservation: Optional[bool] = None

class IngredientResponse(BaseModel):
    id: UUID
    restaurant_id: UUID
    name: str
    unit: str
    current_stock: Decimal
    alert_threshold: Decimal
    auto_deduct_reservation: bool
    created_at: datetime
    below_threshold: bool = False  # calculado

# ── Stock Movement ────────────────────────────────────────────────────────────

class StockMovementCreate(BaseModel):
    ingredient_id: UUID
    type: str = Field(..., pattern=r"^(in|out|manual)$")
    quantity: Decimal = Field(..., gt=0)
    notes: Optional[str] = None

class StockMovementResponse(BaseModel):
    id: UUID
    ingredient_id: UUID
    restaurant_id: UUID
    type: str
    quantity: Decimal
    reference: Optional[str]
    notes: Optional[str]
    created_at: datetime

# ── Supplier ────────────────────────────────────────────────────────────────

class SupplierCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class SupplierResponse(BaseModel):
    id: UUID
    restaurant_id: UUID
    name: str
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]
    notes: Optional[str]
    created_at: datetime

# ── Supplier Order ──────────────────────────────────────────────────────────

class SupplierOrderLineCreate(BaseModel):
    ingredient_id: UUID
    quantity: Decimal = Field(..., gt=0)
    unit_price: Decimal = Field(..., ge=0)

class SupplierOrderCreate(BaseModel):
    supplier_id: UUID
    lines: List[SupplierOrderLineCreate]

class SupplierOrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern=r"^(pending|confirmed|delivered|cancelled)$")

class SupplierOrderLineResponse(BaseModel):
    id: UUID
    supplier_order_id: UUID
    ingredient_id: UUID
    ingredient_name: str
    quantity: Decimal
    unit_price: Decimal

class SupplierOrderResponse(BaseModel):
    id: UUID
    restaurant_id: UUID
    supplier_id: UUID
    supplier_name: str
    date: date
    status: str
    total: Decimal
    lines: List[SupplierOrderLineResponse]
    created_at: datetime
```

### 2. `app/routers/crm_stock.py`

```
# Ingredientes
GET    /api/crm/restaurants/{id}/ingredients              → lista + below_threshold calculado
POST   /api/crm/restaurants/{id}/ingredients             → crear
GET    /api/crm/ingredients/{iid}                       → obtener uno
PUT    /api/crm/ingredients/{iid}                        → actualizar
DELETE /api/crm/ingredients/{iid}                        → eliminar

# Movimientos de stock
GET    /api/crm/ingredients/{iid}/movements             → historial
POST   /api/crm/ingredients/{iid}/movements             → crear movimiento (in/out/manual)
POST   /api/crm/restaurants/{id}/stock/manual            → movimiento manual rápido (body: ingredient_id, type, quantity, notes)

# Proveedores
GET    /api/crm/restaurants/{id}/suppliers
POST   /api/crm/restaurants/{id}/suppliers
GET    /api/crm/suppliers/{sid}
PUT    /api/crm/suppliers/{sid}
DELETE /api/crm/suppliers/{sid}

# Pedidos a proveedor
GET    /api/crm/restaurants/{id}/supplier-orders
POST   /api/crm/restaurants/{id}/supplier-orders        → crear pedido + líneas + calcular total
GET    /api/crm/supplier-orders/{oid}
PATCH  /api/crm/supplier-orders/{oid}/status             → cambiar estado (al marcar delivered → auto-genera movimientos de stock 'in')
DELETE /api/crm/supplier-orders/{oid}                   → eliminar solo si pending
```

**Lógica importante en PATCH /supplier-orders/{id}/status:**
- Si nuevo status = 'delivered': por cada línea del pedido, crear un stock_movement tipo 'in' con la cantidad de esa línea. Esto actualiza automáticamente `current_stock` del ingrediente.

Registrar en `main.py`:
```python
from app.routers.crm_stock import router as crm_stock_router
app.include_router(crm_stock_router)
```

## Verificación
1. `python -c "from app.routers.crm_stock import router; print('OK')"`
2. `python -c "from app.schemas.crm_stock import *; print('OK')"`
3. `cd backend && python -m py_compile app/routers/crm_stock.py`
