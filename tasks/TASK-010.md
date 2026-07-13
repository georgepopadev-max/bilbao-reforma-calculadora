# T-010: Recetas — Ingredientes por plato + Editor en admin

## Objetivo
Vincular platos con ingredientes (recetas) y permitir editar las recetas desde el panel admin.

## Proyecto
`/home/ubuntu/.openclaw/workspace/lead-machine/backend/` y `frontend/`

## PARTE A: API de recetas

### Nuevo router: `app/routers/crm_recipes.py`

```
GET    /api/crm/dishes/{did}/recipe     → lista recipe_lines con nombres de ingredientes
POST   /api/crm/dishes/{did}/recipe     → crear/reasignar recipe_lines (recibe [{ingredient_id, quantity, unit}])
PUT    /api/crm/dishes/{did}/recipe     → reemplazar todas las recipe_lines del plato
DELETE /api/crm/dishes/{did}/recipe     → eliminar todas
```

**Lógica PUT:**
- Borrar todas las recipe_lines existentes del dish_id
- Insertar las nuevas recipe_lines
- Esto permite reordenar/editar recetas completas

### Schema en `app/schemas/crm_menus.py` (añadir)

```python
class RecipeLineCreate(BaseModel):
    ingredient_id: UUID
    quantity: Decimal = Field(..., gt=0)
    unit: str = Field(..., pattern=r"^(kg|l|uds|ud)$")

class RecipeLineResponse(BaseModel):
    id: UUID
    dish_id: UUID
    ingredient_id: UUID
    ingredient_name: str  # join con ingredients
    quantity: Decimal
    unit: str
```

## PARTE B: Admin — Editor de recetas

### Modificar `menu/page.tsx`

En el modal de editar plato, añadir sección "Receta":
```
🍴 Receta (ingredientes por plato)
─────────────────────────────────
Ingrediente    │ Cantidad │ Ud  │ Acciones
───────────────┼──────────┼─────┼─────────
Tomate         │ 0.200    │ kg  │ [✕]
Aceite de oliva│ 0.020    │ l   │ [✕]
[+ Añadir ingrediente]
  Select ingrediente  [____] kg  [Añadir]
```

Funcionalidades:
- Lista de recipe_lines con nombre ingrediente, cantidad, unidad
- Botón ✕ para eliminar línea
- "+ Añadir ingrediente": select con buscador de ingredientes del restaurante + input cantidad + select unidad + botón añadir
- Cada vez que se añade/elimina línea → PATCH /api/crm/dishes/{did}/recipe

## Verificación
1. `cd backend && python -m py_compile app/routers/crm_recipes.py`
2. `cd frontend && npm run build` — 0 errores
