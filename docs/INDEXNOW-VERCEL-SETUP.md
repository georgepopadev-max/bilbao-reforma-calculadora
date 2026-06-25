# 🔑 Activar IndexNow en Vercel — Guía paso a paso

**Tiempo estimado**: 2 minutos
**Coste**: Gratis
**Requiere**: Cuenta de Vercel con acceso al proyecto `bilbao-reforma-calculadora`

---

## 📋 Pasos

### 1. Abre el dashboard de Vercel
👉 https://vercel.com/dashboard

### 2. Selecciona el proyecto
Click en **`bilbao-reforma-calculadora`** (no en cualquier otro proyecto que tengas)

### 3. Ve a Settings
- En el menú superior del proyecto, click en **`Settings`**
- (NO en "Deployments" ni "Analytics", solo **Settings**)

### 4. Abre la pestaña Integrations
- En la columna izquierda, busca **`Integrations`**
- Click ahí

### 5. Busca IndexNow
- En el buscador de integraciones escribe: **`IndexNow`**
- Debe aparecer la integración oficial **`IndexNow by Vercel`** (o similar)
- Click en **`Add Integration`** o **`Visit Integration`**

### 6. Autoriza
- Te redirige a una pantalla de OAuth de Vercel
- Click **`Add Integration`**
- Selecciona el proyecto **`bilbao-reforma-calculadora`** (no "all projects" para mayor seguridad)
- Confirma

### 7. Espera el deploy
- Vercel dispara automáticamente un nuevo deploy
- En **1-2 minutos** verás el deploy completado en la pestaña Deployments
- **¡Listo! IndexNow está activo**

---

## ✅ Cómo verificar que funciona

### Método 1 — Logs del deploy
1. Ve a la pestaña **`Deployments`** del proyecto
2. Click en el último deploy (el que se hizo tras añadir IndexNow)
3. Click en la pestaña **`Build Logs`** o **`Runtime Logs`**
4. Busca una línea tipo:
   ```
   IndexNow: Submitted https://www.bilbaoreforma.es/...
   ```
   Si aparece → **funciona ✅**

### Método 2 — Verificar manualmente con curl (opcional)
Una vez configurado, Vercel expone un endpoint automático. Para verificar:
```bash
curl -I https://www.bilbaoreforma.es/<TU_API_KEY>.txt
```
Debería devolver un `200 OK` con el contenido de la API key. Esto confirma que Vercel creó el archivo de validación que IndexNow necesita.

### Método 3 — Dashboard de IndexNow
- Bing tiene un panel público: https://www.bing.com/indexnow
- (No necesario, pero puedes comprobar si quieres)

---

## 🚀 Qué pasa después

A partir del **próximo deploy** (el que hagas tú o el que se dispare automáticamente):
- Vercel hace ping a **Bing + Yandex + DuckDuckGo** (todos compatibles)
- Ellos re-crawlean tus páginas en **minutos** en vez de días
- **Google experimentalmente** también respeta IndexNow (no garantizado, pero ayuda)

**El deploy que hicimos hoy (commit `fd7181a`) NO activó IndexNow** porque la integración aún no estaba. El siguiente deploy que hagas (o el que se dispare al añadir IndexNow) ya lo hará.

---

## ⚠️ Si algo falla

- **No encuentro "IndexNow" en Integrations**: prueba a buscar "Bing" o "IndexNow API" — Vercel tiene varias integraciones relacionadas.
- **Me pide permisos raros**: es la OAuth estándar de Vercel, solo necesitas acceso al proyecto (no a todo el team).
- **No veo logs de IndexNow en el deploy**: a veces los logs están silenciados. Si tras 5 minutos el deploy se completó sin errores, está funcionando.
- **Quiero desactivarlo**: Settings → Integrations → IndexNow → **`Remove Integration`**. Limpio.

---

## 💡 Notas

- **IndexNow NO es obligatorio** para que el sprint funcione. Solo acelera el re-crawl de 5-7 días a 1-2 días.
- **Funciona con cualquier framework** (Next.js, Astro, Hugo, estático como el tuyo).
- **No tiene límite de submissions** para tu volumen (275 impressions/sem = web pequeña).
- **Es open source** y mantenido por Microsoft. Sin coste oculto, sin mantenimiento.

---

## 📊 Impacto esperado en tu caso

| Métrica | Sin IndexNow | Con IndexNow |
|---|---|---|
| Re-crawl tras deploy | 3-7 días | 1-2 días |
| Re-indexación página nueva | 5-10 días | 2-4 días |
| Costo | 0€ | 0€ |
| Mantenimiento | 0 | 0 |

**Conclusión**: Gratis + 2 min + acelera ~3-5 días el resultado. **Activar siempre**.

---

## 🔗 Referencias

- IndexNow protocolo: https://www.indexnow.org/
- Vercel Integrations docs: https://vercel.com/docs/integrations
- Cómo IndexNow ayuda a Bing: https://www.bing.com/webmasters/help/index-now-access-protocol-c1fe7d3e

---

_Última actualización: 2026-06-25_
_Sprint: FASE 1A — Canibalización Presupuesto (commit fd7181a)_
