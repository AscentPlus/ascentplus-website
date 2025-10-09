// Sliding slider: every 7s, current slide moves left and next comes in from right
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  if (!slides || slides.length === 0) return;

  let current = 0;
  const total = slides.length;
  const intervalMs = 7000; // 7 seconds

  // initialize positions:
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

    // prepare next slide just off-screen to the right
    nextSlide.classList.remove("exit-left");
    nextSlide.style.transition = "none";
    nextSlide.style.transform = "translateX(100%)";

    // force reflow so transition will apply
    nextSlide.offsetHeight;

    // animate: current -> exit left, next -> active (translateX to 0)
    curSlide.classList.remove("active");
    curSlide.classList.add("exit-left");
    curSlide.style.transition = "transform 0.9s cubic-bezier(.22,.9,.31,1)";
    curSlide.style.transform = "translateX(-100%)";

    nextSlide.style.transition = "transform 0.9s cubic-bezier(.22,.9,.31,1)";
    nextSlide.style.transform = "translateX(0)";
    nextSlide.classList.add("active");

    // cleanup after transition ends
    function onTransitionEnd() {
      // remove exit-left from previous slide to keep DOM clean
      curSlide.classList.remove("exit-left");
      curSlide.removeEventListener("transitionend", onTransitionEnd);
    }
    curSlide.addEventListener("transitionend", onTransitionEnd);

    current = nextIndex;
  }

  function nextSlide() {
    const next = (current + 1) % total;
    goToSlide(next);
  }

  // initialize auto-advance
  const timer = setInterval(nextSlide, intervalMs);

  // keep manual refresh from restoring previous scroll position
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("load", () => {
    // on load, ensure top of page, and clear hash if present
    window.scrollTo(0, 0);
    if (window.location.hash) {
      // remove hash so a reload starts at top next time
      history.replaceState(null, null, window.location.pathname + window.location.search);
    }
  });
})();
// Smooth scroll without changing URL hash
document.querySelectorAll('a[data-scroll]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // stop URL from updating with #id
    const sectionId = this.getAttribute('data-scroll');
    const section = document.getElementById(sectionId);
    if (section) {
      // adjust for fixed header height (if needed, change 100 to match your header height)
      const yOffset = -100; 
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  });
});
