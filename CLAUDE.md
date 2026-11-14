# Aramtaj Vintage — CLAUDE.md

Contexto del proyecto para Claude Code. Léelo completo antes de tocar código. Si algo aquí contradice una instrucción de Jair en la sesión, gana Jair; actualiza este archivo cuando una decisión cambie.

## 1. Qué es esto

Sitio ecommerce a la medida para **Aramtaj Vintage** (Instagram: "Vintage Bijoux by Aram Taj"), negocio de joyería vintage firmada (60s–90s, piezas curadas en Europa, ~95% firmadas). Cada pieza es única (1 of 1).

- **Clienta:** Aram Taj.
- **Quién construye:** Jair (VANTA Creative Lab). Todo material que vea la clienta va firmado por **VANTA Creative Lab**, no VITA Studio.
- **Dominio:** aramtajvintage.com (comprado en Shopify).
- **Hoy vende:** solo por Stories + DM de Instagram. Su Shopify actual (tema Horizon) tiene 2 piezas publicadas, 8 de 11 colecciones vacías y errores; no se migra nada de ese tema, se construye desde cero.

## 2. Estrategia (no cambiarla sin preguntar)

Es paso a paso. **No hay checkout en México.**

| Paso | Qué pasa | Estado |
|---|---|---|
| 1 · Ahora | Sitio en código, catálogo permanente, venta por WhatsApp. Lanzamos en México primero. SEO, GA4, Search Console y Meta Pixel desde el día uno. Anuncio "Moving to the USA" + lista de espera. | En construcción |
| 2 · Lanzamiento en EE. UU. (~1–2 meses) | Aram se muda a EE. UU. Shopify Payments en EE. UU., checkout en USD, envíos e impuestos de EE. UU. Mismo sitio y dominio. Se cotiza aparte. | Planeado, no construir aún |
| 3 · Después | Meta Ads y crecimiento. Servicio aparte, opcional. | Fuera de alcance |

**Por qué así:** lanzar checkout en México y mudarse semanas después obligaría a rehacer Payments, moneda, banco, envíos e impuestos.

**Regla de oro:** todo lo del paso 1 debe sobrevivir al paso 2 sin rediseño. El día del launch en EE. UU. solo se agrega carrito + checkout.

## 3. Arquitectura

```
Fuente de catálogo (hoy: data/products.json · después: Shopify Admin API)
        ↓  src/lib/catalog (interfaz única)
Repo Next.js (GitHub) → Vercel
        ↓
aramtajvintage.com  (DNS en Shopify apuntando a Vercel)
        ↓
Botón "Ask about this piece" → WhatsApp con mensaje prellenado
```

**Decisión vigente (nov 2026):** construimos el sitio primero **sin conexión a Shopify**. El catálogo sale de `data/products.json` con la misma forma de datos que vendría de Shopify (producto + metafields `custom.*`). Toda lectura pasa por `src/lib/catalog`; los componentes nunca leen el JSON directo. Conectar Shopify = implementar `src/lib/catalog/shopify.ts` y cambiar `CATALOG_SOURCE=shopify`, sin tocar componentes.

- Shopify será la base de datos de productos: Aram sube/edita piezas en el admin (tienda con contraseña, sin tema publicado). No borrar nada de la tienda.
- Lectura: app del Dev Dashboard (dev.shopify.com/dashboard) con permisos de lectura de productos, inventario y metafields. GraphQL Admin API. Token solo en servidor.
- Revalidación: webhooks `products/create|update|delete`, `inventory_levels/update` → route handler con verificación HMAC → `revalidateTag`.
- Dominio: Shopify admin → Settings → Domains → DNS: A raíz y CNAME www a los valores de Vercel. Aram sigue pagando su plan de Shopify (ahí vive el dominio).

### Riesgos a validar
- **Plan de Shopify** (~$7 USD/mes, probablemente Starter): probar que el token lee productos y metafields. Si no, se queda el JSON.
- **Paso 2:** checkout headless pedirá plan Basic.
- **Correo en el dominio:** revisar registros MX antes de mover DNS.

## 4. Stack

Next.js (App Router) + TypeScript · Tailwind CSS v4 · Shopify GraphQL Admin API (después) · Vercel · GA4, Search Console, Meta Pixel · GitHub. Entorno de Jair: Windows, VS Code + Claude Code.

### Variables de entorno (`.env.local`, nunca commitear) — ver `.env.example`

## 5. Modelo de datos de cada pieza

Tipo canónico: `src/lib/catalog/types.ts`.

| Campo | Fuente Shopify | Notas |
|---|---|---|
| Nombre | `title` | Designer-first |
| Precio | variant price | Moneda pendiente |
| Fotos | media | En modelo |
| Descripción | `descriptionHtml` | |
| Diseñador | `custom.designer` | Filtro principal |
| Década | `custom.decade` | Filtro |
| Origen | `custom.origin` | |
| Materiales | `custom.materials` | |
| Condición | `custom.condition` | Etiqueta visible |
| Medidas (cm) | `custom.measurements` | |
| Cierre | `custom.clasp` | |
| Tipo de arete | `custom.earring_type` | clip / pierced. Filtro |
| Estado | `custom.sale_status` | available · reserved · sold |

`reserved` = Aram la está cerrando por WhatsApp. `sold` = pasa al Archive. La definición final de metafields se confirma con Jair antes de crearlos en Shopify.

## 6. Venta por WhatsApp (paso 1)

- Botón "Ask about this piece" → `https://wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>?text=...` con nombre + URL.
- Botón flotante de chat en móvil.
- El sitio no cobra. Piezas `reserved` no permiten otra consulta.
- Cada clic a WhatsApp = evento GA4 (y Pixel) con el handle.
- Compra aislada en `<PurchaseAction>`: en el paso 2 se cambia por "Add to cart" sin tocar la página.

## 7. Estructura del sitio

**Navegación:** Shop (New drop, Necklaces, Earrings, Bracelets, Rings, Brooches) · Designers · Archive · About Aram · Help. No publicar colecciones vacías.

**Home:** Hero · The current Edit · New in · Shop by category · Shop by designer · Why Aram Taj · Historia + Instagram · Join the US launch list.

**Barra de anuncio:** NOW AVAILABLE VIA WHATSAPP · LAUNCHING IN THE USA SOON · JOIN THE LIST

## 8. Diseño

1 of 1 (vendidas al Archive) · la firma es el filtro · drops, no catálogo infinito · confianza visible. Editorial, cálido, imagen primero, mobile-first (375px).

**Ronda 2 (nov 2026), aprobada por Jair:** base clara marfil con el orden de la lámina de propuesta: antetítulo en bronce con tracking amplio, títulos grandes, listas numeradas (01, 02…) en bronce separadas por líneas finas, dos columnas, sin tarjetas ni sombras. Aplica a tarjetas de pieza, ficha de detalles y bloques de la home.

Paleta (tokens en `src/app/globals.css`): `--ink #1C1814` · `--onyx #100D0B` · `--cream #F2EDE2` · `--sand #E9E1D2` · `--line #D6CBB9` · `--muted #6B6156` · `--bronze #7A5C24` · `--arena #DAC293` · `--velvet #6B1F2A` · `--cognac #9A5B2E`.

**Ronda 3 (nov 2026), pedida por Jair:** isotipo con animación de "firma" (`SignatureMark` en `signature-mark.tsx`, todo CSS: trazo → relleno oro → brillo). En el hero se firma al cargar; al hacer scroll se disuelve (blur + fade) y el isotipo pequeño del header se firma solo (`hero-scroll.tsx`, `data-nav-mark`). La misma firma en bucle, pequeña y centrada, es la pantalla de carga (`SignatureLoader` en `app/loading.tsx` y fallbacks de Suspense). Al entrar a cada sección nueva sube una cortina marfil con la firma rápida (`page-transition.tsx`, mínimo 1.35s); filtros y anclas no la activan. El relleno oro entra justo al cerrarse el trazo (rápido). Escala tipográfica `display-xl/lg/md/sm` + `accent` (itálica, una por título) + `piece-name` en `globals.css`; títulos grandes en Cormorant 300/400. Botones premium (`btn-primary`, `btn-outline`, `btn-arena`, `btn-ghost-light`, `link-line`) con barrido de color. Animaciones al hacer scroll con `data-reveal` (`reveal-observer.tsx`), respetando `prefers-reduced-motion`. En móvil: barra fija "Ask about this piece" en la ficha y galería deslizable.

**Hero y navbar (nov 2026):** el hero usa la paleta del Brand Lab (ónix, marfil `--marfil #EFE6D6`, arena, terciopelo vino) con la foto "Bodegón" regenerada en 2K (`velvet-hero-wide/tall.jpg`). La navbar es transparente mientras está sobre el hero (texto marfil, isotipo arena) y al salir del hero pasa a vidrio marfil translúcido con blur; el texto del hero se desvanece al hacer scroll para no cruzarse con la navbar.

Tipografía: Cormorant Garamond 300–500 (títulos, nombres de pieza; nunca < 20px) + Jost 400/500 (interfaz, texto, precios). Upgrade opcional con licencia: Canela + Neue Montreal, cambiando solo los loaders de `layout.tsx`.

Marca: logotipo en `brand/logo/`; isotipo oficial (AT entrelazado) en `brand/isotipo/`. Componentes `IsotipoMark` (SVG en línea) y `Logo` en `src/components/brand.tsx`; `SignatureMark`/`SignatureLoader` en `src/components/signature-mark.tsx`.

Brand Lab (decisiones de ronda 1): https://claude.ai/artifact/HoxruJktAnFqhUk3p3DMVN

## 9. SEO y medición

Title/meta por pieza y colección, alt text, JSON-LD Product con disponibilidad según `sale_status`, sitemap/robots, keywords EE. UU., bilingual-ready (EN principal, ES después), GA4 + Search Console + Pixel.

## 10. Pendientes (no inventar: preguntar o dejar TODO)

- [ ] Acceso de colaborador a Shopify y prueba del token en su plan
- [ ] Fotos y videos de Aram (carpeta Media en Google Drive)
- [ ] Número de piezas del catálogo inicial (hasta ~70)
- [ ] Lista de diseñadores/firmas
- [ ] Ruta visual y tipografía finales
- [ ] Moneda en fase México (MXN, USD o ambas)
- [ ] Idioma principal en fase México
- [ ] ¿WhatsApp Business? Confirmar número de ventas
- [ ] ¿Correo en el dominio? (antes de mover DNS)
- [ ] Textos de About, envíos, cuidado y devoluciones
- [ ] Catálogo en Instagram/Facebook/TikTok (no construir todavía)

**Imágenes provisionales (nov 2026):** `public/placeholder/` tiene fotos generadas con IA (Higgsfield) para revisar el diseño: editoriales en `src/lib/editorial.ts` (hero, banda Edit, About) y fotos de las piezas de muestra en `data/products.json`. Se reemplazan por las fotos de Aram antes del lanzamiento; no deben salir a producción.

Donde falte contenido real: placeholders neutros y TODO. **No inventar precios, piezas, diseñadores ni textos de la marca.** Los productos de `data/products.json` son de muestra y están marcados como tales.

## 11. Fuera de alcance

Checkout/carrito/pagos (paso 2) · Shopify Payments, impuestos y envíos de EE. UU. · Meta Ads · email marketing/estrategia de lanzamiento · Reino Unido/Europa.

## 12. Orden de trabajo

1. Repo + Next.js + design tokens + barra de anuncio.
2. Capa de catálogo (JSON hoy, Shopify después).
3. Home, Shop con filtros, ficha de pieza, Archive, WhatsApp con tracking.
4. About, Help, lista de espera.
5. SEO, GA4, Search Console, Pixel.
6. Conexión Shopify + webhooks + deploy Vercel + dominio.
7. Sesión con Aram para subir piezas y marcar Reserved/Sold.

## 13. Reglas para Claude Code

- No publicar el tema de Shopify ni quitar la contraseña de la tienda.
- No exponer tokens en el cliente ni commitear `.env*`.
- No construir carrito/checkout hasta que Jair diga que arranca el paso 2.
- Antes de crear metafields, colecciones o cualquier cosa en el Shopify de Aram, preguntar.
- Cambios en el DNS: solo con confirmación explícita de Jair.
- Al terminar cada bloque: decir cómo correrlo en local y qué falta del lado de Jair o de Aram.
