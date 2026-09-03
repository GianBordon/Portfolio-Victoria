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
   * Genera el HTML de una imagen individual con imágenes optimizadas
   */
  createImageHTML(imageData) {
    // Manejar tanto strings simples como objetos con configuración
    let baseName, sizes = [400, 800, 1600];
    
    if (typeof imageData === 'string') {
      baseName = imageData;
    } else if (typeof imageData === 'object' && imageData.name) {
      baseName = imageData.name;
      sizes = imageData.sizes || [400, 800, 1600];
    } else {
      console.warn('Formato de imagen no válido:', imageData);
      return '';
    }

    const basePath = `public/images/optimized/${this.sectionName}/${baseName}`;
    const srcSet = sizes.map(size => `${basePath}-${size}w.webp ${size}w`).join(', ');
    const defaultSrc = `${basePath}-800w.webp`;
    
    return `
      <figure class="group relative overflow-hidden rounded-lg shadow" data-reveal>
        <div class="relative bg-gray-200">
          <img 
            src="${defaultSrc}" 
            srcset="${srcSet}"
            sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1600px"
            alt="${baseName}" 
            loading="lazy" 
            decoding="async"
            class="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 opacity-0"
            onload="this.classList.remove('opacity-0'); this.classList.add('opacity-100')"
          />
        </div>
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
  } else if (currentPage === 'backstage.html') {
    sectionName = 'backstage';
  }

  // Crear e inicializar la galería
  const gallery = new Gallery('.gallery', sectionName);
  gallery.render();
});
