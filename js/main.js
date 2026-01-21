document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initChatButton();
  initHeaderTheme(); 
  initProjectGallery();
});

function initMobileMenu() {
  const hamburger = document.querySelector('.header__hamburger');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavClose = document.querySelector('.mobile-nav-close-button');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileNavOverlay) return;

  const openMobileNav = () => {
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNavOverlay.classList.add('open');
    mobileNavOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
  };

  const closeMobileNav = () => {
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNavOverlay.classList.remove('open');
    mobileNavOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.lenis) window.lenis.start();
  };

  hamburger.addEventListener('click', () => {
    if (mobileNavOverlay.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  // Close on backdrop click
  mobileNavOverlay.addEventListener('click', (e) => {
    if (e.target === mobileNavOverlay) {
      closeMobileNav();
    }
  });

  // Close on link click
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavOverlay.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // Handle resize - close mobile nav if viewport becomes wider
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && mobileNavOverlay.classList.contains('open')) {
        closeMobileNav();
      }
    }, 100);
  });
}


function initChatButton() {
  const chatButton = document.querySelector('.footer__chat-button');

  if (!chatButton) return;

  chatButton.addEventListener('click', () => {
    window.location.href = 'contact.html';
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target && window.lenis) {
        window.lenis.scrollTo(target, {
          offset: -80,
          duration: 1.2
        });
      } else if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initHeaderTheme() {
  const header = document.querySelector('.header');
  const hero = document.querySelector('.hero');
  if (!header || !hero) return;

  const updateHeader = () => {
    const scroll = window.scrollY;
    const heroBottom = hero.offsetHeight;
    
    header.classList.remove('header--transparent', 'header--light', 'header--dark');
    
    if (scroll < 80) {
      header.classList.add('header--transparent');
    } else if (scroll < heroBottom - 100) {
      header.classList.add('header--light');
    } else {
      header.classList.add('header--dark');
    }
  };

  window.addEventListener('scroll', updateHeader);
  updateHeader();
}

// =========================================
// Project Gallery - Instagram-style Carousel
// =========================================
function initProjectGallery() {
  const gallery = document.getElementById('gallery');
  const track = document.getElementById('gallery-track');
  const dotsContainer = document.getElementById('gallery-dots');
  const currentSpan = document.getElementById('gallery-current');
  const totalSpan = document.getElementById('gallery-total');
  const closeBtn = gallery?.querySelector('.gallery__close');
  const prevBtn = gallery?.querySelector('.gallery__nav--prev');
  const nextBtn = gallery?.querySelector('.gallery__nav--next');
  const backdrop = gallery?.querySelector('.gallery__backdrop');

  if (!gallery || !track) return;

  // Gallery data - AquaTrack images in specified order
  const galleryData = {
    aquatrack: [
      { src: 'assets/images/Dashboard.png', alt: 'AquaTrack Dashboard' },
      { src: 'assets/images/customers.png', alt: 'AquaTrack Customers' },
      { src: 'assets/images/Farmer.png', alt: 'AquaTrack Farmer' },
      { src: 'assets/images/fishes.png', alt: 'AquaTrack Fishes' },
      { src: 'assets/images/report.png', alt: 'AquaTrack Report' }
    ]
  };

  let currentIndex = 0;
  let images = [];
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  // Open gallery
  const openGallery = (galleryName) => {
    images = galleryData[galleryName] || [];
    if (images.length === 0) return;

    currentIndex = 0;
    renderGallery();
    gallery.classList.add('is-active');
    gallery.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();

    // Animate in with GSAP
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(gallery.querySelector('.gallery__container'),
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.4)' }
      );
    }

    // Focus close button for accessibility
    setTimeout(() => closeBtn?.focus(), 100);
  };

  // Close gallery
  const closeGallery = () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(gallery.querySelector('.gallery__container'), {
        scale: 0.9,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: finishClose
      });
    } else {
      finishClose();
    }
  };

  const finishClose = () => {
    gallery.classList.remove('is-active');
    gallery.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.lenis) window.lenis.start();
  };

  // Render gallery content
  const renderGallery = () => {
    // Clear existing
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Create slides
    images.forEach((img, index) => {
      const slide = document.createElement('div');
      slide.className = 'gallery__slide';
      slide.innerHTML = `<img src="${img.src}" alt="${img.alt}" draggable="false">`;
      track.appendChild(slide);

      // Create dot
      const dot = document.createElement('button');
      dot.className = 'gallery__dot' + (index === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Go to image ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    totalSpan.textContent = images.length;
    updateGallery();
  };

  // Navigate to slide
  const goToSlide = (index) => {
    currentIndex = Math.max(0, Math.min(index, images.length - 1));
    updateGallery();
  };

  // Update gallery state
  const updateGallery = () => {
    const slideWidth = track.parentElement.offsetWidth;
    currentTranslate = -currentIndex * slideWidth;
    prevTranslate = currentTranslate;
    track.style.transform = `translateX(${currentTranslate}px)`;

    // Update counter
    currentSpan.textContent = currentIndex + 1;

    // Update dots
    dotsContainer.querySelectorAll('.gallery__dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });

    // Update nav buttons
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === images.length - 1;
  };

  // Navigation
  const prevSlide = () => goToSlide(currentIndex - 1);
  const nextSlide = () => goToSlide(currentIndex + 1);

  // Touch/Swipe handling
  const touchStart = (e) => {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    track.style.transition = 'none';
  };

  const touchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
    track.style.transform = `translateX(${currentTranslate}px)`;
  };

  const touchEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';

    const slideWidth = track.parentElement.offsetWidth;
    const diff = currentTranslate - prevTranslate;
    const threshold = slideWidth * 0.2;

    if (diff < -threshold && currentIndex < images.length - 1) {
      nextSlide();
    } else if (diff > threshold && currentIndex > 0) {
      prevSlide();
    } else {
      updateGallery();
    }
  };

  // Event listeners
  document.querySelectorAll('[data-gallery]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openGallery(btn.dataset.gallery);
    });
  });

  closeBtn?.addEventListener('click', closeGallery);
  backdrop?.addEventListener('click', closeGallery);
  prevBtn?.addEventListener('click', prevSlide);
  nextBtn?.addEventListener('click', nextSlide);

  // Touch events
  track.addEventListener('touchstart', touchStart, { passive: true });
  track.addEventListener('touchmove', touchMove, { passive: true });
  track.addEventListener('touchend', touchEnd);

  // Mouse events for desktop drag
  track.addEventListener('mousedown', touchStart);
  track.addEventListener('mousemove', touchMove);
  track.addEventListener('mouseup', touchEnd);
  track.addEventListener('mouseleave', () => { if (isDragging) touchEnd(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!gallery.classList.contains('is-active')) return;

    switch (e.key) {
      case 'Escape':
        closeGallery();
        break;
      case 'ArrowLeft':
        prevSlide();
        break;
      case 'ArrowRight':
        nextSlide();
        break;
    }
  });

  // Handle resize
  window.addEventListener('resize', () => {
    if (gallery.classList.contains('is-active')) {
      updateGallery();
    }
  });
}

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
