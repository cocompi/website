document.querySelectorAll(".gallery").forEach(gallery => {

  // 🔴 STORE ORIGINAL ITEMS (REAL NODES, not HTML string)
  const originalItems = Array.from(gallery.children).map(item => item.cloneNode(true));

  function layout() {

    const containerWidth = gallery.clientWidth;
    const rowHeightFactor = parseFloat(gallery.dataset.rowHeight) || 0.12;

    const targetRowHeight = Math.min(
      window.innerHeight * rowHeightFactor,
      300
    );

    let newHTML = "";
    let row = [];
    let rowAspectSum = 0;

    // 🔴 adaptive (Cargo-like): no fixed min items
    originalItems.forEach(item => {
      const img = item.querySelector("img");

      if (!img || !img.naturalWidth) return;

      const aspect = img.naturalWidth / img.naturalHeight;

      row.push({ item, aspect });
      rowAspectSum += aspect;

      const gapTotal = (row.length - 1) * 10;
      const rowWidth = rowAspectSum * targetRowHeight + gapTotal;

      // 🔴 KEY: no minItemsPerRow restriction
      if (rowWidth >= containerWidth) {

        const newHeight = (containerWidth - gapTotal) / rowAspectSum;

        newHTML += `<div class="row">`;

        row.forEach(r => {
          const width = r.aspect * newHeight;

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

    // 🔴 LAST ROW (DO NOT FORCE JUSTIFY → more Cargo-like)
    if (row.length) {

      const gapTotal = (row.length - 1) * 10;

      newHTML += `<div class="row">`;

      row.forEach(r => {
        const width = r.aspect * targetRowHeight;

        newHTML += `
          <div class="item" style="width:${width}px">
            <div class="media" style="height:${targetRowHeight}px">
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

  // 🔴 WAIT FOR IMAGES (robust + simple)
  function waitForImages(callback) {
    const images = gallery.querySelectorAll("img");
    let loaded = 0;

    if (!images.length) {
      callback();
      return;
    }

    images.forEach(img => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) callback();
      } else {
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === images.length) callback();
        };
      }
    });
  }

  // 🔴 INITIAL LOAD (delayed → fixes first-row bug)
  window.addEventListener("load", () => {
    setTimeout(() => {
      waitForImages(layout);
    }, 60);
  });

  // 🔴 RESIZE (THIS is what you were missing)
  let resizeTimeout;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      layout();
    }, 120);
  });

});      row.push({ item, aspect });
      rowAspectSum += aspect;

      const gapTotal = (row.length - 1) * 10;
      const rowWidth = rowAspectSum * targetRowHeight + gapTotal;

      if (rowWidth >= containerWidth && row.length >= minItemsPerRow) {

        const newHeight = (containerWidth - gapTotal) / rowAspectSum;

        newHTML += `<div class="row">`;

        row.forEach(r => {
          const width = r.aspect * newHeight;

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

    // LAST ROW (justified)
    if (row.length) {
      const gapTotal = (row.length - 1) * 10;
      const finalHeight = (containerWidth - gapTotal) / rowAspectSum;

      newHTML += `<div class="row">`;

      row.forEach(r => {
        const width = r.aspect * finalHeight;

        newHTML += `
          <div class="item" style="width:${width}px">
            <div class="media" style="height:${finalHeight}px">
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

  // 🔴 WAIT FOR IMAGES (CRITICAL)
  function waitForImages(callback) {
    const images = gallery.querySelectorAll("img");
    let loaded = 0;

    if (images.length === 0) {
      callback();
      return;
    }

    images.forEach(img => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) callback();
      } else {
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === images.length) callback();
        };
      }
    });
  }

  // INITIAL LOAD
  window.addEventListener("load", () => {
    setTimeout(() => waitForImages(layout), 50);
  });

  // 🔴 RESIZE FIX (key)
  let resizeTimeout;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      layout();
    }, 120);
  });

});
