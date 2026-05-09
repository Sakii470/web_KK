/* ===== NAVBAR SCROLL ===== */
// Navbar is always white; keep class unused to avoid any scroll state changes.
// const navbar = document.getElementById('navbar');
// window.addEventListener('scroll', () => {
//   navbar.classList.toggle('scrolled', window.scrollY > 60);
// });

/* ===== MOBILE MENU ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ===== PRICING TABS ===== */
const tabButtons = document.querySelectorAll('.tab-btn');
const priceTables = document.querySelectorAll('.price-table');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    priceTables.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

/* ===== GALLERY LIGHTBOX ===== */
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;
const images = Array.from(galleryItems);

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = images[currentIndex].src;
  lightboxImg.alt = images[currentIndex].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigate(direction) {
  currentIndex = (currentIndex + direction + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
  lightboxImg.alt = images[currentIndex].alt;
}

galleryItems.forEach((img, i) => {
  img.parentElement.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigate(-1));
lightboxNext.addEventListener('click', () => navigate(1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

/* ===== SCROLL REVEAL ===== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('.section, .hero');
const navLinkItems = document.querySelectorAll('.nav-links a:not(.btn-nav)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  threshold: 0.3
});

sections.forEach(s => sectionObserver.observe(s));

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value;
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = `Dziękujemy, ${name}!`;
    btn.disabled = true;
    btn.style.background = '#6abf7b';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

/* ===== SMOOTH COUNTER (optional — for future stats) ===== */

/* ===== TREATMENT POPUP ===== */
const popupOverlay = document.getElementById('popupOverlay');
const popupContent = document.getElementById('popupContent');

function openPopup(templateId) {
  const tpl = document.getElementById(templateId);
  if (!tpl) return;
  popupContent.innerHTML = '';
  popupContent.appendChild(tpl.content.cloneNode(true));

  // CTA links inside popup close popup and scroll to contact
  popupContent.querySelectorAll('.popup-cta').forEach(link => {
    link.addEventListener('click', () => {
      closePopup();
    });
  });

  popupOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Scroll popup to top
  const box = popupOverlay.querySelector('.popup-box');
  if (box) box.scrollTop = 0;
}

function closePopup() {
  popupOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Open popup when clicking a zabieg card or its button
document.querySelectorAll('.zabieg-card').forEach(card => {
  card.addEventListener('click', () => {
    openPopup(card.dataset.popup);
  });
  // Prevent double-fire from button — it's inside the card, click bubbles up
});

// Close on overlay backdrop click
popupOverlay.addEventListener('click', e => {
  // 1) Click outside the dialog content
  if (e.target === popupOverlay) {
    closePopup();
    return;
  }

  // 2) Click on any close button injected from templates
  const closeBtn = e.target.closest('.popup-close');
  if (closeBtn) {
    e.preventDefault();
    closePopup();
  }
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && popupOverlay.classList.contains('active')) closePopup();
});

