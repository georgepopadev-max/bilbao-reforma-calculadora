# T-002: API REST restaurants + tables (CRUD)

## Objetivo
Crear el router FastAPI con CRUD completo para restaurants y tables.

## Proyecto
`/home/ubuntu/.openclaw/workspace/lead-machine/backend/`

## Archivos a crear

### 1. `/home/ubuntu/.openclaw/workspace/lead-machine/backend/app/routers/crm_restaurants.py`

Schemas en Pydantic (crear en parallelo en `app/schemas/crm_restaurants.py`):

```python
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

# ── Restaurant ────────────────────────────────────────────────────────────────

class RestaurantConfig(BaseModel):
    slot_duration_minutes: int = 60
    turn_duration_minutes: int = 90
    turns: list[dict] = []  # [{name: "Comida", start: "13:00", end: "15:00"}, ...]
    max_cover_per_slot: int = 20
    average_cover: float = 2.0

class RestaurantCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    logo_url: Optional[str] = None
    config: RestaurantConfig = RestaurantConfig()

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    logo_url: Optional[str] = None
    config: Optional[RestaurantConfig] = None

class RestaurantResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    address: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    logo_url: Optional[str]
    config: dict
    created_at: datetime
    updated_at: datetime

# ── Table ────────────────────────────────────────────────────────────────────

class TableCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    sala: str = "Sala principal"
    chairs: int = Field(default=4, ge=1, le=20)
    position_x: Optional[int] = None
    position_y: Optional[int] = None

class TableUpdate(BaseModel):
    name: Optional[str] = None
    sala: Optional[str] = None
    chairs: Optional[int] = None
    position_x: Optional[int] = None
    position_y: Optional[int] = None
    active: Optional[bool] = None

class TableResponse(BaseModel):
    id: UUID
    restaurant_id: UUID
    name: str
    sala: str
    chairs: int
    position_x: Optional[int]
    position_y: Optional[int]
    active: bool
    created_at: datetime
```

### 2. Router — endpoints

```python
# /api/crm/restaurants          GET (lista) + POST (crear)
# /api/crm/restaurants/{id}     GET + PUT + DELETE
# /api/crm/restaurants/{id}/tables   GET (lista) + POST (crear)
# /api/crm/restaurants/{id}/tables/{tid}  GET + PUT + DELETE
```

- **GET /api/crm/restaurants** — lista todos los restaurants ordenados por name
- **POST /api/crm/restaurants** — crear restaurant, devuelve 201 con el registro
- **GET /api/crm/restaurants/{id}** — obtener uno por ID, 404 si no existe
- **PUT /api/crm/restaurants/{id}** — actualizar campos presentes, 404 si no existe
- **DELETE /api/crm/restaurants/{id}** — eliminar (cascade en tables y reservations), 204
- **GET /api/crm/restaurants/{id}/tables** — lista tables activas de ese restaurant
- **POST /api/crm/restaurants/{id}/tables** — crear table vinculada al restaurant
- **GET /api/crm/restaurants/{id}/tables/{tid}** — obtener table, 404
- **PUT /api/crm/restaurants/{id}/tables/{tid}** — actualizar, 404
- **DELETE /api/crm/restaurants/{id}/tables/{tid}** — eliminar (soft delete: active=false), 204

### 3. Registrar el router en `main.py`

Añadir al archivo `main.py`:
```python
from app.routers import crm_restaurants
app.include_router(crm_restaurants.router)
```

## Notas de implementación
- Usar Supabase Admin (servidor) para todas las operaciones — misma técnica que `reservations.py`
- Formato de fechas: ISO string en Supabase, Pydantic valida en backend
- Errores: HTTPException con status code adecuado (400, 404, 500)
- Auth: no requerida para esta tarea (se añade después globalmente)

## Verificación
1. `python -c "from app.routers.crm_restaurants import router; print('OK')"` — sin errores de importación
2. Build verde en backend: `cd /home/ubuntu/.openclaw/workspace/lead-machine/backend && python -m py_compile app/routers/crm_restaurants.py`
