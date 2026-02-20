/* ================================================================
   L'Atelier d'Antoine — Script principal
   ================================================================ */

// --------------------------------
// 1. Navigation : scroll + mobile
// --------------------------------
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile');

  if (!nav) return;

  // Effet scroll
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Menu hamburger
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fermeture au clic extérieur
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Fermeture après navigation
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

// --------------------------------
// 2. Galerie : filtres par sous-catégorie
// --------------------------------
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Mise à jour bouton actif
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.removeAttribute('aria-pressed');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;

      items.forEach(function (item) {
        const match = filter === 'all' || item.dataset.subcategory === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });
})();

// --------------------------------
// 3. Lightbox
// --------------------------------
(function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');

  let currentImages = [];
  let currentIndex = 0;

  function getLargestSrc(imgEl) {
    // Essaie de récupérer la plus grande version WebP du srcset
    const picture = imgEl.closest('picture');
    if (picture) {
      const sources = picture.querySelectorAll('source[type="image/webp"]');
      for (const source of sources) {
        if (source.srcset) {
          const entries = source.srcset.split(',');
          const last = entries[entries.length - 1].trim().split(' ')[0];
          if (last) return last;
        }
      }
    }
    return imgEl.currentSrc || imgEl.src || imgEl.getAttribute('src');
  }

  function openLightbox(images, index) {
    currentImages = images;
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    const img = currentImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt || '';
    lightboxCounter.textContent = currentImages.length > 1
      ? (currentIndex + 1) + ' / ' + currentImages.length
      : '';
    lightboxPrev.style.display = currentImages.length > 1 ? '' : 'none';
    lightboxNext.style.display = currentImages.length > 1 ? '' : 'none';
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    renderLightbox();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    renderLightbox();
  }

  // Attacher les handlers aux items de galerie
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      // Récupère les images depuis la div .gallery-photo-data (masquée)
      const dataEl = item.querySelector('.gallery-photo-data');
      const imgEls = dataEl
        ? dataEl.querySelectorAll('img')
        : item.querySelectorAll('.gallery-item-thumb img');

      const images = Array.from(imgEls).map(function (img) {
        return { src: getLargestSrc(img), alt: img.alt };
      });

      // Fallback : image thumbnail visible
      if (!images.length) {
        const thumb = item.querySelector('.gallery-item-thumb img');
        if (thumb) {
          images.push({ src: getLargestSrc(thumb), alt: thumb.alt });
        }
      }

      if (images.length) openLightbox(images, 0);
    });

    // Accessibilité clavier
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Fermeture
  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Navigation
  lightboxPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    prevImage();
  });

  lightboxNext.addEventListener('click', function (e) {
    e.stopPropagation();
    nextImage();
  });

  // Clavier
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Swipe tactile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? nextImage() : prevImage();
    }
  }, { passive: true });
})();
