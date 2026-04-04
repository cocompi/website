document.querySelectorAll(".gallery").forEach(gallery => {

  const items = Array.from(gallery.querySelectorAll(".item"));

  function layout() {
    const containerWidth = gallery.clientWidth;

    const rowHeightFactor = parseFloat(gallery.dataset.rowHeight) || 0.12;
    const targetRowHeight = window.innerHeight * rowHeightFactor;

    let newHTML = "";
    let row = [];
    let rowAspectSum = 0;

    items.forEach((item, index) => {
      const img = item.querySelector("img");

      const aspect = img.naturalWidth / img.naturalHeight;

      row.push({ item, aspect });
      rowAspectSum += aspect;

      const rowWidth = rowAspectSum * targetRowHeight;

      if (rowWidth >= containerWidth) {
        const newHeight = containerWidth / rowAspectSum;

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

    // LAST ROW (no stretch)
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

});      });

      gallery.appendChild(rowDiv);

      row = [];
      rowAspectSum = 0;
    }
  });

  // last row (not stretched)
  if (row.length) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";

    row.forEach(r => {
      const el = r.item;

      el.style.width = (r.aspect * targetRowHeight) + "px";
      el.style.height = targetRowHeight + "px";

      rowDiv.appendChild(el);
    });

    gallery.appendChild(rowDiv);
  }
}

/* EVENTS */
window.addEventListener("load", layoutGallery);
window.addEventListener("resize", () => {
  clearTimeout(window._galleryResize);
  window._galleryResize = setTimeout(layoutGallery, 100);
});
