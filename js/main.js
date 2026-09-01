'use strict';

/**
 * Portfolio-Victoria — lógica compartida (Vogue Editorial)
 * Menú hamburguesa, project cards (categorías) y project page individual.
 */
document.addEventListener('DOMContentLoaded', function () {
  initMenu();
  initProjectCards();
  initProjectPage();
  initImageReveal();
  initLightbox();
});

/* ---------------------- Menú hamburguesa ---------------------- */
function initMenu() {
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  var hamburger = document.getElementById('hamburger-icon');
  var close = document.getElementById('close-icon');
  var links = document.querySelectorAll('.menu-link');
  var closedColor = toggle.classList.contains('text-white') ? 'text-white' : 'text-black';

  function setOpen(open) {
    menu.classList.toggle('translate-x-0', open);
    menu.classList.toggle('translate-x-full', !open);
    if (hamburger) hamburger.classList.toggle('hidden', open);
    if (close) close.classList.toggle('hidden', !open);
    toggle.classList.remove('text-white', 'text-black');
    toggle.classList.add(open ? 'text-white' : closedColor);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setOpen(!menu.classList.contains('translate-x-0'));
  });
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });
}

/* ---------------------- Project Cards (Category Pages) ---------------------- */
var GALLERY_SIZES = [400, 800, 1600];

function initProjectCards() {
  var container = document.getElementById('project-cards');
  if (!container || !container.dataset.category) return;

  var category = container.dataset.category;

  fetch('data/images.json')
    .then(function (response) { return response.json(); })
    .then(function (data) {
      var catData = data.categories && data.categories[category];
      if (!catData || !catData.projects) return;

      catData.projects.forEach(function (project, index) {
        var card = createProjectCard(project, category, index);
        if (card) container.appendChild(card);
      });
      initImageReveal();
    })
    .catch(function (error) {
      console.error('Error al cargar proyectos:', error);
    });
}

function createProjectCard(project, category, index) {
  var coverName = project.cover;
  if (!coverName) return null;

  var base = 'public/images/optimized/' + category + '/' + coverName;
  var srcset = GALLERY_SIZES.map(function (size) {
    return base + '-' + size + 'w.webp ' + size + 'w';
  }).join(', ');
  var sizes = '(max-width: 640px) 400px, (max-width: 1024px) 800px, 1600px';
  var fallback = 'assets/img/' + coverName + '.jpg';

  var numImages = project.images ? project.images.length : project.images;

  var card = document.createElement('a');
  card.href = 'project.html?id=' + project.id + '&category=' + category;
  card.className = 'group relative block w-full overflow-hidden border border-ink-black bg-soft-gray cursor-pointer';
  card.dataset.reveal = '';

  card.innerHTML =
    '<div class="aspect-[3/4] w-full overflow-hidden">' +
      '<picture class="block h-full w-full">' +
        '<source type="image/webp" srcset="' + srcset + '" sizes="' + sizes + '">' +
        '<img src="' + fallback + '" alt="' + project.title + '" loading="lazy" decoding="async" ' +
        'class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">' +
      '</picture>' +
    '</div>' +
    '<div class="absolute inset-0 bg-ink-black/0 group-hover:bg-ink-black/20 transition-all duration-300"></div>' +
    '<div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">' +
      '<span class="block text-label-caps font-bold uppercase tracking-[0.2em] text-white/70">' + category.toUpperCase() + '</span>' +
      '<span class="mt-1 block text-label-caps uppercase tracking-[0.2em] text-white/50">' + numImages + ' FOTOS</span>' +
    '</div>';

  return card;
}

/* ---------------------- Project Page (Individual) ---------------------- */
function initProjectPage() {
  var gallery = document.getElementById('project-gallery');
  if (!gallery) return;

  var params = new URLSearchParams(window.location.search);
  var projectId = params.get('id');
  var category = params.get('category');

  if (!projectId || !category) return;

  fetch('data/images.json')
    .then(function (response) { return response.json(); })
    .then(function (data) {
      var catData = data.categories && data.categories[category];
      if (!catData || !catData.projects) return;

      var project = catData.projects.find(function (p) { return p.id === projectId; });
      if (!project) return;

      var titleEl = document.getElementById('project-title');
      var categoryEl = document.getElementById('project-category');
      var countEl = document.getElementById('project-count');
      if (titleEl) titleEl.textContent = project.title;
      if (categoryEl) categoryEl.textContent = catData.title;
      if (countEl) countEl.textContent = project.images.length + ' FOTOS';

      document.title = project.title + ' - Victoria Zitta';

      project.images.forEach(function (entry, index) {
        var figure = createGalleryFigure(entry, category, index);
        if (figure) gallery.appendChild(figure);
      });
      initImageReveal();
    })
    .catch(function (error) {
      console.error('Error al cargar el proyecto:', error);
    });
}

function createGalleryFigure(entry, category, index) {
  var baseName = typeof entry === 'string' ? entry : entry.name;
  if (!baseName) return null;

  var base = 'public/images/optimized/' + category + '/' + baseName;
  var srcset = GALLERY_SIZES.map(function (size) {
    return base + '-' + size + 'w.webp ' + size + 'w';
  }).join(', ');
  var sizes = '(max-width: 640px) 400px, (max-width: 1024px) 800px, 1600px';
  var fallback = 'assets/img/' + baseName + '.jpg';

  var idx = typeof index === 'number' ? index : 0;
  // Layout alternado por fila: cada fila (par de fotos) rota 180 grados.
  // - Filas pares (0, 2, 4...): foto grande (7 cols) izquierda + foto chica (5 cols) derecha con offset.
  // - Filas impares (1, 3, 5...): foto chica (5 cols) izquierda con offset + foto grande (7 cols) derecha.
  var row = Math.floor(idx / 2);
  var colInRow = idx % 2;
  var layoutForRow = row % 2 === 0
    ? [
        { span: 'md:col-span-7', dim: 'aspect-[3/4]', margin: '' },
        { span: 'md:col-span-5 md:col-start-8', dim: 'aspect-[4/5]', margin: 'md:mt-24' }
      ]
    : [
        { span: 'md:col-span-5', dim: 'aspect-[4/5]', margin: 'md:mt-24' },
        { span: 'md:col-span-7 md:col-start-6', dim: 'aspect-[3/4]', margin: '' }
      ];
  var config = layoutForRow[colInRow];

  var figure = document.createElement('figure');
  figure.className = 'relative overflow-hidden border border-ink-black bg-soft-gray cursor-pointer ' + config.span + ' ' + config.margin;
  figure.dataset.lightbox = '';
  figure.dataset.reveal = '';

  figure.innerHTML =
    '<picture class="block w-full">' +
      '<source type="image/webp" srcset="' + srcset + '" sizes="' + sizes + '">' +
      '<img src="' + fallback + '" alt="' + baseName + '" loading="lazy" decoding="async" ' +
      'class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 ' + config.dim + '">' +
    '</picture>' +
    '<div class="absolute inset-0 bg-ink-black/0 group-hover:bg-ink-black/10 transition-all duration-300"></div>';

  return figure;
}

/* ---------------------- Reveal on scroll ---------------------- */
function initImageReveal() {
  if (!('IntersectionObserver' in window)) return;

  var items = document.querySelectorAll('[data-reveal], [data-lightbox]');
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
}

/* ---------------------- Lightbox ---------------------- */
function initLightbox() {
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('close-lightbox');
  if (!lightbox || !lightboxImg || !closeBtn) return;

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-lightbox]');
    if (!trigger) return;
    var img = trigger.querySelector('img');
    openLightbox(img ? img.currentSrc || img.src : trigger.dataset.lightbox);
  });

  function openLightbox(src) {
    if (!src) return;
    lightboxImg.src = src;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !lightbox.classList.contains('hidden')) closeLightbox();
  });
}
