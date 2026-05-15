// ========================= Slider =========================
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  if (!slides || slides.length === 0) return;

  let current = 0;
  const total = slides.length;
  const intervalMs = 7000;

  // Build dot indicators
  const dotsContainer = document.getElementById("sliderDots");
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("slider-dot");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        clearInterval(timer);
        goToSlide(i);
        timer = setInterval(nextSlide, intervalMs);
      });
      dotsContainer.appendChild(dot);
    });
  }
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll(".slider-dot")) : [];

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  // Initialize positions
  slides.forEach((s, i) => {
    s.classList.remove("active", "exit-left");
    if (i === 0) {
      s.classList.add("active");
      s.style.transform = "translateX(0)";
    } else {
      s.style.transform = "translateX(100%)";
    }
  });

  function goToSlide(nextIndex) {
    if (nextIndex === current) return;

    const curSlide = slides[current];
    const nextSlide = slides[nextIndex];

    nextSlide.classList.remove("exit-left");
    nextSlide.style.transition = "none";
    nextSlide.style.transform = "translateX(100%)";

    // force reflow
    nextSlide.offsetHeight;

    curSlide.classList.remove("active");
    curSlide.classList.add("exit-left");
    curSlide.style.transition = "transform 0.9s cubic-bezier(.22,.9,.31,1)";
    curSlide.style.transform = "translateX(-100%)";

    nextSlide.style.transition = "transform 0.9s cubic-bezier(.22,.9,.31,1)";
    nextSlide.style.transform = "translateX(0)";
    nextSlide.classList.add("active");

    function onTransitionEnd() {
      curSlide.classList.remove("exit-left");
      curSlide.removeEventListener("transitionend", onTransitionEnd);
    }
    curSlide.addEventListener("transitionend", onTransitionEnd);

    current = nextIndex;
    updateDots();
  }

  function nextSlide() {
    const next = (current + 1) % total;
    goToSlide(next);
  }

  let timer = setInterval(nextSlide, intervalMs);

  // scroll restoration
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      history.replaceState(null, null, window.location.pathname + window.location.search);
    }
  });
})();

// ========================= Mobile Menu Cleanup & URL Masking =========================
// Close mobile menu when a link is clicked and mask URL
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }

    const nav = document.getElementById('mainNav');
    const hamburger = document.getElementById('hamburger');
    const overlay = document.querySelector('.nav-overlay');

    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (hamburger) hamburger.classList.remove('active');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      if (overlay) overlay.classList.remove('active');
    }
  });
});

// ========================= Hamburger menu =========================
(function () {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if (!hamburger || !nav) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    overlay.classList.toggle('active', isOpen);
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
})();

// ========================= Scroll reveal =========================
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();

// ========================= Header scroll effect =========================
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
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

  // Replace with your actual Google Apps Script Web App URL
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxp9nmPeyvNWl6m8Pc7MXIw-JmOXvX5IgcdxRzuDIiYMr7d17v1yr91RW-fhKM8Fro/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    message.className = 'form-message';
    message.style.display = 'none';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // If testing locally without a script URL, you can simulate a success
      if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        setTimeout(() => {
          message.textContent = 'Application submitted successfully! (Setup Google Apps Script for live data)';
          message.classList.add('success');
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Application';
        }, 1500);
        return;
      }

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
      console.error('Error:', error);
      message.textContent = 'An error occurred. Please try again later.';
      message.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });
})();

// ========================= Razorpay Standard Checkout =========================
(function () {
  var floatingBtn = document.getElementById('floatingPayBtn');
  var overlay = document.getElementById('paymentFormOverlay');
  var backdrop = document.getElementById('payFormBackdrop');
  var closeBtn = document.getElementById('payFormClose');
  var form = document.getElementById('paymentDetailsForm');
  var proceedBtn = document.getElementById('payProceedBtn');

  if (!floatingBtn || !overlay || !form) return;

  function openOverlay() {
    overlay.style.display = 'flex';
    document.body.classList.add('payment-overlay-open');
    document.getElementById('payName').focus();
  }

  function closeOverlay() {
    overlay.style.display = 'none';
    document.body.classList.remove('payment-overlay-open');
    form.reset();
    form.querySelectorAll('.input-error').forEach(function (el) {
      el.classList.remove('input-error');
    });
    proceedBtn.disabled = false;
    proceedBtn.textContent = 'Proceed to Pay';
  }

  floatingBtn.addEventListener('click', openOverlay);
  floatingBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') openOverlay();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
  if (backdrop) backdrop.addEventListener('click', closeOverlay);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.style.display !== 'none') closeOverlay();
  });

  function openRazorpayCheckout() {
    var name = document.getElementById('payName').value.trim();
    var email = document.getElementById('payEmail').value.trim();
    var phone = document.getElementById('payPhone').value.trim();
    var amountRaw = document.getElementById('payAmount').value.trim();
    var descEl = document.getElementById('payDescription');
    var description = descEl ? descEl.value.trim() : '';

    var amountPaise = Math.round(parseFloat(amountRaw) * 100);
    var options = {
      key: 'rzp_test_SKKc4fc5S9hroP',
      amount: amountPaise,
      currency: 'INR',
      name: 'Ascent Plus Business Solutions LLP',
      description: description || 'Payment to Ascent Plus',
      image: 'images/ap_logo_full.png',
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      theme: {
        color: '#0099CC'
      },
      modal: {
        ondismiss: function () {
          proceedBtn.disabled = false;
          proceedBtn.textContent = 'Proceed to Pay';
        }
      },
      handler: function (response) {
        closeOverlay();
        alert('Payment successful!\nPayment ID: ' + response.razorpay_payment_id);
      }
    };

    var rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      alert('Payment failed: ' + response.error.description);
      proceedBtn.disabled = false;
      proceedBtn.textContent = 'Proceed to Pay';
    });
    rzp.open();
  }

  function loadRazorpayThenCheckout(callback) {
    if (typeof window.Razorpay !== 'undefined') {
      callback();
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('payName').value.trim();
    var email = document.getElementById('payEmail').value.trim();
    var phone = document.getElementById('payPhone').value.trim();
    var amountRaw = document.getElementById('payAmount').value.trim();

    // Basic validation
    var valid = true;
    [document.getElementById('payName'), document.getElementById('payEmail'),
    document.getElementById('payPhone'), document.getElementById('payAmount')
    ].forEach(function (el) {
      el.classList.remove('input-error');
      if (!el.value.trim()) {
        el.classList.add('input-error');
        valid = false;
      }
    });
    if (!valid) return;

    var amountPaise = Math.round(parseFloat(amountRaw) * 100);
    if (isNaN(amountPaise) || amountPaise < 100) {
      document.getElementById('payAmount').classList.add('input-error');
      return;
    }

    proceedBtn.disabled = true;
    proceedBtn.textContent = 'Opening Payment...';

    loadRazorpayThenCheckout(openRazorpayCheckout);
  });
})();
