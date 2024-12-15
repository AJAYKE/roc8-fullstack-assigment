import { renderEmailList } from "./script.js";

export function initFilters(state) {
  const unreadFilterBtn = document.getElementById("unreadFilter");
  const readFilterBtn = document.getElementById("readFilter");
  const favoriteFilterBtn = document.getElementById("favoriteFilter");

  const filterButtons = [unreadFilterBtn, readFilterBtn, favoriteFilterBtn];

  function setActiveFilter(button) {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  }

  unreadFilterBtn.addEventListener("click", () => {
    setActiveFilter(unreadFilterBtn);
    state.filters = { unread: true };
    renderEmailList();
  });

  readFilterBtn.addEventListener("click", () => {
    setActiveFilter(readFilterBtn);
    state.filters = { read: true };
    renderEmailList();
  });

  favoriteFilterBtn.addEventListener("click", () => {
    setActiveFilter(favoriteFilterBtn);
    state.filters = { favorites: true };
    renderEmailList();
  });
}
