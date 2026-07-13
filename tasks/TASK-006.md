# T-006: Admin — Editor de carta (menús, categorías, platos)

## Objetivo
Página admin completa para gestionar la carta de un restaurante: crear/editar menús, categorías, platos y variantes.

## Proyecto
`/home/ubuntu/.openclaw/workspace/lead-machine/frontend/`

## Archivo a crear

**`/home/ubuntu/.openclaw/workspace/lead-machine/frontend/app/web-viva/admin/restaurants/[id]/menu/page.tsx`**

## Diseño: Accordion jerárquico

```
🍽️ Carta de La Mafia

[+ Nuevo Menú]
  Menú Principal (siempre activo)
  ├─ [+] Categoría
  │   └─ Entrantes
  │       ├─ Bruschetta ... 8.50€
  │       │   └─ [+ Variante] [✏️] [🗑️]
  │       │       - Sin tomate +1€
  │       └─ Carpaccio ... 12€ [✏️] [🗑️]
  │   └─ [+] Categoría
  └─ [+ Categoría]

  Menú verano (válido hasta 31/08/2025)
  └─ ...
```

## Componentes

### 1. Header
- Título "Carta — {nombre_restaurante}"
- Tabs: uno por menú (si hay varios)
- Botón "+ Nuevo Menú"
- Botón "+ Categoría" (dentro del menú activo)

### 2. Accordion de categorías
- Cada categoría es un `<details>` expandible
- Nombre editable inline (click → input)
- Botón "+ Plato" dentro de cada categoría
- Drag handle para reordenar (opcional, hacer después)

### 3. Tarjeta de plato
- Nombre, descripción truncada, precio
- Badge alérgenos (si hay)
- Botón Editar → modal con todos los campos
- Botón Eliminar (soft delete)
- Botón "+ Variante" → inline o modal

### 4. Modal crear/editar plato
Campos:
- Nombre (required)
- Descripción (textarea)
- Precio (number, 2 decimales)
- Foto URL (text)
- Alérgenos (tags input: click para añadir/quitar: gluten, lactosa, frutos secos, huevos, soja, marisco, pescado, apio, mostaza, sésamo, sulfitos)
- Variantes: lista de {nombre, precio_extra}, botón + añadir, botón ✕ eliminar

### 5. Modal crear/editar categoría
- Nombre
- Descripción
- Orden (number)

### 6. Modal crear menú
- Nombre
- Descripción
- Válido desde (date, opcional)
- Válido hasta (date, opcional)

## Datos mock para UI sin backend

```typescript
const mockMenu = {
  id: '1',
  name: 'Menú Principal',
  active: true,
  categories: [
    {
      id: 'cat1',
      name: 'Entrantes',
      sort_order: 0,
      active: true,
      dishes: [
        { id: 'd1', name: 'Bruschetta', description: 'Pan tostado con tomate y albahaca', price: 8.50, allergens: ['gluten'], variants: [{ name: 'Sin tomate', price_extra: 0 }] },
        { id: 'd2', name: 'Carpaccio de buey', description: 'Finas lonchas con rúcula y parmesano', price: 12.00, allergens: ['gluten'], variants: [] },
      ]
    },
    {
      id: 'cat2',
      name: 'Primeros',
      sort_order: 1,
      active: true,
      dishes: [
        { id: 'd3', name: 'Risotto funghi', description: 'Arroz cremoso con setas', price: 14.00, allergens: ['lactosa'], variants: [] },
      ]
    }
  ]
};
```

## Verificación
1. `cd frontend && npm run build` — 0 errores
2. Página accesible en `/web-viva/admin/restaurants/[id]/menu`
