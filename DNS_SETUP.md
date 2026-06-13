# DNS Setup: Redirigir bilbaoreforma.es → www.bilbaoreforma.es

## Problema

El dominio `bilbaoreforma.es` (sin www) no redirige a `www.bilbaoreforma.es`. Esto afecta al SEO porque Google puede ver dos versiones diferentes del mismo sitio.

## Lo que George tiene que hacer

### Paso a paso (configuración en el proveedor de dominio)

1. **Accede a tu proveedor de dominio**
   - Entra en el panel de control de donde compraste el dominio `bilbaoreforma.es`
   - Busca la sección "DNS" o "Gestión de DNS"

2. **Busca la opción de "Redirect" o "Forwarding"**
   - Muchos proveedores (GoDaddy, Namecheap, Google Domains, DonDominio, etc.) tienen una opción específica para redirigir un dominio
   - Busca algo como:
     - "URL Redirect" / "URL Forwarding"
     - "Redirect domain to URL"
     - "Forward this domain"

3. **Configura el redirect 301**
   - Dominio origen: `bilbaoreforma.es` (o `http://bilbaoreforma.es`)
   - Dominio destino: `https://www.bilbaoreforma.es`
   - Tipo de redirect: **301 (Permanent Redirect)** — esto es importante para SEO

4. **Guarda los cambios**
   - Los cambios pueden tardar entre 5 minutos y 48 horas en propagarse

---

## Si tu proveedor NO tiene opción de redirect

### Alternativa A: Configurar CNAME en el hosting

Si tu hosting permite añadir un dominio adicional o un CNAME:

1. Añade `bilbaoreforma.es` como dominio adicional en tu hosting
2. Crea un archivo `.htaccess` (si usas Apache) en la raíz de ese dominio con:

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^bilbaoreforma\.es [NC]
RewriteRule ^(.*)$ https://www.bilbaoreforma.es/$1 [R=301,L]
```

O si usas Nginx, añade en la configuración:

```nginx
server {
    server_name bilbaoreforma.es;
    return 301 https://www.bilbaoreforma.es$request_uri;
}
```

### Alternativa B: Cloudflare (gratis)

Si usas Cloudflare como DNS:

1. Entra en Cloudflare → tu sitio → "Rules" → "Redirect Rules"
2. Crea una regla:
   - **When**: Hostname equals `bilbaoreforma.es`
   - **Then**: Redirect to `https://www.bilbaoreforma.es/{path}`
   - Tipo: **301**

### Alternativa C: Netlify (gratis)

Si despliegas en Netlify:

1. Crea un archivo `public/_redirects` con:
   ```
   https://bilbaoreforma.es/* https://www.bilbaoreforma.es/:splat 301
   ```

---

## Proveedores comunes — dónde buscar

| Proveedor | Dónde buscar el redirect |
|---|---|
| **GoDaddy** | Mis productos → DNS → Configuración de forwarding |
| **Namecheap** | Domain List → Advanced DNS → Redirect Domain |
| **Google Domains** | DNS → Flujos de redirección synthetic records |
| **DonDominio** | Panel → Dominios → Redirigir |
| **1&1 IONOS** | Mis productos → DNS → Reenvío |
| **OVH** | Dominios → Zona DNS → Redirección |

---

## Cómo verificar que funciona

1. Abre una ventana de incógnito
2. Visita: `http://bilbaoreforma.es`
3. Deberías ser redirigido automáticamente a `https://www.bilbaoreforma.es`
4. Verifica que la URL en el navegador muestra `www.bilbaoreforma.es`

## Nota importante

⚠️ **Esto NO se puede hacer desde código (HTML/JS/CSS).** La configuración del DNS es del proveedor de dominio. George tiene que hacerlo manualmente desde el panel de su proveedor.
