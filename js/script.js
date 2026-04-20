document.addEventListener('DOMContentLoaded', function() {
  // ======================
  // CONFIGURACIÓN GLOBAL
  // ======================
  const CONFIG = {
    slideInterval: 5000,
    swipeThreshold: 50,
    scrollThrottle: 100,
    animationDuration: 300
  };

  // ======================
  // DEBUG (false en producción)
  // ======================
  const DEBUG = false;
  const log = (...args) => DEBUG && console.log(...args);

  // ======================
  // UTILIDADES
  // ======================
  const Utils = {
    throttle(func, delay) {
      let lastCall = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          return func.apply(this, args);
        }
      };
    },

    debounce(func, delay) {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },

    preloadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    },

    isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
  };

  // ======================
  // 1. MENÚ MÓVIL
  // ======================
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const navbar = document.getElementById('navbar');
  let lastScrollTop = 0;

  function closeMobileMenu() {
    if (!mobileMenu || !navMenu) return;
    mobileMenu.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenu.setAttribute('aria-expanded', 'false');
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  }

  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', function() {
      const isActive = navMenu.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
      mobileMenu.setAttribute('aria-expanded', isActive);
      if (!isActive) {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
      }
    });

    navLinks.forEach(link => {
      if (!link.classList.contains('dropdown-toggle')) {
        link.addEventListener('click', () => closeMobileMenu());
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // ======================
  // 2. SLIDESHOW
  // FIX: preloadSlideImages eliminado — cargaba las 11 imágenes a la vez,
  //      anulando el loading="lazy". Ahora se precarga solo la siguiente.
  // FIX: race condition en showSlide con setTimeout múltiple corregida
  //      usando un flag isAnimating para bloquear clics durante transición.
  // ======================
  let slideIndex = 1;
  let slideInterval;
  let isPaused = false;
  let isAnimating = false; // FIX: previene race condition con clicks rápidos
  const slideshowContainer = document.querySelector('.slideshow-container');
  const slides = document.getElementsByClassName('slide');
  const dots = document.getElementsByClassName('dot');

  // FIX: Precarga solo la imagen siguiente (no todas a la vez)
  function preloadNextSlide(currentIdx) {
    const nextIdx = currentIdx % slides.length; // siguiente slide (0-based)
    const nextImg = slides[nextIdx]?.querySelector('img');
    if (nextImg && nextImg.src) {
      Utils.preloadImage(nextImg.src).catch(() => {}); // silenciar error si falla
    }
  }

  function changeSlide(n) {
    if (isAnimating) return; // FIX: bloquear durante animación
    showSlide(slideIndex += n);
    resetInterval();
  }

  function currentSlide(n) {
    if (isAnimating) return;
    showSlide(slideIndex = n);
    resetInterval();
  }

  function showSlide(n) {
    if (slides.length === 0) return;
    isAnimating = true;

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    // Ocultar todos
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
    }

    // Mostrar el activo con fade
    const activeSlide = slides[slideIndex - 1];
    if (activeSlide) {
      activeSlide.style.opacity = '0';
      activeSlide.classList.add('active');
      // Forzar reflow para que la transición funcione
      void activeSlide.offsetWidth;
      activeSlide.style.opacity = '1';
    }

    if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add('active');

    // Precargar la siguiente
    preloadNextSlide(slideIndex);

    setTimeout(() => { isAnimating = false; }, CONFIG.animationDuration + 50);
  }

  function autoSlide() {
    if (!isPaused) changeSlide(1);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlide, CONFIG.slideInterval);
  }

  if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', () => { isPaused = true; });
    slideshowContainer.addEventListener('mouseleave', () => { isPaused = false; });

    let touchStartX = 0;
    let touchStartTime = 0;

    slideshowContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      isPaused = true;
    }, { passive: true });

    slideshowContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchDuration = Date.now() - touchStartTime;
      const deltaX = touchEndX - touchStartX;

      if (Math.abs(deltaX) > CONFIG.swipeThreshold && touchDuration < 500) {
        if (deltaX > 0) changeSlide(-1);
        else changeSlide(1);
      }

      setTimeout(() => { isPaused = false; }, 1000);
    }, { passive: true });
  }

  if (slides.length > 0) {
    showSlide(slideIndex);
    slideInterval = setInterval(autoSlide, CONFIG.slideInterval);
  }

  // Exponer funciones globales para botones inline del HTML
  window.changeSlide = changeSlide;
  window.currentSlide = currentSlide;

  // ======================
  // 3. SCROLL SUAVE
  // FIX: scroll-behavior: smooth eliminado del CSS para evitar doble animación.
  //      El JS es la única fuente de verdad para el scroll suave + offset del nav.
  // ======================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        history.pushState(null, null, href);
      }
    });
  });

  // ======================
  // 4. NAVBAR INTELIGENTE
  // ======================
  const handleScroll = Utils.throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (scrollTop > lastScrollTop && scrollTop > 300) {
      if (navbar) navbar.style.transform = 'translateY(-100%)';
    } else {
      if (navbar) navbar.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
    highlightActiveSection();
  }, CONFIG.scrollThrottle);

  window.addEventListener('scroll', handleScroll);

  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ======================
  // 5. FAQ ACORDEÓN
  // ======================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (!question || !answer) return;

    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.4s ease, padding 0.4s ease';

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Cerrar otros items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          otherItem.classList.remove('active');
          otherAnswer.style.maxHeight = '0';
          otherAnswer.style.padding = '0 20px';
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
        answer.style.padding = '0 20px';
        if (icon) icon.textContent = '+';
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        answer.style.padding = '20px';
        if (icon) icon.textContent = '−';

        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          if (rect.top < 100) {
            item.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 400);
      }
    });

    question.setAttribute('tabindex', '0');
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  // ======================
  // 6. MODAL DE GALERÍA PRINCIPAL
  // ======================
  let currentImageIndex = 0;
  let allImages = [];
  let isZoomed = false;
  let zoomLevel = 1;
  let lastTap = 0;

  function initializeModal() {
    const images = document.querySelectorAll('.news-image img, .news-gallery-item img, .slide img');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = modal?.querySelector('.close');

    if (!modal || !modalImg) return;

    allImages = Array.from(images);

    allImages.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Click para ampliar imagen');

      img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        currentImageIndex = index;
        openModal(this.src, this.alt);
      });

      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          currentImageIndex = index;
          openModal(img.src, img.alt);
        }
      });
    });

    function openModal(src, alt) {
      modal.style.display = 'flex';
      modal.classList.add('show');
      modalImg.style.opacity = '0';
      modalImg.src = src;
      modalImg.alt = alt;
      setTimeout(() => { modalImg.style.opacity = '1'; }, 50);
      document.body.style.overflow = 'hidden';
      updateNavigationButtons();
      resetZoom();
    }

    function closeModal() {
      modal.classList.remove('show');
      modalImg.style.opacity = '0';
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        resetZoom();
      }, 300);
    }

    function previousImage() {
      if (allImages.length <= 1) return;
      modalImg.style.opacity = '0';
      setTimeout(() => {
        currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        const img = allImages[currentImageIndex];
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalImg.style.opacity = '1';
        updateNavigationButtons();
        resetZoom();
      }, 200);
    }

    function nextImage() {
      if (allImages.length <= 1) return;
      modalImg.style.opacity = '0';
      setTimeout(() => {
        currentImageIndex = (currentImageIndex + 1) % allImages.length;
        const img = allImages[currentImageIndex];
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalImg.style.opacity = '1';
        updateNavigationButtons();
        resetZoom();
      }, 200);
    }

    function updateNavigationButtons() {
      const prevBtn = document.querySelector('.modal-prev');
      const nextBtn = document.querySelector('.modal-next');
      const counter = document.querySelector('.modal-counter');

      if (prevBtn) {
        prevBtn.style.display = allImages.length > 1 ? 'flex' : 'none';
        prevBtn.onclick = previousImage;
      }
      if (nextBtn) {
        nextBtn.style.display = allImages.length > 1 ? 'flex' : 'none';
        nextBtn.onclick = nextImage;
      }
      if (counter) {
        counter.textContent = `${currentImageIndex + 1} / ${allImages.length}`;
        counter.style.display = allImages.length > 1 ? 'block' : 'none';
      }
    }

    function toggleZoom(e) {
      if (isZoomed) {
        resetZoom();
      } else {
        zoomLevel = 2;
        isZoomed = true;
        modalImg.style.transform = `scale(${zoomLevel})`;
        modalImg.style.cursor = 'zoom-out';
        if (e) {
          const rect = modalImg.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          modalImg.style.transformOrigin = `${x}% ${y}%`;
        }
      }
    }

    function resetZoom() {
      zoomLevel = 1;
      isZoomed = false;
      modalImg.style.transform = 'scale(1)';
      modalImg.style.cursor = 'zoom-in';
      modalImg.style.transformOrigin = 'center';
    }

    modalImg.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleZoom(e);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex') {
        switch(e.key) {
          case 'Escape': closeModal(); break;
          case 'ArrowLeft': previousImage(); break;
          case 'ArrowRight': nextImage(); break;
          case '+': case '=':
            if (zoomLevel < 3) {
              zoomLevel += 0.5;
              modalImg.style.transform = `scale(${zoomLevel})`;
              isZoomed = zoomLevel > 1;
            }
            break;
          case '-':
            if (zoomLevel > 1) {
              zoomLevel -= 0.5;
              modalImg.style.transform = `scale(${zoomLevel})`;
              isZoomed = zoomLevel > 1;
            }
            break;
          case '0': resetZoom(); break;
        }
      }
    });

    // Touch swipe + pinch zoom en modal
    let startX = 0;
    let startY = 0;
    let pinchStartDistance = 0;

    modal.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        const currentTime = Date.now();
        if (currentTime - lastTap < 300) {
          e.preventDefault();
          toggleZoom();
        }
        lastTap = currentTime;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDistance = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: false });

    modal.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && pinchStartDistance > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        const scale = currentDistance / pinchStartDistance;
        zoomLevel = Math.max(1, Math.min(3, zoomLevel * scale));
        modalImg.style.transform = `scale(${zoomLevel})`;
        isZoomed = zoomLevel > 1;
      }
    }, { passive: false });

    modal.addEventListener('touchend', (e) => {
      if (pinchStartDistance > 0) {
        pinchStartDistance = 0;
        return;
      }
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > CONFIG.swipeThreshold) {
        if (deltaX > 0) previousImage();
        else nextImage();
      }
      if (deltaY > 100 && Math.abs(deltaX) < 50) closeModal();
    }, { passive: true });
  }

  initializeModal();

  // ======================
  // 7. MODAL DE ARRIENDO
  // FIX: console.log de debug eliminados de producción
  // FIX: salon-principal.jpg fallback si imagen no carga
  // ======================
  let currentArriendoIndex = 0;
  const arriendoImages = [
    { src: './images/salon-principal.jpg', alt: 'Salón Principal' },
    { src: './images/cocina.jpg', alt: 'Cocina Equipada' },
    { src: './images/estacionamiento.jpg', alt: 'Estacionamiento' }
  ];

  window.openArriendoModal = function(src, caption) {
    const modal = document.getElementById('arriendoModal');
    const modalImg = document.getElementById('arriendoModalImage');
    const modalCaption = document.getElementById('arriendoModalCaption');

    if (!modal || !modalImg) return;

    currentArriendoIndex = arriendoImages.findIndex(img => img.src === src);
    if (currentArriendoIndex === -1) currentArriendoIndex = 0;

    modal.style.display = 'flex';
    modal.classList.add('show');
    modalImg.style.opacity = '0';
    modalImg.src = src;
    modalImg.alt = arriendoImages[currentArriendoIndex].alt;

    // FIX: fallback si la imagen falla (ej: salon-principal.jpg faltante)
    modalImg.onerror = function() {
      this.style.display = 'none';
      const fallback = modal.querySelector('.arriendo-fallback-msg');
      if (!fallback) {
        const msg = document.createElement('p');
        msg.className = 'arriendo-fallback-msg';
        msg.textContent = 'Imagen no disponible';
        msg.style.cssText = 'color:white;font-size:1.2rem;text-align:center;';
        modal.appendChild(msg);
      }
    };

    setTimeout(() => { modalImg.style.opacity = '1'; }, 50);
    if (modalCaption) modalCaption.textContent = caption;
    document.body.style.overflow = 'hidden';
    log('Modal de arriendo abierto:', src); // solo en DEBUG=true
  };

  window.changeArriendoImage = function(n) {
    const modalImg = document.getElementById('arriendoModalImage');
    const modalCaption = document.getElementById('arriendoModalCaption');
    if (!modalImg) return;

    modalImg.style.opacity = '0';
    setTimeout(() => {
      currentArriendoIndex = (currentArriendoIndex + n + arriendoImages.length) % arriendoImages.length;
      const img = arriendoImages[currentArriendoIndex];
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalImg.style.opacity = '1';
      if (modalCaption) modalCaption.textContent = img.alt;
    }, 200);
  };

  window.closeArriendoModal = function() {
    const modal = document.getElementById('arriendoModal');
    const modalImg = document.getElementById('arriendoModalImage');
    if (!modal || !modalImg) return;

    modal.classList.remove('show');
    modalImg.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  };

  const arriendoCloseBtn = document.querySelector('#arriendoModal .close');
  if (arriendoCloseBtn) {
    arriendoCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.closeArriendoModal();
    });
  }

  const arriendoModal = document.getElementById('arriendoModal');
  if (arriendoModal) {
    arriendoModal.addEventListener('click', (e) => {
      if (e.target === arriendoModal) window.closeArriendoModal();
    });

    // FIX: usar variable local para no colisionar con startX del modal principal
    let arriendoTouchStartX = 0;
    arriendoModal.addEventListener('touchstart', (e) => {
      arriendoTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    arriendoModal.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - arriendoTouchStartX;
      if (Math.abs(deltaX) > 50) {
        window.changeArriendoImage(deltaX > 0 ? -1 : 1);
      }
    }, { passive: true });
  }

  // Teclado para modal de arriendo
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('arriendoModal');
    if (modal && modal.style.display === 'flex') {
      if (e.key === 'Escape') window.closeArriendoModal();
      if (e.key === 'ArrowLeft') window.changeArriendoImage(-1);
      if (e.key === 'ArrowRight') window.changeArriendoImage(1);
    }
  });

  // ======================
  // 8. BOTÓN VOLVER ARRIBA
  // FIX: inline style.cssText eliminado — el CSS (.back-to-top) ya lo maneja.
  //      El inline style sobreescribía el CSS por especificidad.
  // ======================
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Volver arriba');
  document.body.appendChild(backToTopBtn);

  window.addEventListener('scroll', Utils.throttle(() => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.visibility = 'visible';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.visibility = 'hidden';
    }
  }, 100));

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ======================
  // 9. LAZY LOADING DE IMÁGENES
  // ======================
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
          img.onload = () => img.classList.add('loaded');
        }
      });
    }, { rootMargin: '50px 0px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ======================
  // 10. ANIMACIONES AL SCROLL
  // ======================
  // ======================
  // 10. ANIMACIONES AL SCROLL (mejorado con data-delay y tipos)
  // ======================
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length > 0) {
    // Preparar elementos antes de que aparezcan
    animatedElements.forEach(el => {
      el.classList.add('pre-animate');
    });

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.remove('pre-animate');
            entry.target.classList.add('animated');
          }, delay);
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  }


  // ======================
  // 14. DROPDOWN NAV — Click en desktop y móvil
  // ======================
  const dropdownItems = document.querySelectorAll('.dropdown');

  dropdownItems.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu   = dropdown.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const isOpen = dropdown.classList.contains('open');
      dropdownItems.forEach(d => {
        d.classList.remove('open');
        const m = d.querySelector('.dropdown-menu');
        if (m) { m.style.left = ''; m.style.top = ''; }
      });
      if (!isOpen) {
        dropdown.classList.add('open');
        // Solo posicionar con JS en desktop
        if (window.innerWidth > 768) {
          const rect = toggle.getBoundingClientRect();
          const navH = navbar ? navbar.offsetHeight : 70;
          menu.style.position = 'fixed';
          menu.style.left = rect.left + 'px';
          menu.style.top  = navH + 'px';
        } else {
          // En movil: limpiar estilos inline, dejar que CSS maneje
          menu.style.position = '';
          menu.style.left = '';
          menu.style.top  = '';
        }
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        dropdown.classList.remove('open');
        // Smooth scroll to section
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      dropdownItems.forEach(d => {
        d.classList.remove('open');
        const m = d.querySelector('.dropdown-menu');
        if (m) { m.style.left = ''; m.style.top = ''; m.style.position = ''; }
      });
    }
    // Cerrar menu movil al hacer click fuera
    if (navMenu && navMenu.classList.contains('active') && !e.target.closest('#navbar')) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dropdownItems.forEach(d => d.classList.remove('open'));
  });

  // ======================
  // 11. FORMULARIO DE CONTACTO — Feedback visual
  // (FormSubmit maneja el envío, esto mejora UX antes del redirect)
  // ======================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function() {
      const btn = this.querySelector('.contact-submit');
      if (btn) {
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
      }
    });
  }

  // ======================
  // 12. BARRA DE PROGRESO DE SCROLL
  // ======================
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', Utils.throttle(() => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled  = (window.scrollY / docHeight) * 100;
      progressBar.style.width = Math.min(scrolled, 100) + '%';
    }, 16), { passive: true });
  }

  // ======================
  // 13. WEB SHARE API — Botón compartir nativo en móvil
  // ======================
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn && navigator.share) {
    shareBtn.style.display = 'inline-block';
    shareBtn.addEventListener('click', async () => {
      try {
        await navigator.share({
          title: 'Colegio Waldorf Trekan',
          text: 'Educación con el corazón, en armonía con la naturaleza. Puerto Varas, Chile.',
          url:   'https://www.colegiowaldorftrekan.cl'
        });
      } catch (err) {
        log('Share cancelado o no disponible');
      }
    });
  }

  log('✅ Colegio Waldorf Trekan — Script cargado v2.1');
});


