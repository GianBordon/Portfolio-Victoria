# ✨ Victoria Provisionato Zitta · Portfolio ✨

![Preview del Portfolio](assets/img/preview.png)

> **[Ver sitio en producción](https://porfoliovictoriazitta.netlify.app/)**

Este es un **portfolio web profesional** desarrollado para **Victoria Provisionato Zitta**, una Fashion Stylist. El sitio web funciona como una galería digital minimalista y elegante para mostrar su trabajo en **cuatro categorías principales**: **Estilismo**, **Editorial**, **Ecommerce** y **Backstage**.

---

## 🎯 **Propósito del Proyecto**

El objetivo principal es ofrecer una experiencia visual inmersiva donde las imágenes sean las protagonistas, con un diseño limpio, tipografía editorial y animaciones suaves.

### **Categorías:**
1.  **Estilismo** - Trabajos de estilismo general.
2.  **Editorial** - Producciones editoriales para revistas/medios.
3.  **Ecommerce** - Trabajos para comercio electrónico.
4.  **Backstage** - Momentos tras la cámara y entre bastidores.

---

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**
-   **HTML5** - Estructura semántica del sitio.
-   **TailwindCSS v4.1.11** - Framework CSS utility-first para estilos modernos.
-   **JavaScript Vanilla** - Lógica de interacción (galerías dinámicas, lightbox, menú responsive).
-   **CSS Personalizado** - Estilos adicionales en `input.css`.

### **Librerías y Optimizaciones**
-   **[@midudev/tailwind-animations](https://github.com/midudev/tailwind-animations)** - Animaciones predefinidas (`animate-slide-down`, `animate-fade-in`).
-   **Optimización de Imágenes** - Uso de formato **WebP** con fallback a JPG/PNG.
-   **Lazy Loading** - Carga diferida nativa (`loading="lazy"`) y asíncrona.

---

## 📁 **Estructura del Proyecto**

```bash
Portfolio-Victoria/
├── assets/
│   ├── fonts/           # Fuentes personalizadas
│   └── img/             # Imágenes optimizadas (WebP + JPG)
│
├── data/
│   └── images.json      # Base de datos JSON de la galería
│
├── js/
│   └── main.js          # Lógica compartida: menú, galería y lightbox
│
├── public/
│   └── images/
│       └── optimized/   # WebP responsivos (400/800/1600w) por categoría
│
├── scripts/             # Utilidades (optimize-images)
│
├── home.html            # Landing page (Portada)
├── estilismo.html       # Galería principal de Estilismo
├── editorial.html       # Galería de Editorial
├── ecommerce.html       # Galería de Ecommerce
├── backstage.html       # Galería de Backstage
├── contact.html         # Página de Contacto
├── project.html         # Página de detalle de proyecto (lightbox)
│
├── input.css            # CSS fuente para Tailwind (tokens de tema)
├── output.css           # CSS compilado y minificado
│
├── robots.txt           # Configuración de rastreo SEO
├── sitemap.xml          # Sitemap de todas las páginas
│
├── netlify.toml         # Configuración de despliegue
├── package.json         # Dependencias y scripts
└── README.md            # Documentación del proyecto
```

---

## ⚙️ **Funcionamiento del Sistema**

### **1. Galería Dinámica (JSON)**
El contenido de las galerías se carga dinámicamente desde un archivo `data/images.json`. Esto permite actualizar las imágenes fácilmente sin modificar el HTML.

-   **Carga:** `js/main.js` lee el JSON y detecta la categoría mediante el atributo `data-category` de la galería.
-   **Renderizado:** Genera elementos `<picture>` con `srcset` responsivo (WebP 400/800/1600w) y fallback a JPG.
-   **Columnas:** Grid **1 columna (mobile) → 2 (md) → 3 (lg)** para las cards de categorías, dentro de un contenedor centrado de 10 columnas. Cada card muestra solo la categoría y el número de fotos.
-   **Animación:** Usa `IntersectionObserver` para mostrar las imágenes con un efecto _fade-in-up_ al hacer scroll.

### **2. Página de detalle (project.html)**
-   Cada proyecto (ej. `project.html?id=estilismo-2&category=estilismo`) se carga desde el JSON con **fotos siempre a color** (ningún filtro B/N).
-   Galería en **2 columnas con filas alternadas**: cada par de fotos rota 180º al pasar de fila (grande-izquierda/chica-derecha y viceversa).
-   Sistema **Lightbox** para ver las imágenes en pantalla completa.
-   **Navegación:** Cierre con botón, tecla `ESC` o click fuera de la imagen.
-   **Transiciones:** Animaciones suaves de apertura y cierre.

### **3. Color / Blanco y Negro**
-   Por defecto las fotos se muestran en **blanco y negro** y **colorean al hover**. Se mantiene en `home` y en las páginas de categorías.
-   La página de detalle (`project.html`) anula ese efecto vía `body.project-page` y muestra las fotos siempre en color.

### **4. Optimización**
-   **Formato WebP:** Reducción de tamaño (~30%) manteniendo calidad.
-   **Lazy Loading:** Solo carga las imágenes visibles para mejorar el tiempo de carga inicial.
-   **Estilos Críticos:** Tailwind genera un CSS purgado que solo incluye las clases utilizadas.

---

## ⚡ **Instalación y Desarrollo**

Si deseas ejecutar este proyecto localmente:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/GianBordon/portfolio-victoria.git
    cd portfolio-victoria
    ```

2.  **Instala dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecuta el compilador de estilos (modo watch):**
    ```bash
    npm run build:styles
    ```
    Esto ejecutará `npx @tailwindcss/cli` para observar cambios en `input.css` y HTML.

4.  **Abre el proyecto:**
    Abre `home.html` en tu navegador o usa una extensión como "Live Server" en VS Code.

---

## 🎨 **Diseño y Estilo**

-   **Paleta:** Blanco y Negro (Minimalismo) + Acento **Rosa Fucsia (`#ff1493`)**.
-   **Tipografía:** `Bodoni Moda` (serif editorial) + `Hanken Grotesk` (sans-serif).
-   **Home:** Bento grid **3 filas × 2 columnas** con las 4 categorías.
-   **Contacto:** Sin formulario; dos columnas con los datos a la izquierda y una foto a la derecha.
-   **Responsive:** Diseño _mobile-first_ con menú hamburguesa fullscreen en dispositivos móviles y grids de cards **1 → 2 → 3 columnas**.

---

## 👨‍ **Créditos**

-   **Desarrollo:** [@gianbordon](https://github.com/GianBordon)
-   **Cliente:** Victoria Provisionato Zitta
-   **Hosting:** Netlify

---

> _Hecho con amor, minimalismo y mucho CSS._ 🖤