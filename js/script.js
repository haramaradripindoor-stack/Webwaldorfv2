// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

mobileMenu.addEventListener('click', function() {
  mobileMenu.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Slideshow
let slideIndex = 1;
let slideInterval;

function changeSlide(n) {
  showSlide(slideIndex += n);
  resetInterval();
}

function currentSlide(n) {
  showSlide(slideIndex = n);
  resetInterval();
}

function showSlide(n) {
  const slides = document.getElementsByClassName('slide');
  const dots = document.getElementsByClassName('dot');
  
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active');
  }
  
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active');
  }
  
  slides[slideIndex - 1].classList.add('active');
  dots[slideIndex - 1].classList.add('active');
}

function autoSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(autoSlide, 5000);
}

// Initialize slideshow
showSlide(slideIndex);
slideInterval = setInterval(autoSlide, 5000);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollTop = scrollTop;
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.parentElement;
    const icon = button.querySelector('.faq-icon');
    faqItem.classList.toggle('active');
    icon.textContent = faqItem.classList.contains('active') ? '−' : '+';
  });
});

// ============================================
// MODAL GALERÍA MEJORADO Y CORREGIDO
// Reemplaza toda la sección del modal en tu script.js
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  let currentImageIndex = 0;
  let allImages = [];
  
  // Recolecta todas las imágenes navegables
  function initializeModal() {
    const images = document.querySelectorAll('.news-image img, .news-gallery-item img, .slide img');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close');
    
    if (!modal || !modalImg) {
      console.error('Modal elements not found');
      return;
    }
    
    // Convierte NodeList a Array
    allImages = Array.from(images);
    
    console.log('Imágenes encontradas:', allImages.length);
    
    // Añade evento de clic a cada imagen
    allImages.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Imagen clickeada:', index);
        currentImageIndex = index;
        openModal(this.src, this.alt);
      });
    });
    
    // Función para abrir el modal
    function openModal(src, alt) {
      console.log('Abriendo modal con:', src);
      
      modal.style.display = 'flex';
      modal.classList.add('show');
      modalImg.src = src;
      modalImg.alt = alt;
      document.body.style.overflow = 'hidden';
      
      // Actualiza botones después de un pequeño delay
      setTimeout(updateNavigationButtons, 100);
    }
    
    // Función para cerrar el modal
    function closeModal() {
      console.log('Cerrando modal');
      modal.style.display = 'none';
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
    
    // Función para navegar a la imagen anterior
    function previousImage() {
      if (allImages.length <= 1) return;
      currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
      const img = allImages[currentImageIndex];
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      updateNavigationButtons();
    }
    
    // Función para navegar a la imagen siguiente
    function nextImage() {
      if (allImages.length <= 1) return;
      currentImageIndex = (currentImageIndex + 1) % allImages.length;
      const img = allImages[currentImageIndex];
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      updateNavigationButtons();
    }
    
    // Actualiza la visibilidad de los botones de navegación
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
    
    // Event listeners
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    
    // Cerrar modal haciendo clic en el fondo
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', function(event) {
      if (modal.style.display === 'flex' || modal.classList.contains('show')) {
        switch(event.key) {
          case 'Escape':
            closeModal();
            break;
          case 'ArrowLeft':
            if (allImages.length > 1) previousImage();
            break;
          case 'ArrowRight':
            if (allImages.length > 1) nextImage();
            break;
        }
      }
    });
    
    // Touch/swipe para móviles
    let startX = 0;
    let startY = 0;
    
    modal.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    
    modal.addEventListener('touchend', function(e) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Solo procesa si el movimiento horizontal es mayor que el vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe derecha = imagen anterior
          if (allImages.length > 1) previousImage();
        } else {
          // Swipe izquierda = imagen siguiente
          if (allImages.length > 1) nextImage();
        }
      }
    }, { passive: true });
    
    // Prevenir scroll del body cuando el modal está abierto
    modal.addEventListener('touchmove', function(e) {
      if (modal.style.display === 'flex') {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  // Inicializar modal
  initializeModal();
  
  // Re-inicializar si se cargan nuevas imágenes dinámicamente
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        // Verificar si se añadieron nuevas imágenes
        const hasNewImages = Array.from(mutation.addedNodes).some(node => 
          node.nodeType === 1 && (
            node.querySelector?.('.news-image img, .news-gallery-item img, .slide img') ||
            node.matches?.('.news-image img, .news-gallery-item img, .slide img')
          )
        );
        
        if (hasNewImages) {
          console.log('Nuevas imágenes detectadas, re-inicializando modal');
          setTimeout(initializeModal, 500);
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
// ============================================
// CÓDIGO ADICIONAL: Mejora para touch/swipe en móviles
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('imageModal');
  let startX = 0;
  let startY = 0;
  
  // Touch events para navegación con gestos
  modal.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });
  
  modal.addEventListener('touchend', function(e) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // Solo procesa si el movimiento horizontal es mayor que el vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe derecha = imagen anterior
        const prevBtn = document.querySelector('.modal-prev');
        if (prevBtn && prevBtn.style.display !== 'none') {
          prevBtn.click();
        }
      } else {
        // Swipe izquierda = imagen siguiente
        const nextBtn = document.querySelector('.modal-next');
        if (nextBtn && nextBtn.style.display !== 'none') {
          nextBtn.click();
        }
      }
    }
  });
});