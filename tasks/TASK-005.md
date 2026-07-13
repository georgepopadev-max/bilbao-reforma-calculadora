# T-005: API menús, categorías y platos

## Objetivo
Crear router CRUD para menús, categorías, platos y variantes.

## Proyecto
`/home/ubuntu/.openclaw/workspace/lead-machine/backend/`

## Archivos a crear

### 1. `app/schemas/crm_menus.py`

```python
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import date, datetime
from typing import Optional, List
from decimal import Decimal

# ── Dish ─────────────────────────────────────────────────────────────────────

class DishVariantSchema(BaseModel):
    id: Optional[UUID] = None
    dish_id: Optional[UUID] = None
    name: str
    price_extra: Decimal = Decimal("0.00")

class DishSchema(BaseModel):
    id: Optional[UUID] = None
    category_id: UUID
    name: str
    description: Optional[str] = ""
    price: Decimal = Field(ge=0)
    photo_url: Optional[str] = None
    allergens: List[str] = Field(default_factory=list)
    active: bool = True
    variants: List[DishVariantSchema] = Field(default_factory=list)

class DishCreate(BaseModel):
    category_id: UUID
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = ""
    price: Decimal = Field(..., ge=0)
    photo_url: Optional[str] = None
    allergens: List[str] = Field(default_factory=list)

class DishUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(default=None, ge=0)
    photo_url: Optional[str] = None
    allergens: Optional[List[str]] = None
    active: Optional[bool] = None

# ── Category ─────────────────────────────────────────────────────────────────

class CategorySchema(BaseModel):
    id: Optional[UUID] = None
    menu_id: UUID
    name: str
    description: Optional[str] = ""
    sort_order: int = 0
    active: bool = True
    dishes: List[DishSchema] = Field(default_factory=list)

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = ""
    sort_order: int = 0

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    active: Optional[bool] = None

# ── Menu ─────────────────────────────────────────────────────────────────────

class MenuSchema(BaseModel):
    id: Optional[UUID] = None
    restaurant_id: UUID
    name: str
    description: Optional[str] = ""
    valid_from: Optional[date] = None
    valid_until: Optional[date] = None
    active: bool = True
    categories: List[CategorySchema] = Field(default_factory=list)

class MenuCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = ""
    valid_from: Optional[date] = None
    valid_until: Optional[date] = None

class MenuUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    valid_from: Optional[date] = None
    valid_until: Optional[date] = None
    active: Optional[bool] = None

# ── DishVariant ────────────────────────────────────────────────────────────────

class DishVariantCreate(BaseModel):
    dish_id: UUID
    name: str = Field(..., min_length=1, max_length=100)
    price_extra: Decimal = Field(default=Decimal("0.00"), ge=0)
```

### 2. `app/routers/crm_menus.py`

```
GET    /api/crm/restaurants/{id}/menus
POST   /api/crm/restaurants/{id}/menus
GET    /api/crm/restaurants/{id}/menus/{mid}
PUT    /api/crm/restaurants/{id}/menus/{mid}
DELETE /api/crm/restaurants/{id}/menus/{mid}

GET    /api/crm/menus/{mid}/categories
POST   /api/crm/menus/{mid}/categories
PUT    /api/crm/menus/{mid}/categories/{cid}
DELETE /api/crm/menus/{mid}/categories/{cid}

GET    /api/crm/categories/{cid}/dishes
POST   /api/crm/categories/{cid}/dishes
PUT    /api/crm/dishes/{did}
DELETE /api/crm/dishes/{did}

POST   /api/crm/dishes/{did}/variants
DELETE /api/crm/variants/{vid}
```

Implementación: usar Supabase Admin igual que los otros routers. CRUD simple con Supabase.

Registrar en `main.py`:
```python
from app.routers.crm_menus import router as crm_menus_router
app.include_router(crm_menus_router)
```

## Verificación
1. `python -c "from app.routers.crm_menus import router; print('OK')"`
2. `python -c "from app.schemas.crm_menus import MenuSchema, CategorySchema, DishSchema; print('OK')"`
3. `cd backend && python -m py_compile app/routers/crm_menus.py && python -m py_compile app/schemas/crm_menus.py`
