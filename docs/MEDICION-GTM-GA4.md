# Sprint 0 — Medición: GTM + GA4 + Search Console

## Objetivo
Configurar tracking de conversiones y análisis para bilbaoreforma.es

## Estado actual
- ✅ GTM-MJNJJ3L6 instalado en todas las páginas
- ✅ Search Console verificada
- ✅ Redirección www funcionando
- ❌ GA4 NO conectado en GTM (hay que configurarlo)
- ❌ Eventos de conversión NO configurados

## Paso 1: Crear propiedad GA4 (5 min)

1. Ve a https://analytics.google.com/
2. Crear cuenta → "Bilbao Reforma"
3. Nombre propiedad: "Bilbao Reforma Web"
4. Zona horaria: España
5. Moneda: EUR
6. Crear flujo de datos → Web → URL: https://www.bilbaoreforma.es/
7. Copia el **Measurement ID** (formato G-XXXXXXXXXX)

## Paso 2: Conectar GA4 a GTM (5 min)

1. Ve a https://tagmanager.google.com/ → workspace "GTM-MJNJJ3L6"
2. Tags → Nueva → "Google Analytics: GA4 Configuration"
3. Measurement ID: pega tu G-XXXXXXXXXX
4. Trigger: "All Pages"
5. Guarda y publica el contenedor (botón "Submit" arriba derecha)

## Paso 3: Configurar eventos de conversión (10 min)

En GTM crea estos 5 tags + 5 triggers:

### Evento 1: clic_telefono
- Tipo: "Google Analytics: GA4 Event"
- Event Name: clic_telefono
- Trigger: tipo "Click - Just Links"
- Condición: Click URL contiene "tel:"
- Trigger name: "CE - Clic Teléfono"

### Evento 2: submit_formulario
- Tipo: "Google Analytics: GA4 Event"
- Event Name: generate_lead (estándar GA4)
- Trigger: tipo "Form Submission"
- Condición: Form ID contiene "calculadora" OR "contacto" OR "presupuesto"
- Trigger name: "CE - Submit Formulario"

### Evento 3: clic_email
- Tipo: "Google Analytics: GA4 Event"
- Event Name: clic_email
- Trigger: tipo "Click - Just Links"
- Condición: Click URL contiene "mailto:"
- Trigger name: "CE - Clic Email"

### Evento 4: scroll_50
- Tipo: "Google Analytics: GA4 Event"
- Event Name: scroll
- Trigger: tipo "Scroll Depth"
- Umbrales: 25, 50, 75, 100
- Trigger name: "CE - Scroll Depth"

### Evento 5: tiempo_pagina_2min
- Tipo: "Google Analytics: GA4 Event"
- Event Name: engaged_session_2min
- Trigger: tipo "Timer"
- Interval: 120000 ms (2 min)
- Limit: 1 por página
- Trigger name: "CE - Timer 2min"

## Paso 4: Marcar conversiones en GA4 (3 min)

1. GA4 → Administrar → Eventos
2. Buscar `clic_telefono` → toggle "Mark as conversion" ON
3. Buscar `generate_lead` → toggle "Mark as conversion" ON
4. (Opcional) `clic_email` y `engaged_session_2min` como eventos secundarios

## Paso 5: Conectar Search Console a GA4 (2 min)

1. GA4 → Administrar → Vinculaciones de productos → Search Console → Vincular
2. Selecciona la propiedad verificada de bilbaoreforma.es
3. Confirma

## Verificación (10 min)

24h después de publicar GTM:
1. GA4 → Informes → Tiempo real → debería verse 1 usuario (tú mismo)
2. GA4 → Informes → Engagement → Eventos → ver `clic_telefono`, `generate_lead`, etc.
3. GA4 → Informes → Adquisición → Search Console → ver queries orgánicas

## Mantenimiento
- Revisar semanalmente: GA4 → Informes → Engagement → Eventos (top eventos)
- Revisar mensualmente: GA4 → Informes → Adquisición → Search Console (queries top)