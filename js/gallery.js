/**
 * Componente de Galería
 * Genera dinámicamente las imágenes de la galería desde un JSON
 */

class Gallery {
  constructor(containerSelector, sectionName) {
    this.container = document.querySelector(containerSelector);
    this.sectionName = sectionName;
    this.imagesData = null;
  }

  /**
   * Carga los datos de las imágenes desde el JSON
   */
  async loadImagesData() {
    try {
      const response = await fetch('data/images.json');
      this.imagesData = await response.json();
      return this.imagesData;
    } catch (error) {
      console.error('Error al cargar las imágenes:', error);
      return null;
    }
  }

  /**
   * Genera el HTML de una imagen individual
   */
  createImageHTML(imageData) {
    // Manejar tanto strings simples como objetos con configuración
    let baseName, extension = 'jpg';
    
    if (typeof imageData === 'string') {
      baseName = imageData;
    } else if (typeof imageData === 'object' && imageData.name) {
      baseName = imageData.name;
      extension = imageData.extension || 'jpg';
    } else {
      console.warn('Formato de imagen no válido:', imageData);
      return '';
    }

    const webpPath = `assets/img/${baseName}.webp`;
    const fallbackPath = `assets/img/${baseName}.${extension}`;
    
    return `
      <figure class="group relative overflow-hidden rounded-lg shadow" data-reveal>
        <picture>
          <source type="image/webp" srcset="${webpPath}" />
          <img src="${fallbackPath}" alt="${baseName}" loading="lazy" decoding="async"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </picture>
      </figure>
    `;
  }

  /**
   * Renderiza todas las imágenes de la sección
   */
  async render() {
    if (!this.container) {
      console.error(`No se encontró el contenedor: ${this.containerSelector}`);
      return;
    }

    const data = await this.loadImagesData();
    if (!data || !data[this.sectionName]) {
      console.error(`No se encontraron imágenes para la sección: ${this.sectionName}`);
      return;
    }

    const images = data[this.sectionName];
    const galleryHTML = images
      .map(imageName => this.createImageHTML(imageName))
      .join('');

    this.container.innerHTML = galleryHTML;

    // Reinicializar el IntersectionObserver para las nuevas imágenes
    this.initRevealObserver();
  }

  /**
   * Inicializa el IntersectionObserver para las animaciones reveal
   */
  initRevealObserver() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
  }
}

// Inicializar la galería cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Detectar la sección actual basándose en la URL o un atributo data
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  let sectionName = 'estilismo'; // default

  if (currentPage === 'editorial.html') {
    sectionName = 'editorial';
  } else if (currentPage === 'ecommerce.html') {
    sectionName = 'ecommerce';
  }

  // Crear e inicializar la galería
  const gallery = new Gallery('.gallery', sectionName);
  gallery.render();
});
