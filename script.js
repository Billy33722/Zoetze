/* ============================================================
   Zoetze — Premium Artisan Cake Shop
   Main JavaScript · Vanilla ES6+
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. PRELOADER
  ---------------------------------------------------------- */
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    let hidden = false;

    const hidePreloader = () => {
      if (hidden) return;
      hidden = true;
      preloader.style.transition = 'opacity 0.5s ease';
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 500);
    };

    // Always hide after 2s max, no matter what
    setTimeout(hidePreloader, 2000);

    const imgs = Array.from(document.images).filter(img => img.src && img.src !== window.location.href);
    const total = imgs.length;
    let loaded = 0;

    if (total === 0) { hidePreloader(); }
    else {
      imgs.forEach(img => {
        if (img.complete) { loaded++; }
        else {
          img.addEventListener('load', () => { if (++loaded >= total) hidePreloader(); });
          img.addEventListener('error', () => { if (++loaded >= total) hidePreloader(); });
        }
      });
      if (loaded >= total) hidePreloader();
    }
  }

  /* ----------------------------------------------------------
     2. STICKY NAVBAR
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  /* ----------------------------------------------------------
     3. ACTIVE NAV LINK (Intersection Observer)
  ---------------------------------------------------------- */
  const sectionIds = ['#hero', '#beschikbaarheid', '#over', '#assortiment', '#galerij', '#dessertbuffet', '#reviews', '#faq', '#contact'];
  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('a[href^="#"]');

  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ----------------------------------------------------------
     4. SMOOTH SCROLL
  ---------------------------------------------------------- */
  const NAVBAR_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  /* ----------------------------------------------------------
     5. MOBILE MENU
  ---------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  const closeMobileMenu = () => {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openMobileMenu = () => {
    hamburger?.classList.add('active');
    mobileMenu?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.contains('active');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  const closeBtn = mobileMenu?.querySelector('.mobile-menu-close');
  closeBtn?.addEventListener('click', closeMobileMenu);

  document.addEventListener('click', (e) => {
    if (mobileMenu?.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburger?.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ----------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS
  ---------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay;
        if (delay) entry.target.style.transitionDelay = delay;
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     7. GALLERY LIGHTBOX
  ---------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  const gallerySrcs = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return img?.src || img?.dataset.src || '';
  });
  let currentGalleryIndex = 0;

  const showLightbox = (index) => {
    currentGalleryIndex = index;
    if (lightboxImg) lightboxImg.src = gallerySrcs[index];
    lightbox?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const hideLightbox = () => {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  };

  const prevImage = () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + gallerySrcs.length) % gallerySrcs.length;
    if (lightboxImg) lightboxImg.src = gallerySrcs[currentGalleryIndex];
  };

  const nextImage = () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % gallerySrcs.length;
    if (lightboxImg) lightboxImg.src = gallerySrcs[currentGalleryIndex];
  };

  galleryItems.forEach((item, i) => item.addEventListener('click', () => showLightbox(i)));
  lightboxClose?.addEventListener('click', hideLightbox);
  lightboxPrev?.addEventListener('click', prevImage);
  lightboxNext?.addEventListener('click', nextImage);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) hideLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') hideLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  /* ----------------------------------------------------------
     8. FAQ ACCORDION
  ---------------------------------------------------------- */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const parent = question.closest('.faq-item');
      const answer = parent?.querySelector('.faq-answer');
      const isOpen = parent?.classList.contains('open');

      // Close all other items
      document.querySelectorAll('.faq-item.open').forEach(item => {
        if (item !== parent) {
          item.classList.remove('open');
        }
      });

      // Toggle clicked item
      if (isOpen) {
        parent.classList.remove('open');
      } else {
        parent.classList.add('open');
      }
    });
  });

  /* ----------------------------------------------------------
     9. REVIEWS CAROUSEL
  ---------------------------------------------------------- */
  const track = document.querySelector('.reviews-track');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const carouselContainer = track?.closest('.reviews-carousel') || track?.parentElement;

  let currentSlide = 0;
  let slideCount = dots.length || track?.children.length || 0;
  let autoRotate = null;

  const goToSlide = (index) => {
    currentSlide = ((index % slideCount) + slideCount) % slideCount;
    if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  };

  const startAutoRotate = () => {
    stopAutoRotate();
    autoRotate = setInterval(() => goToSlide(currentSlide + 1), 5000);
  };

  const stopAutoRotate = () => {
    if (autoRotate) { clearInterval(autoRotate); autoRotate = null; }
  };

  dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); startAutoRotate(); }));
  prevBtn?.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoRotate(); });
  nextBtn?.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoRotate(); });

  carouselContainer?.addEventListener('mouseenter', stopAutoRotate);
  carouselContainer?.addEventListener('mouseleave', startAutoRotate);

  // Touch / swipe support
  let touchStartX = 0;
  carouselContainer?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  carouselContainer?.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) {
      delta < 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
      startAutoRotate();
    }
  }, { passive: true });

  if (slideCount > 0) startAutoRotate();

  /* ----------------------------------------------------------
     10. CONTACT FORM VALIDATION
  ---------------------------------------------------------- */
  const contactForm = document.querySelector('.contact-form');
  const formSuccess = document.querySelector('.form-success');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showFieldError = (field, message) => {
    field.classList.add('error');
    let span = field.nextElementSibling;
    if (!span || !span.classList.contains('error-message')) {
      span = document.createElement('span');
      span.className = 'error-message';
      field.after(span);
    }
    span.textContent = message;
  };

  const clearFieldError = (field) => {
    field.classList.remove('error');
    const span = field.nextElementSibling;
    if (span?.classList.contains('error-message')) span.remove();
  };

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('[name="name"]');
    const email = contactForm.querySelector('[name="email"]');
    const phone = contactForm.querySelector('[name="phone"]');
    const date = contactForm.querySelector('[name="date"]');
    const message = contactForm.querySelector('[name="message"]');
    let valid = true;

    [name, email, phone, date, message].forEach(f => { if (f) clearFieldError(f); });

    if (name && !name.value.trim()) { showFieldError(name, 'Vul je naam in.'); valid = false; }
    if (email && !email.value.trim()) { showFieldError(email, 'Vul je e-mailadres in.'); valid = false; }
    else if (email && !emailRegex.test(email.value.trim())) { showFieldError(email, 'Ongeldig e-mailadres.'); valid = false; }
    if (phone && !phone.value.trim()) { showFieldError(phone, 'Vul je telefoonnummer in.'); valid = false; }
    if (date && !date.value.trim()) { showFieldError(date, 'Kies een datum.'); valid = false; }
    if (message && !message.value.trim()) { showFieldError(message, 'Schrijf een omschrijving.'); valid = false; }

    if (valid) {
      contactForm.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.display = 'block';
        formSuccess.style.opacity = '0';
        requestAnimationFrame(() => {
          formSuccess.style.transition = 'opacity 0.5s ease';
          formSuccess.style.opacity = '1';
        });
      }
    }
  });

  /* ----------------------------------------------------------
     11. PARALLAX HERO
  ---------------------------------------------------------- */
  const hero = document.getElementById('hero');
  let ticking = false;

  const onScroll = () => {
    // Sticky navbar
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    // Parallax
    if (hero) {
      hero.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     12. COUNTER ANIMATION
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target || el.textContent, 10);
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);          // ease-out cubic
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
      };

      el.textContent = '0';
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

}); /* end DOMContentLoaded */
