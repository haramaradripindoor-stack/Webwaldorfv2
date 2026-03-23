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
  // UTILIDADES MEJORADAS
  // ======================
  const Utils = {
    // Throttle para optimizar eventos de scroll
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

    // Debounce para eventos de resize
    debounce(func, delay) {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },

    // Precarga de imagen con promesa
    preloadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    },

    // Detectar dispositivo táctil
    isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
  };

  // ======================
  // 1. MENÚ MÓVIL MEJORADO
  // ======================
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const navbar = document.getElementById('navbar');
  let lastScrollTop = 0;

  if (mobileMenu && navMenu) {
    // Toggle menú con animación
    mobileMenu.addEventListener('click', function() {
      const isActive = navMenu.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = isActive ? 'hidden' : '';
      
      // Añadir atributo ARIA para accesibilidad
      mobileMenu.setAttribute('aria-expanded', isActive);
    });

    // Cerrar menú al hacer clic en enlaces
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenu.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!navbar?.contains(e.target) && navMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ======================
  // 2. SLIDESHOW AVANZADO
  // ======================
  let slideIndex = 1;
  let slideInterval;
  let isPaused = false;
  const slideshowContainer = document.querySelector('.slideshow-container');
  const slides = document.getElementsByClassName('slide');
  const dots = document.getElementsByClassName('dot');

  // Precarga de imágenes del slideshow
  async function preloadSlideImages() {
    const images = Array.from(slides).map(slide => {
      const img = slide.querySelector('img');
      return img ? Utils.preloadImage(img.src) : null;
    });
    await Promise.all(images.filter(Boolean));
  }

  function changeSlide(n) {
    showSlide(slideIndex += n);
    resetInterval();
  }

  function currentSlide(n) {
    showSlide(slideIndex = n);
    resetInterval();
  }

  function showSlide(n) {
    if (slides.length === 0) return;

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    
    // Animación mejorada con fade
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.opacity = '0';
      setTimeout(() => {
        slides[i].classList.remove('active');
      }, CONFIG.animationDuration);
      
      if (dots[i]) dots[i].classList.remove('active');
    }
    
    setTimeout(() => {
      slides[slideIndex - 1].classList.add('active');
      slides[slideIndex - 1].style.opacity = '1';
    }, CONFIG.animationDuration);
    
    if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add('active');
  }

  function autoSlide() {
    if (!isPaused) changeSlide(1);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlide, CONFIG.slideInterval);
  }

  // Pausar en hover
  if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    
    slideshowContainer.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // Touch/Swipe para slideshow
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
        if (deltaX > 0) {
          changeSlide(-1); // Swipe derecha = imagen anterior
        } else {
          changeSlide(1); // Swipe izquierda = imagen siguiente
        }
      }
      
      setTimeout(() => { isPaused = false; }, 1000);
    }, { passive: true });
  }

  // Inicializar slideshow
  if (slides.length > 0) {
    preloadSlideImages();
    showSlide(slideIndex);
    slideInterval = setInterval(autoSlide, CONFIG.slideInterval);
  }

  // Hacer funciones globales para botones
  window.changeSlide = changeSlide;
  window.currentSlide = currentSlide;

  // ======================
  // 3. SCROLL SUAVE MEJORADO
  // ======================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Actualizar URL sin scroll
        history.pushState(null, null, href);
      }
    });
  });

  // ======================
  // 4. NAVBAR INTELIGENTE
  // ======================
  const handleScroll = Utils.throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Añadir clase scrolled
    if (scrollTop > 100) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    
    // Ocultar/mostrar navbar según dirección de scroll
    if (scrollTop > lastScrollTop && scrollTop > 300) {
      // Scroll hacia abajo - ocultar
      if (navbar) navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scroll hacia arriba - mostrar
      if (navbar) navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;

    // Resaltar enlace activo
    highlightActiveSection();
  }, CONFIG.scrollThrottle);

  window.addEventListener('scroll', handleScroll);

  // Resaltar sección activa en navegación
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
  // 5. FAQ ACORDEÓN MEJORADO
  // ======================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    
    if (!question || !answer) return;
    
    // Configurar altura inicial
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.4s ease, padding 0.4s ease';
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Cerrar otros items (opcional para accordion único)
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
      
      // Toggle item actual
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
        
        // Scroll suave al item abierto
        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          if (rect.top < 100) {
            item.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 400);
      }
    });

    // Soporte de teclado
    question.setAttribute('tabindex', '0');
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  // ======================
  // 6. MODAL DE GALERÍA PREMIUM
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

    // Mejorar interactividad de imágenes
    allImages.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Click para ampliar imagen');
      
      // Click para abrir
      img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        currentImageIndex = index;
        openModal(this.src, this.alt);
      });
      
      // Soporte de teclado
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
      
      // Fade in animation
      modalImg.style.opacity = '0';
      modalImg.src = src;
      modalImg.alt = alt;
      
      setTimeout(() => {
        modalImg.style.opacity = '1';
      }, 50);
      
      document.body.style.overflow = 'hidden';
      updateNavigationButtons();
      resetZoom();
    }

    function closeModal() {
      modal.classList.remove('show');
      modalImg.style.opacity = '0';
      
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetZoom();
      }, 300);
    }

    function previousImage() {
      if (allImages.length <= 1) return;
      
      // Animación de transición
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
      
      // Animación de transición
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

    // ZOOM FUNCTIONALITY
    function toggleZoom(e) {
      if (isZoomed) {
        resetZoom();
      } else {
        zoomLevel = 2;
        isZoomed = true;
        modalImg.style.transform = `scale(${zoomLevel})`;
        modalImg.style.cursor = 'zoom-out';
        
        // Ajustar origen del zoom basado en click
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

    // Click en imagen para zoom
    modalImg.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleZoom(e);
    });

    // Cerrar con X
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Teclado mejorado
    document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex') {
        switch(e.key) {
          case 'Escape':
            closeModal();
            break;
          case 'ArrowLeft':
            previousImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case '+':
          case '=':
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
          case '0':
            resetZoom();
            break;
        }
      }
    });

    // Touch swipe mejorado con zoom
    let startX = 0;
    let startY = 0;
    let pinchStartDistance = 0;
    
    modal.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        
        // Detectar doble tap para zoom
        const currentTime = Date.now();
        if (currentTime - lastTap < 300) {
          e.preventDefault();
          toggleZoom();
        }
        lastTap = currentTime;
        
      } else if (e.touches.length === 2) {
        // Inicio de pinch zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDistance = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: false });

    modal.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && pinchStartDistance > 0) {
        // Pinch zoom
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
      
      // Swipe horizontal para navegación
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > CONFIG.swipeThreshold) {
        if (deltaX > 0) previousImage();
        else nextImage();
      }
      
      // Swipe vertical hacia abajo para cerrar
      if (deltaY > 100 && Math.abs(deltaX) < 50) {
        closeModal();
      }
    }, { passive: true });
  }

  initializeModal();

 // ======================
// 7. MODAL DE ARRIENDO MEJORADO - CORREGIDO
// ======================
let currentArriendoIndex = 0;
const arriendoImages = [
  { src: "./images/salon-principal.jpg", alt: "Salón Principal" },
  { src: "./images/cocina.jpg", alt: "Cocina Equipada" },
  { src: "./images/estacionamiento.jpg", alt: "Estacionamiento" }
];

// ABRIR MODAL DE ARRIENDO
window.openArriendoModal = function(src, caption) {
  const modal = document.getElementById("arriendoModal");
  const modalImg = document.getElementById("arriendoModalImage");
  const modalCaption = document.getElementById("arriendoModalCaption");
  const counter = document.getElementById("arriendoCounter");

  if (!modal || !modalImg) {
    console.error("❌ Modal de arriendo no encontrado en el HTML");
    return;
  }

  // Encontrar índice
  currentArriendoIndex = arriendoImages.findIndex(img => img.src === src);
  if (currentArriendoIndex === -1) currentArriendoIndex = 0;

  // Mostrar modal con fade
  modal.style.display = "flex";
  modal.classList.add("show"); // Asegúrate de que el modal tenga transición
  modalImg.style.opacity = "0";
  modalImg.src = src;
  modalImg.alt = arriendoImages[currentArriendoIndex].alt;

  setTimeout(() => {
    modalImg.style.opacity = "1";
  }, 50);

  if (modalCaption) modalCaption.textContent = caption;
  if (counter) counter.textContent = `${currentArriendoIndex + 1} / ${arriendoImages.length}`;

  document.body.style.overflow = "hidden";
  console.log("🖼️ Modal de arriendo abierto:", src);
};

// CAMBIAR IMAGEN
window.changeArriendoImage = function(n) {
  const modalImg = document.getElementById("arriendoModalImage");
  const modalCaption = document.getElementById("arriendoModalCaption");
  const counter = document.getElementById("arriendoCounter");

  if (!modalImg) return;

  // Animación
  modalImg.style.opacity = "0";
  setTimeout(() => {
    currentArriendoIndex = (currentArriendoIndex + n + arriendoImages.length) % arriendoImages.length;
    const img = arriendoImages[currentArriendoIndex];
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalImg.style.opacity = "1";

    if (modalCaption) modalCaption.textContent = img.alt;
    if (counter) counter.textContent = `${currentArriendoIndex + 1} / ${arriendoImages.length}`;
  }, 200);
};

// CERRAR MODAL
window.closeArriendoModal = function() {
  const modal = document.getElementById("arriendoModal");
  const modalImg = document.getElementById("arriendoModalImage");

  if (!modal || !modalImg) return;

  modal.classList.remove("show");
  modalImg.style.opacity = "0";

  setTimeout(() => {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
};

// Cerrar con X
const arriendoCloseBtn = document.querySelector('#arriendoModal .close');
if (arriendoCloseBtn) {
  arriendoCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.closeArriendoModal();
  });
}

// Cerrar al hacer clic fuera
const arriendoModal = document.getElementById("arriendoModal");
if (arriendoModal) {
  arriendoModal.addEventListener('click', (e) => {
    if (e.target === arriendoModal) window.closeArriendoModal();
  });
}

// Swipe en móvil
let startX = 0;
if (arriendoModal) {
  arriendoModal.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  arriendoModal.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    if (Math.abs(deltaX) > 50) {
      window.changeArriendoImage(deltaX > 0 ? -1 : 1);
    }
  }, { passive: true });
}

// Teclado
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById("arriendoModal");
  if (modal && modal.style.display === "flex") {
    if (e.key === "Escape") window.closeArriendoModal();
    if (e.key === "ArrowLeft") window.changeArriendoImage(-1);
    if (e.key === "ArrowRight") window.changeArriendoImage(1);
  }
});

  // ======================
  // 8. BOTÓN VOLVER ARRIBA
  // ======================
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Volver arriba');
  backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: var(--primary-green, #2E5E4E);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(backToTopBtn);

  // Mostrar/ocultar botón
  window.addEventListener('scroll', Utils.throttle(() => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.visibility = 'visible';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.visibility = 'hidden';
    }
  }, 100));

  // Click para volver arriba
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
          
          // Añadir clase cuando cargue
          img.onload = () => {
            img.classList.add('loaded');
          };
        }
      });
    }, {
      rootMargin: '50px 0px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ======================
  // 10. ANIMACIONES AL SCROLL
  // ======================
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if (animatedElements.length > 0) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, index * 50);
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => {
      animationObserver.observe(element);
    });
  }

  // ======================
  // PERFORMANCE LOGGING
  // ======================
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
      console.log('🚀 Performance Metrics:');
      console.log(`  Page Load Time: ${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`);
      console.log(`  DOM Interactive: ${(perfData.domInteractive - perfData.fetchStart).toFixed(2)}ms`);
    }
  });

  // ======================
  // ESTADO GLOBAL PARA DEBUG
  // ======================
  window.TrekanDebug = {
    version: '2.0',
    images: allImages.length,
    slides: slides.length,
    performance: performance.now(),
    config: CONFIG
  };

  console.log('✅ Colegio Waldorf Trekan - Script cargado exitosamente');
});