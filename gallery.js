const gallery = document.getElementById("gallery");
const items = Array.from(gallery.querySelectorAll(".item"));

const targetRowHeight = 220; // adjust

function layoutGallery() {
  const containerWidth = gallery.clientWidth;

  let row = [];
  let rowAspectSum = 0;

  gallery.innerHTML = "";

  items.forEach((item, index) => {
    const img = item.querySelector("img");

    const aspect = img.naturalWidth / img.naturalHeight;

    row.push({ item, aspect });
    rowAspectSum += aspect;

    const rowWidth = rowAspectSum * targetRowHeight;

    if (rowWidth >= containerWidth) {
      const newHeight = containerWidth / rowAspectSum;

      const rowDiv = document.createElement("div");
      rowDiv.className = "row";

      row.forEach(r => {
        const el = r.item;

        el.style.width = (r.aspect * newHeight) + "px";
        el.style.height = newHeight + "px";

        rowDiv.appendChild(el);
      });

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
