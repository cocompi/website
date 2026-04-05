document.querySelectorAll(".gallery").forEach(gallery => {

  // 🔴 STORE ORIGINAL ITEMS (critical fix)
  const originalItems = Array.from(gallery.querySelectorAll(".item"));

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

    const minItemsPerRow = Math.min(3, originalItems.length);

    // 🔴 ALWAYS USE ORIGINAL ITEMS
    originalItems.forEach(item => {
      const img = item.querySelector("img");

      if (!img || !img.naturalWidth) return;

      const aspect = img.naturalWidth / img.naturalHeight;

      row.push({ item, aspect });
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

    // 🔴 LAST ROW (always justified like Cargo)
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

  // 🔴 WAIT FOR IMAGES (robust)
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
        img.onload = () => {
          loaded++;
          if (loaded === images.length) callback();
        };
        img.onerror = () => {
          loaded++;
          if (loaded === images.length) callback();
        };
      }
    });
  }

  window.addEventListener("load", () => {
    waitForImages(layout);
  });

  // 🔴 RESIZE (debounced + stable)
  let resizeTimeout;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      layout();
    }, 120);
  });

});
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

    // LAST ROW (always justified)
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

  // WAIT FOR IMAGES
  window.addEventListener("load", () => {
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
  });

  // RESIZE
  window.addEventListener("resize", () => {
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(layout, 100);
  });

});
