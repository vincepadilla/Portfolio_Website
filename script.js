document.getElementById("year").textContent = new Date().getFullYear();

    const profileImage = document.getElementById('profile-image');

    function updateProfileImageByTheme(isDarkMode) {
      if (!profileImage) return;

      const targetSrc = isDarkMode
        ? profileImage.dataset.darkSrc
        : profileImage.dataset.lightSrc;

      if (!targetSrc || profileImage.getAttribute('src') === targetSrc) return;

      profileImage.classList.add('is-switching');
      setTimeout(() => {
        profileImage.setAttribute('src', targetSrc);
        profileImage.classList.remove('is-switching');
      }, 180);
    }

    // Dark Mode Toggle
    function toggleDark() {
      const html = document.documentElement;
      html.classList.toggle('dark');
      const isDark = html.classList.contains('dark');
      updateProfileImageByTheme(isDark);

      const dot = document.getElementById('dot');
      if (isDark) {
        dot.style.transform = 'translateX(24px)';
      } else {
        dot.style.transform = 'translateX(0)';
      }
    }

    // Button actions
    function scheduleCall() {
      alert('Schedule a Call: This would open a calendar booking system.');
    }

    function sendEmail() {
      const modal = document.getElementById('contact-modal');
      if (!modal) return;

      const panel = modal.querySelector('.contact-modal-panel');
      window.clearTimeout(window.__contactModalCloseTimer);

      modal.classList.remove('hidden');
      requestAnimationFrame(() => {
        modal.classList.add('opacity-100');
        if (panel) {
          panel.classList.add('opacity-100', 'translate-y-0', 'scale-100');
        }
        activateModalFocusTrap(modal);
        const nameInput = document.getElementById('contact-name');
        if (nameInput) {
          nameInput.focus();
        }
      });
    }

    function closeContactModal() {
      const modal = document.getElementById('contact-modal');
      if (!modal) return;

      const panel = modal.querySelector('.contact-modal-panel');
      modal.classList.remove('opacity-100');
      if (panel) {
        panel.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
      }

      deactivateModalFocusTrap();

      window.__contactModalCloseTimer = window.setTimeout(() => {
        modal.classList.add('hidden');
      }, 200);
    }

    function validateEmail(email) {
      return /\S+@\S+\.\S+/.test(email);
    }

    function submitContact(e) {
      e.preventDefault();
      const name = (document.getElementById('contact-name') || {}).value || '';
      const email = (document.getElementById('contact-email') || {}).value || '';
      const message = (document.getElementById('contact-message') || {}).value || '';

      if (!name.trim() || !email.trim() || !message.trim()) {
        alert('Please fill out name, email, and message.');
        return;
      }
      if (!validateEmail(email.trim())) {
        alert('Please enter a valid email address.');
        return;
      }

      const subject = `Message from ${name.trim()} (${email.trim()})`;
      const body = message.trim();
      const mailto = `mailto:hello@bryllim.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      // Open user's email client with prefilled message
      window.location.href = mailto;
      closeContactModal();
    }

    const form = document.getElementById('contact-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch('https://formspree.io/f/mqeeznwp', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          alert('Message sent successfully!');
          form.reset();
          closeContactModal();
        } else {
          alert('Something went wrong. Please try again.');
        }
      } catch (error) {
        alert('Network error. Please try again later.');
      }
    });

    // Close modal on Escape and trap focus inside the active modal
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        if (!document.getElementById('project-modal')?.classList.contains('hidden')) {
          closeProjectModal();
        } else if (!document.getElementById('cert-modal')?.classList.contains('hidden')) {
          closeCertModal();
        } else {
          closeContactModal();
        }
      }

      if (ev.key === 'Tab' && activeModal) {
        if (!modalFocusableElements.length) return;
        if (ev.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            ev.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            ev.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    });

    document.addEventListener('focusin', (event) => {
      if (activeModal && !activeModal.contains(event.target)) {
        event.preventDefault();
        firstFocusableElement?.focus();
      }
    });

    const projects = {
      gmcamsys: {
        title: 'GM-STUDIO',
        subtitle: 'Web-Based Services Showcasing Website',
        description: 'A modern showcasing website for a photo studio business, featuring their services, pricing, photography portfolio, and memorable client moments',
        image: 'src/projects/gmcamera.png?v=1',
        tech: [
          { label: 'HTML', icon: 'fa-brands fa-html5 text-orange-500' },
          { label: 'CSS', icon: 'fa-brands fa-css3-alt text-sky-500' },
          { label: 'JavaScript', icon: 'fab fa-js text-yellow-500' },
          { label: 'Responsive Design', icon: 'fas fa-mobile-screen-button text-blue-500' }
        ]
      },
      ldcdentsys: {
        title: 'LDC-DENTSYS',
        subtitle: 'Dental Appointment System with AI Support',
        description: 'A dental appointment and patient management system with AI-powered scheduling suggestions, appointment reminders, and an intuitive clinic dashboard.',
        image: 'src/projects/ldc.png?v=1',
        tech: [
          { label: 'HTML', icon: 'fa-brands fa-html5 text-orange-500' },
          { label: 'CSS', icon: 'fa-brands fa-css3-alt text-sky-500' },
          { label: 'JavaScript', icon: 'fab fa-js text-yellow-500' },
          { label: 'PHP', icon: 'fab fa-php text-purple-500' },
          { label: 'MySQL', icon: 'fas fa-database text-indigo-500' },
          { label: 'AI Integration', icon: 'fas fa-robot text-fuchsia-500' }
        ]
      },
      owlix: {
        title: 'OWLIX',
        subtitle: 'Career Tracking and File Management Mobile App',
        description: 'A mobile app designed to help users manage their career development, track achievements, and organize important files in one place.',
        image: 'src/projects/owlix.webp?v=1',
        tech: [
          { label: 'Android', icon: 'fab fa-android text-green-500' },
          { label: 'Native React', icon: 'fa-brands fa-react text-blue-500' },
          { label: 'Expo Go', icon: 'fa-solid fa-angle-up text-slate-500' },
          { label: 'Supabase', icon: 'fa-solid fa-server text-green-500' }
        ]
      },
      gatepass: {
        title: 'Gatepass Request & Management',
        subtitle: 'Web-Based System for Development Academy of the Philippines',
        description: 'A responsive facility access control system with QR code-based attendance tracking to streamline entry and exit management.',
        image: 'src/projects/dap.png?v=1',
        tech: [
          { label: 'HTML', icon: 'fa-brands fa-html5 text-orange-500' },
          { label: 'CSS', icon: 'fa-brands fa-css3-alt text-sky-500' },
          { label: 'JavaScript', icon: 'fab fa-js text-yellow-500' },
          { label: 'PHP', icon: 'fab fa-php text-purple-500' },
          { label: 'Laravel', icon: 'fa-brands fa-laravel text-orange-500' },
          { label: 'Tailwind CSS', icon: 'fas fa-wind text-teal-500' },
          { label: 'MySQL', icon: 'fas fa-database text-indigo-500' }
        ]
      }
    };

    const certifications = {
      'dean-lister': {
        title: 'Dean Lister',
        issuer: 'University of Makati',
        images: ['src/certificates/deanlister1.webp?v=1', 'src/certificates/deanlister2.webp?v=1', 'src/certificates/deanlister3.webp?v=1'],
        achievements: ['Recognized on the Dean\'s List for academic excellence']
      },
      'infotech-2025': {
        title: 'Infotech Olympics 2025',
        issuer: 'University of Makati',
        images: ['src/Gallery/image5.webp?v=1', 'src/certificates/certinfotech.webp?v=1'],
        achievements: ['Champion in Web Design Category', 'Showcased skills in UI/UX design, frontend development, and teamwork']
      },
      'skills-2025': {
        title: 'IT 14th Skills Olympics 2025',
        issuer: 'University of Makati',
        images: ['src/certificates/itolympics.webp?v=1'],
        achievements: ['Participated in Web Development Competition', 'Represented the University of Makati in the Web Design Category']
      }
    };

    function closeProjectModal() {
      const modal = document.getElementById('project-modal');
      if (!modal) return;
      modal.classList.remove('project-open');
      deactivateModalFocusTrap();
      document.body.style.overflow = '';
      window.setTimeout(() => {
        modal.classList.add('hidden');
      }, 280);
    }

    function openProjectModal(projectKey) {
      const project = projects[projectKey];
      if (!project) return;

      const modal = document.getElementById('project-modal');
      const titleEl = document.getElementById('project-modal-title');
      const subtitleEl = document.getElementById('project-modal-subtitle');
      const descriptionEl = document.getElementById('project-modal-description');
      const imageEl = document.getElementById('project-modal-image');
      const techContainer = document.getElementById('project-modal-tech');

      if (!modal || !titleEl || !subtitleEl || !descriptionEl || !imageEl || !techContainer) return;

      titleEl.textContent = project.title;
      subtitleEl.textContent = project.subtitle;
      descriptionEl.textContent = project.description;
      imageEl.src = project.image;
      imageEl.alt = project.title;

      techContainer.innerHTML = '';
      project.tech.forEach((tech) => {
        const chip = document.createElement('span');
        chip.className = 'project-tech-chip';

        const icon = document.createElement('i');
        icon.className = `${tech.icon} mr-2`;
        chip.appendChild(icon);

        chip.appendChild(document.createTextNode(tech.label));
        techContainer.appendChild(chip);
      });

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(() => {
        modal.classList.add('project-open');
        activateModalFocusTrap(modal);
      });
    }

    document.querySelectorAll('.project-trigger').forEach((item) => {
      item.addEventListener('click', () => openProjectModal(item.dataset.project));
    });

    // Certification modal logic
    let certCurrentIndex = 0;
    let certCurrentKey = null;
    function openCertModal(certKey) {
      const cert = certifications[certKey];
      if (!cert) return;

      certCurrentKey = certKey;

      const modal = document.getElementById('cert-modal');
      const titleEl = document.getElementById('cert-modal-title');
      const issuerEl = document.getElementById('cert-modal-issuer');
      const sliderTrack = document.getElementById('cert-slider-track');
      const indicators = document.getElementById('cert-slider-indicators');
      const achievementsEl = document.getElementById('cert-achievements');

      if (!modal || !titleEl || !issuerEl || !sliderTrack || !indicators || !achievementsEl) return;

      titleEl.textContent = cert.title;
      issuerEl.textContent = cert.issuer;

      // render slides
      sliderTrack.innerHTML = '';
      cert.images.forEach((src) => {
        const slide = document.createElement('div');
        slide.className = 'cert-slide';
        const img = document.createElement('img');
        img.src = src;
        img.alt = cert.title;
        slide.appendChild(img);
        sliderTrack.appendChild(slide);
      });

      // indicators
      indicators.innerHTML = '';
      cert.images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700';
        dot.addEventListener('click', () => {
          certCurrentIndex = i;
          updateCertSlider();
        });
        indicators.appendChild(dot);
      });

      // achievements
      achievementsEl.innerHTML = '';
      cert.achievements.forEach((a) => {
        const li = document.createElement('li');
        li.textContent = a;
        achievementsEl.appendChild(li);
      });

      certCurrentIndex = 0;
      updateCertSlider();

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(() => {
        modal.classList.add('project-open');
        activateModalFocusTrap(modal);
      });
    }

    function updateCertSlider() {
      const sliderTrack = document.getElementById('cert-slider-track');
      const indicators = document.getElementById('cert-slider-indicators');
      if (!sliderTrack || !indicators) return;
      sliderTrack.style.transform = `translateX(-${certCurrentIndex * 100}%)`;

      Array.from(indicators.children).forEach((dot, i) => {
        if (i === certCurrentIndex) {
          dot.classList.remove('bg-zinc-300', 'dark:bg-zinc-700');
          dot.classList.add('bg-blue-500', 'dark:bg-blue-400');
          dot.style.width = '12px';
        } else {
          dot.classList.remove('bg-blue-500', 'dark:bg-blue-400');
          dot.classList.add('bg-zinc-300', 'dark:bg-zinc-700');
          dot.style.width = '8px';
        }
      });
    }

    function closeCertModal() {
      const modal = document.getElementById('cert-modal');
      if (!modal) return;
      modal.classList.remove('project-open');
      deactivateModalFocusTrap();
      document.body.style.overflow = '';
      window.setTimeout(() => {
        modal.classList.add('hidden');
      }, 280);
    }

    function getModalFocusableElements(modal) {
      if (!modal) return [];
      return Array.from(modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
        .filter((el) => el.offsetParent !== null);
    }

    let activeModal = null;
    let modalFocusableElements = [];
    let firstFocusableElement = null;
    let lastFocusableElement = null;

    function activateModalFocusTrap(modal) {
      activeModal = modal;
      modalFocusableElements = getModalFocusableElements(modal);
      if (modalFocusableElements.length) {
        firstFocusableElement = modalFocusableElements[0];
        lastFocusableElement = modalFocusableElements[modalFocusableElements.length - 1];
        firstFocusableElement.focus();
      }
    }

    function deactivateModalFocusTrap() {
      activeModal = null;
      modalFocusableElements = [];
      firstFocusableElement = null;
      lastFocusableElement = null;
    }

    function attachModalBackdropClose(modal, closeHandler) {
      if (!modal) return;
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          closeHandler();
        }
      });
    }

    document.querySelectorAll('.cert-trigger').forEach((item) => {
      item.addEventListener('click', () => openCertModal(item.dataset.cert));
    });

    document.querySelectorAll('.cert-next').forEach(btn => btn.addEventListener('click', () => {
      if (!certCurrentKey) return;
      const cert = certifications[certCurrentKey];
      if (!cert) return;
      certCurrentIndex = Math.min(certCurrentIndex + 1, cert.images.length - 1);
      updateCertSlider();
    }));

    document.querySelectorAll('.cert-prev').forEach(btn => btn.addEventListener('click', () => {
      if (!certCurrentKey) return;
      certCurrentIndex = Math.max(certCurrentIndex - 1, 0);
      updateCertSlider();
    }));

    attachModalBackdropClose(document.getElementById('project-modal'), closeProjectModal);
    attachModalBackdropClose(document.getElementById('cert-modal'), closeCertModal);
    attachModalBackdropClose(document.getElementById('contact-modal'), closeContactModal);

    function visitCommunity() {
      alert('Visit Community: This would redirect to the community page.');
    }

    function viewAllTech() {
      alert('View All Tech: All technologies and skills are already displayed.');
    }

    function viewAllProjects() {
      alert('View All Projects: All projects are already displayed.');
    }

    function viewAllCertifications() {
      alert('View All Certifications: All certifications are already displayed.');
    }

    // Initialize dark mode based on existing class or system preference
    const dotEl = document.getElementById('dot');
    if (document.documentElement.classList.contains('dark') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      updateProfileImageByTheme(true);
      if (dotEl) dotEl.style.transform = 'translateX(24px)';
    } else {
      updateProfileImageByTheme(false);
      if (dotEl) dotEl.style.transform = 'translateX(0)';
    }

    //Gallery
    let currentSlideIndex = 0;
    let slideWidth = 0; // computed dynamically
    let slidesToShow = 3; // Number of slides visible at once
    const galleryTrack = document.getElementById('slider-track');
    const sliderIndicatorsContainer = document.querySelector('.flex.justify-center.gap-2.mt-6');

    function getTotalSlides() {
      return galleryTrack ? galleryTrack.children.length : 0;
    }

    function getMaxSlide() {
      return Math.max(0, getTotalSlides() - slidesToShow);
    }

    function updateGallerySlider() {
      if (!galleryTrack) return;
      const translateX = Math.round(currentSlideIndex * slideWidth);
      galleryTrack.style.transform = `translateX(-${translateX}px)`;
      updateGalleryIndicators();
    }

    function updateGalleryIndicators() {
      if (!sliderIndicatorsContainer) return;
      const indicators = Array.from(sliderIndicatorsContainer.children);
      const maxSlide = getMaxSlide();
      const active = Math.min(currentSlideIndex, maxSlide);

      indicators.forEach((indicator, i) => {
        if (i === active) {
          indicator.classList.remove('bg-zinc-300', 'dark:bg-zinc-700');
          indicator.classList.add('bg-blue-500', 'dark:bg-blue-400');
          indicator.style.width = '12px';
        } else {
          indicator.classList.remove('bg-blue-500', 'dark:bg-blue-400');
          indicator.classList.add('bg-zinc-300', 'dark:bg-zinc-700');
          indicator.style.width = '8px';
        }
      });
    }

    function renderIndicators() {
      if (!sliderIndicatorsContainer || !galleryTrack) return;
      sliderIndicatorsContainer.innerHTML = '';
      const maxSlide = getMaxSlide();
      const count = maxSlide + 1;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'w-2 h-2 rounded-full';
        dot.addEventListener('click', () => {
          currentSlideIndex = i;
          updateGallerySlider();
        });
        sliderIndicatorsContainer.appendChild(dot);
      }
    }

    function nextSlide() {
      const maxSlide = getMaxSlide();
      if (currentSlideIndex < maxSlide) {
        currentSlideIndex += 1;
      } else {
        currentSlideIndex = 0;
      }
      updateGallerySlider();
    }

    function prevSlide() {
      const maxSlide = getMaxSlide();
      if (currentSlideIndex > 0) {
        currentSlideIndex -= 1;
      } else {
        currentSlideIndex = maxSlide;
      }
      updateGallerySlider();
    }

    function computeDimensions() {
      if (!galleryTrack) return;
      const sliderContainer = galleryTrack.parentElement;
      const containerWidth = sliderContainer.clientWidth;
      const gap = parseFloat(getComputedStyle(galleryTrack).gap) || 16;
      const slides = Array.from(galleryTrack.children);
      slideWidth = Math.floor((containerWidth - gap * (slidesToShow - 1)) / slidesToShow);

      slides.forEach((slide) => {
        slide.style.flex = `0 0 ${slideWidth}px`;
      });
      // account for gap when translating
      slideWidth = slideWidth + gap;
    }

    function adjustSlidesToShow() {
      if (window.innerWidth < 640) { // Mobile
        slidesToShow = 1;
      } else if (window.innerWidth < 1024) { // Tablet
        slidesToShow = 2;
      } else { // Desktop
        slidesToShow = 3;
      }
      computeDimensions();
      renderIndicators();
      const maxSlide = getMaxSlide();
      if (currentSlideIndex > maxSlide) currentSlideIndex = maxSlide;
      updateGallerySlider();
    }

    let galleryAutoSlide;
    function startAutoSlide() {
      clearInterval(galleryAutoSlide);
      galleryAutoSlide = setInterval(() => nextSlide(), 4000);
    }

    document.addEventListener('DOMContentLoaded', () => {
      adjustSlidesToShow();
      startAutoSlide();

      const sliderContainer = galleryTrack ? galleryTrack.parentElement : null;
      if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(galleryAutoSlide));
        sliderContainer.addEventListener('mouseleave', () => startAutoSlide());
      }

      window.addEventListener('resize', () => {
        adjustSlidesToShow();
      });
    });

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => { });
      });
    }