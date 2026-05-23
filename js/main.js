/**
 * FORMA Architecture Studio — main.js
 * Navigation, animations, lightbox, form validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMenu();
  initReveal();
  initHeroImg();

  if (document.querySelector('.gallery-grid')) initLightbox();
  if (document.querySelector('.contact-form'))  initForm();
  if (document.querySelector('.filter-bar'))    initFilter();
});

// Checking where it actually gets saved

/* ── Navigation ─────────────────────────────── */
function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const logo = nav.querySelector('.nav-logo');
  const isHeroPage = document.querySelector('.hero');

  function onScroll() {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle('scrolled', scrolled);
    if (isHeroPage && logo) logo.classList.toggle('light', !scrolled);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init
}

/* ── Slide Menu ─────────────────────────────── */
function initMenu() {
  const hamburger    = document.querySelector('.hamburger');
  const menu         = document.getElementById('slide-menu');
  const closeBtn     = document.querySelector('.menu-close');
  const overlay      = document.querySelector('.menu-overlay');
  if (!hamburger || !menu) return;

  let menuOpen = false;

  function openMenu() {
    menu.classList.add('open');
    hamburger.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    menuOpen = true;
  }

  function closeMenu() {
    menu.classList.remove('open');
    hamburger.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
    menuOpen = false;
  }

  hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
  if (overlay)   overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });
}

/* ── Scroll Reveal ──────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => io.observe(el));
}

/* ── Hero image zoom on load ────────────────── */
function initHeroImg() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  if (heroBg.complete) heroBg.classList.add('loaded');
  else heroBg.addEventListener('load', () => heroBg.classList.add('loaded'));
}

/* ── Lightbox ───────────────────────────────── */
function initLightbox() {
  const lightbox    = document.querySelector('.lightbox');
  const lbImg       = document.querySelector('.lightbox__img');
  const lbClose     = document.querySelector('.lightbox__close');
  const lbPrev      = document.querySelector('.lightbox__prev');
  const lbNext      = document.querySelector('.lightbox__next');
  const lbCounter   = document.querySelector('.lightbox__counter');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  if (!lightbox || !galleryItems.length) return;

  let currentIndex = 0;
  const images = galleryItems.map(item => ({
    src: item.getAttribute('data-full') || item.querySelector('img').src,
    alt: item.querySelector('img').alt || ''
  }));

  function open(idx) {
    currentIndex = idx;
    update();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function update() {
    if (lbImg) {
      lbImg.style.opacity = 0;
      lbImg.src = images[currentIndex].src;
      lbImg.alt = images[currentIndex].alt;
      lbImg.onload = () => { lbImg.style.opacity = 1; };
    }
    if (lbCounter) lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function prev() { currentIndex = (currentIndex - 1 + images.length) % images.length; update(); }
  function next() { currentIndex = (currentIndex + 1) % images.length; update(); }

  galleryItems.forEach((item, idx) => item.addEventListener('click', () => open(idx)));
  if (lbClose) lbClose.addEventListener('click', close);
  if (lbPrev)  lbPrev.addEventListener('click', prev);
  if (lbNext)  lbNext.addEventListener('click', next);

  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Touch/swipe support
  let startX = 0;
  lightbox.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - startX;
    if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
  });
}

/* ── Contact Form Validation ────────────────── */
function initForm() {
  const form    = document.querySelector('.contact-form');
  const success = document.querySelector('.form-success');
  if (!form) return;

  function showError(field, msg) {
    const err = field.parentElement.querySelector('.form-error');
    if (err) { err.textContent = msg; err.classList.add('visible'); }
    field.style.borderBottomColor = 'var(--accent)';
  }

  function clearError(field) {
    const err = field.parentElement.querySelector('.form-error');
    if (err) { err.classList.remove('visible'); }
    field.style.borderBottomColor = '';
  }

  // Live validation on blur
  form.querySelectorAll('input, textarea').forEach(f => {
    f.addEventListener('blur', () => validateField(f));
    f.addEventListener('input', () => clearError(f));
  });

  function validateField(field) {
    const val = field.value.trim();
    if (field.required && !val) {
      showError(field, 'This field is required.'); return false;
    }
    if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showError(field, 'Please enter a valid email address.'); return false;
    }
    if (field.name === 'phone' && val && !/^[\d\s\+\-\(\)]{7,}$/.test(val)) {
      showError(field, 'Please enter a valid phone number.'); return false;
    }
    clearError(field);
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input, textarea').forEach(f => {
      if (!validateField(f)) valid = false;
    });

    if (valid) {
      if (success) { success.classList.add('visible'); }
      form.reset();
      form.querySelectorAll('.form-error').forEach(err => err.classList.remove('visible'));
      setTimeout(() => { if (success) success.classList.remove('visible'); }, 5000);
    }
  });
}

/* ── Project Filter ─────────────────────────── */
function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.filterable');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      items.forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.style.display = match ? '' : 'none';
      });
    });
  });
}
