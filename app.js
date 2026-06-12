document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // MOBILE NAVIGATION (HAMBURGER MENU)
  // ==========================================
  const hamburger = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    const closeLinks = document.querySelectorAll('.nav-link, .btn-contact');
    closeLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // ==========================================
  // SCROLL EFFECTS & SCROLL SPY
  // ==========================================
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section');

  // Adjust header height and blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'var(--main-header-scrolled-bg, rgba(250, 248, 245, 0.98))';
      header.style.height = '70px';
      header.style.boxShadow = 'var(--shadow-sm)';
    } else {
      header.style.backgroundColor = 'var(--main-header-bg, rgba(250, 248, 245, 0.85))';
      header.style.height = '80px';
      header.style.boxShadow = 'none';
    }
  });

  // Active link detection based on scrolling intersection
  if (sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px', // Precise threshold for focus section
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  // ==========================================
  // INTERACTIVE PRODUCT FILTER
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active states on buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const targetCategory = button.getAttribute('data-category');

      // Filter product grid
      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Reset animation helper
        card.classList.remove('fade-in-item');

        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.classList.remove('hidden');
          // Trigger reflow to restart CSS animation
          void card.offsetWidth;
          card.classList.add('fade-in-item');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // BARISTA DIGITAL (COFFEE QUIZ WIDGET)
  // ==========================================
  const quizSteps = document.querySelectorAll('.quiz-step');
  const optionCards = document.querySelectorAll('.quiz-option');
  const progressBar = document.getElementById('quiz-progress-bar');
  
  // Quiz answers state
  let quizAnswers = {
    flavor: null,
    temperature: null,
    caffeine: null
  };

  // Recommendations Database mapping
  const coffeeProducts = {
    makaccino: {
      name: 'Makaccino Premium',
      desc: 'Una delicia cremosa elaborada con espresso doble, leche vaporizada, chocolate real artesanal al 70% de cacao y un sutil espolvoreado de canela.',
      price: '$70.00',
      match: 'Cheesecake New York con Fresa',
      visual: 'bi bi-cup-hot-fill'
    },
    capuchino: {
      name: 'Capuchino Latte',
      desc: 'El balance perfecto entre espresso dulce seleccionado y leche vaporizada aterciopelada, coronado con una delicada capa de microespuma con arte latte.',
      price: '$55.00',
      match: 'Croissant de Mantequilla',
      visual: 'bi bi-cup-hot'
    },
    caramelLatte: {
      name: 'Iced Caramel Latte',
      desc: 'Bebida fría refrescante que combina espresso, leche, hielo y jarabe de caramelo artesanal casero. Ideal para endulzar el día.',
      price: '$65.00',
      match: 'Croissant de Mantequilla',
      visual: 'bi bi-cup-straw'
    },
    espresso: {
      name: 'Espresso de Origen',
      desc: 'Puro, denso y sumamente aromático. Extraído bajo alta presión de granos seleccionados con notas naturales a cacao y grano tostado.',
      price: '$45.00',
      match: 'Pay de Limón Individual',
      visual: 'bi bi-cup-hot-fill'
    },
    filtrado: {
      name: 'Filtrados Artesanales',
      desc: 'Café de especialidad preparado por infusión lenta (V60 o Chemex). Resalta los matices cítricos y herbales del grano con un cuerpo sumamente limpio.',
      price: '$65.00',
      match: 'Croissant de Mantequilla',
      visual: 'bi bi-funnel'
    },
    coldbrew: {
      name: 'Cold Brew de la Casa',
      desc: 'Café de especialidad extraído en agua fría durante 18 horas. Naturalmente dulce, refrescante, con baja acidez y un potente impulso de cafeína limpia.',
      price: '$60.00',
      match: 'Cheesecake de Frutos Rojos',
      visual: 'bi bi-cup-straw'
    }
  };

  // Option selection handler
  optionCards.forEach(option => {
    option.addEventListener('click', () => {
      const parentStep = option.closest('.quiz-step');
      const stepIndex = parseInt(parentStep.getAttribute('data-step'));
      const selectionValue = option.getAttribute('data-answer');

      // Clear previous selected sibling options
      parentStep.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      // Record selection in state
      if (stepIndex === 1) quizAnswers.flavor = selectionValue;
      if (stepIndex === 2) quizAnswers.temperature = selectionValue;
      if (stepIndex === 3) quizAnswers.caffeine = selectionValue;

      // Enable the Next Step button for the active step
      const nextBtn = parentStep.querySelector('.next-step-btn');
      if (nextBtn) {
        nextBtn.removeAttribute('disabled');
      }
    });
  });

  // Navigation: Next Step Button handler
  document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parentStep = btn.closest('.quiz-step');
      const currentStepNum = parseInt(parentStep.getAttribute('data-step'));
      
      // Calculate and display progress bar width
      const nextStepNum = currentStepNum + 1;
      const progressPercent = currentStepNum * 33.33;
      progressBar.style.width = `${progressPercent}%`;

      // Navigate to next DOM node step
      parentStep.classList.remove('active');
      const nextStepElement = document.querySelector(`.quiz-step[data-step="${nextStepNum}"]`);
      if (nextStepElement) {
        nextStepElement.classList.add('active');
      }
    });
  });

  // Navigation: Previous Step Button handler
  document.querySelectorAll('.prev-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parentStep = btn.closest('.quiz-step');
      const currentStepNum = parseInt(parentStep.getAttribute('data-step'));
      
      // Calculate progress width
      const prevStepNum = currentStepNum - 1;
      const progressPercent = (prevStepNum - 1) * 33.33 || 33.33;
      progressBar.style.width = `${progressPercent}%`;

      // Navigate to previous DOM node step
      parentStep.classList.remove('active');
      const prevStepElement = document.querySelector(`.quiz-step[data-step="${prevStepNum}"]`);
      if (prevStepElement) {
        prevStepElement.classList.add('active');
      }
    });
  });

  // Quiz completion click handler
  const finishBtn = document.getElementById('finish-quiz-btn');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      progressBar.style.width = '100%';
      
      // Resolve recommendation logic
      let recommendedCoffeeKey = 'capuchino'; // Fallback default

      if (quizAnswers.flavor === 'dulce') {
        if (quizAnswers.temperature === 'caliente') {
          if (quizAnswers.caffeine === 'alta') {
            recommendedCoffeeKey = 'makaccino'; // Sweet, hot, energetic
          } else {
            recommendedCoffeeKey = 'capuchino'; // Sweet, hot, relaxed
          }
        } else {
          recommendedCoffeeKey = 'caramelLatte'; // Sweet, cold (iced)
        }
      } else { // Fuerte / Intenso
        if (quizAnswers.temperature === 'caliente') {
          if (quizAnswers.caffeine === 'alta') {
            recommendedCoffeeKey = 'espresso'; // Strong, hot, high energy
          } else {
            recommendedCoffeeKey = 'filtrado'; // Strong, hot, relaxed goteo
          }
        } else { // Fuerte + Frío
          recommendedCoffeeKey = 'coldbrew'; // Cold brew intense
        }
      }

      // Fetch coffee recommended data
      const recommendation = coffeeProducts[recommendedCoffeeKey];

      // Update Quiz Result DOM elements
      document.getElementById('result-visual').innerHTML = `<i class="${recommendation.visual}"></i>`;
      document.getElementById('result-name').innerText = recommendation.name;
      document.getElementById('result-desc').innerText = recommendation.desc;
      document.getElementById('result-match').innerText = recommendation.match;

      // Swap view to result page
      document.querySelector('.quiz-step[data-step="3"]').classList.remove('active');
      document.getElementById('quiz-result-step').classList.add('active');
    });
  }

  // Quiz Restart handler
  const restartBtn = document.getElementById('restart-quiz-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      // Reset State
      quizAnswers = { flavor: null, temperature: null, caffeine: null };
      progressBar.style.width = '33.33%';

      // Reset DOM options selected class and disable next step buttons
      optionCards.forEach(option => option.classList.remove('selected'));
      document.querySelectorAll('.next-step-btn').forEach(btn => btn.setAttribute('disabled', 'true'));

      // Swap view to Step 1
      document.getElementById('quiz-result-step').classList.remove('active');
      document.querySelector('.quiz-step[data-step="1"]').classList.add('active');
    });
  }

  // ==========================================
  // BOOKING / CONTACT FORM SIMULATION
  // ==========================================
  const bookingForm = document.getElementById('booking-form');
  const formAlert = document.getElementById('form-alert');

  if (bookingForm && formAlert) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve values
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const guestsInput = document.getElementById('guests');
      const messageInput = document.getElementById('message');

      // Clear active alerts
      formAlert.className = 'form-alert';
      formAlert.style.display = 'none';

      // Validation check
      if (!nameInput.value.trim() || !emailInput.value.trim()) {
        showFormAlert('error', 'Por favor, completa todos los campos requeridos con asterisco (*).');
        return;
      }

      // Simple email validation pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showFormAlert('error', 'Por favor, ingresa un correo electrónico válido.');
        return;
      }

      // Simulate API submit flow
      const submitBtn = document.getElementById('btn-submit');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Procesando Solicitud...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Mock success callback
        showFormAlert('success', `¡Gracias, ${nameInput.value}! Tu solicitud de reserva para ${guestsInput.options[guestsInput.selectedIndex].text} ha sido registrada con éxito. Nos pondremos en contacto contigo vía correo.`);
        
        // Reset form inputs
        bookingForm.reset();
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;

        // Auto-dismiss alert after 7 seconds
        setTimeout(() => {
          formAlert.className = 'form-alert';
          formAlert.style.display = 'none';
        }, 7000);

      }, 1800);
    });
  }

  function showFormAlert(type, message) {
    formAlert.textContent = message;
    formAlert.className = `form-alert ${type}`;
    formAlert.style.display = 'block';
  }

  // ==========================================
  // CUSTOM PREMIUM SMOOTH SCROLL ANIMATION
  // ==========================================
  const smoothScrollTo = (targetY, duration = 800) => {
    const startY = window.scrollY;
    const difference = targetY - startY;
    let startTime = null;

    // Easing function: easeInOutCubic (provides a premium, deceleration glide)
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startY + difference * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      // Special case for scrolling to top of page (announcement-bar or inicio)
      let targetElement = document.querySelector(targetId);
      if (targetId === '#announcement-bar') {
        targetElement = document.body;
      }
      
      if (targetElement) {
        e.preventDefault();
        
        // Get header height dynamically (accounting for responsiveness and announcements)
        const headerElement = document.getElementById('main-header');
        const headerHeight = headerElement ? headerElement.offsetHeight : 80;
        
        let targetPosition = 0;
        if (targetElement !== document.body) {
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          targetPosition = elementPosition - headerHeight;
        }
        
        // Smoothly animate scroll to the calculated position
        smoothScrollTo(targetPosition, 900); // 900ms duration for an elegant slide
        
        // Update URL hash without causing a page jump
        history.pushState(null, null, targetId);
      }
    });
  });

});

