/**
 * Carrusel de imágenes para el banner
 * Muestra 3 imágenes: una de estilismo, una de ecommerce, una de editorial
 * Cambia automáticamente cada 5 segundos
 */

let currentIndex = 0;
let images = [];
let carouselInterval = null;

// Cargar las 3 imágenes del carrusel
async function loadCarouselImages() {
    const banner = document.getElementById('banner');
    if (!banner) {
        console.error('No se encontró el contenedor del banner');
        return;
    }

    try {
        const response = await fetch('data/images.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos cargados:', data);
        
        // Seleccionar una imagen de cada sección
        const estilismoImage = data.estilismo[0];
        const ecommerceImage = data.ecommerce[0];
        const editorialImage = data.editorial[0];
        
        if (!estilismoImage || !ecommerceImage || !editorialImage) {
            console.error('No se encontraron imágenes en alguna de las secciones');
            return;
        }

        // Guardar las imágenes en orden
        images = [estilismoImage, ecommerceImage, editorialImage];
        
        console.log('Imágenes seleccionadas:', images);
        renderCarousel();
        setupBannerEvents();
        startAutoPlay();
    } catch (error) {
        console.error('Error al cargar las imágenes:', error);
        banner.innerHTML = '<p class="text-white text-center">Error al cargar las imágenes</p>';
    }
}

// Generar HTML de una imagen del carrusel
function createImageHTML(imageData, index) {
    let baseName, extension = 'jpg';
    
    if (typeof imageData === 'string') {
        baseName = imageData;
    } else if (typeof imageData === 'object' && imageData.name) {
        baseName = imageData.name;
        extension = imageData.extension || 'jpg';
    } else {
        console.error('Formato de imagen no válido:', imageData);
        return '';
    }

    const webpPath = `assets/img/${baseName}.webp`;
    const fallbackPath = `assets/img/${baseName}.${extension}`;
    
    return `
        <div class="absolute inset-0 w-full h-full transition-opacity duration-500 ${index === 0 ? 'opacity-100' : 'opacity-0'}" data-index="${index}">
            <img src="${fallbackPath}" 
                 alt="${baseName}" 
                 class="w-full h-full object-cover"
                 loading="${index === 0 ? 'eager' : 'lazy'}"
                 onerror="console.error('Error al cargar la imagen:', this.src)" />
        </div>
    `;
}

// Renderizar el carrusel con las 3 imágenes
function renderCarousel() {
    const banner = document.getElementById('banner');
    if (!banner || images.length === 0) {
        console.error('No se puede renderizar el carrusel', { banner: !!banner, imagesLength: images.length });
        return;
    }

    console.log('Renderizando carrusel con', images.length, 'imágenes');
    const imagesHTML = images.map((img, index) => {
        const html = createImageHTML(img, index);
        console.log(`Imagen ${index}:`, img, 'HTML generado:', html ? 'OK' : 'ERROR');
        return html;
    }).join('');
    
    banner.innerHTML = imagesHTML;
    
    // Verificar que todas las imágenes se hayan renderizado
    const renderedSlides = document.querySelectorAll('#banner > div');
    console.log('Slides renderizadas:', renderedSlides.length);
}

// Ir a una slide específica
function goToSlide(index) {
    if (index < 0 || index >= images.length) return;
    
    const slides = document.querySelectorAll('#banner > div');
    if (slides.length === 0) return;
    
    // Ocultar slide actual
    slides[currentIndex].classList.remove('opacity-100');
    slides[currentIndex].classList.add('opacity-0');
    
    // Mostrar nueva slide
    currentIndex = index;
    slides[currentIndex].classList.remove('opacity-0');
    slides[currentIndex].classList.add('opacity-100');
}

// Siguiente imagen
function nextSlide() {
    const nextIndex = (currentIndex + 1) % images.length;
    goToSlide(nextIndex);
}

// Auto-play del carrusel
function startAutoPlay() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
}

function stopAutoPlay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

// Pausar auto-play al hacer hover (se agrega después de que el banner exista)
function setupBannerEvents() {
    const bannerElement = document.getElementById('banner');
    if (bannerElement) {
        bannerElement.addEventListener('mouseenter', stopAutoPlay);
        bannerElement.addEventListener('mouseleave', startAutoPlay);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCarouselImages);
} else {
    // DOM ya está listo
    loadCarouselImages();
}
