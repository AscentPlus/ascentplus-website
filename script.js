// ========================= Slider =========================
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  const intervalMs = 7000;

  const dotsContainer = document.getElementById('sliderDots');
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        clearInterval(timer);
        goToSlide(i);
        timer = setInterval(nextSlide, intervalMs);
      });
      dotsContainer.appendChild(dot);
    });
  }
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.slider-dot')) : [];

  function updateDots() {
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  slides.forEach(function (s, i) {
    s.classList.remove('active', 'exit-left');
    if (i === 0) {
      s.classList.add('active');
      s.style.transform = 'translateX(0)';
    } else {
      s.style.transform = 'translateX(100%)';
    }
  });

  function goToSlide(nextIndex) {
    if (nextIndex === current) return;

    const curSlide = slides[current];
    const nextSlideEl = slides[nextIndex];

    nextSlideEl.classList.remove('exit-left');
    nextSlideEl.style.transition = 'none';
    nextSlideEl.style.transform = 'translateX(100%)';

    nextSlideEl.offsetHeight;

    curSlide.classList.remove('active');
    curSlide.classList.add('exit-left');
    curSlide.style.transition = 'transform 0.9s cubic-bezier(.22,.9,.31,1)';
    curSlide.style.transform = 'translateX(-100%)';

    nextSlideEl.style.transition = 'transform 0.9s cubic-bezier(.22,.9,.31,1)';
    nextSlideEl.style.transform = 'translateX(0)';
    nextSlideEl.classList.add('active');

    function onTransitionEnd() {
      curSlide.classList.remove('exit-left');
      curSlide.removeEventListener('transitionend', onTransitionEnd);
    }
    curSlide.addEventListener('transitionend', onTransitionEnd);

    current = nextIndex;
    updateDots();
  }

  function nextSlide() {
    goToSlide((current + 1) % total);
  }

  let timer = setInterval(nextSlide, intervalMs);

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.addEventListener('load', function () {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });
})();

// ========================= Mobile Menu Cleanup & Safe Hash Navigation =========================
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    // Only allow safe fragment identifiers (prevents querySelector injection)
    if (!targetId || !/^#[A-Za-z][\w-]*$/.test(targetId)) return;

    const targetElement = document.getElementById(targetId.slice(1));
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }

    const nav = document.getElementById('mainNav');
    const hamburger = document.getElementById('hamburger');
    const overlay = document.querySelector('.nav-overlay');

    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      if (overlay) overlay.classList.remove('active');
    }
  });
});

// ========================= Hamburger menu =========================
(function () {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if (!hamburger || !nav) return;

  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    overlay.classList.toggle('active', isOpen);
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
})();

// ========================= Scroll reveal =========================
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();

// ========================= Header scroll effect =========================
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

// ========================= Internship Form Submission =========================
(function () {
  const form = document.getElementById('internshipForm');
  const message = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !message || !submitBtn) return;

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxp9nmPeyvNWl6m8Pc7MXIw-JmOXvX5IgcdxRzuDIiYMr7d17v1yr91RW-fhKM8Fro/exec';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    message.className = 'form-message';
    message.textContent = '';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        message.textContent = 'Application submitted successfully!';
        message.classList.add('success');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      message.textContent = 'An error occurred. Please try again later.';
      message.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });
})();

// ========================= Language Toggle & Transliteration =========================
(function () {
  const btnEN = document.getElementById('btnEN');
  const btnML = document.getElementById('btnML');
  const targetIds = ['name', 'place', 'college', 'course'];

  let currentLang = 'en';

  if (!btnEN || !btnML) return;

  async function handleTransliteration(e) {
    if (currentLang !== 'ml') return;

    if (e.data === ' ' || e.inputType === 'insertLineBreak') {
      const el = e.target;
      const text = el.value;

      const words = text.split(/(?=\s+)|(?<=\s+)/);
      if (words.length < 2) return;

      let wordToTransliterateIndex = words.length - 1;
      while (wordToTransliterateIndex >= 0 && words[wordToTransliterateIndex].trim() === '') {
        wordToTransliterateIndex--;
      }

      if (wordToTransliterateIndex < 0) return;
      const word = words[wordToTransliterateIndex];

      if (!/^[a-zA-Z]+$/.test(word)) return;

      try {
        const apiUrl = 'https://inputtools.google.com/request?text=' +
          encodeURIComponent(word) +
          '&itc=ml-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test';
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data[0] === 'SUCCESS' && data[1][0] && data[1][0][1] && data[1][0][1].length > 0) {
          const transliteratedWord = data[1][0][1][0];
          words[wordToTransliterateIndex] = transliteratedWord;

          const cursorPos = el.selectionStart;
          el.value = words.join('');

          const diff = transliteratedWord.length - word.length;
          el.setSelectionRange(cursorPos + diff, cursorPos + diff);
        }
      } catch (err) {
        // Silently fail transliteration; keep typed English text
      }
    }
  }

  targetIds.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', handleTransliteration);
    }
  });

  btnEN.addEventListener('click', function () {
    if (currentLang === 'en') return;
    currentLang = 'en';
    btnEN.classList.add('active');
    btnML.classList.remove('active');
    btnEN.setAttribute('aria-pressed', 'true');
    btnML.setAttribute('aria-pressed', 'false');
  });

  btnML.addEventListener('click', function () {
    if (currentLang === 'ml') return;
    currentLang = 'ml';
    btnML.classList.add('active');
    btnEN.classList.remove('active');
    btnML.setAttribute('aria-pressed', 'true');
    btnEN.setAttribute('aria-pressed', 'false');
  });
})();
