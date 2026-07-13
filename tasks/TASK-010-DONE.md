# TASK-010-DONE ✅

## Fecha: 2026-07-11

## PARTE A: Backend

### 1. Nuevo router: `app/routers/crm_recipes.py`
- `GET /api/crm/dishes/{did}/recipe` → lista recipe_lines con nombres de ingredientes (JOIN)
- `POST /api/crm/dishes/{did}/recipe` → crear recipe_lines
- `PUT /api/crm/dishes/{did}/recipe` → reemplazar todas las recipe_lines (borra + inserta)
- `DELETE /api/crm/dishes/{did}/recipe` → eliminar todas
- `GET /api/crm/restaurants/{restaurant_id}/ingredients?q=` → buscador de ingredientes (para el selector del frontend)

### 2. Schema en `app/schemas/crm_menus.py` (añadido)
- `RecipeLineCreate(ingredient_id: UUID, quantity: Decimal>0, unit: Literal[kg|l|uds|ud])`
- `RecipeLineResponse(id, dish_id, ingredient_id, ingredient_name, quantity, unit)`

### 3. Router registrado en `main.py`
```python
from app.routers.crm_recipes import router as crm_recipes_router
app.include_router(crm_recipes_router)
```

### 4. Verificación backend
```
cd /home/ubuntu/.openclaw/workspace/lead-machine/backend && python3 -m py_compile app/routers/crm_recipes.py && echo "OK"
# → OK
```

## PARTE B: Frontend

### 5. Modificado `app/web-viva/admin/restaurants/[id]/menu/page.tsx`
- Añadido `RecipeLine` e `Ingredient` interfaces
- Añadido estado `recipeLines`, `showAddIngredient`, `ingredientQuery`, `ingredientResults`, `selectedIngredient`, `newLineQuantity`, `newLineUnit`, `savingRecipe`
- `useEffect` carga recipe_lines al editar plato existente (GET /api/crm/dishes/{did}/recipe)
- Sección "🍴 Receta (ingredientes por plato)" insertada después de variantes/alérgenos en DishModal:
  - Tabla con nombre ingrediente, cantidad (formato flexible), unidad, botón ✕ eliminar
  - Selector de ingredientes con búsqueda dinámica (GET /api/crm/restaurants/{id}/ingredients?q=)
  - Cada add/remove hace PUT /api/crm/dishes/{did}/recipe con la lista completa
- Props DishModal actualizadas para recibir `restaurantId`

### 6. Verificación frontend
```
cd /home/ubuntu/.openclaw/workspace/lead-machine/frontend && npm run build
# → ✓ Compiled successfully, 0 errores
```

## Notas
- Auth: usa `supabase.auth.getSession()` dinámico (`@/lib/supabase`) — no requiere next-auth
- Tabla `recipe_lines` necesita existir en Supabase con: `id, dish_id, ingredient_id, quantity, unit`
- Tabla `ingredients` necesita existir en Supabase con: `id, restaurant_id, name, unit`
