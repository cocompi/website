/* =========================
   LOAD REUSABLE HEADER
========================= */

fetch("/partials/header.html")
  .then(res => res.text())
  .then(data => {

    document.getElementById("site-header").innerHTML = data;

    // initialize nav AFTER loading
    initLanguageSystem();

  });

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

      const forceBreak = item.classList.contains("break");

      if (estimatedWidth >= containerWidth || forceBreak) {

        const usableWidth = containerWidth - gapTotal;
        const newHeight = usableWidth / rowAspectSum;

        newHTML += `<div class="row">`;

        row.forEach(r => {
  const width = Math.ceil(r.aspect * newHeight);

  const link = r.item.querySelector("a");
  const href = link ? link.getAttribute("href") : null;

  const content = `
    <div class="media" style="height:${newHeight}px">
      ${r.item.querySelector(".media").innerHTML}
    </div>
    ${r.item.querySelector(".caption").outerHTML}
  `;

  if (href) {
    newHTML += `
      <a href="${href}" class="item" style="width:${width}px">
        ${content}
      </a>
    `;
  } else {
    newHTML += `
      <div class="item" style="width:${width}px">
        ${content}
      </div>
    `;
  }
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

  const link = r.item.querySelector("a");
  const href = link ? link.getAttribute("href") : null;

  const content = `
    <div class="media" style="height:${newHeight}px">
      ${r.item.querySelector(".media").innerHTML}
    </div>
    ${r.item.querySelector(".caption").outerHTML}
  `;

  if (href) {
    newHTML += `
      <a href="${href}" class="item" style="width:${width}px">
        ${content}
      </a>
    `;
  } else {
    newHTML += `
      <div class="item" style="width:${width}px">
        ${content}
      </div>
    `;
  }
});

      newHTML += `</div>`;
    }

    gallery.innerHTML = newHTML;
  }

//start of change
   
  //function waitForImagesAndLayout() {
   // const images = gallery.querySelectorAll("img");
   // let loaded = 0;

   // images.forEach(img => {
   //   if (img.complete) {
   //     loaded++;
   //   } else {
   //     img.onload = () => {
   //       loaded++;
   //       if (loaded === images.length) layout();
   //     };
   //   }
   // });

    //if (loaded === images.length) layout();
  //}

function waitForImagesAndLayout() {

  const images = gallery.querySelectorAll("img");

  const promises = Array.from(images).map(img => {

    return new Promise(resolve => {

      if (img.complete && img.naturalWidth > 0) {
        resolve();
      } else {
        img.onload = resolve;
        img.onerror = resolve;
      }

    });

  });

  Promise.all(promises).then(() => {

    requestAnimationFrame(() => {
      layout();

      // reveal only AFTER layout
      gallery.classList.add("ready");
    });

  });

}
   
//end of change
   
  waitForImagesAndLayout();

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
   GLOBAL LANGUAGE SYSTEM
========================= */

function initLanguageSystem () {

  const path = window.location.pathname;

  // detect language
  let lang = "en";

  if (path.startsWith("/es")) {
    lang = "es";
  }

  // store preference
  localStorage.setItem("lang", lang);

  // ✅ highlight GLOBAL toggle
  document.querySelectorAll("[data-set-lang]").forEach(link => {
    link.classList.toggle("active", link.dataset.setLang === lang);
  });

  // ✅ highlight NAV links
  document.querySelectorAll("[data-lang]").forEach(link => {
    link.classList.toggle("active", link.dataset.lang === lang);
  });

  // =========================
  // HOME LINK (COCOMPI)
  // =========================

  const homeLink = document.getElementById("home-link");

  if (homeLink) {
    homeLink.setAttribute("href", lang === "es" ? "/es/" : "/");
  }

  // =========================
  // LANGUAGE TOGGLE CLICK
  // =========================

  document.querySelectorAll("[data-set-lang]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const targetLang = link.dataset.setLang;
      let newPath = window.location.pathname;

      // store new preference
      localStorage.setItem("lang", targetLang);

      if (targetLang === "es") {
        if (!newPath.startsWith("/es")) {
          newPath = "/es" + (newPath === "/" ? "" : newPath);
        }
      } else {
        if (newPath.startsWith("/es")) {
          newPath = newPath.replace(/^\/es/, "") || "/";
        }
      }

      window.location.href = newPath;
    });
  });

}
