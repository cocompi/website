const gallery = document.getElementById("gallery");
const items = Array.from(gallery.querySelectorAll(".item"));

const targetRowHeight = 220; // tweak this (Cargo ≈ 12%)

function layoutGallery() {
  gallery.innerHTML = "";

  let row = [];
  let rowWidth = 0;

  items.forEach(item => {
    const img = item.querySelector("img");

    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const width = aspectRatio * targetRowHeight;

    row.push({ item, aspectRatio });
    rowWidth += width;

    const galleryWidth = gallery.clientWidth;

    if (rowWidth >= galleryWidth) {
      const rowHeight = galleryWidth / row.reduce((sum, r) => sum + r.aspectRatio, 0);

      const rowDiv = document.createElement("div");
      rowDiv.className = "row";

      row.forEach(r => {
        const div = r.item;
        div.style.height = rowHeight + "px";
        div.style.flex = "0 0 auto";   // prevent flex distortion

        rowDiv.appendChild(div);
      });

      gallery.appendChild(rowDiv);

      row = [];
      rowWidth = 0;
    }
  });

  // leftover row
  if (row.length) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";

    row.forEach(r => {
      const div = r.item;
      div.style.height = rowHeight + "px";
      div.style.flex = "0 0 auto";   // prevent flex distortion

      rowDiv.appendChild(div);
    });

    gallery.appendChild(rowDiv);
  }
}

/* Wait for images */
window.addEventListener("load", layoutGallery);
window.addEventListener("resize", layoutGallery);
