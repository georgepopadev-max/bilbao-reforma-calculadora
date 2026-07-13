# T-001: Modelo de datos + Migraciones SQL

## Objetivo
Crear las tablas PostgreSQL para el sistema CRM de Web Viva:
- restaurants
- tables
- reservations (versión mejorada)
- menus
- categories
- dishes
- dish_variants
- recipe_lines
- ingredients
- stock_movements
- suppliers
- supplier_orders
- supplier_order_lines

## Ubicación del proyecto
`/home/ubuntu/.openclaw/workspace/lead-machine/`

## Migraciones
Crear en `/home/ubuntu/.openclaw/workspace/lead-machine/backend/migrations/` los archivos SQL de migración.

## Schema SQL exacto

```sql
-- === RESTAURANTS ===
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    logo_url VARCHAR(500),
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === TABLES ===
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sala VARCHAR(100) DEFAULT 'Sala principal',
    chairs INTEGER NOT NULL DEFAULT 4,
    position_x INTEGER,
    position_y INTEGER,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);

-- === RESERVATIONS ===
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size >= 1 AND party_size <= 20),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
    source VARCHAR(20) DEFAULT 'web' CHECK (source IN ('web', 'phone', 'walkin', 'admin')),
    notes TEXT,
    cancellation_token UUID DEFAULT gen_random_uuid(),
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, table_id, date, time_start)
);

CREATE INDEX idx_reservations_restaurant_date ON reservations(restaurant_id, date);
CREATE INDEX idx_reservations_status ON reservations(status);

-- === MENUS ===
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    valid_from DATE,
    valid_until DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menus_restaurant ON menus(restaurant_id);

-- === CATEGORIES ===
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_categories_menu ON categories(menu_id);

-- === DISHES ===
CREATE TABLE dishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    photo_url VARCHAR(500),
    allergens TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dishes_category ON dishes(category_id);

-- === DISH VARIANTS ===
CREATE TABLE dish_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_extra DECIMAL(10,2) DEFAULT 0 CHECK (price_extra >= 0)
);

CREATE INDEX idx_variants_dish ON dish_variants(dish_id);

-- === INGREDIENTS ===
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('kg', 'l', 'uds', 'ud')),
    current_stock DECIMAL(10,3) DEFAULT 0 CHECK (current_stock >= 0),
    alert_threshold DECIMAL(10,3) DEFAULT 0,
    auto_deduct_reservation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ingredients_restaurant ON ingredients(restaurant_id);

-- === RECIPE LINES ===
CREATE TABLE recipe_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity DECIMAL(10,3) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20) NOT NULL
);

CREATE INDEX idx_recipe_lines_dish ON recipe_lines(dish_id);
CREATE INDEX idx_recipe_lines_ingredient ON recipe_lines(ingredient_id);

-- === STOCK MOVEMENTS ===
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('in', 'out', 'manual')),
    quantity DECIMAL(10,3) NOT NULL CHECK (quantity > 0),
    reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_movements_ingredient ON stock_movements(ingredient_id);
CREATE INDEX idx_movements_restaurant ON stock_movements(restaurant_id);

-- === SUPPLIERS ===
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_suppliers_restaurant ON suppliers(restaurant_id);

-- === SUPPLIER ORDERS ===
CREATE TABLE supplier_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
    total DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_supplier_orders_restaurant ON supplier_orders(restaurant_id);

-- === SUPPLIER ORDER LINES ===
CREATE TABLE supplier_order_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_order_id UUID NOT NULL REFERENCES supplier_orders(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    quantity DECIMAL(10,3) NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0)
);

CREATE INDEX idx_order_lines_order ON supplier_order_lines(supplier_order_id);

-- === ADD restaurant_id a users existente (para login restaurante) ===
ALTER TABLE users ADD COLUMN restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL;
```

## Importante
- Ejecutar las migraciones con Alembic si está configurado, o crear un script SQL ejecutable
- Si ya existe alguna tabla relacionada, hacer ALTER TABLE en vez de CREATE
- Verificar que no haya conflictos con tablas existentes antes de crear

## Verificación
1. El archivo SQL debe poder ejecutarse contra una base de datos vacía
2. No debe dar errores de FK ni Unique constraint
