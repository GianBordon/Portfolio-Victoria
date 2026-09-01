# Portfolio-Victoria

Portfolio web estático de varias páginas para la fashion stylist Victoria Provisionato Zitta. HTML puro + Tailwind CSS v4 + JS vanilla. Auto-despliegue en Netlify desde `main` (remote: `GianBordon/Portfolio-Victoria`).

## Comandos

- `npm run build:styles` — CLI de Tailwind v4 en **modo watch** (se queda corriendo), compila `input.css` → `output.css`. `output.css` está commiteado y las páginas lo enlazan: **vuelve a compilarlo tras editar cualquier clase o `input.css`**. Para build único: `npx @tailwindcss/cli -i ./input.css -o ./output.css`.
- `npm run build` — no-op (`echo 'Static site - no build needed'`). Netlify publica la raíz del repo sin paso de build.
- `npm run optimize` — lee `data/images.json` y regenera WebP responsivos (400/800/1600w) en `public/images/optimized/<categoría>/` con `sharp`. Ejecútalo tras añadir/quitar fotos. **No borra huérfanos**: si quitas una foto del JSON, elimina a mano sus `*-Nw.webp`.

## Arquitectura

- Páginas: `home`, `estilismo`, `editorial`, `ecommerce`, `backstage`, `contact` (`*.html` en la raíz) + `project.html` (detalle de proyecto). Toda la lógica JS vive en `js/main.js` (menú hamburguesa, project cards, galería, lightbox), cargado con `<script src="js/main.js" defer>`. El marcado de nav/footer sí se duplica por página: un cambio ahí hay que replicarlo. **No hay enlaces a LinkedIn** (se eliminaron del proyecto en producción).
- Galería de categorías: `js/main.js` lee el atributo `data-category` de `#project-cards`, carga `data/images.json` y renderiza `<picture>` con `srcset` responsivo (`public/images/optimized/<cat>/<name>-{400,800,1600}w.webp`), fallback a `assets/img/<name>.jpg`. Grid **1 → 2 (md) → 3 (lg) columnas** dentro de un contenedor centrado de 10 columnas (`md:col-span-10 md:col-start-2`). El overlay de cada card muestra solo la **categoría** y el conteo **N FOTOS** (sin título del proyecto).
- `project.html`: página de detalle con **fotos siempre a color** (el body lleva la clase `project-page`; en `input.css` se fuerza `filter: grayscale(0%)`). La galería usa **2 columnas con filas alternadas** (cada par de fotos rota 180º: fila par grande-izquierda/chica-derecha; fila impar chica-izquierda/grande-derecha), con lightbox.
- Fotos en color/B/N: por defecto las imágenes se muestran en B/N y colorean al hover (regla global de `input.css`). Se mantiene en `home` y en las páginas de categorías; `project.html` la anula vía `body.project-page`.
- Home: bento grid **3 filas × 2 columnas** con 4 categorías — Estilismo (grande, 2 filas, izquierda), Editorial y E-Commerce (1 fila cada una, derecha) y Backstage (última fila a lo ancho).
- Contact: **sin formulario**; layout de 2 columnas con datos a la izquierda y foto a la derecha.
- Añadir foto: colócala en `assets/img/`, crea su `.webp`, regístrala en `data/images.json` en la categoría correcta (el orden del array = orden de visualización) y ejecuta `npm run optimize`.
- Tailwind v4: los tokens viven en `input.css` (`@theme`: `--color-accent: #ff1493`, `--font-bodoni`, `--font-hanken`). **No hay `tailwind.config.js`** (fue eliminado): la CLI v4 no lo cargaba. El color de acento se usa como `text-accent` / `hover:text-accent`, etc.
- SEO: `robots.txt` + `sitemap.xml` apuntan al dominio `https://porfoliovictoriazitta.netlify.app/` (canonical). JSON-LD `Person` en `home.html`.
- Deploy: Netlify con `netlify.toml` (publica `.`, cache inmutable para `*.webp` y `public/images/optimized/*`).

## Gotchas

- **No commitear `node_modules`**: ya está fuera del control de versiones (`.gitignore`) pero quedó commiteado históricamente; no vuelvas a añadirlo.
- Sin framework de test: la verificación es manual + compilar CSS + probar en local (servidor estático) o preview de Netlify.

## Convenciones

- El idioma del sitio es español (`lang="es"`); los textos de la interfaz y los comentarios de código están en español.
