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

// Modal de imagen para noticias
document.addEventListener('DOMContentLoaded', function() {
  // Busca todas las imágenes en las noticias y galerías
  const images = document.querySelectorAll('.news-image img, .news-gallery-item img');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.close');

  // Añade evento de clic a cada imagen
  images.forEach(img => {
    img.addEventListener('click', function() {
      modal.style.display = 'block';
      modalImg.src = this.src;
    });
  });

  // Cerrar el modal con la "X"
  if (closeBtn) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }

  // Cerrar el modal al hacer clic fuera de la imagen
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
});