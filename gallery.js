/* =========================
   GALLERY SYSTEM (UNCHANGED)
========================= */

document.querySelectorAll(".gallery").forEach(gallery => {

  const originalItems = Array.from(gallery.querySelectorAll(".item"));

  function layout() {

    const containerWidth = Math.floor(gallery.getBoundingClientRect().width);
    const gap = 10;

    const rowHeightFactor = parseFloat(gallery.dataset.rowHeight) || 0.18;
    const targetRowHeight = window.innerHeight * rowHeightFactor;

    let newHTML = "";
    let row = [];
    let rowAspectSum = 0;

    originalItems.forEach(item => {
      const img = item.querySelector("img");
      if (!img.naturalWidth) return;

      const aspect = img.naturalWidth / img.naturalHeight;

      row.push({ item, aspect });
      rowAspectSum += aspect;

      const gapTotal = (row.length - 1) * gap;
      const estimatedWidth = rowAspectSum * targetRowHeight + gapTotal;

      if (estimatedWidth >= containerWidth) {

        const usableWidth = containerWidth - gapTotal;
        const newHeight = usableWidth / rowAspectSum;

        newHTML += `<div class="row">`;

        row.forEach(r => {
          const width = Math.ceil(r.aspect * newHeight);

          newHTML += `
            <div class="item" style="width:${width}px">
              <div class="media" style="height:${newHeight}px">
                ${r.item.querySelector(".media").innerHTML}
              </div>
              ${r.item.querySelector(".caption").outerHTML}
            </div>
          `;
        });

        newHTML += `</div>`;

        row = [];
        rowAspectSum = 0;
      }
    });

    // LAST ROW (fill width)
    if (row.length) {

      const gapTotal = (row.length - 1) * gap;
      const usableWidth = containerWidth - gapTotal;
      const newHeight = usableWidth / rowAspectSum;

      newHTML += `<div class="row">`;

      row.forEach(r => {
        const width = Math.ceil(r.aspect * newHeight);

        newHTML += `
          <div class="item" style="width:${width}px">
            <div class="media" style="height:${newHeight}px">
              ${r.item.querySelector(".media").innerHTML}
            </div>
            ${r.item.querySelector(".caption").outerHTML}
          </div>
        `;
      });

      newHTML += `</div>`;
    }

    gallery.innerHTML = newHTML;
  }

  function waitForImagesAndLayout() {
    const images = gallery.querySelectorAll("img");
    let loaded = 0;

    images.forEach(img => {
      if (img.complete) {
        loaded++;
      } else {
        img.onload = () => {
          loaded++;
          if (loaded === images.length) layout();
        };
      }
    });

    if (loaded === images.length) layout();
  }

  window.addEventListener("load", waitForImagesAndLayout);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 120);
  });

});


/* =========================
   ABOUT SLIDESHOW (NEW)
========================= */

document.querySelectorAll(".about-slideshow").forEach(slideshow => {

  const slides = slideshow.querySelectorAll(".slide");
  let index = 0;
  let interval;

  function showNextSlide() {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }

  function start() {
    interval = setInterval(showNextSlide, 6000);
  }

  function stop() {
    clearInterval(interval);
  }

  // start autoplay
  start();

  // pause on hover
  slideshow.addEventListener("mouseenter", stop);
  slideshow.addEventListener("mouseleave", start);

  // click to advance
  slideshow.addEventListener("click", showNextSlide);

});

/* =========================
   LANGUAGE SYSTEM
========================= */

(function () {

  const path = window.location.pathname;

  // detect language from URL
  let lang = "en";
  if (path.startsWith("/sobre")) lang = "es";

  // store preference
  localStorage.setItem("lang", lang);

  // highlight active link
  document.querySelectorAll("[data-lang]").forEach(link => {
    if (link.dataset.lang === lang) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

})();

/* redirect from root based on saved language */

(function () {
  if (window.location.pathname === "/") {
    const saved = localStorage.getItem("lang");

    if (saved === "es") {
      window.location.href = "/sobre";
    } else {
      window.location.href = "/about";
    }
  }
})();
