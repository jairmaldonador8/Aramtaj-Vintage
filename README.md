# Aramtaj Vintage — sitio web

Sitio ecommerce a la medida para **Aramtaj Vintage** (Instagram: "Vintage Bijoux by Aram Taj"): joyería vintage firmada de los 60s–90s, curada en Europa. Cada pieza es única (1 of 1). Lo construye **VANTA Creative Lab**.

> **Lee primero [`CLAUDE.md`](./CLAUDE.md).** Es el documento maestro del proyecto: estrategia, arquitectura, modelo de datos, diseño, pendientes y reglas. Este README es la versión corta para arrancar.

---

## Arrancar en local

Requisitos: Node.js 20+ (recomendado 22/24) y npm.

```bash
git clone https://github.com/jairmaldonador8/Aramtaj-Vintage.git
cd Aramtaj-Vintage
npm install
cp .env.example .env.local   # en Windows PowerShell: Copy-Item .env.example .env.local
npm run dev
```

Abre http://localhost:3000. Con `CATALOG_SOURCE=local` el sitio funciona completo sin Shopify, usando `data/products.json`.

Otros comandos: `npm run build` (build de producción), `npm run lint`, `npx tsc --noEmit` (revisión de tipos).

> Ojo: es **Next.js 16 + React 19 + Tailwind v4**. Varias APIs cambiaron respecto a versiones anteriores; revisa `AGENTS.md` y la documentación en `node_modules/next/dist/docs/` antes de escribir código.

---

## Qué estamos haciendo (resumen)

**Estrategia paso a paso. No hay checkout en México.**

1. **Ahora:** sitio en código con catálogo permanente; la venta se cierra por **WhatsApp** (botón "Ask about this piece" con mensaje prellenado). Lanzamos en México primero, con SEO, GA4, Search Console y Meta Pixel desde el día uno, más un anuncio "Moving to the USA" y lista de espera.
2. **Lanzamiento en EE. UU. (~1–2 meses):** Aram se muda; se agrega carrito + checkout con Shopify Payments en USD. Mismo sitio, mismo dominio. **Todavía no se construye.**
3. **Después:** Meta Ads y crecimiento (fuera de alcance).

**Regla de oro:** todo lo que hacemos hoy debe sobrevivir al paso 2 sin rediseño. Por eso la compra está aislada en `<PurchaseAction>`: el día del launch en EE. UU. solo se cambia ese componente por "Add to cart".

### Arquitectura

```
Catálogo (hoy: data/products.json · después: Shopify Admin API)
        ↓  src/lib/catalog  ← única puerta de entrada a los datos
Next.js (App Router) → Vercel → aramtajvintage.com
        ↓
"Ask about this piece" → WhatsApp (+ evento GA4/Pixel)
```

Los componentes **nunca** leen el JSON directo; todo pasa por `src/lib/catalog`. Conectar Shopify = implementar `src/lib/catalog/shopify.ts` y poner `CATALOG_SOURCE=shopify`.

---

## Mapa del repo

| Ruta | Qué hay |
|---|---|
| `src/app/page.tsx` | **Landing / Home**: Hero (bodegón en terciopelo + firma animada) · New in · The current Edit · Shop by category · Shop by designer · Why Aram Taj · Historia + Instagram · Join the US launch list |
| `src/app/shop/` | Shop con filtros (diseñador, década, tipo de arete, etc.) y `shop/[category]` |
| `src/app/pieces/[handle]/` | Ficha de pieza (galería, detalles numerados, botón WhatsApp, JSON-LD Product) |
| `src/app/archive/` | Piezas vendidas |
| `src/app/designers/`, `about/`, `help/` | Páginas de diseñadores, About Aram y Help |
| `src/app/sitemap.ts`, `robots.ts` | SEO técnico |
| `src/components/` | UI: header/footer, barra de anuncio, tarjetas de pieza, filtros, `purchase-action`, `whatsapp-float`, animaciones (`signature-mark`, `hero-scroll`, `page-transition`, `reveal-observer`) |
| `src/lib/catalog/` | Capa de datos: `types.ts` (tipo canónico), `local.ts` (JSON), `shopify.ts` (escrito, sin probar contra la tienda de Aram) |
| `src/lib/editorial.ts` | Imágenes editoriales (hero, banda Edit, About) |
| `src/lib/analytics.ts` | Eventos GA4 / Pixel |
| `src/app/globals.css` | Design tokens (paleta), escala tipográfica, botones |
| `data/products.json` | **Productos de muestra** (no reales) |
| `public/placeholder/` | **Fotos provisionales generadas con IA** — se reemplazan por las de Aram antes de lanzar |
| `brand/` | Logotipo, isotipo (SVG/PNG/favicons) y dirección de foto |

---

## Diseño en una línea

Editorial, cálido, imagen primero, **mobile-first (375px)**. Base marfil, antetítulos en bronce con tracking amplio, títulos grandes en Cormorant Garamond, interfaz en Jost, listas numeradas (01, 02…) separadas por líneas finas, sin tarjetas ni sombras. Paleta y detalles de animación en `CLAUDE.md` §8.

Brand Lab (decisiones de marca): https://claude.ai/artifact/HoxruJktAnFqhUk3p3DMVN

---

## Estado actual

**Hecho:** estructura Next.js, design tokens, barra de anuncio, capa de catálogo (JSON), Home completa, Shop con filtros, ficha de pieza, Archive, Designers, About, Help, WhatsApp con tracking, lista de espera (UI), sitemap/robots, animaciones de firma y transiciones.

**Pendiente (ver `CLAUDE.md` §10 y §12):**
- Contenido real de Aram: fotos/videos, piezas, precios, diseñadores, textos de About/envíos/cuidado/devoluciones. Hay `TODO` en el código donde falta.
- Moneda e idioma en fase México.
- GA4, Search Console y Meta Pixel con IDs reales.
- Probar `shopify.ts` contra la tienda real + webhooks de revalidación.
- Deploy en Vercel + dominio.

---

## Reglas para trabajar

- **No inventar** precios, piezas, diseñadores ni textos de marca. Donde falte contenido: placeholder neutro + `TODO`.
- **No commitear `.env*`** (solo `.env.example`) ni exponer tokens en el cliente.
- **No construir carrito/checkout** hasta que Jair arranque el paso 2.
- **No tocar el Shopify de Aram** (metafields, colecciones, tema, contraseña) ni el DNS sin confirmación de Jair.
- Trabaja en una rama y abre Pull Request contra `main`.
