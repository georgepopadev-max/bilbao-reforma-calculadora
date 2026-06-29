# T-014 [MEDIA] — Configurar GTM + GA4 en bilbaoreforma.es

## Estado: PENDIENTE
## Estimación: 15min

## 🎯 Objetivo
Configurar Google Tag Manager + GA4 según el documento `bilbao-reforma-calculadora/docs/MEDICION-GTM-GA4.md`. Sin esta configuración, NO estamos midiendo nada y no podemos tomar decisiones basadas en datos.

## 📋 Acciones atómicas

Esta tarea es ejecutar pasos manuales en interfaz web de Google. NO requiere código.

### A. Pasos (del documento)

1. **Crear tag GA4 Config:**
   - Ir a Google Tag Manager (cuenta existente o crear nueva)
   - Crear tag "GA4 Config"
   - Tipo: Google Analytics: GA4 Configuration
   - Measurement ID: `G-YLV6ZG2VMZ`
   - Trigger: All Pages

2. **Crear 5 tags de eventos:**
   - `clic_telefono` (cuando se hace clic en enlaces tel:+34642147856)
   - `generate_lead` (cuando se envía formulario calculadora → mailto/email)
   - `clic_email` (cuando se hace clic en mailto:info@bilbaoreforma.es)
   - `scroll` (cuando usuario hace scroll 50%+)
   - `engaged_session_2min` (cuando tiempo en página >2 minutos)

3. **Crear 5 triggers asociados:**
   - Trigger `clic_telefono`: Click - Just Links - Click URL contains "tel:"
   - Trigger `generate_lead`: Form submission
   - Trigger `clic_email`: Click - Just Links - Click URL contains "mailto:"
   - Trigger `scroll_50`: Scroll Depth - 50%
   - Trigger `engaged_2min`: Timer - 2 minutes

4. **Publicar contenedor:**
   - Click "Submit" en GTM
   - Version name: "v1 - Medición Inicial"
   - Publish

5. **Vincular Search Console a GA4:**
   - Ir a Google Analytics → Admin → Product Links → Search Console Links
   - Vincular

6. **Marcar 2 conversiones en GA4:**
   - Marcar `generate_lead` como conversion
   - Marcar `clic_telefono` como conversion

### B. Verificación
- Ir a GTM Preview → abrir bilbaoreforma.es
- Hacer clic en teléfono → debe disparar tag `clic_telefono`
- Hacer scroll 50% → debe disparar `scroll`
- Esperar 2min → debe disparar `engaged_2min`
- Verificar en GA4 Realtime que llegan los eventos

## 🚦 QA NO REQUERIDO (es UI web, no código)

## 📤 Output esperado
- Screenshot del contenedor GTM con los 5 tags publicados
- Screenshot de GA4 con eventos llegando en realtime
- Confirmación de Search Console vinculado
- Confirmación de 2 eventos marcados como conversions

## 📚 Contexto
- `bilbao-reforma-calculadora/docs/MEDICION-GTM-GA4.md` (instrucciones detalladas)
- Acceso a cuenta Google de George (GTM + GA4)
