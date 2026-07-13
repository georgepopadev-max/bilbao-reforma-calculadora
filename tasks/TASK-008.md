# T-008: Admin — Stock + Pedidos a proveedor

## Objetivo
Panel admin para gestionar ingredientes, stock y pedidos a proveedores.

## Proyecto
`/home/ubuntu/.openclaw/workspace/lead-machine/frontend/`

## Archivo a crear

**`/home/ubuntu/.openclaw/workspace/lead-machine/frontend/app/web-viva/admin/restaurants/[id]/stock/page.tsx`**

## Diseño: 3 tabs

### Tab 1: Ingredientes
```
┌──────────────────────────────────────────────────────────────┐
│ Ingredientes                               [+ Nuevo]         │
├──────────────────────────────────────────────────────────────┤
│ 🔍 Buscar ingrediente...                                      │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Tomate          │ Stock: 25 kg   │ ⚠️ Bajo (< 10kg)     │ │
│ │ 🍅              │ Uds: kg       │ ████████░░  70%       │ │
│ │                 │ Alert: 10 kg   │ [Movimiento] [Editar] │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ Aceite de oliva │ Stock: 5 l    │ ✅ OK                 │ │
│ │ 🫒              │ Uds: l       │ ██████████  100%      │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

Funcionalidades:
- Lista de ingredientes con barra de stock (% ocupación)
- Badge de alerta si `current_stock < alert_threshold`
- Buscador
- Botón "+ Nuevo ingrediente" → modal
- Modal crear/editar ingrediente: name, unit (select: kg/l/uds/ud), stock inicial, umbral alerta, auto-deduct toggle
- Botón "Movimiento" → modal para registrar entrada/salida manual

### Tab 2: Movimiento rápido de stock
```
┌──────────────────────────────────────────────────────────────┐
│ Registrar movimiento                                        │
├──────────────────────────────────────────────────────────────┤
│ Ingrediente: [Select con buscador         ▼]                 │
│ Tipo:       ○ Entrada  ○ Salida  ○ Manual                   │
│ Cantidad:   [____] kg                                        │
│ Notas:      [_________________________________]              │
│                                        [Registrar →]         │
└──────────────────────────────────────────────────────────────┘
```

### Tab 3: Proveedores y pedidos
```
┌──────────────────────────────────────────────────────────────┐
│ Proveedores                              [+ Nuevo proveedor]  │
│ ──────────────────────────────────────────────────────────  │
│ Carnicería López    │ 📞 944123456  │ 3 pedidos            │
│ Pescadería Bilbao   │ 📞 944654321  │ 1 pedido             │
│                                                              │
│ Pedidos                                               [+ Nuevo]│
│ ──────────────────────────────────────────────────────────  │
│ #PED-001  Carnicería López  │ 12/07/2025 │ Pendiente       │
│ #PED-002  Pescadería Bilbao │ 10/07/2025 │ Entregado ✅      │
└──────────────────────────────────────────────────────────────┘
```

Modal crear pedido:
- Select proveedor
- Líneas: ingrediente (select), cantidad, precio unitario
- Se van añadiendo líneas con "+ Añadir línea"
- Total calculado automáticamente
- Al crear: POST /api/crm/restaurants/{id}/supplier-orders

Modal editar estado pedido: Pending → Confirmed → Delivered (al marcar delivered, se generan los movimientos de stock)

## Datos mock

```typescript
const mockIngredients = [
  { id: '1', name: 'Tomate', unit: 'kg', current_stock: '25.000', alert_threshold: '10.000', below_threshold: false },
  { id: '2', name: 'Aceite de oliva', unit: 'l', current_stock: '5.000', alert_threshold: '3.000', below_threshold: false },
  { id: '3', name: 'Sal', unit: 'kg', current_stock: '2.000', alert_threshold: '5.000', below_threshold: true },
];

const mockSuppliers = [
  { id: '1', name: 'Carnicería López', phone: '944123456', email: 'lopez@carniceria.com' },
  { id: '2', name: 'Pescadería Bilbao', phone: '944654321', email: 'info@pescaderiabilbao.com' },
];

const mockOrders = [
  { id: '1', supplier_name: 'Carnicería López', date: '2025-07-12', status: 'pending', total: 145.50 },
  { id: '2', supplier_name: 'Pescadería Bilbao', date: '2025-07-10', status: 'delivered', total: 89.00 },
];
```

## Verificación
1. `cd frontend && npm run build` — 0 errores
2. Página accesible en `/web-viva/admin/restaurants/[id]/stock`
