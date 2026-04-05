document.querySelectorAll(".gallery").forEach(gallery => {

  const items = Array.from(gallery.querySelectorAll(".item"));

  function layout() {
    const containerWidth = gallery.clientWidth;

    const rowHeightFactor = parseFloat(gallery.dataset.rowHeight) || 0.12;

    // 🔴 CRITICAL FIX: clamp height HARD
    const targetRowHeight = Math.min(
      window.innerHeight * rowHeightFactor,
      300   // ← THIS fixes your issue
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
     const minItemsPerRow = 3;
      if (rowWidth >= containerWidth && row.length >= minItemsPerRow)

if (rowWidth >= containerWidth && row.length >= minItemsPerRow)

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

    // LAST ROW (not stretched)
    if (row.length) {

  const gapTotal = (row.length - 1) * 10;

  // 🔴 KEY: justify if it's the only row OR enough items
  const shouldJustify = true;

  const finalHeight = shouldJustify
    ? (containerWidth - gapTotal) / rowAspectSum
    : targetRowHeight;

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
  });
