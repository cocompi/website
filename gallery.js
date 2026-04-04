document.querySelectorAll(".gallery").forEach(gallery => {

  const items = Array.from(gallery.querySelectorAll(".item"));

  function layout() {
    const containerWidth = gallery.clientWidth;

    const rowHeightFactor = parseFloat(gallery.dataset.rowHeight) || 0.12;

    // 🔴 CRITICAL FIX: clamp height HARD
    const targetRowHeight = Math.min(
      window.innerHeight * rowHeightFactor,
      160   // ← THIS fixes your issue
    );

    let newHTML = "";
    let row = [];
    let rowAspectSum = 0;

    items.forEach((item, index) => {
      const img = item.querySelector("img");

      if (!img.naturalWidth) return; // safety

      const aspect = img.naturalWidth / img.naturalHeight;

      row.push({ item, aspect });
      rowAspectSum += aspect;

      const gapTotal = (row.length - 1) * 10;
      const rowWidth = rowAspectSum * targetRowHeight + gapTotal;

      // 🔴 CRITICAL FIX: require at least 2 items
      if (rowWidth >= containerWidth && row.length > 1) {

        const newHeight = (containerWidth - gapTotal) / rowAspectSum;

        newHTML += `<div class="row">`;

        row.forEach(r => {
          const width = r.aspect * newHeight;

          newHTML += `
            <div class="item" style="width:${width}px;height:${newHeight}px">
              ${r.item.innerHTML}
            </div>
          `;
        });

        newHTML += `</div>`;

        row = [];
        rowAspectSum = 0;
      }
    });

    // LAST ROW (not stretched)
    if (row.length) {
      newHTML += `<div class="row">`;

      row.forEach(r => {
        const width = r.aspect * targetRowHeight;

        newHTML += `
          <div class="item" style="width:${width}px;height:${targetRowHeight}px">
            ${r.item.innerHTML}
          </div>
        `;
      });

      newHTML += `</div>`;
    }

    gallery.innerHTML = newHTML;
  }

  window.addEventListener("load", layout);
  window.addEventListener("resize", () => {
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(layout, 100);
  });

});
