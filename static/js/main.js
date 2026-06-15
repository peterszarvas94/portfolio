document.addEventListener("DOMContentLoaded", () => {
  /* --- typing effect --- */
  const els = Array.from(document.querySelectorAll(".home-header h1 > div"));
  if (els.length) {
    const texts = els.map(el => el.textContent);
    for (const el of els) el.textContent = "";
    const cursor = document.createElement("span");
    cursor.textContent = "_";
    cursor.style.setProperty("color", "var(--muted)");
    cursor.style.setProperty("-webkit-text-fill-color", "var(--muted)");
    els[0].appendChild(cursor);
    let elIdx = 0;
    let charIdx = 0;
    const reveal = () => {
      if (elIdx >= els.length) {
        cursor.className = "typing-cursor";
        return;
      }
      const el = els[elIdx];
      const text = texts[elIdx];
      cursor.remove();
      el.textContent = text.slice(0, charIdx + 1);
      el.appendChild(cursor);
      charIdx++;
      if (charIdx >= text.length) {
        elIdx++;
        charIdx = 0;
        if (elIdx < els.length) els[elIdx].appendChild(cursor);
      }
      setTimeout(reveal, 40 + Math.random() * 30);
    };
    reveal();
  }

  /* --- jump-up button --- */
  const jumpUp = document.getElementById("home-jump-up");
  if (jumpUp) {
    let jumpUpVisible = false;
    const toggleJumpUp = () => {
      const show = window.scrollY > 200;
      if (show !== jumpUpVisible) {
        jumpUpVisible = show;
        jumpUp.style.display = show ? "" : "none";
      }
    };
    window.addEventListener("scroll", toggleJumpUp, { passive: true });
    toggleJumpUp();
  }
});

/* --- carousel --- */
window.scrollCarouselFromButton = (button, direction) => {
  const figure = button.closest("figure");
  const carousel = figure?.querySelector(".carousel-wrap");
  const items = carousel?.querySelectorAll(".carousel-slide");
  if (!carousel || !items || items.length === 0) return;
  const itemWidth = items[0].offsetWidth;
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;
  if (direction > 0 && carousel.scrollLeft >= maxScroll - 10) {
    carousel.scrollTo({ left: 0, behavior: "smooth" });
    return;
  }
  if (direction < 0 && carousel.scrollLeft <= 10) {
    carousel.scrollTo({ left: maxScroll, behavior: "smooth" });
    return;
  }
  carousel.scrollBy({ left: direction * itemWidth, behavior: "smooth" });
};
