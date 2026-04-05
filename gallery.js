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

    // LAST ROW (force full width)
    if (row.length) {

      const gapTotal = (row.length - 1) * gap;
      const usableWidth = containerWidth - gapTotal;
      const newHeight = usableWidth / rowAspectSum;

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
